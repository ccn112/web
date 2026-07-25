/**
 * Inbound email webhook. The provider (Postmark / Mailgun / SendGrid inbound
 * parse) POSTs a reply addressed to `lead+<conversationPublicId>@reply.…`; we
 * route it back into the same conversation and let the AI continue from the
 * merged history.
 *
 * Auth: shared secret in `x-lead-webhook-secret` (or `?secret=`, for providers
 * that cannot set headers). Required in production; optional in dev so a local
 * curl can exercise the flow.
 *
 * Always answers 200 on a *handled-but-ignored* message (auto-replies,
 * duplicates, sender mismatch) so the provider does not retry-storm us.
 */

import { handleInboundEmail } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  const expected = process.env.LEAD_INBOUND_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  const url = new URL(req.url)
  const provided = req.headers.get('x-lead-webhook-secret') ?? url.searchParams.get('secret') ?? ''
  return provided.length > 0 && provided === expected
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  const contentType = req.headers.get('content-type') ?? ''
  try {
    if (contentType.includes('application/json')) {
      body = await req.json()
    } else {
      // Mailgun / SendGrid inbound parse post multipart or urlencoded forms.
      const form = await req.formData()
      body = Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, String(v)]))
    }
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  try {
    const result = await handleInboundEmail(body)
    return Response.json(result, { status: 200 })
  } catch (e) {
    console.error('[lead-email-reply] error', e)
    // 500 lets the provider retry a genuine outage; the message-id guard makes
    // that retry safe.
    return Response.json({ handled: false, reason: 'internal_error' }, { status: 500 })
  }
}
