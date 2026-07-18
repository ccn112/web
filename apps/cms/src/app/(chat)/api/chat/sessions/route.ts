/**
 * Chat history management (registered visitors only, keyed by device id):
 *  - GET ?deviceId=            → list this device's sessions
 *  - GET ?deviceId=&sessionId= → one session's messages (resume)
 *  - DELETE ?deviceId=&sessionId= → soft-hide a session from the user's history
 * History is a gated feature: an unregistered device gets 403 register_required.
 * Backed by the Payload Local API. Proxied by clay.
 */

import { isRegistered, listSessions, getSessionForDevice, hideSessionForDevice } from '@/lib/chat/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const deviceId = (url.searchParams.get('deviceId') ?? '').trim()
  const sessionId = (url.searchParams.get('sessionId') ?? '').trim()
  if (!deviceId) return Response.json({ error: 'Missing device' }, { status: 400 })
  if (!(await isRegistered(deviceId))) {
    return Response.json({ error: 'Đăng ký để xem lịch sử.', code: 'register_required' }, { status: 403 })
  }

  if (sessionId) {
    const doc = await getSessionForDevice(deviceId, sessionId)
    if (!doc) return Response.json({ error: 'Không tìm thấy.' }, { status: 404 })
    return Response.json({ sessionId: doc.sessionId, title: doc.title, messages: doc.messages })
  }

  const sessions = await listSessions(deviceId)
  return Response.json({ sessions })
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const deviceId = (url.searchParams.get('deviceId') ?? '').trim()
  const sessionId = (url.searchParams.get('sessionId') ?? '').trim()
  if (!deviceId || !sessionId) return Response.json({ error: 'Missing params' }, { status: 400 })
  if (!(await isRegistered(deviceId))) {
    return Response.json({ error: 'Đăng ký để quản lý lịch sử.', code: 'register_required' }, { status: 403 })
  }
  await hideSessionForDevice(deviceId, sessionId)
  return Response.json({ ok: true })
}
