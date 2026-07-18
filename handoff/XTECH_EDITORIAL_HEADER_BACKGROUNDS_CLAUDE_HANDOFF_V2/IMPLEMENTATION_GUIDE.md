# Claude Code Implementation Guide

## 1. Cấu trúc section chuẩn
```tsx
<section className="editorialHero">
  <div className="editorialHeroBg" />
  <div className="editorialHeroOverlay" />
  <div className="container editorialHeroInner">
    <div className="editorialHeroContent">...</div>
    <div className="editorialHeroFeatureCard">...</div>
  </div>
</section>
```

## 2. Background layering
- `editorialHeroBg`: dùng background-image từ file PNG.
- `editorialHeroOverlay`: overlay gradient đen/xanh navy để tăng contrast.
- Có thể thêm `radial-gradient()` bổ sung phía phải để đồng bộ với style hiện tại.

## 3. CSS gợi ý
- `min-height`: 620–720px desktop.
- `background-size`: cover.
- `background-position`: center right.
- `border-bottom`: rất nhẹ hoặc chuyển section sang trust-logo strip ngay bên dưới.
- Có thể dùng thêm `mask-image: linear-gradient(to bottom, black 80%, transparent 100%)` nếu cần chuyển mềm xuống section kế tiếp.

### Gợi ý CSS
```css
.editorialHero {
  position: relative;
  overflow: hidden;
  min-height: 680px;
  background: #07111f;
}
.editorialHeroBg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center right;
  opacity: .95;
}
.editorialHeroOverlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(4,10,20,.92) 0%, rgba(4,10,20,.82) 36%, rgba(6,16,30,.60) 60%, rgba(9,35,70,.35) 100%),
    linear-gradient(180deg, rgba(3,8,18,.18) 0%, rgba(3,8,18,.36) 100%);
}
.editorialHeroInner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 48px;
  align-items: center;
  padding: 140px 0 96px;
}
```

## 4. Responsive
- Tablet: grid 1 cột, content trước, feature card sau.
- Mobile: giữ background crop center-right; giảm chiều cao còn ~540px.
- Với trang chi tiết tin, có thể dùng một layout gọn hơn: chỉ text + meta, không cần card lớn bên phải.

## 5. Motion gợi ý
- Background có thể thêm floating glow rất nhẹ bằng pseudo-element.
- Card bài nổi bật bên phải có hover `translateY(-2px)` và `box-shadow` glow cyan nhẹ.
- Không over-animate; ưu tiên tinh tế.
