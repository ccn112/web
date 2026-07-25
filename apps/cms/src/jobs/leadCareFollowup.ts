import type { TaskConfig } from 'payload'
import { completeChat } from '../lib/chat/providers'

/** Base URL of the public website (for the magic chat link in emails). */
function webBase(): string {
  return (
    process.env.CARE_CHAT_BASE_URL ??
    process.env.PUBLIC_WEB_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://x-tech.com.vn'
  ).replace(/\/$/, '')
}

/** Where high-priority leads get escalated (falls back to the staff inbox). */
function escalateRecipient(): string | null {
  const raw =
    process.env.CARE_ESCALATE_TO ??
    process.env.LEAD_NOTIFY_TO ??
    process.env.MAIL_TEST_TO_ADDRESS ??
    process.env.SEED_ADMIN_EMAIL
  return raw && raw.trim() ? raw.trim() : null
}

function pick(payload: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = payload[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Extract the first balanced JSON object from a model response. */
function parseJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>
  } catch {
    return null
  }
}

const ANALYSIS_SYSTEM = `Bạn là trợ lý chăm sóc khách hàng của XTECH — công ty chuyển đổi số, AI và công nghệ cho bất động sản (sản phẩm: X.AI, XBooking, FinERP, XBuilding, X.Space; dịch vụ tư vấn & triển khai).

Nhiệm vụ: đọc thông tin một khách hàng vừa để lại trên website và soạn phản hồi qua email, đồng thời phân loại lead.

Trả về DUY NHẤT một JSON hợp lệ (không kèm giải thích, không markdown), theo schema:
{
  "reply": string,        // Nội dung email trả lời khách, tiếng Việt, thân thiện, chuyên nghiệp, 80-150 từ. Xưng "chúng tôi". KHÔNG chèn lời chào đầu/chữ ký (hệ thống tự thêm). Bám sát nhu cầu khách, gợi ý sản phẩm/dịch vụ phù hợp, mời tiếp tục trao đổi qua chat AI hoặc đặt lịch tư vấn.
  "intent": string,       // Ý định/nhu cầu chính của khách, ngắn gọn (<= 12 từ).
  "priority": "low"|"medium"|"high",  // high nếu: doanh nghiệp lớn, nhu cầu rõ ràng/gấp, ngân sách/triển khai cụ thể, hoặc nhiều sản phẩm.
  "summary": string,      // Tóm tắt lead cho tư vấn viên, 1-2 câu.
  "needsEscalation": boolean  // true nếu cần tư vấn viên con người xử lý sớm.
}`

/**
 * Delayed AI follow-up for a lead. Runs ~30 min after submission (see
 * enqueueLeadCare). Analyses the inquiry, emails the visitor a tailored reply
 * with a magic link into the warm AI chat, records the AI turn in that chat
 * session, and escalates high-priority leads to a human consultant.
 *
 * Idempotent: only acts while `care.stage === 'queued'`.
 */
