import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import GenreApi from "../../api/GenreApi";
import Swal from "sweetalert2";
import "../../styles/Role/Edit.css";

export default function GenreEdit() {
  const { GenreId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState({
    Name: "",
    Description: "",
    Status: "",
  });

  useEffect(() => {
    if (GenreId) {
      GenreApi.getById(GenreId)
        .then((res) => {
          setGenre(res.data.data || res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lấy dữ liệu genre:", err);
          setError("Không thể tải dữ liệu thể loại phim!");
          setLoading(false);
        });
    }
  }, [GenreId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenre((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    GenreApi.update(GenreId, genre)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật thể loại phim thành công!",
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
          navigate("/genre");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật thể loại:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật thể loại thất bại!",
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
              <h5 className="text-primary">Đang tải dữ liệu thể loại phim...</h5>
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
  if (!genre) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-film fa-2x mb-2"></i>
              <p>Không có dữ liệu thể loại phim.</p>
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
            <span className="breadcrumb-item" onClick={() => navigate("/genre")}>
              Thể loại phim
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
                  <i className="fas fa-film"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Thể Loại Phim</h2>
                  <p className="section-subtitle">Cập nhật thông tin thể loại phim</p>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-tag label-icon"></i>
                    Tên thể loại
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Name"
                    value={genre.Name}
                    onChange={handleChange}
                    placeholder="Nhập tên thể loại phim"
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
                    value={genre.Description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả chi tiết về thể loại phim"
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
                      className={`status-option ${genre.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setGenre({...genre, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {genre.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${genre.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setGenre({...genre, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {genre.Status === 'Inactive' && <div className="status-dot"></div>}
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
                    onClick={() => navigate("/genre")}
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
                  Việc thay đổi thể loại phim sẽ ảnh hưởng đến việc phân loại và tìm kiếm phim trong hệ thống. 
                  Vui lòng kiểm tra kỹ trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin thể loại</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tên hiện tại:</span>
                    <span className="info-value">{genre.Name || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${genre.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {genre.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Tên thể loại nên ngắn gọn và dễ hiểu</p>
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