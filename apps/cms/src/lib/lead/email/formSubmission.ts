/**
 * Nội dung email nội bộ báo "có lead mới từ form website" gửi cho sale XTECH.
 *
 * Trước đây email này là plaintext (`payload.sendEmail({ text })`), dán nguyên
 * cặp `key: value` của JSON payload — sale phải tự dịch tên field. Ở đây nội
 * dung được dựng bằng đúng khung HTML mà luồng tư vấn lead đang dùng
 * (`renderEmailShell`), toàn bộ nhãn là tiếng Việt, và vẫn kèm bản plaintext
 * song sinh cho client không đọc HTML.
 *
 * Module này **thuần** — không Payload, không I/O — nên render/xem trước được
 * mà không cần database hay SMTP: `pnpm --filter @x/cms preview:lead-email`
 * (xem `apps/cms/scripts/preview-lead-email.ts`).
 */

import { FIELD_LIBRARY } from '@x/shared-types'
import {
  button,
  callout,
  escapeHtml,
  factTable,
  htmlToText,
  label,
  p,
  quote,
  renderEmailShell,
} from './layout'

/* ------------------------------------------------------------------ nhãn field */

/**
 * Nhãn tiếng Việt cho các field mà `FIELD_LIBRARY` chưa có — đây là các field
 * riêng của ba form lead ở `apps/clay/src/data/lead-content.ts`. Giữ nguyên câu
 * chữ như trên form để sale đọc email thấy đúng thứ khách đã nhìn thấy.
 */
const EXTRA_LABELS: Record<string, string> = {
  products: 'Sản phẩm quan tâm',
  preferredTime: 'Thời gian mong muốn',
  companyModel: 'Mô hình doanh nghiệp',
  userScale: 'Quy mô người dùng',
  priorityProblems: 'Bài toán ưu tiên',
  currentSystems: 'Hệ thống đang dùng',
  message: 'Nội dung khách cần trao đổi',
  // Nhãn cho vài field phổ biến nếu form thêm về sau — đỡ rơi vào humanize().
  note: 'Ghi chú',
  budget: 'Ngân sách dự kiến',
  budgetRange: 'Ngân sách dự kiến',
  timeline: 'Tiến độ mong muốn',
  address: 'Địa chỉ',
  website: 'Website',
  // Tham số marketing — giữ tên gốc trong ngoặc để marketing đối chiếu được.
  utm_source: 'Nguồn (utm_source)',
  utm_medium: 'Kênh (utm_medium)',
  utm_campaign: 'Chiến dịch (utm_campaign)',
  utm_term: 'Từ khoá (utm_term)',
  utm_content: 'Biến thể (utm_content)',
  gclid: 'Google Ads (gclid)',
  fbclid: 'Facebook Ads (fbclid)',
  referrer: 'Trang dẫn tới',
}

const LABELS: Record<string, string> = {
  ...Object.fromEntries(Object.entries(FIELD_LIBRARY).map(([k, f]) => [k, f.label])),
  ...EXTRA_LABELS,
}

/** `priorityProblems` -> `Priority problems`: cứu cánh cho field form thêm về sau. */
function humanize(key: string): string {
  const words = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const labelFor = (key: string): string => LABELS[key] ?? humanize(key)

/* -------------------------------------------------------------- chuẩn hoá giá trị */

/** Một giá trị JSON bất kỳ -> chuỗi người đọc được (chưa escape). */
function toText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Có' : 'Không'
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value).trim()
}

const multiline = (s: string): string => escapeHtml(s).replace(/\r?\n/g, '<br />')

/** Thứ tự field trong email — quan trọng trước, không phụ thuộc thứ tự JSON. */
const CONTACT_KEYS = ['fullName', 'email', 'phone', 'company', 'jobTitle'] as const
const DETAIL_KEYS = [
  'products',
  'productInterest',
  'deploymentModel',
  'companyModel',
  'userScale',
  'preferredTime',
] as const
/** Field tự luận — hiển thị thành khối riêng, nhồi vào bảng sẽ chật và khó đọc. */
const NARRATIVE_KEYS = ['message', 'priorityProblems', 'currentSystems'] as const
/** Đã thể hiện ở khối "Nguồn & bối cảnh", không lặp lại trong bảng thông tin. */
const SKIP_KEYS = new Set<string>(['consent'])

