# XTECH Payload CMS Theme Handoff

Bộ handoff này dùng để hướng dẫn Claude Code chỉnh sửa giao diện quản trị **Payload CMS** theo nhận diện XTECH, sử dụng **đúng logo và favicon gốc** người dùng đã cung cấp.

## Mục tiêu
- Giữ Payload CMS ổn định, dễ maintain.
- Đổi theme admin sang phong cách **XTECH – hiện đại, sạch, công nghệ, tối giản**.
- Ưu tiên **light admin theme** với điểm nhấn xanh dương / cyan, đồng bộ với website corporate.
- Tùy biến các màn quan trọng:
  1. Login
  2. Forgot password / reset password
  3. Dashboard landing
  4. Collection list / table view
  5. Document edit form
  6. Media library / upload view
  7. Header / sidebar / breadcrumb / action bar

## Asset thương hiệu đi kèm
- `assets/xtech-logo-full.png` → logo chữ XTECH dùng cho login header, sidebar header, top admin branding.
- `assets/xtech-favicon-square.png` → icon vuông dùng cho favicon, app icon nhỏ, mobile tab icon, loading mark.

## Ghi nhớ quan trọng
- **Không được vẽ lại logo**.
- **Không đổi màu logo gốc** nếu không thật sự cần.
- Logo phải được dùng như **asset nguyên bản**.
- Theme admin chỉ nên làm đẹp lớp hiển thị, **không làm thay đổi logic nghiệp vụ**.

## File trong bộ handoff
- `BRAND_ASSETS.md`
- `THEME_SPEC.md`
- `IMPLEMENTATION_GUIDE.md`
- `CMS_SEED_HINTS.md`
- `MASTER_PROMPT_FOR_CLAUDE.md`

## Kết quả mong muốn
Claude Code sau khi nhận handoff cần:
1. Tìm đúng điểm hook / override của Payload CMS theo version đang dùng.
2. Áp theme cho admin UI.
3. Nạp logo + favicon gốc.
4. Seed dữ liệu mẫu tối thiểu để admin có nội dung demo.
5. Giữ responsive tốt ở desktop và laptop.
