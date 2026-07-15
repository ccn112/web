import { headers } from 'next/headers'
import { CmsClient } from '@x/cms-client'
import type { SiteCode } from '@x/shared-types'
import { HEADER_SITE_CODE } from '@/lib/sites'

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

/** Shared read-only CMS client. Revalidates every 60s (content is edited in the CMS). */
export const cms = new CmsClient({ baseUrl: CMS_URL, next: { revalidate: 60 } })

/** The site resolved by middleware for this request. */
export async function currentSiteCode(): Promise<SiteCode> {
  const h = await headers()
  return (h.get(HEADER_SITE_CODE) as SiteCode | null) ?? 'corporate'
}
