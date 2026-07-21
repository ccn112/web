# Triển khai (Deploy) — X Web Platform

Đóng gói & deploy **2 app**: `apps/cms` (Payload: admin + API + backend chat, giữ key) và `apps/clay` (website public, proxy chat sang CMS). Postgres chạy như một **service** cùng nền tảng. CI/CD qua **GitHub Actions** + auto-deploy của PaaS.

> Kiến trúc chat & lý do proxy: xem `docs/CHAT_MODULE_HANDOFF.md`.

---

## 0. Chuẩn bị (bắt buộc làm trước)

1. **Đẩy code lên GitHub** (`ccn112/web`). `apps/clay` đã gộp vào monorepo nên chỉ cần 1 lần clone là đủ build (không còn submodule).
2. **Secrets — KHÔNG commit** (`.env` đã gitignore). Trước khi go-live:
   - 🔑 **Rotate `ANTHROPIC_API_KEY`**: key hiện tại từng nằm trong nhiều file dev → tạo key mới trong console Anthropic, dùng key mới cho prod.
   - 🔒 **`PAYLOAD_SECRET`**: chuỗi ngẫu nhiên dài — `openssl rand -base64 32`.
   - 🔒 **Đổi mật khẩu admin**: `SEED_ADMIN_PASSWORD` hiện là `Admin@12345` (yếu) → đặt mật khẩu mạnh cho prod.
   - Tất cả nạp qua **biến môi trường của service trên PaaS**, không đưa vào image.

---

## 1. Đóng gói (đã có sẵn trong repo)

| Artifact | Vai trò |
|---|---|
| `apps/cms/Dockerfile`, `apps/clay/Dockerfile` | Build image (multi-stage, pnpm monorepo, **Next standalone** → image nhỏ). Context build = **gốc repo**. |
| `.dockerignore` | Giữ context gọn + **loại `.env`** khỏi image. |
| `next.config` (cả 2 app) | `output: 'standalone'` + `outputFileTracingRoot` = gốc monorepo. |
| `/api/health` (cả 2 app) | Health check cho PaaS. |
| `.github/workflows/ci.yml` | CI: typecheck + lint + build 2 app. |

Đã kiểm thử: cả 2 app build standalone thành công và `node server.js` chạy, `/api/health` trả 200.

**Build/chạy thử cục bộ (tùy chọn, cần Docker):**
```bash
docker build -f apps/cms/Dockerfile  -t x-cms  .
docker build -f apps/clay/Dockerfile -t x-clay .
docker run --rm -p 3000:3000 --env-file .env x-cms
```

---

## 2. Deploy lên Railway (khuyến nghị)

Railway hợp với monorepo 2 app + Postgres service + auto-deploy từ GitHub. (Render/Fly xem mục 5 — Dockerfile dùng chung.)

### 2.1. Tạo project + Postgres
1. Railway → **New Project → Deploy from GitHub repo** → chọn `ccn112/web`.
2. **Add service → Database → PostgreSQL**. Railway cấp biến `DATABASE_URL` (dùng lại ở service CMS).

### 2.2. Service **CMS**
- **Source**: repo trên, **Dockerfile Path** = `apps/cms/Dockerfile`, **Root Directory** = `/` (context gốc).
- **Health check path**: `/api/health`.
- **Variables**:

| Biến | Giá trị |
|---|---|
| `DATABASE_URL` | tham chiếu Postgres service (`${{Postgres.DATABASE_URL}}`) |
| `PAYLOAD_SECRET` | chuỗi ngẫu nhiên mạnh |
| `PAYLOAD_PUBLIC_SERVER_URL` | **domain public https của CMS** (điền sau khi có domain) |
| `NODE_ENV` | `production` |
| `CHAT_PROVIDER` | `anthropic` |
| `ANTHROPIC_API_KEY` | key **mới** (đã rotate) |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5` |
| `CHAT_RATE_LIMIT_PER_MINUTE` / `CHAT_ANON_DAILY_MAX` / `CHAT_REG_DAILY_MAX` | `20` / `12` / `60` |
| `USE_S3` + `S3_*` | lưu media (xem mục 4) |
| `PAYLOAD_DB_PUSH` | để trống — đã có migration khởi tạo, dùng `db:migrate` thay thế (mục 2.5). Chỉ set `true` nếu cần dự phòng. |

### 2.3. Service **clay**
- **Dockerfile Path** = `apps/clay/Dockerfile`, Root = `/`. Health = `/api/health`.
- **Variables**:

| Biến | Giá trị |
|---|---|
| `CMS_URL` | URL **nội bộ** của CMS (proxy server-side, nhanh/riêng tư): `http://${{CMS.RAILWAY_PRIVATE_DOMAIN}}:${{CMS.PORT}}` |
| `NEXT_PUBLIC_CMS_URL` | **domain public https của CMS** (trình duyệt tải ảnh media qua đây) |
| `NODE_ENV` | `production` |

