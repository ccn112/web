# MOTION & RESPONSIVE GUIDE

## Motion hierarchy

### Nhẹ
- header reveal
- card hover
- chip hover
- glow pulse

### Trung bình
- connector line draw
- timeline progress
- architecture layer reveal

### Nặng, giới hạn 2–3 section/trang
- sticky scroll
- scroll-controlled timeline
- large architecture assembly

## Duration
- reveal: 0.45–0.7s
- stagger: 0.06–0.1s
- connector draw: 0.8–1.4s
- hover: 0.18–0.28s

## Easing
- `easeOut`
- `[0.22, 1, 0.36, 1]`

## Breakpoints
- XL: >= 1440
- LG: 1024–1439
- MD: 768–1023
- SM: < 768

## Mobile
- không scale nguyên desktop;
- hub ở trên;
- card/list ở dưới;
- timeline dọc;
- SVG connector phức tạp có thể tắt;
- dùng horizontal snap nếu hợp lý.

## Reduced motion
- tắt parallax;
- tắt glow pulse;
- không scroll-scrub;
- chỉ fade đơn giản.
