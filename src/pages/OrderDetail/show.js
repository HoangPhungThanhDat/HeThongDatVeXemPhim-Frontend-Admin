import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import OrderDetailApi from "../../api/OrderDetailApi";
import OrderApi from "../../api/OrderApi";
import TicketApi from "../../api/TicketApi";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";
import {
  FileText,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Ticket,
  Coffee,
  Calendar,
  Clock,
  User,
  DollarSign,
  Hash,
} from "lucide-react";
import "../../styles/wishlist/Show.css";

export default function OrderDetailShow() {
  const { OrderDetailId } = useParams();
  const navigate = useNavigate();

  const [orderdetail, setOrderDetail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderdetailRes, orderRes, ticketRes, foodRes] =
          await Promise.all([
            OrderDetailApi.getById(OrderDetailId),
            OrderApi.getAll(),
            TicketApi.getAll(),
            FoodAndDrinkApi.getAll(),
          ]);

        setOrderDetail(orderdetailRes.data.data || orderdetailRes.data);
        setOrders(orderRes.data.data || []);
        setTickets(ticketRes.data.data || []);
        setItems(foodRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu chi tiết đơn hàng:", err);
        setError("Không thể tải dữ liệu chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    if (OrderDetailId) fetchData();
  }, [OrderDetailId]);

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
              <h5 className="text-primary">
                Đang tải dữ liệu chi tiết đơn hàng...
              </h5>
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
  if (!orderdetail) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <FileText size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu chi tiết đơn hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = orderdetail.Status === "Active";

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
                    onClick={() => navigate("/orderdetails")}
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
                    onClick={() =>
                      navigate(`/orderdetails/edit/${OrderDetailId}`)
                    }
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Order Detail Summary */}
                <div className="wishlist-show-summary-card">
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    <FileText size={56} color="white" strokeWidth={2} />
                  </div>

                  <h2 className="wishlist-show-user-name">
                    {orderdetail.ItemId?.Name || "N/A"}
                  </h2>

                  <p className="wishlist-show-movie-title">
                    {orderdetail.Price?.toLocaleString("vi-VN")} ₫ x{" "}
                    {orderdetail.Quantity}
                  </p>

                  <div
                    className={`wishlist-show-status-badge ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Chi Tiết Đơn Hàng
                    </div>
                    <div className="wishlist-show-id-value">
                      {orderdetail.OrderDetailId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Order Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <ShoppingCart size={24} color="white" />
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
                        <Hash size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Mã đơn hàng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {orderdetail.OrderId?.OrderId || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Ticket size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Mã vé
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {orderdetail.TicketId?.TicketId || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Coffee size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Sản Phẩm
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về món đồ ăn/uống
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Coffee size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên sản phẩm
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {orderdetail.ItemId?.Name || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Hash size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Số lượng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {orderdetail.Quantity}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <DollarSign size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giá từng món
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {orderdetail.Price?.toLocaleString("vi-VN")} ₫
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
                            {orderdetail.CreatedAt || "N/A"}
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
                            {orderdetail.UpdatedAt || "N/A"}
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
                            {orderdetail.CreatedBy || "N/A"}
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