# MASTER PROMPT — Giao trực tiếp cho Claude Code

Hãy tích hợp bộ semantic background XTECH trong:

```txt
/public/images/backgrounds/semantic/
```

vào 9 landing page hiện tại.

## Mục tiêu thị giác

So sánh:
- `references/current-hero-before.png`
- `references/target-hero-composite.png`

Kết quả phải gần target hơn current ở các điểm:
1. background có ý nghĩa liên quan trực tiếp nội dung trang;
2. có chiều sâu thành phố / dữ liệu / platform;
3. trung tâm vẫn đủ sạch để đọc headline;
4. node/icon bổ trợ hai bên, không lấn nội dung;
5. CTA có contrast tốt;
6. hero có motion nhẹ, enterprise premium.

## Không được làm

- Không dùng cùng một background cho mọi route.
- Không đặt thêm layer tối quá mức làm mất chi tiết ảnh.
- Không dùng particle dày hoặc animation nhanh.
- Không render chữ trong background.
- Không dùng logo AI sinh.
- Không hardcode route tiếng Anh.
- Không để background là phần tử `<img>` ảnh hưởng accessibility.
- Không dùng background composite có sẵn làm production hero.

## Bắt buộc

1. Dùng component `SemanticHero`.
2. Lấy config từ `semantic-backgrounds.ts`.
3. Background dùng `next/image` với `fill`, `priority` cho first fold.
4. Có overlay ba lớp:
   - readability gradient;
   - vignette;
   - center safe-zone.
5. Có semantic nodes HTML/SVG trên desktop.
6. Mobile giảm hoặc ẩn semantic nodes.
7. Hỗ trợ `prefers-reduced-motion`.
8. Chụp screenshot 1440, 1024, 768, 390 px.
9. So sánh với target reference.
10. Không merge nếu headline hoặc CTA bị nền cạnh tranh.

## Hiệu ứng cần có

- background scale từ 1.035 về 1 khi load;
- parallax 6–10px theo chuột hoặc scroll, desktop only;
- semantic nodes fade + stagger;
- node glow pulse rất nhẹ;
- platform glow phía dưới headline;
- overlay tự tăng trên mobile;
- reduced motion chỉ giữ fade.

## Trang chủ hiện tại

Với hero:
“Hệ sinh thái chuyển đổi số và AI toàn diện cho ngành bất động sản”

Hãy:
- dùng `bg-trang-chu-he-sinh-thai.webp`;
- thêm semantic node hai bên:
  - trái: Marketing, Khách hàng, Phân tích;
  - phải: AI, Dữ liệu, Vận hành;
- thêm platform/ring glow ở đáy giữa;
- giữ text và CTA là HTML hiện tại;
- không sửa headline nếu không được yêu cầu;
- giữ logo gốc XTECH.
