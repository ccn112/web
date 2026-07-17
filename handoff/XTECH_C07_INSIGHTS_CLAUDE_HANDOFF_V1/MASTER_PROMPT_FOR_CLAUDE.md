# MASTER PROMPT — C07 Insights

Bạn đang hoàn thiện website corporate XTECH bằng Next.js App Router và CMS dùng chung.

Hãy triển khai nhánh `/insights` theo hướng SEO-first, đọc tốt, quản trị dễ và go-live nhanh.

## Route

```txt
/insights
/insights/chuyen-doi-so
/insights/ai-doanh-nghiep
/insights/du-lieu
/insights/proptech
/insights/[slug]
```

## Theme

- Kế thừa theme hiện tại.
- Nền sáng xanh nhạt, grid rất nhẹ.
- Heading navy.
- Card trắng.
- Featured article có visual blue/cyan.
- Gold chỉ dùng cho CTA hoặc featured badge.
- Title section tối đa 2 dòng desktop.
- Article body ưu tiên readability, không dùng quá nhiều hiệu ứng.

## Cấu trúc

### Landing `/insights`
1. Hero
2. Featured article
3. Category cards
4. Latest articles
5. Topic clusters
6. Expert picks
7. Related solutions
8. Newsletter CTA

### Category
- hero category;
- featured post;
- listing;
- filter/tag;
- pagination;
- related category.

### Article detail
- breadcrumbs;
- category;
- title;
- summary;
- author/date/read time;
- hero image;
- table of contents;
- rich text;
- callout;
- related products/solutions;
- related articles;
- author block;
- newsletter CTA.

## CMS

Dùng schema trong `docs/CMS_SCHEMA.md`.

## SEO bắt buộc

- title/meta description;
- canonical;
- Open Graph;
- Article structured data;
- Breadcrumb structured data;
- author;
- published/updated date;
- sitemap;
- RSS nếu có thể;
- internal links;
- semantic headings;
- image alt;
- reading time.

## Không được làm

- Không hardcode bài viết.
- Không dùng ảnh reference full section.
- Không nhồi từ khóa.
- Không render article body bằng client component.
- Không tạo author giả dưới dạng cá nhân cụ thể.
- Không tạo số liệu hoặc trích dẫn giả.

## Go-live MVP

- landing;
- 4 category;
- article detail;
- 8–12 bài seed;
- SEO;
- newsletter CTA;
- related content.

## Output

- route;
- components;
- CMS schema;
- seed data;
- SEO metadata;
- responsive;
- screenshot 1440/1024/768/390;
- checkpoint.
