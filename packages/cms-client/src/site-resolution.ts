/**
 * Host -> siteCode resolution (docs/02_ARCHITECTURE.md).
 * Extends src_examples/site-resolution.ts.
 */
export interface SiteResolverConfig {
  code: string
  primaryDomain?: string | null
}

export const DEFAULT_SITE_CODE = 'corporate'

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').split(':')[0]!.trim().toLowerCase()
}

export function resolveSiteCode(
  host: string | null,
  querySite: string | null,
  sites: SiteResolverConfig[],
  isDevelopment: boolean,
): string {
  // Development escape hatch: ?site=<code>
  if (isDevelopment && querySite && sites.some((s) => s.code === querySite)) {
    return querySite
  }

  const normalizedHost = normalizeHost(host)
  const matched = sites.find((s) => s.primaryDomain?.toLowerCase() === normalizedHost)

  return matched?.code ?? DEFAULT_SITE_CODE
}

/** Cache key MUST include siteCode + locale + pathname (docs/02_ARCHITECTURE.md §Site resolution). */
export function contentCacheKey(siteCode: string, locale: string, pathname: string): string {
  return `${siteCode}:${locale}:${pathname}`
}
