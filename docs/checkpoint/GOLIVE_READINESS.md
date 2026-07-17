# GO-LIVE READINESS & PLAN — Corporate (Checkpoint V2)

_Audit date: 2026-07-17._

## 1. What's DONE ✅
- **Theme**: Obsidian + Sapphire + Champagne Gold, unified across 6 sites, harmonized with existing blue illustrations.
- **C01** About (`/ve-x`) — 7 bespoke native sections.
- **C02** Digital Transformation Services — all 8 visualTypes bespoke, CMS-driven, on 5 routes.
- **Semantic backgrounds** — 9 route-specific hero webp, CMS-driven, 3-layer + nodes + parallax.
- **Illustrations** SET03–16 — 111/111 placed, tone-harmonized.
- **Core infra** — 18-block renderer, multi-site shell, CMS client, Posts/tags, Forms/leads, menus.

## 2. Blocks go-live (must fix)
| # | Blocker | Owner | Effort |
|---|---|---|---|
| B1 | **Route slug reconciliation** (6 renames + redirects) to match locked sitemap | dev | 0.5 d |
| B2 | **SEO essentials** — sitemap, robots, post metadata, canonical, OG image | dev | 1–1.5 d |
| B3 | **Perf** — remove `force-dynamic` (ISR), `next/image` + image config, CLS dims | dev | 1–2 d |
| B4 | **Legal pages** — `/chinh-sach-bao-mat`, `/dieu-khoan-su-dung` | dev + client copy | 0.5 d |
| B5 | **Verified stats** — replace placeholder figures (10+/200+…) with real data | client | — |
| B6 | **Lead email adapter** — form submissions currently console-only | dev | 0.5 d |
| B7 | **DB migrations** — move off dev `push` before prod | dev | 0.5 d |

## 3. Recommended sequence
**Phase A — Ship the finished corporate core (soft go-live):**
B1 route reconciliation → B2 SEO → B3 perf → B4 legal → B6 email → B7 migrations → Lighthouse pass. The pages that are DONE (home, `/dich-vu*`, `/giai-phap/chuyen-doi-so`, `/ve-x`, `/insights`, product pages, `/lien-he`, `/demo`) are launchable once A is complete.

**Phase B — Build remaining SETs (content completeness):** C03 → C04 → C05 → C06 → C07 (per checkpoint order), each with its CMS collections.

## 4. Next UI package to build → **C03 Product Ecosystem**
Per checkpoint, C03 is the next SET. Scope:
- `/san-pham` landing — ecosystem overview + the 5 products (X.AI, XBooking, FinERP, XBuilding, X.Space) + shared platform + cross-product journey.
- 5 product pages (`/san-pham/x-ai`, `…/xbooking`, `…/finerp`, `…/xbuilding`, `…/x-space`) — richer than today (features by module, per `required_sections`).
- `/san-pham/nen-tang-dung-chung` — shared platform (Data/API/Identity/Workflow/Cloud/Security/Analytics/AI).

**Precondition:** the **C03 design handoff has not been delivered yet** (only C01/C02/backgrounds exist). To start C03 we need either (a) the C03 handoff, or (b) agreement to design product pages from the existing SET05–16 product illustrations + a CMS extension of `Products` (add feature/module blocks).

**Also likely needed for C03/C05/C06:** new collections — Solution Suites, Team Members, Partners, Testimonials, Customers/Industries (see CMS_COLLECTION_STATUS.md).

## 5. Recommendation
Do **Phase A (go-live hardening)** next — it's self-contained, low-risk, and makes the already-built corporate site launch-ready. Start **C03** in parallel only once the C03 handoff arrives (or we agree to derive it from existing product SETs). Not committed yet — recommend committing the current session's work (C02 bespoke + theme + gold + backgrounds) before starting Phase A.
