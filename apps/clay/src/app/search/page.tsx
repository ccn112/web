import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { cms, currentSiteCode } from "@/lib/cms";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/primitives";
import { AmbientSection } from "@/components/corporate/about-kit";
import { searchDocs } from "@/data/search-index";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const siteCode = await currentSiteCode();
  const [site, menu] = await Promise.all([
    cms.getSite(siteCode).catch(() => null),
    cms.getMenu(siteCode).catch(() => null),
  ]);
  const results = query ? searchDocs(query) : [];

  const content = (
    <>
      {/* Hero + search box */}
      <section className="theme-dark relative isolate overflow-hidden bg-background text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-24 size-[32rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
          <div className="absolute inset-0 bg-grid opacity-[0.07] mask-fade-b" />
        </div>
        <Container className="relative pt-32 pb-12 md:pt-40 md:pb-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tìm kiếm</h1>
          <form action="/search" method="get" className="mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/50" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                autoFocus
                placeholder="Nhập từ khóa: sản phẩm, giải pháp, bài viết…"
                className="h-12 w-full rounded-full border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white outline-none backdrop-blur transition placeholder:text-white/50 focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
              />
            </div>
            <button
              type="submit"
              className="btn-gold inline-flex h-12 shrink-0 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:brightness-105"
            >
              Tìm
            </button>
          </form>
        </Container>
      </section>

      {/* Results */}
      <AmbientSection id="ket-qua" city={false} compact>
        {!query ? (
          <p className="text-sm text-muted-foreground">Nhập từ khóa để tìm nội dung trên website.</p>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-base font-semibold text-blue">Không tìm thấy kết quả cho “{query}”.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử từ khóa khác, hoặc xem{" "}
              <a href="/san-pham" className="font-semibold text-blue hover:text-gold">sản phẩm</a>,{" "}
              <a href="/giai-phap" className="font-semibold text-blue hover:text-gold">giải pháp</a> và{" "}
              <a href="/insights" className="font-semibold text-blue hover:text-gold">Insights</a>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {results.length} kết quả cho “{query}”.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {results.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    className="group flex items-start justify-between gap-4 rounded-2xl border border-blue/12 bg-card/80 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-[0_20px_50px_-30px_var(--accent-blue)]"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan">{r.kind}</span>
                      <h2 className="mt-1 text-base font-semibold leading-snug text-blue">{r.title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-gold" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </AmbientSection>
    </>
  );

  if (!site) return content;

  return (
    <SiteShell site={site} menu={menu?.items ?? []}>
      {content}
    </SiteShell>
  );
}
