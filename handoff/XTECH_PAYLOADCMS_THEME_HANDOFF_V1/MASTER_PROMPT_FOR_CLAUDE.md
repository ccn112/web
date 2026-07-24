# MASTER PROMPT FOR CLAUDE CODE

Bạn đang chỉnh giao diện quản trị cho **Payload CMS** của XTECH.

## Mục tiêu
Thiết kế lại admin theme theo phong cách XTECH: hiện đại, sáng sủa, enterprise, công nghệ, đồng bộ với website corporate.

## Asset bắt buộc
- Full logo: `assets/xtech-logo-full.png`
- Favicon / icon: `assets/xtech-favicon-square.png`

## Yêu cầu cốt lõi
1. Không vẽ lại logo, chỉ dùng asset gốc.
2. Đổi branding admin của Payload sang XTECH.
3. Tạo login screen đẹp hơn mặc định.
4. Tùy chỉnh dashboard / collections / edit form ở mức theme.
5. Seed dữ liệu CMS demo liên quan XTECH.
6. Giữ code sạch, có cấu trúc, dễ maintain.

## Phong cách giao diện
- Light admin UI.
- Màu chủ đạo: xanh XTECH + cyan.
- Bo góc mềm, card nổi nhẹ, form rõ ràng.
- Có thể thêm glow công nghệ rất nhẹ ở login hoặc dashboard welcome, nhưng không lạm dụng.
- Dễ đọc, enterprise, không rối.

## Cần làm
### A. Branding
- Favicon trình duyệt dùng file vuông.
- Header/sidebar brand dùng logo full.
- Sidebar collapse có thể dùng icon vuông.

### B. Login
- Tạo màn login thương hiệu XTECH.
- Có tiêu đề, mô tả ngắn, card form rõ ràng.
- Nút login dùng brand gradient.
- Có màn forgot/reset password đồng bộ.

### C. Dashboard
- Welcome panel.
- Quick links.
- Summary cards.
- Recent content.

### D. Collections & forms
- Reskin tables, filters, badges, inputs, tabs, upload cards.
- Tối ưu spacing, contrast, hover/focus states.

### E. Seed data
Tạo categories/tags/posts mẫu liên quan:
- XBooking
- FinERP
- XBuilding
- X.AI
- X.Space
- Chuyển đổi số
- Dữ liệu & AI
- Tự động hóa
- Tích hợp hệ thống

## Cách làm việc
- Trước tiên inspect repo để xác định Payload version và cách override phù hợp.
- Ưu tiên theme-level changes, hạn chế hack.
- Nếu cấu trúc repo khác dự kiến, hãy thích nghi nhưng vẫn bám mục tiêu.
- Sau khi làm xong, tự QA theo checklist.
