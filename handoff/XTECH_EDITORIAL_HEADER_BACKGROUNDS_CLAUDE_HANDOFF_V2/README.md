# XTECH Editorial Header Backgrounds — Claude Code Handoff

Bộ handoff này dành cho các phần hero/header của nhóm trang nội dung thuộc corporate site XTECH, bám theo visual language hiện tại của website:
- nền tối xanh navy → cyan glow
- cảm giác công nghệ, AI, dữ liệu, network
- header có top navigation sáng màu và CTA màu gold
- text hero nằm phía trái, khối visual hoặc thẻ feature nằm phía phải

## Các màn áp dụng
1. Tin tức
2. Kinh nghiệm
3. Insights
4. Triển khai
5. Chi tiết tin tức

## Cấu trúc
- `assets/` : ảnh nền đã đổi tên theo màn
- `ROUTE_BACKGROUND_MAPPING.md` : mapping route → background → nội dung gợi ý
- `IMPLEMENTATION_GUIDE.md` : cách Claude Code dựng section tốt nhất
- `CMS_SEED_HINTS.md` : gợi ý seed data / tag liên quan phần mềm

## Nguyên tắc dùng ảnh
- Dùng ảnh làm **background hero** full-width, không đặt như card nhỏ.
- Luôn có 1 lớp overlay tối bên trên để đảm bảo chữ trắng đọc rõ.
- Ảnh nền chỉ là lớp visual support; text, badge, meta, CTA phải code bằng HTML.
- Ở mobile, ưu tiên crop center-right để vẫn giữ được vùng glow/tech motif.

## V2 update
- Bổ sung `MASTER_PROMPT_FOR_CLAUDE.md`.
- Nhấn mạnh ngôn ngữ hình ảnh công nghệ, AI, dữ liệu, cloud, integration và deployment.
- Yêu cầu CMS hóa cấu hình hero/header.
