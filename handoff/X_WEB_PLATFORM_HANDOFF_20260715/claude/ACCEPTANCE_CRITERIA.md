# Acceptance Criteria

## Data
- [ ] 6 sites seeded.
- [ ] 42 pages seeded.
- [ ] 3 posts seeded.
- [ ] Menus seeded for every site.
- [ ] Prompt sets seeded.
- [ ] Seed can run twice without duplication.

## CMS
- [ ] Admin login works.
- [ ] Role and allowedSites access works.
- [ ] Draft content is not public.
- [ ] Editor can assemble a page from blocks.
- [ ] Preview works.
- [ ] Media works with local/MinIO config.

## Websites
- [ ] Host/query resolves correct site.
- [ ] All seeded routes return 200.
- [ ] Each site has own theme and menu.
- [ ] Mobile navigation works.
- [ ] Forms save submissions.
- [ ] Article pages render.

## SEO
- [ ] Unique title/description.
- [ ] Canonical per site.
- [ ] Sitemap per site.
- [ ] robots.txt.
- [ ] JSON-LD.
- [ ] No duplicate H1.

## Chatbot
- [ ] API key server-only.
- [ ] Context loaded from CMS by page ID.
- [ ] Prompt chips configurable.
- [ ] Streaming or progressive response.
- [ ] Safe error when key missing.
- [ ] Rate limit.
- [ ] Feedback stored.

## Quality
- [ ] TypeScript strict passes.
- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] Smoke test routes pass.
- [ ] Lighthouse target: Performance >= 85, Accessibility >= 90, SEO >= 90 on key pages.
