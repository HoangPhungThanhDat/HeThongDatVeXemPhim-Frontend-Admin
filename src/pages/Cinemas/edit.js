import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import CinemasApi from "../../api/CinemasApi";
import Swal from "sweetalert2";

export default function CinemasEdit() {
  const { CinemaId } = useParams();
  const navigate = useNavigate();

  const [cinema, setCinema] = useState({
    CinemaId: "",
    Name: "",
    Address: "",
    City: "",
    Phone: "",
    Email: "",
    Status: "",
    ImageUrl: "",
    ImageFile: null,
    CreatedBy: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!CinemaId) {
          setError("Thiếu CinemaId trong URL");
          return;
        }
        setLoading(true);

        const cinemaRes = await CinemasApi.getById(CinemaId);
        const c = cinemaRes.data.data || cinemaRes.data;
        setCinema((prev) => ({
          ...prev,
          ...c,
          ImageFile: null,
        }));
      } catch (err) {
        console.error("❌ Lỗi load cinema:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu rạp.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CinemaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCinema((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCinema((prev) => ({
        ...prev,
        ImageFile: file,
        ImageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("Name", cinema.Name);
      formData.append("Address", cinema.Address);
      formData.append("City", cinema.City);
      formData.append("Phone", cinema.Phone);
      formData.append("Email", cinema.Email);
      formData.append("Status", cinema.Status);
      formData.append("CreatedBy", cinema.CreatedBy);

      if (cinema.ImageFile) {
        formData.append("ImageUrl", cinema.ImageFile);
      }

      await CinemasApi.update(CinemaId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật rạp chiếu thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/cinemas"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật rạp:", err.response?.data || err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật rạp thất bại!",
        showConfirmButton: false,
        timer: 3000,
      });
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
                Đang tải dữ liệu danh sách rạp chiếu ...
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
  if (!cinema) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-id-card-alt empty-icon"></i>
            <p className="empty-text">Không có dữ liệu rạp chiếu.</p>
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
            <span className="breadcrumb-item" onClick={() => navigate("/cinemas")}>
              Quản lý rạp
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Cập nhật rạp</span>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật rạp chiếu</h1>
                  <p className="section-subtitle">Chỉnh sửa thông tin chi tiết rạp chiếu phim</p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Tên rạp */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-theater-masks label-icon"></i>
                      Tên rạp
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Name"
                      value={cinema.Name}
                      onChange={handleChange}
                      placeholder="Nhập tên rạp chiếu"
                      required
                    />
                  </div>

                  {/* Địa chỉ & Thành phố */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-map-marker-alt label-icon"></i>
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        className="modern-input"
                        name="Address"
                        value={cinema.Address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-city label-icon"></i>
                        Thành phố
                      </label>
                      <input
                        type="text"
                        className="modern-input"
                        name="City"
                        value={cinema.City}
                        onChange={handleChange}
                        placeholder="Nhập thành phố"
                        required
                      />
                    </div>
                  </div>

                  {/* Số điện thoại & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-phone label-icon"></i>
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="modern-input"
                        name="Phone"
                        value={cinema.Phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
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
                        value={cinema.Email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  {/* Hình ảnh */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-image label-icon"></i>
                      Hình ảnh rạp
                    </label>
                    <input
                      type="file"
                      className="modern-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {cinema.ImageUrl && (
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img
                          src={cinema.ImageUrl}
                          alt="Cinema"
                          style={{
                            maxWidth: '200px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${cinema.Status === 'Active' ? 'active' : ''}`}
                        onClick={() => setCinema(prev => ({ ...prev, Status: 'Active' }))}
                      >
                        <div className="status-radio">
                          {cinema.Status === 'Active' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${cinema.Status === 'Inactive' ? 'active' : ''}`}
                        onClick={() => setCinema(prev => ({ ...prev, Status: 'Inactive' }))}
                      >
                        <div className="status-radio">
                          {cinema.Status === 'Inactive' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times-circle"></i>
                          </div>
                          <span className="status-label">Ngừng hoạt động</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/cinemas")}
                      className="btn-cinema btn-cancel"
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
                  Đảm bảo tất cả thông tin được điền chính xác để rạp chiếu hiển thị tốt nhất trên hệ thống.
                </p>
              </div>

              {/* Tips Card */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-check-circle"></i>
                  Gợi ý hữu ích
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Hình ảnh nên có kích thước tối thiểu 800x600px để hiển thị rõ nét</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Địa chỉ và số điện thoại chính xác giúp khách hàng dễ liên hệ</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Email nên sử dụng email chính thức của rạp chiếu</p>
                </div>
              </div>

              {/* Info Details */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin rạp
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Mã rạp:</span>
                    <span className="info-value">#{cinema.CinemaId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${cinema.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {cinema.Status === 'Active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Thành phố:</span>
                    <span className="info-value">{cinema.City || 'Chưa có'}</span>
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