# ASSET EXTRACTION PLAN

## Tư duy đúng

Mỗi ảnh reference phải được coi như một file thiết kế raster. Claude Code không được dùng nguyên ảnh như ảnh minh họa production, mà phải:
- tách asset khi có thể;
- hoặc tái dựng bằng CSS/SVG nếu asset khó tách;
- giữ cho section cuối cùng giống tinh thần ảnh reference nhất có thể.

## Ưu tiên fidelity

Đối với SET C03, cần ưu tiên rất cao cho 4 lớp sau:
1. **Main hub / core pedestal**
2. **Product icon capsules / 3D icon blocks**
3. **Connector & light flows**
4. **Ambient glow + orbital ring**

Nếu chỉ giữ text và card mà bỏ 4 lớp này thì section sẽ mất “chất thiết kế”.

## Quy tắc tách asset

### 1. Background
Tách riêng:
- soft gradient light;
- subtle grid/pattern;
- haze / aura;
- decorative particles.

Không chứa:
- text;
- CTA;
- card nội dung.

### 2. Main illustration
Ví dụ:
- trung tâm hệ sinh thái sản phẩm;
- khối X.AI;
- trung tâm bán hàng XBooking;
- core finance hub;
- building operations hub;
- workspace scene;
- platform core;
- lifecycle hub.

Xuất:
- WebP/AVIF hoặc PNG trong suốt nếu cần alpha;
- 2x resolution;
- không chứa text.

### 3. Product capsule / feature illustration
Mỗi cụm biểu tượng nên tách riêng, ví dụ:

```txt
c03-01/x-ai-capsule.webp
c03-01/xbooking-capsule.webp
c03-01/finerp-capsule.webp
c03-01/xbuilding-capsule.webp
c03-01/x-space-capsule.webp
```

Nếu ảnh quá khó tách sạch:
- tái dựng bằng card HTML + icon/illustration riêng + pedestal CSS.

### 4. Connector & light flow
Không crop connector trực tiếp từ ảnh.

Phải dựng lại bằng SVG/CSS để:
- sắc nét;
- responsive;
- animate được;
- có thể điều chỉnh độ cong / độ dài.

### 5. Pedestal / glow base
Đây là asset thị giác rất quan trọng.

Tái dựng bằng các lớp:
- vòng tròn nền;
- ring viền;
- inner glow;
- blur outer glow;
- shadow mềm;
- optionally pulse animation rất nhẹ.

### 6. Icons
Thứ tự ưu tiên:
1. tách từ reference;
2. vẽ lại bằng SVG đồng bộ;
3. Lucide chỉ dùng fallback cho chip nhỏ, không dùng thay thế primary illustration.

### 7. Logo
Không dùng logo nằm trong ảnh reference.
Dùng đúng logo XTECH gốc.

## Cấu trúc thư mục production đề xuất

```txt
/public/images/products/c03/
  c03-01/
    background.webp
    ecosystem-core.webp
    x-ai.webp
    xbooking.webp
    finerp.webp
    xbuilding.webp
    x-space.webp
  c03-02/
  c03-03/
  ...
```

## Mapping asset extraction theo section

### C03-01
- core platform center
- 5 product capsules
- dotted/orbital ring
- connector arcs
- subtle floor glow

### C03-02
- X.AI core icon / cube / AI hub
- enterprise agent cards
- knowledge & automation support icons
- blue-violet glow ring

### C03-03
- XBooking main hub
- lead / CRM / booking / contract / customer care icons
- multi-step connection flow

### C03-04
- FinERP core finance board
- revenue / cashflow / budget / debt / reporting icons
- radial or side-connected modules

### C03-05
- building hub
- resident / apartment / service / maintenance / ticket / IoT icons
- circular operations flow

### C03-06
- workspace board / collaboration table / shared document scene
- task / chat / approval / knowledge / calendar modules
- floating utility capsules

### C03-07
- layered platform core
- chips: Data / API / Identity / Workflow / Cloud / Security / Analytics / AI Services
- stack layers or multi-ring architecture

### C03-08
- lifecycle chain / circular flow / connected platform journey
- product nodes
- connector beams / end-to-end arrows
