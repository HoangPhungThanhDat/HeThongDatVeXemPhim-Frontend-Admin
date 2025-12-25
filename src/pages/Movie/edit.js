import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import MovieApi from "../../api/MovieApi";
import GenreApi from "../../api/GenreApi";

import Swal from "sweetalert2";

export default function MovieEdit() {
  const { MovieId } = useParams();
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    MovieId: "",
    UserId: "",
    Title: "",
    PosterUrl: "",
    Trailer: "",
    GenreId: "",
    Status: "",
    Duration: "",
    Language: [],
    ReleaseDate: "",
    PosterFile: null,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!MovieId) {
          setError("Thiếu MovieId trong URL");
          return;
        }
        setLoading(true);

        const movieRes = await MovieApi.getById(MovieId);
        const m = movieRes.data.data || movieRes.data;
        setMovie((prev) => ({
          ...prev,
          ...m,
          Language: m.Language ? m.Language.split(",") : [],
          PosterFile: null,
        }));

        const genreRes = await GenreApi.getAll();
        setGenres(genreRes.data.data || genreRes.data);

      } catch (err) {
        console.error("❌ Lỗi load phim:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu phim.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [MovieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMovie((prev) => ({
        ...prev,
        PosterFile: file,
        PosterUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleLanguageChange = (lang) => {
    setMovie((prev) => {
      const currentLangs = prev.Language || [];
      const newLangs = currentLangs.includes(lang)
        ? currentLangs.filter((l) => l !== lang)
        : [...currentLangs, lang];
      return { ...prev, Language: newLangs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
    
      formData.append("_method", "PUT");
      formData.append("UserId", movie.UserId);
      formData.append("Title", movie.Title);
      formData.append("Trailer", movie.Trailer);
      formData.append("GenreId", movie.GenreId);
      formData.append("Duration", movie.Duration);
      formData.append("Language", Array.isArray(movie.Language) ? movie.Language.join(",") : movie.Language);
      formData.append("ReleaseDate", movie.ReleaseDate);
      formData.append("Status", movie.Status);

      if (movie.PosterFile) {
        formData.append("PosterUrl", movie.PosterFile);
      }

      const res = await MovieApi.update(MovieId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật phim thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/movie"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật phim:", err.response?.data || err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật phim thất bại!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  // Helper function to get status display info
  const getStatusInfo = (status) => {
    switch(status) {
      case "NowShowing":
        return { label: "Đang chiếu", class: "pill-active", icon: "fa-check-circle" };
      case "ComingSoon":
        return { label: "Sắp chiếu", class: "pill-warning", icon: "fa-clock" };
      case "Ended":
        return { label: "Đã kết thúc", class: "pill-inactive", icon: "fa-times-circle" };
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
                membership="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu danh sách phim ...
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
  if (!movie) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-id-card-alt empty-icon"></i>
            <p className="empty-text">Không có dữ liệu phim.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  const statusInfo = getStatusInfo(movie.Status);

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
            <span className="breadcrumb-item" onClick={() => navigate("/movie")}>
              Quản lý phim
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Cập nhật phim</span>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-film"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật phim</h1>
                  <p className="section-subtitle">Chỉnh sửa thông tin chi tiết phim</p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Tên phim */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-heading label-icon"></i>
                      Tên phim
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Title"
                      value={movie.Title}
                      onChange={handleChange}
                      placeholder="Nhập tên phim"
                      required
                    />
                  </div>

                  {/* Thể loại */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-tags label-icon"></i>
                      Thể loại
                    </label>
                    <select
                      className="modern-input"
                      name="GenreId"
                      value={movie.GenreId || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn thể loại --</option>
                      {genres.map((g) => (
                        <option key={g.GenreId} value={g.GenreId}>
                          {g.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mô tả */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-align-left label-icon"></i>
                      Mô tả phim
                    </label>
                    <textarea
                      className="modern-input modern-textarea"
                      name="Description"
                      value={movie.Description || ""}
                      onChange={handleChange}
                      placeholder="Nhập mô tả phim"
                    />
                  </div>

                  {/* Thời lượng & Ngày phát hành */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-clock label-icon"></i>
                        Thời lượng (phút)
                      </label>
                      <input
                        type="number"
                        className="modern-input"
                        name="Duration"
                        value={movie.Duration}
                        onChange={handleChange}
                        placeholder="120"
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-calendar label-icon"></i>
                        Ngày phát hành
                      </label>
                      <input
                        type="date"
                        className="modern-input"
                        name="ReleaseDate"
                        value={movie.ReleaseDate || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Poster & Trailer */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-image label-icon"></i>
                        Poster
                      </label>
                      <input
                        type="file"
                        className="modern-input"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {movie.PosterUrl && (
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                          <img
                            src={movie.PosterUrl}
                            alt="poster"
                            style={{ 
                              width: '150px', 
                              borderRadius: '12px',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="field-label">
                        <i className="fas fa-video label-icon"></i>
                        Trailer (YouTube ID)
                      </label>
                      <input
                        type="text"
                        className="modern-input"
                        name="Trailer"
                        placeholder="VD: BD6PoZJdt_M"
                        value={movie.Trailer || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Ngôn ngữ */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-language label-icon"></i>
                      Ngôn ngữ
                    </label>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {["Vietsub", "Lồng tiếng", "Phụ đề Anh"].map((lang) => (
                        <label key={lang} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          cursor: 'pointer',
                          color: '#e2e8f0'
                        }}>
                          <input
                            type="checkbox"
                            checked={movie.Language.includes(lang)}
                            onChange={() => handleLanguageChange(lang)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <span>{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Giới hạn độ tuổi */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user-shield label-icon"></i>
                      Giới hạn độ tuổi
                    </label>
                    <select
                      className="modern-input"
                      name="Rated"
                      value={movie.Rated || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn độ tuổi --</option>
                      <option value="P">P - Phổ biến</option>
                      <option value="C13">C13 - Trên 13 tuổi</option>
                      <option value="C16">C16 - Trên 16 tuổi</option>
                      <option value="C18">C18 - Trên 18 tuổi</option>
                    </select>
                  </div>

                  {/* Status - 3 options */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái phim
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                      {/* Đang chiếu */}
                      <div 
                        className={`status-option ${movie.Status === 'NowShowing' ? 'active' : ''}`}
                        onClick={() => setMovie(prev => ({ ...prev, Status: 'NowShowing' }))}
                      >
                        <div className="status-radio">
                          {movie.Status === 'NowShowing' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Đang chiếu</span>
                        </div>
                      </div>

                      {/* Sắp chiếu */}
                      <div 
                        className={`status-option ${movie.Status === 'ComingSoon' ? 'active' : ''}`}
                        onClick={() => setMovie(prev => ({ ...prev, Status: 'ComingSoon' }))}
                      >
                        <div className="status-radio">
                          {movie.Status === 'ComingSoon' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                            <i className="fas fa-clock"></i>
                          </div>
                          <span className="status-label">Sắp chiếu</span>
                        </div>
                      </div>

                      {/* Đã kết thúc */}
                      <div 
                        className={`status-option ${movie.Status === 'Ended' ? 'active' : ''}`}
                        onClick={() => setMovie(prev => ({ ...prev, Status: 'Ended' }))}
                      >
                        <div className="status-radio">
                          {movie.Status === 'Ended' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times-circle"></i>
                          </div>
                          <span className="status-label">Đã kết thúc</span>
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
                      onClick={() => navigate("/movie")} 
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
                  Đảm bảo tất cả thông tin được điền chính xác và đầy đủ để phim hiển thị tốt nhất trên hệ thống.
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
                  <p>Poster nên có kích thước tối thiểu 300x450px để hiển thị rõ nét</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>YouTube ID được lấy từ URL video (sau dấu "v=")</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Chọn thể loại phù hợp giúp khách hàng dễ tìm kiếm phim</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Trạng thái "Sắp chiếu" dành cho phim chưa ra mắt</p>
                </div>
              </div>

              {/* Info Details */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin phim
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Mã phim:</span>
                    <span className="info-value">#{movie.MovieId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${statusInfo.class}`}>
                      <i className={`fas ${statusInfo.icon} me-1`}></i>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Thể loại:</span>
                    <span className="info-value">
                      {genres.find(g => g.GenreId === movie.GenreId)?.Name || 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Thời lượng:</span>
                    <span className="info-value">{movie.Duration ? `${movie.Duration} phút` : 'Chưa có'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Ngày phát hành:</span>
                    <span className="info-value">
                      {movie.ReleaseDate ? new Date(movie.ReleaseDate).toLocaleDateString('vi-VN') : 'Chưa có'}
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