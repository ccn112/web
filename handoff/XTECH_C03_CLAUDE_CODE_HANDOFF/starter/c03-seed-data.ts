import type { ProductSection } from './c03-types'

export const c03Sections: ProductSection[] = [
  {
    sectionId: 'c03-01',
    route: ['/san-pham'],
    eyebrow: 'HỆ SINH THÁI SẢN PHẨM',
    title: 'Một hệ sinh thái — Nhiều bài toán doanh nghiệp',
    subtitle: 'Các sản phẩm XTECH kết nối trên nền dữ liệu, định danh, workflow, cloud, bảo mật và analytics dùng chung.',
    layout: 'orbit',
    items: [
      { id: 'x-ai', title: 'X.AI', description: 'Trí tuệ doanh nghiệp với agent, tri thức và tự động hóa.', href: '/san-pham/x-ai', badges: ['Enterprise Agents', 'Knowledge & RAG', 'Automation'] },
      { id: 'xbooking', title: 'XBooking', description: 'Quản lý bán hàng bất động sản từ marketing đến booking và CSKH.', href: '/san-pham/xbooking', badges: ['CRM', 'Bảng hàng', 'Booking'] },
      { id: 'finerp', title: 'FinERP', description: 'Tài chính và vận hành doanh nghiệp với dòng tiền, ngân sách và báo cáo.', href: '/san-pham/finerp', badges: ['Tài chính', 'Dòng tiền', 'Ngân sách'] },
      { id: 'xbuilding', title: 'XBuilding', description: 'Quản lý tòa nhà và cư dân với ticket, phí, dịch vụ và bảo trì.', href: '/san-pham/xbuilding', badges: ['Cư dân', 'Dịch vụ', 'Bảo trì'] },
      { id: 'x-space', title: 'X.Space', description: 'Cộng tác, công việc, tài liệu và tri thức trong một không gian số.', href: '/san-pham/x-space', badges: ['Cộng tác', 'Công việc', 'Tri thức'] },
    ],
    platformChips: ['Data', 'API', 'Identity', 'Workflow', 'Cloud', 'Security', 'Analytics'],
    cta: { label: 'Khám phá sản phẩm', href: '/san-pham' }
  },
  {
    sectionId: 'c03-02',
    route: ['/san-pham/x-ai'],
    eyebrow: 'X.AI',
    title: 'Trí tuệ doanh nghiệp cho tự động hóa và ra quyết định',
    subtitle: 'Từ agent theo vai trò, nền tảng tri thức, RAG đến quản trị AI và triển khai doanh nghiệp.',
    layout: 'showcase',
    items: [
      { id: 'agents', title: 'Enterprise Agents', description: 'Sales, Finance, Operations, Customer Service, Executive Copilot.' },
      { id: 'rag', title: 'Knowledge & RAG', description: 'Kết nối tri thức nội bộ và trả lời theo ngữ cảnh doanh nghiệp.' },
      { id: 'automation', title: 'Automation', description: 'Kích hoạt workflow và hành động tự động từ AI.' },
      { id: 'governance', title: 'Governance', description: 'Phân quyền, guardrails, log và kiểm soát chất lượng AI.' },
    ],
    cta: { label: 'Xem chi tiết X.AI', href: '/san-pham/x-ai' }
  },
  {
    sectionId: 'c03-03',
    route: ['/san-pham/xbooking'],
    eyebrow: 'XBOOKING',
    title: 'Nền tảng bán hàng bất động sản từ lead đến giao dịch',
    subtitle: 'Tập trung dữ liệu khách hàng, bảng hàng, booking, hợp đồng và chăm sóc trong một quy trình khép kín.',
    layout: 'hub-spoke',
    items: [
      { id: 'marketing', title: 'Marketing & Lead', description: 'Thu lead đa nguồn và đồng bộ về một đầu mối.' },
      { id: 'crm', title: 'CRM & Cơ hội', description: 'Theo dõi tư vấn, cơ hội và hiệu suất đội sales.' },
      { id: 'inventory', title: 'Bảng hàng', description: 'Quản lý quỹ hàng, giỏ hàng và chính sách bán.' },
      { id: 'booking', title: 'Booking', description: 'Booking, lock cọc, giỏ giữ chỗ và phê duyệt.' },
      { id: 'contract', title: 'Hợp đồng', description: 'Quản lý hồ sơ và tiến độ thanh toán.' },
      { id: 'care', title: 'Chăm sóc khách hàng', description: 'Theo dõi hành trình trước – trong – sau bán.' },
    ],
    cta: { label: 'Xem chi tiết XBooking', href: '/san-pham/xbooking' }
  },
  {
    sectionId: 'c03-04',
    route: ['/san-pham/finerp'],
    eyebrow: 'FINERP',
    title: 'Tài chính và vận hành doanh nghiệp trong một nền tảng thống nhất',
    subtitle: 'Từ kế toán, công nợ, dòng tiền, ngân sách đến báo cáo điều hành.',
    layout: 'showcase',
    items: [
      { id: 'accounting', title: 'Kế toán', description: 'Quản lý nghiệp vụ tài chính theo chuẩn doanh nghiệp.' },
      { id: 'cashflow', title: 'Dòng tiền', description: 'Theo dõi luồng tiền vào ra và dự báo thanh khoản.' },
      { id: 'budget', title: 'Ngân sách', description: 'Kiểm soát ngân sách và phân bổ nguồn lực.' },
      { id: 'debt', title: 'Công nợ', description: 'Quản lý phải thu, phải trả và cảnh báo quá hạn.' },
      { id: 'reporting', title: 'Báo cáo điều hành', description: 'Dashboard KPI tài chính cho lãnh đạo.' },
    ],
    cta: { label: 'Xem chi tiết FinERP', href: '/san-pham/finerp' }
  },
  {
    sectionId: 'c03-05',
    route: ['/san-pham/xbuilding'],
    eyebrow: 'XBUILDING',
    title: 'Vận hành tòa nhà và cư dân thông minh',
    subtitle: 'Quản lý cư dân, căn hộ, phí dịch vụ, ticket, thiết bị, bảo trì và IoT trên một hệ thống xuyên suốt.',
    layout: 'orbit',
    items: [
      { id: 'resident', title: 'Cư dân', description: 'Hồ sơ cư dân, liên hệ, xác thực và tương tác.' },
      { id: 'apartment', title: 'Căn hộ', description: 'Danh mục căn, trạng thái sử dụng và liên kết chủ sở hữu.' },
      { id: 'service', title: 'Dịch vụ & phí', description: 'Quản lý biểu phí, hóa đơn và thanh toán.' },
      { id: 'ticket', title: 'Ticket & CSKH', description: 'Tiếp nhận và xử lý yêu cầu, phản ánh, sự cố.' },
      { id: 'maintenance', title: 'Thiết bị & bảo trì', description: 'Lập kế hoạch bảo trì, theo dõi vòng đời tài sản.' },
      { id: 'iot', title: 'IoT & năng lượng', description: 'Theo dõi vận hành, cảm biến và tối ưu năng lượng.' },
    ],
    cta: { label: 'Xem chi tiết XBuilding', href: '/san-pham/xbuilding' }
  },
  {
    sectionId: 'c03-06',
    route: ['/san-pham/x-space'],
    eyebrow: 'X.SPACE',
    title: 'Không gian số cho cộng tác, công việc và tri thức',
    subtitle: 'Một môi trường làm việc số linh hoạt cho công tác, dự án, phê duyệt, tài liệu và tri thức nội bộ.',
    layout: 'showcase',
    items: [
      { id: 'work', title: 'Công việc', description: 'Theo dõi đầu việc, deadline, ưu tiên và hiệu suất.' },
      { id: 'project', title: 'Dự án', description: 'Quản lý tiến độ, mốc, nguồn lực và phối hợp liên phòng ban.' },
      { id: 'docs', title: 'Tài liệu', description: 'Lưu trữ và chia sẻ tài liệu có phân quyền.' },
      { id: 'approval', title: 'Phê duyệt', description: 'Luồng trình ký và phê duyệt nhanh trên web/mobile.' },
      { id: 'chat', title: 'Trao đổi', description: 'Kết nối đội ngũ qua chat, thông báo và hoạt động nhóm.' },
      { id: 'knowledge', title: 'Tri thức', description: 'Xây dựng kho tri thức nội bộ và khai thác cùng AI.' },
    ],
    cta: { label: 'Xem chi tiết X.Space', href: '/san-pham/x-space' }
  },
  {
    sectionId: 'c03-07',
    route: ['/san-pham/nen-tang-dung-chung'],
    eyebrow: 'NỀN TẢNG DÙNG CHUNG',
    title: 'Lớp nền tảng kết nối toàn bộ hệ sinh thái XTECH',
    subtitle: 'Dữ liệu, tích hợp, định danh, workflow, cloud, bảo mật và analytics tạo thành nền tảng mở rộng dài hạn.',
    layout: 'stack',
    items: [
      { id: 'data', title: 'Data', description: 'Dữ liệu tập trung và sẵn sàng phân tích.' },
      { id: 'api', title: 'API', description: 'Kết nối dịch vụ và hệ thống linh hoạt.' },
      { id: 'identity', title: 'Identity', description: 'Định danh, phân quyền và single sign-on.' },
      { id: 'workflow', title: 'Workflow', description: 'Luồng nghiệp vụ và tự động hóa xuyên sản phẩm.' },
      { id: 'cloud', title: 'Cloud', description: 'Hạ tầng linh hoạt cho SaaS, private cloud và hybrid.' },
      { id: 'security', title: 'Security', description: 'Bảo mật, giám sát và tuân thủ doanh nghiệp.' },
      { id: 'analytics', title: 'Analytics', description: 'Báo cáo, dashboard và đo lường hiệu quả.' },
      { id: 'ai-services', title: 'AI Services', description: 'Dịch vụ AI dùng chung cho agent, tri thức và automation.' },
    ],
    platformChips: ['Data', 'API', 'Identity', 'Workflow', 'Cloud', 'Security', 'Analytics', 'AI Services'],
    cta: { label: 'Khám phá nền tảng', href: '/san-pham/nen-tang-dung-chung' }
  },
  {
    sectionId: 'c03-08',
    route: ['/san-pham', '/bo-giai-phap-x'],
    eyebrow: 'LIÊN THÔNG SẢN PHẨM',
    title: 'Một hệ sinh thái, nhiều điểm chạm nhưng một dòng dữ liệu',
    subtitle: 'Các sản phẩm XTECH liên thông để tạo chuỗi nghiệp vụ khép kín từ tương tác khách hàng đến vận hành doanh nghiệp.',
    layout: 'journey',
    items: [
      { id: 'marketing', title: 'Marketing', description: 'Tạo nhu cầu và thu hút khách hàng.' },
      { id: 'sales', title: 'Lead & Sales', description: 'Theo dõi cơ hội và chuyển đổi bán hàng.' },
      { id: 'operation', title: 'Vận hành', description: 'Quản lý quy trình nội bộ và thực thi dịch vụ.' },
      { id: 'finance', title: 'Tài chính', description: 'Kiểm soát doanh thu, chi phí và công nợ.' },
      { id: 'customer', title: 'Khách hàng', description: 'Chăm sóc, phản hồi và giữ chân khách hàng.' },
      { id: 'insight', title: 'Insight & AI', description: 'Khai thác dữ liệu để tối ưu quyết định.' },
    ],
    outcomes: [
      { title: 'Dữ liệu thống nhất', description: 'Một nguồn dữ liệu xuyên suốt cho nhiều sản phẩm.' },
      { title: 'Quy trình liên thông', description: 'Giảm nhập liệu lặp lại và tăng hiệu quả phối hợp.' },
      { title: 'AI xuyên suốt', description: 'AI hỗ trợ báo cáo, tư vấn và tự động hóa trên nhiều điểm chạm.' },
    ],
    cta: { label: 'Xem bộ giải pháp X', href: '/bo-giai-phap-x' }
  },
]
