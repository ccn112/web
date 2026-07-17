# PERFORMANCE & RESPONSIVE GUIDE

## Image

- Dùng WebP trong `public/images/backgrounds/semantic`.
- `next/image` với `fill`, `sizes="100vw"`.
- `priority` chỉ cho hero hiện tại.
- Không tải đồng thời cả 9 background.
- Không dùng PNG nguồn trong production.

## Desktop

- Hero: 720–900px tùy route.
- `object-fit: cover`.
- Route config quyết định `object-position`.
- Semantic nodes được bật.

## Tablet

- Giảm nodes còn 4.
- Giảm parallax.
- Headline max-width 760px.
- Overlay mạnh hơn desktop 5–8%.

## Mobile

- Hero 620–760px.
- Ẩn semantic nodes hoặc chỉ giữ 2 node.
- Tăng center overlay để đọc chữ.
- Không thu nhỏ toàn desktop.
- CTA stack khi chiều rộng dưới 420px.
- Background dùng route-specific mobile object-position.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .background,
  .node,
  .platformGlow {
    animation: none !important;
    transform: none !important;
  }
}
```

## Core Web Vitals

- Không dùng video background.
- Không dùng canvas particle.
- Tránh hydration chỉ để chạy gradient.
- Semantic nodes có thể server-render.
- Motion wrapper chỉ dùng ở client component cần thiết.
