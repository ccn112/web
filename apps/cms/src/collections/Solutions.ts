import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

/** Business/audience/goal solutions. No seed data in MVP. */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'siteCode', 'category', 'status'],
    group: 'Content',
  },
  access: {
    read: readPublicOrStaff({ publishable: true }),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(false),
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Theo chuỗi nghiệp vụ', value: 'chuoi-nghiep-vu' },
        { label: 'Theo đối tượng', value: 'doi-tuong' },
        { label: 'Theo mục tiêu', value: 'muc-tieu' },
      ],
    },
    { name: 'summary', type: 'textarea' },
    statusField,
  ],
}
