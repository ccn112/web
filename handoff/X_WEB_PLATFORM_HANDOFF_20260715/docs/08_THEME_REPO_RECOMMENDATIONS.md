# 08 — Theme & Repository Recommendations

## Khuyến nghị số 1: Payload official website template

Dùng làm nền chính vì đã có:
- Payload + Next.js.
- Admin panel.
- Page, post, media.
- Block rendering.
- Draft/live preview và SEO pattern.

Cách dùng: lấy cấu trúc kỹ thuật, sau đó thay hoàn toàn design token và block UI theo X.

## Khuyến nghị số 2: Payload official website source

Dùng để tham khảo:
- Kiến trúc website production.
- Reusable content.
- Media/SEO pattern.
- Component organization.

Không nên fork nguyên website corporate của Payload rồi sửa giao diện.

## Khuyến nghị số 3: shadcn/ui official

Dùng CLI hiện hành, không dùng repo `next-template` cũ vì repo đó đã deprecated.

Dùng cho:
- Navigation menu.
- Dialog/sheet cho mobile.
- Form.
- Accordion FAQ.
- Tabs.
- Carousel.
- Chat widget primitives.

## Repo tham khảo phụ

- Vercel Commerce: tham khảo App Router, server components, caching và cấu trúc production; không dùng làm base vì thiên về commerce.
- Next.js SaaS Starter: tham khảo auth/dashboard khi cần portal; không cần cho website MVP.
- Kiranism next-shadcn-dashboard-starter: chỉ tham khảo giao diện admin bổ sung; Payload Admin đã đủ cho MVP.

## Theme định hướng

Tên nội bộ: **X Digital Skyline**

- Corporate: navy + electric blue; ảnh đô thị, data flow, glass panel.
- XBooking: blue/cyan; nhịp nhanh, sales funnel, inventory matrix.
- FinERP: deep blue + gold; tin cậy, tài chính, dashboard.
- XBuilding: teal/green; building operations, resident experience.
- X.AI: violet/electric; agent, data, knowledge graph.
- X.Space: graphite/cyan; collaboration, channels, workflow.

Font:
- Heading: Manrope.
- Body: Inter.
- Number/Data: JetBrains Mono hoặc Geist Mono có chọn lọc.

Nguyên tắc:
- Chung grid, typography, radius và motion.
- Khác màu, hero imagery và motif theo sản phẩm.
- Không dùng theme generic SaaS nguyên bản làm giao diện cuối.
