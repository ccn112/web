# 03 — Seed and Blocks

## Seed files
- seed/media-assets.json
- seed/page-block-patches.json
- seed/chatbot-prompts.json

## Block types
- heroSplit
- illustrationFeature

## Idempotency
- Media upsert theo code
- Page block patch theo assetCode
- Chatbot prompts upsert theo section key
- Không tạo block trùng nếu đã có assetCode
