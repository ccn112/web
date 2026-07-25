import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'
import { LEAD_STATE_OPTIONS } from '../lib/lead/state-machine'

/**
 * Qualified lead profile — the merged identity behind one or more devices and
 * conversations. Created from a website form, an AI-chat registration or an
 * inbound email. The ten qualification slots are mirrored here (denormalised
 * from the active conversation) so staff can filter/sort leads in admin.
 *
 * Writes go through the `/api/lead/*` routes using the Local API (which bypasses
 * access control), so public REST access stays closed — leads are PII.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'status', 'score', 'primaryNeed', 'updatedAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    // No public create/read: the intake routes use the Local API.
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    update: ({ req: { user } }) => isStaff(user),
    delete: deleteAdmins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'fullName', type: 'text', admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, index: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '33%' } },
        { name: 'company', type: 'text', admin: { width: '33%' } },
        { name: 'jobTitle', type: 'text', admin: { width: '34%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'web-form',
          admin: { width: '33%' },
          options: [
            { value: 'web-form', label: 'Form website' },
            { value: 'ai-chat', label: 'AI Chat' },
            { value: 'email', label: 'Email' },
            { value: 'consultant', label: 'Nhân sự nhập' },
          ],
        },
        { name: 'siteCode', type: 'text', index: true, admin: { width: '33%' } },
        { name: 'formCode', type: 'text', admin: { width: '34%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'NEW',
          index: true,
          options: LEAD_STATE_OPTIONS,
          admin: { width: '50%' },
        },
        {
          name: 'score',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%', description: 'Độ hoàn chỉnh hồ sơ (0–100).' },
        },
      ],
    },
    {
      label: 'Nhu cầu đã khai thác',
      type: 'collapsible',
      admin: { initCollapsed: false },
      fields: [
        { name: 'primaryNeed', type: 'textarea', label: 'Bài toán ưu tiên' },
        {
          type: 'row',
          fields: [
            { name: 'businessModel', type: 'text', label: 'Mô hình doanh nghiệp', admin: { width: '50%' } },
            { name: 'userScale', type: 'text', label: 'Quy mô người dùng', admin: { width: '50%' } },
          ],
        },
        { name: 'currentSystems', type: 'textarea', label: 'Hệ thống hiện hữu' },
        {
          type: 'row',
          fields: [
            { name: 'departments', type: 'text', label: 'Phòng ban liên quan', admin: { width: '50%' } },
            { name: 'urgency', type: 'text', label: 'Mức độ cấp thiết', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'targetTimeline', type: 'text', label: 'Thời gian triển khai', admin: { width: '50%' } },
            { name: 'infrastructure', type: 'text', label: 'Hạ tầng', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'demoOrQuote', type: 'text', label: 'Nhu cầu demo / báo giá', admin: { width: '50%' } },
            { name: 'decisionMaker', type: 'text', label: 'Người quyết định', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'assignedConsultant',
          type: 'relationship',
          relationTo: 'consultants',
          admin: { width: '50%' },
        },
        {
          name: 'lastConversation',
          type: 'relationship',
          relationTo: 'lead-conversations',
          admin: { width: '50%' },
        },
      ],
    },
    {
      label: 'Đồng thuận & xác thực',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'consent', type: 'checkbox', label: 'Đồng ý nhận tư vấn', admin: { width: '33%' } },
            { name: 'unsubscribed', type: 'checkbox', label: 'Đã hủy nhận email', admin: { width: '33%' } },
            {
              name: 'emailVerifiedAt',
              type: 'date',
              label: 'Xác thực email lúc',
              admin: { width: '34%', date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
    { name: 'notes', type: 'textarea', label: 'Ghi chú nội bộ' },
  ],
}
