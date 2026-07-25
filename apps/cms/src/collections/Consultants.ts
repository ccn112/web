import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff, writeStaff } from '../access/index'

/** Consultants who receive HUMAN_READY leads and take over the conversation. */
export const Consultants: CollectionConfig = {
  slug: 'consultants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'active', 'specialties', 'updatedAt'],
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
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%' } },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'specialties',
      type: 'select',
      hasMany: true,
      label: 'Chuyên môn',
      options: [
        { value: 'x-ai', label: 'X.AI — AI doanh nghiệp' },
        { value: 'xbooking', label: 'XBooking — bán hàng BĐS' },
        { value: 'finerp', label: 'FinERP — tài chính & vận hành' },
        { value: 'xbuilding', label: 'XBuilding — vận hành tòa nhà' },
        { value: 'x-space', label: 'X.Space — không gian làm việc số' },
        { value: 'consulting', label: 'Tư vấn chiến lược / chuyển đổi số' },
      ],
    },
    {
      name: 'siteCodes',
      type: 'text',
      hasMany: true,
      label: 'Phụ trách site',
      admin: { description: 'Để trống = nhận lead của mọi site.' },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Người nhận mặc định',
      admin: { description: 'Nhận lead khi không tìm được chuyên gia phù hợp.' },
    },
    { name: 'user', type: 'relationship', relationTo: 'users', admin: { description: 'Tài khoản admin tương ứng (nếu có).' } },
  ],
}
