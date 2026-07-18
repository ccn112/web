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
    meta: {
      titleSuffix: '— X Web Platform',
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
    // Schema management: dev auto-pushes; prod uses migrations. Set
    // PAYLOAD_DB_PUSH=true for a first prod deploy to bootstrap tables without a
    // migration, then switch it off and run `payload migrate`. Unset = default.
    ...(process.env.PAYLOAD_DB_PUSH ? { push: process.env.PAYLOAD_DB_PUSH === 'true' } : {}),
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
