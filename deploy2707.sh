#!/usr/bin/env bash
# =============================================================================
# X Web Platform — deploy bản 2026-07-27: CHĂM SÓC LEAD TỰ ĐỘNG
# =============================================================================
# Bản này KHÁC deploy thường ở 3 điểm, nên tách riêng script:
#
#   1. Có 2 migration mới, trong đó `add_payload_jobs` tạo bảng hàng đợi job.
#      -> Script BẮT BUỘC backup DB trước khi migrate.
#   2. Có bộ env mới (LEAD_*, CRON_SECRET). Thiếu là tính năng chết ÂM THẦM
#      (không lỗi, không log) -> Script kiểm tra và nói rõ cái nào thiếu.
#   3. Email chủ động sau 30 phút chạy bằng CRON gọi vào job runner. KHÔNG có
#      cron thì job nằm mãi trong bảng payload_jobs và không email nào được gửi.
#      -> Script tự cài cron.
#
# CÁCH DÙNG (chạy TRÊN VPS, tại thư mục gốc repo):
#
#   ./deploy2707.sh --check                 # ❶ CHẠY CÁI NÀY TRƯỚC. Chỉ kiểm tra,
#                                           #   không sửa gì: env, DB, migration
#                                           #   nào sắp chạy, cron đã có chưa.
#   ./deploy2707.sh                         # ❷ Deploy thật (backup -> migrate ->
#                                           #   build -> reload PM2 -> cài cron)
#   ./deploy2707.sh --smoke-test you@mail.com   # ❸ Test sau deploy (GỬI MAIL THẬT)
#
# Tham số khác:
#   BRANCH=main ./deploy2707.sh    # deploy nhánh khác (mặc định:
#                                  # feat/lead-consultation-email-chat)
#   --no-cron        bỏ qua bước cài cron (tự cài tay sau)
#   --no-backup      bỏ qua backup DB (KHÔNG khuyến khích)
#   --no-restart     làm mọi thứ trừ reload PM2
#   --rollback-db    khôi phục DB từ bản backup mới nhất mà script này tạo
#   --cron-minutes N chu kỳ cron, mặc định 5 phút
#
# YÊU CẦU CÓ SẴN (giống deploy.sh): node>=20.9, pnpm, pm2, psql, pg_dump, curl
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BRANCH="${BRANCH:-feat/lead-consultation-email-chat}"
CMS_PORT="${CMS_PORT:-3000}"
CLAY_PORT="${CLAY_PORT:-3001}"

CHECK_ONLY=0
DO_CRON=1
DO_BACKUP=1
DO_RESTART=1
ROLLBACK_DB=0
CRON_MINUTES=5
SMOKE_EMAIL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check)         CHECK_ONLY=1 ;;
    --no-cron)       DO_CRON=0 ;;
    --no-backup)     DO_BACKUP=0 ;;
    --no-restart)    DO_RESTART=0 ;;
    --rollback-db)   ROLLBACK_DB=1 ;;
    --cron-minutes)  CRON_MINUTES="${2:-5}"; shift ;;
    --cron-minutes=*) CRON_MINUTES="${1#*=}" ;;
    --smoke-test)    SMOKE_EMAIL="${2:-}"; shift ;;
    --smoke-test=*)  SMOKE_EMAIL="${1#*=}" ;;
    -h|--help)       grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Tham số không hợp lệ: $1" >&2; exit 1 ;;
  esac
  shift
done

