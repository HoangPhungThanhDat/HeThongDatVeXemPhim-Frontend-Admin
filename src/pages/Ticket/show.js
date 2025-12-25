
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import TicketApi from "../../api/TicketApi";
import UserApi from "../../api/UserApi";
import SeatApi from "../../api/SeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import {
  Ticket,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Film,
  Calendar,
  MapPin,
} from "lucide-react";
import "../../styles/wishlist/Show.css";

export default function TicketShow() {
  const { TicketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketRes, userRes, seatRes, showtimeRes] = await Promise.all([
          TicketApi.getById(TicketId),
          UserApi.getAll(),
          SeatApi.getAll(),
          ShowtimeApi.getAll(),
        ]);
        setTicket(ticketRes.data.data || ticketRes.data);
        setUsers(userRes.data.data || []);
        setSeats(seatRes.data.data || []);
        setShowtimes(showtimeRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu vé!");
      } finally {
        setLoading(false);
      }
    };
    if (TicketId) fetchData();
  }, [TicketId]);

  const getUserName = (id) =>
    users.find((u) => u.UserId === id)?.FullName || "N/A";
  const getSeatName = (id) => {
    const seat = seats.find((s) => s.SeatId === id);
    return seat ? `${seat.Row}${seat.Number} (${seat.SeatType})` : "N/A";
  };
  const getShowtimeInfo = (id) => {
    const showtime = showtimes.find((s) => s.ShowtimeId === id);
    if (!showtime) return "N/A";
    return `${showtime.Movie?.Title || "Phim"} - ${showtime.StartTime}`;
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
              <h5 className="text-primary">Đang tải dữ liệu vé...</h5>
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
  if (!ticket) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Ticket size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu vé.
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
      case "Paid":
        return { icon: CheckCircle, text: "Đã thanh toán", className: "active" };
      case "Pending":
        return { icon: Clock, text: "Chờ xử lý", className: "inactive" };
      case "Cancelled":
        return { icon: XCircle, text: "Đã hủy", className: "inactive" };
      default:
        return { icon: XCircle, text: status, className: "inactive" };
    }
  };

  const statusInfo = getStatusInfo(ticket.Status);
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
                    onClick={() => navigate("/tickets")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Vé</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý vé
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/ticket/edit/${TicketId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Ticket Summary */}
                <div className="wishlist-show-summary-card">
                  <div
                    className={`wishlist-show-icon-wrapper ${statusInfo.className}`}
                  >
                    <Ticket size={56} color="white" strokeWidth={2} />
                  </div>

                  <h2 className="wishlist-show-user-name">
                    {getUserName(ticket.UserId)}
                  </h2>

                  <p className="wishlist-show-movie-title">
                    {ticket.ShowtimeId?.MovieId?.Title || "N/A"}
                  </p>

                  <div
                    className={`wishlist-show-status-badge ${statusInfo.className}`}
                  >
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">ID Vé</div>
                    <div className="wishlist-show-id-value">
                      {ticket.TicketId}
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
                          Thông Tin Người Đặt
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về người đặt vé
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên người đặt
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getUserName(ticket.UserId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Showtime Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
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
                        <Film size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Phim
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {ticket.ShowtimeId?.MovieId?.Title || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giờ chiếu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {ticket.ShowtimeId?.StartTime || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <MapPin size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Phòng chiếu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {ticket.ShowtimeId?.RoomId?.Name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Đặt Vé
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết đặt vé và ghế ngồi
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <MapPin size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ghế ngồi
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getSeatName(ticket.SeatId)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Thời điểm đặt
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {ticket.BookingTime || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {ticket.CreatedAt || "N/A"}
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
                            {ticket.UpdatedAt || "N/A"}
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