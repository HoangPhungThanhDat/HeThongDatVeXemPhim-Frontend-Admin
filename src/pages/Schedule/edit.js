import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ScheduleApi from "../../api/ScheduleApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import Swal from "sweetalert2";


export default function ScheduleEdit() {
  const { ScheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({
    ScheduleId: "",
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

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📅 Mapping ngày
  const daysMap = {
    Mon: "Thứ 2",
    Tue: "Thứ 3",
    Wed: "Thứ 4",
    Thu: "Thứ 5",
    Fri: "Thứ 6",
    Sat: "Thứ 7",
    Sun: "Chủ nhật",
  };
  const daysOptions = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const reverseDaysMap = Object.fromEntries(
    Object.entries(daysMap).map(([en, vi]) => [vi, en])
  );

  // 📅 Hàm format ngày (giữ yyyy-MM-dd)
  const formatDateEN = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4)
      return dateStr;
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4)
      return dateStr;
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  // 🛠️ Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!ScheduleId) {
          setError("Thiếu ScheduleId trong URL");
          return;
        }

        setLoading(true);
        const [scheduleRes, movieRes, roomRes] = await Promise.all([
          ScheduleApi.getById(ScheduleId),
          MovieApi.getAll(),
          RoomApi.getAll(),
        ]);

        let s = scheduleRes.data.data || scheduleRes.data;

        if (!Array.isArray(s.DaysOfWeek)) {
          if (typeof s.DaysOfWeek === "string" && s.DaysOfWeek.trim() !== "") {
            s.DaysOfWeek = s.DaysOfWeek.replace(/\[|\]|"/g, "")
              .split(",")
              .map((d) => d.trim());
          } else {
            s.DaysOfWeek = [];
          }
        }

        // 🟡 Chuyển sang tiếng Việt để hiển thị
        s.DaysOfWeek = s.DaysOfWeek.map((d) => daysMap[d] || d);

        s.StartDate = formatDateForInput(s.StartDate);
        s.EndDate = formatDateForInput(s.EndDate);
        s.Price = parseFloat(String(s.Price).replace(/[^\d]/g, "")) || 0;

        setSchedule(s);
        setMovies(movieRes.data.data || []);
        setRooms(roomRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load schedule:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ScheduleId]);

  // 🛠️ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setSchedule((prev) => {
      const newDays = checked
        ? [...prev.DaysOfWeek, value]
        : prev.DaysOfWeek.filter((d) => d !== value);
      return { ...prev, DaysOfWeek: newDays };
    });
  };

  // 🛠️ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...schedule,
      Price: parseFloat(String(schedule.Price).replace(/[^\d]/g, "")) || 0,
      DaysOfWeek: (schedule.DaysOfWeek || []).map(
        (d) => reverseDaysMap[d] || d
      ),
      StartDate: formatDateEN(schedule.StartDate),
      EndDate: formatDateEN(schedule.EndDate),
    };

    ScheduleApi.update(ScheduleId, payload)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật lịch chiếu định kỳ thành công!",
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
        }).then(() => navigate("/schedules"));
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật lịch chiếu:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật lịch chiếu thất bại!",
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
                <h5 className="text-primary">
                  Đang tải dữ liệu lịch chiếu định kỳ...
                </h5>
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

  // ❌ Nếu có lỗi
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
  if (!schedule) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-user-shield fa-2x mb-2"></i>
                <p>Không có dữ liệu lịch chiếu định kỳ.</p>
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
              onClick={() => navigate("/schedules")}
            >
              Lịch chiếu định kỳ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Lịch Chiếu Định Kỳ</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin lịch chiếu phim định kỳ
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Phim */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-film label-icon"></i>
                      <span>Phim</span>
                    </label>
                    <select
                      className="modern-input"
                      name="MovieId"
                      value={schedule.MovieId}
                      onChange={handleChange}
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
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-door-open label-icon"></i>
                      <span>Phòng chiếu</span>
                    </label>
                    <select
                      className="modern-input"
                      name="RoomId"
                      value={schedule.RoomId}
                      onChange={handleChange}
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
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar-check label-icon"></i>
                      <span>Ngày bắt đầu</span>
                    </label>
                    <input
                      type="date"
                      className="modern-input"
                      name="StartDate"
                      value={schedule.StartDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Ngày kết thúc */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar-times label-icon"></i>
                      <span>Ngày kết thúc</span>
                    </label>
                    <input
                      type="date"
                      className="modern-input"
                      name="EndDate"
                      value={schedule.EndDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Các ngày trong tuần */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-calendar-week label-icon"></i>
                      <span>Các ngày trong tuần</span>
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "10px" }}>
                      {daysOptions.map((d) => (
                        <label key={d} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            value={d}
                            checked={schedule.DaysOfWeek.includes(d)}
                            onChange={handleDaysChange}
                            style={{ marginRight: "8px", cursor: "pointer" }}
                          />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Giờ bắt đầu */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-clock label-icon"></i>
                      <span>Giờ bắt đầu</span>
                    </label>
                    <input
                      type="time"
                      className="modern-input"
                      name="StartTime"
                      value={schedule.StartTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Giờ kết thúc */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-clock label-icon"></i>
                      <span>Giờ kết thúc</span>
                    </label>
                    <input
                      type="time"
                      className="modern-input"
                      name="EndTime"
                      value={schedule.EndTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Giá vé */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-dollar-sign label-icon"></i>
                      <span>Giá vé (VNĐ)</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Price"
                      value={schedule.Price}
                      onChange={handleChange}
                      min="0"
                      placeholder="Nhập giá vé"
                      required
                    />
                  </div>

                  {/* Trạng thái */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      <span>Trạng thái</span>
                    </label>
                    <div className="status-selector">
                      <div
                        className={`status-option ${
                          schedule.Status === "Active" ? "active" : ""
                        }`}
                        onClick={() =>
                          setSchedule((prev) => ({ ...prev, Status: "Active" }))
                        }
                      >
                        <div className="status-radio">
                          {schedule.Status === "Active" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          schedule.Status === "Inactive" ? "active" : ""
                        }`}
                        onClick={() =>
                          setSchedule((prev) => ({
                            ...prev,
                            Status: "Inactive",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {schedule.Status === "Inactive" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Không hoạt động</span>
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
                      onClick={() => navigate("/schedules")}
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
                  Lịch chiếu định kỳ sẽ tự động tạo suất chiếu cho các ngày được chọn trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc.
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
                    <span className="info-key">ID Lịch chiếu:</span>
                    <span className="info-value">{schedule.ScheduleId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Giá vé:</span>
                    <span className="info-value">
                      {schedule.Price ? `${schedule.Price} đ` : "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        schedule.Status === "Active"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {schedule.Status === "Active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
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
                  <p>Chọn phim và phòng chiếu từ danh sách</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Chọn ít nhất một ngày trong tuần để chiếu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Đảm bảo ngày kết thúc sau ngày bắt đầu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Kiểm tra không xung đột lịch chiếu trong cùng phòng</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhấn "Lưu thay đổi" để cập nhật lịch chiếu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}