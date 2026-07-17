# MASTER PROMPT FOR CLAUDE

Bạn đang code module **Tin tức / Insights** cho website corporate XTECH.

## Bối cảnh
Website hiện có style:
- Header trắng bo tròn, menu corporate
- Hero nền dark navy / blue có glow công nghệ
- Nội dung bên dưới là các section sáng, sạch, grid mảnh, card bo góc lớn
- Tone màu chính: xanh XTECH, cyan glow, điểm nhấn vàng nhạt cho CTA
- Typography hiện đại, rõ ràng, đậm tính enterprise tech

## Màn cần triển khai
1. **Home tin tức**
   - Hero headline về tin tức/cập nhật/XTECH insights
   - 1 bài nổi bật (featured)
   - Dải tag liên quan tới phần mềm / danh mục nội dung
   - 1 block bài mới / bài nổi bật
   - CTA xem tất cả tin tức

2. **Listing tin tức**
   - Hero nhỏ hoặc page intro
   - Tabs/chips/tag filter
   - Search nếu cần
   - Grid card bài viết
   - Có block article featured ở hàng đầu nếu hợp lý
   - Pagination hoặc load more

3. **Detail bài viết**
   - Hero/banner bài viết
   - Breadcrumb
   - Title, excerpt, author/date/read time, tags
   - Nội dung rich text chuẩn CMS
   - Callout box / TOC nhẹ nếu cần
   - Related posts theo tag sản phẩm/phân loại
   - CTA cuối bài

## Quy tắc thiết kế bắt buộc
- KHÔNG dùng ảnh full screenshot như ảnh cuối cùng.
- Dùng ảnh thiết kế làm **reference composition**.
- Text, button, chip, meta phải code thật bằng HTML/CSS.
- Ảnh minh họa / background / icon tách asset riêng.
- Responsive đầy đủ desktop / tablet / mobile.
- Motion nhẹ: fade-up, parallax nhẹ, glow subtle, hover card.

## Tách asset
Từ ảnh thiết kế, thực hiện tách/thay thế bằng các nhóm asset:
1. **Background layer**
   - Nền dark tech hero
   - Glow vùng focal
   - Lưới/grid/particle mờ
2. **Illustration layer**
   - Hình minh họa bài viết / khối visual hero
3. **Icon/tag layer**
   - Tag sản phẩm: X.AI, XBooking, FinERP, XBuilding, X.Space
   - Tag chủ đề: AI, Dữ liệu, Chuyển đổi số, Tự động hóa, CRM, ERP, Bất động sản, Vận hành, Insights
4. **Card asset layer**
   - Thumbnail mock / visual highlights
   - Avatar placeholder / author badge nếu cần

## CMS / seed data
Tạo collection cho tin tức trong CMS:
- title
- slug
- excerpt
- coverImage
- heroTheme
- category
- tags[]
- relatedProducts[]
- featured (boolean)
- publishedAt
- readTime
- author
- seoTitle
- seoDescription
- content (rich text)
- relatedPosts[]

## Nhóm tag sản phẩm bắt buộc
- X.AI
- XBooking
- FinERP
- XBuilding
- X.Space

## Nhóm danh mục nội dung gợi ý
- Tin XTECH
- Chuyển đổi số
- AI doanh nghiệp
- Bất động sản số
- Dữ liệu & tích hợp
- Tự động hóa vận hành
- Khách hàng & trải nghiệm

## Mục tiêu cuối
Kết quả phải nhìn như một phần tự nhiên của corporate website XTECH hiện tại, đồng nhất theme, dễ quản trị qua CMS, và sát phong cách ảnh thiết kế đã bàn giao.
