/**
 * SET C07 — Insights (/insights redesign). Curated categories + articles from
 * the handoff (metadata only; bodies authored in CMS later). Typed module.
 */

import type { ArticleBlock } from "@/components/editorial/kit";

export type InsightCategory = { slug: string; title: string; description: string; icon: string };
export type InsightArticle = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  tags: string[];
  featured?: boolean;
  relatedProducts?: string[];
  relatedSolutions?: string[];
  publishedAt?: string;
  readTime?: string;
  author?: string;
  body?: ArticleBlock[];
};

export const insightCategories: InsightCategory[] = [
  { slug: "chuyen-doi-so", title: "Chuyển đổi số", description: "Chiến lược, kiến trúc và lộ trình chuyển đổi số cho doanh nghiệp.", icon: "transformation" },
  { slug: "ai-doanh-nghiep", title: "AI doanh nghiệp", description: "AI Agent, Knowledge & RAG, quản trị và triển khai AI trong doanh nghiệp.", icon: "ai" },
  { slug: "du-lieu", title: "Dữ liệu", description: "Data platform, tích hợp, chất lượng dữ liệu và phân tích điều hành.", icon: "data" },
  { slug: "proptech", title: "PropTech", description: "Công nghệ cho chủ đầu tư, bán hàng bất động sản và vận hành tòa nhà.", icon: "xbuilding" },
];

