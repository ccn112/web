# IMPLEMENTATION STATUS — X Web Platform

Checklist sống. Đây là nguồn sự thật về **cái gì đã xong / còn treo**. Lý do thiết kế xem
`DECISIONS.md`; bề mặt route xem `ROUTE_INVENTORY.md`; nhật ký từng phiên xem `docs/CHANGELOG.md`.

Cập nhật: **2026-07-29** (HEAD `6340bcd`). Ký hiệu: ✅ xong · 🚧 đang làm · ⬜ chưa bắt đầu · ⛔ đang chặn

---

## 🔴 Đang chặn: auto-deploy không SSH được vào VPS

**CI xanh, CD đỏ.** Job `build` đã xanh từ `a779853` (2026-07-27). Job `deploy` fail sau **4–5 giây**
ở bước bắt tay SSH — nên `deploy.sh` **chưa bao giờ chạy trên VPS** qua CI, kể cả một lần.

```
ssh: handshake failed: ssh: unable to authenticate,
     attempted methods [none publickey], no supported methods remain
```

Đã loại trừ:
- ✅ 5 secret `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` / `VPS_PORT` / `VPS_PATH` đều **có giá trị**
  (log Actions mask thành `***` → không rỗng).
- ✅ Environment `production` **không có** protection rule → job không đứng chờ approve.
- ✅ Private key **parse được** và đã được gửi lên server (thông điệp là "publickey bị **từ chối**",
  không phải "không đọc được key") → secret không bị dán hỏng, không phải key có passphrase.

→ Nguyên nhân nằm **phía VPS**: public key tương ứng không được `sshd` chấp nhận cho `VPS_USER`.
Xếp theo xác suất: (1) `~/.ssh/authorized_keys` của đúng user đó không chứa key — hoặc key đã sinh lại
sau khi dán secret; (2) `VPS_USER` sai user (key nằm ở `root` nhưng deploy bằng user site CloudPanel,
hoặc ngược lại); (3) quyền file — `~/.ssh` phải 700, `authorized_keys` 600, home **không** được
group/other-writable, sai là `sshd` bỏ qua im lặng; (4) `sshd_config` chặn (`PubkeyAuthentication`,
`AllowUsers`, hardening của CloudPanel).

Lệnh chẩn đoán, chạy **trên VPS** (xem thêm `docs/CI_CD.md` §1):
```bash
whoami; ls -ld ~ ~/.ssh; ls -l ~/.ssh/authorized_keys      # user + quyền
ssh-keygen -lf ~/.ssh/gh_deploy.pub                        # fingerprint key CI
grep -c 'gh-actions-deploy' ~/.ssh/authorized_keys         # key đã được nạp chưa
sudo tail -50 /var/log/auth.log | grep -i sshd             # lý do sshd từ chối (dòng chính xác)
```
> Lưu ý: `VPS_SSH_KEY` đã được cập nhật lại lúc 2026-07-21T10:27Z mà **vẫn fail** → dán lại key
> một lần nữa gần như chắc chắn không giải quyết được; phải xem log `auth.log` phía server.

### ⚠️ Đi kèm: prod không có cổng duyệt tay
`production` có `protection_rules: []`. **Ngay khi SSH thông**, mọi push vào `main` sẽ tự chạy
`payload migrate` + build + `pm2 reload` lên prod, không ai duyệt. `docs/CI_CD.md` §3 đã khuyến nghị bật
**Required reviewers** nhưng chưa bật. Nên bật *trước* khi vá SSH, không phải sau.

---

## Phase 0 — Bootstrap ✅
- ✅ pnpm workspace, TypeScript strict base, Prettier, `.env.example`, Docker Compose (postgres + minio)
- ✅ Handoff docs: `DECISIONS.md`, `ROUTE_INVENTORY.md`, `docs/*`
- ✅ `packages/`: `shared-types`, `cms-client`, `content-blocks`, `ui`, `chatbot-widget`, `seo`
- ✅ ESLint flat config per-app — `pnpm -r typecheck` và `pnpm -r lint` **xanh** (vá ở `a779853`)
- ✅ CI build/test → `.github/workflows/ci.yml` job `build`: install · typecheck · lint · build cms + clay
- ⛔ CD → job `deploy`: xem mục chặn ở trên

