<div align="center">

# Hệ thống đặt vé rạp chiếu phim
### Gấu Phim Admin - Quản Trị Rạp Chiếu Phim

<img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
<img src="https://img.shields.io/badge/Redux_Toolkit-1.9.5-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
<img src="https://img.shields.io/badge/Ant_Design-5.0-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant Design"/>
<img src="https://img.shields.io/badge/Socket.IO-4.5-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO"/>

**Hệ thống quản trị toàn diện cho rạp chiếu phim hiện đại**

[✨ Tính năng](#-tính-năng-nổi-bật) • [🚀 Bắt đầu](#-bắt-đầu-nhanh) • [📖 Tài liệu](#-tài-liệu) • [🤝 Đóng góp](#-đóng-góp)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

</div>

## 📋 Mục Lục

- [🌟 Giới thiệu](#-giới-thiệu)
- [✨ Tính năng nổi bật](#-tính-năng-nổi-bật)
- [🏗️ Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [🚀 Bắt đầu nhanh](#-bắt-đầu-nhanh)
- [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🔧 Cấu hình nâng cao](#-cấu-hình-nâng-cao)
- [📖 Tài liệu](#-tài-liệu)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤝 Đóng góp](#-đóng-góp)
- [📞 Liên hệ](#-liên-hệ)

---

## 🌟 Giới Thiệu

**Gấu Phim Admin** là giao diện quản trị hiện đại cho hệ thống đặt vé xem phim trực tuyến. Được thiết kế với trải nghiệm người dùng tối ưu, hệ thống cung cấp đầy đủ công cụ quản lý nghiệp vụ rạp chiếu phim một cách chuyên nghiệp và hiệu quả.

### 🎯 Điểm Nổi Bật

<table>
<tr>
<td width="50%">

#### 💪 Mạnh Mẽ
- Xử lý hàng nghìn giao dịch đồng thời
- Real-time updates với Socket.IO
- Tối ưu hiệu năng cao

</td>
<td width="50%">

#### 🎨 Hiện Đại
- UI/UX thân thiện, trực quan
- Responsive trên mọi thiết bị
- Dark mode support

</td>
</tr>
<tr>
<td width="50%">

#### 🔒 Bảo Mật
- JWT Authentication
- Role-based Access Control
- API Security Best Practices

</td>
<td width="50%">

#### 📊 Thông Minh
- Dashboard analytics chi tiết
- Reports & Export đa dạng
- AI-powered insights (planned)

</td>
</tr>
</table>

---

## ✨ Tính Năng Nổi Bật

<details open>
<summary><b>🎥 Quản Lý Phim</b></summary>

- ✅ CRUD đầy đủ cho phim (Create, Read, Update, Delete)
- ✅ Upload & quản lý media (poster, trailer, gallery)
- ✅ Quản lý metadata (thể loại, tag, rating, cast, crew)
- ✅ Lập lịch chiếu tự động & thủ công
- ✅ Import/Export danh sách phim (Excel, CSV)

</details>

<details>
<summary><b>🏢 Quản Lý Rạp & Phòng Chiếu</b></summary>

- ✅ Quản lý chuỗi rạp đa chi nhánh
- ✅ Cấu hình phòng chiếu với sơ đồ ghế tùy chỉnh
- ✅ Phân loại ghế (Standard, VIP, Couple, Deluxe)
- ✅ Định giá linh hoạt theo loại ghế & khung giờ
- ✅ Bảo trì và lên lịch phòng

</details>

<details>
<summary><b>🎟️ Quản Lý Đặt Vé</b></summary>

- ✅ Xem real-time trạng thái đặt vé
- ✅ Chi tiết booking & lịch sử giao dịch
- ✅ Xử lý hoàn tiền & hủy vé
- ✅ Thống kê tình trạng ghế theo suất
- ✅ WebSocket live updates

</details>

<details>
<summary><b>👥 Quản Lý Người Dùng</b></summary>

- ✅ Quản lý khách hàng & thành viên
- ✅ Hệ thống phân quyền chi tiết (Admin/Manager/Staff)
- ✅ Chương trình membership & điểm tích lũy
- ✅ Lịch sử hoạt động & hành vi người dùng
- ✅ Customer segmentation

</details>

<details>
<summary><b>💳 Thanh Toán & Doanh Thu</b></summary>

- ✅ Dashboard doanh thu real-time
- ✅ Tích hợp đa cổng thanh toán (VNPay, MoMo, ZaloPay)
- ✅ Báo cáo chi tiết theo ngày/tuần/tháng/năm
- ✅ Export Excel, PDF với charts
- ✅ Phân tích xu hướng doanh thu

</details>

<details>
<summary><b>📊 Báo Cáo & Analytics</b></summary>

- ✅ Dashboard tổng quan với real-time data
- ✅ Biểu đồ đa dạng (Line, Bar, Pie, Donut)
- ✅ Top phim, rạp, phòng chiếu
- ✅ Phân tích hành vi khách hàng
- ✅ Predictive analytics (coming soon)

</details>

<details>
<summary><b>🎁 Khuyến Mãi & Marketing</b></summary>

- ✅ Tạo & quản lý mã giảm giá, voucher
- ✅ Chương trình khuyến mãi tự động
- ✅ Quản lý banner, slider, popup
- ✅ Tin tức & blog điện ảnh
- ✅ Email marketing campaigns

</details>

<details>
<summary><b>⚙️ Cấu Hình Hệ Thống</b></summary>

- ✅ Settings tổng thể (logo, branding, contact)
- ✅ Email templates customization
- ✅ SEO & metadata management
- ✅ Database backup & restore
- ✅ System logs & monitoring

</details>

---

## 🏗️ Kiến Trúc Hệ Thống

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[User Website<br/>React.js]
        B[Admin Panel<br/>React.js]
        C[Staff Portal<br/>React.js]
    end
    
    subgraph "Backend Layer"
        D[API Gateway<br/>Laravel]
        E[Socket Service<br/>Node.js + Socket.IO]
    end
    
    subgraph "Data Layer"
        F[(MySQL<br/>Database)]
        G[(Redis<br/>Cache)]
    end
    
    subgraph "External Services"
        H[Payment Gateway<br/>VNPay, MoMo, ZaloPay]
        I[Email Service<br/>SMTP]
        J[Cloud Storage<br/>AWS S3 / Cloudinary]
    end
    
    A -->|REST API| D
    B -->|REST API| D
    C -->|REST API| D
    
    A -.->|WebSocket| E
    B -.->|WebSocket| E
    C -.->|WebSocket| E
    
    D --> F
    D --> G
    E --> G
    
    D --> H
    D --> I
    D --> J
    
    style B fill:#61DAFB,stroke:#333,stroke-width:3px
    style D fill:#FF2D20,stroke:#333,stroke-width:2px
    style E fill:#010101,stroke:#333,stroke-width:2px
```

### 🔄 Data Flow

```
User Action → Component → Redux Action → API Call → Backend
                ↓                                       ↓
         Update State ← Response ← ← ← ← ← ← ← ← ← ← ← ←
                ↓
         Re-render UI
```

---

## 🛠️ Công Nghệ Sử Dụng

### Core Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="48" height="48" alt="React"/>
<br><b>React 18</b>
<br><sub>UI Library</sub>
</td>
<td align="center" width="20%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" width="48" height="48" alt="Redux"/>
<br><b>Redux Toolkit</b>
<br><sub>State Management</sub>
</td>
<td align="center" width="20%">
<img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" width="48" height="48" alt="Ant Design"/>
<br><b>Ant Design 5</b>
<br><sub>UI Framework</sub>
</td>
<td align="center" width="20%">
<img src="https://axios-http.com/assets/logo.svg" width="48" height="48" alt="Axios"/>
<br><b>Axios</b>
<br><sub>HTTP Client</sub>
</td>
<td align="center" width="20%">
<img src="https://socket.io/images/logo.svg" width="48" height="48" alt="Socket.IO"/>
<br><b>Socket.IO</b>
<br><sub>Real-time</sub>
</td>
</tr>
</table>

### Additional Libraries

| Category | Libraries |
|----------|-----------|
| **Routing** | React Router DOM v6 |
| **Charts** | Chart.js, Recharts |
| **Date/Time** | Day.js, Moment.js |
| **Forms** | Formik, Yup |
| **Icons** | React Icons, Ant Design Icons |
| **Styling** | Styled Components, Sass |
| **Utils** | Lodash, classnames |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting & quality |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **Jest + RTL** | Unit & integration testing |
| **Cypress** | E2E testing (optional) |

---

## 🚀 Bắt Đầu Nhanh

### ⚡ Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 16.x |
| npm / yarn | >= 8.x / >= 1.22.x |
| RAM | >= 4GB |
| OS | Windows 10+, macOS 10.15+, Linux |

### 📥 Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/cinema-admin-panel.git
cd cinema-admin-panel

# 2. Install dependencies
npm install
# hoặc
yarn install

# 3. Setup environment
cp .env.example .env

# 4. Start development server
npm start
# hoặc
yarn start

# 🎉 Open http://localhost:3000
```

### 🔐 Default Login Credentials

```
Admin Account:
Email: admin@cinema.com
Password: Admin@123

Manager Account:
Email: manager@cinema.com
Password: Manager@123

Staff Account:
Email: staff@cinema.com
Password: Staff@123
```

---

## 📁 Cấu Trúc Dự Án

```
├── 📁 public
│   ├── 🖼️ banner12.png
│   ├── 📄 favicon.ico
│   ├── 🌐 index.html
│   ├── ⚙️ manifest.json
│   └── 📄 robots.txt
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 AuthApi.js
│   │   ├── 📄 AxiosAdmin.js
│   │   ├── 📄 BannerApi.js
│   │   ├── 📄 CinemasApi.js
│   │   ├── 📄 ContactApi.js
│   │   ├── 📄 DistributorApi.js
│   │   ├── 📄 FoodAndDrinkApi.js
│   │   ├── 📄 GenreApi.js
│   │   ├── 📄 MovieApi.js
│   │   ├── 📄 MovieCastApi.js
│   │   ├── 📄 NewApi.js
│   │   ├── 📄 OrderApi.js
│   │   ├── 📄 OrderDetailApi.js
│   │   ├── 📄 PromotionApi.js
│   │   ├── 📄 RoleApi.js
│   │   ├── 📄 RoomApi.js
│   │   ├── 📄 ScheduleApi.js
│   │   ├── 📄 SeatApi.js
│   │   ├── 📄 ShowtimeApi.js
│   │   ├── 📄 ShowtimeSeatApi.js
│   │   ├── 📄 TicketApi.js
│   │   └── 📄 UserApi.js
│   ├── 📁 assets
│   │   ├── 📁 css
│   │   │   ├── 🎨 App.css
│   │   │   ├── 🎨 Contact.css
│   │   │   ├── 🎨 Login.css
│   │   │   └── 🎨 MiniCalendar.css
│   │   └── 📁 img
│   │       ├── 📁 auth
│   │       │   ├── 🖼️ auth.png
│   │       │   └── 🖼️ banner.png
│   │       ├── 📁 avatars
│   │       │   ├── 🖼️ avatar1.png
│   │       │   ├── 🖼️ avatar10.png
│   │       │   ├── 🖼️ avatar2.png
│   │       │   ├── 🖼️ avatar3.png
│   │       │   ├── 🖼️ avatar4.png
│   │       │   ├── 🖼️ avatar5.png
│   │       │   ├── 🖼️ avatar6.png
│   │       │   ├── 🖼️ avatar7.png
│   │       │   ├── 🖼️ avatar8.png
│   │       │   ├── 🖼️ avatar9.png
│   │       │   └── 🖼️ avatarSimmmple.png
│   │       ├── 📁 dashboards
│   │       │   ├── 🖼️ Debit.png
│   │       │   ├── 🖼️ balanceImg.png
│   │       │   ├── 🖼️ elipse-light.png
│   │       │   ├── 🖼️ fakeGraph.png
│   │       │   └── 🖼️ usa.png
│   │       ├── 📁 layout
│   │       │   ├── 🖼️ Navbar.png
│   │       │   └── 🖼️ logoWhite.png
│   │       ├── 📁 nfts
│   │       │   ├── 🖼️ Nft1.png
│   │       │   ├── 🖼️ Nft2.png
│   │       │   ├── 🖼️ Nft3.png
│   │       │   ├── 🖼️ Nft4.png
│   │       │   ├── 🖼️ Nft5.png
│   │       │   ├── 🖼️ Nft6.png
│   │       │   └── 🖼️ NftBanner1.png
│   │       ├── 📁 profile
│   │       │   ├── 🖼️ Project1.png
│   │       │   ├── 🖼️ Project2.png
│   │       │   └── 🖼️ Project3.png
│   │       ├── 🖼️ Announcement.png
│   │       ├── 🖼️ AnnouncementWinter.png
│   │       ├── 🖼️ banner12.png
│   │       ├── 🖼️ bannergau21.png
│   │       └── 🖼️ br.png
│   ├── 📁 components
│   │   ├── 📁 calendar
│   │   │   └── 📄 MiniCalendar.js
│   │   ├── 📁 card
│   │   │   ├── 📄 Card.js
│   │   │   ├── 📄 Mastercard.js
│   │   │   ├── 📄 Member.js
│   │   │   ├── 📄 MiniStatistics.js
│   │   │   └── 📄 NFT.js
│   │   ├── 📁 charts
│   │   │   ├── 📄 BarChart.js
│   │   │   ├── 📄 LineAreaChart.js
│   │   │   ├── 📄 LineChart.js
│   │   │   └── 📄 PieChart.js
│   │   ├── 📁 dataDispaly
│   │   │   └── 📄 TimelineRow.js
│   │   ├── 📁 fields
│   │   │   ├── 📄 InputField.js
│   │   │   └── 📄 SwitchField.js
│   │   ├── 📁 fixedPlugin
│   │   │   └── 📄 FixedPlugin.js
│   │   ├── 📁 footer
│   │   │   ├── 📄 FooterAdmin.js
│   │   │   └── 📄 FooterAuth.js
│   │   ├── 📁 icons
│   │   │   ├── 📄 IconBox.js
│   │   │   └── 📄 Icons.js
│   │   ├── 📁 menu
│   │   │   ├── 📄 ItemContent.js
│   │   │   ├── 📄 MainMenu.js
│   │   │   └── 📄 TransparentMenu.js
│   │   ├── 📁 navbar
│   │   │   ├── 📁 searchBar
│   │   │   │   └── 📄 SearchBar.js
│   │   │   ├── 📄 NavbarAdmin.js
│   │   │   ├── 📄 NavbarAuth.js
│   │   │   ├── 📄 NavbarExample.js
│   │   │   ├── 📄 NavbarLinksAdmin.js
│   │   │   └── 📄 NavbarRTL.js
│   │   ├── 📁 rtlProvider
│   │   │   └── 📄 RtlProvider.js
│   │   ├── 📁 scroll
│   │   │   └── 📄 ScrollToTop.js
│   │   ├── 📁 scrollbar
│   │   │   └── 📄 Scrollbar.js
│   │   ├── 📁 separator
│   │   │   └── 📄 Separator.jsx
│   │   ├── 📁 sidebar
│   │   │   ├── 📁 components
│   │   │   │   ├── 📄 Brand.js
│   │   │   │   ├── 📄 Content.js
│   │   │   │   └── 📄 Links.js
│   │   │   └── 📄 Sidebar.js
│   │   └── 📄 PrivateRoute.js
│   ├── 📁 contexts
│   │   └── 📄 SidebarContext.js
│   ├── 📁 hooks
│   │   └── 📄 useServerPagination.js
│   ├── 📁 layouts
│   │   ├── 📁 admin
│   │   │   └── 📄 index.js
│   │   ├── 📁 auth
│   │   │   ├── 📄 Default.js
│   │   │   └── 📄 index.js
│   │   └── 📄 Loader.jsx
│   ├── 📁 theme
│   │   ├── 📁 additions
│   │   │   └── 📁 card
│   │   │       └── 📄 card.js
│   │   ├── 📁 components
│   │   │   ├── 📄 badge.js
│   │   │   ├── 📄 button.js
│   │   │   ├── 📄 input.js
│   │   │   ├── 📄 link.js
│   │   │   ├── 📄 progress.js
│   │   │   ├── 📄 slider.js
│   │   │   ├── 📄 switch.js
│   │   │   └── 📄 textarea.js
│   │   ├── 📁 foundations
│   │   │   └── 📄 breakpoints.js
│   │   ├── 📄 styles.js
│   │   └── 📄 theme.js
│   ├── 📁 variables
│   │   └── 📄 charts.js
│   ├── 📁 views
│   │   ├── 📁 admin
│   │   │   ├── 📁 LogHeThong
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 default
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 CheckTable.js
│   │   │   │   │   ├── 📄 ComplexTable.js
│   │   │   │   │   ├── 📄 DailyTraffic.js
│   │   │   │   │   ├── 📄 PieCard.js
│   │   │   │   │   ├── 📄 Tasks.js
│   │   │   │   │   ├── 📄 TotalSpent.js
│   │   │   │   │   ├── 📄 UserActivity.js
│   │   │   │   │   └── 📄 WeeklyRevenue.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 columnsData.js
│   │   │   │   │   ├── ⚙️ tableDataCheck.json
│   │   │   │   │   └── ⚙️ tableDataComplex.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 hotrokhachhang
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddContactModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ContactCard.jsx
│   │   │   │   │   ├── 📄 ContactDetail.jsx
│   │   │   │   │   ├── 📄 ContactList.jsx
│   │   │   │   │   ├── 📄 ContactProcess.jsx
│   │   │   │   │   ├── 📄 ContactRow.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 PageHeader.jsx
│   │   │   │   │   ├── 📄 StatsRow.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useContact.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 profile
│   │   │   │   ├── 📁 components
│   │   │   │   │   └── 📄 trangcanhan.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlybanner
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 LinkBadge.jsx
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 BannerCard.jsx
│   │   │   │   │   ├── 📄 BannerDetail.jsx
│   │   │   │   │   ├── 📄 BannerForm.jsx
│   │   │   │   │   ├── 📄 BannerList.jsx
│   │   │   │   │   ├── 📄 BannerRow.jsx
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 ImageUploadButton.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useDragSort.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 data.js
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlycombo
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 DeleteModal.jsx
│   │   │   │   │   ├── 📄 FoodItemCard.jsx
│   │   │   │   │   ├── 📄 FoodItemForm.jsx
│   │   │   │   │   ├── 📄 FoodItemRow.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   └── 📄 TagBadge.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useFoodDrink.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlydanhgia
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlydanhsachyeuthich
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlydatve
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlydienvien
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 RoleBadge.jsx
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 DienVienCard.jsx
│   │   │   │   │   ├── 📄 DienVienDetail.jsx
│   │   │   │   │   ├── 📄 DienVienForm.jsx
│   │   │   │   │   ├── 📄 DienVienList.jsx
│   │   │   │   │   ├── 📄 DienVienRow.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useDienVien.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlydonhang
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 Badge.jsx
│   │   │   │   │   │   ├── 📄 Btn.jsx
│   │   │   │   │   │   ├── 📄 Panel.jsx
│   │   │   │   │   │   ├── 📄 PayChip.jsx
│   │   │   │   │   │   ├── 📄 SectionHead.jsx
│   │   │   │   │   │   ├── 📄 Stat.jsx
│   │   │   │   │   │   ├── 📄 StatusChip.jsx
│   │   │   │   │   │   ├── 📄 Tag.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 FilterBar.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 OrderCard.jsx
│   │   │   │   │   ├── 📄 OrderDetail.jsx
│   │   │   │   │   ├── 📄 OrderRow.jsx
│   │   │   │   │   ├── 📄 PageHeader.jsx
│   │   │   │   │   ├── 📄 RefundModal.jsx
│   │   │   │   │   ├── 📄 StatsRow.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useOrders.js
│   │   │   │   ├── 📁 utils
│   │   │   │   │   └── 📄 exportExcel.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyghe
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddColumnModal.jsx
│   │   │   │   │   ├── 📄 AddRowModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 CinemaSelector.jsx
│   │   │   │   │   ├── 📄 DeleteConfirmDialog.jsx
│   │   │   │   │   ├── 📄 EditSeatModal.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 PageHeader.jsx
│   │   │   │   │   ├── 📄 RoomCard.jsx
│   │   │   │   │   ├── 📄 RoomTypeBadge.jsx
│   │   │   │   │   ├── 📄 Seat.jsx
│   │   │   │   │   ├── 📄 SeatMapView.jsx
│   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   ├── 📄 StatusDot.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useSeatManagement.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 data.js
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyhoivien
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlykhuyenmai
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   ├── 📄 TypeBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 KhuyenMaiCard.jsx
│   │   │   │   │   ├── 📄 KhuyenMaiDetail.jsx
│   │   │   │   │   ├── 📄 KhuyenMaiForm.jsx
│   │   │   │   │   ├── 📄 KhuyenMaiList.jsx
│   │   │   │   │   ├── 📄 KhuyenMaiRow.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useKhuyenMai.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlylichchieudinhky
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 mini
│   │   │   │   │   │   ├── 📄 Btn.jsx
│   │   │   │   │   │   ├── 📄 DayBtn.jsx
│   │   │   │   │   │   ├── 📄 FInput.jsx
│   │   │   │   │   │   ├── 📄 FSelect.jsx
│   │   │   │   │   │   ├── 📄 Panel.jsx
│   │   │   │   │   │   ├── 📄 Pill.jsx
│   │   │   │   │   │   └── 📄 TimeBubble.jsx
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 BulkEditPriceModal.jsx
│   │   │   │   │   ├── 📄 CloneWeekModal.jsx
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 ScheduleCard.jsx
│   │   │   │   │   ├── 📄 ScheduleDetail.jsx
│   │   │   │   │   ├── 📄 ScheduleForm.jsx
│   │   │   │   │   ├── 📄 ScheduleList.jsx
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   └── 📄 WeekView.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useSchedule.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlymenu
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlynguoidung
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddUserModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 DeleteModal.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 NotificationModal.jsx
│   │   │   │   │   ├── 📄 RankBadge.jsx
│   │   │   │   │   ├── 📄 StatusDot.jsx
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   ├── 📄 UserDetail.jsx
│   │   │   │   │   ├── 📄 UserForm.jsx
│   │   │   │   │   └── 📄 UserRow.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useUser.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlynhaphathanh
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 RegionBadge.jsx
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 NhaPhatHanhCard.jsx
│   │   │   │   │   ├── 📄 NhaPhatHanhDetail.jsx
│   │   │   │   │   ├── 📄 NhaPhatHanhForm.jsx
│   │   │   │   │   ├── 📄 NhaPhatHanhList.jsx
│   │   │   │   │   ├── 📄 NhaPhatHanhRow.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useNhaPhatHanh.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyphanquyen
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AssignRoleModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 DeleteModal.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 RoleCard.jsx
│   │   │   │   │   ├── 📄 RoleDetail.jsx
│   │   │   │   │   ├── 📄 RoleForm.jsx
│   │   │   │   │   ├── 📄 RoleRow.jsx
│   │   │   │   │   ├── 📄 StatusPill.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useRole.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyphim
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 AgeBadge.jsx
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 PhimCard.jsx
│   │   │   │   │   ├── 📄 PhimDetail.jsx
│   │   │   │   │   ├── 📄 PhimForm.jsx
│   │   │   │   │   ├── 📄 PhimList.jsx
│   │   │   │   │   ├── 📄 PhimRow.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 usePhim.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 data.js
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyphongchieu
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddRoomModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 DeleteConfirmDialog.jsx
│   │   │   │   │   ├── 📄 EditRoomModal.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 RoomCard.jsx
│   │   │   │   │   ├── 📄 RoomDetail.jsx
│   │   │   │   │   ├── 📄 RoomListRow.jsx
│   │   │   │   │   ├── 📄 SeatMapPreview.jsx
│   │   │   │   │   ├── 📄 StatusPill.jsx
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   └── 📄 TypeBadge.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useRoom.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyrapchieu
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddCinemaPage.jsx
│   │   │   │   │   ├── 📄 AddRoomModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 CinemaCard.jsx
│   │   │   │   │   ├── 📄 CinemaDetail.jsx
│   │   │   │   │   ├── 📄 CinemaForm.jsx
│   │   │   │   │   ├── 📄 DeleteConfirmDialog.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 RoomRow.jsx
│   │   │   │   │   ├── 📄 RoomTypeBadge.jsx
│   │   │   │   │   ├── 📄 StatusDot.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useCinema.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlysuatchieu
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 AddModal.jsx
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 BulkEditPriceModal.jsx
│   │   │   │   │   ├── 📄 CloneWeekModal.jsx
│   │   │   │   │   ├── 📄 DetailPanel.jsx
│   │   │   │   │   ├── 📄 EditModal.jsx
│   │   │   │   │   ├── 📄 EmptyState.jsx
│   │   │   │   │   ├── 📄 FormField.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 ModalLeftPanel.jsx
│   │   │   │   │   ├── 📄 ModalShell.jsx
│   │   │   │   │   ├── 📄 ShowtimeCard.jsx
│   │   │   │   │   ├── 📄 ShowtimeRow.jsx
│   │   │   │   │   ├── 📄 StatusPill.jsx
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useShowtime.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlythanhtoan
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlytheloai
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   ├── 📄 TheLoaiCard.jsx
│   │   │   │   │   ├── 📄 TheLoaiDetail.jsx
│   │   │   │   │   ├── 📄 TheLoaiForm.jsx
│   │   │   │   │   └── 📄 TheLoaiList.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useTheLoai.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 data.js
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlythongbao
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 CheckTable.js
│   │   │   │   │   ├── 📄 ColumnsTable.js
│   │   │   │   │   ├── 📄 ComplexTable.js
│   │   │   │   │   └── 📄 DevelopmentTable.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 columnsData.js
│   │   │   │   │   ├── ⚙️ tableDataCheck.json
│   │   │   │   │   ├── ⚙️ tableDataColumns.json
│   │   │   │   │   ├── ⚙️ tableDataComplex.json
│   │   │   │   │   └── ⚙️ tableDataDevelopment.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlytintuc
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 CategoryBadge.jsx
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 ConfirmDeleteModal.jsx
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   ├── 📄 TableTopCreators.js
│   │   │   │   │   ├── 📄 TinTucCard.jsx
│   │   │   │   │   ├── 📄 TinTucDetail.jsx
│   │   │   │   │   ├── 📄 TinTucForm.jsx
│   │   │   │   │   ├── 📄 TinTucList.jsx
│   │   │   │   │   └── 📄 TinTucRow.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   └── 📄 useTinTuc.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 data.js
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlytrangthaighe
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📁 shared
│   │   │   │   │   │   ├── 📄 SectionTitle.jsx
│   │   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   │   ├── 📄 StatusBadge.jsx
│   │   │   │   │   │   └── 📄 animations.js
│   │   │   │   │   ├── 📄 CheckTable.js
│   │   │   │   │   ├── 📄 ColumnsTable.js
│   │   │   │   │   ├── 📄 ComplexTable.js
│   │   │   │   │   ├── 📄 DevelopmentTable.js
│   │   │   │   │   ├── 📄 EnhancedSelect.jsx
│   │   │   │   │   ├── 📄 LiveBadge.jsx
│   │   │   │   │   ├── 📄 ResetSeatModal.jsx
│   │   │   │   │   ├── 📄 SeatButton.jsx
│   │   │   │   │   ├── 📄 SeatDetailDrawer.jsx
│   │   │   │   │   ├── 📄 SeatInfoPanel.jsx
│   │   │   │   │   ├── 📄 SeatLegend.jsx
│   │   │   │   │   └── 📄 SeatMapView.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   ├── 📄 useSeatData.js
│   │   │   │   │   └── 📄 useSeatTheme.js
│   │   │   │   ├── 📁 services
│   │   │   │   │   └── 📄 showtimeSeatService.js
│   │   │   │   ├── 📁 utils
│   │   │   │   │   └── 📄 seatGenerator.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 columnsData.js
│   │   │   │   │   ├── ⚙️ tableDataCheck.json
│   │   │   │   │   ├── ⚙️ tableDataColumns.json
│   │   │   │   │   ├── ⚙️ tableDataComplex.json
│   │   │   │   │   └── ⚙️ tableDataDevelopment.json
│   │   │   │   ├── 📄 constants.js
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyve
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 CheckTable.js
│   │   │   │   │   ├── 📄 ColumnsTable.js
│   │   │   │   │   ├── 📄 ComplexTable.js
│   │   │   │   │   ├── 📄 DevelopmentTable.js
│   │   │   │   │   ├── 📄 FilterDrawer.jsx
│   │   │   │   │   ├── 📄 MobileTicketList.jsx
│   │   │   │   │   ├── 📄 PageHeader.jsx
│   │   │   │   │   ├── 📄 QRModal.jsx
│   │   │   │   │   ├── 📄 StatCard.jsx
│   │   │   │   │   ├── 📄 TaoVeMoi.jsx
│   │   │   │   │   ├── 📄 TicketDetail.jsx
│   │   │   │   │   ├── 📄 TicketEdit.jsx
│   │   │   │   │   └── 📄 TicketTable.jsx
│   │   │   │   ├── 📁 hooks
│   │   │   │   │   ├── 📄 useCreateTicketForm.js
│   │   │   │   │   └── 📄 useTicket.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 columnsData.js
│   │   │   │   │   ├── ⚙️ tableDataCheck.json
│   │   │   │   │   ├── ⚙️ tableDataColumns.json
│   │   │   │   │   ├── ⚙️ tableDataComplex.json
│   │   │   │   │   └── ⚙️ tableDataDevelopment.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 quanlyvoucher
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 rtl
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 CheckTable.js
│   │   │   │   │   ├── 📄 ComplexTable.js
│   │   │   │   │   ├── 📄 DailyTraffic.js
│   │   │   │   │   ├── 📄 PieCard.js
│   │   │   │   │   ├── 📄 Tasks.js
│   │   │   │   │   ├── 📄 TotalSpent.js
│   │   │   │   │   ├── 📄 UserActivity.js
│   │   │   │   │   └── 📄 WeeklyRevenue.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 columnsData.js
│   │   │   │   │   ├── ⚙️ tableDataCheck.json
│   │   │   │   │   └── ⚙️ tableDataComplex.json
│   │   │   │   └── 📄 index.jsx
│   │   │   ├── 📁 thongke
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 Banner.js
│   │   │   │   │   ├── 📄 HistoryItem.js
│   │   │   │   │   └── 📄 TableTopCreators.js
│   │   │   │   ├── 📁 variables
│   │   │   │   │   ├── 📄 tableColumnsTopCreators.js
│   │   │   │   │   └── ⚙️ tableDataTopCreators.json
│   │   │   │   └── 📄 index.jsx
│   │   │   └── 📁 thongkecombo
│   │   │       ├── 📁 components
│   │   │       │   ├── 📄 Banner.js
│   │   │       │   ├── 📄 HistoryItem.js
│   │   │       │   └── 📄 TableTopCreators.js
│   │   │       ├── 📁 variables
│   │   │       │   ├── 📄 tableColumnsTopCreators.js
│   │   │       │   └── ⚙️ tableDataTopCreators.json
│   │   │       └── 📄 index.jsx
│   │   └── 📁 auth
│   │       └── 📁 signIn
│   │           └── 📄 index.jsx
│   ├── 📄 App.js
│   ├── 📄 index.js
│   └── 📄 routes.js
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── 📝 CHANGELOG.md
├── 📄 LICENSE
├── 📝 README.md
├── ⚙️ jsconfig.json
├── ⚙️ package.json
└── 📄 prettier.config.js


```

---

## 🔧 Cấu Hình Nâng Cao

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000

# Socket Configuration
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_SOCKET_PATH=/socket.io
REACT_APP_SOCKET_RECONNECT=true
REACT_APP_SOCKET_RECONNECT_ATTEMPTS=5

# Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/jpg,image/webp
REACT_APP_ALLOWED_VIDEO_TYPES=video/mp4,video/webm

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_SOCKET=true

# App Configuration
REACT_APP_NAME=Cinema Admin
REACT_APP_VERSION=1.0.0
REACT_APP_LOCALE=vi-VN
REACT_APP_TIMEZONE=Asia/Ho_Chi_Minh

# Third-party Services
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_ANALYTICS_ID=your_analytics_id
```

### Axios Configuration

```javascript
// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
```

---

## 📖 Tài Liệu

### 📡 API Endpoints

<details>
<summary><b>Authentication</b></summary>

```javascript
POST   /api/auth/login         // Login
POST   /api/auth/logout        // Logout
POST   /api/auth/refresh       // Refresh token
GET    /api/auth/me            // Get current user
POST   /api/auth/forgot        // Forgot password
POST   /api/auth/reset         // Reset password
```

</details>

<details>
<summary><b>Movies</b></summary>

```javascript
GET    /api/movies             // Get all movies
GET    /api/movies/:id         // Get movie by ID
POST   /api/movies             // Create movie
PUT    /api/movies/:id         // Update movie
DELETE /api/movies/:id         // Delete movie
POST   /api/movies/:id/upload  // Upload media
```

</details>

<details>
<summary><b>Bookings</b></summary>

```javascript
GET    /api/bookings           // Get all bookings
GET    /api/bookings/:id       // Get booking detail
POST   /api/bookings           // Create booking
PUT    /api/bookings/:id       // Update booking
DELETE /api/bookings/:id       // Cancel booking
POST   /api/bookings/:id/refund // Process refund
```

</details>

> 📚 **Chi tiết đầy đủ:** [API Documentation](./docs/API.md)

---

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Update snapshots
npm run test:update
```

### Example Test

```javascript
// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Deploy to VPS/cPanel

```bash
# 1. Build
npm run build

# 2. Upload build/ folder to server

# 3. Configure .htaccess (Apache)
```

**.htaccess**
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

---

## 🤝 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! 

### 🔰 Quy trình đóng góp

1. **Fork** repository này
2. Tạo **branch** cho feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. Tạo **Pull Request**

### 📝 Coding Standards

- ✅ Tuân thủ ESLint + Prettier rules
- ✅ Viết unit tests cho features mới
- ✅ Update documentation khi cần
- ✅ Comment code rõ ràng
- ✅ Commit messages theo convention

### 💡 Feature Requests

Có ý tưởng mới? [Tạo Issue](https://github.com/your-username/cinema-admin-panel/issues/new) ngay!

---

## 📞 Liên Hệ

<div align="center">

### Hoàng Đạt

[![GitHub](https://img.shields.io/badge/GitHub-HoangPhungThanhDat-181717?style=for-the-badge&logo=github)](https://github.com/HoangPhungThanhDat)
[![Email](https://img.shields.io/badge/Email-hoangdatcoder@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hoangdatcoder@gmail.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Now-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://portfolio-hoang-dat.vercel.app/)

</div>

---

## 📄 License

Dự án này được phân phối dưới **MIT License**. Xem [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 🙏 Acknowledgments

Xin cảm ơn các thư viện và công cụ mã nguồn mở tuyệt vời:

- [React](https://reactjs.org/) - UI Library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [Ant Design](https://ant.design/) - UI Components
- [Socket.IO](https://socket.io/) - Real-time Engine
- [Chart.js](https://www.chartjs.org/) - Charts Library

---

<div align="center">

**Nếu dự án này hữu ích, đừng quên cho một ⭐ nhé!**

Made with ❤️ by **Gấu Phim Team**

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

*© 2026 Cinema Booking System. All rights reserved.*

</div>