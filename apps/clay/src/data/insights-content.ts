/**
 * SET C07 — Insights (/insights). Bài viết biên tập của XTECH: mỗi bài có bố cục
 * riêng (không rập khuôn), độ dài tự nhiên, ảnh minh họa từ kho asset dự án.
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
    summary: "Vì sao nhiều dự án chuyển đổi số 'chết yểu', và cách một lộ trình theo giai đoạn giúp doanh nghiệp tạo giá trị sớm mà không vỡ trận khi mở rộng.",
    categorySlug: "chuyen-doi-so",
    tags: ["chiến lược", "roadmap", "kiến trúc"],
    featured: true,
    relatedProducts: ["finerp", "x-space", "x-ai"],
    relatedSolutions: ["chuyen-doi-so"],
    publishedAt: "2026-07-14",
    readTime: "8 phút",
    author: "Đội ngũ XTECH",
    cover: "/images/editorial/trien-khai.png",
    body: [
      { type: "p", text: "Một giám đốc điều hành từng nói với chúng tôi: 'Chúng tôi đã chi cả tỷ đồng cho phần mềm, nhưng nhân viên vẫn xuất báo cáo bằng Excel.' Câu chuyện đó không hiếm. Phần lớn dự án chuyển đổi số không thất bại vì chọn sai công nghệ, mà vì làm dàn trải, thiếu ưu tiên và không có nền tảng chung để mọi thứ kết nối với nhau." },
      { type: "p", text: "Chuyển đổi số hiệu quả bắt đầu từ bài toán kinh doanh, không phải từ danh sách tính năng. Và cách an toàn nhất để đi là chia thành từng giai đoạn có mục tiêu rõ ràng — mỗi giai đoạn tạo ra giá trị đo được, đồng thời đặt nền cho giai đoạn kế tiếp." },
      { type: "h2", text: "Bắt đầu từ một bài toán, không phải mười" },
      { type: "p", text: "Sai lầm thường gặp là muốn số hóa mọi thứ cùng lúc. Kết quả là nguồn lực bị xé nhỏ, không dự án nào đủ sâu để tạo tác động, và tổ chức nhanh chóng mất niềm tin." },
      { type: "p", text: "Thay vào đó, hãy chọn một đến hai bài toán vừa có tác động lớn vừa khả thi: thường là những quy trình lặp lại nhiều, tốn nhân lực và đã có sẵn dữ liệu — ví dụ tổng hợp báo cáo tài chính, kiểm soát công nợ hay chăm sóc khách hàng. Một kết quả đo được ở giai đoạn đầu chính là 'vốn' để thuyết phục tổ chức đầu tư cho các bước sau." },
      { type: "image", src: "/products/finerp/ferp-02-finance.png", alt: "Dashboard điều hành tài chính hợp nhất", caption: "Bắt đầu từ bài toán có dữ liệu rõ ràng — ví dụ dashboard điều hành tài chính." },
      { type: "h2", text: "Đặt nền tảng chung ngay từ đầu" },
      { type: "p", text: "Đây là điểm nhiều doanh nghiệp bỏ qua và phải trả giá về sau. Nếu mỗi phòng ban tự mua một phần mềm rời rạc, bạn sẽ sớm có những 'ốc đảo' dữ liệu không nói chuyện được với nhau — và mỗi lần muốn kết nối lại là một dự án tốn kém." },
      { type: "p", text: "Ngược lại, nếu ngay từ giai đoạn một bạn đã thiết kế tầng dữ liệu, tích hợp (API) và định danh dùng chung, thì mỗi bước mở rộng sau chỉ là bổ sung — không phải làm lại. Nền tảng vững là thứ phân biệt một lộ trình đi được đường dài với một chuỗi dự án chắp vá." },
      { type: "h2", text: "Ba giai đoạn, mỗi giai đoạn một cột mốc" },
      { type: "list", items: [
        "Giai đoạn 1 — Số hóa & chuẩn hóa: đưa bài toán ưu tiên lên hệ thống, làm sạch và chuẩn hóa dữ liệu gốc. Cột mốc: một quy trình chạy hết trên nền tảng số.",
        "Giai đoạn 2 — Tích hợp & liên thông: kết nối các hệ thống, để dữ liệu chảy end-to-end giữa các phòng ban. Cột mốc: một 'sự thật' dữ liệu duy nhất.",
        "Giai đoạn 3 — Phân tích & AI: kích hoạt báo cáo điều hành, dự báo và AI Agent trên nền dữ liệu đã liên thông. Cột mốc: quyết định dựa trên dữ liệu thời gian thực.",
      ] },
      { type: "h2", text: "Những cái bẫy cần tránh" },
      { type: "p", text: "Đừng để 'sự hoàn hảo' làm chậm giai đoạn đầu — ra mắt sớm, đo, rồi cải tiến. Đừng bỏ qua con người: đào tạo và đồng hành quan trọng ngang với phần mềm. Và đừng xem chuyển đổi số là một dự án có ngày kết thúc — nó là năng lực vận hành liên tục của doanh nghiệp." },
      { type: "p", text: "Đây cũng là cách XTECH đồng hành cùng khách hàng: bắt đầu gọn, chuẩn hóa nền tảng, rồi mở rộng theo mức độ sẵn sàng của tổ chức — để mỗi đồng đầu tư đều nhìn thấy kết quả." },
    ],
  },
  {
    slug: "tu-pilot-ai-den-ai-van-hanh-thuc-te",
    title: "Từ pilot AI đến AI vận hành thực tế trong doanh nghiệp",
    summary: "Một bản demo AI ấn tượng trong phòng họp không đảm bảo AI sẽ tạo giá trị khi vào vận hành. Khoảng cách nằm ở dữ liệu, quy trình và quản trị.",
    categorySlug: "ai-doanh-nghiep",
    tags: ["AI Agent", "RAG", "governance"],
    featured: true,
    relatedProducts: ["x-ai"],
    publishedAt: "2026-07-11",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-06-ai-workflow-assistant.png",
    body: [
      { type: "p", text: "Vì sao rất nhiều dự án AI dừng lại ngay sau bản demo đầu tiên?" },
      { type: "p", text: "Gần như doanh nghiệp nào cũng đã thử AI: một chatbot chạy tốt trong buổi trình diễn, một bản POC gây ấn tượng với ban lãnh đạo. Nhưng phần lớn dừng lại ở đó. Khoảng cách giữa 'AI trình diễn' và 'AI vận hành' không nằm ở model — mà ở ba thứ ít hào nhoáng hơn: dữ liệu, quy trình và quản trị." },
      { type: "h2", text: "Vì sao pilot hay 'chết' khi lên thật" },
      { type: "p", text: "Pilot thường chạy trên dữ liệu đã chọn lọc, phạm vi hẹp và không có ràng buộc thật. Khi đưa vào vận hành, AI gặp dữ liệu bẩn, câu hỏi ngoài phạm vi, yêu cầu phân quyền và cả trách nhiệm giải trình khi trả lời sai. Thiếu nền tảng cho những điều đó, kết quả nhanh chóng mất tin cậy và bị bỏ." },
      { type: "image", src: "/products/xai/xai-05-knowledge-search-qa.png", alt: "Hỏi đáp tri thức nội bộ theo RAG có trích dẫn nguồn", caption: "RAG trả lời dựa trên tri thức nội bộ và kèm trích dẫn nguồn để kiểm chứng." },
      { type: "h2", text: "Bốn điều kiện để AI đi vào vận hành" },
      { type: "list", items: [
        "Dữ liệu được tổ chức, gắn ngữ cảnh và phân quyền rõ ràng — nền tảng cho RAG trả lời đúng.",
        "Quy trình nghiệp vụ được chuẩn hóa để AI can thiệp đúng điểm, đúng lúc.",
        "Cơ chế giám sát, kiểm toán và guardrails cho mọi đầu ra của AI.",
        "Con người trong vòng lặp (human-in-the-loop) ở các quyết định quan trọng.",
      ] },
      { type: "h2", text: "Mở rộng theo mức độ tin cậy, đừng trao toàn quyền ngay" },
      { type: "p", text: "Một nguyên tắc thực dụng: mức độ tự chủ của AI nên tỉ lệ thuận với dữ liệu vận hành và guardrails đã kiểm chứng. Bắt đầu ở chế độ 'gợi ý' để con người duyệt, đo độ chính xác trong vài tuần, rồi mới nâng dần lên 'tự động hóa' cho những tác vụ đã đủ tin cậy." },
      { type: "quote", text: "AI tạo giá trị bền vững khi được kết nối với dữ liệu đáng tin cậy, quy trình rõ ràng và trách nhiệm của con người." },
      { type: "p", text: "Đó chính là triết lý đằng sau X.AI: không chỉ cung cấp agent, mà cung cấp cả lớp tri thức, tự động hóa và quản trị để AI thực sự vận hành được — chứ không dừng ở một bản demo đẹp." },
    ],
  },
  {
    slug: "nen-tang-du-lieu-thong-nhat-cho-doanh-nghiep",
    title: "Nền tảng dữ liệu thống nhất cho doanh nghiệp",
    summary: "Khi mỗi phòng ban có một 'sự thật' khác nhau, mọi cuộc họp đều tốn thời gian tranh cãi số liệu. Nền tảng dữ liệu thống nhất giải quyết gốc rễ vấn đề đó.",
    categorySlug: "du-lieu",
    tags: ["data platform", "integration", "analytics"],
    relatedProducts: ["x-ai", "finerp"],
    publishedAt: "2026-07-08",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-04-executive-reporting-ai.png",
    body: [
      { type: "p", text: "Hãy hình dung một cuộc họp giao ban: phòng kinh doanh báo doanh số một con số, phòng tài chính đưa ra con số khác, và nửa buổi họp trôi qua chỉ để thống nhất 'số nào đúng'. Đây là triệu chứng kinh điển của dữ liệu phân mảnh." },
      { type: "p", text: "Dữ liệu là nền móng của mọi sáng kiến số — nhưng ở nhiều doanh nghiệp, nó nằm rải rác trong hàng chục hệ thống, mỗi nơi một định dạng và một cách tính. Một nền tảng dữ liệu thống nhất giúp báo cáo nhất quán, quyết định nhanh và AI trả lời đáng tin." },
      { type: "h2", text: "Một nguồn sự thật duy nhất" },
      { type: "p", text: "Thay vì mỗi phòng ban tự tổng hợp theo cách riêng, dữ liệu được gom về một nền tảng chung và chuẩn hóa định nghĩa: một chỉ số chỉ có một cách tính, một khách hàng chỉ có một hồ sơ. Điều tưởng chừng đơn giản này chấm dứt phần lớn tranh cãi số liệu và giải phóng thời gian cho việc thực sự quan trọng — ra quyết định." },
      { type: "h2", text: "Bốn lớp của một nền tảng dữ liệu" },
      { type: "list", items: [
        "Thu thập & tích hợp: kết nối ERP, CRM, hệ thống vận hành qua API và event.",
        "Chuẩn hóa & chất lượng: làm sạch, khử trùng lặp, gắn ngữ cảnh và metadata.",
        "Phân quyền & bảo mật: kiểm soát ai xem được gì, bảo vệ dữ liệu nhạy cảm.",
        "Khai thác: báo cáo điều hành, phân tích tự phục vụ và cấp dữ liệu cho AI/RAG.",
      ] },
      { type: "image", src: "/products/finerp/ferp-02-finance.png", alt: "Báo cáo điều hành trên nền dữ liệu hợp nhất", caption: "Dữ liệu liên thông cho báo cáo điều hành theo thời gian thực." },
      { type: "h2", text: "Dữ liệu tốt là điều kiện tiên quyết của AI" },
      { type: "p", text: "Không có dữ liệu sạch và có ngữ cảnh, AI chỉ tạo ra những câu trả lời nghe hợp lý nhưng sai — điều nguy hiểm hơn cả không có AI. Vì thế, đầu tư vào nền tảng dữ liệu không phải một hạng mục 'kỹ thuật phụ', mà là khoản đầu tư cho mọi sáng kiến phân tích và AI phía sau." },
      { type: "p", text: "Nói cách khác: chất lượng của AI không bao giờ vượt quá chất lượng của dữ liệu nuôi nó. Bắt đầu từ dữ liệu là bắt đầu từ gốc." },
    ],
  },
  {
    slug: "hanh-trinh-so-cho-chu-dau-tu-bat-dong-san",
    title: "Hành trình số cho chủ đầu tư bất động sản",
    summary: "Theo chân một khách hàng từ lúc thấy quảng cáo đến khi trở thành cư dân — và những điểm dữ liệu dễ đứt gãy nếu mỗi giai đoạn dùng một phần mềm riêng.",
    categorySlug: "proptech",
    tags: ["bất động sản", "booking", "customer journey"],
    featured: true,
    relatedProducts: ["xbooking", "finerp", "xbuilding"],
    publishedAt: "2026-07-05",
    readTime: "9 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xbooking/xbk-09-inventory-matrix.png",
    body: [
      { type: "p", text: "Chị Lan thấy một quảng cáo dự án trên mạng xã hội, để lại số điện thoại. Ba tháng sau, chị nhận bàn giao căn hộ và trở thành cư dân. Giữa hai thời điểm đó là một hành trình dài — và với chủ đầu tư, mỗi bước trong hành trình ấy là một cơ hội để phục vụ tốt hơn, hoặc một điểm dễ đánh rơi khách hàng." },
      { type: "p", text: "Vấn đề là: khi mỗi giai đoạn dùng một phần mềm riêng, dữ liệu của chị Lan bị đứt gãy giữa các bộ phận, và trải nghiệm trở nên rời rạc. Số hóa toàn hành trình là cách giữ cho dòng chảy đó liền mạch." },
      { type: "h2", text: "Marketing và thu lead: đừng để khách rơi ngay từ đầu" },
      { type: "p", text: "Hành trình bắt đầu từ việc gom lead từ mọi kênh — website, mạng xã hội, hotline, sàn — về một đầu mối, chuẩn hóa và chống trùng ngay khi lead vào. Lead được chấm điểm và phân bổ tự động, để đội sales tập trung vào cơ hội tiềm năng nhất thay vì gọi ngẫu nhiên." },
      { type: "image", src: "/products/xbooking/xbk-07-sales-pipeline.png", alt: "Quản lý pipeline cơ hội bán hàng", caption: "Theo dõi cơ hội qua từng giai đoạn và dự báo doanh số sát thực tế." },
      { type: "h2", text: "Bảng hàng, booking và hợp đồng: minh bạch để không tranh chấp" },
      { type: "list", items: [
        "Bảng hàng thời gian thực: toàn cảnh quỹ hàng theo dự án, tòa, tầng và trạng thái căn.",
        "Giữ chỗ & lock cọc: có thời hạn rõ ràng, tránh trùng bán và tranh chấp.",
        "Hợp đồng & thanh toán: theo dõi tiến độ từng đợt, cảnh báo đến hạn và quá hạn.",
      ] },
      { type: "h2", text: "Từ giao dịch đến vận hành và tái mua" },
      { type: "p", text: "Khi bàn giao, dữ liệu của chị Lan không dừng lại mà chuyển tiếp sang hệ thống vận hành tòa nhà: hồ sơ cư dân, phí dịch vụ, phản ánh, bảo trì. Một cư dân được chăm sóc tốt sẽ quay lại và giới thiệu người khác — tạo dòng lead mới, khép kín vòng đời." },
      { type: "quote", text: "Lợi thế cạnh tranh không đến từ một phần mềm đơn lẻ, mà từ sự liên thông của toàn bộ hành trình khách hàng." },
      { type: "p", text: "Đây là lý do hệ sinh thái XBooking, FinERP và XBuilding được thiết kế để liên thông trên nền tảng dùng chung — dữ liệu đi suốt từ lead đến cư dân, không đứt đoạn." },
    ],
  },
  {
    slug: "integration-hub-ket-noi-he-thong-hien-huu",
    title: "Integration Hub cho hệ sinh thái hệ thống hiện hữu",
    summary: "Ít doanh nghiệp có thể vứt bỏ toàn bộ hệ thống cũ để làm lại. Bài toán thực tế là kết nối cái đang có với cái mới — an toàn và có kiểm soát.",
    categorySlug: "du-lieu",
    tags: ["API", "event bus", "integration"],
    relatedSolutions: ["tich-hop-he-thong"],
    relatedProducts: ["x-ai"],
    publishedAt: "2026-07-02",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-20-tool-api-connector-center.png",
    body: [
      { type: "p", text: "Trong thực tế, hiếm doanh nghiệp nào có thể (hoặc nên) vứt bỏ toàn bộ hệ thống cũ để làm lại từ đầu. Phần mềm kế toán đã dùng mười năm, hệ thống chuyên ngành đặc thù, ERP vừa triển khai — tất cả đều mang giá trị và dữ liệu lịch sử. Bài toán không phải 'thay mới', mà là 'kết nối'." },
      { type: "h2", text: "Ba thành phần cốt lõi của Integration Hub" },
      { type: "list", items: [
        "API Gateway: một cửa ngõ chuẩn hóa, bảo mật và giám sát mọi lời gọi giữa các hệ thống.",
        "Event Bus: cho phép hệ thống 'phát' và 'lắng nghe' sự kiện, giảm phụ thuộc trực tiếp lẫn nhau.",
        "Workflow Engine: điều phối quy trình đa hệ thống, xử lý ngoại lệ và các bước phê duyệt.",
      ] },
      { type: "image", src: "/images/backgrounds/home/hero-ecosystem.webp", alt: "Hệ sinh thái kết nối trên nền tảng dùng chung", caption: "Lớp tích hợp làm 'trục' kết nối dữ liệu, API và workflow xuyên hệ thống." },
      { type: "h2", text: "Vì sao nên tách riêng lớp tích hợp?" },
      { type: "p", text: "Khi các hệ thống gọi thẳng vào nhau theo kiểu 'point-to-point', mỗi thay đổi ở một nơi kéo theo rủi ro ở mọi nơi — và số kết nối tăng theo cấp số nhân khi thêm hệ thống mới. Một lớp tích hợp riêng biến mớ dây chằng chịt đó thành một trục rõ ràng: bạn có thể thay thế, nâng cấp từng hệ thống mà không phá vỡ phần còn lại, đồng thời có một điểm tập trung để giám sát, bảo mật và ghi log." },
      { type: "p", text: "Với lớp tích hợp vững, doanh nghiệp vừa bảo vệ được khoản đầu tư vào hệ thống cũ, vừa mở đường cho dữ liệu liên thông và AI khai thác về sau — thay vì phải chọn giữa 'giữ cũ' và 'làm mới'." },
    ],
  },
  {
    slug: "quan-tri-ai-an-toan-trong-doanh-nghiep",
    title: "Quản trị AI an toàn trong doanh nghiệp",
    summary: "Càng trao cho AI nhiều quyền hành động, rủi ro càng lớn nếu thiếu kiểm soát. Quản trị AI không phải rào cản — mà là điều kiện để dám mở rộng.",
    categorySlug: "ai-doanh-nghiep",
    tags: ["governance", "security", "AI Agent"],
    relatedProducts: ["x-ai"],
    publishedAt: "2026-06-28",
    readTime: "6 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xai/xai-14-ai-governance-guardrails.png",
    body: [
      { type: "p", text: "Nhiều lãnh đạo lo lắng khi nghĩ đến việc để AI tự hành động trong doanh nghiệp — và nỗi lo đó có cơ sở. Một AI thiếu kiểm soát có thể rò rỉ dữ liệu nhạy cảm, đưa ra câu trả lời sai lệch, hoặc hành động ngoài phạm vi cho phép. Nhưng nghịch lý là: chính vì có quản trị tốt, doanh nghiệp mới dám mở rộng AI." },
      { type: "h2", text: "Guardrails: vẽ ranh giới cho AI" },
      { type: "p", text: "Guardrails xác định rõ AI được làm gì, không được làm gì, và phải chuyển cho con người khi nào. Chúng bao gồm giới hạn phạm vi dữ liệu, quy tắc nội dung, và các bước phê duyệt bắt buộc trước những hành động có tác động lớn. Có ranh giới rõ, AI mới có thể mạnh dạn hỗ trợ mà không trở thành rủi ro." },
      { type: "h2", text: "Bốn trụ cột của quản trị AI" },
      { type: "list", items: [
        "Phân quyền dữ liệu: AI chỉ truy cập và trả lời trong phạm vi người dùng được phép.",
        "Bảo vệ dữ liệu & PII: che và kiểm soát thông tin nhạy cảm trong mọi luồng xử lý.",
        "Observability & audit: truy vết mọi bước để gỡ lỗi và giải trình khi cần.",
        "Chống 'ảo giác': đo mức bám nguồn, phát hiện câu trả lời bịa và cảnh báo kịp thời.",
      ] },
      { type: "image", src: "/products/xai/xai-25-ai-security-operations-center.png", alt: "Trung tâm giám sát an ninh AI", caption: "Giám sát tập trung mọi hoạt động AI, phát hiện và xử lý rủi ro kịp thời." },
      { type: "quote", text: "AI đáng tin không phải AI mạnh nhất, mà là AI minh bạch, kiểm soát được và truy vết được." },
      { type: "p", text: "Lớp quản trị này được tích hợp sẵn trong X.AI, giúp doanh nghiệp triển khai AI Agent với sự tự tin về an toàn và tuân thủ — để câu hỏi không còn là 'có nên dùng AI không', mà là 'mở rộng AI tới đâu'." },
    ],
  },
  {
    slug: "mo-hinh-saas-private-cloud-on-premise-hybrid",
    title: "Chọn SaaS, Private Cloud, On-premise hay Hybrid",
    summary: "Không có mô hình triển khai 'tốt nhất' cho mọi doanh nghiệp — chỉ có mô hình phù hợp nhất với yêu cầu về dữ liệu, tốc độ và nguồn lực của bạn.",
    categorySlug: "chuyen-doi-so",
    tags: ["cloud", "on-premise", "hybrid"],
    relatedProducts: ["x-space", "finerp"],
    publishedAt: "2026-06-24",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/images/backgrounds/home/hero-ecosystem.webp",
    body: [
      { type: "p", text: "Một trong những câu hỏi đầu tiên khi triển khai hệ thống mới là: đặt nó ở đâu? Câu trả lời không có 'đúng tuyệt đối' — mỗi mô hình là một sự đánh đổi giữa tốc độ, quyền kiểm soát và chi phí. Hiểu rõ đánh đổi đó giúp tránh những quyết định tốn kém và khó đảo ngược." },
      { type: "h2", text: "Bốn mô hình, bốn đánh đổi" },
      { type: "list", items: [
        "SaaS: triển khai nhanh, chi phí ban đầu thấp, nhà cung cấp lo hạ tầng — phù hợp phần lớn nghiệp vụ chuẩn.",
        "Private Cloud: kiểm soát dữ liệu cao hơn nhưng vẫn linh hoạt về hạ tầng — hợp với dữ liệu nhạy cảm.",
        "On-premise: toàn quyền kiểm soát, đáp ứng yêu cầu tuân thủ chặt — đổi lại chi phí và vận hành cao.",
        "Hybrid: kết hợp — đặt dữ liệu nhạy cảm on-premise và tận dụng cloud cho phần còn lại.",
      ] },
      { type: "h2", text: "Bốn tiêu chí để quyết định" },
      { type: "p", text: "Khi phân vân, hãy cân nhắc theo bốn câu hỏi: (1) Yêu cầu pháp lý và độ nhạy cảm của dữ liệu tới đâu? (2) Bạn cần đưa vào sử dụng nhanh thế nào? (3) Mức độ tùy chỉnh nghiệp vụ ra sao? (4) Năng lực và chi phí vận hành nội bộ của bạn thế nào? Trọng số của bốn câu hỏi này — chứ không phải 'công nghệ nào mới nhất' — mới là thứ quyết định lựa chọn đúng." },
      { type: "p", text: "Một lời khuyên thực dụng: nhiều doanh nghiệp bắt đầu nhanh với SaaS để tạo giá trị sớm, rồi chuyển dịch sang hybrid hoặc private cloud khi nhu cầu về dữ liệu và tùy chỉnh tăng lên. Các sản phẩm của XTECH hỗ trợ nhiều mô hình, cho phép lộ trình chuyển dịch đó diễn ra mượt mà thay vì phải làm lại." },
    ],
  },
  {
    slug: "smart-building-tu-quan-ly-den-van-hanh-thong-minh",
    title: "Smart Building: từ quản lý đến vận hành thông minh",
    summary: "Quản lý tòa nhà truyền thống nặng về giấy tờ và phản ứng bị động. Smart Building chuyển vận hành sang chủ động, dựa trên dữ liệu và kết nối.",
    categorySlug: "proptech",
    tags: ["smart building", "IoT", "vận hành"],
    relatedProducts: ["xbuilding", "x-ai"],
    publishedAt: "2026-06-20",
    readTime: "7 phút",
    author: "Đội ngũ XTECH",
    cover: "/products/xbuilding/xbl-10-smart-building-command-center.png",
    body: [
      { type: "p", text: "Ở một tòa nhà vận hành theo cách truyền thống, ban quản lý thường chỉ biết đến sự cố khi cư dân gọi điện phàn nàn. Phí dịch vụ thu bằng sổ, phản ánh xử lý bằng giấy, và mọi thứ mang tính 'chữa cháy'. Smart Building lật ngược thế bị động đó: vận hành dựa trên dữ liệu, chủ động và kết nối." },
      { type: "h2", text: "Số hóa những việc hằng ngày" },
      { type: "p", text: "Trước khi nói đến IoT hay AI, giá trị lớn đầu tiên đến từ việc số hóa vận hành thường nhật: phí dịch vụ được tính và thu tự động đa kênh; phản ánh của cư dân đi qua quy trình có SLA rõ ràng; công việc của ban quản lý được giao và theo dõi minh bạch. Cư dân tự phục vụ ngay trên ứng dụng, giảm tải cho quầy lễ tân — và mọi tương tác đều để lại dữ liệu." },
      { type: "image", src: "/products/xbuilding/xbl-12-energy-utility-monitoring.png", alt: "Giám sát năng lượng và tiện ích bằng IoT", caption: "Giám sát tiêu thụ điện, nước theo dữ liệu thật để tối ưu chi phí vận hành." },
      { type: "h2", text: "IoT và AI cho vận hành chủ động" },
      { type: "list", items: [
        "Command center: giám sát tập trung toàn bộ hệ thống kỹ thuật theo thời gian thực.",
        "IoT & năng lượng: phát hiện tiêu thụ bất thường, tối ưu chi phí vận hành.",
        "Bảo trì phòng ngừa: lên lịch theo vòng đời tài sản, tránh sự cố gây gián đoạn.",
        "An ninh thông minh: kiểm soát ra vào, nhận diện và bãi đỗ xe gắn với hồ sơ cư dân.",
      ] },
      { type: "quote", text: "Tòa nhà thông minh không phải tòa nhà gắn nhiều cảm biến, mà là tòa nhà ra quyết định tốt hơn nhờ dữ liệu." },
      { type: "p", text: "XBuilding kết hợp vận hành, IoT và AI copilot để ban quản lý thực sự làm chủ tòa nhà — chủ động phòng ngừa thay vì chạy theo sự cố, và nâng trải nghiệm cư dân lên một mức mới." },
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
