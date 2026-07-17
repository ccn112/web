# ROUTE & CMS MAPPING

## Route tiếng Việt

```txt
/dich-vu
/dich-vu/chuyen-doi-so
/giai-phap/chuyen-doi-so
/ve-x/nang-luc
```

## Mapping đề xuất

| Section | Route chính | Route tái sử dụng |
|---|---|---|
| C02-01 | `/dich-vu` | `/dich-vu/chuyen-doi-so` |
| C02-02 | `/dich-vu/chuyen-doi-so` | `/giai-phap/chuyen-doi-so` |
| C02-03 | `/dich-vu/chuyen-doi-so` | `/ve-x/nang-luc` |
| C02-04 | `/dich-vu/chuyen-doi-so` | `/giai-phap/chuyen-doi-so` |
| C02-05 | `/dich-vu/chuyen-doi-so` | `/giai-phap/chuyen-doi-so` |
| C02-06 | `/dich-vu/chuyen-doi-so` | `/trien-khai` |
| C02-07 | `/dich-vu/chuyen-doi-so` | `/ve-x/nang-luc` |
| C02-08 | `/dich-vu` | `/dich-vu/chuyen-doi-so` |

## CMS field

```ts
type ServiceSectionCms = {
  sectionId: string
  eyebrow?: string
  title: string
  subtitle?: string
  intro?: string
  items: Array<{
    id: string
    title: string
    description: string
    icon?: Media
    illustration?: Media
  }>
  outcomes?: Array<{
    title: string
    description: string
    icon?: Media
  }>
  cta?: {
    label: string
    href: string
  }
}
```
