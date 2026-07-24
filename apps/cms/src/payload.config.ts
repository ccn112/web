import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { config as loadEnv } from 'dotenv'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { collections } from './collections/index'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Env lives at the repo root (single .env for the whole workspace). apps/cms/src -> ../../../.env
loadEnv({ path: path.resolve(dirname, '../../../.env') })

const useS3 = process.env.USE_S3 === 'true'
const isProd = process.env.NODE_ENV === 'production'
// Schema management policy:
//   - dev: auto-push for fast iteration (disable with PAYLOAD_DB_PUSH=false).
//   - production: NEVER push — schema changes go through `payload migrate` only.
// Production forces push=false even if PAYLOAD_DB_PUSH=true is set in the
// environment; that flag is a dev-only escape hatch and must never touch prod.
const dbPush = isProd ? false : process.env.PAYLOAD_DB_PUSH !== 'false'

/** S3/MinIO media storage — only enabled when USE_S3=true, otherwise media lives on local disk. */
const storagePlugins = useS3
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET ?? 'x-media',
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION ?? 'us-east-1',
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  // The admin panel is gated to authenticated staff via Users.access.admin (canAccessAdmin).
  admin: {
    user: 'users',
    // XTECH admin theme (handoff/XTECH_PAYLOADCMS_THEME_HANDOFF_V1). Chỉ lớp hiển thị.
    // CSS nạp qua src/app/(payload)/custom.scss (@import brand.css) — Payload 3 không có admin.css.
    meta: {
      titleSuffix: '— XTECH Admin',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/brand/xtech-favicon-square.png' },
        { rel: 'apple-touch-icon', type: 'image/png', url: '/brand/xtech-favicon-square.png' },
      ],
    },
    components: {
      graphics: {
        Logo: '@/admin/components/BrandLogo#BrandLogo',
        Icon: '@/admin/components/BrandIcon#BrandIcon',
      },
      beforeLogin: ['@/admin/components/LoginHero#LoginHero'],
      beforeDashboard: ['@/admin/components/DashboardWelcome#DashboardWelcome'],
    },
  },
  routes: {
    // Served under apps/cms; admin at /admin, REST at /api.
    admin: '/admin',
    api: '/api',
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'INSECURE_DEV_SECRET_CHANGE_ME',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // UUID primary keys to match db/schema.sql and the chat contract (pageId: uuid). See D-001.
    idType: 'uuid',
    push: dbPush,
    // Defaults to the `public` schema. PAYLOAD_DB_SCHEMA lets CI/local point a run
    // at an isolated, empty schema to generate/validate migrations without a fresh
    // database. Leave unset in production.
    ...(process.env.PAYLOAD_DB_SCHEMA ? { schemaName: process.env.PAYLOAD_DB_SCHEMA } : {}),
    // Explicit so the Payload CLI and the Docker migrator target resolve the same
    // location regardless of cwd. Migrations are committed TS files.
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [...storagePlugins],
  graphQL: {
    disable: false,
  },
})
