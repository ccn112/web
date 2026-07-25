/**
 * Template rendering — pure (no Payload, no network), so it can be unit-tested.
 *
 * Three substitution passes, in this order:
 *   1. `{{var}}`            → plain values, HTML-escaped (customer data).
 *   2. `{{name_block}}`     → pre-rendered HTML fragments supplied by the caller.
 *   3. `{{p:…}}` `{{note:…}}` `{{label:…}}` → layout helpers, so template
 *      editors write copy rather than <p style="…"> soup.
 *
 * Vars run first so a helper's inner text can itself contain `{{customer_name}}`
 * without the nested-brace problem.
 */

import {
  button,
  escapeHtml,
  htmlToText,
  label as labelBlock,
  note as noteBlock,
  p as pBlock,
  renderEmailShell,
} from './layout'
import type { EmailTemplateDef } from './templates'

export type Vars = Record<string, string>
/** Pre-rendered HTML fragments, keyed WITHOUT the braces (e.g. `brief_block`). */
export type Blocks = Record<string, string>

const VAR_RE = /\{\{([a-z0-9_]+)\}\}/gi

/** Pass 1 + 2: replace `{{key}}` from `vars` (escaped) then from `blocks` (raw HTML). */
function substitute(input: string, vars: Vars, blocks: Blocks, escape: boolean): string {
  return input.replace(VAR_RE, (whole, rawKey: string) => {
    const key = rawKey.toLowerCase()
    if (key in blocks) return blocks[key] ?? ''
    if (key in vars) {
      const v = vars[key] ?? ''
      return escape ? escapeHtml(v) : v
    }
    return whole // unknown → left for the final sweep
  })
}

/** Pass 3: layout helper directives. */
function applyHelpers(html: string): string {
  return html
    .replace(/\{\{p:([\s\S]*?)\}\}/g, (_m, body: string) => pBlock(body.trim()))
    .replace(/\{\{note:([\s\S]*?)\}\}/g, (_m, body: string) => noteBlock(body.trim()))
    .replace(/\{\{label:([\s\S]*?)\}\}/g, (_m, body: string) => labelBlock(body.trim()))
}

/** Drop any placeholder that nothing resolved, so customers never see `{{…}}`. */
const sweep = (s: string): string => s.replace(/\{\{[a-z0-9_]+(?::[\s\S]*?)?\}\}/gi, '')

export type RenderedEmail = { subject: string; html: string; text: string }

/**
 * Render a template definition into a ready-to-send email.
 * `def` may come from the CMS `email-templates` collection or from the built-ins.
 */
export function renderTemplate(opts: {
  def: EmailTemplateDef
  vars: Vars
  blocks?: Blocks
  /** Unsubscribe / preference URL — omitted for internal mail. */
  unsubscribeUrl?: string
  footerNote?: string
}): RenderedEmail {
  const { def, vars, blocks = {}, unsubscribeUrl, footerNote } = opts

  const subject = sweep(substitute(def.subject, vars, {}, false)).replace(/\s+/g, ' ').trim()
  const preheader = sweep(substitute(def.preheader ?? '', vars, {}, false)).trim()
  const heading = sweep(substitute(def.heading ?? '', vars, {}, false)).trim()
  const eyebrow = def.eyebrow ? sweep(substitute(def.eyebrow, vars, {}, false)).trim() : undefined

  // CTA: only rendered when the template declares one AND the URL var resolved.
  const ctaUrl = def.ctaUrlVar ? (vars[def.ctaUrlVar] ?? '') : ''
  const ctaHtml =
    def.ctaLabel && ctaUrl ? button({ href: ctaUrl, text: substitute(def.ctaLabel, vars, {}, false) }) : ''

  let body = substitute(def.htmlBody, vars, { ...blocks, cta: ctaHtml }, true)
  body = applyHelpers(body)
  body = sweep(body)

  const html = renderEmailShell({
    preheader: preheader || heading,
    heading,
    eyebrow,
    body,
    unsubscribeUrl: def.internal ? undefined : unsubscribeUrl,
    footerNote,
    internal: def.internal,
  })

  // Plain-text twin: prefer the authored one, fall back to stripping the HTML.
  const authored = def.textBody
    ? sweep(substitute(def.textBody, vars, blocksToText(blocks), false)).trim()
    : ''
  const text = authored || htmlToText(body)

  return { subject, html, text }
}

/**
 * The text twin references `*_text` variants; anything still referencing a
 * `*_block` gets the HTML stripped rather than leaking markup into plain text.
 */
function blocksToText(blocks: Blocks): Blocks {
  const out: Blocks = {}
  for (const [k, v] of Object.entries(blocks)) out[k] = htmlToText(v)
  return out
}
