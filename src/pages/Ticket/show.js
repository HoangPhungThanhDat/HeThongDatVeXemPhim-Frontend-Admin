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
  Sparkles,
  Activity,
  FileText,
  DollarSign,
} from "lucide-react";
import "../../styles/Role/Show.css";

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
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu vé...</h5>
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
  if (!ticket) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Ticket size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu vé.</p>
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
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/tickets")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Vé</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý vé
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/ticket/edit/${TicketId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Ticket Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${statusInfo.className}`}>
                    <Ticket size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{getUserName(ticket.UserId)}</h2>

                  {/* Movie Title */}
                  <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
                    {ticket.ShowtimeId?.MovieId?.Title || "N/A"}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${statusInfo.className}`}>
                    <StatusIcon size={16} />
                    {statusInfo.text}
                  </div>

                  {/* Seat Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <MapPin size={18} color="#6b7280" />
                      <span className="description-label">Ghế ngồi</span>
                    </div>
                    <p className="description-text">
                      {getSeatName(ticket.SeatId)}
                    </p>
                  </div>

                  {/* Ticket ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Vé</div>
                    <div className="role-id-value">{ticket.TicketId}</div>
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
                        <h3 className="info-title">Thông Tin Người Đặt</h3>
                        <p className="info-subtitle">Chi tiết về người đặt vé</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên người đặt</div>
                          <div className="info-item-value">{getUserName(ticket.UserId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <FileText size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">ID Người dùng</div>
                          <div className="info-item-value">{ticket.UserId}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Showtime Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Suất Chiếu</h3>
                        <p className="info-subtitle">Chi tiết về suất chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Phim</div>
                          <div className="info-item-value">
                            {ticket.ShowtimeId?.MovieId?.Title || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giờ chiếu</div>
                          <div className="info-item-value">
                            {ticket.ShowtimeId?.StartTime || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <MapPin size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Phòng chiếu</div>
                          <div className="info-item-value">
                            {ticket.ShowtimeId?.RoomId?.Name || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <MapPin size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ghế ngồi</div>
                          <div className="info-item-value">{getSeatName(ticket.SeatId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <DollarSign size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giá vé</div>
                          <div className="info-item-value">
                            {ticket.Price ? `${ticket.Price.toLocaleString('vi-VN')} đ` : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Hệ Thống</h3>
                        <p className="info-subtitle">Lịch sử đặt vé và cập nhật</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Thời điểm đặt</div>
                          <div className="info-item-value">{ticket.BookingTime || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{ticket.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{ticket.UpdatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{ticket.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{ticket.UpdatedBy || "N/A"}</div>
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