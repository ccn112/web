# CLAUDE.md

## Mission
Build the X multi-site content platform exactly from this handoff.

## Non-negotiable stack
- Next.js App Router
- TypeScript strict
- Payload CMS
- PostgreSQL
- Tailwind CSS
- shadcn/ui
- pnpm
- Docker Compose

## Rules
1. Do not invent routes or product capabilities outside seed/handoff.
2. Public content must always be scoped by site and published status.
3. API keys must never reach the browser.
4. Seed must be idempotent.
5. Use semantic routes, never route names like WEB-01.
6. Build reusable blocks, not page-specific hardcoding.
7. Keep themes data-driven.
8. Preserve Vietnamese diacritics.
9. Add tests for site resolution, access control and seed routes.
10. Do not auto-publish AI generated content.

## Execution order
- Bootstrap
- CMS collections
- Seed
- Design system
- Page renderer
- Corporate
- Product themes
- SEO
- Forms
- Chatbot
- Tests and docs
