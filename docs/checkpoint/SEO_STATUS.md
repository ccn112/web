# SEO STATUS — Corporate (Checkpoint V2)

_Audit date: 2026-07-17. App: `apps/clay`._

## Present ✅
- **Root metadata** (`src/app/layout.tsx`): `metadataBase` (https://x.vn), title default + template `"%s · XTECH"`, description, openGraph (title/desc/url/siteName/type), twitter (summary_large_image).
- **Per-page metadata** (`[[...slug]]/page.tsx` `generateMetadata`): pulls `page.seo.metaTitle/metaDescription` (falls back to title/summary) + `robots.index/follow`.
- **Fonts** via `next/font` (Inter, Plus Jakarta Sans, Geist Mono), `display: swap`, vietnamese subset — no render-blocking links.
- `favicon.ico` present.

## Gaps ❌ / 🟡
| Area | Status | Detail |
|---|---|---|
| Sitemap | ❌ | No `src/app/sitemap.ts` — crawlers have no index of pages/posts |
| robots.txt | ❌ | No `src/app/robots.ts` |
| Canonical | ❌ | `Seo.canonical` field exists but never mapped to `alternates.canonical` |
| Per-page OG/Twitter | ❌ | Only root OG; no page-level OG, no OG image (`Seo.ogImageId` unused) |
| Insights posts metadata | ❌ | `generateMetadata` only calls `getPage()` → posts/`/ve-x`/tag pages emit generic root title/description |
| JSON-LD | ❌ | No Organization/WebSite/Breadcrumb/Article/FAQPage schema anywhere |
| App icons/manifest | 🟡 | Only favicon; no `icon.png`/`apple-icon`/`manifest.ts` |
| `@x/seo` helper | 🟡 | `resolveSeo` exists but unused ("Phase 2") |

## Top SEO fixes before go-live
1. Add `sitemap.ts` (enumerate CMS pages + posts per site) + `robots.ts`.
2. Fix post/`/ve-x`/tag metadata — fetch post SEO in `generateMetadata`.
3. Map `Seo.canonical` → `alternates.canonical`; add per-page OG + a default OG image; resolve `ogImageId`.
4. Add JSON-LD: Organization + WebSite site-wide, Article on posts, FAQPage on FAQ block.
5. Add `icon.png` / `apple-icon.png` / `manifest.ts`.

_Effort: ~1–1.5 days. All localized, low-risk._
