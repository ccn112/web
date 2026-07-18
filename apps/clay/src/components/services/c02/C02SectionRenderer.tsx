import type { ServiceSectionDoc } from "@x/shared-types";
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
    </>
  );
}
