# 04 — Page Builder Blocks

## Block MVP

1. `hero`
2. `richText`
3. `featureGrid`
4. `productCards`
5. `solutionCards`
6. `painPoints`
7. `processTimeline`
8. `statistics`
9. `screenshots`
10. `architecture`
11. `comparisonTable`
12. `integration`
13. `caseStudyCards`
14. `faq`
15. `relatedInsights`
16. `deploymentCards`
17. `leadForm`
18. `cta`

## Contract chung

```ts
type BaseBlock = {
  id?: string
  blockType: string
  anchorId?: string
  theme?: 'light' | 'soft' | 'dark' | 'brand'
  padding?: 'compact' | 'normal' | 'large'
}
```

## Quy tắc render

- Mọi block có thể có `anchorId` để chatbot dẫn tới section.
- Không render HTML tùy ý từ AI.
- Rich text phải sanitize.
- Hero chỉ có một H1.
- Mỗi block có Storybook hoặc visual test.
- Mobile-first.
- Tất cả ảnh bắt buộc có alt text.
- CTA dùng component chuẩn để đo analytics.
