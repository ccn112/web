/**
 * Lead consultation orchestration — the layer the `/api/lead/*` routes are thin
 * wrappers over. Two live channels feed ONE conversation:
 *
 *   web chat  →  runWebChatTurn()   (SSE, device-scoped session)
 *   email     →  handleInboundEmail() (provider webhook → same thread)
 *
 * Every turn does the same four things: append the customer message, generate a
 * consultative reply, extract the qualification slots, then advance the state
 * machine — and when it reaches HUMAN_READY, hand off to a real consultant.
 */

import type { Payload } from 'payload'
import type { Lead, LeadConversation, LeadMessage } from '../../payload-types'
import type { ChatMsg } from '../chat/providers'
import { getPayloadClient } from '../payload-client'
import {
  type Analysis,
  analyzeTurn,
  complete,
  fallbackSummary,
  replySystemPrompt,
  toProviderMessages,
} from './ai'
import { sendLeadEmail } from './email/send'
import {
  inboundBodyText,
  isAutomated,
  isUnsubscribeRequest,
  parseInbound,
} from './inbound'
import {
  activeConversationForDevice,
  appendMessage,
  createAssignment,
  createConversation,
  deviceMayAccess,
  existingAssignment,
  findOrCreateLead,
  getConversation,
  getConversationByPublicId,
  getDevice,
  getLead,
  issueResumeToken,
  linkDeviceToConversation,
  listMessages,
  logActivity,
  noteChannel,
  pickConsultant,
  refId,
  revokeTokensForConversation,
  saveQualification,
  touchDevice,
  trustDevice,
  updateConversation,
  updateTokenRecord,
  findTokenRecord,
  type LeadIntake,
} from './store'
import {
  advance,
  aiMayDrive,
  type Collected,
  type HandoffReason,
  isHumanOwned,
  type HandoffSignals,
  keywordSignals,
  type LeadState,
  mergeCollected,
  missingSlots,
  nextQuestion,
} from './state-machine'
import {
  generateOtp,
  maskEmail,
  otpMatches,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  parseConversationFromAddress,
  verifyToken,
} from './tokens'

export type LeadError = { error: string; status: number; code?: string }
const err = (error: string, status: number, code?: string): LeadError => ({ error, status, code })

const MAX_MESSAGE_CHARS = 4000
const MAX_HISTORY = 20

/* --------------------------------------------------------- rate limiting */

const hits = new Map<string, number[]>()
function rateLimited(key: string, perMinute = Number(process.env.LEAD_RATE_LIMIT_PER_MINUTE ?? '12')): boolean {
  const now = Date.now()
  const arr = (hits.get(key) ?? []).filter((t) => t > now - 60_000)
  if (arr.length >= perMinute) {
    hits.set(key, arr)
    return true
  }
  arr.push(now)
  hits.set(key, arr)
  return false
}

/* ------------------------------------------------------------ shared turn */

export type TurnOutcome = {
  reply: string
  status: LeadState
  score: number
  missing: string[]
  handoff: boolean
  handoffReason: HandoffReason | null
}

/**
 * Decide the handoff signals for a turn.
 *
 * The analyzer is the judge: it reads the whole merged transcript and can tell
 * "we have 200 nhân viên" (an answer to our own `userScale` question) apart from
 * "cho tôi gặp nhân viên" (an actual request). `keywordSignals` cannot — it is a
 * substring match, and OR-ing it onto a good verdict means a bare noun silently
 * overrules the model and short circuits qualification on turn one.
 *
 * So the keyword net only speaks in degraded mode — when the provider errored or
 * returned unparseable JSON and we have no verdict at all. There it is strictly
 * better than nothing: an explicit ask still reaches a human.
 */
function resolveSignals(analysis: Analysis, userText: string): HandoffSignals {
  return analysis.ok ? analysis.signals : keywordSignals(userText)
}

/** Build the provider message list for a conversation, ending with `userText`. */
async function buildMessages(
  payload: Payload,
  conversationId: string,
  userText: string,
): Promise<{ messages: ChatMsg[]; history: LeadMessage[] }> {
  const history = await listMessages(payload, conversationId, 120)
  const prior = toProviderMessages(
    history.map((m) => ({ role: m.role, channel: m.channel, contentText: m.contentText })),
    MAX_HISTORY,
  )
  // Drop a trailing user turn (the one we just stored) so it isn't duplicated.
  while (prior.length && prior[prior.length - 1]!.role === 'user') prior.pop()
  return { messages: [...prior, { role: 'user', content: userText }], history }
}

/**
 * Analyse the turn, advance the state machine and persist. Shared by both
 * channels so web chat and email can never drift apart.
 */
async function analyzeAndAdvance(
  payload: Payload,
  opts: {
    conversation: LeadConversation
    messages: ChatMsg[]
    assistantReply: string
    userText: string
  },
): Promise<{ conversation: LeadConversation; outcome: Omit<TurnOutcome, 'reply'> }> {
  const { conversation, messages, assistantReply, userText } = opts
  const prevCollected = (conversation.collected ?? {}) as Collected

  const analysis = await analyzeTurn({
    transcript: [...messages, { role: 'assistant', content: assistantReply }],
    collected: prevCollected,
  })
  const collected = mergeCollected(prevCollected, analysis.collected)
  const signals = resolveSignals(analysis, userText)

  const next = advance({
    current: (conversation.status ?? 'NEW') as LeadState,
    collected,
    signals,
    turnCount: conversation.turnCount ?? 0,
  })

  const summary =
    analysis.summary || fallbackSummary(collected, missingSlots(collected))

  const updated = await saveQualification(payload, conversation, {
    collected,
    status: next.status,
    summary,
    recommendation: analysis.recommendation || undefined,
    handoffReason: next.handoffReason,
    incrementTurn: true,
  })

  return {
    conversation: updated,
    outcome: {
      status: next.status,
      score: next.score,
      missing: next.missing,
      handoff: next.status === 'HUMAN_READY',
      handoffReason: next.handoffReason,
    },
  }
}

