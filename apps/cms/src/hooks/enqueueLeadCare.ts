import { randomUUID } from 'node:crypto'
import type { CollectionAfterChangeHook } from 'payload'

/** Minutes to wait before the AI analyses the lead and sends a tailored reply. */
const DELAY_MINUTES = Number(process.env.CARE_DELAY_MINUTES ?? '30')

/**
 * Kicks off the automated customer-care pipeline for a new lead:
 *
 *  1. Pre-creates a "warm" chat session seeded with the visitor's inquiry, so
 *     that whenever they open the AI chat (via the magic link in the follow-up
 *     email) the context is already there and they can continue instantly.
 *  2. Stamps the submission with the care schedule + chat bridge token.
 *  3. Queues a delayed `leadCareFollowup` job (default +30 min) that analyses
 *     the inquiry, emails a tailored reply, and escalates high-priority leads.
 *
 * Everything is best-effort: the submission is already persisted, so any
 * failure here is logged but never surfaced to the visitor.
 */
export const enqueueLeadCare: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  // Guard re-entrancy: the req.payload.update below re-fires afterChange as an
  // 'update' op, but only 'create' proceeds — still, bail early if already set.
  if (doc.care?.chatToken) return doc

  try {
    const payloadData = (doc.payload && typeof doc.payload === 'object' ? doc.payload : {}) as Record<
      string,
      unknown
    >
    // Friendly opening line for the warm chat (the visitor's actual question if
    // they left one, else a neutral intro). The full form dump is NOT shown in
    // chat — the AI follow-up job reads it straight from the submission.
    const rawMessage = payloadData.message
    const opening =
      typeof rawMessage === 'string' && rawMessage.trim()
        ? rawMessage.trim()
        : 'Xin chào, tôi vừa để lại thông tin và muốn được tư vấn thêm.'
    const token = randomUUID()
    const sessionId = `lead-${token}`

    // siteCode for chat scoping/analytics.
    let siteCode = ''
    const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site
    if (siteId) {
      const site = await req.payload
        .findByID({ collection: 'sites', id: siteId, depth: 0, req })
        .catch(() => null)
      siteCode = (site as { code?: string } | null)?.code ?? ''
    }

    const now = new Date()
    const seededMessages = [{ role: 'user' as const, content: opening, ts: now.toISOString() }]

    // Warm chat session — deviceId is a placeholder until the visitor adopts it
    // via the magic link (which rebinds it to their real browser device id).
    await req.payload
      .create({
        collection: 'chat-sessions',
        req,
        data: {
          deviceId: `lead:${token}`,
          sessionId,
          siteCode,
          title: 'Yêu cầu tư vấn',
          messages: seededMessages,
          messageCount: seededMessages.length,
        },
      })
      .catch((err) => {
        req.payload.logger.error({ err }, 'enqueueLeadCare: failed to create warm chat session')
      })

    const scheduledAt = new Date(now.getTime() + DELAY_MINUTES * 60_000)

    await req.payload.update({
      collection: 'form-submissions',
      id: doc.id,
      req,
      data: {
        care: {
          stage: 'queued',
          scheduledAt: scheduledAt.toISOString(),
          chatSessionId: sessionId,
          chatToken: token,
        },
      },
    })

    // Delayed AI follow-up job. Payload runs it once `waitUntil` has passed and
    // a runner ticks the queue (see payload.config jobs + the cron trigger).
    await req.payload.jobs.queue({
      task: 'leadCareFollowup',
      input: { submissionId: String(doc.id) },
      waitUntil: scheduledAt,
    })
  } catch (err) {
    req.payload.logger.error({ err }, 'enqueueLeadCare: failed to enqueue lead care pipeline')
  }

  return doc
}
