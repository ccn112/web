/**
 * Payload persistence for the lead module — the only framework-coupled layer.
 * Everything here goes through the Local API (no HTTP hop, bypasses access
 * control by design: the `/api/lead/*` routes are the authorisation boundary).
 *
 * Collections: `leads`, `lead-devices`, `lead-conversations`, `lead-messages`,
 * `resume-tokens`, `consultants`, `consultant-assignments`, `lead-activities`.
 */

import type { Payload } from 'payload'
import type {
  Consultant,
  ConsultantAssignment,
  Lead,
  LeadConversation,
  LeadDevice,
  LeadMessage,
  ResumeToken,
} from '../../payload-types'
import { getPayloadClient } from '../payload-client'
import {
  hashToken,
  mintToken,
  newConversationPublicId,
  resumeUrl,
  type TokenPurpose,
} from './tokens'
import {
  type Collected,
  type LeadState,
  missingSlots,
  scoreOf,
  SLOTS,
} from './state-machine'

export type Channel = 'web-chat' | 'email' | 'consultant' | 'system'

export const client = getPayloadClient

const id = (ref: unknown): string =>
  typeof ref === 'object' && ref !== null ? String((ref as { id: string }).id) : String(ref ?? '')

/* ------------------------------------------------------------------ leads */

export type LeadIntake = {
  email: string
  fullName?: string
  phone?: string
  company?: string
  jobTitle?: string
  siteCode?: string
  formCode?: string
  source?: Lead['source']
  consent?: boolean
}

/**
 * Find a lead by email (the merge key for a contact) or create one. Never
 * overwrites a known field with a blank value from a lighter-weight touchpoint.
 */
export async function findOrCreateLead(payload: Payload, intake: LeadIntake): Promise<Lead> {
  const email = intake.email.trim().toLowerCase()
  const found = await payload.find({
    collection: 'leads',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })
  const existing = found.docs[0]

  const patch: Partial<Lead> = {}
  if (intake.fullName) patch.fullName = intake.fullName
  if (intake.phone) patch.phone = intake.phone
  if (intake.company) patch.company = intake.company
  if (intake.jobTitle) patch.jobTitle = intake.jobTitle
  if (intake.siteCode) patch.siteCode = intake.siteCode
  if (intake.formCode) patch.formCode = intake.formCode
  if (intake.consent) patch.consent = true

  if (existing) {
    // Only patch fields that are actually empty on the stored lead, plus consent.
    const data: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(patch)) {
      const cur = (existing as unknown as Record<string, unknown>)[k]
      if (k === 'consent' ? v === true : !cur) data[k] = v
    }
    if (Object.keys(data).length === 0) return existing
    return (await payload.update({ collection: 'leads', id: existing.id, data, depth: 0 })) as Lead
  }

  return (await payload.create({
    collection: 'leads',
    depth: 0,
    data: {
      email,
      status: 'NEW',
      score: 0,
      source: intake.source ?? 'web-form',
      ...patch,
    },
  })) as Lead
}

export async function getLead(payload: Payload, leadId: string): Promise<Lead | null> {
  return (await payload
    .findByID({ collection: 'leads', id: leadId, depth: 0 })
    .catch(() => null)) as Lead | null
}

/** Mirror the conversation's qualification state onto the lead for admin filtering. */
export async function syncLeadFromConversation(
  payload: Payload,
  leadId: string,
  opts: { status: LeadState; score: number; collected: Collected; conversationId?: string },
): Promise<void> {
  const data: Record<string, unknown> = {
    status: opts.status,
    score: opts.score,
  }
  for (const s of SLOTS) {
    const v = opts.collected[s.key]
    if (v && v.trim()) data[s.key] = v.trim()
  }
  if (opts.conversationId) data.lastConversation = opts.conversationId
  await payload.update({ collection: 'leads', id: leadId, data, depth: 0 }).catch(() => null)
}

/* ---------------------------------------------------------------- devices */

