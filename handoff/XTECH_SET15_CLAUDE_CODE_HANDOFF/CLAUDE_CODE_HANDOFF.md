# XTECH Website — SET 15 Claude Code Handoff

## 1. Mục tiêu

Triển khai **SET 15 — X.AI Industry Solutions** cho website XTECH.

SET 15 nối tiếp logic của toàn bộ chuỗi:

- **SET 12**: X.AI phục vụ ai trong doanh nghiệp.
- **SET 13**: X.AI được xây dựng, kết nối, tự động hóa và vận hành như thế nào.
- **SET 14**: X.AI được bảo mật, quan sát, tối ưu và kiểm toán như thế nào.
- **SET 15**: X.AI giải quyết bài toán gì trong từng ngành cụ thể.

Bộ gồm **8 ảnh riêng**, tỷ lệ **4:3**, nền sáng, theo phong cách **website marketing infographic** đã thống nhất.

---

## 2. Asset mapping

| ID nội bộ | File | Chủ đề |
|---|---|---|
| XAI-33 | `assets/set15/XAI-33-real-estate-ai-solutions.png` | Giải pháp AI cho Bất động sản |
| XAI-34 | `assets/set15/XAI-34-manufacturing-ai-solutions.png` | Giải pháp AI cho Sản xuất |
| XAI-35 | `assets/set15/XAI-35-retail-distribution-ai-solutions.png` | Giải pháp AI cho Bán lẻ & Phân phối |
| XAI-36 | `assets/set15/XAI-36-construction-ai-solutions.png` | Giải pháp AI cho Xây dựng |
| XAI-37 | `assets/set15/XAI-37-finance-accounting-ai-solutions.png` | Giải pháp AI cho Tài chính – Kế toán |
| XAI-38 | `assets/set15/XAI-38-smart-building-ai-solutions.png` | Giải pháp AI cho Tòa nhà Thông minh |
| XAI-39 | `assets/set15/XAI-39-customer-service-ai-solutions.png` | Giải pháp AI cho Chăm sóc khách hàng |
| XAI-40 | `assets/set15/XAI-40-enterprise-operations-ai-solutions.png` | Giải pháp AI cho Điều hành Doanh nghiệp |

> Không hiển thị mã XAI-33…XAI-40 trên giao diện website. Chỉ dùng nội bộ trong CMS/codebase.

---

## 3. Style guide của SET 15

SET 15 tiếp tục giữ đúng format đã thống nhất từ SET 14:

### Đặc trưng thị giác
- Bố cục **trung tâm – vệ tinh**
- Một **industry hub** hoặc **scenario hub** ở giữa
- Các card năng lực / use case / outcome ở xung quanh
- Đường kết nối cyan phát sáng
- Nền trắng – xanh sáng
- UI illustration + chiều sâu 3D nhẹ
- Card bo góc lớn, shadow mềm, glassmorphism nhẹ
- Tiêu đề lớn bằng tiếng Việt
- Không dùng layout screenshot admin toàn màn hình

### Vai trò ảnh
- Dùng cho website marketing / landing page sản phẩm
- Phù hợp cho section **industry solutions**
- Text chính vẫn phải render bằng **HTML/CMS**
- Chữ nhỏ trong ảnh chỉ là visual support, không phải content chính

---

## 4. Vị trí trong sitemap

SET 15 nên map chủ yếu vào:

- `/industries/real-estate`
- `/industries/manufacturing`
- `/industries/retail-distribution`
- `/industries/construction`
- `/industries/finance-accounting`
- `/industries/smart-building`
- `/industries/customer-service`
- `/industries/enterprise`

Ngoài ra có thể dùng trên:
- `/products/x-ai/use-cases`
- `/products/x-ai/industries`
- `/solutions/artificial-intelligence`

---

## 5. Quy tắc bắt buộc

### Logo XTECH
- Không dùng logo do AI vẽ lại nếu có sai khác.
- Nếu cần logo XTECH trên website, dùng đúng asset gốc.
- Nếu trong ảnh có phần chữ/biểu tượng gần giống logo nhưng không chuẩn brand, cần mask/crop/cover trước khi production.

### Nội dung chữ
- Heading, subheading, bullet, CTA phải render bằng HTML/CMS.
- Không dùng chữ nhỏ trong ảnh làm nội dung SEO hoặc content thật.
- Ảnh là visual marketing / concept illustration.

### Responsive
- Desktop: ảnh chiếm khoảng 52–58% block.
- Tablet: có thể đổi vị trí text/image.
- Mobile: ảnh full width, giữ `aspect-ratio: 4 / 3`.
- Ưu tiên `object-fit: contain`.

### Hiệu năng
- Convert PNG → AVIF + WebP
- Giữ PNG gốc làm archive
- Dùng `next/image`
- Khai báo `width`, `height`, `sizes`
- Lazy-load các ảnh dưới fold

