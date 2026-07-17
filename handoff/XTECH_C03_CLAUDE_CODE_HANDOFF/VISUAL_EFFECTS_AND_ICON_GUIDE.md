# VISUAL EFFECTS & ICON GUIDE

## Mục tiêu

Giữ được cảm giác “đẹp công nghệ” của ảnh gốc khi code thật.

Nếu chỉ có text + card + icon line thì sẽ bị mất linh hồn của bộ thiết kế. Bộ C03 bắt buộc phải giữ được:
- icon hình khối / mini-illustration;
- pedestal phát sáng;
- luồng sáng / connector;
- halo / aura;
- chiều sâu thị giác.

## 1. Visual language

### Tông màu
- Nền sáng: trắng / very light blue / light gray-blue.
- Accent chính: blue → cyan.
- Accent phụ: blue → violet rất nhẹ ở một số chip/glow.
- Text: navy/ink cho heading, gray trung tính cho body.

### Chất liệu
- card trắng bo góc lớn;
- viền rất mảnh;
- shadow mềm nhiều lớp;
- glow trong trẻo, không neon gắt;
- illustration pseudo-3D hoặc isometric nhẹ.

## 2. Pedestal / glow base

Mỗi icon chính hoặc node chính nên có đế như sau:
- vòng tròn/oval nền;
- 2–3 vòng đồng tâm;
- inner highlight;
- outer blur cyan;
- shadow hướng xuống;
- có thể có ring xoay hoặc pulse rất nhẹ.

### Gợi ý CSS layer
- `::before`: radial gradient inner glow
- `::after`: blurred outer glow
- SVG ring riêng nằm trên cùng

## 3. Light flow / connector

### Bắt buộc
- không dùng line xám phẳng;
- phải có gradient xanh/cyan;
- ít nhất 1 lớp glow blur dưới đường line;
- có điểm node tròn ở đầu / cuối.

### Thể hiện
- connector SVG path + stroke gradient;
- duplicate path blur nhẹ phía sau;
- animation draw hoặc pulse chạy theo path ở mức rất tiết chế.

## 4. Product capsules / icon blocks

Các product node nên có:
- icon hoặc illustration trung tâm;
- nền card/capsule sáng;
- border nhạt;
- shadow mềm;
- glow nhẹ ở chân;
- title + subtitle HTML.

Không được chỉ dùng icon line + title.

## 5. Ambient background

Nền section không nên trống trắng hoàn toàn.
Cần có 1–3 lớp sau tùy section:
- radial gradient glow;
- subtle grid / dots / blueprint lines;
- wave / floor perspective glow;
- blur blob rất nhẹ.

Opacity phải vừa đủ để tăng chiều sâu nhưng không làm giảm khả năng đọc text.

## 6. Motion guideline

### Cho illustration chính
- fade-up + scale từ 0.97 → 1
- glow pulse chậm 4–6s

### Cho connector
- draw-on-enter hoặc subtle path pulse

### Cho capsule/card
- stagger reveal
- hover: translateY(-4px), shadow tăng nhẹ, glow mạnh hơn 5–10%

### Cho chip / pillar
- hover: border sáng hơn, background tint nhẹ

## 7. Khi buộc phải tái tạo icon

Nếu asset tách không sạch:
- dựng lại bằng SVG shape + radial gradient + simple isometric faces;
- vẫn phải giữ ngôn ngữ hình khối, không thay bằng icon line thuần.

## 8. Những lỗi phải tránh

- bỏ hết pedestal;
- bỏ các luồng sáng;
- shadow quá nặng, đục;
- glow quá mạnh gây mờ chữ;
- icon không đồng bộ phong cách;
- section quá phẳng, trắng bệch;
- motion quá nhiều, loạn.
