# Session Handoff — tiếp tục ở máy khác

Cập nhật: 2026-07-18. Commit mới nhất trên GitHub: `main` = `feat/cms-illustration-pipeline` = **5d25d9d**. Repo: `github.com/ccn112/web`.

Tài liệu này để bạn (hoặc Claude ở máy khác) tiếp tục nhanh. Bối cảnh chi tiết nằm ở: `docs/CHAT_MODULE_HANDOFF.md`, `docs/CHAT_PROVIDERS.md`, `docs/DEPLOY.md`.

---

## 1. Setup trên máy mới

```bash
git clone https://github.com/ccn112/web.git
cd web
# yêu cầu: Node 22, pnpm 9.15.0 (corepack enable && corepack prepare pnpm@9.15.0 --activate)
pnpm install

# hạ tầng dev (Postgres + MinIO)
docker compose up -d postgres minio

# tạo .env ở GỐC repo (KHÔNG có trong git) — copy từ template rồi điền
cp .env.example .env
```

Điền `.env` (xem mục 2 để biết giá trị nào là bí mật cần mang qua):
```bash
pnpm --filter @x/cms dev     # CMS: http://localhost:3000  (admin /admin)
pnpm --filter @x/clay dev    # Site: http://localhost:3001/?site=corporate
```
Lần đầu vào `http://localhost:3000/admin` để tạo user admin, hoặc `pnpm db:seed` (tạo admin + nội dung mẫu). Dev tự tạo bảng (push).

## 2. Env / secrets (KHÔNG nằm trong git — phải mang qua)

`.env` ở gốc repo bị gitignore. Máy mới cần điền lại. Các biến **không bí mật** đã có sẵn giá trị đúng trong `.env.example`. Các biến **bí mật** phải mang qua bằng kênh an toàn (không qua git/chat):

| Biến | Loại | Ghi chú |
|---|---|---|
| `DATABASE_URL` | dev: dùng như `.env.example` | `postgres://xweb:xweb@localhost:5432/xweb` (khớp docker-compose) |
| `PAYLOAD_SECRET` | 🔒 bí mật | dev có thể tùy ý; prod dùng chuỗi mạnh riêng |
| `ANTHROPIC_API_KEY` | 🔒 bí mật | key chat. Mang từ máy cũ, HOẶC tạo key mới ở console Anthropic |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | 🔒 | admin đầu tiên |
| `CHAT_PROVIDER` | thường | `anthropic` |
| `ANTHROPIC_MODEL` | thường | **`claude-haiku-4-5`** (rẻ nhất — đừng để sonnet-5) |
| `CHAT_RATE_LIMIT_PER_MINUTE`/`CHAT_ANON_DAILY_MAX`/`CHAT_REG_DAILY_MAX` | thường | 20 / 12 / 60 |

> ⚠️ Máy cũ này còn giữ `.env` thật (đầy đủ key). Cách nhanh nhất: copy `.env` từ máy cũ sang máy mới qua USB/kênh mã hoá — KHÔNG commit, KHÔNG gửi chat.

## 3. Việc session này đã làm

1. **Chuyển backend chat sang CMS** (module tái dùng): key + logic LLM ở `apps/cms/src/lib/chat/` (`providers.ts` đa nhà cung cấp, `store.ts` Payload Local API, `service.ts` guardrail/limit). Endpoint `apps/cms/src/app/(chat)/api/chat/{route,register,sessions}`. `apps/clay` giờ chỉ **proxy** (`src/app/api/chat/*`) — không giữ key. → `docs/CHAT_MODULE_HANDOFF.md`.
2. **Đóng gói deploy**: Dockerfile cms+clay (Next standalone), `.dockerignore`, `/api/health`, `.github/workflows/ci.yml`, `payload.config` có `PAYLOAD_DB_PUSH` gated. → `docs/DEPLOY.md`.
3. **Gộp apps/clay vào monorepo** (bỏ submodule — trước đây là gitlink không remote, clone bị rỗng). Giờ clone 1 lần đủ build.
4. **Đẩy toàn bộ lên GitHub** (`main` @ 5d25d9d). CI tự chạy trên `main`.

## 4. Gotchas cần nhớ

- **Chat model** lấy từ **root `.env` `ANTHROPIC_MODEL`** (CMS đọc). Giữ `claude-haiku-4-5` (rẻ nhất). Chỉ chat đọc biến này.
- `CMS_URL` (clay→cms, server-side) ≠ `NEXT_PUBLIC_CMS_URL` (trình duyệt, phải là domain public CMS).
- CMS là Next app; route chat nằm cạnh catch-all của Payload (`(chat)` group) — static thắng catch-all, không xung đột.
- Rate-limit/daily-cap hiện **in-memory** trong tiến trình CMS (reset khi restart; đúng cho 1 instance). Nhiều instance → cần Redis.
- Media trên PaaS **ephemeral** → prod phải `USE_S3=true` + bucket.
- **Windows/curl**: query Payload REST có `[ ]` phải thêm `curl -g` (globoff), nếu không lỗi URL.
- Backup lịch sử git cũ của clay (`clay-history-backup.bundle`) chỉ nằm trong scratchpad của **máy cũ** — không lên git. Thường không cần; muốn giữ thì copy tay.

## 5. Việc tiếp theo (TODO)

- [ ] Xem **Actions** trên GitHub — CI phải xanh (nếu đỏ, lấy log sửa).
- [ ] **Deploy Railway** theo `docs/DEPLOY.md`: rotate secrets (key Anthropic mới, PAYLOAD_SECRET mạnh, mật khẩu admin mạnh) → Postgres service → 2 service Dockerfile → lần đầu `PAYLOAD_DB_PUSH=true` → tạo admin → tắt push.
- [ ] Sau bootstrap: **tạo migrations** (`pnpm db:migrate:create`), commit, prod chạy `pnpm --filter @x/cms db:migrate` (release command).
- [ ] Media: bật S3/R2.
- [ ] (Tùy chọn, đã bàn) **Chat Settings global** trong CMS để đổi provider/model/cap không cần deploy.
- [ ] (Tùy chọn) workflow CD gọi Railway sau khi CI xanh (`RAILWAY_TOKEN` secret).
- [ ] (Nâng cấp) Redis cho rate-limit/cap phân tán; upload file lớn qua S3 thay base64.

## 6. Xác minh nhanh sau khi setup máy mới

```bash
# chat qua proxy clay → cms → provider (cần ANTHROPIC_API_KEY trong .env)
curl -sN -X POST http://localhost:3001/api/chat -H 'content-type: application/json' \
  -d '{"deviceId":"dev1","sessionId":"s1","message":"XTECH là gì?","siteCode":"corporate","route":"/"}'
# health
curl http://localhost:3000/api/health   # {"ok":true,"service":"cms"}
curl http://localhost:3001/api/health   # {"ok":true,"service":"clay"}
```
