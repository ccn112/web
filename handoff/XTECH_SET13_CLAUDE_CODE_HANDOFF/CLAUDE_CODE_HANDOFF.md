# XTECH Website — SET 13 Claude Code Handoff

## 1. Mục tiêu

Triển khai **SET 13 — X.AI Agent Builder, Knowledge & Automation** cho website XTECH.

SET 13 tiếp nối trực tiếp SET 12. Nếu SET 12 trả lời:

- X.AI phục vụ ai?
- AI được quản trị và triển khai như thế nào?

thì SET 13 trả lời:

- Doanh nghiệp tự xây AI Agent ra sao?
- Kiến thức doanh nghiệp được kích hoạt bằng RAG như thế nào?
- Workflow, connector, multi-agent, testing và template được vận hành thế nào?

Bộ gồm **8 ảnh riêng**, tỷ lệ **4:3**, nền sáng, UI illustration là trọng tâm, đồng bộ style với SET 12.

---

## 2. Asset mapping

| ID nội bộ | File | Chủ đề |
|---|---|---|
| XAI-17 | `assets/set13/XAI-17-visual-agent-builder.png` | Visual Agent Builder |
| XAI-18 | `assets/set13/XAI-18-knowledge-hub-rag-studio.png` | Knowledge Hub & RAG Studio |
| XAI-19 | `assets/set13/XAI-19-workflow-automation-studio.png` | Workflow Automation Studio |
| XAI-20 | `assets/set13/XAI-20-tool-api-connector-center.png` | Tool & API Connector Center |
| XAI-21 | `assets/set13/XAI-21-multi-agent-orchestration.png` | Multi-Agent Orchestration |
| XAI-22 | `assets/set13/XAI-22-human-approval-exception-handling.png` | Human Approval & Exception Handling |
| XAI-23 | `assets/set13/XAI-23-agent-testing-simulation-lab.png` | Agent Testing & Simulation Lab |
| XAI-24 | `assets/set13/XAI-24-agent-marketplace-templates.png` | Agent Marketplace & Templates |

> Không hiển thị mã XAI-17…XAI-24 trên website. Chỉ dùng nội bộ trong CMS/codebase.

---

## 3. Vị trí trong sitemap X.AI

SET 13 map trực tiếp vào cụm trang X.AI sau:

- `/products/x-ai/agent-builder`
- `/products/x-ai/knowledge-rag`
- `/products/x-ai/workflow-automation`
- `/products/x-ai/connectors`

Ngoài ra có thể dùng một phần ở:

- `/products/x-ai/platform`
- `/products/x-ai/use-cases`

### Gợi ý phân bổ từng ảnh

- **XAI-17** → Hero / section chính của `agent-builder`
- **XAI-18** → Section chính của `knowledge-rag`
- **XAI-19** → Section chính của `workflow-automation`
- **XAI-20** → Section chính của `connectors`
- **XAI-21** → Section “multi-agent orchestration” trên landing X.AI hoặc `platform`
- **XAI-22** → Section “human-in-the-loop”
- **XAI-23** → Section “testing & simulation”
- **XAI-24** → Section “templates / marketplace”

---

## 4. Quy tắc bắt buộc

### Logo XTECH
- Không dùng logo do AI tự vẽ lại.
- Nếu cần logo XTECH trên website, dùng đúng asset gốc.
- Logo nên render bằng HTML/CSS riêng hoặc ghép hậu kỳ bằng file thật.
- Nếu trong ảnh xuất hiện logo hoặc biểu tượng gần giống logo nhưng không chuẩn, cần mask/crop/cover trước khi production.

### Nội dung chữ
- Title, subtitle, bullet, CTA, mô tả tính năng phải render bằng HTML/CMS.
- Không phụ thuộc vào chữ nhỏ bên trong ảnh để làm nội dung chính.
- Ảnh đóng vai trò **UI illustration / product concept visualization**.

### Responsive
- Desktop: illustration ~52–58% bề ngang.
- Tablet: có thể đưa illustration xuống dưới text.
- Mobile: ảnh full width, giữ `aspect-ratio: 4 / 3`.
- Dùng `object-fit: contain` để không cắt mất vùng UI quan trọng.

### Hiệu năng
- Convert PNG → AVIF + WebP.
- Giữ PNG gốc làm bản archive.
- Khai báo `width`, `height`, `sizes`.
- Lazy-load tất cả ảnh không nằm above-the-fold.
- Ưu tiên `next/image`.

