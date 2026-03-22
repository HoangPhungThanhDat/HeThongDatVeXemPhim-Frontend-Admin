import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteShowtimeSeat } from "./delete";

// ✅ THÊM: Helper lấy thông tin từ showtime (xử lý cả 2 trường hợp object và ID)
const getMovieTitle = (s) => {
  if (!s) return "Không rõ phim";
  if (s.Movie?.Title) return s.Movie.Title;                        // có quan hệ Movie
  if (typeof s.MovieId === "object") return s.MovieId?.Title ?? "Không rõ phim"; // MovieId là object
  return "Không rõ phim";
};

const getRoomName = (s) => {
  if (!s) return "";
  if (s.Room?.Name) return s.Room.Name;                           // có quan hệ Room
  if (typeof s.RoomId === "object") return s.RoomId?.Name ?? ""; // RoomId là object
  return "";
};

const getSeatLabel = (seat) => {
  if (seat.Seat?.Row) return `Hàng ${seat.Seat.Row} - Ghế ${seat.Seat.Number} (${seat.Seat.SeatType})`;
  if (typeof seat.SeatId === "object") return `Hàng ${seat.SeatId?.Row} - Ghế ${seat.SeatId?.Number} (${seat.SeatId?.SeatType})`;
  return `SeatId: ${seat.SeatId}`;
};

