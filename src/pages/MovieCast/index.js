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

{/* Form thêm thành viên đoàn phim */}
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
          <i className="fas fa-users me-2"></i> Thêm thành viên đoàn phim
        </h4>

        <form onSubmit={handleAddCast}>
          <div className="row g-4">
            
            {/* Chọn phim */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-film me-2 text-primary"></i>
                Chọn phim
              </label>
              <select
                className="form-select custom-input"
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

            {/* Vai trò */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-user-tag me-2 text-success"></i>
                Vai trò
              </label>
              <select
                className="form-select custom-input"
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

            {/* Tên thành viên */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-user me-2 text-danger"></i>
                Tên thành viên
              </label>
              <input
                type="text"
                className="form-control custom-input"
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

            {/* Trạng thái */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="fas fa-toggle-on me-2 text-info"></i>
                Trạng thái
              </label>
              <select
                className="form-select custom-input"
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
