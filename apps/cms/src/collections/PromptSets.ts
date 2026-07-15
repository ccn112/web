import type { CollectionConfig } from 'payload'
import { deleteAdmins, readPublicOrStaff, writeStaff } from '../access/index'
import { siteFields } from '../fields/site'
import { syncSiteCode } from '../hooks/syncSiteCode'

export const PromptSets: CollectionConfig = {
  slug: 'prompt-sets',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'siteCode'],
    group: 'Chatbot',
  },
  access: {
    // Prompt chips render publicly.
    read: readPublicOrStaff(),
    create: writeStaff,
    update: writeStaff,
    delete: deleteAdmins,
  },
  hooks: { beforeChange: [syncSiteCode] },
  fields: [
    ...siteFields(),
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    {
      name: 'prompts',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'prompt', type: 'text', required: true },
        {
          name: 'actionType',
          type: 'select',
          defaultValue: 'ask',
          options: ['ask', 'navigate', 'page', 'demo'].map((v) => ({ label: v, value: v })),
        },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
