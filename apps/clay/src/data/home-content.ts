/**
 * Corporate homepage content (from XTECH_HOMEPAGE_CLAUDE_HANDOFF_V1).
 * TEMPORARY typed source for fast visual review — will move to CMS-driven
 * (same shape) as the immediate follow-up. Section titles carry explicit
 * semantic line breaks (`lines: string[]`) per the "xuống dòng đúng ngữ nghĩa" rule.
 */

export type HomeIconItem = {
  id?: string;
  order?: number;
  title: string;
  description: string;
  href?: string;
  icon: string;
};

export type SectionTitle = { eyebrow: string; lines: string[]; subtitle?: string; highlight?: string[] };

export const homeSectionTitles: Record<string, SectionTitle> = {
  solutions: {
    eyebrow: "Giải pháp XTECH",
    lines: ["Bắt đầu từ bài toán", "của doanh nghiệp"],
    highlight: ["bài toán", "doanh nghiệp"],
    subtitle: "Từ chuyển đổi số, dữ liệu & AI đến tự động hóa và tích hợp hệ thống.",
  },
  products: {
    eyebrow: "Hệ sinh thái XTECH",
    lines: ["Năm sản phẩm cốt lõi", "trong hệ sinh thái XTECH"],
    highlight: ["cốt lõi", "XTECH"],
    subtitle: "Mỗi sản phẩm giải quyết một nhóm nghiệp vụ riêng, kết nối trên một nền tảng dữ liệu, quy trình và AI dùng chung.",
  },
  platform: {
    eyebrow: "Nền tảng dùng chung XTECH",
    lines: ["Một nền tảng dùng chung", "cho dữ liệu, quy trình và AI"],
    highlight: ["dữ liệu, quy trình", "AI"],
    subtitle: "Dữ liệu, workflow, định danh, tích hợp và AI kết nối toàn bộ hệ sinh thái.",
  },
  suites: {
    eyebrow: "Bộ giải pháp XTECH",
    lines: ["Bộ giải pháp X", "theo bài toán doanh nghiệp"],
    highlight: ["X", "doanh nghiệp"],
    subtitle: "XTECH đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp phù hợp với từng mô hình doanh nghiệp.",
  },
  services: {
    eyebrow: "Dịch vụ chuyển đổi số XTECH",
    lines: ["Từ chiến lược", "đến vận hành số"],
    highlight: ["vận hành số"],
    subtitle: "XTECH đồng hành end-to-end từ đánh giá hiện trạng đến triển khai, đào tạo và tối ưu liên tục.",
  },
  deployment: {
    eyebrow: "Triển khai & vận hành",
    lines: ["Linh hoạt mọi mô hình", "triển khai hạ tầng"],
    highlight: ["mọi mô hình"],
    subtitle: "SaaS, Private Cloud, On-premise hoặc Hybrid — theo yêu cầu nghiệp vụ và tuân thủ.",
  },
  value: {
    eyebrow: "Giá trị kinh doanh",
    lines: ["Vì sao doanh nghiệp", "chọn XTECH"],
    highlight: ["XTECH"],
    subtitle: "Công nghệ phục vụ mục tiêu kinh doanh — không phải công nghệ vì công nghệ.",
  },
  customers: {
    eyebrow: "Khách hàng & Insights",
    lines: ["Được tin dùng", "và chia sẻ tri thức"],
    highlight: ["tin dùng", "tri thức"],
    subtitle: "Câu chuyện khách hàng và góc nhìn chuyên môn về công nghệ bất động sản.",
  },
};

/** Shared-platform capability chips (Products + Platform bottom rows). */
export const homePlatformChips: HomeIconItem[] = [
  { title: "Data", description: "", icon: "data" },
  { title: "API", description: "", icon: "api" },
  { title: "Identity", description: "", icon: "identity" },
  { title: "Workflow", description: "", icon: "workflow" },
  { title: "Cloud", description: "", icon: "cloud" },
  { title: "Security", description: "", icon: "security" },
  { title: "Analytics", description: "", icon: "analytics" },
];

