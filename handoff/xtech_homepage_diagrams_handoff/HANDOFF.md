# XTECH Homepage / Corporate — Diagram Asset Handoff

## Phạm vi
Thay asset minh họa cho homepage/corporate hiện tại. Không thay đổi cấu trúc section, nội dung chữ, thứ tự zig-zag hoặc responsive layout.

## Thư mục đích

```text
apps/clay/public/images/home/diagrams/
```

## Mapping asset chính

| Asset trong ZIP | Section | Tên đích đề xuất |
|---|---|---|
| `assets/hero.png` | Hero | `hero.png` |
| `assets/solutions.png` | Giải pháp / Bắt đầu từ bài toán doanh nghiệp | `solutions.png` |
| `assets/products.png` | Năm sản phẩm cốt lõi | `products.png` |
| `assets/platform.png` | Nền tảng dùng chung | `platform.png` |

Ưu tiên giữ nguyên filename/import hiện tại trong code. Nếu project đang dùng tên khác, ghi đè nội dung ảnh mới vào đúng filename cũ thay vì sửa component.

## Asset tùy chọn

`optional/solution-bundles.png` dành cho section **Bộ giải pháp X theo bài toán doanh nghiệp** nếu cần thay tiếp.

## Yêu cầu hiển thị

- Hero: ảnh bên phải.
- Solutions: ảnh bên trái.
- Products: ảnh bên phải.
- Platform: ảnh bên trái.
- Mobile: ảnh trước, nội dung sau.
- Dùng `object-fit: contain`; không crop nội dung chính.
- Canh giữa ảnh theo cả hai trục.
- Không thêm card/frame mới quanh ảnh nếu section đã có nền.
- Giữ section compact trong khoảng một màn hình và tiêu đề tối đa hai dòng.

## Lưu ý hình nền

- `hero.png` được thiết kế cho nền dark navy.
- Ba ảnh còn lại được thiết kế cho nền sáng trắng/xanh rất nhạt có grid.
- Ảnh có phần nền và fade viền để hòa tương đối với nền section; không bật `mix-blend-mode` nếu chưa kiểm tra tương phản.

## QA checklist

1. Kiểm tra đúng mapping từng section.
2. Không xuất hiện scroll ngang ở 1280px, 1440px và mobile.
3. Không crop node ở bốn cạnh.
4. Hero không sáng hơn khối chữ quá mức.
5. Ảnh light không tạo khung vuông nhìn rõ trên nền section.
6. Mobile hiển thị ảnh trước text và không vượt quá chiều cao hợp lý.
7. Chạy build/lint hiện có của project sau khi thay asset.
