"use client";

/**
 * SET C05 — Solution Suites. Landing (/bo-giai-phap-x) lists the 5 suites;
 * each detail page (/bo-giai-phap-x/<slug>) shows business journey, products
 * (by role), platform, services, deployment, outcomes and roadmap. Reuses the
 * home/about/c02 kit; content is a typed module (CMS-driven later).
 */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal, AmbientSection, GlassCard } from "@/components/corporate/about-kit";
import { SectionHead, HomeIcon, IconTile } from "@/components/home/kit";
import { C02Timeline } from "@/components/services/c02/kit";
import {
  suites,
  suiteBySlug,
  PRODUCT_META,
  SERVICE_LABEL,
  DEPLOY_LABEL,
  ROLE_LABEL,
  type SolutionSuite,
} from "@/data/suite-content";

function GoldCTA({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
    >
      {label}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function JourneyFlow({ steps }: { steps: { order: number; title: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {steps.map((s, i) => (
        <span key={s.order} className="flex items-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue">
            <span className="text-cyan">{String(s.order).padStart(2, "0")}</span>
            {s.title}
          </span>
          {i < steps.length - 1 ? <ArrowRight aria-hidden className="mx-0.5 size-3.5 text-cyan" /> : null}
        </span>
      ))}
    </div>
  );
}

/* ---- Landing: /bo-giai-phap-x ---- */
export function SuitesLanding() {
  return (
    <AmbientSection id="bo-giai-phap-x" city={false} compact>
      <SectionHead
        title={{
          eyebrow: "Bộ giải pháp X",
          lines: ["Đóng gói theo", "loại hình doanh nghiệp"],
          highlight: ["loại hình doanh nghiệp"],
          subtitle: "XTECH đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp phù hợp với từng mô hình doanh nghiệp.",
        }}
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {suites.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.07}>
            <a
              href={`/bo-giai-phap-x/${s.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-blue/12 bg-card/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_24px_60px_-30px_var(--accent-blue)]"
            >
              <IconTile name={s.icon} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.businessJourney.slice(0, 4).map((j) => (
                  <span key={j.order} className="rounded-full border border-blue/10 bg-blue/5 px-2 py-0.5 text-[11px] font-semibold text-blue">{j.title}</span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue transition group-hover:text-gold">
                Xem chi tiết <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </AmbientSection>
  );
}

/* ---- Detail: /bo-giai-phap-x/<slug> ---- */
function SuiteDetail({ suite }: { suite: SolutionSuite }) {
  const products = suite.products.filter((p) => p.role !== "not-applicable");
  const roadmap = suite.roadmap.map((r) => ({ itemId: String(r.phase), order: r.phase, title: r.title, description: r.description }));
  return (
    <AmbientSection id={suite.slug} city={false} compact>
      <SectionHead
        title={{
          eyebrow: "Bộ giải pháp X",
          lines: [suite.title],
          highlight: [suite.title],
          subtitle: suite.summary,
        }}
      />

      {/* Business journey */}
      <Reveal delay={0.05}>
        <div className="mt-8 rounded-2xl border border-blue/12 bg-card/60 p-5 backdrop-blur">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Luồng nghiệp vụ</p>
          <JourneyFlow steps={suite.businessJourney} />
        </div>
      </Reveal>

      {/* Products by role */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Sản phẩm trong bộ giải pháp</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const meta = PRODUCT_META[p.productSlug];
            if (!meta) return null;
            return (
              <Reveal key={p.productSlug} delay={(i % 3) * 0.06}>
                <a href={meta.href} className="group flex items-center gap-4 rounded-2xl border border-blue/12 bg-card/80 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45">
                  <IconTile name={meta.icon} />
                  <div>
                    <h3 className="text-base font-semibold text-blue">{meta.title}</h3>
                    <span className="mt-1 inline-block rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-blue">{ROLE_LABEL[p.role]}</span>
                  </div>
                  <ArrowRight className="ml-auto size-4 shrink-0 self-center text-blue/40 transition group-hover:translate-x-0.5 group-hover:text-gold" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Platform + services + deployment chips */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <GlassCard className="p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-blue/70">Nền tảng dùng chung</h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suite.platformCapabilities.map((c) => (
              <span key={c} className="rounded-full border border-blue/15 bg-blue/5 px-2.5 py-1 text-xs font-semibold text-blue">{c}</span>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-blue/70">Dịch vụ đi kèm</h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suite.services.map((s) => (
              <span key={s.serviceSlug} className="rounded-full border border-blue/15 bg-blue/5 px-2.5 py-1 text-xs font-semibold text-blue">{SERVICE_LABEL[s.serviceSlug] ?? s.serviceSlug}</span>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-blue/70">Mô hình triển khai</h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suite.deploymentModels.map((d) => (
              <span key={d} className="rounded-full border border-blue/15 bg-blue/5 px-2.5 py-1 text-xs font-semibold text-blue">{DEPLOY_LABEL[d] ?? d}</span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Outcomes */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {suite.outcomes.map((o, i) => (
          <Reveal key={o.title} delay={(i % 3) * 0.07}>
            <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/60 p-4">
              <span className="icon-gold inline-flex size-10 shrink-0 items-center justify-center rounded-xl"><HomeIcon name="growth" size={22} /></span>
              <div>
                <h4 className="text-sm font-semibold text-blue">{o.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Roadmap */}
      <div className="mt-10">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Lộ trình triển khai</p>
        <C02Timeline steps={roadmap} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <GoldCTA href="/dat-lich-demo" label="Đặt lịch demo" />
        <Link href="/lien-he" className="inline-flex h-12 items-center justify-center rounded-full border border-blue/20 px-6 text-sm font-semibold text-blue transition hover:bg-blue/5">Trao đổi với chuyên gia</Link>
      </div>
    </AmbientSection>
  );
}

/** Route entry: renders the suites landing or a suite detail. Returns null if no match. */
export function SuitePages({ route }: { route: string }) {
  if (route === "/bo-giai-phap-x") return <SuitesLanding />;
  const slug = route.startsWith("/bo-giai-phap-x/") ? route.slice("/bo-giai-phap-x/".length) : "";
  const suite = slug ? suiteBySlug(slug) : undefined;
  if (suite) return <SuiteDetail suite={suite} />;
  return null;
}
