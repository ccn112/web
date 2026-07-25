/**
 * Lead-care chat bridge: adopt a warm session onto the visitor's device.
 *
 * The AI follow-up email contains a magic link (`/?care_chat=<token>`). When the
 * visitor opens it, the chat widget POSTs `{ token, deviceId }` here; we rebind
 * the pre-created "warm" session (seeded with their inquiry + the AI reply) to
 * their real device and return its messages so the widget can resume it inline.
 * Proxied by clay. Backed by the Payload Local API.
 */

import { adoptCareSession } from '@/lib/chat/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { token?: string; deviceId?: string }
  try {
    body = (await req.json()) as { token?: string; deviceId?: string }
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
  const token = (body.token ?? '').trim()
  const deviceId = (body.deviceId ?? '').trim()
  if (!token || !deviceId) return Response.json({ error: 'Missing token or device' }, { status: 400 })

  const session = await adoptCareSession(token, deviceId)
  if (!session) return Response.json({ error: 'Không tìm thấy phiên.' }, { status: 404 })
  return Response.json(session)
}
