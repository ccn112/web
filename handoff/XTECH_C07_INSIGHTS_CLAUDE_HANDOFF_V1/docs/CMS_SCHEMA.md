# CMS SCHEMA

## Collection: `insight-categories`

```ts
type InsightCategory = {
  slug: string
  title: string
  description: string
  heroImage?: Media
  seo?: {
    title?: string
    description?: string
    ogImage?: Media
  }
}
```

## Collection: `authors`

```ts
type Author = {
  slug: string
  displayName: string
  role?: string
  bio?: string
  avatar?: Media
  profileUrl?: string
  publishPermission: boolean
}
```

## Collection: `insight-articles`

```ts
type InsightArticle = {
  slug: string
  title: string
  summary: string
  category: Relation<InsightCategory>
  tags?: string[]
  author?: Relation<Author>
  heroImage?: Media
  body: RichText
  featured: boolean
  status: 'draft' | 'review' | 'published' | 'archived'
  publishedAt?: string
  updatedAt?: string
  relatedSolutions?: string[]
  relatedProducts?: string[]
  relatedArticles?: Relation<InsightArticle>[]
  seo?: {
    title?: string
    description?: string
    ogImage?: Media
    noIndex?: boolean
  }
}
```

## Collection: `newsletter-subscriptions`

```ts
type NewsletterSubscription = {
  email: string
  topics?: string[]
  consent: boolean
  sourcePage?: string
  utm?: Record<string,string>
  status: 'active' | 'unsubscribed'
}
```

## Global: `insights-settings`

```ts
type InsightsSettings = {
  eyebrow: string
  title: string
  description: string
  featuredArticleSlug?: string
  categoryOrder: string[]
  newsletterEnabled: boolean
  defaultOgImage?: Media
}
```
