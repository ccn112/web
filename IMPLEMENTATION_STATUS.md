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

### Nguyên nhân đã xác định: key deploy có passphrase, workflow không truyền `passphrase`

`ci.yml` chỉ truyền `key:` chứ không có `passphrase:` (log run xác nhận `INPUT_PASSPHRASE:` rỗng).
Key có passphrase mà không cấp passphrase thì `drone-ssh` **không mở được key**, danh sách signer rỗng,
và client chưa từng gửi gì lên server. Đã thêm `passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}`.

**⚠️ Cái bẫy làm việc này mất 8 ngày để tìm ra — đừng để người sau rơi lại vào:**
dòng lỗi trên **không nói gì về passphrase**, và nó **giống hệt** lỗi "server từ chối key". Trong Go
`x/crypto/ssh`, method được append vào danh sách `tried` **cả khi thất bại**, kể cả khi signer list rỗng —
nên `attempted methods [none publickey]` **KHÔNG** chứng minh key đã tới được server. (Chẩn đoán ban đầu
của phiên này đã suy luận sai đúng chỗ đó và loại trừ oan giả thuyết passphrase.)

Đã loại trừ chắc chắn:
- ✅ 5 secret `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` / `VPS_PORT` / `VPS_PATH` đều **có giá trị**
  (log Actions mask thành `***` → không rỗng).
- ✅ `VPS_HOST` + `VPS_PORT` **đúng**, firewall mở, `sshd` sống — vì lỗi xảy ra ở **bước auth**;
  sai host/port thì phải là `dial tcp: i/o timeout` hoặc `connection refused`.
- ✅ Job **không** đứng chờ approve — lúc chẩn đoán `production` chưa có protection rule nào
  (đã bật Required reviewers sau đó, xem mục dưới).

**Chưa loại trừ** (passphrase làm client dừng trước khi tới server, nên hai thứ này *chưa từng được thử*):
`VPS_USER` có đúng user chứa key trong `authorized_keys` không, và quyền `~/.ssh` (700) /
`authorized_keys` (600) / home không group-writable. Nếu sau khi thêm passphrase vẫn fail thì đọc
`auth.log` — xem `docs/CI_CD.md` §7.

Việc còn phải làm tay: **thêm secret `VPS_SSH_PASSPHRASE`** (`gh secret set VPS_SSH_PASSPHRASE`).

> Cân nhắc dài hạn: passphrase **không thêm bảo mật nào trong CI** — nó nằm trong GitHub Secrets ngay
> cạnh private key, cùng vùng tin cậy, chỉ thêm một chỗ để hỏng. Key deploy chuyên dụng không passphrase
> (đúng như `docs/CI_CD.md` §1 vốn đã hướng dẫn: `ssh-keygen … -N ""`) là hướng gọn hơn.

### ✅ Đã bật cổng duyệt tay cho prod (2026-07-29)
Trước đó `production` có `protection_rules: []` — nghĩa là **đúng cái push làm SSH thông** sẽ là push đầu
tiên chạy `payload migrate` lên DB prod mà không ai duyệt. Đã bật **Required reviewers** = `ccn112`
(`prevent_self_review: false` — một người vẫn tự duyệt được, không tự khoá mình ra ngoài;
`can_admins_bypass: true` giữ nguyên mặc định).

Từ giờ job `deploy` **dừng ở trạng thái `Waiting`** cho tới khi bấm *Review deployments → Approve*
trong tab Actions. Đây là việc `docs/CI_CD.md` §3 đã khuyến nghị từ đầu nhưng chưa ai bật.

Kiểm lại bất cứ lúc nào:
```bash
gh api repos/ccn112/web/environments/production --jq '.protection_rules'
```

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
