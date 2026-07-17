# MASTER PROMPT — C06 Customer Success

Bạn đang hoàn thiện website corporate XTECH bằng Next.js App Router và CMS dùng chung.

Hãy triển khai nhánh `/khach-hang` theo hướng đáng tin cậy, không sử dụng số liệu, logo, testimonial hoặc tên khách hàng chưa được phép công bố.

## Route

```txt
/khach-hang
/khach-hang/cau-chuyen-khach-hang
/khach-hang/[slug]
```

## Mục tiêu

- Tạo niềm tin.
- Chứng minh khả năng triển khai thực tế.
- Cho phép công bố case đầy đủ hoặc ẩn danh.
- Quản trị toàn bộ nội dung từ CMS.
- Dùng cùng theme hiện tại: nền sáng xanh nhạt, grid mảnh, navy + blue/cyan, gold tiết chế.
- Title section tối đa 2 dòng trên desktop.
- Section luân phiên visual trái/phải.

## 8 section landing

1. Customer Success Overview
2. Before / After Transformation
3. Business Challenge Map
4. Solution Blueprint in Practice
5. Implementation Journey
6. Business Outcomes
7. Customer Voice
8. Next Growth Roadmap

## Quy tắc dữ liệu

- `verified`: được phép hiển thị số liệu.
- `estimated`: chỉ hiển thị mô tả, không trình bày như số liệu chắc chắn.
- `qualitative`: chỉ hiển thị kết quả định tính.
- `hidden`: không render public.

## Không được làm

- Không tạo logo khách hàng giả.
- Không tạo testimonial giả.
- Không tạo % tăng trưởng giả.
- Không gọi use case mô phỏng là case study thực tế.
- Không hardcode nội dung trong component.
- Không dùng reference PNG full section.
- Không đổi route tiếng Việt.

## CMS

Dùng schema trong `docs/CMS_SCHEMA.md`.

## Go-live MVP

Bắt buộc:
- `/khach-hang`
- `/khach-hang/cau-chuyen-khach-hang`
- `/khach-hang/[slug]`
- featured case
- anonymized case support
- outcomes có evidence status
- logo wall có publish permission
- CTA liên hệ

## Output

- route
- components
- CMS collections
- seed data
- responsive
- screenshot 1440 / 1024 / 768 / 390
- checkpoint trạng thái
