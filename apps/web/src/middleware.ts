import { NextResponse, type NextRequest } from 'next/server'
import { resolveSiteCode } from '@x/cms-client'
import { HEADER_SITE_CODE, SITE_DOMAINS } from '@/lib/sites'

/**
 * Resolves the current site from the Host header (or ?site= in development) and forwards it to
 * server components via the `x-site-code` request header (docs/02_ARCHITECTURE.md §Site resolution).
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host')
  const querySite = req.nextUrl.searchParams.get('site')
  const isDev = process.env.NODE_ENV !== 'production'

  const siteCode = resolveSiteCode(host, querySite, SITE_DOMAINS, isDev)

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(HEADER_SITE_CODE, siteCode)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Skip Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
}
