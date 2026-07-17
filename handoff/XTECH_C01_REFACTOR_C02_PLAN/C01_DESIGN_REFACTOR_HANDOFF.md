# XTECH — C01 Design Refactor Handoff

## 1. Mục tiêu

Refactor các section corporate hiện tại để bám sát visual language của SET C01 đã duyệt.

Không được xử lý theo cách:
- chỉ thêm background image lên layout hiện tại;
- flatten mọi section thành heading + card grid;
- dùng icon placeholder thay illustration;
- dùng ảnh full-frame làm section production;
- dùng chữ/logo nằm trong ảnh AI làm content thật.

Quy trình bắt buộc:

```txt
1. Phân tích reference design
2. Tách asset nền, icon, illustration, connector, platform
3. Dựng layout bằng HTML/CSS
4. Render text, CTA, tab, step từ CMS/seed data
5. Thêm animation sau khi bố cục đúng
6. Thiết kế responsive riêng cho desktop/tablet/mobile
7. QA bằng screenshot đối chiếu reference
```

## 2. Ngôn ngữ thiết kế

### Màu
- Primary blue: #165DFF
- Cyan: #31C8FF
- Navy: #0A2B78
- Light background: #F7FAFF
- Card: rgba(255,255,255,.84)
- Border: rgba(49,126,255,.14–.22)

### Typography
- Heading: Manrope
- Body: Inter
- H1: 64–88px desktop
- H2: 44–64px desktop
- Body: 16–20px
- Không dùng line-height quá chật

### Surface
- Glass effect nhẹ
- Radius 20–28px
- Shadow mềm
- Connector cyan
- Node glow nhẹ
- Không dùng neon quá mạnh trên nền sáng

## 3. Background system

Mỗi section sáng nên có tối đa 3 lớp:

1. Ambient radial gradient
2. Grid công nghệ opacity 0.04–0.07
3. City/data landscape opacity 0.05–0.09 ở đáy

Parallax tối đa 8–12px.

## 4. Section mapping

### C01-01 — Corporate Hero

Giữ hero tối hiện tại khoảng 70–80%.

Bổ sung:
- ambient mesh gradient;
- city/network landscape;
- connector nhẹ từ product cards;
- product cards stagger reveal;
- foundation chips xuất hiện cuối;
- CTA xuất hiện sau 450–600ms.

Không:
- autoplay carousel;
- particle dày;
- text chạy liên tục.

### C01-02 — XTECH là ai

Composition bắt buộc:

```txt
Tư vấn chuyển đổi số       Phát triển sản phẩm

             XTECH HUB

Tích hợp hệ thống          Vận hành & tối ưu
```

Animation:
1. Hub xuất hiện
2. Connector line chạy ra 4 hướng
3. Card reveal lần lượt
4. Stats chỉ xuất hiện nếu có số liệu xác thực

Mobile:
- Hub trên cùng
- 4 capability card dạng accordion/list
- Không ép bố cục 2x2

### C01-03 — Hệ sinh thái sản phẩm

Desktop:
- Sticky section
- XTECH hub trung tâm
- 5 product nodes xung quanh
- Active product sáng theo scroll
- Connector pulse
- Progress 01/05
- Product selector click để jump

Mobile:
- Horizontal snap carousel
- Mỗi slide gồm illustration + copy + CTA

Không dùng card grid tĩnh.

### C01-04 — Từ chiến lược đến vận hành số

Desktop:
- Timeline 6 bước liên tục
- Line progress theo scroll
- Stage active thay illustration/copy
- Capability layer bên dưới sáng theo bước

Mobile:
- Timeline dọc
- Không sticky dài

### C01-05 — Enterprise Platform

Dựng kiến trúc 5 tầng:

```txt
05 Kênh trải nghiệm
04 Ứng dụng doanh nghiệp
03 AI & tự động hóa
02 Dữ liệu & tích hợp
01 Hạ tầng & bảo mật
```

Desktop:
- Perspective nhẹ
- Reveal từ dưới lên
- Tầng active sáng hơn
- Scroll-controlled

Mobile:
- Accordion 5 tầng

### C01-06 — Business Value

Desktop:
- Value orbit quanh XTECH VALUE
- 5 giá trị kết nối bằng line
- Hover/focus làm sáng connector
- Outcome chips hiện theo value active

Mobile:
- Card list

### C01-07 — Delivery Model

Composition:

```txt
          SaaS           Private Cloud

               XTECH
           DELIVERY MODEL

        On-premise       Hybrid
```

Capability ring ngoài:
- Khảo sát
- Thiết kế kiến trúc
- Migration
- Integration
- Training
- Support
- SLA
- Continuous Improvement

### C01-08 — Future Vision

Composition:

```txt
Stakeholder cards
↓
connector dọc
↓
journey platform 01 → 05
↓
CTA
```

Desktop:
- 5 stakeholder cards
- 5 journey stages
- line progress theo scroll
- CTA reveal sau journey

Mobile:
- stakeholder carousel
- journey dọc
- CTA một cột

## 5. Animation rules

Dùng Framer Motion:
- fade-up
- stagger
- hover
- tabs
- accordion

Dùng GSAP ScrollTrigger hoặc useScroll chỉ cho:
- Product Ecosystem
- Digital Transformation
- Enterprise Platform

Giới hạn:
- tối đa 3 scroll-driven section nặng;
- translate dưới 30px;
- scale tối đa 1.03;
- không tilt mạnh;
- hỗ trợ prefers-reduced-motion.

## 6. Responsive breakpoints

- XL: >= 1440
- LG: 1024–1439
- MD: 768–1023
- SM: < 768

Desktop-first composition nhưng mobile phải có layout riêng.

## 7. Seed model đề xuất

```ts
type CorporateSection = {
  id: string
  title: string
  subtitle?: string
  visualMode:
    | "hub-spoke"
    | "sticky-product"
    | "timeline"
    | "layer-stack"
    | "value-orbit"
    | "delivery-orbit"
    | "future-journey"
  items: Array<{
    id: string
    title: string
    description: string
    icon?: string
    illustration?: string
    highlights?: string[]
    href?: string
  }>
  animation?: {
    mode: "reveal" | "scroll-progress" | "sticky"
    reducedMotionFallback: "static" | "fade"
  }
}
```

## 8. QA checklist

- [ ] Bố cục nhận ra rõ là HTML version của SET C01
- [ ] Không còn cảm giác template card grid
- [ ] Asset thật đã được tách
- [ ] Logo dùng file gốc
- [ ] Text render bằng CMS
- [ ] Mobile có composition riêng
- [ ] Reduced motion hoạt động
- [ ] Screenshot desktop/tablet/mobile được đối chiếu reference
- [ ] Lighthouse được kiểm tra
