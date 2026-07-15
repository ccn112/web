# XTECH UI STYLE HANDOFF

Ngày: 2026-07-15  
Dùng cho: Claude Code triển khai website Corporate + XBooking + FinERP + XBuilding + X.AI + X.Space.

## 1. Mục tiêu

Chuyển bộ ảnh Wave 1 thành một hệ thống giao diện thực tế, có thể code bằng Next.js/Payload, responsive và tái sử dụng giữa các site.

Bộ ảnh trong `references/wave1/` là **visual reference**, không phải file UI cuối cùng. Claude phải tái dựng bằng component thật; không nhúng nguyên ảnh làm toàn bộ trang.

## 2. Nguyên tắc thương hiệu bắt buộc

- Chỉ dùng logo gốc trong `brand/`.
- Không vẽ lại, không tái tạo bằng AI, không đổi màu, không kéo giãn.
- Nền sáng: `xtech-logo-color-original.png`.
- Nền tối: `xtech-logo-white-original.png`.
- Các logo xuất hiện trong ảnh reference có thể sai; tuyệt đối không copy trực tiếp.
- Sản phẩm hiển thị đúng tên: `XBooking`, `FinERP`, `XBuilding`, `X.AI`, `X.Space`.

## 3. Phong cách đã chốt

Tên nội bộ: **X Digital Skyline**

- Enterprise PropTech.
- 70% corporate premium, 30% product marketing.
- Bối cảnh hình ảnh: laptop/desktop + mobile, văn phòng hiện đại, skyline mờ.
- UI tập trung vào sản phẩm thật: dashboard, card, table, workflow, chatbot.
- Không dùng robot hình người.
- Không dùng neon quá mức.
- Hạn chế text nhúng trong ảnh.
- Giao diện website phải sáng rõ, đọc được, không phải poster.

## 4. Design tokens

### Shared
- Font heading: Manrope.
- Font body: Inter.
- Mono/data: Geist Mono.
- Radius: 14px cards, 18px panels, 24px hero containers.
- Border: 1px, alpha thấp.
- Shadow: mềm, không đậm.
- Grid: 12 columns desktop, 8 tablet, 4 mobile.
- Max content width: 1440px.
- Section gap: 96px desktop, 64px tablet, 48px mobile.

### Corporate / X.AI / X.Space dark
- Background: `#061225`
- Surface: `#0B1B33`
- Surface elevated: `#102846`
- Primary blue: `#1737D1`
- Cyan: `#08BDEB`
- Text primary: `#F8FAFC`
- Text secondary: `#AFC0D7`

### Light product surfaces
- Background: `#F7F9FC`
- Surface: `#FFFFFF`
- Border: `#E4EAF2`
- Text primary: `#0B1730`
- Text secondary: `#5D6B82`
- Primary: `#1737D1`
- Accent cyan: `#08BDEB`
- Success: `#16A36A`
- Warning: `#F5A524`

## 5. Layout pattern

### Hero
- Desktop: text 5/12, visual 7/12.
- Mobile: visual dưới text.
- 1 H1 duy nhất.
- CTA chính + CTA phụ.
- Product UI được render trong device frame hoặc panel, không dùng ảnh toàn màn hình.
- Có thể dùng ảnh skyline/background riêng ở layer dưới.

### Product showcase
- KPI cards.
- 1 chart chính.
- 1 table/list.
- 1 workflow/assistant panel.
- Mobile companion screen.
- Không nhồi quá nhiều dữ liệu giả.

### Navigation
- Corporate: Solutions, Products, Services, Deployment, Insights, Company.
- Product site: Overview, Solutions/Modules, Integrations, Insights, Demo.
- CTA: Book a Demo / Đặt lịch Demo.
- Sticky header, transparent over hero rồi solid khi scroll.

## 6. Theme theo site

- Corporate: dark navy/cyan, skyline và ecosystem.
- XBooking: light UI, blue/cyan, booking matrix, lead pipeline.
- FinERP: light UI, navy/blue, finance dashboard, approvals.
- XBuilding: dark hero + light dashboards, property/resident/maintenance.
- X.AI: dark UI, document/reports/assistant.
- X.Space: dark collaboration UI, channels/workflow/AI summary.

## 7. Component mapping

Bắt buộc dựng thành component:
- Header
- MobileNav
- Hero
- DeviceMockup
- KPIGrid
- FeatureGrid
- ProductCard
- IntegrationFlow
- DashboardPanel
- DataTable
- ChartCard
- AIChatPanel
- DeploymentCard
- CTASection
- Footer

## 8. Responsive

- Desktop: device mockup có laptop + phone.
- Tablet: laptop + tablet hoặc một monitor.
- Mobile: không thu nhỏ toàn bộ desktop; dùng layout mobile riêng.
- Không để chữ dưới 14px trên mobile.
- Không phụ thuộc vào text trong hình.

## 9. Motion

- Subtle fade/slide, 250–450ms.
- Data line hoặc glow chuyển động nhẹ.
- Không dùng parallax nặng.
- Respect `prefers-reduced-motion`.

## 10. Điều không được làm

- Không dùng ảnh Wave 1 làm background toàn trang.
- Không copy logo trong ảnh.
- Không hard-code nội dung trực tiếp trong component.
- Không dùng cùng một dashboard cho mọi sản phẩm.
- Không trộn dark/light tùy tiện.
- Không đưa số liệu có tính cam kết thương mại nếu chưa được duyệt.
