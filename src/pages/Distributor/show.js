import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import DistributorApi from "../../api/DistributorApi";
import MovieApi from "../../api/MovieApi";
import {
  Building2,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  Activity,
  Film,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function DistributorShow() {
  const { DistributorId } = useParams();
  const navigate = useNavigate();

  const [distributor, setDistributor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [distributorRes, movieRes] = await Promise.all([
          DistributorApi.getById(DistributorId),
          MovieApi.getAll(),
        ]);

        setDistributor(distributorRes.data.data || distributorRes.data);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu nhà phát hành!");
      } finally {
        setLoading(false);
      }
    };
    if (DistributorId) fetchData();
  }, [DistributorId]);

  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || id;

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
              <h5 className="loading-title">Đang tải dữ liệu nhà phát hành...</h5>
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
  if (!distributor) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Building2 size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu nhà phát hành.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = distributor.Status === "Active";

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
                  <button onClick={() => navigate("/distributor")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Nhà Phát Hành</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết về nhà phát hành phim
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/distributor/edit/${DistributorId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Distributor Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Building2 size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Distributor Name */}
                  <h2 className="role-name">{distributor.Name}</h2>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Contact Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <MapPin size={18} color="#6b7280" />
                      <span className="description-label">Quốc gia</span>
                    </div>
                    <p className="description-text">
                      {distributor.Country || "Không có thông tin"}
                    </p>
                  </div>

                  <div className="description-box">
                    <div className="description-header">
                      <Mail size={18} color="#6b7280" />
                      <span className="description-label">Email</span>
                    </div>
                    <p className="description-text">
                      {distributor.Email || "Không có thông tin"}
                    </p>
                  </div>

                  <div className="description-box">
                    <div className="description-header">
                      <Phone size={18} color="#6b7280" />
                      <span className="description-label">Số điện thoại</span>
                    </div>
                    <p className="description-text">
                      {distributor.Phone || "Không có thông tin"}
                    </p>
                  </div>

                  {distributor.Website && (
                    <div className="description-box">
                      <div className="description-header">
                        <Globe size={18} color="#6b7280" />
                        <span className="description-label">Website</span>
                      </div>
                      <p className="description-text">{distributor.Website}</p>
                    </div>
                  )}

                  {/* Movie */}
                  <div className="description-box">
                    <div className="description-header">
                      <Film size={18} color="#6b7280" />
                      <span className="description-label">Phim liên quan</span>
                    </div>
                    <p className="description-text">
                      {getMovieTitle(distributor.MovieId)}
                    </p>
                  </div>

                  {/* Distributor ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Nhà Phát Hành</div>
                    <div className="role-id-value">{distributor.DistributorId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Created Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo nhà phát hành</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{distributor.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{distributor.CreatedAt || "N/A"}</div>
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
                        <p className="info-subtitle">Lịch sử thay đổi nhà phát hành</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{distributor.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{distributor.UpdatedAt || "N/A"}</div>
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