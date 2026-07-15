import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

/** Reusable FAQ entries. No seed data in MVP (seeded FAQ content lives inline in faq blocks). */
export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'siteCode'],
    group: 'Content',
  },
  access: {
    read: readPublicOrStaff(),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(false),
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'tags', type: 'text', hasMany: true },
  ],
}
