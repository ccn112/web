"use client";

/**
 * SET G02 — Menu Giải pháp renderer. Dark hero + section layouts
 * (grid / visual-left|right / chips / steps) dựng từ solution-content, dùng asset
 * thiết kế webp. Bám theme + kit hiện có; ảnh bấm xem full (ImageZoom).
 */

import Image from "next/image";
import {
  ArrowRight, Sparkles, Database, BarChart3, Brain, Plug, RefreshCw, ShieldCheck,
  Workflow, ClipboardCheck, Bell, Users, Cloud, Gauge, Headset, Wallet, Activity,
  Smartphone, Layers, FileText, Building2, AlertTriangle, Network, Boxes,
  type LucideIcon,
} from "lucide-react";
import { Reveal, AmbientSection } from "@/components/corporate/about-kit";
import { SectionHead, SplitLayout } from "@/components/home/kit";
import type { SectionTitle } from "@/data/home-content";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ImageZoom } from "@/components/ImageZoom";
import { PRODUCT_META } from "@/data/suite-content";
import type { SolutionPage, SolSection } from "@/data/solution-content";
import { cn } from "@/lib/utils";

function head(eyebrow: string | undefined, title: string, subtitle?: string, highlight?: string[]): SectionTitle {
  return { eyebrow: eyebrow ?? "", lines: [title], subtitle, highlight };
}

/** Meaningful icon per item, matched by content keywords (bám nội dung mục). */
const ICON_RULES: [RegExp, LucideIcon][] = [
  [/dữ liệu|data hub|data\b/i, Database],
  [/báo cáo|dashboard|bi\b|phân tích|insight|điều hành|tổng hợp/i, BarChart3],
  [/ai|agent|rag|tri thức|knowledge|dự báo/i, Brain],
  [/api|gateway|connector|tích hợp/i, Plug],
  [/event|bus|đồng bộ|sync/i, RefreshCw],
  [/bảo mật|security|phân quyền|governance|an toàn|ký số/i, ShieldCheck],
  [/workflow|tự động|automation|quy trình|luồng|rule/i, Workflow],
  [/phê duyệt|duyệt|approval/i, ClipboardCheck],
  [/thông báo|nhắc|cảnh báo|sla/i, Bell],
  [/cộng tác|phối hợp|giao việc|làm việc|người dùng|trải nghiệm/i, Users],
  [/cloud|hạ tầng|on-?premise|saas|hybrid|triển khai/i, Cloud],
  [/tài chính|dòng tiền|kế toán|chi phí|ngân sách|thanh toán|chi\b/i, Wallet],
  [/giám sát|monitor|logging|theo dõi/i, Activity],
  [/web|mobile|portal|kênh|onboarding/i, Smartphone],
  [/mở rộng|linh hoạt|nền tảng|blueprint/i, Layers],
  [/biểu mẫu|form|chứng từ|hồ sơ/i, FileText],
  [/bất động sản|chủ đầu tư|tòa nhà|đô thị|cư dân/i, Building2],
  [/rời rạc|phân tán|không đồng bộ|nhập liệu|chậm|khó/i, AlertTriangle],
  [/kết nối|network|hệ thống/i, Network],
  [/erp|sản xuất|kho|bộ giải pháp|đóng gói/i, Boxes],
  [/chăm sóc|khách hàng|dịch vụ|hỗ trợ/i, Headset],
  [/quyết định|hiệu suất|năng suất|kết quả|tốc độ/i, Gauge],
];
function iconForItem(title: string): LucideIcon {
  for (const [re, ic] of ICON_RULES) if (re.test(title)) return ic;
  return Sparkles;
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

/** Card grid — columns adapt to item count (1 col beside an image, else 2–3)
 * so nothing looks force-fit into a rigid layout. */
function ItemCards({ items, cols }: { items: { title: string; description?: string }[]; cols: 1 | 2 | 3 }) {
  const colClass = cols === 1 ? "" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={cn("grid gap-4", colClass)}>
      {items.map((it, k) => {
        const Ico = iconForItem(it.title);
        return (
          <Reveal key={it.title} delay={(k % 3) * 0.05}>
            <SpotlightCard className="h-full rounded-2xl">
              <div className="flex h-full items-start gap-3.5 rounded-2xl border border-blue/12 bg-card/70 p-5 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue/15 bg-gradient-to-br from-blue/12 to-cyan/8 text-blue transition group-hover:border-gold/45">
                  <Ico className="size-5" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold tracking-tight text-blue">{it.title}</p>
                  {it.description ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.description}</p> : null}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        );
      })}
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
              {s.items?.length ? <ItemCards items={s.items} cols={1} /> : null}
            </SplitLayout>
          </div>
        );
      default: // grid
        return <div className="mt-8">{s.items ? <ItemCards items={s.items} cols={s.items.length >= 5 ? 3 : 2} /> : null}</div>;
    }
  })();

  return (
    <AmbientSection id={s.sectionId} soft={i % 2 === 1} city={false} compact className="[&_.bg-grid-tech]:opacity-40">
      <SectionHead title={head(s.eyebrow, s.title, s.description)} />
      {body}
    </AmbientSection>
  );
}

function SolutionHero({ p }: { p: SolutionPage }) {
  return (
    <section className="product-hero theme-dark relative isolate overflow-hidden bg-[oklch(0.17_0.03_265)] text-white">
      {/* High-res shared backdrop (crisp full-bleed); designed G02 assets are
          low-res so they're used only as smaller in-section visuals. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/images/backgrounds/home/hero-ecosystem.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(10,14,30,0.78) 0%, rgba(10,14,30,0.6) 45%, rgba(10,14,30,0.9) 100%)" }} />
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

export function SolutionPages({ page: p }: { page: SolutionPage }) {
  if (!p) return null;
  return (
    <>
      <SolutionHero p={p} />
      {p.sections.map((s, i) => <SectionView key={s.sectionId} s={s} i={i} />)}
      <SolutionCTA p={p} />
    </>
  );
}
