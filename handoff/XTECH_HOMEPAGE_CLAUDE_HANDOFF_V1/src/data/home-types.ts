export type HomeLink = { label: string; href: string };
export type HomeIconItem = {
  id?: string;
  order?: number;
  title: string;
  description: string;
  href?: string;
  icon: string;
};
export type HomeSectionId =
  | "hero"
  | "trust"
  | "solutions"
  | "products"
  | "platform"
  | "suites"
  | "services"
  | "deployment"
  | "value"
  | "why-xtech"
  | "customers"
  | "insights"
  | "cta";
