/**
 * Built-in transactional templates (the `email-templates` collection is seeded
 * from these on first send, then owned by marketing in admin).
 *
 * `htmlBody` here is the *content fragment* only — renderEmailShell() wraps it.
 * Variables use `{{snake_case}}`; see render.ts for the substitution rules.
 * Blocks the renderer injects verbatim (already HTML) are marked `_html`.
 */

import { LEAD_STATES, type LeadState } from '../state-machine'

export type TemplateKey =
  | 'lead_received'
  | 'qualification_question'
  | 'ai_recommendation'
  | 'device_verification'
  | 'human_ready_customer'
  | 'human_ready_internal'
  | 'consultant_message'

export type EmailTemplateDef = {
  templateKey: TemplateKey
  name: string
  audience: 'customer' | 'consultant'
  triggerStatus?: LeadState
  subject: string
  preheader: string
  eyebrow?: string
  heading: string
  htmlBody: string
  textBody: string
  ctaLabel?: string
  ctaUrlVar?: string
  /** Internal mail skips the marketing footer / unsubscribe link. */
  internal?: boolean
}

const isState = (s: string): s is LeadState => (LEAD_STATES as readonly string[]).includes(s)
export const asLeadState = (s: string | undefined): LeadState | undefined =>
  s && isState(s) ? s : undefined

/** Every customer email closes with the same "how to continue" instruction. */
const REPLY_HINT_HTML =
  'Anh/chị có thể <strong>trả lời trực tiếp email này</strong> — trợ lý XTECH đọc và tiếp tục đúng mạch trao đổi. Hoặc mở lại hội thoại trên website bằng nút bên dưới.'
const REPLY_HINT_TEXT =
  'Anh/chị có thể trả lời trực tiếp email này — trợ lý XTECH đọc và tiếp tục đúng mạch trao đổi. Hoặc mở lại hội thoại trên website qua liên kết: {{resume_url}}'

