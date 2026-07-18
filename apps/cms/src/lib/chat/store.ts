/**
 * Payload-backed persistence for the chat module (the only framework-specific
 * layer — swap this file to reuse the module on another backend). Uses the
 * Local API directly, so there is no internal HTTP round-trip. Collections:
 * `chat-users` (leads / registration), `chat-sessions` (history + per-session
 * usage), `chat-usage` (daily rollup).
 */

import { getPayloadClient } from '../payload-client'

export type StoredMsg = { role: 'user' | 'assistant'; content: string; images?: number; ts: string }

export type SessionDoc = {
  id: string
  messages: StoredMsg[]
  tokensIn: number
  tokensOut: number
  estCostUsd: number
}

/* -------- registration (unlocks uploads + history, raises daily cap) -------- */

export async function isRegistered(deviceId: string): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'chat-users',
      where: { deviceId: { equals: deviceId } },
      limit: 1,
      depth: 0,
    })
    return res.docs.length > 0
  } catch {
    return false
  }
}

export async function upsertUser(u: {
  deviceId: string
  email: string
  phone: string
  name?: string
  siteCode: string
}): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    const found = await payload.find({
      collection: 'chat-users',
      where: { deviceId: { equals: u.deviceId } },
      limit: 1,
      depth: 0,
    })
    const data = { deviceId: u.deviceId, email: u.email, phone: u.phone, name: u.name || undefined, siteCode: u.siteCode }
    const existing = found.docs[0]
    if (existing) {
      await payload.update({ collection: 'chat-users', id: String(existing.id), data })
    } else {
      await payload.create({ collection: 'chat-users', data })
    }
    return true
  } catch {
    return false
  }
}

/* -------- sessions -------- */

export async function loadSession(sessionId: string): Promise<SessionDoc | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'chat-sessions',
      where: { sessionId: { equals: sessionId } },
      limit: 1,
      depth: 0,
    })
    const doc = res.docs[0] as
      | { id: string | number; messages?: StoredMsg[]; tokensIn?: number; tokensOut?: number; estCostUsd?: number }
      | undefined
    if (!doc) return null
    return {
      id: String(doc.id),
      messages: Array.isArray(doc.messages) ? doc.messages : [],
      tokensIn: doc.tokensIn ?? 0,
      tokensOut: doc.tokensOut ?? 0,
      estCostUsd: doc.estCostUsd ?? 0,
    }
  } catch {
    return null
  }
}

export async function saveSession(opts: {
  existingId: string | null
  deviceId: string
  sessionId: string
  siteCode: string
  route: string
  messages: StoredMsg[]
  provider: string
  model: string
  tokensIn: number
  tokensOut: number
  estCostUsd: number
}): Promise<void> {
  const title = (opts.messages.find((m) => m.role === 'user')?.content ?? 'Hội thoại').slice(0, 60)
  const data = {
    deviceId: opts.deviceId,
    sessionId: opts.sessionId,
    siteCode: opts.siteCode,
    lastRoute: opts.route,
    title,
    messages: opts.messages,
    messageCount: opts.messages.length,
    provider: opts.provider,
    model: opts.model,
    tokensIn: opts.tokensIn,
    tokensOut: opts.tokensOut,
    estCostUsd: Math.round(opts.estCostUsd * 1e6) / 1e6,
  }
  try {
    const payload = await getPayloadClient()
    if (opts.existingId) {
      await payload.update({ collection: 'chat-sessions', id: opts.existingId, data })
    } else {
      await payload.create({ collection: 'chat-sessions', data })
    }
  } catch {
    /* best-effort persistence */
  }
}

export type SessionSummary = { sessionId: string; title: string; messageCount: number; updatedAt: string }

export async function listSessions(deviceId: string): Promise<SessionSummary[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'chat-sessions',
      where: { and: [{ deviceId: { equals: deviceId } }, { hiddenByUser: { not_equals: true } }] },
      sort: '-updatedAt',
      limit: 50,
      depth: 0,
    })
    return res.docs.map((d) => {
      const doc = d as { sessionId: string; title?: string; messageCount?: number; updatedAt?: string }
      return {
        sessionId: doc.sessionId,
        title: doc.title ?? 'Hội thoại',
        messageCount: doc.messageCount ?? 0,
        updatedAt: doc.updatedAt ?? '',
      }
    })
  } catch {
    return []
  }
}

export async function getSessionForDevice(
  deviceId: string,
  sessionId: string,
): Promise<{ sessionId: string; title: string; messages: StoredMsg[] } | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'chat-sessions',
      where: { and: [{ deviceId: { equals: deviceId } }, { sessionId: { equals: sessionId } }] },
      limit: 1,
      depth: 0,
    })
    const doc = res.docs[0] as { sessionId: string; title?: string; messages?: StoredMsg[] } | undefined
    if (!doc) return null
    return { sessionId: doc.sessionId, title: doc.title ?? '', messages: Array.isArray(doc.messages) ? doc.messages : [] }
  } catch {
    return null
  }
}

/** Soft-hide from the user's history (staff retain it for content mining). */
export async function hideSessionForDevice(deviceId: string, sessionId: string): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'chat-sessions',
      where: { and: [{ deviceId: { equals: deviceId } }, { sessionId: { equals: sessionId } }] },
      limit: 1,
      depth: 0,
    })
    const doc = res.docs[0] as { id: string | number } | undefined
    if (doc) {
      await payload.update({ collection: 'chat-sessions', id: String(doc.id), data: { hiddenByUser: true } })
    }
    return true
  } catch {
    return false
  }
}

/* -------- daily usage rollup (one doc per day × provider × model) -------- */

export async function recordUsage(u: {
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
}): Promise<void> {
  const day = new Date().toISOString().slice(0, 10)
  const key = `${day}:${u.provider}:${u.model}`
  try {
    const payload = await getPayloadClient()
    const found = await payload.find({ collection: 'chat-usage', where: { key: { equals: key } }, limit: 1, depth: 0 })
    const doc = found.docs[0] as
      | { id: string | number; requests?: number; tokensIn?: number; tokensOut?: number; estCostUsd?: number }
      | undefined
    if (doc) {
      await payload.update({
        collection: 'chat-usage',
        id: String(doc.id),
        data: {
          requests: (doc.requests ?? 0) + 1,
          tokensIn: (doc.tokensIn ?? 0) + u.inputTokens,
          tokensOut: (doc.tokensOut ?? 0) + u.outputTokens,
          estCostUsd: Math.round(((doc.estCostUsd ?? 0) + u.costUsd) * 1e6) / 1e6,
        },
      })
    } else {
      await payload.create({
        collection: 'chat-usage',
        data: {
          key,
          day,
          provider: u.provider,
          model: u.model,
          requests: 1,
          tokensIn: u.inputTokens,
          tokensOut: u.outputTokens,
          estCostUsd: Math.round(u.costUsd * 1e6) / 1e6,
        },
      })
    }
  } catch {
    /* best-effort */
  }
}
