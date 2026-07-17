# COMPONENT ARCHITECTURE

```txt
components/
  products/
    c03/
      C03SectionHeader.tsx
      C03OutcomeStrip.tsx
      C03ConnectorSvg.tsx
      C03ProductNode.tsx
      C03GlowPedestal.tsx
      C03OrbitRing.tsx
      C03FeatureChipRibbon.tsx

      C03EcosystemOverview.tsx
      C03XAiProduct.tsx
      C03XBookingProduct.tsx
      C03FinErpProduct.tsx
      C03XBuildingProduct.tsx
      C03XSpaceProduct.tsx
      C03SharedPlatform.tsx
      C03Interoperability.tsx

      shared/
        ProductCapsule.tsx
        CapabilityCard.tsx
        PlatformLayer.tsx
        LifecycleStep.tsx
        ResponsiveCarousel.tsx
        LightPathSvg.tsx
```

## Quy tắc component

- Section component chỉ nhận data qua props.
- Không hardcode text trong component.
- Asset path lấy từ seed/CMS.
- Connector, orbital line, arrow path là SVG component.
- Pedestal nên là component riêng để tái sử dụng.
- Mỗi section có fallback static khi reduced motion.
- Section có `aria-labelledby`.

## Những component không được thiếu

### `C03GlowPedestal`
Tạo đế phát sáng cho node/icon/hub.

### `C03ConnectorSvg` hoặc `LightPathSvg`
Dựng đường nối có gradient + glow.

### `ProductCapsule`
Card/ capsule sản phẩm có illustration, title, short description.

### `FeatureChipRibbon`
Hiển thị chip nền tảng như Data / API / Identity / Workflow / Cloud / Security / Analytics.

## Kiến trúc route đề xuất

```txt
app/
  san-pham/
    page.tsx
    x-ai/page.tsx
    xbooking/page.tsx
    finerp/page.tsx
    xbuilding/page.tsx
    x-space/page.tsx
    nen-tang-dung-chung/page.tsx
  bo-giai-phap-x/
    page.tsx
```
