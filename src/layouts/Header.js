import React, { useState } from "react";
import { Link } from "react-router-dom";
import bannergau2 from "../vendors/images/bannergau21.png";
import gau1 from "../vendors/images/gau1.jpg";
import "../styles/Menu.css";
import { logout } from "../utils/auth";

/* ─── Styles chỉ cho dropdown/notification/user-pill (không đụng layout) ─── */
const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

  /* ── Notification pulse dot ── */
  .h-notif-dot {
    position: absolute; top: 8px; right: 8px;
    width: 8px; height: 8px;
    background: #e5383b; border-radius: 50%; border: 2px solid #fff;
    animation: h-pulse 2s infinite;
  }
  @keyframes h-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.4); opacity: 0.65; }
  }

  /* ── User pill ── */
  .h-user-pill {
    display: flex !important; align-items: center; gap: 9px;
    padding: 5px 13px 5px 5px; border-radius: 40px;
    border: 1.5px solid #ebebeb; cursor: pointer;
    text-decoration: none !important; background: #fff;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .h-user-pill:hover {
    border-color: #e5383b; background: #fff9f9;
    box-shadow: 0 3px 14px rgba(229,56,59,0.11);
  }
  .h-user-pill img {
    width: 30px; height: 30px; border-radius: 50%;
    object-fit: cover; border: 2px solid #f0f0f0; flex-shrink: 0;
  }
  .h-user-name {
    font-size: 13.5px; font-weight: 600; color: #2d2d2d;
    font-family: 'Outfit', sans-serif; line-height: 1.2; white-space: nowrap;
  }
  .h-user-role {
    font-size: 11px; color: #b0b0b0;
    font-family: 'Outfit', sans-serif; line-height: 1;
  }

  /* ── Dropdown overrides ── */
  .h-dropdown .dropdown-menu {
    border: 1px solid #f0f0f0 !important; border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important;
    padding: 7px !important; margin-top: 10px !important;
    font-family: 'Outfit', sans-serif !important;
  }
  .h-dropdown .dropdown-item {
    border-radius: 10px !important; padding: 9px 13px !important;
    font-size: 13.5px !important; color: #444 !important;
    display: flex !important; align-items: center !important; gap: 10px !important;
    transition: background 0.15s, color 0.15s !important;
  }
  .h-dropdown .dropdown-item i { font-size: 15px; width: 18px; text-align: center; color: #bbb; }
  .h-dropdown .dropdown-item:hover { background: #fff5f5 !important; color: #e5383b !important; }
  .h-dropdown .dropdown-item:hover i { color: #e5383b; }
  .h-dd-divider { border: none; border-top: 1px solid #f3f3f3; margin: 5px 6px !important; }

  /* ── Notification dropdown ── */
  .h-notif-menu {
    width: 320px !important; padding: 0 !important;
    overflow: hidden !important; min-width: unset !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important;
    border: 1px solid #f0f0f0 !important;
  }
  .h-notif-head {
    padding: 13px 16px 11px; border-bottom: 1px solid #f3f3f3;
    display: flex; align-items: center; justify-content: space-between;
  }
  .h-notif-head span { font-size: 14px; font-weight: 700; color: #222; font-family: 'Outfit', sans-serif; }
  .h-notif-head a { font-size: 12px; color: #e5383b; text-decoration: none; font-family: 'Outfit', sans-serif; }
  .h-notif-list { padding: 6px; max-height: 280px; overflow-y: auto; }
  .h-notif-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 9px 10px; border-radius: 10px;
    transition: background 0.15s; cursor: pointer;
  }
  .h-notif-item:hover { background: #f9f9f9; }
  .h-notif-item img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #eee; }
  .h-notif-body { flex: 1; min-width: 0; }
  .h-notif-body h5 { font-size: 13px; font-weight: 600; color: #333; margin: 0 0 3px; font-family: 'Outfit', sans-serif; }
  .h-notif-body p { font-size: 12px; color: #999; margin: 0; font-family: 'Outfit', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .h-unread-dot { width: 8px; height: 8px; background: #e5383b; border-radius: 50%; flex-shrink: 0; margin-top: 7px; }

  /* ── Github btn ── */
  .h-github-btn {
    width: 36px; height: 36px; border-radius: 10px;
    display: inline-flex !important; align-items: center; justify-content: center;
    background: #18181b; transition: background 0.2s, transform 0.15s; margin-left: 6px;
  }
  .h-github-btn:hover { background: #333; transform: scale(1.06); }
  .h-github-btn img { width: 17px; filter: invert(1); }
`;

/* ── Reusable icon button style ── */
const iconBtnStyle = {
  width: 40, height: 40, borderRadius: 11,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "#666", fontSize: 17,
  position: "relative", background: "transparent", border: "none",
  transition: "background 0.18s, color 0.18s", flexShrink: 0,
};

const IconBtn = ({ children, onClick, title, dataBs }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...iconBtnStyle, background: hovered ? "#f5f5f5" : "transparent", color: hovered ? "#e5383b" : "#666" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      title={title}
      data-toggle={dataBs}
      role={dataBs ? "button" : undefined}
    >
      {children}
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════════ */

const Header = () => {
  const [activeMenu, setActiveMenu]             = useState(null);
  const [isSidebarOpen, setSidebarOpen]         = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [headerTheme, setHeaderTheme]           = useState("header-white");
  const [sidebarTheme, setSidebarTheme]         = useState("sidebar-light");
  const [dropdownIcon, setDropdownIcon]         = useState("icon-style-1");
  const [listIcon, setListIcon]                 = useState("icon-list-style-4");
  const [hamburgerHovered, setHamburgerHovered] = useState(false);

  const toggleMenu    = (menu) => setActiveMenu(activeMenu === menu ? null : menu);
  const toggleSidebar = ()     => setSidebarOpen(!isSidebarOpen);
  const fullName = localStorage.getItem("fullname");

  const notifications = [
    { name: "Nguyễn Văn A", msg: "Vừa đặt vé xem Avengers: Secret Wars",   img: "vendors/images/img.jpg",    unread: true  },
    { name: "Trần Thị B",   msg: "Có đánh giá mới cho phim Spider-Man",      img: "vendors/images/photo1.jpg", unread: true  },
    { name: "Lê Minh C",    msg: "Yêu cầu hoàn tiền đơn hàng #00231",        img: "vendors/images/photo2.jpg", unread: false },
    { name: "Phạm Thu D",   msg: "Đơn hàng #00230 đã thanh toán thành công", img: "vendors/images/photo3.jpg", unread: false },
  ];

  return (
    <header className={`${headerTheme} ${sidebarTheme}`}>
      <style>{headerStyles}</style>

      {/* ════════════════════════════════════════════════════════
          HEADER BAR
          - Dùng class "header" để Menu.css định vị đúng (fixed/height)
          - Bên trong dùng wrapper div với 100% inline style
      ════════════════════════════════════════════════════════ */}
      <div className="header">

        {/* Wrapper nội dung – flex layout hoàn toàn inline */}
        <div style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "0 16px",
          boxSizing: "border-box",
          gap: 8,
        }}>

          {/* ══ LEFT: hamburger + search ══ */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: "1 1 auto",
            minWidth: 0,
          }}>

            {/* Hamburger */}
            <span
              className="dw dw-menu"
              onClick={toggleSidebar}
              style={{
                width: 38, height: 38, flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                borderRadius: 10, cursor: "pointer",
                color: hamburgerHovered ? "#e5383b" : "#555",
                background: hamburgerHovered ? "#f5f5f5" : "transparent",
                fontSize: 18, transition: "all 0.18s",
              }}
              onMouseEnter={() => setHamburgerHovered(true)}
              onMouseLeave={() => setHamburgerHovered(false)}
            />

            {/* Search bar */}
            <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
              <i className="dw dw-search2" style={{
                position: "absolute", left: 13, top: "50%",
                transform: "translateY(-50%)",
                color: "#bbb", fontSize: 14, pointerEvents: "none", zIndex: 2,
              }} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                style={{
                  display: "block",
                  width: 260, height: 40,
                  paddingLeft: 38, paddingRight: 16,
                  borderRadius: 12,
                  border: "1.5px solid #ececec",
                  background: "#f8f8f8",
                  fontSize: 13.5,
                  fontFamily: "'Outfit', sans-serif",
                  color: "#333",
                  outline: "none",
                  boxShadow: "none",
                  transition: "width 0.25s, border-color 0.2s, background 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.width = "310px";
                  e.target.style.borderColor = "#e5383b";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 3.5px rgba(229,56,59,0.09)";
                }}
                onBlur={(e) => {
                  e.target.style.width = "260px";
                  e.target.style.borderColor = "#ececec";
                  e.target.style.background = "#f8f8f8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}>

            {/* Settings */}
            <IconBtn title="Cài đặt giao diện" onClick={() => setShowRightSidebar(true)}>
              <i className="dw dw-settings2" />
            </IconBtn>

            {/* Notifications */}
            <div className="dropdown h-dropdown">
              <IconBtn title="Thông báo" dataBs="dropdown">
                <i className="dw dw-notification" />
                <span className="h-notif-dot" />
              </IconBtn>
              <div className="dropdown-menu dropdown-menu-right h-notif-menu">
                <div className="h-notif-head">
                  <span>Thông báo</span>
                  <a href="#">Đánh dấu đã đọc</a>
                </div>
                <div className="h-notif-list">
                  {notifications.map((n, i) => (
                    <div className="h-notif-item" key={i}>
                      <img src={n.img} alt={n.name} onError={(e) => { e.target.style.visibility = "hidden"; }} />
                      <div className="h-notif-body">
                        <h5>{n.name}</h5>
                        <p>{n.msg}</p>
                      </div>
                      {n.unread && <div className="h-unread-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 26, background: "#ebebeb", margin: "0 6px", flexShrink: 0 }} />

            {/* User pill */}
            <div className="dropdown h-dropdown">
              <a className="h-user-pill dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                <img src={gau1} alt="avatar" onError={(e) => { e.target.style.display = "none"; }} />
                <div>
                  <div className="h-user-name">{fullName || "Admin"}</div>
                  <div className="h-user-role">Quản trị viên</div>
                </div>
                <i className="fas fa-chevron-down" style={{ fontSize: 10, color: "#ccc", marginLeft: 2 }} />
              </a>
              <div className="dropdown-menu dropdown-menu-right" style={{ minWidth: 185 }}>
                <Link className="dropdown-item" to="/profile">
                  <i className="dw dw-user1" /> Hồ sơ của tôi
                </Link>
                <a className="dropdown-item" href="#"><i className="dw dw-settings2" /> Cài đặt</a>
                <a className="dropdown-item" href="#"><i className="dw dw-help" /> Trợ giúp</a>
                <hr className="h-dd-divider" />
                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                  <i className="dw dw-logout" style={{ color: "#e5383b" }} />
                  <span style={{ color: "#e5383b" }}>Đăng xuất</span>
                </a>
              </div>
            </div>

            {/* Github */}
            <a href="https://github.com/dropways/deskapp" target="_blank" rel="noreferrer" className="h-github-btn" title="GitHub">
              <img src="vendors/images/github.svg" alt="github" />
            </a>

          </div>
        </div>
      </div>

      {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
      <div className="right-sidebar" style={{ right: showRightSidebar ? "0" : "-400px", transition: "all 0.3s ease" }}>
        <div className="sidebar-title">
          <h3 className="weight-600 font-16 text-blue">
            Settings
            <span className="btn-block font-weight-400 font-12">Cài đặt giao diện</span>
          </h3>
          <div className="close-sidebar" onClick={() => setShowRightSidebar(false)} style={{ cursor: "pointer" }}>
            <i className="icon-copy ion-close-round" />
          </div>
        </div>
        <div className="right-sidebar-body customscroll">
          <div className="right-sidebar-body-content">
            <h4 className="weight-600 font-18 pb-10">Header Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button className={`btn btn-outline-primary header-white ${headerTheme === "header-white" ? "active" : ""}`} onClick={() => setHeaderTheme("header-white")}>White</button>
              <button className={`btn btn-outline-primary header-dark  ${headerTheme === "header-dark"  ? "active" : ""}`} onClick={() => setHeaderTheme("header-dark")}>Dark</button>
            </div>
            <h4 className="weight-600 font-18 pb-10">Menu Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button className={`btn btn-outline-primary sidebar-light ${sidebarTheme === "sidebar-light" ? "active" : ""}`} onClick={() => setSidebarTheme("sidebar-light")}>White</button>
              <button className={`btn btn-outline-primary sidebar-dark  ${sidebarTheme === "sidebar-dark"  ? "active" : ""}`} onClick={() => setSidebarTheme("sidebar-dark")}>Dark</button>
            </div>
            <h4 className="weight-600 font-18 pb-10">Menu Dropdown Icon</h4>
            <div className="sidebar-radio-group pb-10 mb-10">
              {[
                { id: 1, value: "icon-style-1", icon: "fa fa-angle-down" },
                { id: 2, value: "icon-style-2", icon: "ion-plus-round" },
                { id: 3, value: "icon-style-3", icon: "fa fa-angle-double-right" },
              ].map((item) => (
                <div key={item.id} className="custom-control custom-radio custom-control-inline">
                  <input type="radio" id={`sidebaricon-${item.id}`} name="menu-dropdown-icon"
                    className="custom-control-input" value={item.value}
                    checked={dropdownIcon === item.value} onChange={(e) => setDropdownIcon(e.target.value)} />
                  <label className="custom-control-label" htmlFor={`sidebaricon-${item.id}`}><i className={item.icon} /></label>
                </div>
              ))}
            </div>
            <h4 className="weight-600 font-18 pb-10">Menu List Icon</h4>
            <div className="sidebar-radio-group pb-30 mb-10">
              {[
                { id: 1, value: "icon-list-style-1", icon: "ion-minus-round" },
                { id: 2, value: "icon-list-style-2", icon: "fa fa-circle-o" },
                { id: 3, value: "icon-list-style-3", icon: "dw dw-check" },
                { id: 4, value: "icon-list-style-4", icon: "icon-copy dw dw-next-2" },
                { id: 5, value: "icon-list-style-5", icon: "dw dw-fast-forward-1" },
                { id: 6, value: "icon-list-style-6", icon: "dw dw-next" },
              ].map((item) => (
                <div key={item.id} className="custom-control custom-radio custom-control-inline">
                  <input type="radio" id={`sidebariconlist-${item.id}`} name="menu-list-icon"
                    className="custom-control-input" value={item.value}
                    checked={listIcon === item.value} onChange={(e) => setListIcon(e.target.value)} />
                  <label className="custom-control-label" htmlFor={`sidebariconlist-${item.id}`}><i className={item.icon} /></label>
                </div>
              ))}
            </div>
            <div className="reset-options pt-30 text-center">
              <button className="btn btn-danger" onClick={() => {
                setHeaderTheme("header-white"); setSidebarTheme("sidebar-light");
                setDropdownIcon("icon-style-1"); setListIcon("icon-list-style-4");
              }}>Reset Settings</button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ LEFT SIDEBAR ════════════════ */}
      <div className={`left-side-bar ${isSidebarOpen ? "open" : ""}`}>
        <div className="brand-logo">
          <Link to="/"><img src={bannergau2} alt="Logo" className="dark-logo" /><img src={bannergau2} alt="Logo" className="light-logo" /></Link>
          <div className="close-sidebar" data-toggle="left-sidebar-close"><i className="ion-close-round" /></div>
        </div>
        <div className="menu-block customscroll">
          <div className="sidebar-menu">
            <ul id="accordion-menu" className={`${dropdownIcon} ${listIcon}`}>

              <li className={`dropdown ${activeMenu === "home" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("home")}>
                  <span className="micon dw dw-house-1" /><span className="mtext">Trang Chủ</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "home" ? "block" : "none" }}>
                  <li><Link to="/home2">Biểu đồ / Thống kê</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "user" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("user")}>
                  <span className="micon dw dw-user" /><span className="mtext">Quản lý người dùng</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "user" ? "block" : "none" }}>
                  <li><Link to="/user">Người dùng (Users)</Link></li>
                  <li><Link to="/role">Vai trò & phân quyền (Roles)</Link></li>
                  <li><Link to="/membership">Hội viên (Memberships)</Link></li>
                  <li><Link to="/wishlist">Danh sách yêu thích (Wishlists)</Link></li>
                  <li><a href="form-pickers.html">Lịch sử đăng nhập</a></li>
                  <li><Link to="/notifications">Thông báo (Notifications)</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "content" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("content")}>
                  <span className="micon dw dw-settings" /><span className="mtext">Nội dung & giao diện</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "content" ? "block" : "none" }}>
                  <li><Link to="/banner">Banner</Link></li>
                  <li><Link to="/datatable">Menu</Link></li>
                  <li><Link to="/Promotion">Khuyến mãi & Sự kiện (Promotions)</Link></li>
                  <li><Link to="/news">Tin Tức</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "movies" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("movies")}>
                  <span className="micon dw dw-film" /><span className="mtext">Quản lý phim</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "movies" ? "block" : "none" }}>
                  <li><Link to="/Movie">Phim (Movies)</Link></li>
                  <li><Link to="/Genre">Thể loại (Genres)</Link></li>
                  <li><Link to="/MovieCast">Diễn viên / Đạo diễn (MovieCast)</Link></li>
                  <li><Link to="/distributor">Nhà phát hành (Distributors)</Link></li>
                  <li><Link to="/Review">Đánh giá phim (Reviews)</Link></li>
                  <li><Link to="/moviegenres">Liên kết Phim – Thể loại (MovieGenres)</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "showtimes" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("showtimes")}>
                  <span className="micon dw dw-tag" /><span className="mtext">Lịch chiếu & đặt vé</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "showtimes" ? "block" : "none" }}>
                  <li><Link to="/Showtime">Suất chiếu (Showtimes)</Link></li>
                  <li><Link to="/schedules">Lịch chiếu định kỳ (Schedules)</Link></li>
                  <li><Link to="/showtimeseats">Trạng thái ghế theo suất chiếu (ShowtimeSeats)</Link></li>
                  <li><Link to="/Tickets">Vé (Tickets)</Link></li>
                  <li><Link to="/orders">Đơn hàng (Orders)</Link></li>
                  <li><Link to="/orderdetails">Chi tiết đơn hàng (OrderDetails)</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "payments" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("payments")}>
                  <span className="micon dw dw-analytics-21" /><span className="mtext">Quản lý thanh toán</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "payments" ? "block" : "none" }}>
                  <li><a href="highchart.html">Thanh toán</a></li>
                  <li><Link to="/foodanddrink">Bắp nước / Combo</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "cinema" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("cinema")}>
                  <span className="micon dw dw-building" /><span className="mtext">Quản lý rạp chiếu</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "cinema" ? "block" : "none" }}>
                  <li><Link to="/cinemas">Rạp chiếu (Cinemas)</Link></li>
                  <li><Link to="/rooms">Phòng chiếu (Rooms)</Link></li>
                  <li><Link to="/seats">Ghế ngồi</Link></li>
                  <li><Link to="/staffs">Nhân viên rạp (Staff)</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "orders" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("orders")}>
                  <span className="micon dw dw-ticket" /><span className="mtext">Quản lý đặt vé</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "orders" ? "block" : "none" }}>
                  <li><Link to="/bookings">Danh sách đơn đặt vé</Link></li>
                  <li><a href="#">Quản lý vé</a></li>
                </ul>
              </li>

              <li>
                <Link to="/contacts" className="dropdown-toggle no-arrow">
                  <span className="micon dw dw-chat3" /><span className="mtext">Liên Hệ</span>
                </Link>
              </li>

              <li>
                <a href="invoice.html" className="dropdown-toggle no-arrow">
                  <span className="micon dw dw-price-tag" /><span className="mtext">Quản lý voucher</span>
                </a>
              </li>

              <li><div className="dropdown-divider" /></li>
              <li><div className="sidebar-small-cap">Hệ thống</div></li>

              <li className={`dropdown ${activeMenu === "auth" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("auth")}>
                  <span className="micon dw dw-settings2" /><span className="mtext">Hệ thống</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "auth" ? "block" : "none" }}>
                  <li><a href="login">Đăng nhập</a></li>
                  <li><a href="forgot-password.html">Forgot Password</a></li>
                  <li><a href="reset-password.html">Reset Password</a></li>
                </ul>
              </li>

              <li className={`dropdown ${activeMenu === "system" ? "active" : ""}`}>
                <a href="#" className="dropdown-toggle" onClick={() => toggleMenu("system")}>
                  <span className="micon dw dw-browser2" /><span className="mtext">Hệ thống & Báo cáo</span>
                </a>
                <ul className="submenu" style={{ display: activeMenu === "system" ? "block" : "none" }}>
                  <li><a href="403.html">Nhật ký hệ thống</a></li>
                  <li><a href="404.html">Trang lỗi</a></li>
                  <li><a href="500.html">500</a></li>
                  <li><a href="503.html">503</a></li>
                </ul>
              </li>

              <li>
                <a href="https://dropways.github.io/deskapp-free-single-page-website-template/"
                  target="_blank" rel="noreferrer" className="dropdown-toggle no-arrow">
                  <span className="micon dw dw-paper-plane1" />
                  <span className="mtext">Website đặt vé <img src="vendors/images/coming-soon.png" alt="" width="25" /></span>
                </a>
              </li>

            </ul>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay ${isSidebarOpen ? "show" : ""}`} onClick={toggleSidebar} />
    </header>
  );
};

export default Header;