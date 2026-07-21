/* One-off: delete specific service-sections by sectionId. Usage:
   pnpm --filter @x/cms exec payload run ./src/seed/delete-sections.ts id1,id2 */
import { getPayload } from 'payload'
import config from '@payload-config'

const ids = (process.argv[2] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const payload = await getPayload({ config })
let n = 0
for (const sectionId of ids) {
  const r = await payload.delete({ collection: 'service-sections', where: { sectionId: { equals: sectionId } } })
  n += r.docs?.length ?? 0
  console.log('deleted', sectionId, '=>', r.docs?.length ?? 0)
}
console.log('total deleted:', n)
process.exit(0)
