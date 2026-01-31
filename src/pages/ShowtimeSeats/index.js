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

        {/* Form thêm trạng thái ghế theo suất chiếu */}
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
          <i className="fas fa-chair me-2"></i> Thêm trạng thái ghế theo suất chiếu
        </h4>

        <form onSubmit={handleAddShowtimeSeat}>
          <div className="row g-4">
            
            {/* Suất chiếu */}
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="fas fa-clock me-2 text-primary"></i>
                Suất chiếu
              </label>
              <select
                className="form-select custom-input"
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
                    {new Date(s.StartTime).toLocaleString("vi-VN")}
                  </option>
                ))}
              </select>
            </div>

            {/* Ghế */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-couch me-2 text-danger"></i>
                Chọn ghế
              </label>
              <select
                className="form-select custom-input"
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
                    🪑 Hàng {seat.Row} - Ghế {seat.Number} ({seat.SeatType})
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-info-circle me-2 text-success"></i>
                Trạng thái ghế
              </label>
              <select
                className="form-select custom-input"
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

            {/* Info box */}
            {newShowtimeSeat.ShowtimeId && newShowtimeSeat.SeatId && (
              <div className="col-12">
                <div className="alert alert-info d-flex align-items-center" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Bạn đang cập nhật trạng thái ghế cho suất chiếu đã chọn
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