export const insightArticles: InsightArticle[] = [
  { slug: "xay-dung-lo-trinh-chuyen-doi-so-theo-giai-doan", title: "Xây dựng lộ trình chuyển đổi số theo từng giai đoạn", summary: "Cách xác định bài toán ưu tiên, thiết kế kiến trúc và mở rộng chuyển đổi số có kiểm soát.", categorySlug: "chuyen-doi-so", tags: ["chiến lược", "roadmap", "kiến trúc"], featured: true, relatedProducts: ["finerp", "x-space", "x-ai"], relatedSolutions: ["chuyen-doi-so"], publishedAt: "2026-07-14", readTime: "7 phút",
    body: [
      { type: "p", text: "Chuyển đổi số hiệu quả bắt đầu từ bài toán kinh doanh, không phải từ công nghệ. Một lộ trình theo giai đoạn giúp doanh nghiệp tạo giá trị sớm, kiểm soát rủi ro và giữ được sự liên thông khi mở rộng." },
      { type: "h2", text: "Xác định bài toán ưu tiên" },
      { type: "p", text: "Chọn một hoặc hai bài toán có tác động lớn và khả thi để bắt đầu, thay vì cố gắng số hóa mọi thứ cùng lúc. Điều này giúp chứng minh giá trị và tạo động lực cho các giai đoạn tiếp theo." },
      { type: "h2", text: "Thiết kế kiến trúc nền tảng" },
      { type: "p", text: "Ngay từ đầu, hãy thiết kế tầng dữ liệu, tích hợp và định danh dùng chung để các bước mở rộng sau không trở thành các ốc đảo rời rạc." },
      { type: "list", items: [
        "Giai đoạn 1: số hóa bài toán ưu tiên và chuẩn hóa dữ liệu.",
        "Giai đoạn 2: tích hợp hệ thống và mở rộng quy trình.",
        "Giai đoạn 3: kích hoạt phân tích và AI trên dữ liệu đã kết nối.",
      ] },
    ] },
  { slug: "tu-pilot-ai-den-ai-van-hanh-thuc-te", title: "Từ pilot AI đến AI vận hành thực tế trong doanh nghiệp", summary: "Những điều kiện cần để AI vượt qua giai đoạn thử nghiệm và tạo ra giá trị trong quy trình thực.", categorySlug: "ai-doanh-nghiep", tags: ["AI Agent", "RAG", "governance"], featured: true, relatedProducts: ["x-ai"], publishedAt: "2026-07-11", readTime: "6 phút",
    body: [
      { type: "p", text: "Nhiều dự án AI dừng lại ở giai đoạn thử nghiệm vì thiếu dữ liệu chất lượng, quy trình rõ ràng và cơ chế quản trị. Để AI tạo ra giá trị thực, doanh nghiệp cần chuyển từ tư duy 'thử nghiệm' sang 'vận hành'." },
      { type: "h2", text: "Điều kiện để AI đi vào vận hành" },
      { type: "list", items: [
        "Dữ liệu được tổ chức, gắn ngữ cảnh và phân quyền rõ ràng.",
        "Quy trình nghiệp vụ được chuẩn hóa để AI can thiệp đúng điểm.",
        "Cơ chế giám sát, kiểm toán và guardrails cho đầu ra của AI.",
        "Con người vẫn tham gia kiểm chứng ở các quyết định quan trọng.",
      ] },
      { type: "p", text: "Khi hội đủ các điều kiện này, AI Agent có thể tự động hóa tác vụ, hỗ trợ ra quyết định và mở rộng dần theo mức độ tin cậy." },
    ] },
  { slug: "nen-tang-du-lieu-thong-nhat-cho-doanh-nghiep", title: "Nền tảng dữ liệu thống nhất cho doanh nghiệp", summary: "Tổ chức dữ liệu, tích hợp và quyền truy cập để phục vụ báo cáo và AI.", categorySlug: "du-lieu", tags: ["data platform", "integration", "analytics"], relatedProducts: ["x-ai", "finerp"], publishedAt: "2026-07-08", readTime: "6 phút" },
  { slug: "hanh-trinh-so-cho-chu-dau-tu-bat-dong-san", title: "Hành trình số cho chủ đầu tư bất động sản", summary: "Liên thông marketing, bảng hàng, booking, hợp đồng, thanh toán, bàn giao và vận hành.", categorySlug: "proptech", tags: ["bất động sản", "booking", "customer journey"], featured: true, relatedProducts: ["xbooking", "finerp", "xbuilding"], publishedAt: "2026-07-05", readTime: "8 phút" },
  { slug: "integration-hub-ket-noi-he-thong-hien-huu", title: "Integration Hub cho hệ sinh thái hệ thống hiện hữu", summary: "Vai trò của API Gateway, Event Bus và workflow trong kiến trúc doanh nghiệp.", categorySlug: "du-lieu", tags: ["API", "event bus", "integration"], relatedSolutions: ["tich-hop-he-thong"], publishedAt: "2026-07-02", readTime: "6 phút" },
  { slug: "quan-tri-ai-an-toan-trong-doanh-nghiep", title: "Quản trị AI an toàn trong doanh nghiệp", summary: "Phân quyền, audit, guardrails và bảo vệ dữ liệu khi triển khai AI Agent.", categorySlug: "ai-doanh-nghiep", tags: ["governance", "security", "AI Agent"], relatedProducts: ["x-ai"], publishedAt: "2026-06-28", readTime: "5 phút" },
  { slug: "mo-hinh-saas-private-cloud-on-premise-hybrid", title: "Chọn SaaS, Private Cloud, On-premise hay Hybrid", summary: "So sánh các mô hình triển khai theo tốc độ, dữ liệu, tùy chỉnh và vận hành.", categorySlug: "chuyen-doi-so", tags: ["cloud", "on-premise", "hybrid"], publishedAt: "2026-06-24", readTime: "7 phút" },
  { slug: "smart-building-tu-quan-ly-den-van-hanh-thong-minh", title: "Smart Building: từ quản lý đến vận hành thông minh", summary: "Kết nối cư dân, dịch vụ, thiết bị, bảo trì, IoT và AI trong vận hành tòa nhà.", categorySlug: "proptech", tags: ["smart building", "IoT", "vận hành"], relatedProducts: ["xbuilding", "x-ai"], publishedAt: "2026-06-20", readTime: "6 phút" },
];

export function categoryBySlug(slug: string) {
  return insightCategories.find((c) => c.slug === slug);
}
export function insightBySlug(slug: string) {
  return insightArticles.find((a) => a.slug === slug);
}
export function hasInsightRoute(route: string): boolean {
  if (route === "/insights") return true;
  if (route === "/insights/danh-sach") return true;
  if (route.startsWith("/insights/") && !route.startsWith("/insights/tag/")) {
    return !!insightBySlug(route.slice("/insights/".length));
  }
  return false;
}