# ---- Helpers ----------------------------------------------------------------
log()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m  ✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  !\033[0m %s\n' "$*"; }
bad()  { printf '\033[1;31m  ✗\033[0m %s\n' "$*"; }
die()  { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

PROBLEMS=0
fail() { bad "$*"; PROBLEMS=$((PROBLEMS + 1)); }

# Đọc 1 biến từ .env (bỏ nháy). Rỗng nếu không có hoặc để trống.
# `|| true` là bắt buộc: không có nó, grep trả 1 khi biến chưa được đặt và
# `set -e` giết cả script ngay tại dòng gán đầu tiên tra một biến còn thiếu —
# đúng lúc script cần báo cho bạn biết là nó thiếu.
envval() {
  grep -E "^$1=" "$ROOT/.env" 2>/dev/null | head -n1 \
    | sed -E "s/^$1=//; s/^[\"']//; s/[\"']$//" || true
}

# ---- 0. Công cụ -------------------------------------------------------------
log "Kiểm tra công cụ"
have node || die "Chưa có node. Cần >= 20.9 (khuyến nghị 22)."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[[ "$NODE_MAJOR" -ge 20 ]] || die "Node quá cũ ($(node -v)); cần >= 20.9."
ok "node $(node -v)"

if ! have pnpm; then
  warn "Chưa có pnpm — thử bật qua corepack..."
  corepack enable >/dev/null 2>&1 || die "Không bật được corepack. Cài tay: npm i -g pnpm@9.15.0"
  corepack prepare pnpm@9.15.0 --activate >/dev/null 2>&1 || true
  have pnpm || die "Vẫn không thấy pnpm."
fi
ok "pnpm $(pnpm -v)"

have psql    || die "Thiếu psql. Cài: apt-get install -y postgresql-client"
have pg_dump || die "Thiếu pg_dump (cùng gói postgresql-client)."
have curl    || die "Thiếu curl."
[[ "$DO_RESTART" -eq 0 ]] || have pm2 || die "Thiếu pm2. Cài: npm i -g pm2"
ok "psql / pg_dump / curl / pm2"

# ---- 1. File cấu hình -------------------------------------------------------
log "Kiểm tra file cấu hình"
[[ -f "$ROOT/.env" ]] || die "Thiếu $ROOT/.env (cấu hình CMS)."
ok ".env (gốc, cho CMS)"

CLAY_ENV=""
for f in "$ROOT/apps/clay/.env.production" "$ROOT/apps/clay/.env.local"; do
  [[ -f "$f" ]] && { CLAY_ENV="$f"; break; }
done
[[ -n "$CLAY_ENV" ]] || die "Thiếu apps/clay/.env.production — cần CMS_URL & NEXT_PUBLIC_CMS_URL TRƯỚC khi build."
ok "cấu hình clay: ${CLAY_ENV#$ROOT/}"

DATABASE_URL="$(envval DATABASE_URL)"
[[ -n "$DATABASE_URL" ]] || die "Không đọc được DATABASE_URL trong .env"

# ---- 2. Env của bản 2707 ----------------------------------------------------
# Chia 3 mức. Điểm chung của nhóm "chết âm thầm": app vẫn chạy, không có lỗi nào
# trong log, chỉ là tính năng không bao giờ xảy ra — nên phải soi ở đây.
log "Kiểm tra env cho luồng chăm sóc lead"

# -- Nhóm A: thiếu là app hỏng --
for v in PAYLOAD_SECRET ANTHROPIC_API_KEY; do
  if [[ -n "$(envval "$v")" ]]; then ok "$v đã đặt"; else fail "$v TRỐNG — thiếu là AI chat/tư vấn không chạy được."; fi
done

# -- Nhóm B: thiếu là tính năng CHẾT ÂM THẦM --
CRON_SECRET_VAL="$(envval CRON_SECRET)"
if [[ -n "$CRON_SECRET_VAL" && "$CRON_SECRET_VAL" != "change-me-cron-secret" ]]; then
  ok "CRON_SECRET đã đặt (job runner được bảo vệ)"
else
  fail "CRON_SECRET trống hoặc còn giá trị mẫu — KHÔNG có nó thì email chủ động sau 30 phút KHÔNG BAO GIỜ gửi.
       Sinh nhanh:  openssl rand -hex 32"
fi

LEAD_PUBLIC_SITE_URL_VAL="$(envval LEAD_PUBLIC_SITE_URL)"
if [[ "$LEAD_PUBLIC_SITE_URL_VAL" == https://* ]]; then
  ok "LEAD_PUBLIC_SITE_URL = $LEAD_PUBLIC_SITE_URL_VAL"
else
  fail "LEAD_PUBLIC_SITE_URL phải là URL https công khai của SITE (không phải CMS).
       Mọi link 'tiếp tục hội thoại' trong email dựng từ đây; sai là khách bấm vào localhost."
fi

if [[ -n "$(envval LEAD_INBOUND_SECRET)" ]]; then
  ok "LEAD_INBOUND_SECRET đã đặt (webhook email vào được)"
else
  warn "LEAD_INBOUND_SECRET trống — trên production webhook /api/lead/email-reply TRẢ 401.
       Hệ quả: email CHỈ MỘT CHIỀU, khách trả lời mail sẽ rơi vào hư không.
       Bỏ qua được nếu bạn chưa cấu hình inbound mail (xem mục 4 phần hướng dẫn cuối)."
fi

if [[ -n "$(envval LEAD_ADMIN_SECRET)" ]]; then
  ok "LEAD_ADMIN_SECRET đã đặt"
else
  warn "LEAD_ADMIN_SECRET trống — /api/lead/handoff trả 401 trên production (escalate thủ công không dùng được)."
fi

# -- Nhóm C: mail --
if [[ -n "$(envval MAIL_HOST)" ]]; then
  ok "SMTP: $(envval MAIL_HOST)"
  [[ -n "$(envval LEAD_NOTIFY_TO)" ]] \
    && ok "Lead gửi tới: $(envval LEAD_NOTIFY_TO)" \
    || warn "LEAD_NOTIFY_TO trống — brief chuyên gia rơi về MAIL_TEST_TO_ADDRESS/SEED_ADMIN_EMAIL."
else
  fail "MAIL_HOST trống — CMS rơi về console adapter: KHÔNG email nào được gửi ra ngoài.
       Cả luồng chăm sóc lead phụ thuộc email, thiếu cái này là vô nghĩa."
fi

# -- Nhóm D: có mặc định, chỉ hiển thị để bạn biết mình đang chạy số nào --
printf '\n    Tham số hành vi (trống = dùng mặc định trong code):\n'
for pair in \
  "LEAD_FOLLOWUP_DELAY_MINUTES|30|phút chờ trước khi AI gửi email chủ động (0 = TẮT)" \
  "LEAD_FOLLOWUP_HANDOFF_SCORE|40|lead im lặng đạt điểm này thì chuyển thẳng chuyên gia" \
  "LEAD_HANDOFF_SCORE|62|ngưỡng điểm -> HUMAN_READY" \
  "LEAD_SOFT_HANDOFF_MIN_TURNS|3|từ lượt này mới tính tín hiệu AI tự đánh giá" \
  "LEAD_EMAIL_MIN_INTERVAL_MINUTES|3|giãn cách tối thiểu giữa 2 email tự động" \
  "LEAD_MAX_AUTO_EMAILS|10|trần email tự động mỗi hội thoại" \
  "LEAD_REPLY_DOMAIN|reply.x-tech.com.vn|domain nhận mail trả lời" \
  ; do
  name="${pair%%|*}"; rest="${pair#*|}"; def="${rest%%|*}"; desc="${rest#*|}"
  cur="$(envval "$name")"
  printf '      %-32s = %-24s %s\n' "$name" "${cur:-($def)}" "$desc"
done

# ---- 3. Trạng thái DB & migration ------------------------------------------
log "Trạng thái database"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -tAc 'select 1' >/dev/null 2>&1 \
  || die "Không kết nối được DATABASE_URL. Kiểm tra host/user/password/firewall."
ok "Kết nối DB OK"

# Migration đã đăng ký trong code (đúng danh sách `payload migrate` sẽ xét).
REGISTERED="$(grep -oE "name: *'[^']+'" "$ROOT/apps/cms/src/migrations/index.ts" | sed -E "s/name: *'//; s/'//")"
APPLIED="$(psql "$DATABASE_URL" -tAc \
  "select name from payload_migrations" 2>/dev/null | sed '/^$/d' || true)"

if [[ -z "$APPLIED" ]]; then
  warn "Bảng payload_migrations trống/không có — DB này có vẻ CHƯA từng deploy.
       Bản 2707 không dựng site từ đầu. Dùng ./deploy.sh --fresh-seed (site mới)
       hoặc ./deploy.sh --import-db (import dump) trước, rồi quay lại đây."
elif echo "$APPLIED" | grep -qx 'dev'; then
  warn "payload_migrations chỉ có dòng 'dev' (DB đang ở chế độ push, kiểu DB local).
       Chạy 'payload migrate' lên DB này sẽ FAIL vì migration initial tưởng DB trống.
       Nếu đây đúng là DB production thì phải baseline trước (./deploy.sh --import-db)."
fi

PENDING=""
while IFS= read -r m; do
  [[ -z "$m" ]] && continue
  echo "$APPLIED" | grep -qx "$m" || PENDING+="$m"$'\n'
done <<< "$REGISTERED"
PENDING="$(echo "$PENDING" | sed '/^$/d')"

if [[ -z "$PENDING" ]]; then
  ok "Không có migration mới (DB đã ở bản mới nhất)"
else
  printf '\033[1;33m  !\033[0m Migration SẼ CHẠY:\n'
  while IFS= read -r m; do printf '      • %s\n' "$m"; done <<< "$PENDING"
fi

# Bảng của luồng lead đã tồn tại chưa
LEAD_TABLES="$(psql "$DATABASE_URL" -tAc \
  "select count(*) from information_schema.tables
    where table_schema='public'
      and table_name in ('leads','lead_conversations','lead_messages','payload_jobs')" 2>/dev/null || echo 0)"
ok "Bảng luồng lead hiện có: $LEAD_TABLES/4 (0 = deploy lần đầu, 4 = đã có)"

# ---- 4. Cron hiện tại -------------------------------------------------------
CRON_SCRIPT="$ROOT/scripts/payload-jobs-cron.sh"
if crontab -l 2>/dev/null | grep -q 'payload-jobs-cron.sh'; then
  ok "Cron job runner: ĐÃ CÀI ($(crontab -l 2>/dev/null | grep 'payload-jobs-cron.sh' | head -1 | awk '{print $1,$2,$3,$4,$5}'))"
  CRON_EXISTS=1
else
  warn "Cron job runner: CHƯA CÀI — email chủ động sẽ không được gửi."
  CRON_EXISTS=0
fi

# ---- CHECK-ONLY dừng ở đây --------------------------------------------------
if [[ "$CHECK_ONLY" -eq 1 ]]; then
  echo
  if [[ "$PROBLEMS" -gt 0 ]]; then
    die "$PROBLEMS vấn đề BẮT BUỘC phải sửa trước khi deploy (xem dấu ✗ ở trên)."
  fi
  log "PREFLIGHT ĐẠT. Chạy tiếp: ./deploy2707.sh"
  exit 0
fi

[[ "$PROBLEMS" -eq 0 ]] || die "$PROBLEMS vấn đề BẮT BUỘC (xem ✗). Sửa .env rồi chạy lại './deploy2707.sh --check'."

# ---- ROLLBACK DB (dừng riêng) ----------------------------------------------
if [[ "$ROLLBACK_DB" -eq 1 ]]; then
  LAST="$(ls -1t "$ROOT"/backups/pre-2707-*.sql 2>/dev/null | head -n1 || true)"
  [[ -n "$LAST" ]] || die "Không thấy backup pre-2707-*.sql nào trong ./backups"
  warn "SẼ GHI ĐÈ toàn bộ DB bằng: ${LAST#$ROOT/}"
  read -r -p "  Chắc chắn? [y/N] " a; [[ "$a" =~ ^[Yy]$ ]] || die "Đã hủy."
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$LAST"
  ok "Đã khôi phục DB. Nhớ 'pm2 restart all' và deploy lại code bản cũ nếu cần."
  exit 0
fi

# ---- 5. Backup DB -----------------------------------------------------------
BACKUP_FILE=""
if [[ "$DO_BACKUP" -eq 1 ]]; then
  log "Backup DB trước khi migrate"
  mkdir -p "$ROOT/backups"
  BACKUP_FILE="$ROOT/backups/pre-2707-$(date +%Y%m%d_%H%M%S).sql"
  pg_dump "$DATABASE_URL" --clean --if-exists --no-owner --no-privileges -f "$BACKUP_FILE" \
    || die "pg_dump thất bại. Sửa rồi chạy lại, hoặc --no-backup nếu bạn đã có bản backup khác."
  ok "Backup: ${BACKUP_FILE#$ROOT/} ($(du -h "$BACKUP_FILE" | cut -f1))"
  ok "Khôi phục khi cần:  ./deploy2707.sh --rollback-db"
else
  warn "Bỏ qua backup (--no-backup)."
fi

# ---- 6. Đồng bộ code --------------------------------------------------------
log "Đồng bộ code: origin/$BRANCH"
git fetch origin --prune
git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
ok "HEAD -> $(git log -1 --oneline)"

# ---- 7. Dependencies --------------------------------------------------------
log "Cài dependencies (frozen lockfile)"
pnpm install --frozen-lockfile
ok "Xong"

# ---- 8. Migration -----------------------------------------------------------
log "Chạy migration"
pnpm --filter @x/cms db:migrate
ok "Migration xong"

psql "$DATABASE_URL" -tAc \
  "select count(*) from information_schema.tables
    where table_schema='public' and table_name in ('payload_jobs','payload_jobs_log')" \
  | grep -qx 2 \
  && ok "Bảng hàng đợi job (payload_jobs, payload_jobs_log) đã có" \
  || die "Sau migrate vẫn thiếu bảng payload_jobs — job chăm sóc lead sẽ không chạy. Kiểm tra log migrate."

# ---- 9. Media ---------------------------------------------------------------
MEDIA_DIR="$(envval MEDIA_DIR)"; MEDIA_DIR="${MEDIA_DIR:-$ROOT/apps/cms/media}"
mkdir -p "$MEDIA_DIR"
ok "Thư mục media: $MEDIA_DIR ($(find "$MEDIA_DIR" -type f 2>/dev/null | wc -l) file)"

# ---- 10. Build --------------------------------------------------------------
log "Build @x/cms"
pnpm --filter @x/cms build
log "Build @x/clay"
pnpm --filter @x/clay build
ok "Build xong"

# ---- 11. Cron cho job runner ------------------------------------------------
# Secret KHÔNG nằm trong crontab (crontab -l ai đọc cũng thấy) — wrapper đọc từ .env.
if [[ "$DO_CRON" -eq 1 ]]; then
  log "Cài cron gọi job runner (mỗi $CRON_MINUTES phút)"
  mkdir -p "$ROOT/scripts" "$ROOT/logs"
  cat > "$CRON_SCRIPT" <<CRONEOF
#!/usr/bin/env bash
# Gọi job runner của Payload để xử lý job đến hạn (email chủ động cho lead im lặng).
# Do cron gọi — xem crontab -l. Secret đọc từ .env nên không lộ trong crontab.
set -euo pipefail
ROOT="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
SECRET="\$(grep -E '^CRON_SECRET=' "\$ROOT/.env" | head -n1 | sed -E 's/^CRON_SECRET=//; s/^["'"'"']//; s/["'"'"']\$//')"
[[ -n "\$SECRET" ]] || { echo "\$(date -Is) CRON_SECRET trống trong .env"; exit 1; }
# Endpoint của Payload là GET (không phải POST) để dùng được với cron/Vercel Cron.
code="\$(curl -sS -o /tmp/payload-jobs-out.json -w '%{http_code}' --max-time 120 \\
  -H "Authorization: Bearer \$SECRET" \\
  "http://127.0.0.1:${CMS_PORT}/api/payload-jobs/run" || echo 000)"
echo "\$(date -Is) HTTP \$code \$(head -c 200 /tmp/payload-jobs-out.json 2>/dev/null)"
[[ "\$code" == "200" ]]
CRONEOF
  chmod +x "$CRON_SCRIPT"
  ok "Đã tạo scripts/payload-jobs-cron.sh"

  CRON_LINE="*/$CRON_MINUTES * * * * $CRON_SCRIPT >> $ROOT/logs/payload-jobs.log 2>&1"
  if [[ "$CRON_EXISTS" -eq 1 ]]; then
    crontab -l 2>/dev/null | grep -v 'payload-jobs-cron.sh' | { cat; echo "$CRON_LINE"; } | crontab -
    ok "Đã cập nhật dòng cron sẵn có"
  else
    { crontab -l 2>/dev/null || true; echo "$CRON_LINE"; } | crontab -
    ok "Đã thêm cron mới"
  fi
  printf '      %s\n' "$CRON_LINE"
else
  warn "Bỏ qua cài cron (--no-cron). Nhớ tự cài, nếu không email chủ động sẽ không gửi."
fi

# ---- 12. PM2 ----------------------------------------------------------------
ECO="$ROOT/ecosystem.config.cjs"
if [[ "$DO_RESTART" -eq 0 ]]; then
  warn "Bỏ qua reload PM2 (--no-restart)."
else
  [[ -f "$ECO" ]] || die "Thiếu ecosystem.config.cjs. Chạy ./deploy.sh một lần để sinh file này."
  log "Reload PM2"
  pm2 startOrReload "$ECO" --update-env
  pm2 save
  pm2 status

  log "Health check"
  sleep 4
  for pair in "CMS|http://127.0.0.1:$CMS_PORT/api/health" "clay|http://127.0.0.1:$CLAY_PORT/api/health"; do
    svc="${pair%%|*}"; url="${pair#*|}"
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url" || echo 000)"
    [[ "$code" == "200" ]] && ok "$svc OK" || fail "$svc -> $code (xem: pm2 logs)"
  done

  # Job runner: xác minh auth đúng chiều cả 2 phía.
  log "Kiểm tra job runner"
  c_no="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    "http://127.0.0.1:$CMS_PORT/api/payload-jobs/run" || echo 000)"
  [[ "$c_no" == "401" ]] && ok "Không secret -> 401 (đúng: endpoint được bảo vệ)" \
    || fail "Không secret -> $c_no (KHÔNG PHẢI 401 — endpoint đang hở, kiểm tra CRON_SECRET)"

  c_yes="$(curl -s -o /dev/null -w '%{http_code}' --max-time 120 \
    -H "Authorization: Bearer $CRON_SECRET_VAL" \
    "http://127.0.0.1:$CMS_PORT/api/payload-jobs/run" || echo 000)"
  [[ "$c_yes" == "200" ]] && ok "Có secret -> 200 (job runner chạy được)" \
    || fail "Có secret -> $c_yes (job runner KHÔNG chạy được)"
fi

# ---- 13. Smoke test (tùy chọn — GỬI MAIL THẬT) ------------------------------
if [[ -n "$SMOKE_EMAIL" ]]; then
  log "Smoke test luồng lead → $SMOKE_EMAIL"
  warn "Bước này GỬI MAIL THẬT tới $SMOKE_EMAIL và có thể gửi brief tới LEAD_NOTIFY_TO."
  DEV_ID="smoke-$(date +%s)"
  RESP="$(curl -s --max-time 180 "http://127.0.0.1:$CMS_PORT/api/lead/intake" \
    -H 'content-type: application/json' \
    --data-binary @- <<JSON || true
{"email":"$SMOKE_EMAIL","fullName":"Smoke Test","company":"Test Co",
 "message":"Kiểm tra luồng chăm sóc tự động sau deploy 2707",
 "deviceId":"$DEV_ID","siteCode":"corporate","consent":true,"formCode":"contact"}
JSON
)"
  echo "      $RESP"
  PUBID="$(echo "$RESP" | sed -nE 's/.*"conversationPublicId":"([^"]+)".*/\1/p')"
  if [[ -n "$PUBID" ]]; then
    ok "Tạo hội thoại: $PUBID"
    ok "Kiểm tra hộp thư $SMOKE_EMAIL — phải có mail 'XTECH đã nhận yêu cầu tư vấn'"
    DELAY="$(envval LEAD_FOLLOWUP_DELAY_MINUTES)"; DELAY="${DELAY:-30}"
    ok "Sau ~$DELAY phút (cron chạy mỗi $CRON_MINUTES phút) phải có mail chủ động thứ hai"
    echo
    echo "      Theo dõi:"
    echo "        psql \"\$DATABASE_URL\" -c \"select type,summary,created_at from lead_activities a"
    echo "          join lead_conversations c on c.id=a.conversation_id"
    echo "          where c.public_id='$PUBID' order by a.created_at;\""
    echo "      Dọn dữ liệu test sau khi xong:"
    echo "        psql \"\$DATABASE_URL\" -c \"delete from leads where email='$SMOKE_EMAIL';\""
  else
    fail "Intake không trả về conversationPublicId — xem 'pm2 logs xweb-cms'."
  fi
fi

# ---- Kết ---------------------------------------------------------------------
echo
if [[ "$PROBLEMS" -gt 0 ]]; then
  warn "Deploy xong nhưng có $PROBLEMS cảnh báo ✗ ở trên — xử lý nốt."
else
  log "HOÀN TẤT — không có lỗi."
fi

REPLY_DOMAIN="$(envval LEAD_REPLY_DOMAIN)"; REPLY_DOMAIN="${REPLY_DOMAIN:-reply.x-tech.com.vn}"

cat <<EON

VIỆC CÒN LẠI (làm 1 lần, ngoài script):

 1. Tạo bản ghi 'consultants' trong admin (ít nhất 1 cái tick isDefault).
    Không có thì brief handoff rơi về LEAD_CONSULTANT_TO / LEAD_NOTIFY_TO.
    -> https://<cms-domain>/admin/collections/consultants

 2. Cấu hình INBOUND MAIL nếu muốn khách trả lời email vào thẳng hệ thống:
    - MX của ${REPLY_DOMAIN} trỏ về provider (Postmark/Mailgun/SendGrid/Elastic).
    - Provider POST về:
        https://<cms-domain>/api/lead/email-reply
        header  x-lead-webhook-secret: <LEAD_INBOUND_SECRET>
        (hoặc  ?secret=<LEAD_INBOUND_SECRET>  nếu provider không set được header)
    Chưa làm bước này thì email chỉ MỘT CHIỀU.

 3. Kiểm tra cron sau 5–10 phút:
      tail -f $ROOT/logs/payload-jobs.log      # phải thấy 'HTTP 200' đều đặn
      crontab -l | grep payload-jobs

 4. Xem hàng đợi job bất cứ lúc nào:
      psql "\$DATABASE_URL" -c "select task_slug, wait_until, completed_at, has_error
        from payload_jobs order by wait_until desc limit 20;"

 5. Nginx (CloudPanel) reverse proxy — giống deploy thường:
      cms.<domain> -> http://127.0.0.1:$CMS_PORT
      <domain>     -> http://127.0.0.1:$CLAY_PORT

Rollback nhanh:
   ./deploy2707.sh --rollback-db      # DB về trước migrate
   BRANCH=main ./deploy.sh            # code về main
EON
