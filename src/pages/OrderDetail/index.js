import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import OrderDetailApi from "../../api/OrderDetailApi";
import OrderApi from "../../api/OrderApi";
import TicketApi from "../../api/TicketApi";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteOrderDetail } from "./delete";

export default function OrderDetail() {
  const [orderdetails, setOrderDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, settickets] = useState([]);
  const [foodanddrinks, setfoodanddrinks] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [newOrderDetail, setNewOrderDetail] = useState({
    OrderId: "",
    TicketId: "",
    ItemId: "",
    Quantity: "",
    Price: "",
    Status: "Active",
  });

  useEffect(() => {
    // Lấy tất cả orderdetail
    OrderDetailApi.getAll()
      .then((res) => setOrderDetails(res.data.data))
      .catch((err) => console.error("Lỗi load orderdetails:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách orders
    OrderApi.getAll()
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.error("Lỗi load Orders:", err));

    // Lấy danh sách tickets
    TicketApi.getAll()
      .then((res) => settickets(res.data.data))
      .catch((err) => console.error("Lỗi load tickets:", err));
    // Lấy danh sách foodanddrinks
    FoodAndDrinkApi.getAll()
      .then((res) => setfoodanddrinks(res.data.data))
      .catch((err) => console.error("Lỗi load foodanddrinks:", err));
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

  const handleAddOrderDetail = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        OrderId: newOrderDetail.OrderId,
        TicketId: newOrderDetail.TicketId,
        ItemId: newOrderDetail.ItemId,
        Quantity: parseInt(newOrderDetail.Quantity),
        Price: parseFloat(newOrderDetail.Price),
        Status: newOrderDetail.Status,
      };

      const res = await OrderDetailApi.create(payload);
      const createdOrderDetail = res.data.data || res.data;

      setOrderDetails([...orderdetails, createdOrderDetail]);
      setNewOrderDetail({
        OrderId: "",
        TicketId: "",
        ItemId: "",
        Quantity: "",
        Price: "",
        Status: "Active",
      });
      setShowForm(false);
      showToast("success", "🎉 Thêm đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm order:", error);
      showToast("error", "❌ Thêm đơn hàng thất bại!");
    }
  };

  // Toggle trạng thái orderdetail
  const toggleStatus = (orderdetailId) => {
    setOrderDetails((prev) =>
      prev.map((orderdetail) =>
        orderdetail.OrderDetailId === orderdetailId
          ? {
              ...orderdetail,
              Status: orderdetail.Status === "Active" ? "Inactive" : "Active",
            }
          : orderdetail
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
                  <i className="fas fa-heart me-2"></i> Quản lý chi tiết đơn
                  hàng
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
                          <i className="fas fa-plus-circle"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm chi tiết đơn hàng</h4>
                          <p className="cinema-form-subtitle">
                            Thêm vé hoặc sản phẩm vào đơn hàng
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddOrderDetail}>
                        <div className="cinema-form-grid">
                          {/* Đơn hàng */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-shopping-cart"></i>
                              Đơn hàng
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrderDetail.OrderId}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  OrderId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn đơn hàng --</option>
                              {orders.map((o) => (
                                <option key={o.OrderId} value={o.OrderId}>
                                  🛒 {o.OrderId}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mã vé đặt */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-ticket-alt"></i>
                              Mã vé đặt
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrderDetail.TicketId}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  TicketId: e.target.value,
                                })
                              }
                            >
                              <option value="">🎫 Không chọn vé</option>
                              {tickets.map((t) => (
                                <option key={t.TicketId} value={t.TicketId}>
                                  🎟️ {t.TicketId}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Sản phẩm */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-popcorn"></i>
                              Sản phẩm (Bắp, nước)
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrderDetail.ItemId}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  ItemId: e.target.value,
                                })
                              }
                            >
                              <option value="">🍿 Không chọn sản phẩm</option>
                              {foodanddrinks.map((f) => (
                                <option key={f.ItemId} value={f.ItemId}>
                                  🥤 {f.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Số lượng */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-sort-numeric-up"></i>
                              Số lượng
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="VD: 2"
                              min="1"
                              value={newOrderDetail.Quantity}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  Quantity: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giá từng món */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-money-bill-wave"></i>
                              Giá từng món
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="VD: 50000"
                              min="0"
                              step="1000"
                              value={newOrderDetail.Price}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  Price: e.target.value,
                                })
                              }
                              required
                            />
                            {newOrderDetail.Price &&
                              newOrderDetail.Quantity && (
                                <div className="cinema-helper-text">
                                  <i className="fas fa-info-circle"></i>
                                  Thành tiền:{" "}
                                  <strong>
                                    {(
                                      parseInt(newOrderDetail.Price) *
                                      parseInt(newOrderDetail.Quantity)
                                    ).toLocaleString("vi-VN")}{" "}
                                    VNĐ
                                  </strong>
                                </div>
                              )}
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-toggle-on"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newOrderDetail.Status}
                              onChange={(e) =>
                                setNewOrderDetail({
                                  ...newOrderDetail,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">❌ Ngừng</option>
                            </select>
                          </div>

                          {/* Summary Box - Hiển thị khi có đủ thông tin */}
                          {newOrderDetail.OrderId &&
                            (newOrderDetail.TicketId ||
                              newOrderDetail.ItemId) &&
                            newOrderDetail.Quantity &&
                            newOrderDetail.Price && (
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
                                      Thông tin chi tiết
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
                                        className="fas fa-shopping-cart"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Đơn hàng:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newOrderDetail.OrderId}
                                      </strong>
                                    </p>
                                    {newOrderDetail.TicketId && (
                                      <p style={{ margin: "8px 0" }}>
                                        <i
                                          className="fas fa-ticket-alt"
                                          style={{
                                            color: "#f7931e",
                                            marginRight: "8px",
                                          }}
                                        ></i>
                                        Vé:{" "}
                                        <strong style={{ color: "#22c55e" }}>
                                          {newOrderDetail.TicketId}
                                        </strong>
                                      </p>
                                    )}
                                    {newOrderDetail.ItemId && (
                                      <p style={{ margin: "8px 0" }}>
                                        <i
                                          className="fas fa-popcorn"
                                          style={{
                                            color: "#f7931e",
                                            marginRight: "8px",
                                          }}
                                        ></i>
                                        Sản phẩm:{" "}
                                        <strong style={{ color: "#22c55e" }}>
                                          {
                                            foodanddrinks.find(
                                              (f) =>
                                                f.ItemId ===
                                                newOrderDetail.ItemId
                                            )?.Name
                                          }
                                        </strong>
                                      </p>
                                    )}
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-sort-numeric-up"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Số lượng:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newOrderDetail.Quantity}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-money-bill-wave"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Đơn giá:{" "}
                                      <strong style={{ color: "white" }}>
                                        {parseInt(
                                          newOrderDetail.Price
                                        ).toLocaleString("vi-VN")}{" "}
                                        VNĐ
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
                                        {(
                                          parseInt(newOrderDetail.Price) *
                                          parseInt(newOrderDetail.Quantity)
                                        ).toLocaleString("vi-VN")}{" "}
                                        VNĐ
                                      </strong>
                                    </p>
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
                                            newOrderDetail.Status === "Active"
                                              ? "#22c55e"
                                              : "#ef4444",
                                        }}
                                      >
                                        {newOrderDetail.Status === "Active"
                                          ? "✅ Hoạt động"
                                          : "❌ Ngừng"}
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
                            <i className="fas fa-save"></i>
                            Lưu chi tiết
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
                          <th>Đơn hàng</th>
                          <th>Vé đặt</th>
                          <th>Sản phẩm </th>
                          <th>Số lượng</th>
                          <th>Giá từng món</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderdetails.length > 0 ? (
                          orderdetails.map((orderdetail, index) => (
                            <tr key={orderdetail.OrderDetailId}>
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td>{orderdetail.OrderId.OrderId}</td>
                              <td>{orderdetail.TicketId.TicketId}</td>
                              <td>{orderdetail.ItemId.Name}</td>
                              <td>{orderdetail.Quantity}</td>
                              <td>{orderdetail.Price}</td>

                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={orderdetail.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(orderdetail.OrderDetailId)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    orderdetail.Status === "Active"
                                      ? "text-success"
                                      : orderdetail.Status === "Inactive"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {orderdetail.Status === "Active"
                                    ? "Hoạt động"
                                    : orderdetail.Status === "Inactive"
                                    ? "Khóa"
                                    : "Cấm"}
                                </span>
                              </td>

                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(
                                      `/orderdetails/show/${orderdetail.OrderDetailId}`
                                    )
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(
                                      `/orderdetails/edit/${orderdetail.OrderDetailId}`
                                    )
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteOrderDetail(
                                      orderdetail.OrderDetailId,
                                      setOrderDetails
                                    )
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
