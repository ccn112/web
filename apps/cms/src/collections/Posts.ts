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
    {
      name: 'section',
      type: 'select',
      defaultValue: 'insight',
      index: true,
      options: [
        { label: 'Insight (Trung tâm tri thức)', value: 'insight' },
        { label: 'Tin tức (News)', value: 'news' },
        { label: 'Lưu trữ / khác (không lên listing)', value: 'archive' },
      ],
      admin: { description: 'Bài thuộc mục Insights (/insights) hay Tin tức (/tin-tuc).' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'category', type: 'text' },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Ảnh bìa / thumbnail (tải lên). Nếu để trống sẽ dùng Cover URL.' },
    },
    {
      name: 'coverUrl',
      type: 'text',
      admin: { description: 'Đường dẫn ảnh bìa mặc định (khi chưa tải ảnh lên).' },
    },
    { name: 'readTime', type: 'text', admin: { description: 'Vd: "6 phút đọc".' } },
    { name: 'date', type: 'text', admin: { description: 'Ngày hiển thị, vd: "24/07/2026".' } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    {
      name: 'relatedProducts',
      type: 'text',
      hasMany: true,
      admin: { description: 'Slug/tên sản phẩm liên quan để gợi ý cuối bài.' },
    },
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
