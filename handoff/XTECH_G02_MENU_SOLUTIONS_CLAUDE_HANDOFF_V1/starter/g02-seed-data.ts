export const g02SolutionPages = [
  {
    slug: 'doanh-nghiep-ket-noi',
    eyebrow: 'NỀN TẢNG DOANH NGHIỆP SỐ XTECH',
    title: 'Doanh nghiệp kết nối',
    summary: 'Kết nối con người, dữ liệu, quy trình và vận hành trên một nền tảng thống nhất.',
    relatedProducts: ['x-space', 'x-ai', 'finerp', 'xbooking'],
    sections: [
      {
        sectionId: 'pain-points',
        title: 'Những điểm nghẽn thường gặp',
        layout: 'full-width',
        items: [
          { title: 'Thông tin phân tán', description: 'Dữ liệu nằm rải rác ở nhiều nơi, khó tìm và khó tin cậy.' },
          { title: 'Phối hợp chậm', description: 'Trao đổi qua nhiều kênh, phụ thuộc và chờ đợi.' },
          { title: 'Báo cáo rời rạc', description: 'Số liệu tổng hợp thủ công, thiếu chuẩn và tốn thời gian.' },
          { title: 'Thiếu dữ liệu tức thời', description: 'Thiếu góc nhìn theo thời gian thực để kịp thời phản ứng.' }
        ]
      },
      {
        sectionId: 'connected-model',
        title: 'Mô hình doanh nghiệp kết nối',
        layout: 'visual-right',
        description: 'Kết nối mọi phòng ban, dữ liệu và quy trình trên một nền tảng thống nhất.'
      },
      {
        sectionId: 'capabilities',
        title: 'Năng lực cốt lõi',
        layout: 'full-width',
        items: [
          { title: 'Cộng tác liên phòng ban' },
          { title: 'Điều hành thống nhất' },
          { title: 'Luồng công việc xuyên suốt' },
          { title: 'Dữ liệu dùng chung' },
          { title: 'Trải nghiệm người dùng tốt hơn' }
        ]
      }
    ]
  },
  {
    slug: 'du-lieu-va-ai',
    eyebrow: 'DỮ LIỆU & AI',
    title: 'Dữ liệu & AI',
    summary: 'Chuẩn hóa dữ liệu, khai thác insight và kích hoạt AI doanh nghiệp trên một nền tảng chung.',
    relatedProducts: ['x-ai', 'finerp', 'x-space', 'xbuilding'],
    sections: [
      {
        sectionId: 'current-state',
        eyebrow: 'THỰC TRẠNG',
        title: 'Từ dữ liệu rời rạc đến tri thức dùng chung',
        layout: 'visual-right',
        items: [
          { title: 'Dữ liệu phân tán' },
          { title: 'Báo cáo chậm' },
          { title: 'Khó tổng hợp' },
          { title: 'Thiếu nền tảng AI' }
        ]
      },
      {
        sectionId: 'architecture',
        eyebrow: 'KIẾN TRÚC',
        title: 'Kiến trúc dữ liệu & AI',
        layout: 'visual-left',
        items: [
          { title: 'Data Hub' },
          { title: 'BI Dashboard' },
          { title: 'Knowledge Base' },
          { title: 'RAG' },
          { title: 'AI Agent' },
          { title: 'Governance' }
        ]
      },
      {
        sectionId: 'capabilities',
        title: 'Nền tảng toàn diện cho dữ liệu & AI',
        layout: 'full-width',
        items: [
          { title: 'Data Hub' },
          { title: 'Dashboard & BI' },
          { title: 'Knowledge & RAG' },
          { title: 'AI Agent' },
          { title: 'Data Governance' },
          { title: 'Bảo mật & phân quyền' }
        ]
      }
    ]
  },
  {
    slug: 'tu-dong-hoa',
    title: 'Tự động hóa',
    summary: 'Số hóa workflow, giảm thao tác thủ công và tăng tốc xử lý nghiệp vụ.',
    relatedProducts: ['workflow', 'x-ai', 'finerp', 'x-space'],
    sections: [
      {
        sectionId: 'processes',
        title: 'Những quy trình cần tự động hóa',
        layout: 'visual-left',
        items: [
          { title: 'Phê duyệt' },
          { title: 'Thông báo' },
          { title: 'Giao việc' },
          { title: 'Tổng hợp báo cáo' }
        ]
      },
      {
        sectionId: 'journey',
        title: 'Hành trình tự động hóa',
        layout: 'full-width',
        items: [
          { title: 'Biểu mẫu' },
          { title: 'Xử lý' },
          { title: 'Phê duyệt' },
          { title: 'Thông báo' },
          { title: 'Theo dõi SLA' },
          { title: 'Báo cáo' }
        ]
      },
      {
        sectionId: 'capabilities',
        title: 'Năng lực tự động hóa',
        layout: 'visual-left',
        items: [
          { title: 'Workflow Engine' },
          { title: 'Rule-based Automation' },
          { title: 'AI hỗ trợ tác vụ' },
          { title: 'Nhắc việc & cảnh báo' },
          { title: 'Tích hợp ký số' }
        ]
      }
    ]
  },
  {
    slug: 'tich-hop-he-thong',
    title: 'Tích hợp hệ thống',
    summary: 'Kết nối ERP, CRM, HRM, ứng dụng nội bộ, API và dữ liệu xuyên suốt.',
    relatedProducts: ['api', 'erp', 'crm', 'hrm', 'xbuilding', 'finerp'],
    sections: [
      {
        sectionId: 'pain-points',
        title: 'Bài toán tích hợp phổ biến',
        layout: 'full-width',
        items: [
          { title: 'Hệ thống rời rạc' },
          { title: 'Nhập liệu lặp' },
          { title: 'Dữ liệu không đồng bộ' },
          { title: 'Khó giám sát luồng xử lý' }
        ]
      },
      {
        sectionId: 'architecture',
        title: 'Kiến trúc tích hợp',
        layout: 'visual-right',
        items: [
          { title: 'API Gateway' },
          { title: 'Data Sync' },
          { title: 'Event Bus' },
          { title: 'Monitoring' },
          { title: 'Security' },
          { title: 'Logging' }
        ]
      },
      {
        sectionId: 'deployment',
        title: 'Mô hình triển khai',
        layout: 'visual-right',
        items: [
          { title: 'Point-to-Point tối thiểu' },
          { title: 'Hub-and-Spoke' },
          { title: 'Nền tảng tích hợp mở rộng' }
        ]
      }
    ]
  },
  {
    slug: 'bo-giai-phap-x',
    eyebrow: 'BỘ GIẢI PHÁP XTECH',
    title: 'Bộ giải pháp X',
    summary: 'Đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp phù hợp với từng mô hình doanh nghiệp.',
    relatedProducts: ['x-ai', 'xbooking', 'finerp', 'xbuilding', 'x-space'],
    sections: [
      {
        sectionId: 'selector',
        title: 'Theo bài toán doanh nghiệp',
        layout: 'full-width',
        items: [
          { title: 'Chủ đầu tư bất động sản' },
          { title: 'Doanh nghiệp số' },
          { title: 'Tòa nhà thông minh' },
          { title: 'Tài chính & vận hành' },
          { title: 'AI doanh nghiệp' }
        ]
      },
      {
        sectionId: 'real-estate-suite',
        title: 'Bộ giải pháp nổi bật cho chủ đầu tư bất động sản',
        layout: 'visual-right'
      },
      {
        sectionId: 'deployment',
        title: 'Mô hình triển khai linh hoạt',
        layout: 'visual-right',
        items: [
          { title: 'SaaS Cloud' },
          { title: 'Private Cloud' },
          { title: 'On-premise' }
        ]
      }
    ]
  }
];
