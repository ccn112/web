# 03 — Frontend Implementation

## New components

```text
WorkflowHero
WorkflowNavigation
WorkflowStageSection
WorkflowStageTabsMobile
WorkflowProductBadges
WorkflowPromptChips
WorkflowValueGrid
```

## Desktop layout

- Hero: copy 5/12, overview image 7/12.
- Sticky stage navigation dưới header.
- Các stage xen kẽ ảnh trái/phải.
- Ảnh hiển thị trong rounded media panel; không làm background toàn section.
- Stage anchor hỗ trợ deep link.
- Product badges dẫn sang website hoặc route chi tiết.

## Mobile layout

- Stage navigation dạng horizontal scroll hoặc select.
- Ảnh nằm sau heading và summary.
- Capabilities hiển thị accordion hoặc list.
- CTA và prompt chips có touch target tối thiểu 44px.
- Không thu nhỏ toàn bộ ảnh desktop đến mức chữ trong screenshot không đọc được; cho phép click mở lightbox.

## Image rendering

- Dùng `next/image`.
- Tạo WebP/AVIF trong build hoặc upload pipeline.
- `sizes="(max-width: 768px) 100vw, 58vw"`.
- Lazy load cho stage 2–6.
- Hero/overview có thể priority.
- Có lightbox xem ảnh UI ở độ phân giải gốc.

## Chatbot context

Khi người dùng đang ở stage:

```json
{
  "pageType": "workflow-solution",
  "workflowStage": "booking",
  "productScope": ["XBooking"],
  "sectionTitle": "Bảng hàng và Booking"
}
```

Prompt chips lấy từ `workflow-stages.json`.
