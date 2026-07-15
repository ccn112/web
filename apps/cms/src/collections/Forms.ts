import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
    group: 'Forms',
  },
  access: {
    // Forms are read publicly (to render). Submissions are handled by FormSubmissions.
    read: readPublicOrStaff(),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'siteScope',
      type: 'text',
      hasMany: true,
      admin: { description: 'Site codes this form is available on.' },
    },
    {
      name: 'fields',
      type: 'text',
      hasMany: true,
      admin: { description: 'Ordered field keys (resolved via FIELD_LIBRARY in @x/shared-types).' },
    },
    { name: 'successMessage', type: 'textarea' },
  ],
}
