import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'

/**
 * Append-only audit trail for the lead pipeline: every AI turn, email sent or
 * received, token issued/used, device verified and handoff. Required by
 * docs/SECURITY_PRIVACY_RULES.md ("log đầy đủ hoạt động AI và consultant").
 */
export const LeadActivities: CollectionConfig = {
  slug: 'lead-activities',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'lead', 'conversation', 'channel', 'createdAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    // Audit trail: never editable, only deletable by an admin (retention).
    update: () => false,
    delete: deleteAdmins,
  },
  fields: [
    {
      name: 'type',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'vd: intake, ai_reply, email_sent, email_received, token_issued, device_verified, handoff' },
    },
    {
      type: 'row',
      fields: [
        { name: 'lead', type: 'relationship', relationTo: 'leads', index: true, admin: { width: '50%' } },
        {
          name: 'conversation',
          type: 'relationship',
          relationTo: 'lead-conversations',
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'channel',
          type: 'select',
          admin: { width: '50%' },
          options: [
            { value: 'web-chat', label: 'Web Chat' },
            { value: 'email', label: 'Email' },
            { value: 'consultant', label: 'Chuyên gia' },
            { value: 'system', label: 'Hệ thống' },
          ],
        },
        { name: 'actor', type: 'text', admin: { width: '50%', description: 'ai | customer | consultant | system' } },
      ],
    },
    { name: 'summary', type: 'text' },
    { name: 'detail', type: 'json' },
  ],
}
