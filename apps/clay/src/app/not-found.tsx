import { ArrowRight, Home, Search } from "lucide-react";
import { cms, currentSiteCode } from "@/lib/cms";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/primitives";

/**
 * Root 404 — catches notFound() from the catch-all route and any unmatched URL.
 * Server Component: resolves the site (from the middleware header) so the page
 * keeps the correct header/footer chrome.
 */
export default async function NotFound() {
  const siteCode = await currentSiteCode();
  const [site, menu] = await Promise.all([
    cms.getSite(siteCode).catch(() => null),
    cms.getMenu(siteCode).catch(() => null),
  ]);

  const body = (
    <section className="theme-dark relative isolate flex min-h-[70vh] items-center overflow-hidden bg-background text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-24 size-[34rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
        <div className="absolute inset-0 bg-grid opacity-[0.07] mask-fade-b" />
      </div>
      <Container className="relative py-24 text-center">
        <p className="brand-gradient-text text-7xl font-bold tracking-tight md:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">Không tìm thấy trang</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-white/70">
          Trang bạn tìm có thể đã được di chuyển hoặc không còn tồn tại. Hãy thử quay lại trang chủ hoặc tìm kiếm nội dung.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105"
          >
            <Home className="size-4" />
            Về trang chủ
          </a>
          <a
            href="/search"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-gold/50"
          >
            <Search className="size-4" />
            Tìm kiếm
          </a>
          <a
            href="/lien-he"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Liên hệ
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );

  if (!site) return body;

  return (
    <SiteShell site={site} menu={menu?.items ?? []}>
      {body}
    </SiteShell>
  );
}
