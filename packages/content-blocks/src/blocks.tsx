import clsx from 'clsx'
import { ArrowRight, Check } from 'lucide-react'
import type {
  ArchitectureBlock,
  ComparisonTableBlock,
  CTABlock,
  DeploymentCardsBlock,
  FeatureGridBlock,
  HeroBlock,
  IntegrationBlock,
  ProcessTimelineBlock,
  ProductCardsBlock,
  RelatedInsightsBlock,
} from '@x/shared-types'
import { resolveIcon } from './icons'
import { CTAButton, Section, SectionHeading, SkylineBackdrop } from './primitives'

export function Hero({ block }: { block: HeroBlock }) {
  return (
    <Section block={{ ...block, padding: block.padding ?? 'large' }} className="overflow-hidden">
      <SkylineBackdrop />
      <div className="relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6 xl:col-span-5">
          {block.eyebrow ? (
            <p className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {block.eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {block.title}
          </h1>
          {block.description ? (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{block.description}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {block.primaryCTA ? <CTAButton cta={block.primaryCTA} variant="primary" /> : null}
            {block.secondaryCTA ? <CTAButton cta={block.secondaryCTA} variant="secondary" /> : null}
          </div>
        </div>
        <div className="lg:col-span-6 xl:col-span-7">
          <HeroVisual />
        </div>
      </div>
    </Section>
  )
}

/** Abstract product-UI panel (device-frame feel) built from CSS, no full-bleed image. */
function HeroVisual() {
  return (
    <div className="relative rounded-hero border border-border-subtle bg-surface/70 p-4 shadow-2xl backdrop-blur-sm">
      <div className="rounded-panel border border-border-subtle bg-surface-2/60 p-5">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['1.248', '24.8M', '76%'].map((v, i) => (
            <div key={i} className="rounded-card border border-border-subtle bg-surface p-3">
              <div className="h-1.5 w-8 rounded bg-muted/30" />
              <div className="mt-2 font-mono text-lg font-bold text-foreground">{v}</div>
              <div className="mt-2 h-1 w-full rounded bg-primary/25" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-24 items-end gap-1.5 rounded-card border border-border-subtle bg-surface p-3">
          {[40, 55, 35, 70, 60, 85, 72, 95].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-accent/70" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeatureGrid({ block }: { block: FeatureGridBlock }) {
  return (
    <Section block={block}>
      <SectionHeading title={block.title} intro={block.intro} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {block.items.map((item, i) => {
          const Icon = resolveIcon(item.icon)
          return (
            <div
              key={i}
              className="rounded-card border border-border-subtle bg-surface p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              ) : null}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

function CardGrid({
  title,
  items,
}: {
  title?: string
  items: Array<{ title: string; description?: string; href?: string }>
}) {
  return (
    <>
      <SectionHeading title={title} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const inner = (
            <>
              <h3 className="flex items-center justify-between text-lg font-semibold">
                {item.title}
                {item.href ? <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" /> : null}
              </h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              ) : null}
            </>
          )
          const cls =
            'block rounded-card border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-primary/50'
          return item.href ? (
            <a key={i} href={item.href} className={cls}>
              {inner}
            </a>
          ) : (
            <div key={i} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>
    </>
  )
}

export function ProductCards({ block }: { block: ProductCardsBlock }) {
  return (
    <Section block={block}>
      <CardGrid title={block.title} items={block.items} />
    </Section>
  )
}

export function DeploymentCards({ block }: { block: DeploymentCardsBlock }) {
  return (
    <Section block={block}>
      <CardGrid title={block.title} items={block.items} />
    </Section>
  )
}

export function Integration({ block }: { block: IntegrationBlock }) {
  return (
    <Section block={block}>
      <CardGrid title={block.title} items={block.items} />
    </Section>
  )
}

export function ProcessTimeline({ block }: { block: ProcessTimelineBlock }) {
  return (
    <Section block={block}>
      <SectionHeading title={block.title} />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {block.steps.map((step, i) => (
          <li key={i} className="relative rounded-card border border-border-subtle bg-surface p-5">
            <span className="font-mono text-sm font-bold text-accent">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 font-semibold">{step}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Architecture({ block }: { block: ArchitectureBlock }) {
  return (
    <Section block={block}>
      <SectionHeading title={block.title} />
      <div className="space-y-3">
        {block.layers.map((layer, i) => (
          <div
            key={i}
            className="rounded-panel border border-border-subtle bg-surface p-5 sm:flex sm:items-center sm:gap-6"
          >
            <div className="mb-3 shrink-0 font-semibold text-primary sm:mb-0 sm:w-48">{layer.name}</div>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((it, j) => (
                <span
                  key={j}
                  className="rounded-lg border border-border-subtle bg-surface-2 px-3 py-1.5 text-sm text-muted"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function ComparisonTable({ block }: { block: ComparisonTableBlock }) {
  // Rows may arrive as string[][] (contract) or as Payload's [{ cells: string[] }] (stored shape).
  const rows = (block.rows ?? []).map((row) =>
    Array.isArray(row) ? row : ((row as { cells?: string[] })?.cells ?? []),
  )
  return (
    <Section block={block}>
      <SectionHeading title={block.title} />
      <div className="overflow-x-auto rounded-panel border border-border-subtle">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-2">
              {block.columns.map((col, i) => (
                <th key={i} className="px-5 py-3 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border-subtle bg-surface">
                {row.map((cell, j) => (
                  <td key={j} className={clsx('px-5 py-3', j === 0 ? 'font-semibold' : 'text-muted')}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export function RelatedInsights({ block }: { block: RelatedInsightsBlock }) {
  return (
    <Section block={block}>
      <SectionHeading title={block.title} />
      <div className="grid gap-5 sm:grid-cols-3">
        {block.items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="group flex items-center justify-between rounded-card border border-border-subtle bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <span className="font-medium">{item.title}</span>
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        ))}
      </div>
    </Section>
  )
}

export function Cta({ block }: { block: CTABlock }) {
  return (
    <Section block={{ ...block, padding: block.padding ?? 'compact' }}>
      <div className="relative overflow-hidden rounded-hero border border-border-subtle bg-gradient-to-br from-primary/15 to-accent/10 px-6 py-12 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl text-2xl font-bold text-balance sm:text-3xl">{block.title}</h2>
        {block.description ? (
          <p className="mx-auto mt-4 max-w-xl text-muted">{block.description}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {block.primaryCTA ? <CTAButton cta={block.primaryCTA} variant="primary" /> : null}
          {block.secondaryCTA ? <CTAButton cta={block.secondaryCTA} variant="secondary" /> : null}
        </div>
      </div>
    </Section>
  )
}

/** Small check-list helper reused by a few blocks. */
export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}
