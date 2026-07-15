'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import type { FaqBlock } from '@x/shared-types'
import { Section, SectionHeading } from './primitives'

export function Faq({ block }: { block: FaqBlock }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section block={block} containerClassName="max-w-3xl">
      <SectionHeading title={block.title} />
      <div className="divide-y divide-[var(--border)] overflow-hidden rounded-panel border border-border-subtle bg-surface">
        {block.items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
              >
                {item.question}
                <ChevronDown
                  className={clsx('h-5 w-5 shrink-0 text-primary transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
              <div
                className={clsx(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
