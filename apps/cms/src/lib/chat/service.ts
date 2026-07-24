/**
 * Chat orchestration: topic guardrail, rate limiting, daily caps, registration
 * gating, streaming, and persistence. Provider-agnostic (delegates to
 * ./providers) and storage-agnostic (delegates to ./store). The API routes are
 * thin wrappers over the exported handlers here.
 */

import { streamChat, resolveProvider, estimateCost, type ChatMsg, type ChatAttachment } from './providers'
import {
  isRegistered,
  loadSession,
  saveSession,
  recordUsage,
  type StoredMsg,
} from './store'

const RATE_LIMIT = Number(process.env.CHAT_RATE_LIMIT_PER_MINUTE ?? '20')
// Anonymous vs registered daily message caps (encourage registration; hard ceiling either way).
const ANON_DAILY_MAX = Number(process.env.CHAT_ANON_DAILY_MAX ?? '12')
const REG_DAILY_MAX = Number(process.env.CHAT_REG_DAILY_MAX ?? '60')

const MAX_INPUT_CHARS = 4000
const MAX_HISTORY_MESSAGES = 14 // sent to the model (older turns dropped)
const MAX_OUTPUT_TOKENS = 1024
const MAX_IMAGES = 3
const MAX_FILE_BYTES = 5 * 1024 * 1024 // ~5MB per attachment (base64-decoded)

const SYSTEM_PROMPT = `Bạn là "Trợ lý XTECH" — trợ lý AI trên website XTECH, chuyên về CHUYỂN ĐỔI SỐ, TRÍ TUỆ NHÂN TẠO (AI) và CÔNG NGHỆ CHO BẤT ĐỘNG SẢN.

PHẠM VI (chỉ hỗ trợ trong các chủ đề này):
- Chuyển đổi số doanh nghiệp, dữ liệu, tự động hóa, tích hợp hệ thống.
- AI cho doanh nghiệp và bất động sản (AI Agent, phân tích, tri thức).
- Sản phẩm & dịch vụ XTECH (X.AI, XBooking, FinERP, XBuilding, X.Space, nền tảng dùng chung, dịch vụ tư vấn & triển khai).
- Có thể phân tích tài liệu người dùng tải lên (quy trình, hợp đồng, tài liệu luật/pháp lý) LIÊN QUAN tới công nghệ và bất động sản.

NGOÀI PHẠM VI: nếu câu hỏi không liên quan (ví dụ chính trị, sức khỏe, giải trí, code không liên quan…), hãy TỪ CHỐI lịch sự trong 1–2 câu và mời quay lại chủ đề chuyển đổi số / AI / bất động sản. Không bịa thông tin; nếu không chắc, nói rõ.

QUAN TRỌNG — không đưa lời khuyên pháp lý/tài chính ràng buộc; tài liệu luật chỉ mang tính tham khảo, khuyên người dùng tham vấn chuyên gia khi cần.

PHONG CÁCH: tiếng Việt, NGẮN GỌN (ưu tiên dưới ~120 từ khi có thể), rõ ràng, chuyên nghiệp, thân thiện. KHÔNG dùng bảng markdown (giao diện chat không hiển thị bảng) — dùng gạch đầu dòng thay thế. Chỉ dùng markdown cho **in đậm** và [liên kết](/duong-dan). Tránh dài dòng để tiết kiệm chi phí.

HÀNH ĐỘNG (CTA) — khi phù hợp, chủ động mời người dùng:
- Liên hệ đội ngũ XTECH: /lien-he
- Đặt lịch demo sản phẩm: /dat-lich-demo
- Nhận tư vấn giải pháp: /yeu-cau-tu-van
- Khám phá sản phẩm/dịch vụ: /san-pham, /dich-vu, /bo-giai-phap-x
Trình bày link dưới dạng markdown (ví dụ [Đặt lịch demo](/dat-lich-demo)).

ĐÓNG GÓP NỘI DUNG: khi người dùng chia sẻ kinh nghiệm, tình huống hoặc góc nhìn chất lượng về chuyển đổi số / AI / bất động sản, hãy khuyến khích họ chia sẻ chi tiết — những đóng góp hay có thể được XTECH biên tập thành bài viết (ẩn danh nếu cần). Cảm ơn và ghi nhận đóng góp của họ.

TÓM TẮT TRANG: khi người dùng hỏi về "trang này", "trang hiện tại", yêu cầu tóm tắt hoặc giải thích nội dung đang xem, hãy DÙNG phần "NGỮ CẢNH TRANG hiện tại" được cung cấp bên dưới (nếu có) để trả lời chính xác theo đúng nội dung trang đó; không bịa. Nếu không có ngữ cảnh trang, mời người dùng cho biết họ đang quan tâm phần nào.

TRI THỨC SẢN PHẨM & DỊCH VỤ XTECH (dùng để trả lời chính xác; đây là hệ sinh thái "X" cho doanh nghiệp và bất động sản, chạy trên nền tảng dùng chung gồm dữ liệu, API, định danh, workflow, cloud, bảo mật và analytics):
- X.AI — Trí tuệ doanh nghiệp: Enterprise Agents theo vai trò (Sales, Finance, Vận hành tòa nhà, Chăm sóc khách hàng, Executive Copilot); Knowledge & RAG trả lời theo tri thức nội bộ có trích dẫn nguồn; tự động hóa & multi-agent orchestration; công cụ tự xây (Visual Agent Builder, RAG Studio, Workflow Studio, connector); an toàn & tuân thủ (guardrails, bảo mật/PII, observability, chống hallucination, kiểm toán); giải pháp theo ngành và theo phòng ban.
- XBooking — Bán hàng bất động sản khép kín: marketing automation, thu lead đa nguồn, CRM (Lead 360, chấm điểm, phân bổ), sales pipeline, bảng hàng/ma trận quỹ hàng, giữ chỗ & lock cọc, phê duyệt booking, hợp đồng & tiến độ thanh toán, chăm sóc khách hàng, CRM di động cho sale.
- FinERP — Tài chính & vận hành doanh nghiệp: tài chính – kế toán, dòng tiền & công nợ, ngân sách, mua hàng, kho & tài sản, chi phí dự án; mở rộng HRM, chấm công – lương, phê duyệt, hợp đồng, tài liệu, Report AI và cảnh báo điều hành.
- XBuilding — Vận hành tòa nhà & cư dân: dashboard đa dự án, quản lý căn hộ/mặt bằng/tài sản, Resident 360, phí dịch vụ & công nợ, ticket & SLA, công việc ban quản lý, truyền thông nội khu, app cư dân & BQL, smart building command center, IoT & năng lượng, bảo trì phòng ngừa, an ninh & bãi xe thông minh.
- X.Space — Không gian làm việc số: công việc, dự án, tài liệu, phê duyệt/trình ký, trao đổi (chat) và tri thức nội bộ khai thác cùng AI.
- Dịch vụ: tư vấn chiến lược, phát triển phần mềm, dữ liệu & AI, vận hành & hỗ trợ. "Bộ giải pháp X" là các gói giải pháp theo bài toán doanh nghiệp.
Khi người dùng hỏi về một sản phẩm/dịch vụ, tóm tắt đúng phạm vi trên và mời xem trang chi tiết (vd [X.AI](/san-pham/x-ai), [XBooking](/san-pham/xbooking), [FinERP](/san-pham/finerp), [XBuilding](/san-pham/xbuilding), [X.Space](/san-pham/x-space)) hoặc [đặt lịch demo](/dat-lich-demo).`

