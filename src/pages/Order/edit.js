import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import OrderApi from "../../api/OrderApi";
import UserApi from "../../api/UserApi";
import PromotionApi from "../../api/PromotionApi";
import Swal from "sweetalert2";

export default function OrderEdit() {
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
        if (!OrderId) {
          setError("Thiếu OrderId trong URL");
          return;
        }

        setLoading(true);

        const [orderRes, userRes, promotionRes] = await Promise.all([
          OrderApi.getById(OrderId),
          UserApi.getAll(),
          PromotionApi.getAll(),
        ]);

        const o = orderRes.data.data || orderRes.data;
        setOrder(o);
        setUsers(userRes.data.data || []);
        setPromotions(promotionRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load order:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [OrderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await OrderApi.update(OrderId, order);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật đơn hàng thành công!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: "my-toast animated-toast",
        },
        showClass: {
          popup: "animate__animated animate__slideInRight",
        },
        hideClass: {
          popup: "animate__animated animate__slideOutRight",
        },
      }).then(() => {
        navigate("/orders");
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật đơn hàng:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật đơn hàng thất bại!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
                <h5 className="text-primary">Đang tải dữ liệu đơn hàng...</h5>
                <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

                <div className="card shadow-sm border-0 mt-4 w-75">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 text-center">
                        <div
                          className="bg-light rounded-circle mx-auto"
                          style={{ width: "120px", height: "120px" }}
                        ></div>
                        <div
                          className="bg-light mt-3 rounded"
                          style={{
                            width: "80%",
                            height: "20px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>
                      <div className="col-md-8">
                        <div
                          className="bg-light rounded mb-3"
                          style={{ width: "60%", height: "20px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "100%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "90%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "80%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "70%", height: "15px" }}
                        ></div>
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

  // ❌ Nếu lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container user-show-container">
              <div className="text-center p-5 text-danger">
                <i className="fa fa-exclamation-circle fa-3x mb-3"></i>
                <h5>{error}</h5>
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={() => window.location.reload()}
                >
                  <i className="fa fa-sync-alt me-2"></i> Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!order) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-shopping-cart fa-2x mb-2"></i>
                <p>Không có dữ liệu đơn hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="modern-cinema-page">
        <div className="cinema-container">
          {/* Breadcrumb */}
          <nav className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i>
              Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/orders")}
            >
              Đơn hàng
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Đơn Hàng</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin đơn đặt hàng
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Người đặt */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user label-icon"></i>
                      <span>Người đặt</span>
                    </label>
                    <select
                      className="modern-input"
                      name="UserId"
                      value={order.UserId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn người dùng --</option>
                      {users.map((u) => (
                        <option key={u.UserId} value={u.UserId}>
                          {u.FullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Khuyến mãi */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-gift label-icon"></i>
                      <span>Khuyến mãi</span>
                    </label>
                    <select
                      className="modern-input"
                      name="PromotionId"
                      value={order.PromotionId || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Không áp dụng --</option>
                      {promotions.map((p) => (
                        <option key={p.PromotionId} value={p.PromotionId}>
                          {p.Title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tổng tiền */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-dollar-sign label-icon"></i>
                      <span>Tổng tiền (VNĐ)</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="TotalAmount"
                      value={order.TotalAmount}
                      onChange={handleChange}
                      placeholder="Nhập tổng tiền"
                      required
                    />
                  </div>

                  {/* Ngày đặt */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar label-icon"></i>
                      <span>Ngày đặt</span>
                    </label>
                    <input
                      type="date"
                      className="modern-input"
                      name="OrderDate"
                      value={order.OrderDate?.split("T")[0] || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái đơn hàng</span>
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${
                          order.Status === "Pending" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrder((prev) => ({ ...prev, Status: "Pending" }))
                        }
                      >
                        <div className="status-radio">
                          {order.Status === "Pending" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-clock"></i>
                          </div>
                          <span className="status-label">Chờ xử lý</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          order.Status === "Paid" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrder((prev) => ({ ...prev, Status: "Paid" }))
                        }
                      >
                        <div className="status-radio">
                          {order.Status === "Paid" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Đã thanh toán</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          order.Status === "Cancelled" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrder((prev) => ({
                            ...prev,
                            Status: "Cancelled",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {order.Status === "Cancelled" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Đã hủy</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          order.Status === "Completed" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrder((prev) => ({
                            ...prev,
                            Status: "Completed",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {order.Status === "Completed" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-double"></i>
                          </div>
                          <span className="status-label">Hoàn tất</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      className="btn-cinema btn-cancel"
                      onClick={() => navigate("/orders")}
                    >
                      <i className="fas fa-times"></i>
                      <span>Hủy bỏ</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              {/* Highlight Card */}
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="info-title">Lưu ý quan trọng</h3>
                <p className="info-text">
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Các thay đổi sẽ
                  được cập nhật ngay lập tức vào hệ thống.
                </p>
              </div>

              {/* Current Info */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin hiện tại</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">ID Đơn Hàng:</span>
                    <span className="info-value">{order.OrderId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Tổng tiền:</span>
                    <span className="info-value">
                      {order.TotalAmount?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        order.Status === "Paid" || order.Status === "Completed"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {order.Status === "Paid"
                        ? "Đã thanh toán"
                        : order.Status === "Pending"
                        ? "Chờ xử lý"
                        : order.Status === "Cancelled"
                        ? "Đã hủy"
                        : "Hoàn tất"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-check-circle"></i>
                  <span>Hướng dẫn</span>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn người đặt và khuyến mãi từ danh sách</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Trạng thái "Đã thanh toán" xác nhận đơn hàng thành công</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhấn "Lưu thay đổi" để cập nhật thông tin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}