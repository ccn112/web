/**
 * Lead qualification state machine — pure module (no Payload / no I/O) so it can
 * be imported by collections, API routes and tests alike.
 *
 * Flow (handoff/XTECH_AI_LEAD_EMAIL_CHAT_HANDOFF_V1/docs/AI_QUALIFICATION_STATE_MACHINE.md):
 *   NEW → AI_QUALIFYING → NEED_MORE_INFORMATION → AI_RECOMMENDATION_SENT
 *       → WAITING_CUSTOMER → HUMAN_READY → ASSIGNED → CONTACTED
 *       → MEETING_BOOKED → PROPOSAL
 *   branches: WAITING_CUSTOMER → NURTURE, ANY → UNSUBSCRIBED, ANY → CLOSED_LOST
 *
 * The AI narrows a vague enquiry into a concrete brief by filling the ten
 * qualification slots below. Each slot carries a score weight; once the score
 * clears the threshold (or a hard trigger fires) the conversation flips to
 * HUMAN_READY and a real consultant is emailed in.
 */

export const LEAD_STATES = [
  'NEW',
  'AI_QUALIFYING',
  'NEED_MORE_INFORMATION',
  'AI_RECOMMENDATION_SENT',
  'WAITING_CUSTOMER',
  'HUMAN_READY',
  'ASSIGNED',
  'CONTACTED',
  'MEETING_BOOKED',
  'PROPOSAL',
  'NURTURE',
  'UNSUBSCRIBED',
  'CLOSED_LOST',
] as const

export type LeadState = (typeof LEAD_STATES)[number]

/** Vietnamese admin labels for the `select` options in Payload. */
const STATE_LABELS: Record<LeadState, string> = {
  NEW: 'Mới',
  AI_QUALIFYING: 'AI đang khai thác nhu cầu',
  NEED_MORE_INFORMATION: 'Cần thêm thông tin',
  AI_RECOMMENDATION_SENT: 'Đã gửi đề xuất sơ bộ',
  WAITING_CUSTOMER: 'Chờ khách phản hồi',
  HUMAN_READY: 'Sẵn sàng cho chuyên gia',
  ASSIGNED: 'Đã phân công',
  CONTACTED: 'Đã liên hệ',
  MEETING_BOOKED: 'Đã hẹn gặp',
  PROPOSAL: 'Đang báo giá / đề xuất',
  NURTURE: 'Nuôi dưỡng',
  UNSUBSCRIBED: 'Đã từ chối nhận email',
  CLOSED_LOST: 'Đóng — không thành',
}

export const LEAD_STATE_OPTIONS = LEAD_STATES.map((value) => ({ value, label: STATE_LABELS[value] }))

/** States a human consultant owns — the AI must stop driving the conversation. */
const HUMAN_OWNED: readonly LeadState[] = [
  'HUMAN_READY',
  'ASSIGNED',
  'CONTACTED',
  'MEETING_BOOKED',
  'PROPOSAL',
]

/** States where no further automated outreach may be sent. */
const TERMINAL: readonly LeadState[] = ['UNSUBSCRIBED', 'CLOSED_LOST']

export const isHumanOwned = (s: LeadState): boolean => HUMAN_OWNED.includes(s)
export const isTerminal = (s: LeadState): boolean => TERMINAL.includes(s)
/** True when the AI may still ask qualification questions on this conversation. */
export const aiMayDrive = (s: LeadState): boolean => !isHumanOwned(s) && !isTerminal(s)

/* ------------------------------------------------------------------ slots */

export type SlotKey =
  | 'primaryNeed'
  | 'businessModel'
  | 'userScale'
  | 'currentSystems'
  | 'departments'
  | 'urgency'
  | 'targetTimeline'
  | 'infrastructure'
  | 'demoOrQuote'
  | 'decisionMaker'

