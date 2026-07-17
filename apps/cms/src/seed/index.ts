/**
 * Idempotent seed runner. Imports every handoff seed JSON into Payload.
 *
 * Run: `pnpm db:seed`  (which calls `payload run ./src/seed/index.ts`)
 *
 * Idempotency: each record is upserted by its natural key
 *   - sites/forms/prompt-sets : code
 *   - menus                    : (siteCode, code, locale)
 *   - pages/posts              : (siteCode, locale, slug)
 * so running the seed twice never duplicates rows (Acceptance Criteria: "Seed can run twice").
 */
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { getPayload, type Payload, type Where } from 'payload'
import config from '@payload-config'

import { normalizeBlocks, normalizeSite, type RawSite } from './normalize'

const dirname = path.dirname(fileURLToPath(import.meta.url))
// apps/cms/src/seed -> repo root is four levels up.
const REPO_ROOT = path.resolve(dirname, '../../../..')
const SEED_DIR =
  process.env.SEED_DIR ?? path.join(REPO_ROOT, 'X_WEB_PLATFORM_HANDOFF_20260715', 'seed')

async function readJson<T>(file: string): Promise<T> {
  const raw = await readFile(path.join(SEED_DIR, file), 'utf8')
  return JSON.parse(raw) as T
}

/** Find-one-or-create-or-update by a natural-key where clause. */
async function upsert(
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  where: Where,
  data: Record<string, unknown>,
): Promise<{ id: string; created: boolean }> {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0, overrideAccess: true })
  const found = existing.docs[0] as { id: string } | undefined
  if (found) {
    await payload.update({ collection, id: found.id, data, overrideAccess: true })
    return { id: found.id, created: false }
  }
  const doc = (await payload.create({ collection, data, overrideAccess: true })) as { id: string }
  return { id: doc.id, created: true }
}

async function seedAdminUser(payload: Payload): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@x.vn'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345'
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    console.log(`  user: ${email} (exists)`)
    return
  }
  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      fullName: 'X Super Admin',
      role: 'super_admin',
      allowedSiteCodes: [],
    },
    overrideAccess: true,
  })
  console.log(`  user: ${email} (created)`)
}

type MediaJson = { code: string; site?: string; file: string; alt: string }
/**
 * Upsert Media uploads from local files (idempotent by filename). Returns a map of
 * symbolic asset code -> Media doc id, so page blocks can reference `illustrationAsset: "COR-02"`
 * without hard-coding generated uuids.
 */
async function seedMedia(
  payload: Payload,
  media: MediaJson[],
  siteIdByCode: Map<string, string>,
): Promise<Map<string, string>> {
  const idByCode = new Map<string, string>()
  for (const m of media) {
    const filename = path.basename(m.file)
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const found = existing.docs[0] as { id: string } | undefined
    const siteId = m.site ? siteIdByCode.get(m.site) : undefined
    const data: Record<string, unknown> = { alt: m.alt }
    if (siteId) data.site = siteId
    if (found) {
      await payload.update({ collection: 'media', id: found.id, data, overrideAccess: true })
      idByCode.set(m.code, found.id)
    } else {
      const doc = (await payload.create({
        collection: 'media',
        data,
        filePath: path.join(SEED_DIR, m.file),
        overrideAccess: true,
      } as Parameters<Payload['create']>[0])) as { id: string }
      idByCode.set(m.code, doc.id)
    }
  }
  return idByCode
}

type MenusJson = Record<string, unknown[]>
type FormJson = { code: string; name: string; siteScope: string[]; successMessage?: string; fields: string[] }
type PromptSetJson = { code: string; site: string; prompts: unknown[] }
type PageJson = {
  site: string
  slug: string
  title: string
  pageType: string
  locale?: string
  status?: string
  pageSummary?: string
  seo?: Record<string, unknown>
  blocks?: unknown[]
  suggestedPrompts?: string[]
  relatedPages?: unknown[]
}
type PostJson = {
  site: string
  slug: string
  title: string
  excerpt?: string
  category?: string
  tags?: string[]
  status?: string
  body?: unknown[]
  seo?: Record<string, unknown>
}
type ServiceSectionJson = {
  site: string
  sectionId: string
  visualType: string
  eyebrow?: string
  title: string
  subtitle?: string
  routes: string[]
  order?: number
  items?: unknown[]
  process?: unknown[]
  outcomes?: unknown[]
  cta?: Record<string, unknown>
  status?: string
}

