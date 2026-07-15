import type { CollectionConfig } from 'payload'
import {
  createScoped,
  deleteScoped,
  readPublishedOrScoped,
  updateScoped,
} from '../access/index'
import { statusField } from '../fields/common'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'primaryDomain', 'status'],
    group: 'System',
  },
  access: {
    read: readPublishedOrScoped('code'),
    create: createScoped,
    update: updateScoped('code'),
    delete: deleteScoped('code'),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable site code, e.g. corporate, xbooking.' },
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'primaryDomain',
      type: 'text',
      index: true,
      admin: { description: 'Host used to resolve this site in production, e.g. xbooking.vn.' },
    },
    { name: 'product', type: 'text' },
    { name: 'tagline', type: 'textarea' },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'primary', type: 'text' },
        { name: 'accent', type: 'text' },
        { name: 'surface', type: 'text' },
        { name: 'style', type: 'text' },
      ],
    },
    {
      name: 'chatbotConfig',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'welcome', type: 'textarea' },
        { name: 'defaultPrompts', type: 'text', hasMany: true },
      ],
    },
    statusField,
  ],
}
