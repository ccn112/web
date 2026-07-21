# CI/CD — Auto deploy lên VPS (GitHub Actions → CloudPanel/PM2)

Pipeline này **tự động deploy** mỗi khi push `main`: GitHub Actions chạy CI (typecheck·lint·build),
CI xanh thì SSH vào VPS và chạy `deploy.sh` — script đã lo trọn **migrate dữ liệu** (`payload migrate`)
và **build giao diện** (cms + clay) rồi PM2 reload + health check.

> Đây là hướng đang dùng cho prod (CloudPanel + PM2, **không Docker**). Hướng Docker/PaaS xem `docs/DEPLOY.md`.

```
push main ─► job build (CI)  ─needs─►  job deploy ─SSH─► VPS: BRANCH=main ./deploy.sh
             typecheck·lint·build       (chỉ push main,      reset→install→migrate→build→pm2→health
             build lỗi = KHÔNG deploy     bỏ qua PR)
```

File workflow: `.github/workflows/ci.yml` (jobs `build` + `deploy`).

---

## 1. Chuẩn bị trên VPS (làm 1 lần)

1. **Clone repo** về đúng thư mục site trên VPS, ví dụ `/home/xweb/htdocs/web`, và đã `deploy.sh` chạy tay
   thành công ít nhất 1 lần (đã có `.env`, `apps/clay/.env.production`, đã `--import-db` bootstrap DB).
2. **Tạo SSH deploy key riêng cho CI** (đừng dùng key cá nhân):
   ```bash
   ssh-keygen -t ed25519 -C "gh-actions-deploy" -f ~/.ssh/gh_deploy -N ""
   cat ~/.ssh/gh_deploy.pub >> ~/.ssh/authorized_keys   # public key -> cho phép CI đăng nhập
   chmod 600 ~/.ssh/authorized_keys
   cat ~/.ssh/gh_deploy                                  # PRIVATE key -> copy dán vào secret VPS_SSH_KEY
   ```
3. Kiểm tra `node`/`pnpm`/`pm2` gọi được trong **SSH không tương tác**:
   ```bash
   ssh -i ~/.ssh/gh_deploy <user>@<host> 'node -v; pnpm -v; pm2 -v'
   ```
   Nếu thiếu → cài nvm/pnpm/pm2 cho user đó. Workflow đã tự `source ~/.nvm/nvm.sh` và `~/.profile`,
   nhưng nếu môi trường khác, chỉnh khối `script:` trong `ci.yml` cho khớp PATH.

## 2. Khai báo GitHub Secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Ý nghĩa | Ví dụ |
|---|---|---|
| `VPS_HOST` | IP/hostname VPS | `123.45.67.89` |
| `VPS_USER` | user SSH (chủ site) | `xweb` |
| `VPS_SSH_KEY` | **private key** vừa tạo (cả `-----BEGIN...END-----`) | nội dung `~/.ssh/gh_deploy` |
| `VPS_PORT` | cổng SSH (bỏ trống nếu 22) | `22` |
| `VPS_PATH` | đường dẫn tuyệt đối tới repo trên VPS | `/home/xweb/htdocs/web` |

## 3. (Khuyến nghị) Cổng duyệt tay trước khi migrate DB prod

Repo → **Settings → Environments → New environment** tên **`production`** → bật **Required reviewers**
(thêm chính bạn). Từ đó mỗi lần deploy sẽ **chờ bạn bấm Approve** trong tab Actions rồi mới migrate + build —
tránh migration ngoài ý muốn lên DB thật. (Job `deploy` đã gắn `environment: production`.)

---

## 4. Dùng hằng ngày

- **Deploy tự động:** cứ merge/push vào `main`. Xem tiến trình ở tab **Actions**.
- **Deploy tay:** tab Actions → workflow **CI/CD** → **Run workflow** (dùng `workflow_dispatch`).
- **Xem log deploy:** mở job `deploy` trong Actions; hoặc trên VPS `pm2 logs`.

## 5. Các việc KHÔNG tự động (cố ý — cần chủ động trên VPS)

| Việc | Lệnh (trên VPS) | Vì sao không đưa vào CI |
|---|---|---|
| **Import DB lần đầu / khôi phục** | `./deploy.sh --import-db` | Ghi đè toàn bộ dữ liệu — chỉ làm thủ công có xác nhận |
| **Tạo migration mới** | `pnpm db:migrate:create <tên>` (máy dev) rồi commit | Sinh file schema phải review; CI chỉ *áp dụng* migration đã commit |
| **Copy media (khi `USE_S3=false`)** | rsync `apps/cms/media` → `MEDIA_DIR` | File nhị phân, không nằm trong git |
| **Đổi biến môi trường** | sửa `.env` / `apps/clay/.env.production` trên VPS | Secret không commit; `NEXT_PUBLIC_*` được build lại ở bước deploy nên có hiệu lực sau lần deploy kế |

## 6. Rollback

`deploy.sh` dùng `git reset --hard origin/main`, nên rollback = trỏ `main` về commit tốt rồi deploy lại:
```bash
git revert <commit-hỏng>   # hoặc reset về commit tốt rồi push --force-with-lease
git push origin main       # CI/CD tự deploy lại
```
> Lưu ý: **migration KHÔNG tự rollback**. Nếu bản lỗi đã migrate DB, cần migration "down" hoặc khôi phục
> từ dump trong `./backups` bằng `./deploy.sh --import-db --dump <file>`.
