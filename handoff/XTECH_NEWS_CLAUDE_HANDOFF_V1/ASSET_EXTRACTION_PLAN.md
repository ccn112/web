# ASSET EXTRACTION PLAN

## Tư duy triển khai
Không cắt nguyên section từ ảnh. Chỉ lấy/tái dựng các phần sau:

### 1) Background assets
- `news-hero-bg-dark.webp`
  - nền dark blue gradient
  - có glow công nghệ
  - không chứa text
- `news-grid-overlay.svg` hoặc CSS background
  - lưới mảnh mờ
- `news-radial-glow.webp`
  - glow tròn nhẹ cho hero / featured

### 2) Illustration assets
- `news-home-hero-illustration.webp`
- `news-listing-featured-illustration.webp`
- `news-detail-cover-illustration.webp`

### 3) Product / category icons
Nên dựng lại bằng vector hoặc dùng icon lib đồng bộ, không crop icon raster mờ.
- x-ai.svg
- xbooking.svg
- finerp.svg
- xbuilding.svg
- xspace.svg
- ai.svg
- data.svg
- crm.svg
- erp.svg
- automation.svg
- real-estate.svg
- operations.svg
- insights.svg

### 4) UI primitives
- chip/tag style bằng CSS
- author avatar placeholder bằng CSS hoặc asset nhỏ
- card highlight accent bằng CSS shadow + gradient
- button glow bằng CSS

## Gợi ý kỹ thuật
- Hero background: CSS multiple backgrounds + 1 webp
- Glow: pseudo-element `::before` / `::after`
- Icon: inline SVG để dễ đổi màu hover
- Card thumb: ảnh CMS + overlay gradient nhẹ
