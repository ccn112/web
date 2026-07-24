"use client";

/**
 * ShinyText — ReactBits-style shimmer sweep across text. CSS-only, reduced-motion
 * safe (falls back to static). Good for eyebrows / small accents, not long body.
 */

import { cn } from "@/lib/utils";

export function ShinyText({ text, className, speed = 4 }: { text: string; className?: string; speed?: number }) {
  return (
    <span
      className={cn("rb-shiny bg-clip-text text-transparent", className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
