# Triển khai trên Coolify — X Web Platform

Deploy lên server tự quản chạy **Coolify**. Mục tiêu: **1 PostgreSQL dùng chung** cho toàn nền tảng (không mỗi app một container DB) + **1 MinIO dùng chung** cho media.

> Bản Railway/Render/Fly xem `docs/DEPLOY.md`. Kiến trúc chat: `docs/CHAT_MODULE_HANDOFF.md`.

---

## 0. Điểm mấu chốt — chỉ **1 app** cần Postgres

| App | Loại | Cần Postgres? |
|---|---|---|
| `apps/cms` | Payload CMS (`@payloadcms/db-postgres`) | ✅ **Có** — `DATABASE_URL` |
| `apps/clay` | Next.js frontend | ❌ Không — gọi CMS qua HTTP (`CMS_URL`) |
| `apps/web` | Next.js frontend (chưa có Dockerfile) | ❌ Không |

`clay`/`web` chỉ là frontend đọc dữ liệu từ CMS qua REST → **không cần DB riêng**. Vì vậy chỉ cần **một** instance Postgres duy nhất cho CMS. Nếu sau này thêm app khác cần DB, **không tạo container mới** mà chỉ `CREATE DATABASE ten_moi;` bên trong instance sẵn có (xem §6).

`docker-compose.yml` ở gốc repo **chỉ dùng cho dev local** — KHÔNG deploy nó lên Coolify.

---

## 1. Kiến trúc trên Coolify (1 Project)

```
Project: x-web-platform
├─ PostgreSQL 16   (Database resource, dùng chung)   ← chỉ CMS kết nối
├─ MinIO           (Service resource, dùng chung)    ← CMS lưu media
├─ Application: cms   (apps/cms/Dockerfile)   port 3000
├─ Application: clay  (apps/clay/Dockerfile)  port 3000
└─ Application: web   (apps/web/Dockerfile)   port 3000   [tùy chọn — cần tạo Dockerfile trước]
```

Nguyên tắc Coolify: **Database = resource riêng**, **App = application riêng**. Không nhét Postgres vào compose của app.

---

## 2. PostgreSQL dùng chung (tạo 1 lần)

1. Project → **+ New → Database → PostgreSQL 16**.
2. Deploy xong, Coolify cấp **Internal connection string** dạng:
   ```
   postgres://<user>:<pass>@<db-hostname>:5432/postgres
   ```
   Copy lại — dán vào `DATABASE_URL` của app **cms**.
3. Bật **Automatic Backups** (Coolify có sẵn) cho DB này.

> App và DB phải cùng Project để dùng được internal hostname. Nếu Coolify báo không resolve được hostname, bật **"Connect To Predefined Network"** ở app, hoặc dùng chuỗi kết nối nội bộ Coolify gợi ý.

---

## 3. MinIO dùng chung (tạo 1 lần)

1. Project → **+ New → Service → MinIO**. Đặt `root user` / `root password`.
2. Vào MinIO Console → tạo bucket **`x-media`** → set **Access Policy = public (download)** để ảnh media đọc được từ trình duyệt.
3. Ghi lại: endpoint nội bộ (vd `http://<minio-hostname>:9000`), user, password.

---

## 4. Application `cms`

- **Source**: repo GitHub (`ccn112/web`), branch `main`.
- **Build Pack**: Dockerfile. **Dockerfile Location** = `apps/cms/Dockerfile`. **Base Directory / build context** = `/` (gốc repo).
- **Port**: `3000`. **Health check path**: `/api/health`.
- **Domain**: gán domain, vd `https://cms.tenmien.com`.

**Environment variables:**