/** Bottom benefit strips per section (mirrors the reference infographics). */
export const homeSolutionBenefits: HomeIconItem[] = [
  { title: "Rõ mục tiêu", description: "Xác định đúng vấn đề, đặt mục tiêu đo lường được.", icon: "assessment" },
  { title: "Dữ liệu thông suốt", description: "Kết nối dữ liệu xuyên suốt, đúng – đủ – tin cậy.", icon: "data" },
  { title: "Tăng hiệu suất", description: "Tối ưu quy trình, ra quyết định nhanh và chính xác.", icon: "productivity" },
  { title: "Giảm rủi ro", description: "Quản trị minh bạch, tuân thủ và an toàn.", icon: "risk" },
  { title: "Sẵn sàng mở rộng", description: "Nền tảng linh hoạt, mở rộng theo nhu cầu.", icon: "growth" },
];
export const homeProductCallouts: HomeIconItem[] = [
  { title: "Bảo mật & Tuân thủ", description: "Tiêu chuẩn bảo mật cao, tuân thủ quy định và kiểm soát truy cập chặt chẽ.", icon: "security" },
  { title: "Linh hoạt & Mở rộng", description: "Kiến trúc mở, dễ tích hợp và mở rộng theo nhu cầu doanh nghiệp.", icon: "integration" },
  { title: "AI phục vụ nghiệp vụ", description: "AI và dữ liệu dùng chung giúp tự động hóa, dự báo và ra quyết định thông minh.", icon: "ai" },
];
export const homeServiceCapabilities: HomeIconItem[] = [
  { title: "Business Process", description: "Tối ưu quy trình, chuẩn hóa vận hành và nâng cao hiệu suất tổ chức.", icon: "workflow" },
  { title: "Data Architecture", description: "Xây dựng kiến trúc dữ liệu hiện đại, kết nối và khai thác hiệu quả.", icon: "data" },
  { title: "Enterprise Applications", description: "Triển khai ứng dụng doanh nghiệp linh hoạt, tích hợp và mở rộng.", icon: "development" },
  { title: "AI & Automation", description: "Ứng dụng AI và tự động hóa để tăng năng suất và ra quyết định thông minh.", icon: "automation" },
  { title: "Cloud & Security", description: "Hạ tầng đám mây linh hoạt, an toàn và tuân thủ tiêu chuẩn quốc tế.", icon: "cloud" },
  { title: "Change Management", description: "Quản trị thay đổi, truyền thông và đồng hành để chuyển đổi bền vững.", icon: "customer" },
];
export const homeServiceBenefits: HomeIconItem[] = [
  { title: "Đồng hành end-to-end", description: "Từ tư vấn đến vận hành và tối ưu liên tục.", icon: "delivery" },
  { title: "Giải pháp tùy biến", description: "Phù hợp đặc thù ngành nghề và mục tiêu doanh nghiệp.", icon: "solution-design" },
  { title: "Đội ngũ chuyên gia", description: "Giàu kinh nghiệm, am hiểu công nghệ và nghiệp vụ.", icon: "consulting" },
  { title: "Phương pháp hiện đại", description: "Agile, DevOps, Design Thinking — hiệu quả và linh hoạt.", icon: "architecture" },
  { title: "Hiệu quả đo lường", description: "Theo dõi KPI rõ ràng, tối ưu chi phí và ROI.", icon: "growth" },
];
export const homeSuiteBenefits: HomeIconItem[] = [
  { title: "Liền mạch dữ liệu", description: "Kết nối xuyên suốt toàn bộ hành trình.", icon: "integration" },
  { title: "Nhanh hơn triển khai", description: "Có sẵn quy trình và best practice.", icon: "delivery" },
  { title: "Phù hợp theo mô hình", description: "Linh hoạt cấu hình theo từng doanh nghiệp.", icon: "solution-design" },
  { title: "Có thể mở rộng", description: "Dễ mở rộng khi doanh nghiệp phát triển.", icon: "growth" },
];

/** Numbered business journey for the real-estate suite (H05 orbit). */
export const homeSuiteJourney = [
  { icon: "marketing", label: "Marketing" },
  { icon: "crm", label: "Lead & CRM" },
  { icon: "booking", label: "Bảng hàng & Booking" },
  { icon: "contract", label: "Hợp đồng" },
  { icon: "payment", label: "Thanh toán" },
  { icon: "handover", label: "Bàn giao" },
  { icon: "operations", label: "Vận hành" },
  { icon: "care", label: "Chăm sóc" },
];

