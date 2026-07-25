import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff, writeStaff } from '../access/index'
import { LEAD_STATE_OPTIONS } from '../lib/lead/state-machine'

/**
 * Editable transactional email templates. Code ships professional defaults
 * (src/lib/lead/email/templates.ts); on first send they are upserted here once,
 * after which marketing owns the copy in admin without a deploy.
 *
 * `htmlBody` holds only the *content* fragment — the outer responsive shell
 * (header, footer, dark-mode, Outlook fallbacks) is applied by the renderer, so
 * editors cannot accidentally break email-client compatibility.
 */
export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['templateKey', 'name', 'audience', 'triggerStatus', 'active', 'version'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: writeStaff,
    read: ({ req: { user } }) => isStaff(user),
    update: writeStaff,
    delete: deleteAdmins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'templateKey', type: 'text', required: true, unique: true, index: true, admin: { width: '50%' } },
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'audience',
          type: 'select',
          required: true,
          defaultValue: 'customer',
          admin: { width: '33%' },
          options: [
            { value: 'customer', label: 'Khách hàng' },
            { value: 'consultant', label: 'Đội tư vấn' },
          ],
        },
        {
          name: 'triggerStatus',
          type: 'select',
          options: LEAD_STATE_OPTIONS,
          admin: { width: '33%' },
        },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '34%' } },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: { description: 'Hỗ trợ biến {{customer_name}}, {{company_name}}, {{primary_need}}, {{lead_score}}…' },
    },
    {
      name: 'preheader',
      type: 'text',
      admin: { description: 'Dòng xem trước trong inbox (ẩn trong nội dung email).' },
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Tiêu đề lớn trong thân email.' },
    },
    {
      name: 'htmlBody',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Chỉ phần nội dung (đoạn <p>, danh sách…). Khung email chuẩn (header/footer/responsive) do hệ thống bọc ngoài.',
      },
    },
    { name: 'textBody', type: 'textarea', required: true, admin: { description: 'Bản plain-text.' } },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
        {
          name: 'ctaUrlVar',
          type: 'text',
          admin: { width: '50%', description: 'Tên biến chứa URL nút, ví dụ resume_url.' },
        },
      ],
    },
    { name: 'version', type: 'number', defaultValue: 1 },
  ],
}
