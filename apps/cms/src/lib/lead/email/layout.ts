/**
 * XTECH transactional email shell.
 *
 * Built on the two patterns that big-tech / SaaS transactional mail actually
 * ships with:
 *   - Cerberus "hybrid" responsive pattern (MIT, github.com/emailmonday/Cerberus)
 *     — ghost tables + max-width so Outlook on Windows (Word rendering engine,
 *     no media-query support) still gets a fixed 600px column while everything
 *     else fluid-scales on mobile.
 *   - Postmark's transactional template conventions (MIT,
 *     github.com/ActiveCampaign/postmark-templates) — one job per email, a
 *     single primary CTA, a plain-text twin, and a footer that says why the
 *     message was received.
 *
 * Hard rules baked in here so template editors cannot break deliverability:
 *   - Tables + inline CSS only (no flex/grid, no external stylesheets).
 *   - `role="presentation"` on every layout table (screen readers).
 *   - Preheader text: the inbox preview line, visually hidden in the body.
 *   - VML roundrect fallback so the CTA button renders in Outlook 2007–2021.
 *   - `color-scheme` + `prefers-color-scheme` so dark-mode inboxes don't invert
 *     the brand into something unreadable.
 *   - 600px column, 16px/1.6 body copy, ≥44px tap targets.
 */

/** Brand palette as hex — email clients do not support oklch()/CSS variables. */
export const BRAND = {
  ink: '#0B1533', // deep navy — header band
  inkSoft: '#141E3C',
  blue: '#1D5FD1', // accent-blue
  cyan: '#2E9AE0', // accent-cyan
  gold: '#C9A45C', // accent-gold
  text: '#1A2233',
  muted: '#5B6577',
  border: '#E4E8F0',
  page: '#F4F6FA',
  card: '#FFFFFF',
  // Dark-mode counterparts.
  darkPage: '#0A1024',
  darkCard: '#131B33',
  darkText: '#E8ECF5',
  darkMuted: '#9AA5BC',
  darkBorder: '#26314F',
} as const

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif"

export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/* --------------------------------------------------- content-block helpers */

/** A body paragraph. */
export function p(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.6;color:${BRAND.text};">${html}</p>`
}

/** A small muted note. */
export function note(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:14px;line-height:1.6;color:${BRAND.muted};">${html}</p>`
}

/** Section label above a block. */
export function label(text: string): string {
  return `<p style="margin:24px 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};">${escapeHtml(text)}</p>`
}

/** Bulleted list. */
export function ul(items: string[]): string {
  if (items.length === 0) return ''
  const li = items
    .map(
      (i) =>
        `<li style="margin:0 0 8px;font-family:${FONT};font-size:16px;line-height:1.6;color:${BRAND.text};">${i}</li>`,
    )
    .join('')
  return `<ul style="margin:0 0 16px;padding-left:22px;">${li}</ul>`
}

/**
 * Label/value brief — a two-column table, the readable way to show a structured
 * summary in email (definition lists collapse badly in Outlook).
 */
