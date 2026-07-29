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
   chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys
   cat ~/.ssh/gh_deploy                                  # PRIVATE key -> copy dán vào secret VPS_SSH_KEY
   ```
   **Nếu key CÓ passphrase** (`-N ""` ở trên là key KHÔNG passphrase): phải thêm secret
   `VPS_SSH_PASSPHRASE`, nếu không job `deploy` fail ngay ở bước mở key — và **lỗi báo ra không hề
   nhắc tới passphrase**, nó giống hệt lỗi "key bị server từ chối" (xem §6).

   > Cân nhắc: passphrase **không thêm bảo mật nào trong CI** — nó phải nằm trong GitHub Secrets ngay
   > cạnh private key, cùng một vùng tin cậy: ai đọc được secret này thì đọc được cả secret kia. Nó chỉ
   > thêm một chỗ để hỏng. Key deploy chuyên dụng, không passphrase, giới hạn quyền (user riêng /
   > `command=` trong `authorized_keys`) là hướng gọn hơn.
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
| `VPS_SSH_PASSPHRASE` | passphrase của key — **bắt buộc nếu key có passphrase**, bỏ trống nếu không | |
| `VPS_PORT` | cổng SSH (bỏ trống nếu 22) | `22` |
| `VPS_PATH` | đường dẫn tuyệt đối tới repo trên VPS | `/home/xweb/htdocs/web` |

> `VPS_USER` phải là **đúng user có public key trong `~/.ssh/authorized_keys`**. Nếu bạn SSH vào VPS
> bằng `root` thì key nằm ở `/root/.ssh/authorized_keys` → `VPS_USER=root`. Đừng copy ví dụ `xweb`
> ở bảng trên nếu thực tế không tạo user đó.

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

## 7. Gỡ lỗi job `deploy`

### `ssh: handshake failed: ... attempted methods [none publickey], no supported methods remain`

**Dòng lỗi này mơ hồ hơn vẻ ngoài của nó** — nó KHÔNG chứng minh key đã tới được server. Trong Go
`x/crypto/ssh`, method được append vào danh sách `tried` **cả khi thất bại**, kể cả khi danh sách signer
rỗng. Nên ba nguyên nhân khác nhau ra cùng một dòng:

| Nguyên nhân | Cách xác nhận |
|---|---|
| **Key có passphrase mà không truyền `passphrase`** | Xem `INPUT_PASSPHRASE:` trong log Actions — rỗng là thiếu. Client chưa từng gửi gì lên server |
| `VPS_USER` sai user (key nằm ở `authorized_keys` của user khác) | `auth.log` trên VPS ghi `Invalid user <tên>` |
| Public key chưa có trong `authorized_keys`, hoặc sai quyền file | `auth.log` ghi `Failed publickey for <user>` / `Authentication refused: bad ownership or modes` |

Phân biệt nhanh: **cái gì đến được bước auth thì host/port đã đúng.** Nếu `VPS_HOST`/`VPS_PORT` sai thì
lỗi phải là `dial tcp: i/o timeout` hoặc `connection refused`, không phải lỗi auth.

Nguồn duy nhất nói thẳng lý do là log của `sshd` **trên VPS**:
```bash
grep -iE 'sshd.*(Failed|Invalid|Connection closed|authentication|refused)' /var/log/auth.log | tail -20
ls -ld ~ ~/.ssh; ls -l ~/.ssh/authorized_keys   # .ssh phải 700, authorized_keys 600, home không group-writable
ssh-keygen -lf ~/.ssh/authorized_keys           # fingerprint các key đang được chấp nhận
```
Nếu `auth.log` **không có dòng nào** ứng với thời điểm chạy job → client chưa hề kết nối tới bước auth
→ lỗi nằm ở phía GitHub (passphrase / key không parse được), không phải phía VPS.
