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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu phòng chiếu...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

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
  if (!room) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Maximize size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu phòng chiếu.
                </p>
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
          <div className="wishlist-show-main-container">
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/rooms")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Phòng Chiếu</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý phòng chiếu
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/rooms/edit/${RoomId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Room Summary */}
                <div className="wishlist-show-summary-card">
                  <div
                    className={`wishlist-show-icon-wrapper ${statusInfo.className}`}
                  >
                    <Maximize size={56} color="white" strokeWidth={2} />
                  </div>

                  <h2 className="wishlist-show-user-name">{room.Name}</h2>

                  <p className="wishlist-show-movie-title">
                    {getCinemaName(room.CinemaId)}
                  </p>

                  <div
                    className={`wishlist-show-status-badge ${statusInfo.className}`}
                  >
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">ID Phòng Chiếu</div>
                    <div className="wishlist-show-id-value">{room.RoomId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Cinema Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Building2 size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Rạp Chiếu
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về rạp phim
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Building2 size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên rạp
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getCinemaName(room.CinemaId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Maximize size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Phòng
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về phòng chiếu
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Maximize size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên phòng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {room.Name}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Users size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tổng số ghế
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {room.SeatCount}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Hash size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Loại phòng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {room.RoomType}
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
                            {room.CreatedAt || "N/A"}
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
                            {room.UpdatedAt || "N/A"}
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
                            {room.CreatedBy || "N/A"}
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
                            {room.UpdatedBy || "N/A"}
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