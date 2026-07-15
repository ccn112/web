# CLAUDE IMPLEMENTATION INSTRUCTIONS

## Mission

Dựa trên `docs/01_UI_STYLE_GUIDE.md` và các ảnh trong `references/wave1/`, triển khai design system và page templates cho XTECH.

## Thứ tự thực hiện

1. Audit codebase và xác định stack/version.
2. Copy logo gốc vào public assets.
3. Khai báo design tokens bằng CSS variables.
4. Tạo shared layout và component library.
5. Dựng Corporate homepage trước.
6. Dựng 5 product theme variants.
7. Dựng deployment section.
8. Tạo Storybook hoặc route `/style-guide`.
9. Chạy responsive test.
10. So sánh visual với ảnh reference, nhưng ưu tiên usability và nội dung thật.

## Deliverables

- `packages/ui` hoặc thư mục component dùng chung.
- `themes.ts` hoặc CSS variables theo site.
- `DeviceMockup` component.
- `DashboardShell` component.
- `ProductShowcase` component.
- `StyleGuide` page.
- 6 homepage templates.
- Visual regression screenshots.
- `IMPLEMENTATION_STATUS.md`.

## Acceptance

- Logo gốc hiển thị đúng.
- Không có logo do AI sinh.
- Các site có cùng design language nhưng khác theme/product UI.
- Mobile không chỉ là desktop bị co nhỏ.
- Lighthouse accessibility >= 90.
- Không có nội dung hard-coded ngoài seed/config.
