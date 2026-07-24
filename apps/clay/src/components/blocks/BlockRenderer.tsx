import type { ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Building2,
  Boxes,
  Workflow,
  Cpu,
  Users,
  Wallet,
  Rocket,
  Plug,
  Gauge,
  LineChart,
  Layers,
  icons as LucideIcons,
  type LucideIcon,
} from "lucide-react";
import type { Block, MediaRef } from "@x/shared-types";
import { Container, SectionHeading, accentClasses } from "@/components/primitives";
import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "./FaqAccordion";
import { LeadFormBlock } from "./LeadFormBlock";
import { HeroBackdrop } from "./HeroBackdrop";
import { ImageZoom } from "@/components/ImageZoom";
import { cn } from "@/lib/utils";

export type RenderContext = { siteCode?: string; pageId?: string };

/* -------- icon resolver (CMS icon strings are free-form) -------- */
const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  security: ShieldCheck,
  chart: BarChart3,
  analytics: BarChart3,
  building: Building2,
  property: Building2,
  box: Boxes,
  product: Boxes,
  workflow: Workflow,
  process: Workflow,
  ai: Cpu,
  cpu: Cpu,
  users: Users,
  crm: Users,
  finance: Wallet,
  wallet: Wallet,
  rocket: Rocket,
  deploy: Rocket,
  integration: Plug,
  plug: Plug,
  performance: Gauge,
  gauge: Gauge,
  report: LineChart,
  layers: Layers,
};
/** kebab/snake -> PascalCase, e.g. "bar-chart-3" -> "BarChart3" (lucide's export key). */
function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
function resolveIcon(name?: string): LucideIcon {
  if (!name) return Sparkles;
  // 1) semantic aliases (shield, chart, crm, ...). 2) real lucide names (bar-chart-3, cloud, ...).
  const alias = ICONS[name.toLowerCase()];
  if (alias) return alias;
  const byName = (LucideIcons as Record<string, LucideIcon>)[toPascalCase(name)];
  return byName ?? Sparkles;
}

const ACCENTS = ["blue", "cyan", "violet"] as const;
const accentAt = (i: number) => ACCENTS[i % ACCENTS.length]!;

/* -------- section shell -------- */
function Section({
  id,
  children,
  soft,
  className,
}: {
  id?: string;
  children: ReactNode;
  soft?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-28", soft && "border-y border-border bg-card", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

/* -------- CTA link helpers -------- */
type CTALink = { label: string; href: string };
function PrimaryCTA({ cta }: { cta: CTALink }) {
  return (
    <a
      href={cta.href}
      className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_10px_30px_-12px_var(--accent-gold)] transition hover:brightness-105"
    >
      {cta.label}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}
function SecondaryCTA({ cta }: { cta: CTALink }) {
  return (
    <a
      href={cta.href}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition hover:bg-accent"
    >
      {cta.label}
    </a>
  );
}

/* -------- illustration (CMS Media upload) -------- */
const CMS_BASE = (
  process.env.NEXT_PUBLIC_CMS_URL ??
  process.env.CMS_URL ??
  ""
).replace(/\/$/, "");

/** Resolve a block's `illustration` (populated Media at depth>=1) to an absolute URL + alt. */
function resolveIllustration(
  ref?: MediaRef,
): { src: string; alt: string; width?: number; height?: number } | null {
  if (!ref || typeof ref === "string") return null; // bare id / unset -> nothing to render
  const url = ref.url;
  if (!url) return null;
  const src = /^https?:\/\//.test(url) ? url : `${CMS_BASE}${url}`;
  return { src, alt: ref.alt ?? "", width: ref.width, height: ref.height };
}

/** Framed illustration with a soft brand glow, used in image-beside-content sections. */
function IllustrationImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Reveal className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-blue/15 via-violet/10 to-cyan/15 blur-3xl"
      />
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_90px_-50px_rgba(30,40,120,0.45)]">
        {/* Click to view full-screen (default for content illustrations). */}
        <ImageZoom src={src} alt={alt} caption={alt}>
          {width && height ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 1024px) 92vw, 620px"
              className="h-auto w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="h-auto w-full" loading="lazy" />
          )}
        </ImageZoom>
      </div>
    </Reveal>
  );
}

/* ===================== block components ===================== */

