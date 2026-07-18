# MASTER PROMPT — XTECH Editorial Header Backgrounds V2

Bạn đang hoàn thiện các hero/header cho nhóm trang nội dung của website corporate XTECH.

## Mục tiêu hình ảnh
Các header phải thể hiện rõ XTECH là doanh nghiệp công nghệ và AI, không chỉ là nền gradient xanh chung chung.

Visual language bắt buộc:
- AI neural network / AI Agent / knowledge graph;
- data stream, data nodes, analytics waveform;
- cloud, API, integration, microservices;
- digital workflow, roadmap, deployment pipeline;
- glass panels, light paths, subtle 3D platform nodes;
- navy → blue → cyan glow;
- phong cách enterprise technology, premium, tối giản;
- không dùng robot hoạt hình, não người quá literal hoặc stock photo thông thường.

## 5 header cần triển khai

### 1. Tin tức
- Route: `/tin-tuc`
- Asset: `assets/01-news-header-bg.png`
- Visual theme: digital news cards, data stream, technology updates.
- Left side phải đủ tối và sạch cho headline.
- Right side có các glass editorial cards và wave dữ liệu.

### 2. Kinh nghiệm
- Route: `/kinh-nghiem`
- Asset: `assets/02-kinh-nghiem-header-bg.png`
- Visual theme: roadmap triển khai, milestone, learning path, project journey.
- Có các node sáng nối theo đường tiến trình và icon knowledge / achievement / user.

### 3. Insights
- Route: `/insights`
- Asset: `assets/03-insights-header-bg.png`
- Visual theme: analytics, AI insight, trend lines, data visualization, predictive signals.
- Có dashboard/chart trừu tượng, không nhúng text vào ảnh.

### 4. Triển khai
- Route: `/trien-khai`
- Asset: `assets/04-trien-khai-header-bg.png`
- Visual theme: cloud + integration + workflow + API + deployment infrastructure.
- Thể hiện luồng kết nối giữa nhiều platform node và một hub trung tâm.

### 5. Chi tiết tin tức
- Route: `/tin-tuc/[slug]`
- Asset: `assets/05-news-detail-header-bg.png`
- Visual theme: premium editorial technology cover.
- Dùng nền nhẹ hơn landing, tập trung title, category, author, date và read time.

## Cách code
- Không nhúng chữ vào background.
- Text, metadata, CTA, card feature phải là HTML/CSS.
- Background là lớp riêng, có overlay và focal point phù hợp.
- Tạo component dùng chung:
  - `EditorialHero`
  - `EditorialHeroBackground`
  - `EditorialHeroContent`
  - `FeaturedEditorialCard`
- Dữ liệu header phải lấy từ CMS/global config, không hardcode vào component.

## CMS fields đề xuất
```ts
{
  routeKey: string,
  eyebrow: string,
  title: string,
  description: string,
  backgroundImage: Media,
  backgroundPositionDesktop: string,
  backgroundPositionMobile: string,
  overlayStrength: number,
  visualTheme: 'news' | 'experience' | 'insights' | 'implementation' | 'article-detail',
  featuredPost?: Relation,
  primaryCta?: { label: string; href: string }
}
```

## Responsive
- Desktop: text trái 45%, visual phải 55%.
- Tablet: 1 cột, feature card xuống dưới.
- Mobile: crop background về right-center, overlay tối hơn, không để motif đè lên title.

## QA
- Nhìn vào từng header phải nhận ra ngay chủ đề công nghệ/AI.
- Không để cả 5 trang dùng cùng một background hoặc chỉ đổi màu.
- Header phải đồng bộ với homepage XTECH hiện tại.
- Logo XTECH dùng asset gốc trong project, không vẽ lại.
