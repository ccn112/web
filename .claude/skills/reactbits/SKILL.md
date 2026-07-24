---
name: reactbits
description: Thư viện component động ReactBits (reactbits.dev) — text animations, animations, backgrounds, UI patterns. Dùng khi cần trình bày nội dung nổi bật, thêm hiệu ứng động/nền đẹp cho UI trong xweb (hero, section highlight, background, text effect, card tương tác). Kích hoạt khi user nói "thêm hiệu ứng", "làm đẹp/động phần này", "nền động", "hiệu ứng chữ", "component xịn", hoặc cần một khối UI ấn tượng.
user-invocable: true
---

# ReactBits — thư viện hiệu ứng UI cho xweb

[reactbits.dev](https://reactbits.dev) (repo `DavidHDev/react-bits`, 44k★) — **140+ component động** copy vào dự án. **MIT + Commons Clause** (được dùng thoải mái để xây web/SaaS/khách hàng; chỉ cấm bán lại chính react-bits). Đa số dùng **CSS animation** (không bắt buộc framer-motion); một số nền WebGL cần peer dep `ogl`, vật lý cần `matter.js`, 3D cần `three`, vài text effect cần `gsap`.

## Khi nào dùng (chọn theo nội dung cần hiển thị)

| Nhu cầu nội dung | Nhóm ReactBits | Ví dụ component |
|---|---|---|
| Tiêu đề/hero cần nhấn mạnh, chữ động | **Text Animations** | Split Text, Blur Text, Shiny Text, Gradient Text, Text Pressure, Decrypt Text, Count Up, Rotating Text, Scroll Float, True Focus |
| Nền section/hero ấn tượng, chất công nghệ | **Backgrounds** | Aurora, Beams, Particles, Silk, Waves, Dot Grid, Squares, Threads, Grid Motion, Lightning, Dark Veil, Iridescence, Balatro, Ballpit |
| Vi tương tác, reveal khi cuộn, con trỏ | **Animations** | Animated Content, Fade Content, Magnet, Click Spark, Star Border, Glare Hover, Blob/Splash Cursor, Pixel Transition |
| Khối UI tương tác (thẻ, gallery, nav, list) | **Components** | Spotlight Card, Tilted Card, Chroma Grid, Carousel, Circular Gallery, Dock, Gooey Nav, Flowing Menu, Stack, Bounce Cards, Stepper, Counter |

Xem danh sách đầy đủ + preview tương tác tại reactbits.dev/DOCS (mỗi component có trang riêng, editor chỉnh props trực tiếp).

## Cách tích hợp vào xweb (apps/clay — Next 16 + Tailwind v4)

1. **Chọn stack `TS-TW`** (TypeScript + Tailwind) cho khớp dự án.
2. **Cài qua CLI** (nhanh nhất), đặt vào thư mục riêng:
   ```bash
   npx shadcn@latest add @react-bits/<TênComponent>-TS-TW
   ```
   Ví dụ: `npx shadcn@latest add @react-bits/BlurText-TS-TW`. Nếu shadcn chưa cấu hình, có thể **copy code trực tiếp** từ trang component (nút Code) vào `apps/clay/src/components/reactbits/<Name>.tsx`.
3. **Peer deps**: nếu component cần (`ogl`/`three`/`gsap`/`matter-js`) → `pnpm --filter @x/clay add <dep>`. Ưu tiên component thuần CSS để trang nhẹ; cân nhắc kỹ trước khi thêm WebGL vào trang go-live (ảnh hưởng LCP).
4. **Bám chuẩn dự án khi chỉnh**:
   - Màu: dùng token theme (`text-blue`, `bg-card`, `--accent-*`), KHÔNG hardcode màu lạ ngoài palette Obsidian/Sapphire/Gold.
   - **Reduced-motion an toàn**: gate mọi animation nặng bằng `prefers-reduced-motion` (dự án đã có tiền lệ ở `ProductHero`, `about-sections`).
   - Client component (`"use client"`) cho component có hiệu ứng/JS.
   - Ảnh dùng `next/image`; nền động chỉ đặt lớp trang trí (`aria-hidden`, `pointer-events-none`, `-z-10`).
   - Kiểm tra `pnpm --filter @x/clay typecheck` sau khi thêm.
5. **Nơi lưu**: `apps/clay/src/components/reactbits/` (thư viện dự án). Ghi chú component đã cài + props hay dùng vào README nhỏ trong thư mục đó để lần sau tái dùng.

## Nguyên tắc thẩm mỹ (bám dự án)
- Không lạm dụng: mỗi trang 1–2 điểm nhấn động là đủ; nội dung vẫn là chính.
- Nền động hợp cho hero tối/section khái niệm; tránh đặt sau khối chữ dày (giảm đọc).
- Với trang sản phẩm/insights đã có bộ chuẩn (features+icon, gallery, layerstack…), chỉ thêm ReactBits khi thực sự tăng giá trị trình bày.

Tham khảo: [reactbits.dev](https://reactbits.dev) · [GitHub DavidHDev/react-bits](https://github.com/DavidHDev/react-bits).
