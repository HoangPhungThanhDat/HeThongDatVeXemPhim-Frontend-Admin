import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import TicketApi from "../../api/TicketApi";
import UserApi from "../../api/UserApi";
import SeatApi from "../../api/SeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import Swal from "sweetalert2";

export default function TicketEdit() {
  const { TicketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    TicketId: "",
    UserId: "",
    ShowtimeId: "",
    SeatId: "",
    BookingTime: "",
    Status: "",
  });

  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!TicketId) {
          setError("Thiếu TicketId trong URL");
          return;
        }

        setLoading(true);

        const [ticketRes, userRes, seatRes, showtimeRes] = await Promise.all([
          TicketApi.getById(TicketId),
          UserApi.getAll(),
          SeatApi.getAll(),
          ShowtimeApi.getAll(),
        ]);

        const t = ticketRes.data.data || ticketRes.data;
        setTicket(t);
        setUsers(userRes.data.data || []);
        setSeats(seatRes.data.data || []);
        setShowtimes(showtimeRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load ticket:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [TicketId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    TicketApi.update(TicketId, ticket)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật vé thành công!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: "my-toast animated-toast",
          },
          showClass: {
            popup: "animate__animated animate__slideInRight",
          },
          hideClass: {
            popup: "animate__animated animate__slideOutRight",
          },
        }).then(() => {
          navigate("/Tickets");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật vé:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật vé thất bại!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                ></div>
                <h5 className="text-primary">Đang tải dữ liệu vé...</h5>
                <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

                <div className="card shadow-sm border-0 mt-4 w-75">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 text-center">
                        <div
                          className="bg-light rounded-circle mx-auto"
                          style={{ width: "120px", height: "120px" }}
                        ></div>
                        <div
                          className="bg-light mt-3 rounded"
                          style={{
                            width: "80%",
                            height: "20px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>
                      <div className="col-md-8">
                        <div
                          className="bg-light rounded mb-3"
                          style={{ width: "60%", height: "20px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "100%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "90%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "80%", height: "15px" }}
                        ></div>
                        <div
                          className="bg-light rounded mb-2"
                          style={{ width: "70%", height: "15px" }}
                        ></div>
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

  // ❌ Nếu lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container user-show-container">
              <div className="text-center p-5 text-danger">
                <i className="fa fa-exclamation-circle fa-3x mb-3"></i>
                <h5>{error}</h5>
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={() => window.location.reload()}
                >
                  <i className="fa fa-sync-alt me-2"></i> Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!ticket) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-ticket-alt fa-2x mb-2"></i>
                <p>Không có dữ liệu vé.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="modern-cinema-page">
        <div className="cinema-container">
          {/* Breadcrumb */}
          <nav className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i>
              Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/Tickets")}
            >
              Vé
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Vé</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin vé đặt chỗ
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Người đặt */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-user label-icon"></i>
                      <span>Người đặt</span>
                    </label>
                    <select
                      className="modern-input"
                      name="UserId"
                      value={ticket.UserId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn người dùng --</option>
                      {users.map((u) => (
                        <option key={u.UserId} value={u.UserId}>
                          {u.FullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Suất chiếu */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-film label-icon"></i>
                      <span>Suất chiếu</span>
                    </label>
                    <select
                      className="modern-input"
                      name="ShowtimeId"
                      value={ticket.ShowtimeId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn suất chiếu --</option>
                      {showtimes.map((s) => (
                        <option key={s.ShowtimeId} value={s.ShowtimeId}>
                          {s.Movie?.Title || "Phim"} - {s.StartTime}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ghế ngồi */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-chair label-icon"></i>
                      <span>Ghế ngồi</span>
                    </label>
                    <select
                      className="modern-input"
                      name="SeatId"
                      value={ticket.SeatId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn ghế --</option>
                      {seats.map((s) => (
                        <option key={s.SeatId} value={s.SeatId}>
                          {s.Row}
                          {s.Number} - {s.SeatType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thời điểm đặt */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-clock label-icon"></i>
                      <span>Thời điểm đặt vé</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="modern-input"
                      name="BookingTime"
                      value={ticket.BookingTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái vé</span>
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${
                          ticket.Status === "Pending" ? "active" : ""
                        }`}
                        onClick={() =>
                          setTicket((prev) => ({ ...prev, Status: "Pending" }))
                        }
                      >
                        <div className="status-radio">
                          {ticket.Status === "Pending" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-clock"></i>
                          </div>
                          <span className="status-label">Chờ xử lý</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          ticket.Status === "Paid" ? "active" : ""
                        }`}
                        onClick={() =>
                          setTicket((prev) => ({ ...prev, Status: "Paid" }))
                        }
                      >
                        <div className="status-radio">
                          {ticket.Status === "Paid" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Đã thanh toán</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          ticket.Status === "Cancelled" ? "active" : ""
                        }`}
                        onClick={() =>
                          setTicket((prev) => ({
                            ...prev,
                            Status: "Cancelled",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {ticket.Status === "Cancelled" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Đã hủy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      className="btn-cinema btn-cancel"
                      onClick={() => navigate("/Tickets")}
                    >
                      <i className="fas fa-times"></i>
                      <span>Hủy bỏ</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              {/* Highlight Card */}
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="info-title">Lưu ý quan trọng</h3>
                <p className="info-text">
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Các thay đổi sẽ
                  được cập nhật ngay lập tức vào hệ thống.
                </p>
              </div>

              {/* Current Info */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin hiện tại</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">ID Vé:</span>
                    <span className="info-value">{ticket.TicketId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        ticket.Status === "Paid"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {ticket.Status === "Paid"
                        ? "Đã thanh toán"
                        : ticket.Status === "Pending"
                        ? "Chờ xử lý"
                        : "Đã hủy"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-check-circle"></i>
                  <span>Hướng dẫn</span>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn người đặt, suất chiếu và ghế từ danh sách</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Trạng thái "Đã thanh toán" xác nhận vé đã được mua</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhấn "Lưu thay đổi" để cập nhật thông tin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}