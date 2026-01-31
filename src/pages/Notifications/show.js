import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import NotificationApi from "../../api/NotificationApi";
import UserApi from "../../api/UserApi";
import {
  Bell,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  Activity,
  AlertCircle,
  Megaphone,
  ShoppingCart,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function NotificationShow() {
  const { NotificationId } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationRes, userRes] = await Promise.all([
          NotificationApi.getById(NotificationId),
          UserApi.getAll(),
        ]);
        setNotification(notificationRes.data.data || notificationRes.data);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin thông báo."
        );
      } finally {
        setLoading(false);
      }
    };
    if (NotificationId) fetchData();
  }, [NotificationId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || id;

  const getTypeLabel = (type) => {
    switch (type) {
      case "System":
        return "Hệ thống";
      case "Promotion":
        return "Khuyến mãi";
      case "Order":
        return "Đơn hàng";
      default:
        return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "System":
        return <AlertCircle size={20} color="#6b7280" />;
      case "Promotion":
        return <Megaphone size={20} color="#6b7280" />;
      case "Order":
        return <ShoppingCart size={20} color="#6b7280" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

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
              <h5 className="loading-title">Đang tải dữ liệu thông báo...</h5>
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
  if (!notification) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Bell size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu thông báo.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = notification.Status === "Active";
  const isRead = notification.IsRead;

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
                  <button onClick={() => navigate("/notifications")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Thông Báo</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý thông báo hệ thống
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/notifications/edit/${NotificationId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Notification Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Bell size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Notification Title */}
                  <h2 className="role-name">{notification.Title}</h2>

                  {/* Status Badges */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                      {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {isActive ? "Hoạt động" : "Không hoạt động"}
                    </div>
                    <div className={`status-badge ${isRead ? 'active' : 'inactive'}`} style={{
                      background: isRead ? '#10b981' : '#f59e0b'
                    }}>
                      {isRead ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {isRead ? "Đã đọc" : "Chưa đọc"}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="description-box">
                    <div className="description-header">
                      <FileText size={18} color="#6b7280" />
                      <span className="description-label">Nội dung</span>
                    </div>
                    <p className="description-text" style={{ whiteSpace: 'pre-wrap' }}>
                      {notification.Message || "Không có nội dung"}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="description-box">
                    <div className="description-header">
                      {getTypeIcon(notification.Type)}
                      <span className="description-label">Loại thông báo</span>
                    </div>
                    <p className="description-text">
                      {getTypeLabel(notification.Type)}
                    </p>
                  </div>

                  {/* Notification ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Thông Báo</div>
                    <div className="role-id-value">{notification.NotificationId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Recipient Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Người Nhận</h3>
                        <p className="info-subtitle">Chi tiết về người nhận thông báo</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người nhận</div>
                          <div className="info-item-value">
                            {getUserName(notification.UserId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo thông báo</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{notification.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{notification.CreatedAt || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Cập Nhật Gần Nhất</h3>
                        <p className="info-subtitle">Lịch sử thay đổi thông báo</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{notification.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{notification.UpdatedAt || "N/A"}</div>
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