"use client";

/**
 * Shared editorial kit for the News + Insights sections (same design language,
 * per XTECH_NEWS_CLAUDE_HANDOFF_V1). Content is normalized to `EditorialItem`
 * so both sections reuse the same cards, hero, sidebar and detail layout.
 * No fabricated author identities/photos — bylines default to "Đội ngũ XTECH"
 * and thumbnails are category-tinted gradients (not stock photos).
 */

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Container } from "@/components/primitives";
import { Reveal } from "@/components/corporate/about-kit";
import { HomeIcon } from "@/components/home/kit";
import { cn } from "@/lib/utils";

export type EditorialItem = {
  href: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  categorySlug: string;
  categoryIcon: string;
  tags: string[];
  author?: string;
  publishedAt?: string;
  readTime?: string;
  featured?: boolean;
  pinned?: boolean;
  cover?: string; // public path to a cover illustration (falls back to gradient thumb)
};

/** Structured article body block (rendered by ArticleDetail). */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string };

/** Cover illustration for cards/hero — real image when provided, else the
 * category gradient thumb so nothing looks empty. */
export function CoverOrThumb({
  cover,
  icon,
  slug,
  className,
  alt = "",
}: {
  cover?: string;
  icon: string;
  slug: string;
  className?: string;
  alt?: string;
}) {
  if (cover) {
    return (
      <div className={cn("relative overflow-hidden bg-card", className)}>
        <Image src={cover} alt={alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
    );
  }
  return <CategoryThumb icon={icon} slug={slug} className={className} />;
}

/* ---------- helpers ---------- */

export function formatVNDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d} tháng ${m}, ${y}`;
}

const GRADIENTS = [
  "from-blue/25 via-blue/10 to-cyan/20",
  "from-violet/25 via-violet/10 to-blue/20",
  "from-cyan/25 via-blue/10 to-violet/20",
  "from-blue/20 via-cyan/12 to-cyan/25",
];
function gradientFor(slug: string): string {
  let h = 0;
  for (const c of slug) h = (h + c.charCodeAt(0)) % GRADIENTS.length;
  return GRADIENTS[h]!;
}

/* ---------- thumbnail ---------- */

export function CategoryThumb({
  icon,
  slug,
  className,
}: {
  icon: string;
  slug: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        gradientFor(slug),
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.12]" />
      <span className="relative flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
        <HomeIcon name={icon} size={30} />
      </span>
    </div>
  );
}

/* ---------- meta row ---------- */

export function MetaRow({
  author,
  publishedAt,
  readTime,
  light,
  className,
}: {
  author?: string;
  publishedAt?: string;
  readTime?: string;
  light?: boolean;
  className?: string;
}) {
  const tone = light ? "text-white/70" : "text-muted-foreground";
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", tone, className)}>
      {author ? (
        <span className="inline-flex items-center gap-1.5">
          <User className="size-3.5" /> {author}
        </span>
      ) : null}
      {publishedAt ? (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" /> {formatVNDate(publishedAt)}
        </span>
      ) : null}
      {readTime ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" /> {readTime}
        </span>
      ) : null}
    </div>
  );
}

/* ---------- cards ---------- */

export function ArticleCard({ item, delay = 0 }: { item: EditorialItem; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={item.href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue/12 bg-card/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_24px_60px_-30px_var(--accent-blue)]"
      >
        <CoverOrThumb cover={item.cover} alt={item.title} icon={item.categoryIcon} slug={item.categorySlug} className="aspect-[16/9] w-full" />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">{item.categoryLabel}</span>
            {item.pinned ? (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">Ghim</span>
            ) : null}
          </div>
          <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-blue transition group-hover:text-gold">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
          <MetaRow author={item.author} publishedAt={item.publishedAt} readTime={item.readTime} className="mt-4" />
        </div>
      </a>
    </Reveal>
  );
}

export function FeaturedCard({ item }: { item: EditorialItem }) {
  return (
    <a
      href={item.href}
      className="group grid overflow-hidden rounded-3xl border border-white/12 bg-white/5 backdrop-blur transition hover:border-gold/40 sm:grid-cols-2"
    >
      <CoverOrThumb cover={item.cover} alt={item.title} icon={item.categoryIcon} slug={item.categorySlug} className="min-h-[220px] w-full" />
      <div className="flex flex-col justify-center p-6 md:p-8">
        <span className="w-fit rounded-full bg-blue/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
          {item.categoryLabel}
        </span>
        <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">{item.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">{item.excerpt}</p>
        <MetaRow author={item.author} publishedAt={item.publishedAt} readTime={item.readTime} light className="mt-4" />
        <span className="btn-gold mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-full px-5 text-sm font-semibold transition group-hover:brightness-105">
          Đọc bài viết <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

/* ---------- hero shells ---------- */

/** Route → header background image (from XTECH_EDITORIAL_HEADER_BACKGROUNDS_V2). */
export const EDITORIAL_BG = {
  news: "/images/editorial/news.png",
  newsDetail: "/images/editorial/news-detail.png",
  insights: "/images/editorial/insights.png",
  kinhNghiem: "/images/editorial/kinh-nghiem.png",
  trienKhai: "/images/editorial/trien-khai.png",
} as const;

/** Navy overlay so hero copy stays legible over the artwork (handoff spec). */
const HERO_OVERLAY =
  "linear-gradient(90deg, rgba(4,10,20,0.94) 0%, rgba(4,10,20,0.84) 36%, rgba(6,16,30,0.62) 60%, rgba(9,35,70,0.38) 100%), linear-gradient(180deg, rgba(3,8,18,0.15) 0%, rgba(3,8,18,0.42) 100%)";

export function EditorialHeroShell({ children, bg }: { children: ReactNode; bg?: string }) {
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-background text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {bg ? (
          <>
            <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover object-right" />
            <div className="absolute inset-0" style={{ backgroundImage: HERO_OVERLAY }} />
            <div className="absolute inset-0 bg-grid opacity-[0.05] mask-fade-b" />
          </>
        ) : (
          <>
            <div className="absolute -right-24 -top-24 size-[38rem] rounded-full bg-blue opacity-25 blur-[130px] animate-aurora" />
            <div className="absolute right-1/4 top-10 size-[26rem] rounded-full bg-cyan opacity-15 blur-[120px] animate-aurora [animation-delay:3s]" />
            <div className="absolute inset-0 bg-grid opacity-[0.07] mask-fade-b" />
          </>
        )}
      </div>
      <Container className="relative">{children}</Container>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/60">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.href ? (
            <a href={it.href} className="transition hover:text-white">{it.label}</a>
          ) : (
            <span className="text-white/80">{it.label}</span>
          )}
          {i < items.length - 1 ? <ChevronRight className="size-3 text-white/35" /> : null}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : null;
  return (
    <EditorialHeroShell>
      <div className="pt-28 pb-12 md:pt-36 md:pb-16">
        {breadcrumb ? <Breadcrumbs items={breadcrumb} /> : eyebrow ? (
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">{eyebrow}</span>
        ) : null}
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          {parts ? (
            <>{parts[0]}<span className="brand-gradient-text">{highlight}</span>{parts[1]}</>
          ) : (
            title
          )}
        </h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{subtitle}</p> : null}
      </div>
    </EditorialHeroShell>
  );
}

/* ---------- sidebar pieces ---------- */

export function SidebarFeatured({ title, items }: { title: string; items: EditorialItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-blue">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item.href}>
            <a href={item.href} className="group flex gap-3">
              <span className="relative">
                <CategoryThumb icon={item.categoryIcon} slug={item.categorySlug} className="size-16 shrink-0" />
                <span className="absolute -left-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
                  {i + 1}
                </span>
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-blue transition group-hover:text-gold">{item.title}</p>
                <MetaRow publishedAt={item.publishedAt} readTime={item.readTime} className="mt-1.5" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TagChips({ title, tags, className }: { title?: string; tags: string[]; className?: string }) {
  return (
    <div className={className}>
      {title ? <h3 className="text-sm font-semibold tracking-tight text-blue">{title}</h3> : null}
      <div className={cn("flex flex-wrap gap-2", title && "mt-4")}>
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-blue/12 bg-blue/5 px-3 py-1 text-xs font-medium text-blue">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function NewsletterBox() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formCode: "newsletter",
          siteCode: "corporate",
          payload: { email: data.get("email") ?? "" },
          consent: true,
        }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="rounded-2xl border border-white/12 bg-[oklch(0.2_0.03_262)] p-6 text-white">
      <h3 className="text-base font-bold tracking-tight">Nhận bản tin XTECH Insights</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Đăng ký nhận bài viết mới nhất, xu hướng nổi bật và sự kiện từ XTECH.
      </p>
      {status === "ok" ? (
        <p className="mt-4 rounded-xl border border-gold/30 bg-white/5 p-3 text-sm text-white/90">
          Cảm ơn bạn đã đăng ký!
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Nhập email của bạn"
            className="h-11 flex-1 rounded-full border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-gold/60"
          />
          <button type="submit" disabled={status === "sending"} className="btn-gold h-11 shrink-0 rounded-full px-5 text-sm font-semibold disabled:opacity-60">
            {status === "sending" ? "…" : "Đăng ký"}
          </button>
        </form>
      )}
      <p className="mt-3 text-xs text-white/45">Chúng tôi cam kết bảo mật thông tin của bạn.</p>
    </div>
  );
}
