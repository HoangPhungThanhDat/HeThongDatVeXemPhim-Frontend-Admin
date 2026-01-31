import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import BannerApi from "../../api/BannerApi";
import UserApi from "../../api/UserApi";
import {
  Image,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  Activity,
  Link as LinkIcon,
  MapPin,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function BannerShow() {
  const { BannerId } = useParams();
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bannerRes, userRes] = await Promise.all([
          BannerApi.getById(BannerId),
          UserApi.getAll(),
        ]);
        setBanner(bannerRes.data.data || bannerRes.data);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin banner."
        );
      } finally {
        setLoading(false);
      }
    };
    if (BannerId) fetchData();
  }, [BannerId]);

  const getUserName = (id) =>
    users.find((u) => String(u.UserId) === String(id))?.FullName || id;

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
              <h5 className="loading-title">Đang tải dữ liệu banner...</h5>
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
  if (!banner) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Image size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu banner.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = banner.Status === "Active";

  const getPositionText = (position) => {
    switch (position) {
      case "Home":
        return "Trang chủ";
      case "MoviePage":
        return "Trang phim";
      case "PromotionPage":
        return "Trang khuyến mãi";
      default:
        return position;
    }
  };

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
                  <button onClick={() => navigate("/banner")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Banner</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý banner hệ thống
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/banner/edit/${BannerId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Banner Summary */}
                <div className="role-summary-card">
                  {/* Banner Image Preview */}
                  {banner.ImageUrl ? (
                    <div style={{ 
                      width: '100%', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      marginBottom: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={banner.ImageUrl}
                        alt={banner.Title}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                      <Image size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* Banner Title */}
                  <h2 className="role-name">{banner.Title}</h2>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Position */}
                  <div className="description-box">
                    <div className="description-header">
                      <MapPin size={18} color="#6b7280" />
                      <span className="description-label">Vị trí hiển thị</span>
                    </div>
                    <p className="description-text">
                      {getPositionText(banner.Position)}
                    </p>
                  </div>

                  {/* Link URL */}
                  {banner.LinkUrl && (
                    <div className="description-box">
                      <div className="description-header">
                        <LinkIcon size={18} color="#6b7280" />
                        <span className="description-label">Liên kết</span>
                      </div>
                      <a 
                        href={banner.LinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="description-text"
                        style={{ 
                          color: '#3b82f6', 
                          textDecoration: 'none',
                          wordBreak: 'break-all'
                        }}
                      >
                        {banner.LinkUrl}
                      </a>
                    </div>
                  )}

                  {/* Banner ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Banner</div>
                    <div className="role-id-value">{banner.BannerId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Creator Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo banner</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">
                            {getUserName(banner.UserId)}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{banner.CreatedAt || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Cập Nhật Gần Nhất</h3>
                        <p className="info-subtitle">Lịch sử thay đổi banner</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{banner.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{banner.UpdatedAt || "N/A"}</div>
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