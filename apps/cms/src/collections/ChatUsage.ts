import type { CollectionConfig } from 'payload'
import { deleteAdmins } from '../access/index'

/**
 * Daily chat usage rollup: one row per (day × provider × model) with total
 * requests, tokens and estimated cost. Staff read this in admin to monitor
 * traffic and spend. Written by the clay /api/chat route (capability-based;
 * `key` is the natural unique id).
 */
export const ChatUsage: CollectionConfig = {
  slug: 'chat-usage',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['day', 'provider', 'model', 'requests', 'tokensIn', 'tokensOut', 'estCostUsd'],
    group: 'Chat',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'day', type: 'text', index: true },
    { name: 'provider', type: 'text' },
    { name: 'model', type: 'text' },
    { name: 'requests', type: 'number', defaultValue: 0 },
    { name: 'tokensIn', type: 'number', defaultValue: 0 },
    { name: 'tokensOut', type: 'number', defaultValue: 0 },
    { name: 'estCostUsd', type: 'number', defaultValue: 0, admin: { description: 'Chi phí tạm tính (USD).' } },
  ],
}