/* -------- rate limiting (in-memory, per device) --------
 * NOTE: process-local. Centralized here in the CMS (single backend) instead of
 * per web-instance. For multi-instance CMS, back this with Redis/DB. */
const hits = new Map<string, number[]>()
function rateLimited(deviceId: string): boolean {
  const now = Date.now()
  const win = now - 60_000
  const arr = (hits.get(deviceId) ?? []).filter((t) => t > win)
  if (arr.length >= RATE_LIMIT) {
    hits.set(deviceId, arr)
    return true
  }
  arr.push(now)
  hits.set(deviceId, arr)
  return false
}

/* -------- daily message cap (in-memory, per device) -------- */
const daily = new Map<string, { day: string; count: number }>()
function dayKey(): string {
  return new Date().toISOString().slice(0, 10)
}
function bumpDaily(deviceId: string): number {
  const d = dayKey()
  const cur = daily.get(deviceId)
  const next = cur && cur.day === d ? cur.count + 1 : 1
  daily.set(deviceId, { day: d, count: next })
  return next
}
function peekDaily(deviceId: string): number {
  const cur = daily.get(deviceId)
  return cur && cur.day === dayKey() ? cur.count : 0
}

function b64Bytes(data: string): number {
  return Math.floor((data.length * 3) / 4)
}

export type ChatInput = {
  deviceId: string
  sessionId: string
  message: string
  siteCode: string
  route: string
  pageContext: string
  attachments: ChatAttachment[]
}

export type ChatError = { error: string; status: number; code?: string }

