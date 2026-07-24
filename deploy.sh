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
