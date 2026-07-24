/**
 * SET G02 — Menu Giải pháp. Nội dung 5 trang giải pháp bespoke (góc nhìn chủ
 * doanh nghiệp BĐS/đa ngành), gắn asset thiết kế webp trong /public/solutions.
 * Rendered by components/solutions/SolutionPages.
 */

export type SolItem = { title: string; description?: string };
export type SolLayout = "grid" | "visual-right" | "visual-left" | "chips" | "steps";
export type SolSection = {
  sectionId: string;
  eyebrow?: string;
  title: string;
  description?: string;
  layout: SolLayout;
  image?: string;
  items?: SolItem[];
};
export type SolutionPage = {
  slug: string;
  route: string;
  eyebrow: string;
  title: string;
  summary: string;
  heroImage: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaImage?: string;
  relatedProducts?: string[];
  sections: SolSection[];
};

const A = (slug: string, name: string) => `/solutions/${slug}/${name}.webp`;

export const solutionPages: SolutionPage[] = [
  {
    slug: "doanh-nghiep-ket-noi",
    route: "/giai-phap/doanh-nghiep-ket-noi",
    eyebrow: "NỀN TẢNG DOANH NGHIỆP SỐ",
    title: "Doanh nghiệp kết nối",
    summary: "Kết nối con người, dữ liệu, quy trình và vận hành trên một nền tảng thống nhất — để mọi phòng ban làm việc trên cùng một nguồn sự thật, thay vì mỗi nơi một 'ốc đảo'.",
    heroImage: A("doanh-nghiep-ket-noi", "hero-connected-enterprise"),
    ctaTitle: "Kết nối doanh nghiệp của bạn ngay hôm nay",
    ctaDescription: "Trao đổi với đội ngũ XTECH để đánh giá hiện trạng và thiết kế lộ trình kết nối phù hợp với quy mô của bạn.",
    ctaImage: A("doanh-nghiep-ket-noi", "cta-connected-enterprise"),
    relatedProducts: ["x-space", "x-ai", "finerp", "xbooking"],
    sections: [
      {
        sectionId: "pain-points", eyebrow: "ĐIỂM NGHẼN", title: "Những điểm nghẽn thường gặp", layout: "grid",
        description: "Càng nhiều phần mềm rời rạc, doanh nghiệp càng tốn thời gian cho việc tổng hợp và đối chiếu thay vì bán hàng và ra quyết định. Đây là những điểm nghẽn quen thuộc mà chủ doanh nghiệp nào cũng gặp.",
        items: [
          { title: "Thông tin phân tán", description: "Dữ liệu khách hàng, tài chính, vận hành nằm rải rác nhiều nơi — cần gì cũng phải đi hỏi từng bộ phận." },
          { title: "Phối hợp chậm", description: "Trao đổi qua Zalo, email, giấy tờ; công việc kẹt ở khâu chờ duyệt, chờ chuyển tiếp." },
          { title: "Báo cáo rời rạc", description: "Số liệu tổng hợp thủ công cuối kỳ, mỗi phòng một con số, khó tin và khó đối chiếu." },
          { title: "Thiếu dữ liệu tức thời", description: "Lãnh đạo không có bức tranh theo thời gian thực để phản ứng khi thị trường thay đổi." },
          { title: "Nhập liệu trùng lặp", description: "Cùng một thông tin nhập đi nhập lại ở nhiều hệ thống, dễ sai và tốn nhân lực." },
          { title: "Khó mở rộng", description: "Thêm dự án, chi nhánh hay phòng ban là thêm một mớ tích hợp thủ công." },
        ],
      },
      {
        sectionId: "connected-model", eyebrow: "MÔ HÌNH", title: "Mô hình doanh nghiệp kết nối", layout: "visual-right",
        image: A("doanh-nghiep-ket-noi", "model-connected-enterprise"),
        description: "Thay vì các phần mềm rời rạc, XTECH kết nối mọi phòng ban, dữ liệu và quy trình theo bốn lớp — thông tin chảy liền mạch từ khách hàng đến vận hành, ai cũng nhìn thấy phần việc của mình trong bức tranh chung.",
        items: [
          { title: "Tầng trải nghiệm", description: "Web, mobile, portal và chat cho khách hàng lẫn nhân viên." },
          { title: "Ứng dụng nghiệp vụ", description: "CRM, ERP, HRM và vận hành liên thông trên một nền." },
          { title: "Dữ liệu & tích hợp", description: "Data hub và API kết nối cả hệ thống hiện hữu." },
          { title: "Nền tảng & bảo mật", description: "Định danh, phân quyền, cloud và an toàn thông tin." },
          { title: "Điều hành xuyên suốt", description: "Một dashboard duy nhất cho toàn doanh nghiệp." },
          { title: "Mở rộng theo nhu cầu", description: "Thêm phân hệ, dự án mà vẫn giữ liên thông." },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NĂNG LỰC", title: "Năng lực cốt lõi", layout: "grid",
        description: "Những năng lực giúp doanh nghiệp vận hành như một khối thống nhất — bớt ma sát nội bộ, tăng tốc độ và độ chính xác trong mọi khâu.",
        items: [
          { title: "Cộng tác liên phòng ban", description: "Không gian làm việc chung, giảm email và cuộc họp thừa." },
          { title: "Điều hành thống nhất", description: "Dashboard điều hành trên dữ liệu hợp nhất, cập nhật liên tục." },
          { title: "Luồng công việc xuyên suốt", description: "Quy trình end-to-end, không đứt đoạn giữa các bộ phận." },
          { title: "Dữ liệu dùng chung", description: "Một nguồn sự thật cho toàn doanh nghiệp." },
          { title: "Trải nghiệm nhất quán", description: "Giao diện và quyền truy cập đồng bộ trên mọi kênh." },
          { title: "Tự động hóa & nhắc việc", description: "Hệ thống tự chạy quy trình và nhắc đúng người, đúng lúc." },
        ],
      },
      {
        sectionId: "value", eyebrow: "GIÁ TRỊ", title: "Giá trị mang lại", layout: "grid",
        description: "Kết nối không phải để 'có công nghệ' — mà để ra quyết định nhanh hơn, chi phí thấp hơn và doanh nghiệp sẵn sàng cho giai đoạn tăng trưởng tiếp theo.",
        items: [
          { title: "Quyết định nhanh hơn", description: "Bức tranh điều hành thời gian thực để phản ứng kịp thời." },
          { title: "Giảm nhập liệu lặp", description: "Dữ liệu nhập một lần, dùng lại ở nhiều nơi." },
          { title: "Minh bạch vận hành", description: "Thấy rõ tiến độ và trách nhiệm ở từng khâu." },
          { title: "Tăng năng suất", description: "Bớt việc thủ công, tập trung vào việc tạo doanh thu." },
          { title: "Sẵn sàng cho AI", description: "Dữ liệu liên thông làm nền cho phân tích và AI." },
          { title: "Mở rộng bền vững", description: "Thêm phòng ban, dự án mà không phá vỡ hệ thống." },
        ],
      },
    ],
  },
  {
    slug: "du-lieu-va-ai",
    route: "/giai-phap/du-lieu-va-ai",
    eyebrow: "DỮ LIỆU & AI",
    title: "Dữ liệu & AI",
    summary: "Chuẩn hóa dữ liệu, khai thác insight và kích hoạt AI doanh nghiệp trên một nền tảng chung — biến dữ liệu đang 'nằm chết' trong các hệ thống thành tài sản tạo ra quyết định và doanh thu.",
    heroImage: A("du-lieu-ai", "hero-data-ai-wave"),
    ctaTitle: "Kích hoạt dữ liệu & AI cho doanh nghiệp",
    ctaDescription: "Đăng ký tư vấn để xây nền tảng dữ liệu và lộ trình AI phù hợp với dữ liệu và bài toán thực tế của bạn.",
    ctaImage: A("du-lieu-ai", "cta-data-ai"),
    relatedProducts: ["x-ai", "finerp", "x-space", "xbuilding"],
    sections: [
      {
        sectionId: "current-state", eyebrow: "THỰC TRẠNG", title: "Từ dữ liệu rời rạc đến tri thức dùng chung", layout: "visual-right",
        image: A("du-lieu-ai", "data-core-3d"),
        description: "Phần lớn doanh nghiệp có rất nhiều dữ liệu nhưng ít tri thức — vì dữ liệu phân mảnh, thiếu chuẩn và chưa sẵn sàng cho AI. Hệ quả là lãnh đạo ra quyết định dựa trên cảm tính hoặc báo cáo đã cũ.",
        items: [
          { title: "Dữ liệu phân tán", description: "Rải rác trong nhiều hệ thống, mỗi nơi một định dạng." },
          { title: "Báo cáo chậm", description: "Tổng hợp thủ công, đến tay lãnh đạo thì số liệu đã cũ." },
          { title: "Khó tổng hợp", description: "Thiếu định nghĩa chung nên mỗi phòng một con số." },
          { title: "Thiếu nền tảng AI", description: "Dữ liệu chưa gắn ngữ cảnh để AI có thể khai thác." },
          { title: "Rủi ro sai sót", description: "Nhập tay và copy-paste dẫn tới lệch số, khó truy vết." },
          { title: "Lãng phí dữ liệu quý", description: "Dữ liệu khách hàng, giao dịch không được tận dụng." },
        ],
      },
      {
        sectionId: "architecture", eyebrow: "KIẾN TRÚC", title: "Kiến trúc dữ liệu & AI", layout: "visual-left",
        image: A("du-lieu-ai", "data-hub-architecture"),
        description: "Một kiến trúc nhiều lớp: thu thập, chuẩn hóa, quản trị và khai thác — nền tảng để báo cáo nhất quán và AI trả lời đáng tin, thay vì 'đoán mò'.",
        items: [
          { title: "Data Hub", description: "Gom và chuẩn hóa dữ liệu từ mọi hệ thống về một nơi." },
          { title: "BI Dashboard", description: "Báo cáo điều hành thời gian thực cho lãnh đạo." },
          { title: "Knowledge Base", description: "Tri thức nội bộ có cấu trúc, dễ tra cứu." },
          { title: "RAG", description: "AI trả lời theo tri thức doanh nghiệp, kèm trích dẫn." },
          { title: "AI Agent", description: "Trợ lý AI theo vai trò: bán hàng, tài chính, vận hành." },
          { title: "Governance", description: "Phân quyền, kiểm toán và kiểm soát chất lượng." },
        ],
      },
      {
        sectionId: "usecase", eyebrow: "USE CASE", title: "Use case cho doanh nghiệp của bạn", layout: "visual-right",
        image: A("du-lieu-ai", "bi-dashboard-visual"),
        description: "Không phải AI trừu tượng — mà là những bài toán cụ thể tạo ra giá trị đo được ngay: từ báo cáo điều hành, dự báo dòng tiền đến hỏi đáp tri thức nội bộ.",
        items: [
          { title: "Báo cáo điều hành", description: "Doanh số, dòng tiền, tồn kho trên một màn hình." },
          { title: "Dự báo & cảnh báo", description: "Nhìn trước rủi ro và xu hướng để chủ động." },
          { title: "Hỏi đáp tri thức", description: "Nhân viên tra cứu chính sách, quy trình như hỏi chuyên gia." },
          { title: "Phân tích khách hàng", description: "Hiểu hành vi để bán đúng người, đúng thời điểm." },
          { title: "Tự động hóa phân tích", description: "AI tổng hợp và diễn giải số liệu thay cho làm tay." },
          { title: "Chấm điểm & xếp hạng", description: "Ưu tiên lead, dự án, khoản thu theo dữ liệu." },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NỀN TẢNG", title: "Nền tảng toàn diện cho dữ liệu & AI", layout: "grid",
        description: "Một nền tảng khép kín từ thu thập dữ liệu đến kích hoạt AI — đủ mảnh ghép để đi từ dữ liệu thô tới quyết định, không phải chắp vá nhiều công cụ.",
        items: [
          { title: "Data Hub", description: "Gom, chuẩn hóa và quản lý dữ liệu tập trung." },
          { title: "Dashboard & BI", description: "Báo cáo điều hành và phân tích tự phục vụ." },
          { title: "Knowledge & RAG", description: "Tri thức nội bộ cho AI trả lời đúng ngữ cảnh." },
          { title: "AI Agent", description: "Trợ lý AI theo vai trò, tự động hóa tác vụ." },
          { title: "Data Governance", description: "Chất lượng, dòng dữ liệu và tuân thủ." },
          { title: "Bảo mật & phân quyền", description: "Kiểm soát truy cập, bảo vệ dữ liệu nhạy cảm." },
        ],
      },
    ],
  },
  {
    slug: "tu-dong-hoa",
    route: "/giai-phap/tu-dong-hoa",
    eyebrow: "TỰ ĐỘNG HÓA VẬN HÀNH",
    title: "Tự động hóa",
    summary: "Số hóa workflow, giảm thao tác thủ công và tăng tốc xử lý nghiệp vụ — trả lại thời gian cho đội ngũ để tập trung vào khách hàng và doanh thu, thay vì giấy tờ và chờ duyệt.",
    heroImage: A("tu-dong-hoa", "hero-workflow-automation"),
    ctaTitle: "Bắt đầu tự động hóa quy trình của bạn",
    ctaDescription: "Đặt lịch tư vấn để xác định quy trình ưu tiên và triển khai tự động hóa có kiểm soát, thấy kết quả sớm.",
    ctaImage: A("tu-dong-hoa", "cta-automation"),
    relatedProducts: ["x-ai", "finerp", "x-space"],
    sections: [
      {
        sectionId: "processes", eyebrow: "BÀI TOÁN", title: "Những quy trình 'ngốn thời gian' cần tự động hóa", layout: "visual-left",
        image: A("tu-dong-hoa", "workflow-problem-visual"),
        description: "Những việc lặp lại, khối lượng lớn và nhiều bước chờ chính là nơi doanh nghiệp mất nhiều giờ mỗi ngày. Đây là ứng viên tốt nhất để tự động hóa trước và thấy hiệu quả ngay.",
        items: [
          { title: "Phê duyệt", description: "Trình ký đa cấp, nhiều bước chờ giữa các phòng." },
          { title: "Thông báo", description: "Nhắc việc và cập nhật trạng thái thủ công." },
          { title: "Giao việc", description: "Phân công và theo dõi tiến độ rải rác." },
          { title: "Tổng hợp báo cáo", description: "Gom số liệu định kỳ tốn nhiều công sức." },
          { title: "Xử lý chứng từ", description: "Nhập liệu và luân chuyển hồ sơ bằng tay." },
          { title: "Chăm sóc & nhắc lịch", description: "Follow-up khách, nhắc hạn thanh toán thủ công." },
        ],
      },
      {
        sectionId: "journey", eyebrow: "HÀNH TRÌNH", title: "Hành trình tự động hóa", layout: "steps",
        description: "Một luồng khép kín từ biểu mẫu đến báo cáo — dữ liệu đi suốt, không nhập lại, ai cũng biết việc đang ở đâu.",
        items: [
          { title: "Biểu mẫu" }, { title: "Xử lý" }, { title: "Phê duyệt" },
          { title: "Thông báo" }, { title: "Theo dõi SLA" }, { title: "Báo cáo" },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NĂNG LỰC", title: "Năng lực tự động hóa", layout: "visual-left",
        image: A("tu-dong-hoa", "automation-capability-core"),
        description: "Kết hợp workflow, quy tắc và AI để tự động hóa từ việc đơn giản đến quy trình phức tạp — luôn có con người kiểm soát ở điểm quan trọng.",
        items: [
          { title: "Workflow Engine", description: "Thiết kế luồng nghiệp vụ trực quan, kéo–thả." },
          { title: "Rule-based Automation", description: "Tự động theo quy tắc rõ ràng, minh bạch." },
          { title: "AI hỗ trợ tác vụ", description: "Gợi ý, soạn nội dung và phân loại tự động." },
          { title: "Nhắc việc & cảnh báo", description: "Không bỏ sót hạn và bước chờ." },
          { title: "Tích hợp ký số", description: "Phê duyệt và ký số hợp lệ, đúng thẩm quyền." },
          { title: "Giám sát SLA", description: "Theo dõi cam kết thời gian và điểm nghẽn." },
        ],
      },
      {
        sectionId: "usecase", eyebrow: "ỨNG DỤNG", title: "Ứng dụng thực tế", layout: "visual-right",
        image: A("tu-dong-hoa", "automation-usecase-core"),
        description: "Những quy trình tự động hóa phổ biến mang lại hiệu quả nhanh cho doanh nghiệp BĐS và đa ngành.",
        items: [
          { title: "Phê duyệt chi", description: "Rút ngắn thời gian duyệt ngân sách, minh bạch." },
          { title: "Xử lý chứng từ", description: "Số hóa và luân chuyển hồ sơ tự động." },
          { title: "Onboarding nhân sự", description: "Quy trình tiếp nhận nhân viên mới tự động." },
          { title: "Chăm sóc khách hàng", description: "Ticket, nhắc lịch và follow-up tự động." },
          { title: "Nhắc thanh toán", description: "Cảnh báo công nợ đến hạn và quá hạn." },
          { title: "Báo cáo định kỳ", description: "Tự tổng hợp và gửi báo cáo đúng hạn." },
        ],
      },
      {
        sectionId: "outcomes", eyebrow: "KẾT QUẢ", title: "Kết quả đạt được", layout: "grid",
        description: "Tự động hóa đúng chỗ mang lại kết quả đo được — không chỉ là cảm giác 'nhanh hơn'.",
        items: [
          { title: "Giảm thao tác tay", description: "Cắt bỏ các bước nhập liệu và luân chuyển thủ công." },
          { title: "Tăng tốc phê duyệt", description: "Rút ngắn thời gian chờ ở các bước trình ký." },
          { title: "Ít sai sót", description: "Quy tắc rõ ràng, giảm lỗi do con người." },
          { title: "Minh bạch tiến độ", description: "Biết mỗi việc đang ở đâu, ai phụ trách." },
          { title: "Tuân thủ SLA", description: "Cảnh báo và nhắc việc để không trễ hạn." },
          { title: "Dễ nhân rộng", description: "Chuẩn hóa một lần, áp dụng cho nhiều quy trình." },
        ],
      },
    ],
  },
  {
    slug: "tich-hop-he-thong",
    route: "/giai-phap/tich-hop-he-thong",
    eyebrow: "TÍCH HỢP HỆ THỐNG",
    title: "Tích hợp hệ thống",
    summary: "Kết nối ERP, CRM, HRM, ứng dụng nội bộ, API và dữ liệu xuyên suốt — bảo vệ khoản đầu tư vào hệ thống cũ, đồng thời mở đường cho dữ liệu liên thông và AI.",
    heroImage: A("tich-hop-he-thong", "hero-integration-hub"),
    ctaTitle: "Kết nối hệ thống của bạn thành một khối",
    ctaDescription: "Trao đổi với chuyên gia tích hợp của XTECH để thiết kế kiến trúc phù hợp với hệ thống hiện hữu của bạn.",
    ctaImage: A("tich-hop-he-thong", "cta-integration"),
    relatedProducts: ["x-ai", "finerp", "xbuilding"],
    sections: [
      {
        sectionId: "pain-points", eyebrow: "BÀI TOÁN", title: "Bài toán tích hợp phổ biến", layout: "grid",
        description: "Ít doanh nghiệp có thể vứt bỏ toàn bộ hệ thống cũ để làm lại. Bài toán thực tế là kết nối cái đang có với cái mới — và đây là những vướng mắc thường gặp.",
        items: [
          { title: "Hệ thống rời rạc", description: "Mỗi phòng ban một phần mềm, không nói chuyện được với nhau." },
          { title: "Nhập liệu lặp", description: "Cùng dữ liệu nhập nhiều nơi, dễ sai và tốn công." },
          { title: "Dữ liệu không đồng bộ", description: "Số liệu chênh nhau giữa các hệ thống, khó tin." },
          { title: "Khó giám sát luồng", description: "Không thấy dữ liệu chảy qua đâu, lỗi phát sinh ở đâu." },
          { title: "Phụ thuộc thủ công", description: "Xuất/nhập file bằng tay giữa các phần mềm." },
          { title: "Khó thay đổi", description: "Đổi một hệ thống kéo theo rủi ro ở mọi nơi." },
        ],
      },
      {
        sectionId: "architecture", eyebrow: "KIẾN TRÚC", title: "Kiến trúc tích hợp", layout: "visual-right",
        image: A("tich-hop-he-thong", "integration-architecture"),
        description: "Một lớp tích hợp làm 'trục' kết nối — thay mớ dây point-to-point chằng chịt bằng cấu trúc rõ ràng, giám sát được và dễ mở rộng.",
        items: [
          { title: "API Gateway", description: "Cửa ngõ chuẩn hóa, bảo mật và giám sát." },
          { title: "Data Sync", description: "Đồng bộ dữ liệu hai chiều giữa các hệ thống." },
          { title: "Event Bus", description: "Phát và lắng nghe sự kiện, giảm phụ thuộc trực tiếp." },
          { title: "Monitoring", description: "Giám sát luồng xử lý theo thời gian thực." },
          { title: "Security", description: "Xác thực, phân quyền và mã hóa dữ liệu." },
          { title: "Logging", description: "Ghi vết đầy đủ phục vụ gỡ lỗi và kiểm toán." },
        ],
      },
      {
        sectionId: "deployment", eyebrow: "MÔ HÌNH", title: "Mô hình triển khai", layout: "visual-right",
        image: A("tich-hop-he-thong", "deployment-models"),
        description: "Từ kết nối tối thiểu đến nền tảng tích hợp mở rộng — chọn theo quy mô và độ phức tạp, tránh 'đập đi xây lại'.",
        items: [
          { title: "Point-to-Point tối thiểu", description: "Kết nối nhanh cho vài hệ thống ưu tiên." },
          { title: "Hub-and-Spoke", description: "Trục trung tâm điều phối nhiều hệ thống." },
          { title: "Nền tảng mở rộng", description: "Sẵn sàng cho quy mô doanh nghiệp lớn." },
          { title: "Lộ trình chuyển dịch", description: "Nâng cấp từng bước, không gián đoạn vận hành." },
        ],
      },
      {
        sectionId: "value", eyebrow: "GIÁ TRỊ", title: "Giá trị đem lại", layout: "grid",
        description: "Tích hợp đúng cách vừa bảo vệ khoản đầu tư vào hệ thống cũ, vừa mở đường cho dữ liệu và AI về sau — không phải chọn giữa 'giữ cũ' và 'làm mới'.",
        items: [
          { title: "Dữ liệu đồng bộ", description: "Một nguồn sự thật, hết cảnh số liệu chênh nhau." },
          { title: "Bớt nhập liệu tay", description: "Dữ liệu chảy tự động giữa các hệ thống." },
          { title: "Bảo vệ hệ thống cũ", description: "Kết nối cái đang có, không phải làm lại từ đầu." },
          { title: "Dễ mở rộng", description: "Thêm hệ thống mới mà không phá vỡ phần còn lại." },
          { title: "Giám sát tập trung", description: "Một nơi để theo dõi, gỡ lỗi và bảo mật." },
          { title: "Sẵn sàng cho AI", description: "Dữ liệu liên thông là nền cho phân tích và AI." },
        ],
      },
    ],
  },
  {
    slug: "bo-giai-phap-x",
    route: "/bo-giai-phap-x",
    eyebrow: "BỘ GIẢI PHÁP XTECH",
    title: "Bộ giải pháp X",
    summary: "Đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp theo từng mô hình doanh nghiệp — để bạn không phải tự ghép nối, mà nhận ngay bộ phù hợp với bài toán của mình.",
    heroImage: A("bo-giai-phap-x", "hero-solution-suite-hub"),
    ctaTitle: "Tìm bộ giải pháp phù hợp với doanh nghiệp bạn",
    ctaDescription: "Đặt lịch tư vấn để chọn bộ giải pháp và lộ trình triển khai đúng với bài toán và ngân sách của bạn.",
    ctaImage: A("bo-giai-phap-x", "deployment-suite-visual"),
    relatedProducts: ["x-ai", "xbooking", "finerp", "xbuilding", "x-space"],
    sections: [
      {
        sectionId: "selector", eyebrow: "CHỌN THEO BÀI TOÁN", title: "Chọn theo bài toán doanh nghiệp", layout: "grid",
        description: "Mỗi bộ giải pháp gói sẵn sản phẩm, dịch vụ và năng lực triển khai cho một nhóm bài toán — bạn bắt đầu nhanh, không phải tự cân nhắc lắp ghép từng phần.",
        items: [
          { title: "Chủ đầu tư bất động sản", description: "Bán hàng, thu tiền, bàn giao và vận hành cư dân." },
          { title: "Doanh nghiệp số", description: "Kết nối dữ liệu, quy trình và cộng tác nội bộ." },
          { title: "Tòa nhà thông minh", description: "Vận hành, IoT và dịch vụ cư dân số." },
          { title: "Tài chính & vận hành", description: "Kế toán, dòng tiền, ngân sách và kiểm soát." },
          { title: "AI doanh nghiệp", description: "Agent, tri thức và tự động hóa nghiệp vụ." },
          { title: "Bán lẻ & chuỗi", description: "Quản lý bán hàng, tồn kho và khách hàng đa điểm." },
        ],
      },
      {
        sectionId: "blueprint", eyebrow: "BLUEPRINT", title: "Blueprint bộ giải pháp", layout: "visual-left",
        image: A("bo-giai-phap-x", "suite-selector-blueprint"),
        description: "Mỗi bộ giải pháp được thiết kế theo lớp — từ sản phẩm lõi đến dịch vụ triển khai — để lắp ghép nhanh và mở rộng dần theo nhu cầu.",
        items: [
          { title: "Sản phẩm lõi", description: "Chọn các sản phẩm phù hợp bài toán chính." },
          { title: "Tích hợp & dữ liệu", description: "Kết nối hệ thống hiện hữu, dữ liệu liên thông." },
          { title: "Nền tảng dùng chung", description: "Định danh, workflow, cloud và bảo mật." },
          { title: "Dịch vụ triển khai", description: "Tư vấn, cấu hình, đào tạo và đồng hành." },
          { title: "Lộ trình mở rộng", description: "Bổ sung phân hệ theo từng giai đoạn." },
          { title: "Đo lường giá trị", description: "Dashboard theo dõi hiệu quả sau triển khai." },
        ],
      },
      {
        sectionId: "real-estate-suite", eyebrow: "NỔI BẬT", title: "Bộ giải pháp cho chủ đầu tư bất động sản", layout: "visual-right",
        image: A("bo-giai-phap-x", "real-estate-suite-journey"),
        description: "Liên thông toàn bộ hành trình: marketing, bảng hàng, booking, hợp đồng, thanh toán, bàn giao và vận hành tòa nhà — dữ liệu đi suốt từ lead đến cư dân.",
        items: [
          { title: "XBooking", description: "Bán hàng bất động sản khép kín từ lead đến hợp đồng." },
          { title: "FinERP", description: "Tài chính, dòng tiền và công nợ hợp nhất." },
          { title: "XBuilding", description: "Vận hành tòa nhà, phí dịch vụ và cư dân." },
          { title: "X.AI", description: "AI hỗ trợ bán hàng, chăm sóc và vận hành." },
          { title: "Thanh toán & hợp đồng", description: "Theo dõi tiến độ thu theo từng đợt." },
          { title: "App cư dân", description: "Trải nghiệm số sau bàn giao, tăng gắn kết." },
        ],
      },
      {
        sectionId: "other-suites", eyebrow: "TIÊU BIỂU", title: "Các bộ giải pháp tiêu biểu khác", layout: "visual-left",
        image: A("bo-giai-phap-x", "suite-platform-visual"),
        description: "Ngoài bất động sản, XTECH đóng gói các bộ giải pháp cho nhiều mô hình doanh nghiệp — mỗi bộ kết hợp sản phẩm và AI theo đúng nhu cầu.",
        items: [
          { title: "Bộ doanh nghiệp số", description: "X.Space + X.AI + FinERP cho vận hành nội bộ." },
          { title: "Bộ tòa nhà thông minh", description: "XBuilding + X.AI + IoT cho quản lý vận hành." },
          { title: "Bộ tài chính – vận hành", description: "FinERP + X.AI cho kiểm soát tài chính." },
          { title: "Bộ AI doanh nghiệp", description: "X.AI + nền tảng dữ liệu cho tự động hóa." },
          { title: "Bộ bán hàng & CRM", description: "XBooking + X.AI cho đội kinh doanh." },
          { title: "Bộ tùy chỉnh", description: "Ghép linh hoạt theo bài toán riêng của bạn." },
        ],
      },
      {
        sectionId: "deployment", eyebrow: "TRIỂN KHAI", title: "Mô hình triển khai linh hoạt", layout: "grid",
        description: "Mỗi bộ giải pháp triển khai được trên nhiều mô hình — chọn theo yêu cầu dữ liệu, tốc độ và tuân thủ của doanh nghiệp bạn.",
        items: [
          { title: "SaaS Cloud", description: "Triển khai nhanh, chi phí ban đầu thấp." },
          { title: "Private Cloud", description: "Kiểm soát dữ liệu cao, vẫn linh hoạt hạ tầng." },
          { title: "On-premise", description: "Toàn quyền kiểm soát, đáp ứng tuân thủ chặt." },
          { title: "Hybrid", description: "Dữ liệu nhạy cảm nội bộ, phần còn lại trên cloud." },
        ],
      },
    ],
  },
];

export function solutionByRoute(route: string): SolutionPage | undefined {
  return solutionPages.find((p) => p.route === route);
}
export function hasSolutionRoute(route: string): boolean {
  return solutionPages.some((p) => p.route === route);
}