/* ---------------------------------------------------------------- intake */

export type IntakeInput = LeadIntake & {
  deviceId?: string
  /** Free-text the visitor typed on the form — becomes the first customer turn. */
  message?: string
  /** Raw form answers, kept for the audit trail. */
  formPayload?: Record<string, unknown>
}

export type IntakeResult = {
  conversationPublicId: string
  resumeUrl: string
  status: LeadState
  score: number
}

/**
 * A visitor left their details (website form or chat registration): create/merge
 * the lead, open a conversation, and send the acknowledgement email that starts
 * the automated qualification loop.
 */
export async function intake(input: IntakeInput): Promise<IntakeResult | LeadError> {
  const payload = await getPayloadClient()
  const email = (input.email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Email không hợp lệ.', 400)
  if (rateLimited(`intake:${input.deviceId ?? email}`, 6)) {
    return err('Bạn đang gửi quá nhanh, vui lòng thử lại sau.', 429)
  }

  const lead = await findOrCreateLead(payload, { ...input, email })

  // Reuse an open conversation for this lead instead of fragmenting the history.
  const existing = await payload.find({
    collection: 'lead-conversations',
    where: { lead: { equals: lead.id } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
  })
  const reusable = existing.docs[0]
  const conversation =
    reusable && aiMayDrive((reusable.status ?? 'NEW') as LeadState)
      ? reusable
      : await createConversation(payload, {
          leadId: lead.id,
          siteCode: input.siteCode,
          channel: input.deviceId ? 'web-chat' : 'email',
          deviceId: input.deviceId,
        })

  if (input.deviceId) {
    await linkDeviceToConversation(payload, conversation, input.deviceId)
    // The originating device may continue its own thread without an OTP.
    if (!conversation.originDeviceId) {
      await updateConversation(payload, conversation.id, { originDeviceId: input.deviceId })
    }
  }

  await logActivity(payload, {
    type: 'intake',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: input.deviceId ? 'web-chat' : 'email',
    actor: 'customer',
    summary: `Nhận yêu cầu tư vấn từ ${input.formCode ?? input.source ?? 'website'}`,
    detail: { formPayload: input.formPayload ?? null, siteCode: input.siteCode ?? null },
  })

  // The visitor's own words are the first turn of the consultation.
  const firstMessage = (input.message ?? '').trim().slice(0, MAX_MESSAGE_CHARS)
  let collected = (conversation.collected ?? {}) as Collected
  let status = (conversation.status ?? 'NEW') as LeadState

  if (firstMessage) {
    await appendMessage(payload, {
      conversationId: conversation.id,
      channel: input.deviceId ? 'web-chat' : 'email',
      direction: 'inbound',
      role: 'user',
      contentText: firstMessage,
      deviceId: input.deviceId,
      meta: { origin: 'form', formCode: input.formCode ?? null },
    })
    const analysis = await analyzeTurn({
      transcript: [{ role: 'user', content: firstMessage }],
      collected,
    })
    collected = mergeCollected(collected, analysis.collected)
    const next = advance({
      current: status,
      collected,
      signals: resolveSignals(analysis, firstMessage),
      turnCount: 0,
    })
    status = next.status
    await saveQualification(payload, conversation, {
      collected,
      status,
      summary: analysis.summary || fallbackSummary(collected, missingSlots(collected)),
      recommendation: analysis.recommendation || undefined,
      handoffReason: next.handoffReason,
      incrementTurn: true,
    })
  }

  const fresh = (await getConversation(payload, conversation.id)) ?? conversation
  const issued = await issueResumeToken(payload, {
    conversation: fresh,
    leadId: lead.id,
    deviceId: input.deviceId,
  })

  // A form arriving already qualified (or asking for a call) skips straight to a human.
  if (status === 'HUMAN_READY') {
    await triggerHandoff(payload, {
      conversation: fresh,
      lead,
      reason: (fresh.handoffReason as HandoffReason | null) ?? 'requested_call_demo_quote',
      resumeUrl: issued.url,
    })
  } else {
    await sendLeadEmail(payload, {
      templateKey: 'lead_received',
      lead,
      conversation: fresh,
      resumeUrl: issued.url,
    })
    await updateConversation(payload, fresh.id, { status: 'WAITING_CUSTOMER' })
    await noteChannel(payload, fresh, 'email')

    // Second touch, on a delay: if the visitor stays quiet the AI comes back
    // once with something useful (see `followUpOnSilence`). Queued rather than
    // sent now so a consultant can get there first and so the follow-up does
    // not land seconds after the acknowledgement. 0 minutes disables it.
    const delay = followupDelayMinutes()
    if (delay > 0) {
      await payload.jobs
        .queue({
          task: 'leadFollowup',
          input: { conversationId: fresh.id, expectedTurnCount: fresh.turnCount ?? 0 },
          waitUntil: new Date(Date.now() + delay * 60_000),
        })
        .catch((e: unknown) => {
          // The lead is already saved and acknowledged — never fail intake for this.
          payload.logger.error({ err: e, conversationId: fresh.id }, 'intake: queue leadFollowup failed')
        })
    }
  }

  return {
    conversationPublicId: fresh.publicId,
    resumeUrl: issued.url,
    status,
    score: fresh.score ?? 0,
  }
}

/* --------------------------------------------------- delayed follow-up */

/** Minutes between the instant acknowledgement and the AI's first real nudge. */
export function followupDelayMinutes(): number {
  const n = Number(process.env.LEAD_FOLLOWUP_DELAY_MINUTES ?? '30')
  return Number.isFinite(n) && n >= 0 ? n : 30
}

/**
 * Score at/above which a *silent* lead is handed to a consultant instead of
 * getting another AI email. Deliberately lower than `LEAD_HANDOFF_SCORE`: a form
 * detailed enough to score this high but with nobody replying is worth a phone
 * call, not more automated questions.
 */
function followupHandoffScore(): number {
  const n = Number(process.env.LEAD_FOLLOWUP_HANDOFF_SCORE ?? '40')
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : 40
}

/** Activity type that marks a conversation as already nudged (idempotency key). */
const FOLLOWUP_ACTIVITY = 'followup_sent'

export type FollowupResult = {
  action: 'skipped' | 'replied' | 'handoff' | 'error'
  reason?: string
  status?: LeadState
  score?: number
}

/**
 * The delayed second touch on a lead that has gone quiet since the form.
 *
 * `intake()` sends `lead_received` immediately and queues this (see
 * `jobs/leadFollowup.ts`). By the time it runs, one of three things is true:
 *
 *  - the visitor already came back (web chat or email reply) → nothing to do,
 *    the normal turn flow is driving the conversation;
 *  - a consultant took over → the AI stays out of it;
 *  - silence → we either escalate a valuable lead to a human, or send one
 *    useful email that asks the single highest-weight missing slot.
 *
 * Unlike a normal turn there is no new customer message, so this does *not*
 * re-run the analyzer or bump `turnCount` — it reuses the qualification already
 * computed at intake and costs exactly one AI call.
 */
export async function followUpOnSilence(input: {
  conversationId: string
  /** Customer turns at queue time; a higher count now means they replied. */
  expectedTurnCount?: number
}): Promise<FollowupResult> {
  const payload = await getPayloadClient()
  const conversation = await getConversation(payload, input.conversationId)
  if (!conversation) return { action: 'skipped', reason: 'not_found' }

  const status = (conversation.status ?? 'NEW') as LeadState
  if (conversation.aiPaused === true || !aiMayDrive(status)) {
    return { action: 'skipped', reason: 'ai_not_driving', status }
  }

  // The visitor answered on their own — the live flow already replied to them.
  const turnCount = conversation.turnCount ?? 0
  if (input.expectedTurnCount !== undefined && turnCount > input.expectedTurnCount) {
    return { action: 'skipped', reason: 'customer_replied', status }
  }

  // Idempotency: one automated nudge per conversation, ever.
  const nudged = await payload
    .find({
      collection: 'lead-activities',
      where: {
        conversation: { equals: conversation.id },
        type: { equals: FOLLOWUP_ACTIVITY },
      },
      limit: 1,
      depth: 0,
    })
    .catch(() => null)
  if (nudged?.docs?.length) return { action: 'skipped', reason: 'already_sent', status }

  const lead = await getLead(payload, refId(conversation.lead))
  if (!lead) return { action: 'skipped', reason: 'lead_missing' }
  if (lead.unsubscribed) return { action: 'skipped', reason: 'unsubscribed' }

  const collected = (conversation.collected ?? {}) as Collected
  const score = conversation.score ?? 0

  // A well-filled form that went silent is a call, not another email.
  if (score >= followupHandoffScore()) {
    await logActivity(payload, {
      type: FOLLOWUP_ACTIVITY,
      leadId: lead.id,
      conversationId: conversation.id,
      channel: 'system',
      actor: 'system',
      summary: `Lead im lặng ${followupDelayMinutes()} phút, điểm ${score} → chuyển chuyên gia`,
      detail: { score, threshold: followupHandoffScore(), turnCount },
    })
    await triggerHandoff(payload, {
      conversation,
      lead,
      reason: 'score_threshold',
    })
    return { action: 'handoff', reason: 'silent_high_score', status: 'HUMAN_READY', score }
  }

  // Otherwise: one email that gives something back and asks the biggest gap.
  const gap = nextQuestion(collected)
  const nudgeBrief = [
    'BỐI CẢNH ĐẶC BIỆT CỦA LƯỢT NÀY:',
    `- Khách đã để lại thông tin qua form khoảng ${followupDelayMinutes()} phút trước và CHƯA phản hồi lại.`,
    '- Đây là email chủ động của XTECH, không phải trả lời một câu hỏi mới. Đừng nói "cảm ơn bạn đã phản hồi".',
    '- Hãy mở đầu bằng một nhận định/gợi ý CÓ GIÁ TRỊ dựa trên đúng những gì đã biết, rồi mới hỏi.',
    gap
      ? `- Kết thúc bằng ĐÚNG MỘT câu hỏi về: ${gap.label}.`
      : '- Hồ sơ đã khá đầy đủ: xác nhận lại hiểu biết và mời khách chốt bước tiếp theo (khảo sát / demo).',
  ].join('\n')

  const { messages } = await buildMessages(payload, conversation.id, nudgeBrief)
  let reply: string
  try {
    const completion = await complete({
      system: replySystemPrompt({
        channel: 'email',
        collected,
        status,
        customerName: lead.fullName ?? undefined,
        companyName: lead.company ?? undefined,
      }),
      messages,
      maxTokens: 1100,
    })
    reply = completion.text
  } catch (e) {
    payload.logger.error({ err: e, conversationId: conversation.id }, 'followUpOnSilence: AI failed')
    return { action: 'error', reason: 'ai_failed', status }
  }
  if (!reply) return { action: 'error', reason: 'empty_reply', status }

  // No new customer input, so the state machine only reflects what we now send.
  const nextStatus: LeadState = gap ? 'NEED_MORE_INFORMATION' : 'AI_RECOMMENDATION_SENT'
  await updateConversation(payload, conversation.id, { status: nextStatus })
  const staged = (await getConversation(payload, conversation.id)) ?? conversation

  const sent = await sendLeadEmail(payload, {
    templateKey: gap ? 'qualification_question' : 'ai_recommendation',
    lead,
    conversation: staged,
    aiReply: reply,
  })
  const skipReason = sent.sent ? undefined : sent.reason

  await logActivity(payload, {
    type: FOLLOWUP_ACTIVITY,
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'email',
    actor: 'ai',
    summary: sent.sent
      ? `Email chủ động sau ${followupDelayMinutes()} phút im lặng`
      : `Email chủ động bị chặn (${skipReason})`,
    detail: { score, askedSlot: gap?.key ?? null, sent: sent.sent, reason: skipReason ?? null },
  })

  // The ball is back with the customer.
  await updateConversation(payload, conversation.id, { status: 'WAITING_CUSTOMER' })

  return {
    action: sent.sent ? 'replied' : 'skipped',
    reason: skipReason,
    status: nextStatus,
    score,
  }
}

/* ------------------------------------------------------------- web chat */

export type WebChatInput = {
  deviceId: string
  conversationPublicId?: string
  message: string
  siteCode?: string
}

export type WebChatSetup = {
  payload: Payload
  lead: Lead
  conversation: LeadConversation
  messages: ChatMsg[]
  system: string
  handoffImminent: boolean
}

/**
 * Resolve + authorise a web-chat turn. The session is scoped by `deviceId`: the
 * device must either have created the conversation or have been verified by OTP.
 */
export async function prepareWebChatTurn(input: WebChatInput): Promise<WebChatSetup | LeadError> {
  const payload = await getPayloadClient()
  const deviceId = (input.deviceId ?? '').trim()
  const message = (input.message ?? '').trim()
  if (!deviceId) return err('Thiếu deviceId cho phiên tư vấn.', 400, 'no_device')
  if (!message) return err('Tin nhắn trống.', 400)
  if (message.length > MAX_MESSAGE_CHARS) return err('Tin nhắn quá dài.', 413)
  if (rateLimited(`chat:${deviceId}`)) {
    return err('Bạn đang gửi quá nhanh, vui lòng chờ một chút.', 429)
  }

  await touchDevice(payload, deviceId, { siteCode: input.siteCode })
  const device = await getDevice(payload, deviceId)

  let conversation: LeadConversation | null = null
  if (input.conversationPublicId) {
    conversation = await getConversationByPublicId(payload, input.conversationPublicId)
    if (!conversation) return err('Không tìm thấy hội thoại.', 404, 'not_found')
    if (!deviceMayAccess(conversation, device)) {
      return err(
        'Thiết bị này chưa được xác minh cho hội thoại tư vấn. Vui lòng mở lại từ liên kết trong email.',
        403,
        'verification_required',
      )
    }
  } else {
    const active = await activeConversationForDevice(payload, deviceId)
    if (!active) {
      return err(
        'Chưa có phiên tư vấn nào trên thiết bị này. Vui lòng để lại thông tin để bắt đầu.',
        404,
        'intake_required',
      )
    }
    conversation = active.conversation
  }

  const lead = await getLead(payload, refId(conversation.lead))
  if (!lead) return err('Không tìm thấy hồ sơ lead.', 404)
  if (conversation.status === 'UNSUBSCRIBED') {
    return err('Hội thoại đã được đóng theo yêu cầu của bạn.', 403, 'closed')
  }

  await noteChannel(payload, conversation, 'web-chat')
  await linkDeviceToConversation(payload, conversation, deviceId)

  await appendMessage(payload, {
    conversationId: conversation.id,
    channel: 'web-chat',
    direction: 'inbound',
    role: 'user',
    contentText: message,
    deviceId,
  })

  const { messages } = await buildMessages(payload, conversation.id, message)
  const collected = (conversation.collected ?? {}) as Collected
  const status = (conversation.status ?? 'NEW') as LeadState

  // Once a human owns the thread the AI stops driving: it acknowledges and waits.
  const aiPaused = conversation.aiPaused === true || isHumanOwned(status)
  const handoffImminent = aiPaused

  const system = aiPaused
    ? `${replySystemPrompt({
        channel: 'web-chat',
        collected,
        status,
        customerName: lead.fullName ?? undefined,
        companyName: lead.company ?? undefined,
        handoffImminent: true,
        handoffReason: conversation.handoffReason ?? null,
      })}\n\nLƯU Ý ĐẶC BIỆT: một chuyên gia XTECH đã tiếp nhận hội thoại này. KHÔNG hỏi thêm câu khai thác. Hãy ghi nhận nội dung khách vừa gửi, khẳng định chuyên gia sẽ phản hồi trực tiếp, và cho biết tin nhắn này đã được chuyển tới chuyên gia.`
    : replySystemPrompt({
        channel: 'web-chat',
        collected,
        status,
        customerName: lead.fullName ?? undefined,
        companyName: lead.company ?? undefined,
      })

  return { payload, lead, conversation, messages, system, handoffImminent }
}

/** Finish a web-chat turn once the reply has been streamed to the browser. */
export async function completeWebChatTurn(opts: {
  setup: WebChatSetup
  assistantReply: string
  userText: string
}): Promise<Omit<TurnOutcome, 'reply'>> {
  const { setup, assistantReply, userText } = opts
  const { payload, conversation, lead, messages } = setup

  await appendMessage(payload, {
    conversationId: conversation.id,
    channel: 'web-chat',
    direction: 'outbound',
    role: 'assistant',
    contentText: assistantReply,
  })
  await logActivity(payload, {
    type: 'ai_reply',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'web-chat',
    actor: 'ai',
    summary: assistantReply.slice(0, 200),
  })

  // A human already owns this thread: don't let the AI move the state machine.
  if (setup.handoffImminent) {
    return {
      status: (conversation.status ?? 'NEW') as LeadState,
      score: conversation.score ?? 0,
      missing: (conversation.missingFields as string[] | null) ?? [],
      handoff: true,
      handoffReason: (conversation.handoffReason as HandoffReason | null) ?? null,
    }
  }

  const { conversation: updated, outcome } = await analyzeAndAdvance(payload, {
    conversation,
    messages,
    assistantReply,
    userText,
  })

  if (outcome.handoff) {
    await triggerHandoff(payload, {
      conversation: updated,
      lead,
      reason: outcome.handoffReason ?? 'score_threshold',
    })
  }
  return outcome
}

/* ------------------------------------------------------------- inbound email */

export type InboundResult =
  | { handled: true; action: 'replied' | 'queued_for_human' | 'unsubscribed' }
  | { handled: false; reason: string }

/**
 * A customer answered one of our emails. Route it back into the same
 * conversation, let the AI continue from the merged history, and reply by email.
 */
export async function handleInboundEmail(body: unknown): Promise<InboundResult> {
  const payload = await getPayloadClient()
  const email = parseInbound(body)
  if (!email) return { handled: false, reason: 'unparseable_payload' }

  const publicId = parseConversationFromAddress(email.to)
  if (!publicId) return { handled: false, reason: 'no_conversation_in_recipient' }

  const conversation = await getConversationByPublicId(payload, publicId)
  if (!conversation) return { handled: false, reason: 'unknown_conversation' }
  const lead = await getLead(payload, refId(conversation.lead))
  if (!lead) return { handled: false, reason: 'unknown_lead' }

  // Guard 1 — never answer an auto-responder / bounce / list message.
  if (isAutomated(email)) {
    await logActivity(payload, {
      type: 'email_ignored',
      leadId: lead.id,
      conversationId: conversation.id,
      channel: 'email',
      summary: 'Bỏ qua auto-reply / bounce',
      detail: { from: email.from, subject: email.subject },
    })
    return { handled: false, reason: 'automated_message' }
  }

  // Guard 2 — sender must be the lead. A stranger replying gets logged, not served:
  // returning history to an unverified address would leak the conversation.
  if (email.from !== (lead.email ?? '').toLowerCase()) {
    await logActivity(payload, {
      type: 'email_sender_mismatch',
      leadId: lead.id,
      conversationId: conversation.id,
      channel: 'email',
      summary: `Người gửi ${email.from} không khớp lead ${maskEmail(lead.email)}`,
      detail: { subject: email.subject },
    })
    return { handled: false, reason: 'sender_mismatch' }
  }

  const text = inboundBodyText(email)
  if (!text) return { handled: false, reason: 'empty_body' }

  // Guard 3 — de-duplicate on Message-ID (webhooks retry).
  const stored = await appendMessage(payload, {
    conversationId: conversation.id,
    channel: 'email',
    direction: 'inbound',
    role: 'user',
    contentText: text.slice(0, MAX_MESSAGE_CHARS),
    contentHtml: email.html,
    emailMessageId: email.messageId,
    emailInReplyTo: email.inReplyTo,
    emailSubject: email.subject,
    emailFrom: email.from,
  })
  if (!stored) return { handled: false, reason: 'duplicate_message_id' }

  await noteChannel(payload, conversation, 'email')
  await logActivity(payload, {
    type: 'email_received',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'email',
    actor: 'customer',
    summary: email.subject.slice(0, 200),
  })

  // Explicit opt-out wins over everything else.
  if (isUnsubscribeRequest(email, text)) {
    await applyUnsubscribe(payload, lead.id, conversation.id)
    return { handled: true, action: 'unsubscribed' }
  }

  // Guard 4 — rate limit per conversation (a misconfigured client can loop).
  if (rateLimited(`inbound:${conversation.publicId}`, Number(process.env.LEAD_INBOUND_LIMIT_PER_MINUTE ?? '4'))) {
    return { handled: false, reason: 'rate_limited' }
  }

  const status = (conversation.status ?? 'NEW') as LeadState
  // Human owns the thread → file the message and alert the consultant, no AI reply.
  if (conversation.aiPaused === true || isHumanOwned(status)) {
    await notifyConsultantOfReply(payload, { lead, conversation, text })
    return { handled: true, action: 'queued_for_human' }
  }

  const { messages } = await buildMessages(payload, conversation.id, text)
  const collected = (conversation.collected ?? {}) as Collected
  const reply = await complete({
    system: replySystemPrompt({
      channel: 'email',
      collected,
      status,
      customerName: lead.fullName ?? undefined,
      companyName: lead.company ?? undefined,
    }),
    messages,
    maxTokens: 1100,
  })

  const { conversation: updated, outcome } = await analyzeAndAdvance(payload, {
    conversation,
    messages,
    assistantReply: reply.text,
    userText: text,
  })

  if (outcome.handoff) {
    await triggerHandoff(payload, {
      conversation: updated,
      lead,
      reason: outcome.handoffReason ?? 'score_threshold',
      aiReply: reply.text,
    })
    return { handled: true, action: 'queued_for_human' }
  }

  const templateKey =
    outcome.status === 'AI_RECOMMENDATION_SENT' ? 'ai_recommendation' : 'qualification_question'
  await sendLeadEmail(payload, {
    templateKey,
    lead,
    conversation: updated,
    aiReply: reply.text,
  })
  // We answered; the ball is back with the customer.
  await updateConversation(payload, updated.id, { status: 'WAITING_CUSTOMER' })

  return { handled: true, action: 'replied' }
}

/** Ping the assigned consultant when a customer replies on a human-owned thread. */
async function notifyConsultantOfReply(
  payload: Payload,
  opts: { lead: Lead; conversation: LeadConversation; text: string },
): Promise<void> {
  const { lead, conversation, text } = opts
  const assignment = await existingAssignment(payload, conversation.id)
  const consultantId = assignment?.consultant ? refId(assignment.consultant) : null
  let to: string | null = null
  let name: string | undefined
  if (consultantId) {
    const c = await payload
      .findByID({ collection: 'consultants', id: consultantId, depth: 0 })
      .catch(() => null)
    to = c?.email ?? null
    name = c?.name ?? undefined
  }
  await sendLeadEmail(payload, {
    templateKey: 'human_ready_internal',
    lead,
    conversation,
    to: to ?? undefined,
    consultantName: name,
    handoffReason: (conversation.handoffReason as HandoffReason | null) ?? 'manual',
    aiReply: `Khách vừa phản hồi: “${text.slice(0, 600)}”`,
  })
}

/* ---------------------------------------------------------------- handoff */

/**
 * HUMAN_READY: email the brief to a consultant, record the assignment, and tell
 * the customer a real expert is taking over. Idempotent — a second call on the
 * same conversation does not re-notify.
 */
export async function triggerHandoff(
  payload: Payload,
  opts: {
    conversation: LeadConversation
    lead: Lead
    reason: HandoffReason
    /** The AI's closing message, if this handoff came out of a turn. */
    aiReply?: string
    resumeUrl?: string
    /** Skip the idempotency check (manual re-escalation from admin). */
    force?: boolean
  },
): Promise<{ ok: boolean; assignmentId?: string; notified: boolean }> {
  const { conversation, lead, reason } = opts

  if (!opts.force) {
    const already = await existingAssignment(payload, conversation.id)
    if (already) return { ok: true, assignmentId: already.id, notified: false }
  }

  const consultant = await pickConsultant(payload, conversation.siteCode)
  const assignment = await createAssignment(payload, {
    leadId: lead.id,
    conversationId: conversation.id,
    consultantId: consultant?.id,
    handoffReason: reason,
    score: conversation.score ?? 0,
    aiSummary: conversation.qualificationSummary ?? undefined,
  })

  await updateConversation(payload, conversation.id, {
    status: 'HUMAN_READY',
    handoffReason: reason,
    handoffAt: new Date().toISOString(),
    // The AI stops driving qualification from here on.
    aiPaused: true,
  })
  await payload
    .update({
      collection: 'leads',
      id: lead.id,
      data: {
        status: 'HUMAN_READY',
        ...(consultant ? { assignedConsultant: consultant.id } : {}),
      },
      depth: 0,
    })
    .catch(() => null)

  const fresh = (await getConversation(payload, conversation.id)) ?? conversation

  // 1. Internal: the important email that puts a human in the room.
  const internal = await sendLeadEmail(payload, {
    templateKey: 'human_ready_internal',
    lead,
    conversation: fresh,
    to: consultant?.email,
    consultantName: consultant?.name,
    handoffReason: reason,
  })
  if (internal.sent) {
    await payload
      .update({
        collection: 'consultant-assignments',
        id: assignment.id,
        data: { notifiedAt: new Date().toISOString() },
        depth: 0,
      })
      .catch(() => null)
  }

  // 2. Customer: "đang chuyển tới chuyên gia XTECH".
  await sendLeadEmail(payload, {
    templateKey: 'human_ready_customer',
    lead,
    conversation: fresh,
    aiReply: opts.aiReply,
    resumeUrl: opts.resumeUrl,
    handoffReason: reason,
  })

  await logActivity(payload, {
    type: 'handoff',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'consultant',
    actor: 'system',
    summary: `HUMAN_READY — ${reason}`,
    detail: { consultant: consultant?.email ?? null, notified: internal.sent, score: conversation.score },
  })

  return { ok: true, assignmentId: assignment.id, notified: internal.sent }
}

/** Manual escalation from a route/admin action. */
export async function handoffByPublicId(
  publicId: string,
  reason: HandoffReason = 'manual',
): Promise<{ ok: boolean } | LeadError> {
  const payload = await getPayloadClient()
  const conversation = await getConversationByPublicId(payload, publicId)
  if (!conversation) return err('Không tìm thấy hội thoại.', 404)
  const lead = await getLead(payload, refId(conversation.lead))
  if (!lead) return err('Không tìm thấy lead.', 404)
  const res = await triggerHandoff(payload, { conversation, lead, reason, force: true })
  return { ok: res.ok }
}

/* ------------------------------------------------------- session & resume */

export type SessionMessage = {
  role: 'user' | 'assistant' | 'consultant' | 'system'
  channel: string
  content: string
  at: string
}

export type SessionView = {
  conversationPublicId: string
  status: LeadState
  score: number
  missing: string[]
  summary: string
  handoff: boolean
  aiPaused: boolean
  channels: string[]
  customerName?: string
  companyName?: string
  messages: SessionMessage[]
}

function toSessionView(
  conversation: LeadConversation,
  lead: Lead,
  messages: LeadMessage[],
): SessionView {
  return {
    conversationPublicId: conversation.publicId,
    status: (conversation.status ?? 'NEW') as LeadState,
    score: conversation.score ?? 0,
    missing: (conversation.missingFields as string[] | null) ?? [],
    summary: conversation.qualificationSummary ?? '',
    handoff: isHumanOwned((conversation.status ?? 'NEW') as LeadState),
    aiPaused: conversation.aiPaused === true,
    channels: (conversation.channels ?? []) as string[],
    customerName: lead.fullName ?? undefined,
    companyName: lead.company ?? undefined,
    messages: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role,
        channel: m.channel,
        content: m.contentText,
        at: m.createdAt ?? '',
      })),
  }
}

