// src/pages/Notification/NotificationEdit.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import NotificationApi from "../../api/NotificationApi";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function NotificationEdit() {
  const { NotificationId } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    NotificationId: "",
    UserId: "",
    Title: "",
    Message: "",
    Type: "",
    IsRead: false,
    Status: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!NotificationId) {
          setError("Thiếu NotificationId trong URL");
          return;
        }

        setLoading(true);

        // gọi API song song
        const [notificationRes, userRes] = await Promise.all([
          NotificationApi.getById(NotificationId),
          UserApi.getAll(),
        ]);

        const n = notificationRes.data.data || notificationRes.data;
        setNotification(n);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load notification:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [NotificationId]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotification((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    NotificationApi.update(NotificationId, notification)
      .then(() => {
        // ✅ Thông báo thành công trước
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật thông báo thành công!",
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
          // 👉 Sau khi toast biến mất mới điều hướng
          navigate("/notification");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật thông báo:", err);

        // ❌ Thông báo lỗi
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật thông báo thất bại!",
          showConfirmButton: false,
          timer: 3000,
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
        });
      });
  };

  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container role-show-container">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu thông báo...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
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
      </MainLayout>
    );
  }

  // ❌ Nếu có lỗi
  if (error) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!notification) {
    return (
      <MainLayout>
        <div className="text-center p-5 text-muted">
          <i className="fa fa-bell-slash fa-2x mb-2"></i>
          <p>Không có dữ liệu thông báo.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="main-container fade-in">
        <div className="container role-edit-container py-5">
          <div className="card edit-card shadow-lg border-0 rounded-4 animate-card">
            {/* Header */}
            <div className="card-header bg-gradient text-white text-center py-4 rounded-top-4 header-glow">
              <h3 className="mb-0 fw-bold">
                <i className="fas fa-bell me-2"></i>Cập nhật thông báo
              </h3>
            </div>

            {/* Body */}
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                {/* Người nhận */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-user me-2 text-primary"></i>Người nhận
                  </label>
                  <select
                    className="form-control form-select-lg"
                    name="UserId"
                    value={notification.UserId}
                    onChange={handleChange}
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

                {/* Loại thông báo */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-tag me-2 text-warning"></i>Loại thông báo
                  </label>
                  <select
                    className="form-control form-select-lg"
                    name="Type"
                    value={notification.Type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="System">Hệ thống</option>
                    <option value="Promotion">Khuyến mãi</option>
                    <option value="Order">Đơn hàng</option>
                  </select>
                </div>

                {/* Tiêu đề */}
                <div className="col-md-12">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-heading me-2 text-info"></i>Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="Title"
                    value={notification.Title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề thông báo"
                    required
                  />
                </div>

                {/* Nội dung */}
                <div className="col-md-12">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-align-left me-2 text-secondary"></i>Nội dung
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    name="Message"
                    value={notification.Message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung thông báo"
                    rows="5"
                    required
                  ></textarea>
                </div>

                {/* Trạng thái đọc */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-check-circle me-2 text-success"></i>Trạng thái đọc
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="IsRead"
                      id="isReadSwitch"
                      checked={notification.IsRead}
                      onChange={handleChange}
                      style={{ width: "1.25rem", height: "1.5rem" }}
                    />
                    <label className="form-check-label ms-2" htmlFor="isReadSwitch">
                      {notification.IsRead ? "Đã đọc" : "Chưa đọc"}
                    </label>
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2">
                    <i className="fas fa-toggle-on me-2 text-success"></i>Trạng thái
                  </label>
                  <select
                    className="form-control form-select-lg"
                    name="Status"
                    value={notification.Status}
                    onChange={handleChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Khóa</option>
                  </select>
                </div>

                {/* Nút hành động */}
                <div className="col-12 text-center mt-5">
                  <button
                    type="submit"
                    className="btn btn-gradient btn-xl px-5 me-4 shadow-lg action-btn"
                  >
                    <i className="fas fa-save me-2"></i>Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className="btn btn-secondary btn-xl px-5 shadow-lg action-btn cancel-btn"
                  >
                    <i className="fas fa-undo me-2"></i>Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}