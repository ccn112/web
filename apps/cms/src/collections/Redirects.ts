import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'sourcePath',
    defaultColumns: ['sourcePath', 'destinationPath', 'siteCode', 'permanent'],
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
    { name: 'sourcePath', type: 'text', required: true },
    { name: 'destinationPath', type: 'text', required: true },
    { name: 'permanent', type: 'checkbox', defaultValue: true },
  ],
}
