// src/pages/User/UserEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/Edit.css";
import MainLayout from "../../layouts/MainLayout";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function UserEdit() {
  const { UserId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy user theo UserId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserApi.getById(UserId);
        setUser(res.data.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin người dùng."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [UserId]);

  // Xử lý input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === "RoleId" ? parseInt(value) : value,
    }));
  };

  // Thông báo toast
  const showToast = (icon, message, onClose) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
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
      willClose: onClose,
    });
  };

  // Submit cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Hiển thị loading
    Swal.fire({
      title: "Đang xử lý...",
      html: "Vui lòng chờ trong giây lát",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const payload = { ...user };
      if (!payload.PasswordHash) delete payload.PasswordHash;

      await UserApi.update(UserId, payload);

      Swal.close();
      showToast("success", "🎉 Cập nhật thành công!", () => {
        navigate("/user");
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      Swal.close();

      if (err.response) {
        setError(err.response.data.message || "Cập nhật thất bại!");
        showToast(
          "error",
          err.response.data.message || "❌ Cập nhật thất bại!"
        );
      } else if (err.request) {
        setError("Không nhận được phản hồi từ server!");
        showToast("error", "❌ Không kết nối được server!");
      } else {
        setError("Cập nhật thất bại!");
        showToast("error", "❌ Có lỗi xảy ra!");
      }
    }
  };

  // ⏳ Loading đẹp hơn (có skeleton + spinner)
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
              <h5 className="text-primary">Đang tải dữ liệu người dùng...</h5>
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

  // ❌ Nếu lỗi
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
  if (!user) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-user-slash fa-2x mb-2"></i>
              <p>Không có dữ liệu người dùng.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  // ✅ Main Form
  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20">
          <div className="cinema-user-edit">
            <div className="user-edit-container">
              <div className="edit-card">
                {/* Header */}
                <div className="edit-card-header">
                  <h3>
                    <i className="fas fa-user-edit"></i>
                    <span>Chỉnh Sửa Người Dùng</span>
                  </h3>
                </div>

                {/* Body */}
                <div className="edit-card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Row 1: Họ tên & Email */}
                    <div className="edit-form-row">
                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-user text-primary"></i>
                          <span>Họ và Tên</span>
                        </label>
                        <input
                          type="text"
                          className="edit-input"
                          name="FullName"
                          value={user.FullName || ""}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên đầy đủ"
                          required
                        />
                      </div>

                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-envelope text-danger"></i>
                          <span>Email</span>
                        </label>
                        <input
                          type="email"
                          className="edit-input"
                          name="Email"
                          value={user.Email || ""}
                          onChange={handleChange}
                          placeholder="example@cinema.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2: Số điện thoại & Ngày sinh */}
                    <div className="edit-form-row">
                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-phone text-success"></i>
                          <span>Số Điện Thoại</span>
                        </label>
                        <input
                          type="text"
                          className="edit-input"
                          name="PhoneNumber"
                          value={user.PhoneNumber || ""}
                          onChange={handleChange}
                          placeholder="0987 654 321"
                        />
                      </div>

                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-calendar-alt text-warning"></i>
                          <span>Ngày Sinh</span>
                        </label>
                        <input
                          type="date"
                          className="edit-input"
                          name="DateOfBirth"
                          value={user.DateOfBirth || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Row 3: Mật khẩu & Vai trò */}
                    <div className="edit-form-row">
                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-lock text-dark"></i>
                          <span>Mật Khẩu Mới</span>
                        </label>
                        <input
                          type="password"
                          className="edit-input"
                          name="PasswordHash"
                          value={user.PasswordHash || ""}
                          onChange={handleChange}
                          placeholder="••••••••"
                          maxLength="8"
                        />
                        <small className="edit-helper-text">
                          💡 Để trống nếu không muốn thay đổi mật khẩu (Tối đa 8
                          ký tự)
                        </small>
                      </div>

                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-user-shield text-dark"></i>
                          <span>Vai Trò</span>
                        </label>
                        <select
                          className="edit-select"
                          name="RoleId"
                          value={user.RoleId || 2}
                          onChange={handleChange}
                        >
                          <option value={2}>👤 User - Người dùng</option>
                          <option value={1}>👑 Admin - Quản trị viên</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Giới tính & Trạng thái */}
                    <div className="edit-form-row">
                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-venus-mars text-info"></i>
                          <span>Giới Tính</span>
                        </label>
                        <select
                          className="edit-select"
                          name="Gender"
                          value={user.Gender || "Male"}
                          onChange={handleChange}
                        >
                          <option value="Male">👨 Nam</option>
                          <option value="Female">👩 Nữ</option>
                          <option value="Other">🌈 Khác</option>
                        </select>
                      </div>

                      <div className="edit-form-group">
                        <label className="edit-form-label">
                          <i className="fas fa-toggle-on text-success"></i>
                          <span>Trạng Thái</span>
                        </label>
                        <select
                          className="edit-select"
                          name="Status"
                          value={user.Status || "Active"}
                          onChange={handleChange}
                        >
                          <option value="Active">✅ Hoạt động</option>
                          <option value="Inactive">⏸️ Tạm khóa</option>
                          <option value="Banned">🚫 Đã cấm</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="edit-actions">
                      <button type="submit" className="edit-btn edit-btn-save">
                        <i className="fas fa-save"></i>
                        <span>Lưu Thay Đổi</span>
                      </button>
                      <button
                        type="button"
                        className="edit-btn edit-btn-cancel"
                        onClick={() => navigate("/user")}
                      >
                        <i className="fas fa-times-circle"></i>
                        <span>Hủy Bỏ</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
