#!/usr/bin/env bash
# =============================================================================
# X Web Platform — VPS deploy script (CloudPanel, KHÔNG dùng Docker)
# =============================================================================
# Chạy script này TRÊN VPS, tại thư mục gốc repo (nơi có file này).
#
# Cách dùng:
#   ./deploy.sh                         # Deploy thường: pull + install + MIGRATE + build + restart
#   ./deploy.sh --fresh-seed            # WEB MỚI TINH: dựng schema + SEED toàn bộ nội dung từ đầu
#   ./deploy.sh --fresh-seed --yes      # ... bỏ qua xác nhận (XOÁ & seed lại DB, dùng trong CI)
#   ./deploy.sh --import-db             # Lần ĐẦU: import full DB từ dump mới nhất trong ./backups
#   ./deploy.sh --import-db --dump backups/xweb_local_20260721.sql   # chỉ định file dump
#   ./deploy.sh --import-db --yes       # bỏ qua xác nhận (dùng trong CI/tự động)
#   ./deploy.sh --no-restart            # làm mọi thứ trừ khởi động lại PM2
#
# GHI CHÚ --fresh-seed:
#   Dùng cho site hoàn toàn mới (DB trống). Script sẽ XOÁ SẠCH schema public của
#   DATABASE_URL, dựng lại schema hiện tại (PAYLOAD_DB_PUSH=true) rồi chạy seed
#   runner để nạp: site, menu, pages, posts (Insights/Tin tức), solutions, media,
#   và tài khoản admin đầu tiên (SEED_ADMIN_EMAIL/PASSWORD trong .env).
#
# Biến môi trường có thể override:
#   BRANCH=feat/xxx ./deploy.sh         # deploy nhánh khác (mặc định: main)
#
# YÊU CẦU CÓ SẴN TRÊN VPS:
#   - node >= 20.9 (khuyến nghị 22), pnpm (script tự bật corepack nếu thiếu)
#   - pm2  (npm i -g pm2)
#   - psql client (để import/baseline DB)
#   - File .env ở gốc repo            -> cấu hình CMS (DATABASE_URL, PAYLOAD_SECRET, ...)
#   - File apps/clay/.env.production  -> cấu hình clay (CMS_URL, NEXT_PUBLIC_CMS_URL, ...)
#     (LƯU Ý: NEXT_PUBLIC_* được "nướng" vào lúc BUILD, nên phải có TRƯỚC khi build)
# =============================================================================
set -euo pipefail

# ---- Vị trí repo = thư mục chứa script này ----------------------------------
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BRANCH="${BRANCH:-main}"
IMPORT_DB=0
FRESH_SEED=0
SKIP_RESTART=0
ASSUME_YES=0
DUMP_FILE=""

# ---- Parse tham số ----------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --fresh-seed) FRESH_SEED=1 ;;
    --import-db)  IMPORT_DB=1 ;;
    --dump)       DUMP_FILE="${2:-}"; shift ;;
    --dump=*)     DUMP_FILE="${1#*=}" ;;
    --no-restart) SKIP_RESTART=1 ;;
    --yes|-y)     ASSUME_YES=1 ;;
    -h|--help)    grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Tham số không hợp lệ: $1" >&2; exit 1 ;;
  esac
  shift
done

[[ "$FRESH_SEED" -eq 1 && "$IMPORT_DB" -eq 1 ]] && { echo "Không dùng đồng thời --fresh-seed và --import-db" >&2; exit 1; }

