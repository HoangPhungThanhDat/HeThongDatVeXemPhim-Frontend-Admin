import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import ShowtimeApi from "../../api/ShowtimeApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import Swal from "sweetalert2";

export default function ShowtimeEdit() {
  const { ShowtimeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showtime, setShowtime] = useState({
    MovieId: "",
    RoomId: "",
    StartTime: "",
    EndTime: "",
    Price: "",
    Status: "Scheduled",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [showtimeRes, moviesRes, roomsRes] = await Promise.all([
          ShowtimeApi.getById(ShowtimeId),
          MovieApi.getAll(),
          RoomApi.getAll(),
        ]);
        
        setShowtime(showtimeRes.data.data || showtimeRes.data);
        setMovies(moviesRes.data.data || []);
        setRooms(roomsRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load dữ liệu:", err);
        setError("Không thể tải dữ liệu suất chiếu!");
      } finally {
        setLoading(false);
      }
    };

    if (ShowtimeId) fetchData();
  }, [ShowtimeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    ShowtimeApi.update(ShowtimeId, showtime)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật suất chiếu thành công!",
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
        }).then(() => navigate("/showtime"));
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật suất chiếu:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật suất chiếu thất bại!",
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
                <h5 className="text-primary">Đang tải dữ liệu suất chiếu...</h5>
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
  if (!showtime) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-user-shield fa-2x mb-2"></i>
                <p>Không có dữ liệu suất chiếu.</p>
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
              onClick={() => navigate("/showtime")}
            >
              Suất chiếu
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Suất Chiếu</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin suất chiếu phim
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Phim */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-film label-icon"></i>
                      <span>Phim được chiếu</span>
                    </label>
                    <select
                      className="modern-input"
                      name="MovieId"
                      value={showtime.MovieId}
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
                      value={showtime.RoomId}
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

                  {/* Giờ bắt đầu */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-play label-icon"></i>
                      <span>Giờ bắt đầu</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="modern-input"
                      name="StartTime"
                      value={showtime.StartTime || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Giờ kết thúc */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-stop label-icon"></i>
                      <span>Giờ kết thúc</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="modern-input"
                      name="EndTime"
                      value={showtime.EndTime || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Giá vé */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-dollar-sign label-icon"></i>
                      <span>Giá vé cơ bản</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Price"
                      placeholder="Nhập giá vé"
                      value={showtime.Price || ""}
                      onChange={handleChange}
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
                          showtime.Status === "Scheduled" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtime((prev) => ({ ...prev, Status: "Scheduled" }))
                        }
                      >
                        <div className="status-radio">
                          {showtime.Status === "Scheduled" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                          <span className="status-label">Đã lên lịch</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          showtime.Status === "Cancelled" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtime((prev) => ({
                            ...prev,
                            Status: "Cancelled",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {showtime.Status === "Cancelled" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-ban"></i>
                          </div>
                          <span className="status-label">Đã hủy</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          showtime.Status === "Finished" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtime((prev) => ({
                            ...prev,
                            Status: "Finished",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {showtime.Status === "Finished" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Đã kết thúc</span>
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
                      onClick={() => navigate("/showtime")}
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
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Đảm bảo thời gian bắt đầu và kết thúc hợp lý, không xung đột với các suất chiếu khác.
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
                    <span className="info-key">ID Suất chiếu:</span>
                    <span className="info-value">{showtime.ShowtimeId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Giá vé:</span>
                    <span className="info-value">
                      {showtime.Price ? `${showtime.Price} đ` : "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        showtime.Status === "Scheduled"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {showtime.Status === "Scheduled"
                        ? "Đã lên lịch"
                        : showtime.Status === "Cancelled"
                        ? "Đã hủy"
                        : "Đã kết thúc"}
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
                  <p>Chọn phim và phòng chiếu từ danh sách có sẵn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Đảm bảo giờ kết thúc sau giờ bắt đầu</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Kiểm tra không có xung đột lịch chiếu trong cùng phòng</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Nhập giá vé phù hợp với chính sách rạp</p>
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