import type { MenuItem } from "@x/shared-types";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/primitives";

const LEGAL_LINKS = [
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
  { label: "Chính sách cookie", href: "/chinh-sach-cookie" },
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
  // Only the primary sections that carry children, capped at 4 columns to keep
  // the footer clean and balanced (was rendering every menu group → 6+ cols).
  const columns = items.filter((i) => i.children && i.children.length > 0).slice(0, 4);
  const isCorporate = siteCode === "corporate";
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
