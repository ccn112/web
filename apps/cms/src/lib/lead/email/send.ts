/**
 * Outbound transactional email for the lead pipeline.
 *
 * Responsibilities:
 *  - resolve a template (CMS `email-templates` → built-in default);
 *  - build the variable + HTML-block context from lead/conversation state;
 *  - enforce the anti-loop budget on automated customer mail;
 *  - thread correctly (Reply-To routes the answer back into the conversation,
 *    In-Reply-To/References keep the customer's mail client thread intact);
 *  - record the send as an outbound `lead-messages` row + a `lead-activities` entry.
 */

import type { Payload } from 'payload'
import type { EmailTemplate, Lead, LeadConversation } from '../../../payload-types'
import {
  briefLines,
  handoffReasonLabel,
  type Collected,
  missingSlots,
  nextQuestion,
  scoreOf,
  slotLabel,
} from '../state-machine'
import {
  logActivity,
  appendMessage,
  refId,
  slaHours,
  updateConversation,
  issueResumeToken,
} from '../store'
import { maskEmail, replyToAddress, siteOrigin, OTP_TTL_MINUTES } from '../tokens'
import { callout, escapeHtml, factTable, note, p, ul } from './layout'
import { renderTemplate, type Blocks, type Vars } from './render'
import { asLeadState, BUILTIN_BY_KEY, type EmailTemplateDef, type TemplateKey } from './templates'

/* --------------------------------------------------------- template lookup */

let seeded = false

/**
 * Upsert the built-in templates once per process — missing keys only, so admin
 * edits are never overwritten. Called lazily from the send path so a fresh
 * install works without a manual seed step.
 */
export async function ensureEmailTemplates(payload: Payload): Promise<void> {
  if (seeded) return
  seeded = true
  try {
    const existing = await payload.find({ collection: 'email-templates', limit: 200, depth: 0 })
    const have = new Set(existing.docs.map((d) => d.templateKey))
    for (const t of BUILTIN_BY_KEY.values()) {
      if (have.has(t.templateKey)) continue
      await payload
        .create({
          collection: 'email-templates',
          depth: 0,
          data: {
            templateKey: t.templateKey,
            name: t.name,
            audience: t.audience,
            triggerStatus: t.triggerStatus ?? null,
            subject: t.subject,
            preheader: t.preheader,
            heading: t.heading,
            htmlBody: t.htmlBody,
            textBody: t.textBody,
            ctaLabel: t.ctaLabel ?? null,
            ctaUrlVar: t.ctaUrlVar ?? null,
            active: true,
            version: 1,
          },
        })
        .catch(() => null)
    }
  } catch {
    /* templates fall back to the built-ins */
  }
}

