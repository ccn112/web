#!/usr/bin/env bash
# =============================================================================
# Vá schema luồng lead khi migration bị "đánh dấu applied nhưng chưa từng chạy"
# =============================================================================
# TRIỆU CHỨNG: sửa bất kỳ document nào trong admin là lỗi
#   error: column "…leads_id" does not exist   (Postgres 42703)
#   at checkDocumentLockStatus → deleteMany → findMany
#
# NGUYÊN NHÂN: `deploy.sh --import-db` và `--fresh-seed` đều làm
#     DELETE FROM payload_migrations;
#     INSERT INTO payload_migrations VALUES (<mọi migration trong index.ts>, 1);
# tức đánh dấu TẤT CẢ là đã chạy. Nếu dump import vào có schema cũ hơn phần lead
# thì `payload migrate` sẽ không bao giờ chạy 20260725_060131_add_lead_consultation
# nữa — DB thiếu 13 bảng lead và 9 cột `*_id` trong payload_locked_documents_rels.
# Payload khoá document qua bảng rels đó, nên MỌI thao tác sửa trong admin đều chết.
#
# CÁCH DÙNG (trên VPS, tại thư mục gốc repo):
#   ./scripts/fix-lead-schema.sh --check    # chỉ chẩn đoán, không sửa gì
#   ./scripts/fix-lead-schema.sh            # backup rồi vá
#
# Script tự chọn đường sửa theo trạng thái thật của DB, và idempotent —
# chạy lại nhiều lần không hỏng thêm.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CHECK_ONLY=0
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=1

