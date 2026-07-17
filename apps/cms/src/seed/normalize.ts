/**
 * Shape transforms between the handoff seed JSON and the Payload collection fields.
 * The only structural transform is comparisonTable.rows (string[][] -> [{ cells }]); everything
 * else maps 1:1 because block field names were chosen to match the seed (see D-005).
 */

type RawBlock = Record<string, unknown> & { blockType: string }

/**
 * Normalize a single block for Payload's blocks field.
 * - comparisonTable.rows: string[][] -> [{ cells }] (D-005).
 * - illustrationAsset (a symbolic media code like "COR-02") -> illustration (a Media doc id),
 *   resolved via `mediaByCode`. Keeps seed JSON decoupled from generated uuids.
 */
export function normalizeBlock(block: RawBlock, mediaByCode?: Map<string, string>): RawBlock {
  let out: RawBlock = block

  if (out.blockType === 'comparisonTable' && Array.isArray(out.rows)) {
    const rows = out.rows as unknown[]
    const alreadyWrapped =
      rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null && 'cells' in (rows[0] as object)
    if (!alreadyWrapped) {
      out = { ...out, rows: (rows as string[][]).map((cells) => ({ cells })) }
    }
  }

  if (typeof out.illustrationAsset === 'string') {
    const { illustrationAsset, ...rest } = out
    const id = mediaByCode?.get(illustrationAsset as string)
    out = id ? { ...rest, blockType: out.blockType, illustration: id } : { ...rest, blockType: out.blockType }
  }

  // backgroundAsset (a symbolic media code like "BG-HOME") -> background (a Media doc id).
  if (typeof out.backgroundAsset === 'string') {
    const { backgroundAsset, ...rest } = out
    const id = mediaByCode?.get(backgroundAsset as string)
    out = id ? { ...rest, blockType: out.blockType, background: id } : { ...rest, blockType: out.blockType }
  }

  return out
}

export function normalizeBlocks(blocks: unknown, mediaByCode?: Map<string, string>): RawBlock[] {
  if (!Array.isArray(blocks)) return []
  return blocks.map((b) => normalizeBlock(b as RawBlock, mediaByCode))
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
