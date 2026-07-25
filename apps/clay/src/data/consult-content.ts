/**
 * Copy + route table for the multi-channel consultation surface (`/tu-van`).
 * Server-safe (no client imports) so `[[...slug]]/page.tsx` can dispatch on it.
 */

export type ConsultMode = "start" | "resume" | "history" | "unsubscribe";

export const CONSULT_ROUTES: Record<string, ConsultMode> = {
  "/tu-van": "start",
  "/tu-van/tiep-tuc": "resume",
  "/tu-van/lich-su": "history",
  "/tu-van/huy-nhan-email": "unsubscribe",
};

export function consultModeForRoute(route: string): ConsultMode | undefined {
  return CONSULT_ROUTES[route];
}

export function hasConsultRoute(route: string): boolean {
  return route in CONSULT_ROUTES;
}

/** Page titles/descriptions. Only `/tu-van` is indexable — the rest are session pages. */
export const CONSULT_SEO: Record<ConsultMode, { title: string; description: string }> = {
  start: {
    title: "Tư vấn giải pháp cùng trợ lý XTECH",
    description:
      "Trao đổi với trợ lý AI của XTECH để làm rõ bài toán chuyển đổi số của doanh nghiệp; chuyên gia XTECH tiếp nhận khi hồ sơ đủ rõ.",
  },
  resume: {
    title: "Tiếp tục phiên tư vấn — XTECH",
    description: "Mở lại đúng mạch hội thoại tư vấn của bạn trên web và email.",
  },
  history: {
    title: "Lịch sử tư vấn — XTECH",
    description: "Xem lại, tải về hoặc yêu cầu xóa lịch sử tư vấn của bạn.",
  },
  unsubscribe: {
    title: "Hủy nhận email tư vấn — XTECH",
    description: "Dừng nhận email tư vấn tự động từ XTECH.",
  },
};

export const CONSULT_HERO: Record<ConsultMode, { eyebrow: string; lines: string[]; highlight: string[]; subtitle: string }> = {
  start: {
    eyebrow: "Tư vấn giải pháp",
    lines: ["Trao đổi cùng trợ lý XTECH,", "chốt đúng bài toán của bạn"],
    highlight: ["đúng bài toán của bạn"],
    subtitle:
      "Trợ lý AI của XTECH sẽ cùng bạn làm rõ nhu cầu theo từng bước. Khi hồ sơ đủ rõ, một chuyên gia thật sẽ vào trao đổi trực tiếp — trên web hoặc qua email, cùng một mạch hội thoại.",
  },
  resume: {
    eyebrow: "Tiếp tục tư vấn",
    lines: ["Mở lại đúng", "mạch trao đổi của bạn"],
    highlight: ["mạch trao đổi của bạn"],
    subtitle:
      "Toàn bộ nội dung đã trao đổi qua web và email được hợp nhất tại đây. Trên thiết bị mới, chúng tôi cần xác minh email để bảo vệ hội thoại của bạn.",
  },
  history: {
    eyebrow: "Lịch sử tư vấn",
    lines: ["Toàn bộ nội dung", "đã trao đổi"],
    highlight: ["đã trao đổi"],
    subtitle: "Xem lại, tải về hoặc yêu cầu xóa lịch sử tư vấn của bạn.",
  },
  unsubscribe: {
    eyebrow: "Hủy nhận email",
    lines: ["Dừng nhận email", "tư vấn tự động"],
    highlight: ["tư vấn tự động"],
    subtitle: "Chúng tôi sẽ dừng mọi email tư vấn tự động cho hồ sơ này.",
  },
};

/** Trust points shown beside the intake form. */
export const CONSULT_POINTS: Array<{ title: string; description: string }> = [
  {
    title: "Hỏi đúng, không hỏi dồn",
    description:
      "Mỗi lượt chỉ một câu hỏi. Những gì bạn đã trả lời sẽ không bị hỏi lại, dù bạn trả lời trên web hay qua email.",
  },
  {
    title: "Chuyên gia thật vào đúng lúc",
    description:
      "Khi hồ sơ đủ rõ — hoặc ngay khi bạn muốn nói chuyện với người thật — một chuyên gia XTECH sẽ tiếp nhận hội thoại.",
  },
  {
    title: "Hội thoại của bạn được bảo vệ",
    description:
      "Liên kết trong email có thời hạn và chỉ mở trên thiết bị của bạn. Thiết bị mới phải xác minh email trước khi xem lịch sử.",
  },
];

export type ConsultField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  span?: 1 | 2;
};

/** Compact intake used when a visitor lands on /tu-van without a session. */
export const CONSULT_FIELDS: ConsultField[] = [
  { name: "fullName", label: "Họ và tên", type: "text", required: true, placeholder: "Nguyễn Văn A" },
  { name: "email", label: "Email công việc", type: "email", required: true, placeholder: "ten@congty.vn" },
  { name: "phone", label: "Số điện thoại", type: "tel", required: true, placeholder: "09xx xxx xxx" },
  { name: "company", label: "Doanh nghiệp", type: "text", placeholder: "Tên công ty" },
  {
    name: "message",
    label: "Bài toán bạn đang cần giải quyết",
    type: "textarea",
    required: true,
    span: 2,
    placeholder: "Ví dụ: quản lý bán hàng dự án còn thủ công, dữ liệu rời rạc giữa sale và kế toán…",
  },
];

/** Channel badge copy for the unified transcript. */
export const CHANNEL_BADGE: Record<string, { label: string; className: string }> = {
  "web-chat": { label: "Web Chat", className: "border-blue/25 bg-blue/8 text-blue" },
  email: { label: "Email", className: "border-gold/40 bg-gold/12 text-blue" },
  consultant: { label: "Chuyên gia XTECH", className: "border-cyan/40 bg-cyan/12 text-blue" },
  system: { label: "Hệ thống", className: "border-border bg-muted text-muted-foreground" },
};

/** Vietnamese labels for the qualification states surfaced in the UI. */
export const STATUS_LABEL: Record<string, string> = {
  NEW: "Mới bắt đầu",
  AI_QUALIFYING: "Đang làm rõ nhu cầu",
  NEED_MORE_INFORMATION: "Cần thêm thông tin",
  AI_RECOMMENDATION_SENT: "Đã có đề xuất sơ bộ",
  WAITING_CUSTOMER: "Chờ bạn phản hồi",
  HUMAN_READY: "Đang chuyển tới chuyên gia XTECH",
  ASSIGNED: "Chuyên gia đã tiếp nhận",
  CONTACTED: "Chuyên gia đang trao đổi",
  MEETING_BOOKED: "Đã hẹn gặp",
  PROPOSAL: "Đang xây dựng đề xuất",
  NURTURE: "Tạm dừng theo dõi",
  UNSUBSCRIBED: "Đã dừng nhận email",
  CLOSED_LOST: "Đã đóng",
};

/** Slot keys → labels, mirroring the CMS state machine (for the progress panel). */
export const SLOT_LABEL: Record<string, string> = {
  primaryNeed: "Bài toán ưu tiên",
  businessModel: "Mô hình doanh nghiệp",
  userScale: "Quy mô người dùng",
  currentSystems: "Hệ thống hiện hữu",
  departments: "Phòng ban liên quan",
  urgency: "Mức độ cấp thiết",
  targetTimeline: "Thời gian triển khai",
  infrastructure: "Hạ tầng",
  demoOrQuote: "Nhu cầu demo / báo giá",
  decisionMaker: "Người quyết định",
};
