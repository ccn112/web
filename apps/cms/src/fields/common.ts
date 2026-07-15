import type { Field } from 'payload'
import { CONTENT_STATUSES } from '@x/shared-types'

/** Editorial workflow status (mirrors db/schema.sql content_status). */
export const statusField: Field = {
  name: 'status',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  index: true,
  options: CONTENT_STATUSES.map((s) => ({ label: s, value: s })),
  admin: {
    position: 'sidebar',
    description: 'draft → review → approved → published → archived',
  },
}

/** SEO group used by Pages and Posts. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Metadata for search engines and social sharing.' },
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'index', type: 'checkbox', defaultValue: true, label: 'Allow indexing' },
    { name: 'follow', type: 'checkbox', defaultValue: true, label: 'Follow links' },
    { name: 'canonical', type: 'text' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}

/** A labelled link ({ label, href }). */
export const ctaLinkFields = (): Field[] => [
  { name: 'label', type: 'text', required: true },
  { name: 'href', type: 'text', required: true },
]

/** Base fields shared by every block (docs/04_PAGE_BLOCKS.md BaseBlock). */
export const blockBaseFields = (): Field[] => [
  {
    name: 'anchorId',
    type: 'text',
    admin: { description: 'Stable anchor so the chatbot can deep-link to this section.' },
  },
  {
    name: 'theme',
    type: 'select',
    defaultValue: 'light',
    options: ['light', 'soft', 'dark', 'brand'].map((v) => ({ label: v, value: v })),
  },
  {
    name: 'padding',
    type: 'select',
    defaultValue: 'normal',
    options: ['compact', 'normal', 'large'].map((v) => ({ label: v, value: v })),
  },
]
