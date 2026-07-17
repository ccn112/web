# COMPONENT ARCHITECTURE

```txt
components/
  services/
    c02/
      C02SectionHeader.tsx
      C02OutcomeStrip.tsx
      C02ConnectorSvg.tsx

      C02ServicesOverview.tsx
      C02MaturityAssessment.tsx
      C02StrategyArchitecture.tsx
      C02ProcessAutomation.tsx
      C02DataPlatform.tsx
      C02ApplicationModernization.tsx
      C02ChangeManagement.tsx
      C02OperationsControlTower.tsx

      shared/
        HubVisual.tsx
        CapabilityCard.tsx
        StepTimeline.tsx
        ArchitectureLayer.tsx
        ResponsiveCarousel.tsx
```

## Quy tắc component

- Section component chỉ nhận data qua props.
- Không hardcode text trong component.
- Asset path lấy từ seed/CMS.
- Connector là SVG component.
- Mỗi section có fallback static khi reduced motion.
- Section có `aria-labelledby`.
