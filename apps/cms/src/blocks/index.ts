/**
 * The 18 page-builder blocks (docs/04_PAGE_BLOCKS.md).
 * Field names and shapes match seed/pages.json so seed import is a direct write.
 * Scalar lists use `text hasMany`; the only structural transform (comparisonTable.rows) happens
 * in the seed runner.
 */
import type { Block } from 'payload'
import { blockBaseFields, ctaLinkFields } from '../fields/common'

const titleField: Block['fields'][number] = { name: 'title', type: 'text' }

/** Optional section illustration (isometric artwork rendered beside the section content). */
const illustrationField: Block['fields'][number] = {
  name: 'illustration',
  type: 'upload',
  relationTo: 'media',
}

/** Optional full-bleed hero background image (rendered behind the hero content with an overlay). */
const backgroundField: Block['fields'][number] = {
  name: 'background',
  label: 'Ảnh nền hero (full-bleed)',
  type: 'upload',
  relationTo: 'media',
  admin: { description: 'Ảnh nền phủ kín khu vực hero/first-fold. Nội dung hero vẫn giữ nguyên phía trên; có lớp overlay để đảm bảo tương phản chữ.' },
}

export const hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'primaryCTA', type: 'group', fields: ctaLinkFields() },
    { name: 'secondaryCTA', type: 'group', fields: ctaLinkFields() },
    illustrationField,
    backgroundField,
    ...blockBaseFields(),
  ],
}

export const richText: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [titleField, { name: 'content', type: 'richText' }, ...blockBaseFields()],
}

export const featureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    titleField,
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'text' },
      ],
    },
    illustrationField,
    ...blockBaseFields(),
  ],
}

/** Shared shape for card lists with an optional link. */
const linkCardItems = (): Block['fields'][number] => ({
  name: 'items',
  type: 'array',
  minRows: 1,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'href', type: 'text' },
  ],
})

/** Shared shape for simple title+description card lists. */
const simpleCardItems = (): Block['fields'][number] => ({
  name: 'items',
  type: 'array',
  minRows: 1,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
})

export const productCards: Block = {
  slug: 'productCards',
  interfaceName: 'ProductCardsBlock',
  fields: [titleField, linkCardItems(), illustrationField, ...blockBaseFields()],
}

export const solutionCards: Block = {
  slug: 'solutionCards',
  interfaceName: 'SolutionCardsBlock',
  fields: [titleField, linkCardItems(), ...blockBaseFields()],
}

export const painPoints: Block = {
  slug: 'painPoints',
  interfaceName: 'PainPointsBlock',
  fields: [titleField, simpleCardItems(), ...blockBaseFields()],
}

export const processTimeline: Block = {
  slug: 'processTimeline',
  interfaceName: 'ProcessTimelineBlock',
  fields: [
    titleField,
    { name: 'steps', type: 'text', hasMany: true, required: true },
    ...blockBaseFields(),
  ],
}

export const statistics: Block = {
  slug: 'statistics',
  interfaceName: 'StatisticsBlock',
  fields: [
    titleField,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    ...blockBaseFields(),
  ],
}

export const screenshots: Block = {
  slug: 'screenshots',
  interfaceName: 'ScreenshotsBlock',
  fields: [
    titleField,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media' },
        { name: 'alt', type: 'text', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    ...blockBaseFields(),
  ],
}

export const architecture: Block = {
  slug: 'architecture',
  interfaceName: 'ArchitectureBlock',
  fields: [
    titleField,
    {
      name: 'layers',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'items', type: 'text', hasMany: true, required: true },
      ],
    },
    illustrationField,
    ...blockBaseFields(),
  ],
}

export const comparisonTable: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableBlock',
  fields: [
    titleField,
    { name: 'columns', type: 'text', hasMany: true, required: true },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      admin: { description: 'Each row holds one cell per column.' },
      fields: [{ name: 'cells', type: 'text', hasMany: true, required: true }],
    },
    ...blockBaseFields(),
  ],
}

export const integration: Block = {
  slug: 'integration',
  interfaceName: 'IntegrationBlock',
  fields: [titleField, simpleCardItems(), ...blockBaseFields()],
}

export const caseStudyCards: Block = {
  slug: 'caseStudyCards',
  interfaceName: 'CaseStudyCardsBlock',
  fields: [titleField, linkCardItems(), ...blockBaseFields()],
}

export const faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  fields: [
    titleField,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    ...blockBaseFields(),
  ],
}

export const relatedInsights: Block = {
  slug: 'relatedInsights',
  interfaceName: 'RelatedInsightsBlock',
  fields: [
    titleField,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    ...blockBaseFields(),
  ],
}

export const deploymentCards: Block = {
  slug: 'deploymentCards',
  interfaceName: 'DeploymentCardsBlock',
  fields: [titleField, simpleCardItems(), illustrationField, ...blockBaseFields()],
}

export const leadForm: Block = {
  slug: 'leadForm',
  interfaceName: 'LeadFormBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'formCode',
      type: 'text',
      required: true,
      admin: { description: 'References Forms.code (e.g. demo-request, contact).' },
    },
    { name: 'fields', type: 'text', hasMany: true },
    illustrationField,
    ...blockBaseFields(),
  ],
}

export const cta: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'primaryCTA', type: 'group', fields: ctaLinkFields() },
    { name: 'secondaryCTA', type: 'group', fields: ctaLinkFields() },
    illustrationField,
    ...blockBaseFields(),
  ],
}

/** All blocks, canonical order. */
export const allBlocks: Block[] = [
  hero,
  richText,
  featureGrid,
  productCards,
  solutionCards,
  painPoints,
  processTimeline,
  statistics,
  screenshots,
  architecture,
  comparisonTable,
  integration,
  caseStudyCards,
  faq,
  relatedInsights,
  deploymentCards,
  leadForm,
  cta,
]