log()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m  ✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  !\033[0m %s\n' "$*"; }
die()  { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

command -v psql >/dev/null || die "Thiếu psql (apt-get install -y postgresql-client)"
[[ -f "$ROOT/.env" ]] || die "Thiếu $ROOT/.env"

DB="$(grep -E '^DATABASE_URL=' "$ROOT/.env" | head -n1 | sed -E 's/^DATABASE_URL=//; s/^["'"'"']//; s/["'"'"']$//' || true)"
[[ -n "$DB" ]] || die "Không đọc được DATABASE_URL trong .env"
q() { psql "$DB" -v ON_ERROR_STOP=1 -tAc "$1"; }

LEAD_TABLES=(leads lead_devices lead_conversations lead_conversations_channels
  lead_conversations_rels lead_messages resume_tokens email_templates consultants
  consultants_specialties consultants_texts consultant_assignments lead_activities)
REL_COLS=(leads_id lead_devices_id lead_conversations_id lead_messages_id
  resume_tokens_id email_templates_id consultants_id consultant_assignments_id
  lead_activities_id)
MIG_LEAD='20260725_060131_add_lead_consultation'

# ---- Chẩn đoán --------------------------------------------------------------
log "Chẩn đoán"
q 'select 1' >/dev/null || die "Không kết nối được DB."

# 'a','b','c' cho mệnh đề IN. Dùng printf chứ không phải IFS: bash chỉ lấy KÝ TỰ
# ĐẦU của IFS khi nối "$*", nên IFS="','" sẽ ra 'a'b'c' — sai mà rất khó thấy.
in_list() { printf "'%s'," "$@" | sed 's/,$//'; }
N_TABLES="$(q "select count(*) from information_schema.tables
  where table_schema='public' and table_name in ($(in_list "${LEAD_TABLES[@]}"))")"
N_COLS="$(q "select count(*) from information_schema.columns
  where table_name='payload_locked_documents_rels'
    and column_name in ($(in_list "${REL_COLS[@]}"))")"
MIG_MARKED="$(q "select count(*) from payload_migrations where name='$MIG_LEAD'")"

printf '      bảng lead          : %s/%s\n' "$N_TABLES" "${#LEAD_TABLES[@]}"
printf '      cột trong rels     : %s/%s\n' "$N_COLS" "${#REL_COLS[@]}"
printf '      migration đánh dấu : %s\n' "$([[ "$MIG_MARKED" == 1 ]] && echo 'CÓ (payload migrate sẽ bỏ qua)' || echo 'chưa')"

MISSING_COLS="$(q "with e(col) as (values $(printf "('%s')," "${REL_COLS[@]}" | sed 's/,$//'))
  select string_agg(e.col, ' ') from e
   left join information_schema.columns c
     on c.table_name='payload_locked_documents_rels' and c.column_name=e.col
   where c.column_name is null")"
[[ -n "$MISSING_COLS" ]] && warn "Cột thiếu: $MISSING_COLS"

if [[ "$N_TABLES" == "${#LEAD_TABLES[@]}" && "$N_COLS" == "${#REL_COLS[@]}" ]]; then
  ok "Schema đã đầy đủ — không cần vá. Lỗi 42703 (nếu còn) đến từ chỗ khác."
  exit 0
fi

# Quyết định đường sửa:
#  A. Không có bảng nào  -> migration chưa hề chạy: bỏ cờ applied rồi chạy lại.
#     (Migration thuần additive, Payload bọc transaction nên fail sẽ rollback sạch.)
#  B. Có đủ bảng, chỉ thiếu cột rels -> vá từng cột. Chạy lại nguyên migration
#     sẽ chết ở "already exists" nên KHÔNG dùng đường A.
#  C. Nửa nạc nửa mỡ -> không tự đoán, dừng lại để người xử lý.
if [[ "$N_TABLES" == 0 ]]; then
  MODE=A
elif [[ "$N_TABLES" == "${#LEAD_TABLES[@]}" ]]; then
  MODE=B
else
  die "DB đang ở trạng thái nửa vời ($N_TABLES/${#LEAD_TABLES[@]} bảng).
     Không tự vá để tránh làm hỏng thêm. Gửi kết quả chẩn đoán ở trên để xử lý tay."
fi
ok "Đường sửa: $MODE — $([[ $MODE == A ]] && echo 'chạy lại migration lead' || echo 'vá cột rels')"

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  log "Chỉ chẩn đoán (--check). Bỏ --check để vá thật."
  exit 0
fi

# ---- Backup -----------------------------------------------------------------
log "Backup DB"
command -v pg_dump >/dev/null || die "Thiếu pg_dump."
mkdir -p "$ROOT/backups"
BK="$ROOT/backups/pre-fix-lead-schema-$(date +%Y%m%d_%H%M%S).sql"
pg_dump "$DB" --clean --if-exists --no-owner --no-privileges -f "$BK" || die "pg_dump thất bại."
ok "Backup: ${BK#$ROOT/} ($(du -h "$BK" | cut -f1))"
ok "Khôi phục nếu cần:  psql \"\$DATABASE_URL\" -f ${BK#$ROOT/}"

# ---- Vá ---------------------------------------------------------------------
if [[ "$MODE" == A ]]; then
  log "Bỏ cờ applied của $MIG_LEAD rồi chạy lại migration"
  psql "$DB" -v ON_ERROR_STOP=1 -q -c "delete from payload_migrations where name='$MIG_LEAD';"
  ok "Đã bỏ cờ"
  command -v pnpm >/dev/null || die "Thiếu pnpm."
  pnpm --filter @x/cms db:migrate
  ok "Migration chạy xong"
else
  log "Vá từng cột trong payload_locked_documents_rels"
  # ADD COLUMN IF NOT EXISTS + CREATE INDEX IF NOT EXISTS là idempotent sẵn;
  # ADD CONSTRAINT thì không, nên bọc trong DO block kiểm tra pg_constraint.
  for pair in \
    "leads_id|leads|leads" \
    "lead_devices_id|lead_devices|lead_devices" \
    "lead_conversations_id|lead_conversations|lead_conversations" \
    "lead_messages_id|lead_messages|lead_messages" \
    "resume_tokens_id|resume_tokens|resume_tokens" \
    "email_templates_id|email_templates|email_templates" \
    "consultants_id|consultants|consultants" \
    "consultant_assignments_id|consultant_assignments|consultant_assignments" \
    "lead_activities_id|lead_activities|lead_activities" \
    ; do
    col="${pair%%|*}"; rest="${pair#*|}"; tbl="${rest%%|*}"; fk="${rest#*|}"
    psql "$DB" -v ON_ERROR_STOP=1 -q <<SQL
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "$col" uuid;
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
                  WHERE conname = 'payload_locked_documents_rels_${fk}_fk') THEN
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_${fk}_fk"
      FOREIGN KEY ("$col") REFERENCES "public"."$tbl"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END \$\$;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_${col}_idx"
  ON "payload_locked_documents_rels" USING btree ("$col");
SQL
    ok "$col"
  done
fi

# ---- Xác minh ---------------------------------------------------------------
log "Xác minh"
N_TABLES2="$(q "select count(*) from information_schema.tables
  where table_schema='public' and table_name in ($(in_list "${LEAD_TABLES[@]}"))")"
N_COLS2="$(q "select count(*) from information_schema.columns
  where table_name='payload_locked_documents_rels'
    and column_name in ($(in_list "${REL_COLS[@]}"))")"
printf '      bảng lead      : %s/%s\n' "$N_TABLES2" "${#LEAD_TABLES[@]}"
printf '      cột trong rels : %s/%s\n' "$N_COLS2" "${#REL_COLS[@]}"
[[ "$N_TABLES2" == "${#LEAD_TABLES[@]}" && "$N_COLS2" == "${#REL_COLS[@]}" ]] \
  || die "Vẫn chưa đủ. Khôi phục: psql \"\$DATABASE_URL\" -f ${BK#$ROOT/}"
ok "Schema đầy đủ"

log "XONG. Khởi động lại CMS rồi thử sửa 1 document trong admin:"
echo "      pm2 restart xweb-cms && pm2 logs xweb-cms --lines 30"