# ---- Helpers ----------------------------------------------------------------
log()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m  ✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  ! \033[0m%s\n' "$*"; }
die()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

# ---- 0. Kiểm tra công cụ ----------------------------------------------------
log "Kiểm tra môi trường"
have node || die "Chưa có node. Cài Node 20.9+ (khuyến nghị 22) cho site trên CloudPanel."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[[ "$NODE_MAJOR" -ge 20 ]] || die "Node quá cũ ($(node -v)); cần >= 20.9."
ok "node $(node -v)"

if ! have pnpm; then
  warn "Chưa có pnpm — thử bật qua corepack..."
  corepack enable >/dev/null 2>&1 || die "Không bật được corepack. Cài thủ công: 'npm i -g pnpm@9.15.0'"
  corepack prepare pnpm@9.15.0 --activate >/dev/null 2>&1 || true
  have pnpm || die "Vẫn không thấy pnpm sau corepack."
fi
ok "pnpm $(pnpm -v)"

have psql || die "Chưa có psql client (cần để import/baseline DB). Cài: 'apt-get install -y postgresql-client'"
[[ "$SKIP_RESTART" -eq 1 ]] || have pm2 || die "Chưa có pm2. Cài: 'npm i -g pm2'"

# ---- 1. Kiểm tra file .env --------------------------------------------------
log "Kiểm tra file cấu hình môi trường"
[[ -f "$ROOT/.env" ]] || die "Thiếu $ROOT/.env (cấu hình CMS). Tạo file này trước khi deploy."
ok "Tìm thấy .env (gốc, cho CMS)"

CLAY_ENV=""
for f in "$ROOT/apps/clay/.env.production" "$ROOT/apps/clay/.env.local"; do
  [[ -f "$f" ]] && { CLAY_ENV="$f"; break; }
done
[[ -n "$CLAY_ENV" ]] || die "Thiếu apps/clay/.env.production (hoặc .env.local) — cần CMS_URL & NEXT_PUBLIC_CMS_URL trước khi build clay."
ok "Tìm thấy cấu hình clay: ${CLAY_ENV#$ROOT/}"

# Lấy DATABASE_URL từ .env (dùng cho import/baseline)
DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ROOT/.env" | head -n1 | sed -E 's/^DATABASE_URL=//; s/^["'\'']//; s/["'\'']$//')"
[[ -n "$DATABASE_URL" ]] || die "Không đọc được DATABASE_URL trong .env"

# -- Kiểm tra cấu hình EMAIL (thông báo lead form contact/đặt lịch tư vấn) -----
# CMS gửi mail khi có lead qua SMTP (MAIL_* trong .env). Thiếu MAIL_HOST -> CMS
# tự fallback console adapter: LƯU CMS vẫn chạy nhưng KHÔNG có mail thông báo.
if grep -qE '^MAIL_HOST=..*' "$ROOT/.env"; then
  ok "SMTP đã cấu hình (MAIL_HOST=$(grep -E '^MAIL_HOST=' "$ROOT/.env" | head -n1 | sed -E 's/^MAIL_HOST=//; s/["'\'']//g'))"
  if grep -qE '^LEAD_NOTIFY_TO=..*' "$ROOT/.env"; then
    ok "Người nhận lead: $(grep -E '^LEAD_NOTIFY_TO=' "$ROOT/.env" | head -n1 | sed -E 's/^LEAD_NOTIFY_TO=//; s/["'\'']//g')"
  else
    warn "Chưa đặt LEAD_NOTIFY_TO trong .env — mail lead sẽ fallback về MAIL_TEST_TO_ADDRESS/SEED_ADMIN_EMAIL."
  fi
else
  warn "Chưa cấu hình MAIL_HOST trong .env — form vẫn LƯU CMS nhưng KHÔNG gửi mail thông báo lead."
fi

# -- Env của luồng chăm sóc lead tự động --------------------------------------
# Đặc thù nhóm này: thiếu thì app VẪN CHẠY, log VẪN SẠCH, chỉ là tính năng không
# bao giờ xảy ra. Không soi ở đây thì không ai phát hiện ra.
envval() {
  grep -E "^$1=" "$ROOT/.env" 2>/dev/null | head -n1 \
    | sed -E "s/^$1=//; s/^[\"']//; s/[\"']\$//" || true
}
CRON_SECRET_VAL="$(envval CRON_SECRET)"
[[ -n "$CRON_SECRET_VAL" && "$CRON_SECRET_VAL" != "change-me-cron-secret" ]] \
  && ok "CRON_SECRET đã đặt (job runner chạy được)" \
  || warn "CRON_SECRET trống/còn giá trị mẫu — email chủ động cho lead im lặng sẽ KHÔNG BAO GIỜ gửi.
       Sinh: openssl rand -hex 32   rồi thêm vào .env"
