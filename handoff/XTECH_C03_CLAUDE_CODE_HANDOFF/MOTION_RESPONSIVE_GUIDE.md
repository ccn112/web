# MOTION & RESPONSIVE GUIDE

## Motion hierarchy

### Nhẹ
- section header reveal
- chip hover
- card hover
- glow pulse nhẹ

### Trung bình
- connector line draw
- orbital ring reveal
- node active glow
- stagger reveal cho product capsules

### Nặng, giới hạn 1–2 section
- lifecycle progress theo scroll
- sticky showcase nếu thật sự cần

## Duration
- reveal: 0.45–0.7s
- stagger: 0.06–0.1s
- connector draw: 0.8–1.3s
- hover: 0.18–0.28s
- glow pulse: 4–6s loop, rất nhẹ

## Easing
- `easeOut`
- cubic-bezier `[0.22, 1, 0.36, 1]`

## Breakpoints
- XL: >= 1440
- LG: 1024–1439
- MD: 768–1023
- SM: < 768

## Responsive principles

### Desktop
- giữ composition gần reference nhất;
- có thể dùng layout bất đối xứng hoặc orbit layout.

### Tablet
- đơn giản hóa connector;
- giảm số lớp orbit nếu chật.

### Mobile
- không scale nguyên desktop;
- hub hoặc main visual lên đầu;
- các node/capsule đi thành list, slider hoặc 2 cột;
- SVG connector phức tạp có thể tắt;
- giữ icon + pedestal + glow ở mức nhẹ.

## Reduced motion
- tắt parallax;
- tắt path pulse liên tục;
- bỏ animation scrub;
- chỉ giữ fade và scale nhỏ.

## Performance
- tránh blur quá nhiều layer lớn cùng lúc;
- asset hero dưới fold phải lazy load;
- animation chỉ dùng transform/opacity nếu có thể.
