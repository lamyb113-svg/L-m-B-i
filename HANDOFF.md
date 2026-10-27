# Bàn giao: Mẫu khung xe custom (Porsche Panamera + Lamborghini Revuelto)

Nhánh: `claude/sweet-volta-mkj52a`. Khổ in: A4 dọc 210×297 mm, xuất PNG 300 dpi (2481×3509 px).

## 1. Lấy về máy

```bash
git clone https://github.com/lamyb113-svg/L-m-B-i.git
cd L-m-B-i && git checkout claude/sweet-volta-mkj52a
npm i playwright && npx playwright install chromium   # cần Python 3 + Pillow: pip install pillow
```

Khi chạy, script cần mạng để tải font Google (Michroma, Allison, Lexend Zetta, Syncopate, Barlow Condensed).

## 2. Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `canva-porsche/` | Mẫu Panamera nền hồng: `render.js`, logo `porsche-crest.png`, ảnh PNG/PDF đã xuất |
| `canva-lambo/` | Mẫu Revuelto: `render.js` (bản trắng, `THEME=dark` cho bản đen), logo, `photos/` (ảnh khách, không đưa lên git) |
| `canva-lambo/logo-lambo-goc-hd.png` | Logo Lamborghini do bạn gửi, phóng lên 1284×1476 (logo đang dùng trên Canva) |
| `canva-lambo/logo-hd.js` | Logo Lamborghini dựng lại dạng vector (không dùng, để dự phòng) |
| `layers/` | Các lớp đã tách cho cả 3 mẫu: mỗi lớp là một PNG trong suốt, kèm `manifest.json` ghi toạ độ (px trang Canva 794×1123) |
| `layers-lib.js` | Script tách lớp dùng chung |

## 3. Lệnh

```bash
# Panamera: xuất nen-full-<TEN>.png/.pdf, nen-khong-ten, nen-trong
node canva-porsche/render.js "THAI VU"

# Lamborghini trắng / đen: xuất preview-*.png và overlay-*.png (ô ảnh trong suốt)
node canva-lambo/render.js "THANH LONG" "14/02/2026"
THEME=dark node canva-lambo/render.js "MY YUAN" "27/01/1989"

# Tách lớp (mỗi phần tử một PNG + manifest.json)
LAYERS=$PWD/layers/porsche-panamera node canva-porsche/render.js "THAI VU"
LAYERS=$PWD/layers/lambo-trang node canva-lambo/render.js "THANH LONG" "14/02/2026"
THEME=dark LAYERS=$PWD/layers/lambo-den node canva-lambo/render.js "MY YUAN" "27/01/1989"
```

Tự điền ảnh (chỉ khi muốn script ghép sẵn): đặt `xe1..xe5`, `khach1`, `khach2` (jpg/png) vào `canva-lambo/photos/`. Ảnh được cắt kiểu "cover" theo từng ô chéo.

## 4. Thông số thiết kế

**Panamera**
- Màu: nền `#DFA3AD`, chữ Panamera `#B8325A`.
- Vòng tròn trắng mờ 16%.
- PORSCHE: font Michroma màu trắng, 3 dòng với độ đậm 80% / 85% / 30%.
- "anamera": font Allison. Chữ P vẽ tay bằng path.
- Tên: font Lexend Zetta 300, xoay 90°, sát lề phải.
- Logo Porsche ở góc dưới trái.

**Lamborghini**
- Nền `#F3F3F3`. Bản đen: nửa trái `#161616`.
- Đường kẻ dọc ở x = 119 mm.
- Cột ảnh từ x = 123 đến 205 mm, gồm 7 ô có cạnh chéo:
  - xe1, xe2: y 10–46
  - khach1, xe3: y 49–107
  - xe4: y 110–201
  - khach2, xe5: y 204–248
