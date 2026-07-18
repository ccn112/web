/**
 * Multi-provider LLM abstraction for the chat module. One streaming interface
 * over Anthropic (Claude), OpenAI, Google Gemini, and GitHub Copilot (GitHub
 * Models — OpenAI-compatible). Provider is chosen by env `CHAT_PROVIDER`; each
 * provider has its own key + model env. Returns a text stream plus a usage
 * promise so callers can record tokens + estimated cost.
 *
 * This file is intentionally framework-agnostic (no Payload/Next imports) so it
 * can be lifted into any Node backend. See docs/CHAT_MODULE_HANDOFF.md.
 */

import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'

export type ChatProvider = 'anthropic' | 'openai' | 'gemini' | 'copilot'
export type ChatMsg = { role: 'user' | 'assistant'; content: string }
export type ChatAttachment = { kind: 'image' | 'pdf'; mediaType: string; data: string } // base64, no prefix
export type ChatUsage = { inputTokens: number; outputTokens: number }
export type ChatStream = { text: AsyncGenerator<string, void, unknown>; usage: Promise<ChatUsage> }

export type ProviderResolved = { provider: ChatProvider; model: string }

/** Which provider is active + its default model (env-driven). */
export function resolveProvider(): ProviderResolved {
  const provider = (process.env.CHAT_PROVIDER ?? 'anthropic').toLowerCase() as ChatProvider
  const model =
    provider === 'openai'
      ? (process.env.OPENAI_MODEL ?? 'gpt-4o-mini')
      : provider === 'gemini'
        ? (process.env.GEMINI_MODEL ?? 'gemini-2.5-flash')
        : provider === 'copilot'
          ? (process.env.COPILOT_MODEL ?? 'openai/gpt-4o-mini')
          : (process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5')
  return { provider, model }
}

/* -------- cost estimation ($ per 1M tokens) -------- */
const PRICES: Record<string, { in: number; out: number }> = {
  // Anthropic
  'claude-haiku-4-5': { in: 1, out: 5 },
  'claude-sonnet-5': { in: 3, out: 15 },
  'claude-opus-4-8': { in: 5, out: 25 },
  // OpenAI (approx)
  'gpt-4o-mini': { in: 0.15, out: 0.6 },
  'gpt-4o': { in: 2.5, out: 10 },
  'gpt-4.1-mini': { in: 0.4, out: 1.6 },
  'gpt-4.1': { in: 2, out: 8 },
  // Gemini (approx)
  'gemini-2.5-flash': { in: 0.3, out: 2.5 },
  'gemini-2.0-flash': { in: 0.1, out: 0.4 },
  'gemini-1.5-flash': { in: 0.075, out: 0.3 },
}

/** Estimated USD cost for a request (0 if the model price is unknown). */
export function estimateCost(model: string, usage: ChatUsage): number {
  const key = model.replace(/^openai\//, '') // copilot models are prefixed (openai/…, meta/…)
  const p = PRICES[key] ?? { in: 0, out: 0 }
  return (usage.inputTokens / 1e6) * p.in + (usage.outputTokens / 1e6) * p.out
}

/* -------- provider implementations -------- */

function dataUrl(a: ChatAttachment): string {
  return `data:${a.mediaType};base64,${a.data}`
}

async function anthropicStream(
  model: string,
  system: string,
  messages: ChatMsg[],
  attachments: ChatAttachment[],
  maxTokens: number,
): Promise<ChatStream> {
  const client = new Anthropic() // ANTHROPIC_API_KEY
  const apiMessages: Anthropic.MessageParam[] = messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }))
  const lastUser = messages[messages.length - 1]!
  const blocks: Anthropic.ContentBlockParam[] = []
  for (const a of attachments) {
    if (a.kind === 'image')
      blocks.push({ type: 'image', source: { type: 'base64', media_type: a.mediaType as 'image/png', data: a.data } })
    else blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: a.data } })
  }
  blocks.push({ type: 'text', text: lastUser.content || '(xem tệp đính kèm)' })
  apiMessages.push({ role: 'user', content: blocks })

  const params: Anthropic.MessageStreamParams = {
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: apiMessages,
  }
  if (!/haiku/i.test(model)) (params as { thinking?: unknown }).thinking = { type: 'disabled' }

  const s = client.messages.stream(params)
  let resolveUsage!: (u: ChatUsage) => void
  const usage = new Promise<ChatUsage>((r) => (resolveUsage = r))
  async function* gen() {
    for await (const ev of s) {
      if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') yield ev.delta.text
    }
    const fm = await s.finalMessage()
    resolveUsage({ inputTokens: fm.usage.input_tokens, outputTokens: fm.usage.output_tokens })
  }
  return { text: gen(), usage }
}

