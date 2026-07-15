/**
 * Shape transforms between the handoff seed JSON and the Payload collection fields.
 * The only structural transform is comparisonTable.rows (string[][] -> [{ cells }]); everything
 * else maps 1:1 because block field names were chosen to match the seed (see D-005).
 */

type RawBlock = Record<string, unknown> & { blockType: string }

/** Normalize a single block for Payload's blocks field. */
export function normalizeBlock(block: RawBlock): RawBlock {
  if (block.blockType === 'comparisonTable' && Array.isArray(block.rows)) {
    const rows = block.rows as unknown[]
    // string[][] -> [{ cells: string[] }]
    const alreadyWrapped =
      rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null && 'cells' in (rows[0] as object)
    if (!alreadyWrapped) {
      return {
        ...block,
        rows: (rows as string[][]).map((cells) => ({ cells })),
      }
    }
  }
  return block
}

export function normalizeBlocks(blocks: unknown): RawBlock[] {
  if (!Array.isArray(blocks)) return []
  return blocks.map((b) => normalizeBlock(b as RawBlock))
}

export interface RawSite {
  code: string
  name: string
  domain?: string | null
  product?: string | null
  tagline?: string
  theme?: Record<string, unknown>
  chatbot?: Record<string, unknown>
}

export function normalizeSite(raw: RawSite) {
  return {
    code: raw.code,
    name: raw.name,
    primaryDomain: raw.domain ?? null,
    product: raw.product ?? null,
    tagline: raw.tagline,
    theme: raw.theme ?? {},
    chatbotConfig: raw.chatbot ?? { enabled: true },
    status: 'published' as const,
  }
}
