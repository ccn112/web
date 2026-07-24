/**
 * Block contracts for the X page builder.
 *
 * These mirror the Payload `blocks` field definitions in `apps/cms/src/blocks` and the shapes
 * found in `seed/pages.json`. The frontend renderer in `@x/content-blocks` consumes this union.
 *
 * BaseBlock keys (anchorId/theme/padding) come from docs/04_PAGE_BLOCKS.md and may be absent in
 * seed data (they default at render time).
 */

export type BlockTheme = 'light' | 'soft' | 'dark' | 'brand'
export type BlockPadding = 'compact' | 'normal' | 'large'

export interface BaseBlock {
  id?: string
  blockName?: string
  /** Stable id so the chatbot can deep-link to a section. */
  anchorId?: string
  theme?: BlockTheme
  padding?: BlockPadding
}

export interface CTALink {
  label: string
  href: string
}

/**
 * A populated Media upload. When a block references media and the page is fetched with depth >= 1,
 * Payload returns the full object (with a relative `url`); with depth 0 it is just the id string.
 */
export interface MediaResource {
  id: string
  url?: string
  alt?: string
  width?: number
  height?: number
}

/** A media field as it may appear in REST output: populated object or bare id (or null). */
export type MediaRef = MediaResource | string | null

/** 1. hero — exactly one H1 on the page. */
export interface HeroBlock extends BaseBlock {
  blockType: 'hero'
  eyebrow?: string
  /** Optional full-bleed hero background image (rendered behind content with an overlay). */
  background?: MediaRef
  title: string
  description?: string
  primaryCTA?: CTALink
  secondaryCTA?: CTALink
  illustration?: MediaRef
}

/** 2. richText — sanitized rich text (lexical JSON on the CMS side). */
export interface RichTextBlock extends BaseBlock {
  blockType: 'richText'
  title?: string
  content?: unknown
}

/** 3. featureGrid */
export interface FeatureGridBlock extends BaseBlock {
  blockType: 'featureGrid'
  title?: string
  intro?: string
  items: Array<{ title: string; description?: string; icon?: string }>
  illustration?: MediaRef
  /** Public path to an illustrative image (screenshot), rendered beside the grid
   * when no Media `illustration` is set. */
  imageSrc?: string
}

/** 4. productCards */
export interface ProductCardsBlock extends BaseBlock {
  blockType: 'productCards'
  title?: string
  items: Array<{ title: string; description?: string; href?: string }>
  illustration?: MediaRef
}

/** 5. solutionCards */
export interface SolutionCardsBlock extends BaseBlock {
  blockType: 'solutionCards'
  title?: string
  items: Array<{ title: string; description?: string; href?: string }>
}

/** 6. painPoints */
export interface PainPointsBlock extends BaseBlock {
  blockType: 'painPoints'
  title?: string
  items: Array<{ title: string; description?: string }>
}

/** 7. processTimeline — steps is a flat list of labels. */
export interface ProcessTimelineBlock extends BaseBlock {
  blockType: 'processTimeline'
  title?: string
  steps: string[]
}

/** 8. statistics */
export interface StatisticsBlock extends BaseBlock {
  blockType: 'statistics'
  title?: string
  items: Array<{ value: string; label: string }>
}

/** 9. screenshots */
export interface ScreenshotsBlock extends BaseBlock {
  blockType: 'screenshots'
  title?: string
  items: Array<{ caption?: string; alt: string; mediaId?: string }>
}

/** 10. architecture */
export interface ArchitectureBlock extends BaseBlock {
  blockType: 'architecture'
  title?: string
  layers: Array<{ name: string; items: string[] }>
  illustration?: MediaRef
}

/** 11. comparisonTable */
export interface ComparisonTableBlock extends BaseBlock {
  blockType: 'comparisonTable'
  title?: string
  columns: string[]
  rows: string[][]
}

/** 12. integration */
export interface IntegrationBlock extends BaseBlock {
  blockType: 'integration'
  title?: string
  items: Array<{ title: string; description?: string }>
}

/** 13. caseStudyCards */
export interface CaseStudyCardsBlock extends BaseBlock {
  blockType: 'caseStudyCards'
  title?: string
  items: Array<{ title: string; description?: string; href?: string }>
}

/** 14. faq */
export interface FaqBlock extends BaseBlock {
  blockType: 'faq'
  title?: string
  items: Array<{ question: string; answer: string }>
}

/** 15. relatedInsights */
export interface RelatedInsightsBlock extends BaseBlock {
  blockType: 'relatedInsights'
  title?: string
  items: Array<{ title: string; href: string }>
}

/** 16. deploymentCards */
export interface DeploymentCardsBlock extends BaseBlock {
  blockType: 'deploymentCards'
  title?: string
  items: Array<{ title: string; description?: string }>
  illustration?: MediaRef
}

/** 17. leadForm — references a Forms.code. */
export interface LeadFormBlock extends BaseBlock {
  blockType: 'leadForm'
  title?: string
  formCode: string
  fields?: string[]
  illustration?: MediaRef
}

/** 18. cta */
export interface CTABlock extends BaseBlock {
  blockType: 'cta'
  title: string
  description?: string
  primaryCTA?: CTALink
  secondaryCTA?: CTALink
  illustration?: MediaRef
}

export type Block =
  | HeroBlock
  | RichTextBlock
  | FeatureGridBlock
  | ProductCardsBlock
  | SolutionCardsBlock
  | PainPointsBlock
  | ProcessTimelineBlock
  | StatisticsBlock
  | ScreenshotsBlock
  | ArchitectureBlock
  | ComparisonTableBlock
  | IntegrationBlock
  | CaseStudyCardsBlock
  | FaqBlock
  | RelatedInsightsBlock
  | DeploymentCardsBlock
  | LeadFormBlock
  | CTABlock

export type BlockType = Block['blockType']

/** All 18 block slugs, canonical order (docs/04_PAGE_BLOCKS.md). */
export const BLOCK_TYPES: BlockType[] = [
  'hero',
  'richText',
  'featureGrid',
  'productCards',
  'solutionCards',
  'painPoints',
  'processTimeline',
  'statistics',
  'screenshots',
  'architecture',
  'comparisonTable',
  'integration',
  'caseStudyCards',
  'faq',
  'relatedInsights',
  'deploymentCards',
  'leadForm',
  'cta',
]
