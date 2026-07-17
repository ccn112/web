# COMPOSITION & EFFECT GUIDE

## 1. Layer stack

```txt
z-0  background WebP
z-1  dark/readability overlay
z-2  semantic node layer
z-3  ambient platform/glow
z-4  hero HTML content
z-5  header
```

## 2. Safe zone

Hero hiện tại đặt headline ở giữa. Phải giữ:
- 42–48% chiều rộng trung tâm tương đối sạch;
- semantic visual nằm ở hai bên và nửa dưới;
- không để điểm sáng lớn sau headline;
- nền dưới CTA tối hơn nhẹ để button nổi rõ.

## 3. Trang chủ bất động sản

Desktop:
```txt
Marketing node        AI node
Khách hàng             Dữ liệu
Phân tích               Vận hành

          Headline
          Subtitle
          CTA
       Platform glow
```

Nodes chỉ là phụ trợ:
- opacity 0.42–0.65;
- icon stroke 1.5–1.8;
- không có label dài;
- không bắt buộc click.

## 4. Overlay

Không dùng một lớp đen phủ đều. Dùng:
- gradient dọc;
- vignette hai mép;
- radial safe zone phía sau text;
- bottom shadow nhẹ.

## 5. Motion

### Background
- initial scale `1.035`
- animate `1`
- duration `1.2s`

### Nodes
- opacity `0 → 0.58`
- translateY `10 → 0`
- stagger `60–90ms`

### Platform glow
- pulse 4–6 giây
- scale tối đa 1.03
- opacity biến thiên rất nhỏ

### Parallax
- desktop only
- tối đa 10px
- tắt dưới 1024px

## 6. Header

Header có thể:
- transparent trên hero;
- blur nhẹ khi scroll;
- không thêm nền trắng ở first fold;
- logo trắng dùng đúng file gốc;
- CTA header nền trắng giữ như hiện tại.

## 7. Section transition

Cuối hero nên chuyển mượt sang section sáng:
- bottom gradient navy → #F7FAFF;
- không cắt ngang đột ngột;
- có thể dùng `::after` cao 80–120px.
