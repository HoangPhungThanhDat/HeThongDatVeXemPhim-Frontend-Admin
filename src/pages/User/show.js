import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Show.css"; // Import CSS mới
import UserApi from "../../api/UserApi";
import { useNavigate } from "react-router-dom";

export default function UserShow() {
  const { UserId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await UserApi.getById(UserId);
        console.log("Kết quả API:", res.data);
        setUser(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin người dùng."
        );
      } finally {
        setLoading(false);
      }
    };

    if (UserId) fetchUser();
  }, [UserId]);

   // ⏳ Loading đẹp hơn (có skeleton + spinner)
   if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
        <div className="pd-ltr-20">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-orange mb-3"
                role="status"
                style={{ 
                  width: "4rem", 
                  height: "4rem",
                  borderColor: "#f7931e",
                  borderRightColor: "transparent"
                }}
              ></div>
              <h5 style={{ color: "#f7931e" }}>Đang tải dữ liệu người dùng...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="card shadow-sm border-0 mt-4 w-75" style={{ 
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(247, 147, 30, 0.2)"
              }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div
                        className="rounded-circle mx-auto"
                        style={{ 
                          width: "120px", 
                          height: "120px",
                          background: "linear-gradient(90deg, rgba(247, 147, 30, 0.1) 25%, rgba(247, 147, 30, 0.2) 50%, rgba(247, 147, 30, 0.1) 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite"
                        }}
                      ></div>
                      <div
                        className="mt-3 rounded mx-auto"
                        style={{
                          width: "80%",
                          height: "20px",
                          background: "linear-gradient(90deg, rgba(247, 147, 30, 0.1) 25%, rgba(247, 147, 30, 0.2) 50%, rgba(247, 147, 30, 0.1) 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite"
                        }}
                      ></div>
                    </div>
                    <div className="col-md-8">
                      {[60, 100, 90, 80, 70].map((width, idx) => (
                        <div
                          key={idx}
                          className="rounded mb-2"
                          style={{ 
                            width: `${width}%`, 
                            height: idx === 0 ? "20px" : "15px",
                            background: "linear-gradient(90deg, rgba(247, 147, 30, 0.1) 25%, rgba(247, 147, 30, 0.2) 50%, rgba(247, 147, 30, 0.1) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite"
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </MainLayout>
    );
  }

  // ❌ Nếu lỗi
  if (error) {
    return (
      <MainLayout>
         <div className="main-container">
         <div className="pd-ltr-20">
            <div className="text-center p-5">
              <i className="fa fa-exclamation-circle fa-3x mb-3" style={{ color: "#ef4444" }}></i>
              <h5 style={{ color: "#fff" }}>{error}</h5>
              <button
                className="btn mt-3"
                onClick={() => window.location.reload()}
                style={{
                  background: "linear-gradient(135deg, #f7931e 0%, #e67e22 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  boxShadow: "0 8px 24px rgba(247, 147, 30, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                <i className="fa fa-sync-alt me-2"></i> Thử lại
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!user) {
    return (
      <MainLayout>
       <div className="main-container">
       <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-user-slash fa-2x mb-2" style={{ color: "#64748b" }}></i>
              <p style={{ color: "#94a3b8" }}>Không có dữ liệu người dùng.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ✅ Main Content
  return (
    <MainLayout>
      <div className="main-container">
      <div className="pd-ltr-20">
      <div className="cinema-user-detail">
        {/* Hero Section với Background Gradient */}
        <div className="user-hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="user-avatar-wrapper">
              <div className="avatar-glow"></div>
              <img
                src={user.Avatar || "https://via.placeholder.com/200"}
                alt={user.FullName}
                className="user-avatar-hero"
              />
              <div
                className={`status-badge status-${user.Status?.toLowerCase()}`}
              >
                <span className="status-dot"></span>
                {user.Status === "Active"
                  ? "Hoạt động"
                  : user.Status === "Inactive"
                  ? "Tạm khóa"
                  : "Đã cấm"}
              </div>
            </div>
            <h1 className="user-name-hero">{user.FullName}</h1>
            <div className="user-role-badge">
              <i className="fas fa-crown me-2"></i>
              {user.role?.RoleName || "Member"}
            </div>
          </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="user-content-wrapper">
          <div className="container">
            {/* Info Cards Grid */}
            <div className="info-grid">
              {/* Card 1: Thông Tin Cá Nhân */}
              <div className="info-card">
                <div className="card-header">
                  <i className="fas fa-user-circle"></i>
                  <h3>Thông Tin Cá Nhân</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-id-card"></i>
                      <span>ID Người dùng</span>
                    </div>
                    <div className="info-value">{user.UserId}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-envelope"></i>
                      <span>Email</span>
                    </div>
                    <div className="info-value">{user.Email}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-phone"></i>
                      <span>Số điện thoại</span>
                    </div>
                    <div className="info-value">
                      {user.PhoneNumber || "Chưa cập nhật"}
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-venus-mars"></i>
                      <span>Giới tính</span>
                    </div>
                    <div className="info-value">
                      {user.Gender || "Chưa cập nhật"}
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-birthday-cake"></i>
                      <span>Ngày sinh</span>
                    </div>
                    <div className="info-value">
                      {user.DateOfBirth || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Thông Tin Tài Khoản */}
              <div className="info-card">
                <div className="card-header">
                  <i className="fas fa-shield-alt"></i>
                  <h3>Thông Tin Tài Khoản</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-user-tag"></i>
                      <span>Vai trò</span>
                    </div>
                    <div className="info-value">
                      <span
                        className={`role-pill role-${
                          user.role?.RoleName?.toLowerCase() || "user"
                        }`}
                      >
                        {user.role?.RoleName || "User"}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-toggle-on"></i>
                      <span>Trạng thái</span>
                    </div>
                    <div className="info-value">
                      <span
                        className={`status-pill status-${user.Status?.toLowerCase()}`}
                      >
                        {user.Status === "Active"
                          ? "Hoạt động"
                          : user.Status === "Inactive"
                          ? "Tạm khóa"
                          : "Đã cấm"}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-calendar-plus"></i>
                      <span>Ngày tạo</span>
                    </div>
                    <div className="info-value">{user.CreatedAt}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-calendar-check"></i>
                      <span>Cập nhật lần cuối</span>
                    </div>
                    <div className="info-value">{user.UpdatedAt}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-user-plus"></i>
                      <span>Người tạo</span>
                    </div>
                    <div className="info-value">{user.CreatedBy || "System"}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <i className="fas fa-user-edit"></i>
                      <span>Người cập nhật</span>
                    </div>
                    <div className="info-value">{user.UpdatedBy || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn-cinema btn-primary"
                onClick={() => navigate(`/User/edit/${user.UserId}`)}
              >
                <i className="fas fa-edit"></i>
                <span>Chỉnh sửa</span>
              </button>
              <button
                className="btn-cinema btn-secondary"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      
    </MainLayout>
  );
}