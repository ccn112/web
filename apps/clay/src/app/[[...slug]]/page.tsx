import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import type { Block } from "@x/shared-types";
import { cms, currentSiteCode } from "@/lib/cms";
import { SiteShell } from "@/components/site/SiteShell";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { PostArticle } from "@/components/blocks/PostArticle";
import { PostList } from "@/components/blocks/PostList";
import { C02Sections } from "@/components/services/c02/C02SectionRenderer";
import { AboutXtech } from "@/components/corporate/AboutXtech";
import { HomeXtech } from "@/components/home/HomeXtech";
import { ProductSections } from "@/components/product/ProductSections";
import { productSectionsForRoute } from "@/data/product-content";
import { ImplPages } from "@/components/impl/ImplPages";
import { hasImplRoute } from "@/data/impl-content";
import { SuitePages } from "@/components/suites/SuitePages";
import { SolutionPages } from "@/components/solutions/SolutionPages";
import { hasSolutionRoute, resolveSolution } from "@/data/solution-content";
import { hasSuiteRoute } from "@/data/suite-content";
import { CasePages } from "@/components/cases/CasePages";
import { hasCaseRoute } from "@/data/case-content";
import { InsightsPages } from "@/components/insights/InsightsPages";
import { insightBySlug, resolveInsights } from "@/data/insights-content";
import { NewsPages } from "@/components/news/NewsPages";
import { newsBySlug, resolveNews } from "@/data/news-content";
import { LeadPages } from "@/components/lead/LeadPages";
import { hasLeadRoute } from "@/data/lead-content";
import { LegalPages } from "@/components/legal/LegalPages";
import { hasLegalRoute } from "@/data/legal-content";

// The page reads `headers()` (site resolved by middleware) so it renders
// dynamically per request — but WITHOUT `force-dynamic` the CmsClient fetches
// (revalidate:60) are cached across requests, cutting CMS round-trips and TTFB.
export const revalidate = 60;

