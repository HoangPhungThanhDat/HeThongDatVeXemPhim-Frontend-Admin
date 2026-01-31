import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import RoomApi from "../../api/RoomApi";
import CinemasApi from "../../api/CinemasApi";
import {
  Maximize,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  Clock,
  User,
  Hash,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function RoomShow() {
  const { RoomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomRes, cinemaRes] = await Promise.all([
          RoomApi.getById(RoomId),
          CinemasApi.getAll(),
        ]);
        setRoom(roomRes.data.data || roomRes.data);
        setCinemas(cinemaRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu phòng chiếu!");
      } finally {
        setLoading(false);
      }
    };
    if (RoomId) fetchData();
  }, [RoomId]);

  const getCinemaName = (id) =>
    cinemas.find((c) => c.CinemaId === id)?.Name || "N/A";

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
              <h5 className="loading-title">Đang tải dữ liệu phòng chiếu...</h5>
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
  if (!room) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Maximize size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu phòng chiếu.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Active":
        return { icon: CheckCircle, text: "Hoạt động", className: "active" };
      case "Inactive":
        return { icon: XCircle, text: "Không hoạt động", className: "inactive" };
      case "Maintenance":
        return { icon: AlertTriangle, text: "Bảo trì", className: "inactive" };
      default:
        return { icon: XCircle, text: status, className: "inactive" };
    }
  };

  const statusInfo = getStatusInfo(room.Status);
  const StatusIcon = statusInfo.icon;

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
                  <button onClick={() => navigate("/rooms")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Phòng Chiếu</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý phòng chiếu
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/rooms/edit/${RoomId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Room Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${statusInfo.className}`}>
                    <Maximize size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Room Name */}
                  <h2 className="role-name">{room.Name}</h2>

                  {/* Cinema Name */}
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '15px',
                    fontWeight: '500'
                  }}>
                    {getCinemaName(room.CinemaId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${statusInfo.className}`}>
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  {/* Room Type */}
                  <div className="description-box">
                    <div className="description-header">
                      <Hash size={18} color="#6b7280" />
                      <span className="description-label">Loại phòng</span>
                    </div>
                    <p className="description-text">
                      {room.RoomType || "Không có thông tin"}
                    </p>
                  </div>

                  {/* Seat Count */}
                  <div className="description-box">
                    <div className="description-header">
                      <Users size={18} color="#6b7280" />
                      <span className="description-label">Tổng số ghế</span>
                    </div>
                    <p className="description-text">
                      {room.SeatCount} ghế
                    </p>
                  </div>

                  {/* Room ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Phòng Chiếu</div>
                    <div className="role-id-value">{room.RoomId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Cinema Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Building2 size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Rạp Chiếu</h3>
                        <p className="info-subtitle">Chi tiết về rạp phim</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Building2 size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên rạp</div>
                          <div className="info-item-value">
                            {getCinemaName(room.CinemaId)}
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
                        <p className="info-subtitle">Chi tiết về người tạo phòng chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{room.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{room.CreatedAt || "N/A"}</div>
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
                        <p className="info-subtitle">Lịch sử thay đổi phòng chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{room.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{room.UpdatedAt || "N/A"}</div>
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