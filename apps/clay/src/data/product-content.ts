/**
 * SET C03 — Product Ecosystem content (from XTECH_C03_CLAUDE_CODE_HANDOFF).
 * TEMPORARY typed source (CMS-driven later, same shape as homepage). Rendered by
 * ProductSections, dispatched by `layout`. Section titles carry a `highlight`
 * for keyword coloring; each item has an `icon` (handoff home SVG name).
 */

export type ProductLayout =
  | "orbit"
  | "hub-spoke"
  | "stack"
  | "journey"
  | "showcase"
  | "visual-left"
  | "visual-right"
  | "illustration";

export type ProductItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  badges?: string[];
};

export type ProductOutcome = { title: string; description: string; icon: string };

export type ProductSection = {
  sectionId: string;
  routes: string[];
  eyebrow: string;
  title: string;
  highlight?: string[];
  subtitle?: string;
  layout: ProductLayout;
  items: ProductItem[];
  outcomes?: ProductOutcome[];
  platformChips?: string[];
  cta?: { label: string; href: string };
  /** For layout "illustration": a real screenshot/dashboard image (public path). */
  image?: string;
  /** For layout "illustration": bullet highlights shown beside the image. */
  bullets?: string[];
};

const c03Sections: ProductSection[] = [
  {
    sectionId: "c03-01",
    routes: ["/san-pham"],
    eyebrow: "Hệ sinh thái sản phẩm",
    title: "Một hệ sinh thái, nhiều bài toán doanh nghiệp",
    highlight: ["hệ sinh thái", "doanh nghiệp"],
    subtitle: "Các sản phẩm XTECH kết nối trên nền dữ liệu, định danh, workflow, cloud, bảo mật và analytics dùng chung.",
    layout: "orbit",
    items: [
      { id: "x-ai", title: "X.AI", description: "Trí tuệ doanh nghiệp với agent, tri thức và tự động hóa.", icon: "ai", href: "/san-pham/x-ai", badges: ["Enterprise Agents", "Knowledge & RAG", "Automation"] },
      { id: "xbooking", title: "XBooking", description: "Quản lý bán hàng bất động sản từ marketing đến booking và CSKH.", icon: "xbooking", href: "/san-pham/xbooking", badges: ["CRM", "Bảng hàng", "Booking"] },
      { id: "finerp", title: "FinERP", description: "Tài chính và vận hành doanh nghiệp với dòng tiền, ngân sách và báo cáo.", icon: "finerp", href: "/san-pham/finerp", badges: ["Tài chính", "Dòng tiền", "Ngân sách"] },
      { id: "xbuilding", title: "XBuilding", description: "Quản lý tòa nhà và cư dân với ticket, phí, dịch vụ và bảo trì.", icon: "xbuilding", href: "/san-pham/xbuilding", badges: ["Cư dân", "Dịch vụ", "Bảo trì"] },
      { id: "x-space", title: "X.Space", description: "Cộng tác, công việc, tài liệu và tri thức trong một không gian số.", icon: "xspace", href: "/san-pham/x-space", badges: ["Cộng tác", "Công việc", "Tri thức"] },
    ],
    platformChips: ["Data", "API", "Identity", "Workflow", "Cloud", "Security", "Analytics"],
    cta: { label: "Bộ giải pháp X", href: "/bo-giai-phap-x" },
  },
  {
    sectionId: "c03-08",
    routes: ["/san-pham"],
    eyebrow: "Liên thông sản phẩm",
    title: "Nhiều điểm chạm, một dòng dữ liệu",
    highlight: ["một dòng dữ liệu"],
    subtitle: "Các sản phẩm XTECH liên thông để tạo chuỗi nghiệp vụ khép kín từ tương tác khách hàng đến vận hành doanh nghiệp.",
    layout: "journey",
    items: [
      { id: "marketing", title: "Marketing", description: "Tạo nhu cầu và thu hút khách hàng.", icon: "marketing" },
      { id: "sales", title: "Lead & Sales", description: "Theo dõi cơ hội và chuyển đổi bán hàng.", icon: "growth" },
      { id: "operation", title: "Vận hành", description: "Quản lý quy trình nội bộ và thực thi dịch vụ.", icon: "operations" },
      { id: "finance", title: "Tài chính", description: "Kiểm soát doanh thu, chi phí và công nợ.", icon: "cost" },
      { id: "customer", title: "Khách hàng", description: "Chăm sóc, phản hồi và giữ chân khách hàng.", icon: "customer" },
      { id: "insight", title: "Insight & AI", description: "Khai thác dữ liệu để tối ưu quyết định.", icon: "ai" },
    ],
    outcomes: [
      { title: "Dữ liệu thống nhất", description: "Một nguồn dữ liệu xuyên suốt cho nhiều sản phẩm.", icon: "data" },
      { title: "Quy trình liên thông", description: "Giảm nhập liệu lặp lại và tăng hiệu quả phối hợp.", icon: "workflow" },
      { title: "AI xuyên suốt", description: "AI hỗ trợ báo cáo, tư vấn và tự động hóa trên nhiều điểm chạm.", icon: "ai" },
    ],
    cta: { label: "Xem bộ giải pháp X", href: "/bo-giai-phap-x" },
  },
  {
    sectionId: "c03-02",
    routes: ["/san-pham/x-ai"],
    eyebrow: "X.AI",
    title: "Trí tuệ doanh nghiệp cho tự động hóa và ra quyết định",
    highlight: ["Trí tuệ doanh nghiệp"],
    subtitle: "Từ agent theo vai trò, nền tảng tri thức, RAG đến quản trị AI và triển khai doanh nghiệp.",
    layout: "showcase",
    items: [
      { id: "agents", title: "Enterprise Agents", description: "Sales, Finance, Operations, Customer Service, Executive Copilot.", icon: "ai" },
      { id: "rag", title: "Knowledge & RAG", description: "Kết nối tri thức nội bộ và trả lời theo ngữ cảnh doanh nghiệp.", icon: "data" },
      { id: "automation", title: "Automation", description: "Kích hoạt workflow và hành động tự động từ AI.", icon: "automation" },
      { id: "governance", title: "Governance", description: "Phân quyền, guardrails, log và kiểm soát chất lượng AI.", icon: "security" },
    ],
    cta: { label: "Đặt lịch demo X.AI", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-xbooking-hero",
    routes: ["/san-pham/xbooking"],
    eyebrow: "BÁN HÀNG BẤT ĐỘNG SẢN HỢP NHẤT",
    title: "XBooking — Từ marketing đến giao dịch trong một nền tảng",
    highlight: ["một nền tảng"],
    subtitle: "Hợp nhất marketing, thu lead đa nguồn, CRM, bảng hàng, booking, hợp đồng và chăm sóc khách hàng — quy trình khép kín, dữ liệu liên thông và kiểm soát bán hàng theo thời gian thực.",
    layout: "showcase",
    items: [
      { id: "marketing", title: "Marketing & Lead", description: "Marketing automation và thu lead đa nguồn về một đầu mối.", icon: "marketing" },
      { id: "crm", title: "CRM & Cơ hội", description: "Lead 360, chấm điểm, phân bổ và theo dõi pipeline.", icon: "crm" },
      { id: "inventory", title: "Bảng hàng", description: "Ma trận quỹ hàng, chi tiết căn và chính sách bán.", icon: "booking" },
      { id: "booking", title: "Booking & Lock", description: "Giữ chỗ, lock cọc và luồng phê duyệt booking.", icon: "handover" },
      { id: "contract", title: "Hợp đồng & Thanh toán", description: "Hồ sơ hợp đồng và tiến độ thanh toán theo đợt.", icon: "contract" },
      { id: "care", title: "Chăm sóc khách hàng", description: "Hành trình trước – trong – sau bán trên một trục.", icon: "care" },
    ],
    cta: { label: "Đặt lịch demo XBooking", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-xbooking-x1",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Marketing Automation",
    title: "Chiến dịch marketing tự động hóa",
    subtitle: "Thiết kế hành trình chăm sóc đa kênh, kích hoạt kịch bản tự động và đo hiệu quả từng chiến dịch.",
    layout: "illustration",
    image: "/products/xbooking/xbk-02-marketing-automation.png",
    bullets: ["Đa kênh", "Kịch bản tự động", "Nuôi dưỡng lead", "A/B testing", "Đo hiệu quả"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x2",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Thu lead đa nguồn",
    title: "Gom lead từ mọi kênh về một đầu mối",
    subtitle: "Kết nối website, landing page, mạng xã hội, hotline và sàn — chuẩn hóa và chống trùng ngay khi lead vào.",
    layout: "illustration",
    image: "/products/xbooking/xbk-03-multi-source-lead-capture.png",
    bullets: ["Website & Landing", "Mạng xã hội", "Hotline", "Sàn & đối tác", "Chống trùng"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x3",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Lead 360",
    title: "Hồ sơ khách hàng 360 độ",
    subtitle: "Toàn bộ lịch sử tương tác, nhu cầu và trạng thái tư vấn của khách hàng trên một màn hình duy nhất.",
    layout: "illustration",
    image: "/products/xbooking/xbk-04-lead-360.png",
    bullets: ["Lịch sử tương tác", "Nhu cầu", "Nguồn lead", "Trạng thái", "Ghi chú tư vấn"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x4",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Lead Scoring",
    title: "Chấm điểm và ưu tiên lead",
    subtitle: "Tự động chấm điểm theo hành vi và mức độ sẵn sàng để đội sales tập trung vào cơ hội tiềm năng nhất.",
    layout: "illustration",
    image: "/products/xbooking/xbk-05-lead-scoring.png",
    bullets: ["Chấm điểm hành vi", "Mức độ sẵn sàng", "Ưu tiên", "Cảnh báo lead nóng", "Xếp hạng"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x5",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Phân bổ Lead",
    title: "Phân bổ lead cho đội sales",
    subtitle: "Chia lead tự động theo khu vực, năng lực và tải công việc — minh bạch và không bỏ sót cơ hội.",
    layout: "illustration",
    image: "/products/xbooking/xbk-06-lead-distribution.png",
    bullets: ["Theo khu vực", "Theo năng lực", "Cân tải", "Vòng xoay", "Nhận lead tức thì"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x6",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Sales Pipeline",
    title: "Quản lý pipeline và cơ hội",
    subtitle: "Theo dõi cơ hội qua từng giai đoạn, dự báo doanh số và đo hiệu suất từng nhân viên, từng đội.",
    layout: "illustration",
    image: "/products/xbooking/xbk-07-sales-pipeline.png",
    bullets: ["Giai đoạn cơ hội", "Dự báo doanh số", "Tỷ lệ chuyển đổi", "Hiệu suất sale", "Kanban"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x7",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Bảng hàng",
    title: "Ma trận quỹ hàng thời gian thực",
    subtitle: "Toàn cảnh quỹ hàng theo dự án, tòa, tầng và trạng thái — cập nhật tức thì khi có booking hay giao dịch.",
    layout: "illustration",
    image: "/products/xbooking/xbk-09-inventory-matrix.png",
    bullets: ["Theo dự án", "Theo tòa & tầng", "Trạng thái căn", "Chính sách giá", "Thời gian thực"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x8",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Chi tiết căn",
    title: "Hồ sơ chi tiết từng căn",
    subtitle: "Thông tin căn, giá, chính sách, hình ảnh và lịch sử giao dịch — hỗ trợ tư vấn nhanh và chính xác.",
    layout: "illustration",
    image: "/products/xbooking/xbk-10-property-detail.png",
    bullets: ["Thông số căn", "Giá & chính sách", "Hình ảnh", "Lịch sử", "Chủ sở hữu"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x9",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Lock & Booking",
    title: "Giữ chỗ và lock cọc",
    subtitle: "Giữ chỗ, lock cọc và giỏ giữ chỗ với thời hạn rõ ràng — tránh trùng bán và tranh chấp căn.",
    layout: "illustration",
    image: "/products/xbooking/xbk-11-lock-and-booking.png",
    bullets: ["Giữ chỗ", "Lock cọc", "Giỏ giữ chỗ", "Thời hạn", "Chống trùng bán"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x10",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Phê duyệt Booking",
    title: "Luồng phê duyệt booking",
    subtitle: "Chuẩn hóa quy trình duyệt booking đa cấp, minh bạch trạng thái và rút ngắn thời gian chốt.",
    layout: "illustration",
    image: "/products/xbooking/xbk-12-booking-approval.png",
    bullets: ["Duyệt đa cấp", "Trạng thái", "Lý do từ chối", "Nhật ký", "Thông báo"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x11",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Hợp đồng & Thanh toán",
    title: "Hợp đồng và tiến độ thanh toán",
    subtitle: "Quản lý hồ sơ hợp đồng và theo dõi tiến độ thanh toán theo từng đợt, cảnh báo đến hạn và quá hạn.",
    layout: "illustration",
    image: "/products/xbooking/xbk-15-contract-payment-progress.png",
    bullets: ["Hồ sơ hợp đồng", "Đợt thanh toán", "Đến hạn", "Quá hạn", "Đối soát"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-x12",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Chăm sóc khách hàng",
    title: "Chăm sóc trước – trong – sau bán",
    subtitle: "Theo dõi toàn bộ hành trình khách hàng, lịch chăm sóc và mức độ hài lòng để giữ chân và tái giới thiệu.",
    layout: "illustration",
    image: "/products/xbooking/xbk-16-customer-care.png",
    bullets: ["Hành trình khách", "Lịch chăm sóc", "Ticket", "Hài lòng", "Tái giới thiệu"],
    items: [],
  },
  {
    sectionId: "c03-xbooking-mobile",
    routes: ["/san-pham/xbooking"],
    eyebrow: "Mobile CRM",
    title: "CRM di động cho đội sales ngoài hiện trường",
    highlight: ["đội sales"],
    subtitle: "Ứng dụng di động giúp sale nhận lead, tra bảng hàng, tạo booking và cập nhật cơ hội ngay tại dự án.",
    layout: "illustration",
    image: "/products/xbooking/xbk-08-mobile-crm-for-sales.png",
    bullets: ["Nhận lead tức thì", "Tra bảng hàng", "Tạo booking", "Cập nhật cơ hội", "Thông báo đẩy"],
    items: [],
  },
  {
    sectionId: "c03-finerp-hero",
    routes: ["/san-pham/finerp"],
    eyebrow: "QUẢN TRỊ DOANH NGHIỆP HỢP NHẤT",
    title: "FinERP — Tài chính và vận hành trong một nền tảng",
    highlight: ["một nền tảng"],
    subtitle: "Hợp nhất tài chính, kế toán, mua hàng, kho, tài sản và chi phí dự án — dữ liệu liên thông, kiểm soát chặt và báo cáo điều hành theo thời gian thực.",
    layout: "showcase",
    items: [
      { id: "tai-chinh", title: "Tài chính – Kế toán", description: "Doanh thu, chi phí, lợi nhuận, dòng tiền, công nợ và chứng từ.", icon: "finerp" },
      { id: "ngan-sach", title: "Ngân sách", description: "Lập, phân bổ và kiểm soát ngân sách theo phòng ban, dự án.", icon: "cost" },
      { id: "mua-hang", title: "Mua hàng", description: "Yêu cầu mua, báo giá, đơn mua và quản lý nhà cung cấp.", icon: "payment" },
      { id: "kho-tai-san", title: "Kho & Tài sản", description: "Nhập – xuất – tồn kho, máy móc, phương tiện và thiết bị.", icon: "operations" },
      { id: "chi-phi-du-an", title: "Chi phí dự án", description: "Ngân sách, chi phí thực tế, cam kết chi và hiệu quả dự án.", icon: "analytics" },
      { id: "mo-rong", title: "Nhân sự & mở rộng", description: "HRM, chấm công – lương, phê duyệt, hợp đồng và Report AI.", icon: "ai" },
    ],
    cta: { label: "Đặt lịch demo FinERP", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-finerp-f1",
    routes: ["/san-pham/finerp"],
    eyebrow: "Tài chính – Kế toán",
    title: "Dashboard điều hành tài chính",
    subtitle: "Theo dõi doanh thu, chi phí, lợi nhuận, dòng tiền và công nợ theo thời gian thực trên một màn hình.",
    layout: "illustration",
    image: "/products/finerp/ferp-02-finance.png",
    bullets: ["Doanh thu", "Chi phí", "Lợi nhuận", "Dòng tiền", "Công nợ", "So sánh kỳ"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f2",
    routes: ["/san-pham/finerp"],
    eyebrow: "Dòng tiền & Công nợ",
    title: "Kiểm soát dòng tiền và thu hồi công nợ",
    subtitle: "Nhìn rõ dòng tiền vào – ra, phải thu và cảnh báo quá hạn để chủ động thanh khoản.",
    layout: "illustration",
    image: "/products/finerp/ferp-03-cashflow.png",
    bullets: ["Dòng tiền vào", "Dòng tiền ra", "Phải thu", "Quá hạn", "Dự báo thanh khoản"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f3",
    routes: ["/san-pham/finerp"],
    eyebrow: "Kế toán & Chứng từ",
    title: "Nghiệp vụ kế toán và chứng từ số hóa",
    subtitle: "Số hóa hóa đơn, phiếu thu chi, bút toán với luồng phê duyệt và đối soát chặt chẽ.",
    layout: "illustration",
    image: "/products/finerp/ferp-05-accounting.png",
    bullets: ["Hóa đơn", "Phiếu thu", "Phiếu chi", "Bút toán", "Phê duyệt", "Đối soát"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f4",
    routes: ["/san-pham/finerp"],
    eyebrow: "Ngân sách",
    title: "Ngân sách và thực tế",
    subtitle: "So sánh ngân sách với thực chi theo phòng ban và dự án, phát hiện chênh lệch kịp thời.",
    layout: "illustration",
    image: "/products/finerp/ferp-04-budget.png",
    bullets: ["Ngân sách", "Thực tế", "Chênh lệch", "Theo phòng ban", "Theo dự án"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f5",
    routes: ["/san-pham/finerp"],
    eyebrow: "Mua hàng",
    title: "Mua hàng và nhà cung cấp",
    subtitle: "Chuẩn hóa quy trình từ yêu cầu mua, báo giá, đơn mua đến theo dõi giao hàng và nhà cung cấp.",
    layout: "illustration",
    image: "/products/finerp/ferp-06-procurement.png",
    bullets: ["Yêu cầu mua", "Báo giá", "Đơn mua", "Nhà cung cấp", "Giao hàng"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f6",
    routes: ["/san-pham/finerp"],
    eyebrow: "Kho & Tài sản",
    title: "Quản lý kho và tài sản",
    subtitle: "Kiểm soát nhập – xuất – tồn và vòng đời máy móc, phương tiện, thiết bị.",
    layout: "illustration",
    image: "/products/finerp/ferp-07-warehouse.png",
    bullets: ["Nhập kho", "Tồn kho", "Xuất kho", "Máy móc", "Phương tiện", "Thiết bị"],
    items: [],
  },
  {
    sectionId: "c03-finerp-f7",
    routes: ["/san-pham/finerp"],
    eyebrow: "Chi phí dự án",
    title: "Chi phí và hiệu quả dự án",
    subtitle: "Theo dõi ngân sách, chi phí thực tế, cam kết chi và hiệu quả theo tiến độ từng dự án.",
    layout: "illustration",
    image: "/products/finerp/ferp-08-project.png",
    bullets: ["Ngân sách", "Chi phí thực tế", "Cam kết chi", "Hiệu quả", "Tiến độ"],
    items: [],
  },
  {
    sectionId: "c03-finerp-ext",
    routes: ["/san-pham/finerp"],
    eyebrow: "Phân hệ mở rộng",
    title: "Vận hành doanh nghiệp toàn diện",
    highlight: ["toàn diện"],
    subtitle: "Ngoài lõi tài chính, FinERP mở rộng sang nhân sự, phê duyệt, hợp đồng, tài liệu và AI điều hành.",
    layout: "showcase",
    items: [
      { id: "hrm", title: "HRM & Nhân sự", description: "Hồ sơ nhân sự, tổ chức, phòng ban và vị trí.", icon: "customer" },
      { id: "payroll", title: "Chấm công & Lương", description: "Ca làm, bảng công, phụ cấp và bảng lương.", icon: "payment" },
      { id: "approval", title: "Approval Workflow", description: "Luồng phê duyệt đa cấp kèm ký số.", icon: "contract" },
      { id: "contract", title: "Hợp đồng", description: "Tạo, phê duyệt, ký số, hiệu lực và gia hạn.", icon: "contract" },
      { id: "docs", title: "Văn bản & Tài liệu", description: "Danh mục, tìm kiếm, phân quyền và phiên bản.", icon: "operations" },
      { id: "report-ai", title: "Report AI", description: "Tóm tắt, phân tích, xu hướng và hỏi đáp dữ liệu.", icon: "ai" },
      { id: "alert", title: "Cảnh báo điều hành", description: "Vượt ngân sách, đến hạn, quá hạn và rủi ro.", icon: "risk" },
      { id: "deploy", title: "Triển khai & Tích hợp", description: "On-premise, private cloud, API, ngân hàng, CRM, BI.", icon: "cloud" },
    ],
    cta: { label: "Đặt lịch demo FinERP", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-05",
    routes: ["/san-pham/xbuilding"],
    eyebrow: "XBuilding",
    title: "Vận hành tòa nhà và cư dân thông minh",
    highlight: ["tòa nhà và cư dân"],
    subtitle: "Quản lý cư dân, căn hộ, phí dịch vụ, ticket, thiết bị, bảo trì và IoT trên một hệ thống xuyên suốt.",
    layout: "orbit",
    items: [
      { id: "resident", title: "Cư dân", description: "Hồ sơ cư dân, liên hệ, xác thực và tương tác.", icon: "customer" },
      { id: "apartment", title: "Căn hộ", description: "Danh mục căn, trạng thái sử dụng và liên kết chủ sở hữu.", icon: "xbuilding" },
      { id: "service", title: "Dịch vụ & phí", description: "Quản lý biểu phí, hóa đơn và thanh toán.", icon: "payment" },
      { id: "ticket", title: "Ticket & CSKH", description: "Tiếp nhận và xử lý yêu cầu, phản ánh, sự cố.", icon: "support" },
      { id: "maintenance", title: "Thiết bị & bảo trì", description: "Lập kế hoạch bảo trì, theo dõi vòng đời tài sản.", icon: "operations" },
      { id: "iot", title: "IoT & năng lượng", description: "Theo dõi vận hành, cảm biến và tối ưu năng lượng.", icon: "cloud" },
    ],
    cta: { label: "Đặt lịch demo XBuilding", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-06",
    routes: ["/san-pham/x-space"],
    eyebrow: "X.Space",
    title: "Không gian số cho cộng tác, công việc và tri thức",
    highlight: ["cộng tác, công việc và tri thức"],
    subtitle: "Một môi trường làm việc số linh hoạt cho công tác, dự án, phê duyệt, tài liệu và tri thức nội bộ.",
    layout: "showcase",
    items: [
      { id: "work", title: "Công việc", description: "Theo dõi đầu việc, deadline, ưu tiên và hiệu suất.", icon: "productivity" },
      { id: "project", title: "Dự án", description: "Quản lý tiến độ, mốc, nguồn lực và phối hợp liên phòng ban.", icon: "workflow" },
      { id: "docs", title: "Tài liệu", description: "Lưu trữ và chia sẻ tài liệu có phân quyền.", icon: "contract" },
      { id: "approval", title: "Phê duyệt", description: "Luồng trình ký và phê duyệt nhanh trên web/mobile.", icon: "handover" },
      { id: "chat", title: "Trao đổi", description: "Kết nối đội ngũ qua chat, thông báo và hoạt động nhóm.", icon: "customer" },
      { id: "knowledge", title: "Tri thức", description: "Xây dựng kho tri thức nội bộ và khai thác cùng AI.", icon: "data" },
    ],
    cta: { label: "Đặt lịch demo X.Space", href: "/dat-lich-demo" },
  },
  {
    sectionId: "c03-07",
    routes: ["/san-pham/nen-tang-dung-chung"],
    eyebrow: "Nền tảng dùng chung",
    title: "Lớp nền tảng kết nối toàn bộ hệ sinh thái",
    highlight: ["nền tảng", "hệ sinh thái"],
    subtitle: "Dữ liệu, tích hợp, định danh, workflow, cloud, bảo mật và analytics tạo thành nền tảng mở rộng dài hạn.",
    layout: "stack",
    items: [
      { id: "data", title: "Data", description: "Dữ liệu tập trung và sẵn sàng phân tích.", icon: "data" },
      { id: "api", title: "API", description: "Kết nối dịch vụ và hệ thống linh hoạt.", icon: "api" },
      { id: "identity", title: "Identity", description: "Định danh, phân quyền và single sign-on.", icon: "identity" },
      { id: "workflow", title: "Workflow", description: "Luồng nghiệp vụ và tự động hóa xuyên sản phẩm.", icon: "workflow" },
      { id: "cloud", title: "Cloud", description: "Hạ tầng linh hoạt cho SaaS, private cloud và hybrid.", icon: "cloud" },
      { id: "security", title: "Security", description: "Bảo mật, giám sát và tuân thủ doanh nghiệp.", icon: "security" },
      { id: "analytics", title: "Analytics", description: "Báo cáo, dashboard và đo lường hiệu quả.", icon: "analytics" },
      { id: "ai-services", title: "AI Services", description: "Dịch vụ AI dùng chung cho agent, tri thức và automation.", icon: "ai" },
    ],
    platformChips: ["Data", "API", "Identity", "Workflow", "Cloud", "Security", "Analytics", "AI Services"],
    cta: { label: "Đặt lịch tư vấn nền tảng", href: "/lien-he" },
  },
];

/** C03 product-ecosystem sections. C04 implementation (implSections) is rendered
 *  by the bespoke ImplPages renderer, NOT the generic product orbit. */
export const productSections: ProductSection[] = [...c03Sections];

export function productSectionsForRoute(route: string): ProductSection[] {
  return productSections.filter((s) => s.routes.includes(route));
}
