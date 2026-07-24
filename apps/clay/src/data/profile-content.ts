/**
 * Profile content model — the source for the auto-generated product/service/
 * company PDF profiles. PRODUCT profiles are DERIVED from `product-content.ts`
 * so they stay in sync with the website automatically; the company & services
 * profiles carry a small amount of curated copy plus the product list.
 *
 * The generator (scripts/gen-profiles.tsx) hashes each ProfileDoc and only
 * regenerates the PDF when the content changes.
 */

import { productSectionsForRoute, type ProductSection } from "./product-content";
import generated from "./profiles.generated.json";

export type ProfileFeature = { label: string; benefit: string };
export type ProfileSection = {
  title: string;
  subtitle?: string;
  note?: string;
  features?: ProfileFeature[];
  bullets?: string[];
};
export type ProfileKind = "product" | "company" | "services";
export type ProfileDoc = {
  key: string;
  name: string;
  filenameBase: string; // e.g. "FinERP_Profile" → [YYYYMMDD]FinERP_Profile.pdf
  kind: ProfileKind;
  tagline: string;
  intro: string;
  sections: ProfileSection[];
};

/** Company identity (mirrors the footer). */
const COMPANY = {
  name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ X-TECH",
  taxCode: "0110676802",
  address:
    "Tầng 18, tòa nhà Center Building, số 1, đường Nguyễn Huy Tưởng, Phường Thanh Xuân, Hà Nội",
  hotline: "094.643.8585",
  email: "lienhe@x-tech.com.vn",
};

const PRODUCTS: { key: string; name: string; route: string }[] = [
  { key: "x-ai", name: "X.AI", route: "/san-pham/x-ai" },
  { key: "xbooking", name: "XBooking", route: "/san-pham/xbooking" },
  { key: "finerp", name: "FinERP", route: "/san-pham/finerp" },
  { key: "xbuilding", name: "XBuilding", route: "/san-pham/xbuilding" },
  { key: "x-space", name: "X.Space", route: "/san-pham/x-space" },
];

/** Turn one website section into a profile section (text-only; images dropped). */
function sectionToProfile(s: ProductSection): ProfileSection | null {
  let features: ProfileFeature[] | undefined;
  let bullets: string[] | undefined;

  if (s.features?.length) {
    features = s.features.map((f) => ({ label: f.label, benefit: f.benefit }));
  } else if (s.items?.length) {
    bullets = s.items.map((i) => `${i.title} — ${i.description}`);
  } else if (s.bullets?.length) {
    bullets = [...s.bullets];
  } else if (s.gallery?.length) {
    bullets = s.gallery.map((g) => `${g.title} — ${g.caption}`);
  } else if (s.galleryGroups?.length) {
    bullets = s.galleryGroups.flatMap((g) => [
      `【${g.label}】`,
      ...g.shots.map((sh) => `${sh.title} — ${sh.caption}`),
    ]);
  }

  if (!features && !bullets && !s.subtitle) return null;
  return { title: s.title, subtitle: s.subtitle, note: s.panelNote, features, bullets };
}

function productDoc(p: { key: string; name: string; route: string }): ProfileDoc {
  const secs = productSectionsForRoute(p.route);
  const hero = secs[0];
  const rest = secs.slice(1);

  const sections: ProfileSection[] = [];
  // Hero items → an overview "Các phân hệ chính" section.
  if (hero?.items?.length) {
    sections.push({
      title: "Các phân hệ chính",
      bullets: hero.items.map((i) => `${i.title} — ${i.description}`),
    });
  }
  for (const s of rest) {
    const ps = sectionToProfile(s);
    if (ps) sections.push(ps);
  }

  return {
    key: p.key,
    name: p.name,
    filenameBase: `${p.name.replace(/[^\w.]/g, "")}_Profile`,
    kind: "product",
    tagline: hero?.title ?? p.name,
    intro: hero?.subtitle ?? "",
    sections,
  };
}

