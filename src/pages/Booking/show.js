import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Role/Show.css";
import OrderApi from "../../api/OrderApi";
import OrderDetailApi from "../../api/OrderDetailApi";
import TicketApi from "../../api/TicketApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import CinemasApi from "../../api/CinemasApi";
import SeatApi from "../../api/SeatApi";
import {
  Receipt,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Film,
  MapPin,
  Armchair,
  ShoppingBag,
  Sparkles,
  Activity,
  FileText,
} from "lucide-react";

export default function OrderShow() {
  const { OrderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          orderRes,
          orderDetailsRes,
          ticketsRes,
          usersRes,
          moviesRes,
          showtimesRes,
          cinemasRes,
          seatsRes,
        ] = await Promise.all([
          OrderApi.getById(OrderId),
          OrderDetailApi.getAll(),
          TicketApi.getAll(),
          UserApi.getAll(),
          MovieApi.getAll(),
          ShowtimeApi.getAll(),
          CinemasApi.getAll(),
          SeatApi.getAll(),
        ]);

        setOrder(orderRes.data.data || orderRes.data);
        setOrderDetails(orderDetailsRes.data.data || orderDetailsRes.data);
        setTickets(ticketsRes.data.data || ticketsRes.data);
        setUsers(usersRes.data.data || usersRes.data);
        setMovies(moviesRes.data.data || moviesRes.data);
        setShowtimes(showtimesRes.data.data || showtimesRes.data);
        setCinemas(cinemasRes.data.data || cinemasRes.data);
        setSeats(seatsRes.data.data || seatsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    if (OrderId) fetchData();
  }, [OrderId]);

  // Helper functions
  const getUserInfo = (userId) => users.find((u) => u.UserId === userId) || null;

  const getOrderDetailsByOrderId = (orderId) => {
    return orderDetails.filter((od) => {
      const detailOrderId = typeof od.OrderId === 'object' ? od.OrderId.OrderId : od.OrderId;
      return detailOrderId === orderId;
    });
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
              <h5 className="loading-title">Đang tải dữ liệu đơn đặt vé...</h5>
              <p className="loading-subtitle">Vui lòng chờ trong giây lát</p>

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
  if (!order) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Receipt size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu đơn hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const user = getUserInfo(order.UserId);
  const details = getOrderDetailsByOrderId(order.OrderId);

  // Lấy tickets từ OrderDetails
  const ticketIds = details
    .filter(od => od.TicketId)
    .map(od => typeof od.TicketId === 'object' ? od.TicketId.TicketId : od.TicketId);
  
  const orderTickets = tickets.filter(t => ticketIds.includes(t.TicketId));

  // Lấy thông tin từ tickets
  const movie = orderTickets.length > 0 && orderTickets[0].ShowtimeId?.MovieId 
    ? orderTickets[0].ShowtimeId.MovieId 
    : null;
  
  const showtime = orderTickets.length > 0 && orderTickets[0].ShowtimeId 
    ? orderTickets[0].ShowtimeId 
    : null;
  
  const cinemaRoom = orderTickets.length > 0 && orderTickets[0].ShowtimeId?.RoomId 
    ? {
        room: orderTickets[0].ShowtimeId.RoomId,
        cinema: cinemas.find(c => c.CinemaId === orderTickets[0].ShowtimeId.RoomId.CinemaId)
      }
    : null;
  
  const seatList = orderTickets.map(ticket => ticket.SeatId).filter(Boolean);

  const isCompleted = order.Status === "Completed" || order.Status === "Paid";

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
                  <button onClick={() => navigate("/bookings")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Đơn Đặt Vé</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết đơn đặt vé và lịch sử giao dịch
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Order Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isCompleted ? 'active' : 'inactive'}`}>
                    <Receipt size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Order ID */}
                  <h2 className="role-name">Đơn hàng #{order.OrderId}</h2>

                  {/* Status Badge */}
                  <div className={`status-badge ${isCompleted ? 'active' : 'inactive'}`}>
                    {isCompleted ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {order.Status === "Completed" ? "Hoàn thành" : 
                     order.Status === "Paid" ? "Đã thanh toán" : 
                     order.Status === "Cancelled" ? "Đã hủy" : "Chờ xử lý"}
                  </div>

                  {/* Customer Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <User size={18} color="#6b7280" />
                      <span className="description-label">Khách hàng</span>
                    </div>
                    <p className="description-text">
                      {user?.FullName || user?.Email || "N/A"}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div className="role-id-box">
                    <div className="role-id-label">Tổng tiền</div>
                    <div className="role-id-value">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.TotalAmount || 0)}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Customer Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Khách Hàng</h3>
                        <p className="info-subtitle">Chi tiết người đặt vé</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Họ tên</div>
                          <div className="info-item-value">{user?.FullName || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Email</div>
                          <div className="info-item-value">{user?.Email || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Số điện thoại</div>
                          <div className="info-item-value">{user?.PhoneNumber || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  {movie && (
                    <div className="info-card">
                      <div className="info-header">
                        <div className="info-icon">
                          <Film size={24} color="white" />
                        </div>
                        <div>
                          <h3 className="info-title">Thông Tin Phim</h3>
                          <p className="info-subtitle">Chi tiết phim đã đặt</p>
                        </div>
                      </div>

                      <div className="info-items">
                        <div className="info-item">
                          <Film size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Tên phim</div>
                            <div className="info-item-value">{movie.Title || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <Clock size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Thời lượng</div>
                            <div className="info-item-value">{movie.Duration ? `${movie.Duration} phút` : "N/A"}</div>
                          </div>
                        </div>

                        {showtime && (
                          <div className="info-item">
                            <Calendar size={20} color="#6b7280" />
                            <div className="info-item-content">
                              <div className="info-item-label">Suất chiếu</div>
                              <div className="info-item-value">
                                {new Date(showtime.StartTime).toLocaleString("vi-VN")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cinema & Seat Info */}
                  {cinemaRoom && (
                    <div className="info-card">
                      <div className="info-header">
                        <div className="info-icon">
                          <MapPin size={24} color="white" />
                        </div>
                        <div>
                          <h3 className="info-title">Thông Tin Rạp & Ghế</h3>
                          <p className="info-subtitle">Địa điểm và ghế ngồi</p>
                        </div>
                      </div>

                      <div className="info-items">
                        <div className="info-item">
                          <MapPin size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Rạp chiếu</div>
                            <div className="info-item-value">{cinemaRoom.cinema?.Name || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <MapPin size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Phòng chiếu</div>
                            <div className="info-item-value">{cinemaRoom.room?.Name || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <Armchair size={20} color="#6b7280" />
                          <div className="info-item-content">
                            <div className="info-item-label">Ghế ngồi</div>
                            <div className="info-item-value">
                              {seatList.length > 0 
                                ? seatList.map((s) => `${s.Row}${s.Number}`).join(", ")
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Food & Drinks */}
                  {details.filter(d => d?.ItemId?.Name).length > 0 && (
                    <div className="info-card">
                      <div className="info-header">
                        <div className="info-icon">
                          <ShoppingBag size={24} color="white" />
                        </div>
                        <div>
                          <h3 className="info-title">Đồ Ăn & Thức Uống</h3>
                          <p className="info-subtitle">Sản phẩm đã đặt kèm</p>
                        </div>
                      </div>

                      <div className="info-items">
                        {details
                          .filter(d => d?.ItemId?.Name)
                          .map((detail, index) => (
                            <div key={index} className="info-item">
                              <ShoppingBag size={20} color="#6b7280" />
                              <div className="info-item-content">
                                <div className="info-item-label">{detail.ItemId.Name}</div>
                                <div className="info-item-value">
                                  x{detail.Quantity} –{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format((detail.ItemId?.Price || detail.Price || 0) * detail.Quantity)}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* System Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Hệ Thống</h3>
                        <p className="info-subtitle">Lịch sử đơn đặt vé</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày đặt</div>
                          <div className="info-item-value">
                            {order.OrderDate 
                              ? new Date(order.OrderDate).toLocaleString("vi-VN")
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">
                            {order.UpdatedAt 
                              ? new Date(order.UpdatedAt).toLocaleString("vi-VN")
                              : "N/A"}
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