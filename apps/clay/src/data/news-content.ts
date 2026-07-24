/**
 * NEWS module (/tin-tuc). Categories + bài tin tức của XTECH — mỗi bài bố cục
 * riêng, độ dài tự nhiên, ảnh minh họa từ kho asset dự án. CMS-driven later.
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
    featured: true, pinned: true, publishedAt: "2026-07-15", readTime: "6 phút", author: "Đội ngũ XTECH",
    cover: "/images/backgrounds/home/hero-ecosystem.webp",
    body: [
      { type: "p", text: "XTECH chính thức giới thiệu hệ sinh thái sản phẩm và dịch vụ hợp nhất, giúp doanh nghiệp và chủ đầu tư bất động sản kết nối dữ liệu, số hóa quy trình và ứng dụng trí tuệ nhân tạo trên cùng một nền tảng dùng chung." },
      { type: "p", text: "Khác với cách tiếp cận 'mỗi bài toán một phần mềm' vốn tạo ra các ốc đảo dữ liệu, hệ sinh thái của XTECH được thiết kế để mọi sản phẩm chia sẻ chung tầng dữ liệu, định danh, workflow và AI — cho phép doanh nghiệp bắt đầu từ một bài toán ưu tiên rồi mở rộng dần mà vẫn giữ được sự liên thông." },
      { type: "h2", text: "Một nền tảng, nhiều bài toán" },
      { type: "p", text: "Hệ sinh thái gồm năm sản phẩm chính — X.AI, XBooking, FinERP, XBuilding và X.Space — cùng lớp nền tảng dùng chung và các dịch vụ tư vấn, triển khai đi kèm." },
      { type: "list", items: [
        "Kết nối dữ liệu bán hàng, tài chính và vận hành thành một nguồn thống nhất.",
        "Số hóa quy trình đầu–cuối, giảm thao tác thủ công và sai sót.",
        "Kích hoạt AI Agent trên dữ liệu và nghiệp vụ thực tế của doanh nghiệp.",
      ] },
      { type: "image", src: "/images/backgrounds/home/hero-ecosystem.webp", alt: "Hệ sinh thái sản phẩm XTECH trên nền tảng dùng chung", caption: "Các sản phẩm liên thông trên nền tảng dữ liệu, API và AI dùng chung." },
      { type: "h2", text: "Hướng tới triển khai có kiểm soát" },
      { type: "p", text: "Đại diện XTECH cho biết định hướng của công ty là giúp khách hàng chuyển đổi số theo lộ trình có kiểm soát: tạo giá trị sớm ở từng giai đoạn thay vì chờ một dự án lớn hoàn tất, đồng thời kiểm soát rủi ro và chi phí. Trong thời gian tới, XTECH sẽ tiếp tục mở rộng năng lực AI và công bố thêm các câu chuyện triển khai thực tế cùng khách hàng." },
    ],
  },
  {
    slug: "5-xu-huong-chuyen-doi-so-cho-chu-dau-tu-bat-dong-san",
    title: "5 xu hướng chuyển đổi số nổi bật cho chủ đầu tư bất động sản",
    excerpt: "Từ dữ liệu bán hàng hợp nhất đến AI hỗ trợ vận hành — những xu hướng đang định hình cách chủ đầu tư số hóa toàn bộ hành trình.",
    categorySlug: "bat-dong-san-so", tags: ["Bất động sản", "CRM"], relatedProducts: ["xbooking", "xbuilding"],
    featured: true, publishedAt: "2026-07-12", readTime: "7 phút", author: "Đội ngũ XTECH",
    cover: "/products/xbooking/xbk-09-inventory-matrix.png",
    body: [
      { type: "p", text: "Chuyển đổi số trong bất động sản không còn là một lựa chọn 'để sau' — nó đã trở thành yếu tố cạnh tranh trực tiếp giữa các chủ đầu tư. Dưới đây là năm xu hướng đang định hình cách các doanh nghiệp dẫn đầu số hóa toàn bộ hành trình, từ lúc thu hút khách đến khi vận hành tòa nhà." },
      { type: "h2", text: "1. Hợp nhất dữ liệu bán hàng" },
      { type: "p", text: "Lead, bảng hàng, giao dịch và hợp đồng được đưa về một nguồn duy nhất, thay cho những file rời rạc giữa các đội. Đây thường là bước tạo giá trị nhanh nhất và là nền cho mọi phân tích về sau." },
      { type: "h2", text: "2. Liên thông trước – sau bán" },
      { type: "p", text: "Dữ liệu không dừng ở lúc ký hợp đồng: nó nối tiếp sang tài chính, bàn giao và vận hành, tạo thành một hành trình khách hàng liền mạch thay vì đứt gãy giữa các phòng ban." },
      { type: "image", src: "/products/xbooking/xbk-07-sales-pipeline.png", alt: "Pipeline bán hàng bất động sản", caption: "Theo dõi cơ hội và dự báo doanh số trên dữ liệu bán hàng hợp nhất." },
      { type: "h2", text: "3. AI hỗ trợ vận hành" },
      { type: "p", text: "AI bắt đầu tham gia vào các tác vụ lặp lại: dự báo nhu cầu, cảnh báo công nợ, tổng hợp báo cáo và hỗ trợ chăm sóc khách hàng — giải phóng nhân sự cho phần việc cần phán đoán." },
      { type: "h2", text: "4. Trải nghiệm khách hàng số" },
      { type: "p", text: "App cư dân, thanh toán trực tuyến và kênh chăm sóc số đang trở thành tiêu chuẩn kỳ vọng — đặc biệt với thế hệ khách hàng trẻ." },
      { type: "h2", text: "5. Ra quyết định thời gian thực" },
      { type: "p", text: "Dashboard điều hành trên dữ liệu cập nhật cho phép ban lãnh đạo phản ứng nhanh với thị trường, thay vì chờ báo cáo cuối tháng. Chủ đầu tư nên ưu tiên xu hướng tạo giá trị nhanh nhất — thường là hợp nhất dữ liệu bán hàng — rồi mở rộng theo lộ trình có kiểm soát." },
    ],
  },
  {
    slug: "du-lieu-hop-nhat-rut-ngan-thoi-gian-ra-quyet-dinh",
    title: "Dữ liệu hợp nhất giúp doanh nghiệp rút ngắn thời gian ra quyết định",
    excerpt: "Khi dữ liệu từ bán hàng, tài chính và vận hành được kết nối, lãnh đạo có bức tranh thời gian thực để quyết định nhanh và chính xác hơn.",
    categorySlug: "du-lieu-tich-hop", tags: ["Dữ liệu", "Vận hành"], relatedProducts: ["x-ai", "finerp"],
    publishedAt: "2026-07-09", readTime: "6 phút", author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-04-executive-reporting-ai.png",
    body: [
      { type: "p", text: "Trong nhiều doanh nghiệp, thời gian dài nhất của một quyết định không nằm ở lúc cân nhắc, mà ở lúc… chờ số liệu. Mỗi phòng ban giữ một 'ốc đảo' dữ liệu riêng, và việc tổng hợp thủ công từ nhiều nguồn vừa chậm vừa dễ sai." },
      { type: "h2", text: "Từ nhiều 'sự thật' về một sự thật" },
      { type: "p", text: "Khi dữ liệu bán hàng, tài chính và vận hành được kết nối về một nền tảng và chuẩn hóa cách tính, mọi báo cáo trở nên nhất quán. Lãnh đạo không còn mất thời gian đối chiếu 'số của ai đúng', mà tập trung vào việc quan trọng hơn: quyết định." },
      { type: "image", src: "/products/xai/xai-04-executive-reporting-ai.png", alt: "Báo cáo điều hành do AI tổng hợp", caption: "Báo cáo điều hành tổng hợp đa nguồn, cập nhật theo thời gian thực." },
      { type: "h2", text: "Ba lợi ích cụ thể" },
      { type: "list", items: [
        "Bức tranh điều hành thời gian thực, thay cho báo cáo tổng hợp cuối kỳ.",
        "Cảnh báo sớm khi chỉ số vượt ngưỡng, để can thiệp kịp thời.",
        "Nền tảng dữ liệu sạch làm bệ phóng cho phân tích và AI phía sau.",
      ] },
      { type: "p", text: "Trong một thị trường biến động nhanh, tốc độ ra quyết định trở thành lợi thế cạnh tranh — và nó bắt đầu từ dữ liệu liên thông, chứ không phải từ thêm một báo cáo." },
    ],
  },
  {
    slug: "tu-dong-hoa-quy-trinh-noi-bo-voi-workflow-va-ai-agent",
    title: "Tự động hóa quy trình nội bộ với workflow và AI agent",
    excerpt: "Kết hợp workflow, RPA và AI agent giúp giảm thao tác thủ công, tăng tốc phê duyệt và nâng cao hiệu suất vận hành doanh nghiệp.",
    categorySlug: "tu-dong-hoa", tags: ["Tự động hóa", "AI"], relatedProducts: ["x-ai", "x-space"],
    publishedAt: "2026-07-06", readTime: "6 phút", author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-19-workflow-automation-studio.png",
    body: [
      { type: "p", text: "Bạn thử tính xem đội ngũ của mình mất bao nhiêu giờ mỗi tuần cho những việc lặp lại: nhập liệu, tổng hợp bảng biểu, chuyển hồ sơ đi trình ký. Với nhiều doanh nghiệp, con số đó đủ lớn để trở thành một 'phòng ban vô hình' chỉ làm việc thủ công." },
      { type: "p", text: "Tự động hóa hiện đại không phải một công nghệ đơn lẻ, mà là sự phối hợp của ba lớp bổ trợ nhau — và hiểu đúng vai trò từng lớp là chìa khóa để triển khai hiệu quả." },
      { type: "h2", text: "Ba lớp của tự động hóa" },
      { type: "list", items: [
        "Workflow: chuẩn hóa và điều phối quy trình, luồng phê duyệt đa cấp.",
        "RPA: thay thao tác lặp lại trên các hệ thống không có API.",
        "AI Agent: hiểu ngữ cảnh, soạn nội dung và ra quyết định trong phạm vi cho phép.",
      ] },
      { type: "image", src: "/products/xai/xai-19-workflow-automation-studio.png", alt: "Workflow Automation Studio", caption: "Thiết kế luồng tự động hóa nghiệp vụ trực quan, có kiểm soát." },
      { type: "h2", text: "Bắt đầu từ đâu để không thất bại" },
      { type: "p", text: "Kinh nghiệm cho thấy nên ưu tiên tự động hóa các quy trình có bước rõ ràng, khối lượng lớn và ít ngoại lệ — ví dụ phê duyệt chi, xử lý chứng từ, nhắc việc. Khi những quy trình này đã chạy ổn và tạo niềm tin, hãy mở rộng dần sang các quy trình phức tạp hơn, với con người giám sát ở điểm quan trọng." },
      { type: "quote", text: "Tự động hóa tốt không thay thế con người, mà trả lại cho con người thời gian cho việc quan trọng." },
    ],
  },
  {
    slug: "xbooking-toi-uu-hanh-trinh-ban-hang-va-cham-soc-khach-hang",
    title: "XBooking tối ưu hành trình bán hàng và chăm sóc khách hàng",
    excerpt: "Từ marketing, lead, bảng hàng đến booking và chăm sóc — XBooking hợp nhất dữ liệu khách hàng trên một quy trình khép kín.",
    categorySlug: "bat-dong-san-so", tags: ["XBooking", "CRM", "Khách hàng"], relatedProducts: ["xbooking"],
    featured: true, publishedAt: "2026-07-03", readTime: "5 phút", author: "Đội ngũ XTECH",
    cover: "/products/xbooking/xbk-07-sales-pipeline.png",
    body: [
      { type: "p", text: "Bán hàng bất động sản là một hành trình dài với nhiều điểm chạm — và cũng nhiều điểm dễ đánh rơi khách. Khi mỗi giai đoạn dùng một công cụ riêng, dữ liệu đứt gãy, đội sales mất dấu khách, còn ban lãnh đạo thiếu bức tranh tổng thể. XBooking sinh ra để hợp nhất toàn bộ hành trình đó trên một quy trình khép kín." },
      { type: "h2", text: "Khép kín từ lead đến chăm sóc" },
      { type: "list", items: [
        "Thu lead đa nguồn, chấm điểm và phân bổ tự động cho đội sales.",
        "Bảng hàng thời gian thực, giữ chỗ và lock cọc tránh trùng bán.",
        "Hợp đồng, thanh toán theo tiến độ và chăm sóc sau bán trên một trục.",
      ] },
      { type: "image", src: "/products/xbooking/xbk-07-sales-pipeline.png", alt: "Sales pipeline của XBooking", caption: "Theo dõi cơ hội qua từng giai đoạn và dự báo doanh số." },
      { type: "p", text: "Nhờ dữ liệu liên thông, đội sales tư vấn nhanh và chính xác hơn, còn ban lãnh đạo nắm được bức tranh bán hàng theo thời gian thực để điều hành. Quan trọng hơn, mỗi khách hàng được chăm sóc tốt sẽ quay lại và giới thiệu — biến chi phí bán hàng hôm nay thành nguồn khách của ngày mai." },
    ],
  },
  {
    slug: "finerp-kiem-soat-tai-chinh-va-van-hanh-theo-thoi-gian-thuc",
    title: "FinERP giúp doanh nghiệp kiểm soát tài chính và vận hành theo thời gian thực",
    excerpt: "Kế toán, dòng tiền, ngân sách và công nợ trên một nền tảng — cùng dashboard điều hành và AI hỗ trợ dự báo tài chính.",
    categorySlug: "chuyen-doi-so", tags: ["FinERP", "ERP", "Dữ liệu"], relatedProducts: ["finerp", "x-ai"],
    publishedAt: "2026-06-30", readTime: "6 phút", author: "Đội ngũ XTECH",
    cover: "/products/finerp/ferp-03-cashflow.png",
    body: [
      { type: "p", text: "Với nhiều doanh nghiệp, câu hỏi 'tháng này lãi hay lỗ' chỉ có câu trả lời chắc chắn vào… cuối quý, sau khi kế toán chốt sổ. Trong khi đó, các quyết định quan trọng lại phải đưa ra mỗi ngày. Khoảng trễ này là rủi ro — và là điều FinERP được thiết kế để xóa bỏ." },
      { type: "h2", text: "Hợp nhất tài chính – vận hành" },
      { type: "p", text: "FinERP đưa kế toán, dòng tiền, công nợ và ngân sách về một nền tảng, đồng thời gắn chúng với mua hàng, kho, tài sản và chi phí dự án. Khi mọi nghiệp vụ chảy về cùng một nguồn, bức tranh tài chính hiện lên theo thời gian thực thay vì sau khi tổng hợp thủ công." },
      { type: "list", items: [
        "Kế toán, dòng tiền, công nợ và ngân sách liên thông trên một nền tảng.",
        "Mua hàng, kho, tài sản và chi phí dự án gắn với dữ liệu tài chính.",
        "Dashboard điều hành và cảnh báo vượt ngân sách, đến hạn, quá hạn.",
      ] },
      { type: "image", src: "/products/finerp/ferp-03-cashflow.png", alt: "Kiểm soát dòng tiền và công nợ trên FinERP", caption: "Chủ động dòng tiền: biết trước khi nào thiếu hụt để xoay xở kịp." },
      { type: "h2", text: "AI hỗ trợ dự báo và điều hành" },
      { type: "p", text: "Trên nền dữ liệu tài chính liên thông, AI có thể tổng hợp báo cáo, dự báo dòng tiền và cảnh báo rủi ro trước khi chúng thành vấn đề — giúp lãnh đạo chuyển từ thế bị động sang chủ động. Kiểm soát tài chính theo thời gian thực, suy cho cùng, là nền tảng của mọi quyết định điều hành vững vàng." },
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
