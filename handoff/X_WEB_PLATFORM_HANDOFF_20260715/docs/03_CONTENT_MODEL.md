# 03 — Content Model

## Collections

### Sites
Branding, domain, SEO mặc định, header/footer và chatbot config.

### Pages
Trang block-based; khóa duy nhất `(site, locale, slug)`.

### Posts
Insights/article theo site, có thể mở rộng thành master content + publication sau MVP.

### Products
Dữ liệu chuẩn cho 5 sản phẩm; dùng trong card và schema.

### Solutions
Giải pháp theo nghiệp vụ, đối tượng hoặc mục tiêu.

### CaseStudies
Thách thức, giải pháp, kiến trúc, kết quả và media.

### FAQs
FAQ dùng lại cho nhiều trang.

### Menus
Header/footer theo site và locale.

### Forms / FormSubmissions
Form cấu hình và dữ liệu lead.

### PromptSets
Prompt chip theo global/site/page.

### Redirects
Quản trị redirect 301.

### Media
Asset dùng chung hoặc giới hạn theo site.

## Access control

- `super_admin`: toàn bộ.
- `site_admin`: toàn quyền trên `allowedSites`.
- `editor`: tạo/sửa draft trên `allowedSites`.
- `reviewer`: chuyển review → approved.
- `publisher`: publish/unpublish.

Public API chỉ trả nội dung `status=published`.

## Workflow

```text
draft -> review -> approved -> published -> archived
```

## Seed

- `seed/sites.json`
- `seed/menus.json`
- `seed/pages.json`
- `seed/posts.json`
- `seed/forms.json`
- `seed/prompt-sets.json`
