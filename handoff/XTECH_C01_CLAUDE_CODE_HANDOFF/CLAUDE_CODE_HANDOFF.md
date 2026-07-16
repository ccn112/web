# XTECH Corporate Website — SET C01 Claude Code Handoff

## 1. Mục tiêu

Triển khai homepage và các section corporate chính của website XTECH bằng Next.js + CMS, sử dụng 8 visual của **SET C01 — XTECH Corporate Overview**.

Bộ visual này không phải screenshot dashboard. Đây là **marketing infographic** dùng cho storytelling, nên toàn bộ heading, mô tả, CTA, tab label, SEO content và accessibility text phải render bằng HTML/CMS.

---

## 2. Asset mapping

| ID | File | Vai trò |
|---|---|---|
| C01-01 | `assets/c01/C01-01-corporate-hero.png` | Corporate Hero |
| C01-02 | `assets/c01/C01-02-who-we-are.png` | XTECH là ai |
| C01-03 | `assets/c01/C01-03-product-ecosystem.png` | Hệ sinh thái sản phẩm |
| C01-04 | `assets/c01/C01-04-digital-transformation-capability.png` | Năng lực chuyển đổi số |
| C01-05 | `assets/c01/C01-05-connected-enterprise-platform.png` | Nền tảng doanh nghiệp kết nối |
| C01-06 | `assets/c01/C01-06-business-value.png` | Giá trị XTECH mang lại |
| C01-07 | `assets/c01/C01-07-flexible-deployment.png` | Mô hình triển khai linh hoạt |
| C01-08 | `assets/c01/C01-08-partnership-future-vision.png` | Đồng hành và tầm nhìn tương lai |

---

## 3. Quy tắc logo bắt buộc

- Không sử dụng phần logo/chữ XTECH được AI sinh trong ảnh như logo production.
- Dùng đúng file logo XTECH gốc:
  - logo xanh/cyan cho nền sáng;
  - logo trắng cho nền tối.
- Logo phải là asset độc lập trong HTML/CSS hoặc composite hậu kỳ.
- Khi cần, che/mask phần logo AI sinh trong ảnh bằng gradient hoặc overlay.
- Không vẽ lại, không đổi tỷ lệ, không đổi màu logo gốc.

---

## 4. Sitemap liên quan

```txt
/
├── /about
├── /about/company
├── /about/capabilities
├── /solutions
├── /solutions/digital-transformation
├── /solutions/enterprise-platform
├── /solutions/system-integration
├── /solutions/cloud-infrastructure
├── /products
├── /industries
├── /case-studies
├── /insights
└── /contact
```

---

## 5. Homepage structure

### 1. Hero
Visual: C01-01

### 2. Trusted by
Logo marquee rất nhẹ, chỉ chạy khi người dùng không bật reduced motion.

### 3. XTECH là ai
Visual: C01-02

### 4. Hệ sinh thái sản phẩm
Visual: C01-03  
Hiệu ứng chính: sticky scroll + selector.

### 5. Năng lực chuyển đổi số
Visual: C01-04  
Hiệu ứng chính: sticky process storytelling.

### 6. Nền tảng doanh nghiệp kết nối
Visual: C01-05  
Hiệu ứng: layer reveal theo scroll.

### 7. Giá trị mang lại
Visual: C01-06  
Hiệu ứng: hover/focus cards, không sticky.

### 8. Giải pháp theo ngành / phòng ban
Tabs cục bộ: `Theo ngành | Theo phòng ban`

### 9. Case studies
Spotlight case lớn + filter chips.

### 10. Insights
Horizontal card rail hoặc grid.

### 11. CTA cuối trang
Visual: C01-08

C01-07 ưu tiên dùng ở `/about/capabilities`, `/solutions/cloud-infrastructure` hoặc một section ngắn trước CTA.

---

## 6. Interaction architecture

### Hero
- Text reveal theo dòng.
- Visual fade + scale rất nhẹ.
- Node glow xuất hiện tuần tự.
- CTA xuất hiện sau khoảng 450–600ms.
- Không dùng autoplay carousel.

### Product Ecosystem
Desktop:
- Section cao khoảng 350–450vh.
- Visual sticky ở 58–62% chiều ngang.
- Danh sách sản phẩm ở bên trái.
- Khi step active:
  - product label đổi trạng thái;
  - image layer đổi bằng crossfade;
  - background gradient đổi nhẹ;
  - progress `01 / 05` cập nhật.
