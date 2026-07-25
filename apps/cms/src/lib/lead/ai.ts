/**
 * The consultative AI layer for lead qualification.
 *
 * Two calls per turn, deliberately:
 *   1. the *reply* — streamed on web chat, awaited on email;
 *   2. the *analyzer* — a cheap non-streaming pass that extracts the ten
 *      qualification slots, a one-paragraph brief and the handoff signals as
 *      JSON.
 *
 * Splitting them keeps token streaming (good chat UX) while still getting
 * reliable structured extraction — a single JSON-emitting call cannot do both.
 */

import {
  estimateCost,
  resolveProvider,
  streamChat,
  type ChatMsg,
  type ChatUsage,
} from '../chat/providers'
import {
  briefLines,
  handoffReasonLabel,
  type Collected,
  type HandoffSignals,
  type LeadState,
  nextQuestion,
  scoreOf,
  SLOTS,
  slotLabel,
  type SlotKey,
} from './state-machine'

export type LeadChannel = 'web-chat' | 'email'

/* ------------------------------------------------------------- completion */

export type Completion = { text: string; usage: ChatUsage; model: string; costUsd: number }

/** Non-streaming completion (drains the provider stream). Used for email + analyzer. */
export async function complete(opts: {
  system: string
  messages: ChatMsg[]
  maxTokens?: number
  /** Force a specific model (the analyzer always uses the cheap one). */
  model?: string
}): Promise<Completion> {
  const resolved = resolveProvider()
  const model = opts.model ?? resolved.model
  const stream = await streamChat({
    provider: resolved.provider,
    model,
    system: opts.system,
    messages: opts.messages,
    attachments: [],
    maxTokens: opts.maxTokens ?? 900,
  })
  let text = ''
  for await (const t of stream.text) text += t
  const usage = await stream.usage
  return { text: text.trim(), usage, model, costUsd: estimateCost(model, usage) }
}

/** Model used for the extraction pass — cheap by design, overridable. */
export function analyzerModel(): string | undefined {
  return process.env.LEAD_ANALYZER_MODEL ?? undefined
}

/* ------------------------------------------------------------------ prompt */

const COMPANY_CONTEXT = `HỆ SINH THÁI XTECH (dùng để đề xuất đúng sản phẩm, không bịa thêm):
- X.AI — AI doanh nghiệp: Enterprise Agents theo vai trò, Knowledge & RAG có trích dẫn, tự động hóa multi-agent, guardrails & tuân thủ.
- XBooking — bán hàng bất động sản khép kín: thu lead đa nguồn, CRM Lead 360, sales pipeline, bảng hàng/quỹ hàng, giữ chỗ & lock cọc, hợp đồng & tiến độ thanh toán, CRM di động.
- FinERP — tài chính & vận hành: kế toán, dòng tiền & công nợ, ngân sách, mua hàng, kho & tài sản, chi phí dự án, mở rộng HRM & lương.
- XBuilding — vận hành tòa nhà & cư dân: quản lý căn hộ/mặt bằng, Resident 360, phí dịch vụ & công nợ, ticket & SLA, app cư dân/BQL, IoT & năng lượng, bảo trì phòng ngừa.
- X.Space — không gian làm việc số: công việc, dự án, tài liệu, phê duyệt/trình ký, tri thức nội bộ + AI.
- Dịch vụ: tư vấn chiến lược, phát triển phần mềm, dữ liệu & AI, vận hành & hỗ trợ.`

const GUARDRAILS = `GIỚI HẠN TUYỆT ĐỐI:
- KHÔNG cam kết giá, chi phí cụ thể, SLA, thời gian triển khai chính xác hay điều khoản pháp lý/hợp đồng. Nếu khách hỏi, nói rõ những nội dung này do chuyên gia XTECH xác nhận sau khảo sát.
- KHÔNG bịa tính năng, khách hàng tham chiếu hay số liệu.
- KHÔNG hỏi lại thông tin khách đã cung cấp (xem phần ĐÃ BIẾT).
- KHÔNG hỏi dồn: mỗi lượt chỉ MỘT câu hỏi.
- Nếu ngoài phạm vi chuyển đổi số / AI / công nghệ bất động sản: từ chối lịch sự trong 1–2 câu và mời quay lại chủ đề.`

function knownBlock(collected: Collected): string {
  const lines = briefLines(collected)
  if (lines.length === 0) return 'ĐÃ BIẾT: (chưa có thông tin nào — hãy bắt đầu từ bài toán ưu tiên)'
  return `ĐÃ BIẾT (không hỏi lại):\n${lines.map((l) => `- ${l.label}: ${l.value}`).join('\n')}`
}

export type ReplyPromptContext = {
  channel: LeadChannel
  collected: Collected
  status: LeadState
  customerName?: string
  companyName?: string
  /** True when this turn is the last AI turn before a consultant takes over. */
  handoffImminent?: boolean
  handoffReason?: string | null
}

