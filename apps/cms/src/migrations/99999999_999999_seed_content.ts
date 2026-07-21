import { type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

import { runSeed } from '../seed/index.js'

/**
 * Data migration — nạp toàn bộ seed content qua migrate (KHÔNG dùng `pnpm db:seed` ở prod).
 *
 * Quy ước (bắt buộc): mọi seed DB phải đi qua migration để prod tái tạo được bằng
 * `payload migrate` một cách xác định, có thứ tự, và rollback-able.
 *
 * Thứ tự: tiền tố `99999999_999999_` đảm bảo migration này chạy SAU migration schema
 * (tạo bảng). `runSeed` là idempotent (upsert theo natural key) nên chạy lại vô hại.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await runSeed(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Seed idempotent (upsert theo natural key) → không rollback phá dữ liệu ở đây.
  // Nếu cần gỡ nội dung seed, viết migration xoá riêng theo natural key.
}
