import { ArrowRight } from "lucide-react";
import type { ServiceSectionDoc } from "@x/shared-types";
import { C02Section } from "./kit";
import { C02ServicesOverview } from "./C02ServicesOverview";
import { C02GenericSection } from "./C02GenericSection";
import {
  C02MaturityRadar,
  C02ArchitectureStack,
  C02ProcessEvolution,
  C02DataPlatform,
  C02IntegrationHub,
  C02AdoptionJourney,
  C02ControlTower,
} from "./C02Bespoke";

/**
 * Render a list of CMS service sections, dispatching each to its bespoke visual
 * component by `visualType`. Any type without a bespoke component falls back to
 * C02GenericSection. Used by route pages that carry SET C02 content.
 */
export function C02Sections({ sections }: { sections: ServiceSectionDoc[] }) {
  // Closing CTA from the last section that carries one (standard /dich-vu rhythm:
  // hero → diagram section(s) → closing call-to-action). Renders only when a
  // section explicitly sets cta.label, so pages without it are unaffected.
  const closing = [...sections].reverse().find((s) => s.cta?.label && s.cta?.href)?.cta;
  return (
    <>
      {sections.map((section) => {
        switch (section.visualType) {
          case "hub-spoke":
            return <C02ServicesOverview key={section.id} section={section} />;
          case "maturity-radar":
            return <C02MaturityRadar key={section.id} section={section} />;
          case "architecture-stack":
            return <C02ArchitectureStack key={section.id} section={section} />;
          case "process-evolution":
            return <C02ProcessEvolution key={section.id} section={section} />;
          case "data-platform":
            return <C02DataPlatform key={section.id} section={section} />;
          case "integration-hub":
            return <C02IntegrationHub key={section.id} section={section} />;
          case "adoption-journey":
            return <C02AdoptionJourney key={section.id} section={section} />;
          case "control-tower":
            return <C02ControlTower key={section.id} section={section} />;
          default:
            return <C02GenericSection key={section.id} section={section} />;
        }
      })}
      {closing ? (
        <C02Section id="c02-cta" soft floor={false}>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Sẵn sàng bắt đầu cùng X?
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Đăng ký buổi tư vấn để nhận đề xuất phù hợp với hiện trạng doanh nghiệp của bạn.
            </p>
            <a
              href={closing.href}
              className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
            >
              {closing.label}
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </C02Section>
      ) : null}
    </>
  );
}
