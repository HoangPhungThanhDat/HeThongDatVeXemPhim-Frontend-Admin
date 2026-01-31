import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import OrderApi from "../../api/OrderApi";
import UserApi from "../../api/UserApi";
import PromotionApi from "../../api/PromotionApi";
import {
  ShoppingCart,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Gift,
  Calendar,
  DollarSign,
  Sparkles,
  Activity,
  FileText,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function OrderShow() {
  const { OrderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, userRes, promotionRes] = await Promise.all([
          OrderApi.getById(OrderId),
          UserApi.getAll(),
          PromotionApi.getAll(),
        ]);
        setOrder(orderRes.data.data || orderRes.data);
        setUsers(userRes.data.data || []);
        setPromotions(promotionRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    if (OrderId) fetchData();
  }, [OrderId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || "N/A";
  const getPromotionTitle = (id) =>
    promotions.find((p) => p.PromotionId === id)?.Title || "Không có";

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
              <h5 className="loading-title">Đang tải dữ liệu đơn hàng...</h5>
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
  if (!order) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <ShoppingCart size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu đơn hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Paid":
        return { icon: CheckCircle, text: "Đã thanh toán", className: "active" };
      case "Pending":
        return { icon: Clock, text: "Chờ xử lý", className: "inactive" };
      case "Cancelled":
        return { icon: XCircle, text: "Đã hủy", className: "inactive" };
      case "Completed":
        return { icon: CheckCircle, text: "Hoàn tất", className: "active" };
      default:
        return { icon: Clock, text: status, className: "inactive" };
    }
  };

  const statusInfo = getStatusInfo(order.Status);
  const StatusIcon = statusInfo.icon;

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
                  <button onClick={() => navigate("/orders")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Đơn Hàng</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý đơn hàng
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/orders/edit/${OrderId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Order Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${statusInfo.className}`}>
                    <ShoppingCart size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{getUserName(order.UserId)}</h2>

                  {/* Total Amount */}
                  <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
                    {order.TotalAmount?.toLocaleString("vi-VN")} ₫
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${statusInfo.className}`}>
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  {/* Order Date */}
                  <div className="description-box">
                    <div className="description-header">
                      <Calendar size={18} color="#6b7280" />
                      <span className="description-label">Ngày đặt hàng</span>
                    </div>
                    <p className="description-text">
                      {order.OrderDate || "N/A"}
                    </p>
                  </div>

                  {/* Order ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Đơn Hàng</div>
                    <div className="role-id-value">{order.OrderId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* User Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Khách Hàng</h3>
                        <p className="info-subtitle">Chi tiết về người đặt hàng</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên khách hàng</div>
                          <div className="info-item-value">{getUserName(order.UserId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <FileText size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">ID Khách hàng</div>
                          <div className="info-item-value">{order.UserId}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Đơn Hàng</h3>
                        <p className="info-subtitle">Chi tiết về đơn đặt hàng</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <DollarSign size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tổng tiền</div>
                          <div className="info-item-value">
                            {order.TotalAmount?.toLocaleString("vi-VN")} ₫
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Gift size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Khuyến mãi</div>
                          <div className="info-item-value">
                            {getPromotionTitle(order.PromotionId)}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <FileText size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">ID Khuyến mãi</div>
                          <div className="info-item-value">
                            {order.PromotionId || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày đặt</div>
                          <div className="info-item-value">{order.OrderDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <CheckCircle size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Trạng thái</div>
                          <div className="info-item-value">{statusInfo.text}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Hệ Thống</h3>
                        <p className="info-subtitle">Lịch sử hoạt động</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{order.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{order.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{order.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{order.UpdatedAt || "N/A"}</div>
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