# HOME SECTION SPEC

## H01 Hero
Reference: `H01-hero-he-sinh-thai-cong-nghe-ai.png`
Component: `HomeHero.tsx`
Visual: dark semantic background, nội dung trái, platform core phải.
Không dùng số liệu khách hàng chưa xác thực.

## H02 Trust
Không có ảnh AI bắt buộc. Dùng logo thật + số liệu thật.
Nếu chưa có dữ liệu, giữ placeholder ở môi trường staging; không publish placeholder production.

## H03 Giải pháp theo bài toán
Reference: `H04-giai-phap-theo-bai-toan.png`
Component: `SolutionsSection.tsx`
Desktop: danh sách chọn bên trái, hub-spoke bên phải.
Mobile: accordion; tắt connector phức tạp.

## H04 Hệ sinh thái sản phẩm
Reference: `H02-he-sinh-thai-san-pham.png`
Component: `ProductsSection.tsx`
Desktop có product orbit/sticky; node active theo hover/scroll.
Mobile dùng carousel/list, không thu nhỏ orbit desktop.

## H05 Nền tảng dùng chung
Reference: `H07-nen-tang-dung-chung.png`
Component: `PlatformSection.tsx`
Architecture 5 tầng: Products → AI/Analytics → Workflow/Identity/API → Data → Cloud/Security.
Mobile dùng accordion/stack.

## H06 Bộ giải pháp X
Reference: `H05-bo-giai-phap-x.png`
Component: `SolutionSuitesSection.tsx`
Tabs 5 bộ giải pháp; panel active hiển thị luồng nghiệp vụ và sản phẩm tham gia.
Không dùng 5 card tĩnh làm nội dung cuối.

## H07 Dịch vụ chuyển đổi số
Reference: `H08-dich-vu-chuyen-doi-so.png`
Component: `ServicesSection.tsx`
Timeline 6 bước + 6 năng lực bên dưới.
Desktop: line progress; mobile: timeline dọc.

## H08 Triển khai
Reference: `H06-trien-khai-va-van-hanh.png`
Component: `DeploymentSection.tsx`
Hub trung tâm + SaaS/Private Cloud/On-premise/Hybrid + delivery capabilities.

## H09 Giá trị kinh doanh / Vì sao XTECH
Reference: `H03-gia-tri-kinh-doanh.png`
Component: `BusinessValueSection.tsx`
Không sử dụng % giả. KPI chỉ lấy từ case study được xác thực.

## H10 Khách hàng & Insights
Component: `CustomersInsightsSection.tsx`
CMS-driven, dùng dữ liệu thật.

## H11 Final CTA
Component: `FinalCTA.tsx`

## Footer
Giữ đúng sitemap và route tiếng Việt. Thông tin liên hệ lấy từ Site Settings/CMS.