## Phase 1 — CMS Core ✅
- ✅ Payload app (`apps/cms`): admin + REST + GraphQL, Postgres adapter `idType: 'uuid'`, S3/MinIO (`USE_S3`)
- ✅ Access control 5 role + `allowedSites`; published-only public read; workflow draft→published→archived
- ✅ **27 collection** đã đăng ký (từ 14 ban đầu): thêm nhóm chat (`ChatSessions`, `ChatUsers`,
  `ChatUsage`), nhóm lead (`Leads`, `LeadDevices`, `LeadConversations`, `LeadMessages`, `LeadActivities`,
  `ResumeTokens`, `Consultants`, `ConsultantAssignments`, `EmailTemplates`) và `ServiceSections`
- ✅ 18 page-builder block · seed runner idempotent
- ✅ **5 migration** đã đăng ký: `initial` · `add_editorial_solution_fields` · `add_lead_consultation` ·
  `add_payload_jobs` · `seed_content` (data migration, chạy cuối, idempotent)
- ✅ Jobs queue (`payload_jobs` + `payload_jobs_log`), runner qua **GET** `/api/payload-jobs/run` + `CRON_SECRET`
- ✅ Cổng chặn schema: `deploy.sh` kiểm `payload_locked_documents_rels` đủ 27 cột trước khi build
  (migration bị baseline khống làm admin chết Postgres 42703) · vá bằng `scripts/fix-lead-schema.sh`
- ⬜ Unit test access-control + seed-idempotency

## Phase 2–4 — Frontend ✅ (đã đổi app chủ lực)
**`apps/clay` là frontend đang ship**, không phải `apps/web`. `deploy.sh` chỉ build `@x/cms` + `@x/clay`.
- ✅ `apps/clay`: `[[...slug]]` catch-all + `/search`, `sitemap.ts`, `robots.ts`, middleware đa domain,
  component theo mảng (`corporate`, `product`, `solutions`, `suites`, `services`, `insights`, `news`,
  `cases`, `editorial`, `legal`, `chat`, `lead`, `tuvan`, `reactbits`)
- ✅ Design tokens Tailwind v4 `@theme`, dark/light + accent theo site, Manrope/Inter/Geist Mono
- ✅ 13 block renderer + `<BlockRenderer>` trong `@x/content-blocks`
- ✅ Branding admin đổi XTECH → **X-CMS** (logo/favicon/chữ)
- 🟡 `apps/web` — app cũ, **vẫn trong workspace và vẫn bị CI typecheck/lint**, nhưng **không được deploy**
  (chưa có Dockerfile, không nằm trong `deploy.sh`). Cần chốt: gỡ hẳn hay giữ làm gì.
- ⬜ Còn treo: DeviceMockup/dashboard/DataTable/ChartCard, showcase UI theo từng sản phẩm,
  data animation gated `prefers-reduced-motion`, visual regression screenshot

## Phase 5 — Chatbot ✅
- ✅ Backend chat nằm ở **CMS** (`apps/cms/src/lib/chat/`): `providers.ts` đa nhà cung cấp, `store.ts`
  (Payload Local API), `service.ts` (guardrail + limit). `apps/clay` chỉ **proxy**, không giữ API key.
- ✅ Model mặc định `claude-haiku-4-5` (rẻ nhất — xem `docs/CHAT_PROVIDERS.md`)
- 🟡 Rate-limit / daily-cap **in-memory** → chỉ đúng với 1 instance CMS; nhiều instance phải chuyển Redis

