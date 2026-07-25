/**
 * Inbound email normalisation — provider-agnostic, pure (no Payload, no network).
 *
 * Accepts the webhook body shapes of Postmark, Mailgun, SendGrid Inbound Parse
 * and a plain generic JSON payload, and reduces them to one `InboundEmail`.
 * Also implements the three loop guards from docs/EMAIL_REPLY_FLOW.md:
 * auto-reply/bounce detection, quoted-history stripping and message-id capture
 * (de-duplication itself lives in the store).
 */

export type InboundEmail = {
  /** Recipient we were addressed as — carries the conversation publicId. */
  to: string
  from: string
  fromName?: string
  subject: string
  text: string
  html?: string
  messageId?: string
  inReplyTo?: string
  headers: Record<string, string>
}

type Json = Record<string, unknown>

const s = (v: unknown): string => (typeof v === 'string' ? v : '')

/** `"Nguyễn An" <an@acme.vn>` → `an@acme.vn` */
export function extractAddress(raw: string): string {
  const m = raw.match(/<([^>]+)>/)
  return (m?.[1] ?? raw).trim().toLowerCase()
}

export function extractName(raw: string): string {
  const m = raw.match(/^\s*"?([^"<]+?)"?\s*</)
  return (m?.[1] ?? '').trim()
}

/** Headers arrive as an object, or as an array of {Name,Value} / {name,value}. */
function normalizeHeaders(v: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (Array.isArray(v)) {
    for (const h of v) {
      if (!h || typeof h !== 'object') continue
      const o = h as Json
      const name = s(o.Name ?? o.name ?? o.key)
      const value = s(o.Value ?? o.value)
      if (name) out[name.toLowerCase()] = value
    }
  } else if (v && typeof v === 'object') {
    for (const [k, val] of Object.entries(v as Json)) out[k.toLowerCase()] = s(val)
  }
  return out
}

/** Pick the first non-empty of several possible field names. */
const pick = (o: Json, ...keys: string[]): string => {
  for (const k of keys) {
    const v = s(o[k])
    if (v) return v
  }
  return ''
}

/** Normalise any supported provider payload into an InboundEmail. */
export function parseInbound(body: unknown): InboundEmail | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Json

  const headers = normalizeHeaders(b.Headers ?? b.headers ?? b['message-headers'])

  // Recipient: providers disagree wildly; the envelope is the most reliable.
  let to = pick(b, 'To', 'to', 'recipient', 'OriginalRecipient', 'envelope_to')
  if (!to) {
    const env = b.envelope
    if (env && typeof env === 'object') {
      const e = env as Json
      const t = e.to ?? e.To
      to = Array.isArray(t) ? s(t[0]) : s(t)
    }
  }
  if (!to) to = headers['delivered-to'] ?? headers['x-original-to'] ?? ''

  const fromRaw = pick(b, 'From', 'from', 'sender', 'FromFull') || headers.from || ''
  const from = extractAddress(fromRaw)
  if (!from || !to) return null

  const text =
    pick(b, 'TextBody', 'text', 'plain', 'body-plain', 'stripped-text', 'StrippedTextReply') || ''
  const html = pick(b, 'HtmlBody', 'html', 'body-html') || undefined

  return {
    to: to.toLowerCase(),
    from,
    fromName: extractName(fromRaw) || pick(b, 'FromName'),
    subject: pick(b, 'Subject', 'subject') || headers.subject || '',
    text,
    html,
    messageId:
      pick(b, 'MessageID', 'MessageId', 'messageId', 'message-id') ||
      headers['message-id'] ||
      undefined,
    inReplyTo: pick(b, 'InReplyTo', 'inReplyTo') || headers['in-reply-to'] || undefined,
    headers,
  }
}

/* ------------------------------------------------------------ loop guards */