/** Chuỗi dài hoặc nhiều dòng thì đọc dạng khối dễ hơn dạng ô bảng. */
const isNarrative = (v: string): boolean => v.includes('\n') || v.length > 90

/* ----------------------------------------------------------------- thời gian VN */

const TZ = 'Asia/Ho_Chi_Minh'

/**
 * "14:32 · Thứ Ba, 28/07/2026 (giờ VN)".
 *
 * Không dùng `dateStyle: 'full' + timeStyle` — locale vi-VN cho ra
 * "lúc 14:32 Thứ Ba, 28 tháng 7, 2026", giờ đứng trước thứ nên đọc rất ngược.
 */
function formatVN(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const time = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  }).format(d)
  const date = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TZ,
  }).format(d)
  return `${time} · ${date} (giờ VN)`
}

/* --------------------------------------------------------------------- kiểu vào */

export type FormSubmissionEmailInput = {
  /** Tên form khách đã gửi, ví dụ "Đặt lịch tư vấn". */
  formName: string
  /** Tên website/site khách gửi từ đó (rỗng nếu không xác định). */
  siteName?: string
  /** Tiêu đề trang chứa form. */
  pageTitle?: string
  /** Nội dung form: `{ fullName, email, phone, ... }`. */
  payload: Record<string, unknown>
  /** Khách có tick đồng ý nhận tư vấn hay không. */
  consent: boolean
  /** ISO time lúc submission được tạo. */
  createdAt?: string
  /** UTM đi kèm (nếu website gửi lên). */
  utm?: Record<string, unknown> | null
  /** Mã phiên khách — để đối chiếu với hội thoại chat. */
  visitorSession?: string
  /** Link mở submission trong X-CMS. */
  adminUrl?: string
}

export type RenderedEmail = { subject: string; html: string; text: string }

/* ------------------------------------------------------------------- renderer */