## Phase 5b — Chăm sóc lead tự động ✅ (mảng lớn nhất, chưa có trong bản status cũ)
Chi tiết: `docs/LEAD_CONSULTATION_HANDOFF.md`. Đã **gộp hai bản triển khai song song** thành một pipeline.
- ✅ Tư vấn lead đa kênh: web-chat + email cùng **một** hội thoại, handoff sang chuyên gia
- ✅ State machine + chấm điểm slot; **AI analyzer quyết định** handoff, keyword chỉ nói khi analyzer im
- ✅ Email chủ động có độ trễ (`jobs/leadFollowup.ts`): ACK ngay, sau `LEAD_FOLLOWUP_DELAY_MINUTES` (30)
  nếu khách im lặng thì AI quay lại **đúng một lần**; đã đạt điểm handoff thì chuyển chuyên gia luôn
- ✅ Inbound email 2 chiều (`/api/lead/email-reply`), dedupe theo `MessageID`, strip quoted reply
- ✅ Kết thúc phiên tư vấn + mail tổng kết cho chuyên gia · mail báo lead cho sale (HTML tiếng Việt)
- ✅ **Smoke-test runtime end-to-end đã chạy** (2026-07-27, Postgres local, `MAIL_HOST=""`) — 6/6 bước đạt,
  phát hiện & sửa 3 bug thật
- ⬜ Còn lại trước khi dùng thật ở prod (thứ tự ưu tiên):
  1. Xem hiển thị email thật trên Gmail + Outlook + mobile dark mode
  2. Mở `/tu-van`, `/tu-van/tiep-tuc?t=…`, `/tu-van/lich-su` bằng browser (badge kênh, banner handoff,
     thanh tiến độ trên mobile) — **chưa mở lần nào**
  3. Đặt env prod: `LEAD_INBOUND_SECRET`, `LEAD_ADMIN_SECRET`, `LEAD_REPLY_DOMAIN`, `LEAD_PUBLIC_SITE_URL`
  4. Tạo ít nhất 1 record `consultants` có `isDefault` trong admin
  5. Cấu hình inbound mail (MX + webhook cho `reply.x-tech.com.vn`) — thiếu thì email chỉ **một chiều**
  6. Cron gọi job runner mỗi 5 phút — `deploy.sh` §7b đã tự cài crontab nếu có `CRON_SECRET`

## Phase 6 — Hardening & tests ⬜
- ⬜ **Chưa có test runner nào.** `test` script ở `apps/cms` còn là placeholder, repo chưa có vitest.
  4 module pure đáng cắm test nhất: `lead/state-machine.ts` (vừa có bug thật), `lead/tokens.ts`,
  `lead/inbound.ts`, `lead/email/render.ts`
- ⬜ Rate-limit sang Redis khi scale >1 instance

---

## Hạ tầng prod (CloudPanel + PM2, không Docker)
- `deploy.sh` — deploy thường: fetch → `reset --hard origin/$BRANCH` → install → `payload migrate` →
  cổng chặn `rels` → build cms + clay → cron job runner → `pm2 startOrReload` → health check 2 app + job runner
- Chế độ đặc biệt (**chỉ chạy tay, có xác nhận**): `--fresh-seed` (DROP SCHEMA + seed lại, tự `pg_dump`
  backup trước) · `--import-db` (khôi phục từ dump trong `./backups`) · `--no-restart`
- Nginx: `cms.x-tech.com.vn` → `127.0.0.1:3000` · `x-tech.com.vn` → `127.0.0.1:3001`
- ⚠️ `migration KHÔNG tự rollback` — rollback code bằng revert + push, rollback DB bằng dump

## Chạy ở máy dev
```bash
pnpm install
cp .env.example .env                 # rồi điền PAYLOAD_SECRET, ANTHROPIC_API_KEY, ...
docker compose up -d postgres minio
pnpm --filter @x/cms dev             # CMS  http://localhost:3000/admin
pnpm --filter @x/clay dev            # Site http://localhost:3001/?site=corporate
```
> DB dev ở chế độ **push** (`payload_migrations` chỉ có row `dev` batch `-1`) — **đừng** chạy
> `payload migrate` trên DB dev, sẽ fail vì migration `initial` tưởng DB trống. `migrate:create` thì an toàn.
