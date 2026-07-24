# CMS SCHEMA

## Collection: `solution-pages`

```ts
type SolutionPage = {
  slug:
    | 'doanh-nghiep-ket-noi'
    | 'du-lieu-va-ai'
    | 'tu-dong-hoa'
    | 'tich-hop-he-thong'
    | 'bo-giai-phap-x'

  eyebrow?: string
  title: string
  summary: string
  heroVisual?: Media
  relatedProducts?: string[]

  sections: Array<{
    sectionId: string
    eyebrow?: string
    title: string
    description?: string
    layout: 'visual-left' | 'visual-right' | 'full-width'
    visual?: Media
    items?: Array<{
      title: string
      description?: string
      iconKey?: string
      metric?: {
        value?: string
        label?: string
        evidenceType?: 'verified' | 'estimated' | 'qualitative' | 'hidden'
      }
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

## Global: `solutions-menu-settings`

```ts
type SolutionsMenuSettings = {
  menuItems: Array<{
    label: string
    href: string
    shortDescription?: string
    iconKey?: string
    order: number
  }>
  defaultCta: {
    label: string
    href: string
  }
}
```

## Quy tắc CMS

- Text không hardcode trong component.
- Media có alt và focal point.
- Metric `estimated` không được trình bày như cam kết.
- Preview/revalidate sau publish.
- Slug route được khóa.
