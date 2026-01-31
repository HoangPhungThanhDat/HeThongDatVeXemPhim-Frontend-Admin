import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import SeatApi from "../../api/SeatApi";
import MovieApi from "../../api/MovieApi";
import {
  Armchair,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Film,
  AlertTriangle,
  User,
  Sparkles,
  Activity,
  FileText,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function ShowtimeSeatShow() {
  const { ShowtimeSeatId } = useParams();
  const navigate = useNavigate();

  const [showtimeSeat, setShowtimeSeat] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [seatRes, showtimeRes, seatListRes, movieRes] = await Promise.all([
          ShowtimeSeatApi.getById(ShowtimeSeatId),
          ShowtimeApi.getAll(),
          SeatApi.getAll(),
          MovieApi.getAll(),
        ]);

        setShowtimeSeat(seatRes.data.data || seatRes.data);
        setShowtimes(showtimeRes.data.data || []);
        setSeats(seatListRes.data.data || []);
        setMovies(movieRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu trạng thái ghế!");
      } finally {
        setLoading(false);
      }
    };

    if (ShowtimeSeatId) fetchData();
  }, [ShowtimeSeatId]);

  const getShowtimeInfo = (id) => {
    const s = showtimes.find((st) => String(st.ShowtimeId) === String(id));
    if (!s) return "Không tìm thấy suất chiếu";
    const movieTitle = s.MovieId?.Title || "Không rõ phim";
    return `${movieTitle} - ${new Date(s.StartTime).toLocaleString()}`;
  };

  const getSeatInfo = (id) => {
    const seat = seats.find((st) => st.SeatId === id);
    if (!seat) return id;
    return `Hàng ${seat.Row} - Ghế ${seat.Number} (${seat.SeatType})`;
  };

  const getSeatDetail = (id) => {
    return seats.find((st) => st.SeatId === id);
  };

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
              <h5 className="loading-title">Đang tải dữ liệu trạng thái ghế...</h5>
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
  if (!showtimeSeat) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Armchair size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu trạng thái ghế.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const seatDetail = getSeatDetail(showtimeSeat.SeatId);
  const isAvailable = showtimeSeat.Status === "Available";

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
                  <button onClick={() => navigate("/showtimeseats")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Trạng Thái Ghế</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý trạng thái ghế theo suất chiếu
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/showtimeseats/edit/${ShowtimeSeatId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Seat Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isAvailable ? 'active' : 'inactive'}`}>
                    <Armchair size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Seat Info */}
                  <h2 className="role-name">
                    {seatDetail ? `Hàng ${seatDetail.Row} - Ghế ${seatDetail.Number}` : "N/A"}
                  </h2>

                  {/* Seat Type */}
                  <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
                    {seatDetail?.SeatType || "N/A"}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`status-badge ${
                      showtimeSeat.Status === "Available"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {showtimeSeat.Status === "Available" ? (
                      <CheckCircle size={16} />
                    ) : showtimeSeat.Status === "Reserved" ? (
                      <XCircle size={16} />
                    ) : (
                      <AlertTriangle size={16} />
                    )}
                    {showtimeSeat.Status === "Available"
                      ? "Còn trống"
                      : showtimeSeat.Status === "Reserved"
                      ? "Đã đặt"
                      : showtimeSeat.Status === "Broken"
                      ? "Hỏng"
                      : showtimeSeat.Status}
                  </div>

                  {/* Showtime Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <Film size={18} color="#6b7280" />
                      <span className="description-label">Suất chiếu</span>
                    </div>
                    <p className="description-text">
                      {getShowtimeInfo(showtimeSeat.ShowtimeId)}
                    </p>
                  </div>

                  {/* ShowtimeSeat ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Trạng Thái Ghế</div>
                    <div className="role-id-value">{showtimeSeat.ShowtimeSeatId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Seat Details */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Ghế Ngồi</h3>
                        <p className="info-subtitle">Chi tiết về vị trí và loại ghế</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <MapPin size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Vị trí ghế</div>
                          <div className="info-item-value">
                            {getSeatInfo(showtimeSeat.SeatId)}
                          </div>
                        </div>
                      </div>

                      {seatDetail && (
                        <>
                          <div className="info-item">
                            <Armchair size={20} color="#6b7280" />
                            <div className="info-item-content">
                              <div className="info-item-label">Hàng</div>
                              <div className="info-item-value">{seatDetail.Row}</div>
                            </div>
                          </div>

                          <div className="info-item">
                            <Armchair size={20} color="#6b7280" />
                            <div className="info-item-content">
                              <div className="info-item-label">Số ghế</div>
                              <div className="info-item-value">{seatDetail.Number}</div>
                            </div>
                          </div>

                          <div className="info-item">
                            <FileText size={20} color="#6b7280" />
                            <div className="info-item-content">
                              <div className="info-item-label">Loại ghế</div>
                              <div className="info-item-value">{seatDetail.SeatType}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Booking Status */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Trạng Thái Đặt Chỗ</h3>
                        <p className="info-subtitle">Thông tin về tình trạng ghế</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <CheckCircle size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Trạng thái</div>
                          <div className="info-item-value">
                            {showtimeSeat.Status === "Available"
                              ? "Còn trống"
                              : showtimeSeat.Status === "Reserved"
                              ? "Đã đặt"
                              : showtimeSeat.Status === "Broken"
                              ? "Hỏng"
                              : showtimeSeat.Status}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">ID Suất chiếu</div>
                          <div className="info-item-value">{showtimeSeat.ShowtimeId}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Armchair size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">ID Ghế</div>
                          <div className="info-item-value">{showtimeSeat.SeatId}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Calendar size={24} color="white" />
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
                          <div className="info-item-value">{showtimeSeat.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{showtimeSeat.UpdatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{showtimeSeat.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{showtimeSeat.UpdatedBy || "N/A"}</div>
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