/** Web-chat bootstrap: what this device is allowed to see. */
export async function getSession(deviceId: string): Promise<SessionView | null> {
  const payload = await getPayloadClient()
  const id = (deviceId ?? '').trim()
  if (!id) return null
  const active = await activeConversationForDevice(payload, id)
  if (!active) return null
  await touchDevice(payload, id)
  const messages = await listMessages(payload, active.conversation.id)
  return toSessionView(active.conversation, active.lead, messages)
}

export type ResumeResult =
  | { ok: true; session: SessionView }
  | { ok: false; needsVerification: true; maskedEmail: string; conversationPublicId: string }
  | LeadError

/**
 * Open an email resume link (`/tu-van/tiep-tuc?t=…`).
 *  - signature + TTL + revocation checked server-side;
 *  - same device as the link was minted for (or an already-verified device) → history;
 *  - anything else → OTP to the lead's email first.
 */
export async function resumeFromToken(input: {
  token: string
  deviceId: string
}): Promise<ResumeResult> {
  const payload = await getPayloadClient()
  const token = (input.token ?? '').trim()
  const deviceId = (input.deviceId ?? '').trim()
  if (!token) return err('Thiếu token.', 400)
  if (!deviceId) return err('Thiếu deviceId.', 400)
  if (rateLimited(`resume:${deviceId}`, 20)) return err('Vui lòng thử lại sau.', 429)

  const verified = verifyToken(token)
  if (!verified.ok) {
    const msg =
      verified.reason === 'expired'
        ? 'Liên kết đã hết hạn. Chúng tôi sẽ gửi mã xác minh để mở lại hội thoại.'
        : 'Liên kết không hợp lệ.'
    return err(msg, 400, verified.reason === 'expired' ? 'expired' : 'invalid_token')
  }

  const record = await findTokenRecord(payload, token)
  if (!record) return err('Liên kết không hợp lệ.', 400, 'invalid_token')
  if (record.revoked) return err('Liên kết đã bị thu hồi.', 403, 'revoked')

  const conversation = await getConversationByPublicId(payload, verified.payload.c)
  if (!conversation) return err('Không tìm thấy hội thoại.', 404)
  const lead = await getLead(payload, verified.payload.l)
  if (!lead) return err('Không tìm thấy hồ sơ.', 404)

  await touchDevice(payload, deviceId, { siteCode: conversation.siteCode ?? undefined })
  const device = await getDevice(payload, deviceId)

  const sameDevice = !!record.expectedDeviceId && record.expectedDeviceId === deviceId
  const allowed = sameDevice || deviceMayAccess(conversation, device)

  if (!allowed) {
    await logActivity(payload, {
      type: 'resume_needs_verification',
      leadId: lead.id,
      conversationId: conversation.id,
      channel: 'web-chat',
      summary: 'Thiết bị mới mở link — yêu cầu xác minh email',
      detail: { deviceId },
    })
    return {
      ok: false,
      needsVerification: true,
      maskedEmail: maskEmail(lead.email),
      conversationPublicId: conversation.publicId,
    }
  }

  await linkDeviceToConversation(payload, conversation, deviceId)
  if (!record.usedAt) {
    await updateTokenRecord(payload, record.id, { usedAt: new Date().toISOString() })
  }
  await logActivity(payload, {
    type: 'resume_opened',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'web-chat',
    actor: 'customer',
    summary: sameDevice ? 'Mở lại trên thiết bị gốc' : 'Mở lại trên thiết bị đã xác minh',
  })

  const messages = await listMessages(payload, conversation.id)
  return { ok: true, session: toSessionView(conversation, lead, messages) }
}

