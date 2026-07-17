# CMS SEED MODEL

## Collections
### newsCategories
- name
- slug
- description
- sortOrder

### newsTags
- name
- slug
- type (`product` | `topic`)
- colorTheme
- iconKey

### authors
- name
- slug
- role
- avatar
- bio

### newsPosts
- title
- slug
- excerpt
- coverImage
- featuredImage
- heroTheme (`dark-tech`, `light-grid`, `blue-glow`)
- category (relation)
- tags (array relation)
- relatedProducts (array relation to tags of type product)
- featured
- pinned
- publishedAt
- readTime
- author
- seoTitle
- seoDescription
- content
- relatedPosts

## Seed data gợi ý
### Categories
- Tin XTECH
- Chuyển đổi số
- AI doanh nghiệp
- Bất động sản số
- Dữ liệu & tích hợp
- Tự động hóa vận hành

### Product tags
- X.AI
- XBooking
- FinERP
- XBuilding
- X.Space

### Topic tags
- AI
- Dữ liệu
- Tự động hóa
- CRM
- ERP
- Bất động sản
- Vận hành
- Insights
- Khách hàng
- Cloud

### 6 bài mẫu nên seed
1. XTECH ra mắt hệ sinh thái AI cho doanh nghiệp và bất động sản
2. 5 xu hướng chuyển đổi số nổi bật cho chủ đầu tư bất động sản
3. Dữ liệu hợp nhất giúp doanh nghiệp rút ngắn thời gian ra quyết định
4. Tự động hóa quy trình nội bộ với workflow và AI agent
5. XBooking tối ưu hành trình bán hàng và chăm sóc khách hàng
6. FinERP giúp doanh nghiệp kiểm soát tài chính và vận hành theo thời gian thực
