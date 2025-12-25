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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu đánh giá...
              </h5>
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
                    <XCircle size={40} color="#ef4444" />
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
  if (!review) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <MessageSquare size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu đánh giá.
                </p>
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
          <div className="wishlist-show-main-container">
            {/* Background Effects */}
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/review")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">
                    Chi Tiết Đánh Giá
                  </h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý đánh giá
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/review/edit/${ReviewId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Review Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isVisible ? "active" : "inactive"
                    }`}
                  >
                    <MessageSquare size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="wishlist-show-user-name">
                    {getUserName(review.UserId)}
                  </h2>

                  {/* Rating */}
                  <div style={{ fontSize: "24px", margin: "10px 0" }}>
                    {"⭐".repeat(review.Rating)}
                  </div>

                  {/* Movie Title */}
                  <p className="wishlist-show-movie-title">
                    {getMovieTitle(review.MovieId)}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      isVisible ? "active" : "inactive"
                    }`}
                  >
                    {isVisible ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                    {isVisible ? "Hiển thị" : "Ẩn"}
                  </div>

                  {/* Review ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Đánh Giá
                    </div>
                    <div className="wishlist-show-id-value">
                      {review.ReviewId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* User Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Người Dùng
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về người đánh giá
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên người dùng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getUserName(review.UserId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Movie & Rating Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Phim & Đánh Giá
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về phim và xếp hạng
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Film size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên phim
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getMovieTitle(review.MovieId)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Star size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Số sao
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {review.Rating} ⭐
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <MessageSquare size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Bình luận
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {review.Comment || "Không có bình luận"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Thời Gian
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Lịch sử hoạt động
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
                            {review.CreatedAt || "N/A"}
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
                            {review.UpdatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {review.CreatedBy || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người cập nhật
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {review.UpdatedBy || "N/A"}
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