import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { BaseBlock, BlockPadding, BlockTheme, CTALink } from '@x/shared-types'

const paddingClass: Record<BlockPadding, string> = {
  compact: 'py-12 md:py-16',
  normal: 'py-12 md:py-20 lg:py-24',
  large: 'py-16 md:py-24 lg:py-32',
}

/** A themed, padded section wrapper with a max-width container and an optional anchor. */
export function Section({
  block,
  children,
  className,
  containerClassName,
}: {
  block: BaseBlock
  children: ReactNode
  className?: string
  containerClassName?: string
}) {
  const theme: BlockTheme = block.theme ?? 'light'
  const padding: BlockPadding = block.padding ?? 'normal'
  return (
    <section
      id={block.anchorId || undefined}
      data-block-theme={theme}
      className={clsx('relative w-full', paddingClass[padding], className)}
    >
      <div className={clsx('mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({ title, intro }: { title?: string; intro?: string }) {
  if (!title && !intro) return null
  return (
    <div className="mb-10 max-w-3xl">
      {title ? (
        <h2 className="text-2xl font-bold text-balance sm:text-3xl lg:text-4xl">{title}</h2>
      ) : null}
      {intro ? <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p> : null}
    </div>
  )
}

export type CTAVariant = 'primary' | 'secondary'

export function CTAButton({
  cta,
  variant = 'primary',
  className,
}: {
  cta: CTALink
  variant?: CTAVariant
  className?: string
}) {
  return (
    <a
      href={cta.href}
      data-cta={variant}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200',
        variant === 'primary'
          ? 'bg-primary text-white hover:opacity-90'
          : 'border border-border-subtle bg-surface/60 text-foreground hover:bg-surface',
        className,
      )}
    >
      {cta.label}
    </a>
  )
}

/** Decorative skyline / data-flow backdrop for hero sections (CSS only). */
export function SkylineBackdrop() {
  return (
    <div className="skyline-backdrop" aria-hidden="true">
      <svg
        className="absolute right-0 bottom-0 h-[70%] w-full opacity-60"
        viewBox="0 0 600 300"
        preserveAspectRatio="xMaxYMax slice"
        fill="none"
      >
        <g stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1">
          {Array.from({ length: 28 }).map((_, i) => {
            const x = 40 + i * 20
            const h = 40 + ((i * 53) % 190)
            return (
              <g key={i}>
                <rect x={x} y={300 - h} width="10" height={h} fill="var(--primary)" fillOpacity="0.18" />
                <line x1={x + 5} y1={300 - h} x2={x + 5} y2={20 + (i % 5) * 12} />
                <circle cx={x + 5} cy={20 + (i % 5) * 12} r="1.6" fill="var(--accent)" />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
