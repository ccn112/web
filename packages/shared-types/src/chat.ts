/**
 * Claude chatbot contract (docs/05_AI_CHATBOT.md, src_examples/chat-route-contract.ts).
 * The backend NEVER trusts a page summary from the browser — it loads published content by pageId.
 */
import { z } from 'zod'

export const chatRequestSchema = z.object({
  siteCode: z.string().min(1).max(40),
  pageId: z.string().uuid(),
  sectionId: z.string().max(120).optional(),
  message: z.string().min(1).max(2000),
  conversation: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000),
      }),
    )
    .max(8)
    .optional(),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

export type ChatSuggestionType = 'ask' | 'navigate' | 'page' | 'demo'

export interface ChatSuggestion {
  label: string
  type: ChatSuggestionType
  target: string
}

export interface ChatResponse {
  answer: string
  suggestions: ChatSuggestion[]
}

/** Context budget (hard caps) — docs/05_AI_CHATBOT.md. */
export const CHAT_CONTEXT_BUDGET = {
  pageSummaryChars: 1500,
  currentSectionChars: 4000,
  relatedSummaryChars: 600,
  relatedSummaryCount: 3,
  conversationMessages: 8,
} as const

export const CHAT_SYSTEM_PROMPT = `Bạn là trợ lý tư vấn của hệ sinh thái X.
Ưu tiên trả lời từ nội dung đã được cung cấp.
Không tự tạo tính năng, giá bán, KPI hoặc cam kết.
Khi thiếu dữ liệu, nói rõ và gợi ý nội dung liên quan.
Trả lời tiếng Việt rõ ràng, ngắn gọn.
Cuối câu trả lời có thể đề xuất tối đa 3 bước khám phá tiếp.`