/** Upsert the device record and stamp `lastSeenAt`. Continuity only, never auth. */
export async function touchDevice(
  payload: Payload,
  deviceId: string,
  opts: { siteCode?: string; leadId?: string; consent?: boolean } = {},
): Promise<LeadDevice> {
  const now = new Date().toISOString()
  const found = await payload.find({
    collection: 'lead-devices',
    where: { deviceId: { equals: deviceId } },
    limit: 1,
    depth: 0,
  })
  const existing = found.docs[0]
  if (existing) {
    const data: Record<string, unknown> = { lastSeenAt: now }
    if (opts.leadId && !existing.contact) data.contact = opts.leadId
    if (opts.siteCode && !existing.siteCode) data.siteCode = opts.siteCode
    if (opts.consent !== undefined) data.consentStatus = opts.consent ? 'granted' : 'denied'
    return (await payload.update({
      collection: 'lead-devices',
      id: existing.id,
      data,
      depth: 0,
    })) as LeadDevice
  }
  return (await payload.create({
    collection: 'lead-devices',
    depth: 0,
    data: {
      deviceId,
      contact: opts.leadId ?? null,
      firstSeenAt: now,
      lastSeenAt: now,
      siteCode: opts.siteCode ?? null,
      consentStatus: opts.consent === undefined ? 'unknown' : opts.consent ? 'granted' : 'denied',
      isTrusted: false,
    },
  })) as LeadDevice
}

export async function getDevice(payload: Payload, deviceId: string): Promise<LeadDevice | null> {
  const found = await payload.find({
    collection: 'lead-devices',
    where: { deviceId: { equals: deviceId } },
    limit: 1,
    depth: 0,
  })
  return found.docs[0] ?? null
}

/**
 * Mark a device trusted after a successful email OTP — this is the only path by
 * which a new device gains access to conversation history.
 */
export async function trustDevice(
  payload: Payload,
  deviceId: string,
  leadId: string,
): Promise<LeadDevice> {
  const dev = await touchDevice(payload, deviceId, { leadId })
  return (await payload.update({
    collection: 'lead-devices',
    id: dev.id,
    depth: 0,
    data: { isTrusted: true, trustedAt: new Date().toISOString(), contact: leadId },
  })) as LeadDevice
}

/* ---------------------------------------------------------- conversations */

export async function createConversation(
  payload: Payload,
  opts: { leadId: string; siteCode?: string; channel: Channel; deviceId?: string },
): Promise<LeadConversation> {
  const device = opts.deviceId ? await touchDevice(payload, opts.deviceId, { leadId: opts.leadId, siteCode: opts.siteCode }) : null
  const conv = (await payload.create({
    collection: 'lead-conversations',
    depth: 0,
    data: {
      publicId: newConversationPublicId(),
      lead: opts.leadId,
      status: 'NEW',
      score: 0,
      turnCount: 0,
      channels: [opts.channel === 'system' ? 'web-chat' : opts.channel],
      devices: device ? [device.id] : [],
      originDeviceId: opts.deviceId ?? null,
      siteCode: opts.siteCode ?? null,
      collected: {},
      missingFields: missingSlots({}),
    },
  })) as LeadConversation
  await payload
    .update({ collection: 'leads', id: opts.leadId, data: { lastConversation: conv.id }, depth: 0 })
    .catch(() => null)
  return conv
}

export async function getConversationByPublicId(
  payload: Payload,
  publicId: string,
): Promise<LeadConversation | null> {
  const found = await payload.find({
    collection: 'lead-conversations',
    where: { publicId: { equals: publicId } },
    limit: 1,
    depth: 0,
  })
  return found.docs[0] ?? null
}

export async function getConversation(
  payload: Payload,
  convId: string,
): Promise<LeadConversation | null> {
  return (await payload
    .findByID({ collection: 'lead-conversations', id: convId, depth: 0 })
    .catch(() => null)) as LeadConversation | null
}

/**
 * Whether this device may read/continue a conversation.
 *
 * `deviceId` is continuity, not authentication — so the ONLY two ways in are:
 *  - it is the device that created the conversation (no pre-existing data is
 *    exposed to a stranger: that device supplied the data in the first place); or
 *  - it proved control of the lead's email via OTP (`isTrusted`) and is linked
 *    to this conversation.
 */
