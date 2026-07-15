# IMPLEMENTATION STATUS — X Web Platform

Living checklist. Source of truth for what is done vs pending. See `DECISIONS.md` for rationale
and `ROUTE_INVENTORY.md` for the route surface.

Legend: ✅ done · 🚧 in progress · ⬜ not started

## Phase 0 — Bootstrap
- ✅ pnpm workspace (`pnpm-workspace.yaml`, root `package.json`, `.npmrc`)
- ✅ TypeScript strict base config (`tsconfig.base.json`)
- ✅ Prettier config
- ✅ `.env.example`
- ✅ Docker Compose (postgres + minio + bucket init)
- ✅ Handoff docs mirrored: `DECISIONS.md`, `IMPLEMENTATION_STATUS.md`, `ROUTE_INVENTORY.md`
- ✅ `packages/shared-types` (block, content, chat, site types)
- ✅ `packages/cms-client` (REST client + site resolver)
- ✅ Placeholder packages: `ui`, `content-blocks`, `chatbot-widget`, `seo`
- ✅ `apps/web` stub
- 🚧 ESLint flat config (per-app)
- ⬜ CI build/test

## Phase 1 — CMS Core
- ✅ Payload app bootstrap (`apps/cms`): config, next.config, admin + REST + GraphQL routes
- ✅ PostgreSQL adapter with `idType: 'uuid'`
- ✅ S3/MinIO storage (toggle via `USE_S3`)
- ✅ Access control: 5 roles (super_admin, site_admin, editor, reviewer, publisher) + `allowedSites`
- ✅ Published-only public read; drafts never public
- ✅ Draft/review/approved/published/archived workflow field
- ✅ 18 page-builder blocks defined
- ✅ 14 collections: Sites, Pages, Posts, Products, Solutions, CaseStudies, FAQs, Menus, Forms,
  FormSubmissions, PromptSets, Redirects, Media, Users
- ✅ Idempotent seed runner (6 sites, 42 pages, 3 posts, 6 menus, 2 forms, 6 prompt-sets, admin user)
- ✅ **Verified against local PostgreSQL 18**: seed run #1 = 65 created, run #2 = 0 created / 65
  updated (idempotent); `/admin` returns 200; public REST returns published content with UUID ids,
  correct `siteCode` scoping, and all block tables populated (incl. comparisonTable row transform).
- ⬜ Access-control + seed-idempotency unit tests (Phase 6, stubs land here)

## Phase 2 — Design System & Page Builder (frontend)  — mostly done
Built to the **XTECH UI STYLE HANDOFF** ("X Digital Skyline"). See DECISIONS D-010.
- ✅ Brand logos copied to `apps/web/public/brand` (originals only; white on dark, color on light)
- ✅ Design tokens as CSS vars (Tailwind v4 `@theme`): shared brand + dark/light modes + per-site accent
- ✅ Fonts: Manrope (heading), Inter (body), Geist Mono (data)
- ✅ Multi-domain middleware (Host→siteCode, `?site=` dev override) + per-site theme + accent injection
- ✅ Layout: Header (sticky, transparent→solid on scroll, mega-menu, mobile drawer), Footer, Logo, SiteShell
- ✅ 13 block renderers + `<BlockRenderer>` in `@x/content-blocks` (hero w/ CSS skyline backdrop, featureGrid,
  productCards/solutionCards, deploymentCards, integration, processTimeline, architecture, comparisonTable,
  relatedInsights, faq accordion, cta, leadForm)
- ✅ `[[...slug]]` renders any published page; insights article template; `/api/lead` persists submissions
- ✅ `/style-guide` route
- ✅ **Verified live**: all **42 seeded routes return 200**; each site shows correct theme (corporate/xai/xspace
  dark, xbooking/finerp/xbuilding light) + correct logo; demo lead form renders; typecheck clean.
- ⬜ Deferred to later: rich DeviceMockup/dashboard/DataTable/ChartCard/AIChatPanel components,
  per-site product-UI showcases, `prefers-reduced-motion`-gated data animations, visual regression screenshots.

## Phase 3 — Corporate Website  (covered by Phase 2 renderer; polish pending) 🟡
## Phase 4 — Product Websites  (covered by Phase 2 renderer; per-product showcases pending) 🟡
## Phase 5 — Chatbot  ⬜  (API contract already in `packages/shared-types`)
## Phase 6 — Hardening & tests  ⬜

## How to run (once Docker/Postgres is available)
```bash
pnpm install
cp .env.example .env         # then edit PAYLOAD_SECRET etc.
docker compose up -d postgres minio
pnpm db:seed                 # dev uses Payload push mode; migrate optional
pnpm dev                     # CMS admin at http://localhost:3000/admin
```
