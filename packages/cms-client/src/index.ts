/**
 * @x/cms-client — typed, read-only client over the Payload REST API.
 * Public reads only ever return published content (enforced by CMS access control).
 */
import type {
  MenuDoc,
  PageDoc,
  PostDoc,
  ServiceSectionDoc,
  SiteConfig,
  SolutionDoc,
} from '@x/shared-types'

export * from './site-resolution'

export interface CmsClientOptions {
  /** Base URL of the CMS, e.g. http://localhost:3000 */
  baseUrl: string
  /** Optional fetch override (for tests / server components). */
  fetchImpl?: typeof fetch
  /** Next.js fetch cache hints. */
  next?: { revalidate?: number; tags?: string[] }
}

interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
}

export class CmsClient {
  private readonly baseUrl: string
  private readonly fetchImpl: typeof fetch
  private readonly next?: CmsClientOptions['next']

  constructor(opts: CmsClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '')
    this.fetchImpl = opts.fetchImpl ?? fetch
    this.next = opts.next
  }

  private async get<T>(path: string, params: Record<string, string | number>): Promise<T> {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString()
    const url = `${this.baseUrl}/api/${path}?${qs}`
    // `next` is a Next.js extension to RequestInit (ignored by the standard fetch types).
    const init = {
      headers: { 'content-type': 'application/json' },
      next: this.next,
    } as RequestInit
    const res = await this.fetchImpl(url, init)
    if (!res.ok) {
      throw new Error(`CMS request failed: ${res.status} ${res.statusText} (${url})`)
    }
    return (await res.json()) as T
  }

  async getSite(siteCode: string): Promise<SiteConfig | null> {
    const data = await this.get<PayloadListResponse<SiteConfig>>('sites', {
      'where[code][equals]': siteCode,
      limit: 1,
      depth: 0,
    })
    return data.docs[0] ?? null
  }

  async getAllSites(): Promise<SiteConfig[]> {
    const data = await this.get<PayloadListResponse<SiteConfig>>('sites', {
      limit: 100,
      depth: 0,
    })
    return data.docs
  }

  async getPage(siteCode: string, slug: string, locale = 'vi'): Promise<PageDoc | null> {
    const data = await this.get<PayloadListResponse<PageDoc>>('pages', {
      'where[siteCode][equals]': siteCode,
      'where[slug][equals]': slug,
      'where[locale][equals]': locale,
      limit: 1,
      depth: 1,
    })
    return data.docs[0] ?? null
  }

  /** All published pages for a site (slug + updatedAt), for sitemap generation. */
  async listPages(
    siteCode: string,
    locale = 'vi',
  ): Promise<Array<{ slug: string; updatedAt?: string }>> {
    const data = await this.get<PayloadListResponse<PageDoc & { updatedAt?: string }>>('pages', {
      'where[siteCode][equals]': siteCode,
      'where[locale][equals]': locale,
      limit: 500,
      depth: 0,
    })
    return data.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }))
  }

  async getMenu(siteCode: string, code = 'main', locale = 'vi'): Promise<MenuDoc | null> {
    const data = await this.get<PayloadListResponse<MenuDoc>>('menus', {
      'where[siteCode][equals]': siteCode,
      'where[code][equals]': code,
      'where[locale][equals]': locale,
      limit: 1,
      depth: 0,
    })
    return data.docs[0] ?? null
  }

  /** Look up a redirect for a path on a site (route reconciliation). */
  async getRedirect(
    siteCode: string,
    sourcePath: string,
  ): Promise<{ destinationPath: string; permanent: boolean } | null> {
    const data = await this.get<
      PayloadListResponse<{ destinationPath: string; permanent?: boolean }>
    >('redirects', {
      'where[siteCode][equals]': siteCode,
      'where[sourcePath][equals]': sourcePath,
      limit: 1,
      depth: 0,
    })
    const d = data.docs[0]
    return d ? { destinationPath: d.destinationPath, permanent: d.permanent ?? true } : null
  }

  async getPost(siteCode: string, slug: string, locale = 'vi'): Promise<PostDoc | null> {
    const data = await this.get<PayloadListResponse<PostDoc>>('posts', {
      'where[siteCode][equals]': siteCode,
      'where[slug][equals]': slug,
      'where[locale][equals]': locale,
      limit: 1,
      depth: 0,
    })
    return data.docs[0] ?? null
  }

  /** Solution menu page (SET G02) by exact route — depth=1 to populate images. */
  async getSolutionByRoute(siteCode: string, route: string): Promise<SolutionDoc | null> {
    const data = await this.get<PayloadListResponse<SolutionDoc>>('solutions', {
      'where[siteCode][equals]': siteCode,
      'where[route][equals]': route,
      limit: 1,
      depth: 1,
    })
    return data.docs[0] ?? null
  }

  /**
   * List published posts for a site, optionally filtered by a single `tag`
   * or exact `category`. Returns [] when nothing matches.
   */
  async getPosts(
    siteCode: string,
    opts: {
      tag?: string
      category?: string
      section?: string
      locale?: string
      limit?: number
      depth?: number
    } = {},
  ): Promise<PostDoc[]> {
    const params: Record<string, string | number> = {
      'where[siteCode][equals]': siteCode,
      'where[locale][equals]': opts.locale ?? 'vi',
      limit: opts.limit ?? 50,
      depth: opts.depth ?? 0,
    }
    if (opts.tag) params['where[tags][in]'] = opts.tag
    if (opts.category) params['where[category][equals]'] = opts.category
    if (opts.section) params['where[section][equals]'] = opts.section
    const data = await this.get<PayloadListResponse<PostDoc>>('posts', params)
    return data.docs
  }

  /**
   * Editorial posts for a section (insight | news), depth=1 so the `cover`
   * upload is populated. Ordered newest-first isn't guaranteed by the API here;
   * callers sort by date. Returns [] when none.
   */
  async getEditorialPosts(siteCode: string, section: 'insight' | 'news'): Promise<PostDoc[]> {
    return this.getPosts(siteCode, { section, depth: 1, limit: 100 })
  }

  /**
   * Bespoke service sections (SET C02) that render on `route`, ordered by `order`.
   * Returns [] when the route has none — the caller falls through to normal pages.
   */
  async getServiceSections(
    siteCode: string,
    route: string,
    locale = 'vi',
  ): Promise<ServiceSectionDoc[]> {
    const data = await this.get<PayloadListResponse<ServiceSectionDoc>>('service-sections', {
      'where[siteCode][equals]': siteCode,
      'where[locale][equals]': locale,
      'where[routes][in]': route,
      sort: 'order',
      limit: 50,
      depth: 0,
    })
    return data.docs
  }
}
