# XTECH — G02 Menu Solutions Handoff V1

Bộ handoff này triển khai 5 trang trong menu **Giải pháp**:

```txt
/giai-phap/doanh-nghiep-ket-noi
/giai-phap/du-lieu-va-ai
/giai-phap/tu-dong-hoa
/giai-phap/tich-hop-he-thong
/bo-giai-phap-x
```

## Nội dung gói

- 5 ảnh thiết kế toàn trang đã duyệt
- 21 visual được cắt trực tiếp từ các trang thiết kế
- Mỗi visual có:
  - PNG feathered để ghép vào section
  - WebP tối ưu để dùng production
- Mapping section → visual
- Nội dung tiếng Việt
- CMS schema
- Seed dữ liệu
- Master prompt cho Claude Code
- QA checklist

## Quy tắc quan trọng

Ảnh cắt chỉ chứa phần visual cần thiết. Claude Code phải dựng lại:

- tiêu đề;
- mô tả;
- card;
- icon UI;
- statistic;
- CTA;
- tab;
- breadcrumb;

bằng HTML/CSS và lấy dữ liệu từ CMS.

Không dùng ảnh toàn trang làm production.
