# 02 — CMS and Seed Specification

## Collections cần bổ sung hoặc tái sử dụng

### Media

Thêm metadata:

```ts
assetCode: string
siteScope: string[]
locale: string
workflowStage?: string
altText: string
aiGenerated: boolean
approvalStatus: 'draft' | 'review' | 'approved'
```

### WorkflowStages

Khuyến nghị collection riêng để dễ tái sử dụng:

```ts
code
order
title
shortTitle
summary
capabilities[]
products[]
image
corporateHref
productHref
prompts[]
status
```

Nếu không tạo collection riêng, có thể lưu trong global hoặc JSON seed.

### Pages

Dùng Page Builder hiện có. Bổ sung hai block:

- `workflowNavigation`
- `workflowStage`

## Seed order

1. Upload/import media trong `workflow-assets.json`.
2. Resolve `assetCode → mediaId`.
3. Seed `workflow-stages.json`.
4. Upsert corporate page từ `workflow-page.json`.
5. Patch menu từ `sitemap-patch.json`.
6. Patch product pages từ `product-page-patches.json`.
7. Revalidate affected routes.

## Idempotency

- Media upsert theo `assetCode`.
- Workflow stage upsert theo `code`.
- Page upsert theo `(site, locale, slug)`.
- Menu item không được thêm trùng `href`.
- Product block upsert theo `(blockType, workflowStage)`.
