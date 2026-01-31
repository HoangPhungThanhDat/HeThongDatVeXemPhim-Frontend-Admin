import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import CinemasApi from "../../api/CinemasApi";
import {
  Building,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function CinemasShow() {
  const { CinemaId } = useParams();
  const navigate = useNavigate();

  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu rạp chiếu...</h5>
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
  if (!cinema) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Building size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu rạp chiếu.</p>
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
      <div className="main-container">
        <div className="pd-ltr-20">
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/cinemas")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Rạp Chiếu</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý rạp chiếu phim
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/cinemas/edit/${CinemaId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Cinema Summary */}
                <div className="role-summary-card">
                  {/* Cinema Image or Icon */}
                  {cinema.ImageUrl ? (
                    <div style={{ 
                      width: '100%', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      marginBottom: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={cinema.ImageUrl}
                        alt={cinema.Name}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                      <Building size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* Cinema Name */}
                  <h2 className="role-name">{cinema.Name}</h2>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* City */}
                  <div className="description-box">
                    <div className="description-header">
                      <MapPin size={18} color="#6b7280" />
                      <span className="description-label">Thành phố</span>
                    </div>
                    <p className="description-text">
                      {cinema.City || "Không có thông tin"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="description-box">
                    <div className="description-header">
                      <MapPin size={18} color="#6b7280" />
                      <span className="description-label">Địa chỉ</span>
                    </div>
                    <p className="description-text">
                      {cinema.Address || "Không có địa chỉ"}
                    </p>
                  </div>

                  {/* Cinema ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Rạp Chiếu</div>
                    <div className="role-id-value">{cinema.CinemaId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Contact Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Phone size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Liên Hệ</h3>
                        <p className="info-subtitle">Chi tiết liên lạc của rạp chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Phone size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Số điện thoại</div>
                          <div className="info-item-value">{cinema.Phone || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Mail size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Email</div>
                          <div className="info-item-value">{cinema.Email || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <MapPin size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Địa chỉ đầy đủ</div>
                          <div className="info-item-value">
                            {cinema.Address}, {cinema.City}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo rạp chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{cinema.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">
                            {cinema.CreatedAt ? new Date(cinema.CreatedAt).toLocaleString('vi-VN') : "N/A"}
                          </div>
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
                        <p className="info-subtitle">Lịch sử thay đổi rạp chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{cinema.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">
                            {cinema.UpdatedAt ? new Date(cinema.UpdatedAt).toLocaleString('vi-VN') : "N/A"}
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