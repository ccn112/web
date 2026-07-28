/**
 * Xác minh đường gửi thật: đọc một form-submission có sẵn trong DB, render email
 * lead rồi gửi qua đúng SMTP đang cấu hình, và IN KẾT QUẢ của nodemailer.
 *
 * Cần thiết vì `notifyLeadSubmission` cố tình nuốt lỗi gửi mail (không được làm
 * fail request của khách) — nhìn HTTP 201 của submission không chứng minh được
 * email đã đi.
 *
 *   pnpm --filter @x/cms exec payload run ./scripts/verify-lead-email-send.ts <submissionId>
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { renderFormSubmissionEmail } from '../src/lib/lead/email/formSubmission'

const id = process.argv[2]
if (!id) {
  console.error('Thiếu submissionId. Dùng: payload run ./scripts/verify-lead-email-send.ts <id>')
  process.exit(1)
}

const payload = await getPayload({ config })

const doc = await payload.findByID({ collection: 'form-submissions', id, depth: 1 })
const rel = (v: unknown, key: string): string =>
  v && typeof v === 'object' ? String((v as Record<string, unknown>)[key] ?? '') : ''

const { subject, html, text } = renderFormSubmissionEmail({
  formName: rel(doc.form, 'name') || 'Form',
  siteName: rel(doc.site, 'name'),
  pageTitle: rel(doc.page, 'title'),
  payload: (doc.payload ?? {}) as Record<string, unknown>,
  consent: Boolean(doc.consent),
  createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : undefined,
  utm: (doc.utm ?? {}) as Record<string, unknown>,
  visitorSession: typeof doc.visitorSession === 'string' ? doc.visitorSession : undefined,
  adminUrl: `${(process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/admin/collections/form-submissions/${id}`,
})

const to =
  process.env.LEAD_NOTIFY_TO ?? process.env.MAIL_TEST_TO_ADDRESS ?? process.env.SEED_ADMIN_EMAIL
console.log('Người nhận :', to)
console.log('Subject    :', subject)
console.log('HTML       :', html.length, 'ký tự · plaintext:', text.length, 'ký tự')

const info = await payload.sendEmail({ to, subject, html, text })
console.log('Kết quả SMTP:', JSON.stringify(info, null, 2))
process.exit(0)
