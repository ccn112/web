"use client";

import type { ServiceSectionDoc } from "@x/shared-types";
import { Head, Reveal } from "@/components/corporate/about-kit";
import { C02Section, CapabilityCard, C02Timeline, C02OutcomeStrip, ordered } from "./kit";

/**
 * Base composition used until a bespoke component exists for a visualType:
 * header → capability cards → process TIMELINE (numbered nodes + flow line) →
 * outcomes. Data-driven and on-brand (not a throwaway).
 */
export function C02GenericSection({ section }: { section: ServiceSectionDoc }) {
  const items = ordered(section.items);
  const headingId = `c02-${section.sectionId}`;
  const soft = ["c02-02", "c02-04", "c02-06", "c02-08"].includes(section.sectionId);

  return (
    <C02Section id={section.sectionId} soft={soft}>
      <div aria-labelledby={headingId}>
        <div id={headingId}>
          <Head eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        </div>

        {items.length ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <Reveal key={it.itemId} delay={(i % 3) * 0.08}>
                <CapabilityCard item={it} index={i} align="left" />
              </Reveal>
            ))}
          </div>
        ) : null}

        <C02Timeline steps={section.process ?? []} />

        <C02OutcomeStrip outcomes={section.outcomes} />
      </div>
    </C02Section>
  );
}
