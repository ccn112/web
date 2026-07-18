"use client";

import type { ReactNode } from "react";
import { icons, type LucideIcon } from "lucide-react";
import {
  Activity, BarChart3, Boxes, Brain, Building2, ClipboardCheck, Cloud,
  Compass, Cpu, Database, GaugeCircle, GitBranch, GraduationCap, Layers, LineChart,
  Network, PenTool, Plug, Rocket, Search, Settings2, Shield, Sparkles, Target,
  TrendingUp, Users, Workflow,
} from "lucide-react";
import type { ServiceSectionItem, ServiceSectionOutcome } from "@x/shared-types";
import { Container } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { Reveal, GlassCard } from "@/components/corporate/about-kit";

/* kebab-case ("bar-chart-3") -> PascalCase ("BarChart3") for lucide's `icons` record. */
function pascal(name: string): string {
  return name.replace(/(^|-)([a-z0-9])/g, (_m, _d, c: string) => c.toUpperCase());
}

/** A rotating palette so items without an explicit icon still look intentional. */
const PALETTE: LucideIcon[] = [
  Search, Compass, PenTool, Boxes, Rocket, GaugeCircle, Target, Users, Database,
  Network, Cloud, Shield, Workflow, Cpu, LineChart, Brain, Plug, Layers, TrendingUp,
  Building2, GitBranch, Settings2, Activity, ClipboardCheck, GraduationCap, BarChart3,
  Sparkles,
];

/** Resolve an item's icon: explicit lucide name if valid, else a stable palette pick. */
export function iconFor(item: { icon?: string }, index: number): LucideIcon {
  if (item.icon) {
    const found = (icons as Record<string, LucideIcon>)[pascal(item.icon)];
    if (found) return found;
  }
  return PALETTE[index % PALETTE.length]!;
}

/** Ordered items honoring the optional `order` field, else source order. */
export function ordered<T extends { order?: number }>(list: T[] = []): T[] {
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* ------------------------------------------------------------------ */
/* Section shell — rich corporate tech backdrop (SET C02):            */
/* ambient wash + tech grid + perspective floor grid + horizon glow.  */
/* ------------------------------------------------------------------ */
export function C02Section({
  id,
  soft,
  floor = true,
  children,
}: {
  id?: string;
  soft?: boolean;
  floor?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative isolate overflow-hidden py-20 md:py-28", soft && "bg-card/40")}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-ambient opacity-80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech mask-radial opacity-70" />
      {floor ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 overflow-hidden">
          <div className="floor-grid animate-floor mask-fade-t absolute inset-x-[-25%] bottom-0 top-0" />
          <div className="bg-horizon-glow absolute inset-x-0 bottom-0 h-44" />
        </div>
      ) : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Glowing central hub (orb on a lit pedestal).                        */
/* ------------------------------------------------------------------ */
export function C02Hub({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="relative flex size-44 items-center justify-center sm:size-52">
      <span aria-hidden className="animate-glow absolute inset-[-18%] rounded-full bg-cyan/20 blur-3xl" />
      <span aria-hidden className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-gold/45" />
      <span aria-hidden className="animate-spin-slow-rev absolute inset-4 rounded-full border border-blue/25" />
      <span aria-hidden className="absolute inset-8 rounded-full border border-gold/25" />
      <div className="relative flex size-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-blue to-cyan text-center text-white shadow-[0_0_70px_-12px_var(--accent-cyan)] sm:size-36">
        <span className="px-4 text-sm font-semibold leading-tight sm:text-base">{label}</span>
        {sub ? <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">{sub}</span> : null}
      </div>
      <span aria-hidden className="absolute -bottom-4 h-6 w-40 rounded-[50%] bg-cyan/30 blur-lg" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Capability card (optional number badge).                            */
/* ------------------------------------------------------------------ */
export function CapabilityCard({
  item,
  index,
  number,
  align = "left",
}: {
  item: ServiceSectionItem;
  index: number;
  number?: number;
  align?: "left" | "right";
}) {
  const Icon = iconFor(item, index);
  const rev = align === "right";
  return (
    <GlassCard className="p-5 transition duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_20px_50px_-24px_var(--accent-gold)]">
      <div className={cn("flex items-start gap-4", rev && "flex-row-reverse text-right")}>
        <span className="relative mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-cyan text-white">
          <Icon className="size-5" />
          {number ? (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink shadow ring-1 ring-gold/50">
              {number}
            </span>
          ) : null}
        </span>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-blue">{item.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/* Process timeline — unified format shared with /ve-x (Transformation) */
/* progress rail: bordered numbered nodes + gradient rail + titles.     */
/* Desktop horizontal, mobile vertical rail. Reduced-motion safe.       */
/* ------------------------------------------------------------------ */
const pad2 = (n: number) => String(n).padStart(2, "0");

export function C02Timeline({ steps }: { steps: ServiceSectionItem[] }) {
  const list = ordered(steps);
  if (!list.length) return null;
  return (
    <>
      {/* Desktop / tablet: horizontal progress rail */}
      <div className="relative mt-16 hidden md:block">
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-gold/15" />
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-gold/50 via-gold to-gold/40" />
        <ol
          className="relative grid gap-4"
          style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}
        >
          {list.map((step, i) => (
            <Reveal key={step.itemId} as="li" delay={i * 0.08} className="flex flex-col items-center px-1 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border-2 border-gold bg-background text-sm font-semibold text-blue shadow-[0_0_18px_-6px_var(--accent-gold)]">
                {pad2(step.order ?? i + 1)}
              </span>
              <span className="mt-3 text-sm font-semibold leading-snug tracking-tight text-blue">{step.title}</span>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical rail */}
      <ol className="relative mt-12 space-y-6 before:absolute before:left-6 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-gold/25 md:hidden">
        {list.map((step, i) => (
          <Reveal as="li" key={step.itemId} delay={i * 0.06} className="relative flex gap-4 pl-0">
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-background text-sm font-semibold text-blue">
              {pad2(step.order ?? i + 1)}
            </span>
            <GlassCard className="flex-1 p-5">
              <h3 className="text-sm font-semibold tracking-tight text-blue">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ol>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Closing 3-up outcome strip (glass panel).                           */
/* ------------------------------------------------------------------ */
export function C02OutcomeStrip({ outcomes }: { outcomes?: ServiceSectionOutcome[] }) {
  if (!outcomes?.length) return null;
  return (
    <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {outcomes.map((o, i) => {
        const Icon = iconFor(o, i + 20);
        return (
          <Reveal key={o.itemId} delay={i * 0.08}>
            <GlassCard className="h-full p-6">
              <span className="icon-gold inline-flex size-12 items-center justify-center rounded-full shadow-[0_0_22px_-8px_var(--accent-gold)]">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
            </GlassCard>
          </Reveal>
        );
      })}
    </div>
  );
}
