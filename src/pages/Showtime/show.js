import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ShowtimeApi from "../../api/ShowtimeApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import {
  Clock,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Film,
  DoorOpen,
  Calendar,
  DollarSign,
  Play,
  StopCircle,
  User,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function ShowtimeShow() {
  const { ShowtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [showtimeRes, movieRes, roomRes] = await Promise.all([
          ShowtimeApi.getById(ShowtimeId),
          MovieApi.getAll(),
          RoomApi.getAll(),
        ]);
        setShowtime(showtimeRes.data.data || showtimeRes.data);
        setMovies(movieRes.data.data || []);
        setRooms(roomRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu suất chiếu!");
      } finally {
        setLoading(false);
      }
    };
    if (ShowtimeId) fetchData();
  }, [ShowtimeId]);

  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || id?.Title || "N/A";
  const getRoomName = (id) =>
    rooms.find((r) => r.RoomId === id)?.Name || id?.Name || "N/A";

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
              <h5 className="loading-title">Đang tải dữ liệu suất chiếu...</h5>
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
  if (!showtime) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Clock size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu suất chiếu.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isScheduled = showtime.Status === "Scheduled";

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
                  <button onClick={() => navigate("/showtime")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Suất Chiếu</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý suất chiếu
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/showtime/edit/${ShowtimeId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Showtime Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isScheduled ? 'active' : 'inactive'}`}>
                    <Clock size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Movie Title */}
                  <h2 className="role-name">{getMovieTitle(showtime.MovieId)}</h2>

                  {/* Room Name */}
                  <p style={{ 
                    fontSize: "16px", 
                    color: "#94a3b8", 
                    margin: "8px 0 16px",
                    fontWeight: 500 
                  }}>
                    {getRoomName(showtime.RoomId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isScheduled ? 'active' : 'inactive'}`}>
                    {isScheduled ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {showtime.Status === "Scheduled"
                      ? "Đã lên lịch"
                      : showtime.Status === "Cancelled"
                      ? "Đã hủy"
                      : "Đã kết thúc"}
                  </div>

                  {/* Movie Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <Film size={18} color="#6b7280" />
                      <span className="description-label">Phim</span>
                    </div>
                    <p className="description-text">
                      {getMovieTitle(showtime.MovieId)}
                    </p>
                  </div>

                  {/* Room Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <DoorOpen size={18} color="#6b7280" />
                      <span className="description-label">Phòng chiếu</span>
                    </div>
                    <p className="description-text">
                      {getRoomName(showtime.RoomId)}
                    </p>
                  </div>

                  {/* Showtime ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Suất Chiếu</div>
                    <div className="role-id-value">{showtime.ShowtimeId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Time & Price Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Thời Gian & Giá</h3>
                        <p className="info-subtitle">Chi tiết về lịch chiếu và giá vé</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Play size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giờ bắt đầu</div>
                          <div className="info-item-value">{showtime.StartTime || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <StopCircle size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giờ kết thúc</div>
                          <div className="info-item-value">{showtime.EndTime || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <DollarSign size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giá vé cơ bản</div>
                          <div className="info-item-value">
                            {showtime.Price ? `${showtime.Price} đ` : "N/A"}
                          </div>
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
                        <p className="info-subtitle">Chi tiết về người tạo suất chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{showtime.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{showtime.CreatedAt || "N/A"}</div>
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
                        <p className="info-subtitle">Lịch sử thay đổi suất chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{showtime.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{showtime.UpdatedAt || "N/A"}</div>
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