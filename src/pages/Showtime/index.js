import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import ShowtimeApi from "../../api/ShowtimeApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteShowtime } from "./delete";

export default function Showtime() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  // state mới để thêm suất chiếu
  const [newShowtime, setNewShowtime] = useState({
    MovieId: "",
    RoomId: "",
    StartTime: "",
    EndTime: "",
    Price: "",
    Status: "Scheduled",
  });

  useEffect(() => {
    // Lấy tất cả showtimes
    ShowtimeApi.getAll()
      .then((res) => {
        setShowtimes(res.data.data);
      })
      .catch((err) => console.error("Lỗi load Showtimes:", err))
      .finally(() => setLoading(false));
    // Lấy danh sách room
    RoomApi.getAll()
      .then((res) => setRooms(res.data.data))
      .catch((err) => console.error("Lỗi load rooms:", err));

    // Lấy danh sách movie
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

  // Hàm thêm suất chiếu
  const handleAddShowtime = async (e) => {
    e.preventDefault();
    try {
      const res = await ShowtimeApi.create(newShowtime);
      const created = res.data.data || res.data;

      setShowtimes([...showtimes, created]); // cập nhật danh sách

      // reset form
      setNewShowtime({
        MovieId: "",
        RoomId: "",
        StartTime: "",
        EndTime: "",
        Price: "",
        Status: "Scheduled",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm suất chiếu thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm suất chiếu:", error);
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

  const toggleStatus = (showtimeId) => {
    setShowtimes((prev) =>
      prev.map((showtime) =>
        showtime.ShowtimeId === showtimeId
          ? {
              ...showtime,
              Status:
                showtime.Status === "Scheduled" ? "Cancelled" : "Scheduled",
            }
          : showtime
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
                  <i className="fas fa-heart me-2"></i> Quản lý xuất chiếu.
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
                        <i className="fas fa-plus-circle me-2"></i> Thêm danh
                        xuất chiếu
                      </h4>

                      <form onSubmit={handleAddShowtime}>
                        <div className="row g-4">
                          {/* Phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>
                              Phim được chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newShowtime.MovieId}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  MovieId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn phim --</option>
                              {movies.map((m) => (
                                <option key={m.MovieId} value={m.MovieId}>
                                  {m.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Phòng chiếu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-door-open me-2 text-danger"></i>
                              Phòng chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newShowtime.RoomId}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  RoomId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn phòng --</option>
                              {rooms.map((r) => (
                                <option key={r.RoomId} value={r.RoomId}>
                                  {r.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Giờ bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-success"></i>
                              Giờ bắt đầu
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control custom-input"
                              value={newShowtime.StartTime}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  StartTime: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giờ kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-info"></i>
                              Giờ kết thúc
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control custom-input"
                              value={newShowtime.EndTime}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  EndTime: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giá vé */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-dollar-sign me-2 text-warning"></i>
                              Giá vé cơ bản
                            </label>
                            <input
                              type="number"
                              className="form-control custom-input"
                              placeholder="Nhập giá vé"
                              value={newShowtime.Price}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  Price: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>
                              Trạng thái suất chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newShowtime.Status}
                              onChange={(e) =>
                                setNewShowtime({
                                  ...newShowtime,
                                  Status: e.target.value,
                                })
                              }
                            >
                              <option value="Scheduled">Đã lên lịch</option>
                              <option value="Cancelled">Đã hủy</option>
                              <option value="Finished">Đã kết thúc</option>
                            </select>
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
                      <thead className="bg-light text-dark">
                        <tr>
                          <th >ID</th>
                          <th >Phim chiếu</th>
                          <th >Phòng chiếu</th>
                          <th >Giờ bắt đầu</th>
                          <th >Giờ kết thúc</th>
                          <th >Trạng thái</th>
                          <th
                           
                            className="text-center"
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && showtimes.length > 0
                          ? showtimes.map((showtime, index) => (
                              <tr
                                key={showtime.ShowtimeId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {showtime.MovieId.Title}
                                </td>
                                <td className="fw-semibold">
                                  {showtime.RoomId.Name}
                                </td>
                                <td className="text-muted">
                                  {showtime.StartTime}
                                </td>
                                <td className="text-muted">
                                  {showtime.EndTime}
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={showtime.Status === "Scheduled"}
                                      onChange={() =>
                                        toggleStatus(showtime.ShowtimeId)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      showtime.Status === "Scheduled"
                                        ? "text-success"
                                        : showtime.Status === "Cancelled"
                                        ? "text-warning"
                                        : "text-danger"
                                    }`}
                                  >
                                    {showtime.Status === "Scheduled"
                                      ? "Đã lên lịch"
                                      : showtime.Status === "Cancelled"
                                      ? "Đã hủy"
                                      : "Đã kết thúc"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/Showtime/show/${showtime.ShowtimeId}`
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
                                        `/Showtime/edit/${showtime.ShowtimeId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteShowtime(
                                        showtime.ShowtimeId,
                                        setShowtimes
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
                          : // Loading skeleton
                            [...Array(3)].map((_, i) => (
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
