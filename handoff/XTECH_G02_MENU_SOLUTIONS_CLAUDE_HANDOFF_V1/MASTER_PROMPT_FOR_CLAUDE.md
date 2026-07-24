# MASTER PROMPT — G02 Menu Solutions

Bạn đang triển khai 5 trang thuộc menu Giải pháp của website XTECH.

## Route

```txt
/giai-phap/doanh-nghiep-ket-noi
/giai-phap/du-lieu-va-ai
/giai-phap/tu-dong-hoa
/giai-phap/tich-hop-he-thong
/bo-giai-phap-x
```

## Nguồn thiết kế

- `references/full-pages/`: ảnh toàn trang để đối chiếu bố cục
- `assets/`: visual đã tách theo section
- `docs/SECTION_ASSET_MAPPING.md`: mapping bắt buộc
- `starter/g02-seed-data.ts`: seed tiếng Việt

## Cách triển khai

1. Đọc theme/tokens hiện có của website.
2. Dùng ảnh full-page làm visual reference.
3. Dùng WebP trong `assets/` cho production.
4. Dựng toàn bộ text, card, chip, tab, CTA và statistic bằng HTML/CSS.
5. Nội dung phải lấy từ CMS, không hardcode.
6. Bám bố cục tương đối, không cần pixel-perfect tới mức phá responsive.
7. Giữ title section tối đa 2 dòng desktop.
8. Không dùng số % trong thiết kế như số liệu thật nếu CMS chưa đánh dấu `verified`.
9. Logo phải dùng asset gốc của project, không lấy logo từ screenshot.
10. Không dùng ảnh toàn trang làm background hoặc `<img>` production.

## Theme

- Hero: dark navy, blue/cyan glow.
- Body: nền trắng/xanh rất nhạt, grid mảnh.
- Card trắng, border xanh nhẹ, shadow mềm.
- Gold cho CTA chính.
- Gradient purple chỉ dùng tiết chế.
- Visual luân phiên trái/phải.

## Responsive

- Desktop: split layout 44/56 hoặc 50/50.
- Tablet: stack 1 cột.
- Mobile: visual đặt sau copy, card chuyển accordion/slider khi cần.
- Không thu nhỏ nguyên desktop layout.

## CMS

Dùng schema trong `docs/CMS_SCHEMA.md`.

## Output bắt buộc

- 5 route hoàn chỉnh
- component dùng chung
- seed CMS
- responsive 1440 / 1024 / 768 / 390
- screenshot diff
- checkpoint trạng thái
