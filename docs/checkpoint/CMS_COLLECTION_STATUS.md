# CMS COLLECTION STATUS — Checkpoint V2

_Audit date: 2026-07-17. Payload CMS at `apps/cms/src/collections`. 14 collections registered in `index.ts`._

## Existing collections
| Collection | Slug | Purpose |
|---|---|---|
| Users | `users` | auth/staff (role, allowedSiteCodes) |
| Sites | `sites` | multi-site registry (theme, chatbot) = **Site Settings** |
| Media | `media` | uploads (image/pdf, alt, site) |
| Pages | `pages` | blocks-based pages (pageType, seo, summary) |
| Posts | `posts` | **Insights/blog** (category, tags, body, author) |
| ServiceSections | `service-sections` | C02 reusable page sections (8 visualTypes) |
| Products | `products` | 5-product catalog (thin: name/code/tagline/logo/href) |
| Solutions | `solutions` | solution items (category enum, summary — thin) |
| CaseStudies | `case-studies` | client/challenge/solution/architecture/results |
| FAQs | `faqs` | question/answer/tags |
| Menus | `menus` | navigation tree (json) |
| Forms | `forms` | form definitions (field library) |
| FormSubmissions | `form-submissions` | **leads** (payload, utm, consent) |
| PromptSets | `prompt-sets` | chatbot prompt chips |
| Redirects | `redirects` | source→dest, permanent (for slug renames) |

## Required-list comparison
| Required (checkpoint) | Status | Covered by |
|---|---|---|
| Pages | ✅ | `pages` |
| Products | 🟡 thin | `products` — no features/gallery/blocks; extend for detail pages |
| Solutions | 🟡 thin | `solutions` — no body/blocks |
| **Solution Suites** | ❌ | none (only `solutions.category` groups loosely) |
| **Services** (catalog) | 🟠 | `service-sections` = layout sections, NOT a service catalog entity |
| Case Studies | ✅ | `case-studies` |
| Insights | ✅ | `posts` |
| **Industries** | ❌ | none |
| **Team Members** | ❌ | none (`users` is auth-only) |
| **Partners** | ❌ | none |
| **Customers** | ❌ | none (`client` is free-text on case-studies) |
| **Testimonials** | ❌ | none (only as page block, if any) |
| FAQs | ✅ | `faqs` |
| Forms/Leads | ✅ | `forms` + `form-submissions` |
| Media | ✅ | `media` |
| Navigation | ✅ | `menus` |
| Site Settings | ✅ | `sites` |

## Missing collections — priority to unblock remaining pages
1. **Solution Suites** — parent for `/bo-giai-phap-x/*` (P1, C05).
2. **Team Members** — `/ve-x/doi-ngu` (P3) — public bios.
3. **Partners** — `/ve-x/doi-tac` (P3).
4. **Testimonials** — social proof across pages (P2).
5. **Customers** / **Industries** — `/khach-hang` logo wall + case filters (P2, C06).
6. **(extend) Products & Solutions** — add `blocks`/feature fields for full detail pages.

## Other CMS backlog (deferred per earlier decision)
- Move from dev `push` to real **migrations** before prod (no `migrations/` dir yet).
- `Media` webp `imageSizes`/`formatOptions` (perf).
- Email adapter for lead notifications (seed warns none).
- Fix pre-existing `sharp` typecheck error in `payload.config.ts`.
