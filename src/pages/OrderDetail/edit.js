import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import OrderDetailApi from "../../api/OrderDetailApi";
import OrderApi from "../../api/OrderApi";
import TicketApi from "../../api/TicketApi";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";
import Swal from "sweetalert2";

export default function OrderDetailEdit() {
  const { OrderDetailId } = useParams();
  const navigate = useNavigate();

  const [orderdetail, setOrderDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [foodanddrinks, setfoodanddrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!OrderDetailId) {
          setError("Thiếu OrderDetailId trong URL");
          return;
        }

        setLoading(true);

        const [orderdetailRes, orderRes, ticketRes, foodanddrinkRes] =
          await Promise.all([
            OrderDetailApi.getById(OrderDetailId),
            OrderApi.getAll(),
            TicketApi.getAll(),
            FoodAndDrinkApi.getAll(),
          ]);

        const o = orderdetailRes.data.data || orderdetailRes.data;
        setOrderDetails(o);
        setOrders(orderRes.data.data || []);
        setTickets(ticketRes.data.data || []);
        setfoodanddrinks(foodanddrinkRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load orderdetail:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [OrderDetailId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await OrderDetailApi.update(OrderDetailId, orderdetail);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật chi tiết đơn hàng thành công!",
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
        navigate("/orderdetails");
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật chi tiết đơn hàng:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật chi tiết đơn hàng thất bại!",
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
                <h5 className="text-primary">
                  Đang tải dữ liệu chi tiết đơn hàng...
                </h5>
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

  // ❌ Nếi lỗi
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
  if (!orderdetail) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-file-alt fa-2x mb-2"></i>
                <p>Không có dữ liệu chi tiết đơn hàng.</p>
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
              onClick={() => navigate("/orderdetails")}
            >
              Chi tiết đơn hàng
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Chi Tiết Đơn Hàng</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin chi tiết đơn đặt hàng
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Chọn đơn hàng */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-shopping-cart label-icon"></i>
                      <span>Chọn đơn hàng</span>
                    </label>
                    <select
                      className="modern-input"
                      name="OrderId"
                      value={orderdetail.OrderId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn đơn hàng --</option>
                      {orders.map((or) => (
                        <option key={or.OrderId} value={or.OrderId}>
                          {or.OrderId}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn vé đặt */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-ticket-alt label-icon"></i>
                      <span>Chọn vé đặt</span>
                    </label>
                    <select
                      className="modern-input"
                      name="TicketId"
                      value={orderdetail.TicketId || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn vé --</option>
                      {tickets.map((t) => (
                        <option key={t.TicketId} value={t.TicketId}>
                          {t.TicketId}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn sản phẩm */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-coffee label-icon"></i>
                      <span>Chọn sản phẩm (bắp, nước)</span>
                    </label>
                    <select
                      className="modern-input"
                      name="ItemId"
                      value={orderdetail.ItemId || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {foodanddrinks.map((f) => (
                        <option key={f.ItemId} value={f.ItemId}>
                          {f.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Số lượng */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-sort-numeric-up label-icon"></i>
                      <span>Số lượng</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Quantity"
                      min={1}
                      value={orderdetail.Quantity}
                      onChange={handleChange}
                      placeholder="Nhập số lượng"
                      required
                    />
                  </div>

                  {/* Giá từng món */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-dollar-sign label-icon"></i>
                      <span>Giá từng món (VNĐ)</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Price"
                      value={orderdetail.Price}
                      onChange={handleChange}
                      placeholder="Nhập giá"
                      required
                    />
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái</span>
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${
                          orderdetail.Status === "Active" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            Status: "Active",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {orderdetail.Status === "Active" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          orderdetail.Status === "Inactive" ? "active" : ""
                        }`}
                        onClick={() =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            Status: "Inactive",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {orderdetail.Status === "Inactive" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Không hoạt động</span>
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
                      onClick={() => navigate("/orderdetails")}
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
                    <span className="info-key">ID Chi Tiết:</span>
                    <span className="info-value">
                      {orderdetail.OrderDetailId}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Số lượng:</span>
                    <span className="info-value">{orderdetail.Quantity}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Giá:</span>
                    <span className="info-value">
                      {orderdetail.Price?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        orderdetail.Status === "Active"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {orderdetail.Status === "Active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
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
                  <p>Chọn đơn hàng, vé và sản phẩm từ danh sách</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhập số lượng và giá chính xác cho từng món</p>
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