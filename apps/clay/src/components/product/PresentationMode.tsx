"use client";

/**
 * Presentation mode — a full-screen, auto-advancing slide deck built from the
 * current product page's sections. Each section becomes one slide (eyebrow,
 * title, subtitle, key points + optional screenshot). Controls: prev/next,
 * play/pause autoplay, arrow keys, Esc to exit, click progress dots.
 */

import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import type { ProductSection } from "@/data/product-content";

type Slide = { eyebrow: string; title: string; subtitle?: string; points: string[]; image?: string };

/** Per-slide dwell time proportional to how much there is to read, so viewers
 * can finish before it advances. ~1s per 3 Vietnamese words + base, clamped. */
function dwellMs(sl: Slide): number {
  const words = `${sl.title} ${sl.subtitle ?? ""} ${sl.points.join(" ")}`.trim().split(/\s+/).length;
  return Math.min(16000, Math.max(5000, 3200 + words * 340));
}

function toSlides(sections: ProductSection[]): Slide[] {
  return sections.map((s) => {
    let points: string[] = [];
    if (s.features?.length) points = s.features.map((f) => f.label);
    else if (s.items?.length) points = s.items.map((i) => i.title);
    else if (s.bullets?.length) points = [...s.bullets];
    else if (s.gallery?.length) points = s.gallery.map((g) => g.title);
    else if (s.galleryGroups?.length) points = s.galleryGroups.map((g) => g.label);
    return { eyebrow: s.eyebrow, title: s.title, subtitle: s.subtitle, points: points.slice(0, 8), image: s.image };
  });
}

export function PresentationMode({ sections, onClose }: { sections: ProductSection[]; onClose: () => void }) {
  const slides = useMemo(() => toSlides(sections), [sections]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((n: number) => setI((c) => (n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") { setPlaying(false); go(i + 1); }
      else if (e.key === "ArrowLeft") { setPlaying(false); go(i - 1); }
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [i, go, onClose]);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(i + 1), dwellMs(slides[i]));
    return () => clearTimeout(t);
  }, [i, playing, go, slides]);

  if (!slides.length) return null;
  const cur = slides[i];

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[oklch(0.16_0.03_265)] text-white">
      {/* backdrop glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[38rem] rounded-full bg-blue opacity-25 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 size-[34rem] rounded-full bg-cyan opacity-20 blur-[130px]" />
      </div>

      {/* top bar */}
      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-sm font-medium text-white/70">Trình bày · {i + 1}/{slides.length}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Tạm dừng" : "Tự chạy"} className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
            {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <button type="button" onClick={onClose} aria-label="Thoát trình bày" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* slide body */}
      <div className="relative flex flex-1 items-center overflow-hidden px-6 sm:px-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div key={i} className="motion-safe:animate-[fadeUp_0.5s_ease]">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">{cur.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">{cur.title}</h2>
            {cur.subtitle ? <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{cur.subtitle}</p> : null}
            {cur.points.length ? (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {cur.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="size-1.5 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {cur.image ? (
            <div key={`img-${i}`} className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl motion-safe:animate-[fadeUp_0.6s_ease]">
              <Image src={cur.image} alt={cur.title} width={1200} height={800} sizes="46vw" className="h-auto w-full object-cover" />
            </div>
          ) : null}
        </div>

        {/* nav arrows */}
        <button type="button" aria-label="Slide trước" onClick={() => { setPlaying(false); go(i - 1); }} className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-5">
          <ChevronLeft className="size-6" />
        </button>
        <button type="button" aria-label="Slide sau" onClick={() => { setPlaying(false); go(i + 1); }} className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-5">
          <ChevronRight className="size-6" />
        </button>
      </div>

      {/* progress dots */}
      <div className="relative flex items-center justify-center gap-1.5 py-5">
        {slides.map((_, k) => (
          <button key={k} type="button" aria-label={`Tới slide ${k + 1}`} onClick={() => { setPlaying(false); setI(k); }} className={k === i ? "h-1.5 w-7 rounded-full bg-gold transition-all" : "h-1.5 w-1.5 rounded-full bg-white/30 transition-all hover:bg-white/50"} />
        ))}
      </div>
    </div>
  );
}