export const leadCareFollowup: TaskConfig<'leadCareFollowup'> = {
  slug: 'leadCareFollowup',
  retries: 2,
  inputSchema: [{ name: 'submissionId', type: 'text', required: true }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const submissionId = String((input as { submissionId: string }).submissionId)

    const sub = await payload
      .findByID({ collection: 'form-submissions', id: submissionId, depth: 1 })
      .catch(() => null)
    if (!sub) return { output: { skipped: 'not-found' } }
    if ((sub.care as { stage?: string } | undefined)?.stage !== 'queued') {
      return { output: { skipped: 'already-processed' } }
    }

    const care = (sub.care ?? {}) as {
      chatToken?: string
      chatSessionId?: string
    }
    const formData = (sub.payload && typeof sub.payload === 'object' ? sub.payload : {}) as Record<
      string,
      unknown
    >
    const customerEmail = pick(formData, ['email'])
    const customerName = pick(formData, ['fullName', 'name'])

    const site = sub.site && typeof sub.site === 'object' ? (sub.site as { name?: string }) : null
    const brand = site?.name || process.env.MAIL_FROM_NAME || 'XTECH'

    const inquiry = Object.entries(formData)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join('\n')

    // --- AI analysis + reply draft ---
    let reply = ''
    let intent = ''
    let priority: 'low' | 'medium' | 'high' = 'medium'
    let summary = ''
    let needsEscalation = false
    try {
      const { text } = await completeChat({
        system: ANALYSIS_SYSTEM,
        messages: [{ role: 'user', content: `Thông tin khách để lại:\n${inquiry}` }],
        maxTokens: 900,
      })
      const parsed = parseJsonObject(text)
      if (parsed) {
        reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : ''
        intent = typeof parsed.intent === 'string' ? parsed.intent.trim() : ''
        summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : ''
        const p = String(parsed.priority ?? '').toLowerCase()
        priority = p === 'high' || p === 'low' ? (p as 'high' | 'low') : 'medium'
        needsEscalation = parsed.needsEscalation === true || priority === 'high'
      }
    } catch (err) {
      payload.logger.error({ err, submissionId }, 'leadCareFollowup: AI analysis failed')
      throw err // let the job retry
    }

    // Fallback copy if the model returned nothing usable.
    if (!reply) {
      reply =
        'Cảm ơn bạn đã quan tâm tới giải pháp của chúng tôi. Đội ngũ tư vấn sẽ liên hệ để trao đổi chi tiết về nhu cầu của bạn. Bạn cũng có thể trò chuyện ngay với trợ lý AI của chúng tôi để được hỗ trợ nhanh.'
    }

    const chatLink = care.chatToken ? `${webBase()}/?care_chat=${care.chatToken}` : `${webBase()}/lien-he`

    // --- Email the tailored reply to the visitor ---
    if (customerEmail && isEmail(customerEmail)) {
      const greeting = customerName ? `Xin chào ${customerName},` : 'Xin chào,'
      const lines = [greeting, '', reply, '', `Chat ngay với trợ lý AI: ${chatLink}`, '', 'Trân trọng,', `Đội ngũ ${brand}`]
      const text = lines.join('\n')
      const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937">
${[greeting, '', reply, '']
  .map((l) => (l === '' ? '<br/>' : `<p style="margin:0 0 10px">${escapeHtml(l)}</p>`))
  .join('')}
<p style="margin:0 0 16px"><a href="${chatLink}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Chat ngay với trợ lý AI</a></p>
<p style="margin:0 0 4px">Trân trọng,</p>
<p style="margin:0">Đội ngũ ${escapeHtml(brand)}</p>
</div>`
      await payload
        .sendEmail({ to: customerEmail, subject: `Phản hồi yêu cầu của bạn — ${brand}`, text, html })
        .catch((err) => payload.logger.error({ err, submissionId }, 'leadCareFollowup: reply email failed'))
    }

    // --- Record the AI turn in the warm chat session for continuity ---
    if (care.chatSessionId) {
      const found = await payload
        .find({ collection: 'chat-sessions', where: { sessionId: { equals: care.chatSessionId } }, limit: 1, depth: 0 })
        .catch(() => null)
      const chatDoc = found?.docs?.[0] as
        | { id: string | number; messages?: Array<{ role: string; content: string; ts: string }> }
        | undefined
      if (chatDoc) {
        const messages = [
          ...(Array.isArray(chatDoc.messages) ? chatDoc.messages : []),
          { role: 'assistant' as const, content: reply, ts: new Date().toISOString() },
        ]
        await payload
          .update({
            collection: 'chat-sessions',
            id: String(chatDoc.id),
            data: { messages, messageCount: messages.length },
          })
          .catch((err) => payload.logger.error({ err, submissionId }, 'leadCareFollowup: chat seed failed'))
      }
    }

    // --- Escalate high-priority leads to a human consultant ---
    let escalatedAt: string | null = null
    if (needsEscalation) {
      const to = escalateRecipient()
      if (to) {
        const subject = `[Ưu tiên] Lead cần tư vấn viên xử lý — ${brand}`
        const text = [
          'Một lead được AI đánh giá cần tư vấn viên xử lý sớm.',
          '',
          `Mức ưu tiên: ${priority}`,
          `Ý định: ${intent || '(không rõ)'}`,
          `Tóm tắt: ${summary || '(không có)'}`,
          '',
          '--- Thông tin khách ---',
          inquiry,
          '',
          `Xem trong admin: form-submissions / ${submissionId}`,
        ].join('\n')
        await payload
          .sendEmail({ to, subject, text })
          .catch((err) => payload.logger.error({ err, submissionId }, 'leadCareFollowup: escalation email failed'))
        escalatedAt = new Date().toISOString()
      }
    }

    // --- Persist care state ---
    const processedAt = new Date().toISOString()
    await payload.update({
      collection: 'form-submissions',
      id: submissionId,
      data: {
        care: {
          ...(sub.care as object),
          stage: escalatedAt ? 'escalated' : 'ai_replied',
          processedAt,
          intent,
          priority,
          summary,
          escalatedAt: escalatedAt ?? undefined,
          lastError: undefined,
        },
      },
    })

    return { output: { priority, escalated: Boolean(escalatedAt) } }
  },
}