function companyDoc(): ProfileDoc {
  return {
    key: "xtech",
    name: "X-TECH",
    filenameBase: "XTECH_Company_Profile",
    kind: "company",
    tagline: "X-TECH — Nền tảng công nghệ, AI và chuyển đổi số cho doanh nghiệp",
    intro:
      "Hệ sinh thái sản phẩm và dịch vụ giúp doanh nghiệp và ngành bất động sản chuyển đổi số toàn diện: từ bán hàng, vận hành, tài chính đến trí tuệ nhân tạo — trên một nền tảng dùng chung.",
    sections: [
      {
        title: "Hệ sinh thái sản phẩm",
        subtitle: "Năm sản phẩm liên thông trên nền tảng dữ liệu, định danh, workflow, cloud và bảo mật dùng chung.",
        bullets: [
          "X.AI — Trí tuệ doanh nghiệp: enterprise agents, knowledge & RAG, tự động hóa, an toàn & tuân thủ.",
          "XBooking — Bán hàng bất động sản khép kín: marketing, lead, CRM, bảng hàng, booking, hợp đồng, chăm sóc.",
          "FinERP — Tài chính & vận hành: kế toán, dòng tiền, ngân sách, mua hàng, kho–tài sản, chi phí dự án.",
          "XBuilding — Vận hành tòa nhà & cư dân: phí dịch vụ, ticket/SLA, bảo trì, IoT, an ninh, app cư dân.",
          "X.Space — Không gian làm việc số: công việc, dự án, tài liệu, phê duyệt, tri thức.",
        ],
      },
      {
        title: "Dịch vụ",
        bullets: [
          "Tư vấn chiến lược chuyển đổi số.",
          "Phát triển phần mềm theo yêu cầu.",
          "Dữ liệu & AI cho doanh nghiệp.",
          "Vận hành & hỗ trợ (managed services).",
        ],
      },
      {
        title: "Nền tảng dùng chung",
        bullets: ["Dữ liệu", "API & tích hợp", "Định danh (SSO)", "Workflow", "Cloud", "Bảo mật", "Analytics"],
      },
      {
        title: "Thông tin liên hệ",
        bullets: [
          COMPANY.name,
          `Mã số thuế: ${COMPANY.taxCode}`,
          `Địa chỉ: ${COMPANY.address}`,
          `Hotline: ${COMPANY.hotline}`,
          `Email: ${COMPANY.email}`,
        ],
      },
    ],
  };
}

function servicesDoc(): ProfileDoc {
  return {
    key: "services",
    name: "Services",
    filenameBase: "XTECH_Services_Profile",
    kind: "services",
    tagline: "Dịch vụ chuyển đổi số & AI của X-TECH",
    intro:
      "X-TECH đồng hành cùng doanh nghiệp từ chiến lược đến vận hành: tư vấn, phát triển phần mềm, dữ liệu & AI và vận hành – hỗ trợ dài hạn.",
    sections: [
      {
        title: "Tư vấn chiến lược",
        subtitle: "Định hình lộ trình chuyển đổi số phù hợp năng lực và mục tiêu doanh nghiệp.",
        bullets: ["Đánh giá hiện trạng số", "Lộ trình & ưu tiên", "Kiến trúc mục tiêu", "Quản trị thay đổi"],
      },
      {
        title: "Phát triển phần mềm",
        subtitle: "Xây dựng sản phẩm số theo yêu cầu, chuẩn hóa quy trình nghiệp vụ.",
        bullets: ["Web & mobile app", "Tích hợp hệ thống", "Modernization hệ thống cũ", "Chất lượng & kiểm thử"],
      },
      {
        title: "Dữ liệu & AI",
        subtitle: "Khai thác dữ liệu và ứng dụng AI vào bài toán thực tế của doanh nghiệp.",
        bullets: ["Nền tảng dữ liệu", "Phân tích & BI", "AI Agent & RAG", "Tự động hóa quy trình"],
      },
      {
        title: "Vận hành & Hỗ trợ",
        subtitle: "Đảm bảo hệ thống vận hành ổn định, an toàn và cải tiến liên tục.",
        bullets: ["Managed services", "Giám sát & bảo mật", "SLA hỗ trợ", "Tối ưu chi phí vận hành"],
      },
    ],
  };
}

/** All profiles to generate. Products first (derived), then services + company. */
export function allProfiles(): ProfileDoc[] {
  return [companyDoc(), servicesDoc(), ...PRODUCTS.map(productDoc)];
}

/** Map product/route → profile key, for the download button. */
export const PROFILE_ROUTE_MAP: Record<string, string> = {
  "/san-pham/x-ai": "x-ai",
  "/san-pham/xbooking": "xbooking",
  "/san-pham/finerp": "finerp",
  "/san-pham/xbuilding": "xbuilding",
  "/san-pham/x-space": "x-space",
};

export type ProfileLink = { name: string; file: string; date: string; href: string };
const GENERATED = generated as Record<string, { name: string; file: string; date: string }>;

/** Latest generated profile for a product route (for the hero download button). */
export function profileForRoute(route: string): ProfileLink | null {
  const key = PROFILE_ROUTE_MAP[route];
  const g = key ? GENERATED[key] : undefined;
  if (!g) return null;
  return { ...g, href: `/profiles/${encodeURIComponent(g.file)}` };
}
