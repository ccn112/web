import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@x/content-blocks'
import type { Block } from '@x/shared-types'
import { cms, currentSiteCode } from '@/lib/cms'
import { SITE_MODE } from '@/lib/sites'
import { SiteShell } from '@/components/SiteShell'
import { PostArticle } from '@/components/PostArticle'

export const dynamic = 'force-dynamic'

type Params = { slug?: string[] }

function toPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/'
  return '/' + slug.join('/')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const siteCode = await currentSiteCode()
  const page = await cms.getPage(siteCode, toPath(slug))
  const seo = page?.seo
  const title = seo?.metaTitle ?? page?.title
  return {
    title,
    description: seo?.metaDescription ?? page?.summary,
    robots: {
      index: seo?.index ?? true,
      follow: seo?.follow ?? true,
    },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const siteCode = await currentSiteCode()
  const mode = SITE_MODE[siteCode] ?? 'dark'

  const [site, menu] = await Promise.all([cms.getSite(siteCode), cms.getMenu(siteCode)])
  if (!site) notFound()

  const path = toPath(slug)
  const page = await cms.getPage(siteCode, path)

  if (page) {
    return (
      <SiteShell site={site} mode={mode} menu={menu?.items ?? []}>
        <BlockRenderer
          blocks={(page.blocks ?? []) as Block[]}
          context={{ siteCode, pageId: page.id }}
        />
      </SiteShell>
    )
  }

  // Fall back to an insights article: /insights/<post-slug> (or any trailing slug).
  const segs = slug ?? []
  if (segs.length >= 1) {
    const post = await cms.getPost(siteCode, segs[segs.length - 1]!)
    if (post) {
      return (
        <SiteShell site={site} mode={mode} menu={menu?.items ?? []}>
          <PostArticle post={post} />
        </SiteShell>
      )
    }
  }

  notFound()
}
