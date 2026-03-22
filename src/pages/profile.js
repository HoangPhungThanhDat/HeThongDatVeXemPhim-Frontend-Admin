import { useEffect, useState } from "react";
import Loader from "../layouts/Loader";
import MainLayout from "../layouts/MainLayout";
import UserApi from "../api/UserApi";
import RoleApi from "../api/RoleApi";
import gau1 from "../vendors/images/gau1.jpg";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("UserId");
        if (!userId) {
          setError("Không tìm thấy thông tin đăng nhập");
          setLoading(false);
          return;
        }
        const response = await UserApi.getById(userId);
        let userData = response.data?.data || response.data || response;
        if (!userData) {
          setError("Không thể tải thông tin tài khoản");
          setLoading(false);
          return;
        }
        setUser(userData);
        if (userData.RoleId) {
          try {
            const roleResponse = await RoleApi.getById(userData.RoleId);
            setRole(roleResponse.data?.data || roleResponse.data || roleResponse);
          } catch (e) {
            console.error(e);
          }
        }
        setError(null);
      } catch (err) {
        setError(`Không thể tải thông tin tài khoản: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const parts = dateString.split("-");
    return parts.length === 3 ? `${parts[0]}/${parts[1]}/${parts[2]}` : dateString;
  };

  const statusLabel = (s) =>
    s === "Active" ? "Hoạt động" :
    s === "Inactive" ? "Không hoạt động" :
    s === "Banned" ? "Bị cấm" :
    s || "Hoạt động";

  const statusClass = (s) =>
    s === "Active" ? "pf-status-active" :
    s === "Inactive" ? "pf-status-inactive" :
    "pf-status-banned";

  if (loading) return <Loader />;

  if (error) return (
    <MainLayout>
      <div className="main-container pd-ltr-20">
        <div className="alert alert-danger mt-4">
          <h4>Lỗi!</h4>
          <p>{error}</p>
        </div>
      </div>
    </MainLayout>
  );

  if (!user) return (
    <MainLayout>
      <div className="main-container pd-ltr-20">
        <div className="alert alert-warning mt-4">
          <h4>Không có dữ liệu người dùng</h4>
          <p>Vui lòng đăng nhập lại</p>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20 xs-pd-20-10">
          <div className="min-height-200px pf-wrap">

            {/* Breadcrumb */}
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <a href="/" style={{ color: "#aaa", fontSize: 13, textDecoration: "none" }}>Trang chủ</a>
              <i className="fas fa-chevron-right" style={{ fontSize: 10, color: "#ddd" }} />
              <span style={{ color: "#e5383b", fontSize: 13, fontWeight: 600 }}>Hồ Sơ</span>
            </div>

            <div className="row g-4">

              {/* ══ LEFT COLUMN ══ */}
              <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 mb-30">
                <div className="pf-hero">

                  {/* Banner */}
                  <div className="pf-hero-banner" />

                  {/* Avatar */}
                  <div className="pf-avatar-wrap">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={gau1} alt="avatar" className="pf-avatar" />
                      <div className="pf-avatar-badge" />
                    </div>
                  </div>

                  {/* Name & role */}
                  <div className="pf-hero-name" style={{ paddingBottom: 4 }}>
                    <h4>{user?.FullName || "Chưa cập nhật"}</h4>
                    <span className="pf-role-badge">{role?.RoleName || "Người dùng"}</span>
                    <div style={{ marginTop: 10 }}>
                      <span className={statusClass(user?.Status)}>{statusLabel(user?.Status)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pf-stats" style={{ marginTop: 20 }}>
                    <div className="pf-stat">
                      <div className="pf-stat-val">0</div>
                      <div className="pf-stat-lbl">Đơn hàng</div>
                    </div>
                    <div className="pf-stat">
                      <div className="pf-stat-val">0</div>
                      <div className="pf-stat-lbl">Vé đã mua</div>
                    </div>
                    <div className="pf-stat">
                      <div className="pf-stat-val">0</div>
                      <div className="pf-stat-lbl">Đánh giá</div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="pf-info-section">
                    <div className="pf-info-title">Liên hệ</div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-envelope" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Email</p>
                        <p className="pf-info-value">{user?.Email || "Chưa cập nhật"}</p>
                      </div>
                    </div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-phone" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Số điện thoại</p>
                        <p className="pf-info-value">{user?.PhoneNumber || "Chưa cập nhật"}</p>
                      </div>
                    </div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-venus-mars" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Giới tính</p>
                        <p className="pf-info-value">
                          {user?.Gender === "Male" ? "Nam" : user?.Gender === "Female" ? "Nữ" : user?.Gender || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-birthday-cake" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Ngày sinh</p>
                        <p className="pf-info-value">{formatDate(user?.DateOfBirth)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account info */}
                  <div className="pf-info-section" style={{ paddingBottom: 24 }}>
                    <div className="pf-info-title">Tài khoản</div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-id-badge" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Mã người dùng</p>
                        <p className="pf-info-value" style={{ fontSize: 12, fontFamily: "monospace" }}>
                          {user?.UserId || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-calendar-plus" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Ngày tạo</p>
                        <p className="pf-info-value">{formatDate(user?.CreatedAt)}</p>
                      </div>
                    </div>

                    <div className="pf-info-row">
                      <div className="pf-info-icon"><i className="fas fa-sync-alt" /></div>
                      <div className="pf-info-content">
                        <p className="pf-info-label">Cập nhật lần cuối</p>
                        <p className="pf-info-value">{formatDate(user?.UpdatedAt)}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ══ RIGHT COLUMN ══ */}
              <div className="col-xl-8 col-lg-8 col-md-7 col-sm-12 mb-30">
                <div className="pf-main">

                  {/* Tabs */}
                  <div className="pf-tabs">
                    <span
                      className={`pf-tab ${activeTab === "timeline" ? "active" : ""}`}
                      onClick={() => setActiveTab("timeline")}
                    >
                      <i className="fas fa-history" /> Lịch sử
                    </span>
                    <span
                      className={`pf-tab ${activeTab === "tasks" ? "active" : ""}`}
                      onClick={() => setActiveTab("tasks")}
                    >
                      <i className="fas fa-tasks" /> Công việc
                    </span>
                    <span
                      className={`pf-tab ${activeTab === "setting" ? "active" : ""}`}
                      onClick={() => setActiveTab("setting")}
                    >
                      <i className="fas fa-sliders-h" /> Cài đặt
                    </span>
                  </div>

                  {/* ── Timeline tab ── */}
                  {activeTab === "timeline" && (
                    <div className="pf-tab-content">
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                          Lịch sử tài khoản
                        </h5>
                        <p style={{ fontSize: 13, color: "#aaa", margin: "4px 0 0" }}>
                          Các hoạt động gần đây của tài khoản
                        </p>
                      </div>
                      <div className="pf-timeline">
                        <div className="pf-tl-item">
                          <div className="pf-tl-dot" />
                          <div className="pf-tl-date">
                            <i className="fas fa-calendar-alt" style={{ marginRight: 4 }} />
                            {formatDate(user?.CreatedAt)}
                          </div>
                          <div className="pf-tl-title">🎉 Tạo tài khoản</div>
                          <p className="pf-tl-desc">
                            Tài khoản của bạn đã được tạo thành công trên hệ thống Gấu Phim.
                          </p>
                        </div>
                        {user?.UpdatedAt && user?.UpdatedAt !== user?.CreatedAt && (
                          <div className="pf-tl-item">
                            <div className="pf-tl-dot" style={{ background: "#f59e0b", boxShadow: "0 0 0 2px #f59e0b" }} />
                            <div className="pf-tl-date">
                              <i className="fas fa-calendar-alt" style={{ marginRight: 4 }} />
                              {formatDate(user?.UpdatedAt)}
                            </div>
                            <div className="pf-tl-title">✏️ Cập nhật hồ sơ</div>
                            <p className="pf-tl-desc">Thông tin hồ sơ của bạn đã được cập nhật.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Tasks tab ── */}
                  {activeTab === "tasks" && (
                    <div className="pf-tab-content">
                      <div className="pf-empty">
                        <i className="fas fa-clipboard-list" />
                        <p>Chưa có công việc nào được giao</p>
                      </div>
                    </div>
                  )}

                  {/* ── Settings tab ── */}
                  {activeTab === "setting" && (
                    <div className="pf-tab-content">
                      <div className="row g-4">

                        {/* Personal info */}
                        <div className="col-md-6">
                          <div className="pf-form-section-title">
                            <i className="fas fa-user-edit" /> Thông tin cá nhân
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Họ và tên</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              defaultValue={user?.FullName || ""}
                              placeholder="Nhập họ và tên"
                            />
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Email</label>
                            <input
                              className="pf-form-input"
                              type="email"
                              defaultValue={user?.Email || ""}
                              disabled
                            />
                            <p className="pf-form-hint">
                              <i className="fas fa-lock" style={{ marginRight: 4 }} />
                              Email không thể thay đổi
                            </p>
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Số điện thoại</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              defaultValue={user?.PhoneNumber || ""}
                              placeholder="Nhập số điện thoại"
                            />
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Ngày sinh</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              defaultValue={user?.DateOfBirth || ""}
                              placeholder="YYYY-MM-DD"
                            />
                          </div>

                          <button className="pf-save-btn">
                            <i className="fas fa-save" style={{ marginRight: 8 }} />
                            Lưu thay đổi
                          </button>
                        </div>

                        {/* Account info */}
                        <div className="col-md-6">
                          <div className="pf-form-section-title">
                            <i className="fas fa-shield-alt" /> Thông tin tài khoản
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Mã người dùng</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              value={user?.UserId || ""}
                              disabled
                              style={{ fontFamily: "monospace", fontSize: 12 }}
                            />
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Vai trò</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              value={role?.RoleName || "Chưa cập nhật"}
                              disabled
                            />
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Trạng thái</label>
                            <div style={{ display: "flex", alignItems: "center", height: 46 }}>
                              <span className={statusClass(user?.Status)}>{statusLabel(user?.Status)}</span>
                            </div>
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Ngày tạo tài khoản</label>
                            <input
                              className="pf-form-input"
                              type="text"
                              value={formatDate(user?.CreatedAt)}
                              disabled
                            />
                          </div>

                          <hr className="pf-form-divider" />

                          <div className="pf-form-section-title" style={{ marginTop: 0 }}>
                            <i className="fas fa-key" /> Đổi mật khẩu
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Mật khẩu mới</label>
                            <input
                              className="pf-form-input"
                              type="password"
                              placeholder="Nhập mật khẩu mới"
                            />
                          </div>

                          <div className="pf-form-group">
                            <label className="pf-form-label">Xác nhận mật khẩu</label>
                            <input
                              className="pf-form-input"
                              type="password"
                              placeholder="Nhập lại mật khẩu"
                            />
                          </div>

                          <button
                            className="pf-save-btn"
                            style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
                          >
                            <i className="fas fa-lock" style={{ marginRight: 8 }} />
                            Đổi mật khẩu
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;