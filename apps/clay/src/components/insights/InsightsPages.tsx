"use client";

/**
 * SET C07 — Insights (/insights) — three tiers on the shared editorial kit:
 *  - home:    /insights            (hero + featured + categories + latest + newsletter)
 *  - listing: /insights/danh-sach  (search + filter + grid + pagination + sidebar)
 *  - detail:  /insights/<slug>     (hero + body + related + sidebar)
 * The CMS /insights/tag/<tag> listing and /insights/<cms-slug> PostArticle
 * fallback are handled separately in page.tsx and keep working.
 */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AmbientSection } from "@/components/corporate/about-kit";
import { IconTile } from "@/components/home/kit";
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
  insightArticles,
  insightCategories,
  categoryBySlug,
  insightBySlug,
  type InsightArticle,
} from "@/data/insights-content";

function toItem(a: InsightArticle): EditorialItem {
  const cat = categoryBySlug(a.categorySlug);
  return {
    href: `/insights/${a.slug}`,
    title: a.title,
    excerpt: a.summary,
    categoryLabel: cat?.title ?? a.categorySlug,
    categorySlug: a.categorySlug,
    categoryIcon: cat?.icon ?? "ai",
    tags: a.tags,
    author: a.author,
    publishedAt: a.publishedAt,
    readTime: a.readTime,
    featured: a.featured,
    cover: a.cover,
  };
}

const ALL_ITEMS = insightArticles.map(toItem);
const TOPICS = Array.from(new Set(insightArticles.flatMap((a) => a.tags))).slice(0, 10);

/* ---------- home ---------- */
function InsightsHome() {
  const featured = ALL_ITEMS.find((i) => i.featured) ?? ALL_ITEMS[0];
  const latest = [...insightArticles]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 6)
    .map(toItem);

  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.insights}>
        <div className="grid gap-10 pt-28 pb-16 md:pt-36 md:pb-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">Insights</span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Góc nhìn <span className="brand-gradient-text">công nghệ</span> cho doanh nghiệp
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Chiến lược, kiến trúc và câu chuyện thực tiễn về chuyển đổi số, AI, dữ liệu và PropTech — chắt lọc từ đội ngũ XTECH.
            </p>
            <Link href="/insights/danh-sach" className="btn-gold mt-7 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105">
              Xem tất cả bài viết <ArrowRight className="size-4" />
            </Link>
          </div>
          {featured ? <FeaturedCard item={featured} /> : null}
        </div>
      </EditorialHeroShell>

      <AmbientSection id="chu-de" city={false} compact>
        <h2 className="text-lg font-semibold tracking-tight text-blue">Theo chủ đề</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {insightCategories.map((c) => (
            <Link
              key={c.slug}
              href="/insights/danh-sach"
              className="group flex flex-col rounded-2xl border border-blue/12 bg-card/80 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_24px_60px_-30px_var(--accent-blue)]"
            >
              <IconTile name={c.icon} />
              <h3 className="mt-4 text-base font-semibold tracking-tight text-blue transition group-hover:text-gold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </div>
      </AmbientSection>

      <AmbientSection id="moi-nhat" soft city={false} compact>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-blue">Mới nhất</h2>
          <Link href="/insights/danh-sach" className="inline-flex items-center gap-1 text-sm font-semibold text-blue transition hover:text-gold">
            Xem tất cả bài viết <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((it, i) => (
            <ArticleCard key={it.href} item={it} delay={(i % 3) * 0.06} />
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <NewsletterBox />
        </div>
      </AmbientSection>
    </>
  );
}

/* ---------- listing ---------- */
function InsightsListing() {
  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.insights}>
        <div className="pt-28 pb-12 md:pt-36 md:pb-16">
          <nav className="text-xs text-white/60">
            <Link href="/insights" className="hover:text-white">Insights</Link> <span className="text-white/35">/</span> Tất cả bài viết
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Tất cả <span className="brand-gradient-text">bài viết</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Chiến lược, kiến trúc và câu chuyện thực tiễn về chuyển đổi số, AI, dữ liệu và PropTech.
          </p>
        </div>
      </EditorialHeroShell>
      <EditorialListing items={ALL_ITEMS} categories={insightCategories} topics={TOPICS} />
    </>
  );
}

/* ---------- detail ---------- */
function InsightDetail({ a }: { a: InsightArticle }) {
  const item = toItem(a);
  const related = insightArticles
    .filter((x) => x.slug !== a.slug && x.categorySlug === a.categorySlug)
    .concat(insightArticles.filter((x) => x.slug !== a.slug && x.categorySlug !== a.categorySlug))
    .slice(0, 3)
    .map(toItem);
  return (
    <ArticleDetail
      item={item}
      summary={a.summary}
      body={a.body}
      sectionLabel="Insights"
      sectionHref="/insights"
      related={related}
      relatedProducts={a.relatedProducts}
      bg={EDITORIAL_BG.insights}
    />
  );
}

export function InsightsPages({ route }: { route: string }) {
  if (route === "/insights") return <InsightsHome />;
  if (route === "/insights/danh-sach") return <InsightsListing />;
  const slug = route.startsWith("/insights/") ? route.slice("/insights/".length) : "";
  const a = insightBySlug(slug);
  if (a) return <InsightDetail a={a} />;
  return null;
}