- Cho phép click product name để jump tới step tương ứng.

Mobile:
- Không sticky dài.
- Dùng accordion hoặc horizontal snap carousel.
- Mỗi item gồm text + ảnh + CTA.

### Digital Transformation Capability
Desktop:
- Visual sticky.
- Sáu stage scroll lần lượt:
  1. Khảo sát hiện trạng
  2. Kiến trúc mục tiêu
  3. Thiết kế giải pháp
  4. Phát triển & tích hợp
  5. Triển khai
  6. Vận hành & tối ưu
- Mỗi stage active sẽ làm sáng node tương ứng và cập nhật copy.

Mobile:
- Timeline dọc.
- Không dùng sticky.

### Connected Enterprise Platform
- Reveal từ tầng dưới lên:
  1. Hạ tầng & bảo mật
  2. Dữ liệu & tích hợp
  3. AI & tự động hóa
  4. Ứng dụng doanh nghiệp
  5. Kênh trải nghiệm
- Scroll-controlled trên desktop.
- Trên mobile: accordion theo layer.

### Business Value
- 5 value cards:
  - Tăng trưởng doanh thu
  - Tối ưu chi phí
  - Tăng năng suất
  - Nâng cao trải nghiệm
  - Giảm rủi ro
- Hover hoặc focus:
  - card nhấc nhẹ 4px;
  - icon scale 1.03;
  - outcome text hiện thêm.
- Không dùng số liệu giả.

### Industry / Department
- Dùng tabs cục bộ:
  - Theo ngành
  - Theo phòng ban
- Bên trong là card grid.
- Không dùng tab cho toàn homepage.

---

## 7. Motion guidelines

### Recommended stack
- Framer Motion cho reveal, tabs, hover.
- GSAP ScrollTrigger chỉ dùng cho 2 section sticky chính:
  - Product Ecosystem
  - Digital Transformation Capability
- Lenis có thể dùng cho smooth scroll, nhưng phải hỗ trợ reduced motion.

### Motion limits
- Chỉ tối đa 2 section sticky nặng.
- Duration reveal: 0.45–0.7s.
- Easing: `easeOut` hoặc cubic-bezier mềm.
- Không dùng parallax lớn hơn 12–18px.
- Không dùng scale mạnh hơn 1.03.
- Tôn trọng `prefers-reduced-motion`.

---

## 8. Content model đề xuất

```ts
export type CorporateVisual = {
  id: string
  slug: string
  title: string
  eyebrow?: string
  description: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  highlights?: string[]
  cta?: {
    label: string
    href: string
  }
  layout?: "image-left" | "image-right" | "full"
}

export type ProductItem = {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  href: string
  icon?: string
  image?: string
  capabilities: string[]
}

export type TransformationStage = {
  id: string
  order: number
  title: string
  description: string
  capabilities: string[]
}

export type BusinessValue = {
  id: string
  title: string
  description: string
  outcomes: string[]
  icon: string
}

export type IndustryItem = {
  id: string
  title: string
  slug: string
  description: string
  products: string[]
  href: string
}
```

---

## 9. Seed data

