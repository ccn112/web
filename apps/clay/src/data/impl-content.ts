/**
 * SET C04 — Implementation & Integration (/trien-khai + subroutes).
 * Rendered by the bespoke ImplPages renderer (C04-specific visuals), NOT the
 * generic product orbit. Route-check helpers are server-safe (used by page.tsx).
 */
import type { ProductSection } from "./product-content";

export const implSections: ProductSection[] = [
  {
    sectionId: "c04-01",
    routes: ["/trien-khai", "/trien-khai/quy-trinh"],
    eyebrow: "Quy trình triển khai",
    title: "Từ khảo sát đến vận hành ổn định",
    highlight: ["vận hành ổn định"],
    subtitle: "XTECH đồng hành xuyên suốt từ khảo sát hiện trạng đến go-live, hypercare và tối ưu liên tục.",
    layout: "visual-right",
    items: [
      { id: "assessment", title: "Khảo sát", description: "Đánh giá hiện trạng nghiệp vụ, hệ thống và dữ liệu.", icon: "assessment" },
      { id: "architecture", title: "Kiến trúc mục tiêu", description: "Xây dựng kiến trúc phù hợp với lộ trình doanh nghiệp.", icon: "architecture" },
      { id: "design", title: "Thiết kế giải pháp", description: "Chi tiết hóa phạm vi, tích hợp và kế hoạch thực hiện.", icon: "solution-design" },
      { id: "build", title: "Phát triển & cấu hình", description: "Cấu hình, phát triển và kiểm thử giải pháp.", icon: "development" },
      { id: "integration", title: "Tích hợp", description: "Kết nối hệ thống và đồng bộ dữ liệu.", icon: "integration" },
      { id: "migration", title: "Migration", description: "Chuyển đổi và đối soát dữ liệu.", icon: "handover" },
      { id: "uat", title: "UAT & đào tạo", description: "Kiểm thử người dùng và chuyển giao.", icon: "support" },
      { id: "golive", title: "Go-live", description: "Triển khai chính thức có kiểm soát.", icon: "growth" },
      { id: "hypercare", title: "Hypercare", description: "Hỗ trợ tăng cường sau go-live.", icon: "care" },
      { id: "improve", title: "Tối ưu", description: "Đo lường và cải tiến liên tục.", icon: "productivity" },
    ],
    cta: { label: "Trao đổi về kế hoạch triển khai", href: "/lien-he" },
  },
  {
    sectionId: "c04-02",
    routes: ["/trien-khai"],
    eyebrow: "Kiến trúc giải pháp",
    title: "Hiểu đúng hiện trạng, thiết kế đúng kiến trúc",
    highlight: ["đúng kiến trúc"],
    subtitle: "Phân tích toàn diện nghiệp vụ, ứng dụng, dữ liệu, hạ tầng và bảo mật.",
    layout: "visual-left",
    items: [
      { id: "business", title: "Nghiệp vụ", description: "Quy trình, vai trò và mục tiêu vận hành.", icon: "workflow" },
      { id: "application", title: "Ứng dụng", description: "Danh mục hệ thống và mức độ đáp ứng.", icon: "api" },
      { id: "data", title: "Dữ liệu", description: "Nguồn dữ liệu, chất lượng và luồng khai thác.", icon: "data" },
      { id: "infra", title: "Hạ tầng & bảo mật", description: "Cloud, mạng, IAM, backup và giám sát.", icon: "security" },
    ],
  },
  {
    sectionId: "c04-03",
    routes: ["/trien-khai", "/trien-khai/tich-hop-he-thong"],
    eyebrow: "Integration Hub",
    title: "Kết nối hệ thống, hợp nhất dòng dữ liệu",
    highlight: ["hợp nhất dòng dữ liệu"],
    subtitle: "Kết nối các hệ thống hiện hữu với ứng dụng, dữ liệu và AI trên một lớp tích hợp thống nhất.",
    layout: "visual-right",
    items: [
      { id: "erp", title: "ERP", description: "Kết nối tài chính và vận hành.", icon: "finerp" },
      { id: "crm", title: "CRM", description: "Đồng bộ khách hàng và cơ hội.", icon: "crm" },
      { id: "hrm", title: "HRM", description: "Kết nối nhân sự và tổ chức.", icon: "customer" },
      { id: "legacy", title: "Legacy", description: "Tích hợp hệ thống hiện hữu.", icon: "operations" },
      { id: "api", title: "API Gateway", description: "Quản lý và bảo vệ API.", icon: "api" },
      { id: "event", title: "Event Bus", description: "Trao đổi dữ liệu theo sự kiện.", icon: "automation" },
      { id: "ai", title: "AI Agent", description: "Kích hoạt AI trên dữ liệu doanh nghiệp.", icon: "ai" },
    ],
  },
  {
    sectionId: "c04-04",
    routes: ["/trien-khai/tich-hop-he-thong"],
    eyebrow: "API & Event",
    title: "Tích hợp linh hoạt, vận hành theo sự kiện",
    highlight: ["theo sự kiện"],
    subtitle: "Quản lý API, sự kiện, hàng đợi, retry, audit và observability.",
    layout: "visual-left",
    items: [
      { id: "auth", title: "Authentication", description: "Xác thực và phân quyền truy cập.", icon: "identity" },
      { id: "rate", title: "Rate limit", description: "Kiểm soát lưu lượng và bảo vệ dịch vụ.", icon: "security" },
      { id: "queue", title: "Queue & Retry", description: "Đảm bảo độ tin cậy trong trao đổi dữ liệu.", icon: "workflow" },
      { id: "audit", title: "Audit", description: "Truy vết giao dịch và sự kiện.", icon: "analytics" },
      { id: "observe", title: "Observability", description: "Theo dõi hiệu năng và lỗi.", icon: "operations" },
    ],
  },
  {
    sectionId: "c04-05",
    routes: ["/trien-khai/chuyen-doi-du-lieu"],
    eyebrow: "Data Migration",
    title: "Chuyển đổi dữ liệu an toàn, có kiểm soát",
    highlight: ["an toàn"],
    subtitle: "Từ khảo sát nguồn đến mapping, làm sạch, đối soát và cutover.",
    layout: "visual-right",
    items: [
      { id: "source", title: "Khảo sát nguồn", description: "Phân tích cấu trúc và chất lượng dữ liệu.", icon: "data" },
      { id: "mapping", title: "Mapping", description: "Ánh xạ dữ liệu nguồn và đích.", icon: "integration" },
      { id: "clean", title: "Làm sạch", description: "Loại trùng lặp và chuẩn hóa.", icon: "productivity" },
      { id: "trial", title: "Chuyển đổi thử", description: "Kiểm tra quy trình và hiệu năng.", icon: "development" },
      { id: "reconcile", title: "Đối soát", description: "Xác nhận đầy đủ và chính xác.", icon: "analytics" },
      { id: "cutover", title: "Cutover", description: "Chuyển đổi chính thức có phương án rollback.", icon: "handover" },
    ],
  },
  {
    sectionId: "c04-06",
    routes: ["/trien-khai", "/trien-khai/cloud-va-on-premise"],
    eyebrow: "Mô hình triển khai",
    title: "Linh hoạt với mọi mô hình hạ tầng",
    highlight: ["mọi mô hình hạ tầng"],
    subtitle: "Lựa chọn SaaS, Private Cloud, On-premise hoặc Hybrid phù hợp với yêu cầu dữ liệu và vận hành.",
    layout: "visual-left",
    items: [
      { id: "saas", title: "SaaS", description: "Triển khai nhanh, vận hành linh hoạt.", icon: "saas" },
      { id: "private", title: "Private Cloud", description: "Môi trường riêng và kiểm soát tài nguyên.", icon: "private-cloud" },
      { id: "onprem", title: "On-premise", description: "Toàn quyền hạ tầng và dữ liệu.", icon: "on-premise" },
      { id: "hybrid", title: "Hybrid", description: "Kết hợp linh hoạt cloud và on-premise.", icon: "hybrid" },
    ],
  },
  {
    sectionId: "c04-07",
    routes: ["/trien-khai/devsecops"],
    eyebrow: "DevSecOps",
    title: "Bảo mật từ thiết kế, giám sát xuyên suốt",
    highlight: ["Bảo mật từ thiết kế"],
    subtitle: "Tích hợp kiểm thử, quét bảo mật, triển khai và giám sát vào toàn bộ vòng đời phát triển.",
    layout: "visual-right",
    items: [
      { id: "code", title: "Code", description: "Quản lý mã nguồn và review.", icon: "development" },
      { id: "build", title: "Build", description: "Build tự động và kiểm soát artifact.", icon: "automation" },
      { id: "test", title: "Test", description: "Kiểm thử chức năng và chất lượng.", icon: "support" },
      { id: "scan", title: "Security Scan", description: "Quét mã nguồn, dependency và secret.", icon: "security" },
      { id: "deploy", title: "Deploy", description: "Triển khai tự động và kiểm soát.", icon: "cloud" },
      { id: "monitor", title: "Monitor", description: "Theo dõi, cảnh báo và cải tiến.", icon: "operations" },
    ],
  },
  {
    sectionId: "c04-08",
    routes: ["/trien-khai", "/trien-khai/sla-va-ho-tro"],
    eyebrow: "Vận hành & hỗ trợ",
    title: "Go-live chỉ là điểm bắt đầu",
    highlight: ["điểm bắt đầu"],
    subtitle: "XTECH hỗ trợ vận hành, giám sát, phát hành và cải tiến liên tục sau triển khai.",
    layout: "visual-left",
    items: [
      { id: "service-desk", title: "Service Desk", description: "Tiếp nhận và xử lý yêu cầu tập trung.", icon: "support" },
      { id: "sla", title: "SLA", description: "Cam kết mức độ dịch vụ và thời gian phản hồi.", icon: "contract" },
      { id: "incident", title: "Incident", description: "Quản lý và khôi phục sự cố.", icon: "risk" },
      { id: "release", title: "Release", description: "Quản lý phiên bản và phát hành.", icon: "handover" },
      { id: "monitoring", title: "Monitoring", description: "Giám sát sức khỏe và hiệu năng hệ thống.", icon: "operations" },
      { id: "improvement", title: "Continuous Improvement", description: "Phân tích và cải tiến liên tục.", icon: "growth" },
    ],
    cta: { label: "Tìm hiểu SLA và hỗ trợ", href: "/trien-khai/sla-va-ho-tro" },
  },
];

/** Detail subroutes → short label for breadcrumbs/hero. */
export const implRouteLabels: Record<string, string> = {
  "/trien-khai/quy-trinh": "Quy trình triển khai",
  "/trien-khai/tich-hop-he-thong": "Tích hợp hệ thống",
  "/trien-khai/chuyen-doi-du-lieu": "Chuyển đổi dữ liệu",
  "/trien-khai/cloud-va-on-premise": "Cloud & On-premise",
  "/trien-khai/devsecops": "DevSecOps",
  "/trien-khai/sla-va-ho-tro": "SLA & hỗ trợ",
};

export function implSectionsForRoute(route: string): ProductSection[] {
  return implSections.filter((s) => s.routes.includes(route));
}

/** Server-safe route check (used by the corporate override in page.tsx). */
export function hasImplRoute(route: string): boolean {
  return route === "/trien-khai" || implSectionsForRoute(route).length > 0;
}
