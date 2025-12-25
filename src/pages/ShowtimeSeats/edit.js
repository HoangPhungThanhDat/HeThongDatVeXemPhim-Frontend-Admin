import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";
import ShowtimeApi from "../../api/ShowtimeApi";
import SeatApi from "../../api/SeatApi";
import Swal from "sweetalert2";

export default function ShowtimeSeatEdit() {
  const { ShowtimeSeatId } = useParams();
  const navigate = useNavigate();

  const [showtimeSeat, setShowtimeSeat] = useState({
    ShowtimeSeatId: "",
    ShowtimeId: "",
    SeatId: "",
    Status: "",
  });

  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!ShowtimeSeatId) {
          setError("Thiếu ShowtimeSeatId trong URL");
          return;
        }

        setLoading(true);

        const [seatRes, showtimeRes, seatListRes] = await Promise.all([
          ShowtimeSeatApi.getById(ShowtimeSeatId),
          ShowtimeApi.getAll(),
          SeatApi.getAll(),
        ]);

        const s = seatRes.data.data || seatRes.data;
        setShowtimeSeat(s);
        setShowtimes(showtimeRes.data.data || []);
        setSeats(seatListRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load suất chiếu ghế:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ShowtimeSeatId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtimeSeat((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ShowtimeSeatApi.update(ShowtimeSeatId, showtimeSeat)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật ghế suất chiếu thành công!",
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
        }).then(() => {
          navigate("/showtimeseats");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật suất chiếu ghế:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật ghế suất chiếu thất bại!",
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
                  Đang tải dữ liệu trạng thái ghế theo suất chiếu...
                </h5>
                <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

                {/* Skeleton giả lập khi đang tải */}
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
  if (!showtimeSeat) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-chair fa-2x mb-2"></i>
                <p>Không có dữ liệu trạng thái ghế theo suất chiếu.</p>
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
              onClick={() => navigate("/showtimeseats")}
            >
              Ghế suất chiếu
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-couch"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Ghế Suất Chiếu</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin trạng thái ghế theo suất chiếu
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Suất chiếu */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-clock label-icon"></i>
                      <span>Suất chiếu</span>
                    </label>
                    <select
                      className="modern-input"
                      name="ShowtimeId"
                      value={showtimeSeat.ShowtimeId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn suất chiếu --</option>
                      {showtimes.map((s) => (
                        <option key={s.ShowtimeId} value={s.ShowtimeId}>
                          {s.MovieId?.Title} - {new Date(s.StartTime).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ghế */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-chair label-icon"></i>
                      <span>Ghế</span>
                    </label>
                    <select
                      className="modern-input"
                      name="SeatId"
                      value={showtimeSeat.SeatId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn ghế --</option>
                      {seats.map((seat) => (
                        <option key={seat.SeatId} value={seat.SeatId}>
                          Hàng {seat.Row} - Ghế {seat.Number} ({seat.SeatType})
                        </option>
                      ))}
                    </select>
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
                          showtimeSeat.Status === "Available" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtimeSeat((prev) => ({ ...prev, Status: "Available" }))
                        }
                      >
                        <div className="status-radio">
                          {showtimeSeat.Status === "Available" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check"></i>
                          </div>
                          <span className="status-label">Còn trống</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          showtimeSeat.Status === "Reserved" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtimeSeat((prev) => ({
                            ...prev,
                            Status: "Reserved",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {showtimeSeat.Status === "Reserved" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-bookmark"></i>
                          </div>
                          <span className="status-label">Đã đặt</span>
                        </div>
                      </div>

                      <div
                        className={`status-option ${
                          showtimeSeat.Status === "Broken" ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowtimeSeat((prev) => ({
                            ...prev,
                            Status: "Broken",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {showtimeSeat.Status === "Broken" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times"></i>
                          </div>
                          <span className="status-label">Đã hỏng</span>
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
                      onClick={() => navigate("/showtimeseats")}
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
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Các thay đổi sẽ
                  được cập nhật ngay lập tức vào hệ thống.
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
                    <span className="info-key">ID Ghế Suất Chiếu:</span>
                    <span className="info-value">{showtimeSeat.ShowtimeSeatId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        showtimeSeat.Status === "Available"
                          ? "pill-active"
                          : showtimeSeat.Status === "Reserved"
                          ? "pill-inactive"
                          : "pill-inactive"
                      }`}
                    >
                      {showtimeSeat.Status === "Available"
                        ? "Còn trống"
                        : showtimeSeat.Status === "Reserved"
                        ? "Đã đặt"
                        : "Đã hỏng"}
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
                  <p>Chọn suất chiếu và ghế từ danh sách có sẵn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Trạng thái "Còn trống" cho phép khách đặt ghế</p>
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