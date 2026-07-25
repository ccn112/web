# Nhật ký chỉnh sửa — Website X (corporate)

## Phiên 2026-07-25 — Tư vấn lead đa kênh (AI Chat + Email + Chuyên gia)

Triển khai `handoff/XTECH_AI_LEAD_EMAIL_CHAT_HANDOFF_V1/`. **Nhật ký chi tiết + việc còn lại:
`docs/LEAD_CONSULTATION_HANDOFF.md`** (đọc mục 8 trước khi tiếp tục).

- **9 collection mới** (group admin “Lead & Tư vấn”): `leads`, `lead-devices`, `lead-conversations`,
  `lead-messages`, `resume-tokens`, `email-templates`, `consultants`, `consultant-assignments`,
  `lead-activities`. Migration additive `20260725_060131_add_lead_consultation`.
- **Một hội thoại, hai kênh đồng thời**: web chat (`/tu-van`, SSE) và email inbound/outbound cùng ghi
  vào `lead-messages`; AI luôn đọc history hợp nhất nên không hỏi lại thông tin khách đã trả lời ở
  kênh kia. Chuyên gia gõ trong admin → khách nhận email + thấy ngay trên web chat.
- **State machine khai thác nhu cầu**: 13 trạng thái, 10 slot có trọng số (tổng 100). Đạt
  `LEAD_HANDOFF_SCORE` (62) hoặc khách xin gặp người/demo/báo giá → `HUMAN_READY` → **email nội bộ
  cho chuyên gia** (brief + SLA + link vào hội thoại) và AI dừng khai thác.
- **Bảo mật**: `deviceId` chỉ để continuity, không phải authentication; link email là signed token
  HMAC có TTL + revoke (chỉ lưu hash, không PII trong URL); thiết bị mới phải xác minh OTP qua email
  trước khi xem lịch sử; chống loop email (auto-reply/bounce, dedupe `Message-ID`, cắt quoted-reply,
  ngân sách gửi); audit đầy đủ trong `lead-activities`; unsubscribe 1-click (RFC 8058).
- **Template email**: khung transactional dựng theo Cerberus hybrid pattern + quy ước Postmark
  (Outlook VML button, preheader, dark mode, plain-text twin). 7 template, sửa được trong admin.
- Endpoint CMS `/api/lead/{intake,chat,session,resume,verify,email-reply,handoff,unsubscribe}`;
  `clay` chỉ proxy. Form `/lien-he`, `/dat-lich-demo`, `/yeu-cau-tu-van` giờ khởi động luôn phiên tư vấn.
- ⚠️ **Chưa smoke-test runtime** (typecheck + lint + migration đã sạch). Xem checklist ở mục 8 của
  `docs/LEAD_CONSULTATION_HANDOFF.md`.

---

> Phiên làm việc 2026-07-21. Phạm vi: **site corporate (x.vn)**. Nội dung mới nạp vào DB dev qua `pnpm --filter @x/cms db:seed` (seed JSON là nguồn sự thật). Prod cần chạy `db:seed` khi go-live (deploy.sh chỉ `migrate`, không seed).

## 1. CI/CD & Deploy
- `.github/workflows/ci.yml`: thêm job **`deploy`** (needs: build, chỉ chạy khi push `main`) — SSH vào VPS chạy `./deploy.sh`. Cần secrets `VPS_HOST/USER/SSH_KEY/PORT/PATH` (chưa đặt → deploy job fail vô hại, chưa ảnh hưởng prod).
- `docs/CI_CD.md`: hướng dẫn deploy key, secrets, rollback.

## 2. Trang mới (CMS pages + service-sections, site corporate)
- **8 trang capability** `/giai-phap/{doanh-nghiep-ket-noi, du-lieu-va-ai, tu-dong-hoa, tich-hop-he-thong}` + `/dich-vu/{tu-van-chien-luoc, phat-trien-phan-mem, du-lieu-va-ai, van-hanh-va-ho-tro}`.
- **5 trang `/ve-x/*`**: gioi-thieu, tam-nhin-su-menh, doi-ngu, doi-tac, tuyen-dung.
- (Trước đó đã có sẵn: 3 trang legal, 5 trang suite, `/san-pham/nen-tang-dung-chung` — audit cũ báo thiếu nhưng thực tế đã làm.)

