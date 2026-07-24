"use client";

/**
 * SplitText — ReactBits-style word-by-word reveal (fade + rise, staggered).
 * CSS-only animation, reduced-motion safe. Renders inline; pass `as` for the tag.
 * Adapted for xweb (theme-agnostic, no extra deps).
 */

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SplitText({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.05,
  children,
}: {
  text?: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  children?: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = (text ?? "").split(" ");
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className={cn("inline-block will-change-transform", wordClassName)}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(0.5em)",
            transition: `opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)`,
            transitionDelay: `${delay + i * stagger}s`,
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
      {children}
    </Tag>
  );
}