const CMS_BASE = (
  process.env.CMS_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

/** Resolve a populated Media upload (depth>=1) to an absolute image URL. */
function mediaUrl(ref: unknown): string | undefined {
  if (!ref || typeof ref !== "object") return undefined;
  const url = (ref as { url?: string }).url;
  if (!url) return undefined;
  return /^https?:\/\//.test(url) ? url : `${CMS_BASE}${url}`;
}

type Params = { slug?: string[] };

function toPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/";
  return "/" + slug.join("/");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteCode = await currentSiteCode();
  const path = toPath(slug);
  const segs = slug ?? [];

  const page = await cms.getPage(siteCode, path);
  let title = page?.seo?.metaTitle ?? page?.title;
  let description = page?.seo?.metaDescription ?? page?.summary;
  let canonical = page?.seo?.canonical;
  let index = page?.seo?.index ?? true;
  let follow = page?.seo?.follow ?? true;

  let ogImage: string | undefined;

  // News article (/tin-tuc/<slug>): static curated article.
  if (!page && segs[0] === "tin-tuc" && segs.length >= 2) {
    const news = newsBySlug(segs[segs.length - 1]!);
    if (news) {
      title = news.title;
      description = news.excerpt;
      ogImage = news.cover;
    }
  }

  // Insights article (/insights/<slug>): static curated article first, then CMS.
  if (!page && segs[0] === "insights" && segs[1] !== "tag" && segs.length >= 2) {
    const article = insightBySlug(segs[segs.length - 1]!);
    if (article) {
      title = article.title;
      description = article.summary;
      ogImage = article.cover;
    } else {
      const post = await cms.getPost(siteCode, segs[segs.length - 1]!);
      if (post) {
        title = post.seo?.metaTitle ?? post.title;
        description = post.seo?.metaDescription ?? post.excerpt;
        canonical = post.seo?.canonical;
        index = post.seo?.index ?? true;
        follow = post.seo?.follow ?? true;
      }
    }
  }

  const canon = canonical ?? (path === "/" ? "/" : path);
  const meta: Metadata = {
    title,
    description,
    robots: { index, follow },
    alternates: { canonical: canon },
  };
  if (title || description) {
    const isArticle = (segs[0] === "insights" || segs[0] === "tin-tuc") && segs.length >= 2;
    const images = ogImage ? [{ url: ogImage, alt: title ?? undefined }] : undefined;
    meta.openGraph = {
      title: title ?? undefined,
      description: description ?? undefined,
      url: canon,
      type: isArticle ? "article" : "website",
      images,
    };
    // Social thumbnail for Facebook / Zalo / Twitter previews.
    meta.twitter = {
      card: images ? "summary_large_image" : "summary",
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    };
  }
  return meta;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const siteCode = await currentSiteCode();

  const [site, menu] = await Promise.all([cms.getSite(siteCode), cms.getMenu(siteCode)]);
  if (!site) notFound();

  const path = toPath(slug);

  // Bespoke corporate homepage (SET HOMEPAGE V1) — overrides the CMS page for /.
  if (siteCode === "corporate" && path === "/") {
    const posts = await cms.getPosts(siteCode, { limit: 3 }).catch(() => []);
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <HomeXtech posts={posts} />
      </SiteShell>
    );
  }

  // Bespoke corporate Product Ecosystem (SET C03) — /san-pham + product pages.
  if (siteCode === "corporate" && productSectionsForRoute(path).length) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <ProductSections route={path} />
      </SiteShell>
    );
  }

  // Bespoke corporate Implementation (SET C04) — /trien-khai + detail subroutes.
  if (siteCode === "corporate" && hasImplRoute(path)) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <ImplPages route={path} />
      </SiteShell>
    );
  }

  // Bespoke corporate Solution menu (SET G02) — /giai-phap/* + /bo-giai-phap-x landing.
  // Content editable in CMS (Solutions collection); falls back to designed static
  // content + images when the CMS doc/image is unset.
  if (siteCode === "corporate" && hasSolutionRoute(path)) {
    const cmsBase = (process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_URL ?? "http://localhost:3000").replace(/\/$/, "");
    const cmsSol = await cms.getSolutionByRoute(siteCode, path).catch(() => null);
    const resolved = resolveSolution(path, cmsSol, cmsBase);
    if (resolved) {
      return (
        <SiteShell site={site} menu={menu?.items ?? []}>
          <SolutionPages page={resolved} />
        </SiteShell>
      );
    }
  }

  // Bespoke corporate Solution Suites (SET C05) — /bo-giai-phap-x suite sub-pages.
  if (siteCode === "corporate" && hasSuiteRoute(path)) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <SuitePages route={path} />
      </SiteShell>
    );
  }

  // Bespoke corporate Customer Success (SET C06) — /khach-hang + case pages.
  if (siteCode === "corporate" && hasCaseRoute(path)) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <CasePages route={path} />
      </SiteShell>
    );
  }

  // Bespoke corporate Insights (SET C07) — /insights + article pages.
  // Content editable in CMS (Posts, section=insight); merges over designed
  // static articles by slug, falls back to static when the CMS row is unset.
  if (
    siteCode === "corporate" &&
    (path === "/insights" ||
      (path.startsWith("/insights/") && !path.startsWith("/insights/tag/")))
  ) {
    const cmsPosts = await cms.getEditorialPosts(siteCode, "insight").catch(() => []);
    const articles = resolveInsights(cmsPosts, CMS_BASE);
    const slug = path.startsWith("/insights/") ? path.slice("/insights/".length) : "";
    const ok =
      path === "/insights" || path === "/insights/danh-sach" || articles.some((a) => a.slug === slug);
    if (ok) {
      return (
        <SiteShell site={site} menu={menu?.items ?? []}>
          <InsightsPages route={path} articles={articles} />
        </SiteShell>
      );
    }
  }

  // Bespoke corporate News (/tin-tuc) — news landing + article pages (CMS-editable).
  if (siteCode === "corporate" && path.startsWith("/tin-tuc")) {
    const cmsPosts = await cms.getEditorialPosts(siteCode, "news").catch(() => []);
    const articles = resolveNews(cmsPosts, CMS_BASE);
    const slug = path.startsWith("/tin-tuc/") ? path.slice("/tin-tuc/".length) : "";
    const ok =
      path === "/tin-tuc" || path === "/tin-tuc/danh-sach" || articles.some((a) => a.slug === slug);
    if (ok) {
      return (
        <SiteShell site={site} menu={menu?.items ?? []}>
          <NewsPages route={path} articles={articles} />
        </SiteShell>
      );
    }
  }

  // Bespoke corporate lead pages (/lien-he, /dat-lich-demo, /yeu-cau-tu-van).
  if (siteCode === "corporate" && hasLeadRoute(path)) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <LeadPages route={path} siteCode={siteCode} />
      </SiteShell>
    );
  }

  // Corporate legal pages (/chinh-sach-bao-mat, /dieu-khoan-su-dung, /chinh-sach-cookie).
  if (siteCode === "corporate" && hasLegalRoute(path)) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <LegalPages route={path} />
      </SiteShell>
    );
  }

  // Bespoke corporate About page (SET C01 design) — overrides the CMS page for /ve-x.
  // Hero background is still CMS-driven: read it from the CMS /ve-x hero block.
  if (siteCode === "corporate" && path === "/ve-x") {
    const aboutPage = await cms.getPage(siteCode, "/ve-x");
    const heroBlock = aboutPage?.blocks?.find(
      (b): b is Extract<Block, { blockType: "hero" }> => b.blockType === "hero",
    );
    const heroBackground = mediaUrl(heroBlock?.background);
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <AboutXtech heroBackground={heroBackground} />
      </SiteShell>
    );
  }

  // Insights tag listing: /insights/tag/<tag> — list posts carrying that tag.
  const segs = slug ?? [];
  if (segs.length >= 3 && segs[0] === "insights" && segs[1] === "tag") {
    const tag = decodeURIComponent(segs[2]!);
    const posts = await cms.getPosts(siteCode, { tag });
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        <PostList tag={tag} posts={posts} />
      </SiteShell>
    );
  }

  // CMS page blocks + any bespoke SET C02 service sections mapped to this route.
  const [page, serviceSections] = await Promise.all([
    cms.getPage(siteCode, path),
    cms.getServiceSections(siteCode, path),
  ]);

  if (page || serviceSections.length) {
    return (
      <SiteShell site={site} menu={menu?.items ?? []}>
        {page ? (
          <BlockRenderer
            blocks={(page.blocks ?? []) as Block[]}
            context={{ siteCode, pageId: page.id }}
          />
        ) : null}
        {serviceSections.length ? <C02Sections sections={serviceSections} /> : null}
      </SiteShell>
    );
  }

  // Fall back to an insights article: /insights/<post-slug>.
  if (segs.length >= 1) {
    const post = await cms.getPost(siteCode, segs[segs.length - 1]!);
    if (post) {
      return (
        <SiteShell site={site} menu={menu?.items ?? []}>
          <PostArticle post={post} />
        </SiteShell>
      );
    }
  }

  // Route reconciliation: honor a CMS redirect for renamed slugs before 404.
  const rd = await cms.getRedirect(siteCode, path);
  if (rd) {
    if (rd.permanent) permanentRedirect(rd.destinationPath);
    redirect(rd.destinationPath);
  }

  notFound();
}
