import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Show.css";
import CinemasApi from "../../api/CinemasApi";

export default function CinemasShow() {
  const { CinemaId } = useParams();
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cinemaRes = await CinemasApi.getById(CinemaId);
        setCinema(cinemaRes.data.data || cinemaRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin rạp chiếu phim."
        );
      } finally {
        setLoading(false);
      }
    };
    if (CinemaId) fetchData();
  }, [CinemaId]);

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu rạp chiếu...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton */}
              <div className="card shadow-sm border-0 wishlist-show-skeleton-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="wishlist-show-skeleton-avatar"></div>
                      <div className="wishlist-show-skeleton-text"></div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "60%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "100%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "90%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "80%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "70%" }}
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

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-error-container">
              <div className="wishlist-show-error-content">
                <div className="wishlist-show-error-card">
                  <div className="wishlist-show-error-icon-wrapper">
                    <XCircle size={40} />
                  </div>
                  <h3 className="wishlist-show-error-title">{error}</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="wishlist-show-error-button"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No Data State
  if (!cinema) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Film size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu rạp chiếu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = cinema.Status === "Active";

  return (
    <MainLayout>
      <div className="wishlist-show-main-container" style={{ marginLeft: '250px', marginTop: '70px' }}>
        <div className="wishlist-show-bg-effect"></div>
        
        <div className="wishlist-show-content-wrapper">
          {/* Header */}
          <div className="wishlist-show-header">
            <div>
              <button
                className="wishlist-show-back-button"
                onClick={() => navigate("/cinemas")}
              >
                <i className="fas fa-arrow-left"></i>
                Quay lại danh sách
              </button>
              <h1 className="wishlist-show-title">Chi tiết rạp chiếu</h1>
              <p className="wishlist-show-subtitle">
                Xem thông tin chi tiết về rạp chiếu phim
              </p>
            </div>
            <div className="wishlist-show-actions">
              <button
                className="wishlist-show-edit-button"
                onClick={() => navigate(`/cinemas/edit/${cinema.CinemaId}`)}
              >
                <i className="fas fa-edit"></i>
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="wishlist-show-grid">
            {/* Left Column - Cinema Summary */}
            <div className="wishlist-show-summary-card">
              <div className={`wishlist-show-icon-wrapper ${isActive ? 'active' : 'inactive'}`}>
                <i className="fas fa-building fa-4x text-white"></i>
              </div>

              <h2 className="wishlist-show-user-name">{cinema.Name}</h2>
              <p className="wishlist-show-movie-title">{cinema.City}</p>

              <div className={`wishlist-show-status-badge ${isActive ? 'active' : 'inactive'}`}>
                <i className={`fas ${isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </div>

              <div className="wishlist-show-id-box">
                <div className="wishlist-show-id-label">Mã rạp</div>
                <div className="wishlist-show-id-value">#{cinema.CinemaId}</div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="wishlist-show-details-column">
              {/* Cinema Information */}
              <div className="wishlist-show-info-card">
                <div className="wishlist-show-info-header">
                  <div className="wishlist-show-info-icon user">
                    <i className="fas fa-building fa-lg text-white"></i>
                  </div>
                  <div>
                    <h3 className="wishlist-show-info-title">Thông tin rạp</h3>
                    <p className="wishlist-show-info-subtitle">Chi tiết về rạp chiếu phim</p>
                  </div>
                </div>

                <div className="wishlist-show-info-list">
                  <div className="wishlist-show-info-item">
                    <i className="fas fa-map-marker-alt fa-lg text-warning"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Địa chỉ</div>
                      <div className="wishlist-show-info-item-value">{cinema.Address}</div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-city fa-lg text-info"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Thành phố</div>
                      <div className="wishlist-show-info-item-value">{cinema.City}</div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-phone fa-lg text-success"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Số điện thoại</div>
                      <div className="wishlist-show-info-item-value">{cinema.Phone}</div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-envelope fa-lg text-danger"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Email</div>
                      <div className="wishlist-show-info-item-value">
                        {cinema.Email || <span className="text-muted">Không có</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cinema Image */}
              {cinema.ImageUrl && (
                <div className="wishlist-show-info-card">
                  <div className="wishlist-show-info-header">
                    <div className="wishlist-show-info-icon movie">
                      <i className="fas fa-image fa-lg text-white"></i>
                    </div>
                    <div>
                      <h3 className="wishlist-show-info-title">Hình ảnh rạp</h3>
                      <p className="wishlist-show-info-subtitle">Ảnh đại diện của rạp chiếu</p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={cinema.ImageUrl}
                      alt={cinema.Name}
                      style={{
                        maxWidth: '50%',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Timestamp Information */}
              <div className="wishlist-show-info-card">
                <div className="wishlist-show-info-header">
                  <div className="wishlist-show-info-icon time">
                    <i className="fas fa-clock fa-lg text-white"></i>
                  </div>
                  <div>
                    <h3 className="wishlist-show-info-title">Thông tin hệ thống</h3>
                    <p className="wishlist-show-info-subtitle">Lịch sử tạo và cập nhật</p>
                  </div>
                </div>

                <div className="wishlist-show-info-list">
                  <div className="wishlist-show-info-item">
                    <i className="fas fa-user-plus fa-lg text-primary"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Người tạo</div>
                      <div className="wishlist-show-info-item-value">{cinema.CreatedBy || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-calendar-plus fa-lg text-success"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Ngày tạo</div>
                      <div className="wishlist-show-info-item-value">
                        {cinema.CreatedAt ? new Date(cinema.CreatedAt).toLocaleString('vi-VN') : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-user-edit fa-lg text-warning"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Người cập nhật</div>
                      <div className="wishlist-show-info-item-value">{cinema.UpdatedBy || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="wishlist-show-info-item">
                    <i className="fas fa-calendar-check fa-lg text-info"></i>
                    <div className="wishlist-show-info-item-content">
                      <div className="wishlist-show-info-item-label">Cập nhật lần cuối</div>
                      <div className="wishlist-show-info-item-value">
                        {cinema.UpdatedAt ? new Date(cinema.UpdatedAt).toLocaleString('vi-VN') : 'N/A'}
                      </div>
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