async function run(): Promise<void> {
  const payload = await getPayload({ config })
  const counts = { created: 0, updated: 0 }
  const tally = (r: { created: boolean }) => (r.created ? counts.created++ : counts.updated++)

  console.log('Seeding X Web Platform...')
  console.log(`Seed dir: ${SEED_DIR}`)

  // 1. Admin user
  console.log('• Users')
  await seedAdminUser(payload)

  // 2. Sites -> map code -> id
  console.log('• Sites')
  const sitesRaw = await readJson<RawSite[]>('sites.json')
  const siteIdByCode = new Map<string, string>()
  for (const raw of sitesRaw) {
    const data = normalizeSite(raw)
    const r = await upsert(payload, 'sites', { code: { equals: data.code } }, data)
    siteIdByCode.set(data.code, r.id)
    tally(r)
  }
  console.log(`  ${sitesRaw.length} sites`)

  const requireSite = (code: string): string => {
    const id = siteIdByCode.get(code)
    if (!id) throw new Error(`Seed references unknown site code: ${code}`)
    return id
  }

  // 2.5 Media uploads -> map asset code -> id (media.json is optional).
  console.log('• Media')
  let mediaJson: MediaJson[] = []
  try {
    mediaJson = await readJson<MediaJson[]>('media.json')
  } catch {
    mediaJson = []
  }
  const mediaIdByCode = await seedMedia(payload, mediaJson, siteIdByCode)
  console.log(`  ${mediaJson.length} media`)

  // 3. Menus (object keyed by site code)
  console.log('• Menus')
  const menusJson = await readJson<MenusJson>('menus.json')
  for (const [siteCode, items] of Object.entries(menusJson)) {
    const r = await upsert(
      payload,
      'menus',
      { and: [{ siteCode: { equals: siteCode } }, { code: { equals: 'main' } }, { locale: { equals: 'vi' } }] },
      { site: requireSite(siteCode), code: 'main', locale: 'vi', items },
    )
    tally(r)
  }
  console.log(`  ${Object.keys(menusJson).length} menus`)

  // 4. Forms
  console.log('• Forms')
  const formsJson = await readJson<FormJson[]>('forms.json')
  for (const f of formsJson) {
    const r = await upsert(
      payload,
      'forms',
      { code: { equals: f.code } },
      { code: f.code, name: f.name, siteScope: f.siteScope, fields: f.fields, successMessage: f.successMessage },
    )
    tally(r)
  }
  console.log(`  ${formsJson.length} forms`)

  // 5. Prompt sets
  console.log('• Prompt sets')
  const promptSets = await readJson<PromptSetJson[]>('prompt-sets.json')
  for (const ps of promptSets) {
    const r = await upsert(
      payload,
      'prompt-sets',
      { code: { equals: ps.code } },
      { code: ps.code, site: requireSite(ps.site), prompts: ps.prompts },
    )
    tally(r)
  }
  console.log(`  ${promptSets.length} prompt sets`)

  // 6. Pages
  console.log('• Pages')
  const pages = await readJson<PageJson[]>('pages.json')
  for (const p of pages) {
    const locale = p.locale ?? 'vi'
    const r = await upsert(
      payload,
      'pages',
      {
        and: [
          { siteCode: { equals: p.site } },
          { locale: { equals: locale } },
          { slug: { equals: p.slug } },
        ],
      },
      {
        site: requireSite(p.site),
        slug: p.slug,
        title: p.title,
        pageType: p.pageType,
        locale,
        summary: p.pageSummary,
        seo: p.seo ?? {},
        blocks: normalizeBlocks(p.blocks, mediaIdByCode),
        suggestedPrompts: p.suggestedPrompts ?? [],
        status: p.status ?? 'published',
      },
    )
    tally(r)
  }
  console.log(`  ${pages.length} pages`)

  // 7. Posts
  console.log('• Posts')
  const posts = await readJson<PostJson[]>('posts.json')
  for (const post of posts) {
    const r = await upsert(
      payload,
      'posts',
      {
        and: [{ siteCode: { equals: post.site } }, { locale: { equals: 'vi' } }, { slug: { equals: post.slug } }],
      },
      {
        site: requireSite(post.site),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags ?? [],
        locale: 'vi',
        body: post.body ?? [],
        seo: post.seo ?? {},
        status: post.status ?? 'published',
      },
    )
    tally(r)
  }
  console.log(`  ${posts.length} posts`)

  // 8. Service sections (SET C02) — optional file.
  console.log('• Service sections')
  let serviceSections: ServiceSectionJson[] = []
  try {
    serviceSections = await readJson<ServiceSectionJson[]>('service-sections.json')
  } catch {
    serviceSections = []
  }
  for (const s of serviceSections) {
    const r = await upsert(
      payload,
      'service-sections',
      {
        and: [{ siteCode: { equals: s.site } }, { locale: { equals: 'vi' } }, { sectionId: { equals: s.sectionId } }],
      },
      {
        site: requireSite(s.site),
        sectionId: s.sectionId,
        visualType: s.visualType,
        eyebrow: s.eyebrow,
        title: s.title,
        subtitle: s.subtitle,
        routes: s.routes,
        order: s.order,
        items: s.items ?? [],
        process: s.process ?? [],
        outcomes: s.outcomes ?? [],
        cta: s.cta ?? {},
        locale: 'vi',
        status: s.status ?? 'published',
      },
    )
    tally(r)
  }
  console.log(`  ${serviceSections.length} service sections`)

  // 9. Redirects (route reconciliation) — optional file.
  console.log('• Redirects')
  let redirects: Array<{
    site: string
    sourcePath: string
    destinationPath: string
    permanent?: boolean
  }> = []
  try {
    redirects = await readJson('redirects.json')
  } catch {
    redirects = []
  }
  for (const rd of redirects) {
    const r = await upsert(
      payload,
      'redirects',
      { and: [{ siteCode: { equals: rd.site } }, { sourcePath: { equals: rd.sourcePath } }] },
      {
        site: requireSite(rd.site),
        sourcePath: rd.sourcePath,
        destinationPath: rd.destinationPath,
        permanent: rd.permanent ?? true,
      },
    )
    tally(r)
    // Remove any retired page still sitting at the old slug so the redirect
    // (checked only on 404) actually fires instead of serving stale content.
    await payload.delete({
      collection: 'pages',
      where: { and: [{ siteCode: { equals: rd.site } }, { slug: { equals: rd.sourcePath } }] },
      overrideAccess: true,
    })
  }
  console.log(`  ${redirects.length} redirects`)

  console.log(`\nDone. Created ${counts.created}, updated ${counts.updated}.`)
}

// Top-level await: `payload run` awaits the module's evaluation, so the process stays alive
// until seeding completes (a floating promise would let it exit before any work happens).
try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Seed failed:', err)
  process.exit(1)
}
