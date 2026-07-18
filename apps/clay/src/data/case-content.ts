/**
 * SET C06 — Customer Success (/khach-hang + case pages). ANONYMIZED use-cases
 * only (no fake logos/names) per the handoff. Content typed module (CMS later).
 */

export type CaseStory = {
  slug: string;
  title: string;
  anonymousLabel: string;
  summary: string;
  challenges: { title: string; description: string }[];
  beforeState: string[];
  afterState: string[];
  products: { productSlug: string; role: string }[];
  services: string[];
  implementationPhases: { order: number; title: string; description: string }[];
  outcomes: { title: string; description: string }[];
  nextRoadmap: { phase: number; title: string; description: string }[];
};

export const caseStories: CaseStory[] = [
  {
    slug: "chu-dau-tu-bat-dong-san-an-danh",
    title: "Liên thông bán hàng, tài chính và vận hành bất động sản",
    anonymousLabel: "Một chủ đầu tư bất động sản quy mô lớn",
    summary: "Use-case minh họa cấu trúc case ẩn danh — không trình bày như case công khai nếu chưa có quyền xác nhận.",
    challenges: [
      { title: "Dữ liệu bán hàng phân tán", description: "Lead, bảng hàng, giao dịch và hợp đồng được quản lý trên nhiều nguồn." },
      { title: "Khó liên thông sau bán", description: "Dữ liệu tài chính, bàn giao và vận hành chưa nối thành một hành trình." },
      { title: "Báo cáo chậm", description: "Lãnh đạo thiếu dữ liệu cập nhật để ra quyết định." },
    ],
    beforeState: ["Dữ liệu rời rạc", "Nhiều thao tác Excel", "Khó kiểm soát bảng hàng", "Báo cáo thủ công", "Đứt gãy dữ liệu sau bán"],
    afterState: ["Dữ liệu tập trung", "Quy trình số hóa", "Liên thông giao dịch", "Dashboard điều hành", "Kết nối bàn giao và vận hành"],
    products: [
      { productSlug: "xbooking", role: "core" }, { productSlug: "finerp", role: "supporting" },
      { productSlug: "xbuilding", role: "supporting" }, { productSlug: "x-ai", role: "supporting" },
    ],
    services: ["tu-van-chuyen-doi-so", "tich-hop-he-thong", "chuyen-doi-du-lieu", "dao-tao", "sla-va-ho-tro"],
    implementationPhases: [
      { order: 1, title: "Khảo sát", description: "Đánh giá hiện trạng và xác định phạm vi ưu tiên." },
      { order: 2, title: "Blueprint", description: "Thiết kế hành trình và kiến trúc liên thông." },
      { order: 3, title: "MVP", description: "Triển khai CRM, bảng hàng và booking." },
      { order: 4, title: "Tích hợp", description: "Kết nối tài chính, hợp đồng và dữ liệu." },
      { order: 5, title: "Go-live", description: "Triển khai chính thức và đào tạo." },
      { order: 6, title: "Mở rộng", description: "Kết nối bàn giao, vận hành và AI." },
    ],
    outcomes: [
      { title: "Dữ liệu thống nhất", description: "Một nguồn dữ liệu xuyên suốt hành trình khách hàng." },
      { title: "Quy trình minh bạch", description: "Tăng khả năng theo dõi và kiểm soát giao dịch." },
      { title: "Báo cáo kịp thời", description: "Dashboard hỗ trợ lãnh đạo theo dõi tình hình." },
    ],
    nextRoadmap: [
      { phase: 1, title: "Bài toán ưu tiên", description: "Bán hàng và booking." },
      { phase: 2, title: "Liên thông", description: "Tài chính, hợp đồng và bàn giao." },
      { phase: 3, title: "Dữ liệu", description: "Data hub và báo cáo." },
      { phase: 4, title: "AI", description: "Agent và automation." },
    ],
  },
  {
    slug: "doanh-nghiep-so-use-case",
    title: "Chuẩn hóa vận hành và cộng tác doanh nghiệp",
    anonymousLabel: "Use-case doanh nghiệp số",
    summary: "Mẫu use-case minh họa, không phải case study thực tế.",
    challenges: [
      { title: "Quy trình rời rạc", description: "Công việc, tài liệu và phê duyệt phân tán." },
      { title: "Thiếu dữ liệu điều hành", description: "Khó tổng hợp KPI và báo cáo xuyên phòng ban." },
    ],
    beforeState: ["Công việc phân tán", "Tài liệu rời rạc", "Phê duyệt chậm"],
    afterState: ["Workflow thống nhất", "Tài liệu tập trung", "Dashboard điều hành"],
    products: [
      { productSlug: "x-space", role: "core" }, { productSlug: "finerp", role: "supporting" }, { productSlug: "x-ai", role: "supporting" },
    ],
    services: ["tu-van-chuyen-doi-so", "dao-tao", "sla-va-ho-tro"],
    implementationPhases: [
      { order: 1, title: "Chuẩn hóa", description: "Rà soát quy trình và vai trò." },
      { order: 2, title: "Triển khai", description: "Công việc, tài liệu và phê duyệt." },
      { order: 3, title: "Dữ liệu", description: "Dashboard và KPI." },
      { order: 4, title: "AI hóa", description: "Agent và tri thức doanh nghiệp." },
    ],
    outcomes: [
      { title: "Tăng tính minh bạch", description: "Theo dõi công việc và tiến độ tập trung." },
    ],
    nextRoadmap: [
      { phase: 1, title: "Workspace", description: "Cộng tác và công việc." },
      { phase: 2, title: "Workflow", description: "Phê duyệt và tài liệu." },
      { phase: 3, title: "AI", description: "Tri thức và trợ lý điều hành." },
    ],
  },
];

export function caseBySlug(slug: string): CaseStory | undefined {
  return caseStories.find((c) => c.slug === slug);
}

export function hasCaseRoute(route: string): boolean {
  if (route === "/khach-hang") return true;
  if (route === "/khach-hang/cau-chuyen-khach-hang") return true;
  if (route.startsWith("/khach-hang/")) return !!caseBySlug(route.slice("/khach-hang/".length));
  return false;
}
