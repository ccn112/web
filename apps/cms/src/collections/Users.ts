import type { CollectionConfig } from 'payload'
import { USER_ROLES } from '@x/shared-types'
import {
  adminFieldOnly,
  canAccessAdmin,
  isSuperAdmin,
  superAdminOnly,
  userId,
} from '../access/index'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'role'],
    group: 'System',
  },
  access: {
    admin: canAccessAdmin,
    // Super admins manage everyone; other staff may read/update only themselves.
    read: ({ req: { user } }) => (isSuperAdmin(user) ? true : { id: { equals: userId(user) } }),
    create: superAdminOnly,
    update: ({ req: { user } }) => (isSuperAdmin(user) ? true : { id: { equals: userId(user) } }),
    delete: superAdminOnly,
  },
  fields: [
    { name: 'fullName', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      access: { update: adminFieldOnly },
      options: USER_ROLES.map((r) => ({ label: r, value: r })),
    },
    {
      name: 'allowedSiteCodes',
      type: 'text',
      hasMany: true,
      access: { update: adminFieldOnly },
      admin: {
        description: 'Site codes this user may manage (ignored for super_admin).',
      },
    },
  ],
}
