# ROUTE AND COMPONENT MAPPING

## Routes đề xuất
- `/tin-tuc` — landing/home của module tin tức
- `/tin-tuc/danh-sach` hoặc dùng luôn `/tin-tuc?tag=` cho listing/filter
- `/tin-tuc/[slug]` — detail bài viết

## Components
- `NewsHeroSection`
- `FeaturedArticleCard`
- `NewsTagChips`
- `ArticleGrid`
- `ArticleCard`
- `NewsFilterBar`
- `ArticleMeta`
- `RelatedPostsSection`
- `NewsletterOrCTASection`
- `AuthorBlock`
- `Breadcrumbs`

## Layout logic
### Home tin tức
1. Hero section
2. Tag chips nổi bật
3. Featured article
4. Latest / Trending grid
5. CTA xem toàn bộ

### Listing
1. Intro hero nhỏ
2. Search + tag filter + category
3. Featured row (optional)
4. Grid bài viết
5. Pagination / load more

### Detail
1. Hero cover article
2. Metadata + tags
3. Rich text body
4. Related products / tags
5. Related posts
6. CTA cuối bài