```ts
export const corporateVisuals: CorporateVisual[] = [
  {
    id: "c01-01",
    slug: "corporate-hero",
    eyebrow: "XTECH",
    title: "Nền tảng công nghệ cho doanh nghiệp số",
    description:
      "Kết nối dữ liệu, tự động hóa vận hành và kích hoạt trí tuệ nhân tạo trên một hệ sinh thái thống nhất.",
    image: {
      src: "/images/corporate/c01/C01-01-corporate-hero.avif",
      alt: "Hệ sinh thái sản phẩm XTECH kết nối X.AI, XBooking, FinERP, XBuilding và X.Space",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Kết nối dữ liệu",
      "Tự động hóa vận hành",
      "Kích hoạt trí tuệ nhân tạo"
    ],
    cta: {
      label: "Khám phá hệ sinh thái",
      href: "/products"
    },
    layout: "full"
  },
  {
    id: "c01-02",
    slug: "who-we-are",
    eyebrow: "Về XTECH",
    title: "Đối tác công nghệ đồng hành cùng doanh nghiệp",
    description:
      "Tư vấn chiến lược, phát triển nền tảng, tích hợp hệ thống và vận hành dài hạn.",
    image: {
      src: "/images/corporate/c01/C01-02-who-we-are.avif",
      alt: "Bốn năng lực cốt lõi của XTECH gồm tư vấn chuyển đổi số, phát triển sản phẩm, tích hợp và vận hành",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Tư vấn chuyển đổi số",
      "Phát triển sản phẩm",
      "Tích hợp hệ thống",
      "Vận hành & tối ưu"
    ],
    cta: {
      label: "Tìm hiểu về XTECH",
      href: "/about"
    },
    layout: "image-right"
  },
  {
    id: "c01-03",
    slug: "product-ecosystem",
    eyebrow: "Hệ sinh thái sản phẩm",
    title: "Một hệ sinh thái, nhiều bài toán doanh nghiệp",
    description:
      "Các sản phẩm XTECH kết nối trên nền dữ liệu, định danh, workflow, cloud, bảo mật và analytics dùng chung.",
    image: {
      src: "/images/corporate/c01/C01-03-product-ecosystem.avif",
      alt: "Sơ đồ hệ sinh thái số XTECH với năm sản phẩm kết nối trên nền tảng dùng chung",
      width: 1448,
      height: 1086
    },
    layout: "image-left"
  },
  {
    id: "c01-04",
    slug: "digital-transformation-capability",
    eyebrow: "Năng lực chuyển đổi số",
    title: "Từ chiến lược đến vận hành số",
    description:
      "Đồng hành end-to-end từ khảo sát hiện trạng đến kiến trúc, phát triển, triển khai và tối ưu.",
    image: {
      src: "/images/corporate/c01/C01-04-digital-transformation-capability.avif",
      alt: "Sáu giai đoạn chuyển đổi số từ khảo sát hiện trạng đến vận hành và tối ưu",
      width: 1448,
      height: 1086
    },
    layout: "image-right"
  },
  {
    id: "c01-05",
    slug: "connected-enterprise-platform",
    eyebrow: "Enterprise Platform",
    title: "Kết nối hệ thống, hợp nhất dữ liệu, vận hành xuyên suốt",
    description:
      "Kiến trúc năm lớp giúp doanh nghiệp kết nối trải nghiệm, ứng dụng, AI, dữ liệu và hạ tầng.",
    image: {
      src: "/images/corporate/c01/C01-05-connected-enterprise-platform.avif",
      alt: "Kiến trúc doanh nghiệp kết nối gồm năm lớp từ hạ tầng đến kênh trải nghiệm",
      width: 1448,
      height: 1086
    },
    layout: "image-left"
  },
  {
    id: "c01-06",
    slug: "business-value",
    eyebrow: "Business Value",
    title: "Công nghệ tạo ra kết quả kinh doanh",
    description:
      "Tăng trưởng doanh thu, tối ưu chi phí, tăng năng suất, nâng cao trải nghiệm và giảm rủi ro.",
    image: {
      src: "/images/corporate/c01/C01-06-business-value.avif",
      alt: "Khung giá trị XTECH với năm nhóm giá trị kinh doanh",
      width: 1448,
      height: 1086
    },
    layout: "image-right"
  },
  {
    id: "c01-07",
    slug: "flexible-deployment",
    eyebrow: "Delivery Model",
    title: "Triển khai phù hợp với mọi mô hình doanh nghiệp",
    description:
      "Linh hoạt với SaaS, private cloud, on-premise và hybrid, đồng thời chủ động dữ liệu và sẵn sàng mở rộng.",
    image: {
      src: "/images/corporate/c01/C01-07-flexible-deployment.avif",
      alt: "Bốn mô hình triển khai XTECH gồm SaaS, private cloud, on-premise và hybrid",
      width: 1448,
      height: 1086
    },
    layout: "image-left"
  },
  {
    id: "c01-08",
    slug: "partnership-future-vision",
    eyebrow: "Đồng hành dài hạn",
    title: "Đồng hành trong hành trình chuyển đổi số",
    description:
      "Cùng doanh nghiệp tiến từ nền tảng số đến doanh nghiệp dựa trên dữ liệu, AI và hệ sinh thái thông minh.",
    image: {
      src: "/images/corporate/c01/C01-08-partnership-future-vision.avif",
      alt: "Lộ trình từ doanh nghiệp hiện tại đến doanh nghiệp số, dữ liệu, AI và hệ sinh thái thông minh",
      width: 1448,
      height: 1086
    },
    cta: {
      label: "Trao đổi với chuyên gia",
      href: "/contact"
    },
    layout: "full"
  }
]
```

