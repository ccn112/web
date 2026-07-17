# THEME INTEGRATION GUIDE

## Không tạo theme riêng

Claude phải đọc token hiện có của project:
- background
- surface
- border
- text
- muted
- primary
- accent/gold
- radius
- shadow
- spacing

Nếu chưa có token rõ ràng, tạo alias C05 trỏ vào token hiện có, không đặt màu rời rạc trong từng component.

## Visual rhythm

- Section sáng, dùng grid background rất nhạt.
- Luân phiên:
  - odd section: text trái, visual phải
  - even section: visual trái, text phải
- Section configurator có thể full-width.
- Final builder dùng gradient blue nhẹ, không quá tím.

## Heading

- Desktop max-width 720px.
- Font-size dùng clamp.
- Title tối đa 2 dòng.
- Không cho heading dài tràn 3 dòng ở 1440px.
- Có thể dùng `text-wrap: balance`.

## Background

Có thể tái dùng:
- subtle grid đang có trên site;
- radial blue glow;
- soft city horizon nếu đã tồn tại;
- không đưa skyline vào mọi section.

## Active state

- Active suite: border blue + gold dot/chip.
- CTA primary: gold hoặc blue tùy theme trang.
- Không dùng quá nhiều neon.
