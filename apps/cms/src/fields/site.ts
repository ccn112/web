import type { Field } from 'payload'

/**
 * The `site` relationship + denormalized `siteCode`. Use together with the `syncSiteCode`
 * beforeChange hook. `siteCode` is read-only in the admin (derived from `site`).
 */
export const siteFields = (required = true): Field[] => [
  {
    name: 'site',
    type: 'relationship',
    relationTo: 'sites',
    required,
    index: true,
  },
  {
    name: 'siteCode',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
      position: 'sidebar',
      description: 'Auto-filled from the selected site.',
    },
  },
]
