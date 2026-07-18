# @x/clay — XTECH web frontend (CMS-driven)

`apps/clay` is the XTECH marketing frontend. It renders content from the Payload CMS
(`apps/cms`) using the **Clay design language** (the sticky-pill header, dark hero, reveal
animations, gradient accents) re-skinned for XTECH. It is intended to **replace `apps/web`**.

- **Content** comes 100% from the CMS (18-block page model). Nothing is hard-coded.
- **Design** is one unified Clay theme — violet/blue/cyan, **light base + dark hero** — with
  the original **XTECH** logos. There is no per-site dark/light switch and no CMS accent
  injection: only the content and logo change per site.

## Architecture

```
Request ── middleware.ts ──> resolves Host (or ?site=) to a siteCode (x-site-code header)
             │
        [[...slug]]/page.tsx  (force-dynamic)
             │  cms.getSite / cms.getMenu / cms.getPage   (@x/cms-client -> Payload REST)
             ▼
        SiteShell (Header + Footer from CMS menu)
             └─ BlockRenderer  ── renders page.blocks (18 block types) in the Clay style
```

Key files:

| Path | Purpose |
|---|---|
| `src/middleware.ts` | Host / `?site=` → `x-site-code` (via `@x/cms-client` `resolveSiteCode`) |
| `src/lib/cms.ts` | Shared `CmsClient` + `currentSiteCode()` |
| `src/lib/sites.ts` | Host→siteCode map, `SITE_MODE` (kept for reference) |
| `src/app/[[...slug]]/page.tsx` | Catch-all page: fetch site/menu/page, render blocks; post fallback |
| `src/app/api/lead/route.ts` | POST → CMS `form-submissions` (lead forms) |
| `src/components/site/{SiteShell,Header,Footer,Logo}.tsx` | Clay-styled shell, CMS-menu driven, XTECH logo |
| `src/components/blocks/BlockRenderer.tsx` | Renders all 18 block types; unknown → `null` |
| `src/components/blocks/{FaqAccordion,LeadFormBlock,PostArticle}.tsx` | Client FAQ accordion, lead form, insights article |
| `src/app/globals.css` | Clay theme tokens (violet/blue/cyan), utilities, reveal |

Workspace deps: `@x/cms-client`, `@x/shared-types` (`workspace:*`, transpiled via
`transpilePackages` + tsconfig `@x/*` paths).

## Block coverage

Renderers exist for all block types used by the seed. `hero` gets an explicit dark
(`theme-dark`) backdrop; other sections render on the light base:

`hero` · `cta` · `featureGrid` · `productCards` · `solutionCards` · `caseStudyCards` ·
`deploymentCards` · `processTimeline` · `statistics` · `integration` · `comparisonTable`
(handles both seed `string[][]` and Payload `[{cells}]`) · `architecture` · `relatedInsights` ·
`richText` · `painPoints` · `faq` · `leadForm`. `screenshots` / unknown → `null` (forward-compatible).

## Running locally

Postgres must be up (see root `.env` `DATABASE_URL`). Then:

```bash
# 1. Seed the CMS (idempotent). NOTE: the seed data lives under handoff/, so SEED_DIR
#    must be set — the runner's default path is stale.
cd apps/cms
SEED_DIR="../../handoff/X_WEB_PLATFORM_HANDOFF_20260715/seed" pnpm db:seed

# 2. Start the CMS (Payload admin + REST) on :3000
pnpm --filter @x/cms dev            # http://localhost:3000/admin

# 3. Start clay on :3001 (reads CMS at CMS_URL, default http://localhost:3000)
pnpm --filter @x/clay dev           # http://localhost:3001/?site=corporate
```

In development, pick a site with `?site=<code>` (`corporate`, `xbooking`, `finerp`,
`xbuilding`, `xai`, `xspace`). In production the site is resolved from the Host header.

`apps/clay/.env.local` sets `CMS_URL` (default `http://localhost:3000`).

## Status

- ✅ **Corporate (`x.vn`, 16 routes)** — all return 200, render in the Clay theme, no console
  errors, typecheck clean. Verified end-to-end against the seeded CMS.
- ⬜ **Other 5 sites** (xbooking, finerp, xbuilding, xai, xspace) — same renderer covers them;
  spot-check each site's routes and content.
- ⬜ **Polish** — hero illustration/skyline artwork; richer product-UI blocks
  (device mockups, dashboards) from the UI-style handoff; per-block theme (`BaseBlock.theme`)
  support if desired.

## Notes / gotchas

- The seed runner's default `SEED_DIR` points at a repo-root path that was moved under
  `handoff/`; always pass `SEED_DIR` (see above) until the runner default is updated.
- Port `:3000` may be occupied by an unrelated local process; free it (or run the CMS on
  another port and set `CMS_URL` accordingly) before starting the CMS.
