import type { C02Section } from "./c02-types";

export const c02Sections: C02Section[] = [
  {
    id: "c02-01",
    eyebrow: "Dịch vụ chuyển đổi số",
    title: "Dịch vụ chuyển đổi số toàn diện",
    subtitle: "Từ đánh giá hiện trạng đến vận hành và tối ưu liên tục",
    visualType: "hub-spoke",
    referenceImage: "/references/c02/C02-01-dich-vu-chuyen-doi-so-toan-dien.png",
    routes: ["/dich-vu", "/dich-vu/chuyen-doi-so"],
    items: [
      { id: "assess", order: 1, title: "Khảo sát hiện trạng", description: "Đánh giá toàn diện hiện trạng doanh nghiệp về quy trình, công nghệ và dữ liệu.", side: "left" },
      { id: "strategy", order: 2, title: "Chiến lược & kiến trúc", description: "Xây dựng chiến lược chuyển đổi số và kiến trúc tổng thể phù hợp với mục tiêu kinh doanh.", side: "right" },
      { id: "design", order: 3, title: "Thiết kế giải pháp", description: "Thiết kế giải pháp toàn diện, tập trung vào trải nghiệm, dữ liệu và hiệu quả vận hành.", side: "left" },
      { id: "build", order: 4, title: "Phát triển & tích hợp", description: "Phát triển hệ thống linh hoạt, tích hợp liền mạch với hệ thống hiện hữu và bên thứ ba.", side: "right" },
      { id: "deploy", order: 5, title: "Triển khai & đào tạo", description: "Triển khai hiệu quả, bảo đảm chuyển giao kiến thức và nâng cao năng lực đội ngũ.", side: "left" },
      { id: "operate", order: 6, title: "Vận hành & tối ưu", description: "Vận hành ổn định, giám sát liên tục và tối ưu hiệu suất để tạo giá trị bền vững.", side: "right" }
    ],
    outcomes: [
      { id: "strategy-value", title: "Tư vấn chiến lược", description: "Hiểu đúng, định hướng rõ và tạo lợi thế cạnh tranh." },
      { id: "delivery-value", title: "Triển khai thực tế", description: "Giải pháp khả thi, công nghệ phù hợp và kết quả đo lường được." },
      { id: "longterm-value", title: "Đồng hành dài hạn", description: "Hỗ trợ liên tục, tối ưu bền vững và kiến tạo giá trị lâu dài." }
    ]
  },
  {
    id: "c02-02",
    eyebrow: "Đánh giá hiện trạng",
    title: "Đánh giá mức độ trưởng thành số",
    subtitle: "Đo lường hiện trạng, xác định khoảng cách và ưu tiên lộ trình",
    visualType: "maturity-radar",
    referenceImage: "/references/c02/C02-02-danh-gia-muc-do-truong-thanh-so.png",
    routes: ["/dich-vu/chuyen-doi-so", "/giai-phap/chuyen-doi-so"],
    items: [
      { id: "strategy", title: "Chiến lược", description: "Đánh giá định hướng, mục tiêu và năng lực thực thi chiến lược số." },
      { id: "customer", title: "Khách hàng", description: "Đánh giá trải nghiệm khách hàng và năng lực thấu hiểu khách hàng." },
      { id: "operations", title: "Vận hành", description: "Đánh giá hiệu quả quy trình, chuỗi giá trị và khả năng vận hành linh hoạt." },
      { id: "technology", title: "Công nghệ", description: "Đánh giá hạ tầng, nền tảng và khả năng ứng dụng công nghệ mới." },
      { id: "data", title: "Dữ liệu", description: "Đánh giá năng lực quản trị dữ liệu và khả năng khai thác để tạo giá trị." },
      { id: "people", title: "Con người & văn hóa", description: "Đánh giá năng lực nhân sự, tư duy số và văn hóa đổi mới." }
    ],
    process: [
      { id: "survey", order: 1, title: "Khảo sát", description: "Thu thập dữ liệu ban đầu." },
      { id: "interview", order: 2, title: "Phỏng vấn", description: "Làm rõ bối cảnh và nhu cầu." },
      { id: "measure", order: 3, title: "Đo lường", description: "Chấm điểm theo khung đánh giá." },
      { id: "benchmark", order: 4, title: "Benchmark", description: "Đối sánh với chuẩn phù hợp." },
      { id: "gap", order: 5, title: "Khoảng cách", description: "Xác định chênh lệch cần xử lý." },
      { id: "priority", order: 6, title: "Ưu tiên", description: "Chốt các sáng kiến trọng tâm." }
    ]
  },
  {
    id: "c02-03",
    eyebrow: "Chiến lược & kiến trúc",
    title: "Chiến lược, lộ trình và kiến trúc doanh nghiệp",
    subtitle: "Từ tầm nhìn mục tiêu đến bản đồ triển khai rõ ràng",
    visualType: "architecture-stack",
    referenceImage: "/references/c02/C02-03-chien-luoc-lo-trinh-kien-truc-doanh-nghiep.png",
    routes: ["/dich-vu/chuyen-doi-so", "/ve-x/nang-luc"],
    items: [
      { id: "business", title: "Kiến trúc kinh doanh", description: "Mô hình kinh doanh, năng lực cốt lõi và định hướng tăng trưởng." },
      { id: "data-app", title: "Kiến trúc dữ liệu & ứng dụng", description: "Quản trị dữ liệu, danh mục ứng dụng và luồng tích hợp." },
      { id: "technology-security", title: "Kiến trúc công nghệ & an toàn", description: "Hạ tầng linh hoạt, bảo mật, tuân thủ và nền tảng công nghệ." }
    ],
    process: [
      { id: "orient", order: 1, title: "Định hướng", description: "Phân tích hiện trạng, xác định mục tiêu và ưu tiên." },
      { id: "design", order: 2, title: "Thiết kế", description: "Thiết kế mô hình kiến trúc tổng thể và kế hoạch chi tiết." },
      { id: "implement", order: 3, title: "Triển khai", description: "Thực hiện theo lộ trình và quản trị thay đổi." },
      { id: "scale", order: 4, title: "Mở rộng", description: "Đo lường, tối ưu và mở rộng liên tục." }
    ]
  },
  {
    id: "c02-04",
    eyebrow: "Quy trình & tự động hóa",
    title: "Tái thiết kế quy trình và tự động hóa",
    subtitle: "Từ quy trình thủ công đến vận hành số thông minh",
    visualType: "process-evolution",
    referenceImage: "/references/c02/C02-04-tai-thiet-ke-quy-trinh-va-tu-dong-hoa.png",
    routes: ["/dich-vu/chuyen-doi-so", "/giai-phap/chuyen-doi-so"],
    items: [
      { id: "manual", order: 1, title: "Quy trình thủ công", description: "Thao tác thủ công, tài liệu rời rạc, dễ sai sót và khó theo dõi." },
      { id: "digital", order: 2, title: "Quy trình số", description: "Số hóa quy trình, dữ liệu tập trung, minh bạch và dễ truy xuất." },
      { id: "workflow", order: 3, title: "Workflow tự động", description: "Tự động hóa luồng công việc, đúng quy trình và giảm chờ đợi." },
      { id: "ai", order: 4, title: "AI hỗ trợ", description: "AI phân tích, gợi ý và hỗ trợ ra quyết định thông minh." }
    ],
    process: [
      { id: "discover", order: 1, title: "Khám phá quy trình", description: "Phân tích hiện trạng và xác định điểm nghẽn." },
      { id: "bpmn", order: 2, title: "Thiết kế BPMN", description: "Chuẩn hóa quy trình để dễ hiểu và tối ưu." },
      { id: "workflow-engine", order: 3, title: "Workflow", description: "Xây dựng và quản lý luồng công việc linh hoạt." },
      { id: "rpa", order: 4, title: "RPA", description: "Tự động hóa tác vụ lặp lại trên hệ thống." },
      { id: "ai-agent", order: 5, title: "AI Agent", description: "AI hiểu ngữ cảnh, gợi ý và tự động xử lý." },
      { id: "human-approval", order: 6, title: "Phê duyệt con người", description: "Kiểm soát tại các điểm quyết định quan trọng." }
    ]
  },
  {
    id: "c02-05",
    eyebrow: "Dữ liệu & phân tích",
    title: "Nền tảng dữ liệu và phân tích doanh nghiệp",
    subtitle: "Kết nối nguồn dữ liệu, chuẩn hóa, phân tích và kích hoạt giá trị",
    visualType: "data-platform",
    referenceImage: "/references/c02/C02-05-nen-tang-du-lieu-va-phan-tich-doanh-nghiep.png",
    routes: ["/dich-vu/chuyen-doi-so", "/giai-phap/chuyen-doi-so"],
    items: [
      { id: "erp", title: "ERP", description: "Dữ liệu tài chính và vận hành." },
      { id: "crm", title: "CRM", description: "Dữ liệu khách hàng và bán hàng." },
      { id: "hrm", title: "HRM", description: "Dữ liệu nhân sự." },
      { id: "iot", title: "IoT", description: "Dữ liệu thiết bị và cảm biến." },
      { id: "documents", title: "Tài liệu", description: "Dữ liệu phi cấu trúc nội bộ." },
      { id: "external", title: "Dữ liệu bên ngoài", description: "Dữ liệu thị trường và đối tác." }
    ],
    process: [
      { id: "ingestion", title: "Tích hợp & thu thập", description: "Kết nối đa nguồn, ETL/ELT, chuẩn hóa và luồng thời gian thực." },
      { id: "lakehouse", title: "Lakehouse / DWH", description: "Kho dữ liệu tập trung, sẵn sàng cho báo cáo và AI." },
      { id: "governance", title: "Quản trị & chất lượng", description: "Quản trị, chất lượng, bảo mật, phân quyền và tuân thủ." },
      { id: "consumption", title: "BI / Phân tích / Báo cáo / AI", description: "Khai thác dữ liệu để hỗ trợ quyết định và tự động hóa." }
    ]
  },
  {
    id: "c02-06",
    eyebrow: "Ứng dụng & tích hợp",
    title: "Hiện đại hóa ứng dụng và tích hợp hệ thống",
    subtitle: "Kết nối hệ thống hiện hữu với nền tảng số linh hoạt",
    visualType: "integration-hub",
    referenceImage: "/references/c02/C02-06-hien-dai-hoa-ung-dung-va-tich-hop-he-thong.png",
    routes: ["/dich-vu/chuyen-doi-so", "/trien-khai"],
    items: [
      { id: "legacy-erp", title: "ERP cũ", description: "Hệ thống nghiệp vụ hiện hữu." },
      { id: "legacy-crm", title: "CRM cũ", description: "Hệ thống khách hàng hiện hữu." },
      { id: "internal", title: "Phần mềm nội bộ", description: "Ứng dụng đặc thù doanh nghiệp." },
      { id: "files", title: "Excel / File", description: "Dữ liệu rời rạc cần tích hợp." },
      { id: "web", title: "Web", description: "Ứng dụng web hiện đại." },
      { id: "mobile", title: "Mobile", description: "Ứng dụng di động." },
      { id: "cloud", title: "Cloud", description: "Nền tảng đám mây." },
      { id: "new-apps", title: "Ứng dụng mới", description: "Ứng dụng số linh hoạt." }
    ],
    process: [
      { id: "api", title: "API Gateway", description: "Quản lý, bảo mật và kiểm soát truy cập API." },
      { id: "microservices", title: "Microservices", description: "Kiến trúc linh hoạt, dễ phát triển và bảo trì." },
      { id: "event-bus", title: "Event Bus", description: "Kết nối và xử lý sự kiện thời gian thực." },
      { id: "cloud-native", title: "Cloud Native", description: "Tối ưu hiệu năng, tự động mở rộng." },
      { id: "devsecops", title: "DevSecOps", description: "Phát triển nhanh, an toàn và vận hành tin cậy." },
      { id: "migration", title: "Migration", description: "Đánh giá, chuyển đổi an toàn và hiệu quả." }
    ]
  },
  {
    id: "c02-07",
    eyebrow: "Quản trị thay đổi",
    title: "Quản trị thay đổi và thúc đẩy sử dụng",
    subtitle: "Đồng thuận tổ chức, nâng cao năng lực và gia tăng mức độ áp dụng",
    visualType: "adoption-journey",
    referenceImage: "/references/c02/C02-07-quan-tri-thay-doi-va-thuc-day-su-dung.png",
    routes: ["/dich-vu/chuyen-doi-so", "/ve-x/nang-luc"],
    items: [
      { id: "leaders", title: "Lãnh đạo", description: "Định hướng chiến lược, truyền cảm hứng và loại bỏ rào cản." },
      { id: "managers", title: "Quản lý", description: "Triển khai nhất quán, theo dõi tiến độ và hỗ trợ đội ngũ." },
      { id: "employees", title: "Nhân viên", description: "Thấu hiểu lợi ích, sẵn sàng thay đổi và chủ động áp dụng." },
      { id: "key-users", title: "Key Users", description: "Đại sứ thay đổi, hỗ trợ đồng nghiệp và lan tỏa thực hành tốt." },
      { id: "digital-team", title: "IT / Digital Team", description: "Bảo đảm nền tảng ổn định, tích hợp hiệu quả và hỗ trợ kịp thời." }
    ],
    process: [
      { id: "awareness", order: 1, title: "Nhận thức", description: "Truyền thông rõ ràng về lý do và lợi ích thay đổi." },
      { id: "alignment", order: 2, title: "Đồng thuận", description: "Thống nhất mục tiêu, vai trò và cam kết." },
      { id: "training", order: 3, title: "Đào tạo", description: "Trang bị kiến thức và kỹ năng để tự tin áp dụng." },
      { id: "pilot", order: 4, title: "Thử nghiệm", description: "Thử nghiệm có kiểm soát, học nhanh và điều chỉnh." },
      { id: "adoption", order: 5, title: "Áp dụng", description: "Triển khai rộng rãi và đưa vào quy trình làm việc." },
      { id: "measure", order: 6, title: "Đo lường", description: "Theo dõi chỉ số sử dụng và tác động." },
      { id: "improve", order: 7, title: "Cải tiến", description: "Tối ưu liên tục dựa trên phản hồi và dữ liệu." }
    ]
  },
  {
    id: "c02-08",
    eyebrow: "Vận hành chuyển đổi số",
    title: "Vận hành chuyển đổi số và cải tiến liên tục",
    subtitle: "Theo dõi tiến độ, đo lường giá trị và tối ưu bền vững",
    visualType: "control-tower",
    referenceImage: "/references/c02/C02-08-van-hanh-chuyen-doi-so-va-cai-tien-lien-tuc.png",
    routes: ["/dich-vu", "/dich-vu/chuyen-doi-so"],
    items: [
      { id: "portfolio", order: 1, title: "Danh mục dự án", description: "Quản lý danh mục, ưu tiên và theo dõi tiến độ các dự án chuyển đổi số.", side: "left" },
      { id: "kpi", order: 2, title: "KPI", description: "Theo dõi KPI then chốt, hiệu suất và mức độ hoàn thành mục tiêu.", side: "left" },
      { id: "budget", order: 3, title: "Ngân sách", description: "Quản lý ngân sách, chi phí và tối ưu hiệu quả đầu tư.", side: "left" },
      { id: "risk", order: 4, title: "Rủi ro", description: "Nhận diện, đánh giá và giám sát rủi ro để chủ động ứng phó.", side: "left" },
      { id: "adoption", order: 5, title: "Mức độ áp dụng", description: "Đo lường mức độ áp dụng giải pháp, mức độ sử dụng và thay đổi hành vi.", side: "right" },
      { id: "benefits", order: 6, title: "Lợi ích đạt được", description: "Đo lường lợi ích định lượng và định tính từ chương trình chuyển đổi số.", side: "right" },
      { id: "support", order: 7, title: "Hỗ trợ", description: "Tiếp nhận yêu cầu, xử lý sự cố và hỗ trợ người dùng kịp thời.", side: "right" },
      { id: "continuous", order: 8, title: "Cải tiến liên tục", description: "Thu thập phản hồi, phân tích và cải tiến không ngừng.", side: "right" }
    ],
    process: [
      { id: "plan", order: 1, title: "Lập kế hoạch", description: "Xác định mục tiêu, phạm vi, lộ trình và nguồn lực." },
      { id: "deliver", order: 2, title: "Triển khai", description: "Thực thi kế hoạch, phối hợp và quản lý tiến độ." },
      { id: "measure", order: 3, title: "Đo lường", description: "Theo dõi dữ liệu, đánh giá hiệu suất và kết quả." },
      { id: "learn", order: 4, title: "Rút kinh nghiệm", description: "Phân tích bài học, điểm mạnh và điểm cần cải thiện." },
      { id: "optimize", order: 5, title: "Tối ưu", description: "Điều chỉnh, chuẩn hóa và tối ưu để tạo giá trị cao hơn." }
    ],
    outcomes: [
      { id: "control", title: "Kiểm soát toàn diện", description: "Minh bạch dữ liệu, quản trị chặt chẽ và giảm thiểu rủi ro." },
      { id: "decision", title: "Ra quyết định kịp thời", description: "Dữ liệu chính xác, thông tin tức thời và hành động nhanh chóng." },
      { id: "longterm", title: "Tạo giá trị dài hạn", description: "Tối ưu liên tục, nâng cao năng lực và đồng hành cùng tăng trưởng." }
    ]
  }
];
