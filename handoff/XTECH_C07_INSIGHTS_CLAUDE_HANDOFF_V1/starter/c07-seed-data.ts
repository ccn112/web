import type { InsightArticleSeed, InsightCategorySeed } from './c07-types';

export const c07Categories: InsightCategorySeed[] = [
  {
    slug: 'chuyen-doi-so',
    title: 'Chuyển đổi số',
    description: 'Chiến lược, kiến trúc và lộ trình chuyển đổi số cho doanh nghiệp.'
  },
  {
    slug: 'ai-doanh-nghiep',
    title: 'AI doanh nghiệp',
    description: 'AI Agent, Knowledge & RAG, quản trị và triển khai AI trong doanh nghiệp.'
  },
  {
    slug: 'du-lieu',
    title: 'Dữ liệu',
    description: 'Data platform, tích hợp, chất lượng dữ liệu và phân tích điều hành.'
  },
  {
    slug: 'proptech',
    title: 'PropTech',
    description: 'Công nghệ cho chủ đầu tư, bán hàng bất động sản và vận hành tòa nhà.'
  }
];

export const c07Articles: InsightArticleSeed[] = [
  {
    slug: 'xay-dung-lo-trinh-chuyen-doi-so-theo-giai-doan',
    title: 'Xây dựng lộ trình chuyển đổi số theo từng giai đoạn',
    summary: 'Cách xác định bài toán ưu tiên, thiết kế kiến trúc và mở rộng chuyển đổi số có kiểm soát.',
    categorySlug: 'chuyen-doi-so',
    tags: ['chiến lược', 'roadmap', 'kiến trúc'],
    featured: true,
    status: 'published',
    relatedSolutions: ['chuyen-doi-so'],
    relatedProducts: ['finerp', 'x-space', 'x-ai']
  },
  {
    slug: 'tu-pilot-ai-den-ai-van-hanh-thuc-te',
    title: 'Từ pilot AI đến AI vận hành thực tế trong doanh nghiệp',
    summary: 'Những điều kiện cần để AI vượt qua giai đoạn thử nghiệm và tạo ra giá trị trong quy trình thực.',
    categorySlug: 'ai-doanh-nghiep',
    tags: ['AI Agent', 'RAG', 'governance'],
    featured: true,
    status: 'published',
    relatedSolutions: ['du-lieu-va-ai'],
    relatedProducts: ['x-ai']
  },
  {
    slug: 'nen-tang-du-lieu-thong-nhat-cho-doanh-nghiep',
    title: 'Nền tảng dữ liệu thống nhất cho doanh nghiệp',
    summary: 'Tổ chức dữ liệu, tích hợp và quyền truy cập để phục vụ báo cáo và AI.',
    categorySlug: 'du-lieu',
    tags: ['data platform', 'integration', 'analytics'],
    featured: false,
    status: 'published',
    relatedSolutions: ['du-lieu-va-ai', 'tich-hop-he-thong'],
    relatedProducts: ['x-ai', 'finerp']
  },
  {
    slug: 'hanh-trinh-so-cho-chu-dau-tu-bat-dong-san',
    title: 'Hành trình số cho chủ đầu tư bất động sản',
    summary: 'Liên thông marketing, bảng hàng, booking, hợp đồng, thanh toán, bàn giao và vận hành.',
    categorySlug: 'proptech',
    tags: ['bất động sản', 'booking', 'customer journey'],
    featured: true,
    status: 'published',
    relatedSolutions: ['chuyen-doi-so'],
    relatedProducts: ['xbooking', 'finerp', 'xbuilding']
  },
  {
    slug: 'integration-hub-ket-noi-he-thong-hien-huu',
    title: 'Integration Hub cho hệ sinh thái hệ thống hiện hữu',
    summary: 'Vai trò của API Gateway, Event Bus và workflow trong kiến trúc doanh nghiệp.',
    categorySlug: 'du-lieu',
    tags: ['API', 'event bus', 'integration'],
    featured: false,
    status: 'published',
    relatedSolutions: ['tich-hop-he-thong']
  },
  {
    slug: 'quan-tri-ai-an-toan-trong-doanh-nghiep',
    title: 'Quản trị AI an toàn trong doanh nghiệp',
    summary: 'Phân quyền, audit, guardrails và bảo vệ dữ liệu khi triển khai AI Agent.',
    categorySlug: 'ai-doanh-nghiep',
    tags: ['governance', 'security', 'AI Agent'],
    featured: false,
    status: 'published',
    relatedProducts: ['x-ai']
  },
  {
    slug: 'mo-hinh-saas-private-cloud-on-premise-hybrid',
    title: 'Chọn SaaS, Private Cloud, On-premise hay Hybrid',
    summary: 'So sánh các mô hình triển khai theo tốc độ, dữ liệu, tùy chỉnh và vận hành.',
    categorySlug: 'chuyen-doi-so',
    tags: ['cloud', 'on-premise', 'hybrid'],
    featured: false,
    status: 'published',
    relatedSolutions: ['chuyen-doi-so']
  },
  {
    slug: 'smart-building-tu-quan-ly-den-van-hanh-thong-minh',
    title: 'Smart Building: từ quản lý đến vận hành thông minh',
    summary: 'Kết nối cư dân, dịch vụ, thiết bị, bảo trì, IoT và AI trong vận hành tòa nhà.',
    categorySlug: 'proptech',
    tags: ['smart building', 'IoT', 'vận hành'],
    featured: false,
    status: 'published',
    relatedProducts: ['xbuilding', 'x-ai']
  }
];
