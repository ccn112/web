/**
 * Content for the corporate About page (SET C01). Data only — no rendering.
 * Copy is HTML/CMS-sourced (from the SET C01 handoff seed); images are never used for text.
 */
import {
  Brain, CalendarCheck, BarChart3, Building2, Users, Database, Cloud, Plug, Boxes,
  ShieldCheck, LineChart, Fingerprint, Workflow, Search, Target, PencilRuler,
  Cpu, Network, Link2, UserRound, Handshake, Sparkles, TrendingUp, BadgeDollarSign,
  Gauge, Headset, GraduationCap, RefreshCw, MonitorSmartphone, Mail, MessageCircle,
  Globe, Server, Leaf, ArrowUpDown, type LucideIcon,
} from "lucide-react";

export type Item = { name: string; icon: LucideIcon; tagline?: string; caps?: string[] };

export const PRODUCTS: Item[] = [
  { name: "X.AI", icon: Brain, tagline: "Trí tuệ doanh nghiệp", caps: ["Enterprise Agents", "Knowledge & RAG", "Automation", "Governance"] },
  { name: "XBooking", icon: CalendarCheck, tagline: "Quản lý bán hàng bất động sản", caps: ["CRM & Lead", "Bảng hàng", "Booking", "Hợp đồng"] },
  { name: "FinERP", icon: BarChart3, tagline: "Tài chính và vận hành doanh nghiệp", caps: ["Tài chính", "Dòng tiền", "Ngân sách", "Báo cáo"] },
  { name: "XBuilding", icon: Building2, tagline: "Quản lý tòa nhà và cư dân", caps: ["Vận hành", "Cư dân", "Dịch vụ", "Bảo trì"] },
  { name: "X.Space", icon: Users, tagline: "Cộng tác, công việc và tri thức", caps: ["Cộng tác", "Công việc", "Tài liệu", "Tri thức"] },
];

export const PLATFORM: { icon: LucideIcon; label: string }[] = [
  { icon: Database, label: "Data" },
  { icon: Plug, label: "API" },
  { icon: Fingerprint, label: "Identity" },
  { icon: Workflow, label: "Workflow" },
  { icon: Cloud, label: "Cloud" },
  { icon: ShieldCheck, label: "Security" },
  { icon: LineChart, label: "Analytics" },
];

export const CAPABILITIES = [
  { icon: Users, title: "Tư vấn chuyển đổi số", desc: "Định hướng chiến lược, đánh giá năng lực và xây dựng lộ trình chuyển đổi số phù hợp." },
  { icon: Boxes, title: "Phát triển sản phẩm", desc: "Thiết kế và phát triển sản phẩm số, ứng dụng web, mobile và nền tảng thế hệ mới." },
  { icon: Network, title: "Tích hợp hệ thống", desc: "Kết nối dữ liệu, tích hợp hệ thống và tối ưu luồng vận hành doanh nghiệp." },
  { icon: Headset, title: "Vận hành & tối ưu", desc: "Vận hành hệ thống ổn định, hỗ trợ 24/7 và liên tục tối ưu hiệu suất." },
];

export const STATS = [
  { value: "10+", label: "năm kinh nghiệm" },
  { value: "200+", label: "dự án triển khai" },
  { value: "100+", label: "khách hàng doanh nghiệp" },
  { value: "300+", label: "chuyên gia công nghệ" },
];

