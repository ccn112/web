/**
 * Open a signed resume link from an email (`/tu-van/tiep-tuc?t=…`).
 *
 * The token never carries PII — only opaque ids + an expiry — and the server
 * checks signature, TTL and revocation before anything is returned. A device the
 * link was not minted for gets `needsVerification` instead of history.
 */

import { resumeFromToken } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: { token?: string; deviceId?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const result = await resumeFromToken({
    token: body.token ?? '',
    deviceId: body.deviceId ?? '',
  })

  if ('error' in result) {
    return Response.json({ error: result.error, code: result.code }, { status: result.status })
  }
  return Response.json(result)
}