export function deviceMayAccess(
  conversation: LeadConversation,
  device: LeadDevice | null,
): boolean {
  if (!device) return false
  if (conversation.originDeviceId && conversation.originDeviceId === device.deviceId) return true
  if (!device.isTrusted) return false
  const linked = (conversation.devices ?? []).map(id)
  return linked.includes(device.id)
}

/**
 * The most recent conversation this device is allowed to continue, or null.
 * History is never handed out on a device id alone.
 */
export async function activeConversationForDevice(
  payload: Payload,
  deviceId: string,
): Promise<{ device: LeadDevice; lead: Lead; conversation: LeadConversation } | null> {
  const device = await getDevice(payload, deviceId)
  if (!device) return null

  // Origin path: the conversation this very device started.
  const own = await payload.find({
    collection: 'lead-conversations',
    where: { originDeviceId: { equals: deviceId } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
  })

  // Verified path: any conversation of the merged contact.
  let byContact: LeadConversation | undefined
  if (device.isTrusted && device.contact) {
    const found = await payload.find({
      collection: 'lead-conversations',
      where: { lead: { equals: id(device.contact) } },
      sort: '-updatedAt',
      limit: 1,
      depth: 0,
    })
    byContact = found.docs[0]
  }

  const candidates = [own.docs[0], byContact].filter(Boolean) as LeadConversation[]
  if (candidates.length === 0) return null
  const conversation = candidates.sort(
    (a, b) => Date.parse(b.updatedAt ?? '') - Date.parse(a.updatedAt ?? ''),
  )[0]!
  if (!deviceMayAccess(conversation, device)) return null

  const lead = await getLead(payload, id(conversation.lead))
  if (!lead) return null
  return { device, lead, conversation }
}

/** Link a device to a conversation and record the channel it arrived on. */
export async function linkDeviceToConversation(
  payload: Payload,
  conversation: LeadConversation,
  deviceId: string,
): Promise<LeadConversation> {
  const device = await touchDevice(payload, deviceId, {
    leadId: id(conversation.lead),
    siteCode: conversation.siteCode ?? undefined,
  })
  const current = (conversation.devices ?? []).map(id)
  if (current.includes(device.id)) return conversation
  return (await payload.update({
    collection: 'lead-conversations',
    id: conversation.id,
    depth: 0,
    data: { devices: [...current, device.id] },
  })) as LeadConversation
}

export async function updateConversation(
  payload: Payload,
  convId: string,
  data: Record<string, unknown>,
): Promise<LeadConversation> {
  return (await payload.update({
    collection: 'lead-conversations',
    id: convId,
    data,
    depth: 0,
  })) as LeadConversation
}

/** Record that a channel has now been used on this conversation. */
export async function noteChannel(
  payload: Payload,
  conversation: LeadConversation,
  channel: Channel,
): Promise<void> {
  if (channel === 'system') return
  const cur = (conversation.channels ?? []) as string[]
  if (cur.includes(channel)) return
  await updateConversation(payload, conversation.id, { channels: [...cur, channel] })
}

/** Persist the post-turn qualification state on both conversation and lead. */
export async function saveQualification(
  payload: Payload,
  conversation: LeadConversation,
  opts: {
    collected: Collected
    status: LeadState
    summary?: string
    recommendation?: string
    handoffReason?: string | null
    incrementTurn?: boolean
  },
): Promise<LeadConversation> {
  const score = scoreOf(opts.collected)
  const data: Record<string, unknown> = {
    collected: opts.collected,
    missingFields: missingSlots(opts.collected),
    score,
    status: opts.status,
  }
  if (opts.summary) data.qualificationSummary = opts.summary
  if (opts.recommendation) data.recommendation = opts.recommendation
  if (opts.incrementTurn) data.turnCount = (conversation.turnCount ?? 0) + 1
  if (opts.handoffReason) {
    data.handoffReason = opts.handoffReason
    if (!conversation.handoffAt) data.handoffAt = new Date().toISOString()
  }
  const updated = await updateConversation(payload, conversation.id, data)
  await syncLeadFromConversation(payload, id(conversation.lead), {
    status: opts.status,
    score,
    collected: opts.collected,
    conversationId: conversation.id,
  })
  return updated
}

/* --------------------------------------------------------------- messages */

export type AppendMessage = {
  conversationId: string
  channel: Channel
  direction: 'inbound' | 'outbound'
  role: 'user' | 'assistant' | 'consultant' | 'system'
  contentText: string
  contentHtml?: string
  emailMessageId?: string
  emailInReplyTo?: string
  emailSubject?: string
  emailFrom?: string
  templateKey?: string
  deviceId?: string
  meta?: Record<string, unknown>
}

/**
 * Append a message. Returns null when `emailMessageId` was already stored — the
 * de-duplication guard for webhook retries (docs/EMAIL_REPLY_FLOW.md).
 */
export async function appendMessage(
  payload: Payload,
  m: AppendMessage,
): Promise<LeadMessage | null> {
  if (m.emailMessageId) {
    const dup = await payload.find({
      collection: 'lead-messages',
      where: { emailMessageId: { equals: m.emailMessageId } },
      limit: 1,
      depth: 0,
    })
    if (dup.docs.length > 0) return null
  }
  return (await payload.create({
    collection: 'lead-messages',
    depth: 0,
    data: {
      conversation: m.conversationId,
      channel: m.channel,
      direction: m.direction,
      role: m.role,
      contentText: m.contentText.slice(0, 20_000),
      contentHtml: m.contentHtml?.slice(0, 60_000) ?? null,
      emailMessageId: m.emailMessageId ?? null,
      emailInReplyTo: m.emailInReplyTo ?? null,
      emailSubject: m.emailSubject ?? null,
      emailFrom: m.emailFrom ?? null,
      templateKey: m.templateKey ?? null,
      deviceId: m.deviceId ?? null,
      meta: m.meta ?? null,
    },
  })) as LeadMessage
}

/** Oldest-first transcript for a conversation (what the AI and the UI both read). */
export async function listMessages(
  payload: Payload,
  conversationId: string,
  limit = 200,
): Promise<LeadMessage[]> {
  const res = await payload.find({
    collection: 'lead-messages',
    where: { conversation: { equals: conversationId } },
    sort: 'createdAt',
    limit,
    depth: 0,
  })
  return res.docs
}

/* ----------------------------------------------------------------- tokens */

export type IssuedToken = { token: string; url: string; record: ResumeToken }

/** Mint a signed resume link and persist only its hash. */
export async function issueResumeToken(
  payload: Payload,
  opts: {
    conversation: LeadConversation
    leadId: string
    deviceId?: string
    purpose?: TokenPurpose
    ttlHours?: number
  },
): Promise<IssuedToken> {
  const minted = mintToken({
    conversationPublicId: opts.conversation.publicId,
    leadId: opts.leadId,
    deviceId: opts.deviceId,
    purpose: opts.purpose,
    ttlHours: opts.ttlHours,
  })
  const record = (await payload.create({
    collection: 'resume-tokens',
    depth: 0,
    data: {
      tokenHash: minted.tokenHash,
      purpose: opts.purpose ?? 'resume',
      lead: opts.leadId,
      conversation: opts.conversation.id,
      expectedDeviceId: opts.deviceId ?? null,
      expiresAt: minted.expiresAt.toISOString(),
      revoked: false,
    },
  })) as ResumeToken
  return { token: minted.token, url: resumeUrl(minted.token), record }
}

export async function findTokenRecord(
  payload: Payload,
  token: string,
): Promise<ResumeToken | null> {
  const found = await payload.find({
    collection: 'resume-tokens',
    where: { tokenHash: { equals: hashToken(token) } },
    limit: 1,
    depth: 0,
  })
  return found.docs[0] ?? null
}

export async function updateTokenRecord(
  payload: Payload,
  recordId: string,
  data: Record<string, unknown>,
): Promise<ResumeToken> {
  return (await payload.update({
    collection: 'resume-tokens',
    id: recordId,
    data,
    depth: 0,
  })) as ResumeToken
}

/** Revoke every outstanding token for a conversation (used on unsubscribe/erase). */
export async function revokeTokensForConversation(
  payload: Payload,
  conversationId: string,
): Promise<void> {
  const found = await payload.find({
    collection: 'resume-tokens',
    where: { and: [{ conversation: { equals: conversationId } }, { revoked: { not_equals: true } }] },
    limit: 200,
    depth: 0,
  })
  await Promise.all(
    found.docs.map((d) =>
      payload
        .update({ collection: 'resume-tokens', id: d.id, data: { revoked: true }, depth: 0 })
        .catch(() => null),
    ),
  )
}

/* ------------------------------------------------------------- activities */

export async function logActivity(
  payload: Payload,
  a: {
    type: string
    leadId?: string
    conversationId?: string
    channel?: Channel
    actor?: 'ai' | 'customer' | 'consultant' | 'system'
    summary?: string
    detail?: Record<string, unknown>
  },
): Promise<void> {
  await payload
    .create({
      collection: 'lead-activities',
      depth: 0,
      data: {
        type: a.type,
        lead: a.leadId ?? null,
        conversation: a.conversationId ?? null,
        channel: a.channel ?? null,
        actor: a.actor ?? 'system',
        summary: a.summary?.slice(0, 250) ?? null,
        detail: a.detail ?? null,
      },
    })
    .catch(() => null) // audit logging must never break the request
}

/* ------------------------------------------------------------ consultants */

/**
 * Pick the consultant to notify: an active one covering this site (preferring a
 * declared default), else any active default, else null (falls back to the
 * LEAD_NOTIFY_TO inbox in the handoff sender).
 */
export async function pickConsultant(
  payload: Payload,
  siteCode?: string | null,
): Promise<Consultant | null> {
  const res = await payload.find({
    collection: 'consultants',
    where: { active: { equals: true } },
    limit: 50,
    depth: 0,
  })
  const active = res.docs
  if (active.length === 0) return null
  const covers = (c: Consultant) =>
    !c.siteCodes || c.siteCodes.length === 0 || (siteCode ? c.siteCodes.includes(siteCode) : false)
  const scoped = active.filter(covers)
  const pool = scoped.length > 0 ? scoped : active
  return pool.find((c) => c.isDefault) ?? pool[0] ?? null
}

/** SLA window for a HUMAN_READY handoff, in hours. */
export function slaHours(): number {
  const n = Number(process.env.LEAD_SLA_HOURS ?? '2')
  return Number.isFinite(n) && n > 0 ? n : 2
}

export async function createAssignment(
  payload: Payload,
  opts: {
    leadId: string
    conversationId: string
    consultantId?: string
    handoffReason?: string | null
    score?: number
    aiSummary?: string
  },
): Promise<ConsultantAssignment> {
  const now = new Date()
  return (await payload.create({
    collection: 'consultant-assignments',
    depth: 0,
    data: {
      lead: opts.leadId,
      conversation: opts.conversationId,
      consultant: opts.consultantId ?? null,
      assignedAt: now.toISOString(),
      slaDueAt: new Date(now.getTime() + slaHours() * 3600_000).toISOString(),
      status: 'pending',
      handoffReason: (opts.handoffReason ?? null) as ConsultantAssignment['handoffReason'],
      scoreAtHandoff: opts.score ?? 0,
      aiSummary: opts.aiSummary ?? null,
    },
  })) as ConsultantAssignment
}

/** Has this conversation already been handed off? Prevents duplicate escalations. */
export async function existingAssignment(
  payload: Payload,
  conversationId: string,
): Promise<ConsultantAssignment | null> {
  const res = await payload.find({
    collection: 'consultant-assignments',
    where: { conversation: { equals: conversationId } },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
}

export { id as refId }
