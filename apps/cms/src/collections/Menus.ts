import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'siteCode', 'locale'],
    group: 'Navigation',
  },
  access: {
    read: readPublicOrStaff(),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(),
    { name: 'code', type: 'text', required: true, defaultValue: 'main' },
    { name: 'locale', type: 'text', required: true, defaultValue: 'vi' },
    {
      name: 'items',
      type: 'json',
      required: true,
      admin: {
        description: 'Nested menu tree: [{ label, href, children?: [...] }].',
      },
    },
  ],
}
