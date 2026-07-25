import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'
import { HANDOFF_REASON_OPTIONS, LEAD_STATE_OPTIONS } from '../lib/lead/state-machine'

/**
 * One consultation thread, unified across channels. Web chat, inbound/outbound
 * email and consultant replies all append to the *same* conversation, so the AI
 * always reasons over one merged history (docs/EMAIL_REPLY_FLOW.md).
 *
 * `publicId` is the opaque id that appears in the Reply-To local part
 * (`lead+<publicId>@reply…`) and is the only conversation identifier the outside
 * world ever sees.
 */
export const LeadConversations: CollectionConfig = {
  slug: 'lead-conversations',
  admin: {
    useAsTitle: 'publicId',
    defaultColumns: ['publicId', 'lead', 'status', 'score', 'turnCount', 'updatedAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    update: ({ req: { user } }) => isStaff(user),
    delete: deleteAdmins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'publicId', type: 'text', required: true, unique: true, index: true, admin: { width: '50%' } },
        { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, index: true, admin: { width: '50%' } },
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
          admin: { width: '34%' },
        },
        { name: 'score', type: 'number', defaultValue: 0, admin: { width: '33%' } },
        {
          name: 'turnCount',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', description: 'Số lượt khách đã trao đổi (mọi kênh).' },
        },
      ],
    },
    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      label: 'Kênh đã dùng',
      options: [
        { value: 'web-chat', label: 'Web Chat' },
        { value: 'email', label: 'Email' },
        { value: 'consultant', label: 'Chuyên gia' },
      ],
    },
    {
      name: 'devices',
      type: 'relationship',
      relationTo: 'lead-devices',
      hasMany: true,
      label: 'Thiết bị liên kết',
    },
    {
      name: 'originDeviceId',
      type: 'text',
      label: 'Thiết bị khởi tạo',
      admin: {
        description:
          'Thiết bị đã tạo hội thoại này — được tiếp tục mà không cần OTP (không có dữ liệu cũ nào bị phơi ra). Mọi thiết bị khác phải xác minh email.',
      },
    },
    { name: 'siteCode', type: 'text' },
    {
      name: 'qualificationSummary',
      type: 'textarea',
      label: 'Tóm tắt AI',
      admin: { description: 'AI cập nhật sau mỗi lượt — dùng làm brief cho chuyên gia.' },
    },
    {
      name: 'collected',
      type: 'json',
      label: 'Slot đã thu thập',
      admin: { description: 'Giá trị 10 slot khai thác nhu cầu (khóa theo SLOTS).' },
    },
    {
      name: 'missingFields',
      type: 'json',
      label: 'Thông tin còn thiếu',
    },
    {
      name: 'recommendation',
      type: 'textarea',
      label: 'Đề xuất sơ bộ của AI',
    },
    {
      label: 'Chuyển giao chuyên gia',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'handoffReason',
              type: 'select',
              options: HANDOFF_REASON_OPTIONS,
              admin: { width: '50%' },
            },
            {
              name: 'handoffAt',
              type: 'date',
              admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'humanTakeoverAt',
              type: 'date',
              label: 'Chuyên gia vào hội thoại lúc',
              admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'aiPaused',
              type: 'checkbox',
              label: 'Tạm dừng AI',
              defaultValue: false,
              admin: { width: '50%', description: 'Khi bật, AI không tự trả lời hội thoại này nữa.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Nhịp gửi email',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'lastOutboundEmailAt',
              type: 'date',
              admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'outboundEmailCount',
              type: 'number',
              defaultValue: 0,
              admin: { width: '50%', description: 'Chống vòng lặp: giới hạn số email tự động mỗi hội thoại.' },
            },
          ],
        },
        {
          name: 'lastEmailMessageId',
          type: 'text',
          admin: { description: 'Message-ID email gần nhất — dùng để giữ threading (In-Reply-To).' },
        },
      ],
    },
  ],
}
