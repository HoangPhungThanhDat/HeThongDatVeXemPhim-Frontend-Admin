import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";
import SeatApi from "../../api/SeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteShowtimeSeat } from "./delete";

export default function ShowtimeSeat() {
  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newShowtimeSeat, setNewShowtimeSeat] = useState({
    ShowtimeId: "",
    SeatId: "",
    Status: "",
  });

  useEffect(() => {
    // Load danh sách ShowtimeSeats
    ShowtimeSeatApi.getAll()
      .then((res) => {
        setShowtimeSeats(res.data.data);
      })
      .catch((err) => console.error("Lỗi load showtimeSeats:", err))
      .finally(() => setLoading(false));

    // Load danh sách suất chiếu
    ShowtimeApi.getAll()
      .then((res) => setShowtimes(res.data.data))
      .catch((err) => console.error("Lỗi load showtimes:", err));

    // Load danh sách ghế
    SeatApi.getAll()
      .then((res) => setSeats(res.data.data))
      .catch((err) => console.error("Lỗi load seats:", err));
  }, []);

  const handleAddShowtimeSeat = async (e) => {
    e.preventDefault();
    console.log("📤 Dữ liệu gửi lên API:", newShowtimeSeat);
    try {
      const res = await ShowtimeSeatApi.create(newShowtimeSeat);
      const created = res.data.data || res.data;

      setShowtimeSeats([...showtimeSeats, created]);
      setNewShowtimeSeat({ ShowtimeId: "", SeatId: "", Status: "" });
      setShowForm(false);
      showToast(
        "success",
        "🎉 Thêm trạng thái ghế theo suất chiếu thành công!"
      );
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      showToast("error", "❌ Thêm thất bại!");
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

  const toggleStatus = async (ShowtimeSeatId, currentStatus) => {
    let newStatus;
    if (currentStatus === "Available") newStatus = "Reserved";
    else if (currentStatus === "Reserved") newStatus = "Broken";
    else if (currentStatus === "Broken") newStatus = "Available";
    else return;

    const seat = showtimeSeats.find((r) => r.ShowtimeSeatId === ShowtimeSeatId);

    try {
      await ShowtimeSeatApi.update(ShowtimeSeatId, {
        ShowtimeId: seat.ShowtimeId,
        SeatId: seat.SeatId,
        Status: newStatus,
      });

      const res = await ShowtimeSeatApi.getAll();
      setShowtimeSeats(res.data.data);
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật trạng thái:",
        error.response?.data || error
      );
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
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
                  <i className="fas fa-heart me-2"></i> Quản lý trạng thái ghế
                  theo suất chiếu
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

              {/* Form thêm */}
              {/* Form thêm trạng thái ghế theo suất chiếu - CINEMA STYLE */}
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
                          <i className="fas fa-chair"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm trạng thái ghế theo suất chiếu</h4>
                          <p className="cinema-form-subtitle">
                            Quản lý tình trạng ghế cho từng suất chiếu
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddShowtimeSeat}>
                        <div className="cinema-form-grid">
                          {/* Suất chiếu */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-clock"></i>
                              Suất chiếu
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newShowtimeSeat.ShowtimeId}
                              onChange={(e) =>
                                setNewShowtimeSeat({
                                  ...newShowtimeSeat,
                                  ShowtimeId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn suất chiếu --</option>
                              {showtimes.map((s) => (
                                <option key={s.ShowtimeId} value={s.ShowtimeId}>
                                  🎬 {s.MovieId?.Title || "Không rõ phim"} - 🕐{" "}
                                  {new Date(s.StartTime).toLocaleString(
                                    "vi-VN"
                                  )}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Ghế */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-couch"></i>
                              Chọn ghế
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newShowtimeSeat.SeatId}
                              onChange={(e) =>
                                setNewShowtimeSeat({
                                  ...newShowtimeSeat,
                                  SeatId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn ghế --</option>
                              {seats.map((seat) => (
                                <option key={seat.SeatId} value={seat.SeatId}>
                                  🪑 Hàng {seat.Row} - Ghế {seat.Number} (
                                  {seat.SeatType})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-info-circle"></i>
                              Trạng thái ghế
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newShowtimeSeat.Status}
                              onChange={(e) =>
                                setNewShowtimeSeat({
                                  ...newShowtimeSeat,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Available">✅ Còn trống</option>
                              <option value="Reserved">🎫 Đã đặt</option>
                              <option value="Broken">⚠️ Ghế hỏng</option>
                            </select>
                          </div>

                          {/* Info box - Full width */}
                          {newShowtimeSeat.ShowtimeId &&
                            newShowtimeSeat.SeatId && (
                              <div className="cinema-form-group cinema-form-grid-full">
                                <div className="cinema-helper-text">
                                  <i className="fas fa-check-circle"></i>
                                  Bạn đang cập nhật trạng thái ghế cho suất
                                  chiếu đã chọn
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
                            <i className="fas fa-save"></i>
                            Lưu trạng thái
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
                          <th className="px-4">id</th>
                          <th>Suất chiếu</th>
                          <th>Ghế</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && showtimeSeats.length > 0
                          ? showtimeSeats.map((seat, index) => (
                              <tr key={seat.Id} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {(() => {
                                    const st = showtimes.find(
                                      (s) => s.ShowtimeId === seat.ShowtimeId
                                    );
                                    return st
                                      ? `${
                                          st.MovieId?.Title || "Không rõ phim"
                                        } - ${new Date(
                                          st.StartTime
                                        ).toLocaleString()}`
                                      : seat.ShowtimeId;
                                  })()}
                                </td>

                                <td className="text-muted">
                                  {(() => {
                                    const st = seats.find(
                                      (s) => s.SeatId === seat.SeatId
                                    );
                                    return st
                                      ? `Hàng ${st.Row} - Ghế ${st.Number} (${st.SeatType})`
                                      : seat.SeatId;
                                  })()}
                                </td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={seat.Status === "Available"}
                                      onChange={() =>
                                        toggleStatus(
                                          seat.ShowtimeSeatId,
                                          seat.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>

                                  <span
                                    className={`ms-2 fw-semibold ${
                                      seat.Status === "Available"
                                        ? "text-success"
                                        : seat.Status === "Reserved"
                                        ? "text-warning"
                                        : seat.Status === "Broken"
                                        ? "text-danger"
                                        : ""
                                    }`}
                                  >
                                    {seat.Status === "Available"
                                      ? "Còn trống"
                                      : seat.Status === "Reserved"
                                      ? "Đã đặt"
                                      : seat.Status === "Broken"
                                      ? "Hỏng"
                                      : ""}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/showtimeseats/show/${seat.ShowtimeSeatId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(
                                        `/showtimeseats/edit/${seat.ShowtimeSeatId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteShowtimeSeat(
                                        seat.ShowtimeSeatId,
                                        setShowtimeSeats
                                      )
                                    }
                                    className="action-btn text-danger"
                                    title="Xóa"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          : [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td colSpan="5" className="py-3">
                                  <div className="skeleton w-100 h-20"></div>
                                </td>
                              </tr>
                            ))}
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
