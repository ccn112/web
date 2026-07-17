# MISSING / STATUS OF ASSETS — Corporate (Checkpoint V2)

_Audit date: 2026-07-17._

## ✅ Present & wired
| Asset group | Status | Notes |
|---|---|---|
| Semantic hero backgrounds (9 .webp) | ✅ done this session | CMS-driven; each corporate route resolves its own bg. Files in seed/media, uploaded (media 129 total) |
| Illustrations SET03–16 (111 PNG) | ✅ placed | 111/111 used across all 6 sites; content-matched. **Tone-harmonized** with sapphire theme (no recolor needed) |
| Brand logos (XTECH originals) | ✅ | `apps/clay/public/brand/` — used in Header/Footer |
| Product ecosystem art (COR-02) | ✅ | On home |

## 🟠 Present but sub-optimal
| Asset | Issue | Action |
|---|---|---|
| Illustration PNGs | Served raw at native size/format (no webp/resize) | Convert to webp + add Payload `imageSizes` (see PERFORMANCE_STATUS.md) |
| Old blue hero PNGs (`bg-*-hero.png`) | Orphaned after webp swap | Remove from repo/seed to save space |
| OG/social image | None (no default OG image asset) | Add a branded 1200×630 OG image + per-page OG (see SEO_STATUS.md) |
| App icons | Only `favicon.ico` | Add `icon.png`, `apple-icon.png`, `manifest` |

## ❌ Missing (needed for planned pages)
| Asset | For | Source |
|---|---|---|
| C03 Product Ecosystem design set | `/san-pham` + product pages | **Next handoff** (not yet delivered) |
| C04 Implementation set | `/trien-khai` | Future handoff |
| C05 Solution Suites set | `/bo-giai-phap-x/*` | Future handoff |
| C06 Customer Success set | `/khach-hang/*` | Future handoff |
| C07 Insights set | `/insights` redesign | Future handoff |
| Team photos | `/ve-x/doi-ngu` | Client-provided |
| Partner logos | `/ve-x/doi-tac` | Client-provided |
| Customer logos (logo wall) | `/khach-hang` | Client-provided |
| Real case-study media | case pages | Client-provided |

## Note on unverified data
Checkpoint rule #10: "không dùng số liệu chưa xác thực." Stats currently shown on About (10+/200+/100+/300+) are placeholders — confirm real figures with client before go-live.
