"use client";

/**
 * Bespoke SET C02 sections, one component per `visualType`. Each is a thin
 * composition of the reusable primitives in `visuals.tsx` + shared kit shell,
 * driven entirely by CMS data (ServiceSectionDoc). Dispatched from
 * C02SectionRenderer. Every section stays reusable across any route/site that
 * carries the matching visualType.
 */

import type { ServiceSectionDoc } from "@x/shared-types";
import { Head, Reveal } from "@/components/corporate/about-kit";
import {
  C02Section,
  C02Hub,
  CapabilityCard,
  C02Timeline,
  C02OutcomeStrip,
  ordered,
} from "./kit";
import {
  Radar,
  LayerStack,
  EvolutionFlow,
  Pipeline,
  BridgeHub,
  Cycle,
  AdoptionJourney,
} from "./visuals";

function SectionShell({
  section,
  soft,
  floor,
  children,
}: {
  section: ServiceSectionDoc;
  soft?: boolean;
  floor?: boolean;
  children: React.ReactNode;
}) {
  const headingId = `c02-${section.sectionId}`;
  return (
    <C02Section id={section.sectionId} soft={soft} floor={floor}>
      <div aria-labelledby={headingId}>
        <div id={headingId}>
          <Head eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        </div>
        {children}
      </div>
    </C02Section>
  );
}

/* C02-02 — maturity-radar: spider chart of pillars + assessment timeline. */
export function C02MaturityRadar({ section }: { section: ServiceSectionDoc }) {
  const pillars = ordered(section.items);
  return (
    <SectionShell section={section} soft>
      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <Radar axes={pillars.map((p) => p.title)} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.itemId} delay={(i % 2) * 0.08}>
              <CapabilityCard item={p} index={i} align="left" />
            </Reveal>
          ))}
        </div>
      </div>
      <C02Timeline steps={section.process ?? []} />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-03 — architecture-stack: north-star + tiers + roadmap timeline. */
export function C02ArchitectureStack({ section }: { section: ServiceSectionDoc }) {
  return (
    <SectionShell section={section}>
      <div className="mt-14">
        <LayerStack layers={section.items} northStar="Mục tiêu doanh nghiệp" />
      </div>
      <C02Timeline steps={section.process ?? []} />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-04 — process-evolution: staged chevron flow + delivery timeline. */
export function C02ProcessEvolution({ section }: { section: ServiceSectionDoc }) {
  return (
    <SectionShell section={section} soft>
      <EvolutionFlow stages={section.items} />
      <C02Timeline steps={section.process ?? []} />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-05 — data-platform: sources feeding a staged pipeline. */
export function C02DataPlatform({ section }: { section: ServiceSectionDoc }) {
  return (
    <SectionShell section={section}>
      <Pipeline sources={section.items} stages={section.process ?? []} />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-06 — integration-hub: legacy → hub → modern with capability chips. */
export function C02IntegrationHub({ section }: { section: ServiceSectionDoc }) {
  const items = ordered(section.items);
  const mid = Math.ceil(items.length / 2);
  return (
    <SectionShell section={section} soft>
      <BridgeHub
        left={items.slice(0, mid)}
        right={items.slice(mid)}
        hubLabel="Tích hợp & API"
        capabilities={section.process ?? []}
      />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-07 — adoption-journey: stakeholders + ascending adoption path. */
export function C02AdoptionJourney({ section }: { section: ServiceSectionDoc }) {
  return (
    <SectionShell section={section}>
      <AdoptionJourney stakeholders={section.items} stages={section.process ?? []} />
      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}

/* C02-08 — control-tower: central PMO + metrics grid + continuous cycle. */
export function C02ControlTower({ section }: { section: ServiceSectionDoc }) {
  const metrics = ordered(section.items);
  return (
    <SectionShell section={section} soft>
      {/* Control tower hub */}
      <Reveal className="mt-14 flex justify-center">
        <C02Hub label="Digital PMO" sub="Control Tower" />
      </Reveal>

      {/* Metrics grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal key={m.itemId} delay={(i % 4) * 0.06}>
            <CapabilityCard item={m} index={i} align="left" />
          </Reveal>
        ))}
      </div>

      {/* Continuous improvement cycle */}
      <Cycle steps={section.process ?? []} centerLabel="Cải tiến liên tục" />

      <C02OutcomeStrip outcomes={section.outcomes} />
    </SectionShell>
  );
}
