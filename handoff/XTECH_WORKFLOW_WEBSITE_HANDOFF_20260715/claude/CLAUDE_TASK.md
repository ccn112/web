# CLAUDE CODE TASK

You are integrating the XTECH workflow image set and content into the approved multi-site website.

## Read first

1. Existing XTECH website handoff and current codebase.
2. This package `README.md`.
3. All files under `docs/`.
4. All JSON files under `seed/`.

## Required implementation

1. Import original brand assets without modification.
2. Import seven workflow images and create optimized derivatives.
3. Add or reuse CMS fields described in `02_CMS_AND_SEED_SPEC.md`.
4. Create idempotent seed scripts.
5. Add the corporate route:
   `/giai-phap/chuoi-gia-tri-bat-dong-san`
6. Add menu item under `Giải pháp`.
7. Implement `workflowNavigation` and `workflowStage` blocks.
8. Map each stage to the corresponding product route.
9. Patch product pages with the matching showcase image and content.
10. Pass current stage context to the Claude chatbot endpoint.
11. Implement responsive behavior and lightbox.
12. Generate route and seed verification reports.

## Do not

- Do not redraw or modify the XTECH logo.
- Do not hard-code page content inside React components.
- Do not use screenshots as a full-page background.
- Do not create English UI copy where Vietnamese seed exists.
- Do not duplicate existing menu items or pages.

## Deliverables

- Seed importer.
- CMS migrations/config.
- React components.
- Route.
- Product page patches.
- Tests.
- `IMPLEMENTATION_STATUS.md`.
- `WORKFLOW_ROUTE_REPORT.md`.
- `SEED_EXECUTION_REPORT.md`.