/**
 * System prompt for the customer-facing reply. The AI's job is to *narrow* a
 * vague enquiry into a concrete brief, one question at a time, while giving
 * something useful back on every turn so it never reads as an interrogation.
 */
export function replySystemPrompt(ctx: ReplyPromptContext): string {
  const gap = nextQuestion(ctx.collected)
  const score = scoreOf(ctx.collected)
  const who = ctx.customerName ? `Khách hàng: ${ctx.customerName}` : 'Khách hàng: (chưa rõ tên)'
  const company = ctx.companyName ? `Doanh nghiệp: ${ctx.companyName}` : ''

  const channelStyle =
    ctx.channel === 'email'
      ? `KÊNH: EMAIL. Viết như một chuyên viên tư vấn viết email: 3–5 đoạn ngắn, có mở đầu ghi nhận nội dung khách vừa nói, phần giá trị (nhận định/gợi mở ngắn), rồi câu hỏi. KHÔNG chào lại bằng "Kính gửi"/"Dear" (hệ thống đã có tiêu đề và lời mở), KHÔNG ký tên cuối email (hệ thống tự thêm). KHÔNG dùng markdown, KHÔNG dùng ** hay #, chỉ văn xuôi và gạch đầu dòng "- " nếu cần.`
      : `KÊNH: WEB CHAT. Trả lời ngắn (dưới ~110 từ), thân thiện, đi thẳng vào việc. Chỉ dùng **in đậm** và [liên kết](/duong-dan) khi thật cần; KHÔNG dùng bảng.`

  const goal = ctx.handoffImminent
    ? `MỤC TIÊU LƯỢT NÀY: hồ sơ đã đủ (điểm ${score}/100)${ctx.handoffReason ? ` — lý do chuyển: ${handoffReasonLabel(ctx.handoffReason)}` : ''}. KHÔNG hỏi thêm câu khai thác nào nữa. Hãy: (1) xác nhận đã hiểu bài toán bằng 2–3 câu tóm lại đúng nhu cầu của khách; (2) nêu hướng tiếp cận sơ bộ của XTECH ở mức định hướng (sản phẩm/dịch vụ nào phù hợp, vì sao) — không con số, không cam kết; (3) thông báo rõ rằng một CHUYÊN GIA XTECH sẽ liên hệ trực tiếp để trao đổi chi tiết.`
    : gap
      ? `MỤC TIÊU LƯỢT NÀY: thu thập "${gap.label}" (hiện điểm hồ sơ ${score}/100). Hãy: (1) ghi nhận/phản hồi ngắn điều khách vừa nói; (2) đưa MỘT nhận định hoặc gợi ý hữu ích liên quan hệ sinh thái XTECH; (3) kết bằng ĐÚNG MỘT câu hỏi nhằm làm rõ "${gap.label}". Có thể diễn đạt lại câu hỏi mẫu cho tự nhiên: "${gap.question}"`
      : `MỤC TIÊU LƯỢT NÀY: đã đủ 10 nhóm thông tin. Tóm lại nhu cầu và đề xuất hướng tiếp cận sơ bộ, rồi cho biết chuyên gia XTECH sẽ liên hệ xác nhận phạm vi.`

  return `Bạn là chuyên viên tư vấn giải pháp của XTECH (trợ lý AI), đang tư vấn cho một khách hàng doanh nghiệp đã để lại thông tin trên website. Nhiệm vụ của bạn là biến một nhu cầu còn chung chung thành một bài toán CỤ THỂ, rồi chuyển cho chuyên gia thật đúng thời điểm.

${who}
${company}
Trạng thái hồ sơ: ${ctx.status}

${knownBlock(ctx.collected)}

${goal}

${channelStyle}

${COMPANY_CONTEXT}

${GUARDRAILS}

Luôn viết bằng tiếng Việt, gọi khách là "anh/chị", giọng chuyên nghiệp và ấm áp.`
}

/* ---------------------------------------------------------------- analyzer */

export type Analysis = {
  collected: Collected
  signals: HandoffSignals
  summary: string
  recommendation: string
}

const ANALYZER_SYSTEM = `Bạn là bộ phân tích hội thoại bán hàng B2B của XTECH. Đọc hội thoại và TRÍCH XUẤT thông tin. Chỉ trả về JSON hợp lệ, không kèm giải thích, không markdown, không code fence.

Schema:
{
  "collected": {
${SLOTS.map((s) => `    "${s.key}": "…"   // ${s.label}`).join('\n')}
  },
  "signals": {
    "requestedHuman": boolean,          // khách muốn nói chuyện với người thật
    "requestedCallDemoQuote": boolean,  // khách xin gọi lại / demo / báo giá
    "complexRequest": boolean,          // yêu cầu phức tạp, vượt tư vấn tự động
    "aiUncertain": boolean,             // dữ kiện không đủ để AI trả lời đúng
    "refusedAi": boolean                // khách tỏ ý không muốn tiếp tục với AI
  },
  "summary": "…",         // 2-4 câu brief cho chuyên gia: khách là ai, cần gì, mức độ cấp thiết
  "recommendation": "…"   // 1-2 câu: sản phẩm/dịch vụ XTECH phù hợp và vì sao
}

