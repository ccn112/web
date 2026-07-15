/**
 * @x/seo — metadata, canonical, sitemap, robots and JSON-LD helpers. Populated in Phase 2.
 */
import type { Seo } from '@x/shared-types'

/** Merge page-level SEO over site defaults (Phase 2 will expand this). */
export function resolveSeo(pageSeo: Seo | undefined, siteDefaults: Partial<Seo>): Seo {
  return {
    index: true,
    follow: true,
    ...siteDefaults,
    ...(pageSeo ?? {}),
  }
}
