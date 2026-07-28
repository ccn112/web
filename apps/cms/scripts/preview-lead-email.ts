/**
 * Xem trước email "lead mới" gửi cho sale — không cần database, không gửi mail.
 *
 *   pnpm --filter @x/cms preview:lead-email
 *
 * Render vài tình huống thật (form đặt lịch đầy đủ, form liên hệ tối giản, form
 * chưa tick consent + field lạ) ra file HTML rồi in đường dẫn để mở bằng trình
 * duyệt. Dùng mỗi khi sửa `lib/lead/email/{layout,formSubmission}.ts`.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  renderFormSubmissionEmail,
  type FormSubmissionEmailInput,
} from '../src/lib/lead/email/formSubmission'

const CASES: Array<{ file: string; title: string; input: FormSubmissionEmailInput }> = [
  {
    file: 'lead-full.html',
    title: 'Đặt lịch tư vấn — form đầy đủ',
    input: {
      formName: 'Đặt lịch tư vấn',
      siteName: 'XTECH Corporate',
      pageTitle: 'Đặt lịch tư vấn giải pháp',
      consent: true,
      createdAt: '2026-07-28T09:12:00.000Z',
      visitorSession: 'sess_7f3a91c4',
      utm: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'proptech-q3' },
      adminUrl: 'http://localhost:3000/admin/collections/form-submissions/demo-1',
      payload: {
        fullName: 'Nguyễn Thị Minh Hằng',
        email: 'hang.nguyen@vinaland.vn',
        phone: '0903 118 227',
        company: 'Vinaland Group',
        jobTitle: 'Giám đốc Chuyển đổi số',
        products: ['XBooking', 'FinERP'],
        companyModel: 'Chủ đầu tư',
        userScale: '200 – 1.000',
        preferredTime: 'Tuần tới',
        priorityProblems:
          'Quản lý bảng hàng 4 dự án đang làm thủ công trên Excel, mỗi lần khoá căn phải gọi điện xác nhận.\nCần liên thông số liệu bán hàng sang tài chính để chốt doanh thu cuối tháng.',
        currentSystems: 'CRM tự phát triển (PHP), phần mềm kế toán Misa, Excel cho bảng hàng.',
        message:
          'Bên em đang chuẩn bị mở bán giai đoạn 2 vào tháng 9 nên muốn kịp triển khai trước đó. Ưu tiên xem demo phần bảng hàng và ký gửi cho sàn phân phối.',
        consent: true,
      },
    },
  },
  {
    file: 'lead-minimal.html',
    title: 'Liên hệ — form tối giản',
    input: {
      formName: 'Liên hệ',
      siteName: 'X.AI',
      consent: true,
      createdAt: '2026-07-28T02:40:00.000Z',
      adminUrl: 'http://localhost:3000/admin/collections/form-submissions/demo-2',
      payload: {
        fullName: 'Trần Quốc Huy',
        email: 'huy.tran@example.com',
        phone: '0987654321',
        message: 'Cho tôi xin báo giá X.AI.',
        consent: true,
      },
    },
  },
  {
    file: 'lead-no-consent.html',
    title: 'Chưa đồng ý nhận tư vấn + field lạ',
    input: {
      formName: 'Nhận tài liệu giải pháp',
      siteName: 'XBuilding',
      pageTitle: 'Giải pháp quản lý toà nhà',
      consent: false,
      createdAt: '2026-07-27T23:05:00.000Z',
      utm: { utm_source: 'facebook' },
      adminUrl: 'http://localhost:3000/admin/collections/form-submissions/demo-3',
      payload: {
        email: 'kd@toanhaminhkhai.vn',
        phone: '02871099xxx',
        company: 'BQL Toà nhà Minh Khai',
        buildingCount: 3,
        budgetRange: 'Chưa xác định',
        note: 'Gửi tài liệu qua email, chưa cần gọi.',
        consent: false,
      },
    },
  },
]

const outDir = join(tmpdir(), 'xtech-lead-email-preview')
mkdirSync(outDir, { recursive: true })

for (const c of CASES) {
  const { subject, html, text } = renderFormSubmissionEmail(c.input)
  const path = join(outDir, c.file)
  writeFileSync(path, html, 'utf8')
  console.log(`\n=== ${c.title} ===`)
  console.log(`Subject: ${subject}`)
  console.log(`HTML   : ${path}  (${html.length} ký tự)`)
  console.log('--- plaintext ---')
  console.log(text)
}

console.log(`\nMở thư mục để xem: ${outDir}`)
