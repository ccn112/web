# XTECH Homepage Diagrams – Labeled Transparent PNG Handoff

## Mục tiêu
Cập nhật 5 ảnh sơ đồ homepage/corporate bằng bản PNG trong suốt có nhãn chữ để người dùng dễ hiểu hơn.

## Thư mục đích
`apps/clay/public/images/home/diagrams/`

## Mapping file
- `hero.png` → Hero section
- `solutions.png` → Solutions section
- `products.png` → Products section
- `platform.png` → Platform section
- `solution-bundles.png` → Bộ giải pháp X / journey section

## Yêu cầu triển khai
1. Ghi đè đúng asset hiện tại, ưu tiên không đổi import/path nếu chưa cần.
2. Giữ nguyên layout zig-zag hiện có:
   - Hero: ảnh bên phải
   - Solutions: ảnh bên trái
   - Products: ảnh bên phải
   - Platform: ảnh bên trái
   - Solution bundles: theo layout section hiện tại
3. Mobile giữ ảnh trước, text sau.
4. Dùng `object-fit: contain`; không crop chữ hoặc node ngoài cùng.
5. Không thêm nền hoặc khung mới; ảnh đã là PNG nền trong suốt.
6. Giữ section compact trong một màn hình và tiêu đề tối đa 2 dòng.
7. Không sửa copy, spacing hoặc cấu trúc section ngoài phần cần thiết để tránh ảnh bị cắt.

## QA bắt buộc
- Kiểm tra desktop 1440px và mobile 390px.
- Không có nhãn chữ bị cắt mép.
- Không xuất hiện nền checkerboard; đây phải là alpha transparency thực.
- Hero đọc tốt trên nền dark.
- Bốn ảnh light section đọc tốt trên nền sáng/grid.
- Không méo tỷ lệ ảnh.
