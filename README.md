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

Dự án được khởi tạo từ template **Horizon UI (Chakra UI)** và được tuỳ biến sâu theo hướng **tổ chức theo nhóm nghiệp vụ (domain)**: các module trong `views/admin/` được gom vào 7 nhóm `booking`, `catalog`, `cinema`, `marketing`, `report`, `user`, `system`; lớp gọi API trong `api/` cũng chia theo đúng các nhóm tương ứng. Mỗi module là một feature độc lập, gồm `components/`, `hooks/`, `constants.js` và `index.jsx` riêng — giúp dễ bảo trì khi hệ thống mở rộng thêm module.

---

## ✨ Tính Năng

<details open>
<summary><b>🎥 Quản Lý Nội Dung (<code>catalog</code>, <code>marketing</code>)</b></summary>

- Quản lý phim, thể loại, diễn viên, nhà phát hành (`quanlyphim`, `quanlytheloai`, `quanlydienvien`, `quanlynhaphathanh`)
- Quản lý banner trang chủ với kéo-thả sắp xếp thứ tự (`quanlybanner` + `useDragSort`)
- Quản lý tin tức điện ảnh (`quanlytintuc`)
- Quản lý combo đồ ăn/thức uống (`quanlycombo`)

</details>

<details>
<summary><b>🏢 Quản Lý Rạp, Phòng & Ghế (<code>cinema</code>)</b></summary>

- Quản lý chuỗi rạp chiếu (`quanlyrapchieu`)
- Quản lý phòng chiếu với xem trước sơ đồ ghế (`quanlyphongchieu`, `SeatMapPreview`)
- Thiết kế/chỉnh sửa sơ đồ ghế theo hàng-cột, chọn loại ghế (`quanlyghe`: `AddRowModal`, `AddColumnModal`, `EditSeatModal`, `SeatMapView`)
- Theo dõi & cập nhật trạng thái ghế theo từng suất chiếu, có drawer chi tiết ghế và reset ghế (`quanlytrangthaighe`)

</details>

<details>
<summary><b>🗓️ Suất Chiếu & Lịch Chiếu (<code>cinema</code>)</b></summary>

- Quản lý suất chiếu, chỉnh giá hàng loạt, nhân bản lịch tuần (`quanlysuatchieu`: `BulkEditPriceModal`, `CloneWeekModal`)
- Lịch chiếu định kỳ theo tuần với giao diện `WeekView`, chỉnh giá hàng loạt, nhân bản tuần (`quanlylichchieudinhky`)

</details>

<details>
<summary><b>🎟️ Vé & Đơn Hàng (<code>booking</code>)</b></summary>

- Tạo vé thủ công với sơ đồ ghế trực quan, chỉnh sửa vé (`quanlyve`: `TaoVeMoi`, `TicketEdit`, `TicketDetail`)
- Hiển thị mã QR của vé (`QRModal`)
- Quản lý đặt vé/đơn hàng: lọc, xem chi tiết, xử lý hoàn tiền, xuất Excel (`quanlydatve`, `quanlydonhang`, `RefundModal`, `exportExcel.js`)
- Xem danh sách vé trên di động (`MobileTicketList`)
- Quản lý thanh toán (`quanlythanhtoan`)

</details>

<details>
<summary><b>👥 Người Dùng, Hội Viên & Phân Quyền (<code>user</code>)</b></summary>

- Quản lý người dùng: tạo, sửa, xoá, gửi thông báo (`quanlynguoidung`)
- Quản lý hội viên & điểm tích luỹ (`quanlyhoivien`)
- Phân quyền theo vai trò, gán vai trò cho người dùng (`quanlyphanquyen`: `RoleForm`, `AssignRoleModal`)
- Hỗ trợ khách hàng: xử lý liên hệ, theo dõi tiến trình xử lý (`hotrokhachhang`: `ContactProcess`)
- Quản lý đánh giá khách hàng và danh sách yêu thích (`quanlydanhgia`, `quanlydanhsachyeuthich`)

</details>

<details>
<summary><b>🎁 Khuyến Mãi & Voucher (<code>marketing</code>)</b></summary>

- Tạo/quản lý mã giảm giá, voucher (`quanlyvoucher`)
- Chương trình khuyến mãi theo loại, có bộ lọc nâng cao (`quanlykhuyenmai`)
- Quản lý thông báo hệ thống (`quanlythongbao`)

