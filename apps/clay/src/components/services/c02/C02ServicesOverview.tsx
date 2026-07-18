"use client";

import type { ServiceSectionDoc } from "@x/shared-types";
import { Head, Reveal, ConnectorDefs } from "@/components/corporate/about-kit";
import { C02Section, C02Hub, CapabilityCard, C02OutcomeStrip, ordered } from "./kit";

/**
 * C02-01 — hub-spoke: a glowing central transformation hub with numbered
 * capability cards fanning left/right, elbow SVG connectors + nodes, then a
 * closing outcome strip. Mobile stacks the hub on top with cards as a list.
 * All copy comes from CMS.
 */
export function C02ServicesOverview({ section }: { section: ServiceSectionDoc }) {
  const items = ordered(section.items);
  const left = items.filter((it) => it.side !== "right");
  const right = items.filter((it) => it.side === "right");
  const headingId = `c02-${section.sectionId}`;
  const ys = [18, 50, 82];

  return (
    <C02Section id={section.sectionId}>
      <div aria-labelledby={headingId}>
        <div id={headingId}>
          <Head eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        </div>

        {/* Desktop: 3-column hub-spoke with elbow connector overlay + nodes */}
        <div className="relative mt-16 hidden lg:block">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <ConnectorDefs />
            {ys.map((y) => (
              <path
                key={`l${y}`}
                d={y === 50 ? "M48 50 H33" : `M48 50 H41 V${y} H33`}
                fill="none"
                stroke="url(#cyanGrad)"
                strokeWidth={0.4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {ys.map((y) => (
              <path
                key={`r${y}`}
                d={y === 50 ? "M52 50 H67" : `M52 50 H59 V${y} H67`}
                fill="none"
                stroke="url(#cyanGrad)"
                strokeWidth={0.4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {ys.map((y) => (
              <circle key={`ln${y}`} cx={33} cy={y} r={0.7} fill="var(--accent-cyan)" />
            ))}
            {ys.map((y) => (
              <circle key={`rn${y}`} cx={67} cy={y} r={0.7} fill="var(--accent-cyan)" />
            ))}
          </svg>

          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-10">
            <div className="flex flex-col gap-6">
              {left.map((it, i) => (
                <Reveal key={it.itemId} delay={i * 0.09}>
                  <CapabilityCard item={it} index={items.indexOf(it)} number={it.order ?? items.indexOf(it) + 1} align="right" />
                </Reveal>
              ))}
            </div>

            <Reveal className="flex justify-center">
              <C02Hub label="Trung tâm chuyển đổi số" sub="XTECH" />
            </Reveal>

            <div className="flex flex-col gap-6">
              {right.map((it, i) => (
                <Reveal key={it.itemId} delay={i * 0.09}>
                  <CapabilityCard item={it} index={items.indexOf(it)} number={it.order ?? items.indexOf(it) + 1} align="left" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / tablet: hub on top, cards stacked */}
        <div className="mt-12 lg:hidden">
          <Reveal className="flex justify-center">
            <C02Hub label="Trung tâm chuyển đổi số" sub="XTECH" />
          </Reveal>
          <div className="mt-8 flex flex-col gap-4">
            {items.map((it, i) => (
              <Reveal key={it.itemId} delay={i * 0.06}>
                <CapabilityCard item={it} index={i} number={it.order ?? i + 1} align="left" />
              </Reveal>
            ))}
          </div>
        </div>

        <C02OutcomeStrip outcomes={section.outcomes} />
      </div>
    </C02Section>
  );
}
