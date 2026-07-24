# Theme Specification

## 1) Phong cách tổng thể
- Hiện đại, sạch, enterprise, technology-oriented.
- Ưu tiên light UI để dễ đọc dữ liệu.
- Dùng xanh dương / cyan cho action, focus state, badge, active nav.
- Shadow mềm, bo góc vừa phải, cảm giác sản phẩm SaaS cao cấp.

## 2) Design tokens
### Typography
- Ưu tiên dùng font hệ thống hoặc Inter nếu repo đang có sẵn.
- Heading: 600–700
- Body: 400–500
- Caption: 400

### Border radius
- Input / button / select: 12px
- Card: 18px
- Modal: 20px
- Small chip: 999px

### Shadow
- Card shadow: `0 12px 40px rgba(15, 23, 42, 0.06)`
- Hover shadow: `0 16px 48px rgba(23, 59, 222, 0.12)`
- Focus ring: `0 0 0 4px rgba(36, 91, 255, 0.14)`

## 3) Layout định hướng
### Login page
- Chia 2 cột trên desktop.
- Trái: block thương hiệu / thông điệp ngắn / họa tiết glow công nghệ rất nhẹ.
- Phải: form login đặt trong card trắng hoặc kính mờ nhẹ.
- Mobile: gộp thành 1 cột, form lên trước, branding rút gọn.

### Sidebar
- Nền sáng hoặc very light blue.
- Brand area trên cùng gồm logo full.
- Active item có nền xanh nhạt + icon xanh.
- Hover state nhẹ, không quá nặng.

### Top header
- Sạch, thoáng.
- Search, account menu, breadcrumb rõ ràng.
- Có thể thêm subtle top border hoặc blur nhẹ.

### Dashboard
- Welcome panel có logo nhỏ và dòng chào mừng.
- 3–4 summary cards.
- Recent activity / quick actions.

## 4) Components cần reskin
- Buttons
- Inputs
- Checkboxes / radios / toggles
- Tables
- Tabs
- Badges / pills
- Empty state
- Alerts / toast
- Modals / drawers
- Rich text toolbar
- Upload cards / thumbnails

## 5) Trạng thái tương tác
- Hover: tăng shadow nhẹ, viền rõ hơn.
- Focus: ring xanh chuẩn accessibility.
- Disabled: opacity giảm, nhưng vẫn đọc được.
- Error: viền đỏ nhẹ + helper text.
- Success: xanh lá nhẹ cho confirm.
