# MASTER SEED ORDER

## Bước 1 — Baseline
1. Đọc `MASTER_INDEX.json`
2. Kiểm tra shared blocks đã tồn tại:
   - heroSplit
   - illustrationFeature
   - ctaVisual
3. Kiểm tra media collection và metadata fields:
   - code
   - title
   - page
   - section
   - summary
   - alt
   - ratio
   - type
   - locale
   - status

## Bước 2 — Import theo thứ tự set
1. SET 03 — Corporate Website Core
2. SET 04 — X Real Estate Digital Suite
3. SET 05 — XBooking Marketing, CRM & Lead
4. SET 06 — XBooking Inventory, Booking & Customer Care
5. SET 07 — FinERP Core

## Bước 3 — Sau mỗi set
- Import media assets
- Seed metadata
- Patch page blocks
- Seed chatbot prompts
- Revalidate routes
- Chạy lại seed lần 2 để kiểm tra idempotency

## Bước 4 — Kiểm tra master
- Soát route trùng / ghi đè ngoài ý muốn
- Soát asset code trùng
- Soát block types không phát sinh ngoài chuẩn
- Soát responsive desktop / tablet / mobile
