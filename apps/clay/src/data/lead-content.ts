/**
 * Lead conversion pages (/lien-he, /dat-lich-demo, /yeu-cau-tu-van).
 * Field sets follow handoff XTECH_CORPORATE_GO_LIVE_CHECKPOINT_V1
 * (starter/final-lead-pages-seed.json). Rendered by a bespoke two-column
 * layout; submissions post to /api/lead using `formCode` (CMS `forms`).
 * Route-check helper lives here (server-safe) — not in the client component.
 */

export type LeadFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox";

export type LeadField = {
  name: string;
  label: string;
  type: LeadFieldType;
  placeholder?: string;
  required?: boolean;
  /** Column span in the desktop 2-col grid (1 = half, 2 = full width). */
  span?: 1 | 2;
  options?: string[];
};

/** Central VN field definitions reused across the three lead forms. */
const FIELD: Record<string, LeadField> = {
  fullName: { name: "fullName", label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A", required: true, span: 1 },
  email: { name: "email", label: "Email công việc", type: "email", placeholder: "ban@congty.vn", required: true, span: 1 },
  phone: { name: "phone", label: "Số điện thoại", type: "tel", placeholder: "09xx xxx xxx", required: true, span: 1 },
  company: { name: "company", label: "Công ty / Tổ chức", type: "text", placeholder: "Tên doanh nghiệp", span: 1 },
  message: { name: "message", label: "Nội dung cần trao đổi", type: "textarea", placeholder: "Chia sẻ ngắn gọn nhu cầu của bạn…", span: 2 },
  products: {
    name: "products",
    label: "Sản phẩm quan tâm",
    type: "multiselect",
    span: 2,
    options: ["X.AI", "XBooking", "FinERP", "XBuilding", "X.Space", "Nền tảng dùng chung"],
  },
  preferredTime: {
    name: "preferredTime",
    label: "Thời gian mong muốn",
    type: "select",
    span: 1,
    options: ["Trong tuần này", "Tuần tới", "Trong tháng", "Linh hoạt"],
  },
  companyModel: {
    name: "companyModel",
    label: "Mô hình doanh nghiệp",
    type: "select",
    span: 1,
    options: ["Chủ đầu tư", "Sàn / Đại lý phân phối", "Đơn vị vận hành bất động sản", "Doanh nghiệp khác"],
  },
  userScale: {
    name: "userScale",
    label: "Quy mô người dùng",
    type: "select",
    span: 1,
    options: ["Dưới 50", "50 – 200", "200 – 1.000", "Trên 1.000"],
  },
  priorityProblems: { name: "priorityProblems", label: "Bài toán ưu tiên", type: "textarea", placeholder: "Ví dụ: quản lý bảng hàng, liên thông tài chính, số hóa vận hành…", span: 2 },
  currentSystems: { name: "currentSystems", label: "Hệ thống đang dùng", type: "textarea", placeholder: "Các phần mềm/ERP/CRM đang sử dụng (nếu có)", span: 2 },
  consent: {
    name: "consent",
    label: "Tôi đồng ý để XTECH liên hệ tư vấn và xử lý thông tin theo Chính sách bảo mật.",
    type: "checkbox",
    required: true,
    span: 2,
  },
};

export type LeadPage = {
  slug: string;
  route: string;
  formCode: string;
  submitLabel: string;
  hero: { eyebrow: string; lines: string[]; highlight?: string[]; subtitle: string };
  /** Left-column trust points (what to expect). */
  aside: { title: string; points: { title: string; description: string }[] };
  fields: LeadField[];
};

function pick(...keys: string[]): LeadField[] {
  return keys.map((k) => FIELD[k]!);
}

export const leadPages: LeadPage[] = [
  {
    slug: "lien-he",
    route: "/lien-he",
    formCode: "contact",
    submitLabel: "Gửi thông tin",
    hero: {
      eyebrow: "Liên hệ",
      lines: ["Trao đổi cùng", "đội ngũ XTECH"],
      highlight: ["đội ngũ XTECH"],
      subtitle: "Chia sẻ nhu cầu của bạn — chúng tôi phản hồi trong vòng một ngày làm việc.",
    },
    aside: {
      title: "Khi bạn liên hệ",
      points: [
        { title: "Phản hồi nhanh", description: "Đội ngũ tư vấn liên hệ trong 24 giờ làm việc." },
        { title: "Tư vấn không ràng buộc", description: "Trao đổi để hiểu bài toán, không cam kết mua trước." },
        { title: "Bảo mật thông tin", description: "Dữ liệu của bạn được xử lý theo chính sách bảo mật." },
      ],
    },
    fields: pick("fullName", "email", "phone", "company", "message", "consent"),
  },
  {
    slug: "dat-lich-demo",
    route: "/dat-lich-demo",
    formCode: "demo-request",
    submitLabel: "Đặt lịch demo",
    hero: {
      eyebrow: "Đặt lịch demo",
      lines: ["Trải nghiệm giải pháp", "qua demo thực tế"],
      highlight: ["demo thực tế"],
      subtitle: "Chọn sản phẩm quan tâm và thời gian phù hợp — chúng tôi chuẩn bị demo đúng nhu cầu của bạn.",
    },
    aside: {
      title: "Buổi demo gồm",
      points: [
        { title: "Demo theo kịch bản của bạn", description: "Trình bày trên đúng nghiệp vụ bạn quan tâm." },
        { title: "Tư vấn lộ trình triển khai", description: "Gợi ý cách áp dụng phù hợp quy mô doanh nghiệp." },
        { title: "Hỏi đáp cùng chuyên gia", description: "Giải đáp trực tiếp về tính năng và tích hợp." },
      ],
    },
    fields: pick("fullName", "email", "phone", "company", "products", "preferredTime", "consent"),
  },
  {
    slug: "yeu-cau-tu-van",
    route: "/yeu-cau-tu-van",
    formCode: "consultation",
    submitLabel: "Gửi yêu cầu tư vấn",
    hero: {
      eyebrow: "Yêu cầu tư vấn",
      lines: ["Nhận tư vấn giải pháp", "theo bài toán riêng"],
      highlight: ["bài toán riêng"],
      subtitle: "Cung cấp bối cảnh doanh nghiệp để chúng tôi đề xuất lộ trình chuyển đổi số phù hợp.",
    },
    aside: {
      title: "Bạn sẽ nhận được",
      points: [
        { title: "Đề xuất sơ bộ theo hiện trạng", description: "Gợi ý sản phẩm và lộ trình theo bài toán của bạn." },
        { title: "Không ràng buộc", description: "Tư vấn để định hướng, không cam kết mua trước." },
        { title: "Bảo mật thông tin", description: "Mọi dữ liệu được xử lý theo chính sách bảo mật." },
      ],
    },
    fields: pick(
      "fullName",
      "email",
      "phone",
      "company",
      "companyModel",
      "userScale",
      "priorityProblems",
      "currentSystems",
      "consent",
    ),
  },
];

const BY_ROUTE = new Map(leadPages.map((p) => [p.route, p]));

/** Server-safe route check (used by the corporate override in page.tsx). */
export function hasLeadRoute(route: string): boolean {
  return BY_ROUTE.has(route);
}

export function leadPageForRoute(route: string): LeadPage | undefined {
  return BY_ROUTE.get(route);
}
