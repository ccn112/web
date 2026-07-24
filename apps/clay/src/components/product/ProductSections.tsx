"use client";

/**
 * SET C03 — Product Ecosystem section renderer. Dispatches each product section
 * by `layout` (orbit / hub-spoke / stack / journey / showcase), reusing the
 * home + about visual kit. Content is a typed module for now (CMS-driven later).
 * Zig-zag SplitLayout + mobile image-first, compact sections, gold accents.
 */

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wallet,
  Banknote,
  ArrowRightLeft,
  ReceiptText,
  GitCompare,
  PiggyBank,
  Bell,
  LineChart,
  FileText,
  Stamp,
  Scale,
  Target,
  ShoppingCart,
  FileCheck,
  Truck,
  Package,
  Boxes,
  Warehouse,
  Wrench,
  FolderKanban,
  ClipboardList,
  AlertTriangle,
  Layers,
  Building2,
  Users,
  Megaphone,
  Filter,
  UserSearch,
  Gauge,
  Share2,
  KanbanSquare,
  Grid3x3,
  KeyRound,
  ClipboardCheck,
  Headset,
  Smartphone,
  Bot,
  BrainCircuit,
  Workflow,
  ShieldCheck,
  ScanLine,
  FileSearch,
  MessagesSquare,
  Radar as RadarIcon,
  Network,
  Cpu,
  Zap,
  Car,
  Bike,
  BellRing,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSectionItem } from "@x/shared-types";
import { Reveal, AmbientSection, GlassCard } from "@/components/corporate/about-kit";
import { SectionHead, HomeIcon, IconTile, SplitLayout } from "@/components/home/kit";
import { OrbitDiagram, type OrbitNode } from "@/components/home/visuals";
import { C02Timeline, C02OutcomeStrip } from "@/components/services/c02/kit";
import { EvolutionFlow, Cycle } from "@/components/services/c02/visuals";
import type { SectionTitle } from "@/data/home-content";
import {
  productSectionsForRoute,
  type ProductSection,
  type ProductItem,
} from "@/data/product-content";

function head(s: ProductSection): SectionTitle {
  return { eyebrow: s.eyebrow, lines: [s.title], subtitle: s.subtitle, highlight: s.highlight };
}

/** Feature-row icons (lucide) keyed by a short name set in product-content.
 * Falls back to a check when unknown/absent so nothing ever breaks. */
const FEATURE_ICONS: Record<string, LucideIcon> = {
  revenue: TrendingUp, wallet: Wallet, cash: Banknote, flow: ArrowRightLeft,
  receipt: ReceiptText, compare: GitCompare, profit: PiggyBank, bell: Bell,
  chart: LineChart, doc: FileText, stamp: Stamp, scale: Scale, target: Target,
  cart: ShoppingCart, filecheck: FileCheck, truck: Truck, package: Package,
  boxes: Boxes, warehouse: Warehouse, wrench: Wrench, project: FolderKanban,
  clipboard: ClipboardList, alert: AlertTriangle, layers: Layers,
  building: Building2, users: Users, megaphone: Megaphone, funnel: Filter,
  leadsearch: UserSearch, gauge: Gauge, distribute: Share2, pipeline: KanbanSquare,
  matrix: Grid3x3, key: KeyRound, approve: ClipboardCheck, care: Headset,
  mobile: Smartphone, bot: Bot, brain: BrainCircuit, workflow: Workflow,
  shield: ShieldCheck, scan: ScanLine, search: FileSearch, chat: MessagesSquare,
  radar: RadarIcon, network: Network, cpu: Cpu, energy: Zap, car: Car,
  bike: Bike, ring: BellRing,
};

function FeatureIcon({ name }: { name?: string }) {
  const Icon = name ? FEATURE_ICONS[name] : undefined;
  return Icon ? <Icon className="size-4" strokeWidth={1.9} /> : <Check className="size-4" />;
}

/** Map product items → the ServiceSectionItem shape the C02 visuals expect. */
function toServiceItems(items: ProductItem[]): ServiceSectionItem[] {
  return items.map((it, k) => ({
    itemId: it.id,
    order: k + 1,
    title: it.title,
    description: it.description,
    icon: it.icon,
  }));
}

