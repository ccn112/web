import type { CollectionConfig } from 'payload'
import { deleteAdmins } from '../access/index'

/**
 * AI chat sessions, keyed by an anonymous browser device id (random UUID stored
 * in localStorage). The clay `/api/chat*` routes mediate all reads/writes and
 * always scope by `deviceId` — public access here is capability-based (the
 * random device id is the capability). Staff browse sessions in admin to mine
 * quality conversations for enriching articles (`flaggedQuality`).
 */
export const ChatSessions: CollectionConfig = {
  slug: 'chat-sessions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'deviceId', 'siteCode', 'messageCount', 'flaggedQuality', 'updatedAt'],
    group: 'Chat',
  },
  access: {
    // Capability-based: the random deviceId gates access; clay always filters by it.
    create: () => true,
    read: () => true,
    update: () => true,
    delete: deleteAdmins,
  },
  fields: [
    { name: 'deviceId', type: 'text', required: true, index: true },
    { name: 'sessionId', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text' },
    { name: 'siteCode', type: 'text', index: true },
    { name: 'lastRoute', type: 'text' },
    // messages: Array<{ role: 'user'|'assistant', content: string, images?: number, ts: string }>
    { name: 'messages', type: 'json', required: true, defaultValue: [] },
    { name: 'messageCount', type: 'number', defaultValue: 0 },
    // Usage & estimated cost (cumulative for the session).
    { name: 'provider', type: 'text' },
    { name: 'model', type: 'text' },
    { name: 'tokensIn', type: 'number', defaultValue: 0 },
    { name: 'tokensOut', type: 'number', defaultValue: 0 },
    { name: 'estCostUsd', type: 'number', defaultValue: 0, admin: { description: 'Chi phí tạm tính (USD) của phiên.' } },
    // User removed it from their own history view (soft-hide; staff still see it).
    { name: 'hiddenByUser', type: 'checkbox', defaultValue: false },
    // Staff-facing: mark conversations worth turning into article content.
    { name: 'flaggedQuality', type: 'checkbox', defaultValue: false, admin: { description: 'Đánh dấu hội thoại chất lượng để khai thác làm nội dung bài viết.' } },
  ],
}
