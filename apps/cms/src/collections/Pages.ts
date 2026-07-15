import type { CollectionConfig } from 'payload'
import { PAGE_TYPES } from '@x/shared-types'
import {
  createScoped,
  deleteScoped,
  readPublishedOrScoped,
  updateScoped,
} from '../access/index'
import { allBlocks } from '../blocks/index'
import { seoField, statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'siteCode', 'pageType', 'slug', 'status'],
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
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Path within the site, leading slash included (e.g. /san-pham/xai).' },
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: PAGE_TYPES.map((t) => ({ label: t, value: t })),
    },
    { name: 'locale', type: 'text', required: true, defaultValue: 'vi', index: true },
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 1500,
      admin: { description: 'Page summary; also the chatbot context (max 1500 chars).' },
    },
    { name: 'blocks', type: 'blocks', blocks: allBlocks },
    seoField,
    { name: 'suggestedPrompts', type: 'text', hasMany: true },
    {
      name: 'relatedPages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      admin: { description: 'Up to a handful of related pages for the chatbot to suggest.' },
    },
    statusField,
  ],
}
