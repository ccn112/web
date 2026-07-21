"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/primitives";
import { cn } from "@/lib/utils";
import {
  AmbientSection,
  Head,
  IconNode,
  HubCore,
  GlassCard,
  Chip,
  Reveal,
  ConnectorDefs,
} from "./about-kit";
import * as C from "./about-content";

/* ============================================================
   2. WHO WE ARE — central hub + 4 capability cards + connectors
   ============================================================ */
const WWA_POS = [
  { x: 0.15, y: 0.22 },
  { x: 0.85, y: 0.22 },
  { x: 0.15, y: 0.78 },
  { x: 0.85, y: 0.78 },
];
export function WhoWeAre() {
  const reduce = useReducedMotion();
  return (
    <AmbientSection id="ve-xtech">
      <Head
        eyebrow="Về XTECH"
        title="Đối tác công nghệ đồng hành cùng doanh nghiệp"
        subtitle="Tư vấn chiến lược — Phát triển nền tảng — Tích hợp hệ thống — Vận hành dài hạn."
      />

      {/* desktop hub composition */}
      <div className="relative mx-auto mt-16 hidden aspect-[16/9] max-w-4xl lg:block">
        <svg aria-hidden viewBox="0 0 1000 562" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <ConnectorDefs />
          {WWA_POS.map((p, i) => (
            <motion.path
              key={i}
              d={`M 500 281 L ${p.x * 1000} ${p.y * 562}`}
              fill="none"
              stroke="url(#cyanGrad)"
              strokeWidth={1.6}
              strokeDasharray="5 7"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.06, ease: "easeOut" }}
            />
          ))}
          {WWA_POS.map((p, i) => (
            <circle key={`n${i}`} cx={p.x * 1000} cy={p.y * 562} r={4} className="fill-cyan animate-glow" />
          ))}
          <circle cx={500} cy={281} r={5} className="fill-cyan" />
        </svg>

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <HubCore label="XTECH" sub="Technology Partner" />
        </motion.div>

        {C.CAPABILITIES.map((c, i) => (
          <motion.div
            key={c.title}
            className="absolute w-64 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${WWA_POS[i]!.x * 100}%`, top: `${WWA_POS[i]!.y * 100}%` }}
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.55 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="p-5">
              <IconNode icon={c.icon} size="sm" />
              <h3 className="mt-3 text-sm font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* mobile stacked */}
      <div className="mt-12 lg:hidden">
        <div className="flex justify-center">
          <HubCore label="XTECH" sub="Technology Partner" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {C.CAPABILITIES.map((c) => (
            <Reveal key={c.title}>
              <GlassCard className="p-5">
                <IconNode icon={c.icon} size="sm" />
                <h3 className="mt-3 text-sm font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* stats */}
      <Reveal delay={0.1}>
        <dl className="mx-auto mt-14 grid max-w-4xl gap-6 rounded-3xl border border-blue/12 bg-gradient-to-br from-blue/5 to-cyan/5 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {C.STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <dt className="brand-gradient-text text-4xl font-semibold tracking-tight">{s.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </AmbientSection>
  );
}

/* ============================================================
   3. PRODUCT ECOSYSTEM — sticky scroll hub + 5 orbiting products
   ============================================================ */
const ORBIT = [
  { x: 0.5, y: 0.08 },
  { x: 0.93, y: 0.4 },
  { x: 0.76, y: 0.92 },
  { x: 0.24, y: 0.92 },
  { x: 0.07, y: 0.4 },
];
export function ProductEcosystem() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(C.PRODUCTS.length - 1, Math.max(0, Math.floor(v * C.PRODUCTS.length)));
    setActive(idx);
  });
  const activeProduct = C.PRODUCTS[active]!;

  return (
    <section ref={ref} className="relative bg-card/40 lg:h-[300vh]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ambient opacity-80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-tech mask-radial" />

      {/* desktop sticky */}
      <div className="sticky top-0 hidden min-h-screen items-center overflow-hidden lg:flex">
        <Container className="relative">
          <div className="grid grid-cols-2 items-center gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue">
                <span className="size-1.5 rounded-full bg-cyan" /> Hệ sinh thái sản phẩm
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-blue md:text-[2.6rem] md:leading-[1.1]">
                Một hệ sinh thái – Nhiều bài toán doanh nghiệp
              </h2>
              <ul className="mt-8 space-y-2">
                {C.PRODUCTS.map((p, i) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => {
                        const el = ref.current;
                        if (el) {
                          const top = el.offsetTop + (i / C.PRODUCTS.length) * (el.offsetHeight - window.innerHeight) + 4;
                          window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                        i === active
                          ? "glass-card border-blue/25"
                          : "border-transparent opacity-55 hover:opacity-90",
                      )}
                    >
                      <IconNode icon={p.icon} size="sm" active={i === active} />
                      <div>
                        <p className={cn("text-sm font-semibold", i === active && "text-blue")}>{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.tagline}</p>
                      </div>
                      <span className="ml-auto font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")} / 0{C.PRODUCTS.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* orbit visual */}
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <span aria-hidden className="absolute inset-[8%] rounded-full border border-blue/12 animate-spin-slow" />
              <span aria-hidden className="absolute inset-[22%] rounded-full border border-cyan/15 animate-spin-slow-rev" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <HubCore label="XTECH" sub="Digital Ecosystem" />
              </div>
              {C.PRODUCTS.map((p, i) => (
                <div
                  key={p.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{ left: `${ORBIT[i]!.x * 100}%`, top: `${ORBIT[i]!.y * 100}%` }}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-all duration-500",
                      i === active ? "glass-card scale-110" : "scale-90 opacity-50",
                    )}
                  >
                    <IconNode icon={p.icon} size={i === active ? "md" : "sm"} active={i === active} />
                    <span className={cn("text-xs font-semibold", i === active && "text-blue")}>{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* active detail */}
          <div className="mt-2 flex flex-wrap justify-center gap-2.5">
            {activeProduct.caps?.map((cap) => (
              <span key={cap} className="rounded-full border border-blue/15 bg-card/70 px-4 py-1.5 text-sm font-medium text-blue backdrop-blur">
                {cap}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* mobile: horizontal snap carousel */}
      <div className="py-20 lg:hidden">
        <Container>
          <Head eyebrow="Hệ sinh thái sản phẩm" title="Một hệ sinh thái – Nhiều bài toán doanh nghiệp" />
          <div className="mt-8 flex justify-center">
            <HubCore label="XTECH" sub="Digital Ecosystem" />
          </div>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {C.PRODUCTS.map((p) => (
              <GlassCard key={p.name} className="w-[78%] shrink-0 snap-center p-6">
                <IconNode icon={p.icon} />
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.caps?.map((cap) => (
                    <span key={cap} className="rounded-full border border-blue/15 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">{cap}</span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ============================================================
   4. DIGITAL TRANSFORMATION — scroll-driven 6-stage journey
   ============================================================ */
export function Transformation() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(C.STAGES.length - 1, Math.max(0, Math.floor(v * C.STAGES.length))));
  });
  const stage = C.STAGES[active]!;

  return (
    <section ref={ref} className="relative lg:h-[320vh]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ambient opacity-80" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-tech mask-radial" />

      {/* desktop sticky */}
      <div className="sticky top-0 hidden min-h-screen flex-col justify-center overflow-hidden lg:flex">
        <Container className="relative">
          <Head eyebrow="Năng lực chuyển đổi số" title="Từ chiến lược đến vận hành số" />

          {/* progress rail */}
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 h-0.5 bg-blue/10" />
            <motion.div className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-blue to-cyan" style={{ width: lineWidth }} />
            <ol className="relative grid grid-cols-6 gap-4">
              {C.STAGES.map((s, i) => (
                <li key={s.title} className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold transition-all duration-300",
                      i <= active ? "border-blue text-blue" : "border-blue/20 text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("mt-3 text-xs font-medium leading-snug transition-colors", i === active ? "text-blue" : "text-muted-foreground")}>
                    {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* active stage detail */}
          <motion.div key={active} initial={reduce ? undefined : { opacity: 0, y: 14 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto mt-14 max-w-3xl">
            <GlassCard className="flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
              <IconNode icon={stage.icon} size="lg" active />
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-blue">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.desc}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {stage.caps.map((cap) => (
                    <span key={cap} className="rounded-full bg-blue/5 px-3 py-1 text-xs font-medium text-blue">{cap}</span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </Container>
      </div>

      {/* mobile vertical timeline */}
      <div className="py-20 lg:hidden">
        <Container>
          <Head eyebrow="Năng lực chuyển đổi số" title="Từ chiến lược đến vận hành số" />
          <ol className="relative mt-12 space-y-6 before:absolute before:left-6 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-blue/15">
            {C.STAGES.map((s, i) => (
              <Reveal as="li" key={s.title} className="relative flex gap-4 pl-0">
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-background text-sm font-semibold text-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <GlassCard className="flex-1 p-5">
                  <h3 className="text-sm font-semibold tracking-tight text-blue">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </GlassCard>
              </Reveal>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  );
}

/* ============================================================
   5. ENTERPRISE PLATFORM — 5-tier perspective stack (bottom-up)
   ============================================================ */
export function EnterprisePlatform() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);
  return (
    <AmbientSection id="platform" soft>
      <Head
        eyebrow="Enterprise Platform"
        title="Kết nối hệ thống – Hợp nhất dữ liệu – Vận hành xuyên suốt"
        subtitle="Kiến trúc năm lớp giúp doanh nghiệp kết nối trải nghiệm, ứng dụng, AI, dữ liệu và hạ tầng."
      />

      {/* desktop perspective stack */}
      <div className="mt-16 hidden [perspective:1600px] lg:block">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 [transform-style:preserve-3d] [transform:rotateX(24deg)]">
          {C.LAYERS.map((l, i) => (
            <motion.div
              key={l.n}
              initial={reduce ? undefined : { opacity: 0, y: 40, rotateX: -8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, delay: (C.LAYERS.length - 1 - i) * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { translateY: -6, translateZ: 40 }}
              className="group relative grid grid-cols-[minmax(0,15rem)_1fr] items-center gap-5 overflow-hidden rounded-2xl border border-blue/14 bg-card/85 p-5 shadow-[0_24px_50px_-30px_oklch(0.6_0.19_255)] backdrop-blur transition-colors duration-300 hover:border-cyan/45"
            >
              {/* left accent bar */}
              <span aria-hidden className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-full bg-gradient-to-b from-blue to-cyan opacity-55 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <span className="text-3xl font-semibold text-blue/35 transition-colors duration-300 group-hover:text-blue/70">{l.n}</span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">{l.title}</h3>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
              </div>
              <div className="relative flex flex-wrap gap-2">
                {l.items.map((it) => (
                  <span key={it.label} className="inline-flex items-center gap-2 rounded-xl border border-blue/12 bg-background px-3 py-2 text-sm font-medium transition-colors duration-300 group-hover:border-cyan/30">
                    <it.icon className="size-4 text-blue" /> {it.label}
                  </span>
                ))}
              </div>

              {/* lit platform base (the C01-05 glowing edge) */}
              <span aria-hidden className="pointer-events-none absolute inset-x-5 bottom-[7px] h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
              <span aria-hidden className="pointer-events-none absolute inset-x-8 bottom-0 h-2.5 rounded-full bg-cyan/40 opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-90" />
              {/* sweeping data light travelling across the base */}
              {reduce ? null : (
                <span aria-hidden className="pointer-events-none absolute inset-x-5 bottom-[7px] h-px overflow-hidden">
                  <span
                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white to-transparent animate-sweep"
                    style={{ animationDelay: `${i * 0.6}s` }}
                  />
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* mobile accordion */}
      <div className="mt-12 flex flex-col gap-3 lg:hidden">
        {C.LAYERS.map((l, i) => (
          <div key={l.n} className="glass-card overflow-hidden rounded-2xl">
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
              <span className="text-2xl font-semibold text-blue/35">{l.n}</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold tracking-tight">{l.title}</h3>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </div>
              <span className={cn("text-blue transition-transform", open === i && "rotate-180")}>▾</span>
            </button>
            {open === i ? (
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                {l.items.map((it) => (
                  <span key={it.label} className="inline-flex items-center gap-2 rounded-xl border border-blue/12 bg-background px-3 py-1.5 text-sm font-medium">
                    <it.icon className="size-4 text-blue" /> {it.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue to-cyan px-6 py-5 text-center text-sm font-semibold text-white sm:text-base">
          Dữ liệu thống nhất — Hệ thống kết nối — Vận hành thông minh
        </div>
      </Reveal>
    </AmbientSection>
  );
}

/* ============================================================
   6. BUSINESS VALUE — radial orbit around XTECH VALUE
   ============================================================ */
export function BusinessValue() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(-1);
  const N = C.VALUES.length;
  return (
    <AmbientSection id="value">
      <Head
        eyebrow="Business Value"
        title="Công nghệ tạo ra kết quả kinh doanh"
        subtitle="Giải pháp thông minh — Vận hành hiệu quả — Tăng trưởng bền vững."
      />

      {/* desktop orbit */}
      <div className="relative mx-auto mt-16 hidden aspect-square max-w-2xl lg:block" onMouseLeave={() => setHover(-1)}>
        <svg aria-hidden viewBox="0 0 1000 1000" className="absolute inset-0 size-full">
          <ConnectorDefs />
          <circle cx={500} cy={500} r={330} fill="none" stroke="oklch(0.6 0.19 255 / 0.12)" strokeWidth={1} />
          {C.VALUES.map((_, i) => {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            const x = 500 + Math.cos(a) * 330;
            const y = 500 + Math.sin(a) * 330;
            return (
              <line key={i} x1={500} y1={500} x2={x} y2={y} stroke="url(#cyanGrad)" strokeWidth={hover === i ? 2.4 : 1.2} strokeDasharray="4 6" className="transition-all" />
            );
          })}
          <circle cx={500} cy={500} r={6} className="fill-cyan" />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HubCore label="XTECH" sub="Value" />
        </div>

        {C.VALUES.map((v, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(a) * 33;
          const top = 50 + Math.sin(a) * 33;
          return (
            <div
              key={v.title}
              className="absolute w-52 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              tabIndex={0}
            >
              <div className={cn("rounded-2xl border p-4 text-center transition-all duration-300", hover === i ? "glass-card scale-105 border-blue/25" : "border-blue/12 bg-card/70 backdrop-blur")}>
                <div className="flex justify-center">
                  <IconNode icon={v.icon} size="sm" active={hover === i} />
                </div>
                <h3 className="mt-2 text-sm font-semibold tracking-tight">{v.title}</h3>
                <motion.div initial={false} animate={{ height: hover === i ? "auto" : 0, opacity: hover === i ? 1 : 0 }} className="overflow-hidden">
                  <p className="mt-1 text-xs text-muted-foreground">{v.desc}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {v.outcomes.map((o) => (
                      <span key={o} className="rounded-full bg-blue/5 px-2 py-0.5 text-[10px] font-medium text-blue">{o}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* mobile card list */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
        {C.VALUES.map((v) => (
          <Reveal key={v.title}>
            <GlassCard className="h-full p-6">
              <IconNode icon={v.icon} size="sm" />
              <h3 className="mt-3 text-base font-semibold tracking-tight">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.outcomes.map((o) => (
                  <span key={o} className="rounded-full bg-blue/5 px-2.5 py-0.5 text-xs font-medium text-blue">{o}</span>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </AmbientSection>
  );
}

/* ============================================================
   7. DELIVERY MODEL — center hub + 4 directions + capability ring
   ============================================================ */
const DIRS = [
  { x: 0.5, y: 0.13 },
  { x: 0.87, y: 0.5 },
  { x: 0.5, y: 0.87 },
  { x: 0.13, y: 0.5 },
];
export function DeliveryModel() {
  const reduce = useReducedMotion();
  return (
    <AmbientSection id="delivery" soft>
      <Head
        eyebrow="Delivery Model"
        title="Triển khai phù hợp với mọi mô hình doanh nghiệp"
        subtitle="Linh hoạt với SaaS, private cloud, on-premise và hybrid, chủ động dữ liệu và sẵn sàng mở rộng."
      />

      {/* desktop center + 4 dirs */}
      <div className="relative mx-auto mt-16 hidden aspect-square max-w-xl lg:block">
        <svg aria-hidden viewBox="0 0 1000 1000" className="absolute inset-0 size-full">
          <ConnectorDefs />
          {DIRS.map((p, i) => (
            <line key={i} x1={500} y1={500} x2={p.x * 1000} y2={p.y * 1000} stroke="url(#cyanGrad)" strokeWidth={1.4} strokeDasharray="5 7" />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HubCore label="Delivery" sub="XTECH Model" />
        </div>
        {C.DEPLOY.map((d, i) => (
          <motion.div
            key={d.title}
            className="absolute w-52 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${DIRS[i]!.x * 100}%`, top: `${DIRS[i]!.y * 100}%` }}
            initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            whileHover={reduce ? undefined : { translateY: -4 }}
          >
            <GlassCard className="p-5 text-center">
              <div className="flex justify-center">
                <IconNode icon={d.icon} />
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-blue">{d.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* mobile stacked */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
        {C.DEPLOY.map((d) => (
          <Reveal key={d.title}>
            <GlassCard className="h-full p-6 text-center">
              <div className="flex justify-center"><IconNode icon={d.icon} /></div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-blue">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {/* capability ring */}
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {C.DELIVERY.map((d) => <Chip key={d.label} icon={d.icon} label={d.label} />)}
        </div>
      </Reveal>
    </AmbientSection>
  );
}

/* ============================================================
   8. FUTURE VISION — stakeholders + scroll journey + CTA
   ============================================================ */
export function FutureVision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <AmbientSection id="vision">
      <Head
        eyebrow="Đồng hành dài hạn"
        title="Đồng hành trong hành trình chuyển đổi số"
        subtitle="Cùng đối tác — Kiến tạo giá trị — Dẫn lối tương lai."
      />

      {/* stakeholders */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {C.STAKEHOLDERS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <GlassCard className="h-full p-6">
              <IconNode icon={s.icon} size="sm" />
              <h3 className="mt-4 text-sm font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {/* journey with scroll progress line */}
      <div ref={ref} className="relative mt-8">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-blue/12 lg:left-1/2 lg:-translate-x-1/2" />
        <motion.div className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue to-cyan lg:left-1/2 lg:-translate-x-1/2" style={{ height: fill }} />
        <div className="space-y-6">
          {C.ROADMAP.map((r, i) => (
            <Reveal key={r.n} className={cn("relative flex gap-5 pl-0", i % 2 === 1 && "lg:flex-row-reverse")}>
              <div className="relative z-10 flex lg:w-1/2 lg:justify-end lg:data-[right=true]:justify-start" data-right={i % 2 === 1}>
                <GlassCard className={cn("ml-16 flex-1 p-5 lg:ml-0 lg:max-w-sm", i % 2 === 1 && "lg:ml-0")}>
                  <div className="flex items-center gap-3">
                    <IconNode icon={r.icon} size="sm" />
                    <span className="font-mono text-sm font-semibold text-blue/50">{r.n}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold tracking-tight">{r.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
                </GlassCard>
              </div>
              <span className="absolute left-6 top-6 z-10 size-3 -translate-x-1/2 rounded-full bg-cyan node-glow lg:left-1/2" />
              <div className="hidden lg:block lg:w-1/2" />
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal delay={0.15}>
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-blue to-cyan p-8 text-center text-white md:p-12">
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sẵn sàng bắt đầu hành trình chuyển đổi số?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">Đội ngũ XTECH sẵn sàng đồng hành cùng doanh nghiệp của bạn từ chiến lược đến vận hành.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/lien-he" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-blue transition hover:bg-white/90">
              Trao đổi với chuyên gia <ArrowRight className="size-4" />
            </Link>
            <Link href="/dat-lich-demo" className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
              Yêu cầu tư vấn
            </Link>
          </div>
        </div>
      </Reveal>
    </AmbientSection>
  );
}