export const homeHero = {
  eyebrow: "XTECH • Enterprise Technology & AI",
  // Semantic line breaks for the H1 (2 lines).
  titleLines: ["Hệ sinh thái công nghệ", "và AI cho doanh nghiệp số"],
  description:
    "Kết nối dữ liệu, số hóa quy trình, vận hành sản phẩm và kích hoạt trí tuệ nhân tạo trên một nền tảng linh hoạt.",
  primaryCta: { label: "Khám phá hệ sinh thái", href: "/san-pham" },
  secondaryCta: { label: "Trao đổi với chuyên gia", href: "/lien-he" },
  capabilities: ["Sản phẩm", "Giải pháp", "Dịch vụ", "Triển khai", "Vận hành dài hạn"],
};

export const homeSolutions: HomeIconItem[] = [
  { id: "transformation", title: "Chuyển đổi số", description: "Chiến lược, lộ trình và kiến trúc số.", href: "/giai-phap/chuyen-doi-so", icon: "transformation" },
  { id: "data-ai", title: "Dữ liệu & AI", description: "Kết nối dữ liệu, BI, tri thức và AI Agent.", href: "/giai-phap/du-lieu-va-ai", icon: "ai" },
  { id: "automation", title: "Tự động hóa", description: "Workflow, quy trình và AI hỗ trợ quyết định.", href: "/giai-phap/tu-dong-hoa", icon: "automation" },
  { id: "integration", title: "Tích hợp hệ thống", description: "ERP, CRM, HRM, API và dữ liệu xuyên suốt.", href: "/giai-phap/tich-hop-he-thong", icon: "integration" },
  { id: "connected", title: "Doanh nghiệp kết nối", description: "Kết nối trải nghiệm, ứng dụng, dữ liệu và vận hành.", href: "/giai-phap/doanh-nghiep-ket-noi", icon: "connected-enterprise" },
];

export const homeProducts: HomeIconItem[] = [
  { id: "x-ai", title: "X.AI", description: "Nhập liệu thông minh, báo cáo, tri thức doanh nghiệp và AI Agent.", href: "/san-pham/x-ai", icon: "ai" },
  { id: "xbooking", title: "XBooking", description: "Marketing, CRM, bảng hàng, booking và chăm sóc khách hàng bất động sản.", href: "/san-pham/xbooking", icon: "xbooking" },
  { id: "finerp", title: "FinERP", description: "Tài chính, kế toán, công nợ, ngân sách và vận hành doanh nghiệp.", href: "/san-pham/finerp", icon: "finerp" },
  { id: "xbuilding", title: "XBuilding", description: "Quản lý cư dân, vận hành tòa nhà, dịch vụ, thiết bị và bảo trì.", href: "/san-pham/xbuilding", icon: "xbuilding" },
  { id: "x-space", title: "X.Space", description: "Cộng tác, công việc, tài liệu và tri thức nội bộ.", href: "/san-pham/x-space", icon: "xspace" },
];

export const homePlatformLayers = [
  { id: "products", label: "Sản phẩm", items: ["XBooking", "FinERP", "XBuilding", "X.Space", "X.AI"] },
  { id: "ai-analytics", label: "AI & Analytics", items: ["AI Services", "Analytics"] },
  { id: "workflow", label: "Workflow • Identity • API", items: ["Workflow", "Identity", "API"] },
  { id: "data", label: "Data Platform", items: ["Data"] },
  { id: "cloud", label: "Cloud & Security", items: ["Cloud", "Security"] },
];

export const homeSolutionSuites: HomeIconItem[] = [
  { id: "real-estate", title: "Chủ đầu tư bất động sản", description: "Marketing → Lead → Booking → Hợp đồng → Thanh toán → Bàn giao → Vận hành → Chăm sóc.", href: "/bo-giai-phap-x/chu-dau-tu-bat-dong-san", icon: "xbuilding" },
  { id: "digital-enterprise", title: "Doanh nghiệp số", description: "ERP + Workspace + Data + Automation + AI.", href: "/bo-giai-phap-x/doanh-nghiep-so", icon: "finerp" },
  { id: "smart-building", title: "Tòa nhà thông minh", description: "Vận hành + Cư dân + Thiết bị + IoT + AI Operations.", href: "/bo-giai-phap-x/toa-nha-thong-minh", icon: "xbuilding" },
  { id: "finance-operations", title: "Tài chính & vận hành", description: "Kế toán + Công nợ + Dòng tiền + Ngân sách + Báo cáo + AI.", href: "/bo-giai-phap-x/tai-chinh-va-van-hanh", icon: "security" },
  { id: "enterprise-ai", title: "AI doanh nghiệp", description: "AI Agent + Knowledge & RAG + Governance + Integration.", href: "/bo-giai-phap-x/ai-doanh-nghiep", icon: "ai" },
];

