# MASTER PROMPT — C05 Solution Suites

Bạn đang phát triển website corporate XTECH bằng Next.js App Router và CMS dùng chung.

Hãy triển khai nhánh **Bộ giải pháp X** theo đúng vai trò:

> Cấu hình sản phẩm + dịch vụ + nền tảng + lộ trình theo mô hình doanh nghiệp.

Không được biến trang này thành một trang liệt kê lại tính năng sản phẩm.

## Route bắt buộc

```txt
/bo-giai-phap-x
/bo-giai-phap-x/chu-dau-tu-bat-dong-san
/bo-giai-phap-x/doanh-nghiep-so
/bo-giai-phap-x/toa-nha-thong-minh
/bo-giai-phap-x/tai-chinh-va-van-hanh
/bo-giai-phap-x/ai-doanh-nghiep
```

## Theme cần bám

- Dùng token/theme hiện tại của project, không dựng một theme riêng.
- Nền sáng xanh nhạt, subtle grid, glow vừa phải.
- Card trắng, viền xanh rất nhạt, shadow mềm.
- Heading tối đa 2 dòng trên desktop.
- Section luân phiên visual trái / phải để tránh nhàm chán.
- Visual chính có thể dùng raster/WebP đã tách, còn text và interaction phải là HTML.
- Không lạm dụng gradient violet; ưu tiên navy + blue + cyan, gold chỉ cho CTA hoặc active state.

## 8 section landing

### C05-01 — Solution Suite Selector
Chọn 1 trong 5 mô hình doanh nghiệp.

### C05-02 — Solution Blueprint
4 lớp:
- Hành trình nghiệp vụ
- Sản phẩm
- Nền tảng dùng chung
- Dịch vụ triển khai

### C05-03 — Phạm vi Khởi động
MVP, một bài toán ưu tiên, ít tích hợp, đo giá trị sớm.

### C05-04 — Phạm vi Mở rộng
Liên thông nhiều phòng ban, dữ liệu tập trung, workflow xuyên hệ thống.

### C05-05 — Phạm vi Toàn diện
End-to-end, AI xuyên suốt, quản trị tập trung, đa đơn vị.

### C05-06 — Product & Service Configurator
Ma trận Cốt lõi / Khuyến nghị / Tùy chọn / Không áp dụng.

### C05-07 — Deployment & Maturity Roadmap
Từ bài toán nhỏ đến hệ sinh thái thông minh.

### C05-08 — Solution Builder
Form tạo đề xuất sơ bộ.

## Dữ liệu

Dùng `starter/c05-seed-data.ts` làm seed mặc định. Thiết kế component theo schema trong `docs/CMS_SCHEMA.md`.

## Quy tắc không được vi phạm

- Không hardcode nội dung vào component.
- Không dùng PNG reference full section trong production.
- Không lặp lại toàn bộ nội dung từ `/san-pham`, `/giai-phap`, `/dich-vu`.
- Không dùng title dài quá 2 dòng.
- Không dùng số liệu % giả.
- Không tạo gói giá nếu chưa có dữ liệu thương mại thật.
- Không đổi route tiếng Việt.
- Logo XTECH phải dùng asset gốc trong project.

## Interaction

- Selector active thay đổi toàn bộ blueprint/configurator/roadmap.
- Configurator hỗ trợ compare.
- Form Solution Builder tạo draft đề xuất sơ bộ.
- Mobile dùng accordion/stepper, không thu nhỏ nguyên layout desktop.

## Output bắt buộc

- Components tách theo section.
- Seed dữ liệu.
- CMS collections/globals.
- Route mapping.
- Screenshot 1440 / 1024 / 768 / 390.
- Checkpoint trạng thái triển khai.
