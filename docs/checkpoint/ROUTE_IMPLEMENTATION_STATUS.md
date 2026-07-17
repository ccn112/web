# ROUTE IMPLEMENTATION STATUS — Corporate (Checkpoint V2)

_Audit date: 2026-07-17 · site: corporate · source of truth: `handoff/XTECH_CORPORATE_MASTER_CHECKPOINT_V2/route-status.json`_

Render engine: `apps/clay/src/app/[[...slug]]/page.tsx`. A route returns 200 if it has **either** a CMS `pages` doc **or** mapped `service-sections` (C02) — so some routes render sections without a landing page. `/ve-x` is bespoke (`AboutXtech`). `export const dynamic = "force-dynamic"` (no ISR).

## Legend
✅ present & slug matches · 🟡 present but slug differs (needs rename+redirect) · 🟠 partial (renders sections only, no real landing) · ❌ missing

## Status table

| Checkpoint route | Actual | Status | Notes |
|---|---|---|---|
| `/` | `/` | ✅ | Home landing (C01/home blocks). C03 ecosystem section still to enrich |
| `/giai-phap` | `/giai-phap` | ✅ | Landing present |
| `/giai-phap/chuyen-doi-so` | (service-sections) | ✅ | Renders C02-02/04/05 via C02Sections |
| `/giai-phap/doanh-nghiep-ket-noi` | — | ❌ | Planned (P2) |
| `/giai-phap/du-lieu-va-ai` | — | ❌ | Planned (P2) |
| `/giai-phap/tu-dong-hoa` | — | ❌ | Planned (P2) |
| `/giai-phap/tich-hop-he-thong` | — | ❌ | Planned (P2) |
| `/san-pham` | `/san-pham` | ✅ | Landing present; **C03 = next SET** to build out |
| `/san-pham/x-ai` | `/san-pham/xai` | 🟡 | **Rename** `xai`→`x-ai` |
| `/san-pham/xbooking` | `/san-pham/xbooking` | ✅ | |
| `/san-pham/finerp` | `/san-pham/finerp` | ✅ | |
| `/san-pham/xbuilding` | `/san-pham/xbuilding` | ✅ | |
| `/san-pham/x-space` | `/san-pham/xspace` | 🟡 | **Rename** `xspace`→`x-space` |
| `/san-pham/nen-tang-dung-chung` | — | ❌ | Planned (P1, shared platform) |
| `/bo-giai-phap-x` | `/x-real-estate-digital-suite` | 🟡 | **Rename** to `bo-giai-phap-x` |
| `/bo-giai-phap-x/{chu-dau-tu-bat-dong-san,doanh-nghiep-so,toa-nha-thong-minh,tai-chinh-va-van-hanh,ai-doanh-nghiep}` | — | ❌ | 5 suite pages missing (C05) |
| `/dich-vu` | `/dich-vu` | ✅ | Landing + C02 sections |
| `/dich-vu/chuyen-doi-so` | (service-sections) | ✅ | All 8 C02 sections (bespoke) — **done this session** |
| `/dich-vu/{tu-van-chien-luoc,phat-trien-phan-mem,du-lieu-va-ai,van-hanh-va-ho-tro}` | — | ❌ | 4 detail pages missing (P2) |
| `/trien-khai` | `/mo-hinh-trien-khai` | 🟡🟠 | **Rename**; `/trien-khai` currently renders only C02-06 section, no landing (C04) |
| `/khach-hang` | `/khach-hang-du-an` | 🟡 | **Rename** to `khach-hang` |
| `/khach-hang/cau-chuyen-khach-hang` | — | ❌ | Case listing (C06) |
| `/khach-hang/[slug]` | — | ❌ | Case detail (C06) |
| `/insights` | `/insights` | ✅ | Listing present (UI basic, C07 to redesign) |
| `/insights/[slug]` | (post) | ✅ | `PostArticle` renders; tag route `/insights/tag/<tag>` works |
| `/ve-x` | `/ve-x` | ✅ | Bespoke `AboutXtech` (C01) |
| `/ve-x/nang-luc` | (service-sections) | ✅ | Renders C02-03/07 |
| `/ve-x/{gioi-thieu,tam-nhin-su-menh,doi-ngu,doi-tac,tuyen-dung}` | — | ❌ | 5 subpages missing (P2/P3) |
| `/lien-he` | `/lien-he` | ✅ | Contact form page |
| `/dat-lich-demo` | `/demo` | 🟡 | **Rename** `demo`→`dat-lich-demo` |
| `/chinh-sach-bao-mat` | — | ❌ | Legal (P2) |
| `/dieu-khoan-su-dung` | — | ❌ | Legal (P2) |

## Rollup
- **✅ aligned:** 14 routes
- **🟡 slug rename needed:** 6 → `xai→x-ai`, `xspace→x-space`, `x-real-estate-digital-suite→bo-giai-phap-x`, `mo-hinh-trien-khai→trien-khai`, `khach-hang-du-an→khach-hang`, `demo→dat-lich-demo`
- **❌ missing:** ~22 routes (see MISSING_PAGES.md)

## Recommended reconciliation (before go-live)
Renaming slugs is a breaking change (menus, seed pages.json, internal links, service-sections `routes[]`). Use the existing `redirects` collection to 301 old→new. Do this as ONE migration: update seed `pages.json` slugs + `menus.json` hrefs + service-sections `routes[]` + add redirects, then reseed. See GOLIVE_READINESS.md.
