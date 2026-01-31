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

              {/* Form thêm vé mới */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-ticket-alt me-2"></i> Thêm vé mới
                      </h4>

                      <form onSubmit={handleAddTicket}>
                        <div className="row g-4">
                          {/* Người đặt */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-primary"></i>
                              Người đặt vé
                            </label>
                            <select
                              className="form-select custom-input"
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
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-danger"></i>
                              Suất chiếu
                            </label>
                            <select
                              className="form-select custom-input"
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
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-couch me-2 text-success"></i>
                              Ghế ngồi
                            </label>
                            <select
                              className="form-select custom-input"
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
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-check me-2 text-info"></i>
                              Thời điểm đặt vé
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control custom-input"
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
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-info-circle me-2 text-warning"></i>
                              Trạng thái vé
                            </label>
                            <select
                              className="form-select custom-input"
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
                              <div className="col-12">
                                <div
                                  className="alert alert-warning"
                                  role="alert"
                                >
                                  <div className="d-flex align-items-center mb-3">
                                    <i className="fas fa-check-circle me-2 fs-4"></i>
                                    <h5 className="mb-0 fw-bold">
                                      Xác nhận thông tin đặt vé
                                    </h5>
                                  </div>
                                  <div className="ms-4">
                                    <p className="mb-2">
                                      <i className="fas fa-user me-2 text-primary"></i>
                                      Khách hàng:{" "}
                                      <strong>
                                        {
                                          users.find(
                                            (u) => u.UserId === newTicket.UserId
                                          )?.FullName
                                        }
                                      </strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-film me-2 text-danger"></i>
                                      Suất chiếu:{" "}
                                      <strong>
                                        {
                                          showtimes.find(
                                            (s) =>
                                              s.ShowtimeId ===
                                              newTicket.ShowtimeId
                                          )?.Movie?.Title
                                        }
                                      </strong>
                                    </p>
                                    <p className="mb-0">
                                      <i className="fas fa-chair me-2 text-success"></i>
                                      Ghế:{" "}
                                      <strong>
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

                        {/* Nút hành động */}
                        <div className="col-12 text-end mt-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn btn-gradient-success me-2 rounded-pill px-4"
                          >
                            <i className="fas fa-save me-1"></i> Lưu
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="btn btn-gradient-secondary rounded-pill px-4"
                            onClick={() => setShowForm(false)}
                          >
                            <i className="fas fa-times me-1"></i> Hủy
                          </motion.button>
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
