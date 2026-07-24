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
  cover?: string;
  body?: ArticleBlock[];
};

export const insightCategories: InsightCategory[] = [
  { slug: "chuyen-doi-so", title: "Chuyển đổi số", description: "Chiến lược, kiến trúc và lộ trình chuyển đổi số cho doanh nghiệp.", icon: "transformation" },
  { slug: "ai-doanh-nghiep", title: "AI doanh nghiệp", description: "AI Agent, Knowledge & RAG, quản trị và triển khai AI trong doanh nghiệp.", icon: "ai" },
  { slug: "du-lieu", title: "Dữ liệu", description: "Data platform, tích hợp, chất lượng dữ liệu và phân tích điều hành.", icon: "data" },
  { slug: "proptech", title: "PropTech", description: "Công nghệ cho chủ đầu tư, bán hàng bất động sản và vận hành tòa nhà.", icon: "xbuilding" },
];

export const insightArticles: InsightArticle[] = [
  {
    slug: "xay-dung-lo-trinh-chuyen-doi-so-theo-giai-doan",
    title: "Xây dựng lộ trình chuyển đổi số theo từng giai đoạn",
    summary: "Cách xác định bài toán ưu tiên, thiết kế kiến trúc nền tảng và mở rộng chuyển đổi số có kiểm soát — tạo giá trị sớm mà không vỡ trận khi scale.",
    categorySlug: "chuyen-doi-so",
    tags: ["chiến lược", "roadmap", "kiến trúc"],
    featured: true,
    relatedProducts: ["finerp", "x-space", "x-ai"],
    relatedSolutions: ["chuyen-doi-so"],
    publishedAt: "2026-07-14",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/images/editorial/trien-khai.png",
    body: [
      { type: "p", text: "Chuyển đổi số hiệu quả bắt đầu từ bài toán kinh doanh, không phải từ công nghệ. Phần lớn dự án thất bại không vì chọn sai công cụ, mà vì làm dàn trải, thiếu ưu tiên và không có nền tảng chung. Một lộ trình theo giai đoạn giúp doanh nghiệp tạo giá trị sớm, kiểm soát rủi ro và giữ được sự liên thông khi mở rộng." },
      { type: "h2", text: "Bắt đầu từ bài toán ưu tiên, không phải công nghệ" },
      { type: "p", text: "Hãy chọn một đến hai bài toán vừa có tác động lớn vừa khả thi để bắt đầu, thay vì số hóa mọi thứ cùng lúc. Ưu tiên các quy trình lặp lại nhiều, tốn nhân lực và có dữ liệu rõ ràng — ví dụ tổng hợp báo cáo tài chính, quản lý công nợ hay chăm sóc khách hàng. Kết quả đo được ở giai đoạn đầu là 'vốn' để thuyết phục tổ chức đầu tư cho các bước sau." },
      { type: "image", src: "/products/finerp/ferp-02-finance.png", alt: "Dashboard điều hành tài chính", caption: "Một màn hình điều hành hợp nhất thay cho hàng chục báo cáo rời rạc." },
      { type: "h2", text: "Thiết kế kiến trúc nền tảng ngay từ đầu" },
      { type: "p", text: "Sai lầm phổ biến là mỗi phòng ban tự mua một phần mềm, tạo ra các 'ốc đảo' dữ liệu không nói chuyện được với nhau. Ngay từ giai đoạn đầu, hãy thiết kế tầng dữ liệu, tích hợp (API) và định danh dùng chung. Khi nền tảng đã chuẩn, mỗi bước mở rộng chỉ là bổ sung, không phải làm lại." },
      { type: "h2", text: "Ba giai đoạn triển khai có kiểm soát" },
      { type: "list", items: [
        "Giai đoạn 1 — Số hóa & chuẩn hóa: đưa bài toán ưu tiên lên hệ thống, làm sạch và chuẩn hóa dữ liệu gốc.",
        "Giai đoạn 2 — Tích hợp & mở rộng: kết nối các hệ thống, liên thông quy trình end-to-end giữa các phòng ban.",
        "Giai đoạn 3 — Phân tích & AI: kích hoạt báo cáo điều hành, dự báo và AI Agent trên nền dữ liệu đã liên thông.",
      ] },
      { type: "quote", text: "Chuyển đổi số không phải một dự án có ngày kết thúc, mà là năng lực vận hành liên tục của doanh nghiệp.", cite: "Đội ngũ tư vấn XTECH" },
      { type: "p", text: "Với cách tiếp cận theo giai đoạn, doanh nghiệp vừa thấy kết quả trong vài tháng đầu, vừa xây được nền tảng đủ vững để đi đường dài. Đây cũng là cách XTECH đồng hành cùng khách hàng: bắt đầu gọn, chuẩn hóa nền tảng, rồi mở rộng theo mức độ sẵn sàng." },
    ],
  },
  {
    slug: "tu-pilot-ai-den-ai-van-hanh-thuc-te",
    title: "Từ pilot AI đến AI vận hành thực tế trong doanh nghiệp",
    summary: "Những điều kiện cần để AI vượt qua giai đoạn thử nghiệm và tạo ra giá trị bền vững trong quy trình nghiệp vụ thực.",
    categorySlug: "ai-doanh-nghiep",
    tags: ["AI Agent", "RAG", "governance"],
    featured: true,
    relatedProducts: ["x-ai"],
    publishedAt: "2026-07-11",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-06-ai-workflow-assistant.png",
    body: [
      { type: "p", text: "Rất nhiều doanh nghiệp đã thử AI: một chatbot demo ấn tượng, một bản POC chạy tốt trong phòng họp. Nhưng phần lớn dừng lại ở đó. Khoảng cách giữa 'AI trình diễn' và 'AI vận hành' nằm ở dữ liệu, quy trình và quản trị — chứ không phải model." },
      { type: "h2", text: "Vì sao pilot AI hay dừng lại?" },
      { type: "p", text: "Pilot thường chạy trên dữ liệu chọn lọc, phạm vi hẹp và không có ràng buộc thật. Khi đưa vào vận hành, AI gặp dữ liệu bẩn, câu hỏi ngoài phạm vi, yêu cầu phân quyền và trách nhiệm giải trình. Nếu thiếu nền tảng cho những điều đó, kết quả sẽ thiếu tin cậy và nhanh chóng bị bỏ." },
      { type: "image", src: "/products/xai/xai-05-knowledge-search-qa.png", alt: "Knowledge Search và Q&A theo RAG", caption: "RAG trả lời theo tri thức nội bộ kèm trích dẫn nguồn để kiểm chứng." },
      { type: "h2", text: "Bốn điều kiện để AI đi vào vận hành" },
      { type: "list", items: [
        "Dữ liệu được tổ chức, gắn ngữ cảnh và phân quyền rõ ràng (nền tảng RAG).",
        "Quy trình nghiệp vụ được chuẩn hóa để AI can thiệp đúng điểm, đúng lúc.",
        "Cơ chế giám sát, kiểm toán và guardrails cho mọi đầu ra của AI.",
        "Con người trong vòng lặp (human-in-the-loop) ở các quyết định quan trọng.",
      ] },
      { type: "h2", text: "Mở rộng theo mức độ tin cậy" },
      { type: "p", text: "Đừng trao toàn quyền cho AI ngay. Bắt đầu ở chế độ 'gợi ý' để con người duyệt, đo độ chính xác, rồi mới nâng dần lên 'tự động hóa' cho các tác vụ đã đủ tin cậy. Mức độ tự chủ của AI nên tỉ lệ thuận với dữ liệu vận hành và guardrails đã kiểm chứng." },
      { type: "quote", text: "AI tạo giá trị bền vững khi được kết nối với dữ liệu đáng tin cậy, quy trình rõ ràng và trách nhiệm của con người." },
      { type: "p", text: "Đây là triết lý đằng sau X.AI: không chỉ cung cấp agent, mà cung cấp cả lớp tri thức, tự động hóa và quản trị để AI thực sự vận hành được trong doanh nghiệp." },
    ],
  },
  {
    slug: "nen-tang-du-lieu-thong-nhat-cho-doanh-nghiep",
    title: "Nền tảng dữ liệu thống nhất cho doanh nghiệp",
    summary: "Tổ chức dữ liệu, tích hợp và phân quyền truy cập để phục vụ báo cáo điều hành và AI — biến dữ liệu rời rạc thành tài sản dùng được.",
    categorySlug: "du-lieu",
    tags: ["data platform", "integration", "analytics"],
    relatedProducts: ["x-ai", "finerp"],
    publishedAt: "2026-07-08",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-04-executive-reporting-ai.png",
    body: [
      { type: "p", text: "Dữ liệu là nền móng của mọi sáng kiến số — nhưng ở nhiều doanh nghiệp, dữ liệu nằm rải rác trong hàng chục hệ thống, mỗi nơi một định dạng, một 'sự thật' khác nhau. Một nền tảng dữ liệu thống nhất giúp báo cáo nhất quán, quyết định nhanh và AI trả lời đáng tin." },
      { type: "h2", text: "Một nguồn sự thật duy nhất" },
      { type: "p", text: "Thay vì mỗi phòng ban tự tổng hợp số liệu theo cách riêng, dữ liệu được gom về một nền tảng chung, chuẩn hóa định nghĩa (một chỉ số chỉ có một cách tính). Điều này chấm dứt tình trạng các cuộc họp tranh cãi 'số của ai đúng'." },
      { type: "h2", text: "Bốn lớp của nền tảng dữ liệu" },
      { type: "list", items: [
        "Thu thập & tích hợp: kết nối ERP, CRM, hệ thống vận hành qua API và event.",
        "Chuẩn hóa & chất lượng: làm sạch, khử trùng lặp, gắn ngữ cảnh và metadata.",
        "Phân quyền & bảo mật: kiểm soát ai xem được gì, bảo vệ dữ liệu nhạy cảm.",
        "Khai thác: báo cáo điều hành, phân tích tự phục vụ và cấp dữ liệu cho AI/RAG.",
      ] },
      { type: "image", src: "/products/finerp/ferp-02-finance.png", alt: "Báo cáo điều hành trên dữ liệu hợp nhất", caption: "Dữ liệu liên thông cho báo cáo điều hành theo thời gian thực." },
      { type: "h2", text: "Dữ liệu tốt là điều kiện tiên quyết của AI" },
      { type: "p", text: "Không có dữ liệu sạch và có ngữ cảnh, AI chỉ tạo ra câu trả lời nghe hợp lý nhưng sai. Đầu tư vào nền tảng dữ liệu chính là đầu tư cho mọi sáng kiến AI phía sau — đây là bước không thể bỏ qua trên hành trình chuyển đổi số." },
      { type: "quote", text: "Chất lượng của AI không vượt quá chất lượng của dữ liệu nuôi nó." },
    ],
  },
  {
    slug: "hanh-trinh-so-cho-chu-dau-tu-bat-dong-san",
    title: "Hành trình số cho chủ đầu tư bất động sản",
    summary: "Liên thông marketing, bảng hàng, booking, hợp đồng, thanh toán, bàn giao và vận hành — một dòng chảy khép kín thay cho các phần mềm rời rạc.",
    categorySlug: "proptech",
    tags: ["bất động sản", "booking", "customer journey"],
    featured: true,
    relatedProducts: ["xbooking", "finerp", "xbuilding"],
    publishedAt: "2026-07-05",
    readTime: "8 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xbooking/xbk-09-inventory-matrix.png",
    body: [
      { type: "p", text: "Với chủ đầu tư bất động sản, mỗi khách hàng đi qua một hành trình dài: từ lúc biết đến dự án, được tư vấn, đặt chỗ, ký hợp đồng, thanh toán theo tiến độ, nhận bàn giao rồi trở thành cư dân. Khi mỗi giai đoạn dùng một phần mềm riêng, dữ liệu đứt gãy và trải nghiệm khách hàng rời rạc." },
      { type: "h2", text: "Marketing và thu lead đa nguồn" },
      { type: "p", text: "Hành trình bắt đầu từ việc gom lead từ mọi kênh — website, mạng xã hội, hotline, sàn — về một đầu mối, chuẩn hóa và chống trùng ngay từ đầu. Lead được chấm điểm và phân bổ tự động để đội sales tập trung vào cơ hội tiềm năng nhất." },
      { type: "image", src: "/products/xbooking/xbk-07-sales-pipeline.png", alt: "Sales pipeline quản lý cơ hội", caption: "Theo dõi cơ hội qua từng giai đoạn và dự báo doanh số sát thực tế." },
      { type: "h2", text: "Bảng hàng, booking và hợp đồng khép kín" },
      { type: "list", items: [
        "Bảng hàng thời gian thực: toàn cảnh quỹ hàng theo dự án, tòa, tầng và trạng thái căn.",
        "Giữ chỗ & lock cọc: có thời hạn rõ ràng, tránh trùng bán và tranh chấp.",
        "Hợp đồng & thanh toán: theo dõi tiến độ từng đợt, cảnh báo đến hạn và quá hạn.",
      ] },
      { type: "h2", text: "Từ giao dịch đến vận hành và tái mua" },
      { type: "p", text: "Khi bàn giao, dữ liệu khách hàng chuyển tiếp sang hệ thống vận hành tòa nhà: cư dân, phí dịch vụ, phản ánh, bảo trì. Khách hàng được chăm sóc tốt sẽ quay lại và giới thiệu — tạo dòng lead mới, khép kín vòng đời." },
      { type: "quote", text: "Lợi thế cạnh tranh không đến từ một phần mềm, mà từ sự liên thông của toàn bộ hành trình khách hàng." },
      { type: "p", text: "Đây là lý do hệ sinh thái XBooking, FinERP và XBuilding được thiết kế để liên thông trên nền tảng dùng chung — dữ liệu đi suốt từ lead đến cư dân." },
    ],
  },
  {
    slug: "integration-hub-ket-noi-he-thong-hien-huu",
    title: "Integration Hub cho hệ sinh thái hệ thống hiện hữu",
    summary: "Vai trò của API Gateway, Event Bus và workflow trong việc kết nối các hệ thống cũ và mới mà không phải làm lại từ đầu.",
    categorySlug: "du-lieu",
    tags: ["API", "event bus", "integration"],
    relatedSolutions: ["tich-hop-he-thong"],
    relatedProducts: ["x-ai"],
    publishedAt: "2026-07-02",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-20-tool-api-connector-center.png",
    body: [
      { type: "p", text: "Ít doanh nghiệp có thể vứt bỏ toàn bộ hệ thống cũ để làm lại. Bài toán thực tế là kết nối cái đang có (ERP, kế toán, phần mềm chuyên ngành) với cái mới — một cách an toàn và có kiểm soát. Integration Hub là lớp trung gian giải bài toán đó." },
      { type: "h2", text: "Ba thành phần cốt lõi" },
      { type: "list", items: [
        "API Gateway: một cửa ngõ chuẩn hóa, bảo mật và giám sát mọi lời gọi giữa các hệ thống.",
        "Event Bus: cho phép hệ thống 'phát' và 'lắng nghe' sự kiện, giảm phụ thuộc trực tiếp.",
        "Workflow Engine: điều phối quy trình đa hệ thống, xử lý ngoại lệ và phê duyệt.",
      ] },
      { type: "h2", text: "Vì sao nên tách lớp tích hợp?" },
      { type: "p", text: "Khi các hệ thống gọi thẳng vào nhau, mỗi thay đổi ở một nơi kéo theo rủi ro ở mọi nơi. Một lớp tích hợp riêng giúp thay thế, nâng cấp từng hệ thống mà không phá vỡ phần còn lại — đồng thời tạo điểm tập trung để giám sát, bảo mật và ghi log." },
      { type: "image", src: "/images/backgrounds/home/hero-ecosystem.webp", alt: "Hệ sinh thái kết nối trên nền tảng dùng chung", caption: "Nền tảng dùng chung kết nối dữ liệu, API và workflow xuyên sản phẩm." },
      { type: "p", text: "Với lớp tích hợp vững, doanh nghiệp vừa bảo vệ được khoản đầu tư vào hệ thống cũ, vừa mở đường cho dữ liệu liên thông và AI khai thác về sau." },
    ],
  },
  {
    slug: "quan-tri-ai-an-toan-trong-doanh-nghiep",
    title: "Quản trị AI an toàn trong doanh nghiệp",
    summary: "Phân quyền, audit, guardrails và bảo vệ dữ liệu khi triển khai AI Agent — để AI mạnh mẽ nhưng vẫn trong tầm kiểm soát.",
    categorySlug: "ai-doanh-nghiep",
    tags: ["governance", "security", "AI Agent"],
    relatedProducts: ["x-ai"],
    publishedAt: "2026-06-28",
    readTime: "5 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-14-ai-governance-guardrails.png",
    body: [
      { type: "p", text: "Càng trao cho AI nhiều quyền hành động, rủi ro càng lớn nếu thiếu kiểm soát: rò rỉ dữ liệu nhạy cảm, câu trả lời sai lệch, hành động ngoài phạm vi. Quản trị AI không phải rào cản — mà là điều kiện để doanh nghiệp dám mở rộng AI." },
      { type: "h2", text: "Guardrails: ranh giới cho AI" },
      { type: "p", text: "Guardrails xác định AI được làm gì, không được làm gì, và phải chuyển cho con người khi nào. Chúng bao gồm giới hạn phạm vi dữ liệu, quy tắc nội dung, và các bước phê duyệt bắt buộc trước những hành động có tác động lớn." },
      { type: "h2", text: "Bốn trụ cột của quản trị AI" },
      { type: "list", items: [
        "Phân quyền dữ liệu: AI chỉ truy cập và trả lời trong phạm vi người dùng được phép.",
        "Bảo vệ dữ liệu & PII: che và kiểm soát thông tin nhạy cảm trong mọi luồng xử lý.",
        "Observability & audit: truy vết mọi bước để gỡ lỗi và giải trình khi cần.",
        "Chống 'ảo giác': đo mức bám nguồn, phát hiện câu trả lời bịa và cảnh báo.",
      ] },
      { type: "image", src: "/products/xai/xai-25-ai-security-operations-center.png", alt: "Trung tâm giám sát an ninh AI", caption: "Giám sát tập trung mọi hoạt động AI, phát hiện và xử lý rủi ro kịp thời." },
      { type: "quote", text: "AI đáng tin không phải AI mạnh nhất, mà là AI minh bạch, kiểm soát được và truy vết được." },
      { type: "p", text: "Lớp quản trị này được tích hợp sẵn trong X.AI, giúp doanh nghiệp triển khai AI Agent với sự tự tin về an toàn và tuân thủ." },
    ],
  },
  {
    slug: "mo-hinh-saas-private-cloud-on-premise-hybrid",
    title: "Chọn SaaS, Private Cloud, On-premise hay Hybrid",
    summary: "So sánh các mô hình triển khai theo tốc độ, quyền kiểm soát dữ liệu, khả năng tùy chỉnh và chi phí vận hành để chọn đúng cho doanh nghiệp.",
    categorySlug: "chuyen-doi-so",
    tags: ["cloud", "on-premise", "hybrid"],
    relatedProducts: ["x-space", "finerp"],
    publishedAt: "2026-06-24",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/images/backgrounds/home/hero-ecosystem.webp",
    body: [
      { type: "p", text: "Không có mô hình triển khai 'tốt nhất' cho mọi doanh nghiệp — chỉ có mô hình phù hợp nhất với yêu cầu về dữ liệu, tốc độ và nguồn lực. Hiểu rõ ưu nhược điểm của từng lựa chọn giúp tránh những quyết định tốn kém khó đảo ngược." },
      { type: "h2", text: "Bốn mô hình phổ biến" },
      { type: "list", items: [
        "SaaS: triển khai nhanh, chi phí ban đầu thấp, nhà cung cấp lo hạ tầng — phù hợp phần lớn nghiệp vụ chuẩn.",
        "Private Cloud: kiểm soát dữ liệu cao hơn, vẫn linh hoạt về hạ tầng — hợp với dữ liệu nhạy cảm.",
        "On-premise: toàn quyền kiểm soát, đáp ứng yêu cầu tuân thủ chặt — đổi lại chi phí và vận hành cao.",
        "Hybrid: kết hợp, đặt dữ liệu nhạy cảm on-premise và tận dụng cloud cho phần còn lại.",
      ] },
      { type: "h2", text: "Bốn tiêu chí để quyết định" },
      { type: "p", text: "Hãy cân nhắc: (1) yêu cầu pháp lý và độ nhạy cảm của dữ liệu; (2) tốc độ cần đưa vào sử dụng; (3) mức độ tùy chỉnh nghiệp vụ; (4) năng lực và chi phí vận hành nội bộ. Trọng số của bốn tiêu chí này quyết định lựa chọn." },
      { type: "quote", text: "Chọn mô hình triển khai là bài toán đánh đổi giữa kiểm soát và tốc độ — hãy chọn theo ưu tiên thực của doanh nghiệp." },
      { type: "p", text: "Các sản phẩm của XTECH hỗ trợ nhiều mô hình triển khai, cho phép doanh nghiệp bắt đầu nhanh với SaaS rồi chuyển dịch khi nhu cầu thay đổi." },
    ],
  },
  {
    slug: "smart-building-tu-quan-ly-den-van-hanh-thong-minh",
    title: "Smart Building: từ quản lý đến vận hành thông minh",
    summary: "Kết nối cư dân, dịch vụ, thiết bị, bảo trì, IoT và AI trong vận hành tòa nhà — nâng trải nghiệm cư dân và tối ưu chi phí.",
    categorySlug: "proptech",
    tags: ["smart building", "IoT", "vận hành"],
    relatedProducts: ["xbuilding", "x-ai"],
    publishedAt: "2026-06-20",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xbuilding/xbl-10-smart-building-command-center.png",
    body: [
      { type: "p", text: "Quản lý tòa nhà truyền thống nặng về giấy tờ, phản ứng bị động và tách rời giữa ban quản lý với cư dân. Smart Building chuyển vận hành sang chủ động, dựa trên dữ liệu và kết nối — vừa nâng trải nghiệm cư dân, vừa giảm chi phí." },
      { type: "h2", text: "Số hóa vận hành hằng ngày" },
      { type: "p", text: "Phí dịch vụ được tính và thu tự động đa kênh; phản ánh của cư dân đi qua quy trình có SLA rõ ràng; công việc của ban quản lý được giao và theo dõi minh bạch. Cư dân tự phục vụ ngay trên ứng dụng, giảm tải cho quầy lễ tân." },
      { type: "image", src: "/products/xbuilding/xbl-12-energy-utility-monitoring.png", alt: "Giám sát năng lượng và tiện ích IoT", caption: "Giám sát tiêu thụ điện, nước theo dữ liệu thật để tối ưu chi phí." },
      { type: "h2", text: "IoT và AI cho vận hành chủ động" },
      { type: "list", items: [
        "Command center: giám sát tập trung toàn bộ hệ thống kỹ thuật theo thời gian thực.",
        "IoT & năng lượng: phát hiện tiêu thụ bất thường, tối ưu chi phí vận hành.",
        "Bảo trì phòng ngừa: lên lịch theo vòng đời tài sản, tránh sự cố gây gián đoạn.",
        "An ninh thông minh: kiểm soát ra vào, nhận diện và bãi đỗ xe gắn với hồ sơ cư dân.",
      ] },
      { type: "quote", text: "Tòa nhà thông minh không phải tòa nhà nhiều cảm biến, mà là tòa nhà ra quyết định tốt hơn nhờ dữ liệu." },
      { type: "p", text: "XBuilding kết hợp vận hành, IoT và AI copilot để ban quản lý làm chủ tòa nhà — chủ động thay vì chạy theo sự cố." },
    ],
  },
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