</details>

<details>
<summary><b>📊 Báo Cáo & Thống Kê (<code>report</code>, <code>home</code>)</b></summary>

- Dashboard tổng quan: doanh thu, biểu đồ, bảng dữ liệu (`views/admin/home`)
- Thống kê doanh số & combo bán chạy (`thongke`, `thongkecombo`)
- Nhật ký hoạt động hệ thống (`nhatkyhethong`)
- Cập nhật gần thời gian thực bằng polling ở các trang cần dữ liệu "sống" (ví dụ `quanlydanhgia`, `quanlytrangthaighe`) — Socket.IO của hệ thống hiện được dùng ở frontend người dùng, chưa tích hợp vào Admin

</details>

<details>
<summary><b>⚙️ Hệ Thống & Khác (<code>system</code>)</b></summary>

- Trang cá nhân người quản trị (`profile`)
- Đăng nhập Admin/Staff với phiên làm việc qua **HttpOnly Cookie** và tự động làm mới token (`useTokenRefresh`)
- Dark/Light mode theo Chakra UI (`useColorMode`)

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
| `axios` | ^1.17 | Gọi API, instance riêng `api/client/AxiosAdmin.js` (bật `withCredentials` để gửi cookie) |
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

> Dự án dùng **Create React App** (`react-scripts` 5) làm build tool, không phải Vite.

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu

| Yêu cầu | Phiên bản |
|---|---|
| Node.js | >= 18.x (khuyến nghị LTS) |
| npm | >= 8.x |
| RAM | >= 4GB |
| Backend | Laravel API (`laravel-movie-booking`) đang chạy, đã cho phép origin của Admin trong CORS |

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

> ⚠️ Vì token nằm trong cookie, backend phải khai báo `http://localhost:3000` trong `allowed_origins` (ví dụ biến `ADMIN_FRONTEND_URL`) và bật `supports_credentials`. Nếu không, đăng nhập sẽ thành công nhưng các request sau đó bị `401`.

---

## 📁 Cấu Trúc Dự Án

```
public/                       # index.html, favicon, manifest, robots.txt, banner

src/
├── api/                      # Lớp gọi API — chia theo nhóm nghiệp vụ (25 file API + 1 axios instance)
│   ├── client/
│   │   └── AxiosAdmin.js     # Axios instance dùng chung: withCredentials, tự refresh khi 401
│   ├── auth/                 # AuthApi
│   ├── booking/              # OrderApi, OrderDetailApi, ScheduleApi, ShowtimeSeatApi, TicketApi, TicketManagementApi
│   ├── catalog/              # DistributorApi, GenreApi, MovieApi, MovieCastApi, NewApi
│   ├── cinema/               # CinemasApi, RoomApi, RoomManagementApi, RoomSeatApi, SeatApi, SeatManagementApi, ShowtimeApi
│   ├── marketing/            # BannerApi, FoodAndDrinkApi, PromotionApi
│   └── user/                 # ContactApi, RoleApi, UserApi
│
├── assets/                   # css (App.css, Login.css) và img
│
├── components/               # Component dùng chung toàn app
│   ├── calendar/, card/, charts/, dataDisplay/, fields/
│   ├── footer/, icons/, navbar/, scroll/, scrollbar/, separator/
│   ├── sidebar/              # Sidebar + components (Brand, Content, Links)
│   └── PrivateRoute.js       # Chặn route khi chưa có phiên đăng nhập hợp lệ
│
├── contexts/
│   └── SidebarContext.js     # State sidebar (thu/mở rộng)
│
├── hooks/
│   ├── useServerPagination.js
│   └── useTokenRefresh.js    # Tự động làm mới Access Token qua Refresh Token (cookie)
│
├── layouts/
│   ├── admin/                # Layout khu vực quản trị
│   ├── auth/                 # Layout đăng nhập
│   └── Loader.jsx
│
├── theme/                    # Theme Chakra UI (additions, components, foundations, styles)
├── utils/
│   └── auth.js               # Tiện ích xác thực dùng chung
├── variables/
│   └── charts.js             # Cấu hình biểu đồ
├── constants/, services/     # Dành cho hằng số/service dùng chung (hiện còn trống)
│
├── views/
│   ├── auth/signIn/          # Trang đăng nhập
│   └── admin/                # Module nghiệp vụ, chia theo nhóm
│       ├── booking/          # quanlydatve · quanlydonhang · quanlythanhtoan · quanlyve
│       ├── catalog/          # quanlyphim · quanlytheloai · quanlydienvien · quanlynhaphathanh
│       ├── cinema/           # quanlyrapchieu · quanlyphongchieu · quanlyghe · quanlytrangthaighe
│       │                     # quanlysuatchieu · quanlylichchieudinhky
│       ├── marketing/        # quanlybanner · quanlycombo · quanlykhuyenmai · quanlyvoucher
│       │                     # quanlytintuc · quanlythongbao
│       ├── report/           # thongke · thongkecombo · nhatkyhethong
│       ├── user/             # quanlynguoidung · quanlyphanquyen · quanlyhoivien
│       │                     # quanlydanhgia · quanlydanhsachyeuthich · hotrokhachhang
│       ├── system/           # profile
│       └── home/             # Dashboard tổng quan
│
├── App.js
├── index.js
└── routes.js                 # Khai báo route & menu sidebar
```

