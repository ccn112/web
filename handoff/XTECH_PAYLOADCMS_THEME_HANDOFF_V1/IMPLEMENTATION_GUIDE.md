# Implementation Guide for Claude Code

## 1) Cách tiếp cận
Claude Code cần làm theo thứ tự:
1. Inspect repo để xác định chính xác version Payload CMS.
2. Tìm đúng extension points của admin UI (custom css / custom components / bundler / theme config / overrides tùy version).
3. Tạo một lớp theme riêng cho XTECH, tránh sửa bừa vào core.
4. Nạp asset logo + favicon từ thư mục project.
5. Áp CSS variables / design tokens trước.
6. Sau đó chỉnh các màn trọng yếu: login, dashboard, list, edit form.

## 2) Cấu trúc file gợi ý
Có thể tạo cấu trúc tương tự:
- `src/payload/admin/theme/brand.css`
- `src/payload/admin/theme/tokens.css`
- `src/payload/admin/components/BrandLogo.tsx`
- `src/payload/admin/components/BrandIcon.tsx`
- `src/payload/admin/components/LoginHero.tsx`
- `src/payload/admin/components/DashboardWelcome.tsx`
- `src/payload/admin/components/index.ts`

> Tên file có thể đổi theo repo thực tế, nhưng nên tổ chức tách biệt để dễ maintain.

## 3) Các chỗ cần override / hook
Claude Code cần kiểm tra và tận dụng các điểm sau nếu version hỗ trợ:
- Favicon / metadata head
- Admin graphics / logo / icon components
- Custom login component hoặc custom beforeLogin / login wrapper
- Dashboard default view
- Global admin CSS injection
- Component map/import map nếu repo đang dùng Payload mới

## 4) Login UI mục tiêu
- Nền ngoài cùng: gradient rất nhẹ từ trắng xanh sang xanh rất nhạt.
- Có 1–2 vùng glow công nghệ mờ phía góc.
- Card form rộng khoảng 420–480px.
- Logo full trên đầu form hoặc cột branding.
- Tiêu đề: “Đăng nhập quản trị XTECH”.
- Mô tả: “Quản trị nội dung, dữ liệu và hệ sinh thái số trên một giao diện thống nhất.”
- Nút primary dùng brand gradient.
- Links như “Quên mật khẩu?” dùng màu primary blue.

## 5) Dashboard UI mục tiêu
- Welcome card: logo nhỏ + thông điệp chào mừng.
- Summary cards mẫu:
  - Bài viết đã xuất bản
  - Trang / section đang quản trị
  - Media assets
  - Người dùng quản trị
- Recent items / quick links phía dưới.
- Có thể thêm block “Quản trị nhanh” dẫn tới Posts, Media, Pages, Settings.

## 6) Collection list / table
- Header row rõ ràng.
- Cell spacing thoáng.
- Filter / search panel gọn.
- Status badges màu sáng, dễ đọc.
- Hover row nhẹ, không quá sặc sỡ.

## 7) Edit form / document screen
- Dùng form sections / cards rõ ràng.
- Sticky action bar nếu version cho phép.
- Upload preview card đẹp hơn mặc định.
- Relationship, tags, select component cần cùng ngôn ngữ thiết kế.

## 8) Favicon & branding mapping
- Favicon browser: `assets/xtech-favicon-square.png`
- Sidebar/header brand: `assets/xtech-logo-full.png`
- Collapsed sidebar or small context: `assets/xtech-favicon-square.png`

## 9) Performance & maintainability
- Không dùng animation nặng.
- Hiệu ứng chỉ ở mức subtle.
- Tránh thêm dependency UI nặng nếu không cần.
- Tôn trọng hệ component hiện tại của Payload.

## 10) QA cuối cùng
- Test login
- Test quên mật khẩu / reset password
- Test CRUD collection
- Test upload media
- Test mobile width cơ bản
- Test dark text contrast trên nền sáng