export type Slot = {
  key: SlotKey
  /** Admin/e-mail label (Vietnamese). */
  label: string
  /** Contribution to the 0–100 qualification score when filled. */
  weight: number
  /** The question the AI asks when this slot is the next gap to close. */
  question: string
}

/** Weights sum to 100 — the score is "how complete is this brief". */
export const SLOTS: readonly Slot[] = [
  {
    key: 'primaryNeed',
    label: 'Bài toán ưu tiên',
    weight: 18,
    question: 'Bài toán nào đang khiến anh/chị mất nhiều thời gian hoặc chi phí nhất hiện nay?',
  },
  {
    key: 'businessModel',
    label: 'Mô hình doanh nghiệp',
    weight: 8,
    question: 'Doanh nghiệp anh/chị đang hoạt động theo mô hình nào (chủ đầu tư, sàn phân phối, quản lý vận hành, sản xuất – thương mại…)?',
  },
  {
    key: 'userScale',
    label: 'Quy mô người dùng',
    weight: 10,
    question: 'Hệ thống dự kiến phục vụ khoảng bao nhiêu người dùng nội bộ và bao nhiêu khách hàng/cư dân?',
  },
  {
    key: 'currentSystems',
    label: 'Hệ thống hiện hữu',
    weight: 10,
    question: 'Hiện anh/chị đang dùng những hệ thống nào (ERP, CRM, kế toán, Excel, phần mềm tự phát triển…)?',
  },
  {
    key: 'departments',
    label: 'Phòng ban liên quan',
    weight: 6,
    question: 'Những phòng ban nào sẽ tham gia sử dụng hoặc chịu ảnh hưởng trực tiếp?',
  },
  {
    key: 'urgency',
    label: 'Mức độ cấp thiết',
    weight: 12,
    question: 'Mức độ cấp thiết của dự án hiện ở đâu — đang tìm hiểu, đã có ngân sách, hay cần triển khai ngay?',
  },
  {
    key: 'targetTimeline',
    label: 'Thời gian triển khai',
    weight: 12,
    question: 'Anh/chị mong muốn go-live vào khoảng thời điểm nào?',
  },
  {
    key: 'infrastructure',
    label: 'Hạ tầng',
    weight: 6,
    question: 'Về hạ tầng, anh/chị ưu tiên cloud, on-premise, hay kết hợp?',
  },
  {
    key: 'demoOrQuote',
    label: 'Nhu cầu demo / báo giá',
    weight: 10,
    question: 'Anh/chị muốn xem demo sản phẩm trước, hay cần đề xuất phạm vi và chi phí sơ bộ?',
  },
  {
    key: 'decisionMaker',
    label: 'Người quyết định',
    weight: 8,
    question: 'Ai sẽ cùng anh/chị ra quyết định cho dự án này (ban lãnh đạo, IT, tài chính…)?',
  },
]

const SLOT_BY_KEY = new Map<SlotKey, Slot>(SLOTS.map((s) => [s.key, s]))
export const slotLabel = (k: SlotKey): string => SLOT_BY_KEY.get(k)?.label ?? k

/** Slot values gathered so far. Absent / blank = not yet known. */
export type Collected = Partial<Record<SlotKey, string>>

const filled = (v: string | undefined): boolean => typeof v === 'string' && v.trim().length > 0

export function filledSlots(c: Collected): SlotKey[] {
  return SLOTS.filter((s) => filled(c[s.key])).map((s) => s.key)
}

export function missingSlots(c: Collected): SlotKey[] {
  return SLOTS.filter((s) => !filled(c[s.key])).map((s) => s.key)
}

/** 0–100 completeness score of the brief. */
export function scoreOf(c: Collected): number {
  return SLOTS.reduce((sum, s) => (filled(c[s.key]) ? sum + s.weight : sum), 0)
}

/** The highest-weight gap left — the single question the AI should ask next. */
export function nextQuestion(c: Collected): Slot | null {
  const gaps = SLOTS.filter((s) => !filled(c[s.key]))
  if (gaps.length === 0) return null
  return gaps.reduce((best, s) => (s.weight > best.weight ? s : best), gaps[0]!)
}