---

## 6. Content model đề xuất

```ts
export type XAIIndustryFeature = {
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
  highlights: string[]
  capabilities?: string[]
  layout: "image-left" | "image-right"
  cta?: {
    label: string
    href: string
  }
}
```

---

## 7. Seed data đề xuất

```ts
export const xaiIndustryFeatures: XAIIndustryFeature[] = [
  {
    id: "xai-33",
    slug: "real-estate-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Bất động sản",
    description:
      "Tối ưu bán hàng dự án, lead, bảng hàng, booking, hợp đồng và chăm sóc khách hàng trong hệ sinh thái bất động sản.",
    image: {
      src: "/images/xai/set15/XAI-33-real-estate-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho bất động sản với real estate hub trung tâm và các card lead, bảng hàng, booking, hợp đồng",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Lead đa nguồn",
      "Tư vấn sản phẩm",
      "Quản lý bảng hàng",
      "Booking & hậu mãi"
    ],
    layout: "image-right"
  },
  {
    id: "xai-34",
    slug: "manufacturing-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Sản xuất",
    description:
      "Hỗ trợ giám sát dây chuyền, bảo trì dự đoán, kiểm soát chất lượng, an toàn lao động và tối ưu năng suất nhà máy.",
    image: {
      src: "/images/xai/set15/XAI-34-manufacturing-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho sản xuất với manufacturing hub trung tâm và các card giám sát sản xuất, bảo trì, chất lượng, an toàn",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Giám sát sản xuất",
      "Bảo trì dự đoán",
      "Kiểm soát chất lượng",
      "Tối ưu năng suất"
    ],
    layout: "image-left"
  },
  {
    id: "xai-35",
    slug: "retail-distribution-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Bán lẻ & Phân phối",
    description:
      "Tăng trưởng doanh thu, tối ưu tồn kho, điều hành chuỗi cửa hàng và nâng cao trải nghiệm khách hàng trên đa kênh.",
    image: {
      src: "/images/xai/set15/XAI-35-retail-distribution-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho bán lẻ và phân phối với retail hub, tồn kho, đơn hàng, đại lý, chăm sóc khách hàng",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Dự báo nhu cầu",
      "Quản lý đơn hàng",
      "Tối ưu tồn kho",
      "Hiệu quả đại lý"
    ],
    layout: "image-right"
  },
  {
    id: "xai-36",
    slug: "construction-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Xây dựng",
    description:
      "Theo dõi tiến độ, hồ sơ công trường, vật tư, an toàn và các cảnh báo rủi ro để điều hành dự án xây dựng hiệu quả hơn.",
    image: {
      src: "/images/xai/set15/XAI-36-construction-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho xây dựng với construction hub, tiến độ, hồ sơ, vật tư, an toàn và báo cáo điều hành",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Theo dõi tiến độ",
      "Quản lý hồ sơ",
      "Vật tư & hiện trường",
      "Giám sát an toàn"
    ],
    layout: "image-left"
  },
  {
    id: "xai-37",
    slug: "finance-accounting-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Tài chính – Kế toán",
    description:
      "Tăng tốc phân tích tài chính, kiểm soát dòng tiền, công nợ, ngân sách và hỗ trợ báo cáo điều hành.",
    image: {
      src: "/images/xai/set15/XAI-37-finance-accounting-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho tài chính kế toán với finance hub và các card dòng tiền, công nợ, chứng từ, cảnh báo bất thường",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Hỏi đáp tài chính",
      "Phân tích dòng tiền",
      "Kiểm soát công nợ",
      "Báo cáo điều hành"
    ],
    layout: "image-right"
  },
  {
    id: "xai-38",
    slug: "smart-building-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Tòa nhà Thông minh",
    description:
      "Hỗ trợ BQL vận hành thiết bị, xử lý sự cố, tối ưu năng lượng, dịch vụ cư dân và báo cáo vận hành.",
    image: {
      src: "/images/xai/set15/XAI-38-smart-building-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho tòa nhà thông minh với smart building hub, ticket, SLA, bảo trì, năng lượng và cư dân",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Tiếp nhận sự cố",
      "Bảo trì thiết bị",
      "Tối ưu năng lượng",
      "Dịch vụ cư dân"
    ],
    layout: "image-left"
  },
  {
    id: "xai-39",
    slug: "customer-service-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Chăm sóc khách hàng",
    description:
      "Hỗ trợ đa kênh, phân loại ticket, tra cứu tri thức, gợi ý phản hồi và theo dõi chất lượng dịch vụ.",
    image: {
      src: "/images/xai/set15/XAI-39-customer-service-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho chăm sóc khách hàng với service hub, kênh tiếp nhận, ticket, SLA và đánh giá chất lượng",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Omnichannel",
      "Phân loại ticket",
      "Tra cứu tri thức",
      "Theo dõi SLA"
    ],
    layout: "image-right"
  },
  {
    id: "xai-40",
    slug: "enterprise-operations-ai-solutions",
    eyebrow: "Industry Solutions",
    title: "Giải pháp AI cho Điều hành Doanh nghiệp",
    description:
      "Tăng tốc ra quyết định, tự động hóa công việc, kết nối tri thức nội bộ và tổng hợp KPI, rủi ro, hỗ trợ điều hành.",
    image: {
      src: "/images/xai/set15/XAI-40-enterprise-operations-ai-solutions.avif",
      alt: "Minh họa giải pháp AI cho điều hành doanh nghiệp với enterprise hub và các card trợ lý điều hành, phê duyệt, tri thức, KPI",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Trợ lý điều hành",
      "Phê duyệt & văn bản",
      "Tri thức nội bộ",
      "KPI & rủi ro"
    ],
    layout: "image-left"
  }
]
```