function HeroBlockView({ b }: { b: Extract<Block, { blockType: "hero" }> }) {
  const bg = resolveIllustration(b.background);
  return (
    <section
      id={b.anchorId ?? "top"}
      className="theme-dark relative isolate overflow-hidden bg-[oklch(0.15_0.02_275)] text-white"
    >
      {bg ? (
        <HeroBackdrop src={bg.src} />
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
            <div className="absolute -right-40 top-10 size-[34rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
            <div className="absolute bottom-[-12rem] left-1/3 size-[30rem] rounded-full bg-violet opacity-20 blur-[120px] animate-aurora [animation-delay:6s]" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.12] mask-fade-b" />
        </>
      )}
      <Container className="relative pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {b.eyebrow ? (
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-cyan" />
                {b.eyebrow}
              </span>
            </Reveal>
          ) : null}
          <Reveal delay={80}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4rem]">
              {b.title}
            </h1>
          </Reveal>
          {b.description ? (
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {b.description}
              </p>
            </Reveal>
          ) : null}
          {b.primaryCTA || b.secondaryCTA ? (
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                {b.primaryCTA ? <PrimaryCTA cta={b.primaryCTA} /> : null}
                {b.secondaryCTA ? <SecondaryCTA cta={b.secondaryCTA} /> : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function CtaBlockView({ b }: { b: Extract<Block, { blockType: "cta" }> }) {
  return (
    <Section id={b.anchorId}>
      <div className="relative overflow-hidden rounded-3xl brand-gradient px-8 py-16 text-center text-white md:px-16">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.12]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {b.title}
          </h2>
          {b.description ? (
            <p className="mt-4 text-base leading-relaxed text-white/85">{b.description}</p>
          ) : null}
          {b.primaryCTA || b.secondaryCTA ? (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              {b.primaryCTA ? (
                <a
                  href={b.primaryCTA.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0b1730] transition hover:bg-white/90"
                >
                  {b.primaryCTA.label}
                  <ArrowRight className="size-4" />
                </a>
              ) : null}
              {b.secondaryCTA ? (
                <a
                  href={b.secondaryCTA.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {b.secondaryCTA.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

function FeatureGridView({
  b,
  flip,
}: {
  b: Extract<Block, { blockType: "featureGrid" }>;
  flip?: boolean;
}) {
  const illo = resolveIllustration(b.illustration);
  // Label-only items (capability keywords, no description) render as compact chips;
  // richer items (title + description) render as icon cards.
  const chipMode = !!b.items?.length && b.items.every((it) => !it.description);

  const chips = (align: "left" | "center") => (
    <div className={cn("flex flex-wrap gap-2.5", align === "center" && "justify-center")}>
      {b.items?.map((item, i) => (
        <span
          key={i}
          className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
        >
          {item.title}
        </span>
      ))}
    </div>
  );

  const cards = (perRow: 2 | 3) => (
    <div
      className={cn(
        "grid gap-6",
        perRow === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {b.items?.map((item, i) => {
        const accent = accentClasses(accentAt(i));
        const Ico = resolveIcon(item.icon);
        return (
          <Reveal key={i} delay={(i % 3) * 90}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
              <div className={cn("flex size-12 items-center justify-center rounded-xl", accent.badge)}>
                <Ico className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </article>
          </Reveal>
        );
      })}
    </div>
  );

  if (illo || b.imageSrc) {
    const visual = illo ? (
      <IllustrationImage {...illo} className={flip ? "lg:order-2" : ""} />
    ) : (
      <Reveal className={cn("relative", flip ? "lg:order-2" : "")}>
        <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-blue/15 via-violet/10 to-cyan/15 blur-3xl" />
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_90px_-50px_rgba(30,40,120,0.45)]">
          <ImageZoom src={b.imageSrc!} alt={b.title ?? ""} caption={b.title} />
        </div>
      </Reveal>
    );
    return (
      <Section id={b.anchorId}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {visual}
          <div className={flip ? "lg:order-1" : ""}>
            {(b.title || b.intro) && (
              <SectionHeading title={b.title ?? ""} description={b.intro} align="left" />
            )}
            <div className="mt-8">{chipMode ? chips("left") : cards(2)}</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={b.anchorId}>
      {(b.title || b.intro) && (
        <SectionHeading title={b.title ?? ""} description={b.intro} />
      )}
      <div className="mt-14">{chipMode ? chips("center") : cards(3)}</div>
    </Section>
  );
}

function CardGridView({
  id,
  title,
  items,
  soft,
  illustration,
  flip,
}: {
  id?: string;
  title?: string;
  items?: Array<{ title: string; description?: string; href?: string }>;
  soft?: boolean;
  illustration?: MediaRef;
  flip?: boolean;
}) {
  const illo = resolveIllustration(illustration);
  const cards = (perRow: 2 | 3) => (
    <div
      className={cn(
        "grid gap-6",
        perRow === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {items?.map((item, i) => {
        const accent = accentClasses(accentAt(i));
        const inner = (
          <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.href ? (
              <span className={cn("mt-5 inline-flex items-center gap-1.5 text-sm font-medium", accent.text)}>
                Tìm hiểu thêm <ArrowRight className="size-4" />
              </span>
            ) : null}
          </article>
        );
        return (
          <Reveal key={i} delay={(i % 3) * 90}>
            {item.href ? (
              <a href={item.href} className="block h-full">
                {inner}
              </a>
            ) : (
              inner
            )}
          </Reveal>
        );
      })}
    </div>
  );

  if (illo) {
    return (
      <Section id={id} soft={soft}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <IllustrationImage {...illo} className={flip ? "lg:order-2" : ""} />
          <div className={flip ? "lg:order-1" : ""}>
            {title ? <SectionHeading title={title} align="left" /> : null}
            <div className="mt-8">{cards(2)}</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={id} soft={soft}>
      {title ? <SectionHeading title={title} /> : null}
      <div className="mt-14">{cards(3)}</div>
    </Section>
  );
}

function ProcessTimelineView({ b }: { b: Extract<Block, { blockType: "processTimeline" }> }) {
  return (
    <Section id={b.anchorId} soft>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {b.steps?.map((step, i) => (
          <Reveal as="li" key={i} delay={(i % 4) * 80}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
              <span className="flex size-9 items-center justify-center rounded-full brand-gradient text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-sm font-medium leading-relaxed">{step}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function StatisticsView({ b }: { b: Extract<Block, { blockType: "statistics" }> }) {
  return (
    <Section id={b.anchorId}>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {b.items?.map((s, i) => (
          <div key={i} className="text-center">
            <dt className="brand-gradient-text text-4xl font-semibold tracking-tight">
              {s.value}
            </dt>
            <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function IntegrationView({ b }: { b: Extract<Block, { blockType: "integration" }> }) {
  return (
    <Section id={b.anchorId} soft>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {b.items?.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5"
          >
            <Plug className="mt-0.5 size-5 shrink-0 text-cyan" />
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ComparisonTableView({ b }: { b: Extract<Block, { blockType: "comparisonTable" }> }) {
  return (
    <Section id={b.anchorId}>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              {b.columns?.map((c, i) => (
                <th
                  key={i}
                  className={cn(
                    "border-b border-border px-4 py-3 text-left font-semibold",
                    i === 0 && "text-muted-foreground",
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((b.rows ?? []) as Array<string[] | { cells?: string[] }>).map(
              (row, ri) => {
                // Seed shape is string[][]; the Payload REST shape is [{ cells: string[] }].
                const cells = Array.isArray(row) ? row : (row?.cells ?? []);
                return (
                  <tr key={ri} className="odd:bg-card">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="border-b border-border px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function ArchitectureView({
  b,
  flip,
}: {
  b: Extract<Block, { blockType: "architecture" }>;
  flip?: boolean;
}) {
  const illo = resolveIllustration(b.illustration);
  const layers = (
    <div className="flex flex-col gap-4">
      {b.layers?.map((layer, i) => (
        <div key={i} className="rounded-2xl border border-border bg-background p-6">
          <p className="text-sm font-semibold text-cyan">{layer.name}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {layer.items?.map((it, j) => (
              <span
                key={j}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium"
              >
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (illo) {
    return (
      <Section id={b.anchorId} soft>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <IllustrationImage {...illo} className={flip ? "lg:order-2" : ""} />
          <div className={flip ? "lg:order-1" : ""}>
            {b.title ? <SectionHeading title={b.title} align="left" /> : null}
            <div className="mt-8">{layers}</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={b.anchorId} soft>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <div className="mx-auto mt-12 max-w-3xl">{layers}</div>
    </Section>
  );
}

function RelatedInsightsView({ b }: { b: Extract<Block, { blockType: "relatedInsights" }> }) {
  return (
    <Section id={b.anchorId}>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {b.items?.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
          >
            <span className="text-sm font-medium">{item.title}</span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
          </a>
        ))}
      </div>
    </Section>
  );
}

function RichTextView({ b }: { b: Extract<Block, { blockType: "richText" }> }) {
  const text = typeof b.content === "string" ? b.content : null;
  if (!b.title && !text) return null;
  return (
    <Section id={b.anchorId}>
      <div className="mx-auto max-w-3xl">
        {b.title ? (
          <h2 className="text-3xl font-semibold tracking-tight">{b.title}</h2>
        ) : null}
        {text ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{text}</p>
        ) : null}
      </div>
    </Section>
  );
}

function PainPointsView({ b }: { b: Extract<Block, { blockType: "painPoints" }> }) {
  return (
    <Section id={b.anchorId}>
      {b.title ? <SectionHeading title={b.title} /> : null}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {b.items?.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-base font-semibold">{item.title}</p>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

function FaqView({ b }: { b: Extract<Block, { blockType: "faq" }> }) {
  return (
    <Section id={b.anchorId} soft>
      <SectionHeading title={b.title ?? "Câu hỏi thường gặp"} />
      <FaqAccordion items={b.items ?? []} />
    </Section>
  );
}

function LeadFormView({
  b,
  ctx,
  flip,
}: {
  b: Extract<Block, { blockType: "leadForm" }>;
  ctx: RenderContext;
  flip?: boolean;
}) {
  const illo = resolveIllustration(b.illustration);
  const form = (
    <LeadFormBlock
      formCode={b.formCode}
      fields={b.fields}
      siteCode={ctx.siteCode}
      pageId={ctx.pageId}
    />
  );

  if (illo) {
    return (
      <Section id={b.anchorId}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <IllustrationImage {...illo} className={flip ? "lg:order-2" : ""} />
          <div className={flip ? "lg:order-1" : ""}>
            {b.title ? <SectionHeading title={b.title} align="left" /> : null}
            <div className="mt-8">{form}</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={b.anchorId}>
      {b.title ? <SectionHeading title={b.title} /> : null}
      {form}
    </Section>
  );
}

/* ===================== renderer ===================== */
function renderBlock(block: Block, ctx: RenderContext, key: number): ReactNode {
  switch (block.blockType) {
    case "hero":
      return <HeroBlockView key={key} b={block} />;
    case "cta":
      return <CtaBlockView key={key} b={block} />;
    case "featureGrid":
      return <FeatureGridView key={key} b={block} flip={key % 2 === 1} />;
    case "productCards":
    case "solutionCards":
    case "caseStudyCards":
      return (
        <CardGridView
          key={key}
          id={block.anchorId}
          title={block.title}
          items={block.items}
          soft={block.blockType === "solutionCards"}
          illustration={"illustration" in block ? block.illustration : undefined}
          flip={key % 2 === 1}
        />
      );
    case "deploymentCards":
      return (
        <CardGridView
          key={key}
          id={block.anchorId}
          title={block.title}
          items={block.items}
          soft
          illustration={block.illustration}
          flip={key % 2 === 1}
        />
      );
    case "processTimeline":
      return <ProcessTimelineView key={key} b={block} />;
    case "statistics":
      return <StatisticsView key={key} b={block} />;
    case "integration":
      return <IntegrationView key={key} b={block} />;
    case "comparisonTable":
      return <ComparisonTableView key={key} b={block} />;
    case "architecture":
      return <ArchitectureView key={key} b={block} flip={key % 2 === 1} />;
    case "relatedInsights":
      return <RelatedInsightsView key={key} b={block} />;
    case "richText":
      return <RichTextView key={key} b={block} />;
    case "painPoints":
      return <PainPointsView key={key} b={block} />;
    case "faq":
      return <FaqView key={key} b={block} />;
    case "leadForm":
      return <LeadFormView key={key} b={block} ctx={ctx} flip={key % 2 === 1} />;
    default:
      // screenshots and any unknown/forward-compat block render nothing.
      return null;
  }
}

export function BlockRenderer({
  blocks,
  context = {},
}: {
  blocks: Block[];
  context?: RenderContext;
}) {
  return <>{blocks.map((b, i) => renderBlock(b, context, i))}</>;
}