/** CMS template if present & active, else the shipped default. */
export async function resolveTemplate(
  payload: Payload,
  key: TemplateKey,
): Promise<EmailTemplateDef> {
  const builtin = BUILTIN_BY_KEY.get(key)
  if (!builtin) throw new Error(`Unknown email template: ${key}`)
  await ensureEmailTemplates(payload)
  try {
    const found = await payload.find({
      collection: 'email-templates',
      where: { and: [{ templateKey: { equals: key } }, { active: { equals: true } }] },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0] as EmailTemplate | undefined
    if (!doc) return builtin
    return {
      ...builtin,
      name: doc.name,
      audience: doc.audience,
      triggerStatus: asLeadState(doc.triggerStatus ?? undefined) ?? builtin.triggerStatus,
      subject: doc.subject || builtin.subject,
      preheader: doc.preheader || builtin.preheader,
      heading: doc.heading || builtin.heading,
      htmlBody: doc.htmlBody || builtin.htmlBody,
      textBody: doc.textBody || builtin.textBody,
      ctaLabel: doc.ctaLabel ?? builtin.ctaLabel,
      ctaUrlVar: doc.ctaUrlVar ?? builtin.ctaUrlVar,
    }
  } catch {
    return builtin
  }
}

/* ------------------------------------------------------- anti-loop budget */

const maxAutoEmails = (): number => {
  const n = Number(process.env.LEAD_MAX_AUTO_EMAILS ?? '10')
  return Number.isFinite(n) && n > 0 ? n : 10
}
const minIntervalMs = (): number => {
  const n = Number(process.env.LEAD_EMAIL_MIN_INTERVAL_MINUTES ?? '3')
  return (Number.isFinite(n) && n >= 0 ? n : 3) * 60_000
}

/**
 * Templates that must always go out (security / escalation), budget or not.
 *
 * `human_ready_customer` belongs here even though it is a customer mail: it fires
 * at most once per conversation (`triggerHandoff` is idempotent) and it is the
 * only thing that tells the customer a real person has taken over. Leaving it
 * subject to the min-interval throttle silently dropped it on the *most common*
 * path — form → chat → immediate handoff, all inside the throttle window — so the
 * customer got an acknowledgement and then nothing.
 */
const ALWAYS_SEND: ReadonlySet<TemplateKey> = new Set([
  'device_verification',
  'human_ready_internal',
  'human_ready_customer',
])

export type SendSkip = { sent: false; reason: 'unsubscribed' | 'budget' | 'throttled' | 'no_recipient' | 'error' }
export type SendOk = { sent: true; subject: string; messageId?: string }
export type SendResult = SendOk | SendSkip

/* ---------------------------------------------------------------- context */

export type SendContext = {
  templateKey: TemplateKey
  lead: Lead
  conversation: LeadConversation
  /** Override recipient (consultant mail). Defaults to the lead's email. */
  to?: string
  /** The AI's message for this turn (customer templates). */
  aiReply?: string
  /** OTP for device verification. */
  otpCode?: string
  handoffReason?: string | null
  consultantName?: string
  /** Reuse an already-minted resume link instead of issuing another. */
  resumeUrl?: string
  /**
   * Skip writing this send into the transcript — for callers that already stored
   * the message (e.g. the consultant relay, where the text exists on the
   * `consultant` channel and must not be duplicated as an `email` row).
   */
  skipTranscript?: boolean
}

const shortText = (s: string | null | undefined, n = 70): string => {
  const t = (s ?? '').replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`
}

/** Turn `aiReply` (plain text with blank-line paragraphs) into email HTML. */
function replyToHtml(reply: string): string {
  const paras = reply
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
  return paras
    .map((para) => {
      const lines = para.split('\n').map((l) => l.trim())
      const bullets = lines.filter((l) => /^[-*•]\s+/.test(l))
      if (bullets.length === lines.length && bullets.length > 0) {
        return ul(bullets.map((b) => escapeHtml(b.replace(/^[-*•]\s+/, ''))))
      }
      return p(escapeHtml(para).replace(/\n/g, '<br />'))
    })
    .join('')
}

function buildVarsAndBlocks(
  ctx: SendContext,
  extras: { resumeUrl: string; unsubscribeUrl: string; adminUrl: string },
): { vars: Vars; blocks: Blocks } {
  const { lead, conversation } = ctx
  const collected = (conversation.collected ?? {}) as Collected
  const brief = briefLines(collected)
  const missing = missingSlots(collected)
  const score = scoreOf(collected)
  const sla = slaHours()
  const slaDue = new Date(Date.now() + sla * 3600_000)
  const customerName = lead.fullName?.trim() || 'anh/chị'
  const companyName = lead.company?.trim() || 'doanh nghiệp của anh/chị'
  const primaryNeed = collected.primaryNeed ?? lead.primaryNeed ?? ''

  const vars: Vars = {
    customer_name: customerName,
    customer_email: lead.email,
    customer_phone: lead.phone ?? '',
    company_name: companyName,
    company_suffix: lead.company?.trim() ? ` cho ${lead.company.trim()}` : '',
    job_title: lead.jobTitle ?? '',
    primary_need: primaryNeed,
    primary_need_short: shortText(primaryNeed) || 'nhu cầu chuyển đổi số',
    lead_score: String(score),
    lead_status: conversation.status ?? 'NEW',
    handoff_reason: handoffReasonLabel(ctx.handoffReason ?? conversation.handoffReason ?? 'manual'),
    sla_hours: String(sla),
    sla_due: slaDue.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    consultant_name: ctx.consultantName ?? 'đội tư vấn XTECH',
    conversation_public_id: conversation.publicId,
    resume_url: extras.resumeUrl,
    unsubscribe_url: extras.unsubscribeUrl,
    admin_conversation_url: extras.adminUrl,
    otp_code: ctx.otpCode ?? '',
    otp_ttl: String(OTP_TTL_MINUTES),
    masked_email: maskEmail(lead.email),
  }

  const aiReply = (ctx.aiReply ?? '').trim()
  const gap = nextQuestion(collected)

  const blocks: Blocks = {}
  const set = (key: string, html: string, text: string) => {
    blocks[`${key}_block`] = html
    blocks[`${key}_text`] = text
  }

  set(
    'ai_reply',
    aiReply ? replyToHtml(aiReply) : '',
    aiReply,
  )

  set(
    'brief',
    factTable(brief),
    brief.map((b) => `- ${b.label}: ${b.value}`).join('\n') || '(chưa có)',
  )

  set(
    'summary',
    conversation.qualificationSummary
      ? callout(`<strong>Nhu cầu chúng tôi đã ghi nhận:</strong><br />${escapeHtml(conversation.qualificationSummary)}`)
      : brief.length
        ? factTable(brief)
        : '',
    conversation.qualificationSummary ?? brief.map((b) => `- ${b.label}: ${b.value}`).join('\n'),
  )

  set(
    'next_question',
    gap && !aiReply ? callout(`<strong>${escapeHtml(gap.label)}</strong><br />${escapeHtml(gap.question)}`) : '',
    gap && !aiReply ? `${gap.label}: ${gap.question}` : '',
  )

  set(
    'progress',
    missing.length
      ? note(
          `Hồ sơ tư vấn của anh/chị đã hoàn thiện <strong>${score}%</strong>. Còn ${missing.length} điểm cần làm rõ trước khi chuyên gia XTECH đề xuất phạm vi.`,
        )
      : '',
    missing.length ? `Hồ sơ đã hoàn thiện ${score}%. Còn thiếu: ${missing.map(slotLabel).join(', ')}.` : '',
  )

  set(
    'missing',
    missing.length
      ? `${'{{label:Thông tin còn thiếu}}'}${ul(missing.map((m) => escapeHtml(slotLabel(m))))}`
      : '',
    missing.length ? missing.map(slotLabel).join(', ') : '(đã đủ)',
  )

  set(
    'otp',
    ctx.otpCode
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 22px;"><tr><td align="center" style="border:1px solid #E4E8F0;border-radius:12px;background:#F1F6FE;padding:22px 16px;" class="x-panel">
           <div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:34px;font-weight:700;letter-spacing:.28em;color:#0B1533;">${escapeHtml(ctx.otpCode)}</div>
         </td></tr></table>`
      : '',
    ctx.otpCode ?? '',
  )

  const reasonLabel = vars.handoff_reason
  set(
    'sla',
    callout(
      `<strong>Lý do chuyển:</strong> ${escapeHtml(reasonLabel!)}<br /><strong>SLA phản hồi:</strong> trong ${sla} giờ làm việc — trước ${escapeHtml(vars.sla_due!)}`,
      'urgent',
    ),
    `Lý do chuyển: ${reasonLabel}\nSLA phản hồi: trong ${sla} giờ (trước ${vars.sla_due}).`,
  )

  const contactRows = [
    { label: 'Họ tên', value: lead.fullName || '(chưa cung cấp)' },
    { label: 'Chức danh', value: lead.jobTitle || '—' },
    { label: 'Doanh nghiệp', value: lead.company || '—' },
    { label: 'Email', value: lead.email },
    { label: 'Điện thoại', value: lead.phone || '—' },
    { label: 'Nguồn', value: `${lead.source ?? 'web-form'}${lead.formCode ? ` · ${lead.formCode}` : ''}` },
    { label: 'Kênh đã dùng', value: ((conversation.channels ?? []) as string[]).join(', ') || 'web-chat' },
  ]
  set(
    'contact',
    factTable(contactRows),
    contactRows.map((r) => `- ${r.label}: ${r.value}`).join('\n'),
  )

  const aiSummary = conversation.qualificationSummary?.trim() || ''
  const recommendation = conversation.recommendation?.trim() || ''
  set(
    'ai_summary',
    [aiSummary ? p(escapeHtml(aiSummary)) : '', recommendation ? callout(`<strong>AI đề xuất:</strong> ${escapeHtml(recommendation)}`) : ''].join(''),
    [aiSummary, recommendation ? `AI đề xuất: ${recommendation}` : ''].filter(Boolean).join('\n\n'),
  )

  const actions = [
    `Đọc brief phía trên trước khi gọi — <strong>không hỏi lại</strong> những gì khách đã trả lời.`,
    missing.length
      ? `Làm rõ trong buổi trao đổi: ${escapeHtml(missing.map(slotLabel).join(', '))}.`
      : `Hồ sơ đã đủ 10 nhóm thông tin — đi thẳng vào phạm vi và bước tiếp theo.`,
    `Trả lời trong hội thoại (kênh <em>Chuyên gia</em>) để khách thấy trên cả web chat và email.`,
    `Cập nhật trạng thái lead sau khi liên hệ (ASSIGNED → CONTACTED → MEETING_BOOKED).`,
  ]
  set(
    'next_actions',
    ul(actions),
    actions.map((a) => `- ${a.replace(/<[^>]+>/g, '')}`).join('\n'),
  )

  set(
    'links',
    `${'{{label:Liên kết}}'}${ul([
      `<a href="${escapeHtml(extras.adminUrl)}" style="color:#1D5FD1;text-decoration:underline;">Hội thoại trong X-CMS</a>`,
      `<a href="${escapeHtml(`${siteOrigin()}/admin/collections/leads/${lead.id}`)}" style="color:#1D5FD1;text-decoration:underline;">Hồ sơ lead</a>`,
    ])}`,
    `Hội thoại: ${extras.adminUrl}`,
  )

  return { vars, blocks }
}

