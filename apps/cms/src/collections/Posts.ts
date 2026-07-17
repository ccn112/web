import type { CollectionConfig } from 'payload'
import {
  createScoped,
  deleteScoped,
  readPublishedOrScoped,
  updateScoped,
} from '../access/index'
import { seoField, statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'siteCode', 'category', 'tags', 'status'],
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
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'category', type: 'text' },
    {
      name: 'tags',
      label: 'Chủ đề (Tags)',
      type: 'text',
      hasMany: true,
      index: true,
      admin: {
        description:
          'Chủ đề để lọc/liệt kê bài viết. Mỗi tag là một mục; click tag trên site sẽ mở /insights/tag/<tag>. Vd: AI, Dữ liệu, Cloud, Security, PropTech.',
      },
    },
    { name: 'locale', type: 'text', required: true, defaultValue: 'vi', index: true },
    {
      name: 'body',
      type: 'json',
      admin: { description: 'Structured body nodes: [{ type: paragraph|heading, text }].' },
    },
    seoField,
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'reviewer', type: 'relationship', relationTo: 'users' },
    statusField,
  ],
}
