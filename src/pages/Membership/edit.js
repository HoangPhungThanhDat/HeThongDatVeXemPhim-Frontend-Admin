// src/pages/Membership/MembershipEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import MembershipApi from "../../api/MembershipApi";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function MembershipEdit() {
  const { MembershipId } = useParams();
  const navigate = useNavigate();

  const [membership, setMembership] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMembership, resUsers] = await Promise.all([
          MembershipApi.getById(MembershipId),
          UserApi.getAll(),
        ]);
        setMembership(resMembership.data.data);
        setUsers(resUsers.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy membership:", err);
        setError("Không tải được dữ liệu membership!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [MembershipId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMembership((prev) => ({
      ...prev,
      [name]: name === "Points" ? parseInt(value) : value,
    }));
  };

  const showToast = (icon, message, onClose) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: { popup: "my-toast animated-toast" },
      willClose: onClose,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await MembershipApi.update(MembershipId, membership);
      showToast("success", "🎉 Cập nhật membership thành công!", () => {
        navigate("/membership");
      });
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      setError("Cập nhật membership thất bại!");
      showToast("error", "❌ Cập nhật membership thất bại!");
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
                membership="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu danh sách hội viên ...
              </h5>
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
        </div>
      </MainLayout>
    );
  }

  // Error
  if (error) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h5 className="error-title">{error}</h5>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt me-2"></i> Thử lại
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No data
  if (!membership) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-id-card-alt empty-icon"></i>
            <p className="empty-text">Không có dữ liệu membership.</p>
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
            <span className="breadcrumb-item" onClick={() => navigate('/membership')}>
              <i className="fas fa-id-card"></i>
              Membership
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">
              Chỉnh sửa #{MembershipId}
            </span>
          </nav>

          {/* Content Layout */}
          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              {/* Header */}
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Chỉnh sửa Membership</h1>
                  <p className="section-subtitle">Cập nhật thông tin hội viên #{MembershipId}</p>
                </div>
              </div>

              {/* Form Card */}
              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Level */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-layer-group label-icon"></i>
                      <span>Cấp độ</span>
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Level"
                      value={membership.Level || ""}
                      onChange={handleChange}
                      placeholder="VD: Gold, Silver, Bronze..."
                    />
                  </div>

                  {/* Points */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-star label-icon"></i>
                      <span>Điểm tích lũy</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Points"
                      value={membership.Points || 0}
                      onChange={handleChange}
                      placeholder="Nhập số điểm"
                    />
                  </div>

                  {/* User */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user label-icon"></i>
                      <span>Người dùng</span>
                    </label>
                    <select
                      className="modern-input"
                      name="UserId"
                      value={membership.UserId || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn người dùng --</option>
                      {users.map((u) => (
                        <option key={u.UserId} value={u.UserId}>
                          {u.FullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar-alt label-icon"></i>
                      <span>Ngày bắt đầu</span>
                    </label>
                    <input
                      type="date"
                      className="modern-input"
                      name="StartDate"
                      value={membership.StartDate || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* End Date */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar-check label-icon"></i>
                      <span>Ngày kết thúc</span>
                    </label>
                    <input
                      type="date"
                      className="modern-input"
                      name="EndDate"
                      value={membership.EndDate || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Benefits */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-gift label-icon"></i>
                      <span>Quyền lợi</span>
                    </label>
                    <textarea
                      className="modern-input modern-textarea"
                      name="Benefits"
                      value={membership.Benefits || ""}
                      onChange={handleChange}
                      placeholder="Mô tả các quyền lợi của membership..."
                    ></textarea>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái</span>
                    </label>
                    <div className="status-selector">
                      <div 
                        className={`status-option ${membership.Status === 'Active' ? 'active' : ''}`}
                        onClick={() => setMembership({...membership, Status: 'Active'})}
                      >
                        <div className="status-radio">
                          {membership.Status === 'Active' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      <div 
                        className={`status-option ${membership.Status === 'Inactive' ? 'active' : ''}`}
                        onClick={() => setMembership({...membership, Status: 'Inactive'})}
                      >
                        <div className="status-radio">
                          {membership.Status === 'Inactive' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times-circle"></i>
                          </div>
                          <span className="status-label">Tạm ngưng</span>
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
                      onClick={() => navigate("/membership")}
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
                    <span className="info-key">ID Membership:</span>
                  <span className="info-value">{membership.MembershipId}</span>

                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        membership.Status === "Active"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {membership.Status === "Active"
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
                  <p>Chọn người dùng và phim từ danh sách có sẵn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Trạng thái "Hoạt động" cho phép hiển thị membership</p>
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