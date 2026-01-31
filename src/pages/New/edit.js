import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import NewsApi from "../../api/NewApi";
import Swal from "sweetalert2";

export default function NewsEdit() {
  const { NewsId } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState({
    NewsId: "",
    UserId: "",
    Title: "",
    Slug: "",
    Content: "",
    ImageUrl: "",
    Status: "Draft",
    ImageFile: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tạo slug từ Title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!NewsId) {
          setError("Thiếu NewsId trong URL");
          return;
        }
        setLoading(true);

        const newsRes = await NewsApi.getById(NewsId);
        const n = newsRes.data.data || newsRes.data;
        setNews((prev) => ({
          ...prev,
          ...n,
          ImageFile: null,
        }));
      } catch (err) {
        console.error("❌ Lỗi load tin tức:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu tin tức.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [NewsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu thay đổi Title, tự động cập nhật Slug
    if (name === "Title") {
      setNews((prev) => ({ 
        ...prev, 
        Title: value,
        Slug: generateSlug(value)
      }));
    } else {
      setNews((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNews((prev) => ({
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
      
      // Lấy UserId từ localStorage
      const userId = localStorage.getItem("UserId");
      
      console.log("📤 Dữ liệu gửi đi:", {
        UserId: userId || news.UserId,
        Title: news.Title,
        Slug: news.Slug,
        Content: news.Content,
        Status: news.Status,
        HasImageFile: !!news.ImageFile
      });
      
      formData.append("_method", "PUT");
      formData.append("UserId", userId || news.UserId);
      formData.append("Title", news.Title);
      formData.append("Slug", news.Slug);
      formData.append("Content", news.Content);
      formData.append("Status", news.Status);

      if (news.ImageFile) {
        formData.append("ImageUrl", news.ImageFile);
      }

      const res = await NewsApi.update(NewsId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Response:", res);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật tin tức thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/news"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật tin tức:", err.response?.data || err);
      console.error("❌ Chi tiết lỗi:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        errors: err.response?.data?.errors
      });
      
      // Hiển thị lỗi chi tiết
      const errorMessage = err.response?.data?.message || "Cập nhật tin tức thất bại!";
      const errors = err.response?.data?.errors;
      
      let errorDetail = errorMessage;
      if (errors) {
        const errorList = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        errorDetail = `${errorMessage}\n\n${errorList}`;
      }
      
      Swal.fire({
        icon: "error",
        title: "❌ Lỗi cập nhật",
        text: errorDetail,
        showConfirmButton: true,
      });
    }
  };

  // Helper function to get status display info
  const getStatusInfo = (status) => {
    switch(status) {
      case "Published":
        return { label: "Đã xuất bản", class: "pill-active", icon: "fa-check-circle" };
      case "Draft":
        return { label: "Nháp", class: "pill-warning", icon: "fa-edit" };
      case "Hidden":
        return { label: "Đã ẩn", class: "pill-inactive", icon: "fa-eye-slash" };
      default:
        return { label: "Không xác định", class: "pill-inactive", icon: "fa-question-circle" };
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
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
                <h5 className="text-primary">
                  Đang tải dữ liệu tin tức...
                </h5>
                <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

                {/* Skeleton */}
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
  if (!news) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-newspaper empty-icon"></i>
            <p className="empty-text">Không có dữ liệu tin tức.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(news.Status);

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
            <span className="breadcrumb-item" onClick={() => navigate("/news")}>
              Quản lý tin tức
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Cập nhật tin tức</span>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật tin tức</h1>
                  <p className="section-subtitle">Chỉnh sửa thông tin chi tiết bài viết</p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Tiêu đề */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-heading label-icon"></i>
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Title"
                      value={news.Title}
                      onChange={handleChange}
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>

                  {/* Slug - Auto generated */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-link label-icon"></i>
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Slug"
                      value={news.Slug}
                      onChange={handleChange}
                      placeholder="slug-tu-dong-tao"
                      style={{ 
                        backgroundColor: 'rgba(100, 116, 139, 0.1)',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                      }}
                    />
                    <small style={{ color: '#94a3b8', marginTop: '8px', display: 'block' }}>
                      <i className="fas fa-info-circle"></i> Slug được tạo tự động từ tiêu đề
                    </small>
                  </div>

                  {/* Nội dung */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-align-left label-icon"></i>
                      Nội dung bài viết
                    </label>
                    <textarea
                      className="modern-input modern-textarea"
                      name="Content"
                      value={news.Content || ""}
                      onChange={handleChange}
                      placeholder="Nhập nội dung chi tiết bài viết..."
                      rows="10"
                      style={{ minHeight: "250px" }}
                      required
                    />
                  </div>

                  {/* Hình ảnh */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-image label-icon"></i>
                      Hình ảnh
                    </label>
                    <input
                      type="file"
                      className="modern-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {news.ImageUrl && (
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img
                          src={news.ImageUrl}
                          alt="preview"
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status - 3 options */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái tin tức
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                      {/* Nháp */}
                      <div 
                        className={`status-option ${news.Status === 'Draft' ? 'active' : ''}`}
                        onClick={() => setNews(prev => ({ ...prev, Status: 'Draft' }))}
                      >
                        <div className="status-radio">
                          {news.Status === 'Draft' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>
                            <i className="fas fa-edit"></i>
                          </div>
                          <span className="status-label">Nháp</span>
                        </div>
                      </div>

                      {/* Đã xuất bản */}
                      <div 
                        className={`status-option ${news.Status === 'Published' ? 'active' : ''}`}
                        onClick={() => setNews(prev => ({ ...prev, Status: 'Published' }))}
                      >
                        <div className="status-radio">
                          {news.Status === 'Published' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Đã xuất bản</span>
                        </div>
                      </div>

                      {/* Đã ẩn */}
                      <div 
                        className={`status-option ${news.Status === 'Hidden' ? 'active' : ''}`}
                        onClick={() => setNews(prev => ({ ...prev, Status: 'Hidden' }))}
                      >
                        <div className="status-radio">
                          {news.Status === 'Hidden' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                            <i className="fas fa-eye-slash"></i>
                          </div>
                          <span className="status-label">Đã ẩn</span>
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
                      onClick={() => navigate("/news")} 
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
                  Đảm bảo tiêu đề và nội dung rõ ràng, hình ảnh chất lượng cao để thu hút người đọc.
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
                  <p>Tiêu đề nên ngắn gọn, hấp dẫn và chứa từ khóa quan trọng</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Hình ảnh nên có kích thước tối thiểu 800x600px</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Nội dung nên được phân đoạn rõ ràng, dễ đọc</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Trạng thái "Nháp" cho bài viết chưa hoàn thiện</p>
                </div>
              </div>

              {/* Info Details */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin tin tức
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Mã tin tức:</span>
                    <span className="info-value">#{news.NewsId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${statusInfo.class}`}>
                      <i className={`fas ${statusInfo.icon} me-1`}></i>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Slug:</span>
                    <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      {news.Slug}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Ngày tạo:</span>
                    <span className="info-value">
                      {news.CreatedAt ? new Date(news.CreatedAt).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Cập nhật lần cuối:</span>
                    <span className="info-value">
                      {news.UpdatedAt ? new Date(news.UpdatedAt).toLocaleDateString('vi-VN') : 'Chưa có'}
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