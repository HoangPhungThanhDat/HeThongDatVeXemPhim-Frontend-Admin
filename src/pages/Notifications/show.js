import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Show.css";
import NotificationApi from "../../api/NotificationApi";
import UserApi from "../../api/UserApi";

export default function NotificationShow() {
  const { NotificationId } = useParams();
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // gọi song song
        const [notificationRes, userRes] = await Promise.all([
          NotificationApi.getById(NotificationId),
          UserApi.getAll(),
        ]);
        setNotification(notificationRes.data.data || notificationRes.data);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin thông báo."
        );
      } finally {
        setLoading(false);
      }
    };
    if (NotificationId) fetchData();
  }, [NotificationId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || id;

  const getTypeLabel = (type) => {
    switch (type) {
      case "System":
        return "Hệ thống";
      case "Promotion":
        return "Khuyến mãi";
      case "Order":
        return "Đơn hàng";
      default:
        return type;
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
        return "bg-primary";
      case "Promotion":
        return "bg-warning";
      case "Order":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // ⏳ Loading đẹp hơn (có skeleton + spinner)
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="container user-show-container">
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

  // Error
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

  // Không có dữ liệu
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
      <main>
        <div className="main-container">
          <div className="container user-show-container">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <h5 className="user-info-title mb-4">Chi tiết thông báo</h5>

                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: "30%" }}>Mã thông báo</th>
                      <td>{notification.NotificationId}</td>
                    </tr>
                    <tr>
                      <th>Người nhận</th>
                      <td className="fw-semibold">
                        {getUserName(notification.UserId)}
                      </td>
                    </tr>
                    <tr>
                      <th>Tiêu đề</th>
                      <td className="fw-bold text-primary">
                        {notification.Title}
                      </td>
                    </tr>
                    <tr>
                      <th>Nội dung</th>
                      <td>
                        <div
                          className="p-3 bg-light rounded"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {notification.Message}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Loại thông báo</th>
                      <td>
                        <span
                          className={`badge ${getTypeBadgeClass(
                            notification.Type
                          )} px-3 py-2`}
                        >
                          {getTypeLabel(notification.Type)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Trạng thái đọc</th>
                      <td>
                        <span
                          className={`fw-semibold px-3 py-1 rounded-pill text-white ${
                            notification.IsRead ? "bg-success" : "bg-warning"
                          }`}
                        >
                          {notification.IsRead ? "Đã đọc" : "Chưa đọc"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Trạng thái</th>
                      <td>
                        <span
                          className={`fw-semibold px-3 py-1 rounded-pill text-white ${
                            notification.Status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {notification.Status === "Active"
                            ? "Hoạt động"
                            : "Khóa"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Ngày tạo</th>
                      <td>{notification.CreatedAt}</td>
                    </tr>
                    <tr>
                      <th>Ngày cập nhật</th>
                      <td>{notification.UpdatedAt}</td>
                    </tr>
                     <tr>
                      <th>Người tạo</th>
                      <td>{notification.CreatedBy}</td>
                    </tr>
                     <tr>
                      <th>Người cập nhật</th>
                      <td>{notification.UpdatedBy}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Nút hành động */}
                <div className="mt-4 action-btns d-flex">
                  <button
                    className="btn btn-edit me-3"
                    onClick={() =>
                      navigate(
                        `/notifications/edit/${notification.NotificationId}`
                      )
                    }
                  >
                    <i className="fa fa-edit me-2"></i> Chỉnh sửa
                  </button>
                  <button
                    className="btn btn-back"
                    onClick={() => navigate("/notifications")}
                  >
                    <i className="fa fa-arrow-left me-2"></i> Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
