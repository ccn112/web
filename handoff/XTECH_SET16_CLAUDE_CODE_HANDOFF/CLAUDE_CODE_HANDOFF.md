# XTECH Website — SET 16 Claude Code Handoff

## 1. Mục tiêu

Triển khai **SET 16 — X.AI Enterprise Use Cases / Department Journeys** cho website XTECH.

SET 16 đi sâu hơn SET 15:

- **SET 15** trình bày X.AI theo từng ngành.
- **SET 16** trình bày X.AI theo từng phòng ban và hành trình nghiệp vụ thực tế.

Mỗi visual diễn giải một luồng hoàn chỉnh:

```text
Đầu vào
→ AI phân tích
→ phối hợp người/hệ thống
→ hành động
→ kết quả
```

Bộ gồm **8 ảnh riêng**, tỷ lệ **4:3**, nền sáng, phong cách website marketing infographic.

---

## 2. Asset mapping

| ID nội bộ | File | Chủ đề |
|---|---|---|
| XAI-41 | `assets/set16/XAI-41-sales-department-journey.png` | Hành trình AI cho Kinh doanh |
| XAI-42 | `assets/set16/XAI-42-finance-department-journey.png` | Hành trình AI cho Tài chính |
| XAI-43 | `assets/set16/XAI-43-hr-department-journey.png` | Hành trình AI cho Nhân sự |
| XAI-44 | `assets/set16/XAI-44-operations-bql-journey.png` | Hành trình AI cho Vận hành & BQL |
| XAI-45 | `assets/set16/XAI-45-customer-service-journey.png` | Hành trình AI cho Chăm sóc khách hàng |
| XAI-46 | `assets/set16/XAI-46-executive-journey.png` | Hành trình AI cho Điều hành |
| XAI-47 | `assets/set16/XAI-47-knowledge-journey.png` | Hành trình AI cho Tri thức nội bộ |
| XAI-48 | `assets/set16/XAI-48-cross-functional-journey.png` | Hành trình AI liên phòng ban |

> Không hiển thị mã XAI-41…XAI-48 trên website. Chỉ dùng trong CMS/codebase.

---

## 3. Vị trí trong sitemap

SET 16 nên map vào:

- `/products/x-ai/use-cases`
- `/products/x-ai/departments/sales`
- `/products/x-ai/departments/finance`
- `/products/x-ai/departments/hr`
- `/products/x-ai/departments/operations`
- `/products/x-ai/departments/customer-service`
- `/products/x-ai/departments/executive`
- `/products/x-ai/departments/knowledge`
- `/products/x-ai/cross-functional`

Ngoài ra có thể tái sử dụng trong:

- landing page X.AI chính
- trang giải pháp chuyển đổi số
- case study
- sales deck
- microsite theo phòng ban

---

## 4. Style guide

### Đặc trưng thị giác
- Bố cục trung tâm là **journey flow**
- Các step đánh số rõ ràng
- Card input/output nằm xung quanh
- Kết nối cyan phát sáng
- Nền trắng – xanh sáng
- UI illustration kết hợp 3D nhẹ
- Tiêu đề lớn bằng tiếng Việt
- Không dùng layout screenshot admin thuần túy

### Vai trò ảnh
- Dùng để giải thích “How it works”
- Thể hiện end-to-end business flow
- Không xem chữ nhỏ trong ảnh là content chính
- Heading, description, CTA vẫn render bằng HTML/CMS

---

## 5. Quy tắc bắt buộc

### Logo
- Không dùng logo AI sinh sai chuẩn.
- Dùng đúng logo XTECH gốc ở HTML/CSS hoặc hậu kỳ.
- Nếu phần logo trong ảnh không chuẩn, cần mask/crop/cover trước khi production.

### Responsive
- Desktop: ảnh chiếm khoảng 52–58% chiều ngang block.
- Tablet: có thể chuyển layout dọc.
- Mobile: ảnh full width, giữ `aspect-ratio: 4 / 3`.
- Ưu tiên `object-fit: contain`.

### Hiệu năng
- Convert PNG → AVIF + WebP.
- Giữ PNG gốc làm archive.
- Dùng `next/image`.
- Khai báo `width`, `height`, `sizes`.
- Lazy-load các ảnh dưới fold.

---

## 6. Content model đề xuất