> ⚠️ Phân biệt: `CMS_URL` (server↔server, có thể dùng domain nội bộ) khác `NEXT_PUBLIC_CMS_URL` (trình duyệt phải truy cập được → **phải là domain public**). Ảnh Payload trả URL tuyệt đối theo `PAYLOAD_PUBLIC_SERVER_URL`, nên đặt nó = domain public CMS.

### 2.4. Domain
- Gán domain cho từng service (Railway cấp `*.up.railway.app` hoặc custom domain).
- Sau khi có domain CMS → cập nhật `PAYLOAD_PUBLIC_SERVER_URL` và `NEXT_PUBLIC_CMS_URL`, redeploy.

### 2.5. Khởi tạo dữ liệu (lần đầu)

Đã có sẵn **migration khởi tạo** (`apps/cms/src/migrations/*_initial.ts`) nên **KHÔNG cần** `PAYLOAD_DB_PUSH` nữa — dùng migrate cho sạch:

1. DB rỗng → chạy `pnpm --filter @x/cms db:migrate` (Release Command của Railway) → migration tạo toàn bộ bảng.
2. Nạp dữ liệu — chọn **1 trong 2**:
   - **A. Bê nguyên hiện trạng (khuyến nghị go-live):** restore bản dump từ DB dev — giữ đúng 57 pages / 7 posts / 8 service-sections / menus / media metadata / user như đang chạy local:
     ```bash
     pg_restore --clean --if-exists --no-owner --no-privileges -d "$DATABASE_URL" xweb_<ts>.dump
     ```
   - **B. Seed nội dung nền từ handoff:** `pnpm --filter @x/cms db:seed` → tạo admin + nội dung baseline. ⚠️ Seed **upsert theo natural key** nên sẽ **ghi đè** page/post trùng slug bằng bản handoff — **đừng chạy trên DB đã có nội dung sống** (chỉ dùng cho DB trắng). Media 185MB ở `apps/cms/media` phải đưa lên S3/volume (mục 4) để ảnh không vỡ.
3. Media: bật `USE_S3=true` + bucket (mục 4), rồi upload thư mục `apps/cms/media` lên bucket (hoặc gắn volume bền).

> `PAYLOAD_DB_PUSH=true` giờ chỉ là phương án dự phòng nếu vì lý do nào đó không chạy được migrate.

---

## 3. Migrations (schema) + seed content

Dev auto-`push` schema; **prod ép `dbPush=false`** (code trong `payload.config.ts` khi `NODE_ENV=production`) nên đổi schema phải qua **migration**. Migration khởi tạo schema đã có sẵn trong repo: `apps/cms/src/migrations/20260720_011627_initial.ts`, đăng ký trong `index.ts`.

> Seed content cũng được đóng gói sẵn thành migration `apps/cms/src/migrations/99999999_999999_seed_content.ts` (gọi `runSeed`, tiền tố lớn để chạy SAU schema). **Mặc định nó KHÔNG được đăng ký trong `index.ts`** — vì bản deploy CloudPanel này nạp dữ liệu bằng **pg_dump** (mục 3.1 + `deploy.sh --import-db`, khuyến nghị go-live) để giữ đúng hiện trạng local. Nếu muốn dùng seed-qua-migration thay cho pg_dump, thêm dòng `import` + entry cho `99999999_999999_seed_content` vào `index.ts` (đặt SAU schema) rồi `db:migrate`.

