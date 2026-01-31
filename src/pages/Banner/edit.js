import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import BannerApi from "../../api/BannerApi";
import UserApi from "../../api/UserApi";
import Swal from "sweetalert2";

export default function BannerEdit() {
  const { BannerId } = useParams();
  const navigate = useNavigate();

  const [banner, setBanner] = useState({
    BannerId: "",
    UserId: "",
    Title: "",
    ImageUrl: "",
    LinkUrl: "",
    Position: "",
    Status: "",
    ImageFile: null,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👇 GIỮ NGUYÊN LOGIC CŨ
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!BannerId) {
          setError("Thiếu BannerId trong URL");
          return;
        }
        setLoading(true);
        const currentUserId = localStorage.getItem("UserId") || "";

        const [bannerRes, userRes] = await Promise.all([
          BannerApi.getById(BannerId),
          UserApi.getAll(),
        ]);
        const b = bannerRes.data.data || bannerRes.data;
        setBanner((prev) => ({
          ...prev,
          ...b,
          UserId: currentUserId,
          ImageFile: null,
        }));
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load banner:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BannerId]);

  // 👇 GIỮ NGUYÊN LOGIC CŨ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner((prev) => ({
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

      formData.append("UserId", banner.UserId);
      formData.append("Title", banner.Title);
      formData.append("LinkUrl", banner.LinkUrl || "");
      formData.append("Position", banner.Position);
      formData.append("Status", banner.Status);

      if (banner.ImageFile) {
        formData.append("ImageUrl", banner.ImageFile);
      }

      for (let [k, v] of formData.entries()) {
        console.log(k + ":", v);
      }

      const res = await BannerApi.update(BannerId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật banner thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/banner"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật banner:", err.response?.data || err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật banner thất bại!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  // Helper functions
  const getStatusInfo = (status) => {
    switch (status) {
      case "Active":
        return { label: "Hoạt động", class: "pill-active", icon: "fa-check-circle" };
      case "Inactive":
        return { label: "Không hoạt động", class: "pill-inactive", icon: "fa-times-circle" };
      default:
        return { label: "Không xác định", class: "pill-inactive", icon: "fa-question-circle" };
    }
  };

  // 👇 CHỈ THAY ĐỔI GIAO DIỆN TỪ ĐÂY
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
                <h5 className="text-primary">Đang tải dữ liệu banner...</h5>
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

  if (!banner) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-image empty-icon"></i>
            <p className="empty-text">Không có dữ liệu banner.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(banner.Status);

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
            <span className="breadcrumb-item" onClick={() => navigate("/banner")}>
              Quản lý banner
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Cập nhật banner</span>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-image"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật banner</h1>
                  <p className="section-subtitle">Chỉnh sửa thông tin chi tiết banner</p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Tiêu đề */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-heading label-icon"></i>
                      Tiêu đề banner
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Title"
                      value={banner.Title}
                      onChange={handleChange}
                      placeholder="Nhập tiêu đề banner"
                      required
                    />
                  </div>

                  {/* Vị trí & Liên kết */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-map-marker-alt label-icon"></i>
                        Vị trí hiển thị
                      </label>
                      <select
                        className="modern-input"
                        name="Position"
                        value={banner.Position}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Chọn vị trí --</option>
                        <option value="Home">Trang chủ</option>
                        <option value="MoviePage">Trang phim</option>
                        <option value="PromotionPage">Trang khuyến mãi</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-link label-icon"></i>
                        Liên kết (URL)
                      </label>
                      <input
                        type="text"
                        className="modern-input"
                        name="LinkUrl"
                        value={banner.LinkUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Hình ảnh Banner */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-image label-icon"></i>
                      Hình ảnh banner
                    </label>
                    <input
                      type="file"
                      className="modern-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {banner.ImageUrl && (
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img
                          src={banner.ImageUrl}
                          alt="banner preview"
                          style={{
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status - 2 options */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái banner
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                      {/* Active */}
                      <div
                        className={`status-option ${banner.Status === 'Active' ? 'active' : ''}`}
                        onClick={() => setBanner(prev => ({ ...prev, Status: 'Active' }))}
                      >
                        <div className="status-radio">
                          {banner.Status === 'Active' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      {/* Inactive */}
                      <div
                        className={`status-option ${banner.Status === 'Inactive' ? 'active' : ''}`}
                        onClick={() => setBanner(prev => ({ ...prev, Status: 'Inactive' }))}
                      >
                        <div className="status-radio">
                          {banner.Status === 'Inactive' && <div className="status-dot"></div>}
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

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/banner")}
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
                  Đảm bảo banner có kích thước phù hợp và nội dung rõ ràng để thu hút người dùng.
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
                  <p>Banner nên có kích thước tối thiểu 1920x600px cho desktop</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Sử dụng hình ảnh chất lượng cao, định dạng JPG hoặc PNG</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Thêm liên kết để chuyển hướng người dùng khi click vào banner</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Chọn vị trí hiển thị phù hợp với mục đích banner</p>
                </div>
              </div>

              {/* Info Details */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin banner
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Mã banner:</span>
                    <span className="info-value">#{banner.BannerId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${statusInfo.class}`}>
                      <i className={`fas ${statusInfo.icon} me-1`}></i>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Vị trí:</span>
                    <span className="info-value">
                      {banner.Position === 'Home' ? 'Trang chủ' : 
                       banner.Position === 'MoviePage' ? 'Trang phim' : 
                       banner.Position === 'PromotionPage' ? 'Trang khuyến mãi' : 
                       banner.Position}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Người tạo:</span>
                    <span className="info-value">
                      {localStorage.getItem("fullname") || "N/A"}
                    </span>
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