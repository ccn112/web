# XTECH — Semantic Background Handoff cho Claude Code

Gói này gồm 9 background có ý nghĩa riêng theo từng route, ảnh WebP tối ưu, ảnh tham chiếu trước/sau và mã mẫu Next.js để Claude Code tích hợp đúng hiệu quả thiết kế.

## Mục tiêu

Không chỉ thay một background tĩnh. Hero phải đạt được ba lớp:

```txt
Background ngữ nghĩa
+ semantic overlay / node công nghệ
+ nội dung HTML thật
```

Ảnh `references/target-hero-composite.png` là mức hiệu quả thị giác cần đạt:
- headline rõ;
- nền có ý nghĩa bất động sản, dữ liệu và AI;
- icon/nodes bổ trợ ở hai bên;
- trung tâm đủ sạch;
- CTA nổi bật;
- không lấn át nội dung.

## Cấu trúc

```txt
public/images/backgrounds/semantic/   # 9 WebP production
sources/                              # 9 PNG nguồn
references/
  current-hero-before.png
  target-hero-composite.png
starter/
  semantic-backgrounds.ts
  SemanticHero.tsx
  SemanticHero.module.css
  SemanticNodes.tsx
  HomeHero.example.tsx
MASTER_PROMPT_FOR_CLAUDE.md
ROUTE_BACKGROUND_MAPPING.md
COMPOSITION_AND_EFFECT_GUIDE.md
PERFORMANCE_RESPONSIVE_GUIDE.md
QA_CHECKLIST.md
manifest.json
```

## Route tiếng Việt bắt buộc

```txt
/
/giai-phap
/san-pham
/bo-giai-phap-x
/dich-vu
/trien-khai
/khach-hang
/insights
/ve-x
```

Không tự đổi sang route tiếng Anh.
