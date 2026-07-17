# XTECH CORPORATE WEBSITE — MASTER CHECKPOINT V2
Ngày checkpoint: 2026-07-17

## Vai trò
Đây là nguồn chuẩn để Claude Code khóa sitemap, route, màn hình, trạng thái SET và thứ tự triển khai.

## Route public khóa
```txt
/
/giai-phap
/san-pham
/bo-giai-phap-x
/dich-vu
/trien-khai
/khach-hang
/insights
/ve-x
/lien-he
/dat-lich-demo
```

Không tự đổi sang `/products`, `/solutions`, `/services`, `/about`, `/customers`.

## Phân biệt menu
- **Giải pháp**: capability / bài toán.
- **Sản phẩm**: X.AI, XBooking, FinERP, XBuilding, X.Space.
- **Bộ giải pháp X**: tổ hợp đóng gói theo loại khách hàng/bài toán.
- **Dịch vụ**: XTECH làm gì cùng khách hàng.
- **Triển khai**: XTECH đưa giải pháp vào thực tế như thế nào.

## Trạng thái SET
- C01 Corporate Overview: hoàn thành + handoff.
- C02 Digital Transformation Services: hoàn thành + handoff V2.
- Semantic Backgrounds: hoàn thành + handoff.
- C03 Product Ecosystem: tiếp theo.
- C04 Implementation & Integration: sau C03.
- C05 X Solution Suites: sau C04.
- C06 Customer Success: sau C05.
- C07 Insights: sau C06.

## Hero background
- `/` → `bg-trang-chu-he-sinh-thai.webp`
- `/giai-phap` → `bg-giai-phap-hoi-tu.webp`
- `/san-pham` → `bg-san-pham-nen-tang-mo-dun.webp`
- `/bo-giai-phap-x` → `bg-bo-giai-phap-x-lap-ghep.webp`
- `/dich-vu` → `bg-dich-vu-hanh-trinh.webp`
- `/trien-khai` → `bg-trien-khai-kien-truc.webp`
- `/khach-hang` → `bg-khach-hang-mang-luoi.webp`
- `/insights` → `bg-insights-tin-hieu.webp`
- `/ve-x` → `bg-ve-x-con-nguoi-doi-tac.webp`

## Design rules
1. Ảnh SET là section blueprint, không nhúng production.
2. Tách background/icon/illustration/connector/platform.
3. Text và CTA dựng bằng HTML/CMS.
4. Logo XTECH dùng đúng asset gốc.
5. Không flatten thành card grid thông thường.
6. Connector dùng SVG/CSS.
7. Mobile có composition riêng.
8. Hỗ trợ reduced motion.
9. Nội dung mặc định tiếng Việt.
10. Không dùng số liệu chưa xác thực.

## CMS bắt buộc
Pages, Products, Solutions, Solution Suites, Services, Case Studies, Insights,
Industries, Team Members, Partners, Customers, Testimonials, FAQs,
Forms/Leads, Media, Navigation, Site Settings.

## Output audit bắt buộc
Claude Code phải tạo:
```txt
docs/checkpoint/
  ROUTE_IMPLEMENTATION_STATUS.md
  MISSING_PAGES.md
  MISSING_ASSETS.md
  DESIGN_SET_USAGE.md
  CMS_COLLECTION_STATUS.md
  SEO_STATUS.md
  PERFORMANCE_STATUS.md
```
