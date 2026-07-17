import type { ImplementationSection } from './c04-types';

export const c04Sections: ImplementationSection[] = [
  {
    sectionId: 'c04-01',
    route: ['/trien-khai', '/trien-khai/quy-trinh'],
    eyebrow: 'QUY TRÌNH TRIỂN KHAI',
    title: 'Từ khảo sát đến vận hành ổn định',
    description: 'XTECH đồng hành xuyên suốt từ khảo sát hiện trạng đến go-live, hypercare và tối ưu liên tục.',
    layout: 'visual-right',
    items: [
      { id: 'assessment', title: 'Khảo sát', description: 'Đánh giá hiện trạng nghiệp vụ, hệ thống và dữ liệu.' },
      { id: 'architecture', title: 'Kiến trúc mục tiêu', description: 'Xây dựng kiến trúc phù hợp với lộ trình doanh nghiệp.' },
      { id: 'design', title: 'Thiết kế giải pháp', description: 'Chi tiết hóa phạm vi, tích hợp và kế hoạch thực hiện.' },
      { id: 'build', title: 'Phát triển & cấu hình', description: 'Cấu hình, phát triển và kiểm thử giải pháp.' },
      { id: 'integration', title: 'Tích hợp', description: 'Kết nối hệ thống và đồng bộ dữ liệu.' },
      { id: 'migration', title: 'Migration', description: 'Chuyển đổi và đối soát dữ liệu.' },
      { id: 'uat', title: 'UAT & đào tạo', description: 'Kiểm thử người dùng và chuyển giao.' },
      { id: 'golive', title: 'Go-live', description: 'Triển khai chính thức có kiểm soát.' },
      { id: 'hypercare', title: 'Hypercare', description: 'Hỗ trợ tăng cường sau go-live.' },
      { id: 'improve', title: 'Tối ưu', description: 'Đo lường và cải tiến liên tục.' }
    ],
    cta: { label: 'Trao đổi về kế hoạch triển khai', href: '/lien-he' }
  },
  {
    sectionId: 'c04-02',
    route: ['/trien-khai'],
    eyebrow: 'KIẾN TRÚC GIẢI PHÁP',
    title: 'Hiểu đúng hiện trạng, thiết kế đúng kiến trúc',
    description: 'Phân tích toàn diện nghiệp vụ, ứng dụng, dữ liệu, hạ tầng và bảo mật.',
    layout: 'visual-left',
    items: [
      { id: 'business', title: 'Nghiệp vụ', description: 'Quy trình, vai trò và mục tiêu vận hành.' },
      { id: 'application', title: 'Ứng dụng', description: 'Danh mục hệ thống và mức độ đáp ứng.' },
      { id: 'data', title: 'Dữ liệu', description: 'Nguồn dữ liệu, chất lượng và luồng khai thác.' },
      { id: 'infra', title: 'Hạ tầng & bảo mật', description: 'Cloud, mạng, IAM, backup và giám sát.' }
    ]
  },
  {
    sectionId: 'c04-03',
    route: ['/trien-khai', '/trien-khai/tich-hop-he-thong'],
    eyebrow: 'INTEGRATION HUB',
    title: 'Kết nối hệ thống, hợp nhất dòng dữ liệu',
    description: 'Kết nối các hệ thống hiện hữu với ứng dụng, dữ liệu và AI trên một lớp tích hợp thống nhất.',
    layout: 'visual-right',
    items: [
      { id: 'erp', title: 'ERP', description: 'Kết nối tài chính và vận hành.' },
      { id: 'crm', title: 'CRM', description: 'Đồng bộ khách hàng và cơ hội.' },
      { id: 'hrm', title: 'HRM', description: 'Kết nối nhân sự và tổ chức.' },
      { id: 'legacy', title: 'Legacy', description: 'Tích hợp hệ thống hiện hữu.' },
      { id: 'api', title: 'API Gateway', description: 'Quản lý và bảo vệ API.' },
      { id: 'event', title: 'Event Bus', description: 'Trao đổi dữ liệu theo sự kiện.' },
      { id: 'ai', title: 'AI Agent', description: 'Kích hoạt AI trên dữ liệu doanh nghiệp.' }
    ]
  },
  {
    sectionId: 'c04-04',
    route: ['/trien-khai/tich-hop-he-thong'],
    eyebrow: 'API & EVENT',
    title: 'Tích hợp linh hoạt, vận hành theo sự kiện',
    description: 'Quản lý API, sự kiện, hàng đợi, retry, audit và observability.',
    layout: 'visual-left',
    items: [
      { id: 'auth', title: 'Authentication', description: 'Xác thực và phân quyền truy cập.' },
      { id: 'rate', title: 'Rate limit', description: 'Kiểm soát lưu lượng và bảo vệ dịch vụ.' },
      { id: 'queue', title: 'Queue & Retry', description: 'Đảm bảo độ tin cậy trong trao đổi dữ liệu.' },
      { id: 'audit', title: 'Audit', description: 'Truy vết giao dịch và sự kiện.' },
      { id: 'observe', title: 'Observability', description: 'Theo dõi hiệu năng và lỗi.' }
    ]
  },
  {
    sectionId: 'c04-05',
    route: ['/trien-khai/chuyen-doi-du-lieu'],
    eyebrow: 'DATA MIGRATION',
    title: 'Chuyển đổi dữ liệu an toàn, có kiểm soát',
    description: 'Từ khảo sát nguồn đến mapping, làm sạch, đối soát và cutover.',
    layout: 'visual-right',
    items: [
      { id: 'source', title: 'Khảo sát nguồn', description: 'Phân tích cấu trúc và chất lượng dữ liệu.' },
      { id: 'mapping', title: 'Mapping', description: 'Ánh xạ dữ liệu nguồn và đích.' },
      { id: 'clean', title: 'Làm sạch', description: 'Loại trùng lặp và chuẩn hóa.' },
      { id: 'trial', title: 'Chuyển đổi thử', description: 'Kiểm tra quy trình và hiệu năng.' },
      { id: 'reconcile', title: 'Đối soát', description: 'Xác nhận đầy đủ và chính xác.' },
      { id: 'cutover', title: 'Cutover', description: 'Chuyển đổi chính thức có phương án rollback.' }
    ]
  },
  {
    sectionId: 'c04-06',
    route: ['/trien-khai', '/trien-khai/cloud-va-on-premise'],
    eyebrow: 'MÔ HÌNH TRIỂN KHAI',
    title: 'Linh hoạt với mọi mô hình hạ tầng',
    description: 'Lựa chọn SaaS, Private Cloud, On-premise hoặc Hybrid phù hợp với yêu cầu dữ liệu và vận hành.',
    layout: 'visual-left',
    items: [
      { id: 'saas', title: 'SaaS', description: 'Triển khai nhanh, vận hành linh hoạt.' },
      { id: 'private', title: 'Private Cloud', description: 'Môi trường riêng và kiểm soát tài nguyên.' },
      { id: 'onprem', title: 'On-premise', description: 'Toàn quyền hạ tầng và dữ liệu.' },
      { id: 'hybrid', title: 'Hybrid', description: 'Kết hợp linh hoạt cloud và on-premise.' }
    ]
  },
  {
    sectionId: 'c04-07',
    route: ['/trien-khai/devsecops'],
    eyebrow: 'DEVSECOPS',
    title: 'Bảo mật từ thiết kế, giám sát xuyên suốt',
    description: 'Tích hợp kiểm thử, quét bảo mật, triển khai và giám sát vào toàn bộ vòng đời phát triển.',
    layout: 'visual-right',
    items: [
      { id: 'code', title: 'Code', description: 'Quản lý mã nguồn và review.' },
      { id: 'build', title: 'Build', description: 'Build tự động và kiểm soát artifact.' },
      { id: 'test', title: 'Test', description: 'Kiểm thử chức năng và chất lượng.' },
      { id: 'scan', title: 'Security Scan', description: 'Quét mã nguồn, dependency và secret.' },
      { id: 'deploy', title: 'Deploy', description: 'Triển khai tự động và kiểm soát.' },
      { id: 'monitor', title: 'Monitor', description: 'Theo dõi, cảnh báo và cải tiến.' }
    ]
  },
  {
    sectionId: 'c04-08',
    route: ['/trien-khai', '/trien-khai/sla-va-ho-tro'],
    eyebrow: 'VẬN HÀNH & HỖ TRỢ',
    title: 'Go-live chỉ là điểm bắt đầu',
    description: 'XTECH hỗ trợ vận hành, giám sát, phát hành và cải tiến liên tục sau triển khai.',
    layout: 'visual-left',
    items: [
      { id: 'service-desk', title: 'Service Desk', description: 'Tiếp nhận và xử lý yêu cầu tập trung.' },
      { id: 'sla', title: 'SLA', description: 'Cam kết mức độ dịch vụ và thời gian phản hồi.' },
      { id: 'incident', title: 'Incident', description: 'Quản lý và khôi phục sự cố.' },
      { id: 'release', title: 'Release', description: 'Quản lý phiên bản và phát hành.' },
      { id: 'monitoring', title: 'Monitoring', description: 'Giám sát sức khỏe và hiệu năng hệ thống.' },
      { id: 'improvement', title: 'Continuous Improvement', description: 'Phân tích và cải tiến liên tục.' }
    ],
    cta: { label: 'Tìm hiểu SLA và hỗ trợ', href: '/trien-khai/sla-va-ho-tro' }
  }
];
