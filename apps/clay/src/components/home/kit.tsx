"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/corporate/about-kit";
import { SplitText } from "@/components/reactbits/SplitText";
import { ShinyText } from "@/components/reactbits/ShinyText";
import type { SectionTitle } from "@/data/home-content";

/** Intrinsic pixel sizes of the home diagrams (for CLS-free next/image sizing). */
const DIAGRAM_DIMS: Record<string, { w: number; h: number }> = {
  "solutions.png": { w: 1254, h: 1254 },
  "products.png": { w: 1448, h: 1086 },
  "platform.png": { w: 1122, h: 1402 },
  "suites.png": { w: 1254, h: 1254 },
  "hero.png": { w: 1122, h: 1402 },
};

/** Render text with `highlight` words wrapped in the brand gradient color. */
export function KeywordLine({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  if (!highlight.length) return <>{text}</>;
  const phrases = [...highlight].sort((a, b) => b.length - a.length);
  const out: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length) {
    let hit: { idx: number; len: number } | null = null;
    for (const ph of phrases) {
      const idx = remaining.toLowerCase().indexOf(ph.toLowerCase());
      if (idx !== -1 && (!hit || idx < hit.idx)) hit = { idx, len: ph.length };
    }
    if (!hit) {
      out.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (hit.idx > 0) out.push(<span key={key++}>{remaining.slice(0, hit.idx)}</span>);
    out.push(
      <span key={key++} className="brand-gradient-text">
        {remaining.slice(hit.idx, hit.idx + hit.len)}
      </span>,
    );
    remaining = remaining.slice(hit.idx + hit.len);
  }
  return <>{out}</>;
}

/** Colored handoff SVG icon (64×64 viewBox), rendered from /public/icons/home. */
export function HomeIcon({
  name,
  size = 30,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/home/${name}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={cn("select-none", className)}
    />
  );
}

/** Icon inside a glass tile with a soft brand glow (product/solution cards). */
export function IconTile({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-14 items-center justify-center rounded-2xl border border-blue/15 bg-card/80 shadow-[0_10px_30px_-16px_var(--accent-blue)] backdrop-blur",
        className,
      )}
    >
      <span aria-hidden className="animate-glow absolute inset-0 -z-10 rounded-2xl bg-cyan/12 blur-lg" />
      <HomeIcon name={name} size={30} />
    </span>
  );
}

/**
 * Section header with EXPLICIT semantic line breaks (title.lines joined by <br>),
 * gold eyebrow pill + gold underline (the luxury signature). Centered by default.
 */
export function SectionHead({
  title,
  align = "center",
  animate = false,
}: {
  title: SectionTitle;
  align?: "center" | "left";
  /** Hero mode: shimmer eyebrow + word-by-word title reveal (ReactBits). */
  animate?: boolean;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col", align === "center" ? "mx-auto items-center text-center" : "items-start text-left")}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue">
          <span className="size-1.5 rounded-full bg-gold" />
          {animate ? <ShinyText text={title.eyebrow} /> : title.eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 text-balance text-2xl font-semibold leading-[1.1] tracking-tight text-blue sm:text-3xl md:text-[2.4rem]">
          {title.lines.map((line, i) => (
            <span key={i} className="block">
              {animate ? <SplitText text={line} delay={0.1 + i * 0.25} /> : <KeywordLine text={line} highlight={title.highlight} />}
            </span>
          ))}
        </h2>
        <span
          aria-hidden
          className={cn("mt-3 block h-[3px] w-12 rounded-full bg-gradient-to-r from-gold to-gold/30", align === "center" && "mx-auto")}
        />
      </Reveal>
      {title.subtitle ? (
        <Reveal delay={0.14}>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {title.subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Thin wrapper to group a section's inner content width. */
export function SectionBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-14", className)}>{children}</div>;
}

/**
 * Two-column section body with alternating image side on desktop and
 * IMAGE-FIRST on mobile. The `visual` is always first in the DOM (so it stacks
 * above content on mobile); on desktop `imageSide` reorders the columns.
 */
export function SplitLayout({
  visual,
  children,
  imageSide = "right",
  className,
}: {
  visual: ReactNode;
  children: ReactNode;
  imageSide?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12", className)}>
      {/* Visual first in DOM → mobile shows the image before the content. */}
      <div className={imageSide === "right" ? "lg:order-2" : "lg:order-1"}>{visual}</div>
      <div className={imageSide === "right" ? "lg:order-1" : "lg:order-2"}>{children}</div>
    </div>
  );
}

/**
 * Extracted design diagram (background keyed out of the reference render) placed
 * as the section's right-side visual. `fade` softens the rectangular edge so a
 * dark scene dissolves into a dark section.
 */
export function DiagramImage({
  src,
  alt,
  fade = false,
  className,
}: {
  src: string;
  alt: string;
  fade?: boolean;
  className?: string;
}) {
  const key = src.slice(src.lastIndexOf("/") + 1);
  const dim = DIAGRAM_DIMS[key] ?? { w: 1200, h: 1000 };
  return (
    <Image
      src={src}
      alt={alt}
      width={dim.w}
      height={dim.h}
      sizes="(max-width: 1024px) 90vw, 560px"
      className={cn(
        "mx-auto block h-auto w-full max-w-[560px] select-none object-contain",
        // Soft edge fade so the image's own background dissolves into the section
        // (no visible square frame) without eating the central content.
        fade && "[mask-image:radial-gradient(120%_125%_at_50%_48%,black_66%,transparent_94%)]",
        className,
      )}
    />
  );
}
