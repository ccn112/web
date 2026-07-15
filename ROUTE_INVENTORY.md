# ROUTE_INVENTORY — X Web Platform

Every route the platform must serve. Generated from `seed/pages.json` + `seed/menus.json`.
The Phase 6 smoke test asserts each seeded public route returns **200**.

## Frontend (`apps/web`) — multi-domain, resolved from Host header

Each site is reached by its `primaryDomain` in production, or `?site=<code>` in development
(e.g. `http://localhost:3001/?site=xbooking`). Slugs below are relative to each site root.

### corporate — `x.vn` (16 pages)
| Slug | Type |
| --- | --- |
| `/` | home |
| `/giai-phap` | landing |
| `/san-pham` | landing |
| `/dich-vu` | landing |
| `/mo-hinh-trien-khai` | landing |
| `/khach-hang-du-an` | landing |
| `/insights` | landing |
| `/ve-x` | landing |
| `/x-real-estate-digital-suite` | solution |
| `/san-pham/xbooking` | product |
| `/san-pham/finerp` | product |
| `/san-pham/xbuilding` | product |
| `/san-pham/xai` | product |
| `/san-pham/xspace` | product |
| `/demo` | form |
| `/lien-he` | form |

### xbooking — `xbooking.vn` (6)
`/` · `/giai-phap/marketing-automation` · `/giai-phap/crm-lead` · `/giai-phap/bang-hang-booking` · `/giai-phap/customer-care` · `/demo`

### finerp — `finerp.vn` (5)
`/` · `/phan-he/tai-chinh-ke-toan` · `/phan-he/nhan-su` · `/trien-khai` · `/demo`

### xbuilding — `xbuilding.vn` (5)
`/` · `/loai-hinh/chung-cu` · `/loai-hinh/van-phong` · `/loai-hinh/khu-do-thi` · `/demo`

### xai — `xai.vn` (5)
`/` · `/giai-phap/document-ai` · `/giai-phap/report-ai` · `/giai-phap/knowledge-ai` · `/demo`

### xspace — `xspace.vn` (5)
`/` · `/workspace` · `/workflow-bot` · `/ai-assistant` · `/demo`

### Article routes (Phase 4)
`/insights/<post-slug>` per site — 3 corporate posts seeded.

### Per-site SEO routes (Phase 2)
- `/sitemap.xml` — per resolved site
- `/robots.txt` — per resolved site

## CMS API (`apps/cms`)
| Route | Purpose |
| --- | --- |
| `/admin/*` | Payload admin panel |
| `/api/*` | Payload REST API (public read = published only) |
| `/api/graphql` | GraphQL endpoint |
| `/api/graphql-playground` | GraphQL playground (dev) |
| `/api/chat` | Claude chatbot (Phase 5) — server-only key |

## Notes
- Total seeded pages: **42**. No route may 404 (Definition of Done).
- `/demo` exists on all 6 sites (form pageType, `demo-request` form). `/lien-he` corporate only.
- Product detail pages live under corporate `/san-pham/*`; each product also has its own site root.
