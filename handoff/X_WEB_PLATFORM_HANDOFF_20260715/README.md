# X Web Platform — Claude Code Handoff

Phiên bản: 2026-07-15  
Mục tiêu: chạy được hệ quản trị nội dung multi-site, website Corporate + 5 website sản phẩm, landing page, seed nội dung, menu, SEO, form và chatbot Claude đơn giản.

## Phạm vi MVP

- Next.js App Router + TypeScript.
- Payload CMS + PostgreSQL.
- Multi-site bằng collection `Sites` và trường `site` trên nội dung.
- Page Builder theo block.
- Media dùng S3/MinIO.
- Payload Authentication và Access Control.
- Corporate site và 5 product site dùng chung CMS.
- Chatbot gọi Claude qua backend; nhận ngữ cảnh site/page/section.
- Seed có 6 site, 42 page, 3 bài viết, menu và prompt mẫu.
- Docker Compose cho local/dev và làm nền cho production.

## Trình tự cho Claude Code

1. Đọc `docs/01_PRODUCT_SCOPE.md`.
2. Đọc `docs/02_ARCHITECTURE.md`.
3. Đọc `docs/03_CONTENT_MODEL.md`.
4. Đọc `docs/04_PAGE_BLOCKS.md`.
5. Đọc `docs/05_AI_CHATBOT.md`.
6. Đọc `docs/06_IMPLEMENTATION_PLAN.md`.
7. Đọc `claude/CLAUDE.md` và `claude/MASTER_PROMPT.md`.
8. Khởi tạo code, migration và seed từ thư mục `seed/`.
9. Chạy checklist trong `claude/ACCEPTANCE_CRITERIA.md`.

## Lệnh mục tiêu

```bash
pnpm install
docker compose up -d postgres minio
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Kết quả mong muốn:

- CMS: `http://localhost:3000/admin`
- Corporate: `http://localhost:3000`
- Product sites có thể chạy theo port hoặc hostname local.
- Dữ liệu seed xuất hiện đầy đủ.
- Chatbot chạy khi có `ANTHROPIC_API_KEY`; nếu chưa có key, widget hiển thị trạng thái demo an toàn.