/* ----------------------------------------------------- device verification */

/** Email a one-time code so a new device can be trusted with the history. */
export async function requestDeviceVerification(input: {
  token: string
  deviceId: string
}): Promise<{ ok: true; maskedEmail: string } | LeadError> {
  const payload = await getPayloadClient()
  const token = (input.token ?? '').trim()
  const deviceId = (input.deviceId ?? '').trim()
  if (!token || !deviceId) return err('Thiếu tham số.', 400)
  if (rateLimited(`otp-send:${deviceId}`, 3)) {
    return err('Bạn đã yêu cầu mã quá nhiều lần. Vui lòng thử lại sau ít phút.', 429)
  }

  // An expired signature still identifies the conversation; we simply require the
  // OTP before issuing a fresh link (docs/REDIRECT_AND_DEEP_LINK_FLOW.md §6).
  const record = await findTokenRecord(payload, token)
  if (!record || record.revoked) return err('Liên kết không hợp lệ.', 400, 'invalid_token')

  const conversation = record.conversation
    ? await getConversation(payload, refId(record.conversation))
    : null
  const lead = record.lead ? await getLead(payload, refId(record.lead)) : null
  if (!conversation || !lead) return err('Không tìm thấy hội thoại.', 404)
  if (lead.unsubscribed) return err('Hồ sơ đã hủy nhận email.', 403, 'unsubscribed')

  const { code, hash } = generateOtp()
  await updateTokenRecord(payload, record.id, {
    otpHash: hash,
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000).toISOString(),
    otpAttempts: 0,
    pendingDeviceId: deviceId,
  })

  const sent = await sendLeadEmail(payload, {
    templateKey: 'device_verification',
    lead,
    conversation,
    otpCode: code,
  })
  if (!sent.sent) return err('Không gửi được mã xác minh. Vui lòng thử lại.', 502)

  await logActivity(payload, {
    type: 'otp_sent',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'email',
    summary: `Gửi mã xác minh tới ${maskEmail(lead.email)}`,
    detail: { deviceId },
  })
  return { ok: true, maskedEmail: maskEmail(lead.email) }
}

