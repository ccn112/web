export type C02VisualType =
  | "hub-spoke"
  | "maturity-radar"
  | "architecture-stack"
  | "process-evolution"
  | "data-platform"
  | "integration-hub"
  | "adoption-journey"
  | "control-tower";

export type C02Item = {
  id: string;
  order?: number;
  title: string;
  description: string;
  icon?: string;
  illustration?: string;
  side?: "left" | "right" | "top" | "bottom";
  bullets?: string[];
};

export type C02Outcome = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type C02Section = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  visualType: C02VisualType;
  referenceImage: string;
  items: C02Item[];
  process?: C02Item[];
  outcomes?: C02Outcome[];
  routes: string[];
};