export function renderFormSubmissionEmail(input: FormSubmissionEmailInput): RenderedEmail {
  const { payload, formName, siteName, pageTitle, consent, adminUrl } = input

  const val = (key: string): string => toText(payload[key])
  const customerName = val('fullName') || val('email') || 'Khách chưa để lại tên'
  const company = val('company')
  const email = val('email')
  const phone = val('phone')
  const time = formatVN(input.createdAt)

  /* -- Khối 1: thông tin khách hàng ---------------------------------------- */
  const contactRows = CONTACT_KEYS.filter((k) => val(k)).map((k) => ({
    label: labelFor(k),
    value: val(k),
  }))

  /* -- Khối 2: nhu cầu dạng chọn ------------------------------------------- */
  const detailRows = DETAIL_KEYS.filter((k) => val(k)).map((k) => ({
    label: labelFor(k),
    value: val(k),
  }))

  /* -- Khối 3: field tự luận + mọi field lạ form thêm về sau ---------------- */
  const known = new Set<string>([...CONTACT_KEYS, ...DETAIL_KEYS, ...NARRATIVE_KEYS])
  const narrative: Array<{ label: string; value: string }> = []
  for (const k of NARRATIVE_KEYS) {
    if (val(k)) narrative.push({ label: labelFor(k), value: val(k) })
  }
  for (const k of Object.keys(payload)) {
    if (known.has(k) || SKIP_KEYS.has(k)) continue
    const v = val(k)
    if (!v) continue
    if (isNarrative(v)) narrative.push({ label: labelFor(k), value: v })
    else detailRows.push({ label: labelFor(k), value: v })
  }

  /* -- Khối 4: nguồn & bối cảnh -------------------------------------------- */
  const contextRows: Array<{ label: string; value: string }> = []
  contextRows.push({ label: 'Form', value: formName })
  if (siteName) contextRows.push({ label: 'Website', value: siteName })
  if (pageTitle) contextRows.push({ label: 'Trang gửi form', value: pageTitle })
  if (time) contextRows.push({ label: 'Thời điểm gửi', value: time })
  contextRows.push({ label: 'Đồng ý nhận tư vấn', value: consent ? 'Có' : 'Không' })
  for (const [k, v] of Object.entries(input.utm ?? {})) {
    const t = toText(v)
    if (t) contextRows.push({ label: labelFor(k), value: t })
  }
  if (input.visitorSession) {
    contextRows.push({ label: 'Mã phiên khách', value: input.visitorSession })
  }

  /* -- Ghép HTML ------------------------------------------------------------ */
  const heading = company ? `${customerName} — ${company}` : customerName
  const contactLine = [
    phone ? `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ''))}">Gọi ${escapeHtml(phone)}</a>` : '',
    email ? `<a href="mailto:${escapeHtml(email)}">Gửi email ${escapeHtml(email)}</a>` : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')

  const body = [
    callout(
      `Khách vừa gửi <strong>${escapeHtml(formName)}</strong>${
        siteName ? ` trên <strong>${escapeHtml(siteName)}</strong>` : ''
      }${time ? ` lúc ${escapeHtml(time)}` : ''}. Liên hệ càng sớm càng tốt — lead mới nguội rất nhanh.`,
    ),
    consent
      ? ''
      : callout(
          'Khách <strong>chưa tick đồng ý nhận tư vấn</strong>. Chỉ liên hệ đúng nội dung yêu cầu này, không đưa vào danh sách gửi email marketing.',
          'urgent',
        ),
    contactRows.length ? label('Thông tin khách hàng') + factTable(contactRows) : '',
    contactLine ? p(contactLine) : '',
    detailRows.length ? label('Nhu cầu khách chọn') + factTable(detailRows) : '',
    ...narrative.map((n) => label(n.label) + quote(multiline(n.value))),
    label('Nguồn & bối cảnh') + factTable(contextRows),
    adminUrl ? button({ href: adminUrl, text: 'Mở lead trong X-CMS' }) : '',
  ]
    .filter(Boolean)
    .join('\n')

  const html = renderEmailShell({
    preheader: [formName, siteName, phone || email, time].filter(Boolean).join(' · '),
    eyebrow: 'Lead mới từ website',
    heading,
    body,
    internal: true,
  })

  /* -- Bản plaintext song sinh --------------------------------------------- */
  const text = [
    `[LEAD MỚI] ${heading}`,
    `Khách vừa gửi ${formName}${siteName ? ` trên ${siteName}` : ''}${time ? ` lúc ${time}` : ''}.`,
    consent
      ? ''
      : 'LƯU Ý: khách CHƯA tick đồng ý nhận tư vấn — chỉ liên hệ đúng nội dung yêu cầu này.',
    contactRows.length ? '\nTHÔNG TIN KHÁCH HÀNG' : '',
    ...contactRows.map((r) => `- ${r.label}: ${r.value}`),
    detailRows.length ? '\nNHU CẦU KHÁCH CHỌN' : '',
    ...detailRows.map((r) => `- ${r.label}: ${r.value}`),
    ...narrative.map((n) => `\n${n.label.toUpperCase()}\n${n.value}`),
    '\nNGUỒN & BỐI CẢNH',
    ...contextRows.map((r) => `- ${r.label}: ${r.value}`),
    adminUrl ? `\nMở lead trong X-CMS: ${adminUrl}` : '',
    '',
    '— Email nội bộ tự động từ hệ thống XTECH. Không chuyển tiếp ra ngoài.',
  ]
    .filter((l) => l !== '')
    .join('\n')

  const subject = `[Lead mới] ${customerName}${company ? ` · ${company}` : ''} — ${formName}${
    siteName ? ` (${siteName})` : ''
  }`

  return { subject, html, text: text || htmlToText(html) }
}
