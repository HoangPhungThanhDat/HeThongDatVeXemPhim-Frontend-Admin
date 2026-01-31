import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Role/Edit.css";
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
          navigate("/notifications");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật thông báo:", err);
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
          <div className="pd-ltr-20">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu thông báo...</h5>
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
      </MainLayout>
    );
  }

  // ❌ Nếu có lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
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
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!notification) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-bell-slash fa-2x mb-2"></i>
              <p>Không có dữ liệu thông báo.</p>
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
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i> Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={() => navigate("/notifications")}>
              Thông báo
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </div>

          {/* Main Content */}
          <div className="content-wrapper">
            {/* Left Column - Form */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Thông Báo</h2>
                  <p className="section-subtitle">Cập nhật thông tin thông báo hệ thống</p>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-heading label-icon"></i>
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Title"
                    value={notification.Title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề thông báo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-align-left label-icon"></i>
                    Nội dung
                  </label>
                  <textarea
                    className="modern-input modern-textarea"
                    name="Message"
                    value={notification.Message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung thông báo"
                    rows="5"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-user label-icon"></i>
                    Người nhận
                  </label>
                  <select
                    className="modern-input"
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

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-tag label-icon"></i>
                    Loại thông báo
                  </label>
                  <select
                    className="modern-input"
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

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-check-circle label-icon"></i>
                    Trạng thái đọc
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${notification.IsRead ? 'active' : ''}`}
                      onClick={() => setNotification({...notification, IsRead: true})}
                    >
                      <div className="status-radio">
                        {notification.IsRead && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Đã đọc</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${!notification.IsRead ? 'active' : ''}`}
                      onClick={() => setNotification({...notification, IsRead: false})}
                    >
                      <div className="status-radio">
                        {!notification.IsRead && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <span className="status-label">Chưa đọc</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-power-off label-icon"></i>
                    Trạng thái
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${notification.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setNotification({...notification, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {notification.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${notification.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setNotification({...notification, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {notification.Status === 'Inactive' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <span className="status-label">Không hoạt động</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cinema btn-cancel"
                    onClick={() => navigate("/notifications")}
                  >
                    <i className="fas fa-times"></i>
                    Hủy bỏ
                  </button>
                  <button 
                    type="button" 
                    className="btn-cinema btn-save"
                    onClick={handleSubmit}
                  >
                    <i className="fas fa-check"></i>
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="info-section">
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h4 className="info-title">Lưu ý quan trọng</h4>
                <p className="info-text">
                  Việc thay đổi thông báo sẽ ảnh hưởng trực tiếp đến thông tin người dùng nhận được. 
                  Vui lòng kiểm tra kỹ nội dung trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin thông báo</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tiêu đề hiện tại:</span>
                    <span className="info-value">{notification.Title || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Loại:</span>
                    <span className="info-value">
                      {notification.Type === 'System' ? 'Hệ thống' : 
                       notification.Type === 'Promotion' ? 'Khuyến mãi' : 
                       notification.Type === 'Order' ? 'Đơn hàng' : notification.Type}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${notification.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {notification.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Tiêu đề nên ngắn gọn và thu hút</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nội dung rõ ràng, dễ hiểu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn đúng loại thông báo phù hợp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}