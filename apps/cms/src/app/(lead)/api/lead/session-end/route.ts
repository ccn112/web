/**
 * End a web-chat consultation session and email the assigned consultant
 * (fallback: shared staff inbox) a Vietnamese HTML summary of the whole session.
 *
 * Device-scoped like every other web-chat action — the device must have created
 * the conversation or have verified by email OTP. Idempotent: one summary per
 * conversation, ever.
 */

import { endSession } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { deviceId?: string; conversationPublicId?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const result = await endSession({
    deviceId: (body.deviceId ?? '').trim(),
    conversationPublicId: (body.conversationPublicId ?? '').trim(),
    reason: 'customer',
  })

  if ('error' in result) {
    return Response.json({ error: result.error, code: result.code }, { status: result.status })
  }
  return Response.json(result)
}
