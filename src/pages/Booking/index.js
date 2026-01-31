import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import OrderApi from "../../api/OrderApi";
import OrderDetailApi from "../../api/OrderDetailApi";
import TicketApi from "../../api/TicketApi";
import UserApi from "../../api/UserApi";
import MovieApi from "../../api/MovieApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import CinemasApi from "../../api/CinemasApi";
import SeatApi from "../../api/SeatApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          ordersRes,
          orderDetailsRes,
          ticketsRes,
          usersRes,
          moviesRes,
          showtimesRes,
          cinemasRes,
          seatsRes,
        ] = await Promise.all([
          OrderApi.getAll(),
          OrderDetailApi.getAll(),
          TicketApi.getAll(),
          UserApi.getAll(),
          MovieApi.getAll(),
          ShowtimeApi.getAll(),
          CinemasApi.getAll(),
          SeatApi.getAll(),
        ]);

        const ordersData = ordersRes.data.data || ordersRes.data;
        const orderDetailsData = orderDetailsRes.data.data || orderDetailsRes.data;
        const ticketsData = ticketsRes.data.data || ticketsRes.data;
        const usersData = usersRes.data.data || usersRes.data;
        const moviesData = moviesRes.data.data || moviesRes.data;
        const showtimesData = showtimesRes.data.data || showtimesRes.data;
        const cinemasData = cinemasRes.data.data || cinemasRes.data;
        const seatsData = seatsRes.data.data || seatsRes.data;

        setOrders(ordersData);
        setOrderDetails(orderDetailsData);
        setTickets(ticketsData);
        setUsers(usersData);
        setMovies(moviesData);
        setShowtimes(showtimesData);
        setCinemas(cinemasData);
        setSeats(seatsData);
      } catch (err) {
        console.error("❌ Lỗi load dữ liệu:", err);
        showToast("error", "❌ Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };

  const deleteOrder = async (OrderId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Đơn hàng này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await OrderApi.delete(OrderId);
        setOrders(orders.filter((o) => o.OrderId !== OrderId));
        showToast("success", "🗑️ Xóa đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        showToast("error", "❌ Xóa thất bại!");
      }
    }
  };

  // ===================== HELPER FUNCTIONS =====================

  const getUserName = (userId) => {
    const user = users.find((u) => u.UserId === userId);
    return user ? user.FullName || user.Email : "N/A";
  };

  const getOrderDetailsByOrderId = (orderId) => {
    return orderDetails.filter((od) => {
      const detailOrderId = typeof od.OrderId === 'object' ? od.OrderId.OrderId : od.OrderId;
      return detailOrderId === orderId;
    });
  };

  const getTicketsByUserId = (userId) => {
    return tickets.filter((t) => t.UserId === userId);
  };

  const getMovieName = (order) => {
    const userTickets = getTicketsByUserId(order.UserId);
    if (userTickets.length === 0) return "N/A";

    const ticket = userTickets[0];
    
    if (typeof ticket.ShowtimeId === 'object' && ticket.ShowtimeId !== null) {
      const movieId = ticket.ShowtimeId.MovieId;
      
      if (typeof movieId === 'object' && movieId !== null) {
        return movieId.Title || "N/A";
      }
      
      const movie = movies.find((m) => m.MovieId === movieId);
      return movie ? movie.Title : "N/A";
    }

    return "N/A";
  };

  const getShowtimeInfo = (order) => {
    const userTickets = getTicketsByUserId(order.UserId);
    if (userTickets.length === 0) return "N/A";

    const ticket = userTickets[0];
    
    if (typeof ticket.ShowtimeId === 'object' && ticket.ShowtimeId !== null) {
      if (!ticket.ShowtimeId.StartTime) return "N/A";
      const date = new Date(ticket.ShowtimeId.StartTime);
      return `${date.toLocaleDateString("vi-VN")} - ${date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return "N/A";
  };

  const getCinemaRoom = (order) => {
    const userTickets = getTicketsByUserId(order.UserId);
    if (userTickets.length === 0) return "N/A";

    const ticket = userTickets[0];
    
    if (typeof ticket.ShowtimeId === 'object' && ticket.ShowtimeId !== null) {
      const showtime = ticket.ShowtimeId;
      
      if (typeof showtime.RoomId === 'object' && showtime.RoomId !== null) {
        const room = showtime.RoomId;
        const roomName = room.Name || `Phòng ${room.RoomId}`;
        
        const cinema = cinemas.find((c) => c.CinemaId === room.CinemaId);
        const cinemaName = cinema ? cinema.Name : "N/A";
        
        return `${cinemaName} - ${roomName}`;
      }
    }

    return "N/A";
  };

  const getStatusBadge = (status) => {
    const badges = {
      Completed: { class: "success", icon: "check-circle", text: "Hoàn thành" },
      Paid: { class: "success", icon: "check-circle", text: "Đã thanh toán" },
      Cancelled: { class: "danger", icon: "times-circle", text: "Đã hủy" },
      Pending: { class: "warning", icon: "clock", text: "Chờ xử lý" },
    };
    const badge = badges[status] || badges.Pending;
    return (
      <span className={`badge-status badge-${badge.class}`}>
        <i className={`fas fa-${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.OrderId?.toString().includes(searchTerm) ||
      getUserName(order.UserId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMovieName(order).toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "All" || order.Status === filterStatus;
    const matchPayment = filterPayment === "All" || order.PaymentStatus === filterPayment;

    return matchSearch && matchStatus && matchPayment;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.Status === "Completed" || o.Status === "Paid").length,
    cancelled: orders.filter((o) => o.Status === "Cancelled").length,
    totalRevenue: orders
      .filter((o) => (o.Status === "Completed" || o.Status === "Paid"))
      .reduce((sum, o) => sum + (o.TotalAmount || 0), 0),
  };

  if (loading) return <Loader />;

  return (
    <MainLayout>
      <style>{`
        /* Statistics Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .stat-card.primary { border-left-color: #6366f1; }
        .stat-card.success { border-left-color: #10b981; }
        .stat-card.warning { border-left-color: #f59e0b; }
        .stat-card.info { border-left-color: #3b82f6; }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          margin-bottom: 16px;
        }

        .stat-card.primary .stat-icon { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .stat-card.success .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
        .stat-card.warning .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .stat-card.info .stat-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }

        /* Filter Section */
        .filter-section {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }

        .filter-icon-box {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .filter-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .filter-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .filter-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          height: 46px;
          padding: 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .filter-input::placeholder {
          color: #9ca3af;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        /* Filter Summary */
        .filter-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .filter-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .filter-badge.primary { background: #eff6ff; color: #1e40af; }
        .filter-badge.info { background: #f0f9ff; color: #0369a1; }
        .filter-badge.success { background: #f0fdf4; color: #15803d; }
        .filter-badge.warning { background: #fffbeb; color: #b45309; }

        .reset-btn {
          padding: 8px 20px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .reset-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          color: #374151;
        }

        /* Table */
        .orders-table-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .orders-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .orders-table thead th {
          background: #f9fafb;
          padding: 16px 20px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f3f4f6;
        }

        .orders-table tbody td {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
          vertical-align: middle;
        }

        .orders-table tbody tr {
          transition: all 0.2s ease;
        }

        .orders-table tbody tr:hover {
          background: #f9fafb;
        }

        .order-id {
          font-weight: 700;
          color: #111827;
          font-size: 15px;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .customer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          flex-shrink: 0;
        }

        .customer-name {
          font-weight: 600;
          color: #111827;
        }

        .movie-title {
          font-weight: 600;
          color: #111827;
        }

        .info-text {
          font-size: 13px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-text i {
          color: #9ca3af;
        }

        .total-amount {
          font-size: 16px;
          font-weight: 700;
          color: #059669;
        }

        /* Status Badges */
        .badge-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 16px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filter-grid {
            grid-template-columns: 1fr;
          }

          .filter-summary {
            flex-direction: column;
            align-items: flex-start;
          }

          .orders-table-wrapper {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 800px;
          }
        }
      `}</style>

      <main>
        <div className="main-container">
          <div className="pd-ltr-20">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm rounded-4 header-box" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                <i className="fas fa-receipt me-2"></i> Quản lý đơn đặt vé
              </h3>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">
                  <i className="fas fa-receipt"></i>
                </div>
                <div className="stat-label">Tổng đơn hàng</div>
                <div className="stat-value">{stats.total}</div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-label">Hoàn thành</div>
                <div className="stat-value">{stats.completed}</div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stat-label">Đã hủy</div>
                <div className="stat-value">{stats.cancelled}</div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-label">Doanh thu</div>
                <div className="stat-value" style={{ fontSize: '20px' }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(stats.totalRevenue)}
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
              <div className="filter-header">
                <div className="filter-icon-box">
                  <i className="fas fa-filter"></i>
                </div>
                <div>
                  <div className="filter-title">Bộ Lọc Nâng Cao</div>
                  <div className="filter-subtitle">Tìm kiếm và lọc đơn hàng theo tiêu chí</div>
                </div>
              </div>

              <div className="filter-grid">
                <div className="filter-group">
                  <label>
                    <i className="fas fa-search me-2"></i>
                    Tìm kiếm
                  </label>
                  <div className="search-wrapper">
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Mã đơn, tên khách hàng, phim..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>

                <div className="filter-group">
                  <label>
                    <i className="fas fa-info-circle me-2"></i>
                    Trạng thái đơn hàng
                  </label>
                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Cancelled">Đã hủy</option>
                    <option value="Pending">Chờ xử lý</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>
                    <i className="fas fa-credit-card me-2"></i>
                    Trạng thái thanh toán
                  </label>
                  <select
                    className="filter-select"
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                  >
                    <option value="All">Tất cả thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Unpaid">Chưa thanh toán</option>
                  </select>
                </div>
              </div>

              <div className="filter-summary">
                <div className="filter-badges">
                  <span className="filter-badge primary">
                    <i className="fas fa-chart-bar"></i>
                    {filteredOrders.length} đơn hàng
                  </span>
                  
                  {searchTerm && (
                    <span className="filter-badge info">
                      <i className="fas fa-search"></i>
                      "{searchTerm}"
                    </span>
                  )}
                  
                  {filterStatus !== "All" && (
                    <span className="filter-badge success">
                      <i className="fas fa-filter"></i>
                      {filterStatus}
                    </span>
                  )}
                  
                  {filterPayment !== "All" && (
                    <span className="filter-badge warning">
                      <i className="fas fa-credit-card"></i>
                      {filterPayment}
                    </span>
                  )}
                </div>

                {(searchTerm || filterStatus !== "All" || filterPayment !== "All") && (
                  <button
                    className="reset-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("All");
                      setFilterPayment("All");
                    }}
                  >
                    <i className="fas fa-redo"></i>
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table align-middle table-hover">
                    <thead className="bg-light text-dark border-bottom">
                      <tr>
                        <th className="px-3">Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Phim</th>
                        <th>Suất chiếu</th>
                        <th>Rạp / Phòng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th className="text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.OrderId} className="table-row-hover">
                            <td className="fw-bold px-3">{order.OrderId}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle me-2">
                                  <i className="fas fa-user"></i>
                                </div>
                                <span className="fw-semibold">
                                  {getUserName(order.UserId)}
                                </span>
                              </div>
                            </td>
                            <td className="fw-semibold">{getMovieName(order.OrderId)}</td>
                            <td>
                              <small className="text-muted">
                                <i className="fas fa-calendar-alt me-1"></i>
                                {getShowtimeInfo(order.OrderId)}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {getCinemaRoom(order.OrderId)}
                              </small>
                            </td>
                        
                            <td className="fw-bold text-success">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(order.TotalAmount || 0)}
                            </td>
                            <td>{getStatusBadge(order.Status)}</td>
                          
                            <td className="text-center">
                              <button
                                className="action-btn text-info"
                                title="Chi tiết"
                                onClick={() => navigate(`/bookings/show/${order.OrderId}`)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                             
                              <button
                                onClick={() => deleteOrder(order.OrderId)}
                                className="action-btn text-danger"
                                title="Xóa"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-5">
                            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Không tìm thấy đơn hàng nào</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}