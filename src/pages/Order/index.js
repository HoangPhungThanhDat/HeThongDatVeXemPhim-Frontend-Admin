import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import OrderApi from "../../api/OrderApi";
import UserApi from "../../api/UserApi";
import PromotionApi from "../../api/PromotionApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteOrder } from "./delete";

export default function Schedule() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setpromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [newOrder, setNewOrder] = useState({
    UserId: "",
    PromotionId: "",
    TotalAmount: "",
    OrderDate: new Date().toISOString().slice(0, 10),
    Status: "Pending",
  });

  useEffect(() => {
    // Lấy tất cả orders
    OrderApi.getAll()
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.error("Lỗi load orders:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách users
    UserApi.getAll()
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Lỗi load users:", err));

    // Lấy danh sách promotions
    PromotionApi.getAll()
      .then((res) => setpromotions(res.data.data))
      .catch((err) => console.error("Lỗi load promotions:", err));
  }, []);

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        UserId: newOrder.UserId,
        PromotionId: newOrder.PromotionId || null,
        TotalAmount: parseFloat(newOrder.TotalAmount),
        OrderDate: newOrder.OrderDate,
        Status: newOrder.Status,
      };

      const res = await OrderApi.create(payload);
      const createdOrder = res.data.data || res.data;

      setOrders([...orders, createdOrder]);
      setNewOrder({
        UserId: "",
        PromotionId: "",
        TotalAmount: "",
        OrderDate: new Date().toISOString().slice(0, 10),
        Status: "Pending",
      });
      setShowForm(false);
      showToast("success", "🎉 Thêm đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm order:", error);
      showToast("error", "❌ Thêm đơn hàng thất bại!");
    }
  };

  // Toggle trạng thái user
  const toggleStatus = (OrderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.OrderId === OrderId
          ? {
              ...order,
              Status:
                order.Status === "Pending"
                  ? "Paid"
                  : order.Status === "Paid"
                  ? "Cancelled"
                  : order.Status === "Cancelled"
                  ? "Completed"
                  : "Pending",
            }
          : order
      )
    );
  };

  return (
    <div>
      <Loader />
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-heart me-2"></i> Quản lý đơn hàng
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form thêm */}

              {/* Form thêm đơn hàng - CINEMA STYLE */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="cinema-add-form"
                  >
                    {/* Form Header */}
                    <div className="cinema-form-header">
                      <div className="cinema-form-title">
                        <div className="cinema-form-icon">
                          <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm đơn hàng</h4>
                          <p className="cinema-form-subtitle">
                            Tạo đơn đặt hàng cho khách hàng
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddOrder}>
                        <div className="cinema-form-grid">
                          {/* Người đặt */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-user-circle"></i>
                              Người đặt
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrder.UserId}
                              onChange={(e) =>
                                setNewOrder({
                                  ...newOrder,
                                  UserId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn người đặt --</option>
                              {users.map((u) => (
                                <option key={u.UserId} value={u.UserId}>
                                  👤 {u.FullName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mã khuyến mãi */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-gift"></i>
                              Khuyến mãi
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrder.PromotionId || ""}
                              onChange={(e) =>
                                setNewOrder({
                                  ...newOrder,
                                  PromotionId: e.target.value || null,
                                })
                              }
                            >
                              <option value="">🎁 Không áp dụng</option>
                              {promotions.map((p) => (
                                <option
                                  key={p.PromotionId}
                                  value={p.PromotionId}
                                >
                                  🎉 {p.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Ngày đặt */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-alt"></i>
                              Ngày đặt
                              <span className="required">*</span>
                            </label>
                            <input
                              type="date"
                              className="cinema-input"
                              value={newOrder.OrderDate}
                              onChange={(e) =>
                                setNewOrder({
                                  ...newOrder,
                                  OrderDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Tổng tiền */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-money-bill-wave"></i>
                              Tổng tiền
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="VD: 150000"
                              min="0"
                              step="1000"
                              value={newOrder.TotalAmount}
                              onChange={(e) =>
                                setNewOrder({
                                  ...newOrder,
                                  TotalAmount: e.target.value,
                                })
                              }
                              required
                            />
                            {newOrder.TotalAmount && (
                              <div className="cinema-helper-text">
                                <i className="fas fa-info-circle"></i>
                                Tổng thanh toán:{" "}
                                <strong>
                                  {parseInt(
                                    newOrder.TotalAmount
                                  ).toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </strong>
                              </div>
                            )}
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-info-circle"></i>
                              Trạng thái đơn hàng
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrder.Status}
                              onChange={(e) =>
                                setNewOrder({
                                  ...newOrder,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Pending">⏳ Chờ xử lý</option>
                              <option value="Paid">✅ Đã thanh toán</option>
                              <option value="Cancelled">❌ Đã hủy</option>
                              <option value="Completed">🎉 Hoàn tất</option>
                            </select>
                          </div>

                          {/* Summary Box - Hiển thị khi có đủ thông tin */}
                          {newOrder.UserId && newOrder.TotalAmount && (
                            <div className="cinema-form-group cinema-form-grid-full">
                              <div
                                style={{
                                  padding: "20px",
                                  background: "rgba(247, 147, 30, 0.08)",
                                  border: "2px solid rgba(247, 147, 30, 0.3)",
                                  borderRadius: "12px",
                                  marginTop: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <i
                                    className="fas fa-receipt"
                                    style={{
                                      color: "#f7931e",
                                      fontSize: "24px",
                                    }}
                                  ></i>
                                  <h5
                                    style={{
                                      margin: 0,
                                      color: "white",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Thông tin đơn hàng
                                  </h5>
                                </div>
                                <div
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: "14px",
                                    lineHeight: 1.8,
                                  }}
                                >
                                  <p style={{ margin: "8px 0" }}>
                                    <i
                                      className="fas fa-user"
                                      style={{
                                        color: "#f7931e",
                                        marginRight: "8px",
                                      }}
                                    ></i>
                                    Khách hàng:{" "}
                                    <strong style={{ color: "white" }}>
                                      {
                                        users.find(
                                          (u) => u.UserId === newOrder.UserId
                                        )?.FullName
                                      }
                                    </strong>
                                  </p>
                                  <p style={{ margin: "8px 0" }}>
                                    <i
                                      className="fas fa-calendar"
                                      style={{
                                        color: "#f7931e",
                                        marginRight: "8px",
                                      }}
                                    ></i>
                                    Ngày đặt:{" "}
                                    <strong style={{ color: "white" }}>
                                      {newOrder.OrderDate
                                        ? new Date(
                                            newOrder.OrderDate
                                          ).toLocaleDateString("vi-VN")
                                        : "Chưa chọn"}
                                    </strong>
                                  </p>
                                  <p style={{ margin: "8px 0" }}>
                                    <i
                                      className="fas fa-coins"
                                      style={{
                                        color: "#f7931e",
                                        marginRight: "8px",
                                      }}
                                    ></i>
                                    Tổng tiền:{" "}
                                    <strong
                                      style={{
                                        color: "#f7931e",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {parseInt(
                                        newOrder.TotalAmount
                                      ).toLocaleString("vi-VN")}{" "}
                                      VNĐ
                                    </strong>
                                  </p>
                                  {newOrder.PromotionId && (
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-gift"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Khuyến mãi:{" "}
                                      <strong style={{ color: "#22c55e" }}>
                                        {
                                          promotions.find(
                                            (p) =>
                                              p.PromotionId ===
                                              newOrder.PromotionId
                                          )?.Title
                                        }
                                      </strong>
                                    </p>
                                  )}
                                  <p style={{ margin: "8px 0" }}>
                                    <i
                                      className="fas fa-tag"
                                      style={{
                                        color: "#f7931e",
                                        marginRight: "8px",
                                      }}
                                    ></i>
                                    Trạng thái:{" "}
                                    <strong
                                      style={{
                                        color:
                                          newOrder.Status === "Paid"
                                            ? "#22c55e"
                                            : newOrder.Status === "Cancelled"
                                            ? "#ef4444"
                                            : newOrder.Status === "Completed"
                                            ? "#3b82f6"
                                            : "#fbbf24",
                                      }}
                                    >
                                      {newOrder.Status === "Pending"
                                        ? "⏳ Chờ xử lý"
                                        : newOrder.Status === "Paid"
                                        ? "✅ Đã thanh toán"
                                        : newOrder.Status === "Cancelled"
                                        ? "❌ Đã hủy"
                                        : "🎉 Hoàn tất"}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button
                            type="submit"
                            className="cinema-btn cinema-btn-primary"
                          >
                            <i className="fas fa-check-circle"></i>
                            Tạo đơn hàng
                          </button>
                          <button
                            type="button"
                            className="cinema-btn cinema-btn-secondary"
                            onClick={() => setShowForm(false)}
                          >
                            <i className="fas fa-times"></i>
                            Hủy bỏ
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bảng danh sách */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">ID</th>
                          <th>Người đặt</th>
                          <th>Ngày đặt</th>
                          <th>khuyến mãi </th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((o, index) => (
                            <tr>
                              <td className="fw-bold px-4">{o.OrderId}</td>
                              <td>
                                {users.find((u) => u.UserId === o.UserId)
                                  ?.FullName || o.UserId}
                              </td>
                              <td>{o.OrderDate}</td>
                              <td>
                                {promotions.find(
                                  (p) =>
                                    String(p.PromotionId) ===
                                    String(o.PromotionId)
                                )?.Title || "Không có khuyến mãi"}
                              </td>

                              <td>{o.TotalAmount}</td>

                              <td className="align-middle">
                                <div className="d-flex align-items-center">
                                  {/* Nút gạt chỉ để trang trí, không tác dụng */}
                                  <label className="switch me-2">
                                    <input
                                      type="checkbox"
                                      disabled // không cho click
                                      checked={
                                        o.Status === "Paid" ||
                                        o.Status === "Completed"
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>

                                  {/* Hiển thị trạng thái với màu sắc */}
                                  <span
                                    className={`fw-semibold px-2 py-1 rounded-pill ${
                                      o.Status === "Pending"
                                        ? "text-warning"
                                        : o.Status === "Paid"
                                        ? "text-success"
                                        : o.Status === "Cancelled"
                                        ? "text-danger"
                                        : "text-primary"
                                    }`}
                                  >
                                    {o.Status === "Pending"
                                      ? "Chờ xử lý"
                                      : o.Status === "Paid"
                                      ? "Đã thanh toán"
                                      : o.Status === "Cancelled"
                                      ? "Đã hủy"
                                      : "Hoàn tất"}
                                  </span>
                                </div>
                              </td>

                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/orders/show/${o.OrderId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/orders/edit/${o.OrderId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteOrder(o.OrderId, setOrders)
                                  }
                                  className="action-btn text-danger"
                                  title="Xóa"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-3">
                              Chưa có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}