### Products

```ts
export const products: ProductItem[] = [
  {
    id: "x-ai",
    name: "X.AI",
    slug: "x-ai",
    tagline: "Trí tuệ doanh nghiệp",
    description:
      "Nền tảng AI Agent, tri thức, tự động hóa và quản trị AI cho doanh nghiệp.",
    href: "/products/x-ai",
    capabilities: [
      "Enterprise Agents",
      "Knowledge & RAG",
      "Workflow Automation",
      "Governance & Security"
    ]
  },
  {
    id: "xbooking",
    name: "XBooking",
    slug: "xbooking",
    tagline: "Bán hàng bất động sản",
    description:
      "Quản lý lead, bảng hàng, booking, đại lý, hợp đồng và hành trình khách hàng.",
    href: "/products/xbooking",
    capabilities: [
      "CRM & Lead",
      "Inventory",
      "Booking",
      "Contracts"
    ]
  },
  {
    id: "finerp",
    name: "FinERP",
    slug: "finerp",
    tagline: "Tài chính và vận hành",
    description:
      "Quản trị tài chính, dòng tiền, ngân sách, báo cáo và vận hành doanh nghiệp.",
    href: "/products/finerp",
    capabilities: [
      "Finance",
      "Cashflow",
      "Budget",
      "Reporting"
    ]
  },
  {
    id: "xbuilding",
    name: "XBuilding",
    slug: "xbuilding",
    tagline: "Tòa nhà và cư dân",
    description:
      "Quản lý vận hành tòa nhà, cư dân, dịch vụ, thiết bị và bảo trì.",
    href: "/products/xbuilding",
    capabilities: [
      "Property Operations",
      "Residents",
      "Service Requests",
      "Assets & Maintenance"
    ]
  },
  {
    id: "x-space",
    name: "X.Space",
    slug: "x-space",
    tagline: "Cộng tác, công việc và tri thức",
    description:
      "Không gian số cho cộng tác, phê duyệt, công việc, tài liệu và tri thức nội bộ.",
    href: "/products/x-space",
    capabilities: [
      "Collaboration",
      "Tasks",
      "Documents",
      "Knowledge"
    ]
  }
]
```

### Transformation stages

```ts
export const transformationStages: TransformationStage[] = [
  {
    id: "assess",
    order: 1,
    title: "Khảo sát hiện trạng",
    description: "Đánh giá toàn diện quy trình, dữ liệu, hệ thống và năng lực số.",
    capabilities: ["Business Process", "Digital Maturity", "Pain Points"]
  },
  {
    id: "architecture",
    order: 2,
    title: "Kiến trúc mục tiêu",
    description: "Xây dựng kiến trúc doanh nghiệp và lộ trình ưu tiên.",
    capabilities: ["Enterprise Architecture", "Data Architecture", "Roadmap"]
  },
  {
    id: "design",
    order: 3,
    title: "Thiết kế giải pháp",
    description: "Thiết kế giải pháp phù hợp với chiến lược và thực tiễn.",
    capabilities: ["Solution Design", "UX", "Integration Design"]
  },
  {
    id: "build",
    order: 4,
    title: "Phát triển & tích hợp",
    description: "Phát triển, tích hợp, kiểm thử và chuẩn bị dữ liệu.",
    capabilities: ["Development", "Integration", "Testing"]
  },
  {
    id: "deploy",
    order: 5,
    title: "Triển khai",
    description: "Triển khai đồng bộ, đào tạo và chuyển đổi vận hành.",
    capabilities: ["Migration", "Training", "Go-live"]
  },
  {
    id: "operate",
    order: 6,
    title: "Vận hành & tối ưu",
    description: "Vận hành ổn định, hỗ trợ dài hạn và tối ưu liên tục.",
    capabilities: ["Support", "SLA", "Continuous Improvement"]
  }
]
```

### Business values

