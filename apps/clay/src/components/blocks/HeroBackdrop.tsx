"use client";

/**
 * Hero backdrop — semantic background image with a 3-layer overlay
 * (readability gradient + vignette + center safe-zone), floating semantic
 * tech nodes (desktop only), a subtle load zoom-out, and mouse parallax.
 * All motion is reduced-motion safe. Used by HeroBlockView when a CMS
 * `background` image is present.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  Database,
  Megaphone,
  Settings2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NodeDef = { label: string; Icon: LucideIcon; pos: string };

/** Six generic semantic nodes fanning out on either side of the headline. */
const NODES: NodeDef[] = [
  { label: "Marketing", Icon: Megaphone, pos: "left-[4%] top-[26%]" },
  { label: "Khách hàng", Icon: Users, pos: "left-[2%] top-[52%]" },
  { label: "Phân tích", Icon: TrendingUp, pos: "left-[6%] top-[76%]" },
  { label: "AI", Icon: BrainCircuit, pos: "right-[4%] top-[26%]" },
  { label: "Dữ liệu", Icon: Database, pos: "right-[2%] top-[52%]" },
  { label: "Vận hành", Icon: Settings2, pos: "right-[6%] top-[76%]" },
];

export function HeroBackdrop({
  src,
  overlay = "medium",
  showNodes = true,
}: {
  src: string;
  overlay?: "medium" | "strong";
  showNodes?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMounted(true);
    if (reduce.current) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (!desktop.matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setOff({
          x: (e.clientX / window.innerWidth - 0.5) * 10,
          y: (e.clientY / window.innerHeight - 0.5) * 8,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const grad =
    overlay === "strong"
      ? "linear-gradient(180deg, rgba(9,13,28,0.5) 0%, rgba(9,13,28,0.62) 45%, rgba(9,13,28,0.82) 100%)"
      : "linear-gradient(180deg, rgba(9,13,28,0.34) 0%, rgba(9,13,28,0.46) 45%, rgba(9,13,28,0.7) 100%)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Background image: load zoom-out (outer) + parallax translate (inner) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${mounted ? 1 : 1.08})`,
          transition: "transform 1.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.07] object-cover"
          style={{
            transform: `translate3d(${off.x}px, ${off.y}px, 0)`,
            transition: "transform 0.35s ease-out",
          }}
        />
      </div>

      {/* Layer 1 — readability gradient (top→bottom) */}
      <div className="absolute inset-0" style={{ backgroundImage: grad }} />
      {/* Layer 2 — vignette (darken edges, keep center) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 50% 30%, transparent 42%, rgba(6,10,24,0.55) 100%)",
        }}
      />
      {/* Layer 3 — center safe-zone glow under the headline */}
      <div
        className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/3"
        style={{
          backgroundImage:
            "radial-gradient(60% 100% at 50% 40%, color-mix(in oklch, var(--accent-blue) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Faint tech grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.06] mask-fade-b" />

      {/* Semantic nodes — desktop only */}
      {showNodes ? (
        <div className="absolute inset-0 hidden lg:block">
          {NODES.map((n, i) => (
            <div
              key={n.label}
              className={cn("absolute flex flex-col items-center gap-1.5", n.pos)}
              style={{
                transform: `translate3d(${off.x * 1.6}px, ${off.y * 1.6}px, 0)`,
                transition: "transform 0.5s ease-out",
              }}
            >
              <span
                className="motion-safe:animate-node-in inline-flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur-md"
                style={{ animationDelay: `${300 + i * 90}ms` }}
              >
                <n.Icon className="size-5" strokeWidth={1.65} />
                <span className="animate-glow absolute inset-0 -z-10 rounded-2xl bg-cyan/20 blur-lg" />
              </span>
              <span
                className="motion-safe:animate-node-in rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${360 + i * 90}ms` }}
              >
                {n.label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
