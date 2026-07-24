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
  cover?: string;
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
    cover: "/images/backgrounds/home/hero-ecosystem.webp",
    body: [
      { type: "p", text: "XTECH giới thiệu hệ sinh thái sản phẩm và dịch vụ hợp nhất, giúp doanh nghiệp và chủ đầu tư bất động sản kết nối dữ liệu, số hóa quy trình và ứng dụng trí tuệ nhân tạo trên cùng một nền tảng dùng chung." },
      { type: "h2", text: "Một nền tảng, nhiều bài toán" },
      { type: "p", text: "Thay vì triển khai rời rạc, các sản phẩm của XTECH được thiết kế để chia sẻ chung tầng dữ liệu, định danh, quy trình và AI. Nhờ đó, doanh nghiệp có thể bắt đầu từ một bài toán ưu tiên rồi mở rộng dần mà vẫn giữ được sự liên thông." },
      { type: "list", items: [
        "Kết nối dữ liệu bán hàng, tài chính và vận hành thành một nguồn thống nhất.",
        "Số hóa quy trình đầu–cuối, giảm thao tác thủ công.",
        "Kích hoạt AI Agent trên dữ liệu và nghiệp vụ thực tế của doanh nghiệp.",
      ] },
      { type: "image", src: "/images/backgrounds/home/hero-ecosystem.webp", alt: "Hệ sinh thái sản phẩm XTECH trên nền tảng dùng chung", caption: "Các sản phẩm liên thông trên nền tảng dữ liệu, API và AI dùng chung." },
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
    cover: "/products/xbooking/xbk-09-inventory-matrix.png",
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
    publishedAt: "2026-07-09", readTime: "5 phút", author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-04-executive-reporting-ai.png",
    body: [
      { type: "p", text: "Ở nhiều doanh nghiệp, mỗi phòng ban giữ một 'ốc đảo' dữ liệu riêng. Khi cần ra quyết định, lãnh đạo phải chờ tổng hợp thủ công từ nhiều nguồn — chậm và dễ sai lệch. Dữ liệu hợp nhất thay đổi điều đó." },
      { type: "h2", text: "Một nguồn sự thật cho toàn doanh nghiệp" },
      { type: "p", text: "Khi dữ liệu bán hàng, tài chính và vận hành được kết nối về một nền tảng và chuẩn hóa cách tính, mọi báo cáo đều nhất quán. Không còn những cuộc họp tranh cãi 'số của ai đúng'." },
      { type: "image", src: "/products/xai/xai-04-executive-reporting-ai.png", alt: "Báo cáo điều hành do AI tổng hợp", caption: "Báo cáo điều hành tổng hợp đa nguồn, cập nhật theo thời gian thực." },
      { type: "h2", text: "Ra quyết định nhanh và chính xác hơn" },
      { type: "list", items: [
        "Bức tranh điều hành thời gian thực thay cho báo cáo tổng hợp cuối kỳ.",
        "Cảnh báo sớm khi chỉ số vượt ngưỡng để can thiệp kịp thời.",
        "Nền tảng dữ liệu sạch làm bệ phóng cho phân tích và AI phía sau.",
      ] },
      { type: "quote", text: "Tốc độ ra quyết định là lợi thế cạnh tranh — và nó bắt đầu từ dữ liệu liên thông." },
    ],
  },
  {
    slug: "tu-dong-hoa-quy-trinh-noi-bo-voi-workflow-va-ai-agent",
    title: "Tự động hóa quy trình nội bộ với workflow và AI agent",
    excerpt: "Kết hợp workflow, RPA và AI agent giúp giảm thao tác thủ công, tăng tốc phê duyệt và nâng cao hiệu suất vận hành doanh nghiệp.",
    categorySlug: "tu-dong-hoa", tags: ["Tự động hóa", "AI"], relatedProducts: ["x-ai", "x-space"],
    publishedAt: "2026-07-06", readTime: "5 phút", author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-19-workflow-automation-studio.png",
    body: [
      { type: "p", text: "Nhiều công việc văn phòng vẫn tiêu tốn hàng giờ mỗi ngày cho các tác vụ lặp lại: nhập liệu, tổng hợp, trình duyệt. Kết hợp workflow, RPA và AI agent giúp giải phóng nhân sự khỏi những việc đó để tập trung vào phần giá trị cao." },
      { type: "h2", text: "Ba lớp tự động hóa bổ trợ nhau" },
      { type: "list", items: [
        "Workflow: chuẩn hóa và điều phối quy trình, luồng phê duyệt đa cấp.",
        "RPA: thay thao tác lặp lại trên các hệ thống không có API.",
        "AI Agent: hiểu ngữ cảnh, soạn nội dung và ra quyết định trong phạm vi cho phép.",
      ] },
      { type: "image", src: "/products/xai/xai-19-workflow-automation-studio.png", alt: "Workflow Automation Studio", caption: "Thiết kế luồng tự động hóa nghiệp vụ trực quan, có kiểm soát." },
      { type: "h2", text: "Bắt đầu từ quy trình rõ ràng nhất" },
      { type: "p", text: "Ưu tiên tự động hóa các quy trình có bước rõ ràng, khối lượng lớn và ít ngoại lệ — ví dụ phê duyệt chi, xử lý chứng từ, nhắc việc. Khi đã tin cậy, mở rộng dần sang các quy trình phức tạp hơn với con người giám sát ở điểm quan trọng." },
      { type: "quote", text: "Tự động hóa tốt không thay thế con người, mà trả lại cho con người thời gian cho việc quan trọng." },
    ],
  },
  {
    slug: "xbooking-toi-uu-hanh-trinh-ban-hang-va-cham-soc-khach-hang",
    title: "XBooking tối ưu hành trình bán hàng và chăm sóc khách hàng",
    excerpt: "Từ marketing, lead, bảng hàng đến booking và chăm sóc — XBooking hợp nhất dữ liệu khách hàng trên một quy trình khép kín.",
    categorySlug: "bat-dong-san-so", tags: ["XBooking", "CRM", "Khách hàng"], relatedProducts: ["xbooking"],
    featured: true, publishedAt: "2026-07-03", readTime: "4 phút", author: "Đội ngũ XTECH",
    cover: "/products/xbooking/xbk-07-sales-pipeline.png",
    body: [
      { type: "p", text: "Bán hàng bất động sản là một hành trình dài với nhiều điểm chạm. Khi mỗi giai đoạn dùng một công cụ riêng, dữ liệu đứt gãy và khách hàng dễ bị bỏ rơi. XBooking hợp nhất toàn bộ hành trình trên một quy trình khép kín." },
      { type: "h2", text: "Khép kín từ lead đến chăm sóc" },
      { type: "list", items: [
        "Thu lead đa nguồn, chấm điểm và phân bổ tự động cho đội sales.",
        "Bảng hàng thời gian thực, giữ chỗ và lock cọc tránh trùng bán.",
        "Hợp đồng, thanh toán theo tiến độ và chăm sóc sau bán trên một trục.",
      ] },
      { type: "image", src: "/products/xbooking/xbk-07-sales-pipeline.png", alt: "Sales pipeline của XBooking", caption: "Theo dõi cơ hội qua từng giai đoạn và dự báo doanh số." },
      { type: "p", text: "Nhờ dữ liệu liên thông, đội sales tư vấn nhanh và chính xác hơn, còn ban lãnh đạo nắm được bức tranh bán hàng theo thời gian thực để điều hành." },
    ],
  },
  {
    slug: "finerp-kiem-soat-tai-chinh-va-van-hanh-theo-thoi-gian-thuc",
    title: "FinERP giúp doanh nghiệp kiểm soát tài chính và vận hành theo thời gian thực",
    excerpt: "Kế toán, dòng tiền, ngân sách và công nợ trên một nền tảng — cùng dashboard điều hành và AI hỗ trợ dự báo tài chính.",
    categorySlug: "chuyen-doi-so", tags: ["FinERP", "ERP", "Dữ liệu"], relatedProducts: ["finerp", "x-ai"],
    publishedAt: "2026-06-30", readTime: "5 phút", author: "Đội ngũ XTECH",
    cover: "/products/finerp/ferp-03-cashflow.png",
    body: [
      { type: "p", text: "Tài chính là mạch máu của doanh nghiệp, nhưng nhiều nơi vẫn quản lý rời rạc trên sổ sách và bảng tính. FinERP hợp nhất tài chính và vận hành để lãnh đạo kiểm soát dòng tiền và hiệu quả theo thời gian thực." },
      { type: "h2", text: "Hợp nhất tài chính – vận hành" },
      { type: "list", items: [
        "Kế toán, dòng tiền, công nợ và ngân sách liên thông trên một nền tảng.",
        "Mua hàng, kho, tài sản và chi phí dự án gắn với dữ liệu tài chính.",
        "Dashboard điều hành và cảnh báo vượt ngân sách, đến hạn, quá hạn.",
      ] },
      { type: "image", src: "/products/finerp/ferp-03-cashflow.png", alt: "Kiểm soát dòng tiền và công nợ trên FinERP", caption: "Chủ động dòng tiền: biết trước khi nào thiếu hụt để xoay xở." },
      { type: "h2", text: "AI hỗ trợ dự báo và điều hành" },
      { type: "p", text: "Trên nền dữ liệu tài chính liên thông, AI có thể tổng hợp báo cáo, dự báo dòng tiền và cảnh báo rủi ro — giúp lãnh đạo ra quyết định chủ động thay vì bị động." },
      { type: "quote", text: "Kiểm soát tài chính theo thời gian thực là nền tảng của mọi quyết định điều hành vững vàng." },
    ],
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
