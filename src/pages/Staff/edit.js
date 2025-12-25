import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import StaffApi from "../../api/StaffApi";
import CinemasApi from "../../api/CinemasApi";
import Swal from "sweetalert2";

export default function StaffEdit() {
  const { StaffId } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    StaffId: "",
    CinemaId: "",
    FullName: "",
    Email: "",
    Phone: "",
    Position: "",
    Status: "",
  });

  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!StaffId) {
          setError("Thiếu StaffId trong URL");
          return;
        }

        setLoading(true);

        const [staffRes, cinemaRes] = await Promise.all([
          StaffApi.getById(StaffId),
          CinemasApi.getAll(),
        ]);

        const s = staffRes.data.data || staffRes.data;
        setStaff(s);
        setCinemas(cinemaRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load staff:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [StaffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updateData = {
      CinemaId: staff.CinemaId?.CinemaId || staff.CinemaId,
      FullName: staff.FullName,
      Email: staff.Email,
      Phone: staff.Phone,
      Position: staff.Position,
      Status: staff.Status,
    };

    StaffApi.update(StaffId, updateData)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật nhân viên thành công!",
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
          navigate("/staffs");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật nhân viên:", err);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật nhân viên thất bại!",
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
          <div className="container role-show-container">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                membership="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu danh sách nhân viên ...
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
  if (!staff) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-id-card-alt empty-icon"></i>
            <p className="empty-text">Không có dữ liệu nhân viên.</p>
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
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i>
              Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={() => navigate("/staffs")}>
              Nhân viên
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          {/* Content */}
          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-user-edit"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập Nhật Nhân Viên</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin chi tiết của nhân viên
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Rạp chiếu */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-building label-icon"></i>
                      Rạp chiếu
                    </label>
                    <select
                      className="modern-input"
                      name="CinemaId"
                      value={staff.CinemaId?.CinemaId || staff.CinemaId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn rạp chiếu --</option>
                      {cinemas.map((c) => (
                        <option key={c.CinemaId} value={c.CinemaId}>
                          {c.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Họ tên */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user label-icon"></i>
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="FullName"
                      value={staff.FullName}
                      onChange={handleChange}
                      placeholder="Nhập họ tên đầy đủ"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-envelope label-icon"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="modern-input"
                      name="Email"
                      value={staff.Email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-phone label-icon"></i>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="modern-input"
                      name="Phone"
                      value={staff.Phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                    />
                  </div>

                  {/* Chức vụ */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-briefcase label-icon"></i>
                      Chức vụ
                    </label>
                    <select
                      className="modern-input"
                      name="Position"
                      value={staff.Position}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn chức vụ --</option>
                      <option value="Quản lý">Quản lý</option>
                      <option value="Soát vé">Soát vé</option>
                      <option value="Bán hàng">Bán hàng</option>
                      <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                      <option value="Lễ tân">Lễ tân</option>
                      <option value="Bảo vệ">Bảo vệ</option>
                    </select>
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${staff.Status === "Active" ? "active" : ""}`}
                        onClick={() => setStaff({ ...staff, Status: "Active" })}
                      >
                        <div className="status-radio">
                          {staff.Status === "Active" && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Đang làm việc</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${staff.Status === "Inactive" ? "active" : ""}`}
                        onClick={() => setStaff({ ...staff, Status: "Inactive" })}
                      >
                        <div className="status-radio">
                          {staff.Status === "Inactive" && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times-circle"></i>
                          </div>
                          <span className="status-label">Nghỉ việc</span>
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
                      onClick={() => navigate("/staffs")}
                      className="btn-cinema btn-cancel"
                    >
                      <i className="fas fa-times"></i>
                      <span>Hủy</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              {/* ID Card */}
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-id-card"></i>
                </div>
                <h3 className="info-title">Mã Nhân Viên</h3>
                <p className="info-text" style={{ fontSize: '20px', fontWeight: 'bold', color: '#f7931e' }}>
                  {staff.StaffId}
                </p>
              </div>

              {/* Current Info */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin hiện tại
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Họ tên</span>
                    <span className="info-value">{staff.FullName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Chức vụ</span>
                    <span className="info-value">{staff.Position}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái</span>
                    <span className={`status-pill ${staff.Status === "Active" ? "pill-active" : "pill-inactive"}`}>
                      {staff.Status === "Active" ? "Đang làm việc" : "Nghỉ việc"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-lightbulb"></i>
                  Gợi ý hữu ích
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Đảm bảo email và số điện thoại là chính xác để liên hệ</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn đúng rạp chiếu mà nhân viên đang làm việc</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Cập nhật trạng thái khi nhân viên nghỉ việc hoặc quay lại</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}