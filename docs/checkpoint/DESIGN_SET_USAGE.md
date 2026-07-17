# DESIGN SET USAGE — Corporate (Checkpoint V2)

_Audit date: 2026-07-17. Where each design SET is implemented. Rule: reference PNGs are blueprints only — never embedded; text is HTML/CMS; visuals rebuilt natively (SVG/CSS/lucide)._

## C01 — Corporate Overview ✅ DONE
- **Where:** `/ve-x` (bespoke `AboutXtech.tsx` + `about-sections.tsx`, `about-kit.tsx`, `about-content.tsx`).
- 7 native sections (WhoWeAre hub, ProductEcosystem sticky-scroll, Transformation, EnterprisePlatform tiers, BusinessValue orbit, DeliveryModel, FutureVision). Framer Motion, reduced-motion safe.

## C02 — Digital Transformation Services ✅ DONE (this session)
- **Data:** `service-sections` collection, 8 sections (`c02-01..08`), seeded corporate.
- **Where rendered (by `routes[]`):** `/dich-vu`, `/dich-vu/chuyen-doi-so`, `/giai-phap/chuyen-doi-so`, `/ve-x/nang-luc`, `/trien-khai`.
- **8 bespoke visualTypes (all built):** hub-spoke, maturity-radar, architecture-stack, process-evolution, data-platform, integration-hub, adoption-journey, control-tower.
- **Components:** `services/c02/` — `kit.tsx`, `visuals.tsx` (reusable primitives), `C02ServicesOverview.tsx`, `C02Bespoke.tsx`, `C02GenericSection.tsx` (fallback), `C02SectionRenderer.tsx`.
- Icons content-matched via CMS data (90 lucide icons).

## Semantic Backgrounds ✅ DONE (this session)
- 9 route-specific hero .webp, CMS-driven (`background` field on hero block).
- `HeroBackdrop.tsx`: 3-layer overlay + semantic nodes (desktop) + parallax + load-zoom, reduced-motion safe.
- `/ve-x` shows its bg via `AboutXtech` (own hero — nodes/overlay not yet applied there).

## SET 03–16 — Illustrations ✅ USED (100%)
- 111 illustrations placed across all 6 sites (corporate + 5 products) as image-beside-text / featureGrid / leadForm.
- SET03 corporate, SET04 suite, SET05–08 XBooking/FinERP, SET09–10 XBuilding, SET11–16 X.AI.
- Rendered by `IllustrationImage` (BlockRenderer). Tone-harmonized with sapphire theme.

## ⏭️ NOT STARTED (next SETs — awaiting handoffs)
| SET | Scope | Target routes | Status |
|---|---|---|---|
| **C03 Product Ecosystem** | `/san-pham` + 5 product pages | product landing/detail | **NEXT** — handoff not yet delivered |
| C04 Implementation & Integration | `/trien-khai` | delivery landing | after C03 |
| C05 X Solution Suites | `/bo-giai-phap-x/*` | 5 suites | after C04 |
| C06 Customer Success | `/khach-hang/*` | case listing/detail | after C05 |
| C07 Insights | `/insights` | listing/article redesign | after C06 |

## Theme (cross-cutting) ✅ DONE (this session)
Obsidian + Sapphire + Champagne Gold, unified across all 6 sites (`globals.css` tokens). Gold used as luxury signature (CTAs, timeline nodes, outcome icons, badges, eyebrows, heading underlines).
