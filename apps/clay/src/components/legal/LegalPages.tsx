"use client";

/**
 * Corporate legal pages (/chinh-sach-bao-mat, /dieu-khoan-su-dung,
 * /chinh-sach-cookie). Long-form prose: dark hero + a max-w-3xl column of
 * mapped headings, paragraphs and bullet lists (mirrors PostArticle/NewsDetail).
 */

import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/primitives";
import { Reveal, AmbientSection } from "@/components/corporate/about-kit";
import { legalDocForRoute } from "@/data/legal-content";

export function LegalPages({ route }: { route: string }) {
  const doc = legalDocForRoute(route);
  if (!doc) return null;

  return (
    <>
      {/* Hero (dark, on-theme for header contrast) */}
      <section className="theme-dark relative isolate overflow-hidden bg-background text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-blue opacity-20 blur-[120px] animate-aurora" />
          <div className="absolute inset-0 bg-grid opacity-[0.07] mask-fade-b" />
        </div>
        <Container className="relative pt-32 pb-12 md:pt-40 md:pb-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85 backdrop-blur">
              <span className="size-1.5 rounded-full bg-gold" />
              {doc.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{doc.title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-sm text-white/60">{doc.updated}</p>
          </Reveal>
        </Container>
      </section>

      {/* Body */}
      <AmbientSection id={doc.slug} city={false} compact>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-base leading-relaxed text-foreground/90">{doc.intro}</p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-10">
            {doc.sections.map((s) => (
              <Reveal key={s.heading}>
                <section>
                  <h2 className="text-xl font-semibold tracking-tight text-blue md:text-2xl">{s.heading}</h2>
                  {s.paragraphs?.map((p, i) => (
                    <p key={i} className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}
                  {s.bullets ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2.5 text-base leading-relaxed text-muted-foreground">
                          <Check className="mt-1 size-4 shrink-0 text-gold" strokeWidth={2.5} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              </Reveal>
            ))}
          </div>

          {/* Contact CTA */}
          <Reveal>
            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-blue/12 bg-card/80 p-6 backdrop-blur sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-blue">Cần hỗ trợ thêm?</p>
                <p className="mt-1 text-sm text-muted-foreground">Liên hệ với đội ngũ XTECH để được giải đáp.</p>
              </div>
              <a
                href="/lien-he"
                className="btn-gold group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:brightness-105"
              >
                Liên hệ
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </AmbientSection>
    </>
  );
}
