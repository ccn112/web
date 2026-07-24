/**
 * Generate `editorial-posts.json` for the CMS seed from the curated static
 * Insights + News content modules. Keeps the two sources in sync: edit the
 * static module, re-run `pnpm gen:editorial-seed`, then reseed the CMS.
 *
 * Run: pnpm --filter @x/clay gen:editorial-seed
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { insightArticles } from "../src/data/insights-content";
import { newsArticles } from "../src/data/news-content";

const dirname = path.dirname(fileURLToPath(import.meta.url));
// apps/clay/scripts -> repo root is three levels up.
const REPO_ROOT = path.resolve(dirname, "../../..");
const OUT = path.join(
  REPO_ROOT,
  "handoff",
  "X_WEB_PLATFORM_HANDOFF_20260715",
  "seed",
  "editorial-posts.json",
);

type PostJson = Record<string, unknown>;

const posts: PostJson[] = [];

for (const a of insightArticles) {
  posts.push({
    site: "corporate",
    section: "insight",
    slug: a.slug,
    title: a.title,
    excerpt: a.summary,
    category: a.categorySlug,
    tags: a.tags ?? [],
    coverUrl: a.cover,
    readTime: a.readTime,
    date: a.publishedAt,
    featured: a.featured ?? false,
    relatedProducts: a.relatedProducts ?? [],
    body: a.body ?? [],
    status: "published",
  });
}

for (const a of newsArticles) {
  posts.push({
    site: "corporate",
    section: "news",
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.categorySlug,
    tags: a.tags ?? [],
    coverUrl: a.cover,
    readTime: a.readTime,
    date: a.publishedAt,
    featured: a.featured ?? false,
    relatedProducts: a.relatedProducts ?? [],
    body: a.body ?? [],
    status: "published",
  });
}

async function main() {
  await writeFile(OUT, JSON.stringify(posts, null, 2) + "\n", "utf8");
  console.log(`Wrote ${posts.length} editorial posts → ${OUT}`);
}
void main();
