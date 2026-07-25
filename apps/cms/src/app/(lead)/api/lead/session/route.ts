/**
 * Web-chat bootstrap: the consultation this device is allowed to continue.
 * Returns 404-as-null (not an error) when the device has no accessible session —
 * the UI then shows the intake form instead.
 */

import { getSession } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const deviceId = new URL(req.url).searchParams.get('deviceId') ?? ''
  if (!deviceId.trim()) return Response.json({ error: 'Thiếu deviceId.' }, { status: 400 })
  const session = await getSession(deviceId)
  return Response.json({ session })
}
