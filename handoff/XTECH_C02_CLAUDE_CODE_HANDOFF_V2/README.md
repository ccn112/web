# XTECH — SET C02 Digital Transformation Services
## Claude Code Handoff V2

Gói này dùng để dựng các section dịch vụ chuyển đổi số bằng Next.js/React theo đúng visual blueprint đã duyệt.

## Cấu trúc

```txt
references/c02/                  # 8 ảnh reference, KHÔNG dùng trực tiếp trong production
MASTER_PROMPT_FOR_CLAUDE.md      # prompt tổng giao cho Claude Code
C02_SECTION_BLUEPRINTS.md        # chỉ dẫn chi tiết từng section
ASSET_EXTRACTION_PLAN.md         # kế hoạch tách asset
COMPONENT_ARCHITECTURE.md        # cấu trúc component
MOTION_RESPONSIVE_GUIDE.md       # motion + responsive
ROUTE_AND_CMS_MAPPING.md         # route tiếng Việt + CMS
QA_ACCEPTANCE_CHECKLIST.md       # checklist nghiệm thu
starter/c02-seed-data.ts         # seed data tiếng Việt
starter/c02-types.ts             # type definitions
starter/section-map.json         # map section → route
manifest.json
```

## Nguyên tắc bắt buộc

- Không đặt nguyên ảnh reference làm section production.
- Không để chữ nằm trong ảnh.
- Dựng text, card, step, CTA bằng HTML/CMS.
- Ảnh reference được xem như bản Figma raster.
- Phải tách các lớp: nền, illustration chính, icon, connector, platform.
- Route dùng tiếng Việt theo site hiện tại.
- Mobile có composition riêng, không thu nhỏ desktop.
- Logo XTECH dùng đúng asset gốc, không dùng logo AI trong ảnh.

## Route chính

```txt
/dich-vu
/dich-vu/chuyen-doi-so
/giai-phap/chuyen-doi-so
/ve-x/nang-luc
```

Không tự tạo route tiếng Anh nếu project hiện tại không dùng.
