# CMS SCHEMA BASELINE

## Media metadata tối thiểu
- code: string, unique
- title: string
- summary: text
- alt: string
- ratio: enum (4:3, 16:9, 4:4)
- type: string
- page: string
- section: string
- locale: string = vi
- status: string = approved

## Shared page-builder blocks
- heroSplit
- illustrationFeature
- ctaVisual

## Seed nguyên tắc
- Upsert theo code cho media
- Upsert theo assetCode / section key cho blocks
- Upsert theo section key cho chatbot prompts
