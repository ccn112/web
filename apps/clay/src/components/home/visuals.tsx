"use client";

/**
 * Home "3D-glass" visual kit — native SVG/CSS reconstructions of the handoff
 * reference diagrams (glass capsule nodes on lit pedestals, brand-X hub, thick
 * glowing connector beams, perspective floor). No reference PNG is embedded.
 * Reused across the homepage sections. Reduced-motion safe.
 */

import { cn } from "@/lib/utils";
import { HomeIcon } from "./kit";

/* ---- Luminous glass core hub (abstract energy core + wordmark, no pasted logo) ---- */
export function XHub({
  label = "NỀN TẢNG CHUNG",
  size = 138,
  dark = false,
}: {
  label?: string;
  size?: number;
  dark?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      {/* aura + rotating rings */}
      <span aria-hidden className="animate-glow absolute -inset-6 -z-10 rounded-full bg-cyan/25 blur-3xl" />
      <span aria-hidden className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-cyan/30" />
      <span aria-hidden className="animate-spin-slow-rev absolute inset-[10%] rounded-full border border-blue/15" />
      {/* glass disc */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden rounded-full border shadow-[0_24px_60px_-20px_var(--accent-blue)] backdrop-blur",
          dark ? "border-white/20 bg-white/10" : "border-white/60 bg-gradient-to-b from-white/95 to-white/70",
        )}
        style={{ width: size, height: size }}
      >
        {/* subtle luminous core (behind the wordmark) */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[46%] size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklch,var(--accent-cyan)_55%,transparent),transparent_70%)] blur-[6px]"
        />
        <span aria-hidden className="absolute inset-2 rounded-full ring-1 ring-blue/10" />
        <span aria-hidden className="absolute inset-x-6 top-3 h-6 rounded-[50%] bg-white/40 blur-md" />
        {/* refined wordmark */}
        <span className={cn("relative text-lg font-bold tracking-[0.22em]", dark ? "text-white" : "brand-gradient-text")}>XTECH</span>
        <span className={cn("relative mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.2em]", dark ? "text-white/65" : "text-blue/55")}>
          {label}
        </span>
      </div>
      {/* lit pedestal base */}
      <span
        aria-hidden
        className="mt-[-6%] h-4 rounded-[50%] bg-gradient-to-b from-cyan/50 to-transparent blur-[3px]"
        style={{ width: size * 0.82 }}
      />
    </div>
  );
}

