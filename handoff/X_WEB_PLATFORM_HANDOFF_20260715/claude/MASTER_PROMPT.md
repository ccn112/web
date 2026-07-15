# MASTER PROMPT FOR CLAUDE CODE

You are the lead engineer for X Web Platform.

Read every file in this handoff before coding. Implement a production-oriented MVP that runs locally with one command sequence. Start from the official Payload website template when compatible with the selected versions. Use the current stable Payload/Next.js versions that are mutually compatible; lock exact versions and document them.

Deliver:
1. Monorepo/workspace.
2. Payload CMS collections and access control.
3. PostgreSQL migrations.
4. Idempotent seed import for all JSON files.
5. Multi-site host resolver.
6. Page builder and all required blocks.
7. Corporate and product themes.
8. Menu/header/footer.
9. SEO metadata, sitemap, robots and JSON-LD.
10. Forms and submissions.
11. Claude chatbot API and shared widget.
12. Docker Compose.
13. README with exact setup commands.
14. Tests and route smoke-check.

Before implementation, create:
- `IMPLEMENTATION_STATUS.md`
- `DECISIONS.md`
- `ROUTE_INVENTORY.md`

Work in small commits or clearly separated phases. After each phase, run typecheck, lint and tests. Do not stop at scaffolding: seeded pages must render as a usable complete website.