## 3. Chuẩn hóa format theo /dich-vu (8 trang giải pháp + dịch vụ)
- Mỗi trang: **hero tối + featureGrid + 2 sơ đồ C02 data-driven RIÊNG + CTA đóng trang**.
- **8 kiểu sơ đồ C02 rải đều mỗi kiểu 2 lần** (hub-spoke, maturity-radar, architecture-stack, process-evolution, data-platform, integration-hub, adoption-journey, control-tower); nội dung sơ đồ soạn riêng theo tâm lý khách từng trang.
- Chèn **`comparisonTable`** (bảng trước/sau, định tính) ở 4 trang: tu-dong-hoa, doanh-nghiep-ket-noi, du-lieu-va-ai, van-hanh-va-ho-tro.
- `/ve-x`: thêm sơ đồ C02 cho 3 trang hợp nội dung (gioi-thieu, doi-tac, tuyen-dung); tam-nhin-su-menh & doi-ngu giữ featureGrid.

### Code thay đổi kèm theo
- `apps/clay/src/components/services/c02/C02SectionRenderer.tsx`: render **closing CTA** từ `section.cta` của section cuối (tái dùng mọi trang; không ảnh hưởng /dich-vu vốn cta rỗng).
- `apps/clay/src/components/site/Header.tsx`: thêm **dark scrim** sau header (hiện khi chưa cuộn) — giữ logo/menu **trắng** đọc được trên trang nền sáng (vd trang C02-only).
- Sửa lỗi **hub-spoke dồn 1 bên**: gán `side` xen kẽ trái/phải theo order (quy tắc đã ghi vào spec nội dung).

## 4. Menu chính (corporate) — sửa triệt để
- Bỏ 3 link chết (404): `/giai-phap/{chuoi-nghiep-vu, doi-tuong, muc-tieu}`.
- Dropdown **Giải pháp** → 4 trang thật + Bộ giải pháp X. Thêm children cho **Dịch vụ** (4) và **Về X** (5). Tổng 28 link, **không còn link chết**.
- File: `handoff/X_WEB_PLATFORM_HANDOFF_20260715/seed/menus.json` (corporate).

## 5. Trang sản phẩm `/san-pham/*`
- `apps/clay/src/components/product/ProductSections.tsx`:
  - Section đầu (i===0) render trong **hero TỐI** (theme-dark) đúng chuẩn /dich-vu → menu trắng đọc được, mở đầu nhất quán (áp cho cả 6 sản phẩm).
  - Thêm layout **`illustration`** (ảnh thật + bullet, zig-zag) cho `ProductSection` (field mới `image`, `bullets`).
- **FinERP — làm bespoke đầy đủ theo handoff SET_07/08** (trang MẪU đã duyệt):
  - Import 8 ảnh dashboard thiết kế → `apps/clay/public/products/finerp/ferp-0X-*.png`.
  - Viết lại `product-content.ts` (route `/san-pham/finerp`): hero (6 phân hệ) + **7 phân hệ lõi có ảnh dashboard thật** (tài chính, dòng tiền/công nợ, kế toán, ngân sách, mua hàng, kho-tài sản, chi phí dự án) + dải mở rộng SET_08 (HRM, lương, phê duyệt, hợp đồng, Report AI, cảnh báo, tích hợp) + CTA.

## 6. Việc còn lại (chưa làm)
- **4 sản phẩm còn lại** làm bespoke theo handoff như FinERP: **XBooking** (SET_05/06), **XBuilding** (SET_09/10), **X.AI** (SET_11), **X.Space** — import ảnh + viết lại nội dung.
- Microsite (xai.vn, xbooking.vn…): các trang `/giai-phap/*` của microsite **ngoài phạm vi** đợt này (chỉ làm corporate).
- Prod: đặt VPS secrets để deploy; chạy `db:seed` trên VPS để nạp nội dung mới.

## Trạng thái git
- Mốc `df31baf` trên `main`/`origin` (do subagent lỡ push, đã chọn giữ). **Các thay đổi mục 3–5 sau df31baf đang ở LOCAL, chưa commit** (theo ý "chưa commit"; commit khi được duyệt).
