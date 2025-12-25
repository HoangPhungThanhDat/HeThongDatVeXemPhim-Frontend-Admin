import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import WishlistApi from "../../api/WishlistApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import {
  Heart,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Film,
  Calendar,
  Clock,
} from "lucide-react";
import "../../styles/wishlist/Show.css";

export default function WishlistShow() {
  const { WishlistId } = useParams();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [wishlistRes, userRes, movieRes] = await Promise.all([
          WishlistApi.getById(WishlistId),
          UserApi.getAll(),
          MovieApi.getAll(),
        ]);
        setWishlist(wishlistRes.data.data || wishlistRes.data);
        setUsers(userRes.data.data || []);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu danh sách yêu thích!");
      } finally {
        setLoading(false);
      }
    };
    if (WishlistId) fetchData();
  }, [WishlistId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || "N/A";
  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || "N/A";

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
                Đang tải dữ liệu danh sách yêu thích...
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
  if (!wishlist) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Heart size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu danh sách yêu thích.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = wishlist.Status === "Active";

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
                    onClick={() => navigate("/wishlist")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">
                    Chi Tiết Danh Sách Yêu Thích
                  </h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý danh sách yêu thích
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/wishlist/edit/${WishlistId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Wishlist Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    <Heart size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="wishlist-show-user-name">
                    {getUserName(wishlist.UserId)}
                  </h2>

                  {/* Movie Title */}
                  <p className="wishlist-show-movie-title">
                    {getMovieTitle(wishlist.MovieId)}
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
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Wishlist ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Danh Sách Yêu Thích
                    </div>
                    <div className="wishlist-show-id-value">
                      {wishlist.WishlistId}
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
                          Chi tiết về người dùng
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
                            {getUserName(wishlist.UserId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Phim
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về phim yêu thích
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
                            {getMovieTitle(wishlist.MovieId)}
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
                            {wishlist.CreatedAt || "N/A"}
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
                            {wishlist.UpdatedAt || "N/A"}
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