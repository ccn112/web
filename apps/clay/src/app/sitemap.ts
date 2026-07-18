import type { MetadataRoute } from "next";
import { cms } from "@/lib/cms";

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
  for (const post of posts) {
    push(`/insights/${post.slug}`, (post as { updatedAt?: string }).updatedAt);
  }

  return entries;
}
