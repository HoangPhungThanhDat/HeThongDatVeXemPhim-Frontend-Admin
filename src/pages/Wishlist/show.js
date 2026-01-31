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
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

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
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu danh sách yêu thích...</h5>
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
  if (!wishlist) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Heart size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu danh sách yêu thích.</p>
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
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/wishlist")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Danh Sách Yêu Thích</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý danh sách yêu thích
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/wishlist/edit/${WishlistId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Wishlist Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Heart size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{getUserName(wishlist.UserId)}</h2>

                  {/* Movie Title */}
                  <p className="role-name" style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    {getMovieTitle(wishlist.MovieId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Wishlist ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Danh Sách Yêu Thích</div>
                    <div className="role-id-value">{wishlist.WishlistId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* User Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Người Dùng</h3>
                        <p className="info-subtitle">Chi tiết về người dùng</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên người dùng</div>
                          <div className="info-item-value">
                            {getUserName(wishlist.UserId)}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày thêm</div>
                          <div className="info-item-value">{wishlist.CreatedAt || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Phim</h3>
                        <p className="info-subtitle">Chi tiết về phim yêu thích</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên phim</div>
                          <div className="info-item-value">
                            {getMovieTitle(wishlist.MovieId)}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Heart size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Trạng thái</div>
                          <div className="info-item-value">
                            {isActive ? "Đang yêu thích" : "Đã bỏ yêu thích"}
                          </div>
                        </div>
                      </div>
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
                        <p className="info-subtitle">Lịch sử hoạt động</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{wishlist.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{wishlist.UpdatedAt || "N/A"}</div>
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