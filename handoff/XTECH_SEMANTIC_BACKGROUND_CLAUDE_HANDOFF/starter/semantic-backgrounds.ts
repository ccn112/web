export type SemanticBackgroundKey =
  | "home"
  | "solutions"
  | "products"
  | "xSuites"
  | "services"
  | "implementation"
  | "customers"
  | "insights"
  | "about";

export type SemanticBackgroundConfig = {
  route: string;
  image: string;
  objectPosition: string;
  mobileObjectPosition: string;
  overlay: "medium" | "strong";
  metaphor: string;
  showNodes?: boolean;
};

export const semanticBackgrounds: Record<SemanticBackgroundKey, SemanticBackgroundConfig> = {
  home: {
    route: "/",
    image: "/images/backgrounds/semantic/bg-trang-chu-he-sinh-thai.webp",
    objectPosition: "center 66%",
    mobileObjectPosition: "center 70%",
    overlay: "medium",
    metaphor: "ecosystem-core",
    showNodes: true,
  },
  solutions: {
    route: "/giai-phap",
    image: "/images/backgrounds/semantic/bg-giai-phap-hoi-tu.webp",
    objectPosition: "center 72%",
    mobileObjectPosition: "center 75%",
    overlay: "medium",
  },
  products: {
    route: "/san-pham",
    image: "/images/backgrounds/semantic/bg-san-pham-nen-tang-mo-dun.webp",
    objectPosition: "center 68%",
    mobileObjectPosition: "center 73%",
    overlay: "medium",
    showNodes: true,
  },
  xSuites: {
    route: "/bo-giai-phap-x",
    image: "/images/backgrounds/semantic/bg-bo-giai-phap-x-lap-ghep.webp",
    objectPosition: "center 70%",
    mobileObjectPosition: "center 75%",
    overlay: "medium",
  },
  services: {
    route: "/dich-vu",
    image: "/images/backgrounds/semantic/bg-dich-vu-hanh-trinh.webp",
    objectPosition: "center 76%",
    mobileObjectPosition: "66% 78%",
    overlay: "medium",
  },
  implementation: {
    route: "/trien-khai",
    image: "/images/backgrounds/semantic/bg-trien-khai-kien-truc.webp",
    objectPosition: "center 63%",
    mobileObjectPosition: "center 70%",
    overlay: "strong",
  },
  customers: {
    route: "/khach-hang",
    image: "/images/backgrounds/semantic/bg-khach-hang-mang-luoi.webp",
    objectPosition: "center 73%",
    mobileObjectPosition: "center 78%",
    overlay: "medium",
  },
  insights: {
    route: "/insights",
    image: "/images/backgrounds/semantic/bg-insights-tin-hieu.webp",
    objectPosition: "center 76%",
    mobileObjectPosition: "center 80%",
    overlay: "strong",
  },
  about: {
    route: "/ve-x",
    image: "/images/backgrounds/semantic/bg-ve-x-con-nguoi-doi-tac.webp",
    objectPosition: "center 74%",
    mobileObjectPosition: "center 80%",
    overlay: "medium",
  },
};