/* ------------------------------------------------------------------- send */

function adminUrl(conversationId: string): string {
  const base = (process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${base}/admin/collections/lead-conversations/${conversationId}`
}

/** Staff inbox fallback when no consultant record matches. */
export function staffInbox(): string | null {
  const raw =
    process.env.LEAD_CONSULTANT_TO ??
    process.env.LEAD_NOTIFY_TO ??
    process.env.MAIL_TEST_TO_ADDRESS ??
    process.env.SEED_ADMIN_EMAIL
  return raw && raw.trim() ? raw.trim() : null
}

/**
 * Render + deliver one templated email, then persist it into the unified
 * transcript so the AI (and the customer, on the web) sees exactly what was sent.
 */
export async function sendLeadEmail(payload: Payload, ctx: SendContext): Promise<SendResult> {
  const { lead, conversation, templateKey } = ctx
  const def = await resolveTemplate(payload, templateKey)
  const toCustomer = def.audience === 'customer'
  const to = ctx.to ?? (toCustomer ? lead.email : (staffInbox() ?? ''))
  if (!to) return { sent: false, reason: 'no_recipient' }

  // Consent / suppression + anti-loop budget (security rules: never keep mailing).
  // Every suppression is logged: a mail the customer never got is exactly the
  // thing you need to see in the audit trail when a lead goes cold.
  if (toCustomer) {
    const suppress = async (reason: SendSkip['reason'], summary: string): Promise<SendSkip> => {
      await logActivity(payload, {
        type: 'email_suppressed',
        leadId: refId(conversation.lead),
        conversationId: conversation.id,
        channel: 'email',
        actor: 'system',
        summary,
        detail: { templateKey, reason },
      })
      return { sent: false, reason }
    }

    if (lead.unsubscribed || conversation.status === 'UNSUBSCRIBED') {
      return suppress('unsubscribed', 'Khách đã hủy nhận email')
    }
    if (!ALWAYS_SEND.has(templateKey)) {
      if ((conversation.outboundEmailCount ?? 0) >= maxAutoEmails()) {
        return suppress('budget', `Vượt hạn mức ${maxAutoEmails()} email tự động`)
      }
      const last = conversation.lastOutboundEmailAt ? Date.parse(conversation.lastOutboundEmailAt) : 0
      if (last && Date.now() - last < minIntervalMs()) {
        return suppress(
          'throttled',
          `Chưa đủ ${minIntervalMs() / 60_000} phút kể từ email trước`,
        )
      }
    }
  }

  // Resume link: reuse a caller-supplied one, else mint a fresh single-purpose token.
  let resumeLink = ctx.resumeUrl ?? ''
  let unsubscribeLink = ''
  if (toCustomer) {
    if (!resumeLink) {
      const issued = await issueResumeToken(payload, {
        conversation,
        leadId: refId(conversation.lead),
        deviceId: undefined,
      })
      resumeLink = issued.url
      await logActivity(payload, {
        type: 'token_issued',
        leadId: refId(conversation.lead),
        conversationId: conversation.id,
        channel: 'email',
        summary: `Phát hành resume token cho ${templateKey}`,
      })
    }
    const t = new URL(resumeLink).searchParams.get('t') ?? ''
    unsubscribeLink = `${siteOrigin()}/tu-van/huy-nhan-email?t=${encodeURIComponent(t)}`
  }

  const { vars, blocks } = buildVarsAndBlocks(ctx, {
    resumeUrl: resumeLink,
    unsubscribeUrl: unsubscribeLink,
    adminUrl: adminUrl(conversation.id),
  })

  const rendered = renderTemplate({
    def,
    vars,
    blocks,
    unsubscribeUrl: unsubscribeLink || undefined,
  })

  const replyTo = replyToAddress(conversation.publicId)
  const headers: Record<string, string> = {}
  if (toCustomer && unsubscribeLink) {
    headers['List-Unsubscribe'] = `<${unsubscribeLink}>, <mailto:${replyTo}?subject=unsubscribe>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
  }
  // Nudge auto-responders not to reply to us (loop prevention, RFC 3834).
  headers['Auto-Submitted'] = 'auto-generated'

  let messageId: string | undefined
  try {
    const info = (await payload.sendEmail({
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      replyTo,
      headers,
      ...(conversation.lastEmailMessageId
        ? {
            inReplyTo: conversation.lastEmailMessageId,
            references: conversation.lastEmailMessageId,
          }
        : {}),
    } as Parameters<Payload['sendEmail']>[0])) as { messageId?: string } | undefined
    messageId = info?.messageId
  } catch (err) {
    payload.logger.error({ err, templateKey, to }, 'sendLeadEmail: delivery failed')
    await logActivity(payload, {
      type: 'email_failed',
      leadId: refId(conversation.lead),
      conversationId: conversation.id,
      channel: 'email',
      summary: `Gửi ${templateKey} thất bại`,
      detail: { to, error: String(err) },
    })
    return { sent: false, reason: 'error' }
  }

  // Persist into the unified transcript (customer mail only — internal mail is
  // not part of the customer-visible conversation).
  if (toCustomer) {
    if (!ctx.skipTranscript) {
      await appendMessage(payload, {
        conversationId: conversation.id,
        channel: 'email',
        direction: 'outbound',
        role: 'assistant',
        contentText: ctx.aiReply?.trim() || rendered.text,
        contentHtml: rendered.html,
        emailMessageId: messageId,
        emailSubject: rendered.subject,
        templateKey,
      })
    }
    await updateConversation(payload, conversation.id, {
      lastOutboundEmailAt: new Date().toISOString(),
      outboundEmailCount: (conversation.outboundEmailCount ?? 0) + 1,
      ...(messageId ? { lastEmailMessageId: messageId } : {}),
    })
  }

  await logActivity(payload, {
    type: 'email_sent',
    leadId: refId(conversation.lead),
    conversationId: conversation.id,
    channel: 'email',
    actor: def.audience === 'consultant' ? 'system' : 'ai',
    summary: `${templateKey} → ${to}`,
    detail: { subject: rendered.subject, messageId },
  })

  return { sent: true, subject: rendered.subject, messageId }
}
