"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/primitives";
import { cn } from "@/lib/utils";

/* ---------- reveal (reduced-motion aware) ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Robust reveal: show immediately if already in the viewport on mount (fixes
  // above-the-fold content staying hidden under dev StrictMode double-mount),
  // otherwise reveal on scroll via IntersectionObserver.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduce) {
    const Tag = as;
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }
  const MotionTag = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ---------- ambient section shell ---------- */
export function AmbientSection({
  children,
  id,
  soft,
  city = true,
  compact = false,
  className,
}: {
  children: ReactNode;
  id?: string;
  soft?: boolean;
  city?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        compact ? "py-12 md:py-16" : "py-20 md:py-28",
        soft && "bg-card/50",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ambient opacity-80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-tech mask-radial" />
      {city ? <Cityscape /> : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}

/** PropTech skyline: a row of buildings (towers + apartment blocks) with lit window grids. */
const BUILDINGS: { x: number; w: number; h: number; cols: number; rows: number }[] = [
  { x: 0, w: 58, h: 70, cols: 3, rows: 4 },
  { x: 62, w: 40, h: 104, cols: 2, rows: 7 },
  { x: 106, w: 74, h: 58, cols: 4, rows: 3 },
  { x: 184, w: 46, h: 132, cols: 3, rows: 9 },
  { x: 234, w: 68, h: 88, cols: 4, rows: 5 },
  { x: 306, w: 52, h: 158, cols: 3, rows: 11 },
  { x: 362, w: 86, h: 76, cols: 5, rows: 4 },
  { x: 452, w: 44, h: 122, cols: 2, rows: 8 },
  { x: 500, w: 72, h: 96, cols: 4, rows: 6 },
  { x: 576, w: 50, h: 172, cols: 3, rows: 12 },
  { x: 630, w: 80, h: 66, cols: 5, rows: 3 },
  { x: 714, w: 46, h: 138, cols: 3, rows: 9 },
  { x: 764, w: 66, h: 90, cols: 4, rows: 5 },
  { x: 834, w: 54, h: 150, cols: 3, rows: 10 },
  { x: 892, w: 88, h: 72, cols: 5, rows: 4 },
  { x: 984, w: 44, h: 116, cols: 2, rows: 8 },
  { x: 1032, w: 70, h: 84, cols: 4, rows: 5 },
  { x: 1106, w: 50, h: 128, cols: 3, rows: 9 },
  { x: 1160, w: 40, h: 60, cols: 2, rows: 3 },
];
const BASE = 190;
function Cityscape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 190"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-36 w-full text-blue md:h-48"
    >
      <g fill="currentColor">
        {BUILDINGS.map((b, i) => {
          const pad = 5;
          const gw = (b.w - pad * 2) / b.cols;
          const gh = Math.min(6, (b.h - 14) / b.rows);
          const wins = [];
          for (let r = 0; r < b.rows; r++) {
            for (let c = 0; c < b.cols; c++) {
              // deterministic "lit" pattern (no randomness -> SSR-stable)
              const lit = (r * 7 + c * 3 + i) % 4 !== 0;
              if (!lit) continue;
              wins.push(
                <rect
                  key={`${i}-${r}-${c}`}
                  x={b.x + pad + c * gw + 0.6}
                  y={BASE - b.h + 8 + r * (gh + 2)}
                  width={Math.max(1.4, gw - 1.6)}
                  height={Math.max(1.4, gh - 1)}
                  rx={0.6}
                  opacity={0.14}
                />,
              );
            }
          }
          return (
            <g key={i}>
              <rect x={b.x} y={BASE - b.h} width={b.w - 2} height={b.h} rx={2} opacity={0.07} />
              {wins}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ---------- headings ---------- */
export function Head({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col", align === "center" ? "mx-auto items-center text-center" : "items-start text-left")}>
      {eyebrow ? (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue">
            <span className="size-1.5 rounded-full bg-gold" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-blue sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {title}
        </h2>
        <span
          aria-hidden
          className={cn("mt-4 block h-[3px] w-14 rounded-full bg-gradient-to-r from-gold to-gold/30", align === "center" && "mx-auto")}
        />
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.14}>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------- pieces ---------- */
export function IconNode({
  icon: Icon,
  size = "md",
  active = false,
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  className?: string;
}) {
  const dim = size === "lg" ? "size-16" : size === "sm" ? "size-11" : "size-14";
  const ic = size === "lg" ? "size-8" : size === "sm" ? "size-5" : "size-7";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-cyan text-white transition-shadow duration-300",
        dim,
        active ? "node-glow" : "shadow-[0_12px_28px_-14px_oklch(0.6_0.19_255)]",
        className,
      )}
    >
      <Icon className={ic} />
    </span>
  );
}

export function HubCore({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="relative flex size-40 items-center justify-center sm:size-48">
      <span aria-hidden className="absolute inset-0 rounded-full border border-cyan/30 animate-spin-slow" />
      <span aria-hidden className="absolute inset-4 rounded-full border border-blue/20 animate-spin-slow-rev" />
      <span aria-hidden className="absolute inset-0 rounded-full bg-cyan/10 blur-2xl" />
      <div className="relative flex size-28 flex-col items-center justify-center rounded-full border border-blue/20 bg-card/80 text-center shadow-[0_20px_50px_-24px_oklch(0.6_0.19_255)] backdrop-blur sm:size-32">
        <span className="text-lg font-semibold tracking-tight text-blue sm:text-xl">{label}</span>
        {sub ? <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{sub}</span> : null}
      </div>
    </div>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass-card rounded-2xl", className)}>{children}</div>;
}

export function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
      <Icon className="size-4 text-blue" />
      {label}
    </span>
  );
}

/** A subtle animated cyan connector line drawn as an SVG path. */
export function Connector({
  d,
  className,
  animate = true,
}: {
  d: string;
  className?: string;
  animate?: boolean;
}) {
  return (
    <path
      d={d}
      className={cn(className)}
      fill="none"
      stroke="url(#cyanGrad)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeDasharray="5 7"
      style={animate ? { animation: "var(--animate-dash)" } : undefined}
    />
  );
}

export function ConnectorDefs() {
  return (
    <defs>
      <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.1" />
        <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  );
}
