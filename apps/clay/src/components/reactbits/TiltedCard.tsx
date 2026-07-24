"use client";

/**
 * TiltedCard — ReactBits-style 3D tilt toward the cursor. Disabled under
 * reduced-motion. Wrap any card content; keep tilt subtle for a premium feel.
 */

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltedCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("transition-transform duration-200 [transform-style:preserve-3d] will-change-transform", className)}
    >
      {children}
    </div>
  );
}