/** Validate + normalize a raw request body into ChatInput, or return an error. */
export function parseChatInput(payload: {
  deviceId?: string
  sessionId?: string
  message?: string
  siteCode?: string
  route?: string
  pageContext?: string
  attachments?: ChatAttachment[]
}): ChatInput | ChatError {
  const deviceId = (payload.deviceId ?? '').trim()
  const sessionId = (payload.sessionId ?? '').trim()
  const message = (payload.message ?? '').trim()
  const siteCode = payload.siteCode ?? 'corporate'
  const route = payload.route ?? '/'
  // Page context can carry the live page text (for "summarize this page"); allow
  // enough room for a real page while keeping token cost bounded.
  const pageContext = (payload.pageContext ?? '').slice(0, 6000)
  const attachments = (payload.attachments ?? []).slice(0, MAX_IMAGES + 1)

  if (!deviceId || !sessionId) return { error: 'Missing device/session', status: 400 }
  if (!message && attachments.length === 0) return { error: 'Empty message', status: 400 }
  if (message.length > MAX_INPUT_CHARS) return { error: 'Tin nhắn quá dài.', status: 413 }
  for (const a of attachments) {
    if (b64Bytes(a.data) > MAX_FILE_BYTES) return { error: 'Tệp quá lớn (tối đa 5MB).', status: 413 }
  }
  const imageCount = attachments.filter((a) => a.kind === 'image').length
  if (imageCount > MAX_IMAGES) return { error: 'Tối đa 3 ảnh.', status: 413 }

  return { deviceId, sessionId, message, siteCode, route, pageContext, attachments }
}

/**
 * Run a chat turn. Returns either an SSE ReadableStream (on success) or a
 * ChatError to be sent as JSON. Persists conversation + usage after streaming.
 */
export async function runChat(input: ChatInput): Promise<ReadableStream | ChatError> {
  const { deviceId, sessionId, message, siteCode, route, pageContext, attachments } = input
  const imageCount = attachments.filter((a) => a.kind === 'image').length

  if (rateLimited(deviceId)) {
    return { error: 'Bạn đang gửi quá nhanh, vui lòng chờ một chút.', status: 429 }
  }

  // Registration gates deeper features (uploads) and raises the daily cap.
  const registered = await isRegistered(deviceId)
  if (attachments.length > 0 && !registered) {
    return { error: 'Vui lòng đăng ký (email + số điện thoại) để gửi ảnh/tài liệu.', status: 403, code: 'register_required' }
  }

  // Daily cap (hard ceiling; anonymous is lower to encourage registration).
  const dailyMax = registered ? REG_DAILY_MAX : ANON_DAILY_MAX
  if (peekDaily(deviceId) >= dailyMax) {
    return {
      error: registered
        ? 'Bạn đã đạt giới hạn tin nhắn trong ngày. Vui lòng quay lại vào ngày mai.'
        : 'Bạn đã đạt giới hạn dùng thử hôm nay. Đăng ký (email + SĐT) để dùng nhiều hơn.',
      status: 429,
      code: registered ? 'daily_limit' : 'register_for_more',
    }
  }
  bumpDaily(deviceId)

  // Load prior history for context + persistence.
  const existing = await loadSession(sessionId)
  const history = existing?.messages ?? []

  // Provider-neutral messages: trimmed history + the new user turn.
  const trimmed = history.slice(-MAX_HISTORY_MESSAGES)
  const chatMessages: ChatMsg[] = trimmed.map((m) => ({ role: m.role, content: m.content }))
  chatMessages.push({ role: 'user', content: message })

  const system = SYSTEM_PROMPT + (pageContext ? `\n\nNGỮ CẢNH TRANG hiện tại (${route}): ${pageContext}` : '')
  const { provider, model } = resolveProvider()

  const encoder = new TextEncoder()
  let assistantText = ''

  return new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      let usage = { inputTokens: 0, outputTokens: 0 }
      try {
        const result = await streamChat({
          provider,
          model,
          system,
          messages: chatMessages,
          attachments,
          maxTokens: MAX_OUTPUT_TOKENS,
        })
        for await (const t of result.text) {
          assistantText += t
          send({ type: 'delta', text: t })
        }
        usage = await result.usage
        send({ type: 'done' })
      } catch (err) {
        send({ type: 'error', message: 'Xin lỗi, có lỗi khi xử lý. Vui lòng thử lại.' })
        console.error('[chat] error', err)
      } finally {
        controller.close()
        // Persist conversation + usage AFTER responding (best-effort).
        const now = new Date().toISOString()
        const updated: StoredMsg[] = [
          ...history,
          { role: 'user', content: message, images: imageCount || undefined, ts: now },
          ...(assistantText ? [{ role: 'assistant' as const, content: assistantText, ts: now }] : []),
        ]
        const cost = estimateCost(model, usage)
        await saveSession({
          existingId: existing?.id ?? null,
          deviceId,
          sessionId,
          siteCode,
          route,
          messages: updated,
          provider,
          model,
          tokensIn: (existing?.tokensIn ?? 0) + usage.inputTokens,
          tokensOut: (existing?.tokensOut ?? 0) + usage.outputTokens,
          estCostUsd: (existing?.estCostUsd ?? 0) + cost,
        })
        await recordUsage({ provider, model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, costUsd: cost })
      }
    },
  })
}

export const SSE_HEADERS = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
} as const
