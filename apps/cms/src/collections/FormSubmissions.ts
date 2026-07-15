import type { CollectionConfig } from 'payload'
import { deleteAdmins, submissionsCreate, submissionsRead } from '../access/index'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['form', 'site', 'consent', 'createdAt'],
    group: 'Forms',
  },
  access: {
    // Anyone may submit; leads are private and readable by staff only.
    create: submissionsCreate,
    read: submissionsRead,
    update: deleteAdmins,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'page', type: 'relationship', relationTo: 'pages' },
    { name: 'visitorSession', type: 'text' },
    { name: 'payload', type: 'json', required: true },
    { name: 'utm', type: 'json' },
    { name: 'consent', type: 'checkbox', defaultValue: false },
  ],
}
