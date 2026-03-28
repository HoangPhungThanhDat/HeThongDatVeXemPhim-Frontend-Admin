import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import ScheduleApi from "../../api/ScheduleApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteSchedule } from "./delete";

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    MovieId: "",
    RoomId: "",
    StartDate: "",
    EndDate: "",
    DaysOfWeek: [],
    StartTime: "",
    EndTime: "",
    Price: "",
    Status: "",
  });

  useEffect(() => {
    ScheduleApi.getAll()
      .then((res) => setSchedules(res.data.data))
      .catch((err) => console.error("Lỗi load schedules:", err))
      .finally(() => setLoading(false));

    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));

    RoomApi.getAll()
      .then((res) => setRooms(res.data.data))
      .catch((err) => console.error("Lỗi load rooms:", err));
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

  // ✅ handleAddSchedule mới: đọc meta từ backend để hiển thị số suất chiếu + ghế đã tạo
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newSchedule,
        MovieId:    newSchedule.MovieId ? Number(newSchedule.MovieId) : null,
        RoomId:     newSchedule.RoomId  ? Number(newSchedule.RoomId)  : null,
        DaysOfWeek: newSchedule.DaysOfWeek, // gửi dạng array ['Mon','Tue',...]
        Price:      parseFloat(newSchedule.Price),
      };

      const res = await ScheduleApi.create(payload);
      const { data: createdSchedule, meta } = res.data;

      setSchedules([...schedules, createdSchedule]);

      // Reset form
      setNewSchedule({
        MovieId: "",
        RoomId: "",
        StartDate: "",
        EndDate: "",
        DaysOfWeek: [],
        StartTime: "",
        EndTime: "",
        Price: "",
        Status: "",
      });
      setShowForm(false);

      // Toast hiển thị số suất chiếu + ghế đã tạo tự động
      const detail = meta
        ? ` (${meta.showtimes_created} suất chiếu, ${meta.seats_created} ghế)`
        : "";
      showToast("success", `🎉 Tạo lịch chiếu thành công!${detail}`);
    } catch (error) {
      console.error("Lỗi khi thêm schedule:", error);
      const errMsg = error.response?.data?.message || "Thêm thất bại!";
      showToast("error", `❌ ${errMsg}`);
    }
  };

  const toggleStatus = async (ScheduleId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const scheduleItem = schedules.find((r) => r.ScheduleId === ScheduleId);
      if (!scheduleItem) {
        console.error("❌ Không tìm thấy schedule với ID:", ScheduleId);
        return;
      }

      let days = scheduleItem.DaysOfWeek;
      if (typeof days === "string") {
        days = days.split(",").map((d) => d.trim());
      } else if (!Array.isArray(days)) {
        days = [];
      }

      const startDate =
        scheduleItem.StartDate?.split("T")[0] || scheduleItem.StartDate;
      const endDate =
        scheduleItem.EndDate?.split("T")[0] || scheduleItem.EndDate;
      const startTime =
        scheduleItem.StartTime?.slice(0, 5) || scheduleItem.StartTime;
      const endTime =
        scheduleItem.EndTime?.slice(0, 5) || scheduleItem.EndTime;

      let priceValue = scheduleItem.Price;
      if (typeof priceValue === "string") {
        priceValue = priceValue.replace(/[^\d]/g, "");
      }
      priceValue = Number(priceValue);

      if (isNaN(priceValue)) {
        console.error("❌ Giá trị Price không hợp lệ:", scheduleItem.Price);
        showToast("error", "❌ Giá trị giá vé không hợp lệ!");
        return;
      }

      const payload = {
        MovieId:    Number(scheduleItem.MovieId),
        RoomId:     Number(scheduleItem.RoomId),
        StartDate:  startDate,
        EndDate:    endDate,
        DaysOfWeek: days,
        StartTime:  startTime,
        EndTime:    endTime,
        Price:      priceValue,
        Status:     newStatus,
      };

      await ScheduleApi.update(ScheduleId, payload);

      setSchedules((prev) =>
        prev.map((r) =>
          r.ScheduleId === ScheduleId ? { ...r, Status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };

  const handleDaysChange = (dayEn) => {
    setNewSchedule((prev) => {
      const isChecked = prev.DaysOfWeek.includes(dayEn);
      return {
        ...prev,
        DaysOfWeek: isChecked
          ? prev.DaysOfWeek.filter((d) => d !== dayEn)
          : [...prev.DaysOfWeek, dayEn],
      };
    });
  };

  if (loading) return <Loader />;

  const days = [
    { vi: "Thứ 2", en: "Mon" },
    { vi: "Thứ 3", en: "Tue" },
    { vi: "Thứ 4", en: "Wed" },
    { vi: "Thứ 5", en: "Thu" },
    { vi: "Thứ 6", en: "Fri" },
    { vi: "Thứ 7", en: "Sat" },
    { vi: "Chủ nhật", en: "Sun" },
  ];

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">

              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-heart me-2"></i> Quản lý lịch chiếu định kỳ
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

              {/* Form thêm lịch chiếu định kỳ */}
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
                        <i className="fas fa-calendar-alt me-2"></i> Thêm lịch chiếu định kỳ
                      </h4>

                      <form onSubmit={handleAddSchedule}>
                        <div className="row g-4">

                          {/* Phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-primary"></i>Phim
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newSchedule.MovieId}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, MovieId: e.target.value })
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
                              <i className="fas fa-door-open me-2 text-danger"></i>Phòng chiếu
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newSchedule.RoomId}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, RoomId: e.target.value })
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

                          {/* Ngày bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-plus me-2 text-success"></i>Ngày bắt đầu
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newSchedule.StartDate}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, StartDate: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Ngày kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-minus me-2 text-info"></i>Ngày kết thúc
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newSchedule.EndDate}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, EndDate: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Giờ bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-warning"></i>Giờ bắt đầu
                            </label>
                            <input
                              type="time"
                              className="form-control custom-input"
                              value={newSchedule.StartTime}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, StartTime: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Giờ kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-hourglass-end me-2 text-secondary"></i>Giờ kết thúc
                            </label>
                            <input
                              type="time"
                              className="form-control custom-input"
                              value={newSchedule.EndTime}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, EndTime: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Giá vé */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-money-bill-wave me-2 text-success"></i>Giá vé
                            </label>
                            <input
                              type="number"
                              className="form-control custom-input"
                              placeholder="VD: 75000"
                              min="0"
                              step="1000"
                              value={newSchedule.Price}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, Price: e.target.value })
                              }
                              required
                            />
                            {newSchedule.Price && (
                              <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Giá:{" "}
                                <strong>
                                  {parseInt(newSchedule.Price).toLocaleString("vi-VN")} VNĐ
                                </strong>
                              </small>
                            )}
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-primary"></i>Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newSchedule.Status}
                              onChange={(e) =>
                                setNewSchedule({ ...newSchedule, Status: e.target.value })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">⏸️ Tạm khóa</option>
                            </select>
                          </div>

                          {/* Các ngày trong tuần */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-week me-2 text-info"></i>Các ngày trong tuần
                            </label>
                            <div className="d-flex flex-wrap gap-3">
                              {days.map((d) => (
                                <div key={d.en} className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={d.en}
                                    checked={newSchedule.DaysOfWeek.includes(d.en)}
                                    onChange={() => handleDaysChange(d.en)}
                                  />
                                  <label className="form-check-label" htmlFor={d.en}>
                                    {d.vi}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
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

              {/* Bảng danh sách */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">Id</th>
                          <th>Phim</th>
                          <th>Phòng</th>
                          <th>Ngày bắt đầu</th>
                          <th>Ngày kết thúc</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.length > 0 ? (
                          schedules.map((s, index) => (
                            <tr key={s.ScheduleId}>
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td>
                                {movies.find((m) => m.MovieId === s.MovieId)?.Title || s.MovieId}
                              </td>
                              <td>
                                {rooms.find((u) => u.RoomId === s.RoomId)?.Name || s.RoomId}
                              </td>
                              <td>{s.StartDate}</td>
                              <td>{s.EndDate}</td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={s.Status === "Active"}
                                    onChange={() => toggleStatus(s.ScheduleId, s.Status)}
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    s.Status === "Active" ? "text-success" : "text-danger"
                                  }`}
                                >
                                  {s.Status === "Active" ? "Hoạt động" : "Khóa"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() => navigate(`/schedules/show/${s.ScheduleId}`)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() => navigate(`/schedules/edit/${s.ScheduleId}`)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => deleteSchedule(s.ScheduleId, setSchedules)}
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
                            <td colSpan="7" className="text-center py-3">
                              Chưa có dữ liệu
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