function GoldCTA({ cta }: { cta?: { label: string; href: string } }) {
  if (!cta) return null;
  return (
    <div className="mt-8 flex justify-center">
      <a
        href={cta.href}
        className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_12px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
      >
        {cta.label}
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function ChipRow({ chips, label }: { chips?: string[]; label?: string }) {
  if (!chips?.length) return null;
  return (
    <Reveal delay={0.05}>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {label ? <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-blue/60">{label}</span> : null}
        {chips.map((c) => (
          <span key={c} className="rounded-full border border-blue/15 bg-card/70 px-3 py-1.5 text-xs font-semibold text-blue backdrop-blur">
            {c}
          </span>
        ))}
      </div>
    </Reveal>
  );
}

function ItemCard({ item, index, number }: { item: ProductItem; index: number; number?: number }) {
  const inner = (
    <>
      <IconTile name={item.icon} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {number ? <span className="text-xs font-bold text-cyan">{String(number).padStart(2, "0")}</span> : null}
          <h3 className="text-base font-semibold tracking-tight text-blue">{item.title}</h3>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        {item.badges?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.badges.map((b) => (
              <span key={b} className="rounded-full border border-blue/12 bg-blue/5 px-2 py-0.5 text-[11px] font-semibold text-blue">{b}</span>
            ))}
          </div>
        ) : null}
      </div>
      {item.href ? <ArrowRight className="ml-auto size-4 shrink-0 self-center text-blue/40 transition group-hover:translate-x-0.5 group-hover:text-gold" /> : null}
    </>
  );
  const cls = "group flex items-start gap-4 rounded-2xl border border-blue/12 bg-card/70 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-gold/45";
  return (
    <Reveal delay={(index % 6) * 0.06}>
      {item.href ? <a href={item.href} className={cls}>{inner}</a> : <div className={cls}>{inner}</div>}
    </Reveal>
  );
}

/* ---- orbit / hub-spoke / visual-left|right: list + orbit diagram ---- */
function OrbitLayout({ s, i, numbered, side }: { s: ProductSection; i: number; numbered?: boolean; side?: "left" | "right" }) {
  // Cap the orbit at 6 nodes so labels don't collide; the list still shows all.
  const nodes: OrbitNode[] = s.items.slice(0, 6).map((it, k) => ({ icon: it.icon, label: it.title, number: numbered ? k + 1 : undefined }));
  return (
    <>
      <SplitLayout
        imageSide={side ?? (i % 2 === 0 ? "right" : "left")}
        visual={<Reveal><OrbitDiagram nodes={nodes} hubLabel={s.eyebrow} floor={false} /></Reveal>}
      >
        <div className="grid gap-3">
          {s.items.map((it, k) => (
            <ItemCard key={it.id} item={it} index={k} number={numbered ? k + 1 : undefined} />
          ))}
        </div>
      </SplitLayout>
      <ChipRow chips={s.platformChips} label="Nền tảng dùng chung" />
      <GoldCTA cta={s.cta} />
    </>
  );
}

/* ---- layerstack: 3D perspective stack (adapted from /ve-x EnterprisePlatform):
   each product item is a lit layer with a sweeping data light + hover lift.
   Best for architecture / multi-layer platform content. ---- */
function ProductLayerStack({ s }: { s: ProductSection }) {
  const reduce = useReducedMotion();
  const layers = s.items;
  return (
    <>
      {/* desktop perspective stack */}
      <div className="mt-14 hidden [perspective:1600px] lg:block">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 [transform-style:preserve-3d] [transform:rotateX(24deg)]">
          {layers.map((l, i) => (
            <motion.div
              key={l.id}
              initial={reduce ? undefined : { opacity: 0, y: 40, rotateX: -8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, delay: (layers.length - 1 - i) * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { translateY: -6, translateZ: 40 }}
              className="group relative grid grid-cols-[minmax(0,3rem)_auto_1fr] items-center gap-4 overflow-hidden rounded-2xl border border-blue/14 bg-card/85 p-5 shadow-[0_24px_50px_-30px_oklch(0.6_0.19_255)] backdrop-blur transition-colors duration-300 hover:border-cyan/45"
            >
              <span aria-hidden className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-full bg-gradient-to-b from-blue to-cyan opacity-55 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="text-3xl font-semibold text-blue/35 transition-colors duration-300 group-hover:text-blue/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <IconTile name={l.icon} className="size-11" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold tracking-tight text-blue">{l.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
              <span aria-hidden className="pointer-events-none absolute inset-x-5 bottom-[7px] h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
              <span aria-hidden className="pointer-events-none absolute inset-x-8 bottom-0 h-2.5 rounded-full bg-cyan/40 opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-90" />
              {reduce ? null : (
                <span aria-hidden className="pointer-events-none absolute inset-x-5 bottom-[7px] h-px overflow-hidden">
                  <span className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white to-transparent animate-sweep" style={{ animationDelay: `${i * 0.6}s` }} />
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {/* mobile simple stack */}
      <div className="mt-10 flex flex-col gap-3 lg:hidden">
        {layers.map((l, i) => (
          <Reveal key={l.id} delay={i * 0.05}>
            <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/80 p-4">
              <IconTile name={l.icon} className="size-10" />
              <div>
                <h3 className="text-sm font-semibold text-blue">{String(i + 1).padStart(2, "0")} · {l.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <GoldCTA cta={s.cta} />
    </>
  );
}

/* ---- gallery: responsive grid of screenshots + captions, each opens a
   full-screen lightbox slide (images are large, meant to be viewed big).
   For topics with many product shots (agents, industries, departments). ---- */
function ProductGallery({ s }: { s: ProductSection }) {
  const shots = s.gallery ?? [];
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % shots.length));
      else if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, shots.length]);

  if (!shots.length) return null;
  const cur = active !== null ? shots[active] : null;

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((g, k) => (
          <Reveal key={g.image} delay={(k % 3) * 0.06}>
            <button
              type="button"
              onClick={() => setActive(k)}
              className="group block h-full w-full overflow-hidden rounded-2xl border border-blue/12 bg-card/70 text-left shadow-[0_20px_50px_-38px_var(--accent-blue)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/45"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={g.image}
                  alt={g.title}
                  width={800}
                  height={600}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span aria-hidden className="absolute bottom-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </div>
              <span className="block p-4">
                <span className="block text-sm font-semibold tracking-tight text-blue">{g.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">{g.caption}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <GoldCTA cta={s.cta} />

      {/* Lightbox */}
      {open && cur ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cur.title}
          className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/90 sm:px-6">
            <span className="text-sm font-medium">{active! + 1} / {shots.length}</span>
            <button type="button" onClick={() => setActive(null)} aria-label="Đóng" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-16">
            <button
              type="button"
              aria-label="Ảnh trước"
              onClick={(e) => { e.stopPropagation(); setActive((i) => (i === null ? i : (i - 1 + shots.length) % shots.length)); }}
              className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
            >
              <ChevronLeft className="size-6" />
            </button>

            <figure className="flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <Image
                src={cur.image}
                alt={cur.title}
                width={1600}
                height={1200}
                sizes="90vw"
                className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl"
              />
              <figcaption className="mt-4 max-w-2xl text-center text-white/85">
                <span className="block text-base font-semibold">{cur.title}</span>
                <span className="mt-1 block text-sm text-white/70">{cur.caption}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              aria-label="Ảnh sau"
              onClick={(e) => { e.stopPropagation(); setActive((i) => (i === null ? i : (i + 1) % shots.length)); }}
              className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ---- showcase: capability card grid ---- */
function ShowcaseLayout({ s }: { s: ProductSection }) {
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.items.map((it, k) => (
          <Reveal key={it.id} delay={(k % 3) * 0.07}>
            <GlassCard className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/45">
              <IconTile name={it.icon} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-blue">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <GoldCTA cta={s.cta} />
    </>
  );
}

/* ---- stack: numbered perspective layers ---- */
function StackLayout({ s }: { s: ProductSection }) {
  return (
    <>
      <div className="mx-auto mt-8 max-w-3xl space-y-3 [perspective:1500px]">
        {s.items.map((it, k) => (
          <Reveal key={it.id} delay={k * 0.06}>
            <div
              className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-blue/15 bg-card/80 p-4 backdrop-blur shadow-[0_18px_44px_-32px_var(--accent-blue)]"
              style={{ transform: "rotateX(5deg)", transformOrigin: "center top" }}
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue to-cyan" />
              <span className="ml-1 text-xs font-bold text-cyan">{String(k + 1).padStart(2, "0")}</span>
              <IconTile name={it.icon} className="size-11" />
              <div>
                <h3 className="text-base font-semibold tracking-tight text-blue">{it.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <ChipRow chips={s.platformChips} />
      <GoldCTA cta={s.cta} />
    </>
  );
}

/* ---- journey: horizontal numbered flow + outcomes ---- */
function JourneyLayout({ s }: { s: ProductSection }) {
  return (
    <>
      {/* Desktop chevron flow */}
      <div className="mt-8 hidden items-stretch gap-2 md:flex">
        {s.items.map((it, k) => (
          <div key={it.id} className="flex flex-1 items-center">
            <Reveal delay={k * 0.08} className="flex-1">
              <div className="h-full rounded-2xl border border-blue/12 bg-card/80 p-4 text-center backdrop-blur">
                <span className="mx-auto flex size-11 items-center justify-center"><HomeIcon name={it.icon} size={30} /></span>
                <span className="mt-1 block text-xs font-bold text-cyan">{String(k + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-sm font-semibold tracking-tight text-blue">{it.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.description}</p>
              </div>
            </Reveal>
            {k < s.items.length - 1 ? <ArrowRight aria-hidden className="mx-1 size-5 shrink-0 text-cyan" /> : null}
          </div>
        ))}
      </div>
      {/* Mobile vertical */}
      <div className="mt-8 space-y-3 md:hidden">
        {s.items.map((it, k) => (
          <Reveal key={it.id} delay={k * 0.05}>
            <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/80 p-4">
              <HomeIcon name={it.icon} size={28} />
              <div>
                <h3 className="text-sm font-semibold text-blue">{String(k + 1).padStart(2, "0")} · {it.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {/* Outcomes */}
      {s.outcomes?.length ? (
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          {s.outcomes.map((o, k) => (
            <Reveal key={o.title} delay={k * 0.07}>
              <div className="flex items-start gap-3 rounded-2xl border border-blue/12 bg-card/60 p-4">
                <span className="icon-gold inline-flex size-11 items-center justify-center rounded-xl"><HomeIcon name={o.icon} size={24} /></span>
                <div>
                  <h4 className="text-sm font-semibold text-blue">{o.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{o.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}
      <GoldCTA cta={s.cta} />
    </>
  );
}

/* ---- illustration: real screenshot/dashboard + a balanced "highlights" panel
   (zig-zag). The left panel is a full-height glass card with numbered feature
   rows + a decorative tech accent, so it no longer floats unbalanced beside the
   tall dashboard image. ---- */
function IllustrationLayout({ s, i }: { s: ProductSection; i: number }) {
  const visual = s.image ? (
    <Reveal>
      <div className="group relative">
        {/* soft brand glow behind the frame for a premium, tech feel */}
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-tr from-blue/20 via-cyan/10 to-violet/20 opacity-60 blur-2xl transition duration-500 group-hover:opacity-90"
        />
        <div className="relative overflow-hidden rounded-2xl border border-blue/15 bg-card/70 shadow-[0_28px_70px_-40px_var(--accent-blue)] transition duration-500 group-hover:-translate-y-1">
          <Image
            src={s.image}
            alt={s.title}
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="h-auto w-full object-cover"
          />
          {/* sheen sweep */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </Reveal>
  ) : null;
  return (
    <div className="mt-8">
      <SplitLayout visual={visual} imageSide={i % 2 === 0 ? "right" : "left"}>
        {s.features?.length || s.bullets?.length ? (
          <Reveal>
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-blue/12 bg-card/60 p-6 backdrop-blur md:p-8">
              {/* left accent rail */}
              <span aria-hidden className="absolute inset-y-6 left-0 w-1 rounded-full bg-gradient-to-b from-blue via-cyan to-transparent" />
              <span aria-hidden className="absolute inset-0 -z-10 bg-grid-tech opacity-40 mask-fade-b" />
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue/70">
                <span className="size-1.5 rounded-full bg-gold" />
                Điểm nổi bật
              </p>
              {s.panelNote ? (
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.panelNote}</p>
              ) : null}

              {s.features?.length ? (
                <ul className="mt-4 flex flex-col divide-y divide-blue/10">
                  {s.features.map((f, k) => (
                    <li key={f.label} className="group flex items-start gap-3.5 py-3.5">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue/15 bg-gradient-to-br from-blue/12 to-cyan/8 text-blue transition duration-300 group-hover:border-gold/45 group-hover:from-gold/15 group-hover:to-gold/5 group-hover:text-gold">
                        <FeatureIcon name={f.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold tracking-tight text-blue">{f.label}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{f.benefit}</p>
                      </div>
                      <span className="ml-auto pl-2 text-xs font-bold tabular-nums text-blue/25">
                        {String(k + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-4 flex flex-col divide-y divide-blue/10">
                  {s.bullets!.map((b, k) => (
                    <li key={b} className="group flex items-center gap-3.5 py-3">
                      <span className="icon-gold inline-flex size-8 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105">
                        <Check className="size-4" />
                      </span>
                      <span className="text-sm font-medium text-foreground/90">{b}</span>
                      <span className="ml-auto text-xs font-bold tabular-nums text-blue/30">
                        {String(k + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {s.cta ? (
                <div className="mt-6">
                  <a
                    href={s.cta.href}
                    className="btn-gold group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:brightness-105"
                  >
                    {s.cta.label}
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </a>
                </div>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <GoldCTA cta={s.cta} />
        )}
      </SplitLayout>
    </div>
  );
}

function SectionBody({ s, i }: { s: ProductSection; i: number }) {
  return (
    <>
      <SectionHead title={head(s)} />
      {s.layout === "orbit" ? <OrbitLayout s={s} i={i} /> : null}
      {s.layout === "hub-spoke" ? <OrbitLayout s={s} i={i} numbered /> : null}
      {s.layout === "visual-right" ? <OrbitLayout s={s} i={i} side="right" /> : null}
      {s.layout === "visual-left" ? <OrbitLayout s={s} i={i} side="left" numbered /> : null}
      {s.layout === "showcase" ? <ShowcaseLayout s={s} /> : null}
      {s.layout === "stack" ? <StackLayout s={s} /> : null}
      {s.layout === "journey" ? <JourneyLayout s={s} /> : null}
      {s.layout === "illustration" ? <IllustrationLayout s={s} i={i} /> : null}
      {s.layout === "timeline" ? (
        <div className="mt-4"><C02Timeline steps={toServiceItems(s.items)} /><GoldCTA cta={s.cta} /></div>
      ) : null}
      {s.layout === "evolution" ? (
        <div className="mt-8"><EvolutionFlow stages={toServiceItems(s.items)} /><GoldCTA cta={s.cta} /></div>
      ) : null}
      {s.layout === "cycle" ? (
        <div className="mt-8"><Cycle steps={toServiceItems(s.items)} centerLabel={s.centerLabel ?? s.eyebrow} /><GoldCTA cta={s.cta} /></div>
      ) : null}
      {s.layout === "layerstack" ? <ProductLayerStack s={s} /> : null}
      {s.layout === "gallery" ? <ProductGallery s={s} /> : null}
      {s.layout === "outcomes" && s.outcomes?.length ? (
        <div className="mt-8"><C02OutcomeStrip outcomes={s.outcomes.map((o, k) => ({ itemId: String(k), title: o.title, description: o.description, icon: o.icon }))} /><GoldCTA cta={s.cta} /></div>
      ) : null}
    </>
  );
}

/** First product section renders as a DARK hero (matches the /dich-vu standard:
 * a dark first-fold keeps the white logo/menu legible and gives every product
 * page a consistent premium opening). `theme-dark` flips design tokens so the
 * inner cards adopt dark surfaces automatically. */
function ProductHero({ s, i }: { s: ProductSection; i: number }) {
  return (
    <section
      id={s.sectionId}
      className="product-hero theme-dark relative isolate overflow-hidden bg-[oklch(0.17_0.03_265)] text-white"
    >
      {/* Semantic tech backdrop image (subtle, behind overlays) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/home/hero-ecosystem.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        {/* readability gradient over the image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(10,14,30,0.78) 0%, rgba(10,14,30,0.62) 45%, rgba(10,14,30,0.9) 100%)",
          }}
        />
      </div>
      {/* Aurora glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
        <div className="absolute -right-40 top-10 size-[34rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
        <div className="absolute bottom-[-12rem] left-1/3 size-[30rem] rounded-full bg-violet opacity-20 blur-[120px] animate-aurora [animation-delay:6s]" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.14] mask-fade-b" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-32 pb-20 md:px-6 md:pt-40 md:pb-24">
        <SectionBody s={s} i={i} />
      </div>
    </section>
  );
}

function SectionRenderer({ s, i }: { s: ProductSection; i: number }) {
  if (i === 0) return <ProductHero s={s} i={i} />;
  return (
    <AmbientSection id={s.sectionId} soft={i % 2 === 1} city={s.layout === "stack"} compact>
      <SectionBody s={s} i={i} />
    </AmbientSection>
  );
}

export function ProductSections({ route }: { route: string }) {
  const sections = productSectionsForRoute(route);
  if (!sections.length) return null;
  return (
    <>
      {sections.map((s, i) => (
        <SectionRenderer key={s.sectionId} s={s} i={i} />
      ))}
    </>
  );
}
