# XTECH Website — SET 12 Claude Code Handoff

## 1. Mục tiêu

Triển khai section hình ảnh **X.AI Enterprise Agents, Governance & Deployment** trên website XTECH.

SET 12 chuyển thông điệp từ “AI platform capabilities” sang:

1. Agent theo vai trò nghiệp vụ.
2. Quản trị và kiểm soát AI doanh nghiệp.
3. Vận hành model/prompt/evaluation.
4. Triển khai và tích hợp trong kiến trúc CNTT doanh nghiệp.

Bộ gồm **8 ảnh độc lập**, tỷ lệ **4:3**, nền sáng, UI illustration là trọng tâm.

---

## 2. Asset mapping

| ID nội bộ | File | Chủ đề |
|---|---|---|
| XAI-09 | `assets/set12/XAI-09-sales-agent.png` | Sales Agent |
| XAI-10 | `assets/set12/XAI-10-finance-agent.png` | Finance Agent |
| XAI-11 | `assets/set12/XAI-11-building-operations-agent.png` | Building Operations Agent |
| XAI-12 | `assets/set12/XAI-12-customer-service-agent.png` | Customer Service Agent |
| XAI-13 | `assets/set12/XAI-13-executive-copilot.png` | Executive Copilot |
| XAI-14 | `assets/set12/XAI-14-ai-governance-guardrails.png` | AI Governance & Guardrails |
| XAI-15 | `assets/set12/XAI-15-model-prompt-evaluation-center.png` | Model, Prompt & Evaluation Center |
| XAI-16 | `assets/set12/XAI-16-enterprise-ai-deployment-integration.png` | Enterprise AI Deployment & Integration |

> Không hiển thị mã XAI-09…XAI-16 trên giao diện website. Mã chỉ dùng trong CMS/codebase.

---

## 3. Quy tắc bắt buộc

### Logo XTECH

- Không dùng logo XTECH do AI vẽ lại trong ảnh.
- Không tái tạo, đổi màu, đổi tỷ lệ hoặc cách điệu logo.
- Dùng đúng file logo gốc của XTECH:
  - Logo xanh/cyan trên nền sáng.
  - Logo trắng trên nền tối.
- Logo phải là asset HTML/CSS riêng, đặt ngoài ảnh hoặc composite bằng file gốc ở bước hậu kỳ.
- Nếu ảnh có logo AI sinh sẵn, cần crop/mask/cover trước khi dùng production.

### Nội dung chữ

- Nội dung chính phải render bằng HTML/CMS.
- Không phụ thuộc vào chữ nhỏ bên trong ảnh.
- Ảnh được xem là **visual product illustration**, không phải screenshot chức năng thật.
- Alt text, heading và mô tả phải có trong HTML để đáp ứng SEO/accessibility.

### Responsive

- Desktop: illustration chiếm 52–58% chiều ngang.
- Tablet: illustration dưới heading hoặc xen kẽ theo thứ tự.
- Mobile: ảnh full width, giữ `aspect-ratio: 4 / 3`.
- Dùng `object-fit: cover` hoặc `contain` tùy section; ưu tiên `contain` để tránh mất UI quan trọng.

### Hiệu năng

- Chuyển PNG sang AVIF và WebP.
- Giữ PNG gốc làm source archive.
- Gợi ý kích thước:
  - Desktop AVIF/WebP: 1200–1400px chiều rộng.
  - Tablet: 900px.
  - Mobile: 640px.
- Lazy-load tất cả ảnh trừ ảnh đầu tiên nằm above-the-fold.
- Khai báo `width`, `height`, `sizes` để tránh CLS.

---

## 4. Content model đề xuất