export const homeServices: HomeIconItem[] = [
  { order: 1, title: "Khảo sát & đánh giá", description: "Hiểu rõ hiện trạng, xác định khoảng cách và cơ hội.", icon: "assessment" },
  { order: 2, title: "Chiến lược & kiến trúc", description: "Xây dựng chiến lược số và kiến trúc tổng thể.", icon: "architecture" },
  { order: 3, title: "Thiết kế giải pháp", description: "Thiết kế giải pháp tối ưu theo mục tiêu kinh doanh.", icon: "solution-design" },
  { order: 4, title: "Phát triển & tích hợp", description: "Phát triển, tích hợp hệ thống và kết nối dữ liệu.", icon: "development" },
  { order: 5, title: "Triển khai & đào tạo", description: "Triển khai thực tế, chuyển giao và đào tạo người dùng.", icon: "training" },
  { order: 6, title: "Vận hành & tối ưu", description: "Vận hành ổn định và tối ưu hiệu quả liên tục.", icon: "growth" },
];

export const homeDeployment: HomeIconItem[] = [
  { id: "saas", title: "SaaS", description: "Triển khai nhanh chóng, linh hoạt và sẵn sàng mở rộng.", icon: "saas" },
  { id: "private", title: "Private Cloud", description: "Vận hành an toàn trên hạ tầng riêng, tối ưu hiệu suất và chi phí.", icon: "private-cloud" },
  { id: "on-premise", title: "On-premise", description: "Kiểm soát toàn diện hệ thống và dữ liệu tại doanh nghiệp.", icon: "on-premise" },
  { id: "hybrid", title: "Hybrid", description: "Kết hợp linh hoạt nhiều môi trường theo yêu cầu nghiệp vụ.", icon: "hybrid" },
];

export const homeBusinessValues: HomeIconItem[] = [
  { title: "Tăng trưởng doanh thu", description: "Khai thác dữ liệu và tự động hóa để mở rộng thị trường và tăng tỷ lệ chuyển đổi.", icon: "growth" },
  { title: "Tối ưu chi phí", description: "Chuẩn hóa quy trình và ứng dụng AI để giảm chi phí vận hành.", icon: "cost" },
  { title: "Tăng năng suất", description: "Tự động hóa tác vụ lặp lại và hỗ trợ ra quyết định nhanh hơn.", icon: "productivity" },
  { title: "Nâng cao trải nghiệm", description: "Cá nhân hóa hành trình khách hàng, nhân viên và đối tác.", icon: "experience" },
  { title: "Giảm rủi ro", description: "Quản trị dữ liệu, phân quyền, truy vết và tuân thủ.", icon: "risk" },
];

export const homeWhyXtech: HomeIconItem[] = [
  { title: "Hiểu bài toán thực tế", description: "Đặt mục tiêu kinh doanh làm trọng tâm.", icon: "consulting" },
  { title: "Hệ sinh thái liên thông", description: "Tích hợp dữ liệu, quy trình và hệ thống trên một nền tảng.", icon: "integration" },
  { title: "Đồng hành end-to-end", description: "Tư vấn, triển khai, đào tạo và tối ưu liên tục.", icon: "delivery" },
  { title: "Linh hoạt và dài hạn", description: "SaaS, Private Cloud, On-premise và Hybrid.", icon: "longterm" },
];

/** Real-estate business flow, used by the Solution Suites section. */
export const homeWorkflow = [
  "Marketing", "Lead & CRM", "Bảng hàng & Booking", "Hợp đồng & Thanh toán",
  "Bàn giao", "Vận hành", "Chăm sóc", "Tái giao dịch",
];
