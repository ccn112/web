import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

/** Challenge / solution / architecture / results case studies. No seed data in MVP. */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'siteCode', 'client', 'status'],
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
    { name: 'client', type: 'text' },
    { name: 'challenge', type: 'textarea' },
    { name: 'solution', type: 'textarea' },
    { name: 'architecture', type: 'textarea' },
    {
      name: 'results',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    statusField,
  ],
}
