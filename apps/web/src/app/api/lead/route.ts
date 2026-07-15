import { NextResponse } from 'next/server'

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

async function findId(collection: string, field: string, value: string): Promise<string | null> {
  const res = await fetch(
    `${CMS_URL}/api/${collection}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1&depth=0`,
    { cache: 'no-store' },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: string }> }
  return data.docs?.[0]?.id ?? null
}

/** Persists a lead-form submission to the CMS FormSubmissions collection (public create). */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      formCode?: string
      siteCode?: string
      pageId?: string
      payload?: Record<string, unknown>
      consent?: boolean
    }
    if (!body.formCode || !body.payload) {
      return NextResponse.json({ error: 'Missing formCode or payload' }, { status: 400 })
    }

    const formId = await findId('forms', 'code', body.formCode)
    if (!formId) return NextResponse.json({ error: 'Unknown form' }, { status: 404 })
    const siteId = body.siteCode ? await findId('sites', 'code', body.siteCode) : null

    const res = await fetch(`${CMS_URL}/api/form-submissions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        form: formId,
        site: siteId,
        page: body.pageId ?? null,
        payload: body.payload,
        consent: body.consent ?? false,
      }),
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'CMS rejected submission' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
