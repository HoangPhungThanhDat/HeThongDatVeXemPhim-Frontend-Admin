import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import MovieGenresApi from "../../api/MovieGenresApi";
import MovieApi from "../../api/MovieApi";
import GenreApi from "../../api/GenreApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteMovieGenre } from "./delete";

export default function MovieGenres() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newMovieGenre, setNewMovieGenre] = useState({
    MovieId: "",
    GenreId: "",
    Status: "",
  });
  useEffect(() => {
    // Lấy tất cả movieGenres
    MovieGenresApi.getAll()
      .then((res) => {
        setMovieGenres(res.data.data);
      })
      .catch((err) => console.error("Lỗi load movie genres:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách movie
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));

    // Lấy danh sách genre
    GenreApi.getAll()
      .then((res) => setGenres(res.data.data))
      .catch((err) => console.error("Lỗi load genres:", err));
  }, []);

  const handleAddMovieGenre = async (e) => {
    e.preventDefault();
    try {
      const res = await MovieGenresApi.create(newMovieGenre);
      const created = res.data.data || res.data;

      setMovieGenres([...movieGenres, created]);

      // reset form
      setNewMovieGenre({ MovieId: "", GenreId: "", Status: "" });
      setShowForm(false);

      showToast("success", "🎉 Thêm thể loại phim thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm movieGenre:", error);
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

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const mg = movieGenres.find((r) => r.MovieGenreId === id);

      await MovieGenresApi.update(id, {
        MovieId: mg.MovieId,
        GenreId: mg.GenreId,
        Status: newStatus,
      });

      setMovieGenres((prev) =>
        prev.map((r) =>
          r.MovieGenreId === id ? { ...r, Status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
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
                  <i className="fas fa-heart me-2"></i> Quản lý danh sách liên
                  kết phim - thể loại
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
                    className="card border-0 shadow-lg rounded-4 mb-4"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-plus-circle me-2"></i> Thêm liên
                        kết phim - thể loại
                      </h4>

                      <form onSubmit={handleAddMovieGenre}>
                        <div className="row g-4">
                          {/* Phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold mb-2">
                              <i className="fas fa-film me-1 text-primary"></i>{" "}
                              Chọn phim
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-film"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newMovieGenre.MovieId}
                                onChange={(e) =>
                                  setNewMovieGenre({
                                    ...newMovieGenre,
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
                          </div>

                          {/* Thể loại */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold mb-2">
                              <i className="fas fa-layer-group me-1 text-primary"></i>{" "}
                              Chọn thể loại
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-layer-group"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newMovieGenre.GenreId}
                                onChange={(e) =>
                                  setNewMovieGenre({
                                    ...newMovieGenre,
                                    GenreId: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="">-- Chọn thể loại --</option>
                                {genres.map((g) => (
                                  <option key={g.GenreId} value={g.GenreId}>
                                    {g.Name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold mb-2">
                              <i className="fas fa-toggle-on me-1 text-primary"></i>{" "}
                              Trạng thái liên kết
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-toggle-on"></i>
                              </span>
                              <select
                                className="form-control"
                                value={newMovieGenre.Status}
                                onChange={(e) =>
                                  setNewMovieGenre({
                                    ...newMovieGenre,
                                    Status: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="">-- Trạng thái --</option>
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Khóa</option>
                              </select>
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
                          <th>Tên Phim</th>
                          <th>Tên thể loại</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && movieGenres.length > 0
                          ? movieGenres.map((movieGenre, index) => (
                              <tr
                                key={movieGenre.MovieGenreId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {movies.find(
                                    (m) => m.MovieId === movieGenre.MovieId
                                  )?.Title || movieGenre.MovieId}
                                </td>
                                <td className="text-muted">
                                  {genres.find(
                                    (g) => g.GenreId === movieGenre.GenreId
                                  )?.Name || movieGenre.GenreId}
                                </td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={movieGenre.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(
                                          movieGenre.MovieGenreId,
                                          movieGenre.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      movieGenre.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {movieGenre.Status === "Active"
                                      ? "Hoạt động"
                                      : "Khóa"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/moviegenres/show/${movieGenre.MovieGenreId}`
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
                                        `/moviegenres/edit/${movieGenre.MovieGenreId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteMovieGenre(
                                        movieGenre.MovieGenreId,
                                        setMovieGenres
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
