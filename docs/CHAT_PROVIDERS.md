# AI Chat — Đa nhà cung cấp (providers) & CLI

Chatbot "Trợ lý XTECH" (`apps/clay`) hỗ trợ 4 nhà cung cấp LLM. Chọn provider bằng biến môi trường; mỗi provider có key + model riêng. Toàn bộ lưu lượng, token và **chi phí tạm tính** được ghi vào CMS (nhóm **Chat**).

## 1. Chọn provider (env — `apps/clay/.env.local`)

```dotenv
CHAT_PROVIDER=anthropic        # anthropic | openai | gemini | copilot

# Anthropic (Claude) — mặc định, rẻ nhất cho web public
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-haiku-4-5

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Google Gemini
GEMINI_API_KEY=...             # hoặc GOOGLE_API_KEY
GEMINI_MODEL=gemini-2.5-flash

# GitHub Copilot / GitHub Models (endpoint tương thích OpenAI)
COPILOT_TOKEN=github_pat_...    # hoặc GITHUB_TOKEN
COPILOT_MODEL=openai/gpt-4o-mini
COPILOT_BASE_URL=https://models.github.ai/inference

# Giới hạn (chống đốt token)
CHAT_RATE_LIMIT_PER_MINUTE=20
CHAT_ANON_DAILY_MAX=12          # ẩn danh
CHAT_REG_DAILY_MAX=60          # đã đăng ký
```

Đổi provider = đổi `CHAT_PROVIDER` (+ đảm bảo key tương ứng) rồi khởi động lại clay. Không cần sửa code.

> ⚠️ `.env.local` đã được `.gitignore` — **không commit key**. Khi deploy, set các biến này ở môi trường prod.

## 2. Chi phí & usage trong CMS

- **Chat → Chat Usage**: mỗi ngày × provider × model → số request, token vào/ra, **chi phí tạm tính (USD)**.
- **Chat → Chat Sessions**: từng phiên có `tokensIn/tokensOut/estCostUsd` tích lũy + `flaggedQuality` (đánh dấu hội thoại hay để làm bài viết).
- **Chat → Chat Users**: email + SĐT người dùng đã đăng ký (cũng là lead).

Bảng giá tạm tính ($/1M token) nằm ở `apps/clay/src/lib/chat-providers.ts` (`PRICES`) — cập nhật khi giá đổi.

## 3. CLI dev cho từng công cụ

Đã cài (npm global): `codex` (OpenAI), `gemini` (Google). `claude` (Claude Code) và `copilot` (GitHub) đã có sẵn.

| Công cụ | CLI | Đăng nhập (chạy trong terminal của bạn) |
|---|---|---|
| Anthropic | `claude` (Claude Code) | Đã đăng nhập. API CLI `ant`: tải binary từ github.com/anthropics/anthropic-cli/releases rồi `ant auth login` (tùy chọn) |
| OpenAI | `codex` | `codex login` (đăng nhập OpenAI) hoặc đặt `OPENAI_API_KEY` |
| Google | `gemini` | Chạy `gemini` lần đầu → đăng nhập Google, hoặc đặt `GEMINI_API_KEY` |
| GitHub Copilot | `copilot` | Chạy `copilot` → đăng nhập GitHub (cần gói Copilot) |

> Đăng nhập là thao tác tương tác — hãy tự chạy trong terminal (hoặc gõ `! <lệnh>` trong phiên này). Sau khi đăng nhập, các CLI dùng để thử nghiệm / prototyping với từng provider.

## 4. Kiến trúc code

- `apps/clay/src/lib/chat-providers.ts` — `streamChat({provider, model, system, messages, attachments})` trả về `{ text: AsyncGenerator, usage: Promise }`. 4 implementation: Anthropic SDK, OpenAI SDK, `@google/genai`, và OpenAI SDK trỏ `COPILOT_BASE_URL` cho Copilot.
- `apps/clay/src/app/api/chat/route.ts` — endpoint SSE dùng abstraction, guardrail chủ đề, gating đăng ký, ghi usage.
- `apps/clay/src/lib/chat-usage.ts` — rollup usage theo ngày vào CMS.

**Đã verify**: đường Anthropic (Haiku 4.5) — chi phí tính đúng và lưu vào `chat-sessions` + `chat-usage`. 3 provider kia đã wire code, cần điền key để test.
