/**
 * AI chat endpoint (CMS-owned). Streams a guardrailed response from the
 * configured provider (Anthropic / OpenAI / Gemini / Copilot) and persists the
 * conversation + token usage & estimated cost via the Payload Local API, keyed
 * by an anonymous device id. The public site (clay) proxies to this route, so
 * the provider API keys live only on the CMS backend.
 */

import { parseChatInput, runChat, SSE_HEADERS } from '@/lib/chat/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let body: Parameters<typeof parseChatInput>[0]
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const input = parseChatInput(body)
  if ('error' in input) {
    return Response.json({ error: input.error, code: input.code }, { status: input.status })
  }

  const result = await runChat(input)
  if (result instanceof ReadableStream) {
    return new Response(result, { headers: SSE_HEADERS })
  }
  return Response.json({ error: result.error, code: result.code }, { status: result.status })
}