---

## 5. Content model đề xuất

```ts
export type XAIAgentBuilderFeature = {
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

## 6. Seed data đề xuất

```ts
export const xaiBuilderFeatures: XAIAgentBuilderFeature[] = [
  {
    id: "xai-17",
    slug: "visual-agent-builder",
    eyebrow: "Build",
    title: "Visual Agent Builder",
    description:
      "Thiết kế, cấu hình, kiểm thử và triển khai AI Agent bằng giao diện trực quan kéo-thả.",
    image: {
      src: "/images/xai/set13/XAI-17-visual-agent-builder.avif",
      alt: "Giao diện Visual Agent Builder với canvas kéo thả, block logic và phần cấu hình agent",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Drag & drop builder",
      "Reusable blocks",
      "Tool logic",
      "Version control"
    ],
    layout: "image-right"
  },
  {
    id: "xai-18",
    slug: "knowledge-hub-rag-studio",
    eyebrow: "Knowledge",
    title: "Knowledge Hub & RAG Studio",
    description:
      "Kết nối nguồn tri thức doanh nghiệp, lập chỉ mục, tối ưu retrieval và kiểm thử câu trả lời có grounding.",
    image: {
      src: "/images/xai/set13/XAI-18-knowledge-hub-rag-studio.avif",
      alt: "Giao diện Knowledge Hub và RAG Studio với data sources, library và pipeline retrieval",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Multi-source connectors",
      "Smart chunking",
      "Vector search",
      "Relevance tuning"
    ],
    layout: "image-left"
  },
  {
    id: "xai-19",
    slug: "workflow-automation-studio",
    eyebrow: "Automation",
    title: "Workflow Automation Studio",
    description:
      "Xây dựng workflow có AI, điều kiện, phê duyệt, tích hợp hệ thống và khả năng giám sát vận hành.",
    image: {
      src: "/images/xai/set13/XAI-19-workflow-automation-studio.avif",
      alt: "Giao diện Workflow Automation Studio với sơ đồ bước, điều kiện, approval và monitoring",
      width: 1448,
      height: 1086
    },
    highlights: [
      "AI rules",
      "Human approval",
      "Templates",
      "Audit logs"
    ],
    layout: "image-right"
  },
  {
    id: "xai-20",
    slug: "tool-api-connector-center",
    eyebrow: "Integration",
    title: "Tool & API Connector Center",
    description:
      "Kết nối AI Agent với CRM, ERP, email, database, API và hệ sinh thái công cụ của doanh nghiệp.",
    image: {
      src: "/images/xai/set13/XAI-20-tool-api-connector-center.avif",
      alt: "Giao diện Tool and API Connector Center với connector library và màn cấu hình API",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Prebuilt connectors",
      "OAuth / API key",
      "Webhooks",
      "Enterprise security"
    ],
    layout: "image-left"
  },
  {
    id: "xai-21",
    slug: "multi-agent-orchestration",
    eyebrow: "Coordination",
    title: "Multi-Agent Orchestration",
    description:
      "Điều phối nhiều agent chuyên biệt cùng hợp tác theo mục tiêu, chia sẻ ngữ cảnh và tổng hợp kết quả.",
    image: {
      src: "/images/xai/set13/XAI-21-multi-agent-orchestration.avif",
      alt: "Giao diện Multi-Agent Orchestration với supervisor agent, execution monitor và collaboration canvas",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Shared memory",
      "Goal-driven execution",
      "Result aggregation",
      "Trace & monitor"
    ],
    layout: "image-right"
  },
  {
    id: "xai-22",
    slug: "human-approval-exception-handling",
    eyebrow: "Control",
    title: "Human Approval & Exception Handling",
    description:
      "Giữ con người trong vòng kiểm soát với hàng chờ phê duyệt, ngưỡng rủi ro, escalation và xử lý ngoại lệ.",
    image: {
      src: "/images/xai/set13/XAI-22-human-approval-exception-handling.avif",
      alt: "Giao diện phê duyệt và xử lý ngoại lệ với queue, request detail, escalation route và SLA",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Approval workflows",
      "Threshold rules",
      "SLA escalation",
      "Configurable policies"
    ],
    layout: "image-left"
  },
  {
    id: "xai-23",
    slug: "agent-testing-simulation-lab",
    eyebrow: "Testing",
    title: "Agent Testing & Simulation Lab",
    description:
      "Đánh giá chất lượng AI Agent bằng test suite, scenario simulation, replay, metrics và cost tracking.",
    image: {
      src: "/images/xai/set13/XAI-23-agent-testing-simulation-lab.avif",
      alt: "Giao diện Agent Testing and Simulation Lab với test suites, replay, evaluation metrics và performance analysis",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Automated evaluation",
      "Regression testing",
      "Cost tracking",
      "Continuous improvement"
    ],
    layout: "image-right"
  },
  {
    id: "xai-24",
    slug: "agent-marketplace-templates",
    eyebrow: "Scale",
    title: "Agent Marketplace & Templates",
    description:
      "Khởi động nhanh bằng thư viện template theo phòng ban, tùy biến theo nhu cầu và triển khai chỉ với vài bước.",
    image: {
      src: "/images/xai/set13/XAI-24-agent-marketplace-templates.avif",
      alt: "Giao diện Agent Marketplace and Templates với thư viện agent, bộ lọc và màn chi tiết template",
      width: 1448,
      height: 1086
    },
    highlights: [
      "Prebuilt templates",
      "One-click deploy",
      "Best practices",
      "Share & publish"
    ],
    layout: "image-left"
  }
]
```

---

## 7. Component structure đề xuất

```txt
components/
  xai/
    XAIBuildSection.tsx
    XAIFeatureRow.tsx
    XAIImageFrame.tsx
    XAICapabilityChips.tsx
    XAITemplateGrid.tsx

