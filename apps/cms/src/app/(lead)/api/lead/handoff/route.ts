/**
 * Manual escalation: put a consultant on a conversation right now, regardless of
 * score. Internal endpoint — requires the staff secret (`x-lead-admin-secret`)
 * or an authenticated admin session is expected upstream.
 */

import { handoffByPublicId } from '@/lib/lead/service'
import type { HandoffReason } from '@/lib/lead/state-machine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  const expected = process.env.LEAD_ADMIN_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  return (req.headers.get('x-lead-admin-secret') ?? '') === expected
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { conversationPublicId?: string; reason?: HandoffReason }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
  const publicId = (body.conversationPublicId ?? '').trim()
  if (!publicId) return Response.json({ error: 'Thiếu conversationPublicId.' }, { status: 400 })

  const result = await handoffByPublicId(publicId, body.reason ?? 'manual')
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: result.status })
  }
  return Response.json(result)
}
