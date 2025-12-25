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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu đơn hàng...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              <div className="card shadow-sm border-0 wishlist-show-skeleton-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="wishlist-show-skeleton-avatar"></div>
                      <div className="wishlist-show-skeleton-text"></div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "60%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "100%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "90%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "80%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "70%" }}
                      ></div>
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
            <div className="wishlist-show-error-container">
              <div className="wishlist-show-error-content">
                <div className="wishlist-show-error-card">
                  <div className="wishlist-show-error-icon-wrapper">
                    <XCircle size={40} color="#ef4444" />
                  </div>
                  <h3 className="wishlist-show-error-title">{error}</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="wishlist-show-error-button"
                  >
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
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <ShoppingCart size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu đơn hàng.
                </p>
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
          <div className="wishlist-show-main-container">
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/orders")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Đơn Hàng</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý đơn hàng
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/orders/edit/${OrderId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Order Summary */}
                <div className="wishlist-show-summary-card">
                  <div
                    className={`wishlist-show-icon-wrapper ${statusInfo.className}`}
                  >
                    <ShoppingCart size={56} color="white" strokeWidth={2} />
                  </div>

                  <h2 className="wishlist-show-user-name">
                    {getUserName(order.UserId)}
                  </h2>

                  <p className="wishlist-show-movie-title">
                    {order.TotalAmount?.toLocaleString("vi-VN")} ₫
                  </p>

                  <div
                    className={`wishlist-show-status-badge ${statusInfo.className}`}
                  >
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">ID Đơn Hàng</div>
                    <div className="wishlist-show-id-value">
                      {order.OrderId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* User Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Khách Hàng
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về người đặt hàng
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên khách hàng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getUserName(order.UserId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <DollarSign size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Đơn Hàng
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về đơn đặt hàng
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <DollarSign size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tổng tiền
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.TotalAmount?.toLocaleString("vi-VN")} ₫
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Gift size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Khuyến mãi
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getPromotionTitle(order.PromotionId)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày đặt
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.OrderDate || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Thời Gian
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Lịch sử hoạt động
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.CreatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Cập nhật lần cuối
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.UpdatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.CreatedBy || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người cập nhật
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {order.UpdatedBy || "N/A"}
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
      </div>
    </MainLayout>
  );
}