/** Confirm the OTP → trust the device → return the history. */
export async function confirmDeviceVerification(input: {
  token: string
  deviceId: string
  code: string
}): Promise<{ ok: true; session: SessionView; resumeUrl: string } | LeadError> {
  const payload = await getPayloadClient()
  const token = (input.token ?? '').trim()
  const deviceId = (input.deviceId ?? '').trim()
  const code = (input.code ?? '').trim()
  if (!token || !deviceId || !code) return err('Thiếu tham số.', 400)
  if (rateLimited(`otp-check:${deviceId}`, 10)) return err('Vui lòng thử lại sau.', 429)

  const record = await findTokenRecord(payload, token)
  if (!record || record.revoked) return err('Liên kết không hợp lệ.', 400, 'invalid_token')
  if (!record.otpHash || !record.otpExpiresAt) return err('Chưa có mã xác minh.', 400, 'no_otp')
  if (Date.parse(record.otpExpiresAt) < Date.now()) {
    return err('Mã xác minh đã hết hạn. Vui lòng yêu cầu mã mới.', 400, 'otp_expired')
  }
  if ((record.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS) {
    return err('Nhập sai quá số lần cho phép. Vui lòng yêu cầu mã mới.', 429, 'otp_locked')
  }
  if (record.pendingDeviceId && record.pendingDeviceId !== deviceId) {
    return err('Mã xác minh không dành cho thiết bị này.', 403, 'device_mismatch')
  }

  if (!otpMatches(code, record.otpHash)) {
    await updateTokenRecord(payload, record.id, { otpAttempts: (record.otpAttempts ?? 0) + 1 })
    return err('Mã xác minh không đúng.', 400, 'otp_invalid')
  }

  const conversation = record.conversation
    ? await getConversation(payload, refId(record.conversation))
    : null
  const lead = record.lead ? await getLead(payload, refId(record.lead)) : null
  if (!conversation || !lead) return err('Không tìm thấy hội thoại.', 404)

  await trustDevice(payload, deviceId, lead.id)
  await linkDeviceToConversation(payload, conversation, deviceId)
  await payload
    .update({
      collection: 'leads',
      id: lead.id,
      data: { emailVerifiedAt: new Date().toISOString() },
      depth: 0,
    })
    .catch(() => null)

  // Burn the OTP and the link that carried it, then issue a fresh device-bound one.
  await updateTokenRecord(payload, record.id, {
    otpHash: null,
    otpExpiresAt: null,
    pendingDeviceId: null,
    usedAt: new Date().toISOString(),
    revoked: true,
  })
  const issued = await issueResumeToken(payload, {
    conversation,
    leadId: lead.id,
    deviceId,
  })

  await logActivity(payload, {
    type: 'device_verified',
    leadId: lead.id,
    conversationId: conversation.id,
    channel: 'web-chat',
    actor: 'customer',
    summary: 'Thiết bị mới đã xác minh email thành công',
    detail: { deviceId },
  })

  const messages = await listMessages(payload, conversation.id)
  return {
    ok: true,
    session: toSessionView(conversation, lead, messages),
    resumeUrl: issued.url,
  }
}

/* ------------------------------------------------------------ unsubscribe */

async function applyUnsubscribe(
  payload: Payload,
  leadId: string,
  conversationId: string,
): Promise<void> {
  await payload
    .update({ collection: 'leads', id: leadId, data: { unsubscribed: true, status: 'UNSUBSCRIBED' }, depth: 0 })
    .catch(() => null)
  await updateConversation(payload, conversationId, { status: 'UNSUBSCRIBED', aiPaused: true })
  await revokeTokensForConversation(payload, conversationId)
  await logActivity(payload, {
    type: 'unsubscribed',
    leadId,
    conversationId,
    channel: 'email',
    actor: 'customer',
    summary: 'Khách yêu cầu dừng nhận email tư vấn',
  })
}

/** One-click unsubscribe from the email footer / List-Unsubscribe header. */
export async function unsubscribeByToken(token: string): Promise<{ ok: true } | LeadError> {
  const payload = await getPayloadClient()
  const t = (token ?? '').trim()
  if (!t) return err('Thiếu token.', 400)
  const record = await findTokenRecord(payload, t)
  if (!record || !record.lead || !record.conversation) return err('Liên kết không hợp lệ.', 400)
  await applyUnsubscribe(payload, refId(record.lead), refId(record.conversation))
  return { ok: true }
}