### Cấu Trúc Một Module Nghiệp Vụ

Các module đầy đủ (ví dụ `catalog/quanlyphim`) theo mẫu sau:

```
quanlyphim/
├── components/
│   ├── shared/               # Badge, StatCard, SectionTitle, animations dùng riêng cho module
│   ├── PhimCard.jsx · PhimRow.jsx · PhimList.jsx      # Hiển thị dạng lưới / bảng / danh sách
│   ├── PhimDetail.jsx · PhimForm.jsx                  # Chi tiết & biểu mẫu thêm/sửa
│   ├── FilterDrawer.jsx · ConfirmDeleteModal.jsx · TrailerModal.jsx
├── hooks/
│   └── usePhim.js            # Logic nghiệp vụ: gọi API, state, lọc, phân trang
├── constants.js              # Hằng số, tuỳ chọn dropdown, giá trị mặc định
└── index.jsx                 # Điểm vào của trang, ghép nối state và component
```

Một số module có thêm thư mục riêng khi cần: `utils/` (ví dụ `exportExcel.js` ở `quanlydatve`, `quanlydonhang`), `services/` và `utils/` (ở `quanlytrangthaighe`), `components/mini/` (ở `quanlylichchieudinhky`), `variables/` (ở `thongke`).

Các module nhẹ hơn (`quanlythanhtoan`, `quanlyvoucher`, `quanlythongbao`, `nhatkyhethong`, `thongkecombo`, `quanlydanhgia`, `quanlydanhsachyeuthich`, `quanlyhoivien`, `home`) hiện chỉ gồm `components/` và `index.jsx`.

---

## 🔗 Kết Nối Backend

Admin panel này gọi API từ backend **Laravel 12** (`laravel-movie-booking`) qua instance `axios` cấu hình sẵn trong `src/api/client/AxiosAdmin.js`.

### Biến Môi Trường

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Cơ Chế Xác Thực (Access Token + Refresh Token trong HttpOnly Cookie)

Admin **không còn lưu JWT trong `localStorage`**. Sau khi đăng nhập, backend đặt **Access Token** và **Refresh Token** vào **HttpOnly Cookie**; JavaScript phía client không đọc được hai cookie này, nên giảm đáng kể rủi ro bị đánh cắp token qua XSS.

| Thành phần | Vai trò |
|---|---|
| `AxiosAdmin.js` | Bật `withCredentials: true` để trình duyệt tự gửi cookie theo mọi request; không còn gắn header `Authorization` thủ công |
| `useTokenRefresh.js` | Khi Access Token hết hạn, gọi `POST /api/auth/refresh` (dựa vào Refresh Token trong cookie) để cấp lại phiên |
| `PrivateRoute.js` | Chỉ cho vào khu vực quản trị khi phiên đăng nhập còn hợp lệ |
| `utils/auth.js` | Hàm tiện ích liên quan đăng nhập/đăng xuất |

Luồng xử lý:

1. Đăng nhập → backend trả `Set-Cookie` cho `access_token` và `refresh_token` (HttpOnly).
2. Mọi request sau đó tự đính kèm cookie nhờ `withCredentials`.
3. Khi API trả `401` (Access Token hết hạn) → gọi refresh **một lần** → thử lại request ban đầu.
4. Nếu refresh thất bại (Refresh Token hết hạn hoặc đã bị thu hồi) → đưa người dùng về trang đăng nhập.
5. Đăng xuất → gọi `POST /api/auth/logout` để thu hồi Refresh Token và xoá cookie.

