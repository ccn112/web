import type { CollectionAfterChangeHook } from 'payload'

/** Pull the first non-empty string value for any of the given keys from the payload. */
function pick(payload: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = payload[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

/** Minimal RFC-5322-ish sanity check so we never hand nodemailer a junk address. */
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Auto-reply confirmation sent to the visitor who submitted a lead form
 * (contact / consultation-booking). This is a transactional acknowledgement of
 * the visitor's own request, so it is sent regardless of the marketing
 * `consent` flag. Runs alongside `notifyLeadSubmission` (which alerts staff);
 * the submission is already persisted, so a mail failure is logged but never
 * blocks the visitor's request.
 */
export const autoReplyLeadSubmission: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const payload = (doc.payload && typeof doc.payload === 'object' ? doc.payload : {}) as Record<
    string,
    unknown
  >
  const to = pick(payload, ['email'])
  if (!to || !isEmail(to)) return doc

  try {
    const name = pick(payload, ['fullName', 'name'])

    // Site name for a friendly signature; fall back to the default brand.
    let siteName = ''
    const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site
    if (siteId) {
      const site = await req.payload
        .findByID({ collection: 'sites', id: siteId, depth: 0, req })
        .catch(() => null)
      siteName = (site as { name?: string } | null)?.name ?? ''
    }
    const brand = siteName || process.env.MAIL_FROM_NAME || 'XTECH'
    const greeting = name ? `Xin chào ${name},` : 'Xin chào,'

    const subject = `Đã nhận thông tin của bạn — ${brand}`
    const lines = [
      greeting,
      '',
      `Cảm ơn bạn đã liên hệ với ${brand}. Chúng tôi đã nhận được yêu cầu của bạn.`,
      'Trợ lý AI của chúng tôi sẽ gửi bạn phản hồi chi tiết trong khoảng 30 phút tới. Đội ngũ tư vấn cũng sẽ đồng hành cùng bạn khi cần.',
      '',
      'Nếu cần hỗ trợ gấp, bạn có thể phản hồi trực tiếp email này.',
      '',
      'Trân trọng,',
      `Đội ngũ ${brand}`,
    ]
    const text = lines.join('\n')
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937">${lines
      .map((l) => (l === '' ? '<br/>' : `<p style="margin:0 0 10px">${escapeHtml(l)}</p>`))
      .join('')}</div>`

    await req.payload.sendEmail({ to, subject, text, html })
  } catch (err) {
    req.payload.logger.error(
      { err },
      'autoReplyLeadSubmission: failed to send auto-reply email',
    )
  }

  return doc
}
