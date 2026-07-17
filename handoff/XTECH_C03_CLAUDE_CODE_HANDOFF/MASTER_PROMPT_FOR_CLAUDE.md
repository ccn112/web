# MASTER PROMPT — Giao trực tiếp cho Claude Code

Bạn đang phát triển website corporate XTECH bằng Next.js App Router.

Hãy triển khai **SET C03 — Product Ecosystem** dựa trên 8 ảnh reference trong:

```txt
/references/c03/
```

## Mục tiêu

Dựng các section thật bằng HTML/CSS/React sao cho người xem nhận ra rõ bố cục, hierarchy và tinh thần thị giác của ảnh reference, nhưng:
- không dùng nguyên ảnh reference trong DOM production;
- không render text dưới dạng ảnh;
- nội dung lấy từ seed data/CMS;
- hỗ trợ desktop, tablet, mobile;
- có motion enterprise-tech mượt, tiết chế;
- thể hiện tốt các **icon hình khối**, **đế phát sáng**, **luồng sáng**, **orbital connector**, **quầng sáng ambient**.

## Route tiếng Việt bắt buộc

```txt
/san-pham
/san-pham/x-ai
/san-pham/xbooking
/san-pham/finerp
/san-pham/xbuilding
/san-pham/x-space
/san-pham/nen-tang-dung-chung
/bo-giai-phap-x
```

Không tự đổi thành route tiếng Anh nếu project hiện tại đã dùng route tiếng Việt.

## Quy trình bắt buộc cho mỗi section

1. Mở ảnh reference tương ứng.
2. Phân tích visual hierarchy.
3. Tách hoặc tái dựng asset:
   - background;
   - main illustration;
   - product capsule / icon block;
   - pedestal / glow base;
   - connector / orbital line;
   - support decoration.
4. Dựng layout bằng React + CSS Grid/Flex.
5. Dựng connector bằng SVG.
6. Dựng text, cards, CTA, chips bằng HTML.
7. Áp style ánh sáng, blur, gradient theo guide.
8. Thêm motion sau khi layout đã đúng.
9. So sánh với reference ở 1440 / 1024 / 768 / 390 px.
10. Chỉ coi hoàn tất khi visual fidelity đủ gần reference.

## Không được làm

- Không flatten thành block text + image thông thường.
- Không bỏ các lớp ánh sáng đẹp chỉ vì khó code.
- Không thay toàn bộ illustration bằng Lucide icons.
- Không nhúng nguyên ảnh reference full section.
- Không đặt shadow thô và nặng kiểu dashboard thông thường.
- Không làm nền quá phẳng khiến section mất cảm giác công nghệ.
- Không tạo motion rối, lag hoặc lệ thuộc nhiều vào JS.

## Section và visual mode

- `C03-01`: ecosystem hub / product constellation
- `C03-02`: enterprise AI product hero + capability clusters
- `C03-03`: sales journey / conversion orchestration
- `C03-04`: finance platform overview
- `C03-05`: building operations + residents ecosystem
- `C03-06`: digital workspace / collaboration environment
- `C03-07`: shared platform layers / architecture map
- `C03-08`: product interoperability / end-to-end lifecycle

## Công nghệ đề xuất

- `next/image` cho asset raster;
- SVG cho connector, orbital lines, light paths, timeline, ring;
- Framer Motion cho reveal/stagger/hover;
- motion/useScroll hoặc GSAP ScrollTrigger: chỉ dùng hạn chế cho 1–2 section nặng;
- `prefers-reduced-motion`: bắt buộc.

## Kết quả mong muốn

Trang `/san-pham` và các trang con phải có cảm giác:
- công nghệ doanh nghiệp cao cấp;
- sáng, sạch, hiện đại;
- trực quan về sản phẩm;
- khác biệt rõ với dashboard screenshot;
- khác biệt rõ với card grid đơn giản;
- dễ quản trị nội dung qua CMS.
