import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import RoleApi from "../../api/RoleApi";
import Swal from "sweetalert2";
import "../../styles/Role/Edit.css";

export default function RoleEdit() {
  const { RoleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState({
    RoleName: "",
    Description: "",
    Status: "",
  });

  useEffect(() => {
    if (RoleId) {
      RoleApi.getById(RoleId)
        .then((res) => {
          setRole(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lấy dữ liệu role:", err);
          setError("Không thể tải dữ liệu vai trò!");
          setLoading(false);
        });
    }
  }, [RoleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    RoleApi.update(RoleId, role)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật vai trò thành công!",
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
          navigate("/role");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật vai trò:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật vai trò thất bại!",
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
              <h5 className="text-primary">Đang tải dữ liệu phân quyền...</h5>
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
  if (!role) {
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
            <span className="breadcrumb-item" onClick={() => navigate("/role")}>
              Vai trò
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
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Vai Trò</h2>
                  <p className="section-subtitle">Cập nhật thông tin vai trò hệ thống</p>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-tag label-icon"></i>
                    Tên vai trò
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="RoleName"
                    value={role.RoleName}
                    onChange={handleChange}
                    placeholder="Nhập tên vai trò"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-align-left label-icon"></i>
                    Mô tả
                  </label>
                  <textarea
                    className="modern-input modern-textarea"
                    name="Description"
                    value={role.Description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả chi tiết về vai trò"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-power-off label-icon"></i>
                    Trạng thái
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${role.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setRole({...role, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {role.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${role.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setRole({...role, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {role.Status === 'Inactive' && <div className="status-dot"></div>}
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
                    onClick={() => navigate("/role")}
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
                  Việc thay đổi vai trò sẽ ảnh hưởng trực tiếp đến quyền truy cập của người dùng trong hệ thống. 
                  Vui lòng kiểm tra kỹ trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin vai trò</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tên hiện tại:</span>
                    <span className="info-value">{role.RoleName || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${role.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {role.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Tên vai trò nên ngắn gọn và dễ hiểu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Mô tả chi tiết giúp quản lý dễ dàng hơn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Kiểm tra kỹ trước khi thay đổi trạng thái</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}