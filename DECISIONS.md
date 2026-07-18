# DECISIONS — X Web Platform

Architectural decisions, with rationale. Referenced from `IMPLEMENTATION_STATUS.md`.

## D-001 — Data layer: Payload owns the schema (not `db/schema.sql`)

The handoff ships both a hand-written `db/schema.sql` and the instruction to start from
the official Payload template. These conflict: Payload manages its own schema via Drizzle.

**Decision:** Payload owns collections and migrations. `db/schema.sql` is used as the
**reference data model** only. To stay faithful to it we:

- Configure `postgresAdapter({ idType: 'uuid' })` so every table has UUID primary keys,
  matching `gen_random_uuid()` in the SQL and the `pageId: z.string().uuid()` chat contract.
- Mirror the SQL enums (`content_status`, `page_type`) as Payload `select` fields.
- Mirror column intent (jsonb `blocks`, `seo`, `theme`, `chatbot_config`, array fields, etc.).

## D-002 — Monorepo: full pnpm workspace from the start

Per the handoff architecture diagram and the user's choice.

```
apps/
  cms/                 # Payload 3 + Next 16 — /admin, REST + GraphQL API, seed runner
  web/                 # Next 16 multi-domain frontend (Phase 2+), consumes the CMS
packages/
  shared-types/        # Block, content-model, chat and site types (single source of truth)
  cms-client/          # Typed REST client + host->siteCode resolver
  ui/                  # shadcn/ui-based primitives (Phase 2)
  content-blocks/      # React renderers for the 18 blocks (Phase 2)
  chatbot-widget/      # Shared Claude chat widget (Phase 5)
  seo/                 # metadata / sitemap / JSON-LD helpers (Phase 2)
infrastructure/
  docker/
```

Workspace packages are **source-only** (`exports` points at `src/index.ts`); apps consume
them via `transpilePackages` + tsconfig paths, so there is no separate build step per package.

## D-003 — Single Next runtime for the frontend, multi-domain

`apps/web` is one Next runtime serving all six sites. `Host` header -> `Sites.primaryDomain`
-> `siteCode`; in development `?site=<code>` overrides. Cache key = `siteCode + locale + pathname`.
Products can be split into separate apps later without touching `packages/*`.

## D-004 — Versions (locked, mutually compatible)

| Package | Version | Note |
| --- | --- | --- |
| payload / @payloadcms/* | `3.86.0` | GA |
| next | `16.2.10` | @payloadcms/next peer allows `>=16.2.6 <17` |
| react / react-dom | `19.2.7` | required by Next 16 |
| @payloadcms/db-postgres | `3.86.0` | Drizzle + PostgreSQL, `idType: 'uuid'` |
| @payloadcms/storage-s3 | `3.86.0` | S3/MinIO media |
| @payloadcms/richtext-lexical | `3.86.0` | rich text |
| graphql | `16.14.2` | Payload peer `^16.8.1` (do NOT bump to 17) |
| tailwindcss / @tailwindcss/postcss | `4.3.2` | Tailwind v4, CSS-first config |
| zod | `4.4.3` | chat request validation |
| typescript | `5.9.3` | pinned; do NOT use the TS 7 native preview |
| vitest | `^4` | unit + smoke tests |

Node: developed against Node 24 present on the build machine; target Node 20 LTS or 22 LTS
(`.nvmrc` = 22). Payload officially supports 20/22 — Node 24 works but is unverified upstream.

## D-005 — Blocks stored as a Payload `blocks` field (not raw jsonb)

Acceptance criteria require "Editor can assemble a page from blocks" + preview, so we use the
native Payload Blocks field (proper builder UI) rather than a raw JSON textarea. Scalar lists
(`processTimeline.steps`, `architecture.layers[].items`, `comparisonTable.columns`) use
`type: 'text', hasMany: true`. The only structural transform in the seed runner is
`comparisonTable.rows` (`string[][]` -> `[{ cells: string[] }]`).

## D-006 — Post body kept as structured JSON

`posts.json` bodies are `[{ type: 'paragraph' | 'heading', text }]`. Stored in a `json` field
`body` to match `posts.body jsonb` and import faithfully; rendered in Phase 4. Editors can move
to lexical later without a data migration for existing rows.

## D-007 — Docker not required to write code, required to run

The build machine has no Docker on PATH. All infra is defined in `docker-compose.yml`; to run
the stack install Docker Desktop, or point `DATABASE_URL` at a local PostgreSQL 16 and set
`USE_S3=false` (local-disk media).

## D-010 — Frontend design system: "X Digital Skyline" (XTECH UI STYLE HANDOFF)

- **Tokens** live as runtime CSS variables so a page switches mode + accent without recompiling:
  base brand `--primary #1737D1` / `--accent #08BDEB`; `.theme-dark` (bg #061225…) and `.theme-light`
  (bg #F7F9FC…) set surface/text; each site injects its own `--primary`/`--accent` from the CMS
  `site.theme`, layered on the mode. Mapped into Tailwind v4 `@theme` (`bg-background`, `text-foreground`…).
- **Mode per site** (`SITE_MODE`): corporate/xai/xspace = dark; xbooking/finerp/xbuilding = light.
- **Brand**: only the original PNGs in `/brand` (white on dark, color on light). Never recolored/regenerated;
  logos inside reference images are ignored.
- **shadcn/ui**: the handoff recommends it, but to stay self-contained (no CLI/Radix install friction on
  Tailwind v4) the few needed primitives (mega-menu, mobile drawer, FAQ accordion) are hand-built and
  accessible. Can be swapped for shadcn later without changing the block contracts.
- **Data fetching**: `apps/web` reads the CMS over REST via `@x/cms-client` (CMS on :3000, web on :3001),
  matching the multi-app monorepo (D-002/D-003). Run both: `pnpm dev` (CMS) + `pnpm dev:web` (web),
  browse `http://localhost:3001/?site=<code>`.

## D-011 — Deploy Coolify: một PostgreSQL + một MinIO dùng chung cho cả nền tảng

Trên server tự quản chạy Coolify, chỉ `apps/cms` (Payload) cần Postgres; `apps/clay` và
`apps/web` là frontend đọc CMS qua REST (`CMS_URL`), không có DB riêng.

**Quyết định:** tạo **một** PostgreSQL resource và **một** MinIO resource dùng chung (không
mỗi app một container DB). CMS trỏ `DATABASE_URL` vào Postgres chung, `USE_S3=true` vào MinIO
chung (bucket `x-media`). App phát sinh sau nếu cần DB thì `CREATE DATABASE` trong instance
sẵn có, không tạo container mới → tối ưu RAM/CPU. Database/App là **resource tách biệt** trong
Coolify (không nhét Postgres vào compose của app). `docker-compose.yml` gốc chỉ dùng cho dev.
Chi tiết: `docs/DEPLOY_COOLIFY.md`. (Railway/Render/Fly: `docs/DEPLOY.md`.)

## Open items (later phases)

- D-008 (Phase 5): chat rate limiting store — start in-memory per instance; move to Redis if scaled.
- D-009 (Phase 2): live preview strategy (Payload draft preview vs on-demand revalidation).
