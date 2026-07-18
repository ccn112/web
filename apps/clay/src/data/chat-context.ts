/**
 * Per-route context for the AI chat widget: a short summary shown to the user
 * and suggested follow-up prompts. Curated (route → context) with sensible
 * prefix fallbacks. The summary is also passed to the model as page context.
 */

export type ChatContext = { label: string; summary: string; prompts: string[] };

const MAP: Record<string, ChatContext> = {
  "/": {
    label: "Trang chủ",
    summary:
      "Hệ sinh thái công nghệ & AI của XTECH cho doanh nghiệp và bất động sản: kết nối dữ liệu, số hóa quy trình, sản phẩm và AI trên một nền tảng dùng chung.",
    prompts: [
      "XTECH giúp doanh nghiệp tôi chuyển đổi số như thế nào?",
      "Hệ sinh thái sản phẩm XTECH gồm những gì?",
      "Giải pháp nào phù hợp với chủ đầu tư bất động sản?",
    ],
  },
  "/ve-x": {
    label: "Về X",
    summary: "Giới thiệu XTECH: năng lực, nền tảng doanh nghiệp, giá trị và mô hình đồng hành.",
    prompts: ["XTECH có năng lực và kinh nghiệm gì?", "Nền tảng doanh nghiệp của XTECH hoạt động ra sao?"],
  },
  "/giai-phap": {
    label: "Giải pháp",
    summary: "Giải pháp XTECH theo chuỗi nghiệp vụ, theo đối tượng và theo mục tiêu kinh doanh.",
    prompts: ["Giải pháp nào phù hợp với doanh nghiệp tôi?", "So sánh giải pháp theo đối tượng và theo nghiệp vụ?"],
  },
  "/san-pham": {
    label: "Sản phẩm",
    summary: "5 sản phẩm XTECH (X.AI, XBooking, FinERP, XBuilding, X.Space) quanh nền tảng dùng chung.",
    prompts: ["So sánh các sản phẩm XTECH?", "XBooking phù hợp với ai?", "FinERP giải quyết bài toán gì?"],
  },
  "/dich-vu": {
    label: "Dịch vụ",
    summary: "Dịch vụ chuyển đổi số toàn diện: từ đánh giá hiện trạng, chiến lược, thiết kế, triển khai đến vận hành.",
    prompts: ["Quy trình tư vấn & triển khai của XTECH?", "Dịch vụ chuyển đổi số bắt đầu từ đâu?"],
  },
  "/bo-giai-phap-x": {
    label: "Bộ giải pháp X",
    summary: "Các bộ giải pháp lắp ghép theo mô hình doanh nghiệp (chủ đầu tư, sàn/đại lý, vận hành BĐS...).",
    prompts: ["Bộ giải pháp nào cho chủ đầu tư bất động sản?", "Cách lắp ghép sản phẩm thành một bộ giải pháp?"],
  },
  "/trien-khai": {
    label: "Triển khai",
    summary: "Quy trình triển khai end-to-end, kiến trúc, tích hợp hệ thống, chuyển đổi dữ liệu, DevSecOps và SLA.",
    prompts: ["Quy trình triển khai gồm những bước nào?", "XTECH tích hợp với hệ thống hiện có ra sao?", "Có những mô hình triển khai nào?"],
  },
  "/khach-hang": {
    label: "Kinh nghiệm",
    summary: "Câu chuyện triển khai thực tế (ẩn danh): thách thức, giải pháp và kết quả.",
    prompts: ["Case chủ đầu tư bất động sản triển khai thế nào?", "Kết quả điển hình sau khi dùng XTECH?"],
  },
  "/insights": {
    label: "Insights",
    summary: "Góc nhìn về chuyển đổi số, AI, dữ liệu và PropTech.",
    prompts: ["Xu hướng chuyển đổi số bất động sản?", "Làm sao đưa AI vào vận hành thực tế?"],
  },
  "/tin-tuc": {
    label: "Tin tức",
    summary: "Cập nhật xu hướng, kiến thức và câu chuyện thực tiễn về công nghệ, AI và bất động sản.",
    prompts: ["Có gì mới về AI cho doanh nghiệp?", "5 xu hướng chuyển đổi số nổi bật?"],
  },
  "/lien-he": {
    label: "Liên hệ",
    summary: "Trao đổi với đội ngũ XTECH.",
    prompts: ["Tôi muốn được tư vấn giải pháp", "Đặt lịch demo sản phẩm"],
  },
};

const PREFIX: { prefix: string; ctx: ChatContext }[] = [
  {
    prefix: "/san-pham/",
    ctx: {
      label: "Sản phẩm",
      summary: "Chi tiết sản phẩm trong hệ sinh thái XTECH.",
      prompts: ["Sản phẩm này có tính năng gì nổi bật?", "Chi phí và mô hình triển khai ra sao?", "Đặt lịch demo sản phẩm này"],
    },
  },
  {
    prefix: "/bo-giai-phap-x/",
    ctx: {
      label: "Bộ giải pháp X",
      summary: "Chi tiết một bộ giải pháp lắp ghép theo mô hình doanh nghiệp.",
      prompts: ["Bộ giải pháp này gồm sản phẩm nào?", "Phù hợp với doanh nghiệp quy mô nào?"],
    },
  },
  {
    prefix: "/khach-hang/",
    ctx: {
      label: "Kinh nghiệm",
      summary: "Chi tiết một câu chuyện khách hàng (ẩn danh).",
      prompts: ["Thách thức và giải pháp trong case này?", "Kết quả đạt được là gì?"],
    },
  },
  {
    prefix: "/insights/",
    ctx: {
      label: "Insights",
      summary: "Bài viết góc nhìn công nghệ cho doanh nghiệp.",
      prompts: ["Tóm tắt ý chính bài viết này?", "Áp dụng vào doanh nghiệp tôi thế nào?"],
    },
  },
  {
    prefix: "/tin-tuc/",
    ctx: {
      label: "Tin tức",
      summary: "Bài viết tin tức của XTECH.",
      prompts: ["Tóm tắt bài viết này?", "Điều này ảnh hưởng gì tới doanh nghiệp bất động sản?"],
    },
  },
  {
    prefix: "/trien-khai/",
    ctx: {
      label: "Triển khai",
      summary: "Chi tiết một hạng mục triển khai/tích hợp.",
      prompts: ["Hạng mục này triển khai ra sao?", "Cần chuẩn bị gì từ phía doanh nghiệp?"],
    },
  },
];

const DEFAULT: ChatContext = {
  label: "XTECH",
  summary: "Trợ lý XTECH hỗ trợ về chuyển đổi số, AI và công nghệ cho bất động sản.",
  prompts: [
    "XTECH giúp gì cho doanh nghiệp của tôi?",
    "Giải pháp nào phù hợp với bất động sản?",
    "Tôi muốn đặt lịch demo",
  ],
};

export function chatContextForRoute(path: string): ChatContext {
  const clean = path.split("?")[0]!.replace(/\/+$/, "") || "/";
  if (MAP[clean]) return MAP[clean];
  for (const p of PREFIX) if (clean.startsWith(p.prefix)) return p.ctx;
  return DEFAULT;
}
