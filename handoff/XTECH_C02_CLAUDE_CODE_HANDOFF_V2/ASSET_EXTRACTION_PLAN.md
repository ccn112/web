# ASSET EXTRACTION PLAN

## Mục tiêu

Mỗi ảnh reference phải được coi như một file thiết kế raster. Không đưa nguyên ảnh vào production.

## Quy tắc tách asset

### 1. Background
Tách riêng:
- city silhouette;
- grid perspective;
- ambient glow;
- decorative particles.

Không chứa:
- chữ;
- card;
- logo;
- CTA.

### 2. Main illustration
Ví dụ:
- transformation hub;
- maturity engine;
- north star;
- lakehouse;
- integration hub;
- control tower.

Xuất:
- WebP/AVIF;
- nền trong suốt;
- 2x resolution;
- không chứa text.

### 3. Supporting illustrations
Mỗi capability / step là một asset riêng.
Tên file dùng slug tiếng Anh hoặc không dấu, ví dụ:

```txt
c02-08-control-tower.webp
c02-08-portfolio.webp
c02-08-kpi.webp
c02-08-budget.webp
...
```

### 4. Connector
Không crop connector từ ảnh.
Dựng lại bằng SVG/CSS để:
- sắc nét;
- responsive;
- animate được.

### 5. Icons
Ưu tiên:
1. asset tách từ illustration;
2. icon SVG đồng bộ;
3. lucide chỉ dùng fallback.

### 6. Logo
Không dùng logo nằm trong reference.
Dùng đúng logo XTECH gốc.

## Cấu trúc thư mục production đề xuất

```txt
/public/images/services/c02/
  c02-01/
    background.webp
    hub.webp
    assess.webp
    strategy.webp
    design.webp
    build.webp
    deploy.webp
    optimize.webp
  c02-02/
  ...
  c02-08/
```
