import type { Block } from '@x/shared-types'
import {
  Architecture,
  ComparisonTable,
  Cta,
  DeploymentCards,
  FeatureGrid,
  Hero,
  Integration,
  ProcessTimeline,
  ProductCards,
  RelatedInsights,
} from './blocks'
import { Faq } from './Faq'
import { LeadForm } from './LeadForm'

export interface RenderContext {
  siteCode?: string
  pageId?: string
  /** Map of formCode -> successMessage, for lead forms. */
  formMessages?: Record<string, string>
}

/** Renders one block by its blockType. Unknown blocks render nothing (forward-compatible). */
export function renderBlock(block: Block, ctx: RenderContext = {}, key?: number | string) {
  switch (block.blockType) {
    case 'hero':
      return <Hero key={key} block={block} />
    case 'featureGrid':
      return <FeatureGrid key={key} block={block} />
    case 'productCards':
    case 'solutionCards':
      return <ProductCards key={key} block={{ ...block, blockType: 'productCards' }} />
    case 'deploymentCards':
      return <DeploymentCards key={key} block={block} />
    case 'integration':
      return <Integration key={key} block={block} />
    case 'processTimeline':
      return <ProcessTimeline key={key} block={block} />
    case 'architecture':
      return <Architecture key={key} block={block} />
    case 'comparisonTable':
      return <ComparisonTable key={key} block={block} />
    case 'relatedInsights':
      return <RelatedInsights key={key} block={block} />
    case 'faq':
      return <Faq key={key} block={block} />
    case 'cta':
      return <Cta key={key} block={block} />
    case 'leadForm':
      return (
        <LeadForm
          key={key}
          block={block}
          siteCode={ctx.siteCode}
          pageId={ctx.pageId}
          successMessage={ctx.formMessages?.[block.formCode]}
        />
      )
    default:
      return null
  }
}

export function BlockRenderer({ blocks, context }: { blocks: Block[]; context?: RenderContext }) {
  return <>{blocks.map((b, i) => renderBlock(b, context, b.id ?? i))}</>
}
