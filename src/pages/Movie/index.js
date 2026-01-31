import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import MovieApi from "../../api/MovieApi";
import GenreApi from "../../api/GenreApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteMovie } from "./delete";

export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [genres, setGenres] = useState([]);
  const [newMovie, setNewMovie] = useState({
    Title: "",
    Description: "",
    GenreId: "",
    Duration: "",
    ReleaseDate: "",
    PosterUrl: "",
    TrailerUrl: "",
    Language: [],
    Rated: "",
    Status: "",
  });

  // Hàm tạo slug từ Title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    // Lấy tất cả phim
    MovieApi.getAll()
      .then((res) => {
        setMovies(res.data.data);
      })
      .catch((err) => console.error("Lỗi load phim:", err))
      .finally(() => setLoading(false));
    // Lấy tất cả thể loại
    GenreApi.getAll()
      .then((res) => {
        setGenres(res.data.data);
      })
      .catch((err) => console.error("Lỗi load thể loại:", err));
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const slug = generateSlug(newMovie.Title);

      formData.append("Title", newMovie.Title);
      formData.append("Slug", slug);
      formData.append("Description", newMovie.Description);
      formData.append("GenreId", newMovie.GenreId);
      formData.append("Duration", newMovie.Duration);
      formData.append("ReleaseDate", newMovie.ReleaseDate);
      formData.append("TrailerUrl", newMovie.TrailerUrl);
      formData.append("Language", JSON.stringify(newMovie.Language));
      formData.append("Rated", newMovie.Rated);

      if (selectedPoster) {
        formData.append("PosterUrl", selectedPoster);
      }

      const res = await MovieApi.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdMovie = res.data.data || res.data;
      setMovies([...movies, createdMovie]);

      // reset form
      setNewMovie({
        Title: "",
        Description: "",
        GenreId: "",
        Duration: "",
        ReleaseDate: "",
        PosterUrl: "",
        TrailerUrl: "",
        Language: [],
        Rated: "",
        Status: "",
      });
      setSelectedPoster(null);
      setShowForm(false);

      showToast("success", "🎉 Thêm phim thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
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

  const handleLanguageChange = (lang) => {
    setNewMovie((prev) => {
      const languages = prev.Language.includes(lang)
        ? prev.Language.filter((l) => l !== lang)
        : [...prev.Language, lang];
      return { ...prev, Language: languages };
    });
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
                  <i className="fas fa-film me-2"></i> Quản lý phim
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
                        <i className="fas fa-film me-2"></i> Thêm phim mới
                      </h4>

                      <form onSubmit={handleAddMovie}>
                        <div className="row g-4">
                          {/* Tên phim */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-ticket-alt me-2 text-primary"></i>
                              Tên phim
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Avengers: Endgame"
                              value={newMovie.Title}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Thể loại */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-theater-masks me-2 text-danger"></i>
                              Thể loại
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newMovie.GenreId}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  GenreId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn thể loại --</option>
                              {genres.map((genre) => (
                                <option
                                  key={genre.GenreId}
                                  value={genre.GenreId}
                                >
                                  {genre.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Thời lượng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-clock me-2 text-success"></i>
                              Thời lượng (phút)
                            </label>
                            <input
                              type="number"
                              className="form-control custom-input"
                              placeholder="VD: 120"
                              min="1"
                              value={newMovie.Duration}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Duration: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Ngày phát hành */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-alt me-2 text-warning"></i>
                              Ngày phát hành
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newMovie.ReleaseDate}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  ReleaseDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Giới hạn độ tuổi */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user-shield me-2 text-info"></i>
                              Giới hạn độ tuổi
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newMovie.Rated}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Rated: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">
                                -- Chọn giới hạn độ tuổi --
                              </option>
                              <option value="P">
                                P - Phổ biến (Mọi lứa tuổi)
                              </option>
                              <option value="C13">C13 - Trên 13 tuổi</option>
                              <option value="C16">C16 - Trên 16 tuổi</option>
                              <option value="C18">C18 - Trên 18 tuổi</option>
                            </select>
                          </div>

                          {/* Trailer YouTube ID */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-play-circle me-2 text-danger"></i>
                              Trailer YouTube ID
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: dQw4w9WgXcQ"
                              value={newMovie.TrailerUrl}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  TrailerUrl: e.target.value.trim(),
                                })
                              }
                              required
                            />
                          </div>

                          {/* Mô tả */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-align-left me-2 text-primary"></i>
                              Mô tả phim
                            </label>
                            <textarea
                              className="form-control custom-input"
                              placeholder="Nhập mô tả chi tiết về cốt truyện, diễn viên, đạo diễn..."
                              value={newMovie.Description}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Description: e.target.value,
                                })
                              }
                              rows="4"
                              required
                            />
                          </div>

                          {/* Ngôn ngữ phụ đề */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-language me-2 text-success"></i>
                              Ngôn ngữ phụ đề
                            </label>
                            <div className="d-flex gap-3">
                              {["Vietsub", "Lồng tiếng", "Phụ đề Anh"].map(
                                (lang) => (
                                  <div key={lang} className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={lang}
                                      checked={newMovie.Language.includes(lang)}
                                      onChange={() =>
                                        handleLanguageChange(lang)
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={lang}                                    
                                    >
                                      {lang}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Poster Upload */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-image me-2 text-warning"></i>
                              Ảnh poster
                            </label>
                            <input
                              type="file"
                              className="form-control custom-input"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setSelectedPoster(file);
                                  setNewMovie({
                                    ...newMovie,
                                    PosterUrl: URL.createObjectURL(file),
                                  });
                                }
                              }}
                              required
                            />
                            {newMovie.PosterUrl && (
                              <div className="mt-3">
                                <img
                                  src={newMovie.PosterUrl}
                                  alt="preview"
                                  style={{
                                    maxWidth: "200px",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="col-12 text-end mt-4">
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
              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">ID</th>
                          <th>Tên phim</th>
                          <th>Poster</th>
                          <th>Thể loại</th>
                          <th>Thời lượng</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && movies.length > 0
                          ? movies.map((movie, index) => (
                              <tr
                                key={movie.MovieId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">{movie.Title}</td>
                                <td>
                                  <img
                                    src={movie.PosterUrl}
                                    alt="poster"
                                    style={{ width: 60, borderRadius: 8 }}
                                  />
                                </td>
                                <td>
                                  {genres.find(
                                    (g) => g.GenreId === movie.GenreId
                                  )?.Name || movie.GenreId}
                                </td>
                                <td>{movie.Duration} phút</td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={movie.Status === "NowShowing"} // ✅ Bật nếu đang chiếu
                                      disabled
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      movie.Status === "NowShowing"
                                        ? "text-success"
                                        : "text-secondary"
                                    }`}
                                  >
                                    {movie.Status === "NowShowing"
                                      ? "Đang chiếu"
                                      : movie.Status === "ComingSoon"
                                      ? "Sắp chiếu"
                                      : "Đã kết thúc"}
                                  </span>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(`/movie/show/${movie.MovieId}`)
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(`/movie/edit/${movie.MovieId}`)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteMovie(movie.MovieId, setMovies)
                                    }
                                    className="action-btn text-danger"
                                    title="Xóa"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          : [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td colSpan="9" className="py-3">
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