```ts
export type XAIDepartmentJourney = {
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
  stages: string[]
  outcomes: string[]
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
export const xaiDepartmentJourneys: XAIDepartmentJourney[] = [
  {
    id: "xai-41",
    slug: "sales-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Kinh doanh",
    description:
      "Từ thu lead, phân loại khách hàng, tư vấn sản phẩm đến theo dõi cơ hội, chốt sale và chăm sóc sau bán.",
    image: {
      src: "/images/xai/set16/XAI-41-sales-department-journey.avif",
      alt: "Hành trình AI cho kinh doanh từ lead đến chốt sale và chăm sóc sau bán",
      width: 1448,
      height: 1086
    },
    stages: [
      "Thu lead",
      "Phân loại khách hàng",
      "Tư vấn & gợi ý sản phẩm",
      "Theo dõi cơ hội",
      "Đề xuất hành động",
      "Chốt sale",
      "Chăm sóc sau bán"
    ],
    outcomes: [
      "Tăng tỷ lệ chuyển đổi",
      "Rút ngắn chu kỳ bán hàng",
      "Tăng hiệu quả follow-up"
    ],
    layout: "image-right"
  },
  {
    id: "xai-42",
    slug: "finance-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Tài chính",
    description:
      "Từ hỏi đáp số liệu, phân tích dòng tiền, kiểm soát công nợ và ngân sách đến phê duyệt chứng từ và báo cáo điều hành.",
    image: {
      src: "/images/xai/set16/XAI-42-finance-department-journey.avif",
      alt: "Hành trình AI cho tài chính từ hỏi đáp số liệu đến báo cáo điều hành",
      width: 1448,
      height: 1086
    },
    stages: [
      "Hỏi đáp số liệu",
      "Phân tích dòng tiền",
      "Kiểm tra công nợ",
      "Kiểm soát ngân sách",
      "Phê duyệt chứng từ",
      "Lập báo cáo",
      "Đề xuất điều hành"
    ],
    outcomes: [
      "Minh bạch dòng tiền",
      "Giảm rủi ro công nợ",
      "Tăng tốc phê duyệt"
    ],
    layout: "image-left"
  },
  {
    id: "xai-43",
    slug: "hr-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Nhân sự",
    description:
      "Từ tuyển dụng, onboarding, hỏi đáp chính sách đến đào tạo, đánh giá hiệu suất và hỗ trợ nhân viên.",
    image: {
      src: "/images/xai/set16/XAI-43-hr-department-journey.avif",
      alt: "Hành trình AI cho nhân sự từ tuyển dụng đến hỗ trợ nhân viên",
      width: 1448,
      height: 1086
    },
    stages: [
      "Tuyển dụng",
      "Sàng lọc hồ sơ",
      "Onboarding",
      "Hỏi đáp chính sách",
      "Đào tạo",
      "Đánh giá hiệu suất",
      "Hỗ trợ nhân viên"
    ],
    outcomes: [
      "Rút ngắn thời gian tuyển dụng",
      "Chuẩn hóa trải nghiệm nhân viên",
      "Tăng hiệu suất đội ngũ"
    ],
    layout: "image-right"
  },
  {
    id: "xai-44",
    slug: "operations-bql-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Vận hành & BQL",
    description:
      "Từ tiếp nhận sự cố, phân loại ticket, điều phối xử lý đến theo dõi SLA, cập nhật trạng thái và báo cáo vận hành.",
    image: {
      src: "/images/xai/set16/XAI-44-operations-bql-journey.avif",
      alt: "Hành trình AI cho vận hành và ban quản lý từ tiếp nhận sự cố đến báo cáo",
      width: 1448,
      height: 1086
    },
    stages: [
      "Tiếp nhận sự cố",
      "Phân loại ticket",
      "Điều phối xử lý",
      "Theo dõi SLA",
      "Cập nhật trạng thái",
      "Đánh giá kết quả",
      "Báo cáo vận hành"
    ],
    outcomes: [
      "Điều phối nhanh",
      "Tăng tỷ lệ đúng SLA",
      "Minh bạch tiến độ xử lý"
    ],
    layout: "image-left"
  },
  {
    id: "xai-45",
    slug: "customer-service-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Chăm sóc khách hàng",
    description:
      "Từ tiếp nhận đa kênh, hiểu yêu cầu, tra cứu tri thức đến gợi ý phản hồi, escalation, đóng ticket và đo CSAT.",
    image: {
      src: "/images/xai/set16/XAI-45-customer-service-journey.avif",
      alt: "Hành trình AI cho chăm sóc khách hàng từ tiếp nhận đa kênh đến đo CSAT",
      width: 1448,
      height: 1086
    },
    stages: [
      "Tiếp nhận đa kênh",
      "Hiểu yêu cầu",
      "Tra cứu tri thức",
      "Gợi ý phản hồi",
      "Chuyển xử lý nâng cao",
      "Đóng ticket",
      "Đo CSAT"
    ],
    outcomes: [
      "Tăng tỷ lệ tự động trả lời",
      "Giảm thời gian phản hồi",
      "Nâng cao chất lượng dịch vụ"
    ],
    layout: "image-right"
  },
  {
    id: "xai-46",
    slug: "executive-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Điều hành",
    description:
      "Từ tổng hợp dữ liệu đa nguồn đến AI brief, cảnh báo rủi ro, xác định ưu tiên, đề xuất hành động và theo dõi kết quả.",
    image: {
      src: "/images/xai/set16/XAI-46-executive-journey.avif",
      alt: "Hành trình AI cho điều hành từ dữ liệu đa nguồn đến quyết định chiến lược",
      width: 1448,
      height: 1086
    },
    stages: [
      "Gom dữ liệu",
      "AI tổng hợp",
      "Cảnh báo rủi ro",
      "Xác định ưu tiên",
      "Đề xuất hành động",
      "Ra quyết định",
      "Theo dõi kết quả"
    ],
    outcomes: [
      "Ra quyết định nhanh hơn",
      "Ưu tiên đúng vấn đề",
      "Theo dõi hiệu quả thực thi"
    ],
    layout: "image-left"
  },
  {
    id: "xai-47",
    slug: "knowledge-journey",
    eyebrow: "Department Journey",
    title: "Hành trình AI cho Tri thức nội bộ",
    description:
      "Từ nạp tài liệu, lập chỉ mục, phân loại tri thức đến hỏi đáp, trích dẫn nguồn, kiểm chứng và chia sẻ.",
    image: {
      src: "/images/xai/set16/XAI-47-knowledge-journey.avif",
      alt: "Hành trình AI cho tri thức nội bộ từ nạp tài liệu đến chia sẻ kiến thức",
      width: 1448,
      height: 1086
    },
    stages: [
      "Nạp tài liệu",
      "Lập chỉ mục",
      "Phân loại tri thức",
      "Hỏi đáp thông minh",
      "Trích dẫn nguồn",
      "Kiểm chứng",
      "Chia sẻ tri thức"
    ],
    outcomes: [
      "Rút ngắn thời gian tìm kiếm",
      "Tăng độ tin cậy câu trả lời",
      "Lan tỏa tri thức toàn doanh nghiệp"
    ],
    layout: "image-right"
  },
  {
    id: "xai-48",
    slug: "cross-functional-journey",
    eyebrow: "Cross-functional Journey",
    title: "Hành trình AI liên phòng ban",
    description:
      "Kết nối kinh doanh, tài chính, pháp chế, vận hành, chăm sóc khách hàng và điều hành trong một luồng xử lý xuyên suốt.",
    image: {
      src: "/images/xai/set16/XAI-48-cross-functional-journey.avif",
      alt: "Hành trình AI liên phòng ban với kinh doanh, tài chính, pháp chế, vận hành và chăm sóc khách hàng",
      width: 1448,
      height: 1086
    },
    stages: [
      "Tiếp nhận yêu cầu",
      "Kinh doanh xác nhận",
      "Tài chính kiểm tra",
      "Pháp chế phê duyệt",
      "Vận hành xử lý",
      "CSKH phản hồi",
      "Điều hành theo dõi"
    ],
    outcomes: [
      "Dữ liệu liên thông",
      "Phê duyệt minh bạch",
      "Thực thi đồng bộ"
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
    XAIDepartmentJourneySection.tsx
    XAIJourneyFlow.tsx
    XAIJourneyCard.tsx
    XAIImageFrame.tsx
    XAIJourneyOutcomes.tsx

content/
  xai-department-journeys.ts

public/
  images/
    xai/
      set16/
```

