import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Keeps the denormalized `siteCode` text field in sync with the `site` relationship.
 * `siteCode` is the scoping key used by public queries (@x/cms-client) and access control,
 * so it must always reflect the related Site's code.
 */
export const syncSiteCode: CollectionBeforeChangeHook = async ({ data, req }) => {
  const siteId = data?.site
  if (siteId) {
    const site = await req.payload.findByID({
      collection: 'sites',
      id: typeof siteId === 'object' ? siteId.id : siteId,
      depth: 0,
      req,
    })
    const code = (site as unknown as { code?: string } | null)?.code
    if (typeof code === 'string') {
      data.siteCode = code
    }
  }
  return data
}
