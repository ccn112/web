# MASTER PROMPT FOR CLAUDE CODE — XTECH HOMEPAGE

Triển khai homepage XTECH theo 8 reference trong `/references` và starter code trong `/src`.

## Mục tiêu
- Trang chủ corporate, không phải landing page của một sản phẩm.
- Kể rõ: XTECH là ai → giải pháp → sản phẩm → nền tảng → bộ giải pháp → dịch vụ → triển khai → giá trị → khách hàng → insights → CTA.
- Bám sát visual language của 8 ảnh: enterprise, sáng, blue/cyan, 3D nhẹ, connector rõ, không card-grid phẳng.

## Quy trình bắt buộc
1. Đọc `HOME_SECTION_SPEC.md`.
2. Kiểm tra asset trong `/public`.
3. Copy icon/background/visual vào project.
4. Copy seed data và starter components.
5. Thay logo placeholder bằng đúng logo gốc XTECH.
6. Dựng từng section riêng.
7. Chụp screenshot 1440/1024/768/390.
8. So sánh với reference tương ứng.
9. Tạo `docs/checkpoint/HOMEPAGE_IMPLEMENTATION_STATUS.md`.
10. Chỉ đánh dấu hoàn tất khi đạt checklist.

## Không được làm
- Không dùng reference PNG làm production section.
- Không để chữ trong ảnh.
- Không tự đổi route tiếng Việt.
- Không dùng số liệu/logo khách hàng giả.
- Không flatten các section hub/orbit/layer/timeline thành card grid.
- Không dùng logo AI sinh.
- Không tải tất cả ảnh reference ở runtime.

## Route
- `/`
- CTA `/lien-he`, `/dat-lich-demo`
- Link tới `/giai-phap`, `/san-pham`, `/bo-giai-phap-x`, `/dich-vu`, `/trien-khai`, `/khach-hang`, `/insights`, `/ve-x`

## Animation
- Framer Motion cho reveal/stagger.
- SVG/CSS cho connector, orbit, line progress.
- Chỉ tối đa 2 sticky/scroll-driven section nặng: Products và Services.
- Tắt motion khi `prefers-reduced-motion`.

## Nghiệm thu
- First fold hiểu định vị trong 5 giây.
- Mỗi section chỉ có một nhiệm vụ nội dung.
- Các section dẫn đúng nhánh sitemap.
- Mobile có composition riêng.
- LCP/CLS và contrast đạt yêu cầu.
