export type SiteConfig = {
  code: string
  primaryDomain?: string | null
}

export function resolveSiteCode(
  host: string | null,
  querySite: string | null,
  sites: SiteConfig[],
  isDevelopment: boolean,
): string {
  if (isDevelopment && querySite && sites.some((site) => site.code === querySite)) {
    return querySite
  }

  const normalizedHost = (host ?? '').split(':')[0].toLowerCase()
  const matched = sites.find(
    (site) => site.primaryDomain?.toLowerCase() === normalizedHost,
  )

  return matched?.code ?? 'corporate'
}