const BOT_LOCAL_PARTS = [
  'mailer-daemon',
  'postmaster',
  'noreply',
  'no-reply',
  'donotreply',
  'do-not-reply',
  'bounce',
  'bounces',
  'notifications',
]

/**
 * True when this message must NOT be answered: auto-responders, vacation
 * replies, bounces, list traffic and our own outbound mail. Answering any of
 * these is how mail loops start (RFC 3834).
 */
export function isAutomated(email: InboundEmail): boolean {
  const h = email.headers
  const auto = (h['auto-submitted'] ?? '').toLowerCase()
  if (auto && auto !== 'no') return true
  if (h['x-autoreply'] || h['x-autorespond'] || h['x-auto-response-suppress']) return true

  const precedence = (h.precedence ?? '').toLowerCase()
  if (['bulk', 'list', 'junk', 'auto_reply'].includes(precedence)) return true
  if (h['list-id'] || h['list-unsubscribe']) return true

  // Bounce / delivery reports.
  const contentType = (h['content-type'] ?? '').toLowerCase()
  if (contentType.includes('report-type=delivery-status')) return true
  if (h['x-failed-recipients']) return true

  const local = email.from.split('@')[0] ?? ''
  if (BOT_LOCAL_PARTS.some((p) => local === p || local.startsWith(`${p}+`))) return true

  const subject = email.subject.toLowerCase()
  if (
    /^(auto[\s-]?reply|automatic reply|out of office|undeliverable|delivery status notification|mail delivery failed|returned mail|thư trả lời tự động)/.test(
      subject,
    )
  ) {
    return true
  }
  return false
}

/** Separators that mark the start of quoted history in a reply. */
const QUOTE_MARKERS: RegExp[] = [
  /^-{2,}\s*Original Message\s*-{2,}/im,
  /^-{2,}\s*Forwarded message\s*-{2,}/im,
  /^On .{5,120}\s+wrote:\s*$/im,
  /^V(?:à|a)o .{5,120}\s+đã viết:\s*$/im,
  /^Vào .{5,120}\s+viết:\s*$/im,
  /^T(?:ừ|u):\s.+$/im,
  /^From:\s.+$/im,
  /^Sent from my /im,
  /^_{10,}\s*$/m,
]

/**
 * Keep only what the customer actually typed: cut at the first quote marker and
 * drop `>`-prefixed lines. Without this the AI re-reads its own last email every
 * turn and the transcript grows quadratically.
 */
export function stripQuotedReply(text: string): string {
  let body = text.replace(/\r\n/g, '\n')

  let cut = body.length
  for (const re of QUOTE_MARKERS) {
    const m = re.exec(body)
    if (m && m.index < cut) cut = m.index
  }
  body = body.slice(0, cut)

  body = body
    .split('\n')
    .filter((line) => !/^\s*>/.test(line))
    .join('\n')

  // Trailing signature block (`-- ` on its own line, per RFC 3676).
  const sig = body.search(/^-{2}\s*$/m)
  if (sig > 0) body = body.slice(0, sig)

  return body.replace(/\n{3,}/g, '\n\n').trim()
}

/** Very rough HTML → text, used when the provider only sends an HTML part. */
export function htmlPartToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, '') // quoted history
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** The customer's actual words, whichever part the provider gave us. */
export function inboundBodyText(email: InboundEmail): string {
  const fromText = email.text ? stripQuotedReply(email.text) : ''
  if (fromText) return fromText
  return email.html ? stripQuotedReply(htmlPartToText(email.html)) : ''
}

/** Detects an explicit unsubscribe request sent as a reply. */
export function isUnsubscribeRequest(email: InboundEmail, body: string): boolean {
  const t = `${email.subject}\n${body}`.toLowerCase().trim()
  if (t.length > 400) return false // a real message that merely mentions the word
  return /\b(unsubscribe|remove me)\b|hủy nhận|huy nhan|dừng gửi|dung gui|không nhận email|khong nhan email/.test(
    t,
  )
}
