"use client";

/**
 * Reusable article detail (News + Insights), per XTECH_NEWS_CLAUDE_HANDOFF_V1:
 * dark hero (breadcrumb + title + summary + meta + share) then a 2-column body
 * (rich text + related articles) with a sticky sidebar (topics, meta, share,
 * newsletter). Rich body is optional; the excerpt renders as the lead.
 */

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bookmark, Calendar, Clock, Link2, Quote, Tag } from "lucide-react";
import { Reveal } from "@/components/corporate/about-kit";
import { PRODUCT_META } from "@/data/suite-content";
import {
  ArticleCard,
  Breadcrumbs,
  CoverOrThumb,
  EditorialHeroShell,
  MetaRow,
  NewsletterBox,
  TagChips,
  formatVNDate,
  type ArticleBlock,
  type EditorialItem,
} from "./kit";

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return <h2 key={i} className="mt-4 text-xl font-semibold tracking-tight text-blue md:text-2xl">{b.text}</h2>;
        if (b.type === "quote")
          return (
            <blockquote key={i} className="relative rounded-2xl border border-blue/12 bg-blue/5 p-6">
              <Quote className="absolute left-5 top-5 size-5 text-gold/60" />
              <p className="pl-8 text-base italic leading-relaxed text-foreground">“{b.text}”</p>
              {b.cite ? <footer className="mt-2 pl-8 text-sm text-muted-foreground">— {b.cite}</footer> : null}
            </blockquote>
          );
        if (b.type === "list")
          return (
            <ul key={i} className="flex flex-col gap-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2.5 text-base leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        if (b.type === "image")
          return (
            <figure key={i} className="my-2 overflow-hidden rounded-2xl border border-blue/12 bg-card/70">
              <Image src={b.src} alt={b.alt ?? ""} width={1200} height={800} sizes="(min-width:1024px) 720px, 100vw" className="h-auto w-full object-cover" />
              {b.caption ? <figcaption className="px-4 py-2.5 text-center text-sm text-muted-foreground">{b.caption}</figcaption> : null}
            </figure>
          );
        return <p key={i} className="text-base leading-relaxed text-muted-foreground">{b.text}</p>;
      })}
    </div>
  );
}

function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-blue/15 bg-card px-3 py-1.5 text-xs font-medium text-blue transition hover:border-gold/45">
        <Link2 className="size-3.5" /> {copied ? "Đã sao chép" : "Sao chép link"}
      </button>
    </div>
  );
}

export function ArticleDetail({
  item,
  summary,
  body,
  sectionLabel,
  sectionHref,
  related,
  relatedProducts,
  bg,
}: {
  item: EditorialItem;
  summary: string;
  body?: ArticleBlock[];
  sectionLabel: string;
  sectionHref: string;
  related: EditorialItem[];
  relatedProducts?: string[];
  bg?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: summary,
    image: item.cover ? [`https://x.vn${item.cover}`] : undefined,
    datePublished: item.publishedAt,
    author: { "@type": "Organization", name: item.author ?? "XTECH" },
    publisher: {
      "@type": "Organization",
      name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ X-TECH",
      logo: { "@type": "ImageObject", url: "https://x.vn/brand/xtech-logo-color-original.png" },
    },
    articleSection: item.categoryLabel,
    keywords: item.tags.join(", "),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <EditorialHeroShell bg={bg}>
        <div className="grid gap-8 pt-28 pb-12 md:pt-36 md:pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Breadcrumbs
              items={[
                { label: sectionLabel, href: sectionHref },
                { label: item.categoryLabel },
              ]}
            />
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <MetaRow author={item.author ?? "Đội ngũ XTECH"} publishedAt={item.publishedAt} readTime={item.readTime} light />
            </div>
          </div>
          <CoverOrThumb cover={item.cover} alt={item.title} icon={item.categoryIcon} slug={item.categorySlug} className="hidden aspect-[4/3] w-full rounded-2xl lg:block" />
        </div>
      </EditorialHeroShell>

      {/* Body + sidebar */}
      <section className="bg-background py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <Reveal>
              <p className="text-lg leading-relaxed text-foreground/90">{summary}</p>
            </Reveal>
            {body?.length ? (
              <div className="mt-8">
                <ArticleBody blocks={body} />
              </div>
            ) : null}

            {relatedProducts?.length ? (
              <div className="mt-10 rounded-2xl border border-blue/12 bg-blue/5 p-6">
                <p className="text-sm font-semibold text-blue">Sản phẩm liên quan</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedProducts.map((p) => {
                    const m = PRODUCT_META[p];
                    if (!m) return null;
                    return (
                      <a key={p} href={m.href} className="rounded-full border border-blue/15 bg-card px-3 py-1.5 text-sm font-semibold text-blue transition hover:border-gold/45 hover:text-gold">
                        {m.title}
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Related articles */}
            {related.length ? (
              <div className="mt-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-blue">Bài viết liên quan</h2>
                  <a href={sectionHref} className="inline-flex items-center gap-1 text-sm font-semibold text-blue transition hover:text-gold">
                    Xem tất cả <ArrowRight className="size-4" />
                  </a>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  {related.slice(0, 3).map((r, i) => (
                    <ArticleCard key={r.href} item={r} delay={i * 0.06} />
                  ))}
                </div>
              </div>
            ) : null}

            <a href={sectionHref} className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-blue transition hover:text-gold">
              <ArrowLeft className="size-4" /> Quay lại {sectionLabel}
            </a>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            {item.tags.length ? <TagChips title="Chủ đề" tags={item.tags} /> : null}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold tracking-tight text-blue">Thông tin bài viết</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                {item.publishedAt ? (
                  <li className="flex items-center gap-2.5"><Calendar className="size-4 text-gold" /> Ngày đăng: {formatVNDate(item.publishedAt)}</li>
                ) : null}
                {item.readTime ? (
                  <li className="flex items-center gap-2.5"><Clock className="size-4 text-gold" /> Thời gian đọc: {item.readTime}</li>
                ) : null}
                <li className="flex items-center gap-2.5"><Tag className="size-4 text-gold" /> Danh mục: {item.categoryLabel}</li>
                <li className="flex items-center gap-2.5"><Bookmark className="size-4 text-gold" /> {item.author ?? "Đội ngũ XTECH"}</li>
              </ul>
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-sm font-semibold text-blue">Chia sẻ bài viết</p>
                <ShareRow title={item.title} />
              </div>
            </div>
            <NewsletterBox />
          </aside>
        </div>
      </section>
    </>
  );
}
