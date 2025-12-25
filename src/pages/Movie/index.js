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
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="cinema-add-form"
                  >
                    {formLoading && (
                      <div className="cinema-loading-overlay">
                        <div className="cinema-loader"></div>
                      </div>
                    )}

                    {/* Form Header */}
                    <div className="cinema-form-header">
                      <div className="cinema-form-title">
                        <div className="cinema-form-icon">
                          <i className="fas fa-film"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm phim mới</h4>
                          <p className="cinema-form-subtitle">
                            Điền thông tin chi tiết về bộ phim
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddMovie}>
                        <div className="cinema-form-grid">
                          
                          {/* Tên phim */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-ticket-alt"></i>
                              Tên phim
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-input-wrapper">
                              <input
                                type="text"
                                className="cinema-input"
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
                            {newMovie.Title && (
                              <div className="cinema-slug-preview">
                                <i className="fas fa-link"></i>
                                URL: {generateSlug(newMovie.Title)}
                              </div>
                            )}
                          </div>

                          {/* Thể loại */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-theater-masks"></i>
                              Thể loại
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
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
                                <option key={genre.GenreId} value={genre.GenreId}>
                                  {genre.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mô tả - Full width */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-align-left"></i>
                              Mô tả phim
                              <span className="required">*</span>
                            </label>
                            <textarea
                              className="cinema-textarea"
                              placeholder="Nhập mô tả chi tiết về cốt truyện, diễn viên, đạo diễn..."
                              value={newMovie.Description}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Description: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Thời lượng */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-clock"></i>
                              Thời lượng
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="Nhập số phút (VD: 120)"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-calendar-alt"></i>
                              Ngày phát hành
                              <span className="required">*</span>
                            </label>
                            <input
                              type="date"
                              className="cinema-input"
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

                          {/* Poster Upload */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-image"></i>
                              Ảnh poster
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-file-upload">
                              <input
                                type="file"
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
                              <div className="cinema-file-upload-content">
                                <div className="cinema-file-upload-icon">
                                  <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="cinema-file-upload-text">
                                  Click để tải ảnh poster lên
                                </div>
                                <div className="cinema-file-upload-hint">
                                  PNG, JPG, WEBP (Tối đa 5MB)
                                </div>
                              </div>
                            </div>
                            {newMovie.PosterUrl && (
                              <div className="cinema-image-preview">
                                <img
                                  src={newMovie.PosterUrl}
                                  alt="preview"
                                  className="cinema-preview-image"
                                />
                                <div className="cinema-preview-label">
                                  <i className="fas fa-check-circle"></i>
                                  Ảnh đã được tải lên
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Trailer YouTube ID */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-play-circle"></i>
                              Trailer YouTube ID
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
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
                            {newMovie.TrailerUrl && (
                              <div className="cinema-helper-text">
                                <i className="fas fa-info-circle"></i>
                                ID Trailer: <strong>{newMovie.TrailerUrl}</strong>
                              </div>
                            )}
                          </div>

                          {/* Ngôn ngữ */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-language"></i>
                              Ngôn ngữ phụ đề
                            </label>
                            <div className="cinema-checkbox-group">
                              {["Vietsub", "Lồng tiếng", "Phụ đề Anh"].map((lang) => (
                                <div key={lang} className="cinema-checkbox-item">
                                  <input
                                    type="checkbox"
                                    id={lang}
                                    checked={newMovie.Language.includes(lang)}
                                    onChange={() => handleLanguageChange(lang)}
                                  />
                                  <label className="cinema-checkbox-label" htmlFor={lang}>
                                    {lang}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Giới hạn độ tuổi */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-user-shield"></i>
                              Giới hạn độ tuổi
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newMovie.Rated}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  Rated: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn giới hạn độ tuổi --</option>
                              <option value="P">P - Phổ biến (Mọi lứa tuổi)</option>
                              <option value="C13">C13 - Trên 13 tuổi</option>
                              <option value="C16">C16 - Trên 16 tuổi</option>
                              <option value="C18">C18 - Trên 18 tuổi</option>
                            </select>
                          </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button type="submit" className="cinema-btn cinema-btn-primary">
                            <i className="fas fa-save"></i>
                            Lưu phim
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
