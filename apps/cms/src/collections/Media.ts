import type { CollectionConfig } from 'payload'
import { deleteAdmins, writeStaff } from '../access/index'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    // Media is served publicly; only staff can manage it.
    read: () => true,
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    // Prod (USE_S3=false): point at a persistent volume via MEDIA_DIR so uploads
    // survive redeploys (container FS is ephemeral). Unset in dev → Payload default.
    ...(process.env.MEDIA_DIR ? { staticDir: process.env.MEDIA_DIR } : {}),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alt text is mandatory for accessibility (docs/04).' },
    },
    { name: 'caption', type: 'text' },
    { name: 'source', type: 'text' },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      admin: { description: 'Leave empty for assets shared across all sites.' },
    },
    {
      name: 'aiGenerated',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mark AI-generated imagery (do not auto-publish, docs/CLAUDE rule 10).' },
    },
  ],
}
