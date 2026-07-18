import type { ReactNode } from "react";
import type { MenuItem, SiteConfig } from "@x/shared-types";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

/**
 * One unified Clay theme (light base + dark hero). We intentionally do NOT switch
 * per-site dark/light or inject the CMS accent — the design language is fixed; only
 * the content (and logo) changes per site.
 */
export function SiteShell({
  site,
  menu,
  children,
}: {
  site: SiteConfig;
  menu: MenuItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header items={menu} />
      <main className="flex-1">{children}</main>
      <Footer items={menu} siteName={site.name} tagline={site.tagline} siteCode={site.code} />
      <ChatWidget siteCode={site.code} />
    </div>
  );
}
