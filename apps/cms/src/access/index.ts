/**
 * Access control (docs/03_CONTENT_MODEL.md).
 *
 * Roles:
 *  - super_admin : everything
 *  - site_admin  : full control within `allowedSiteCodes`
 *  - editor      : create / edit drafts within `allowedSiteCodes`
 *  - reviewer    : move review -> approved
 *  - publisher   : publish / unpublish
 *
 * Hard rules enforced here:
 *  - Public (unauthenticated) reads ONLY return status = 'published'. Drafts are never public.
 *  - Non-super users are constrained to their `allowedSiteCodes`.
 */
import type { Access, FieldAccess, PayloadRequest } from 'payload'

/**
 * Narrowed view of the authenticated user. Accepts `unknown` because the generated
 * `payload-types.ts` (which types req.user precisely) is produced at build time; the runtime
 * shape always carries `role` and `allowedSiteCodes` from the Users collection.
 */
interface XUser {
  id?: string
  role?: string
  allowedSiteCodes?: string[] | null
}

const asUser = (user: unknown): XUser | null =>
  user && typeof user === 'object' ? (user as XUser) : null

const roleOf = (user: unknown): string => asUser(user)?.role ?? ''

export const userId = (user: unknown): string | undefined => asUser(user)?.id

export const isSuperAdmin = (user: unknown): boolean => asUser(user)?.role === 'super_admin'

export const isStaff = (user: unknown): boolean => {
  const u = asUser(user)
  return !!u && ['super_admin', 'site_admin', 'editor', 'reviewer', 'publisher'].includes(u.role ?? '')
}

export const allowedSiteCodes = (user: unknown): string[] => {
  const codes = asUser(user)?.allowedSiteCodes
  return Array.isArray(codes) ? codes : []
}

/** A `where` that never matches — used when a scoped user has no allowed sites. */
const MATCH_NONE = { id: { equals: '00000000-0000-0000-0000-000000000000' } }

/**
 * Read access for site-scoped, publishable content.
 * @param siteField the field holding the site code on this collection ('siteCode' | 'code').
 */
export const readPublishedOrScoped =
  (siteField: 'siteCode' | 'code'): Access =>
  ({ req: { user } }) => {
    if (!user) {
      // Public: published only.
      return { status: { equals: 'published' } }
    }
    if (isSuperAdmin(user)) return true
    const codes = allowedSiteCodes(user)
    if (codes.length === 0) return MATCH_NONE
    return { [siteField]: { in: codes } }
  }

/** Create: super_admin, site_admin, editor — within allowed sites (checked on the doc's site). */
export const createScoped: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return ['site_admin', 'editor'].includes(roleOf(user))
}

/** Update: any staff role, constrained to allowed sites. */
export const updateScoped =
  (siteField: 'siteCode' | 'code'): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (isSuperAdmin(user)) return true
    if (!isStaff(user)) return false
    const codes = allowedSiteCodes(user)
    if (codes.length === 0) return MATCH_NONE
    return { [siteField]: { in: codes } }
  }

/** Delete: super_admin and site_admin only. */
export const deleteScoped =
  (siteField: 'siteCode' | 'code'): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (isSuperAdmin(user)) return true
    if (roleOf(user) !== 'site_admin') return false
    const codes = allowedSiteCodes(user)
    if (codes.length === 0) return MATCH_NONE
    return { [siteField]: { in: codes } }
  }

/**
 * Read for shared/reference content that is not strictly site-scoped (Products, Solutions,
 * CaseStudies, FAQs, Menus, Forms, PromptSets, Redirects): public sees published (where the
 * collection has a status) or everything (where it does not); any staff member sees everything.
 */
export const readPublicOrStaff =
  (opts: { publishable?: boolean } = {}): Access =>
  ({ req: { user } }) => {
    if (user) return true
    return opts.publishable ? { status: { equals: 'published' } } : true
  }

/** Create/update for shared content: super_admin, site_admin, editor. */
export const writeStaff: Access = ({ req: { user } }) =>
  isSuperAdmin(user) || ['site_admin', 'editor'].includes(roleOf(user))

/** Delete for shared content: super_admin, site_admin. */
export const deleteAdmins: Access = ({ req: { user } }) =>
  isSuperAdmin(user) || roleOf(user) === 'site_admin'

/** Anyone may submit a form; only staff may read submissions (leads are private). */
export const submissionsCreate: Access = () => true
export const submissionsRead: Access = ({ req: { user } }) => isStaff(user)

/** Admin panel gate: any authenticated staff member. */
export const canAccessAdmin = ({ req }: { req: PayloadRequest }): boolean => isStaff(req.user)

/** Only super_admin may manage users. */
export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Field-level: only super_admin / site_admin may change a user's role and allowed sites. */
export const adminFieldOnly: FieldAccess = ({ req: { user } }) =>
  isSuperAdmin(user) || roleOf(user) === 'site_admin'

/**
 * Field-level guard for the publish transition: only publisher / site_admin / super_admin
 * may set status to 'published' or 'archived'. (docs/03 workflow.)
 */
export const canPublishField: FieldAccess = ({ req: { user } }) =>
  isSuperAdmin(user) || ['site_admin', 'publisher'].includes(roleOf(user))