/* ---- Glass capsule node (icon on a lit pedestal, optional number) ---- */
export function GlassNode({
  icon,
  label,
  number,
  size = 66,
  dark = false,
  className,
}: {
  icon: string;
  label?: string;
  number?: number;
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* pedestal glow */}
        <span aria-hidden className="absolute -bottom-1.5 left-1/2 h-2.5 w-[78%] -translate-x-1/2 rounded-[50%] bg-cyan/45 blur-[4px]" />
        {/* capsule */}
        <span
          className={cn(
            "relative flex size-full items-center justify-center rounded-full border backdrop-blur",
            dark
              ? "border-white/20 bg-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,.5),inset_0_1px_0_rgba(255,255,255,.25)]"
              : "border-white/70 bg-gradient-to-b from-white/95 to-white/65 shadow-[0_12px_30px_-10px_rgba(30,60,120,.4),inset_0_1px_0_rgba(255,255,255,.9)]",
          )}
        >
          <span aria-hidden className={cn("absolute inset-1 rounded-full ring-1", dark ? "ring-white/10" : "ring-blue/10")} />
          <HomeIcon name={icon} size={Math.round(size * 0.46)} />
        </span>
        {number ? (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-[oklch(0.21_0.03_262)] shadow ring-1 ring-white/60">
            {String(number).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      {label ? (
        <span className={cn("mt-2 max-w-[7rem] text-center text-xs font-semibold leading-tight", dark ? "text-white/85" : "text-blue")}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ---- Orbit diagram: X hub + N glass nodes on an ellipse + beams + floor ---- */
export type OrbitNode = { icon: string; label: string; number?: number };

export function OrbitDiagram({
  nodes,
  hubLabel = "NỀN TẢNG CHUNG",
  dark = false,
  floor = true,
}: {
  nodes: OrbitNode[];
  hubLabel?: string;
  dark?: boolean;
  floor?: boolean;
}) {
  const n = Math.max(3, nodes.length);
  const R = 41; // % orbit radius
  const pos = (i: number) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
  };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      {/* perspective floor */}
      {floor ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-1/2 overflow-hidden">
          <div className="floor-grid animate-floor mask-fade-t absolute inset-0" />
          <div className="bg-horizon-glow absolute inset-x-0 bottom-0 h-2/3" />
        </div>
      ) : null}

      {/* connector beams */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {nodes.map((_, i) => {
          const p = pos(i);
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={p.x} y2={p.y} stroke="url(#beam)" strokeWidth={1.1} strokeLinecap="round" />
              <line x1="50" y1="50" x2={p.x} y2={p.y} stroke="var(--accent-cyan)" strokeWidth={0.3} strokeOpacity={0.9} strokeLinecap="round" />
              <circle cx={p.x} cy={p.y} r={0.9} fill="var(--accent-cyan)" />
            </g>
          );
        })}
      </svg>

      {/* ring guides */}
      <span aria-hidden className={cn("absolute inset-[9%] rounded-full border", dark ? "border-white/10" : "border-blue/10")} />

      {/* hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <XHub label={hubLabel} dark={dark} />
      </div>

      {/* nodes */}
      {nodes.map((node, i) => {
        const p = pos(i);
        return (
          <div key={node.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <GlassNode icon={node.icon} label={node.label} number={node.number} dark={dark} />
          </div>
        );
      })}
    </div>
  );
}

/* ---- Platform stack: N stacked glowing glass discs (perspective) ---- */
const STACK_ICONS: Record<string, string[]> = {
  products: ["xbooking", "finerp", "xbuilding", "xspace", "ai"],
  "ai-analytics": ["ai", "analytics"],
  workflow: ["workflow", "identity", "api"],
  data: ["data"],
  cloud: ["cloud", "security"],
};

export function PlatformStack({
  layers,
}: {
  layers: { id: string; label: string; items: string[] }[];
}) {
  return (
    <div className="relative mx-auto max-w-md [perspective:1600px]">
      {/* central beam */}
      <span aria-hidden className="absolute left-1/2 top-4 bottom-8 w-px -translate-x-1/2 bg-gradient-to-b from-cyan/60 via-blue/30 to-transparent" />
      <div className="space-y-5">
        {layers.map((layer, i) => {
          const icons = STACK_ICONS[layer.id] ?? [];
          return (
            <div key={layer.id} className="relative flex items-center gap-4">
              {/* number + label */}
              <div className="w-24 shrink-0 text-right">
                <span className="block text-xs font-bold text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span className="block text-sm font-semibold leading-tight text-blue">{layer.label}</span>
              </div>
              {/* glass disc with icons floating on it */}
              <div className="relative flex-1" style={{ transform: "rotateX(30deg)", transformStyle: "preserve-3d" }}>
                <div className="relative flex h-16 items-center justify-center rounded-[50%] border border-blue/15 bg-gradient-to-b from-white/90 to-blue/[0.06] shadow-[0_18px_40px_-22px_var(--accent-blue)]">
                  <span aria-hidden className="absolute inset-x-6 top-1 h-4 rounded-[50%] bg-white/60 blur-md" />
                  <span aria-hidden className="absolute -inset-x-2 -bottom-1 h-4 rounded-[50%] bg-cyan/25 blur-md" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2" style={{ transform: "rotateX(-30deg) translateY(-6px)" }}>
                  {icons.map((ic) => (
                    <span key={ic} className="inline-flex size-9 items-center justify-center rounded-xl border border-white/70 bg-white/85 shadow-sm backdrop-blur">
                      <HomeIcon name={ic} size={20} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Bottom benefit strip (small icon + title + desc) ---- */
export function BenefitStrip({
  items,
}: {
  items: { icon: string; title: string; description: string }[];
}) {
  return (
    <div className="mt-8 rounded-2xl border border-blue/12 bg-card/60 p-4 backdrop-blur">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0"><HomeIcon name={it.icon} size={26} /></span>
            <div>
              <h4 className="text-sm font-semibold text-blue">{it.title}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{it.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
