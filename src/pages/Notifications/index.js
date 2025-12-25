import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import NotificationApi from "../../api/NotificationApi";
import UserApi from "../../api/UserApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteNotification } from "./delete";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    UserId: "",
    Title: "",
    Message: "",
    Type: "",
    IsRead: false,
    Status: "",
  });

  useEffect(() => {
    // Lấy tất cả notification
    NotificationApi.getAll()
      .then((res) => {
        setNotifications(res.data.data);
      })
      .catch((err) => console.error("Lỗi load notification:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách user
    UserApi.getAll()
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Lỗi load users:", err));
  }, []);

  const handleAddNotification = async (e) => {
    e.preventDefault();
    try {
      const res = await NotificationApi.create(newNotification);
      const createdNotification = res.data.data || res.data;

      setNotifications([...notifications, createdNotification]);

      // reset form
      setNewNotification({
        UserId: "",
        Title: "",
        Message: "",
        Type: "",
        IsRead: false,
        Status: "",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm thông báo thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm notification:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  };

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

  const toggleStatus = async (NotificationId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const notification = notifications.find(
        (n) => n.NotificationId === NotificationId
      );

      await NotificationApi.update(NotificationId, {
        UserId: notification.UserId,
        Title: notification.Title,
        Message: notification.Message,
        Type: notification.Type,
        IsRead: notification.IsRead,
        Status: newStatus,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.NotificationId === NotificationId ? { ...n, Status: newStatus } : n
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };

  const toggleIsRead = async (NotificationId, currentIsRead) => {
    const newIsRead = !currentIsRead;

    try {
      const notification = notifications.find(
        (n) => n.NotificationId === NotificationId
      );

      await NotificationApi.update(NotificationId, {
        UserId: notification.UserId,
        Title: notification.Title,
        Message: notification.Message,
        Type: notification.Type,
        IsRead: newIsRead,
        Status: notification.Status,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.NotificationId === NotificationId ? { ...n, IsRead: newIsRead } : n
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái đọc:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái đọc!");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "System":
        return "fa-cog";
      case "Promotion":
        return "fa-bullhorn";
      case "Order":
        return "fa-shopping-cart";
      default:
        return "fa-bell";
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "System":
        return "badge bg-primary";
      case "Promotion":
        return "badge bg-warning";
      case "Order":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-bell me-2"></i> Quản lý thông báo
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
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-plus-circle me-2"></i> Thêm thông
                        báo mới
                      </h4>

                      <form onSubmit={handleAddNotification}>
                        <div className="row g-4">
                          {/* Người nhận */}
                          <div className="col-md-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-user"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newNotification.UserId}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    UserId: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="">-- Chọn người nhận --</option>
                                {users.map((u) => (
                                  <option key={u.UserId} value={u.UserId}>
                                    {u.FullName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Loại thông báo */}
                          <div className="col-md-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-tag"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newNotification.Type}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    Type: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="">-- Loại thông báo --</option>
                                <option value="System">Hệ thống</option>
                                <option value="Promotion">Khuyến mãi</option>
                                <option value="Order">Đơn hàng</option>
                              </select>
                            </div>
                          </div>

                          {/* Tiêu đề */}
                          <div className="col-md-12">
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-heading"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tiêu đề thông báo"
                                value={newNotification.Title}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    Title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Nội dung */}
                          <div className="col-md-12">
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-align-left"></i>
                              </span>
                              <textarea
                                className="form-control"
                                placeholder="Nhập nội dung thông báo"
                                rows="4"
                                value={newNotification.Message}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    Message: e.target.value,
                                  })
                                }
                                required
                              ></textarea>
                            </div>
                          </div>

                          {/* Trạng thái đọc */}
                          <div className="col-md-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="isReadCheck"
                                checked={newNotification.IsRead}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    IsRead: e.target.checked,
                                  })
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="isReadCheck"
                              >
                                <i className="fas fa-check-circle me-1"></i> Đã
                                đọc
                              </label>
                            </div>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-toggle-on"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newNotification.Status}
                                onChange={(e) =>
                                  setNewNotification({
                                    ...newNotification,
                                    Status: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="">-- Trạng thái --</option>
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Khóa</option>
                              </select>
                            </div>
                          </div>

                          {/* Nút hành động */}
                          <div className="col-12 text-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="btn btn-gradient-success me-2 rounded-pill px-4"
                            >
                              <i className="fas fa-save me-1"></i> Lưu
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="btn btn-gradient-secondary rounded-pill px-4"
                              onClick={() => setShowForm(false)}
                            >
                              <i className="fas fa-times me-1"></i> Hủy
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">ID</th>
                          <th>Người nhận</th>
                          <th>Tiêu đề</th>
                          <th>Loại</th>
                          <th>Đã đọc</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && notifications.length > 0
                          ? notifications.map((notification, index) => (
                              <tr
                                key={notification.NotificationId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                 
                                  {users.find(
                                    (u) => u.UserId === notification.UserId
                                  )?.FullName || notification.UserId}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
          
                                    <span className="fw-semibold">
                                      {notification.Title}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={getTypeBadgeClass(
                                      notification.Type
                                    )}
                                  >
                                    {notification.Type === "System"
                                      ? "Hệ thống"
                                      : notification.Type === "Promotion"
                                      ? "Khuyến mãi"
                                      : "Đơn hàng"}
                                  </span>
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={notification.IsRead}
                                      onChange={() =>
                                        toggleIsRead(
                                          notification.NotificationId,
                                          notification.IsRead
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      notification.IsRead
                                        ? "text-success"
                                        : "text-warning"
                                    }`}
                                  >
                                    {notification.IsRead
                                      ? "Đã đọc"
                                      : "Chưa đọc"}
                                  </span>
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={notification.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(
                                          notification.NotificationId,
                                          notification.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      notification.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {notification.Status === "Active"
                                      ? "Hoạt động"
                                      : "Khóa"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/notifications/show/${notification.NotificationId}`
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
                                        `/notifications/edit/${notification.NotificationId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteNotification(
                                        notification.NotificationId,
                                        setNotifications
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
                          : // Loading skeleton
                            [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td colSpan="7" className="py-3">
                                  <div className="skeleton w-100 h-20"></div>
                                </td>
                              </tr>
                            ))}
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