[[ "$(envval LEAD_PUBLIC_SITE_URL)" == https://* ]] \
  && ok "LEAD_PUBLIC_SITE_URL = $(envval LEAD_PUBLIC_SITE_URL)" \
  || warn "LEAD_PUBLIC_SITE_URL chưa phải URL https công khai của SITE — link 'tiếp tục hội thoại' trong email sẽ sai."
[[ -n "$(envval LEAD_INBOUND_SECRET)" ]] \
  && ok "LEAD_INBOUND_SECRET đã đặt" \
  || warn "LEAD_INBOUND_SECRET trống — webhook /api/lead/email-reply trả 401 ở production; email chỉ MỘT CHIỀU."

# ---- 2. Đồng bộ code = đúng như local (origin/$BRANCH) ----------------------
log "Đồng bộ code: origin/$BRANCH"
git fetch origin --prune
git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
ok "HEAD -> $(git log -1 --oneline)"

# ---- 3. Cài dependencies ----------------------------------------------------
log "Cài dependencies (frozen lockfile)"
pnpm install --frozen-lockfile
ok "Dependencies xong"

# ---- 4. Database ------------------------------------------------------------
if [[ "$FRESH_SEED" -eq 1 ]]; then
  # -- 4-FS. WEB MỚI TINH: dựng schema từ đầu + seed toàn bộ nội dung ----------
  warn "SẮP XOÁ SẠCH schema 'public' của DB đích rồi seed lại từ đầu."
  warn "DB: ${DATABASE_URL%%\?*}"
  if [[ "$ASSUME_YES" -ne 1 ]]; then
    read -r -p "  Tiếp tục và XÓA toàn bộ dữ liệu hiện có? [y/N] " ans
    [[ "$ans" =~ ^[Yy]$ ]] || die "Đã hủy."
  fi

  log "Xoá & tạo lại schema public (DB trống hoàn toàn)"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
  ok "Schema đã reset"

  # Đồng bộ editorial seed (Insights + Tin tức) từ nội dung tĩnh trước khi seed DB.
  log "Sinh lại editorial-posts.json từ nội dung tĩnh"
  pnpm --filter @x/clay gen:editorial-seed
  ok "Editorial seed cập nhật"

  # PAYLOAD_DB_PUSH=true: Payload tự dựng schema hiện tại (mọi field mới nhất)
  # trên DB trống, sau đó seed runner nạp dữ liệu. Idempotent (upsert natural key).
  log "Dựng schema + seed nội dung (PAYLOAD_DB_PUSH=true)"
  PAYLOAD_DB_PUSH=true pnpm --filter @x/cms exec payload run ./src/seed/index.ts
  ok "Seed hoàn tất (site, menu, pages, posts, solutions, media, admin user)"

  # Baseline: đánh dấu mọi migration đã đăng ký là "đã áp dụng" để LẦN SAU
  # `./deploy.sh` (migrate) chỉ chạy migration MỚI, không dựng lại bảng đã có.
  log "Ghi baseline migration (đánh dấu đã áp dụng)"
  MIG_VALUES=""
  while IFS= read -r name; do
    [[ -n "$name" ]] && MIG_VALUES+="('${name}', 1),"
  done < <(grep -oE "name: *'[^']+'" "$ROOT/apps/cms/src/migrations/index.ts" | sed -E "s/name: *'//; s/'//")
  MIG_VALUES="${MIG_VALUES%,}"
  if [[ -n "$MIG_VALUES" ]]; then
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q <<SQL
DELETE FROM payload_migrations;
INSERT INTO payload_migrations (name, batch) VALUES ${MIG_VALUES};
SQL
    ok "Baseline: $(echo "$MIG_VALUES" | tr ',' '\n' | wc -l) migration đánh dấu đã chạy"
  else
    warn "Không thấy migration nào để baseline (bỏ qua)."
  fi

elif [[ "$IMPORT_DB" -eq 1 ]]; then
  # -- 4a. IMPORT LẦN ĐẦU: khôi phục toàn bộ DB từ dump (thay bản cũ) ----------
  if [[ -z "$DUMP_FILE" ]]; then
    DUMP_FILE="$(ls -1t "$ROOT"/backups/*.sql 2>/dev/null | head -n1 || true)"
  fi
  [[ -n "$DUMP_FILE" && -f "$DUMP_FILE" ]] || die "Không tìm thấy file dump. Copy file .sql vào ./backups hoặc dùng --dump <path>."

  warn "SẮP GHI ĐÈ TOÀN BỘ dữ liệu trong DB đích bằng dump: ${DUMP_FILE#$ROOT/}"
  if [[ "$ASSUME_YES" -ne 1 ]]; then
    read -r -p "  Tiếp tục và XÓA dữ liệu cũ? [y/N] " ans
    [[ "$ans" =~ ^[Yy]$ ]] || die "Đã hủy."
  fi

  log "Import DB từ dump"
  # Dump được tạo với --clean --if-exists nên tự drop object cũ trước khi tạo lại.
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$DUMP_FILE"
  ok "Đã import dữ liệu"

  # -- 4b. Ghi BASELINE migration ---------------------------------------------
  # Local dùng push mode nên bảng payload_migrations chỉ có dòng 'dev'.
  # Đánh dấu MỌI migration hiện có là "đã áp dụng" để lần sau `migrate`
  # chỉ chạy migration MỚI (không tạo lại bảng đã tồn tại).
  log "Ghi baseline migration (đánh dấu đã áp dụng)"
  # Chỉ baseline các migration ĐÃ ĐĂNG KÝ trong index.ts (đúng cái `payload migrate`
  # sẽ xét). Bỏ qua các file dormant như 99999999_*_seed_content.ts (không nằm trong index).
  MIG_VALUES=""
  while IFS= read -r name; do
    [[ -n "$name" ]] && MIG_VALUES+="('${name}', 1),"
  done < <(grep -oE "name: *'[^']+'" "$ROOT/apps/cms/src/migrations/index.ts" | sed -E "s/name: *'//; s/'//")
  MIG_VALUES="${MIG_VALUES%,}"   # bỏ dấu phẩy cuối

  if [[ -n "$MIG_VALUES" ]]; then
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q <<SQL
DELETE FROM payload_migrations;
INSERT INTO payload_migrations (name, batch) VALUES ${MIG_VALUES};
SQL
    ok "Baseline: $(echo "$MIG_VALUES" | tr ',' '\n' | wc -l) migration đánh dấu đã chạy"
  else
    warn "Không thấy file migration nào để baseline (bỏ qua)."
  fi
else
  # -- 4c. Deploy thường: chỉ chạy migration mới -----------------------------
  log "Chạy migration (chỉ áp dụng thay đổi mới)"
  pnpm --filter @x/cms db:migrate
  ok "Migration xong"

  # Đối chiếu chéo sau migrate: Payload khoá document qua
  # payload_locked_documents_rels, bảng này phải có một cột `<collection>_id` cho
  # MỖI collection. Nếu một migration bị baseline khống (--import-db với dump cũ
  # đánh dấu mọi migration là applied) thì `migrate` bỏ qua nó vĩnh viễn, và admin
  # chết ở mọi thao tác sửa document với Postgres 42703 — nhưng deploy vẫn báo
  # xanh. Rẻ để kiểm, đắt để bỏ sót.
  REL_COLS_N="$(psql "$DATABASE_URL" -tAc \
    "select count(*) from information_schema.columns
      where table_name='payload_locked_documents_rels'
        and column_name in ('leads_id','lead_devices_id','lead_conversations_id','lead_messages_id',
          'resume_tokens_id','email_templates_id','consultants_id','consultant_assignments_id',
          'lead_activities_id')" 2>/dev/null || echo 0)"
  [[ "$REL_COLS_N" == 9 ]] \
    && ok "payload_locked_documents_rels đủ 9 cột lead" \
    || die "payload_locked_documents_rels chỉ có $REL_COLS_N/9 cột lead — migration bị gắn cờ
     khống, admin sẽ chết ở mọi thao tác sửa document (42703).
     Vá:  ./scripts/fix-lead-schema.sh --check   rồi   ./scripts/fix-lead-schema.sh"
fi

# ---- 5. Thư mục media (khi USE_S3=false phải tồn tại & ghi được) ------------
# CMS đọc MEDIA_DIR từ .env (collections/Media.ts) để lưu upload vào thư mục bền vững.
# Nếu không đặt MEDIA_DIR, Payload dùng apps/cms/media mặc định.
MEDIA_DIR="$(grep -E '^MEDIA_DIR=' "$ROOT/.env" | head -n1 | sed -E 's/^MEDIA_DIR=//; s/^["'\'']//; s/["'\'']$//')"
MEDIA_DIR="${MEDIA_DIR:-$ROOT/apps/cms/media}"
mkdir -p "$MEDIA_DIR"
ok "Thư mục media: $MEDIA_DIR ($(find "$MEDIA_DIR" -type f 2>/dev/null | wc -l) file). Nhớ copy media từ local vào đây."

# ---- 6. Build cả 2 app ------------------------------------------------------
log "Build @x/cms"
pnpm --filter @x/cms build
log "Build @x/clay"
pnpm --filter @x/clay build
ok "Build xong (Next standalone + .next)"

# ---- 7. Tạo ecosystem PM2 nếu chưa có --------------------------------------
ECO="$ROOT/ecosystem.config.cjs"
if [[ ! -f "$ECO" ]]; then
  log "Tạo ecosystem.config.cjs (PM2)"
  cat > "$ECO" <<'EOF'
// PM2 process file — X Web Platform (2 app trên 1 VPS)
// CMS đọc .env gốc qua Payload loadEnv; clay đọc apps/clay/.env.* .
// Nginx của CloudPanel reverse-proxy: domain CMS -> :3000, domain site -> :3001
const ROOT = __dirname;
module.exports = {
  apps: [
    {
      name: 'xweb-cms',
      cwd: ROOT,
      script: 'pnpm',
      args: '--filter @x/cms start',   // next start --port 3000
      interpreter: 'none',
      env: { NODE_ENV: 'production', PORT: '3000' },
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: '1G',
    },
    {
      name: 'xweb-clay',
      cwd: ROOT,
      script: 'pnpm',
      args: '--filter @x/clay start',  // next start (PORT=3001 ép cổng)
      interpreter: 'none',
      env: { NODE_ENV: 'production', PORT: '3001' },
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: '1G',
    },
  ],
};
EOF
  ok "Đã tạo ecosystem.config.cjs"
fi

# ---- 7b. Cron cho job runner (email chủ động cho lead im lặng) --------------
# Luồng chăm sóc lead đẩy job có độ trễ vào bảng payload_jobs; phải có tiến trình
# bên ngoài gọi job runner thì job mới chạy. Đây là hạ tầng THƯỜNG TRỰC của app,
# không phải bước one-off — nên nó nằm ở đây để MỌI lần deploy (kể cả CI tự
# deploy) đều đảm bảo có, thay vì chỉ có trong script phát hành 2707.
# Idempotent: chạy lại nhiều lần vẫn chỉ một dòng crontab.
CRON_SCRIPT="$ROOT/scripts/payload-jobs-cron.sh"
if [[ -z "$CRON_SECRET_VAL" || "$CRON_SECRET_VAL" == "change-me-cron-secret" ]]; then
  warn "Bỏ qua cài cron: chưa có CRON_SECRET trong .env (email chủ động sẽ không chạy)."
elif ! have crontab; then
  warn "Không thấy lệnh crontab — tự cài lịch gọi $CRON_SCRIPT mỗi 5 phút bằng cơ chế khác."
else
  log "Đảm bảo cron gọi job runner (mỗi 5 phút)"
  mkdir -p "$ROOT/scripts" "$ROOT/logs"
  # Secret KHÔNG nhét vào crontab (crontab -l ai đọc cũng thấy) — wrapper đọc .env.
  cat > "$CRON_SCRIPT" <<'CRONEOF'
#!/usr/bin/env bash
# Gọi job runner của Payload để xử lý job đến hạn (email chủ động cho lead im lặng).
# Do cron gọi — xem `crontab -l`. Secret đọc từ .env nên không lộ trong crontab.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECRET="$(grep -E '^CRON_SECRET=' "$ROOT/.env" | head -n1 | sed -E 's/^CRON_SECRET=//; s/^["'"'"']//; s/["'"'"']$//')"
[[ -n "$SECRET" ]] || { echo "$(date -Is) CRON_SECRET trống trong .env"; exit 1; }
# Endpoint của Payload là GET (không phải POST) để dùng được với cron.
code="$(curl -sS -o /tmp/payload-jobs-out.json -w '%{http_code}' --max-time 120 \
  -H "Authorization: Bearer $SECRET" \
  "http://127.0.0.1:3000/api/payload-jobs/run" || echo 000)"
echo "$(date -Is) HTTP $code $(head -c 200 /tmp/payload-jobs-out.json 2>/dev/null)"
[[ "$code" == "200" ]]
CRONEOF
  chmod +x "$CRON_SCRIPT"
  CRON_LINE="*/5 * * * * $CRON_SCRIPT >> $ROOT/logs/payload-jobs.log 2>&1"
  { crontab -l 2>/dev/null | grep -v 'payload-jobs-cron.sh' || true; echo "$CRON_LINE"; } | crontab -
  ok "Cron: $CRON_LINE"
fi

# ---- 8. Khởi động / reload PM2 ----------------------------------------------
if [[ "$SKIP_RESTART" -eq 1 ]]; then
  warn "Bỏ qua khởi động lại (--no-restart)."
else
  log "Khởi động / reload PM2"
  pm2 startOrReload "$ECO" --update-env
  pm2 save
  ok "PM2 đang chạy:"
  pm2 status

  # ---- 9. Health check ------------------------------------------------------
  log "Kiểm tra health"
  sleep 3
  for pair in "CMS|http://127.0.0.1:3000/api/health" "clay|http://127.0.0.1:3001/api/health"; do
    svc="${pair%%|*}"; url="${pair#*|}"
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$url" || echo 000)"
    if [[ "$code" == "200" ]]; then ok "$svc OK ($url -> 200)"; else warn "$svc chưa OK ($url -> $code). Xem log: pm2 logs"; fi
  done

  # Job runner: kiểm tra CẢ HAI chiều. Nếu không-secret mà ra 200 nghĩa là
  # endpoint đang hở cho cả internet (Payload mặc định mở khi thiếu access.run).
  if [[ -n "$CRON_SECRET_VAL" ]]; then
    c_no="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://127.0.0.1:3000/api/payload-jobs/run" || echo 000)"
    [[ "$c_no" == "401" ]] && ok "Job runner: không secret -> 401 (được bảo vệ)" \
      || warn "Job runner: không secret -> $c_no (KHÔNG phải 401 — endpoint đang hở!)"
    c_yes="$(curl -s -o /dev/null -w '%{http_code}' --max-time 120 -H "Authorization: Bearer $CRON_SECRET_VAL" "http://127.0.0.1:3000/api/payload-jobs/run" || echo 000)"
    [[ "$c_yes" == "200" ]] && ok "Job runner: có secret -> 200 (chạy được)" \
      || warn "Job runner: có secret -> $c_yes (job chăm sóc lead sẽ không chạy)"
  fi