- Chữ REVUELTO: font Michroma, nghiêng 14°.
- Thông số: font Barlow Condensed (V12 6.5L / 1001 HP / >350 KM/H / 2.5 SECONDS).
- Tên: font Syncopate 700, căn phải tại x = 105 mm.
- Ngày: bản trắng chữ viền xám; bản đen trắng + vàng `#C9A75A` (2 số đầu và 2 số cuối màu vàng).
- Đã kiểm tra: các ô trùng khớp với ảnh gốc custom.inhouse sau khi xoay thẳng (lệch dưới khoảng 1 mm).

## 5. Canva (thư mục "Mẫu khung xe custom": https://www.canva.com/folder/FAHZJEQIUyI)

| Thiết kế | Link | Ghi chú |
|---|---|---|
| Panamera – TÁCH LỚP | https://www.canva.com/d/UykuWERsLaLJtqi | 9 lớp ảnh |
| Lambo TRẮNG – TÁCH LỚP | https://www.canva.com/d/rEMM3TsEWdz0zQ9 | Logo mới; **không có lớp tên và ngày** (đã bị xoá trước đó) |
| Lambo ĐEN – TÁCH LỚP | https://www.canva.com/d/RJwmfBSyVGEcBhY | Logo mới, tên MY YUAN + ngày |
| Panamera (chưa tên) | https://www.canva.com/d/ZxpNlNbt-MR9VLy | Tên là chữ Canva sửa được (font mặc định) |
| Lambo trắng / đen (chưa tên) | https://www.canva.com/d/yOYGjZCq5XVPB8V · https://www.canva.com/d/FkcVwNpg7Zle3nz | Lớp phủ + chữ Canva |

**Ghép ảnh vào ô trên Canva:** đặt ảnh đè lên ô, rồi mở Vị trí → Lớp và kéo ảnh xuống ngay trên lớp dưới cùng (dưới lớp "Nen va o anh"). Ảnh sẽ hiện qua ô trống và tự bị cắt theo cạnh chéo. Canva không cho tạo khung ảnh hình tuỳ ý, nên mẫu phải dùng cách lớp nền có ô trống.

**Nên xoá tay trên Canva:**
- Bản lỗi: "Porsche Panamera – khung A4 (THAI VU)", không có "v2".
- Bản cũ: "THAI VU v2".
- Các ảnh lớp phủ cũ không còn dùng.

## 6. Lưu ý

- **Ảnh khách** (`canva-lambo/photos/`) và các file `preview-*` / `overlay-*` có ảnh khách **không đưa lên git**, đã có trong `.gitignore`. Trên GitHub không có ảnh khách.
- **Repo đang công khai:** đã tải lên Canva qua link GitHub raw. Nên chuyển repo sang Private (Settings → Danger Zone → Change visibility).
- **Nhãn hiệu:** logo Porsche và Lamborghini là nhãn hiệu đã đăng ký. Bố cục Lamborghini dựa theo mẫu của shop custom.inhouse, nên đổi chi tiết nếu bán đại trà.
- **Ảnh xe Revuelto có giấy phép mở** trên Wikimedia Commons (CC BY / CC BY-SA, phải ghi tên tác giả):
  - `Lamborghini_Revuelto_DSC_6987.jpg` (Alexander Migl)
  - `Lamborghini_Revuelto_(2024)_(53621960033).jpg`
  - `Lamborghini_Revuelto_IMG01.jpg` (Maxhdtenda)
  - Xem thêm trong danh mục `Category:Lamborghini_Revuelto`.
- **Font khác bản gốc:** font chữ ký Panamera và font REVUELTO là font miễn phí gần giống, không phải font gốc.

## 7. Việc còn mở

- Ghép ảnh xe và ảnh khách vào các ô (bạn tự làm).
- Thêm lại lớp tên và ngày cho bản Lambo trắng nếu cần. Tạo lớp tên mới: chạy lệnh tách lớp với tên khách, rồi lấy file `*-ten-khach.png` và `*-ngay.png`.
- Mẫu gốc có phần xe ở ô giữa tràn ra ngoài khung. Muốn làm giống thì cần ảnh xe đã tách nền, đặt chồng lên trên lớp viền.
