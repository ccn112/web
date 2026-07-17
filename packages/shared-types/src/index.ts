/**
 * @x/shared-types — single source of truth for the X content model.
 * Mirrors db/schema.sql (reference model) and the seed JSON shapes.
 */
export * from './blocks'
export * from './chat'

// --- Enums (mirror db/schema.sql) ---

export const CONTENT_STATUSES = [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
] as const
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export const PAGE_TYPES = [
  'home',
  'landing',
  'product',
  'solution',
  'article_index',
  'form',
  'legal',
] as const
export type PageType = (typeof PAGE_TYPES)[number]

// --- Roles / access ---

export const USER_ROLES = [
  'super_admin',
  'site_admin',
  'editor',
  'reviewer',
  'publisher',
] as const
export type UserRole = (typeof USER_ROLES)[number]

// --- Sites ---

export interface SiteTheme {
  primary: string
  accent: string
  surface: string
  style: string
}

export interface ChatbotConfig {
  enabled: boolean
  welcome?: string
  defaultPrompts?: string[]
}

export interface SiteConfig {
  code: string
  name: string
  primaryDomain?: string | null
  product?: string | null
  tagline?: string
  theme: SiteTheme
  chatbotConfig: ChatbotConfig
  status: ContentStatus
}

// --- SEO ---

export interface Seo {
  metaTitle?: string
  metaDescription?: string
  index?: boolean
  follow?: boolean
  canonical?: string
  ogImageId?: string
}

// --- Content ---

export interface PageDoc {
  id: string
  siteCode: string
  slug: string
  title: string
  pageType: PageType
  locale: string
  summary?: string
  blocks: import('./blocks').Block[]
  seo: Seo
  suggestedPrompts: string[]
  relatedPageIds: string[]
  status: ContentStatus
}

export type PostBodyNode =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }

export interface PostDoc {
  id: string
  siteCode: string
  slug: string
  title: string
  excerpt?: string
  category?: string
  tags?: string[]
  locale: string
  body: PostBodyNode[]
  seo: Seo
  status: ContentStatus
}

/**
 * Bespoke "service section" content (SET C02 Digital Transformation Services).
 * The visual composition is a coded React component chosen by `visualType`; all
 * text/data lives here so it stays CMS-managed (never hardcoded in the frontend).
 */
export type ServiceVisualType =
  | 'hub-spoke'
  | 'maturity-radar'
  | 'architecture-stack'
  | 'process-evolution'
  | 'data-platform'
  | 'integration-hub'
  | 'adoption-journey'
  | 'control-tower'

export interface ServiceSectionItem {
  itemId: string
  order?: number
  title: string
  description: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  icon?: string
}

export interface ServiceSectionOutcome {
  itemId: string
  title: string
  description: string
  icon?: string
}

export interface ServiceSectionDoc {
  id: string
  siteCode: string
  sectionId: string
  eyebrow?: string
  title: string
  subtitle?: string
  visualType: ServiceVisualType
  /** Paths this section renders on (a section may be reused across routes). */
  routes: string[]
  /** Sort order within a route (ascending). */
  order?: number
  items: ServiceSectionItem[]
  process?: ServiceSectionItem[]
  outcomes?: ServiceSectionOutcome[]
  cta?: { label: string; href: string }
  locale: string
  status: ContentStatus
}

export interface MenuItem {
  label: string
  href: string
  children?: MenuItem[]
}

export interface MenuDoc {
  siteCode: string
  code: string
  locale: string
  items: MenuItem[]
}

export interface FormFieldDef {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required: boolean
  options?: string[]
}

/**
 * Reusable field definitions keyed by name. Seed `forms.json` references these by key only
 * (e.g. `["fullName","email",...]`); rendering + validation resolve the definition here.
 */
export const FIELD_LIBRARY: Record<string, FormFieldDef> = {
  fullName: { name: 'fullName', label: 'Họ và tên', type: 'text', required: true },
  company: { name: 'company', label: 'Công ty', type: 'text', required: false },
  jobTitle: { name: 'jobTitle', label: 'Chức danh', type: 'text', required: false },
  email: { name: 'email', label: 'Email', type: 'email', required: true },
  phone: { name: 'phone', label: 'Số điện thoại', type: 'tel', required: true },
  productInterest: {
    name: 'productInterest',
    label: 'Sản phẩm quan tâm',
    type: 'select',
    required: false,
    options: ['XBooking', 'FinERP', 'XBuilding', 'X.AI', 'X.Space', 'X Real Estate Digital Suite'],
  },
  deploymentModel: {
    name: 'deploymentModel',
    label: 'Mô hình triển khai',
    type: 'select',
    required: false,
    options: ['SaaS Cloud', 'Private Cloud', 'On-premise', 'Hybrid'],
  },
  message: { name: 'message', label: 'Nội dung', type: 'textarea', required: false },
}

export interface FormDoc {
  code: string
  name: string
  siteScope: string[]
  /** Ordered field keys into FIELD_LIBRARY. */
  fields: string[]
  successMessage?: string
}

export interface PromptChip {
  label: string
  prompt: string
  actionType: 'ask' | 'navigate' | 'page' | 'demo'
  enabled: boolean
  order: number
}

export interface PromptSetDoc {
  code: string
  siteCode: string
  prompts: PromptChip[]
}

/** Canonical list of the six sites. */
export const SITE_CODES = [
  'corporate',
  'xbooking',
  'finerp',
  'xbuilding',
  'xai',
  'xspace',
] as const
export type SiteCode = (typeof SITE_CODES)[number]
