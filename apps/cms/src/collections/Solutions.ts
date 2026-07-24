import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { statusField } from '../fields/common'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

/** Business/audience/goal solutions. No seed data in MVP. */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'siteCode', 'category', 'status'],
    group: 'Content',
  },
  access: {
    read: readPublicOrStaff({ publishable: true }),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(false),
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'route', type: 'text', index: true, admin: { description: 'Đường dẫn trang, vd /giai-phap/du-lieu-va-ai hoặc /bo-giai-phap-x' } },
    { name: 'eyebrow', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { description: 'Ảnh nền hero (tùy chọn; để trống dùng nền mặc định).' } },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Theo chuỗi nghiệp vụ', value: 'chuoi-nghiep-vu' },
        { label: 'Theo đối tượng', value: 'doi-tuong' },
        { label: 'Theo mục tiêu', value: 'muc-tieu' },
      ],
    },
    { name: 'relatedProducts', type: 'text', hasMany: true, admin: { description: 'Slug sản phẩm liên quan: x-ai, xbooking, finerp, xbuilding, x-space.' } },
    {
      name: 'sections',
      type: 'array',
      admin: { description: 'Các section của trang giải pháp (theo thứ tự hiển thị).' },
      fields: [
        { name: 'sectionId', type: 'text' },
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'grid',
          options: [
            { label: 'Lưới card', value: 'grid' },
            { label: 'Ảnh bên phải', value: 'visual-right' },
            { label: 'Ảnh bên trái', value: 'visual-left' },
            { label: 'Chip', value: 'chips' },
            { label: 'Các bước', value: 'steps' },
          ],
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    { name: 'ctaTitle', type: 'text' },
    { name: 'ctaDescription', type: 'textarea' },
    { name: 'ctaImage', type: 'upload', relationTo: 'media' },
    statusField,
  ],
}
