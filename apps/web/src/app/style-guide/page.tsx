import type { Metadata } from 'next'
import type { Block } from '@x/shared-types'
import { BlockRenderer, CTAButton } from '@x/content-blocks'

export const metadata: Metadata = { title: 'Style Guide — X Digital Skyline', robots: { index: false } }

const SWATCHES = [
  ['background', 'var(--bg)'],
  ['surface', 'var(--surface)'],
  ['surface-2', 'var(--surface-2)'],
  ['primary', 'var(--primary)'],
  ['accent', 'var(--accent)'],
  ['success', '#16a36a'],
  ['warning', '#f5a524'],
] as const

const sampleBlocks: Block[] = [
  {
    blockType: 'hero',
    eyebrow: 'X DIGITAL SKYLINE',
    title: 'Design system cho hệ sinh thái X',
    description: 'Tokens, typography và block tái sử dụng cho Corporate và 5 site sản phẩm.',
    primaryCTA: { label: 'Đặt lịch Demo', href: '/demo' },
    secondaryCTA: { label: 'Khám phá', href: '#' },
  },
  {
    blockType: 'featureGrid',
    title: 'Feature grid',
    items: [
      { title: 'Dữ liệu thống nhất', description: 'Một nguồn dữ liệu xuyên suốt.', icon: 'database' },
      { title: 'Quy trình liên thông', description: 'Giảm nhập liệu lặp lại.', icon: 'workflow' },
      { title: 'AI xuyên suốt', description: 'AI hỗ trợ toàn bộ vòng đời.', icon: 'sparkles' },
      { title: 'Triển khai linh hoạt', description: 'SaaS hoặc On-premise.', icon: 'cloud' },
    ],
  },
  {
    blockType: 'faq',
    title: 'FAQ',
    items: [
      { question: 'Có hỗ trợ On-premise?', answer: 'Có, X hỗ trợ SaaS, Private Cloud và On-premise.' },
      { question: 'Tích hợp hệ thống cũ?', answer: 'Tích hợp qua API hoặc middleware theo phạm vi.' },
    ],
  },
  {
    blockType: 'cta',
    title: 'Bắt đầu cùng X',
    description: 'Đăng ký buổi tư vấn để nhận đề xuất theo hiện trạng doanh nghiệp.',
    primaryCTA: { label: 'Đặt lịch tư vấn', href: '/lien-he' },
  },
]

export default function StyleGuide() {
  return (
    <div className="theme-dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Style Guide</p>
        <h1 className="mt-2 text-4xl font-extrabold">X Digital Skyline</h1>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Colors</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {SWATCHES.map(([name, value]) => (
              <div key={name} className="rounded-card border border-border-subtle p-3">
                <div className="h-16 w-full rounded-lg border border-border-subtle" style={{ background: value }} />
                <div className="mt-2 text-sm font-medium">{name}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Typography</h2>
          <div className="space-y-2 rounded-panel border border-border-subtle bg-surface p-6">
            <p className="text-4xl font-extrabold">Manrope — Heading</p>
            <p className="text-base text-muted">Inter — body text mẫu cho đoạn văn.</p>
            <p className="font-mono text-sm text-accent">Geist Mono — 1,248 · 24.8M · 76%</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Buttons</h2>
          <div className="flex gap-3">
            <CTAButton cta={{ label: 'Primary', href: '#' }} variant="primary" />
            <CTAButton cta={{ label: 'Secondary', href: '#' }} variant="secondary" />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">Blocks</h2>
          <div className="overflow-hidden rounded-panel border border-border-subtle">
            <BlockRenderer blocks={sampleBlocks} />
          </div>
        </section>
      </div>
    </div>
  )
}
