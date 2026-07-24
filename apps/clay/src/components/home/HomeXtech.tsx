"use client";

/**
 * Bespoke corporate homepage (SET HOMEPAGE V1). Overrides the CMS page for
 * corporate `/` in [[...slug]]/page.tsx. Reuses the about/c02 visual kits +
 * the sapphire+gold theme + handoff SVG icons. Content is a typed module for
 * now (fast review) and will move to CMS-driven next (same shape).
 *
 * Tech/AI motion (glow, connector-draw, orbit pulse, timeline) with real-estate
 * luxury (gold accents). Sticky scroll-scrub is reserved for a later pass on
 * Products + Services (kept lighter here). All motion reduced-motion safe.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { PostDoc } from "@x/shared-types";
import { Container } from "@/components/primitives";
import { Reveal, AmbientSection, GlassCard } from "@/components/corporate/about-kit";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { PartnerLogos } from "./PartnerLogos";
import { C02Timeline } from "@/components/services/c02/kit";
import Image from "next/image";
import { SectionHead, HomeIcon, IconTile, KeywordLine, DiagramImage, SplitLayout } from "./kit";
import { BenefitStrip } from "./visuals";
import {
  homeHero,
  homeSectionTitles,
  homeSolutions,
  homeProducts,
  homePlatformChips,
  homeSolutionSuites,
  homeServices,
  homeDeployment,
  homeBusinessValues,
  homeWhyXtech,
  homeSolutionBenefits,
  homeProductCallouts,
  homeServiceCapabilities,
  homeServiceBenefits,
  homeSuiteBenefits,
} from "@/data/home-content";

/* ---------------------------------------------------------------- */
/* Small shared bits                                                 */
/* ---------------------------------------------------------------- */
function GoldButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
    >
      {children}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}
function GhostButton({ href, children, onDark }: { href: string; children: React.ReactNode; onDark?: boolean }) {
  return (
    <a
      href={href}
      className={
        onDark
          ? "inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
          : "inline-flex h-12 items-center justify-center rounded-full border border-blue/20 px-6 text-sm font-semibold text-blue transition hover:bg-blue/5"
      }
    >
      {children}
    </a>
  );
}

/* ================================================================ */
/* H01 — Hero (dark): content left, platform core right              */
/* ================================================================ */
const HERO_HL = ["AI", "doanh nghiệp số", "bất động sản"];