export default function ShowtimeSeat() {
  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [showtimes, setShowtimes]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [generating, setGenerating]       = useState(false);
  const [showForm, setShowForm]           = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [previewCount, setPreviewCount]   = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [seatsRes, showtimesRes] = await Promise.all([
        ShowtimeSeatApi.getAll(),
        ShowtimeApi.getAll(),
      ]);
      setShowtimeSeats(seatsRes.data.data || []);
      setShowtimes(showtimesRes.data.data || []);
    } catch (err) {
      console.error("Lỗi load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShowtime = (showtimeId) => {
    setSelectedShowtimeId(showtimeId);
    if (!showtimeId) { setPreviewCount(null); return; }
    const existingCount = showtimeSeats.filter(
      (s) => String(s.ShowtimeId) === String(showtimeId)
    ).length;
    setPreviewCount(existingCount);
  };

  const handleGenerateSeats = async (e) => {
    e.preventDefault();
    if (!selectedShowtimeId) return;

    const existingCount = showtimeSeats.filter(
      (s) => String(s.ShowtimeId) === String(selectedShowtimeId)
    ).length;

    if (existingCount > 0) {
      const confirm = await Swal.fire({
        title: "Suất chiếu đã có ghế!",
        html: `Suất chiếu này đã có <b>${existingCount} ghế</b>.<br/>Bạn có muốn tạo lại không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Tạo lại",
        cancelButtonText: "Hủy",
      });
      if (!confirm.isConfirmed) return;
    }

    setGenerating(true);
    try {
      await ShowtimeSeatApi.generateByShowtime(selectedShowtimeId);
      showToast("success", "🎉 Tạo ghế hàng loạt thành công!");
      setShowForm(false);
      setSelectedShowtimeId("");
      setPreviewCount(null);
      await loadData();
    } catch (error) {
      console.error("Lỗi khi generate ghế:", error);
      showToast("error", "❌ Tạo ghế thất bại! Kiểm tra lại phòng có ghế chưa.");
    } finally {
      setGenerating(false);
    }
  };

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true, position: "top-end", icon, title: message,
      showConfirmButton: false, timer: 3000, timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };

  const toggleStatus = async (ShowtimeSeatId, currentStatus) => {
    let newStatus;
    if (currentStatus === "Available")     newStatus = "Reserved";
    else if (currentStatus === "Reserved") newStatus = "Broken";
    else if (currentStatus === "Broken")   newStatus = "Available";
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
                  <i className="fas fa-heart me-2"></i>
                  Quản lý trạng thái ghế theo suất chiếu
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => { setShowForm(!showForm); setSelectedShowtimeId(""); setPreviewCount(null); }}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Tạo ghế tự động
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form tạo ghế tự động */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-1 text-primary d-flex align-items-center">
                        <i className="fas fa-magic me-2"></i>
                        Tạo ghế tự động theo suất chiếu
                      </h4>
                      <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
                        Chọn suất chiếu — hệ thống sẽ tự động tạo toàn bộ ghế của phòng đó.
                      </p>

                      <form onSubmit={handleGenerateSeats}>
                        <div className="row g-4">
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>
                              Chọn suất chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={selectedShowtimeId}
                              onChange={(e) => handleSelectShowtime(e.target.value)}
                              required
                            >
                              <option value="">-- Chọn suất chiếu --</option>
                              {showtimes.map((s) => {
                                const count = showtimeSeats.filter(
                                  (ss) => String(ss.ShowtimeId) === String(s.ShowtimeId)
                                ).length;
                                // ✅ Dùng helper — không render object trực tiếp
                                const title    = getMovieTitle(s);
                                const roomName = getRoomName(s);
                                const time     = s.StartTime
                                  ? new Date(s.StartTime).toLocaleString("vi-VN")
                                  : "";
                                const status   = count > 0
                                  ? `✅ (đã có ${count} ghế)`
                                  : "⚠️ (chưa có ghế)";

                                return (
                                  <option key={s.ShowtimeId} value={s.ShowtimeId}>
                                    {`🎬 ${title} — 🕐 ${time} — 🏠 ${roomName} — ${status}`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {selectedShowtimeId && (
                            <div className="col-12">
                              {previewCount > 0 ? (
                                <div className="alert alert-warning d-flex align-items-center">
                                  <i className="fas fa-exclamation-triangle me-2"></i>
                                  Suất chiếu này đã có <strong className="mx-1">{previewCount} ghế</strong>.
                                  Nếu tạo lại sẽ xóa và tạo mới toàn bộ.
                                </div>
                              ) : (
                                <div className="alert alert-success d-flex align-items-center">
                                  <i className="fas fa-check-circle me-2"></i>
                                  Suất chiếu chưa có ghế — sẵn sàng tạo tự động!
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="col-12 text-end mt-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn btn-gradient-success me-2 rounded-pill px-4"
                            disabled={!selectedShowtimeId || generating}
                          >
                            {generating ? (
                              <><i className="fas fa-spinner fa-spin me-1"></i>Đang tạo ghế...</>
                            ) : (
                              <><i className="fas fa-magic me-1"></i>Tạo ghế tự động</>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            type="button"
                            className="btn btn-gradient-secondary rounded-pill px-4"
                            onClick={() => { setShowForm(false); setSelectedShowtimeId(""); setPreviewCount(null); }}
                          >
                            <i className="fas fa-times me-1"></i> Hủy
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bảng danh sách */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">ID</th>
                          <th>Suất chiếu</th>
                          <th>Ghế</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showtimeSeats.length > 0 ? (
                          showtimeSeats.map((seat, index) => {
                            const st = showtimes.find(
                              (s) => String(s.ShowtimeId) === String(seat.ShowtimeId)
                            );
                            // ✅ Dùng helper — không render object trực tiếp
                            const movieTitle = getMovieTitle(st);
                            const time = st?.StartTime
                              ? new Date(st.StartTime).toLocaleString("vi-VN")
                              : "";
                            const seatLabel = getSeatLabel(seat);

                            return (
                              <tr key={seat.ShowtimeSeatId} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>

                                <td className="fw-semibold">
                                  {st ? `${movieTitle} — ${time}` : String(seat.ShowtimeId)}
                                </td>

                                <td className="text-muted">{seatLabel}</td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={seat.Status === "Available"}
                                      onChange={() => toggleStatus(seat.ShowtimeSeatId, seat.Status)}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span className={`ms-2 fw-semibold ${
                                    seat.Status === "Available" ? "text-success"
                                    : seat.Status === "Reserved"  ? "text-warning"
                                    : "text-danger"
                                  }`}>
                                    {seat.Status === "Available" ? "Còn trống"
                                      : seat.Status === "Reserved" ? "Đã đặt"
                                      : "Hỏng"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button className="action-btn text-info" title="Chi tiết"
                                    onClick={() => navigate(`/showtimeseats/show/${seat.ShowtimeSeatId}`)}>
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button className="action-btn text-primary" title="Sửa"
                                    onClick={() => navigate(`/showtimeseats/edit/${seat.ShowtimeSeatId}`)}>
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button className="action-btn text-danger" title="Xóa"
                                    onClick={() => deleteShowtimeSeat(seat.ShowtimeSeatId, setShowtimeSeats)}>
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-5 text-muted">
                              <i className="fas fa-chair fa-2x mb-2 d-block"></i>
                              Chưa có dữ liệu ghế. Bấm "Tạo ghế tự động" để bắt đầu.
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