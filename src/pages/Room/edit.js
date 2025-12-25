import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import RoomApi from "../../api/RoomApi";
import CinemasApi from "../../api/CinemasApi";
import Swal from "sweetalert2";

export default function RoomEdit() {
  const { RoomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    RoomId: "",
    CinemaId: "",
    Name: "",
    SeatCount: "",
    RoomType: "",
    Status: "",
  });

  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!RoomId) {
          setError("Thiếu RoomId trong URL");
          return;
        }
        setLoading(true);

        const [roomRes, cinemaRes] = await Promise.all([
          RoomApi.getById(RoomId),
          CinemasApi.getAll(),
        ]);

        const r = roomRes.data.data || roomRes.data;
        setRoom(r);
        setCinemas(cinemaRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load room:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [RoomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    RoomApi.update(RoomId, room)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật phòng chiếu thành công!",
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
          navigate("/rooms");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật phòng:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật phòng chiếu thất bại!",
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
                <h5 className="text-primary">Đang tải dữ liệu phòng chiếu...</h5>
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
  if (!room) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="container role-show-container">
              <div className="text-center p-5 text-muted">
                <i className="fa fa-door-open fa-2x mb-2"></i>
                <p>Không có dữ liệu phòng chiếu.</p>
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
              onClick={() => navigate("/rooms")}
            >
              Phòng chiếu
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </nav>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-door-open"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật Phòng Chiếu</h1>
                  <p className="section-subtitle">
                    Chỉnh sửa thông tin phòng chiếu phim
                  </p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Rạp */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-building label-icon"></i>
                      <span>Rạp chiếu</span>
                    </label>
                    <select
                      className="modern-input"
                      name="CinemaId"
                      value={room.CinemaId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn rạp --</option>
                      {cinemas.map((c) => (
                        <option key={c.CinemaId} value={c.CinemaId}>
                          {c.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tên phòng */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-door-closed label-icon"></i>
                      <span>Tên phòng</span>
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Name"
                      placeholder="Nhập tên phòng"
                      value={room.Name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Tổng số ghế */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-chair label-icon"></i>
                      <span>Tổng số ghế</span>
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="SeatCount"
                      placeholder="Nhập tổng số ghế"
                      value={room.SeatCount}
                      min="0"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Loại phòng */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-film label-icon"></i>
                      <span>Loại phòng</span>
                    </label>
                    <select
                      className="modern-input"
                      name="RoomType"
                      value={room.RoomType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn loại phòng --</option>
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="4DX">4DX</option>
                      <option value="IMAX">IMAX</option>
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
                          room.Status === "Active" ? "active" : ""
                        }`}
                        onClick={() =>
                          setRoom((prev) => ({ ...prev, Status: "Active" }))
                        }
                      >
                        <div className="status-radio">
                          {room.Status === "Active" && (
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
                          room.Status === "Inactive" ? "active" : ""
                        }`}
                        onClick={() =>
                          setRoom((prev) => ({
                            ...prev,
                            Status: "Inactive",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {room.Status === "Inactive" && (
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

                      <div
                        className={`status-option ${
                          room.Status === "Maintenance" ? "active" : ""
                        }`}
                        onClick={() =>
                          setRoom((prev) => ({
                            ...prev,
                            Status: "Maintenance",
                          }))
                        }
                      >
                        <div className="status-radio">
                          {room.Status === "Maintenance" && (
                            <div className="status-dot"></div>
                          )}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-wrench"></i>
                          </div>
                          <span className="status-label">Bảo trì</span>
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
                      onClick={() => navigate("/rooms")}
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
                    <span className="info-key">ID Phòng:</span>
                    <span className="info-value">{room.RoomId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Tên phòng:</span>
                    <span className="info-value">{room.Name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Số ghế:</span>
                    <span className="info-value">{room.SeatCount}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span
                      className={`status-pill ${
                        room.Status === "Active"
                          ? "pill-active"
                          : "pill-inactive"
                      }`}
                    >
                      {room.Status === "Active"
                        ? "Hoạt động"
                        : room.Status === "Inactive"
                        ? "Không hoạt động"
                        : "Bảo trì"}
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
                  <p>Chọn rạp và nhập tên phòng rõ ràng</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Số ghế phải phù hợp với loại phòng chiếu</p>
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