fi

log "HOÀN TẤT."
cat <<EON

Bước tiếp theo (làm 1 lần trên CloudPanel / VPS):
  • Nginx (CloudPanel) reverse proxy:
      - cms.x-tech.com.vn -> http://127.0.0.1:3000   (CMS admin + API)
      - x-tech.com.vn     -> http://127.0.0.1:3001   (site clay)
    (Site clay đa domain theo Host header — đảm bảo Nginx truyền đúng Host xuống app.
     Map domain->site nằm ở apps/clay/src/lib/sites.ts.)
  • Cho PM2 tự chạy khi VPS reboot (chạy 1 lần, cần sudo):
      pm2 startup      # copy & chạy lệnh nó in ra
      pm2 save
  • Đảm bảo biến môi trường đã đặt:
      .env (gốc, cho CMS):
        PAYLOAD_PUBLIC_SERVER_URL = https://cms.x-tech.com.vn
        MEDIA_DIR                 = <thư mục bền, vd /home/<site>/media>   (nếu USE_S3=false)
      apps/clay/.env.production (cho clay):
        NEXT_PUBLIC_CMS_URL       = https://cms.x-tech.com.vn   (nướng vào lúc build)
        CMS_URL                   = http://127.0.0.1:3000       (server->server, nội bộ)

Lần deploy sau chỉ cần:  ./deploy.sh
EON
