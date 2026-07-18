/**
 * Register a chat visitor (email + phone) to unlock uploads + history and raise
 * the daily cap. Upserts the `chat-users` record by device id via the Local
 * API; staff read these as leads in admin. Proxied by clay.
 */

import { upsertUser } from '@/lib/chat/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: { deviceId?: string; email?: string; phone?: string; name?: string; siteCode?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const deviceId = (body.deviceId ?? '').trim()
  const email = (body.email ?? '').trim()
  const phone = (body.phone ?? '').trim()
  const name = (body.name ?? '').trim()
  const siteCode = body.siteCode ?? 'corporate'

  if (!deviceId) return Response.json({ error: 'Missing device' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return Response.json({ error: 'Email không hợp lệ.' }, { status: 400 })
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15)
    return Response.json({ error: 'Số điện thoại không hợp lệ.' }, { status: 400 })

  const ok = await upsertUser({ deviceId, email, phone, name: name || undefined, siteCode })
  if (!ok) return Response.json({ error: 'Không thể đăng ký, vui lòng thử lại.' }, { status: 502 })
  return Response.json({ ok: true })
}