```env
DATABASE_URL=postgres://<user>:<pass>@<db-hostname>:5432/postgres
PAYLOAD_SECRET=<chuỗi random ≥32 ký tự — openssl rand -base64 32>
PAYLOAD_PUBLIC_SERVER_URL=https://cms.tenmien.com
NODE_ENV=production
PAYLOAD_DB_PUSH=true        # CHỈ lần deploy đầu (bootstrap bảng); sau đó đổi false

# Media → MinIO dùng chung
USE_S3=true
S3_ENDPOINT=http://<minio-hostname>:9000
S3_BUCKET=x-media
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
S3_ACCESS_KEY_ID=<minio-user>
S3_SECRET_ACCESS_KEY=<minio-pass>

# Chat backend (CMS giữ key) — chọn 1 provider
CHAT_PROVIDER=anthropic
ANTHROPIC_API_KEY=<key mới đã rotate>
ANTHROPIC_MODEL=claude-haiku-4-5
CHAT_RATE_LIMIT_PER_MINUTE=20
CHAT_ANON_DAILY_MAX=12
CHAT_REG_DAILY_MAX=60

# Seed admin (lần đầu)
SEED_ADMIN_EMAIL=admin@tenmien.com
SEED_ADMIN_PASSWORD=<mật khẩu mạnh>
```

---

## 5. Application `clay` (và `web` nếu deploy)

- **Dockerfile Location** = `apps/clay/Dockerfile`, build context = `/`, port `3000`, health `/api/health`.
- **Environment variables** (cả clay và web giống nhau):

```env
CMS_URL=https://cms.tenmien.com
NEXT_PUBLIC_CMS_URL=https://cms.tenmien.com
NODE_ENV=production
```

> ⚠️ `NEXT_PUBLIC_CMS_URL` chạy trong **trình duyệt** → **bắt buộc domain public https**, không dùng hostname nội bộ Docker. `CMS_URL` (server↔server) có thể dùng internal hostname nếu cùng network, nhưng dùng domain public cho chắc chắn.
>
> `apps/web` **chưa có Dockerfile** — muốn deploy web thì tạo `apps/web/Dockerfile` (copy pattern từ `apps/clay/Dockerfile`, đổi `--filter @x/clay` → `@x/web`) trước.

---

## 6. Thêm app cần DB sau này (không tạo container mới)

Đúng mục tiêu tối ưu: 1 Postgres, nhiều database tách biệt bên trong.

```sql
-- kết nối vào Postgres dùng chung, chạy:
CREATE DATABASE app2;
CREATE USER app2 WITH PASSWORD '...';
GRANT ALL PRIVILEGES ON DATABASE app2 TO app2;
```
App mới trỏ `DATABASE_URL=postgres://app2:...@<db-hostname>:5432/app2`. 1 container, RAM/CPU tối ưu nhất.

---

## 7. Thứ tự deploy & khởi tạo (lần đầu)

1. Deploy **Postgres** + **MinIO** trước (tạo bucket `x-media`).
2. Deploy **cms** với `PAYLOAD_DB_PUSH=true` → Payload tự tạo bảng.
3. Mở `https://cms.tenmien.com/admin` → tạo user admin đầu tiên (hoặc chạy seed).
4. **Đổi `PAYLOAD_DB_PUSH=false`** → redeploy cms (từ đây dùng migrations, xem `docs/DEPLOY.md §3`).
5. Deploy **clay** (và **web**). Test chat trên site → phải stream + lưu `chat-sessions`/`chat-usage` trong CMS.

---

## 8. Checklist go-live

- [ ] Rotate `ANTHROPIC_API_KEY`; `PAYLOAD_SECRET` mạnh; mật khẩu admin mạnh.
- [ ] Postgres dùng chung chạy + backup bật; `DATABASE_URL` nối vào **cms**.
- [ ] MinIO chạy, bucket `x-media` public-download; CMS `USE_S3=true`, thử upload trong admin.
- [ ] Lần đầu `PAYLOAD_DB_PUSH=true` → tạo bảng → tạo admin → **đổi false**.
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` & `NEXT_PUBLIC_CMS_URL` = domain public CMS.
- [ ] clay/web: `CMS_URL` + `NEXT_PUBLIC_CMS_URL` trỏ CMS; test chat trên site.
- [ ] Auto-deploy: bật GitHub webhook trong Coolify để push `main` tự redeploy.
