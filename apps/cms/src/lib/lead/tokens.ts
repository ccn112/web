/**
 * Signed resume tokens + device-verification OTPs — pure crypto, no Payload.
 *
 * Security contract (docs/SECURITY_PRIVACY_RULES.md):
 *  - No PII in the URL: the token carries only opaque ids + an expiry.
 *  - HMAC-SHA256 over a compact JSON payload, keyed by LEAD_TOKEN_SECRET
 *    (falls back to PAYLOAD_SECRET so a single-secret deploy still works).
 *  - Only the SHA-256 *hash* of the token is stored, so a database read cannot
 *    mint working links; revoke / single-use is tracked against that hash.
 *  - `deviceId` is continuity only, never authentication: a token opened on an
 *    unknown device forces an email OTP before any history is returned.
 */

import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'

const TOKEN_VERSION = 1

export type TokenPurpose = 'resume' | 'verify'

export type ResumeTokenPayload = {
  v: number
  /** conversation publicId */
  c: string
  /** lead id */
  l: string
  /** device id the link was minted for ('' when minted from an email-only flow) */
  d: string
  /** purpose */
  p: TokenPurpose
  /** unique id — lets us revoke a single link */
  j: string
  /** expiry, epoch seconds */
  e: number
}

function secret(): string {
  const s = process.env.LEAD_TOKEN_SECRET ?? process.env.PAYLOAD_SECRET
  if (!s) throw new Error('LEAD_TOKEN_SECRET / PAYLOAD_SECRET is not configured')
  return s
}

const b64url = (buf: Buffer | string): string =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const unb64url = (s: string): Buffer =>
  Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

const sign = (body: string): string => b64url(createHmac('sha256', secret()).update(body).digest())

/** SHA-256 of the whole token string — what we persist in `resume-tokens`. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Default TTL for a resume link, in hours (env-tunable). */
export function resumeTtlHours(): number {
  const n = Number(process.env.LEAD_RESUME_TTL_HOURS ?? '336') // 14 days
  return Number.isFinite(n) && n > 0 ? n : 336
}

export type MintedToken = { token: string; tokenHash: string; jti: string; expiresAt: Date }

export function mintToken(opts: {
  conversationPublicId: string
  leadId: string
  deviceId?: string
  purpose?: TokenPurpose
  ttlHours?: number
}): MintedToken {
  const ttl = opts.ttlHours ?? resumeTtlHours()
  const expiresAt = new Date(Date.now() + ttl * 3600_000)
  const jti = randomBytes(12).toString('hex')
  const payload: ResumeTokenPayload = {
    v: TOKEN_VERSION,
    c: opts.conversationPublicId,
    l: opts.leadId,
    d: opts.deviceId ?? '',
    p: opts.purpose ?? 'resume',
    j: jti,
    e: Math.floor(expiresAt.getTime() / 1000),
  }
  const body = b64url(JSON.stringify(payload))
  const token = `${body}.${sign(body)}`
  return { token, tokenHash: hashToken(token), jti, expiresAt }
}

export type VerifyResult =
  | { ok: true; payload: ResumeTokenPayload; tokenHash: string }
  | { ok: false; reason: 'malformed' | 'bad_signature' | 'expired' }

/** Verifies shape, signature and TTL. Revocation/single-use is checked in the store. */
export function verifyToken(token: string): VerifyResult {
  const parts = token.split('.')
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: 'malformed' }
  const [body, sig] = parts as [string, string]

  const expected = sign(body)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'bad_signature' }

  let payload: ResumeTokenPayload
  try {
    payload = JSON.parse(unb64url(body).toString('utf8')) as ResumeTokenPayload
  } catch {
    return { ok: false, reason: 'malformed' }
  }
  if (payload.v !== TOKEN_VERSION || !payload.c || !payload.l || !payload.e) {
    return { ok: false, reason: 'malformed' }
  }
  if (payload.e * 1000 < Date.now()) return { ok: false, reason: 'expired' }

  return { ok: true, payload, tokenHash: hashToken(token) }
}

/* ------------------------------------------------------------------- OTP */

/** Minutes an email OTP stays valid. */
export const OTP_TTL_MINUTES = 10
/** Wrong-code attempts allowed before the OTP is burned. */
export const OTP_MAX_ATTEMPTS = 5

export function generateOtp(): { code: string; hash: string } {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  return { code, hash: hashOtp(code) }
}

export function hashOtp(code: string): string {
  return createHmac('sha256', secret()).update(`otp:${code.trim()}`).digest('hex')
}

export function otpMatches(code: string, storedHash: string): boolean {
  const a = Buffer.from(hashOtp(code))
  const b = Buffer.from(storedHash)
  return a.length === b.length && timingSafeEqual(a, b)
}

/* ----------------------------------------------------------------- misc */

/** Public, URL-safe conversation id (goes in the Reply-To local part). */
export function newConversationPublicId(): string {
  return `c${randomBytes(9).toString('hex')}` // c + 18 hex chars
}

/** `t***@example.com` — safe to show on the verification screen. */
export function maskEmail(email: string): string {
  const [user = '', domain = ''] = email.split('@')
  const head = user.slice(0, 1)
  return `${head}${'*'.repeat(Math.max(user.length - 1, 1))}@${domain}`
}

/** Public origin of the marketing site — used to build resume links. */
export function siteOrigin(): string {
  const raw =
    process.env.LEAD_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://x-tech.com.vn'
  return raw.replace(/\/$/, '')
}

export function resumeUrl(token: string): string {
  return `${siteOrigin()}/tu-van/tiep-tuc?t=${encodeURIComponent(token)}`
}

/** Reply-To address that routes an email answer back into this conversation. */
export function replyToAddress(conversationPublicId: string): string {
  const domain = process.env.LEAD_REPLY_DOMAIN ?? 'reply.x-tech.com.vn'
  return `lead+${conversationPublicId}@${domain}`
}

/** Extract the conversation publicId from a `lead+<id>@domain` recipient. */
export function parseConversationFromAddress(address: string): string | null {
  const m = address.match(/lead\+([A-Za-z0-9._-]+)@/i)
  return m?.[1] ?? null
}
