import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bannergau2 from "../vendors/images/bannergau21.png";
import gau1 from "../vendors/images/gau1.jpg";
import "../styles/Menu.css";
import { logout } from "../utils/auth";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // State cho Right Sidebar
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // State cho theme - ĐÃ SỬA: Đặt mặc định là white cho cả header và sidebar
  const [headerTheme, setHeaderTheme] = useState("header-white");
  const [sidebarTheme, setSidebarTheme] = useState("sidebar-light");
  const [dropdownIcon, setDropdownIcon] = useState("icon-style-1");
  const [listIcon, setListIcon] = useState("icon-list-style-4");

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  const fullName = localStorage.getItem("fullname");
  
  // Function to handle logout
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className={`${headerTheme} ${sidebarTheme}`}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="menu-icon dw dw-menu" onClick={toggleSidebar}></div>

          <div
            className="search-toggle-icon dw dw-search2"
            data-toggle="header_search"
          ></div>
          <div className="header-search">
            <form>
              <div className="form-group mb-0">
                <i className="dw dw-search2 search-icon"></i>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search Here"
                />
                <div className="dropdown">
                  <a
                    className="dropdown-toggle no-arrow"
                    href="#"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <i className="ion-arrow-down-c"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        From
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        To
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        Subject
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="btn btn-primary">Search</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="header-right">
          <div className="dashboard-setting user-notification">
            <div className="dropdown">
              <a
                className="dropdown-toggle no-arrow"
                href="#"
                onClick={() => setShowRightSidebar(true)}
              >
                <i className="dw dw-settings2"></i>
              </a>
            </div>
          </div>

          <div className="user-notification">
            <div className="dropdown">
              <a
                className="dropdown-toggle no-arrow"
                href="#"
                role="button"
                data-toggle="dropdown"
              >
                <i className="icon-copy dw dw-notification"></i>
                <span className="badge notification-active"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <div className="notification-list mx-h-350 customscroll">
                  <ul>
                    <li>
                      <a href="#">
                        <img src="vendors/images/img.jpg" alt="" />
                        <h3>John Doe</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="vendors/images/photo1.jpg" alt="" />
                        <h3>Lea R. Frith</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="vendors/images/photo2.jpg" alt="" />
                        <h3>Erik L. Richards</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="vendors/images/photo3.jpg" alt="" />
                        <h3>John Doe</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="vendors/images/photo4.jpg" alt="" />
                        <h3>Renee I. Hansen</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="vendors/images/img.jpg" alt="" />
                        <h3>Vicki M. Coleman</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed...
                        </p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="user-info-dropdown">
            <div className="dropdown">
              <a
                className="dropdown-toggle"
                href="#"
                role="button"
                data-toggle="dropdown"
              >
                <span className="user-icon">
                <img src={gau1} alt="Gau1" />
                </span>
                <span className="user-name">
                  {fullName ? fullName : "Guest"}
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">
                <Link className="dropdown-item" to="/profile">
                  <i className="dw dw-user1"></i> Profile
                </Link>
                <a className="dropdown-item" href="profile.html">
                  <i className="dw dw-settings2"></i> Setting
                </a>
                <a className="dropdown-item" href="faq.html">
                  <i className="dw dw-help"></i> Help
                </a>
                <a className="dropdown-item" onClick={logout}>
                  <i className="dw dw-logout"></i> Đăng xuất
                </a>
              </div>
            </div>
          </div>

          <div className="github-link">
            <a
              href="https://github.com/dropways/deskapp"
              target="_blank"
              rel="noreferrer"
            >
              <img src="vendors/images/github.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
      <div
        className="right-sidebar"
        style={{
          right: showRightSidebar ? "0" : "-400px",
          transition: "all 0.3s ease",
        }}
      >
        <div className="sidebar-title">
          <h3 className="weight-600 font-16 text-blue">
            Settings
            <span className="btn-block font-weight-400 font-12">
              Cài đặt giao diện
            </span>
          </h3>
          <div
            className="close-sidebar"
            onClick={() => setShowRightSidebar(false)}
            style={{ cursor: "pointer" }}
          >
            <i className="icon-copy ion-close-round"></i>
          </div>
        </div>

        <div className="right-sidebar-body customscroll">
          <div className="right-sidebar-body-content">
            {/* Header Background */}
            <h4 className="weight-600 font-18 pb-10">Header Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button
                className={`btn btn-outline-primary header-white ${
                  headerTheme === "header-white" ? "active" : ""
                }`}
                onClick={() => setHeaderTheme("header-white")}
              >
                White
              </button>
              <button
                className={`btn btn-outline-primary header-dark ${
                  headerTheme === "header-dark" ? "active" : ""
                }`}
                onClick={() => setHeaderTheme("header-dark")}
              >
                Dark
              </button>
            </div>

            {/* Sidebar Background */}
            <h4 className="weight-600 font-18 pb-10">Menu Background</h4>
            <div className="sidebar-btn-group pb-30 mb-10">
              <button
                className={`btn btn-outline-primary sidebar-light ${
                  sidebarTheme === "sidebar-light" ? "active" : ""
                }`}
                onClick={() => setSidebarTheme("sidebar-light")}
              >
                White
              </button>
              <button
                className={`btn btn-outline-primary sidebar-dark ${
                  sidebarTheme === "sidebar-dark" ? "active" : ""
                }`}
                onClick={() => setSidebarTheme("sidebar-dark")}
              >
                Dark
              </button>
            </div>

            {/* Menu Dropdown Icon */}
            <h4 className="weight-600 font-18 pb-10">Menu Dropdown Icon</h4>
            <div className="sidebar-radio-group pb-10 mb-10">
              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="sidebaricon-1"
                  name="menu-dropdown-icon"
                  className="custom-control-input"
                  value="icon-style-1"
                  checked={dropdownIcon === "icon-style-1"}
                  onChange={(e) => setDropdownIcon(e.target.value)}
                />
                <label className="custom-control-label" htmlFor="sidebaricon-1">
                  <i className="fa fa-angle-down"></i>
                </label>
              </div>

              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="sidebaricon-2"
                  name="menu-dropdown-icon"
                  className="custom-control-input"
                  value="icon-style-2"
                  checked={dropdownIcon === "icon-style-2"}
                  onChange={(e) => setDropdownIcon(e.target.value)}
                />
                <label className="custom-control-label" htmlFor="sidebaricon-2">
                  <i className="ion-plus-round"></i>
                </label>
              </div>

              <div className="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="sidebaricon-3"
                  name="menu-dropdown-icon"
                  className="custom-control-input"
                  value="icon-style-3"
                  checked={dropdownIcon === "icon-style-3"}
                  onChange={(e) => setDropdownIcon(e.target.value)}
                />
                <label className="custom-control-label" htmlFor="sidebaricon-3">
                  <i className="fa fa-angle-double-right"></i>
                </label>
              </div>
            </div>

            {/* Menu List Icon */}
            <h4 className="weight-600 font-18 pb-10">Menu List Icon</h4>
            <div className="sidebar-radio-group pb-30 mb-10">
              {[
                { id: 1, value: "icon-list-style-1", icon: "ion-minus-round" },
                { id: 2, value: "icon-list-style-2", icon: "fa fa-circle-o" },
                { id: 3, value: "icon-list-style-3", icon: "dw dw-check" },
                {
                  id: 4,
                  value: "icon-list-style-4",
                  icon: "icon-copy dw dw-next-2",
                },
                {
                  id: 5,
                  value: "icon-list-style-5",
                  icon: "dw dw-fast-forward-1",
                },
                { id: 6, value: "icon-list-style-6", icon: "dw dw-next" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="custom-control custom-radio custom-control-inline"
                >
                  <input
                    type="radio"
                    id={`sidebariconlist-${item.id}`}
                    name="menu-list-icon"
                    className="custom-control-input"
                    value={item.value}
                    checked={listIcon === item.value}
                    onChange={(e) => setListIcon(e.target.value)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`sidebariconlist-${item.id}`}
                  >
                    <i className={item.icon}></i>
                  </label>
                </div>
              ))}
            </div>

            {/* Reset Button - ĐÃ SỬA: Reset về white theme */}
            <div className="reset-options pt-30 text-center">
              <button
                className="btn btn-danger"
                id="reset-settings"
                onClick={() => {
                  setHeaderTheme("header-white");
                  setSidebarTheme("sidebar-light");
                  setDropdownIcon("icon-style-1");
                  setListIcon("icon-list-style-4");
                }}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* RightSidebar */}

      {/* Left Sidebar */}
      <div className={`left-side-bar ${isSidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="brand-logo">
          <Link to="/">
            <img src={bannergau2} alt="Logo" className="dark-logo" />
            <img src={bannergau2} alt="Logo" className="light-logo" />
          </Link>
          <div className="close-sidebar" data-toggle="left-sidebar-close">
            <i className="ion-close-round"></i>
          </div>
        </div>

        {/* Menu */}
        <div className="menu-block customscroll">
          <div className="sidebar-menu">
            <ul id="accordion-menu" className={`${dropdownIcon} ${listIcon}`}>
              {/* Trang chủ */}
              <li
                className={`dropdown ${activeMenu === "home" ? "active" : ""}`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("home")}
                >
                  <span className="micon dw dw-house-1"></span>
                  <span className="mtext">Trang Chủ</span>
                </a>
                <ul
                  className="submenu"
                  style={{ display: activeMenu === "home" ? "block" : "none" }}
                >
                  <li>
                    <Link to="/home2">Biểu đồ / Thống kê</Link>
                  </li>
                </ul>
              </li>

              {/* Quản lý người dùng */}
              <li
                className={`dropdown ${activeMenu === "user" ? "active" : ""}`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("user")}
                >
                  <span className="micon dw dw-user"></span>
                  <span className="mtext">Quản lý người dùng</span>
                </a>
                <ul
                  className="submenu"
                  style={{ display: activeMenu === "user" ? "block" : "none" }}
                >
                  <li>
                    <Link to="/user">Người dùng (Users)</Link>
                  </li>
                  <li>
                    <Link to="/role">Vai trò & phân quyền (Roles)</Link>
                  </li>
                  <li>
                    <Link to="/membership">
                      Hội viên (Memberships)
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist">Danh sách yêu thích (Wishlists)</Link>
                  </li>
                  <li>
                    <a href="form-pickers.html">Lịch sử đăng nhập</a>
                  </li>
                  <li>
                    <Link to="/notifications">
                     Thông báo(Notifications)
                    </Link>
                  </li>
                </ul>
                
              </li>


              {/* Nội dung & giao diện */}
              <li
                className={`dropdown ${
                  activeMenu === "content" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("content")}
                >
                  <span className="micon dw dw-settings"></span>
                  <span className="mtext">Nội dung & giao diện</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "content" ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/banner">Banner</Link>
                  </li>
                  <li>
                    <Link to="/datatable">Menu</Link>
                  </li>
                  <li>
                    <Link to="/Promotion">Khuyến mãi & Sự kiện (Promotions)</Link>
                  </li>
                  <li>
                    <Link to="/news">Tin Tức</Link>
                  </li>
                </ul>
              </li>

              {/* Quản lý phim */}
              <li
                className={`dropdown ${
                  activeMenu === "movies" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("movies")}
                >
                  <span className="micon dw dw-film"></span>
                  <span className="mtext">Quản lý phim</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "movies" ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/Movie">Phim (Movies)</Link>
                  </li>
                  <li>
                    <Link to="/Genre">Thể loại (Genres)</Link>
                  </li>
                  <li>
                    <Link to="/MovieCast">
                      Diễn viên / Đạo diễn (MovieCast)
                    </Link>
                  </li>
                  <li>
                    <Link to="/distributor">Nhà phát hành (Distributors)</Link>
                  </li>                
                  <li>
                    <Link to="/Review">Đánh giá phim (Reviews)</Link>
                  </li>
                  <li>
                    <Link to="/moviegenres">
                      Liên kết Phim – Thể loại (MovieGenres)
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Lịch chiếu & đặt vé */}
              <li
                className={`dropdown ${
                  activeMenu === "showtimes" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("showtimes")}
                >
                  <span className="micon dw dw-tag"></span>
                  <span className="mtext">Lịch chiếu & đặt vé</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "showtimes" ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/Showtime">Suất chiếu (Showtimes)</Link>
                  </li>
                  <li>
                    <Link to="/schedules">Lịch chiếu định kỳ (Schedules)</Link>
                  </li>
                  <li>
                    <Link to="/showtimeseats">
                      Trạng thái ghế theo suất chiếu (ShowtimeSeats)
                    </Link>
                  </li>
                  <li>
                    <Link to="/Tickets">Vé (Tickets)</Link>
                  </li>
                  <li>
                    <Link to="/orders">Đơn hàng(Orders)</Link>
                  </li>
                  <li>
                    <Link to="/orderdetails">
                      Chi tiết đơn hàng(OrderDetails)
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Quản lý thanh toán */}
              <li
                className={`dropdown ${
                  activeMenu === "payments" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("payments")}
                >
                  <span className="micon dw dw-analytics-21"></span>
                  <span className="mtext">Quản lý thanh toán</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "payments" ? "block" : "none",
                  }}
                >
                  <li>
                    <a href="highchart.html">Thanh toán</a>
                  </li>
                  <li>
                    <Link to="/foodanddrink">Bắp nước / Combo</Link>
                  </li>
                </ul>
              </li>

              {/* Hệ thống & báo cáo */}
              <li
                className={`dropdown ${
                  activeMenu === "system" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("system")}
                >
                  <span className="micon dw dw-browser2"></span>
                  <span className="mtext">Hệ thống & Báo cáo</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "system" ? "block" : "none",
                  }}
                >
                  <li>
                    <a href="403.html">Nhật ký hệ thống</a>
                  </li>
                  <li>
                    <a href="404.html">Trang lỗi</a>
                  </li>
                  <li>
                    <a href="500.html">500</a>
                  </li>
                  <li>
                    <a href="503.html">503</a>
                  </li>
                </ul>
              </li>

              {/* Quản lý rạp chiếu */}
              <li
                className={`dropdown ${
                  activeMenu === "cinema" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("cinema")}
                >
                  <span className="micon dw dw-building"></span>
                  <span className="mtext">Quản lý rạp chiếu</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "cinema" ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/cinemas">Rạp chiếu (Cinemas)</Link>
                  </li>
                  <li>
                    <Link to="/rooms">Phòng chiếu (Rooms)</Link>
                  </li>
                  <li>
                  <Link to="/seats">Ghế ngồi</Link>
                  </li>
                  <li>
                    <Link to="/staffs">Nhân viên rạp (Staff)</Link>
                  </li>
                </ul>
              </li>

              {/* Quản lý đặt vé */}
              <li
                className={`dropdown ${
                  activeMenu === "orders" ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("orders")}
                >
                  <span className="micon dw dw-ticket"></span>
                  <span className="mtext">Quản lý đặt vé</span>
                </a>
                <ul
                  className="submenu"
                  style={{
                    display: activeMenu === "orders" ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/bookings">Danh sách đơn đặt vé</Link>
                  </li>
                  <li>
                    <a href="#">Quản lý vé</a>
                  </li>
                </ul>
              </li>

              {/* Chat */}
              <li>
                <a href="chat.html" className="dropdown-toggle no-arrow">
                  <span className="micon dw dw-chat3"></span>
                  <span className="mtext">Chat</span>
                </a>
              </li>

              {/* Voucher */}
              <li>
                <a href="invoice.html" className="dropdown-toggle no-arrow">
                  <span className="micon dw dw-price-tag"></span>
                  <span className="mtext">Quản lý voucher</span>
                </a>
              </li>

              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <div className="sidebar-small-cap">Hệ thống</div>
              </li>

              {/* Hệ thống */}
              <li
                className={`dropdown ${activeMenu === "auth" ? "active" : ""}`}
              >
                <a
                  href="#"
                  className="dropdown-toggle"
                  onClick={() => toggleMenu("auth")}
                >
                  <span className="micon dw dw-settings2"></span>
                  <span className="mtext">Hệ thống</span>
                </a>
                <ul
                  className="submenu"
                  style={{ display: activeMenu === "auth" ? "block" : "none" }}
                >
                  <li>
                    <a href="login">Đăng nhập</a>
                  </li>
                  <li>
                    <a href="forgot-password.html">Forgot Password</a>
                  </li>
                  <li>
                    <a href="reset-password.html">Reset Password</a>
                  </li>
                </ul>
              </li>

              {/* External link */}
              <li>
                <a
                  href="https://dropways.github.io/deskapp-free-single-page-website-template/"
                  target="_blank"
                  rel="noreferrer"
                  className="dropdown-toggle no-arrow"
                >
                  <span className="micon dw dw-paper-plane1"></span>
                  <span className="mtext">
                    Website đặt vé{" "}
                    <img
                      src="vendors/images/coming-soon.png"
                      alt=""
                      width="25"
                    />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Overlay for mobile */}
      <div
        className={`mobile-menu-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={toggleSidebar}
      />
    </header>
  );
};

export default Header;