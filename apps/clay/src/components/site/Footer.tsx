import type { MenuItem } from "@x/shared-types";
import { Logo } from "./Logo";
import { Container } from "@/components/primitives";

const LEGAL_LINKS = [
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
  { label: "Chính sách cookie", href: "/chinh-sach-cookie" },
];

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
  const columns = items.filter((i) => i.children && i.children.length > 0);
  const flatLinks = items.filter((i) => !i.children || i.children.length === 0);
  const showLegal = siteCode === "corporate";
  const year = 2026;

  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo mode="light" />
            {tagline ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
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

          {flatLinks.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold">Liên kết</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {flatLinks.map((link) => (
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
          ) : null}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteName ?? "XTECH"}. All rights reserved.
          </p>
          {showLegal ? (
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
