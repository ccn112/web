import type { SolutionSuite } from './c05-types';

export const c05Suites: SolutionSuite[] = [
  {
    slug: 'chu-dau-tu-bat-dong-san',
    title: 'Chủ đầu tư bất động sản',
    summary: 'Liên thông marketing, bán hàng, tài chính, bàn giao và vận hành bất động sản.',
    businessJourney: [
      { order: 1, title: 'Marketing' },
      { order: 2, title: 'Lead & CRM' },
      { order: 3, title: 'Bảng hàng & Booking' },
      { order: 4, title: 'Hợp đồng & Thanh toán' },
      { order: 5, title: 'Bàn giao' },
      { order: 6, title: 'Vận hành & Chăm sóc' }
    ],
    products: [
      { productSlug: 'xbooking', role: 'core' },
      { productSlug: 'finerp', role: 'recommended' },
      { productSlug: 'xbuilding', role: 'recommended' },
      { productSlug: 'x-space', role: 'optional' },
      { productSlug: 'x-ai', role: 'recommended' }
    ],
    platformCapabilities: ['Data', 'Identity', 'Workflow', 'API', 'Security', 'Analytics'],
    services: [
      { serviceSlug: 'tu-van-chuyen-doi-so', role: 'core' },
      { serviceSlug: 'tich-hop-he-thong', role: 'core' },
      { serviceSlug: 'chuyen-doi-du-lieu', role: 'recommended' },
      { serviceSlug: 'dao-tao', role: 'core' },
      { serviceSlug: 'sla-va-ho-tro', role: 'core' }
    ],
    deploymentModels: ['saas', 'private-cloud', 'on-premise', 'hybrid'],
    outcomes: [
      { title: 'Kiểm soát giao dịch', description: 'Theo dõi xuyên suốt từ lead đến hợp đồng và thanh toán.' },
      { title: 'Dữ liệu khách hàng thống nhất', description: 'Một nguồn dữ liệu cho bán hàng, tài chính và chăm sóc.' },
      { title: 'Liên thông bàn giao và vận hành', description: 'Giảm đứt gãy dữ liệu sau bán.' }
    ],
    roadmap: [
      { phase: 1, title: 'Bài toán ưu tiên', description: 'CRM, bảng hàng và booking.' },
      { phase: 2, title: 'Liên thông giao dịch', description: 'Hợp đồng, thanh toán và tài chính.' },
      { phase: 3, title: 'Bàn giao & vận hành', description: 'Kết nối XBuilding và chăm sóc khách hàng.' },
      { phase: 4, title: 'Dữ liệu & AI', description: 'Báo cáo, AI Agent và tối ưu vận hành.' }
    ]
  },
  {
    slug: 'doanh-nghiep-so',
    title: 'Doanh nghiệp số',
    summary: 'Kết nối tài chính, công việc, quy trình, dữ liệu và AI trong một nền tảng đồng bộ.',
    businessJourney: [
      { order: 1, title: 'Tài chính & kế toán' },
      { order: 2, title: 'Công việc & dự án' },
      { order: 3, title: 'Workflow & phê duyệt' },
      { order: 4, title: 'Dữ liệu & báo cáo' },
      { order: 5, title: 'AI hỗ trợ điều hành' }
    ],
    products: [
      { productSlug: 'finerp', role: 'core' },
      { productSlug: 'x-space', role: 'core' },
      { productSlug: 'x-ai', role: 'recommended' },
      { productSlug: 'xbooking', role: 'not-applicable' },
      { productSlug: 'xbuilding', role: 'optional' }
    ],
    platformCapabilities: ['Data', 'Workflow', 'Identity', 'API', 'Security'],
    services: [
      { serviceSlug: 'tu-van-chuyen-doi-so', role: 'core' },
      { serviceSlug: 'tich-hop-he-thong', role: 'core' },
      { serviceSlug: 'dao-tao', role: 'core' },
      { serviceSlug: 'sla-va-ho-tro', role: 'core' }
    ],
    deploymentModels: ['saas', 'private-cloud', 'on-premise', 'hybrid'],
    outcomes: [
      { title: 'Chuẩn hóa quy trình', description: 'Giảm thao tác rời rạc giữa phòng ban.' },
      { title: 'Tăng năng suất', description: 'Cộng tác và phê duyệt nhanh hơn.' },
      { title: 'Điều hành dựa trên dữ liệu', description: 'Dashboard và AI hỗ trợ quyết định.' }
    ],
    roadmap: [
      { phase: 1, title: 'Chuẩn hóa', description: 'Tài chính, công việc và phê duyệt.' },
      { phase: 2, title: 'Kết nối', description: 'Liên thông dữ liệu và hệ thống hiện hữu.' },
      { phase: 3, title: 'Phân tích', description: 'Dashboard và báo cáo điều hành.' },
      { phase: 4, title: 'AI hóa', description: 'Agent và automation theo vai trò.' }
    ]
  },
  {
    slug: 'toa-nha-thong-minh',
    title: 'Tòa nhà thông minh',
    summary: 'Kết nối cư dân, dịch vụ, vận hành, thiết bị, an ninh và IoT.',
    businessJourney: [
      { order: 1, title: 'Cư dân' },
      { order: 2, title: 'Dịch vụ & phí' },
      { order: 3, title: 'Ticket & CSKH' },
      { order: 4, title: 'Thiết bị & bảo trì' },
      { order: 5, title: 'IoT & năng lượng' },
      { order: 6, title: 'Báo cáo điều hành' }
    ],
    products: [
      { productSlug: 'xbuilding', role: 'core' },
      { productSlug: 'x-ai', role: 'recommended' },
      { productSlug: 'x-space', role: 'recommended' },
      { productSlug: 'finerp', role: 'optional' },
      { productSlug: 'xbooking', role: 'not-applicable' }
    ],
    platformCapabilities: ['Data', 'API', 'Identity', 'Workflow', 'Security', 'IoT'],
    services: [
      { serviceSlug: 'tich-hop-he-thong', role: 'core' },
      { serviceSlug: 'chuyen-doi-du-lieu', role: 'recommended' },
      { serviceSlug: 'dao-tao', role: 'core' },
      { serviceSlug: 'sla-va-ho-tro', role: 'core' }
    ],
    deploymentModels: ['saas', 'private-cloud', 'on-premise', 'hybrid'],
    outcomes: [
      { title: 'Vận hành minh bạch', description: 'Theo dõi công việc, ticket và SLA.' },
      { title: 'Nâng cao trải nghiệm cư dân', description: 'Tương tác và dịch vụ trên một kênh thống nhất.' },
      { title: 'Quản lý thiết bị chủ động', description: 'Lịch bảo trì và cảnh báo vận hành.' }
    ],
    roadmap: [
      { phase: 1, title: 'Cư dân & dịch vụ', description: 'Hồ sơ, phí và tương tác.' },
      { phase: 2, title: 'Vận hành', description: 'Ticket, công việc và SLA.' },
      { phase: 3, title: 'Thiết bị & IoT', description: 'Bảo trì, cảm biến và năng lượng.' },
      { phase: 4, title: 'AI Operations', description: 'Cảnh báo, phân tích và gợi ý xử lý.' }
    ]
  },
  {
    slug: 'tai-chinh-va-van-hanh',
    title: 'Tài chính và vận hành',
    summary: 'Chuẩn hóa tài chính, ngân sách, công nợ, báo cáo và hiệu suất vận hành.',
    businessJourney: [
      { order: 1, title: 'Kế toán & sổ sách' },
      { order: 2, title: 'Dòng tiền' },
      { order: 3, title: 'Ngân sách' },
      { order: 4, title: 'Công nợ' },
      { order: 5, title: 'Báo cáo quản trị' },
      { order: 6, title: 'Hiệu suất vận hành' }
    ],
    products: [
      { productSlug: 'finerp', role: 'core' },
      { productSlug: 'x-ai', role: 'recommended' },
      { productSlug: 'x-space', role: 'recommended' },
      { productSlug: 'xbooking', role: 'optional' },
      { productSlug: 'xbuilding', role: 'optional' }
    ],
    platformCapabilities: ['Data', 'Analytics', 'Workflow', 'Identity', 'Security'],
    services: [
      { serviceSlug: 'tu-van-chuyen-doi-so', role: 'recommended' },
      { serviceSlug: 'tich-hop-he-thong', role: 'core' },
      { serviceSlug: 'dao-tao', role: 'core' },
      { serviceSlug: 'sla-va-ho-tro', role: 'core' }
    ],
    deploymentModels: ['saas', 'private-cloud', 'on-premise', 'hybrid'],
    outcomes: [
      { title: 'Kiểm soát dòng tiền', description: 'Theo dõi thực tế và dự báo thanh khoản.' },
      { title: 'Quản trị ngân sách', description: 'Theo dõi phân bổ và sử dụng ngân sách.' },
      { title: 'Báo cáo kịp thời', description: 'Tổng hợp KPI phục vụ điều hành.' }
    ],
    roadmap: [
      { phase: 1, title: 'Chuẩn hóa số liệu', description: 'Kế toán, công nợ và danh mục.' },
      { phase: 2, title: 'Ngân sách & dòng tiền', description: 'Lập kế hoạch và kiểm soát.' },
      { phase: 3, title: 'Dashboard', description: 'Báo cáo điều hành và KPI.' },
      { phase: 4, title: 'AI tài chính', description: 'Hỏi đáp, dự báo và cảnh báo bất thường.' }
    ]
  },
  {
    slug: 'ai-doanh-nghiep',
    title: 'AI doanh nghiệp',
    summary: 'Triển khai AI Agent, Knowledge & RAG, báo cáo thông minh và quản trị AI.',
    businessJourney: [
      { order: 1, title: 'AI nhập liệu' },
      { order: 2, title: 'Knowledge & RAG' },
      { order: 3, title: 'Báo cáo thông minh' },
      { order: 4, title: 'Agent theo vai trò' },
      { order: 5, title: 'Trợ lý điều hành' },
      { order: 6, title: 'Quản trị & bảo mật AI' }
    ],
    products: [
      { productSlug: 'x-ai', role: 'core' },
      { productSlug: 'x-space', role: 'recommended' },
      { productSlug: 'finerp', role: 'optional' },
      { productSlug: 'xbooking', role: 'optional' },
      { productSlug: 'xbuilding', role: 'optional' }
    ],
    platformCapabilities: ['Data', 'RAG', 'Model Gateway', 'Identity', 'Audit', 'Security'],
    services: [
      { serviceSlug: 'du-lieu-va-ai', role: 'core' },
      { serviceSlug: 'tich-hop-he-thong', role: 'core' },
      { serviceSlug: 'dao-tao', role: 'core' },
      { serviceSlug: 'sla-va-ho-tro', role: 'core' }
    ],
    deploymentModels: ['saas', 'private-cloud', 'on-premise', 'hybrid'],
    outcomes: [
      { title: 'Tự động hóa tri thức', description: 'Tra cứu và tổng hợp thông tin theo ngữ cảnh.' },
      { title: 'Hỗ trợ ra quyết định', description: 'AI tổng hợp, phân tích và gợi ý ưu tiên.' },
      { title: 'Quản trị AI có kiểm soát', description: 'Phân quyền, audit và guardrails.' }
    ],
    roadmap: [
      { phase: 1, title: 'Use case ưu tiên', description: 'Chọn bài toán tạo giá trị nhanh.' },
      { phase: 2, title: 'Knowledge & Data', description: 'Chuẩn hóa nguồn dữ liệu và tri thức.' },
      { phase: 3, title: 'Agent & Workflow', description: 'Kết nối AI với quy trình thực tế.' },
      { phase: 4, title: 'Governance & Scale', description: 'Quản trị, đánh giá và mở rộng toàn doanh nghiệp.' }
    ]
  }
];
