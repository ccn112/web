"use client";

/**
 * SpotlightCard — ReactBits-style card with a soft radial spotlight that follows
 * the cursor. Pure CSS/JS (no deps), reduced-motion friendly (spotlight is a
 * hover affordance, not essential motion). Theme-tinted via --accent tokens.
 */

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
  spotlightColor = "color-mix(in oklch, var(--accent-cyan) 30%, transparent)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group relative overflow-hidden", className)}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx) var(--my), ${spotlightColor}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
