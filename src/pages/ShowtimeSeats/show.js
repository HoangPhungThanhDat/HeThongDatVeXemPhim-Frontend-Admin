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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu trạng thái ghế...
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
  if (!showtimeSeat) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Armchair size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu trạng thái ghế.
                </p>
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
          <div className="wishlist-show-main-container">
            {/* Background Effects */}
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/showtimeseats")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">
                    Chi Tiết Trạng Thái Ghế
                  </h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý trạng thái ghế theo suất chiếu
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/showtimeseats/edit/${ShowtimeSeatId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Seat Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isAvailable ? "active" : "inactive"
                    }`}
                  >
                    <Armchair size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Seat Info */}
                  <h2 className="wishlist-show-user-name">
                    {seatDetail ? `Hàng ${seatDetail.Row} - Ghế ${seatDetail.Number}` : "N/A"}
                  </h2>

                  {/* Seat Type */}
                  <p className="wishlist-show-movie-title">
                    {seatDetail?.SeatType || "N/A"}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      showtimeSeat.Status === "Available"
                        ? "active"
                        : showtimeSeat.Status === "Reserved"
                        ? "inactive"
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

                  {/* ShowtimeSeat ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Trạng Thái Ghế
                    </div>
                    <div className="wishlist-show-id-value">
                      {showtimeSeat.ShowtimeSeatId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Showtime Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Suất Chiếu
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về suất chiếu
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Suất chiếu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getShowtimeInfo(showtimeSeat.ShowtimeId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seat Details */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Armchair size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Ghế Ngồi
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về vị trí ghế
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <MapPin size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Vị trí ghế
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getSeatInfo(showtimeSeat.SeatId)}
                          </div>
                        </div>
                      </div>

                      {seatDetail && (
                        <>
                          <div className="wishlist-show-info-item">
                            <Armchair size={20} color="#94a3b8" />
                            <div className="wishlist-show-info-item-content">
                              <div className="wishlist-show-info-item-label">
                                Hàng
                              </div>
                              <div className="wishlist-show-info-item-value">
                                {seatDetail.Row}
                              </div>
                            </div>
                          </div>

                          <div className="wishlist-show-info-item">
                            <Armchair size={20} color="#94a3b8" />
                            <div className="wishlist-show-info-item-content">
                              <div className="wishlist-show-info-item-label">
                                Số ghế
                              </div>
                              <div className="wishlist-show-info-item-value">
                                {seatDetail.Number}
                              </div>
                            </div>
                          </div>

                          <div className="wishlist-show-info-item">
                            <Armchair size={20} color="#94a3b8" />
                            <div className="wishlist-show-info-item-content">
                              <div className="wishlist-show-info-item-label">
                                Loại ghế
                              </div>
                              <div className="wishlist-show-info-item-value">
                                {seatDetail.SeatType}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Calendar size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Hệ Thống
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
                            {showtimeSeat.CreatedAt || "N/A"}
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
                            {showtimeSeat.UpdatedAt || "N/A"}
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