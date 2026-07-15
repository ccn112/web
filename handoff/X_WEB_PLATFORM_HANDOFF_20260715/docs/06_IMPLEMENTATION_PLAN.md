# 06 — Implementation Plan

## Phase 0 — Bootstrap
- Next.js, Payload, PostgreSQL, MinIO.
- pnpm workspace.
- Docker Compose.
- ESLint, Prettier, TypeScript strict.
- CI build/test.

## Phase 1 — CMS Core
- Collections.
- Roles và access.
- Site resolver.
- Media.
- Draft/publish.
- Seed runner.

## Phase 2 — Design System & Page Builder
- Tokens theo từng site.
- Header/footer.
- 18 block.
- Responsive.
- SEO metadata.
- Sitemap, robots, JSON-LD.

## Phase 3 — Corporate Website
- Render seed corporate.
- Mega menu.
- Product pages.
- Services, deployment, insights, contact.

## Phase 4 — Product Websites
- Theme theo site.
- Render homepage + detail pages.
- Shared article template.
- Demo form.

## Phase 5 — Chatbot
- Shared widget.
- Prompt chips.
- Claude backend.
- Page/section context.
- Streaming.
- Feedback and analytics.

## Phase 6 — Hardening
- Lighthouse.
- Accessibility.
- Security headers.
- Rate limit.
- Backup/restore.
- Smoke test all seeded routes.

## Definition of Done

- Seed chạy idempotent.
- Không có route seed trả 404.
- CMS sửa nội dung và frontend cập nhật sau revalidation.
- Mỗi site có đúng logo/theme/menu.
- Chatbot không lộ API key.
- Form lưu submission và báo thành công.
