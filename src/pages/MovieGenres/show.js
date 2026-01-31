import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import MovieGenresApi from "../../api/MovieGenresApi";
import GenreApi from "../../api/GenreApi";
import MovieApi from "../../api/MovieApi";
import {
  Link2,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Film,
  Tag,
  Calendar,
  Clock,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function MovieGenresShow() {
  const { MovieGenreId } = useParams();
  const navigate = useNavigate();

  const [movieGenres, setMovieGenres] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mgRes, movieRes, genreRes] = await Promise.all([
          MovieGenresApi.getById(MovieGenreId),
          MovieApi.getAll(),
          GenreApi.getAll(),
        ]);

        setMovieGenres(mgRes.data.data || mgRes.data);
        setMovies(movieRes.data.data || []);
        setGenres(genreRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu liên kết phim - thể loại!");
      } finally {
        setLoading(false);
      }
    };
    if (MovieGenreId) fetchData();
  }, [MovieGenreId]);

  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || "N/A";
  const getGenreName = (id) =>
    genres.find((g) => g.GenreId === id)?.Name || "N/A";

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
              <h5 className="loading-title">Đang tải dữ liệu liên kết phim - thể loại...</h5>
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
  if (!movieGenres) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Link2 size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu liên kết phim - thể loại.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = movieGenres.Status === "Active";

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
                  <button onClick={() => navigate("/moviegenres")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Liên Kết Phim - Thể Loại</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý liên kết
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/moviegenres/edit/${MovieGenreId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Link2 size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Movie Title */}
                  <h2 className="role-name">{getMovieTitle(movieGenres.MovieId)}</h2>

                  {/* Genre Name */}
                  <p style={{ 
                    fontSize: "18px", 
                    color: "#94a3b8", 
                    margin: "8px 0 16px",
                    fontWeight: 500 
                  }}>
                    {getGenreName(movieGenres.GenreId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Movie Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <Film size={18} color="#6b7280" />
                      <span className="description-label">Phim</span>
                    </div>
                    <p className="description-text">
                      {getMovieTitle(movieGenres.MovieId)}
                    </p>
                  </div>

                  {/* Genre Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <Tag size={18} color="#6b7280" />
                      <span className="description-label">Thể loại</span>
                    </div>
                    <p className="description-text">
                      {getGenreName(movieGenres.GenreId)}
                    </p>
                  </div>

                  {/* MovieGenre ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Liên Kết</div>
                    <div className="role-id-value">{movieGenres.MovieGenreId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Movie Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Phim</h3>
                        <p className="info-subtitle">Chi tiết về phim</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên phim</div>
                          <div className="info-item-value">{getMovieTitle(movieGenres.MovieId)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Genre Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Tag size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Thể Loại</h3>
                        <p className="info-subtitle">Chi tiết về thể loại phim</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Tag size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên thể loại</div>
                          <div className="info-item-value">{getGenreName(movieGenres.GenreId)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Thời Gian</h3>
                        <p className="info-subtitle">Lịch sử hoạt động</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{movieGenres.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{movieGenres.UpdatedAt || "N/A"}</div>
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