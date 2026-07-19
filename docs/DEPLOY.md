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
| `PAYLOAD_DB_PUSH` | `true` **chỉ cho lần deploy đầu** (bootstrap bảng), sau đó xóa/để `false` |

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
1. Deploy CMS với `PAYLOAD_DB_PUSH=true` → bảng được tạo.
2. Mở `https://<cms-domain>/admin` → Payload hiện màn **tạo user admin đầu tiên** (hoặc chạy `pnpm db:seed` để tạo admin + nội dung mẫu).
3. **Tắt `PAYLOAD_DB_PUSH`** (đặt `false` hoặc xóa) và chuyển sang migrations (mục 3).

---

## 3. Migrations (schema + seed — nguồn sự thật cho prod)

> ⚠️ **QUY ƯỚC:** ở prod (`NODE_ENV=production`) code ép `dbPush=false`. **Mọi thứ tạo DB — cả schema lẫn seed content — phải đi qua migration.** Không chạy `pnpm db:seed` thủ công trên prod; seed đã được đóng gói thành migration `apps/cms/src/migrations/*_seed_content.ts` (gọi `runSeed`), chạy sau migration schema.

**Tạo migration schema (một lần, với DB dev đang bật):**
```bash
# sinh migration từ schema hiện tại → apps/cms/src/migrations/<timestamp>_*.ts + cập nhật index.ts
pnpm --filter @x/cms exec payload migrate:create initial_schema
# Đảm bảo apps/cms/src/migrations/index.ts liệt kê: schema TRƯỚC, *_seed_content SAU.
git add apps/cms/src/migrations && git commit -m "db: initial schema + seed migration"
```
> File `99999999_999999_seed_content.ts` có tiền tố lớn để luôn xếp CUỐI (seed sau khi bảng đã tạo). Khi `migrate:create` sinh lại `index.ts`, kiểm tra nó vẫn import cả migration seed này (thêm dòng import + entry nếu bị thiếu).

**Đổi schema về sau:** `pnpm --filter @x/cms exec payload migrate:create <ten>` → commit. `runSeed` idempotent nên chạy lại an toàn.

**Trên prod, chạy migrate TRƯỚC khi app khởi động** (Railway: Pre-deploy/Release Command; CloudPanel/PM2: chạy trước `pm2 start`):
```bash
pnpm --filter @x/cms db:migrate      # chạy schema → rồi seed content
```

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
- [ ] Lần đầu: `PAYLOAD_DB_PUSH=true` → tạo bảng → tạo admin → tắt push.
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` & `NEXT_PUBLIC_CMS_URL` = domain public CMS.
- [ ] `CMS_URL` (clay) trỏ CMS; test chat trên site → stream + lưu `chat-sessions`/`chat-usage`.
- [ ] Media: `USE_S3=true` + bucket, thử upload trong admin.
- [ ] Chuyển sang migrations (release command `db:migrate`).
- [ ] (Nâng cấp) rate-limit/cap dùng chung qua Redis nếu chạy nhiều instance — xem handoff.
