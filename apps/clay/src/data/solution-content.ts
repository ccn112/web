/**
 * SET G02 — Menu Giải pháp. Nội dung 5 trang giải pháp bespoke, gắn asset thiết
 * kế (webp) trong /public/solutions. Rendered by components/solutions/SolutionPages.
 * Nội dung mở rộng từ starter seed của handoff (item có thêm mô tả lợi ích).
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
    summary: "Kết nối con người, dữ liệu, quy trình và vận hành trên một nền tảng thống nhất — để mọi phòng ban làm việc cùng một nguồn sự thật.",
    heroImage: A("doanh-nghiep-ket-noi", "hero-connected-enterprise"),
    ctaTitle: "Kết nối doanh nghiệp của bạn ngay hôm nay",
    ctaDescription: "Trao đổi với đội ngũ XTECH để đánh giá hiện trạng và thiết kế lộ trình kết nối phù hợp.",
    ctaImage: A("doanh-nghiep-ket-noi", "cta-connected-enterprise"),
    relatedProducts: ["x-space", "x-ai", "finerp", "xbooking"],
    sections: [
      {
        sectionId: "pain-points", eyebrow: "ĐIỂM NGHẼN", title: "Những điểm nghẽn thường gặp", layout: "grid",
        description: "Khi hệ thống rời rạc, doanh nghiệp mất thời gian cho việc tổng hợp thay vì ra quyết định.",
        items: [
          { title: "Thông tin phân tán", description: "Dữ liệu nằm rải rác nhiều nơi, khó tìm và khó tin cậy." },
          { title: "Phối hợp chậm", description: "Trao đổi qua nhiều kênh, phụ thuộc và chờ đợi lẫn nhau." },
          { title: "Báo cáo rời rạc", description: "Số liệu tổng hợp thủ công, thiếu chuẩn và tốn thời gian." },
          { title: "Thiếu dữ liệu tức thời", description: "Không có góc nhìn thời gian thực để phản ứng kịp." },
        ],
      },
      {
        sectionId: "connected-model", eyebrow: "MÔ HÌNH", title: "Mô hình doanh nghiệp kết nối", layout: "visual-right",
        image: A("doanh-nghiep-ket-noi", "model-connected-enterprise"),
        description: "Kết nối mọi phòng ban, dữ liệu và quy trình trên một nền tảng thống nhất — thông tin chảy liền mạch từ đầu đến cuối.",
        items: [
          { title: "Tầng trải nghiệm", description: "Web, mobile, portal và chat cho mọi vai trò." },
          { title: "Ứng dụng nghiệp vụ", description: "CRM, ERP, HRM và vận hành liên thông." },
          { title: "Dữ liệu & tích hợp", description: "Data hub và API kết nối hệ thống hiện hữu." },
          { title: "Nền tảng & bảo mật", description: "Định danh, phân quyền, cloud và an toàn." },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NĂNG LỰC", title: "Năng lực cốt lõi", layout: "grid",
        items: [
          { title: "Cộng tác liên phòng ban", description: "Không gian làm việc chung, giảm email và họp." },
          { title: "Điều hành thống nhất", description: "Dashboard điều hành trên dữ liệu hợp nhất." },
          { title: "Luồng công việc xuyên suốt", description: "Quy trình end-to-end, không đứt đoạn giữa các bộ phận." },
          { title: "Dữ liệu dùng chung", description: "Một nguồn sự thật cho toàn doanh nghiệp." },
          { title: "Trải nghiệm nhất quán", description: "Giao diện và quyền truy cập đồng bộ đa kênh." },
          { title: "Mở rộng linh hoạt", description: "Thêm phân hệ, phòng ban mà vẫn liên thông." },
        ],
      },
      {
        sectionId: "value", eyebrow: "GIÁ TRỊ", title: "Giá trị mang lại", layout: "grid",
        description: "Khi doanh nghiệp thực sự kết nối, giá trị đến từ tốc độ, sự minh bạch và khả năng sẵn sàng cho tương lai.",
        items: [
          { title: "Quyết định nhanh hơn", description: "Bức tranh điều hành thời gian thực để phản ứng kịp thời." },
          { title: "Giảm nhập liệu lặp", description: "Dữ liệu nhập một lần, dùng lại ở nhiều nơi." },
          { title: "Minh bạch vận hành", description: "Thấy rõ tiến độ và trách nhiệm từng khâu." },
          { title: "Tăng năng suất", description: "Bớt việc thủ công, tập trung vào việc tạo giá trị." },
          { title: "Sẵn sàng cho AI", description: "Dữ liệu liên thông làm nền cho phân tích và AI." },
          { title: "Mở rộng bền vững", description: "Thêm phòng ban, phân hệ mà không phá vỡ hệ thống." },
        ],
      },
    ],
  },
  {
    slug: "du-lieu-va-ai",
    route: "/giai-phap/du-lieu-va-ai",
    eyebrow: "DỮ LIỆU & AI",
    title: "Dữ liệu & AI",
    summary: "Chuẩn hóa dữ liệu, khai thác insight và kích hoạt AI doanh nghiệp trên một nền tảng chung — biến dữ liệu rời rạc thành tài sản dùng được.",
    heroImage: A("du-lieu-ai", "hero-data-ai-wave"),
    ctaTitle: "Kích hoạt dữ liệu & AI cho doanh nghiệp",
    ctaDescription: "Đăng ký tư vấn để xây nền tảng dữ liệu và lộ trình AI phù hợp với doanh nghiệp bạn.",
    ctaImage: A("du-lieu-ai", "cta-data-ai"),
    relatedProducts: ["x-ai", "finerp", "x-space", "xbuilding"],
    sections: [
      {
        sectionId: "current-state", eyebrow: "THỰC TRẠNG", title: "Từ dữ liệu rời rạc đến tri thức dùng chung", layout: "visual-right",
        image: A("du-lieu-ai", "data-core-3d"),
        description: "Phần lớn doanh nghiệp có nhiều dữ liệu nhưng ít tri thức — vì dữ liệu phân mảnh, thiếu chuẩn và không sẵn sàng cho AI.",
        items: [
          { title: "Dữ liệu phân tán", description: "Rải rác trong nhiều hệ thống, định dạng khác nhau." },
          { title: "Báo cáo chậm", description: "Tổng hợp thủ công, không kịp thời." },
          { title: "Khó tổng hợp", description: "Thiếu định nghĩa chung cho chỉ số." },
          { title: "Thiếu nền tảng AI", description: "Dữ liệu chưa gắn ngữ cảnh để AI khai thác." },
        ],
      },
      {
        sectionId: "architecture", eyebrow: "KIẾN TRÚC", title: "Kiến trúc dữ liệu & AI", layout: "visual-left",
        image: A("du-lieu-ai", "data-hub-architecture"),
        description: "Một kiến trúc nhiều lớp: thu thập, chuẩn hóa, quản trị và khai thác — nền tảng cho báo cáo và AI đáng tin.",
        items: [
          { title: "Data Hub", description: "Gom và chuẩn hóa dữ liệu về một nơi." },
          { title: "BI Dashboard", description: "Báo cáo điều hành thời gian thực." },
          { title: "Knowledge Base", description: "Tri thức nội bộ có cấu trúc." },
          { title: "RAG", description: "AI trả lời theo tri thức, có trích dẫn." },
          { title: "AI Agent", description: "Trợ lý AI theo vai trò nghiệp vụ." },
          { title: "Governance", description: "Phân quyền, kiểm toán và chất lượng." },
        ],
      },
      {
        sectionId: "usecase", eyebrow: "USE CASE", title: "Use case doanh nghiệp", layout: "visual-right",
        image: A("du-lieu-ai", "bi-dashboard-visual"),
        description: "Từ báo cáo điều hành, dự báo dòng tiền đến hỏi đáp tri thức nội bộ — AI đi vào công việc thực tế.",
        items: [
          { title: "Báo cáo điều hành", description: "Bức tranh toàn cảnh cho lãnh đạo." },
          { title: "Dự báo & cảnh báo", description: "Phát hiện rủi ro và xu hướng sớm." },
          { title: "Hỏi đáp tri thức", description: "Nhân viên tra cứu như hỏi chuyên gia." },
          { title: "Tự động hóa phân tích", description: "AI tổng hợp và diễn giải số liệu." },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NỀN TẢNG", title: "Nền tảng toàn diện cho dữ liệu & AI", layout: "grid",
        description: "Một nền tảng khép kín từ thu thập dữ liệu đến kích hoạt AI — đủ mảnh ghép để đi từ dữ liệu thô tới quyết định.",
        items: [
          { title: "Data Hub", description: "Gom, chuẩn hóa và quản lý dữ liệu tập trung." },
          { title: "Dashboard & BI", description: "Báo cáo điều hành và phân tích tự phục vụ." },
          { title: "Knowledge & RAG", description: "Tri thức nội bộ cho AI trả lời đúng ngữ cảnh." },
          { title: "AI Agent", description: "Trợ lý AI theo vai trò, tự động hóa tác vụ." },
          { title: "Data Governance", description: "Chất lượng, dòng dữ liệu và tuân thủ." },
          { title: "Bảo mật & phân quyền", description: "Kiểm soát truy cập và bảo vệ dữ liệu nhạy cảm." },
        ],
      },
    ],
  },
  {
    slug: "tu-dong-hoa",
    route: "/giai-phap/tu-dong-hoa",
    eyebrow: "TỰ ĐỘNG HÓA VẬN HÀNH",
    title: "Tự động hóa",
    summary: "Số hóa workflow, giảm thao tác thủ công và tăng tốc xử lý nghiệp vụ — trả lại thời gian cho việc quan trọng.",
    heroImage: A("tu-dong-hoa", "hero-workflow-automation"),
    ctaTitle: "Bắt đầu tự động hóa quy trình của bạn",
    ctaDescription: "Đặt lịch tư vấn để xác định quy trình ưu tiên và triển khai tự động hóa có kiểm soát.",
    ctaImage: A("tu-dong-hoa", "cta-automation"),
    relatedProducts: ["x-ai", "finerp", "x-space"],
    sections: [
      {
        sectionId: "processes", eyebrow: "BÀI TOÁN", title: "Những quy trình cần tự động hóa", layout: "visual-left",
        image: A("tu-dong-hoa", "workflow-problem-visual"),
        description: "Những việc lặp lại, khối lượng lớn và nhiều bước chờ là ứng viên tốt nhất để tự động hóa trước.",
        items: [
          { title: "Phê duyệt", description: "Trình ký đa cấp, nhiều bước chờ." },
          { title: "Thông báo", description: "Nhắc việc và cập nhật trạng thái." },
          { title: "Giao việc", description: "Phân công và theo dõi tiến độ." },
          { title: "Tổng hợp báo cáo", description: "Gom số liệu định kỳ tốn công." },
        ],
      },
      {
        sectionId: "journey", eyebrow: "HÀNH TRÌNH", title: "Hành trình tự động hóa", layout: "steps",
        description: "Một luồng khép kín từ biểu mẫu đến báo cáo — dữ liệu đi suốt, không nhập lại.",
        items: [
          { title: "Biểu mẫu" }, { title: "Xử lý" }, { title: "Phê duyệt" },
          { title: "Thông báo" }, { title: "Theo dõi SLA" }, { title: "Báo cáo" },
        ],
      },
      {
        sectionId: "capabilities", eyebrow: "NĂNG LỰC", title: "Năng lực tự động hóa", layout: "visual-left",
        image: A("tu-dong-hoa", "automation-capability-core"),
        items: [
          { title: "Workflow Engine", description: "Thiết kế luồng nghiệp vụ trực quan." },
          { title: "Rule-based Automation", description: "Tự động theo quy tắc rõ ràng." },
          { title: "AI hỗ trợ tác vụ", description: "Gợi ý và soạn nội dung tự động." },
          { title: "Nhắc việc & cảnh báo", description: "Không bỏ sót hạn và bước chờ." },
          { title: "Tích hợp ký số", description: "Phê duyệt và ký số hợp lệ." },
        ],
      },
      {
        sectionId: "usecase", eyebrow: "ỨNG DỤNG", title: "Ứng dụng thực tế", layout: "visual-right",
        image: A("tu-dong-hoa", "automation-usecase-core"),
        items: [
          { title: "Phê duyệt chi", description: "Rút ngắn thời gian duyệt ngân sách." },
          { title: "Xử lý chứng từ", description: "Số hóa và luân chuyển tự động." },
          { title: "Onboarding", description: "Quy trình tiếp nhận nhân sự tự động." },
          { title: "Chăm sóc khách hàng", description: "Ticket và nhắc lịch tự động." },
        ],
      },
      {
        sectionId: "outcomes", eyebrow: "KẾT QUẢ", title: "Kết quả đạt được", layout: "grid",
        description: "Tự động hóa đúng chỗ mang lại kết quả đo được, không chỉ là cảm giác 'nhanh hơn'.",
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
    summary: "Kết nối ERP, CRM, HRM, ứng dụng nội bộ, API và dữ liệu xuyên suốt — bảo vệ hệ thống cũ, mở đường cho cái mới.",
    heroImage: A("tich-hop-he-thong", "hero-integration-hub"),
    ctaTitle: "Kết nối hệ thống của bạn thành một khối",
    ctaDescription: "Trao đổi với chuyên gia tích hợp của XTECH để thiết kế kiến trúc phù hợp với hệ thống hiện hữu.",
    ctaImage: A("tich-hop-he-thong", "cta-integration"),
    relatedProducts: ["x-ai", "finerp", "xbuilding"],
    sections: [
      {
        sectionId: "pain-points", eyebrow: "BÀI TOÁN", title: "Bài toán tích hợp phổ biến", layout: "grid",
        items: [
          { title: "Hệ thống rời rạc", description: "Mỗi phòng ban một phần mềm, không nói chuyện được." },
          { title: "Nhập liệu lặp", description: "Cùng dữ liệu nhập nhiều nơi, dễ sai lệch." },
          { title: "Dữ liệu không đồng bộ", description: "Số liệu chênh nhau giữa các hệ thống." },
          { title: "Khó giám sát luồng", description: "Không thấy dữ liệu chảy qua đâu, lỗi ở đâu." },
        ],
      },
      {
        sectionId: "architecture", eyebrow: "KIẾN TRÚC", title: "Kiến trúc tích hợp", layout: "visual-right",
        image: A("tich-hop-he-thong", "integration-architecture"),
        description: "Một lớp tích hợp làm trục kết nối — thay thế mớ dây point-to-point bằng cấu trúc rõ ràng, giám sát được.",
        items: [
          { title: "API Gateway", description: "Cửa ngõ chuẩn hóa và bảo mật." },
          { title: "Data Sync", description: "Đồng bộ dữ liệu giữa các hệ thống." },
          { title: "Event Bus", description: "Phát và lắng nghe sự kiện, giảm phụ thuộc." },
          { title: "Monitoring", description: "Giám sát luồng xử lý thời gian thực." },
          { title: "Security", description: "Xác thực, phân quyền và mã hóa." },
          { title: "Logging", description: "Ghi vết phục vụ gỡ lỗi và kiểm toán." },
        ],
      },
      {
        sectionId: "deployment", eyebrow: "MÔ HÌNH", title: "Mô hình triển khai", layout: "visual-right",
        image: A("tich-hop-he-thong", "deployment-models"),
        description: "Từ kết nối tối thiểu đến nền tảng tích hợp mở rộng — chọn theo quy mô và độ phức tạp.",
        items: [
          { title: "Point-to-Point tối thiểu", description: "Kết nối nhanh cho vài hệ thống." },
          { title: "Hub-and-Spoke", description: "Trục trung tâm cho nhiều hệ thống." },
          { title: "Nền tảng tích hợp mở rộng", description: "Sẵn sàng cho quy mô doanh nghiệp lớn." },
        ],
      },
      {
        sectionId: "value", eyebrow: "GIÁ TRỊ", title: "Giá trị đem lại", layout: "grid",
        description: "Tích hợp đúng cách vừa bảo vệ khoản đầu tư vào hệ thống cũ, vừa mở đường cho dữ liệu và AI về sau.",
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
    summary: "Đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp theo từng mô hình doanh nghiệp — triển khai nhanh, phù hợp bài toán.",
    heroImage: A("bo-giai-phap-x", "hero-solution-suite-hub"),
    ctaTitle: "Tìm bộ giải pháp phù hợp với doanh nghiệp bạn",
    ctaDescription: "Đặt lịch tư vấn để chọn bộ giải pháp và lộ trình triển khai đúng với bài toán của bạn.",
    ctaImage: A("bo-giai-phap-x", "deployment-suite-visual"),
    relatedProducts: ["x-ai", "xbooking", "finerp", "xbuilding", "x-space"],
    sections: [
      {
        sectionId: "selector", eyebrow: "CHỌN THEO BÀI TOÁN", title: "Chọn theo bài toán doanh nghiệp", layout: "grid",
        description: "Mỗi bộ giải pháp gói sẵn sản phẩm, dịch vụ và năng lực triển khai cho một nhóm bài toán.",
        items: [
          { title: "Chủ đầu tư bất động sản", description: "Bán hàng, vận hành và trải nghiệm cư dân." },
          { title: "Doanh nghiệp số", description: "Kết nối dữ liệu, quy trình và cộng tác." },
          { title: "Tòa nhà thông minh", description: "Vận hành, IoT và dịch vụ cư dân." },
          { title: "Tài chính & vận hành", description: "Kế toán, dòng tiền và kiểm soát." },
          { title: "AI doanh nghiệp", description: "Agent, tri thức và tự động hóa." },
        ],
      },
      {
        sectionId: "blueprint", eyebrow: "BLUEPRINT", title: "Blueprint bộ giải pháp", layout: "visual-left",
        image: A("bo-giai-phap-x", "suite-selector-blueprint"),
        description: "Mỗi bộ giải pháp được thiết kế theo lớp — từ sản phẩm lõi đến dịch vụ triển khai — để lắp ghép nhanh theo bài toán.",
        items: [
          { title: "Sản phẩm lõi", description: "Chọn các sản phẩm phù hợp bài toán chính." },
          { title: "Tích hợp & dữ liệu", description: "Kết nối hệ thống hiện hữu, dữ liệu liên thông." },
          { title: "Nền tảng dùng chung", description: "Định danh, workflow, cloud và bảo mật." },
          { title: "Dịch vụ triển khai", description: "Tư vấn, cấu hình, đào tạo và đồng hành." },
        ],
      },
      {
        sectionId: "real-estate-suite", eyebrow: "NỔI BẬT", title: "Bộ giải pháp cho chủ đầu tư bất động sản", layout: "visual-right",
        image: A("bo-giai-phap-x", "real-estate-suite-journey"),
        description: "Liên thông marketing, bảng hàng, booking, hợp đồng, thanh toán, bàn giao và vận hành tòa nhà.",
        items: [
          { title: "XBooking", description: "Bán hàng bất động sản khép kín." },
          { title: "FinERP", description: "Tài chính và vận hành hợp nhất." },
          { title: "XBuilding", description: "Vận hành tòa nhà và cư dân." },
          { title: "X.AI", description: "AI xuyên suốt hành trình." },
        ],
      },
      {
        sectionId: "other-suites", eyebrow: "TIÊU BIỂU", title: "Các bộ giải pháp tiêu biểu khác", layout: "visual-left",
        image: A("bo-giai-phap-x", "suite-platform-visual"),
        items: [
          { title: "Bộ doanh nghiệp số", description: "X.Space + X.AI + FinERP." },
          { title: "Bộ tòa nhà thông minh", description: "XBuilding + X.AI + IoT." },
          { title: "Bộ tài chính – vận hành", description: "FinERP + X.AI." },
          { title: "Bộ AI doanh nghiệp", description: "X.AI + nền tảng dữ liệu." },
        ],
      },
      {
        sectionId: "deployment", eyebrow: "TRIỂN KHAI", title: "Mô hình triển khai linh hoạt", layout: "grid",
        description: "Mỗi bộ giải pháp triển khai được trên nhiều mô hình — chọn theo yêu cầu dữ liệu, tốc độ và tuân thủ.",
        items: [
          { title: "SaaS Cloud", description: "Triển khai nhanh, chi phí ban đầu thấp." },
          { title: "Private Cloud", description: "Kiểm soát dữ liệu cao, vẫn linh hoạt hạ tầng." },
          { title: "On-premise", description: "Toàn quyền kiểm soát, đáp ứng tuân thủ chặt." },
          { title: "Hybrid", description: "Kết hợp — dữ liệu nhạy cảm nội bộ, phần còn lại trên cloud." },
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
