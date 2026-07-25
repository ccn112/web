/**
 * Device verification for a new browser opening an email resume link.
 * `action: 'request'` mails a 6-digit OTP to the lead's address;
 * `action: 'confirm'` validates it, marks the device trusted and returns the
 * merged history plus a fresh device-bound resume link.
 */

import { confirmDeviceVerification, requestDeviceVerification } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { token?: string; deviceId?: string; action?: 'request' | 'confirm'; code?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const token = body.token ?? ''
  const deviceId = body.deviceId ?? ''

  const result =
    body.action === 'confirm'
      ? await confirmDeviceVerification({ token, deviceId, code: body.code ?? '' })
      : await requestDeviceVerification({ token, deviceId })

  if ('error' in result) {
    return Response.json({ error: result.error, code: result.code }, { status: result.status })
  }
  return Response.json(result)
}