export function factTable(rows: Array<{ label: string; value: string }>): string {
  if (rows.length === 0) return ''
  const tr = rows
    .map(
      (r) => `<tr>
                <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-family:${FONT};font-size:13px;line-height:1.5;color:${BRAND.muted};white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td>
                <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-family:${FONT};font-size:15px;line-height:1.6;color:${BRAND.text};font-weight:600;">${escapeHtml(r.value)}</td>
              </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:10px;border-collapse:separate;overflow:hidden;margin:0 0 20px;background:#FBFCFE;" class="x-panel">
            ${tr}
          </table>`
}

/** Callout box — used for the SLA line and the "why you got this" notice. */
export function callout(html: string, tone: 'info' | 'urgent' = 'info'): string {
  const accent = tone === 'urgent' ? '#B4232A' : BRAND.blue
  const bg = tone === 'urgent' ? '#FDF2F2' : '#F1F6FE'
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
            <tr>
              <td style="border-left:3px solid ${accent};background:${bg};padding:14px 16px;border-radius:0 8px 8px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${BRAND.text};" class="x-panel">${html}</td>
            </tr>
          </table>`
}

/**
 * Primary CTA. `bulletproof` markup: a padded table anchor for modern clients
 * plus a VML roundrect for Outlook/Word, which ignores CSS padding on <a>.
 */
export function button(opts: { href: string; text: string }): string {
  const { href, text } = opts
  const safeHref = escapeHtml(href)
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
            <tr>
              <td align="center" bgcolor="${BRAND.blue}" style="border-radius:999px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="50%" strokecolor="${BRAND.blue}" fillcolor="${BRAND.blue}">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:${FONT};font-size:16px;font-weight:bold;">${escapeHtml(text)}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${safeHref}" style="display:inline-block;min-width:200px;padding:14px 32px;font-family:${FONT};font-size:16px;font-weight:700;line-height:20px;color:#ffffff;text-decoration:none;border-radius:999px;background:${BRAND.blue};" class="x-btn">${escapeHtml(text)}</a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>`
}

/** Divider rule. */
export function hr(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${BRAND.border};font-size:0;line-height:0;height:1px;" class="x-hr">&nbsp;</td></tr></table>`
}

/* ------------------------------------------------------------- the shell */

export type LayoutOptions = {
  /** Inbox preview line — never rendered visibly. */
  preheader: string
  /** Big <h1> at the top of the card. */
  heading: string
  /** Optional eyebrow above the heading (e.g. "LEAD ƯU TIÊN"). */
  eyebrow?: string
  /** Pre-rendered content HTML (compose with the helpers above). */
  body: string
  /** Footer "why you got this" line. */
  footerNote?: string
  /** Unsubscribe / preference URL (omitted for internal consultant mail). */
  unsubscribeUrl?: string
  /** Internal mail skips the marketing footer + unsubscribe. */
  internal?: boolean
}

/**
 * Wraps content in the responsive shell. Returns a complete HTML document.
 * Nothing here depends on Payload, so it is testable / portable.
 */
export function renderEmailShell(o: LayoutOptions): string {
  const year = new Date().getFullYear()
  const preheader = escapeHtml(o.preheader)
  // Whitespace padding stops the client from pulling body copy into the preview line.
  const preheaderPad = '&#847;&zwnj;&nbsp;'.repeat(40)

  const footer = o.internal
    ? `<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">
         Email nội bộ tự động từ hệ thống tư vấn XTECH. Không chuyển tiếp ra ngoài — nội dung chứa dữ liệu khách hàng.
       </p>`
    : `<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">
         ${escapeHtml(o.footerNote ?? 'Bạn nhận được email này vì đã để lại thông tin tư vấn trên website XTECH.')}
       </p>
       <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">
         XTECH — Chuyển đổi số &amp; AI cho doanh nghiệp và bất động sản<br />
         <a href="https://x-tech.com.vn" style="color:${BRAND.muted};text-decoration:underline;">x-tech.com.vn</a>
         ${
           o.unsubscribeUrl
             ? ` &nbsp;·&nbsp; <a href="${escapeHtml(o.unsubscribeUrl)}" style="color:${BRAND.muted};text-decoration:underline;">Hủy nhận email tư vấn</a>`
             : ''
         }
       </p>
       <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">© ${year} XTECH. All rights reserved.</p>`

  return `<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(o.heading)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    /* Client resets */
    html,body{margin:0!important;padding:0!important;height:100%!important;width:100%!important;}
    *{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt!important;mso-table-rspace:0pt!important;border-collapse:collapse!important;}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    a{text-decoration:none;}
    /* Stop iOS/Gmail auto-linking dates & phone numbers in brand colours */
    a[x-apple-data-detectors],.unstyle-auto-detected-links a,.aBn{border-bottom:0!important;color:inherit!important;
      font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important;}
    /* Mobile */
    @media screen and (max-width:600px){
      .x-wrap{width:100%!important;max-width:100%!important;}
      .x-pad{padding-left:22px!important;padding-right:22px!important;}
      .x-h1{font-size:24px!important;line-height:1.28!important;}
      .x-btn{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important;}
    }
    /* Dark mode (Apple Mail, iOS, Outlook.com) */
    @media (prefers-color-scheme:dark){
      .x-body{background:${BRAND.darkPage}!important;}
      .x-card{background:${BRAND.darkCard}!important;}
      .x-card p,.x-card li,.x-card td,.x-card span,.x-h1{color:${BRAND.darkText}!important;}
      .x-muted,.x-muted a{color:${BRAND.darkMuted}!important;}
      .x-panel{background:${BRAND.inkSoft}!important;border-color:${BRAND.darkBorder}!important;}
      .x-panel td{border-color:${BRAND.darkBorder}!important;}
      .x-hr{border-color:${BRAND.darkBorder}!important;}
      .x-btn{color:#ffffff!important;}
    }
  </style>
</head>
<body class="x-body" style="margin:0;padding:0;width:100%;background:${BRAND.page};">
  <!-- Preheader: inbox preview line, hidden in the rendered body -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader}${preheaderPad}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.page};" class="x-body">
    <tr>
      <td align="center" style="padding:28px 12px 40px;">

        <!-- Ghost table keeps the 600px column in Outlook/Word -->
        <!--[if mso | IE]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="x-wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <!-- Header band -->
          <tr>
            <td style="background:${BRAND.ink};border-radius:14px 14px 0 0;padding:22px 32px;" class="x-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:${FONT};font-size:20px;font-weight:800;letter-spacing:.02em;color:#ffffff;">
                    XTECH<span style="color:${BRAND.gold};">.</span>
                  </td>
                  <td align="right" style="font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.62);">
                    Tư vấn giải pháp
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Brand hairline (solid fallback for clients without gradients) -->
          <tr>
            <td style="height:3px;font-size:0;line-height:0;background:${BRAND.cyan};background-image:linear-gradient(90deg,${BRAND.blue} 0%,${BRAND.cyan} 55%,${BRAND.gold} 100%);">&nbsp;</td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="x-card x-pad" style="background:${BRAND.card};padding:34px 32px 30px;">
              ${
                o.eyebrow
                  ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${BRAND.blue};">${escapeHtml(o.eyebrow)}</p>`
                  : ''
              }
              <h1 class="x-h1" style="margin:0 0 18px;font-family:${FONT};font-size:27px;line-height:1.25;font-weight:700;letter-spacing:-.01em;color:${BRAND.ink};">${escapeHtml(o.heading)}</h1>
              ${o.body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="x-card x-pad" style="background:${BRAND.card};border-radius:0 0 14px 14px;border-top:1px solid ${BRAND.border};padding:20px 32px 24px;">
              <div class="x-muted">${footer}</div>
            </td>
          </tr>

          <tr><td style="height:18px;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
        <!--[if mso | IE]></td></tr></table><![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Strips the HTML back to a readable plain-text twin (fallback when a template has no textBody). */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
