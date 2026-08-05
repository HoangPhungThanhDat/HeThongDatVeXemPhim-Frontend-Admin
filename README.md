<div align="center">

#  Gấu Phim Admin
### Bảng Điều Khiển Quản Trị Hệ Thống Rạp Chiếu Phim

<img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
<img src="https://img.shields.io/badge/Chakra_UI-2.6.1-319795?style=for-the-badge&logo=chakraui&logoColor=white" alt="Chakra UI"/>
<img src="https://img.shields.io/badge/React_Router-6.25-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router"/>
<img src="https://img.shields.io/badge/Axios-1.17-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>

**Giao diện quản trị (Back-office) cho nền tảng đặt vé xem phim Gấu Phim — xây dựng trên nền Horizon UI (Chakra UI), tuỳ biến toàn diện theo nghiệp vụ rạp chiếu phim**

[✨ Tính năng](#-tính-năng) • [🚀 Bắt đầu nhanh](#-bắt-đầu-nhanh) • [📁 Cấu trúc dự án](#-cấu-trúc-dự-án) • [🔗 Kết nối Backend](#-kết-nối-backend) • [🚢 Triển khai](#-triển-khai)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#️-công-nghệ-sử-dụng)
- [Bắt Đầu Nhanh](#-bắt-đầu-nhanh)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Kết Nối Backend](#-kết-nối-backend)
- [Quy Ước & Design Tokens](#-quy-ước--design-tokens)
- [Testing](#-testing)
- [Triển Khai](#-triển-khai)
- [Đóng Góp](#-đóng-góp)
- [Liên Hệ](#-liên-hệ)

---

## 🌟 Giới Thiệu

**Gấu Phim Admin** là giao diện Back-office phục vụ **Quản trị viên (Admin)** và **Nhân viên rạp (Staff)** quản lý toàn bộ nghiệp vụ của hệ thống đặt vé xem phim Gấu Phim: phim & suất chiếu, phòng chiếu & sơ đồ ghế, đơn hàng & vé, khuyến mãi, người dùng, phân quyền và báo cáo thống kê.

Dự án được khởi tạo từ template **Horizon UI (Chakra UI)** và được tuỳ biến sâu: mỗi module nghiệp vụ (`quanlyphim`, `quanlyghe`, `quanlydonhang`...) là một feature module độc lập, gồm `components/`, `hooks/`, `variables/` và `constants.js` riêng — giúp dễ bảo trì khi hệ thống mở rộng thêm module.

---

## ✨ Tính Năng

<details open>
<summary><b>🎥 Quản Lý Nội Dung</b></summary>

- Quản lý phim, thể loại, diễn viên, nhà phát hành (`quanlyphim`, `quanlytheloai`, `quanlydienvien`, `quanlynhaphathanh`)
- Quản lý banner trang chủ với kéo-thả sắp xếp thứ tự (`quanlybanner` + `useDragSort`)
- Quản lý tin tức điện ảnh (`quanlytintuc`)
- Quản lý combo đồ ăn/thức uống (`quanlycombo`)

</details>

<details>
<summary><b>🏢 Quản Lý Rạp, Phòng & Ghế</b></summary>

- Quản lý chuỗi rạp chiếu (`quanlyrapchieu`)
- Quản lý phòng chiếu với xem trước sơ đồ ghế (`quanlyphongchieu`, `SeatMapPreview`)
- Thiết kế/chỉnh sửa sơ đồ ghế theo hàng-cột, chọn loại ghế (`quanlyghe`)
- Theo dõi & cập nhật trạng thái ghế theo từng suất chiếu, có drawer chi tiết ghế (`quanlytrangthaighe`)

</details>

<details>
<summary><b>🗓️ Suất Chiếu & Lịch Chiếu</b></summary>

- Quản lý suất chiếu, chỉnh giá hàng loạt, phát hiện xung đột lịch (`quanlysuatchieu`)
- Lịch chiếu định kỳ theo tuần, nhân bản lịch tuần (`quanlylichchieudinhky`, `CloneWeekModal`)

</details>

<details>
<summary><b>🎟️ Vé & Đơn Hàng</b></summary>

- Tạo vé thủ công với sơ đồ ghế trực quan (`TaoVeMoi.jsx`)
- Xem chi tiết vé, hiển thị mã QR (`TicketDetail.jsx`, `QRModal.jsx`)
- Quản lý đơn hàng: lọc, xem chi tiết, xử lý hoàn tiền, xuất Excel (`quanlydonhang`, `RefundModal.jsx`, `exportExcel.js`)
- Xem trạng thái vé/đơn trên di động (`MobileTicketList.jsx`)

</details>

<details>
<summary><b>👥 Người Dùng, Hội Viên & Phân Quyền</b></summary>

- Quản lý người dùng: tạo, sửa, xoá, gửi thông báo (`quanlynguoidung`)
- Quản lý hội viên & điểm tích luỹ (`quanlyhoivien`)
- Phân quyền theo vai trò với ma trận quyền chi tiết (`quanlyphanquyen`)
- Hỗ trợ khách hàng: xử lý liên hệ, theo dõi tiến trình xử lý (`hotrokhachhang`)

</details>

<details>
<summary><b>🎁 Khuyến Mãi & Voucher</b></summary>

- Tạo/quản lý mã giảm giá, voucher (`quanlyvoucher`)
- Chương trình khuyến mãi theo loại, có bộ lọc nâng cao (`quanlykhuyenmai`)
- Quản lý danh sách yêu thích của khách hàng (`quanlydanhsachyeuthich`)

</details>

<details>
<summary><b>📊 Báo Cáo & Thống Kê</b></summary>

- Dashboard tổng quan: doanh thu tuần, biểu đồ tròn, bảng dữ liệu phức hợp (`views/admin/default`)
- Thống kê doanh số & combo bán chạy (`thongke`, `thongkecombo`)
- Quản lý đánh giá khách hàng với cập nhật gần thời gian thực bằng polling (`quanlydanhgia`) — Socket.IO của hệ thống hiện được dùng ở frontend người dùng, chưa tích hợp vào Admin
- Nhật ký hoạt động hệ thống (`LogHeThong`)

</details>

<details>
<summary><b>⚙️ Khác</b></summary>

- Quản lý menu điều hướng (`quanlymenu`), thông báo hệ thống (`quanlythongbao`), thanh toán (`quanlythanhtoan`)
- Trang cá nhân người quản trị (`profile`)
- Hỗ trợ giao diện RTL (`rtlProvider`, `stylis-plugin-rtl`)

</details>

---

## 🛠️ Công Nghệ Sử Dụng

### Core Stack (theo `package.json`)

<table>
<tr>
<td align="center" width="20%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="48" height="48" alt="React"/>
<br><b>React 18.2</b>
<br><sub>UI Library</sub>
</td>
<td align="center" width="20%">
<img src="https://avatars.githubusercontent.com/u/4060187?s=200&v=4" width="48" height="48" alt="Chakra UI"/>
<br><b>Chakra UI 2.6.1</b>
<br><sub>UI Framework</sub>
</td>
<td align="center" width="20%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/reactrouter/reactrouter-original.svg" width="48" height="48" alt="React Router"/>
<br><b>React Router 6</b>
<br><sub>Routing</sub>
</td>
<td align="center" width="20%">
<img src="https://axios-http.com/assets/logo.svg" width="48" height="48" alt="Axios"/>
<br><b>Axios</b>
<br><sub>HTTP Client</sub>
</td>
<td align="center" width="20%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/framermotion/framermotion-original.svg" width="48" height="48" alt="Framer Motion"/>
<br><b>Framer Motion</b>
<br><sub>Animation</sub>
</td>
</tr>
</table>

### Thư Viện Chính

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| `@chakra-ui/react` | 2.6.1 | Bộ UI component chính, hỗ trợ `useColorMode`/`useColorModeValue` cho dark mode |
| `react-router-dom` | ^6.25 | Điều hướng & bảo vệ route (`PrivateRoute.js`) |
| `axios` | ^1.17 | Gọi API, có instance riêng `AxiosAdmin.js` |
| `jwt-decode` | ^4.0 | Giải mã JWT phía client (kiểm tra hạn token, lấy thông tin user) |
| `framer-motion` | ^11.3 | Animation cho modal, card, sidebar |
| `apexcharts` / `react-apexcharts` | 3.50 / 1.4 | Biểu đồ dashboard (doanh thu, traffic) |
| `recharts` | ^3.6 | Biểu đồ bổ sung cho các trang thống kê |
| `@tanstack/react-table` | ^8.19 | Bảng dữ liệu (sort, filter, pagination phía client) |
| `sweetalert2` | ^11.26 | Hộp thoại xác nhận, thông báo toast |
| `qrcode.react` | ^4.2 | Sinh mã QR cho vé điện tử |
| `react-dropzone` | ^14.2 | Kéo-thả tải ảnh (poster phim, banner, avatar) |
| `react-calendar` | ^5.0 | Lịch mini trên dashboard |
| `react-custom-scrollbars-2` | ^4.5 | Thanh cuộn tuỳ chỉnh |
| `lucide-react` / `react-icons` | mới nhất | Bộ icon |
| `stylis` + `stylis-plugin-rtl` | ^4.3 / ^2.0 | Hỗ trợ giao diện RTL cho Chakra |

> Dự án dùng **Create React App** (`react-scripts` 5) làm build tool, không phải Vite.

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu

| Yêu cầu | Phiên bản |
|---|---|
| Node.js | >= 18.x (khuyến nghị LTS) |
| npm | >= 8.x |
| RAM | >= 4GB |

### Cài Đặt

```bash
# 1. Clone repository
git clone <repo-url>
cd "Frontend(Back-office-Admin)"

# 2. Cài đặt dependencies
npm install
# preinstall sẽ tự chạy npm-force-resolutions để khoá phiên bản react-error-overlay

# 3. Thiết lập biến môi trường
cp .env.example .env
# Cập nhật REACT_APP_API_URL trỏ về backend Laravel (xem mục Kết Nối Backend)

# 4. Khởi động development server
npm start
```

Mặc định ứng dụng chạy tại `http://localhost:3000`. Đăng nhập bằng tài khoản Admin/Staff đã được seed ở phía backend (Laravel).

---

## 📁 Cấu Trúc Dự Án

```
src/
├── api/                     # Lớp gọi API — mỗi module 1 file (25 file)
│   ├── AxiosAdmin.js        # Instance axios dùng chung: gắn JWT, tự clear + redirect khi 401
│   ├── AuthApi.js
│   ├── MovieApi.js
│   ├── RoomManagementApi.js
│   ├── SeatManagementApi.js
│   ├── TicketManagementApi.js
│   └── ...                  # Banner, Cinemas, Order, Promotion, Role, Schedule, Showtime, User...
│
├── components/              # Component dùng chung toàn app
│   ├── sidebar/, navbar/, footer/
│   ├── card/, charts/, fields/
│   └── PrivateRoute.js      # Bảo vệ route theo trạng thái đăng nhập/vai trò
│
├── contexts/
│   └── SidebarContext.js    # State sidebar (thu/mở rộng)
│
├── hooks/
│   └── useServerPagination.js
│
├── layouts/
│   ├── admin/                # Layout khu vực quản trị
│   └── auth/                 # Layout đăng nhập
│
├── theme/                    # Cấu hình theme Chakra UI (màu sắc, component style override)
│
└── views/admin/               # 30 module nghiệp vụ, mỗi module theo cấu trúc:
    ├── quanlyphim/
    │   ├── components/        # UI con: Card, Detail, Form, List, Row, FilterDrawer...
    │   │   └── shared/         # Badge, StatCard, SectionTitle, animations dùng riêng cho module
    │   ├── hooks/              # Hook nghiệp vụ (usePhim.js, useOrders.js...)
    │   ├── variables/          # Cấu hình cột bảng, dữ liệu mẫu
    │   ├── constants.js        # Hằng số, tuỳ chọn dropdown, giá trị mặc định
    │   └── index.jsx           # Điểm vào của trang
    ├── quanlyghe/
    ├── quanlytrangthaighe/    # Realtime trạng thái ghế theo suất chiếu
    ├── quanlyve/              # TaoVeMoi, TicketDetail, QRModal
    ├── quanlydonhang/         # RefundModal, exportExcel
    ├── quanlyphanquyen/
    ├── ... (27 module khác)
    └── default/                # Dashboard tổng quan
```

Toàn bộ module nghiệp vụ: `quanlybanner`, `quanlycombo`, `quanlydanhgia`, `quanlydanhsachyeuthich`, `quanlydatve`, `quanlydienvien`, `quanlydonhang`, `quanlyghe`, `quanlyhoivien`, `quanlykhuyenmai`, `quanlylichchieudinhky`, `quanlymenu`, `quanlynguoidung`, `quanlynhaphathanh`, `quanlyphanquyen`, `quanlyphim`, `quanlyphongchieu`, `quanlyrapchieu`, `quanlysuatchieu`, `quanlythanhtoan`, `quanlytheloai`, `quanlythongbao`, `quanlytintuc`, `quanlytrangthaighe`, `quanlyve`, `quanlyvoucher`, `thongke`, `thongkecombo`, `hotrokhachhang`, `LogHeThong`.

---

## 🔗 Kết Nối Backend

Admin panel này gọi API từ backend **Laravel 12** (`laravel-movie-booking`) qua instance `axios` cấu hình sẵn trong `src/api/AxiosAdmin.js`.

### Biến Môi Trường

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Cơ Chế Xác Thực

- Token JWT được lưu tại `localStorage` sau khi đăng nhập (`AuthApi.js`)
- `AxiosAdmin.js` tự động gắn header `Authorization: Bearer <token>` cho mọi request
- Khi API trả về `401`, instance tự động xoá token và điều hướng người dùng về trang đăng nhập
- `jwt-decode` được dùng để đọc thông tin/hạn token phía client mà không cần gọi thêm API

### Cập Nhật Thời Gian Thực

Backend đã hỗ trợ Socket.IO/Pusher cho realtime (đang được tích hợp ở **frontend người dùng**). Ở **Admin panel này**, các trang cần dữ liệu "sống" (ví dụ `quanlydanhgia`, `quanlytrangthaighe`) hiện đang cập nhật tạm thời qua **polling** (gọi lại API theo chu kỳ) — chưa kết nối WebSocket phía client. Việc tích hợp Socket.IO cho Admin đang nằm trong kế hoạch tiếp theo.

---

## 🎨 Quy Ước & Design Tokens

- **Theming**: dùng `useColorMode` / `useColorModeValue` của Chakra UI cho mọi light/dark mode — không dùng state `isDark` cục bộ hay nút toggle tự viết.
- **Dark mode**: dùng bảng màu navy: `#111c44`, `#0b1437`, `#1B254B`, `#2D3A6B` (không dùng gray trung tính).
- **Accent color**: cam `#f97316` / `#fb923c`, kết hợp navy `#0b1437` / `#111c44` cho các trang đã redesign (Login, TicketDetail, QRModal, TaoVeMoi...).
- **Kiến trúc module**: mỗi trang lớn tách `components/shared/` (badge, stat card, animation dùng chung trong module), `variables/` (cấu hình bảng, data mẫu) và `constants.js` (option, giá trị mặc định).
- **Export dữ liệu**: các chức năng xuất CSV/Excel dùng UTF-8 BOM để hiển thị đúng tiếng Việt trên Excel.

---

## 🧪 Testing

```bash
# Chạy toàn bộ test (Create React App / Jest)
npm test

# Chạy ở chế độ watch (mặc định của react-scripts test)
npm test -- --watch
```

Bộ công cụ test: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.

---

## 🚢 Triển Khai

### Build Production

```bash
npm run build
```

### Deploy Lên GitHub Pages (đã cấu hình sẵn trong `package.json`)

```bash
npm run deploy
# Chạy predeploy (npm run build) rồi publish thư mục build/ lên nhánh gh-pages qua gh-pages CLI
```

### Deploy Lên Vercel / Netlify

```bash
# Vercel
npm i -g vercel
vercel --prod

# Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Deploy Lên VPS / Apache (SPA fallback)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

> Nhớ cập nhật `REACT_APP_API_URL` trỏ đúng domain backend production trước khi build.

---

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch cho tính năng (`git checkout -b feature/ten-tinh-nang`)
3. Commit thay đổi (`git commit -m 'feat: thêm tính năng abc'`)
4. Push lên branch (`git push origin feature/ten-tinh-nang`)
5. Mở Pull Request

### Tiêu Chuẩn Code

- Theo cấu trúc module đã có: `components/` (kèm `shared/` nếu cần), `hooks/`, `variables/`, `constants.js`, `index.jsx`
- Dark mode luôn dùng `useColorModeValue`, theo bảng màu navy đã thống nhất
- Format theo `prettier.config.js` có sẵn trong repo
- Commit message rõ ràng theo dạng `feat:`, `fix:`, `refactor:`...

---

## 📞 Liên Hệ

<div align="center">

### Hoàng Đạt

[![GitHub](https://img.shields.io/badge/GitHub-HoangPhungThanhDat-181717?style=for-the-badge&logo=github)](https://github.com/HoangPhungThanhDat)
[![Email](https://img.shields.io/badge/Email-hoangdat.engineer@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hoangdat.engineer@gmail.com)

</div>

---

## 📄 Giấy Phép

Dự án được phân phối theo giấy phép nêu trong file [LICENSE](./LICENSE).

---

<div align="center">

**Nếu dự án hữu ích, đừng quên cho một ⭐!**

Made with ❤️ by **Gấu Phim Team**

</div>