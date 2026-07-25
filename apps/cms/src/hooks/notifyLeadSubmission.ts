import type { CollectionAfterChangeHook } from 'payload'

/** Recipients for lead notifications — falls back to the test/admin inbox in dev. */
function notifyRecipients(): string | null {
  const raw =
    process.env.LEAD_NOTIFY_TO ??
    process.env.MAIL_TEST_TO_ADDRESS ??
    process.env.SEED_ADMIN_EMAIL
  return raw && raw.trim() ? raw.trim() : null
}

function renderPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return String(payload ?? '')
  return Object.entries(payload as Record<string, unknown>)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
    .join('\n')
}

/**
 * Emails staff whenever a new form submission (contact / consultation-booking lead)
 * is created. The submission is already persisted before this runs, so a mail
 * failure is logged but never blocks the visitor's request.
 */
export const notifyLeadSubmission: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const to = notifyRecipients()
  if (!to) return doc

  try {
    // Resolve human-readable form + site names for the email subject/body.
    const formId = typeof doc.form === 'object' ? doc.form?.id : doc.form
    const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site
    let formName = 'Form'
    let siteName = ''
    if (formId) {
      const form = await req.payload
        .findByID({ collection: 'forms', id: formId, depth: 0, req })
        .catch(() => null)
      formName = (form as { name?: string } | null)?.name ?? formName
    }
    if (siteId) {
      const site = await req.payload
        .findByID({ collection: 'sites', id: siteId, depth: 0, req })
        .catch(() => null)
      siteName = (site as { name?: string } | null)?.name ?? ''
    }

    const body = renderPayload(doc.payload)
    const subject = `[Lead] ${formName}${siteName ? ` — ${siteName}` : ''}`
    const text = [
      `Có lượt gửi form mới: ${formName}`,
      siteName ? `Site: ${siteName}` : null,
      `Thời gian: ${doc.createdAt ?? ''}`,
      `Đồng ý nhận tư vấn (consent): ${doc.consent ? 'Có' : 'Không'}`,
      '',
      '--- Nội dung ---',
      body,
    ]
      .filter((l) => l !== null)
      .join('\n')

    await req.payload.sendEmail({ to, subject, text })
  } catch (err) {
    req.payload.logger.error(
      { err },
      'notifyLeadSubmission: failed to send lead notification email',
    )
  }

  return doc
}
