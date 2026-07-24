import type { MetadataRoute } from "next";
import { cms } from "@/lib/cms";
import { insightArticles } from "@/data/insights-content";
import { newsArticles } from "@/data/news-content";

/**
 * Sitemap for the corporate site (primary domain). Enumerates all published
 * CMS pages + insights posts. Multi-site per-host sitemaps are a follow-up.
 */
const BASE = "https://x.vn";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = "corporate";
  const [pages, posts] = await Promise.all([
    cms.listPages(site).catch(() => []),
    cms.getPosts(site, { limit: 500 }).catch(() => []),
  ]);

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const push = (path: string, lastModified?: string) => {
    const norm = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    if (seen.has(norm)) return;
    seen.add(norm);
    entries.push({
      url: `${BASE}${norm}`,
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: "weekly",
    });
  };

  for (const p of pages) push(p.slug, p.updatedAt);

  // Insights hub + curated (static) articles — the primary /insights experience.
  push("/insights");
  push("/insights/danh-sach");
  for (const a of insightArticles) push(`/insights/${a.slug}`, a.publishedAt);

  // News hub + curated (static) articles.
  push("/tin-tuc");
  push("/tin-tuc/danh-sach");
  for (const a of newsArticles) push(`/tin-tuc/${a.slug}`, a.publishedAt);

  // CMS posts fallback (legacy slugs not already covered).
  for (const post of posts) {
    push(`/insights/${post.slug}`, (post as { updatedAt?: string }).updatedAt);
  }

  return entries;
}
