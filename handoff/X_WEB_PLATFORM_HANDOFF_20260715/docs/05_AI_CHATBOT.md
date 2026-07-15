# 05 — Claude Chatbot MVP

## Mục tiêu

- Hỏi nội dung trang hiện tại.
- Hiển thị prompt chip đã cấu hình.
- Gợi ý tối đa 3 nội dung tiếp theo.
- Đưa người dùng đến section hoặc trang liên quan.
- Không cần vector database ở MVP.

## API

`POST /api/chat`

```ts
type ChatRequest = {
  siteCode: string
  pageId: string
  sectionId?: string
  message: string
  conversation?: Array<{ role: 'user' | 'assistant'; content: string }>
}
```

Backend phải tự đọc nội dung published từ CMS. Không tin `pageSummary` do browser gửi lên.

## Context budget

- Page summary: tối đa 1.500 ký tự.
- Current section: tối đa 4.000 ký tự.
- Related summaries: tối đa 3 trang × 600 ký tự.
- Conversation: tối đa 8 message gần nhất.
- Không gửi toàn bộ HTML.

## System prompt

```text
Bạn là trợ lý tư vấn của hệ sinh thái X.
Ưu tiên trả lời từ nội dung đã được cung cấp.
Không tự tạo tính năng, giá bán, KPI hoặc cam kết.
Khi thiếu dữ liệu, nói rõ và gợi ý nội dung liên quan.
Trả lời tiếng Việt rõ ràng, ngắn gọn.
Cuối câu trả lời có thể đề xuất tối đa 3 bước khám phá tiếp.
```

## Output contract

Ưu tiên JSON có cấu trúc hoặc tool-safe envelope:

```ts
{
  answer: string
  suggestions: Array<{
    label: string
    type: 'ask' | 'navigate' | 'page' | 'demo'
    target: string
  }>
}
```

## Guardrails

- Rate limit theo IP/session.
- Không nhận upload file ở MVP.
- Không truy cập nội dung draft.
- Không đưa dữ liệu lead vào Claude nếu chưa có consent.
- Lưu token usage và feedback, không lưu cookie nhạy cảm.
