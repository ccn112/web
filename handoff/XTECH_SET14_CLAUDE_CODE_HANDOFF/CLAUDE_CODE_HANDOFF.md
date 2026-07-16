# XTECH Website — SET 14 Claude Code Handoff

## 1. Mục tiêu

Triển khai **SET 14 — X.AI Security, Observability & AI Operations** cho website XTECH.

SET 14 tiếp nối sau SET 12 và SET 13:

- **SET 12**: AI phục vụ ai, được quản trị và triển khai như thế nào.
- **SET 13**: Doanh nghiệp xây agent, knowledge, workflow, connector và template như thế nào.
- **SET 14**: Doanh nghiệp vận hành AI an toàn, đo lường được, truy vết được, kiểm soát được và sẵn sàng kiểm toán như thế nào.

Bộ gồm **8 ảnh riêng**, tỷ lệ **4:3**, nền sáng, mang tính **website marketing visual** chứ không phải screenshot backoffice thuần túy.

---

## 2. Asset mapping

| ID nội bộ | File | Chủ đề |
|---|---|---|
| XAI-25 | `assets/set14/XAI-25-ai-security-operations-center.png` | AI Security Operations Center |
| XAI-26 | `assets/set14/XAI-26-prompt-injection-threat-detection.png` | Prompt Injection & Threat Detection |
| XAI-27 | `assets/set14/XAI-27-data-privacy-pii-protection.png` | Data Privacy & PII Protection |
| XAI-28 | `assets/set14/XAI-28-observability-trace-explorer.png` | Observability & Trace Explorer |
| XAI-29 | `assets/set14/XAI-29-quality-latency-cost-monitor.png` | Quality, Latency & Cost Monitor |
| XAI-30 | `assets/set14/XAI-30-grounding-hallucination-monitor.png` | Grounding & Hallucination Monitor |
| XAI-31 | `assets/set14/XAI-31-incident-management-rollback-center.png` | Incident Management & Rollback Center |
| XAI-32 | `assets/set14/XAI-32-compliance-reporting-audit-evidence.png` | Compliance Reporting & Audit Evidence |

> Không hiển thị mã XAI-25…XAI-32 trên website. Đây chỉ là mã quản trị nội bộ.

---

## 3. Style guide của SET 14

SET 14 đã chuyển đúng về **ngôn ngữ hình ảnh website marketing**, không đi theo kiểu screenshot dashboard toàn màn hình.

### Đặc trưng thị giác bắt buộc
- Bố cục **trung tâm – vệ tinh**
- Một khối hero ở trung tâm
- Các card capability / control / insight ở xung quanh
- Đường kết nối cyan phát sáng
- Nền sáng trắng – xanh
- Công nghệ 3D/UI illustration nhẹ
- Card bo góc lớn, glassmorphism nhẹ
- Tiêu đề lớn, tiếng Việt
- Không dùng sidebar admin chiếm toàn ảnh
- Không dùng ảnh như ảnh chụp màn hình backoffice thuần túy

### Vai trò ảnh
- Ảnh dùng cho **hero section** hoặc **feature section** của website
- Text chính phải render bằng **HTML/CMS**
- Chữ nhỏ trong ảnh chỉ là visual support, không được xem là nguồn nội dung chính

---

## 4. Vị trí trong sitemap X.AI

SET 14 nên map chủ yếu vào:

- `/products/x-ai/security`
- `/products/x-ai/observability`
- `/products/x-ai/ai-operations`
- `/products/x-ai/governance`

Ngoài ra có thể tái sử dụng một phần trong:
- `/products/x-ai/platform`
- `/products/x-ai/deployment`
- `/products/x-ai/enterprise`

### Gợi ý phân bổ từng ảnh

- **XAI-25** → Hero / section chính của trang `security`
- **XAI-26** → Section `prompt protection` / `threat detection`
- **XAI-27** → Section `privacy & data protection`
- **XAI-28** → Section `observability & tracing`
- **XAI-29** → Section `cost / quality / performance optimization`
- **XAI-30** → Section `grounding / answer reliability`
- **XAI-31** → Section `incident response & rollback`
- **XAI-32** → Section `compliance & audit`

---

## 5. Quy tắc bắt buộc

### Logo XTECH
- Không dùng logo do AI vẽ lại.
- Nếu cần logo XTECH, dùng asset thật trong HTML/CSS hoặc ghép hậu kỳ bằng file gốc.
- Nếu trong ảnh có xuất hiện chữ hoặc dấu hiệu gần giống logo nhưng chưa đúng chuẩn brand, cần mask/crop/cover trước khi production.

### Nội dung chữ
- Heading, subheading, bullet, CTA phải render bằng HTML/CMS.
- Không dùng chữ nhỏ trong ảnh để thay thế nội dung thật.
- Ảnh là visual concept/marketing illustration.