function Hero() {
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-background text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/home/herobg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Left-to-right darkening so the copy stays readable over the artwork */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,24,0.94)_0%,rgba(6,10,24,0.8)_36%,rgba(6,10,24,0.3)_68%,rgba(6,10,24,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,24,0.4)_0%,transparent_30%,transparent_70%,rgba(6,10,24,0.4)_100%)] md:hidden" />
        <div className="absolute inset-0 bg-grid opacity-[0.05] mask-fade-b" />
      </div>

      <Container className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85 backdrop-blur">
              <span className="size-1.5 rounded-full bg-gold" />
              <ShinyText text={homeHero.eyebrow} />
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.4rem]">
              {homeHero.titleLines.map((l, i) => (
                <span key={i} className="block">
                  <KeywordLine text={l} highlight={HERO_HL} />
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
              {homeHero.description}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <GoldButton href={homeHero.primaryCta.href}>{homeHero.primaryCta.label}</GoldButton>
              <GhostButton href={homeHero.secondaryCta.href} onDark>
                {homeHero.secondaryCta.label}
              </GhostButton>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-9 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium text-white/85">
                  Đồng hành cùng doanh nghiệp trên hành trình chuyển đổi số
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-white/60">
                  {homeHero.capabilities.map((c, i) => (
                    <span key={c} className="flex items-center gap-2">
                      {i > 0 ? <span aria-hidden className="size-1 rounded-full bg-cyan/70" /> : null}
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </Container>
    </section>
  );
}

/* ================================================================ */
/* H02 — Trust band                                                  */
/* ================================================================ */
function Trust() {
  return <PartnerLogos />;
}

/* ================================================================ */
/* H03 — Solutions (hub-spoke + list)                                */
/* ================================================================ */
function Solutions() {
  return (
    <AmbientSection id="giai-phap" city={false} compact>
      <SectionHead title={homeSectionTitles.solutions} />
      <SplitLayout
        imageSide="left"
        visual={
          <Reveal>
            <DiagramImage
              src="/images/home/diagrams/solutions.png"
              alt="Sơ đồ giải pháp XTECH theo bài toán doanh nghiệp: chuyển đổi số, dữ liệu & AI, tự động hóa, tích hợp, doanh nghiệp kết nối"
            />
          </Reveal>
        }
      >
        <div className="grid gap-4">
          {homeSolutions.map((s, i) => (
            <Reveal key={s.id} delay={(i % 5) * 0.06}>
              <a
                href={s.href}
                className="group flex items-center gap-4 rounded-2xl border border-blue/12 bg-card/70 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45"
              >
                <IconTile name={s.icon} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-semibold tracking-tight text-blue">{s.title}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 self-center text-blue/40 transition group-hover:translate-x-0.5 group-hover:text-gold" />
              </a>
            </Reveal>
          ))}
        </div>
      </SplitLayout>
      <BenefitStrip items={homeSolutionBenefits} />
    </AmbientSection>
  );
}

/* ================================================================ */
/* H04 — Products (orbit + cards)                                    */
/* ================================================================ */
function Products() {
  return (
    <AmbientSection id="san-pham" soft city={false} compact>
      <SectionHead title={homeSectionTitles.products} />
      <SplitLayout
        imageSide="right"
        visual={
          <Reveal>
            <DiagramImage
              src="/images/home/diagrams/products.png"
              alt="Sơ đồ hệ sinh thái 5 sản phẩm XTECH quanh nền tảng chung: X.AI, XBooking, FinERP, XBuilding, X.Space"
            />
          </Reveal>
        }
      >
        <div className="grid gap-3">
          {homeProducts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 5) * 0.06}>
              <a
                href={p.href}
                className="group flex items-center gap-4 rounded-2xl border border-blue/12 bg-card/80 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45"
              >
                <IconTile name={p.icon} />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-blue">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
                <span className="ml-auto hidden shrink-0 items-center gap-1 self-center text-sm font-semibold text-blue transition group-hover:text-gold sm:inline-flex">
                  Tìm hiểu <ArrowRight className="size-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </SplitLayout>

      {/* Shared-platform chips */}
      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Nền tảng dùng chung</span>
          {homePlatformChips.map((c) => (
            <span key={c.title} className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-card/70 px-3 py-1.5 text-xs font-semibold text-blue backdrop-blur">
              <HomeIcon name={c.icon} size={18} />
              {c.title}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Callouts */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {homeProductCallouts.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.07}>
            <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/60 p-4">
              <span className="mt-0.5 shrink-0"><HomeIcon name={c.icon} size={28} /></span>
              <div>
                <h4 className="text-sm font-semibold text-blue">{c.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </AmbientSection>
  );
}

/* ================================================================ */
/* H05 — Platform (5 perspective tiers)                              */
/* ================================================================ */
const PLATFORM_FEATURES = [
  { icon: "data", title: "Dữ liệu thống nhất", description: "Chuẩn hóa, kết nối và khai thác dữ liệu toàn hệ sinh thái." },
  { icon: "workflow", title: "Quy trình liên thông", description: "Liên kết quy trình giữa các sản phẩm, giảm thao tác thủ công, tăng hiệu quả." },
  { icon: "ai", title: "AI dùng chung", description: "AI, mô hình và insight dùng chung, tối ưu trên dữ liệu hợp nhất." },
  { icon: "security", title: "Bảo mật & kiểm soát", description: "Phân quyền chặt chẽ, giám sát toàn diện, tuân thủ chuẩn quốc tế." },
];

function Platform() {
  return (
    <AmbientSection id="nen-tang" city compact>
      <SectionHead title={homeSectionTitles.platform} />
      <SplitLayout
        imageSide="left"
        visual={
          <Reveal>
            <DiagramImage
              src="/images/home/diagrams/platform.png"
              alt="Sơ đồ nền tảng dùng chung 5 tầng của XTECH: Sản phẩm, AI & Analytics, Workflow/Identity/API, Data Platform, Cloud & Security"
            />
          </Reveal>
        }
      >
        <div className="grid gap-4">
          {PLATFORM_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.07}>
              <div className="flex items-start gap-4 rounded-2xl border border-blue/12 bg-card/70 p-4 backdrop-blur">
                <IconTile name={f.icon} />
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-blue">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SplitLayout>

      {/* Bottom chips */}
      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {[...homePlatformChips, { title: "AI Services", description: "", icon: "ai" }].map((c) => (
            <span key={c.title} className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-card/70 px-3 py-1.5 text-xs font-semibold text-blue backdrop-blur">
              <HomeIcon name={c.icon} size={18} />
              {c.title}
            </span>
          ))}
        </div>
      </Reveal>
    </AmbientSection>
  );
}

/* ================================================================ */
/* H06 — Solution Suites (tabs + business flow)                      */
/* ================================================================ */
function Suites() {
  const [active, setActive] = useState(0);
  const suite = homeSolutionSuites[active]!;
  return (
    <AmbientSection id="bo-giai-phap-x" soft city={false} compact>
      <SectionHead title={homeSectionTitles.suites} />
      {/* Tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {homeSolutionSuites.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            className={
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition " +
              (i === active
                ? "border-gold/50 bg-gold/10 text-blue"
                : "border-blue/15 bg-card/60 text-muted-foreground hover:border-blue/30 hover:text-blue")
            }
          >
            <HomeIcon name={s.icon} size={20} />
            {s.title}
          </button>
        ))}
      </div>

      <SplitLayout
        imageSide="right"
        className="mt-6"
        visual={
          <Reveal>
            <DiagramImage
              src="/images/home/diagrams/suites.png"
              alt="Sơ đồ hành trình nghiệp vụ bất động sản quanh nền tảng X: marketing, lead & CRM, booking, hợp đồng, thanh toán, bàn giao, vận hành, chăm sóc"
            />
          </Reveal>
        }
      >
        <Reveal key={suite.id}>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Bộ giải pháp nổi bật</span>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-blue">{suite.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{suite.description}</p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Sản phẩm trong bộ giải pháp</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {homeProducts.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full border border-blue/15 bg-card/70 px-3 py-1.5 text-xs font-semibold text-blue">
                  <HomeIcon name={p.icon} size={16} />
                  {p.title}
                </span>
              ))}
            </div>
            <div className="mt-7">
              <GoldButton href={suite.href ?? "/bo-giai-phap-x"}>Khám phá chi tiết giải pháp</GoldButton>
            </div>
          </div>
        </Reveal>
      </SplitLayout>

      <BenefitStrip items={homeSuiteBenefits} />
    </AmbientSection>
  );
}

/* ================================================================ */
/* H07 — Services (6-step timeline)                                  */
/* ================================================================ */
function Services() {
  const steps = homeServices.map((s, i) => ({
    itemId: String(i),
    order: s.order,
    title: s.title,
    description: s.description,
  }));
  return (
    <AmbientSection id="dich-vu" city={false} compact>
      <SectionHead title={homeSectionTitles.services} />
      <C02Timeline steps={steps} />
      {/* Capability cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeServiceCapabilities.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.07}>
            <Link
              href="/dich-vu"
              className="group flex items-start gap-4 rounded-2xl border border-blue/12 bg-card/70 p-5 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45"
            >
              <IconTile name={c.icon} />
              <div>
                <h3 className="text-base font-semibold tracking-tight text-blue">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              </div>
              <ArrowRight className="ml-auto size-4 shrink-0 self-center text-blue/40 transition group-hover:translate-x-0.5 group-hover:text-gold" />
            </Link>
          </Reveal>
        ))}
      </div>
      <BenefitStrip items={homeServiceBenefits} />
    </AmbientSection>
  );
}

/* ================================================================ */
/* H08 — Deployment (hub + 4 models)                                 */
/* ================================================================ */
function Deployment() {
  return (
    <AmbientSection id="trien-khai" soft city compact>
      <SectionHead title={homeSectionTitles.deployment} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeDeployment.map((d, i) => (
          <Reveal key={d.id} delay={(i % 4) * 0.07}>
            <GlassCard className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/45">
              <IconTile name={d.icon} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </AmbientSection>
  );
}

/* ================================================================ */
/* H09 — Business value + why XTECH                                  */
/* ================================================================ */
function BusinessValue() {
  return (
    <AmbientSection id="gia-tri" city={false} compact>
      <SectionHead title={homeSectionTitles.value} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeBusinessValues.map((v, i) => (
          <Reveal key={v.title} delay={(i % 3) * 0.07}>
            <GlassCard className="h-full p-6">
              <IconTile name={v.icon} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeWhyXtech.map((w, i) => (
          <Reveal key={w.title} delay={(i % 4) * 0.06}>
            <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/60 p-4">
              <span className="mt-0.5 shrink-0"><HomeIcon name={w.icon} size={28} /></span>
              <div>
                <h4 className="text-sm font-semibold text-blue">{w.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </AmbientSection>
  );
}

/* ================================================================ */
/* H10 — Customers & Insights (CMS posts)                            */
/* ================================================================ */
function CustomersInsights({ posts }: { posts: PostDoc[] }) {
  const latest = posts.slice(0, 3);
  return (
    <AmbientSection id="insights" soft city={false} compact>
      <SectionHead title={homeSectionTitles.customers} />
      {latest.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07}>
              <a href={`/insights/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-blue/12 bg-card/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/45">
                {p.category ? <span className="text-xs font-semibold uppercase tracking-wide text-cyan">{p.category}</span> : null}
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-blue">{p.title}</h3>
                {p.excerpt ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p> : null}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue transition group-hover:text-gold">
                  Đọc bài <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">Nội dung Insights sẽ hiển thị tại đây.</p>
      )}
      <div className="mt-10 text-center">
        <GhostButton href="/insights">Xem tất cả Insights</GhostButton>
      </div>
    </AmbientSection>
  );
}

/* ================================================================ */
/* H11 — Final CTA (dark)                                            */
/* ================================================================ */
function FinalCTA() {
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-background py-20 text-white md:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ambient opacity-90" />
        <div className="absolute inset-0 bg-grid opacity-[0.08] mask-fade-b" />
        <span className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/15 blur-[120px]" />
      </div>
      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl">
            <span className="block">Sẵn sàng cùng XTECH</span>
            <span className="block">chuyển đổi số doanh nghiệp của bạn?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            Đặt lịch demo hoặc trao đổi với chuyên gia để nhận tư vấn lộ trình phù hợp.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <GoldButton href="/dat-lich-demo">Đặt lịch demo</GoldButton>
            <GhostButton href="/lien-he" onDark>Liên hệ tư vấn</GhostButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================ */
/* Composition                                                       */
/* ================================================================ */
export function HomeXtech({ posts = [] }: { posts?: PostDoc[] }) {
  return (
    <>
      <Hero />
      <Trust />
      <Solutions />
      <Products />
      <Platform />
      <Suites />
      <Services />
      <Deployment />
      <BusinessValue />
      <CustomersInsights posts={posts} />
      <FinalCTA />
    </>
  );
}
