import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'

/**
 * Server-side record for every signed resume link and device-verification OTP.
 * Only the SHA-256 *hash* of the token is stored, so reading this table cannot
 * mint a working link. Presence here is what makes single-use and revocation
 * possible (docs/REDIRECT_AND_DEEP_LINK_FLOW.md).
 */
export const ResumeTokens: CollectionConfig = {
  slug: 'resume-tokens',
  admin: {
    useAsTitle: 'tokenHash',
    defaultColumns: ['purpose', 'lead', 'conversation', 'expiresAt', 'usedAt', 'revoked'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    // Staff may revoke a token from admin; nothing else should be edited.
    update: ({ req: { user } }) => isStaff(user),
    delete: deleteAdmins,
  },
  fields: [
    { name: 'tokenHash', type: 'text', required: true, unique: true, index: true },
    {
      type: 'row',
      fields: [
        {
          name: 'purpose',
          type: 'select',
          required: true,
          defaultValue: 'resume',
          admin: { width: '50%' },
          options: [
            { value: 'resume', label: 'Mở lại hội thoại' },
            { value: 'verify', label: 'Xác minh thiết bị' },
          ],
        },
        {
          name: 'expiresAt',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lead', type: 'relationship', relationTo: 'leads', admin: { width: '50%' } },
        {
          name: 'conversation',
          type: 'relationship',
          relationTo: 'lead-conversations',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'expectedDeviceId',
      type: 'text',
      admin: { description: 'Thiết bị link được phát hành cho. Thiết bị khác phải xác minh email.' },
    },
    {
      label: 'OTP xác minh thiết bị',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        { name: 'otpHash', type: 'text' },
        {
          type: 'row',
          fields: [
            {
              name: 'otpExpiresAt',
              type: 'date',
              admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
            },
            { name: 'otpAttempts', type: 'number', defaultValue: 0, admin: { width: '50%' } },
          ],
        },
        { name: 'pendingDeviceId', type: 'text', admin: { description: 'Thiết bị đang chờ xác minh.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'usedAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'revoked', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
      ],
    },
  ],
}
