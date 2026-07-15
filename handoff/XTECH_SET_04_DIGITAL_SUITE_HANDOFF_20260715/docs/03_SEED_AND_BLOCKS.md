# 03 — Seed and Blocks

## Seed files
- seed/media-assets.json
- seed/page-block-patches.json
- seed/chatbot-prompts.json

## Blocks
- heroSplit
- illustrationFeature

## Idempotency
- Media upsert theo code
- Page block patch theo assetCode
- Chatbot prompts upsert theo section key
- Không tạo block trùng nếu đã có assetCode tương ứng

## Metadata tối thiểu
- code
- title
- page
- section
- summary
- alt
- ratio
- type
- locale = vi
- status = approved