/** Merge newly extracted slot values over the stored ones (never blanks out a known value). */
export function mergeCollected(prev: Collected, next: Collected): Collected {
  const out: Collected = { ...prev }
  for (const s of SLOTS) {
    const v = next[s.key]
    if (filled(v)) out[s.key] = v!.trim().slice(0, 600)
  }
  return out
}

/* ---------------------------------------------------------------- handoff */

/** Hard reasons to put a human in the room immediately, regardless of score. */
export const HANDOFF_REASONS = {
  requested_human: 'Khách yêu cầu nói chuyện với người thật',
  requested_call_demo_quote: 'Khách yêu cầu gọi lại / demo / báo giá',
  complex_request: 'Yêu cầu phức tạp, vượt phạm vi tư vấn tự động',
  ai_uncertain: 'AI không chắc chắn về câu trả lời',
  score_threshold: 'Hồ sơ đã đủ điều kiện (đạt ngưỡng điểm)',
  refused_ai: 'Khách không muốn tiếp tục với AI',
  manual: 'Chuyển thủ công bởi nhân sự XTECH',
} as const

export type HandoffReason = keyof typeof HANDOFF_REASONS
export const handoffReasonLabel = (r: string): string =>
  (HANDOFF_REASONS as Record<string, string>)[r] ?? r

export const HANDOFF_REASON_OPTIONS = Object.entries(HANDOFF_REASONS).map(([value, label]) => ({
  value,
  label,
}))

/** Score at/above which the brief is considered good enough for a consultant. */
export function handoffThreshold(): number {
  const n = Number(process.env.LEAD_HANDOFF_SCORE ?? '62')
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : 62
}

/**
 * Customer turns that must have happened before the AI's *own* uncertainty is
 * allowed to escalate. See the soft-signal note in `advance()`.
 */
export function softHandoffMinTurns(): number {
  const n = Number(process.env.LEAD_SOFT_HANDOFF_MIN_TURNS ?? '3')
  return Number.isFinite(n) && n >= 1 ? n : 3
}

/** Signals the analyzer (or a keyword fallback) can raise on the latest turn. */
export type HandoffSignals = {
  requestedHuman?: boolean
  requestedCallDemoQuote?: boolean
  complexRequest?: boolean
  aiUncertain?: boolean
  refusedAi?: boolean
}

/**
 * Cheap keyword safety net so a direct ask never gets stuck behind the AI.
 *
 * Every entry must carry the *intent* — a request verb plus its object — never a
 * bare noun. In a B2B property/PropTech conversation the plain nouns are exactly
 * what a qualified lead says while answering our own questions: "200 nhân viên"
 * is the `userScale` slot, "nhân sự sale" is the department, "chi phí dự án" and
 * "hợp đồng & tiến độ thanh toán" are FinERP/XBooking feature names, and
 * "chuyên gia XTECH" is our own wording quoted back at us. Matching those short
 * circuits the whole 10-slot qualification on turn one, which is worse than
 * missing a signal — the analyzer catches the subtle cases anyway, this list only
 * exists so an *explicit* ask can never be lost.
 */
