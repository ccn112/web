# Tư vấn lead đa kênh (AI Chat + Email + Chuyên gia) — Nhật ký phát triển & Handoff

> Phiên làm việc **2026-07-25**, cập nhật **2026-07-27**. Nguồn yêu cầu:
> `handoff/XTECH_AI_LEAD_EMAIL_CHAT_HANDOFF_V1/`.
> Trạng thái: **đã smoke-test runtime end-to-end trên Postgres local** (form → ACK → email chủ động có
> độ trễ → khách trả lời bằng email → handoff chuyên gia). Còn lại chủ yếu là hạ tầng mail inbound và
> kiểm tra giao diện — đọc mục [8. Việc còn lại](#8-việc-còn-lại--làm-tiếp-ở-máy-mới).

---

## 1. Mục tiêu

Khi khách để lại thông tin trên website, hệ thống **tự động tương tác** để đưa nhu cầu chung chung
về **nhu cầu chi tiết**, rồi **đúng thời điểm** gửi email quan trọng để **nhân sự thật** vào tư vấn
và chat trực tiếp với khách.

Hai kênh chạy **đồng thời trên MỘT hội thoại duy nhất**:

```
                        ┌──────────────────────────────┐
  Form website ───────▶ │  lead-conversations (1 thread)│ ◀─────── Email reply
  AI Chat /tu-van ────▶ │  lead-messages (transcript)   │ ◀─────── Chuyên gia (admin)
                        └──────────────────────────────┘
                                      │
                        AI khai thác 10 slot → điểm 0–100
                                      │
                            đạt ngưỡng / khách xin gặp người
                                      │
                                      ▼
                     HUMAN_READY → email nội bộ cho chuyên gia
```

Điểm cốt lõi: khách trả lời **qua email hay qua web chat đều vào cùng một mạch**; AI không bao giờ
hỏi lại thứ khách đã trả lời ở kênh khác.

---

## 2. Kiến trúc & sơ đồ file

Backend nằm **toàn bộ trong CMS** (giữ nguyên quy ước sẵn có: key LLM + logic chỉ ở CMS, `clay` chỉ proxy).

### 2.1 CMS — `apps/cms/src/`

| File | Vai trò |
|---|---|
| `lib/lead/state-machine.ts` | **Pure**, không I/O. 13 trạng thái, 10 slot khai thác + trọng số (tổng 100), `advance()` quyết định trạng thái kế tiếp, ngưỡng handoff, keyword safety-net. |
| `lib/lead/tokens.ts` | **Pure crypto**. Signed resume token (HMAC-SHA256), chỉ lưu SHA-256 hash; OTP 6 số; `replyToAddress()`, `resumeUrl()`, `maskEmail()`. |
| `lib/lead/store.ts` | Lớp Payload Local API duy nhất: lead / device / conversation / message / token / consultant / assignment / activity. Chứa `deviceMayAccess()` — luật phân quyền thiết bị. |
| `lib/lead/ai.ts` | 2 lời gọi/lượt: (1) **reply** tư vấn (`replySystemPrompt`), (2) **analyzer** trích 10 slot + tín hiệu handoff ra JSON. `complete()` = non-streaming (drain `streamChat`). |
| `lib/lead/inbound.ts` | **Pure**. Chuẩn hoá webhook Postmark / Mailgun / SendGrid / generic; chống loop (auto-reply, bounce, list, quoted-reply stripping). |
| `lib/lead/service.ts` | **Nhạc trưởng**: `intake`, `prepareWebChatTurn` + `completeWebChatTurn`, `handleInboundEmail`, `triggerHandoff`, `resumeFromToken`, `request/confirmDeviceVerification`, `unsubscribeByToken`. |
| `lib/lead/email/layout.ts` | Khung email chuyên nghiệp (xem mục 5). Helper `p/note/label/ul/factTable/callout/button/hr`. |
| `lib/lead/email/templates.ts` | 7 template mặc định (built-in) — code là nguồn sự thật ban đầu. |
| `lib/lead/email/render.ts` | **Pure**. 3 pass: `{{var}}` (escape) → `{{name_block}}` (HTML) → `{{p:…}}/{{note:…}}/{{label:…}}`. |
| `lib/lead/email/send.ts` | Resolve template (CMS → built-in), dựng vars/blocks, ngân sách chống loop, threading (`Reply-To`/`In-Reply-To`), ghi vào transcript + activity. |
| `hooks/relayConsultantMessage.ts` | Chuyên gia gõ 1 message trong admin → gửi email cho khách + hiện luôn trên web chat, pause AI, đẩy trạng thái → `CONTACTED`. |
| `collections/{Leads,LeadDevices,LeadConversations,LeadMessages,ResumeTokens,EmailTemplates,Consultants,ConsultantAssignments,LeadActivities}.ts` | 9 collection mới, group admin **“Lead & Tư vấn”**. |
| `app/(lead)/api/lead/{intake,chat,session,resume,verify,email-reply,handoff,unsubscribe}/route.ts` | 8 endpoint. `chat` là SSE. |
| `migrations/20260725_060131_add_lead_consultation.{ts,json}` | 13 CREATE TABLE + 16 enum, **thuần additive** (mọi DROP chỉ nằm trong `down()`). |

### 2.2 Frontend — `apps/clay/src/`

| File | Vai trò |
|---|---|
| `lib/device.ts` | `getDeviceId()` — deviceId first-party dùng chung cho ChatWidget + /tu-van (không fingerprint). |
| `data/consult-content.ts` | Route table `/tu-van*`, copy hero, SEO, badge kênh, nhãn trạng thái, nhãn slot. |
| `components/tuvan/ConsultPages.tsx` | 4 mode: `start` (form intake / thread), `resume` (mở link email, OTP nếu máy mới), `history` (xem lại + tải .txt), `unsubscribe`. |
| `components/tuvan/ConsultThread.tsx` | Transcript hợp nhất: **badge nguồn** (Web Chat / Email / Chuyên gia XTECH), thanh tiến độ hồ sơ %, danh sách “còn cần làm rõ”, banner **“Đang chuyển tới chuyên gia XTECH”**. |
| `components/chat/markdown.tsx` | Tách từ `ChatWidget` để dùng chung (không nhân bản 80 dòng). |
| `components/chat/ChatWidget.tsx` | Dùng `getDeviceId()` + markdown chung; thêm **banner phiên tư vấn đang mở** dẫn sang `/tu-van`. |
| `components/lead/LeadPages.tsx` | Gửi thêm `deviceId`; màn cảm ơn có CTA “Tiếp tục trao đổi ngay”. |
| `app/api/lead/route.ts` | Vẫn lưu `form-submissions` (giữ nguyên email thông báo staff cũ), **thêm** gọi `/api/lead/intake`; gộp các field phụ thành “lượt nói đầu tiên” để analyzer trích slot ngay. |
| `app/api/lead/{consult,session,resume,verify,unsubscribe}/route.ts` | Proxy sang CMS (SSE passthrough ở `consult`). |
| `app/[[...slug]]/page.tsx` | Dispatch `/tu-van*` + metadata (chỉ `/tu-van` cho index, còn lại `noindex`). |

---

## 3. State machine & chấm điểm

```
NEW → AI_QUALIFYING → NEED_MORE_INFORMATION → AI_RECOMMENDATION_SENT
    → WAITING_CUSTOMER → HUMAN_READY → ASSIGNED → CONTACTED → MEETING_BOOKED → PROPOSAL
nhánh: WAITING_CUSTOMER → NURTURE | ANY → UNSUBSCRIBED | ANY → CLOSED_LOST
```

10 slot và trọng số (tổng **100**) — `SLOTS` trong `state-machine.ts`:

| Slot | Trọng số | Slot | Trọng số |
|---|---|---|---|
| primaryNeed (bài toán ưu tiên) | 18 | urgency (cấp thiết) | 12 |
| targetTimeline (thời gian) | 12 | userScale (quy mô) | 10 |
| currentSystems (hệ thống hiện hữu) | 10 | demoOrQuote | 10 |
| businessModel | 8 | decisionMaker | 8 |
| departments | 6 | infrastructure | 6 |

`score = tổng trọng số slot đã có`. Đạt **`LEAD_HANDOFF_SCORE` (mặc định 62)** → `HUMAN_READY`.

### 3.1 Thứ tự ưu tiên khi quyết định handoff (`advance()`)

1. **Ý định rõ ràng của khách** → `HUMAN_READY` **ngay**, ở bất kỳ lượt nào:
   `requested_human`, `refused_ai`, `requested_call_demo_quote`. Khách đã yêu cầu, không gì cao hơn.
2. **Đạt ngưỡng điểm** → `score_threshold`.
3. **AI tự đánh giá** (`complex_request`, `ai_uncertain`) → chỉ tính từ lượt
   **`LEAD_SOFT_HANDOFF_MIN_TURNS` (mặc định 3)** trở đi.

> Vì sao (3) phải chờ: `ai_uncertain` nghĩa là “dữ kiện không đủ để AI trả lời đúng” — ở lượt đầu của
> một câu hỏi mơ hồ thì điều đó **luôn đúng**. Trước khi tách nhóm, lead “tôi muốn tìm hiểu thêm về
> giải pháp” (0 điểm, mọi slot rỗng) escalate ngay lập tức và chuyên gia nhận một brief rỗng — đúng
> loại lead mà máy khai thác 10 slot sinh ra để xử lý.

### 3.2 Ai quyết định tín hiệu: analyzer AI, không phải keyword

`resolveSignals()` trong `service.ts`: **analyzer là người quyết**. Nó đọc toàn bộ transcript hợp nhất
nên phân biệt được “bên mình có 200 nhân viên” (khách đang **trả lời** câu hỏi `userScale` của chính
ta) với “cho tôi gặp nhân viên” (yêu cầu thật).

`keywordSignals()` chỉ là **lưới an toàn ở chế độ suy giảm** — chỉ dùng khi `analysis.ok === false`,
tức provider lỗi hoặc JSON không parse được nên không có verdict nào. Không bao giờ `OR` lên trên một
verdict tốt: nó chỉ là so khớp chuỗi con, một danh từ trần sẽ lặng lẽ ghi đè phán đoán của model và
chặn đứng cả quy trình khai thác ngay từ lượt đầu.

Vì vậy mọi entry trong `keywordSignals` phải mang **ý định** (động từ + tân ngữ), không bao giờ là
danh từ trần. Bản đầu có `'sale'`, `'nhân viên'`, `'chuyên gia'`, `'chi phí'`, `'hợp đồng'`, `'bot'` —
toàn những từ mà một lead B2B tốt nói khi đang trả lời câu hỏi khai thác, hoặc chính là tên tính năng
trong catalogue XTECH (“chi phí dự án” của FinERP, “hợp đồng & tiến độ thanh toán” của XBooking), hoặc
chính lời lẽ của ta bị khách quote lại (“chuyên gia XTECH”).

Khi đã `HUMAN_READY`/human-owned: `aiPaused = true`, AI **chỉ ghi nhận** tin nhắn khách và nói chuyên
gia sẽ phản hồi — không hỏi khai thác nữa, không tự đổi trạng thái.

### 3.3 Email chủ động có độ trễ (lượt chạm thứ hai)

`intake()` gửi ACK `lead_received` **ngay**, rồi đẩy job `leadFollowup` với
`waitUntil = now + LEAD_FOLLOWUP_DELAY_MINUTES` (mặc định 30; đặt 0 để tắt hẳn). Job gọi
`service.followUpOnSilence()`:

| Tình huống lúc job chạy | Hành động |
|---|---|
| `turnCount` đã tăng (khách tự quay lại) | bỏ qua — luồng thường đã trả lời rồi |
| `aiPaused` / chuyên gia đã tiếp nhận / hội thoại đã đóng | bỏ qua |
| đã có activity `followup_sent` | bỏ qua (idempotent — mỗi hội thoại đúng **một** lần) |
| khách im lặng, `score >= LEAD_FOLLOWUP_HANDOFF_SCORE` (40) | `triggerHandoff` — form đủ chi tiết mà im lặng thì đáng một cuộc gọi, không phải thêm email |
| khách im lặng, điểm thấp | **một** email: đưa nhận định có giá trị trước, rồi hỏi đúng **một** câu vào slot trọng số cao nhất (`nextQuestion`) |

Khác với một lượt bình thường, ở đây **không có input mới từ khách** nên job **không** chạy lại
analyzer và **không** tăng `turnCount` — nó tái dùng kết quả khai thác từ `intake` và tốn đúng **một**
lời gọi AI.

> ⚠️ Job chỉ chạy khi có cron gọi **`GET /api/payload-jobs/run`** (xem mục 7). Không có cron thì
> email chủ động không bao giờ được gửi.

---

## 4. Mô hình bảo mật (deviceId KHÔNG phải authentication)

| Cơ chế | Thực thi ở |
|---|---|
| `deviceId` chỉ để **continuity** | `store.deviceMayAccess()` |
| Được xem lịch sử khi: (a) là `originDeviceId` của hội thoại, HOẶC (b) `isTrusted` (đã xác minh OTP) và có trong `conversation.devices` | `store.deviceMayAccess()` |
| Link email: HMAC-SHA256 + TTL (`LEAD_RESUME_TTL_HOURS`, mặc định 14 ngày) + revoke, **chỉ lưu hash** | `tokens.ts` + `resume-tokens` |
| **Không PII trong URL** — token chỉ chứa id đối tượng + hạn | `tokens.mintToken()` |
| Máy mới mở link → OTP 6 số về email (TTL 10 phút, tối đa 5 lần sai), xác minh xong mới trả lịch sử; link cũ bị **revoke**, phát hành link mới gắn thiết bị | `service.request/confirmDeviceVerification` |
| Email inbound: người gửi phải **khớp `lead.email`**, lệch thì chỉ ghi log, không trả nội dung | `service.handleInboundEmail` |
| Chống loop email: bỏ auto-reply/bounce/list, dedupe theo `Message-ID` (unique index), cắt quoted-reply, rate limit, ngân sách `LEAD_MAX_AUTO_EMAILS` | `inbound.ts` + `email/send.ts` |
| AI **không** cam kết giá / SLA / pháp lý / timeline | `GUARDRAILS` trong `ai.ts` |
| Audit đầy đủ | `lead-activities` (intake, ai_reply, email_sent/received/ignored, token_issued, otp_sent, device_verified, handoff, unsubscribed…) |
| Xuất / xoá lịch sử | `/tu-van/lich-su` (tải .txt) + link yêu cầu xoá |
| Unsubscribe 1 click | footer + header `List-Unsubscribe` (RFC 8058) → `/api/lead/unsubscribe` |

---

## 5. Template email — cơ sở thiết kế

Khung email ở `lib/lead/email/layout.ts` dựng theo **đúng hai bộ pattern mà các hãng công nghệ lớn
dùng cho transactional mail**, cả hai đều MIT:

- **Cerberus** (`github.com/emailmonday/Cerberus`, Ted Goas) — pattern **hybrid**: ghost table
  `<!--[if mso]>` + `max-width` để **Outlook trên Windows** (engine Word, không hiểu media query) vẫn
  ra cột 600px cố định, còn client khác thì fluid.
- **Postmark Transactional Templates** (`github.com/ActiveCampaign/postmark-templates`) — quy ước nội
  dung: *một email một việc*, **một CTA chính**, bản plain-text song sinh, footer nói rõ vì sao nhận
  được email. Bộ này được test trên 50+ client (Outlook 2007–2021, Gmail, Apple Mail, Yahoo).

Đã cứng hoá trong khung để editor **không thể làm hỏng khả năng hiển thị**:
table + inline CSS (không flex/grid), `role="presentation"`, **preheader** ẩn, **VML `roundrect`** cho
nút ở Outlook, `color-scheme` + `prefers-color-scheme` cho inbox dark mode, cột 600px, body 16px/1.6,
tap target ≥ 44px, chống iOS auto-link.

Bảng màu quy đổi từ brand oklch sang hex (email không hiểu oklch): navy `#0B1533`, blue `#1D5FD1`,
cyan `#2E9AE0`, gold `#C9A45C`.

**7 template** (`templates.ts`) — lần gửi đầu tự upsert vào collection `email-templates`, sau đó
marketing sửa trong admin không cần deploy (code **không ghi đè** bản đã có):

| templateKey | Người nhận | Trigger |
|---|---|---|
| `lead_received` | Khách | NEW — xác nhận đã nhận yêu cầu |
| `qualification_question` | Khách | NEED_MORE_INFORMATION — hỏi thêm 1 điểm |
| `ai_recommendation` | Khách | AI_RECOMMENDATION_SENT — đề xuất sơ bộ |
| `device_verification` | Khách | mã OTP thiết bị mới |
| `human_ready_customer` | Khách | HUMAN_READY — “chuyên gia đang tiếp nhận” |
| **`human_ready_internal`** | **Đội tư vấn** | **HUMAN_READY — email quan trọng: brief + SLA + link vào hội thoại** |
| `consultant_message` | Khách | chuyên gia phản hồi trực tiếp |

`human_ready_internal` chứa đúng danh sách của `docs/CONSULTANT_HANDOFF_EMAIL.md`: khách hàng,
doanh nghiệp/chức danh, email/điện thoại, nhu cầu chính, hệ thống hiện hữu, quy mô, timeline, tóm tắt
AI, thông tin còn thiếu, lý do handoff, hành động đề xuất, SLA, link CRM/hội thoại. `internal: true`
nên bỏ footer marketing + unsubscribe.

---

## 6. Endpoint

| Method | Path (CMS) | Proxy clay | Ghi chú |
|---|---|---|---|
| POST | `/api/lead/intake` | `/api/lead` (kèm form-submissions) | tạo/merge lead + conversation + email mở màn |
| POST | `/api/lead/chat` | `/api/lead/consult` | **SSE**: `meta` → `delta`* → `state` → `done` |
| GET | `/api/lead/session?deviceId=` | `/api/lead/session` | bootstrap web chat |
| POST | `/api/lead/resume` | `/api/lead/resume` | `{token, deviceId}` → session \| `needsVerification` |
| POST | `/api/lead/verify` | `/api/lead/verify` | `action: 'request' \| 'confirm'` |
| POST | `/api/lead/email-reply` | — | webhook provider, auth `x-lead-webhook-secret` |
| POST | `/api/lead/handoff` | — | escalate thủ công, auth `x-lead-admin-secret` |
| GET/POST | `/api/lead/unsubscribe?t=` | `/api/lead/unsubscribe` | 1-click |
| **GET** | `/api/payload-jobs/run` | — | cron chạy job đến hạn; auth `Authorization: Bearer <CRON_SECRET>` hoặc `?secret=`. Payload định nghĩa là **GET**, không phải POST |

Route công khai: `/tu-van`, `/tu-van/tiep-tuc?t=`, `/tu-van/lich-su`, `/tu-van/huy-nhan-email?t=`.

---

## 7. Env mới (đều có mặc định — không có vẫn chạy được ở dev)

```bash
# --- định danh & link ---
LEAD_TOKEN_SECRET=            # mặc định dùng PAYLOAD_SECRET
LEAD_PUBLIC_SITE_URL=https://x-tech.com.vn   # gốc để dựng resume link
LEAD_RESUME_TTL_HOURS=336     # 14 ngày

# --- email 2 chiều ---
LEAD_REPLY_DOMAIN=reply.x-tech.com.vn   # Reply-To = lead+<publicId>@<domain>
LEAD_INBOUND_SECRET=          # 🔒 BẮT BUỘC ở production cho webhook inbound
LEAD_MAX_AUTO_EMAILS=10       # ngân sách email tự động / hội thoại
LEAD_EMAIL_MIN_INTERVAL_MINUTES=3
LEAD_INBOUND_LIMIT_PER_MINUTE=4

# --- email chủ động có độ trễ (lượt chạm thứ hai) ---
LEAD_FOLLOWUP_DELAY_MINUTES=30   # 0 = tắt hẳn
LEAD_FOLLOWUP_HANDOFF_SCORE=40   # lead im lặng đạt điểm này → chuyển thẳng chuyên gia
CRON_SECRET=                     # 🔒 cho GET /api/payload-jobs/run; KHÔNG có cron = không có email chủ động

# --- handoff ---
LEAD_HANDOFF_SCORE=62         # ngưỡng điểm → HUMAN_READY
LEAD_SOFT_HANDOFF_MIN_TURNS=3 # từ lượt này trở đi mới tính complex_request / ai_uncertain
LEAD_SLA_HOURS=2
LEAD_CONSULTANT_TO=           # fallback khi chưa có record `consultants`; nếu trống dùng LEAD_NOTIFY_TO
LEAD_ADMIN_SECRET=            # 🔒 cho /api/lead/handoff ở production

# --- AI ---
LEAD_ANALYZER_MODEL=          # trống = dùng ANTHROPIC_MODEL (haiku, rẻ)
LEAD_RATE_LIMIT_PER_MINUTE=12
```

> ⚠️ **Production**: thiếu `LEAD_INBOUND_SECRET` → webhook trả 401 (an toàn theo mặc định).
> Ở dev (`NODE_ENV !== 'production'`) thì cho qua để curl thử được.

Hạ tầng mail cần làm ngoài code: MX/inbound-parse của `reply.x-tech.com.vn` trỏ về provider, provider
POST vào `https://<cms>/api/lead/email-reply?secret=…` (hoặc header).

---

## 8. Việc còn lại — làm tiếp ở máy mới

### Đã xác minh
- `pnpm --filter @x/cms typecheck` ✅ sạch · `pnpm --filter @x/clay typecheck` ✅ sạch
- `eslint`: cms ✅ 0 error. clay còn **4 error có sẵn từ trước** (`reactbits/CountUp.tsx`,
  `reactbits/SplitText.tsx`, `solutions/SolutionPages.tsx`) — các file này giống hệt `origin/main`,
  không liên quan luồng lead. Nhánh `copilot/fix-failing-github-actions-job` đang xử lý.
- `payload generate:types` ✅ (9 collection + task `leadFollowup` + collection `payload-jobs`)
- Migration ✅ `20260725_060131_add_lead_consultation` và `20260727_022037_add_payload_jobs`: `up()`
  chỉ CREATE, mọi `DROP` nằm trong `down()`; `migrations/index.ts` đúng thứ tự (`seed_content` cuối).
  DDL của `add_payload_jobs` đã đối chiếu khớp từng cột với bảng mà dev-push tạo ra.

### Smoke-test runtime — ĐÃ CHẠY (2026-07-27, Postgres local, `MAIL_HOST=""`)

Chạy CMS với mail tắt để **không gửi mail thật ra ngoài** (console adapter ghi hết vào log):

```bash
MAIL_HOST="" LEAD_FOLLOWUP_DELAY_MINUTES=1 CRON_SECRET=smoke-cron-secret \
  pnpm --filter @x/cms dev        # dev push tự tạo 15 bảng (13 lead + 2 payload_jobs)
```

Gửi payload bằng **file UTF-8** (`--data-binary @file.json`), không dùng `-d 'chuỗi inline'`: shell
trên Windows mã hoá hỏng tiếng Việt và làm kết quả trông như lỗi app.

Đã chạy và đạt:

| # | Bước | Kết quả |
|---|---|---|
| 1 | `POST /api/lead/intake` | tạo lead + conversation + ACK `lead_received`, đẩy job `leadFollowup` |
| 2 | `GET /api/lead/session?deviceId=` | transcript hợp nhất, `channels=[web-chat,email]`, `missing[]` đúng |
| 3 | `POST /api/lead/chat` | SSE `meta → delta* → state → done`, tiếng Việt đúng |
| 4 | `GET /api/payload-jobs/run` | 401 khi thiếu/sai secret; 200 với secret. Lead im lặng nhận **một** email chủ động hỏi đúng slot `primaryNeed`; 3 lead đã `HUMAN_READY` bị bỏ qua đúng thiết kế |
| 5 | `POST /api/lead/email-reply` | khách trả lời **bằng email** gộp vào **cùng** hội thoại, trích slot 0 → 76 điểm → `HUMAN_READY` (`score_threshold`) → brief nội bộ + email báo khách |
| 6 | gửi lại cùng `MessageID` | `{"handled":false,"reason":"duplicate_message_id"}` — dedupe đúng |

Ba lỗi được smoke-test phát hiện và đã sửa (chi tiết ở `docs/CHANGELOG.md` phiên 2026-07-27):
keyword net ghi đè phán đoán của AI · `ai_uncertain` escalate lead mơ hồ ngay lượt đầu ·
`human_ready_customer` bị throttle chặn im lặng.

### CHƯA làm — ưu tiên theo thứ tự
1. **Kiểm tra hiển thị email thật** — dán HTML từ log vào Litmus/Email-on-Acid hoặc gửi 1 mail tới
   `MAIL_TEST_TO_ADDRESS` (`chtchinh@gmail.com`) để xem trên Gmail + Outlook + mobile dark mode.
3. **Frontend chưa mở bằng browser**: `/tu-van`, `/tu-van/tiep-tuc?t=…` (kể cả nhánh OTP máy mới),
   `/tu-van/lich-su`. Cần xem lại badge kênh + banner handoff + thanh tiến độ trên mobile.
4. **Prod**: `deploy.sh` chạy `payload migrate` → migration mới sẽ áp. Trước đó phải đặt
   `LEAD_INBOUND_SECRET`, `LEAD_ADMIN_SECRET`, `LEAD_REPLY_DOMAIN`, `LEAD_PUBLIC_SITE_URL`.
5. **Tạo record `consultants`** trong admin (ít nhất 1 `isDefault`), nếu không handoff sẽ rơi về
   `LEAD_CONSULTANT_TO`/`LEAD_NOTIFY_TO`.
6. **Cấu hình inbound mail** (MX + webhook của Elastic Email / Postmark / Mailgun cho
   `reply.x-tech.com.vn`) — không có bước này thì luồng email chỉ một chiều (gửi được, khách trả lời
   không vào hệ thống).
7. **Đặt cron gọi `GET /api/payload-jobs/run`** (kèm `CRON_SECRET`) mỗi vài phút trên prod. Không có
   bước này thì job `leadFollowup` nằm mãi trong `payload_jobs` và **email chủ động không bao giờ gửi**.
8. Chưa có **unit test** cho 3 module pure đáng test nhất: `state-machine.ts` (advance/score/
   `keywordSignals` — chỗ này vừa có bug thật, rất đáng cắm test), `tokens.ts` (sign/verify/expiry),
   `inbound.ts` (parse/isAutomated/stripQuotedReply), `email/render.ts` (3 pass substitution). Repo
   hiện chưa có vitest ở `apps/cms` (`test` script là placeholder) — thêm khi có thời gian.

### Điểm cần lưu ý khi đọc code
- **Chi phí AI**: mỗi lượt là **2 lời gọi** (reply + analyzer). Analyzer mặc định dùng chung model
  với chat (`claude-haiku-4-5`). Nếu muốn rẻ hơn nữa, đặt `LEAD_ANALYZER_MODEL`.
  Riêng job `leadFollowup` chỉ tốn **1** lời gọi (không chạy lại analyzer — xem mục 3.3).
- **Rate limit / daily cap đang in-memory** (giống module chat cũ) → chỉ đúng khi CMS chạy 1
  instance. Nhiều instance thì phải chuyển sang Redis.
- `intake` **tái dùng** conversation đang mở của lead thay vì tạo mới, tránh vỡ mạch hội thoại.
- Hook `relayConsultantMessage` truyền `skipTranscript: true` để tin nhắn chuyên gia không bị lưu 2
  lần (một lần kênh `consultant`, một lần kênh `email`).
- DB dev đang ở chế độ **push** (`payload_migrations` chỉ có row `dev` batch `-1`), **không** chạy
  `payload migrate` trên DB dev này — sẽ fail vì migration initial tưởng DB trống.
  `payload migrate:create` thì an toàn: nó diff với file snapshot `.json` cạnh mỗi migration, không
  phụ thuộc trạng thái DB dev.
- **Bật `jobs` trong `payload.config.ts` là thêm collection**: Payload tự sinh `payload-jobs` →
  2 bảng `payload_jobs` + `payload_jobs_log`. Thêm/sửa task nào cũng phải chạy lại
  `payload generate:types` (task slug nằm trong enum `enum_payload_jobs_task_slug`) và sinh migration,
  nếu không prod sẽ thiếu bảng/enum value.