QUY TẮC:
- Chỉ điền một khóa trong "collected" khi hội thoại NÓI RÕ hoặc suy ra CHẮC CHẮN. Nếu không, để chuỗi rỗng "".
- Giữ nguyên số liệu và tên hệ thống khách nêu; viết gọn, tối đa 200 ký tự mỗi khóa.
- Tiếng Việt.`

/** Tolerant JSON extraction — models occasionally wrap output in prose/fences. */
function parseJsonLoose(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    /* fall through to brace scan */
  }
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1))
    } catch {
      return null
    }
  }
  return null
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const bool = (v: unknown): boolean => v === true || v === 'true'

/**
 * Extract slots + signals from the merged transcript. Never throws: on any
 * provider/parse failure it returns empty extraction so the turn still lands
 * (the keyword fallback in the state machine still guards direct asks).
 */
export async function analyzeTurn(opts: {
  transcript: ChatMsg[]
  collected: Collected
}): Promise<Analysis> {
  const empty: Analysis = { collected: {}, signals: {}, summary: '', recommendation: '' }
  try {
    const known = briefLines(opts.collected)
    const priming = known.length
      ? `Đã trích xuất trước đó (bổ sung/hiệu chỉnh nếu hội thoại có thông tin mới hơn):\n${known.map((l) => `- ${l.label}: ${l.value}`).join('\n')}`
      : 'Chưa trích xuất được thông tin nào trước đó.'

    const conversationText = opts.transcript
      .slice(-24)
      .map((m) => `${m.role === 'user' ? 'KHÁCH' : 'XTECH'}: ${m.content}`)
      .join('\n\n')
      .slice(0, 14_000)

    const res = await complete({
      system: ANALYZER_SYSTEM,
      model: analyzerModel(),
      maxTokens: 900,
      messages: [{ role: 'user', content: `${priming}\n\n--- HỘI THOẠI ---\n${conversationText}` }],
    })

    const parsed = parseJsonLoose(res.text)
    if (!parsed || typeof parsed !== 'object') return empty
    const obj = parsed as Record<string, unknown>

    const rawCollected = (obj.collected ?? {}) as Record<string, unknown>
    const collected: Collected = {}
    for (const s of SLOTS) {
      const v = str(rawCollected[s.key])
      if (v && v !== '-' && v.toLowerCase() !== 'null') collected[s.key] = v.slice(0, 400)
    }

    const rawSignals = (obj.signals ?? {}) as Record<string, unknown>
    const signals: HandoffSignals = {
      requestedHuman: bool(rawSignals.requestedHuman),
      requestedCallDemoQuote: bool(rawSignals.requestedCallDemoQuote),
      complexRequest: bool(rawSignals.complexRequest),
      aiUncertain: bool(rawSignals.aiUncertain),
      refusedAi: bool(rawSignals.refusedAi),
    }

    return {
      collected,
      signals,
      summary: str(obj.summary).slice(0, 1500),
      recommendation: str(obj.recommendation).slice(0, 800),
    }
  } catch {
    return empty
  }
}

/* ------------------------------------------------------------- transcripts */

export type TranscriptMessage = {
  role: 'user' | 'assistant' | 'consultant' | 'system'
  channel: string
  contentText: string
}

/**
 * Flatten the unified (chat + email + consultant) history into provider
 * messages. Channel is prefixed on inbound turns so the model knows how the
 * customer replied, and consultant turns are surfaced as assistant messages
 * labelled as a human colleague.
 */
export function toProviderMessages(messages: TranscriptMessage[], limit = 20): ChatMsg[] {
  const out: ChatMsg[] = []
  for (const m of messages.slice(-limit)) {
    const text = (m.contentText ?? '').trim()
    if (!text) continue
    if (m.role === 'system') continue
    if (m.role === 'user') {
      const via = m.channel === 'email' ? '[qua email] ' : ''
      out.push({ role: 'user', content: `${via}${text}` })
    } else if (m.role === 'consultant') {
      out.push({ role: 'assistant', content: `[chuyên gia XTECH] ${text}` })
    } else {
      out.push({ role: 'assistant', content: text })
    }
  }
  // Providers require the last message to be from the user; callers append it.
  return out
}

/** Fallback brief when the analyzer produced nothing usable. */
export function fallbackSummary(collected: Collected, missing: SlotKey[]): string {
  const lines = briefLines(collected)
  const known = lines.length
    ? lines.map((l) => `${l.label}: ${l.value}`).join('; ')
    : 'chưa khai thác được thông tin chi tiết'
  const gaps = missing.length ? ` Còn thiếu: ${missing.map(slotLabel).join(', ')}.` : ''
  return `${known}.${gaps}`
}
