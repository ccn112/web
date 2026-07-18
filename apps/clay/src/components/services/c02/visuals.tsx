"use client";

/**
 * Reusable, data-driven visual primitives for SET C02 service sections.
 *
 * Each primitive takes plain CMS data (items / process / labels) and renders a
 * distinct corporate-tech composition. They are intentionally generic so any
 * future section — on any route/site — can reuse them by feeding the same
 * `ServiceSectionItem[]` shape. Section components in this folder compose them.
 *
 * All animation is reduced-motion safe (via `Reveal` + globals.css disables).
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight, Target } from "lucide-react";
import type { ServiceSectionItem } from "@x/shared-types";
import { cn } from "@/lib/utils";
import { Reveal, GlassCard } from "@/components/corporate/about-kit";
import { iconFor, ordered } from "./kit";

/* ================================================================== */
/* Radar / spider chart — maturity assessment across N dimensions.     */
/* ================================================================== */
/** Illustrative, stable per-axis maturity profile (no randomness). */
function profile(n: number): number[] {
  const base = [0.78, 0.56, 0.7, 0.62, 0.5, 0.72, 0.66, 0.58];
  return Array.from({ length: n }, (_, i) => base[i % base.length]!);
}

export function Radar({ axes }: { axes: string[] }) {
  const n = Math.max(3, axes.length);
  const cx = 110;
  const cy = 110;
  const R = 84;
  const vals = profile(n);
  const ang = (i: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
  const pt = (i: number, r: number): [number, number] => [
    cx + r * Math.cos(ang(i)),
    cy + r * Math.sin(ang(i)),
  ];
  const ringPoly = (f: number) =>
    axes.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const valPoly = axes.map((_, i) => pt(i, R * vals[i]!).join(",")).join(" ");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <span aria-hidden className="animate-glow absolute inset-6 rounded-full bg-cyan/15 blur-3xl" />
      <svg viewBox="0 0 220 220" className="relative size-full">
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={ringPoly(f)}
            fill="none"
            stroke="var(--accent-blue)"
            strokeOpacity={0.16}
            strokeWidth={1}
          />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(i, R);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--accent-blue)" strokeOpacity={0.14} strokeWidth={1} />
          );
        })}
        <polygon points={valPoly} fill="url(#radarFill)" stroke="var(--accent-cyan)" strokeWidth={2} className="[transform-box:fill-box] origin-center motion-safe:animate-[glow-pulse_4s_ease-in-out_infinite]" />
        {axes.map((_, i) => {
          const [x, y] = pt(i, R * vals[i]!);
          return <circle key={i} cx={x} cy={y} r={3.4} fill="var(--accent-cyan)" />;
        })}
        <circle cx={cx} cy={cy} r={3} fill="var(--accent-blue)" />
      </svg>
      {/* Axis labels around the chart */}
      {axes.map((label, i) => {
        const [x, y] = pt(i, R + 18);
        return (
          <span
            key={label}
            className="absolute w-24 -translate-x-1/2 -translate-y-1/2 text-center text-[11px] font-semibold leading-tight text-blue"
            style={{ left: `${(x / 220) * 100}%`, top: `${(y / 220) * 100}%` }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* Layer stack — north-star target above N stacked architecture tiers. */
/* ================================================================== */
export function LayerStack({
  layers,
  northStar,
}: {
  layers: ServiceSectionItem[];
  northStar: string;
}) {
  const list = ordered(layers);
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* North star */}
      <Reveal className="flex flex-col items-center">
        <span className="relative flex size-24 items-center justify-center">
          <span aria-hidden className="animate-glow absolute inset-0 rounded-full bg-cyan/25 blur-2xl" />
          <span aria-hidden className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-cyan/40" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue to-cyan text-white shadow-[0_0_50px_-8px_var(--accent-cyan)]">
            <Target className="size-7" />
          </span>
        </span>
        <span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue/80">{northStar}</span>
        <span aria-hidden className="mt-2 h-8 w-px bg-gradient-to-b from-cyan/60 to-transparent" />
      </Reveal>

      {/* Stacked tiers with subtle 3D perspective */}
      <div className="mt-2 space-y-4 [perspective:1400px]">
        {list.map((layer, i) => {
          const Icon = iconFor(layer, i);
          return (
            <Reveal key={layer.itemId} delay={i * 0.1}>
              <div
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-blue/15 bg-card/80 p-5 shadow-[0_20px_50px_-34px_var(--accent-blue)] backdrop-blur transition duration-300 hover:border-cyan/40"
                style={{ transform: "rotateX(5deg)", transformOrigin: "center top" }}
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue to-cyan" />
                <span className="ml-1 inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-cyan text-white">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-blue">{layer.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{layer.description}</p>
                </div>
                <span className="ml-auto hidden text-xs font-semibold text-blue/40 sm:block">L{i + 1}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Evolution flow — staged progression with chevrons (before → after). */
/* ================================================================== */
export function EvolutionFlow({ stages }: { stages: ServiceSectionItem[] }) {
  const list = ordered(stages);
  return (
    <div className="mt-14">
      {/* Desktop: horizontal chevron flow */}
      <div className="hidden items-stretch gap-2 md:flex">
        {list.map((stage, i) => {
          const Icon = iconFor(stage, i);
          const emphasis = 0.4 + (i / Math.max(1, list.length - 1)) * 0.6;
          return (
            <div key={stage.itemId} className="flex flex-1 items-center">
              <Reveal delay={i * 0.1} className="flex-1">
                <div className="relative h-full overflow-hidden rounded-2xl border border-blue/15 bg-card/80 p-5 backdrop-blur">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue to-cyan"
                    style={{ opacity: emphasis }}
                  />
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, color-mix(in oklch, var(--accent-blue) ${emphasis * 100}%, var(--card)), var(--accent-cyan))` }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold tracking-tight text-blue">{stage.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                </div>
              </Reveal>
              {i < list.length - 1 ? (
                <ChevronRight aria-hidden className="mx-1 size-6 shrink-0 text-cyan" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical flow */}
      <div className="space-y-3 md:hidden">
        {list.map((stage, i) => {
          const Icon = iconFor(stage, i);
          return (
            <Reveal key={stage.itemId} delay={i * 0.07}>
              <div className="flex items-start gap-4 rounded-2xl border border-blue/15 bg-card/80 p-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-cyan text-white">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-blue">{stage.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Pipeline — N source chips feeding a staged flow with animated stream.*/
/* ================================================================== */
export function Pipeline({
  sources,
  stages,
}: {
  sources: ServiceSectionItem[];
  stages: ServiceSectionItem[];
}) {
  const srcs = ordered(sources);
  const flow = ordered(stages);
  return (
    <div className="mt-14">
      {/* Sources */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {srcs.map((s, i) => {
          const Icon = iconFor(s, i);
          return (
            <Reveal key={s.itemId} delay={i * 0.05}>
              <div className="flex items-center gap-2.5 rounded-xl border border-blue/15 bg-card/80 px-3 py-2.5 backdrop-blur">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <Icon className="size-4" />
                </span>
                <span className="truncate text-sm font-semibold text-blue">{s.title}</span>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Connector: streaming down into the pipeline */}
      <div aria-hidden className="relative mx-auto my-5 h-10 w-px">
        <div className="stream-line-v animate-flow-y absolute inset-0 w-[3px] -translate-x-1/2 rounded-full" />
      </div>

      {/* Staged flow */}
      <div className="relative grid gap-4 md:grid-cols-4">
        <div aria-hidden className="stream-line animate-flow-x absolute left-0 right-0 top-7 hidden h-[3px] rounded-full md:block" />
        {flow.map((st, i) => {
          const Icon = iconFor(st, i + 10);
          return (
            <Reveal key={st.itemId} delay={i * 0.1}>
              <GlassCard className="relative h-full p-5">
                <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-cyan text-white shadow-[0_0_22px_-8px_var(--accent-cyan)]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold tracking-tight text-blue">{st.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{st.description}</p>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Bridge hub — legacy (left) → integration hub (center) → modern (right)*/
/* ================================================================== */
export function BridgeHub({
  left,
  right,
  hubLabel,
  capabilities,
}: {
  left: ServiceSectionItem[];
  right: ServiceSectionItem[];
  hubLabel: string;
  capabilities: ServiceSectionItem[];
}) {
  const caps = ordered(capabilities);
  const SideCard = ({ item, i, tone }: { item: ServiceSectionItem; i: number; tone: "legacy" | "modern" }) => {
    const Icon = iconFor(item, tone === "legacy" ? i : i + 4);
    return (
      <Reveal delay={i * 0.07}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border p-3 backdrop-blur",
            tone === "legacy" ? "border-blue/10 bg-muted/40" : "border-cyan/25 bg-card/80",
          )}
        >
          <span
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
              tone === "legacy" ? "bg-blue/10 text-blue/70" : "bg-gradient-to-br from-blue to-cyan text-white",
            )}
          >
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <h3 className={cn("truncate text-sm font-semibold", tone === "legacy" ? "text-blue/70" : "text-blue")}>{item.title}</h3>
            <p className="truncate text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      </Reveal>
    );
  };

  return (
    <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
      {/* Legacy */}
      <div className="space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-blue/50 lg:text-right">Hệ thống hiện hữu</p>
        {ordered(left).map((it, i) => <SideCard key={it.itemId} item={it} i={i} tone="legacy" />)}
      </div>

      {/* Hub */}
      <Reveal className="flex flex-col items-center">
        <div className="relative flex w-56 flex-col items-center rounded-3xl border border-cyan/30 bg-card/85 p-5 backdrop-blur shadow-[0_0_60px_-20px_var(--accent-cyan)]">
          <span aria-hidden className="animate-glow absolute inset-0 -z-10 rounded-3xl bg-cyan/10 blur-2xl" />
          <span className="text-sm font-bold tracking-tight text-blue">{hubLabel}</span>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {caps.map((c) => (
              <span key={c.itemId} className="rounded-full border border-blue/15 bg-blue/5 px-2.5 py-1 text-[11px] font-semibold text-blue">
                {c.title}
              </span>
            ))}
          </div>
        </div>
        <div aria-hidden className="mt-4 flex items-center gap-2 text-cyan lg:hidden">
          <ArrowRight className="size-5 rotate-90" />
        </div>
      </Reveal>

      {/* Modern */}
      <div className="space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan lg:text-left">Nền tảng số hiện đại</p>
        {ordered(right).map((it, i) => <SideCard key={it.itemId} item={it} i={i} tone="modern" />)}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Cycle — circular continuous-improvement loop of N steps.            */
/* ================================================================== */
export function Cycle({ steps, centerLabel }: { steps: ServiceSectionItem[]; centerLabel: string }) {
  const list = ordered(steps);
  const n = Math.max(3, list.length);
  const R = 42; // percent radius within the square
  return (
    <div className="mt-14">
      {/* Desktop: circular arrangement */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] md:block">
        <span aria-hidden className="animate-spin-slow absolute inset-[8%] rounded-full border border-dashed border-cyan/30" />
        <span aria-hidden className="animate-spin-slow-rev absolute inset-[20%] rounded-full border border-blue/15" />
        {/* Center */}
        <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-blue to-cyan text-center text-white shadow-[0_0_60px_-14px_var(--accent-cyan)]">
          <span className="px-3 text-sm font-semibold leading-tight">{centerLabel}</span>
        </div>
        {list.map((step, i) => {
          const Icon = iconFor(step, i + 20);
          const a = (-90 + (360 / n) * i) * (Math.PI / 180);
          const x = 50 + R * Math.cos(a);
          const y = 50 + R * Math.sin(a);
          return (
            <div key={step.itemId} className="absolute w-32 -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
              <Reveal delay={i * 0.08} className="flex flex-col items-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-cyan/40 bg-card text-blue shadow-sm">
                  <Icon className="size-5" />
                </span>
                <span className="mt-1.5 text-xs font-semibold text-blue">{step.title}</span>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical loop */}
      <ol className="relative space-y-3 md:hidden">
        {list.map((step, i) => {
          const Icon = iconFor(step, i + 20);
          return (
            <Reveal as="li" key={step.itemId} delay={i * 0.06}>
              <div className="flex items-center gap-3 rounded-xl border border-blue/15 bg-card/80 p-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full border-2 border-cyan/40 bg-card text-blue">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-blue">{step.title}</span>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/* ================================================================== */
/* Journey — stakeholders + ascending adoption path with progress.     */
/* ================================================================== */
export function AdoptionJourney({
  stakeholders,
  stages,
}: {
  stakeholders: ServiceSectionItem[];
  stages: ServiceSectionItem[];
}) {
  const people = ordered(stakeholders);
  const path = ordered(stages);
  return (
    <div className="mt-14">
      {/* Stakeholders */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {people.map((p, i) => {
          const Icon = iconFor(p, i);
          return (
            <Reveal key={p.itemId} delay={i * 0.06}>
              <GlassCard className="h-full p-4 text-center">
                <span className="mx-auto inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue to-cyan text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-2 text-sm font-semibold text-blue">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>

      {/* Ascending journey */}
      <div className="relative mt-12">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-blue/60">Hành trình áp dụng</p>
        {/* Desktop: ascending nodes */}
        <div className="hidden items-end gap-2 md:flex">
          {path.map((st, i) => {
            const lift = (i / Math.max(1, path.length - 1)) * 96; // px rise
            return (
              <div key={st.itemId} className="flex flex-1 flex-col items-center">
                <Reveal delay={i * 0.08} className="flex flex-col items-center" y={12}>
                  <div style={{ marginBottom: lift }} className="flex flex-col items-center">
                    <span className="flex size-11 items-center justify-center rounded-full border-2 border-cyan bg-background text-sm font-bold text-blue">
                      {i + 1}
                    </span>
                    <span className="mt-2 max-w-[7rem] text-center text-xs font-semibold leading-snug text-blue">{st.title}</span>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
        {/* rising baseline */}
        <div aria-hidden className="mt-3 hidden h-1 rounded-full bg-gradient-to-r from-blue/30 via-cyan to-blue md:block" />

        {/* Mobile: vertical */}
        <ol className="relative space-y-4 border-l-2 border-cyan/30 pl-6 md:hidden">
          {path.map((st, i) => (
            <Reveal as="li" key={st.itemId} delay={i * 0.05} className="relative">
              <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-cyan bg-background text-[11px] font-bold text-blue">
                {i + 1}
              </span>
              <h3 className="text-sm font-semibold text-blue">{st.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{st.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* Small shared helper: a labelled band used by section headers when needed. */
export function VisualNote({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-center text-xs text-muted-foreground">{children}</p>;
}
