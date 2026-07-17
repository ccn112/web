# COMPONENT ARCHITECTURE

```txt
components/
  solution-suites/
    SolutionSuitesPage.tsx
    SuiteSelector.tsx
    SuiteSelectorVisual.tsx
    SolutionBlueprint.tsx
    ScopeStarter.tsx
    ScopeExpansion.tsx
    ScopeEnterprise.tsx
    ProductServiceConfigurator.tsx
    ConfiguratorLegend.tsx
    MaturityRoadmap.tsx
    SolutionBuilder.tsx
    RecommendationSummary.tsx
    SuiteDetailTemplate.tsx
    SuiteOutcomeGrid.tsx
    SuiteDeploymentOptions.tsx
```

## State

Dùng `activeSuiteSlug` ở page-level context hoặc client island.

Không biến toàn bộ page thành client component. Chỉ các phần cần tương tác:
- selector;
- configurator;
- roadmap active;
- builder.

## Server-rendered

- heading;
- intro;
- suite detail copy;
- outcomes;
- SEO;
- static links.

## Client-rendered

- tab/selector state;
- compare matrix;
- builder form;
- recommendation preview.
