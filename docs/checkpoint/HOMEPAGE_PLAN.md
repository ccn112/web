# HOMEPAGE IMPLEMENTATION PLAN — Corporate `/`

_Plan date: 2026-07-17 · handoff: `XTECH_HOMEPAGE_CLAUDE_HANDOFF_V1` · 11 sections (H01–H11) + footer._

## Decisions (locked with user)
- **Content: CMS-driven** — seed `home-content.json` into CMS; editable in admin (consistent with C02/About).
- **Icons: handoff SVG set** — copy the 50+ `public/icons/home/*.svg` into clay `public/`, use them for product/platform/service icons (fall back to lucide where a match is missing).
- **Theme**: obsidian + sapphire + champagne gold (gold for CTAs, nodes, key figures).
- **Section titles**: explicit **semantic line-breaks** (`<br>` at meaningful phrase boundaries), never arbitrary wrap — cross-cutting rule.
- **Delivery**: bespoke `HomeXtech` overriding corporate `/` in `[[...slug]]/page.tsx` (same pattern as `AboutXtech`), sections in `components/home/`.

## Reuse map
| Section | Reuse from | Work |
|---|---|---|
| H01 Hero | `HeroBackdrop` | content-left + platform-core-right variant |
| H03 Solutions (hub-spoke) | C02 hub-spoke + about `WhoWeAre` | + left problem-selector list |
| H04 Products (orbit sticky) | about `ProductEcosystem` | adapt (sticky orbit exists) |
| H05 Platform (5 tiers) | about `EnterprisePlatform` | adapt (5-tier perspective exists) |
| H07 Services (timeline 6+6) | `C02Timeline` + `CapabilityCard` | reuse |
| H08 Deployment (hub+4 models) | about `DeliveryModel` | adapt |
| H09 Business Value (orbit) | about `BusinessValue` | adapt |
| H11 Final CTA | CTA block + `btn-gold` | reuse |
| **H02 Trust** | — | NEW (logo wall + verified stats) |
| **H06 Solution Suites (tabs)** | — | NEW (5 tabs + business flow) |
| **H10 Customers & Insights** | `PostList` / case-studies | NEW (CMS-driven) |

## Motion (per MOTION_EFFECT_MAP)
Reveal (y24→0, .5–.7s), stagger 60–90ms, hover ≤1.02, parallax ≤10px, glow 4–6s. Sticky scroll-scrub ONLY on Products + Services. All reduced-motion safe (fade only). Tech/AI feel via glow pulse, connector draw, orbit pulse, floor grid, semantic nodes, timeline progress + handoff `dark-data-grid`/`section-glow` backgrounds.

## Content model (CMS-driven) — sub-plan
Homepage sections are heterogeneous. Approach: a `home` content structure seeded into CMS, read depth-populated by `HomeXtech`. Reuse existing collections where they fit (Products, Solutions, Posts, CaseStudies, Sites for contact); add a home-sections seed (mirror the ServiceSections pattern) for the bespoke section copy (hero, solutions items, platform tiers, suites, services, deployment, business value, trust). Finalize schema in build Phase 1.

## Build order
1. **Infra**: copy assets (icons/backgrounds/visuals) to clay public; scaffold `HomeXtech` + override wiring; define + seed home content model; title-breaks helper.
2. **Adapt sections** (H01, H03, H04, H05, H07, H08, H09, H11) — fast (reuse).
3. **New sections** (H02 Trust, H06 Suites tabs, H10 Customers/Insights).
4. **Responsive** (mobile-specific composition) + reduced-motion + QA checklist.
5. **Verify** at 1440/1024/768/390 vs each reference → write `HOMEPAGE_IMPLEMENTATION_STATUS.md`.

## Guardrails (MASTER_PROMPT)
No reference PNG in production; no text baked in images; no fake stats/logos; no flattening hub/orbit/layer/timeline into card grids; VN routes only; CTAs → `/lien-he`, `/dat-lich-demo`; section links → the 8 nav branches.

## Open sub-decision (resolve in Phase 1)
Exact home content schema — extend Pages blocks vs a new `home-sections` seed collection. Recommend the ServiceSections-style seed collection for the bespoke sections + reuse Products/Posts/CaseStudies for lists.
