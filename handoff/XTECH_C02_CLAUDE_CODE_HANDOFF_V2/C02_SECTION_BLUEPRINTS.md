# C02 SECTION BLUEPRINTS

## C02-01 — Dịch vụ chuyển đổi số toàn diện

### Route
- `/dich-vu`
- section đầu của `/dich-vu/chuyen-doi-so`

### Composition
```txt
                  Header
   Card 1   Card 2       Card 3
            DIGITAL HUB
   Card 4   Card 5       Card 6
             Outcomes
```

### DOM
```tsx
<DigitalTransformationServicesOverview>
  <SectionHeader />
  <HubSpokeLayout>
    <CentralTransformationHub />
    <CapabilityCard side="left" />
    <CapabilityCard side="right" />
    <ConnectorSvg />
  </HubSpokeLayout>
  <OutcomeStrip />
</DigitalTransformationServicesOverview>
```

### Motion
- Header fade-up.
- Hub scale 0.96 → 1.
- Connector line draw.
- 6 capability cards stagger.
- Outcome strip reveal cuối.

### Mobile
- Hub ở trên.
- 6 capability thành accordion/list.
- Tắt connector SVG.

---

## C02-02 — Đánh giá mức độ trưởng thành số

### Route
- `/dich-vu/chuyen-doi-so`
- `/giai-phap/chuyen-doi-so`

### Composition
- Radar/maturity engine trung tâm.
- 6 trụ cột hai bên.
- Timeline 6 bước phía dưới.
- 3 outcome card cuối.

### DOM
```tsx
<DigitalMaturityAssessment>
  <SectionHeader />
  <MaturityRadar />
  <MaturityPillars />
  <AssessmentProcess />
  <OutcomeStrip />
</DigitalMaturityAssessment>
```

### Motion
- Radar polygon draw.
- Pillar active theo hover/focus.
- Timeline chạy trái → phải theo scroll.

### Mobile
- Radar thu gọn.
- 6 pillar dạng 2 cột hoặc accordion.
- Timeline dọc.

---

## C02-03 — Chiến lược, lộ trình và kiến trúc doanh nghiệp

### Route
- `/dich-vu/chuyen-doi-so`
- `/ve-x/nang-luc`

### Composition
- North Star / doanh nghiệp mục tiêu phía trên.
- 3 tầng kiến trúc giữa.
- Roadmap 4 bước dưới.
- 3 outcome card cuối.

### DOM
```tsx
<StrategyArchitectureSection>
  <NorthStar />
  <ArchitectureLayer type="business" />
  <ArchitectureLayer type="data-app" />
  <ArchitectureLayer type="technology-security" />
  <Roadmap />
  <OutcomeStrip />
</StrategyArchitectureSection>
```

### Motion
- North Star glow.
- Architecture layers reveal dưới → trên.
- Roadmap progress theo scroll.

### Mobile
- Architecture thành accordion 3 tầng.
- Roadmap dọc.

---

## C02-04 — Tái thiết kế quy trình và tự động hóa

### Route
- `/dich-vu/chuyen-doi-so`
- `/giai-phap/chuyen-doi-so`

### Composition
```txt
Thủ công → Quy trình số → Workflow tự động → AI hỗ trợ
```
- Capability row: Khám phá quy trình, BPMN, Workflow, RPA, AI Agent, Phê duyệt con người.
- Outcome strip cuối.

### DOM
```tsx
<ProcessRedesignAutomation>
  <ProcessEvolution />
  <CapabilityRail />
  <OutcomeStrip />
</ProcessRedesignAutomation>
```

### Motion
- Progress arrows chạy.
- Active step sáng theo scroll.
- Capability cards hover/focus.

### Mobile
- Horizontal snap carousel.
- Capability rail thành 2 cột.

---

## C02-05 — Nền tảng dữ liệu và phân tích doanh nghiệp

### Route
- `/dich-vu/chuyen-doi-so`
- `/giai-phap/chuyen-doi-so`

### Composition
```txt
Nguồn dữ liệu
→ Tích hợp & thu thập
→ Lakehouse / DWH
→ Quản trị & chất lượng
→ BI / Phân tích / Báo cáo / AI
```

### DOM
```tsx
<DataPlatformSection>
  <UseCaseTabs />
  <GovernanceLayer />
  <LakehouseCore />
  <IngestionLayer />
  <SourceSystems />
  <OutcomeStrip />
</DataPlatformSection>
```

### Motion
- Data line chạy từ source lên.
- Layer reveal dưới → trên.
- Tabs đổi state, không reload.

### Mobile
- Architecture stack dọc.
- Tabs scroll ngang.

---

## C02-06 — Hiện đại hóa ứng dụng và tích hợp hệ thống

### Route
- `/dich-vu/chuyen-doi-so`
- `/trien-khai`

### Composition
```txt
Legacy Systems → API & Integration Hub → Modern Digital Apps
```

### DOM
```tsx
<ApplicationModernizationSection>
  <LegacySystems />
  <IntegrationHub />
  <ModernApps />
  <CapabilityRow />
  <OutcomeStrip />
</ApplicationModernizationSection>
```

### Motion
- Connector trái → giữa → phải.
- Hub glow.
- Capability active theo hover.

### Mobile
- 3 khối stack dọc.
- Connector đổi thành line dọc.

---

## C02-07 — Quản trị thay đổi và thúc đẩy sử dụng

### Route
- `/dich-vu/chuyen-doi-so`
- `/ve-x/nang-luc`

### Composition
- Stakeholder card phía trên:
  Lãnh đạo, Quản lý, Nhân viên, Key Users, IT/Digital Team.
- Journey phía dưới:
  Nhận thức → Đồng thuận → Đào tạo → Thử nghiệm → Áp dụng → Đo lường → Cải tiến.

### DOM
```tsx
<ChangeManagementSection>
  <StakeholderMap />
  <AdoptionJourney />
  <OutcomeStrip />
</ChangeManagementSection>
```

### Motion
- Stakeholder reveal.
- Journey progress line.
- Step active theo scroll.

### Mobile
- Stakeholder carousel.
- Timeline dọc.

---

## C02-08 — Vận hành chuyển đổi số và cải tiến liên tục

### Route
- `/dich-vu`
- section cuối của `/dich-vu/chuyen-doi-so`

### Composition
```txt
4 control item trái
       Digital PMO / Control Tower
4 control item phải
Continuous Improvement Loop 5 bước
3 outcome card
```

### DOM
```tsx
<DigitalTransformationOperations>
  <ControlTowerLayout />
  <ContinuousImprovementLoop />
  <OutcomeStrip />
</DigitalTransformationOperations>
```

### Motion
- Control tower reveal.
- Connector line draw.
- 8 item stagger.
- Loop progress.
- Outcomes reveal cuối.

### Mobile
- Tower trên.
- 8 item dạng list.
- Loop thành timeline dọc.