### Responsive
- Desktop: ảnh chiếm ~52–58% chiều ngang block.
- Tablet: có thể đảo layout text/image.
- Mobile: ảnh full width, giữ `aspect-ratio: 4 / 3`.
- Ưu tiên `object-fit: contain`.

### Hiệu năng
- Convert PNG sang AVIF và WebP.
- Giữ PNG gốc làm archive.
- Dùng `next/image`.
- Khai báo `width`, `height`, `sizes`.
- Lazy-load với ảnh không ở above-the-fold.

---

## 6. Content model đề xuất

```ts
export type XAIOpsFeature = {
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
export const xaiOpsFeatures: XAIOpsFeature[] = [
  {
    id: "xai-25",
    slug: "ai-security-operations-center",
    eyebrow: "Security",
    title: "AI Security Operations Center",
    description:
      "Giám sát mối đe dọa, phát hiện bất thường, thực thi chính sách và bảo vệ tài sản AI theo thời gian thực.",
    image: {
      src: "/images/xai/set14/XAI-25-ai-security-operations-center.avif",
      alt: "Trung tâm điều hành an ninh AI với khối điều khiển trung tâm và các card vệ tinh giám sát mối đe dọa",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Threat monitoring",
      "Policy enforcement",
      "Access control",
      "Anomaly detection"
    ],
    layout: "image-right"
  },
  {
    id: "xai-26",
    slug: "prompt-injection-threat-detection",
    eyebrow: "Threat Protection",
    title: "Prompt Injection & Threat Detection",
    description:
      "Phát hiện prompt injection, nội dung độc hại, thao túng công cụ và các rủi ro tấn công vào luồng AI.",
    image: {
      src: "/images/xai/set14/XAI-26-prompt-injection-threat-detection.avif",
      alt: "Minh họa phát hiện mối đe dọa AI theo thời gian thực với bộ lọc trung tâm và các lớp kiểm tra vệ tinh",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Prompt inspection",
      "Content sanitization",
      "Risk scoring",
      "Escalation workflow"
    ],
    layout: "image-left"
  },
  {
    id: "xai-27",
    slug: "data-privacy-pii-protection",
    eyebrow: "Privacy",
    title: "Data Privacy & PII Protection",
    description:
      "Nhận diện dữ liệu cá nhân, che giấu thông tin nhạy cảm và áp dụng chính sách bảo vệ dữ liệu trên toàn hệ thống.",
    image: {
      src: "/images/xai/set14/XAI-27-data-privacy-pii-protection.avif",
      alt: "Minh họa bảo vệ dữ liệu nhạy cảm với nhận diện PII, masking và kiểm soát quyền truy cập",
      width: 1448,
      height: 1086
    },
    highlights: [
      "PII detection",
      "Masking & redaction",
      "Retention policies",
      "Access governance"
    ],
    layout: "image-right"
  },
  {
    id: "xai-28",
    slug: "observability-trace-explorer",
    eyebrow: "Observability",
    title: "Observability & Trace Explorer",
    description:
      "Quan sát toàn trình hoạt động AI, theo dõi từng bước xử lý, truy vết token và phân tích nguyên nhân sự cố.",
    image: {
      src: "/images/xai/set14/XAI-28-observability-trace-explorer.avif",
      alt: "Minh họa quan sát toàn trình hoạt động AI với luồng xử lý trung tâm và các panel truy vết",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Step-by-step traces",
      "Token visibility",
      "Latency tracking",
      "Root cause analysis"
    ],
    layout: "image-left"
  },
  {
    id: "xai-29",
    slug: "quality-latency-cost-monitor",
    eyebrow: "Optimization",
    title: "Quality, Latency & Cost Monitor",
    description:
      "Giám sát chất lượng, độ trễ, mức sử dụng token và chi phí vận hành AI để tối ưu hiệu năng và ngân sách.",
    image: {
      src: "/images/xai/set14/XAI-29-quality-latency-cost-monitor.avif",
      alt: "Minh họa tối ưu hiệu năng và chi phí AI với các chỉ số chất lượng, độ trễ và chi phí",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Quality metrics",
      "Latency monitoring",
      "Cost tracking",
      "Optimization suggestions"
    ],
    layout: "image-right"
  },
  {
    id: "xai-30",
    slug: "grounding-hallucination-monitor",
    eyebrow: "Reliability",
    title: "Grounding & Hallucination Monitor",
    description:
      "Kiểm soát độ chính xác câu trả lời AI bằng nguồn dẫn, kiểm chứng tự động, đối chiếu sự thật và phê duyệt chuyên gia.",
    image: {
      src: "/images/xai/set14/XAI-30-grounding-hallucination-monitor.avif",
      alt: "Minh họa kiểm soát độ chính xác của câu trả lời AI với citation, grounding và human review",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Citation checking",
      "Grounded answers",
      "Fact validation",
      "Human oversight"
    ],
    layout: "image-left"
  },
  {
    id: "xai-31",
    slug: "incident-management-rollback-center",
    eyebrow: "AI Operations",
    title: "Incident Management & Rollback Center",
    description:
      "Phát hiện, khoanh vùng, khôi phục agent, prompt hoặc model và phối hợp xử lý sự cố AI theo chuẩn vận hành doanh nghiệp.",
    image: {
      src: "/images/xai/set14/XAI-31-incident-management-rollback-center.avif",
      alt: "Minh họa quản lý sự cố và khôi phục AI với dòng xử lý trung tâm và các card rollback, notify, postmortem",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Incident triage",
      "Rollback workflows",
      "Stakeholder notification",
      "Post-incident review"
    ],
    layout: "image-right"
  },
  {
    id: "xai-32",
    slug: "compliance-reporting-audit-evidence",
    eyebrow: "Compliance",
    title: "Compliance Reporting & Audit Evidence",
    description:
      "Chuẩn hóa hồ sơ tuân thủ, lịch sử phê duyệt, bằng chứng kiểm soát và đối chiếu tiêu chuẩn để sẵn sàng kiểm toán.",
    image: {
      src: "/images/xai/set14/XAI-32-compliance-reporting-audit-evidence.avif",
      alt: "Minh họa tuân thủ và kiểm toán AI doanh nghiệp với hồ sơ trung tâm và các card policy, evidence, audit",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Policy management",
      "Audit trail",
      "Evidence packs",
      "Standards mapping"
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
    XAIOpsSection.tsx
    XAIFeatureRow.tsx
    XAIImageFrame.tsx
    XAICapabilityChips.tsx
    XAIOpsHighlights.tsx

content/
  xai-ops-features.ts

public/
  images/
    xai/
      set14/
```

