# XTECH News / Insights UI — Claude Code Handoff V1

Mục tiêu: hiện thực module **Tin tức / Insights** cho website corporate XTECH theo đúng style web hiện tại, bám các ảnh thiết kế đã chốt, đồng thời **tách lớp background, illustration chính, icon, card UI** để code linh hoạt, responsive và quản trị được qua CMS.

## Tài sản thiết kế chính
1. `trang_chủ_xtech_tin_tức_cập_nhật.png` — màn Home tin tức / featured news
2. `giao_diện_xtech_cập_nhật_xu_hướng_công_nghệ.png` — màn Listing tin tức
3. `giao_diện_bài_viết_công_nghệ_ai.png` — màn Detail bài viết

## Yêu cầu cốt lõi
- Bám theme hiện tại của corporate site: dark hero, glow xanh/cyan, card sáng nhẹ, typography hiện đại.
- Không nhúng nguyên một ảnh full-section làm section cuối cùng.
- Phải **tách thành nhiều lớp**:
  - background nền tổng thể
  - glow / radial light
  - icon/tag chips
  - card thumbnail / illustration
  - text/metadata/code bằng HTML/CSS
- Seed dữ liệu qua CMS để đội nội dung quản trị được.
