import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import TicketApi from "../../api/TicketApi";
import UserApi from "../../api/UserApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import SeatApi from "../../api/SeatApi";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteTicket } from "./delete";

export default function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    ShowtimeId: "",
    SeatId: "",
    UserId: "",
    BookingTime: "",
    Status: "Pending",
  });

  useEffect(() => {
    // Lấy tất cả ticket
    TicketApi.getAll()
      .then((res) => {
        setTickets(res.data.data);
      })
      .catch((err) => console.error("Lỗi load ticket:", err))
      .finally(() => setLoading(false));
    // Lấy danh sách user
    UserApi.getAll()
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Lỗi load users:", err));
    // Lấy danh sách suất chiếu
    ShowtimeApi.getAll()
      .then((res) => setShowtimes(res.data.data))
      .catch((err) => console.error("Lỗi load Showtimes:", err));
    // Lấy danh sách ghế
    SeatApi.getAll()
      .then((res) => setSeats(res.data.data))
      .catch((err) => console.error("Lỗi load Seats:", err));
  }, []);

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await TicketApi.create(newTicket);
      const created = res.data.data || res.data;

      setTickets((prev) => [...prev, created]);

      // Reset form
      setNewTicket({
        ShowtimeId: "",
        SeatId: "",
        UserId: "",
        BookingTime: "",
        Status: "Pending",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm vé thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vé:", error.response?.data || error.message);

      // ❌ Thông báo lỗi
      showToast("error", "❌ Thêm vé thất bại!");
    }
  };

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

  // Toggle trạng thái user
  const toggleStatus = (TicketId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.TicketId === TicketId
          ? {
              ...ticket,
              Status: ticket.Status === "Paid" ? "Pending" : "Cancelled",
            }
          : ticket
      )
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-heart me-2"></i> Quản lý vé
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form thêm vé mới - CINEMA STYLE */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="cinema-add-form"
                  >
                    {/* Form Header */}
                    <div className="cinema-form-header">
                      <div className="cinema-form-title">
                        <div className="cinema-form-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm vé mới</h4>
                          <p className="cinema-form-subtitle">
                            Đặt vé xem phim cho khách hàng
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddTicket}>
                        <div className="cinema-form-grid">
                          {/* Người đặt */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-user"></i>
                              Người đặt vé
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newTicket.UserId}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  UserId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn người đặt --</option>
                              {users.map((u) => (
                                <option key={u.UserId} value={u.UserId}>
                                  👤 {u.FullName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Suất chiếu */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-clock"></i>
                              Suất chiếu
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newTicket.ShowtimeId}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  ShowtimeId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn suất chiếu --</option>
                              {showtimes.map((s) => (
                                <option key={s.ShowtimeId} value={s.ShowtimeId}>
                                  🎬 {s.Movie?.Title || "Phim"} - 🕐{" "}
                                  {new Date(s.StartTime).toLocaleString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Ghế ngồi */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-couch"></i>
                              Ghế ngồi
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newTicket.SeatId}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  SeatId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn ghế --</option>
                              {seats.map((s) => (
                                <option key={s.SeatId} value={s.SeatId}>
                                  🪑 {s.Row}
                                  {s.Number} - {s.SeatType}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Thời gian đặt */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-check"></i>
                              Thời điểm đặt vé
                              <span className="required">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              className="cinema-input"
                              value={newTicket.BookingTime}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  BookingTime: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Trạng thái vé */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-info-circle"></i>
                              Trạng thái vé
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newTicket.Status}
                              onChange={(e) =>
                                setNewTicket({
                                  ...newTicket,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Pending">⏳ Chờ xử lý</option>
                              <option value="Paid">✅ Đã thanh toán</option>
                              <option value="Cancelled">❌ Đã hủy</option>
                            </select>
                          </div>

                          {/* Summary Box - Hiển thị khi chọn đủ thông tin */}
                          {newTicket.UserId &&
                            newTicket.ShowtimeId &&
                            newTicket.SeatId && (
                              <div className="cinema-form-group cinema-form-grid-full">
                                <div
                                  style={{
                                    padding: "20px",
                                    background: "rgba(247, 147, 30, 0.08)",
                                    border: "2px solid rgba(247, 147, 30, 0.3)",
                                    borderRadius: "12px",
                                    marginTop: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <i
                                      className="fas fa-check-circle"
                                      style={{
                                        color: "#f7931e",
                                        fontSize: "24px",
                                      }}
                                    ></i>
                                    <h5
                                      style={{
                                        margin: 0,
                                        color: "white",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Xác nhận thông tin đặt vé
                                    </h5>
                                  </div>
                                  <div
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "14px",
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-user"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Khách hàng:{" "}
                                      <strong style={{ color: "white" }}>
                                        {
                                          users.find(
                                            (u) => u.UserId === newTicket.UserId
                                          )?.FullName
                                        }
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-film"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Suất chiếu:{" "}
                                      <strong style={{ color: "white" }}>
                                        {
                                          showtimes.find(
                                            (s) =>
                                              s.ShowtimeId ===
                                              newTicket.ShowtimeId
                                          )?.Movie?.Title
                                        }
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-chair"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Ghế:{" "}
                                      <strong style={{ color: "white" }}>
                                        {
                                          seats.find(
                                            (s) => s.SeatId === newTicket.SeatId
                                          )?.Row
                                        }
                                        {
                                          seats.find(
                                            (s) => s.SeatId === newTicket.SeatId
                                          )?.Number
                                        }
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button
                            type="submit"
                            className="cinema-btn cinema-btn-primary"
                          >
                            <i className="fas fa-ticket-alt"></i>
                            Đặt vé ngay
                          </button>
                          <button
                            type="button"
                            className="cinema-btn cinema-btn-secondary"
                            onClick={() => setShowForm(false)}
                          >
                            <i className="fas fa-times"></i>
                            Hủy bỏ
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">ID</th>
                          <th>Người đặt</th>
                          <th>Suất chiếu</th>
                          <th>Ghế ngồi</th>
                          <th>Thời điểm đặt vé</th>
                          <th>Trạng thái vé</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && tickets.length > 0 ? (
                          tickets.map((ticket, index) => (
                            <tr
                              key={ticket.TicketId}
                              className="table-row-hover"
                            >
                              {/* STT */}
                              <td className="fw-bold px-4">{index + 1}</td>

                              {/* Người đặt */}
                              <td className="fw-semibold">
                                {users.find((u) => u.UserId === ticket.UserId)
                                  ?.FullName || ticket.UserId}
                              </td>

                              {/* Phim + Suất chiếu */}
                              <td className="text-muted">
                                <div className="fw-semibold text-dark">
                                  {" "}
                                  {ticket.ShowtimeId?.MovieId?.Title ||
                                    "Không rõ phim"}
                                </div>
                                <div className="small text-secondary">
                                  ⏰{" "}
                                  {ticket.ShowtimeId?.StartTime ||
                                    "Không rõ giờ"}
                                </div>
                              </td>

                              {/* Ghế ngồi */}
                              <td className="fw-semibold">
                                {ticket.SeatId
                                  ? `${ticket.SeatId.Row}${ticket.SeatId.Number}`
                                  : "Không rõ ghế"}
                              </td>

                              {/* Thời điểm đặt vé */}
                              <td className="fw-semibold">
                                {ticket.BookingTime}
                              </td>

                              {/* Trạng thái vé */}
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={ticket.Status === "Paid"}
                                    onChange={() =>
                                      toggleStatus(ticket.TicketId)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    ticket.Status === "Paid"
                                      ? "text-success"
                                      : ticket.Status === "Pending"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {ticket.Status === "Paid"
                                    ? "Đã thanh toán"
                                    : ticket.Status === "Pending"
                                    ? "Chờ xử lý"
                                    : "Đã hủy"}
                                </span>
                              </td>

                              {/* Hành động */}
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/Ticket/show/${ticket.TicketId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/Ticket/edit/${ticket.TicketId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deleteTicket(ticket.TicketId, setTickets)
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
                              Không có vé nào được tìm thấy
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
    </div>
  );
}
