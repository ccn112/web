import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff } from '../access/index'

/**
 * First-party device records (docs/IDENTITY_AND_SESSION_DESIGN.md).
 *
 * `deviceId` is a random UUID the browser keeps in localStorage. It provides
 * *continuity* only — it is never treated as authentication. A device becomes
 * `isTrusted` only after the owner proves control of the lead's email (OTP),
 * and only a trusted device may read conversation history.
 */
export const LeadDevices: CollectionConfig = {
  slug: 'lead-devices',
  admin: {
    useAsTitle: 'deviceId',
    defaultColumns: ['deviceId', 'contact', 'isTrusted', 'consentStatus', 'lastSeenAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: ({ req: { user } }) => isStaff(user),
    read: ({ req: { user } }) => isStaff(user),
    update: ({ req: { user } }) => isStaff(user),
    delete: deleteAdmins,
  },
  fields: [
    { name: 'deviceId', type: 'text', required: true, unique: true, index: true },
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'leads',
      label: 'Lead đã hợp nhất',
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstSeenAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'lastSeenAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'consentStatus',
          type: 'select',
          defaultValue: 'unknown',
          admin: { width: '50%' },
          options: [
            { value: 'unknown', label: 'Chưa xác định' },
            { value: 'granted', label: 'Đã đồng ý' },
            { value: 'denied', label: 'Đã từ chối' },
          ],
        },
        {
          name: 'isTrusted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Đã xác minh email trên thiết bị này — được phép xem lịch sử hội thoại.',
          },
        },
      ],
    },
    { name: 'siteCode', type: 'text' },
    {
      name: 'trustedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