```ts
export const businessValues: BusinessValue[] = [
  {
    id: "revenue",
    title: "Tăng trưởng doanh thu",
    description: "Kích hoạt dữ liệu và quy trình để tạo thêm cơ hội tăng trưởng.",
    outcomes: ["Tăng conversion", "Tăng tốc bán hàng", "Mở rộng kênh"],
    icon: "TrendingUp"
  },
  {
    id: "cost",
    title: "Tối ưu chi phí",
    description: "Giảm lãng phí và chi phí vận hành nhờ tự động hóa.",
    outcomes: ["Giảm thao tác thủ công", "Tối ưu nguồn lực", "Giảm lỗi"],
    icon: "BadgeDollarSign"
  },
  {
    id: "productivity",
    title: "Tăng năng suất",
    description: "Kết nối dữ liệu và quy trình để làm việc nhanh hơn.",
    outcomes: ["Rút ngắn thời gian", "Tăng thông lượng", "Hợp tác hiệu quả"],
    icon: "Gauge"
  },
  {
    id: "experience",
    title: "Nâng cao trải nghiệm",
    description: "Tạo trải nghiệm liền mạch cho khách hàng và nhân viên.",
    outcomes: ["Phản hồi nhanh", "Cá nhân hóa", "Dịch vụ nhất quán"],
    icon: "Sparkles"
  },
  {
    id: "risk",
    title: "Giảm rủi ro",
    description: "Tăng khả năng kiểm soát, truy vết và tuân thủ.",
    outcomes: ["Audit trail", "Phân quyền", "Cảnh báo sớm"],
    icon: "ShieldCheck"
  }
]
```

---

## 10. Component structure

```txt
app/
  page.tsx
  about/
  solutions/
  products/
  industries/
  case-studies/
  insights/
  contact/

components/
  corporate/
    CorporateHero.tsx
    TrustedLogoMarquee.tsx
    WhoWeAreSection.tsx
    ProductEcosystemSticky.tsx
    ProductSelector.tsx
    TransformationStory.tsx
    PlatformLayerReveal.tsx
    BusinessValueGrid.tsx
    IndustryDepartmentTabs.tsx
    CaseStudySpotlight.tsx
    InsightsRail.tsx
    FutureVisionCTA.tsx
    CorporateImageFrame.tsx

content/
  corporate-visuals.ts
  products.ts
  transformation-stages.ts
  business-values.ts
  industries.ts
  departments.ts
  case-studies.ts
  insights.ts

public/
  images/
    corporate/
      c01/
```

---

## 11. Page shell

### Header
- Sticky top navigation.
- Transparent trên hero, chuyển sang blur/solid sau khi scroll.
- Mega menu cho Solutions và Products.
- CTA chính: `Yêu cầu demo`.
- Mobile drawer rõ ràng, không clone desktop menu nguyên bản.

### Footer
- Logo gốc.
- Solutions, Products, Industries, Company, Resources.
- Contact details.
- Social links.
- Privacy / Terms.

---

## 12. SEO & accessibility

- H1 chỉ một lần trên homepage.
- Mỗi section dùng H2.
- Mỗi product/stage dùng H3.
- Tất cả ảnh có alt text.
- CTA phải là `<a>` hoặc `<button>` hợp lệ.
- Tabs phải dùng ARIA chuẩn.
- Sticky scroll vẫn phải có nội dung đầy đủ trong DOM.
- Không dùng canvas làm nơi duy nhất chứa text.
- Cần hỗ trợ keyboard navigation.
- Tôn trọng reduced motion.

---

## 13. Image optimization

- Convert PNG sang AVIF và WebP.
- Giữ PNG gốc.
- Desktop source: 1400–1600px.
- Tablet: 960px.
- Mobile: 640–768px.
- `next/image` với `sizes`.
- Hero dùng `priority`.
- Các ảnh còn lại lazy-load.
- Tránh CLS bằng cách khai báo width/height.

---

## 14. Acceptance criteria

- [ ] 8 visual được map đúng section.
- [ ] Logo dùng đúng asset gốc.
- [ ] Homepage không trở thành một trang X.AI.
- [ ] Chỉ có tối đa 2 sticky-scrollytelling sections.
- [ ] Mobile không dùng sticky scroll dài.
- [ ] Tabs chỉ dùng cục bộ cho ngành/phòng ban.
- [ ] Tất cả text chính lấy từ CMS/seed.
- [ ] Có fallback khi JS tắt.
- [ ] Reduced motion hoạt động.
- [ ] Không có số liệu thành tích giả nếu chưa xác thực.
- [ ] Lighthouse Performance/SEO/Accessibility được ưu tiên.
