import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { statusField } from '../fields/common'

/**
 * Canonical product data for the 5 products (used in cards and JSON-LD).
 * No seed data in MVP; managed in the admin.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'status'],
    group: 'Content',
  },
  access: {
    read: readPublicOrStaff({ publishable: true }),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'tagline', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'href', type: 'text' },
    statusField,
  ],
}