**Tạo migration schema (một lần, với DB dev đang bật):**
```bash
# tạo migration mới khi đổi schema (chạy với DB dev đang bật)
pnpm --filter @x/cms db:migrate:create <ten_migration> --forceAcceptWarning
# Kiểm tra apps/cms/src/migrations/index.ts: schema TRƯỚC, (tùy chọn) *_seed_content SAU.
git add apps/cms/src/migrations && git commit -m "db: <ten_migration>"
```
> File `99999999_999999_seed_content.ts` có tiền tố lớn để luôn xếp CUỐI (seed sau khi bảng đã tạo). Khi `migrate:create` sinh lại `index.ts`, kiểm tra nó vẫn import cả migration seed này (thêm dòng import + entry nếu bị thiếu).

**Đổi schema về sau:** `pnpm --filter @x/cms exec payload migrate:create <ten>` → commit. `runSeed` idempotent nên chạy lại an toàn.

**Trên prod, chạy migrate TRƯỚC khi app khởi động** (Railway: Pre-deploy/Release Command; CloudPanel/PM2: chạy trước `pm2 start`):
```bash
pnpm --filter @x/cms db:migrate      # chạy schema → rồi seed content
```

### 3.1. Backup / bê dữ liệu hiện trạng (pg_dump)

Nguồn "dữ liệu hiện trạng" là **DB Postgres**, không phải file seed. Tạo bản dump:
```bash
# custom format (nén, dùng cho pg_restore) — pg_dump có trong C:\Program Files\PostgreSQL\18\bin
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-privileges -f backups/xweb_<ts>.dump
```
Dump ôm cả bảng `users` (hash mật khẩu) và `chat_*`. Muốn bản "sạch" thì thêm `--exclude-table-data='chat_*'` và đổi mật khẩu admin sau khi restore. Thư mục `backups/` đã được gitignore.

---

## 4. Lưu trữ media (quan trọng với PaaS)

Filesystem của PaaS **ephemeral** (mất khi redeploy). Media upload của Payload phải để ở nơi bền:
- **Khuyến nghị: S3** (AWS S3 / Cloudflare R2 / bất kỳ S3-compatible). Đặt `USE_S3=true` + `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE` (true cho R2/MinIO). MinIO trong `docker-compose.yml` chỉ dùng cho **dev**.
- Hoặc gắn **volume bền** vào service CMS và trỏ thư mục media vào đó (Railway Volumes).

---

## 5. CI/CD

- **CI** (`.github/workflows/ci.yml`): mỗi push/PR vào `main` chạy typecheck + lint + build 2 app → chặn merge nếu hỏng.
- **CD**: Railway tự **redeploy** service khi có push mới vào `main` (bật GitHub trigger). Muốn deploy chỉ khi CI xanh: bật "Wait for CI" trong Railway, hoặc dùng workflow deploy riêng gọi Railway CLI với `RAILWAY_TOKEN` (secret trong GitHub).

---

## 6. Render / Fly.io (thay thế)

Dockerfile portable nên dùng được:
- **Render**: mỗi app = 1 *Web Service* (Docker), Root = repo, Dockerfile path tương ứng; thêm *PostgreSQL* managed; set env như trên; health `/api/health`.
- **Fly.io**: `fly launch --dockerfile apps/cms/Dockerfile` cho mỗi app; Postgres qua `fly postgres create`; set secrets bằng `fly secrets set`.

---

## 7. Checklist trước khi go-live

- [ ] Đẩy `main` lên GitHub, CI xanh.
- [ ] Rotate `ANTHROPIC_API_KEY`; `PAYLOAD_SECRET` mạnh; mật khẩu admin mạnh.
- [ ] Postgres service chạy; `DATABASE_URL` đã nối vào CMS.
- [ ] Lần đầu: `db:migrate` (Release Command) tạo bảng → restore dump **hoặc** `db:seed` → tạo/đổi mật khẩu admin.
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` & `NEXT_PUBLIC_CMS_URL` = domain public CMS.
- [ ] `CMS_URL` (clay) trỏ CMS; test chat trên site → stream + lưu `chat-sessions`/`chat-usage`.
- [ ] Media: `USE_S3=true` + bucket, thử upload trong admin.
- [ ] Chuyển sang migrations (release command `db:migrate`).
- [ ] (Nâng cấp) rate-limit/cap dùng chung qua Redis nếu chạy nhiều instance — xem handoff.
