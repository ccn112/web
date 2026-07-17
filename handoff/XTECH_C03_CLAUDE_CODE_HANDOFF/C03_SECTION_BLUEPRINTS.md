# C03 SECTION BLUEPRINTS

## C03-01 — Hệ sinh thái sản phẩm XTECH

### Route
- `/san-pham`
- có thể tái dùng một phần trên homepage

### Mục tiêu nội dung
Giới thiệu toàn cảnh 5 sản phẩm cốt lõi của XTECH trên một nền tảng dùng chung.

### Composition
```txt
          Header
   Product capsule orbiting core
     [ XTECH ECOSYSTEM HUB ]
     5 sản phẩm xoay quanh trung tâm
        Chips nền tảng dùng chung
```

### DOM
```tsx
<ProductEcosystemOverview>
  <SectionHeader />
  <EcosystemOrbitLayout>
    <EcosystemCore />
    <ProductNode product="x-ai" />
    <ProductNode product="xbooking" />
    <ProductNode product="finerp" />
    <ProductNode product="xbuilding" />
    <ProductNode product="x-space" />
    <OrbitalConnectorSvg />
  </EcosystemOrbitLayout>
  <SharedPlatformChips />
</ProductEcosystemOverview>
```

### Motion
- Core fade-up + glow.
- Product nodes stagger.
- Orbital connector draw.
- Chips reveal cuối.

### Mobile
- Core lên trên.
- Product nodes thành horizontal snap hoặc 2 cột.
- Tắt orbital ring phức tạp, giữ 1 connector đơn giản.

---

## C03-02 — X.AI: Trí tuệ doanh nghiệp

### Route
- `/san-pham/x-ai`
- teaser có thể tái dùng tại `/san-pham`

### Mục tiêu nội dung
Trình bày X.AI như lớp AI doanh nghiệp: agent, RAG, automation, governance, insight.

### Composition
- Hero/section head.
- Main AI hub ở trung tâm hoặc lệch trái.
- 4–6 capability cluster xung quanh.
- Strip outcome / CTA phía dưới.

### DOM
```tsx
<XAiProductSection>
  <SectionHeader />
  <AiHubVisual />
  <CapabilityCluster />
  <UseCaseStrip />
  <SectionCta />
</XAiProductSection>
```

### Motion
- AI hub glow pulse.
- Capability cluster reveal theo stagger.
- Connector draw.

### Mobile
- Hub → capabilities → use cases → CTA theo cột dọc.

---

## C03-03 — XBooking: Nền tảng bán hàng bất động sản

### Route
- `/san-pham/xbooking`
- có thể tái dùng trong `/bo-giai-phap-x/chu-dau-tu-bat-dong-san`

### Mục tiêu nội dung
Thể hiện chuỗi marketing → lead → CRM → bảng hàng → booking → hợp đồng → CSKH.

### Composition
- Central XBooking hub.
- Các capability/step hai bên hoặc dạng hub-spoke.
- Bottom outcome/value strip.

### DOM
```tsx
<XBookingProductSection>
  <SectionHeader />
  <SalesJourneyHub />
  <CapabilityCardGroup />
  <ValueStrip />
  <SectionCta />
</XBookingProductSection>
```

### Motion
- Hub scale-in.
- Card reveal 2 phía.
- Light flow chạy từ marketing đến booking.

### Mobile
- Step list dọc có icon.
- Hub giữ trên cùng.

---

## C03-04 — FinERP: Tài chính & vận hành doanh nghiệp

### Route
- `/san-pham/finerp`

### Mục tiêu nội dung
Nhấn mạnh cashflow, công nợ, ngân sách, kế toán, báo cáo và điều hành.

### Composition
- Main finance platform visual.
- 5–6 module card xung quanh.
- Value summary / KPI outcomes dưới.

### DOM
```tsx
<FinErpProductSection>
  <SectionHeader />
  <FinanceCoreVisual />
  <FinanceModuleGrid />
  <OutcomeStrip />
</FinErpProductSection>
```

### Motion
- Module hover highlight.
- Finance ring / connector glow nhẹ.

### Mobile
- 2 cột module hoặc accordion.

---

## C03-05 — XBuilding: Vận hành tòa nhà & cư dân

### Route
- `/san-pham/xbuilding`
- tái dùng trong `/bo-giai-phap-x/toa-nha-thong-minh`

### Mục tiêu nội dung
Trình bày hệ sinh thái cư dân, căn hộ, dịch vụ, phí, ticket, thiết bị, bảo trì, IoT.

### Composition
- Building operations hub.
- Resident/service/maintenance/device nodes xung quanh.
- Có thể dùng vòng tròn hoặc hành trình.

### DOM
```tsx
<XBuildingProductSection>
  <SectionHeader />
  <BuildingOpsHub />
  <OpsCapabilityNodes />
  <ValueStrip />
</XBuildingProductSection>
```

### Motion
- Node reveal vòng quanh hub.
- Ring pulse nhẹ.

### Mobile
- Node list dạng feature stack.

---

## C03-06 — X.Space: Cộng tác, công việc & tri thức

### Route
- `/san-pham/x-space`

### Mục tiêu nội dung
Thể hiện môi trường làm việc số: công việc, dự án, phê duyệt, tài liệu, chat, lịch, tri thức.

### Composition
- Workspace illustration lớn.
- Utility capsules / feature cards bao quanh.
- CTA hoặc quick feature ribbon.

### DOM
```tsx
<XSpaceProductSection>
  <SectionHeader />
  <WorkspaceScene />
  <FeatureCapsules />
  <SectionCta />
</XSpaceProductSection>
```

### Motion
- Floating capsule hover.
- Soft parallax rất nhẹ ở desktop.

### Mobile
- Workspace visual trên.
- Feature capsule slider hoặc grid 2 cột.

---

## C03-07 — Nền tảng dùng chung XTECH

### Route
- `/san-pham/nen-tang-dung-chung`
- tóm tắt có thể tái dùng ở `/san-pham`

### Mục tiêu nội dung
Giải thích các lớp năng lực dùng chung: Data, API, Identity, Workflow, Cloud, Security, Analytics, AI Services.

### Composition
- Stack / layer / architecture map.
- Core platform ở trung tâm.
- Layer/chip theo thứ bậc.

### DOM
```tsx
<SharedPlatformSection>
  <SectionHeader />
  <PlatformArchitectureVisual />
  <PlatformLayerList />
  <TechChipRibbon />
</SharedPlatformSection>
```

### Motion
- Layer reveal từ dưới lên.
- Chip hover sáng nhẹ.

### Mobile
- Accordion theo lớp.

---

## C03-08 — Liên thông sản phẩm XTECH

### Route
- `/san-pham`
- `/bo-giai-phap-x`

### Mục tiêu nội dung
Cho thấy các sản phẩm không tách rời mà liên kết thành chuỗi nghiệp vụ khép kín.

### Composition
- Hành trình / lifecycle liên thông.
- Product nodes nối với nhau.
- Core value outputs cuối section.

### DOM
```tsx
<ProductInteroperabilitySection>
  <SectionHeader />
  <LifecycleFlow />
  <ProductLinkMap />
  <OutcomeStrip />
  <SectionCta />
</ProductInteroperabilitySection>
```

### Motion
- Flow line chạy trái → phải hoặc vòng tròn.
- Node sáng theo active step.

### Mobile
- Stepper dọc.
- Product nodes thành accordion / stacked cards.