---

## 8. Component structure đề xuất

```txt
components/
  xai/
    XAIIndustrySection.tsx
    XAIFeatureRow.tsx
    XAIImageFrame.tsx
    XAICapabilityChips.tsx
    XAIIndustryHighlights.tsx

content/
  xai-industry-features.ts

public/
  images/
    xai/
      set15/
```

---

## 9. QA checklist

- [ ] Không hiển thị mã XAI-33…XAI-40 trên website.
- [ ] Ảnh giữ đúng style marketing infographic, không phải screenshot admin thuần.
- [ ] Heading / subheading / CTA render từ HTML/CMS.
- [ ] Ảnh giữ đúng 4:3.
- [ ] Có bản AVIF/WebP.
- [ ] Mobile không cắt mất vùng hero trung tâm.
- [ ] Không dùng logo AI sinh sai chuẩn.
- [ ] Alt text đầy đủ.
- [ ] Không dùng chữ nhỏ trong ảnh làm nội dung SEO chính.

---

## 10. Kế hoạch SET 16

### Định hướng: SET 16 — X.AI Enterprise Use Cases / Department Journeys

Sau SET 15 theo ngành, bước tiếp theo hợp lý là đi sâu vào **journey theo phòng ban / quy trình nghiệp vụ**.

SET 16 nên trả lời câu hỏi:

**X.AI đồng hành cùng từng phòng ban và từng hành trình công việc cụ thể như thế nào?**

### 8 ảnh đề xuất cho SET 16

1. **Hành trình AI cho Kinh doanh**  
   Từ lead → tư vấn → đề xuất → theo dõi cơ hội → chốt sale → chăm sóc.

2. **Hành trình AI cho Tài chính**  
   Từ hỏi đáp số liệu → phân tích dòng tiền → kiểm soát công nợ → phê duyệt chứng từ → báo cáo điều hành.

3. **Hành trình AI cho Nhân sự**  
   Từ tuyển dụng → onboarding → hỏi đáp chính sách → đánh giá → đào tạo → hỗ trợ nhân viên.

4. **Hành trình AI cho Vận hành / BQL**  
   Từ tiếp nhận sự cố → phân loại → điều phối → xử lý → giám sát SLA → báo cáo vận hành.

5. **Hành trình AI cho Chăm sóc khách hàng**  
   Từ tiếp nhận đa kênh → tra cứu tri thức → đề xuất phản hồi → escalation → CSAT.

6. **Hành trình AI cho Điều hành**  
   Từ tổng hợp dữ liệu → AI brief → cảnh báo rủi ro → ưu tiên hành động → quyết định.

7. **Hành trình AI cho Tri thức nội bộ**  
   Từ ingest tài liệu → indexing → hỏi đáp → trích dẫn → kiểm chứng → chia sẻ tri thức.

8. **Hành trình AI liên phòng ban**  
   Một use case xuyên phòng ban như “xử lý đơn hàng”, “phê duyệt đầu tư”, hoặc “xử lý sự cố lớn” với nhiều actor.

### Style của SET 16
- Vẫn giữ format 4:3, nền sáng, infographic marketing website.
- Khác SET 15 ở chỗ nhấn mạnh **luồng hành trình / workflow / stages** hơn.
- Trọng tâm nên là một timeline hoặc process flow ở giữa, các card input/output xung quanh.
- Không quay về kiểu dashboard screenshot thuần túy.

### Mục tiêu nội dung
SET 16 sẽ rất hữu ích để:
- làm trang `/products/x-ai/use-cases`
- làm section “How it works”
- kể story cho sales deck / microsite
- giúp khách hàng hình dung AI đi xuyên workflow thực tế

---

## 11. Thứ tự roadmap hình ảnh

```txt
SET 12 — Enterprise Agents, Governance & Deployment
SET 13 — Agent Builder, Knowledge & Automation
SET 14 — Security, Observability & AI Operations
SET 15 — Industry Solutions
SET 16 — Enterprise Use Cases / Department Journeys
```
