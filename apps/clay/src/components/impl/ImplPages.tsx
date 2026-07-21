"use client";

/**
 * SET C04 — Implementation & Integration (/trien-khai + 6 detail subroutes).
 * Each section renders a C04-SPECIFIC visual (not the generic product orbit),
 * reusing the C02 visuals kit: timeline, layer stack, integration bridge,
 * migration flow, deployment compare, DevSecOps loop, SLA grid.
 */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ServiceSectionItem } from "@x/shared-types";
import { Container } from "@/components/primitives";
import { AmbientSection, Reveal } from "@/components/corporate/about-kit";
import { SectionHead } from "@/components/home/kit";
import { CapabilityCard, C02Timeline, C02OutcomeStrip } from "@/components/services/c02/kit";
import { LayerStack, BridgeHub, EvolutionFlow, Cycle } from "@/components/services/c02/visuals";
import { EditorialHeroShell, EDITORIAL_BG } from "@/components/editorial/kit";
import type { ProductSection, ProductItem } from "@/data/product-content";
import { implSectionsForRoute, implRouteLabels } from "@/data/impl-content";

/** ProductItem → ServiceSectionItem (the shape every C02 visual consumes). */
function toSI(items: ProductItem[]): ServiceSectionItem[] {
  return items.map((it, i) => ({
    itemId: it.id,
    order: i + 1,
    title: it.title,
    description: it.description,
    icon: it.icon,
  }));
}

function GoldCTA({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 flex justify-center">
      <a href={href} className="btn-gold group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105">
        {label} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function CardGrid({ items }: { items: ServiceSectionItem[] }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <CapabilityCard key={it.itemId} item={it} index={i} />
      ))}
    </div>
  );
}

/** Deployment-model compare — 4 side-by-side model cards (c04-06). */
function ModelCompare({ items }: { items: ServiceSectionItem[] }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <Reveal key={it.itemId} delay={(i % 4) * 0.06}>
          <div className="flex h-full flex-col rounded-2xl border border-blue/15 bg-card/80 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_24px_60px_-30px_var(--accent-blue)]">
            <span className="text-2xl font-bold tracking-tight text-blue/25">0{i + 1}</span>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-blue">{it.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** C04-specific visual per section id. */
function VisualFor({ section }: { section: ProductSection }) {
  const items = toSI(section.items);
  switch (section.sectionId) {
    case "c04-01": // 10-step end-to-end process
      return <C02Timeline steps={items} />;
    case "c04-02": // 4-layer target architecture
      return <LayerStack layers={items} northStar="Kiến trúc mục tiêu" />;
    case "c04-03": {
      // Integration hub: inputs (legacy) → hub (API/Event) → AI/modern
      const left = items.filter((i) => ["erp", "crm", "hrm", "legacy"].includes(i.itemId));
      const caps = items.filter((i) => ["api", "event"].includes(i.itemId));
      const right = items.filter((i) => ["ai"].includes(i.itemId));
      return <BridgeHub left={left} right={right} hubLabel="Integration Hub" capabilities={caps} />;
    }
    case "c04-04": // API & Event capabilities
      return <CardGrid items={items} />;
    case "c04-05": // migration flow
      return <EvolutionFlow stages={items} />;
    case "c04-06": // deployment models compare
      return <ModelCompare items={items} />;
    case "c04-07": // DevSecOps loop
      return <Cycle steps={items} centerLabel="DevSecOps" />;
    case "c04-08": // SLA & support services
      return <CardGrid items={items} />;
    default:
      return <CardGrid items={items} />;
  }
}

function ImplSection({ section, index }: { section: ProductSection; index: number }) {
  return (
    <AmbientSection id={section.sectionId} soft={index % 2 === 1} city={false} compact>
      <SectionHead
        title={{
          eyebrow: section.eyebrow,
          lines: [section.title],
          highlight: section.highlight ?? [],
          subtitle: section.subtitle,
        }}
      />
      <VisualFor section={section} />
      {section.outcomes?.length ? (
        <C02OutcomeStrip outcomes={section.outcomes.map((o, i) => ({ itemId: `${section.sectionId}-o${i}`, title: o.title, description: o.description }))} />
      ) : null}
      {section.cta ? <GoldCTA href={section.cta.href} label={section.cta.label} /> : null}
    </AmbientSection>
  );
}

/* ---------- heroes ---------- */
function LandingHero() {
  return (
    <EditorialHeroShell bg={EDITORIAL_BG.trienKhai}>
      <div className="pt-28 pb-14 md:pt-36 md:pb-20">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">Triển khai &amp; tích hợp</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          Từ chiến lược đến <span className="brand-gradient-text">vận hành số</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
          XTECH đồng hành end-to-end: khảo sát, kiến trúc, tích hợp hệ thống, chuyển đổi dữ liệu, go-live, hypercare và tối ưu liên tục.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/lien-he" className="btn-gold inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105">
            Trao đổi kế hoạch triển khai <ArrowRight className="size-4" />
          </Link>
          <Link href="/dat-lich-demo" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-gold/50">
            Đặt lịch demo
          </Link>
        </div>
      </div>
    </EditorialHeroShell>
  );
}

function DetailHero({ route }: { route: string }) {
  const label = implRouteLabels[route] ?? "Triển khai";
  return (
    <EditorialHeroShell bg={EDITORIAL_BG.trienKhai}>
      <div className="pt-28 pb-12 md:pt-36 md:pb-14">
        <nav className="text-xs text-white/60">
          <Link href="/trien-khai" className="hover:text-white">Triển khai</Link> <span className="text-white/35">/</span> {label}
        </nav>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{label}</h1>
      </div>
    </EditorialHeroShell>
  );
}

export function ImplPages({ route }: { route: string }) {
  const sections = implSectionsForRoute(route);
  const isLanding = route === "/trien-khai";
  return (
    <>
      {isLanding ? <LandingHero /> : <DetailHero route={route} />}
      {sections.map((s, i) => (
        <ImplSection key={s.sectionId} section={s} index={i} />
      ))}
      {!isLanding ? (
        <Container className="pb-16">
          <Link href="/trien-khai" className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition hover:text-gold">
            <ArrowRight className="size-4 rotate-180" /> Quay lại Triển khai
          </Link>
        </Container>
      ) : null}
    </>
  );
}
