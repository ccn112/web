# ROUTE & CMS MAPPING

## Route tiếng Việt

```txt
/san-pham
/san-pham/x-ai
/san-pham/xbooking
/san-pham/finerp
/san-pham/xbuilding
/san-pham/x-space
/san-pham/nen-tang-dung-chung
/bo-giai-phap-x
```

## Mapping đề xuất

| Section | Route chính | Route tái sử dụng |
|---|---|---|
| C03-01 | `/san-pham` | homepage / `/bo-giai-phap-x` |
| C03-02 | `/san-pham/x-ai` | `/san-pham` |
| C03-03 | `/san-pham/xbooking` | `/bo-giai-phap-x/chu-dau-tu-bat-dong-san` |
| C03-04 | `/san-pham/finerp` | `/bo-giai-phap-x/tai-chinh-va-van-hanh` |
| C03-05 | `/san-pham/xbuilding` | `/bo-giai-phap-x/toa-nha-thong-minh` |
| C03-06 | `/san-pham/x-space` | `/san-pham` |
| C03-07 | `/san-pham/nen-tang-dung-chung` | `/san-pham` |
| C03-08 | `/san-pham` | `/bo-giai-phap-x` |

## CMS field đề xuất

```ts
type ProductSectionCms = {
  sectionId: string
  eyebrow?: string
  title: string
  subtitle?: string
  intro?: string
  layout: 'orbit' | 'hub-spoke' | 'stack' | 'journey' | 'showcase'
  items: Array<{
    id: string
    title: string
    description: string
    icon?: Media
    illustration?: Media
    href?: string
    badges?: string[]
  }>
  outcomes?: Array<{
    title: string
    description: string
    icon?: Media
  }>
  platformChips?: string[]
  cta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
}
```