Lưu ý khi chạy: backend phải bật CORS với `supports_credentials = true` và liệt kê **origin cụ thể** của Admin (không dùng `*`). Khi Admin và API khác site ở môi trường production, cookie cần `SameSite=None; Secure` và chạy qua HTTPS.

### Cập Nhật Thời Gian Thực

Backend đã hỗ trợ Socket.IO/Pusher cho realtime (đang được tích hợp ở **frontend người dùng**). Ở **Admin panel này**, các trang cần dữ liệu "sống" (ví dụ `quanlydanhgia`, `quanlytrangthaighe`) hiện đang cập nhật tạm thời qua **polling** (gọi lại API theo chu kỳ) — chưa kết nối WebSocket phía client. Việc tích hợp Socket.IO cho Admin đang nằm trong kế hoạch tiếp theo.

---

## 🎨 Quy Ước & Design Tokens

- **Theming**: dùng `useColorMode` / `useColorModeValue` của Chakra UI cho mọi light/dark mode — không dùng state `isDark` cục bộ hay nút toggle tự viết.
- **Dark mode**: dùng bảng màu navy: `#111c44`, `#0b1437`, `#1B254B`, `#2D3A6B` (không dùng gray trung tính).
- **Accent color**: cam `#f97316` / `#fb923c`, kết hợp navy `#0b1437` / `#111c44` cho các trang đã redesign (Login, TicketDetail, QRModal, TaoVeMoi...).
- **Kiến trúc module**: mỗi trang lớn tách `components/shared/` (badge, stat card, animation dùng chung trong module), `hooks/` (logic nghiệp vụ) và `constants.js` (option, giá trị mặc định); `index.jsx` làm điểm vào.
- **Phân nhóm**: module mới đặt vào đúng nhóm nghiệp vụ (`booking`, `catalog`, `cinema`, `marketing`, `report`, `user`, `system`) và file API tương ứng đặt trong thư mục cùng tên ở `src/api/`.
- **Xác thực**: không lưu token vào `localStorage`/`sessionStorage`; mọi request API đi qua `AxiosAdmin.js`.
- **Export dữ liệu**: các chức năng xuất CSV/Excel dùng UTF-8 BOM để hiển thị đúng tiếng Việt trên Excel.

---

## 🧪 Testing

```bash
# Chạy toàn bộ test (Create React App / Jest)
npm test

# Chạy ở chế độ watch (mặc định của react-scripts test)
npm test -- --watch
```

Môi trường test dùng bộ công cụ mặc định của CRA (Jest, React Testing Library). Hiện repo chưa có file test cho các module; nên bắt đầu với các luồng quan trọng như `AxiosAdmin` (refresh khi 401), `PrivateRoute` và các hook nghiệp vụ.

---

## 🚢 Triển Khai

### Build Production

```bash
npm run build
```

> Nhớ cập nhật `REACT_APP_API_URL` trỏ đúng domain backend production trước khi build, đồng thời đảm bảo backend cho phép origin của Admin trong CORS và cookie được cấu hình `Secure` (HTTPS).

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

> 💡 Nên đặt Admin và API cùng site (ví dụ `admin.gauphim.com` và `api.gauphim.com`) để cookie hoạt động ổn định với `SameSite=Lax`, thay vì phải dùng `SameSite=None`.

---

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch cho tính năng (`git checkout -b feature/ten-tinh-nang`)
3. Commit thay đổi (`git commit -m 'feat: thêm tính năng abc'`)
4. Push lên branch (`git push origin feature/ten-tinh-nang`)
5. Mở Pull Request

### Tiêu Chuẩn Code

- Đặt module vào đúng nhóm trong `views/admin/` và theo cấu trúc: `components/` (kèm `shared/` nếu cần), `hooks/`, `constants.js`, `index.jsx`
- Mỗi module có file API riêng trong nhóm tương ứng ở `src/api/`, gọi qua `AxiosAdmin`
- Dark mode luôn dùng `useColorModeValue`, theo bảng màu navy đã thống nhất
- Lint theo `.eslintrc.json`, format theo `prettier.config.js` có sẵn trong repo
- Ghi lại thay đổi quan trọng trong `CHANGELOG.md`
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