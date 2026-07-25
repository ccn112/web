/**
 * Lead intake — a visitor left their details (website form or chat registration).
 * Creates/merges the lead, opens the consultation thread, and kicks off the
 * automated qualification loop by email. Proxied by clay's `/api/lead`.
 */

import { intake } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Body = {
  email?: string
  fullName?: string
  phone?: string
  company?: string
  jobTitle?: string
  message?: string
  siteCode?: string
  formCode?: string
  deviceId?: string
  consent?: boolean
  source?: 'web-form' | 'ai-chat' | 'email' | 'consultant'
  formPayload?: Record<string, unknown>
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const result = await intake({
    email: (body.email ?? '').trim(),
    fullName: body.fullName?.trim(),
    phone: body.phone?.trim(),
    company: body.company?.trim(),
    jobTitle: body.jobTitle?.trim(),
    message: body.message,
    siteCode: body.siteCode,
    formCode: body.formCode,
    deviceId: body.deviceId?.trim(),
    consent: body.consent,
    source: body.source ?? 'web-form',
    formPayload: body.formPayload,
  })

  if ('error' in result) {
    return Response.json({ error: result.error, code: result.code }, { status: result.status })
  }
  return Response.json({ ok: true, ...result })
}
