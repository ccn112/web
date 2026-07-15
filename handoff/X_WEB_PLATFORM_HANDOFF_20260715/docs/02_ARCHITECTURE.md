# 02 — Architecture

## Kiến trúc chốt

```text
Cloudflare / Reverse Proxy
        |
        +-- Corporate Next.js
        +-- XBooking Next.js
        +-- FinERP Next.js
        +-- XBuilding Next.js
        +-- X.AI Next.js
        +-- X.Space Next.js
                  |
                  +---- Payload CMS API
                  |       +-- PostgreSQL
                  |       +-- S3 / MinIO
                  |
                  +---- /api/chat
                          +-- Claude API
```

## Monorepo đề xuất

```text
apps/
  web/                 # Một Next.js runtime hỗ trợ nhiều host ở MVP
  cms/                 # Payload config/admin
packages/
  ui/
  content-blocks/
  cms-client/
  chatbot-widget/
  seo/
  shared-types/
infrastructure/
  docker/
```

### Quyết định thực dụng cho MVP

Dùng **một Next.js frontend runtime multi-domain** trước để giảm build/deploy. Hostname xác định `siteCode`.  
Khi từng sản phẩm cần release độc lập, tách thành nhiều app nhưng vẫn dùng chung packages.

## Site resolution

1. Đọc `Host` header.
2. Map domain → `Sites.primaryDomain`.
3. Development cho phép `?site=xbooking`.
4. Mọi query page/post/menu bắt buộc có `site`.
5. Cache key phải gồm `siteCode + locale + pathname`.

## Bảo mật

- Claude API key chỉ ở server.
- CMS Admin không public qua cùng domain sản phẩm nếu triển khai production.
- Validate form bằng schema.
- Rate limit `/api/chat` và form.
- Không đưa draft content vào public API.
- Không log dữ liệu nhạy cảm trong prompt.
