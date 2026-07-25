import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'
import { relayConsultantMessage } from '../hooks/relayConsultantMessage'

/**
 * A single message in a consultation thread, whatever the channel. The unified
 * transcript is what the AI reads, and what the UI renders with a source badge
 * (Email / Web Chat / Chuyên gia).
 *
 * `emailMessageId` is unique-indexed so a provider webhook delivered twice can
 * never duplicate a message or re-trigger the AI (docs/EMAIL_REPLY_FLOW.md).
 */
export const LeadMessages: CollectionConfig = {
  slug: 'lead-messages',
  admin: {
    useAsTitle: 'contentText',
    defaultColumns: ['conversation', 'channel', 'direction', 'role', 'createdAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    update: ({ req: { user } }) => isStaff(user),
    delete: deleteAdmins,
  },
  hooks: {
    // A consultant message posted here is emailed to the customer and shows up
    // in their web chat — one message, both channels.
    afterChange: [relayConsultantMessage],
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'lead-conversations',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'channel',
          type: 'select',
          required: true,
          admin: { width: '33%' },
          options: [
            { value: 'web-chat', label: 'Web Chat' },
            { value: 'email', label: 'Email' },
            { value: 'consultant', label: 'Chuyên gia' },
            { value: 'system', label: 'Hệ thống' },
          ],
        },
        {
          name: 'direction',
          type: 'select',
          required: true,
          admin: { width: '33%' },
          options: [
            { value: 'inbound', label: 'Khách → XTECH' },
            { value: 'outbound', label: 'XTECH → khách' },
          ],
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          admin: { width: '34%' },
          options: [
            { value: 'user', label: 'Khách hàng' },
            { value: 'assistant', label: 'Trợ lý AI' },
            { value: 'consultant', label: 'Chuyên gia' },
            { value: 'system', label: 'Hệ thống' },
          ],
        },
      ],
    },
    { name: 'contentText', type: 'textarea', required: true },
    { name: 'contentHtml', type: 'textarea', admin: { description: 'Chỉ dùng cho email (bản HTML gốc).' } },
    {
      label: 'Email metadata',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        { name: 'emailMessageId', type: 'text', unique: true, index: true },
        { name: 'emailInReplyTo', type: 'text' },
        { name: 'emailSubject', type: 'text' },
        { name: 'emailFrom', type: 'text' },
        { name: 'templateKey', type: 'text' },
      ],
    },
    { name: 'deviceId', type: 'text', admin: { description: 'Thiết bị đã gửi (chỉ với web chat).' } },
    { name: 'meta', type: 'json' },
  ],
}
