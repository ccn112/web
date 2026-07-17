# MASTER PROMPT — C04 Implementation & Integration

Bạn đang hoàn thiện website corporate XTECH bằng Next.js App Router và CMS dùng chung.

Hãy triển khai nhánh `/trien-khai` theo hướng **go-live nhanh**, không chờ sinh thêm visual mới.

## Nguyên tắc

- Kế thừa theme hiện tại.
- Dùng lại background grid sáng, radial glow, icon, chips và connector SVG hiện có.
- Không tạo một theme mới.
- Không dùng ảnh reference full-section trong production.
- Text, tab, timeline, cards, chips, CTA là HTML/CMS.
- Title section tối đa 2 dòng trên desktop.
- Luân phiên visual trái/phải.
- Không hardcode dữ liệu.
- Không client hóa toàn trang.

## Route

```txt
/trien-khai
/trien-khai/quy-trinh
/trien-khai/tich-hop-he-thong
/trien-khai/chuyen-doi-du-lieu
/trien-khai/cloud-va-on-premise
/trien-khai/devsecops
/trien-khai/sla-va-ho-tro
```

## Ưu tiên MVP

### Phase 1 — Bắt buộc để go-live
1. `/trien-khai`
2. `/trien-khai/quy-trinh`
3. `/trien-khai/tich-hop-he-thong`
4. `/trien-khai/cloud-va-on-premise`
5. `/trien-khai/sla-va-ho-tro`

### Phase 2 — Có thể hoàn thiện ngay sau go-live
6. `/trien-khai/chuyen-doi-du-lieu`
7. `/trien-khai/devsecops`

## 8 section landing

### 1. Từ khảo sát đến vận hành ổn định
Timeline end-to-end.

### 2. Hiểu đúng hiện trạng, thiết kế đúng kiến trúc
Current-state → target-state → roadmap.

### 3. Kết nối hệ thống, hợp nhất dòng dữ liệu
Legacy/app/data → Integration Hub → channel/AI.

### 4. Tích hợp linh hoạt, vận hành theo sự kiện
API Gateway, Event Bus, Queue, Retry, Audit, Observability.

### 5. Chuyển đổi dữ liệu an toàn, có kiểm soát
Mapping, clean, validate, reconcile, cutover, rollback.

### 6. Linh hoạt với mọi mô hình hạ tầng
SaaS, Private Cloud, On-premise, Hybrid.

### 7. Bảo mật từ thiết kế, giám sát xuyên suốt
Code → Build → Test → Scan → Deploy → Monitor → Improve.

### 8. Go-live chỉ là điểm bắt đầu
SLA, service desk, hypercare, release, adoption, improvement.

## Visual strategy

- Dùng CSS/SVG cho connector, line, ring, flow.
- Dùng icon đã có cho cloud, API, data, security, workflow, support.
- Dùng card/layer/timeline thay vì illustration raster mới nếu chưa có.
- Chỉ dùng raster nếu asset hiện có phù hợp.
- Ưu tiên fidelity theme hơn độ phức tạp.

## CMS

Dùng schema trong `docs/CMS_SCHEMA.md` và seed trong `starter/c04-seed-data.ts`.

## Output

- Route hoàn chỉnh
- Components tách riêng
- CMS schema
- Seed data
- Responsive
- Screenshot 1440/1024/768/390
- Checkpoint triển khai
