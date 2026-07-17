# MISSING PAGES — Corporate (Checkpoint V2)

_Audit date: 2026-07-17. Pages in the locked sitemap not yet built. Priority per `route-status.json`._

## P1 (build alongside C03–C05)
| Route | Type | Design set | Needs |
|---|---|---|---|
| `/san-pham/nen-tang-dung-chung` | platform | C03–07 | Shared platform page (Data/API/Identity/Workflow/Cloud/Security/Analytics/AI) |
| `/bo-giai-phap-x` | landing | C05 | Suites overview (currently only the renamed `x-real-estate-digital-suite` exists) |
| `/bo-giai-phap-x/chu-dau-tu-bat-dong-san` | suite | C05 + SET04–12 | Real-estate developer suite |

## P2
| Route | Type | Design set | Needs |
|---|---|---|---|
| `/giai-phap/doanh-nghiep-ket-noi` | detail | C01–05 | Connected-enterprise capability page |
| `/giai-phap/du-lieu-va-ai` | detail | C02-05 + SET12–16 | Data & AI capability page |
| `/giai-phap/tu-dong-hoa` | detail | C02-04 | Automation capability page |
| `/giai-phap/tich-hop-he-thong` | detail | C02-06 | Integration capability page |
| `/dich-vu/tu-van-chien-luoc` | detail | C02-02/03 | Strategy consulting |
| `/dich-vu/phat-trien-phan-mem` | detail | C02-04/06 | Software development |
| `/dich-vu/du-lieu-va-ai` | detail | C02-05 | Data & AI services |
| `/dich-vu/van-hanh-va-ho-tro` | detail | C02-08 | Managed services |
| `/bo-giai-phap-x/doanh-nghiep-so` | suite | C05 | Digital enterprise suite |
| `/bo-giai-phap-x/toa-nha-thong-minh` | suite | C05 + SET09–10 | Smart building suite |
| `/bo-giai-phap-x/tai-chinh-va-van-hanh` | suite | C05 + SET08 | Finance & ops suite |
| `/bo-giai-phap-x/ai-doanh-nghiep` | suite | SET12–16 | Enterprise AI suite |
| `/khach-hang/cau-chuyen-khach-hang` | listing | C06 | Case-study listing (needs `case-studies` content) |
| `/khach-hang/[slug]` | detail | C06 | Case-study detail |
| `/ve-x/gioi-thieu` | detail | C01-02 | About intro |
| `/ve-x/tam-nhin-su-menh` | detail | C01-08 | Vision & mission |
| `/chinh-sach-bao-mat` | legal | — | Privacy policy |
| `/dieu-khoan-su-dung` | legal | — | Terms of use |

## P3
| Route | Type | Needs |
|---|---|---|
| `/ve-x/doi-ngu` | listing | Team members (needs **Team Members** collection) |
| `/ve-x/doi-tac` | listing | Partners (needs **Partners** collection) |
| `/ve-x/tuyen-dung` | listing | Careers |

## Blocked-by-collection
These pages cannot be fully content-driven until the missing CMS collections exist (see CMS_COLLECTION_STATUS.md):
- Case listing/detail → **Case Studies** (exists but thin) + **Customers/Industries**
- `/ve-x/doi-ngu` → **Team Members**
- `/ve-x/doi-tac` → **Partners**
- Suites → **Solution Suites**
- Product detail depth → extend **Products** (add blocks/features)

**Count:** ~22 missing routes (3× P1, ~16× P2, 3× P3).