---

## 9. QA checklist

- [ ] Không hiển thị mã XAI-41…XAI-48 trên website.
- [ ] Ảnh giữ đúng style infographic marketing website.
- [ ] Journey flow đọc được rõ theo thứ tự.
- [ ] Heading / description / CTA render bằng HTML/CMS.
- [ ] Ảnh giữ đúng 4:3.
- [ ] Có bản AVIF/WebP.
- [ ] Mobile không cắt mất journey trung tâm.
- [ ] Không dùng logo AI sinh sai chuẩn.
- [ ] Alt text đầy đủ.
- [ ] Không dùng chữ nhỏ trong ảnh làm nội dung SEO chính.

---

## 10. Kế hoạch SET 17

### Định hướng: SET 17 — X.AI Outcomes, ROI & Transformation Value

Sau SET 16, website đã có:
- agent,
- builder,
- governance,
- security & AI ops,
- industry solutions,
- department journeys.

Bước tiếp theo nên chuyển sang **giá trị kinh doanh và kết quả đo lường**.

SET 17 trả lời:

**Triển khai X.AI tạo ra giá trị gì, đo lường ROI thế nào và mở rộng từ pilot đến enterprise ra sao?**

### 8 ảnh đề xuất

1. **AI Value Framework**  
   4 nhóm giá trị: doanh thu, chi phí, tốc độ, trải nghiệm.

2. **Productivity & Time Savings**  
   Giờ công tiết kiệm, tác vụ tự động, thời gian phản hồi.

3. **Revenue & Conversion Impact**  
   Lead conversion, upsell, sales cycle, opportunity value.

4. **Cost Optimization & Efficiency**  
   Cost per task, token cost, headcount leverage, process efficiency.

5. **Customer Experience Impact**  
   CSAT, SLA, first-response time, self-service rate.

6. **Risk & Compliance Reduction**  
   Vi phạm giảm, kiểm soát tăng, audit readiness, incident reduction.

7. **Pilot-to-Scale Transformation Roadmap**  
   Discover → Pilot → Validate → Scale → Optimize.

8. **Executive AI Value Dashboard**  
   Tổng hợp ROI, adoption, value realized, next priorities.

### Style SET 17
- Vẫn 4:3, nền sáng, marketing infographic.
- Trọng tâm là **value meters / before-after / outcome cards / roadmap**.
- Ít mô tả chức năng, nhiều thông điệp kết quả.
- Không dùng dashboard screenshot thuần túy.