export const STAGES = [
  { icon: Search, title: "Khảo sát hiện trạng", desc: "Đánh giá toàn diện quy trình, dữ liệu, hệ thống và năng lực số của doanh nghiệp.", caps: ["Business Process", "Digital Maturity", "Pain Points"] },
  { icon: PencilRuler, title: "Kiến trúc mục tiêu", desc: "Xây dựng kiến trúc doanh nghiệp và lộ trình ưu tiên theo mục tiêu.", caps: ["Enterprise Architecture", "Data Architecture", "Roadmap"] },
  { icon: Boxes, title: "Thiết kế giải pháp", desc: "Thiết kế giải pháp phù hợp với chiến lược và thực tiễn vận hành.", caps: ["Solution Design", "UX", "Integration Design"] },
  { icon: Workflow, title: "Phát triển & tích hợp", desc: "Phát triển, tích hợp, kiểm thử và chuẩn bị dữ liệu cho vận hành.", caps: ["Development", "Integration", "Testing"] },
  { icon: RefreshCw, title: "Triển khai", desc: "Triển khai đồng bộ, đào tạo và chuyển đổi vận hành.", caps: ["Migration", "Training", "Go-live"] },
  { icon: Gauge, title: "Vận hành & tối ưu", desc: "Vận hành ổn định, hỗ trợ dài hạn và tối ưu liên tục.", caps: ["Support", "SLA", "Continuous Improvement"] },
];

export const PRINCIPLES = [
  { icon: Boxes, title: "Không chỉ cung cấp phần mềm", desc: "Giải pháp toàn diện, phù hợp chiến lược và mục tiêu dài hạn." },
  { icon: Link2, title: "Gắn công nghệ với quy trình", desc: "Công nghệ tạo giá trị khi gắn liền với quy trình vận hành." },
  { icon: Users, title: "Lấy con người làm trung tâm", desc: "Đào tạo, đồng hành và trao quyền để chuyển đổi thành công." },
];

export const LAYERS = [
  { n: "05", title: "Kênh trải nghiệm", desc: "Đa kênh – Liền mạch – Cá nhân hóa", items: [{ icon: Globe, label: "Web" }, { icon: MonitorSmartphone, label: "Mobile" }, { icon: Boxes, label: "Portal" }, { icon: MessageCircle, label: "Chat" }, { icon: Mail, label: "Email" }] },
  { n: "04", title: "Ứng dụng doanh nghiệp", desc: "Tích hợp toàn diện – Vận hành hiệu quả", items: [{ icon: Users, label: "CRM" }, { icon: BarChart3, label: "ERP" }, { icon: UserRound, label: "HRM" }, { icon: TrendingUp, label: "Sales" }, { icon: Building2, label: "Building" }, { icon: Boxes, label: "Collaboration" }] },
  { n: "03", title: "AI & tự động hóa", desc: "Thông minh – Chủ động – Tối ưu hiệu suất", items: [{ icon: Cpu, label: "Agent" }, { icon: Workflow, label: "Workflow" }, { icon: Brain, label: "RAG" }, { icon: LineChart, label: "Analytics" }] },
  { n: "02", title: "Dữ liệu & tích hợp", desc: "Kết nối linh hoạt – Dữ liệu thống nhất", items: [{ icon: Database, label: "Data Hub" }, { icon: Plug, label: "API Gateway" }, { icon: RefreshCw, label: "ETL" }, { icon: Network, label: "Event Bus" }] },
  { n: "01", title: "Hạ tầng & bảo mật", desc: "Vững chắc – An toàn – Sẵn sàng mở rộng", items: [{ icon: Cloud, label: "Cloud" }, { icon: Server, label: "On-premise" }, { icon: Fingerprint, label: "IAM" }, { icon: Gauge, label: "Monitoring" }, { icon: ShieldCheck, label: "Backup" }] },
];