export const BUILTIN_TEMPLATES: readonly EmailTemplateDef[] = [
  /* ------------------------------------------------------- 1. acknowledgement */
  {
    templateKey: 'lead_received',
    name: 'Khách hàng — đã nhận yêu cầu tư vấn',
    audience: 'customer',
    triggerStatus: 'NEW',
    subject: 'XTECH đã nhận yêu cầu tư vấn của {{customer_name}}',
    preheader: 'Chúng tôi đã ghi nhận nhu cầu của anh/chị và bắt đầu chuẩn bị đề xuất phù hợp.',
    heading: 'Cảm ơn anh/chị đã liên hệ XTECH',
    htmlBody: `
{{p:Xin chào {{customer_name}}, XTECH đã nhận được yêu cầu tư vấn của anh/chị{{company_suffix}}. Đội ngũ của chúng tôi đã ghi nhận thông tin và bắt đầu chuẩn bị hướng tiếp cận phù hợp.}}
{{summary_block}}
{{p:Để đề xuất đúng bài toán thay vì giới thiệu chung chung, trợ lý XTECH sẽ hỏi thêm vài điểm quan trọng ngay trong email tiếp theo. Khi hồ sơ đủ rõ, một chuyên gia thực sự của XTECH sẽ vào trao đổi trực tiếp cùng anh/chị.}}
{{next_question_block}}
{{p:${REPLY_HINT_HTML}}}
{{cta}}
{{note:Thông thường anh/chị sẽ nhận phản hồi trong vòng 1 giờ làm việc.}}`,
    textBody: `Xin chào {{customer_name}},

XTECH đã nhận được yêu cầu tư vấn của anh/chị{{company_suffix}}.

{{summary_text}}

Để đề xuất đúng bài toán, trợ lý XTECH sẽ hỏi thêm vài điểm quan trọng. Khi hồ sơ đủ rõ, một chuyên gia của XTECH sẽ vào trao đổi trực tiếp.

{{next_question_text}}

${REPLY_HINT_TEXT}

— XTECH · x-tech.com.vn`,
    ctaLabel: 'Tiếp tục trao đổi trên website',
    ctaUrlVar: 'resume_url',
  },

  /* --------------------------------------------------- 2. qualification turn */
  {
    templateKey: 'qualification_question',
    name: 'Khách hàng — hỏi thêm thông tin (AI)',
    audience: 'customer',
    triggerStatus: 'NEED_MORE_INFORMATION',
    subject: 'XTECH cần thêm một thông tin để đề xuất đúng giải pháp',
    preheader: 'Chỉ một câu hỏi ngắn — giúp chúng tôi đề xuất đúng phạm vi cho {{company_name}}.',
    heading: 'Giúp chúng tôi hiểu rõ hơn một điểm',
    htmlBody: `
{{ai_reply_block}}
{{progress_block}}
{{p:${REPLY_HINT_HTML}}}
{{cta}}`,
    textBody: `{{ai_reply_text}}

{{progress_text}}

${REPLY_HINT_TEXT}

— Trợ lý XTECH`,
    ctaLabel: 'Trả lời trên website',
    ctaUrlVar: 'resume_url',
  },

  /* -------------------------------------------------- 3. AI recommendation */
  {
    templateKey: 'ai_recommendation',
    name: 'Khách hàng — đề xuất sơ bộ từ AI',
    audience: 'customer',
    triggerStatus: 'AI_RECOMMENDATION_SENT',
    subject: 'Đề xuất sơ bộ từ XTECH cho {{company_name}}',
    preheader: 'Hướng tiếp cận sơ bộ dựa trên các thông tin anh/chị đã chia sẻ.',
    eyebrow: 'Đề xuất sơ bộ',
    heading: 'Hướng tiếp cận XTECH đề xuất cho {{company_name}}',
    htmlBody: `
{{p:Xin chào {{customer_name}}, dựa trên những gì anh/chị đã chia sẻ, đây là hướng tiếp cận sơ bộ từ XTECH.}}
{{brief_block}}
{{ai_reply_block}}
{{p:Đây là đề xuất sơ bộ mang tính định hướng. Phạm vi, tiến độ và chi phí chính thức sẽ do chuyên gia XTECH xác nhận sau khi khảo sát.}}
{{p:${REPLY_HINT_HTML}}}
{{cta}}`,
    textBody: `Xin chào {{customer_name}},

Dựa trên những gì anh/chị đã chia sẻ, đây là hướng tiếp cận sơ bộ từ XTECH.

{{brief_text}}

{{ai_reply_text}}

Đây là đề xuất sơ bộ mang tính định hướng; phạm vi và chi phí chính thức sẽ do chuyên gia XTECH xác nhận sau khảo sát.

${REPLY_HINT_TEXT}

— Trợ lý XTECH`,
    ctaLabel: 'Xem lại toàn bộ hội thoại',
    ctaUrlVar: 'resume_url',
  },

  /* --------------------------------------------------- 4. device verification */
  {
    templateKey: 'device_verification',
    name: 'Khách hàng — mã xác minh thiết bị mới',
    audience: 'customer',
    subject: 'Mã xác minh XTECH: {{otp_code}}',
    preheader: 'Nhập mã {{otp_code}} để mở lại lịch sử tư vấn trên thiết bị mới.',
    eyebrow: 'Xác minh thiết bị',
    heading: 'Mã xác minh của anh/chị',
    htmlBody: `
{{p:Có yêu cầu mở lại lịch sử tư vấn XTECH trên một thiết bị chưa được xác minh. Nhập mã bên dưới để tiếp tục:}}
{{otp_block}}
{{p:Mã có hiệu lực trong {{otp_ttl}} phút và chỉ dùng được một lần.}}
{{note:Nếu không phải anh/chị yêu cầu, hãy bỏ qua email này — lịch sử hội thoại vẫn được bảo vệ và không thiết bị nào được mở.}}`,
    textBody: `Mã xác minh XTECH của anh/chị: {{otp_code}}

Mã có hiệu lực trong {{otp_ttl}} phút và chỉ dùng được một lần.

Nếu không phải anh/chị yêu cầu, hãy bỏ qua email này.

— XTECH`,
  },

  /* ------------------------------------------- 5. handoff notice to customer */
  {
    templateKey: 'human_ready_customer',
    name: 'Khách hàng — đang chuyển tới chuyên gia',
    audience: 'customer',
    triggerStatus: 'HUMAN_READY',
    subject: 'Chuyên gia XTECH sẽ liên hệ anh/chị về {{primary_need_short}}',
    preheader: 'Hồ sơ của anh/chị đã đủ thông tin — một chuyên gia thật sẽ tiếp nhận.',
    eyebrow: 'Chuyển tới chuyên gia',
    heading: 'Chuyên gia XTECH đang tiếp nhận yêu cầu của anh/chị',
    htmlBody: `
{{p:Xin chào {{customer_name}}, cảm ơn anh/chị đã trao đổi chi tiết. Hồ sơ đã đủ thông tin để một <strong>chuyên gia XTECH</strong> tiếp nhận trực tiếp thay cho trợ lý AI.}}
{{brief_block}}
{{sla_block}}
{{p:Nếu có thêm thông tin muốn bổ sung trước buổi trao đổi, anh/chị chỉ cần trả lời email này — chuyên gia sẽ đọc được ngay trong cùng hội thoại.}}
{{cta}}`,
    textBody: `Xin chào {{customer_name}},

Hồ sơ của anh/chị đã đủ thông tin để một chuyên gia XTECH tiếp nhận trực tiếp thay cho trợ lý AI.

{{brief_text}}

{{sla_text}}

Nếu muốn bổ sung thông tin, anh/chị chỉ cần trả lời email này.

— XTECH`,
    ctaLabel: 'Mở lại hội thoại',
    ctaUrlVar: 'resume_url',
  },

  /* ------------------------------------------ 6. internal consultant handoff */
  {
    templateKey: 'human_ready_internal',
    name: 'Nội bộ — LEAD ƯU TIÊN cần chuyên gia',
    audience: 'consultant',
    triggerStatus: 'HUMAN_READY',
    subject: '[LEAD ƯU TIÊN][{{lead_score}}] {{company_name}} – {{primary_need_short}}',
    preheader: 'Lý do chuyển: {{handoff_reason}} · SLA phản hồi {{sla_hours}} giờ.',
    eyebrow: 'Lead ưu tiên · cần người vào tư vấn',
    heading: '{{company_name}} — {{primary_need_short}}',
    internal: true,
    htmlBody: `
{{sla_block}}
{{label:Khách hàng}}
{{contact_block}}
{{label:Nhu cầu đã khai thác}}
{{brief_block}}
{{label:Tóm tắt AI}}
{{ai_summary_block}}
{{missing_block}}
{{label:Hành động đề xuất}}
{{next_actions_block}}
{{cta}}
{{links_block}}`,
    textBody: `[LEAD ƯU TIÊN] điểm {{lead_score}} — {{company_name}}

Lý do chuyển: {{handoff_reason}}
SLA phản hồi: {{sla_hours}} giờ (trước {{sla_due}})

KHÁCH HÀNG
{{contact_text}}

NHU CẦU
{{brief_text}}

TÓM TẮT AI
{{ai_summary_text}}

CÒN THIẾU
{{missing_text}}

HÀNH ĐỘNG ĐỀ XUẤT
{{next_actions_text}}

Hội thoại nội bộ: {{admin_conversation_url}}`,
    ctaLabel: 'Mở hội thoại & vào tư vấn',
    ctaUrlVar: 'admin_conversation_url',
  },

  /* ------------------------------------- 7. consultant speaking to customer */
  {
    templateKey: 'consultant_message',
    name: 'Khách hàng — tin nhắn từ chuyên gia',
    audience: 'customer',
    triggerStatus: 'ASSIGNED',
    subject: 'XTECH · {{consultant_name}} phản hồi về {{primary_need_short}}',
    preheader: 'Chuyên gia XTECH vừa gửi anh/chị một phản hồi trực tiếp.',
    eyebrow: 'Từ chuyên gia XTECH',
    heading: 'Phản hồi từ {{consultant_name}}',
    htmlBody: `
{{ai_reply_block}}
{{p:Anh/chị có thể trả lời trực tiếp email này — phản hồi sẽ tới đúng chuyên gia đang phụ trách, và hiển thị luôn trong hội thoại trên website.}}
{{cta}}`,
    textBody: `{{ai_reply_text}}

Anh/chị có thể trả lời trực tiếp email này — phản hồi sẽ tới đúng chuyên gia đang phụ trách.

Mở hội thoại trên website: {{resume_url}}

— {{consultant_name}} · XTECH`,
    ctaLabel: 'Mở hội thoại trên website',
    ctaUrlVar: 'resume_url',
  },
]

export const BUILTIN_BY_KEY = new Map<string, EmailTemplateDef>(
  BUILTIN_TEMPLATES.map((t) => [t.templateKey, t]),
)
