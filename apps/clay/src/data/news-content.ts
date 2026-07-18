/**
 * NEWS module (/tin-tuc) — from XTECH_NEWS_CLAUDE_HANDOFF_V1. Categories, tags
 * and 6 seed articles (excerpts authored from the suggested titles; full bodies
 * in CMS later). Typed module — CMS-driven later.
 */

import type { ArticleBlock } from "@/components/editorial/kit";

export type NewsCategory = { slug: string; title: string; description: string; icon: string };
export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  relatedProducts?: string[];
  featured?: boolean;
  pinned?: boolean;
  publishedAt: string;
  readTime: string;
  author?: string;
  body?: ArticleBlock[];
};

export const newsCategories: NewsCategory[] = [
  { slug: "tin-xtech", title: "Tin XTECH", description: "Cập nhật sản phẩm, sự kiện và hoạt động của XTECH.", icon: "transformation" },
  { slug: "chuyen-doi-so", title: "Chuyển đổi số", description: "Chiến lược, lộ trình và câu chuyện chuyển đổi số doanh nghiệp.", icon: "growth" },
  { slug: "ai-doanh-nghiep", title: "AI doanh nghiệp", description: "Ứng dụng AI Agent, tri thức và tự động hóa trong doanh nghiệp.", icon: "ai" },
  { slug: "bat-dong-san-so", title: "Bất động sản số", description: "Công nghệ cho bán hàng, vận hành và trải nghiệm bất động sản.", icon: "xbuilding" },
  { slug: "du-lieu-tich-hop", title: "Dữ liệu & tích hợp", description: "Nền tảng dữ liệu, tích hợp hệ thống và phân tích điều hành.", icon: "data" },
  { slug: "tu-dong-hoa", title: "Tự động hóa vận hành", description: "Workflow, RPA và AI agent tối ưu vận hành nội bộ.", icon: "automation" },
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "xtech-ra-mat-he-sinh-thai-ai-cho-doanh-nghiep-va-bat-dong-san",
    title: "XTECH ra mắt hệ sinh thái AI cho doanh nghiệp và bất động sản",
    excerpt: "Hệ sinh thái sản phẩm XTECH kết nối dữ liệu, quy trình và AI trên một nền tảng dùng chung cho doanh nghiệp và chủ đầu tư bất động sản.",
    categorySlug: "tin-xtech", tags: ["AI", "Bất động sản", "Insights"], relatedProducts: ["x-ai", "xbooking"],
    featured: true, pinned: true, publishedAt: "2026-07-15", readTime: "5 phút", author: "Đội ngũ XTECH",
    body: [
      { type: "p", text: "XTECH giới thiệu hệ sinh thái sản phẩm và dịch vụ hợp nhất, giúp doanh nghiệp và chủ đầu tư bất động sản kết nối dữ liệu, số hóa quy trình và ứng dụng trí tuệ nhân tạo trên cùng một nền tảng dùng chung." },
      { type: "h2", text: "Một nền tảng, nhiều bài toán" },
      { type: "p", text: "Thay vì triển khai rời rạc, các sản phẩm của XTECH được thiết kế để chia sẻ chung tầng dữ liệu, định danh, quy trình và AI. Nhờ đó, doanh nghiệp có thể bắt đầu từ một bài toán ưu tiên rồi mở rộng dần mà vẫn giữ được sự liên thông." },
      { type: "list", items: [
        "Kết nối dữ liệu bán hàng, tài chính và vận hành thành một nguồn thống nhất.",
        "Số hóa quy trình đầu–cuối, giảm thao tác thủ công.",
        "Kích hoạt AI Agent trên dữ liệu và nghiệp vụ thực tế của doanh nghiệp.",
      ] },
      { type: "h2", text: "Hướng tới triển khai có kiểm soát" },
      { type: "p", text: "Cách tiếp cận theo lộ trình giúp doanh nghiệp kiểm soát rủi ro và chi phí, đồng thời tạo giá trị sớm ở từng giai đoạn thay vì chờ một dự án lớn hoàn tất." },
    ],
  },
  {
    slug: "5-xu-huong-chuyen-doi-so-cho-chu-dau-tu-bat-dong-san",
    title: "5 xu hướng chuyển đổi số nổi bật cho chủ đầu tư bất động sản",
    excerpt: "Từ dữ liệu bán hàng hợp nhất đến AI hỗ trợ vận hành — những xu hướng định hình cách chủ đầu tư số hóa toàn bộ hành trình.",
    categorySlug: "bat-dong-san-so", tags: ["Bất động sản", "CRM"], relatedProducts: ["xbooking", "xbuilding"],
    featured: true, publishedAt: "2026-07-12", readTime: "6 phút", author: "Đội ngũ XTECH",
    body: [
      { type: "p", text: "Chuyển đổi số trong bất động sản không còn là lựa chọn mà đã trở thành yếu tố cạnh tranh. Dưới đây là năm xu hướng đang định hình cách chủ đầu tư số hóa toàn bộ hành trình từ bán hàng đến vận hành." },
      { type: "list", items: [
        "Hợp nhất dữ liệu bán hàng: lead, bảng hàng, giao dịch và hợp đồng trên một nguồn duy nhất.",
        "Liên thông sau bán: nối dữ liệu tài chính, bàn giao và vận hành thành một hành trình.",
        "AI hỗ trợ vận hành: dự báo, cảnh báo và tự động hóa các tác vụ lặp lại.",
        "Trải nghiệm khách hàng số: app cư dân, chăm sóc và dịch vụ tòa nhà.",
        "Ra quyết định thời gian thực: dashboard điều hành trên dữ liệu cập nhật.",
      ] },
      { type: "h2", text: "Bắt đầu từ đâu?" },
      { type: "p", text: "Chủ đầu tư nên ưu tiên bài toán tạo giá trị nhanh nhất — thường là hợp nhất dữ liệu bán hàng — rồi mở rộng sang tài chính, vận hành và AI theo lộ trình có kiểm soát." },
    ],
  },
  {
    slug: "du-lieu-hop-nhat-rut-ngan-thoi-gian-ra-quyet-dinh",
    title: "Dữ liệu hợp nhất giúp doanh nghiệp rút ngắn thời gian ra quyết định",
    excerpt: "Khi dữ liệu từ bán hàng, tài chính và vận hành được kết nối, lãnh đạo có bức tranh thời gian thực để quyết định nhanh và chính xác hơn.",
    categorySlug: "du-lieu-tich-hop", tags: ["Dữ liệu", "Vận hành"], relatedProducts: ["x-ai", "finerp"],
    publishedAt: "2026-07-09", readTime: "5 phút",
  },
  {
    slug: "tu-dong-hoa-quy-trinh-noi-bo-voi-workflow-va-ai-agent",
    title: "Tự động hóa quy trình nội bộ với workflow và AI agent",
    excerpt: "Kết hợp workflow, RPA và AI agent giúp giảm thao tác thủ công, tăng tốc phê duyệt và nâng cao hiệu suất vận hành doanh nghiệp.",
    categorySlug: "tu-dong-hoa", tags: ["Tự động hóa", "AI"], relatedProducts: ["x-ai", "x-space"],
    publishedAt: "2026-07-06", readTime: "5 phút",
  },
  {
    slug: "xbooking-toi-uu-hanh-trinh-ban-hang-va-cham-soc-khach-hang",
    title: "XBooking tối ưu hành trình bán hàng và chăm sóc khách hàng",
    excerpt: "Từ marketing, lead, bảng hàng đến booking và chăm sóc — XBooking hợp nhất dữ liệu khách hàng trên một quy trình khép kín.",
    categorySlug: "bat-dong-san-so", tags: ["XBooking", "CRM", "Khách hàng"], relatedProducts: ["xbooking"],
    featured: true, publishedAt: "2026-07-03", readTime: "4 phút",
  },
  {
    slug: "finerp-kiem-soat-tai-chinh-va-van-hanh-theo-thoi-gian-thuc",
    title: "FinERP giúp doanh nghiệp kiểm soát tài chính và vận hành theo thời gian thực",
    excerpt: "Kế toán, dòng tiền, ngân sách và công nợ trên một nền tảng — cùng dashboard điều hành và AI hỗ trợ dự báo tài chính.",
    categorySlug: "chuyen-doi-so", tags: ["FinERP", "ERP", "Dữ liệu"], relatedProducts: ["finerp", "x-ai"],
    publishedAt: "2026-06-30", readTime: "5 phút",
  },
];

export function newsCategoryBySlug(slug: string) {
  return newsCategories.find((c) => c.slug === slug);
}
export function newsBySlug(slug: string) {
  return newsArticles.find((a) => a.slug === slug);
}
export function hasNewsRoute(route: string): boolean {
  if (route === "/tin-tuc") return true;
  if (route === "/tin-tuc/danh-sach") return true;
  if (route.startsWith("/tin-tuc/")) return !!newsBySlug(route.slice("/tin-tuc/".length));
  return false;
}
