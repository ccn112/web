/**
 * Web-chat channel of the consultation. SSE: streams the AI's consultative
 * reply, then emits a `state` event carrying the new qualification status so the
 * UI can show progress and the "đang chuyển tới chuyên gia" banner.
 *
 * The session is scoped by `deviceId` — the device must have created the
 * conversation or have been verified by email OTP (see lib/lead/store.ts
 * `deviceMayAccess`). deviceId alone is never treated as authentication.
 */

import { streamChat, resolveProvider } from '@/lib/chat/providers'
import { completeWebChatTurn, prepareWebChatTurn } from '@/lib/lead/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SSE_HEADERS = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
} as const

export async function POST(req: Request) {
  let body: { deviceId?: string; conversationPublicId?: string; message?: string; siteCode?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const setup = await prepareWebChatTurn({
    deviceId: (body.deviceId ?? '').trim(),
    conversationPublicId: body.conversationPublicId?.trim(),
    message: body.message ?? '',
    siteCode: body.siteCode,
  })
  if ('error' in setup) {
    return Response.json({ error: setup.error, code: setup.code }, { status: setup.status })
  }

  const userText = (body.message ?? '').trim()
  const { provider, model } = resolveProvider()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      let reply = ''
      try {
        send({ type: 'meta', conversationPublicId: setup.conversation.publicId })
        const result = await streamChat({
          provider,
          model,
          system: setup.system,
          messages: setup.messages,
          attachments: [],
          maxTokens: 900,
        })
        for await (const t of result.text) {
          reply += t
          send({ type: 'delta', text: t })
        }
        await result.usage
      } catch (e) {
        send({ type: 'error', message: 'Xin lỗi, có lỗi khi xử lý. Vui lòng thử lại.' })
        console.error('[lead-chat] provider error', e)
      }

      // Persist + qualify AFTER the reply is on screen; the state event follows.
      try {
        const outcome = await completeWebChatTurn({ setup, assistantReply: reply, userText })
        send({ type: 'state', ...outcome })
      } catch (e) {
        console.error('[lead-chat] post-turn error', e)
      }
      send({ type: 'done' })
      controller.close()
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}
