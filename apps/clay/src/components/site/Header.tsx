"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { MenuItem } from "@x/shared-types";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Header({
  items,
  ctaLabel = "Đặt lịch Demo",
  ctaHref = "/demo",
}: {
  items: MenuItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Every page opens with a dark hero, so use light text while transparent at the top
  // and dark text once the solid pill appears on scroll.
  const onDark = !scrolled;
  const linkCls = onDark
    ? "text-white/80 hover:text-white"
    : "text-foreground/80 hover:text-foreground";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Default dark scrim behind the header so the white logo + menu stay
          legible on ANY page — including pages whose first fold is light
          (e.g. C02-only service pages). Fades out once the solid pill appears. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 transition-all duration-300 md:px-6",
          scrolled &&
            "mt-2 h-14 rounded-full border border-border bg-background/90 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl md:mx-auto md:max-w-[1120px]",
        )}
      >
        <a href="/" className="shrink-0" aria-label="XTECH home">
          <Logo mode={onDark ? "dark" : "light"} />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            item.children && item.children.length > 0 ? (
              <div key={item.label} className="group relative">
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition",
                    linkCls,
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-4 transition group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-2xl border border-border bg-popover p-2 shadow-xl">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block rounded-xl p-3 transition hover:bg-accent"
                      >
                        <span className="block text-sm font-medium">{child.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={cn("rounded-full px-3 py-2 text-sm font-medium transition", linkCls)}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={ctaHref}
            className={cn(
              "btn-gold rounded-full px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_-10px_var(--accent-gold)] transition hover:brightness-105",
            )}
          >
            {ctaLabel}
          </a>
        </div>

        <button
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
            onDark ? "text-white" : "text-foreground",
          )}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 top-16 z-40 bg-background/98 px-6 py-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {items.flatMap((item) =>
              item.children && item.children.length > 0
                ? [
                    <p
                      key={item.label}
                      className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {item.label}
                    </p>,
                    ...item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl p-3 text-base font-medium hover:bg-accent"
                      >
                        {child.label}
                      </a>
                    )),
                  ]
                : [
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl p-3 text-base font-medium hover:bg-accent"
                    >
                      {item.label}
                    </a>,
                  ],
            )}
          </nav>
          <a
            href={ctaHref}
            onClick={() => setMobileOpen(false)}
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
          >
            {ctaLabel}
          </a>
        </div>
      ) : null}
    </header>
  );
}
