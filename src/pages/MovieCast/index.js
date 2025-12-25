import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import MovieCastApi from "../../api/MovieCastApi";
import MovieApi from "../../api/MovieApi";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteCast } from "./delete";
export default function MovieCast() {
  const [moviecasts, setMovieCasts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCast, setNewCast] = useState({
    MovieId: "",
    Name: "",
    Role: "",
    Status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieCasts();

    // Lấy danh sách movie
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

  const fetchMovieCasts = () => {
    MovieCastApi.getAll()
      .then((response) => {
        setMovieCasts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching moviecasts:", error);
        setLoading(false);
      });
  };

  // 👉 Hàm hiển thị toast
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

  // thêm cast mới
  const handleAddCast = async (e) => {
    e.preventDefault();
    try {
      const res = await MovieCastApi.create(newCast);
      const createdCast = res.data.data || res.data;
      setMovieCasts([...moviecasts, createdCast]);

      setNewCast({ MovieId: "", Name: "", Role: "", Status: "" });
      setShowForm(false);

      showToast("success", "🎉 Đã thêm diễn viên/đạo diễn!");
    } catch (error) {
      console.error("Lỗi khi thêm cast:", error.response?.data || error);
      showToast("error", "❌ Không thể thêm!");
    }
  };

  // toggle trạng thái
  const toggleStatus = async (CastId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const cast = moviecasts.find((c) => c.CastId === CastId);

      await MovieCastApi.update(CastId, {
        MovieId: cast.MovieId,
        Name: cast.Name,
        Role: cast.Role,
        Status: newStatus,
      });

      setMovieCasts((prev) =>
        prev.map((c) => (c.CastId === CastId ? { ...c, Status: newStatus } : c))
      );

      showToast("success", "✅ Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };

  return (
    <div>
      <Loader />
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-user me-2"></i> Quản lý diễn viên / đạo
                  diễn
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
              {/* Form thêm thành viên đoàn phim - CINEMA STYLE */}
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
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm thành viên đoàn phim</h4>
                          <p className="cinema-form-subtitle">
                            Thêm diễn viên hoặc đạo diễn cho phim
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddCast}>
                        <div className="cinema-form-grid">
                          {/* Chọn phim */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-film"></i>
                              Chọn phim
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newCast.MovieId}
                              onChange={(e) =>
                                setNewCast({
                                  ...newCast,
                                  MovieId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn phim --</option>
                              {movies.map((movie) => (
                                <option
                                  key={movie.MovieId}
                                  value={movie.MovieId}
                                >
                                  {movie.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Tên thành viên */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-user"></i>
                              Tên thành viên
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-input-wrapper">
                              <input
                                type="text"
                                className="cinema-input"
                                placeholder="VD: Tom Cruise, Christopher Nolan..."
                                value={newCast.Name}
                                onChange={(e) =>
                                  setNewCast({
                                    ...newCast,
                                    Name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Vai trò */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-user-tag"></i>
                              Vai trò
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newCast.Role}
                              onChange={(e) =>
                                setNewCast({ ...newCast, Role: e.target.value })
                              }
                              required
                            >
                              <option value="">-- Chọn vai trò --</option>
                              <option value="Actor">🎭 Diễn viên</option>
                              <option value="Director">🎬 Đạo diễn</option>
                            </select>
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
                              value={newCast.Status}
                              onChange={(e) =>
                                setNewCast({
                                  ...newCast,
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
                            Lưu thành viên
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

              {/* Bảng MovieCast */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th>#</th>
                          <th>Tên phim</th>
                          <th>Tên thành viên</th>
                          <th>Vai trò</th>
                          <th>Trạng thái</th>
                          <th>Ngày tạo</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && moviecasts.length > 0 ? (
                          moviecasts.map((cast, index) => (
                            <tr key={cast.CastId}>
                              <td>{index + 1}</td>
                              <td>
                                {" "}
                                {movies.find((m) => m.MovieId === cast.MovieId)
                                  ?.Title || cast.MovieId}
                              </td>
                              <td>{cast.Name}</td>
                              <td>
                                {cast.Role === "Actor"
                                  ? "Diễn viên"
                                  : cast.Role === "Director"
                                  ? "Đạo diễn"
                                  : cast.Role}
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={cast.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(cast.CastId, cast.Status)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    cast.Status === "Active"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {cast.Status === "Active"
                                    ? "Hoạt động"
                                    : "Khóa"}
                                </span>
                              </td>

                              <td>{cast.CreatedAt}</td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/moviecast/show/${cast.CastId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/moviecast/edit/${cast.CastId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deleteCast(cast.CastId, setMovieCasts)
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
                              {loading ? "⏳ Đang tải..." : "Không có dữ liệu"}
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
