import type { MenuItem } from "@x/shared-types";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/primitives";

const LEGAL_LINKS = [
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
  { label: "Chính sách cookie", href: "/chinh-sach-cookie" },
];

/** Curated footer columns for the corporate site — richer than the header menu
 * so the four columns balance against the tall company-info block. All hrefs are
 * verified live routes. */
const CORP_FOOTER_COLUMNS: { label: string; children: { label: string; href: string }[] }[] = [
  {
    label: "Giải pháp",
    children: [
      { label: "Tất cả giải pháp", href: "/giai-phap" },
      { label: "Doanh nghiệp kết nối", href: "/giai-phap/doanh-nghiep-ket-noi" },
      { label: "Dữ liệu & AI", href: "/giai-phap/du-lieu-va-ai" },
      { label: "Tự động hóa", href: "/giai-phap/tu-dong-hoa" },
      { label: "Tích hợp hệ thống", href: "/giai-phap/tich-hop-he-thong" },
      { label: "Bộ giải pháp X", href: "/bo-giai-phap-x" },
    ],
  },
  {
    label: "Sản phẩm",
    children: [
      { label: "Tất cả sản phẩm", href: "/san-pham" },
      { label: "X.AI", href: "/san-pham/x-ai" },
      { label: "XBooking", href: "/san-pham/xbooking" },
      { label: "FinERP", href: "/san-pham/finerp" },
      { label: "XBuilding", href: "/san-pham/xbuilding" },
      { label: "X.Space", href: "/san-pham/x-space" },
      { label: "Nền tảng dùng chung", href: "/san-pham/nen-tang-dung-chung" },
    ],
  },
  {
    label: "Dịch vụ",
    children: [
      { label: "Tất cả dịch vụ", href: "/dich-vu" },
      { label: "Tư vấn chiến lược", href: "/dich-vu/tu-van-chien-luoc" },
      { label: "Phát triển phần mềm", href: "/dich-vu/phat-trien-phan-mem" },
      { label: "Dữ liệu & AI", href: "/dich-vu/du-lieu-va-ai" },
      { label: "Vận hành & Hỗ trợ", href: "/dich-vu/van-hanh-va-ho-tro" },
      { label: "Mô hình triển khai", href: "/trien-khai" },
    ],
  },
  {
    label: "Công ty & Tri thức",
    children: [
      { label: "Về X", href: "/ve-x" },
      { label: "Đội ngũ", href: "/ve-x/doi-ngu" },
      { label: "Tuyển dụng", href: "/ve-x/tuyen-dung" },
      { label: "Khách hàng", href: "/khach-hang" },
      { label: "Tin tức", href: "/tin-tuc" },
      { label: "Insights", href: "/insights" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
];

/** Legal company identity — corporate site only. */
const COMPANY = {
  name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ X-TECH",
  taxCode: "0110676802",
  address:
    "Tầng 18, tòa nhà Center Building, số 1, đường Nguyễn Huy Tưởng, Phường Thanh Xuân, Hà Nội",
  hotline: "094.643.8585",
  email: "lienhe@x-tech.com.vn",
};

export function Footer({
  items,
  siteName,
  tagline,
  siteCode,
}: {
  items: MenuItem[];
  siteName?: string;
  tagline?: string;
  siteCode?: string;
}) {
  const isCorporate = siteCode === "corporate";
  // Corporate uses curated, fuller columns (balanced with the company block);
  // other sites fall back to their menu groups (capped at 4).
  const columns = isCorporate
    ? CORP_FOOTER_COLUMNS
    : items.filter((i) => i.children && i.children.length > 0).slice(0, 4);
  const year = 2026;

  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo mode="light" />
            {tagline ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
            ) : null}

            {isCorporate ? (
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{COMPANY.name}</p>
                <p>
                  Mã số thuế: <span className="text-foreground/90">{COMPANY.taxCode}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-blue" />
                  <span>{COMPANY.address}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-blue" />
                  <a href={`tel:${COMPANY.hotline.replace(/\./g, "")}`} className="transition hover:text-foreground">
                    Hotline: {COMPANY.hotline}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-blue" />
                  <a href={`mailto:${COMPANY.email}`} className="transition hover:text-foreground">
                    {COMPANY.email}
                  </a>
                </p>
              </div>
            ) : null}
          </div>

          {columns.map((col) => (
            <div key={col.label}>
              <h4 className="text-sm font-semibold">{col.label}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.children!.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteName ?? "XTECH"}. All rights reserved.
          </p>
          {isCorporate ? (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