export function keywordSignals(text: string): HandoffSignals {
  // Collapse whitespace and pad, so phrases match across line breaks.
  const t = ` ${text.toLowerCase().replace(/\s+/g, ' ')} `
  const any = (...phrases: string[]) => phrases.some((p) => t.includes(p))
  return {
    requestedHuman: any(
      'gặp người thật',
      'người thật',
      'nói chuyện với người',
      'nói chuyện với nhân viên',
      'nói chuyện với chuyên gia',
      'nói chuyện với tư vấn viên',
      'gặp nhân viên',
      'gặp chuyên gia',
      'gặp tư vấn viên',
      'cho tôi gặp',
      'cho mình gặp',
      'nhân viên tư vấn',
      'tư vấn viên',
      'gọi cho tôi',
      'gọi cho mình',
      'gọi lại cho',
      'gọi lại giúp',
      'gọi điện cho',
      'liên hệ trực tiếp',
      'trao đổi trực tiếp',
      'hẹn gặp',
      'đặt lịch gặp',
    ),
    requestedCallDemoQuote: any(
      'demo',
      'dùng thử',
      'báo giá',
      'giá bao nhiêu',
      'bao nhiêu tiền',
      'chi phí bao nhiêu',
      'quotation',
      'proposal',
      'gửi đề xuất',
      'gửi phương án',
      'ký hợp đồng',
    ),
    refusedAi: any(
      'không muốn chat với ai',
      'không muốn nói chuyện với ai',
      'không cần ai',
      'đừng dùng ai',
      'trả lời máy móc',
      'không muốn bot',
      'chán bot',
      'toàn bot',
    ),
  }
}

export type Advance = {
  status: LeadState
  score: number
  missing: SlotKey[]
  handoffReason: HandoffReason | null
}

/**
 * Decide the conversation's next state after a turn.
 *
 * `signals` come from the AI analyzer, or from the keyword net when the analyzer
 * gave no verdict at all (`resolveSignals` in service.ts). They are ranked:
 * explicit customer intent > score threshold > the AI's own uncertainty.
 */
export function advance(opts: {
  current: LeadState
  collected: Collected
  signals?: HandoffSignals
  /** Total customer turns so far (used to distinguish "just started" from "stalled"). */
  turnCount: number
}): Advance {
  const { current, collected, signals = {}, turnCount } = opts
  const score = scoreOf(collected)
  const missing = missingSlots(collected)

  // Terminal + human-owned states are never moved by the AI.
  if (isTerminal(current) || isHumanOwned(current)) {
    return { status: current, score, missing, handoffReason: null }
  }

  // Explicit customer intent — honoured immediately, at any point in the thread.
  // The customer asked; nothing outranks that.
  const explicit: HandoffReason | null = signals.requestedHuman
    ? 'requested_human'
    : signals.refusedAi
      ? 'refused_ai'
      : signals.requestedCallDemoQuote
        ? 'requested_call_demo_quote'
        : null

  if (explicit) return { status: 'HUMAN_READY', score, missing, handoffReason: explicit }
  if (score >= handoffThreshold()) {
    return { status: 'HUMAN_READY', score, missing, handoffReason: 'score_threshold' }
  }

  // Soft signals are the AI's self-assessment, not a request from the customer.
  // "Not enough data to answer well" (`aiUncertain`) is the *normal* state of the
  // first turn on a vague enquiry — "tôi muốn tìm hiểu thêm về giải pháp" scores
  // 0 and every slot is empty. Escalating there hands the consultant an empty
  // brief and skips the qualification this machine exists to do. So they only
  // count once the AI has genuinely tried for a few turns and still cannot help.
  const soft: HandoffReason | null = signals.complexRequest
    ? 'complex_request'
    : signals.aiUncertain
      ? 'ai_uncertain'
      : null

  // `turnCount` excludes the turn being processed, hence +1 for the current one.
  if (soft && turnCount + 1 >= softHandoffMinTurns()) {
    return { status: 'HUMAN_READY', score, missing, handoffReason: soft }
  }
  if (missing.length === 0) {
    return { status: 'AI_RECOMMENDATION_SENT', score, missing, handoffReason: null }
  }
  if (turnCount === 0) return { status: 'AI_QUALIFYING', score, missing, handoffReason: null }
  return { status: 'NEED_MORE_INFORMATION', score, missing, handoffReason: null }
}

/** Human-readable brief lines for the consultant email / admin summary. */
export function briefLines(c: Collected): Array<{ label: string; value: string }> {
  return SLOTS.filter((s) => filled(c[s.key])).map((s) => ({ label: s.label, value: c[s.key]!.trim() }))
}
