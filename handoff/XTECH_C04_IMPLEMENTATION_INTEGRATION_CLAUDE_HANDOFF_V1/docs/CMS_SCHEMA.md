# CMS SCHEMA

## Collection: `implementation-pages`

```ts
type ImplementationPage = {
  slug: string
  title: string
  summary: string
  eyebrow?: string
  heroVisual?: Media
  sections: Array<{
    sectionId: string
    title: string
    description?: string
    layout: 'visual-left' | 'visual-right' | 'full-width'
    visual?: Media
    items?: Array<{
      title: string
      description?: string
      icon?: Media
      badge?: string
    }>
    cta?: {
      label: string
      href: string
    }
  }>
  seo?: {
    title?: string
    description?: string
    ogImage?: Media
  }
}
```

## Collection: `implementation-capabilities`

```ts
type ImplementationCapability = {
  key: string
  title: string
  description: string
  category:
    | 'process'
    | 'architecture'
    | 'integration'
    | 'api-event'
    | 'migration'
    | 'deployment'
    | 'devsecops'
    | 'support'
  icon?: Media
  order: number
}
```

## Global: `implementation-settings`

```ts
type ImplementationSettings = {
  defaultCta: { label: string; href: string }
  supportEmail?: string
  sectionOrder: string[]
  enableCaseStudies: boolean
}
```
