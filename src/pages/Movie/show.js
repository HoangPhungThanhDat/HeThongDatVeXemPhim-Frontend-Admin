import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
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
  Sparkles,
  Activity,
  FileText,
} from "lucide-react";
import "../../styles/Role/Show.css";

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
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu phim...</h5>
              <p className="loading-subtitle">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="skeleton-card">
                <div className="skeleton-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-text-short"></div>
                    </div>
                    <div className="col-md-8">
                      <div className="skeleton-text-60"></div>
                      <div className="skeleton-text-100"></div>
                      <div className="skeleton-text-90"></div>
                      <div className="skeleton-text-80"></div>
                      <div className="skeleton-text-70"></div>
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
            <div className="error-container">
              <div className="error-content">
                <div className="error-card">
                  <div className="error-icon">
                    <XCircle size={40} color="#ef4444" />
                  </div>
                  <h3 className="error-title">{error}</h3>
                  <button onClick={() => window.location.reload()} className="error-button">
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
            <div className="no-data-container">
              <div className="no-data-content">
                <Film size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu phim.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Hàm xử lý TrailerUrl để tạo link YouTube đúng
  const getTrailerUrl = (trailerUrl) => {
    if (!trailerUrl) return null;
    
    // Nếu đã là URL đầy đủ thì return luôn
    if (trailerUrl.startsWith('http://') || trailerUrl.startsWith('https://')) {
      return trailerUrl;
    }
    
    // Nếu chỉ là video ID thì tạo URL YouTube
    return `https://www.youtube.com/watch?v=${trailerUrl}`;
  };

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
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/movie")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Phim</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý phim
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/movie/edit/${movie.MovieId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Movie Summary */}
                <div className="role-summary-card">
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
                    <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                      <Film size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* Movie Title */}
                  <h2 className="role-name">{movie.Title}</h2>

                  {/* Genre */}
                  <p className="role-name" style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    {getGenreName(movie.GenreId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {statusText}
                  </div>

                  {/* Description */}
                  <div className="description-box">
                    <div className="description-header">
                      <FileText size={18} color="#6b7280" />
                      <span className="description-label">Mô tả</span>
                    </div>
                    <p className="description-text">
                      {movie.Description || "Không có mô tả"}
                    </p>
                  </div>

                  {/* Movie ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">Mã Phim</div>
                    <div className="role-id-value">{movie.MovieId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Basic Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Cơ Bản</h3>
                        <p className="info-subtitle">Chi tiết về phim</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Slug</div>
                          <div className="info-item-value">{movie.Slug}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Thời lượng</div>
                          <div className="info-item-value">{movie.Duration} phút</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày phát hành</div>
                          <div className="info-item-value">{movie.ReleaseDate}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Globe size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngôn ngữ</div>
                          <div className="info-item-value">{movie.Language}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Star size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Độ tuổi</div>
                          <div className="info-item-value">{movie.Rated}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Media</h3>
                        <p className="info-subtitle">Nội dung và liên kết</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Video size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Trailer URL</div>
                          <div className="info-item-value">
                            {movie.TrailerUrl ? (
                              <a
                                href={ getTrailerUrl(movie.TrailerUrl)}
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
                        <div className="info-item">
                          <ImageIcon size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Poster URL</div>
                            <div className="info-item-value">
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
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Hệ Thống</h3>
                        <p className="info-subtitle">Lịch sử tạo và cập nhật</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{movie.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{movie.UpdatedAt || "N/A"}</div>
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