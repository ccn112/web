import type { CollectionConfig } from 'payload'
import { deleteAdmins, isStaff, writeStaff } from '../access/index'
import { HANDOFF_REASON_OPTIONS } from '../lib/lead/state-machine'

/**
 * The HUMAN_READY handoff record: which consultant was emailed, when, the SLA
 * clock, and how they progressed the lead. One row per handoff so repeat
 * escalations stay auditable.
 */
export const ConsultantAssignments: CollectionConfig = {
  slug: 'consultant-assignments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['consultant', 'lead', 'status', 'assignedAt', 'slaDueAt'],
    group: 'Lead & Tư vấn',
  },
  access: {
    create: writeStaff,
    read: ({ req: { user } }) => isStaff(user),
    update: writeStaff,
    delete: deleteAdmins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'lead', type: 'relationship', relationTo: 'leads', required: true, admin: { width: '33%' } },
        {
          name: 'conversation',
          type: 'relationship',
          relationTo: 'lead-conversations',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'consultant',
          type: 'relationship',
          relationTo: 'consultants',
          admin: { width: '34%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'assignedAt',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'slaDueAt',
          type: 'date',
          label: 'Hạn phản hồi (SLA)',
          admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          admin: { width: '34%' },
          options: [
            { value: 'pending', label: 'Chờ tiếp nhận' },
            { value: 'accepted', label: 'Đã tiếp nhận' },
            { value: 'contacted', label: 'Đã liên hệ khách' },
            { value: 'closed', label: 'Đã đóng' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'handoffReason',
          type: 'select',
          options: HANDOFF_REASON_OPTIONS,
          admin: { width: '50%' },
        },
        { name: 'scoreAtHandoff', type: 'number', admin: { width: '50%' } },
      ],
    },
    { name: 'aiSummary', type: 'textarea', label: 'Brief AI khi chuyển giao' },
    { name: 'notes', type: 'textarea', label: 'Ghi chú của chuyên gia' },
    { name: 'notifiedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
}
