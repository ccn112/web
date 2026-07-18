"use client";

/**
 * SET C06 — Customer Success / "Kinh nghiệm" — three tiers:
 *  - home:    /khach-hang                          (hero + featured + card grid)
 *  - listing: /khach-hang/cau-chuyen-khach-hang    (hero + product filter + grid)
 *  - detail:  /khach-hang/<slug>                   (hero + rich case study)
 * Anonymized use-cases only (no fake logos/names).
 */

import { useMemo, useState } from "react";
import { ArrowRight, Check, X as XIcon } from "lucide-react";
import { Reveal, AmbientSection, GlassCard } from "@/components/corporate/about-kit";
import { IconTile } from "@/components/home/kit";
import { C02Timeline } from "@/components/services/c02/kit";
import { EditorialHeroShell, EDITORIAL_BG } from "@/components/editorial/kit";
import { PRODUCT_META, SERVICE_LABEL } from "@/data/suite-content";
import { caseStories, caseBySlug, type CaseStory } from "@/data/case-content";
import { cn } from "@/lib/utils";

const LISTING = "/khach-hang/cau-chuyen-khach-hang";

function GoldCTA({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
    >
      {label}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function ProductChips({ story }: { story: CaseStory }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {story.products.map((p) => (
        <span key={p.productSlug} className="rounded-full border border-blue/10 bg-blue/5 px-2 py-0.5 text-[11px] font-semibold text-blue">
          {PRODUCT_META[p.productSlug]?.title ?? p.productSlug}
        </span>
      ))}
    </div>
  );
}

function CaseCard({ story, delay = 0 }: { story: CaseStory; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={`/khach-hang/${story.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-blue/12 bg-card/80 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_24px_60px_-30px_var(--accent-blue)]"
      >
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan">{story.anonymousLabel}</span>
        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-blue transition group-hover:text-gold">{story.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{story.summary}</p>
        <ProductChips story={story} />
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue transition group-hover:text-gold">
          Xem câu chuyện <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </a>
    </Reveal>
  );
}

/* ---------- home ---------- */
function CasesHome() {
  const featured = caseStories[0];
  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.kinhNghiem}>
        <div className="grid gap-10 pt-28 pb-16 md:pt-36 md:pb-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">Khách hàng</span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Được <span className="brand-gradient-text">tin dùng</span> và đồng hành dài hạn
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Câu chuyện triển khai thực tế (ẩn danh) cho thấy cách XTECH liên thông sản phẩm, dữ liệu và quy trình để tạo giá trị cho doanh nghiệp.
            </p>
            <a href={LISTING} className="btn-gold mt-7 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105">
              Xem tất cả câu chuyện <ArrowRight className="size-4" />
            </a>
          </div>
          {featured ? (
            <a href={`/khach-hang/${featured.slug}`} className="group flex flex-col rounded-3xl border border-white/12 bg-white/5 p-7 backdrop-blur transition hover:border-gold/40">
              <span className="w-fit rounded-full bg-blue/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">{featured.anonymousLabel}</span>
              <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">{featured.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{featured.summary}</p>
              <span className="btn-gold mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-full px-5 text-sm font-semibold">
                Xem câu chuyện <ArrowRight className="size-4" />
              </span>
            </a>
          ) : null}
        </div>
      </EditorialHeroShell>

      <AmbientSection id="khach-hang" city={false} compact>
        <h2 className="text-lg font-semibold tracking-tight text-blue">Câu chuyện tiêu biểu</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {caseStories.map((c, i) => (
            <CaseCard key={c.slug} story={c} delay={(i % 2) * 0.08} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Các câu chuyện được trình bày ẩn danh; case công khai sẽ cập nhật khi có xác nhận từ khách hàng.
        </p>
      </AmbientSection>
    </>
  );
}

/* ---------- listing ---------- */
function CasesListing() {
  const products = useMemo(() => {
    const set = new Set<string>();
    caseStories.forEach((c) => c.products.forEach((p) => set.add(p.productSlug)));
    return Array.from(set);
  }, []);
  const [prod, setProd] = useState("all");
  const filtered = prod === "all" ? caseStories : caseStories.filter((c) => c.products.some((p) => p.productSlug === prod));

  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.kinhNghiem}>
        <div className="pt-28 pb-12 md:pt-36 md:pb-16">
          <nav className="text-xs text-white/60">
            <a href="/khach-hang" className="hover:text-white">Khách hàng</a> <span className="text-white/35">/</span> Câu chuyện khách hàng
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Câu chuyện <span className="brand-gradient-text">khách hàng</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Cách các doanh nghiệp và chủ đầu tư triển khai XTECH — thách thức, giải pháp và kết quả (trình bày ẩn danh).
          </p>
        </div>
      </EditorialHeroShell>

      <AmbientSection id="danh-sach" city={false} compact>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={prod === "all"} onClick={() => setProd("all")}>Tất cả</FilterChip>
          {products.map((p) => (
            <FilterChip key={p} active={prod === p} onClick={() => setProd(p)}>{PRODUCT_META[p]?.title ?? p}</FilterChip>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Chưa có câu chuyện phù hợp.</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <CaseCard key={c.slug} story={c} delay={(i % 3) * 0.06} />
            ))}
          </div>
        )}
      </AmbientSection>
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active ? "border-gold/60 bg-gold/15 text-blue" : "border-blue/15 bg-card text-muted-foreground hover:border-gold/40",
      )}
    >
      {children}
    </button>
  );
}

/* ---------- detail ---------- */
function CaseDetail({ story }: { story: CaseStory }) {
  const phases = story.implementationPhases.map((p) => ({ itemId: String(p.order), order: p.order, title: p.title, description: p.description }));
  const roadmap = story.nextRoadmap.map((r) => ({ itemId: String(r.phase), order: r.phase, title: r.title, description: r.description }));
  return (
    <>
      <EditorialHeroShell bg={EDITORIAL_BG.kinhNghiem}>
        <div className="pt-28 pb-12 md:pt-36 md:pb-16">
          <nav className="text-xs text-white/60">
            <a href="/khach-hang" className="hover:text-white">Khách hàng</a> <span className="text-white/35">/</span> {story.anonymousLabel}
          </nav>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">{story.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{story.summary}</p>
        </div>
      </EditorialHeroShell>

      <AmbientSection id={story.slug} city={false} compact>
        {/* Challenges */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Thách thức</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {story.challenges.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.06}>
                <GlassCard className="h-full p-5">
                  <h3 className="text-base font-semibold text-blue">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Before → After */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-blue/12 bg-muted/40 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/50">Trước</p>
            <ul className="space-y-2">
              {story.beforeState.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground"><XIcon className="size-4 shrink-0 text-blue/40" />{b}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-card/70 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan">Sau</p>
            <ul className="space-y-2">
              {story.afterState.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm font-medium text-blue"><Check className="size-4 shrink-0 text-cyan" />{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products + services */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Sản phẩm sử dụng</p>
            <div className="grid gap-3">
              {story.products.map((p) => {
                const meta = PRODUCT_META[p.productSlug];
                if (!meta) return null;
                return (
                  <a key={p.productSlug} href={meta.href} className="group flex items-center gap-3 rounded-2xl border border-blue/12 bg-card/70 p-3 backdrop-blur transition hover:border-gold/45">
                    <IconTile name={meta.icon} className="size-11" />
                    <h4 className="text-sm font-semibold text-blue">{meta.title}</h4>
                    <span className="ml-auto rounded-full border border-blue/12 bg-blue/5 px-2 py-0.5 text-[11px] font-semibold text-blue">{p.role === "core" ? "Cốt lõi" : "Hỗ trợ"}</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Dịch vụ triển khai</p>
            <div className="flex flex-wrap gap-1.5">
              {story.services.map((s) => (
                <span key={s} className="rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue">{SERVICE_LABEL[s] ?? s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Implementation timeline */}
        <div className="mt-10">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Lộ trình triển khai</p>
          <C02Timeline steps={phases} />
        </div>

        {/* Outcomes */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {story.outcomes.map((o, i) => (
            <Reveal key={o.title} delay={(i % 3) * 0.07}>
              <GlassCard className="h-full p-5">
                <h4 className="text-sm font-semibold text-blue">{o.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Next roadmap */}
        <div className="mt-10">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-blue/60">Định hướng tiếp theo</p>
          <C02Timeline steps={roadmap} />
        </div>

        <div className="mt-8 flex justify-center">
          <GoldCTA href="/dat-lich-demo" label="Trao đổi bài toán của bạn" />
        </div>
      </AmbientSection>
    </>
  );
}

export function CasePages({ route }: { route: string }) {
  if (route === "/khach-hang") return <CasesHome />;
  if (route === LISTING) return <CasesListing />;
  const slug = route.startsWith("/khach-hang/") ? route.slice("/khach-hang/".length) : "";
  const story = slug ? caseBySlug(slug) : undefined;
  if (story) return <CaseDetail story={story} />;
  return null;
}

export { CasesHome as CasesLanding };