---

## 9. QA checklist

- [ ] Không hiển thị mã XAI-25…XAI-32 trên website.
- [ ] Ảnh đúng style marketing website, không phải screenshot admin thuần.
- [ ] Heading / subheading / CTA đều ở HTML/CMS.
- [ ] Ảnh giữ đúng 4:3.
- [ ] Có bản AVIF/WebP.
- [ ] Mobile không cắt mất phần trung tâm.
- [ ] Không dùng logo AI sinh sai chuẩn.
- [ ] Alt text đầy đủ.
- [ ] Không khẳng định nội dung trong ảnh là màn hình production thật nếu vẫn đang ở mức concept.

---

## 10. Kế hoạch SET 15

### Định hướng: SET 15 — X.AI Industry Solutions

Sau khi đã có:
- agent theo vai trò,
- builder & automation,
- security & AI ops,

thì SET 15 nên trả lời câu hỏi:

**X.AI áp dụng vào từng ngành cụ thể như thế nào?**

### 8 ảnh đề xuất cho SET 15

1. **Real Estate AI Solutions**  
   Bán hàng dự án, lead, inventory, customer service, legal & payment.

2. **Manufacturing AI Solutions**  
   Sản xuất, bảo trì, chất lượng, an toàn, ca kíp, năng suất.

3. **Retail & Distribution AI Solutions**  
   Đơn hàng, đại lý, khuyến mại, tồn kho, chăm sóc khách hàng.

4. **Construction AI Solutions**  
   Tiến độ, vật tư, hồ sơ, giám sát hiện trường, an toàn lao động.

5. **Finance & Accounting AI Solutions**  
   Công nợ, ngân sách, dòng tiền, kiểm soát chứng từ, báo cáo.

6. **Smart Building AI Solutions**  
   BQL, cư dân, sự cố, thiết bị, năng lượng, dịch vụ.

7. **Customer Service AI Solutions**  
   Omnichannel, ticket, knowledge, SLA, escalations, response quality.

8. **Enterprise Operations AI Solutions**  
   HR, admin, documents, approvals, knowledge workers, executive insights.

### Nguyên tắc hình ảnh SET 15
- Vẫn giữ style của SET 14: marketing infographic, 4:3, nền sáng.
- Mỗi ảnh có **core scenario** ở trung tâm và **capability cards** bao quanh.
- Không quay lại kiểu screenshot dashboard thuần túy.
- Tiêu đề lớn bằng tiếng Việt.
- Tập trung vào **ngữ cảnh ngành**, không lặp lại quá nhiều content của SET 12.

---

## 11. Thứ tự roadmap hình ảnh

```txt
SET 12 — Enterprise Agents, Governance & Deployment
SET 13 — Agent Builder, Knowledge & Automation
SET 14 — Security, Observability & AI Operations
SET 15 — Industry Solutions
SET 16 — Enterprise Use Cases / Department Journeys
```
