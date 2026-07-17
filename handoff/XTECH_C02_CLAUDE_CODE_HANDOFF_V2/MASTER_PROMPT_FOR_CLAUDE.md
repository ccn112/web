# MASTER PROMPT — Giao trực tiếp cho Claude Code

Bạn đang refactor website corporate XTECH bằng Next.js App Router.

Hãy triển khai SET C02 — Digital Transformation Services dựa trên 8 ảnh reference trong:

```txt
/references/c02/
```

## Mục tiêu

Dựng các section thật bằng HTML/CSS/React sao cho người xem nhận ra rõ bố cục của ảnh reference, nhưng:
- không dùng nguyên ảnh reference trong DOM production;
- không render chữ dưới dạng ảnh;
- nội dung lấy từ seed data/CMS;
- hỗ trợ desktop, tablet, mobile;
- có motion công nghệ enterprise premium.

## Route tiếng Việt bắt buộc

```txt
/dich-vu
/dich-vu/chuyen-doi-so
/giai-phap/chuyen-doi-so
/ve-x/nang-luc
```

Không tạo `/services`, `/solutions`, `/about/capabilities` nếu project hiện tại dùng route tiếng Việt.

## Quy trình bắt buộc cho mỗi section

1. Mở ảnh reference tương ứng.
2. Phân tích visual hierarchy.
3. Tách thành asset riêng:
   - background;
   - illustration trung tâm;
   - illustration/card icon;
   - connector/platform decoration.
4. Dựng layout bằng React + CSS Grid/Flex.
5. Dựng connector bằng SVG.
6. Dùng seed data tiếng Việt.
7. Thêm motion sau khi layout đúng.
8. Chụp screenshot ở 1440, 1024, 768, 390 px.
9. So sánh với reference.
10. Chỉ coi hoàn tất khi composition, spacing và hierarchy tương đương reference.

## Không được làm

- Không flatten thành card grid đơn giản.
- Không dùng placeholder icon nếu có thể tách illustration.
- Không dùng một animation giống nhau cho mọi section.
- Không dùng particle hoặc 3D tilt nặng.
- Không dùng logo AI sinh.
- Không đổi route thành tiếng Anh.
- Không nhúng nguyên PNG reference làm nền full section.

## Section và visual mode

- C02-01: hub-spoke
- C02-02: maturity-radar + process timeline
- C02-03: architecture-stack + roadmap
- C02-04: process-evolution
- C02-05: data-platform layers
- C02-06: integration-hub left-to-right
- C02-07: stakeholder + adoption journey
- C02-08: control-tower + continuous-improvement loop

## Công nghệ

- Framer Motion: reveal, stagger, hover/focus.
- GSAP ScrollTrigger hoặc Motion useScroll: chỉ dùng cho 2–3 section nặng.
- SVG: connector, timeline, progress line.
- next/image: mọi asset.
- prefers-reduced-motion: bắt buộc.

## Kết quả mong muốn

Trang `/dich-vu/chuyen-doi-so` phải có cảm giác:
- công nghệ doanh nghiệp cao cấp;
- sáng, hiện đại;
- có chiều sâu;
- không phải template card grid;
- không phải dashboard screenshot;
- nội dung rõ, SEO tốt, responsive tốt.