content/
  xai-builder-features.ts

public/
  images/
    xai/
      set13/
```

### `XAIFeatureRow`
- Layout xen kẽ trái/phải.
- Text và CTA render bằng HTML.
- Ảnh nằm trong khung 4:3.
- Animation nhẹ:
  - hover elevate rất nhẹ
  - fade-in / slide-up vừa phải
- Tôn trọng `prefers-reduced-motion`.

---

## 8. QA checklist

- [ ] Không hiển thị mã XAI-17…XAI-24 trên website.
- [ ] Không dùng logo AI sinh sai chuẩn.
- [ ] Heading/subtitle/bullets nằm ở HTML/CMS.
- [ ] Ảnh giữ đúng 4:3.
- [ ] Alt text đầy đủ.
- [ ] Có bản AVIF/WebP.
- [ ] Mobile không cắt mất vùng UI chính.
- [ ] Không dùng chữ nhỏ trong ảnh làm SEO content.
- [ ] Không khẳng định các màn hình là chức năng production nếu vẫn là visual concept.
- [ ] Giữ đồng bộ style với SET 12.

---

## 9. Kế hoạch set tiếp theo

### Ưu tiên tiếp theo: SET 14 — X.AI Security, Observability & AI Operations

SET 14 nên trả lời câu hỏi:

- Làm sao để vận hành AI an toàn?
- Làm sao theo dõi chất lượng, latency, chi phí và rủi ro?
- Làm sao audit, rollback và tuân thủ?

### 8 ảnh đề xuất cho SET 14

1. **AI Security Operations Center**  
   Trung tâm theo dõi sự kiện, rủi ro, policy violation, suspicious activity.

2. **Prompt Injection & Threat Detection**  
   Phát hiện prompt injection, data exfiltration, jailbreak, unsafe tool use.

3. **Data Privacy & PII Protection**  
   Masking, redaction, classification, retention policy, access control.

4. **Observability & Trace Explorer**  
   Trace toàn bộ luồng: user input → tools → model → output → feedback.

5. **Quality, Latency & Cost Monitor**  
   Theo dõi chất lượng, thời gian phản hồi, token usage, cost by agent/team.

6. **Grounding & Hallucination Monitor**  
   Đo mức groundedness, unsupported claims, citation coverage, risk flags.

7. **Incident Management & Rollback Center**  
   Quản lý sự cố, rollback model/prompt/agent version, war room và postmortem.

8. **Compliance Reporting & Audit Evidence**  
   Xuất báo cáo compliance, audit trail, approval history, evidence packs.

### Sau SET 14

- **SET 15 — X.AI Industry Solutions**
- **SET 16 — X.AI Enterprise Use Cases / Department Journeys**

---

## 10. Thứ tự roadmap hình ảnh đề xuất

```txt
SET 12 — Enterprise Agents, Governance & Deployment
SET 13 — Agent Builder, Knowledge & Automation
SET 14 — Security, Observability & AI Operations
SET 15 — Industry Solutions
SET 16 — Enterprise Use Cases / Department Journeys
```
