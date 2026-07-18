import type { CollectionConfig } from 'payload'
import { deleteAdmins } from '../access/index'

/**
 * Lightweight chat identity keyed by browser device id. A visitor registers
 * (email + phone) to unlock deeper features (chat history, file uploads). These
 * are also leads — staff read them in admin. Capability-based like ChatSessions.
 */
export const ChatUsers: CollectionConfig = {
  slug: 'chat-users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'phone', 'deviceId', 'siteCode', 'createdAt'],
    group: 'Chat',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'deviceId', type: 'text', required: true, unique: true, index: true },
    { name: 'email', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'name', type: 'text' },
    { name: 'siteCode', type: 'text' },
  ],
}