async function openaiCompatStream(
  client: OpenAI,
  model: string,
  system: string,
  messages: ChatMsg[],
  attachments: ChatAttachment[],
  maxTokens: number,
): Promise<ChatStream> {
  const lastUser = messages[messages.length - 1]!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastContent: any[] = [{ type: 'text', text: lastUser.content || '(xem tệp đính kèm)' }]
  for (const a of attachments) {
    if (a.kind === 'image') lastContent.push({ type: 'image_url', image_url: { url: dataUrl(a) } })
    else lastContent.push({ type: 'file', file: { filename: 'tai-lieu.pdf', file_data: dataUrl(a) } })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const oaMessages: any[] = [
    { role: 'system', content: system },
    ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: attachments.length ? lastContent : lastUser.content },
  ]

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: maxTokens,
    messages: oaMessages,
  })
  let resolveUsage!: (u: ChatUsage) => void
  const usage = new Promise<ChatUsage>((r) => (resolveUsage = r))
  async function* gen() {
    let u: ChatUsage = { inputTokens: 0, outputTokens: 0 }
    for await (const chunk of stream) {
      const d = chunk.choices[0]?.delta?.content
      if (d) yield d
      if (chunk.usage) u = { inputTokens: chunk.usage.prompt_tokens, outputTokens: chunk.usage.completion_tokens }
    }
    resolveUsage(u)
  }
  return { text: gen(), usage }
}

async function geminiStream(
  model: string,
  system: string,
  messages: ChatMsg[],
  attachments: ChatAttachment[],
  maxTokens: number,
): Promise<ChatStream> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY })
  const lastUser = messages[messages.length - 1]!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contents: any[] = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastParts: any[] = [{ text: lastUser.content || '(xem tệp đính kèm)' }]
  for (const a of attachments) lastParts.push({ inlineData: { mimeType: a.mediaType, data: a.data } })
  contents.push({ role: 'user', parts: lastParts })

  const stream = await ai.models.generateContentStream({
    model,
    contents,
    config: { systemInstruction: system, maxOutputTokens: maxTokens },
  })
  let resolveUsage!: (u: ChatUsage) => void
  const usage = new Promise<ChatUsage>((r) => (resolveUsage = r))
  async function* gen() {
    let u: ChatUsage = { inputTokens: 0, outputTokens: 0 }
    for await (const chunk of stream) {
      const t = chunk.text
      if (t) yield t
      const meta = chunk.usageMetadata
      if (meta) u = { inputTokens: meta.promptTokenCount ?? 0, outputTokens: meta.candidatesTokenCount ?? 0 }
    }
    resolveUsage(u)
  }
  return { text: gen(), usage }
}

/** Unified entry point. */
export async function streamChat(opts: {
  provider: ChatProvider
  model: string
  system: string
  messages: ChatMsg[]
  attachments: ChatAttachment[]
  maxTokens: number
}): Promise<ChatStream> {
  const { provider, model, system, messages, attachments, maxTokens } = opts
  switch (provider) {
    case 'openai':
      return openaiCompatStream(new OpenAI(), model, system, messages, attachments, maxTokens)
    case 'copilot': {
      // GitHub Models — OpenAI-compatible endpoint + GitHub token.
      const client = new OpenAI({
        apiKey: process.env.COPILOT_TOKEN ?? process.env.GITHUB_TOKEN ?? '',
        baseURL: process.env.COPILOT_BASE_URL ?? 'https://models.github.ai/inference',
      })
      return openaiCompatStream(client, model, system, messages, attachments, maxTokens)
    }
    case 'gemini':
      return geminiStream(model, system, messages, attachments, maxTokens)
    case 'anthropic':
    default:
      return anthropicStream(model, system, messages, attachments, maxTokens)
  }
}
