import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ReviewApi from "../../api/ReviewApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import {
  MessageSquare,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Film,
  Calendar,
  Clock,
  Star,
  Eye,
  EyeOff,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function ReviewShow() {
  const { ReviewId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewRes, userRes, movieRes] = await Promise.all([
          ReviewApi.getById(ReviewId),
          UserApi.getAll(),
          MovieApi.getAll(),
        ]);
        setReview(reviewRes.data.data || reviewRes.data);
        setUsers(userRes.data.data || []);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu đánh giá!");
      } finally {
        setLoading(false);
      }
    };
    if (ReviewId) fetchData();
  }, [ReviewId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || "N/A";
  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || id?.Title || "N/A";

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
              <h5 className="loading-title">Đang tải dữ liệu đánh giá...</h5>
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
  if (!review) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <MessageSquare size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu đánh giá.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isVisible = review.Status === "Visible";

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
                  <button onClick={() => navigate("/review")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Đánh Giá</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý đánh giá
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/review/edit/${ReviewId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Review Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isVisible ? 'active' : 'inactive'}`}>
                    <MessageSquare size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{getUserName(review.UserId)}</h2>

                  {/* Rating */}
                  <div style={{ 
                    fontSize: "32px", 
                    margin: "12px 0",
                    letterSpacing: "4px"
                  }}>
                    {"⭐".repeat(review.Rating)}
                  </div>

                  {/* Status Badge */}
                  <div className={`status-badge ${isVisible ? 'active' : 'inactive'}`}>
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    {isVisible ? "Hiển thị" : "Ẩn"}
                  </div>

                  {/* Movie Title */}
                  <div className="description-box">
                    <div className="description-header">
                      <Film size={18} color="#6b7280" />
                      <span className="description-label">Phim</span>
                    </div>
                    <p className="description-text">
                      {getMovieTitle(review.MovieId)}
                    </p>
                  </div>

                  {/* Comment */}
                  <div className="description-box">
                    <div className="description-header">
                      <MessageSquare size={18} color="#6b7280" />
                      <span className="description-label">Bình luận</span>
                    </div>
                    <p className="description-text">
                      {review.Comment || "Không có bình luận"}
                    </p>
                  </div>

                  {/* Review ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Đánh Giá</div>
                    <div className="role-id-value">{review.ReviewId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* User & Movie Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Đánh Giá</h3>
                        <p className="info-subtitle">Chi tiết về người dùng và phim</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người đánh giá</div>
                          <div className="info-item-value">{getUserName(review.UserId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên phim</div>
                          <div className="info-item-value">{getMovieTitle(review.MovieId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Star size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Số sao</div>
                          <div className="info-item-value">{review.Rating} ⭐</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo đánh giá</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{review.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{review.CreatedAt || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Cập Nhật Gần Nhất</h3>
                        <p className="info-subtitle">Lịch sử thay đổi đánh giá</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{review.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{review.UpdatedAt || "N/A"}</div>
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