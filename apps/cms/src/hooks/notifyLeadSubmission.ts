import type { CollectionAfterChangeHook } from 'payload'
import { renderFormSubmissionEmail } from '../lib/lead/email/formSubmission'

/** Recipients for lead notifications — falls back to the test/admin inbox in dev. */
function notifyRecipients(): string | null {
  const raw =
    process.env.LEAD_NOTIFY_TO ??
    process.env.MAIL_TEST_TO_ADDRESS ??
    process.env.SEED_ADMIN_EMAIL
  return raw && raw.trim() ? raw.trim() : null
}

/** Link mở đúng submission trong admin — cùng quy ước với `lead/email/send.ts`. */
function adminUrl(id: string): string {
  const base = (process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${base}/admin/collections/form-submissions/${id}`
}

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}

/**
 * Emails staff whenever a new form submission (contact / consultation-booking lead)
 * is created. The submission is already persisted before this runs, so a mail
 * failure is logged but never blocks the visitor's request.
 *
 * Nội dung email do `renderFormSubmissionEmail` dựng (HTML + plaintext, tiếng Việt);
 * hook này chỉ tra tên form / site / trang rồi gửi.
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
    // Resolve human-readable form + site + page names for the email.
    const formId = typeof doc.form === 'object' ? doc.form?.id : doc.form
    const siteId = typeof doc.site === 'object' ? doc.site?.id : doc.site
    const pageId = typeof doc.page === 'object' ? doc.page?.id : doc.page
    let formName = 'Form'
    let siteName = ''
    let pageTitle = ''
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
    if (pageId) {
      const page = await req.payload
        .findByID({ collection: 'pages', id: pageId, depth: 0, req })
        .catch(() => null)
      pageTitle = (page as { title?: string } | null)?.title ?? ''
    }

    const { subject, html, text } = renderFormSubmissionEmail({
      formName,
      siteName,
      pageTitle,
      payload: asRecord(doc.payload),
      consent: Boolean(doc.consent),
      createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : undefined,
      utm: asRecord(doc.utm),
      visitorSession: typeof doc.visitorSession === 'string' ? doc.visitorSession : undefined,
      adminUrl: adminUrl(String(doc.id)),
    })

    await req.payload.sendEmail({ to, subject, html, text })
  } catch (err) {
    req.payload.logger.error(
      { err },
      'notifyLeadSubmission: failed to send lead notification email',
    )
  }

  return doc
}
