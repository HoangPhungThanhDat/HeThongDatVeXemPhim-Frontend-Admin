import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import UserApi from "../../api/UserApi";
import {
  User,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  Activity,
  Shield,
  IdCard,
  Cake,
  UserCheck,
} from "lucide-react";
import "../../styles/Role/Show.css";


export default function UserShow() {
  const { UserId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu người dùng...</h5>
              <p className="loading-subtitle">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="skeleton-card">
                <div className="skeleton-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-text-short"></div>
                    </div>
                    <div className="col-md-8">
                      <div className="skeleton-text-60"></div>
                      <div className="skeleton-text-100"></div>
                      <div className="skeleton-text-90"></div>
                      <div className="skeleton-text-80"></div>
                      <div className="skeleton-text-70"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="error-container">
              <div className="error-content">
                <div className="error-card">
                  <div className="error-icon">
                    <XCircle size={40} color="#ef4444" />
                  </div>
                  <h3 className="error-title">{error}</h3>
                  <button onClick={() => window.location.reload()} className="error-button">
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No Data State
  if (!user) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <User size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu người dùng.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = user.Status === "Active";

  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20">
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/user")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Người Dùng</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý người dùng hệ thống
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/user/edit/${UserId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - User Summary */}
                <div className="role-summary-card">
                  {/* Avatar */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    {user.Avatar ? (
                      <img
                        src={user.Avatar}
                        alt={user.FullName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "24px",
                        }}
                      />
                    ) : (
                      <User size={56} color="white" strokeWidth={2} />
                    )}
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{user.FullName}</h2>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {user.Status === "Active"
                      ? "Hoạt động"
                      : user.Status === "Inactive"
                      ? "Tạm khóa"
                      : "Đã cấm"}
                  </div>

                  {/* Email */}
                  <div className="description-box">
                    <div className="description-header">
                      <Mail size={18} color="#6b7280" />
                      <span className="description-label">Email</span>
                    </div>
                    <p className="description-text">{user.Email}</p>
                  </div>

                  {/* User ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Người Dùng</div>
                    <div className="role-id-value">{user.UserId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Personal Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Cá Nhân</h3>
                        <p className="info-subtitle">Chi tiết thông tin người dùng</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Phone size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Số điện thoại</div>
                          <div className="info-item-value">
                            {user.PhoneNumber || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <UserCheck size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giới tính</div>
                          <div className="info-item-value">
                            {user.Gender || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Cake size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày sinh</div>
                          <div className="info-item-value">
                            {user.DateOfBirth || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Shield size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Vai trò</div>
                          <div className="info-item-value">
                            {user.role?.RoleName || "User"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tài Khoản</h3>
                        <p className="info-subtitle">Lịch sử hoạt động</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">
                            {user.CreatedBy || "System"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{user.CreatedAt}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{user.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{user.UpdatedAt}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}