# ReactBits library (xweb)

Component động phong cách [ReactBits](https://reactbits.dev), tự viết cho xweb —
CSS-first, **reduced-motion safe**, bám token theme (`--accent-*`, `text-blue`…).
Xem skill `.claude/skills/reactbits` để biết khi nào dùng + cách bổ sung component mới.

| Component | Dùng cho | Đã áp dụng |
|---|---|---|
| `SplitText` | Reveal tiêu đề theo từ (fade+rise, stagger) | Hero trang sản phẩm |
| `ShinyText` | Shimmer cho eyebrow/nhãn nhỏ | (sẵn dùng) |
| `CountUp` | Số liệu đếm tăng khi cuộn tới | Stats /ve-x |
| `SpotlightCard` | Spotlight theo con trỏ cho card | Showcase card sản phẩm |
| `TiltedCard` | Nghiêng 3D theo con trỏ | (sẵn dùng) |

Thêm component mới: ưu tiên thuần CSS; nếu cần WebGL (`ogl`/`three`) cân nhắc perf
(LCP) trước khi đặt vào trang go-live. Cài nhanh từ nguồn: `npx shadcn@latest add
@react-bits/<Name>-TS-TW` rồi tinh chỉnh theo theme.
