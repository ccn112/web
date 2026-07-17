import type { CollectionConfig } from 'payload'
import {
  createScoped,
  deleteScoped,
  readPublishedOrScoped,
  updateScoped,
} from '../access/index'
import { statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

const VISUAL_TYPES = [
  'hub-spoke',
  'maturity-radar',
  'architecture-stack',
  'process-evolution',
  'data-platform',
  'integration-hub',
  'adoption-journey',
  'control-tower',
] as const

/** Reused for both `items` and `process` (same shape: an ordered titled entry). */
const entryFields = (): CollectionConfig['fields'] => [
  { name: 'itemId', type: 'text', required: true },
  { name: 'order', type: 'number' },
  { name: 'title', type: 'text', required: true },
  { name: 'description', type: 'textarea', required: true },
  {
    name: 'side',
    type: 'select',
    options: ['left', 'right', 'top', 'bottom'].map((v) => ({ label: v, value: v })),
  },
  { name: 'icon', type: 'text', admin: { description: 'Tên icon lucide (kebab-case), tùy chọn.' } },
]

/**
 * Bespoke service sections (SET C02 Digital Transformation Services).
 * The layout is a coded component picked by `visualType`; all copy lives here so
 * it is CMS-managed (never hardcoded in the frontend). A section can appear on
 * several routes via `routes`.
 */
export const ServiceSections: CollectionConfig = {
  slug: 'service-sections',
  labels: { singular: 'Service Section', plural: 'Service Sections' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sectionId', 'visualType', 'siteCode', 'status'],
    group: 'Content',
  },
  access: {
    read: readPublishedOrScoped('siteCode'),
    create: createScoped,
    update: updateScoped('siteCode'),
    delete: deleteScoped('siteCode'),
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(),
    { name: 'sectionId', type: 'text', required: true, index: true },
    {
      name: 'visualType',
      type: 'select',
      required: true,
      options: VISUAL_TYPES.map((v) => ({ label: v, value: v })),
      admin: { description: 'Kiểu bố cục hiển thị (component tương ứng dựng layout).' },
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'routes',
      type: 'text',
      hasMany: true,
      required: true,
      index: true,
      admin: { description: 'Các path hiển thị section này, vd: /dich-vu/chuyen-doi-so' },
    },
    {
      name: 'order',
      type: 'number',
      admin: { description: 'Thứ tự trong một route (tăng dần).', position: 'sidebar' },
    },
    { name: 'items', type: 'array', fields: entryFields() },
    { name: 'process', type: 'array', fields: entryFields() },
    {
      name: 'outcomes',
      type: 'array',
      fields: [
        { name: 'itemId', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'icon', type: 'text' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'locale', type: 'text', required: true, defaultValue: 'vi', index: true },
    statusField,
  ],
}
