# CMS SCHEMA

## Collection: `customers`

```ts
type Customer = {
  slug: string
  name?: string
  displayName: string
  logo?: Media
  industry: string
  website?: string
  anonymized: boolean
  publishPermission: boolean
  sortOrder?: number
}
```

## Collection: `customer-stories`

```ts
type CustomerStory = {
  slug: string
  title: string
  customer?: Relation<Customer>
  anonymized: boolean
  anonymousLabel?: string
  summary: string
  heroImage?: Media
  publishPermission: boolean
  featured: boolean

  challenges: Array<{
    title: string
    description: string
    category: 'growth' | 'operations' | 'finance' | 'customer' | 'data-governance'
  }>

  beforeState?: string[]
  afterState?: string[]

  solutionSuite?: string
  products: Array<{
    productSlug: string
    role: 'core' | 'supporting'
  }>
  services: string[]
  platformCapabilities?: string[]

  implementationPhases: Array<{
    order: number
    title: string
    description: string
    duration?: string
  }>

  outcomes: Array<{
    title: string
    value?: string
    description: string
    evidenceType: 'verified' | 'estimated' | 'qualitative' | 'hidden'
    sourceNote?: string
  }>

  testimonial?: {
    quote: string
    personName?: string
    position?: string
    avatar?: Media
    publishPermission: boolean
  }

  nextRoadmap?: Array<{
    phase: number
    title: string
    description: string
  }>

  seo?: {
    title?: string
    description?: string
    ogImage?: Media
  }
}
```

## Global: `customer-page-settings`

```ts
type CustomerPageSettings = {
  eyebrow: string
  title: string
  description: string
  featuredStorySlugs: string[]
  logoWallCustomerSlugs: string[]
  categoryFilters: string[]
  defaultCta: { label: string; href: string }
}
```

## CMS behavior

- Preview trước publish.
- Revalidate sau publish.
- Ẩn logo, testimonial, metric không đủ quyền.
- Không cho editor chọn `verified` nếu thiếu `sourceNote`.