```ts
export type XAIAgentFeature = {
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

## 5. Seed data đề xuất

```ts
export const xaiEnterpriseFeatures: XAIAgentFeature[] = [
  {
    id: "xai-09",
    slug: "sales-agent",
    eyebrow: "Role-based AI Agent",
    title: "Sales Agent",
    description:
      "Hỗ trợ xử lý lead, tư vấn sản phẩm, tóm tắt khách hàng, nhận diện cơ hội và đề xuất hành động tiếp theo.",
    image: {
      src: "/images/xai/set12/XAI-09-sales-agent.avif",
      alt: "Giao diện Sales Agent với lead pipeline, cơ hội bán hàng và AI gợi ý hành động",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Lead intelligence",
      "Customer summary",
      "Next-best action",
      "Opportunity insights"
    ],
    layout: "image-right"
  },
  {
    id: "xai-10",
    slug: "finance-agent",
    eyebrow: "Role-based AI Agent",
    title: "Finance Agent",
    description:
      "Hỏi đáp tài chính bằng ngôn ngữ tự nhiên, phân tích dòng tiền, công nợ, ngân sách và cảnh báo bất thường.",
    image: {
      src: "/images/xai/set12/XAI-10-finance-agent.avif",
      alt: "Giao diện Finance Agent phân tích dòng tiền, công nợ, ngân sách và cảnh báo bất thường",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Cash-flow analysis",
      "AP/AR monitoring",
      "Budget variance",
      "Anomaly detection"
    ],
    layout: "image-left"
  },
  {
    id: "xai-11",
    slug: "building-operations-agent",
    eyebrow: "Role-based AI Agent",
    title: "Building Operations Agent",
    description:
      "Tóm tắt sự cố, thiết bị, bảo trì và năng lượng; đề xuất phương án xử lý cho đội ngũ vận hành tòa nhà.",
    image: {
      src: "/images/xai/set12/XAI-11-building-operations-agent.avif",
      alt: "Giao diện Building Operations Agent theo dõi sự cố, thiết bị, bảo trì và năng lượng",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Incident summary",
      "Predictive maintenance",
      "Energy optimization",
      "Suggested actions"
    ],
    layout: "image-right"
  },
  {
    id: "xai-12",
    slug: "customer-service-agent",
    eyebrow: "Role-based AI Agent",
    title: "Customer Service Agent",
    description:
      "Tiếp nhận yêu cầu đa kênh, tra cứu chính sách, phân loại ticket, tóm tắt hội thoại và gợi ý phản hồi.",
    image: {
      src: "/images/xai/set12/XAI-12-customer-service-agent.avif",
      alt: "Giao diện Customer Service Agent với omnichannel inbox, ticket và AI hỗ trợ xử lý",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Omnichannel intake",
      "Ticket classification",
      "Policy lookup",
      "Suggested reply"
    ],
    layout: "image-left"
  },
  {
    id: "xai-13",
    slug: "executive-copilot",
    eyebrow: "Executive Intelligence",
    title: "Executive Copilot",
    description:
      "Tổng hợp KPI, tóm tắt điều hành, cảnh báo rủi ro và đề xuất các ưu tiên quan trọng cho lãnh đạo.",
    image: {
      src: "/images/xai/set12/XAI-13-executive-copilot.avif",
      alt: "Giao diện Executive Copilot với KPI, dự báo, rủi ro và các ưu tiên điều hành",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Executive brief",
      "KPI synthesis",
      "Risk alerts",
      "Priority recommendations"
    ],
    layout: "image-right"
  },
  {
    id: "xai-14",
    slug: "ai-governance-guardrails",
    eyebrow: "Trust & Control",
    title: "AI Governance & Guardrails",
    description:
      "Quản lý phân quyền, bảo mật, chính sách sử dụng AI, dữ liệu nhạy cảm, phê duyệt và nhật ký hoạt động.",
    image: {
      src: "/images/xai/set12/XAI-14-ai-governance-guardrails.avif",
      alt: "Trung tâm quản trị AI với RBAC, chính sách, kiểm soát dữ liệu, phê duyệt và audit log",
      width: 1448,
      height: 1086
    },
    highlights: [
      "RBAC",
      "Policy enforcement",
      "Data protection",
      "Audit & approval"
    ],
    layout: "image-left"
  },
  {
    id: "xai-15",
    slug: "model-prompt-evaluation-center",
    eyebrow: "AI Operations",
    title: "Model, Prompt & Evaluation Center",
    description:
      "Quản lý model, prompt, phiên bản, bộ test, đánh giá chất lượng, độ trễ, độ an toàn và chi phí.",
    image: {
      src: "/images/xai/set12/XAI-15-model-prompt-evaluation-center.avif",
      alt: "Giao diện quản lý model, prompt, phiên bản, test suite, đánh giá chất lượng và chi phí AI",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Model registry",
      "Prompt versioning",
      "Evaluation suites",
      "Quality & cost control"
    ],
    layout: "image-right"
  },
  {
    id: "xai-16",
    slug: "enterprise-ai-deployment-integration",
    eyebrow: "Enterprise Architecture",
    title: "Enterprise AI Deployment & Integration",
    description:
      "Triển khai SaaS, private cloud, on-premise hoặc hybrid; kết nối ERP, CRM, DWH, API, email và workspace.",
    image: {
      src: "/images/xai/set12/XAI-16-enterprise-ai-deployment-integration.avif",
      alt: "Kiến trúc triển khai X.AI theo mô hình SaaS, private cloud, on-premise và tích hợp hệ thống doanh nghiệp",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Deploy anywhere",
      "Enterprise integration",
      "Secure by design",
      "Hybrid-ready"
    ],
    layout: "image-left"
  }
]
```

---

## 6. Component structure đề xuất

```txt
components/
  xai/
    XAIEnterpriseSection.tsx
    XAIFeatureRow.tsx
    XAIImageFrame.tsx
    XAICapabilityChips.tsx
    XAIDeploymentArchitecture.tsx

