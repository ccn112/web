# CMS SCHEMA

## Collection: `solution-suites`

```ts
type SolutionSuite = {
  slug: string
  title: string
  shortTitle?: string
  summary: string
  heroVisual?: Media
  icon?: Media
  theme?: {
    accent?: 'blue' | 'cyan' | 'gold' | 'violet'
  }
  businessJourney: Array<{
    order: number
    title: string
    description?: string
    icon?: Media
  }>
  products: Array<{
    productSlug: string
    role: 'core' | 'recommended' | 'optional' | 'not-applicable'
    note?: string
  }>
  platformCapabilities: string[]
  services: Array<{
    serviceSlug: string
    role: 'core' | 'recommended' | 'optional'
  }>
  deploymentModels: Array<'saas' | 'private-cloud' | 'on-premise' | 'hybrid'>
  outcomes: Array<{
    title: string
    description: string
    icon?: Media
  }>
  roadmap: Array<{
    phase: number
    title: string
    description: string
    deliverables?: string[]
  }>
  seo?: {
    title?: string
    description?: string
    ogImage?: Media
  }
}
```

## Global: `solution-suite-page`

```ts
type SolutionSuitePageGlobal = {
  eyebrow: string
  title: string
  description: string
  defaultSuiteSlug: string
  sectionOrder: string[]
  builderEnabled: boolean
  builderRecipientEmail?: string
  primaryCta: { label: string; href: string }
}
```

## Collection: `solution-builder-submissions`

```ts
type SolutionBuilderSubmission = {
  companyName?: string
  fullName: string
  email: string
  phone?: string
  companyModel: string
  priorityProblems: string[]
  userScale?: string
  currentSystems?: string[]
  infrastructurePreference?: string
  targetTimeline?: string
  interestedProducts?: string[]
  sourcePage?: string
  utm?: Record<string,string>
  consent: boolean
  generatedRecommendation?: {
    suiteSlug: string
    coreProducts: string[]
    starterPhase: string
    integrations: string[]
    nextStep: string
  }
  status: 'new' | 'reviewing' | 'qualified' | 'closed'
}
```

## CMS behavior

- Preview trước khi publish.
- Revalidate route sau publish.
- Không để người biên tập thay đổi route gốc.
- Media có alt, focal point và mobile variant.
