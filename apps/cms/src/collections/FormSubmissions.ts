import type { CollectionConfig } from 'payload'
import { deleteAdmins, submissionsCreate, submissionsRead } from '../access/index'
import { autoReplyLeadSubmission } from '../hooks/autoReplyLeadSubmission'
import { enqueueLeadCare } from '../hooks/enqueueLeadCare'
import { notifyLeadSubmission } from '../hooks/notifyLeadSubmission'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['form', 'site', 'consent', 'createdAt'],
    group: 'Forms',
  },
  access: {
    // Anyone may submit; leads are private and readable by staff only.
    create: submissionsCreate,
    read: submissionsRead,
    update: deleteAdmins,
    delete: deleteAdmins,
  },
  hooks: {
    // On a new lead: (1) notify staff, (2) send the visitor a short ack, and
    // (3) enqueue the delayed AI follow-up + warm chat session. All three are
    // best-effort — failures are swallowed so they never fail the visitor's
    // request (the submission is already persisted before hooks run).
    afterChange: [notifyLeadSubmission, autoReplyLeadSubmission, enqueueLeadCare],
  },
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'page', type: 'relationship', relationTo: 'pages' },
    { name: 'visitorSession', type: 'text' },
    { name: 'payload', type: 'json', required: true },
    { name: 'utm', type: 'json' },
    { name: 'consent', type: 'checkbox', defaultValue: false },
    // ---- Automated customer-care pipeline state (managed by hooks/jobs) ----
    {
      type: 'group',
      name: 'care',
      label: 'Chăm sóc tự động',
      admin: { description: 'Trạng thái luồng chăm sóc khách hàng tự động (AI + escalation).' },
      fields: [
        {
          name: 'stage',
          type: 'select',
          defaultValue: 'queued',
          options: [
            { label: 'Đã xếp hàng (chờ AI)', value: 'queued' },
            { label: 'AI đã phản hồi', value: 'ai_replied' },
            { label: 'Đã chuyển tư vấn viên', value: 'escalated' },
            { label: 'Đã đóng', value: 'closed' },
            { label: 'Lỗi', value: 'error' },
          ],
          admin: { readOnly: true },
        },
        // When the delayed AI follow-up becomes due (submit time + delay).
        { name: 'scheduledAt', type: 'date', admin: { readOnly: true } },
        { name: 'processedAt', type: 'date', admin: { readOnly: true } },
        // AI analysis outputs.
        {
          name: 'intent',
          type: 'text',
          admin: { readOnly: true, description: 'Ý định/khách quan tâm do AI suy luận.' },
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Thấp', value: 'low' },
            { label: 'Trung bình', value: 'medium' },
            { label: 'Cao', value: 'high' },
          ],
          admin: { readOnly: true },
        },
        { name: 'summary', type: 'textarea', admin: { readOnly: true, description: 'Tóm tắt lead do AI tạo.' } },
        { name: 'escalatedAt', type: 'date', admin: { readOnly: true } },
        { name: 'lastError', type: 'text', admin: { readOnly: true } },
        // Warm chat bridge: a pre-created session the visitor can jump into.
        { name: 'chatSessionId', type: 'text', admin: { readOnly: true } },
        {
          name: 'chatToken',
          type: 'text',
          index: true,
          admin: { readOnly: true, description: 'Token magic-link để mở nhanh phiên chat AI đã có ngữ cảnh.' },
        },
      ],
    },
  ],
}