content/
  xai-enterprise-features.ts

public/
  images/
    xai/
      set12/
```

### `XAIFeatureRow`

- Layout xen kẽ trái/phải.
- Heading và description nằm trong HTML.
- Ảnh nằm trong khung 4:3.
- Có thể sử dụng `next/image`.
- Tránh animation gây khó đọc.
- Chỉ dùng parallax/hover rất nhẹ:
  - `translateY(-4px)`
  - shadow tăng nhẹ
  - duration 300–400ms
- Tôn trọng `prefers-reduced-motion`.

---

## 7. Trình tự section đề xuất

1. Sales Agent
2. Finance Agent
3. Building Operations Agent
4. Customer Service Agent
5. Executive Copilot
6. AI Governance & Guardrails
7. Model, Prompt & Evaluation Center
8. Enterprise AI Deployment & Integration

Logic kể chuyện:

```txt
Agent nghiệp vụ
→ Agent điều hành
→ Kiểm soát và quản trị
→ Vận hành AI
→ Triển khai toàn doanh nghiệp
```

---

## 8. QA checklist

- [ ] Không có mã SET/XAI hiển thị trong giao diện.
- [ ] Logo AI sinh trong ảnh được crop/mask; logo thật dùng asset riêng.
- [ ] Không dùng chữ trong ảnh làm nội dung SEO.
- [ ] Ảnh giữ đúng 4:3.
- [ ] Alt text đầy đủ.
- [ ] AVIF/WebP được tạo.
- [ ] Mobile không bị cắt mất AI side panel hoặc nội dung chính.
- [ ] Contrast và focus states đạt yêu cầu accessibility.
- [ ] Không dùng tên thương hiệu model trong copy public nếu chưa cần thiết.
- [ ] Không khẳng định dashboard trong ảnh là tính năng đã production nếu chưa triển khai.

---

# Kế hoạch set ảnh tiếp theo

## Khuyến nghị ưu tiên: SET 13 — X.AI Agent Builder, Knowledge & Automation

SET 12 đã trả lời câu hỏi: **X.AI phục vụ ai, được quản trị và triển khai như thế nào?**

SET 13 nên trả lời: **Doanh nghiệp tự xây agent và tự động hóa công việc bằng X.AI như thế nào?**

### 8 ảnh đề xuất

1. **Visual Agent Builder**  
   Canvas kéo-thả tạo agent, role, instruction, tools và output.

2. **Knowledge Hub & RAG Studio**  
   Kết nối tài liệu, website, database; chunking, indexing, retrieval test.

3. **Workflow Automation Studio**  
   Trigger, condition, action, approval, human-in-the-loop.

4. **Tool & API Connector Center**  
   Connector ERP, CRM, email, calendar, database, REST API và MCP.

5. **Multi-Agent Orchestration**  
   Supervisor agent phối hợp Sales, Finance, Legal, Support và Data Agent.

6. **Human Approval & Exception Handling**  
   Hàng đợi phê duyệt, confidence score, escalation và rollback.

7. **Agent Testing & Simulation Lab**  
   Scenario test, synthetic users, regression test, trace và replay.

8. **Agent Marketplace & Templates**  
   Template theo phòng ban/ngành, clone, customize, publish và versioning.

### Lý do chọn SET 13

- Tiếp nối trực tiếp SET 12.
- Thể hiện X.AI không chỉ là chatbot hoặc dashboard.
- Làm rõ năng lực no-code/low-code, RAG, workflow và multi-agent.
- Tạo bộ visual mạnh cho product page, architecture page và CTA “Build your agent”.

---

## SET 14 — X.AI Security, Observability & AI Operations

Nên thực hiện sau SET 13.

1. AI Security Operations Center
2. Prompt Injection & Threat Detection
3. Data Privacy & PII Redaction
4. Agent Trace & Decision Replay
5. Quality, Latency & Cost Observability
6. Hallucination & Grounding Monitor
7. Incident Management & Rollback
8. Compliance Reporting & Audit Evidence

---

## SET 15 — X.AI Industry Solutions

Chỉ làm sau khi hoàn thành nền tảng và builder.

1. Real Estate
2. Manufacturing
3. Retail & Distribution
4. Construction
5. Finance & Accounting
6. Customer Service
7. Smart Building
8. Enterprise Operations

---

## Thứ tự ưu tiên tổng thể

```txt
SET 12 — Enterprise Agents, Governance & Deployment
SET 13 — Agent Builder, Knowledge & Automation
SET 14 — Security, Observability & AI Operations
SET 15 — Industry Solutions
```
