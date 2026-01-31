// src/pages/User/UserEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/Role/Edit.css";
import MainLayout from "../../layouts/MainLayout";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function UserEdit() {
  const { UserId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm chuyển đổi format ngày từ d-m-Y sang yyyy-MM-dd (cho input type="date")
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // Input: "08-12-2004" (d-m-Y)
    // Output: "2004-12-08" (yyyy-MM-dd)
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  // Lấy user theo UserId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserApi.getById(UserId);
        const userData = res.data.data;
        // Chuyển đổi format ngày khi nhận từ API
        if (userData.DateOfBirth) {
          userData.DateOfBirth = formatDateForInput(userData.DateOfBirth);
        }
        setUser(userData);
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

  // Submit cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = { ...user };
      if (!payload.PasswordHash) delete payload.PasswordHash;
      
      // ✅ KHÔNG CẦN CHUYỂN ĐỔI DateOfBirth
      // Vì input type="date" đã trả về format yyyy-MM-dd (ví dụ: 2004-12-08)
      // Laravel sẽ tự động chấp nhận format Y-m-d này

      console.log("📤 Payload gửi lên server:", payload);

      await UserApi.update(UserId, payload);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật người dùng thành công!",
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
        navigate("/user");
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      console.error("📛 Response data:", err.response?.data);
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật người dùng thất bại!",
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
            <span className="breadcrumb-item" onClick={() => navigate("/user")}>
              Người dùng
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
                  <i className="fas fa-user-edit"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Người Dùng</h2>
                  <p className="section-subtitle">Cập nhật thông tin người dùng hệ thống</p>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-user label-icon"></i>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="FullName"
                    value={user.FullName || ""}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-envelope label-icon"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    className="modern-input"
                    name="Email"
                    value={user.Email || ""}
                    onChange={handleChange}
                    placeholder="example@cinema.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-phone label-icon"></i>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="PhoneNumber"
                    value={user.PhoneNumber || ""}
                    onChange={handleChange}
                    placeholder="0987 654 321"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-calendar-alt label-icon"></i>
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    className="modern-input"
                    name="DateOfBirth"
                    value={user.DateOfBirth || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-lock label-icon"></i>
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="modern-input"
                    name="PasswordHash"
                    value={user.PasswordHash || ""}
                    onChange={handleChange}
                    placeholder="••••••••"
                    maxLength="8"
                  />
                  <small style={{fontSize: '12px', color: '#6c757d', marginTop: '5px', display: 'block'}}>
                    💡 Để trống nếu không muốn thay đổi mật khẩu (Tối đa 8 ký tự)
                  </small>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-user-shield label-icon"></i>
                    Vai trò
                  </label>
                  <select
                    className="modern-input"
                    name="RoleId"
                    value={user.RoleId || 2}
                    onChange={handleChange}
                  >
                    <option value={2}>👤 User - Người dùng</option>
                    <option value={1}>👑 Admin - Quản trị viên</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-venus-mars label-icon"></i>
                    Giới tính
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${user.Gender === 'Male' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Gender: 'Male'})}
                    >
                      <div className="status-radio">
                        {user.Gender === 'Male' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-mars"></i>
                        </div>
                        <span className="status-label">Nam</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${user.Gender === 'Female' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Gender: 'Female'})}
                    >
                      <div className="status-radio">
                        {user.Gender === 'Female' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-venus"></i>
                        </div>
                        <span className="status-label">Nữ</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${user.Gender === 'Other' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Gender: 'Other'})}
                    >
                      <div className="status-radio">
                        {user.Gender === 'Other' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                          <i className="fas fa-genderless"></i>
                        </div>
                        <span className="status-label">Khác</span>
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
                      className={`status-option ${user.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {user.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${user.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {user.Status === 'Inactive' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-pause-circle"></i>
                        </div>
                        <span className="status-label">Tạm khóa</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${user.Status === 'Banned' ? 'active' : ''}`}
                      onClick={() => setUser({...user, Status: 'Banned'})}
                    >
                      <div className="status-radio">
                        {user.Status === 'Banned' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                          <i className="fas fa-ban"></i>
                        </div>
                        <span className="status-label">Đã cấm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cinema btn-cancel"
                    onClick={() => navigate("/user")}
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
                  Việc thay đổi thông tin người dùng sẽ ảnh hưởng trực tiếp đến quyền truy cập và dữ liệu cá nhân trong hệ thống. 
                  Vui lòng kiểm tra kỹ trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin người dùng</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tên hiện tại:</span>
                    <span className="info-value">{user.FullName || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Email:</span>
                    <span className="info-value">{user.Email || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Vai trò:</span>
                    <span className="info-value">{user.RoleId === 1 ? 'Admin' : 'User'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${
                      user.Status === 'Active' ? 'pill-active' : 
                      user.Status === 'Inactive' ? 'pill-inactive' : 
                      'pill-inactive'
                    }`}>
                      {user.Status === 'Active' ? 'Hoạt động' : 
                       user.Status === 'Inactive' ? 'Tạm khóa' : 'Đã cấm'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Kiểm tra email và số điện thoại trước khi lưu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Mật khẩu để trống nếu không muốn thay đổi</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Cân nhắc kỹ khi thay đổi vai trò và trạng thái</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}