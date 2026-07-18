"use client";

/**
 * NEWS (/tin-tuc) — three tiers per XTECH_NEWS_CLAUDE_HANDOFF_V1:
 *  - home:    /tin-tuc            (hero + featured + topic chips + latest grid + newsletter)
 *  - listing: /tin-tuc/danh-sach  (search + filter + grid + pagination + sidebar)
 *  - detail:  /tin-tuc/<slug>     (hero + body + related + sidebar)
 * Uses the shared editorial kit.
 */

import { ArrowRight } from "lucide-react";
import { AmbientSection } from "@/components/corporate/about-kit";
import {
  ArticleCard,
  EditorialHeroShell,
  EDITORIAL_BG,
  FeaturedCard,
  NewsletterBox,
  type EditorialItem,
} from "@/components/editorial/kit";
import { EditorialListing } from "@/components/editorial/EditorialListing";
import { ArticleDetail } from "@/components/editorial/ArticleDetail";
import {
  newsArticles,
  newsCategories,
  newsCategoryBySlug,
  newsBySlug,
  type NewsArticle,
} from "@/data/news-content";

function toItem(a: NewsArticle): EditorialItem {
  const cat = newsCategoryBySlug(a.categorySlug);
  return {
    href: `/tin-tuc/${a.slug}`,
    title: a.title,
    excerpt: a.excerpt,
    categoryLabel: cat?.title ?? a.categorySlug,
    categorySlug: a.categorySlug,
    categoryIcon: cat?.icon ?? "transformation",
    tags: a.tags,
    author: a.author,
    publishedAt: a.publishedAt,
    readTime: a.readTime,
    featured: a.featured,
    pinned: a.pinned,
  };
}

const ALL_ITEMS = newsArticles.map(toItem);
const TOPICS = Array.from(new Set(newsArticles.flatMap((a) => a.tags))).slice(0, 10);

/* ---------- home ---------- */
function NewsHome() {
  const featured = ALL_ITEMS.find((i) => i.pinned) ?? ALL_ITEMS.find((i) => i.featured) ?? ALL_ITEMS[0];
  const latest = [...newsArticles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6)
    .map(toItem);

  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.news}>
        <div className="grid gap-10 pt-28 pb-16 md:pt-36 md:pb-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">Tin tức &amp; Insights</span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Tin tức &amp; <span className="brand-gradient-text">Góc nhìn</span> XTECH
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Cập nhật xu hướng, kiến thức và câu chuyện thực tiễn về chuyển đổi số, AI, dữ liệu, vận hành và bất động sản — từ đội ngũ XTECH.
            </p>
            <a href="/tin-tuc/danh-sach" className="btn-gold mt-7 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105">
              Xem tất cả bài viết <ArrowRight className="size-4" />
            </a>
          </div>
          {featured ? <FeaturedCard item={featured} /> : null}
        </div>
      </EditorialHeroShell>

      <AmbientSection id="tin-tuc" city={false} compact>
        {/* Topic chips */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-blue">Theo chủ đề</h2>
          <a href="/tin-tuc/danh-sach" className="inline-flex items-center gap-1 text-sm font-semibold text-blue transition hover:text-gold">
            Xem tất cả <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {newsCategories.map((c) => (
            <a key={c.slug} href="/tin-tuc/danh-sach" className="rounded-full border border-blue/15 bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-gold/45 hover:text-blue">
              {c.title}
            </a>
          ))}
        </div>

        {/* Latest grid */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-blue">Mới nhất</h2>
          <a href="/tin-tuc/danh-sach" className="inline-flex items-center gap-1 text-sm font-semibold text-blue transition hover:text-gold">
            Xem tất cả bài viết <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((it, i) => (
            <ArticleCard key={it.href} item={it} delay={(i % 3) * 0.06} />
          ))}
        </div>
      </AmbientSection>

      <AmbientSection id="ban-tin" soft city={false} compact>
        <div className="mx-auto max-w-3xl">
          <NewsletterBox />
        </div>
      </AmbientSection>
    </>
  );
}

/* ---------- listing ---------- */
function NewsListing() {
  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.news}>
        <div className="pt-28 pb-12 md:pt-36 md:pb-16">
          <nav className="text-xs text-white/60">
            <a href="/tin-tuc" className="hover:text-white">Tin tức</a> <span className="text-white/35">/</span> Tất cả bài viết
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Tất cả bài viết <span className="brand-gradient-text">XTECH</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Cập nhật xu hướng, kiến thức và câu chuyện thực tiễn về chuyển đổi số, AI, dữ liệu, vận hành và bất động sản.
          </p>
        </div>
      </EditorialHeroShell>
      <EditorialListing items={ALL_ITEMS} categories={newsCategories} topics={TOPICS} />
    </>
  );
}

/* ---------- detail ---------- */
function NewsDetail({ a }: { a: NewsArticle }) {
  const item = toItem(a);
  const related = newsArticles
    .filter((x) => x.slug !== a.slug && x.categorySlug === a.categorySlug)
    .concat(newsArticles.filter((x) => x.slug !== a.slug && x.categorySlug !== a.categorySlug))
    .slice(0, 3)
    .map(toItem);
  return (
    <ArticleDetail
      item={item}
      summary={a.excerpt}
      body={a.body}
      sectionLabel="Tin tức"
      sectionHref="/tin-tuc"
      related={related}
      relatedProducts={a.relatedProducts}
      bg={EDITORIAL_BG.newsDetail}
    />
  );
}

export function NewsPages({ route }: { route: string }) {
  if (route === "/tin-tuc") return <NewsHome />;
  if (route === "/tin-tuc/danh-sach") return <NewsListing />;
  const slug = route.startsWith("/tin-tuc/") ? route.slice("/tin-tuc/".length) : "";
  const a = newsBySlug(slug);
  if (a) return <NewsDetail a={a} />;
  return null;
}
