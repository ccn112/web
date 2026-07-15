# X Web Platform

Multi-site content platform for the **X** real-estate PropTech ecosystem — Corporate + 5 product
sites (XBooking, FinERP, XBuilding, X.AI, X.Space) on one Payload CMS, a block-based page builder,
per-site theming/SEO, forms, and a Claude chatbot.

Built from the handoff in [`X_WEB_PLATFORM_HANDOFF_20260715/`](./X_WEB_PLATFORM_HANDOFF_20260715).
See [`DECISIONS.md`](./DECISIONS.md), [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md),
[`ROUTE_INVENTORY.md`](./ROUTE_INVENTORY.md).

## Stack

Next.js 16 · Payload CMS 3 · PostgreSQL 16 · Tailwind CSS 4 · shadcn/ui · pnpm workspace · Docker Compose.
Exact versions are locked in `DECISIONS.md` (D-004).

## Layout

```
apps/cms       Payload 3 + Next — /admin, REST + GraphQL API, seed runner
apps/web       Next multi-domain frontend (Phase 2+)
packages/      shared-types, cms-client, ui, content-blocks, chatbot-widget, seo
```

## Quick start

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env
#   -> set PAYLOAD_SECRET (openssl rand -base64 32) and SEED_ADMIN_PASSWORD

# 3. Infrastructure (requires Docker Desktop; or use a local PostgreSQL 16)
docker compose up -d postgres minio

# 4. Seed (dev uses Payload push mode, so migrate is optional)
pnpm db:seed

# 5. Run the CMS
pnpm dev            # admin -> http://localhost:3000/admin
```

Log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Seeded content: 6 sites, 42 pages,
3 posts, 6 menus, 2 forms, 6 prompt-sets. The seed runner is **idempotent** — safe to re-run.

### No Docker?

Point `DATABASE_URL` at any local PostgreSQL 16 and keep `USE_S3=false` (media on local disk).

## Scripts (root)

| Command | Effect |
| --- | --- |
| `pnpm dev` | Run the CMS (admin + API) |
| `pnpm dev:web` | Run the frontend (Phase 2+) |
| `pnpm db:seed` | Idempotent import of all handoff seed JSON |
| `pnpm db:migrate` | Run Payload migrations (production) |
| `pnpm generate:types` | Regenerate `payload-types.ts` |
| `pnpm typecheck` | Strict TypeScript across the workspace |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Unit + smoke tests |

## Status

Phases 0 (Bootstrap) and 1 (CMS Core) are implemented. Phases 2–6 (frontend design system,
corporate + product sites, chatbot, hardening) are tracked in `IMPLEMENTATION_STATUS.md`.
