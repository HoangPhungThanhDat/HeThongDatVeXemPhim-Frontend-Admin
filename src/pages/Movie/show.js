import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/wishlist/Show.css";
import MovieApi from "../../api/MovieApi";
import GenreApi from "../../api/GenreApi";
import {
  Film,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Globe,
  Star,
  Video,
  Image as ImageIcon,
} from "lucide-react";

export default function MovieShow() {
  const { MovieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, genreRes] = await Promise.all([
          MovieApi.getById(MovieId),
          GenreApi.getAll(),
        ]);
        setMovie(movieRes.data.data || movieRes.data);
        setGenres(genreRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin phim."
        );
      } finally {
        setLoading(false);
      }
    };
    if (MovieId) fetchData();
  }, [MovieId]);

  const getGenreName = (id) => genres.find((g) => g.GenreId === id)?.Name || id;

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
              <h5 className="text-primary">Đang tải dữ liệu phim...</h5>
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
  if (!movie) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Film size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu phim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = movie.Status === "NowShowing";
  const statusText =
    movie.Status === "NowShowing"
      ? "Đang chiếu"
      : movie.Status === "ComingSoon"
      ? "Sắp chiếu"
      : "Đã kết thúc";

  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20">
          <div className="wishlist-show-main-container">
            {/* Background Effects */}
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/movie")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Phim</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý phim
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/movie/edit/${movie.MovieId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Movie Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Poster or Icon */}
                  {movie.PosterUrl ? (
                    <img
                      src={movie.PosterUrl}
                      alt={movie.Title}
                      style={{
                        width: "100%",
                        borderRadius: "16px",
                        marginBottom: "24px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  ) : (
                    <div
                      className={`wishlist-show-icon-wrapper ${
                        isActive ? "active" : "inactive"
                      }`}
                    >
                      <Film size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* Movie Title */}
                  <h2 className="wishlist-show-user-name">{movie.Title}</h2>

                  {/* Genre */}
                  <p className="wishlist-show-movie-title">
                    {getGenreName(movie.GenreId)}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {statusText}
                  </div>

                  {/* Movie ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">Mã Phim</div>
                    <div className="wishlist-show-id-value">
                      {movie.MovieId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Basic Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Cơ Bản
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về phim
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Film size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Slug
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.Slug}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Thời lượng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.Duration} phút
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày phát hành
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.ReleaseDate}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Globe size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngôn ngữ
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.Language}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Star size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Độ tuổi
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.Rated}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Media */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Video size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Mô Tả & Media
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Nội dung và liên kết
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Film size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Mô tả
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.Description}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Video size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Trailer URL
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.TrailerUrl ? (
                              <a
                                href={movie.TrailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#f7931e" }}
                              >
                                Xem trailer
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      </div>

                      {movie.PosterUrl && (
                        <div className="wishlist-show-info-item">
                          <ImageIcon size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              Poster URL
                            </div>
                            <div className="wishlist-show-info-item-value">
                              <a
                                href={movie.PosterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#f7931e" }}
                              >
                                Xem poster
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Hệ Thống
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Lịch sử tạo và cập nhật
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.CreatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Cập nhật lần cuối
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {movie.UpdatedAt || "N/A"}
                          </div>
                        </div>
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