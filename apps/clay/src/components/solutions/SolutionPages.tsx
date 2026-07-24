"use client";

/**
 * SET G02 — Menu Giải pháp renderer. Dark hero + section layouts
 * (grid / visual-left|right / chips / steps) dựng từ solution-content, dùng asset
 * thiết kế webp. Bám theme + kit hiện có; ảnh bấm xem full (ImageZoom).
 */

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, AmbientSection } from "@/components/corporate/about-kit";
import { SectionHead, SplitLayout } from "@/components/home/kit";
import type { SectionTitle } from "@/data/home-content";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ImageZoom } from "@/components/ImageZoom";
import { PRODUCT_META } from "@/data/suite-content";
import { solutionByRoute, type SolutionPage, type SolSection } from "@/data/solution-content";

function head(eyebrow: string | undefined, title: string, subtitle?: string, highlight?: string[]): SectionTitle {
  return { eyebrow: eyebrow ?? "", lines: [title], subtitle, highlight };
}

function GoldCTA({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105">
      {label}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function Framed({ src, alt }: { src: string; alt: string }) {
  return (
    <Reveal>
      <div className="group relative">
        <div aria-hidden className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-tr from-blue/20 via-cyan/10 to-violet/20 opacity-60 blur-2xl transition duration-500 group-hover:opacity-90" />
        <div className="overflow-hidden rounded-2xl border border-blue/15 bg-card/70 shadow-[0_28px_70px_-40px_var(--accent-blue)]">
          <ImageZoom src={src} alt={alt} caption={alt} />
        </div>
      </div>
    </Reveal>
  );
}

function ItemCards({ items }: { items: { title: string; description?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it, k) => (
        <Reveal key={it.title} delay={(k % 2) * 0.06}>
          <SpotlightCard className="h-full rounded-2xl">
            <div className="flex h-full items-start gap-3 rounded-2xl border border-blue/12 bg-card/70 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45">
              <span className="icon-gold mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg"><Check className="size-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-blue">{it.title}</p>
                {it.description ? <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{it.description}</p> : null}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  );
}

function Chips({ items }: { items: { title: string }[] }) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2.5">
      {items.map((it) => (
        <span key={it.title} className="rounded-full border border-blue/15 bg-card/70 px-4 py-2 text-sm font-semibold text-blue backdrop-blur">{it.title}</span>
      ))}
    </div>
  );
}

function Steps({ items }: { items: { title: string }[] }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {items.map((it, k) => (
        <div key={it.title} className="flex items-center gap-2">
          <Reveal delay={k * 0.06}>
            <div className="flex items-center gap-2 rounded-2xl border border-blue/12 bg-card/80 px-4 py-3 backdrop-blur">
              <span className="text-xs font-bold text-cyan">{String(k + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold text-blue">{it.title}</span>
            </div>
          </Reveal>
          {k < items.length - 1 ? <ArrowRight aria-hidden className="size-4 shrink-0 text-cyan" /> : null}
        </div>
      ))}
    </div>
  );
}

function SectionView({ s, i }: { s: SolSection; i: number }) {
  const body = (() => {
    switch (s.layout) {
      case "chips":
        return s.items ? <Chips items={s.items} /> : null;
      case "steps":
        return s.items ? <Steps items={s.items} /> : null;
      case "visual-left":
      case "visual-right":
        return (
          <div className="mt-8">
            <SplitLayout visual={s.image ? <Framed src={s.image} alt={s.title} /> : null} imageSide={s.layout === "visual-right" ? "right" : "left"}>
              {s.items?.length ? <ItemCards items={s.items} /> : null}
            </SplitLayout>
          </div>
        );
      default: // grid
        return <div className="mt-8">{s.items ? <ItemCards items={s.items} /> : null}</div>;
    }
  })();

  return (
    <AmbientSection id={s.sectionId} soft={i % 2 === 1} compact>
      <SectionHead title={head(s.eyebrow, s.title, s.description)} />
      {body}
    </AmbientSection>
  );
}

function SolutionHero({ p }: { p: SolutionPage }) {
  return (
    <section className="product-hero theme-dark relative isolate overflow-hidden bg-[oklch(0.17_0.03_265)] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image src={p.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(10,14,30,0.72) 0%, rgba(10,14,30,0.58) 45%, rgba(10,14,30,0.9) 100%)" }} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
        <div className="absolute -right-40 top-10 size-[32rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.12] mask-fade-b" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-32 pb-20 text-center md:px-6 md:pt-40 md:pb-24">
        <SectionHead title={head(p.eyebrow, p.title, p.summary, [p.title])} animate />
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <GoldCTA label="Đặt lịch demo" href="/dat-lich-demo" />
          <a href="/lien-he" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/15">
            Trao đổi với chuyên gia
          </a>
        </div>
      </div>
    </section>
  );
}

function SolutionCTA({ p }: { p: SolutionPage }) {
  return (
    <section className="relative isolate overflow-hidden bg-[oklch(0.17_0.03_265)] py-20 text-white md:py-24">
      {p.ctaImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image src={p.ctaImage} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(10,14,30,0.85), rgba(10,14,30,0.92))" }} />
        </div>
      ) : null}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{p.ctaTitle}</h2>
        <p className="text-pretty text-base leading-relaxed text-white/75">{p.ctaDescription}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <GoldCTA label="Đặt lịch demo" href="/dat-lich-demo" />
          <a href="/lien-he" className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/15">Liên hệ tư vấn</a>
        </div>
        {p.relatedProducts?.length ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {p.relatedProducts.map((k) => {
              const m = PRODUCT_META[k];
              if (!m) return null;
              return <a key={k} href={m.href} className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-white/50">{m.title}</a>;
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SolutionPages({ route }: { route: string }) {
  const p = solutionByRoute(route);
  if (!p) return null;
  return (
    <>
      <SolutionHero p={p} />
      {p.sections.map((s, i) => <SectionView key={s.sectionId} s={s} i={i} />)}
      <SolutionCTA p={p} />
    </>
  );
}
