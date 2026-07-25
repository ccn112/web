/**
 * One-click unsubscribe from the email footer and the `List-Unsubscribe` header.
 * Suppresses all future automated mail, closes the conversation and revokes every
 * outstanding resume link for it.
 *
 * POST is what RFC 8058 one-click uses; GET backs the human-facing footer link.
 */

import { unsubscribeByToken } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function run(token: string) {
  const result = await unsubscribeByToken(token)
  if ('error' in result) return Response.json({ error: result.error }, { status: result.status })
  return Response.json(result)
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  let token = url.searchParams.get('t') ?? ''
  if (!token) {
    try {
      const body = (await req.json()) as { token?: string }
      token = body.token ?? ''
    } catch {
      /* one-click posts an empty body; the token is in the query string */
    }
  }
  return run(token)
}

export async function GET(req: Request) {
  return run(new URL(req.url).searchParams.get('t') ?? '')
}
