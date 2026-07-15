/**
 * @x/content-blocks — React renderers for the X page-builder blocks + <BlockRenderer>.
 * Block contracts live in @x/shared-types/blocks.
 */
import { BLOCK_TYPES, type BlockType } from '@x/shared-types'

export * from './primitives'
export * from './blocks'
export { Faq } from './Faq'
export { LeadForm } from './LeadForm'
export { BlockRenderer, renderBlock, type RenderContext } from './BlockRenderer'
export { resolveIcon } from './icons'

/** Block types with a renderer implemented. */
export const IMPLEMENTED_BLOCKS: BlockType[] = [
  'hero',
  'featureGrid',
  'productCards',
  'solutionCards',
  'deploymentCards',
  'integration',
  'processTimeline',
  'architecture',
  'comparisonTable',
  'relatedInsights',
  'faq',
  'cta',
  'leadForm',
]

export function isKnownBlock(type: string): type is BlockType {
  return (BLOCK_TYPES as string[]).includes(type)
}
