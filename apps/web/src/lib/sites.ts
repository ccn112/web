import type { SiteCode } from '@x/shared-types'

/** Static host -> siteCode map (mirrors seed/sites.json primaryDomain). */
export const SITE_DOMAINS: Array<{ code: SiteCode; primaryDomain: string }> = [
  { code: 'corporate', primaryDomain: 'x.vn' },
  { code: 'xbooking', primaryDomain: 'xbooking.vn' },
  { code: 'finerp', primaryDomain: 'finerp.vn' },
  { code: 'xbuilding', primaryDomain: 'xbuilding.vn' },
  { code: 'xai', primaryDomain: 'xai.vn' },
  { code: 'xspace', primaryDomain: 'xspace.vn' },
]

/** Base surface mode per site (XTECH_UI_STYLE_HANDOFF §6). */
export const SITE_MODE: Record<SiteCode, 'dark' | 'light'> = {
  corporate: 'dark',
  xai: 'dark',
  xspace: 'dark',
  xbooking: 'light',
  finerp: 'light',
  xbuilding: 'light',
}

export const HEADER_SITE_CODE = 'x-site-code'
