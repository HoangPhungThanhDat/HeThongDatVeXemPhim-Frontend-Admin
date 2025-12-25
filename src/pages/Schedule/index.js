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
    // Lấy tất cả lịch chiếu
    ScheduleApi.getAll()
      .then((res) => setSchedules(res.data.data))
      .catch((err) => console.error("Lỗi load schedules:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách phim
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));

    // Lấy danh sách phòng
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

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newSchedule,
        MovieId: newSchedule.MovieId ? Number(newSchedule.MovieId) : null,
        RoomId: newSchedule.RoomId ? Number(newSchedule.RoomId) : null,
        DaysOfWeek: newSchedule.DaysOfWeek, // giữ nguyên là mảng

        Price: parseFloat(newSchedule.Price),
      };
      const res = await ScheduleApi.create(payload);
      const createdSchedule = res.data.data || res.data;
      setSchedules([...schedules, createdSchedule]);
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
      showToast("success", "🎉 Thêm lịch chiếu thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm schedule:", error);
      showToast("error", "❌ Thêm thất bại!");
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

      // ✅ Đảm bảo DaysOfWeek là mảng
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
      const endTime = scheduleItem.EndTime?.slice(0, 5) || scheduleItem.EndTime;

      let priceValue = scheduleItem.Price;
      if (typeof priceValue === "string") {
        priceValue = priceValue.replace(/[^\d]/g, ""); // xoá ký tự ₫, dấu phẩy, chữ
      }
      priceValue = Number(priceValue);

      if (isNaN(priceValue)) {
        console.error("❌ Giá trị Price không hợp lệ:", scheduleItem.Price);
        showToast("error", "❌ Giá trị giá vé không hợp lệ!");
        return;
      }

      const payload = {
        MovieId: Number(scheduleItem.MovieId),
        RoomId: Number(scheduleItem.RoomId),
        StartDate: startDate,
        EndDate: endDate,
        DaysOfWeek: days,
        StartTime: startTime,
        EndTime: endTime,
        Price: priceValue,
        Status: newStatus,
      };

      await ScheduleApi.update(ScheduleId, payload);

      setSchedules((prev) =>
        prev.map((r) =>
          r.ScheduleId === ScheduleId ? { ...r, Status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      if (error.response?.data?.errors) {
      }
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
                  <i className="fas fa-heart me-2"></i> Quản lý lịch chiếu định
                  kỳ
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
              {/* Form thêm lịch chiếu định kỳ - CINEMA STYLE */}
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
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm lịch chiếu định kỳ</h4>
                          <p className="cinema-form-subtitle">
                            Tạo lịch chiếu phim tự động theo tuần
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddSchedule}>
                        <div className="cinema-form-grid">
                          {/* Phim */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-film"></i>
                              Phim
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newSchedule.MovieId}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-door-open"></i>
                              Phòng chiếu
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newSchedule.RoomId}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
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

                          {/* Ngày bắt đầu */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-plus"></i>
                              Ngày bắt đầu
                              <span className="required">*</span>
                            </label>
                            <input
                              type="date"
                              className="cinema-input"
                              value={newSchedule.StartDate}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  StartDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Ngày kết thúc */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-minus"></i>
                              Ngày kết thúc
                              <span className="required">*</span>
                            </label>
                            <input
                              type="date"
                              className="cinema-input"
                              value={newSchedule.EndDate}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  EndDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Các ngày trong tuần - Full width */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-week"></i>
                              Các ngày trong tuần
                            </label>
                            <div className="cinema-checkbox-group">
                              {days.map((d) => (
                                <div
                                  key={d.en}
                                  className="cinema-checkbox-item"
                                >
                                  <input
                                    type="checkbox"
                                    id={d.en}
                                    checked={newSchedule.DaysOfWeek.includes(
                                      d.en
                                    )}
                                    onChange={() => handleDaysChange(d.en)}
                                  />
                                  <label
                                    className="cinema-checkbox-label"
                                    htmlFor={d.en}
                                  >
                                    {d.vi}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Giờ bắt đầu */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-clock"></i>
                              Giờ bắt đầu
                              <span className="required">*</span>
                            </label>
                            <input
                              type="time"
                              className="cinema-input"
                              value={newSchedule.StartTime}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  StartTime: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giờ kết thúc */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-hourglass-end"></i>
                              Giờ kết thúc
                              <span className="required">*</span>
                            </label>
                            <input
                              type="time"
                              className="cinema-input"
                              value={newSchedule.EndTime}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  EndTime: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giá vé */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-money-bill-wave"></i>
                              Giá vé
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="VD: 75000"
                              min="0"
                              step="1000"
                              value={newSchedule.Price}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  Price: e.target.value,
                                })
                              }
                              required
                            />
                            {newSchedule.Price && (
                              <div className="cinema-helper-text">
                                <i className="fas fa-info-circle"></i>
                                Giá:{" "}
                                <strong>
                                  {parseInt(newSchedule.Price).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VNĐ
                                </strong>
                              </div>
                            )}
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-toggle-on"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newSchedule.Status}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">⏸️ Tạm khóa</option>
                            </select>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button
                            type="submit"
                            className="cinema-btn cinema-btn-primary"
                          >
                            <i className="fas fa-save"></i>
                            Lưu lịch chiếu
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
                                {movies.find((m) => m.MovieId === s.MovieId)
                                  ?.Title || s.MovieId}
                              </td>
                              <td>
                                {rooms.find((u) => u.RoomId === s.RoomId)
                                  ?.Name || s.RoomId}
                              </td>
                              <td>{s.StartDate}</td>
                              <td>{s.EndDate}</td>

                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={s.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(s.ScheduleId, s.Status)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    s.Status === "Active"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {s.Status === "Active" ? "Hoạt động" : "Khóa"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/schedules/show/${s.ScheduleId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/schedules/edit/${s.ScheduleId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteSchedule(s.ScheduleId, setSchedules)
                                  }
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
                            <td colSpan="8" className="text-center py-3">
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
