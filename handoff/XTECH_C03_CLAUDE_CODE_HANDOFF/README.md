# XTECH — SET C03 Product Ecosystem
## Claude Code Handoff

Gói này dùng để triển khai **SET C03 — Product Ecosystem** thành các section thật bằng **Next.js/React**, bám sát các ảnh reference đã duyệt.

Bộ này đặc biệt quan trọng vì không chỉ là ảnh minh họa. Mỗi ảnh là một **blueprint thị giác** cho một section hoặc một product page của website corporate XTECH.

## Mục tiêu

Dựng lại bằng code sao cho:
- giữ được cảm giác **enterprise tech premium**;
- thể hiện rõ **icon 3D / pseudo-3D**, **pedestal**, **quầng sáng**, **luồng sáng**, **orbital connector**, **chip nền tảng**;
- text, CTA, card, số liệu, chips đều là **HTML/CMS**;
- ảnh reference chỉ dùng để **phân tích, tách asset, đối chiếu fidelity**, không dùng nguyên ảnh làm section production.

## Cấu trúc

```txt
references/c03/                  # 8 ảnh reference
MASTER_PROMPT_FOR_CLAUDE.md      # prompt tổng giao cho Claude Code
C03_SECTION_BLUEPRINTS.md        # blueprint từng section
ASSET_EXTRACTION_PLAN.md         # kế hoạch tách asset + tái dựng icon/luồng sáng
VISUAL_EFFECTS_AND_ICON_GUIDE.md # quy chuẩn icon, glow, connector, background
COMPONENT_ARCHITECTURE.md        # cấu trúc component
MOTION_RESPONSIVE_GUIDE.md       # motion + responsive
ROUTE_AND_CMS_MAPPING.md         # route tiếng Việt + CMS
QA_ACCEPTANCE_CHECKLIST.md       # checklist nghiệm thu
starter/c03-seed-data.ts         # seed data tiếng Việt
starter/c03-types.ts             # type definitions
starter/section-map.json         # map section → route
manifest.json
```

## Nguyên tắc bắt buộc

- Không flatten thành card grid đơn giản.
- Không dùng nguyên PNG reference làm ảnh section production.
- Không để chữ nằm trong ảnh.
- Không thay các illustration chính bằng icon line đơn giản.
- Phải cố gắng giữ lại hoặc tái dựng:
  - **platform/pedestal phát sáng**;
  - **orbital ring**;
  - **connector line / light beam**;
  - **mini 3D illustration**;
  - **soft ambient glow**;
  - **gradient chip / capsule**.
- Logo XTECH dùng đúng asset gốc, không dùng logo nằm trong ảnh reference.
- Ưu tiên route tiếng Việt hiện tại của site.

## Route chính

```txt
/san-pham
/san-pham/x-ai
/san-pham/xbooking
/san-pham/finerp
/san-pham/xbuilding
/san-pham/x-space
/san-pham/nen-tang-dung-chung
/bo-giai-phap-x
```

## Mapping nhanh 8 ảnh

1. `c03-01` — Hệ sinh thái sản phẩm XTECH
2. `c03-02` — X.AI: Trí tuệ doanh nghiệp
3. `c03-03` — XBooking: Nền tảng bán hàng bất động sản
4. `c03-04` — FinERP: Tài chính & vận hành doanh nghiệp
5. `c03-05` — XBuilding: Vận hành tòa nhà & cư dân
6. `c03-06` — X.Space: Cộng tác, công việc & tri thức
7. `c03-07` — Nền tảng dùng chung XTECH
8. `c03-08` — Liên thông sản phẩm XTECH
