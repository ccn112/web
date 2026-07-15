# 04 — Image Usage Rules

## Quy tắc bắt buộc

- Logo website dùng file gốc trong `brand/`.
- Không để Claude hoặc AI vẽ lại logo.
- Không trích logo từ ảnh minh họa để dùng làm header, favicon hoặc component.
- Ảnh trong `assets/workflow/` là ảnh minh họa nội dung.
- Không dùng screenshot như toàn bộ giao diện website.
- Chữ chính, CTA và nội dung SEO phải render bằng HTML.

## Tối ưu

Từ PNG gốc, tạo:

- WebP chất lượng 82.
- AVIF chất lượng 55–65.
- Thumbnail 640px.
- Desktop 1600px.
- Giữ PNG gốc để lightbox.

## Alt text

Dùng đúng `altText` trong `workflow-assets.json`.

## Visual QA

- Không crop mất laptop hoặc điện thoại.
- Ảnh 16:9 dùng `object-fit: contain`.
- Nền panel có thể là navy hoặc light gray theo theme.
- Không thêm logo mới lên trên ảnh.