export const VALUES = [
  { icon: TrendingUp, title: "Tăng trưởng doanh thu", desc: "Kích hoạt dữ liệu và quy trình để tạo thêm cơ hội tăng trưởng.", outcomes: ["Tăng conversion", "Tăng tốc bán hàng", "Mở rộng kênh"] },
  { icon: BadgeDollarSign, title: "Tối ưu chi phí", desc: "Giảm lãng phí và chi phí vận hành nhờ tự động hóa.", outcomes: ["Giảm thủ công", "Tối ưu nguồn lực", "Giảm lỗi"] },
  { icon: Gauge, title: "Tăng năng suất", desc: "Kết nối dữ liệu và quy trình để làm việc nhanh hơn.", outcomes: ["Rút ngắn thời gian", "Tăng thông lượng", "Hợp tác hiệu quả"] },
  { icon: Sparkles, title: "Nâng cao trải nghiệm", desc: "Tạo trải nghiệm liền mạch cho khách hàng và nhân viên.", outcomes: ["Phản hồi nhanh", "Cá nhân hóa", "Nhất quán"] },
  { icon: ShieldCheck, title: "Giảm rủi ro", desc: "Tăng khả năng kiểm soát, truy vết và tuân thủ.", outcomes: ["Audit trail", "Phân quyền", "Cảnh báo sớm"] },
  { icon: Database, title: "Dữ liệu minh bạch", desc: "Một nguồn dữ liệu thống nhất, chính xác và kịp thời.", outcomes: ["Realtime", "Chuẩn hóa", "Truy vết"] },
];

export const DEPLOY = [
  { icon: Cloud, title: "SaaS", desc: "Khởi động nhanh, thuê bao linh hoạt, luôn cập nhật." },
  { icon: ShieldCheck, title: "Private Cloud", desc: "Môi trường riêng, kiểm soát dữ liệu và tài nguyên." },
  { icon: Server, title: "On-premise", desc: "Toàn quyền hạ tầng, bảo mật và tích hợp chuyên sâu." },
  { icon: RefreshCw, title: "Hybrid", desc: "Kết hợp linh hoạt giữa cloud và on-premise." },
];

export const DELIVERY: { icon: LucideIcon; label: string }[] = [
  { icon: Search, label: "Khảo sát" },
  { icon: PencilRuler, label: "Thiết kế kiến trúc" },
  { icon: ArrowUpDown, label: "Migration" },
  { icon: Plug, label: "Integration" },
  { icon: GraduationCap, label: "Training" },
  { icon: Headset, label: "Support" },
  { icon: ShieldCheck, label: "SLA" },
  { icon: TrendingUp, label: "Continuous Improvement" },
];

export const STAKEHOLDERS = [
  { icon: Building2, title: "Doanh nghiệp", desc: "Hiểu nhu cầu – Đồng hành chiến lược – Tạo giá trị bền vững." },
  { icon: Handshake, title: "Đối tác công nghệ", desc: "Kết nối sức mạnh công nghệ – Đồng sáng tạo giải pháp." },
  { icon: Users, title: "Đội ngũ XTECH", desc: "Chuyên gia giàu kinh nghiệm – Tận tâm – Cam kết kết quả." },
  { icon: Boxes, title: "Hệ sinh thái sản phẩm", desc: "Giải pháp toàn diện – Linh hoạt – Tích hợp liền mạch." },
  { icon: UserRound, title: "Khách hàng & người dùng", desc: "Trải nghiệm vượt trội – Gia tăng hiệu quả – Phát triển bền vững." },
];

export const ROADMAP = [
  { n: "01", icon: Leaf, title: "Today", desc: "Xác định mục tiêu và nền tảng." },
  { n: "02", icon: Building2, title: "Digital Enterprise", desc: "Số hóa quy trình – Tối ưu vận hành – Nâng cao hiệu suất." },
  { n: "03", icon: Database, title: "Data-Driven Enterprise", desc: "Khai thác dữ liệu – Ra quyết định chính xác – Tăng trưởng dựa trên dữ liệu." },
  { n: "04", icon: Cpu, title: "AI-Powered Enterprise", desc: "Ứng dụng AI – Tự động hóa thông minh – Tạo lợi thế cạnh tranh." },
  { n: "05", icon: Network, title: "Intelligent Ecosystem", desc: "Kết nối toàn diện – Thích ứng linh hoạt – Phát triển bền vững." },
];

export const HUB_ICON = Target;
