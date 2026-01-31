import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import GenreApi from "../../api/GenreApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import { deleteGenre } from "./delete";

export default function Genre() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // 👇 State cho form thêm Genre
  const [newGenre, setNewGenre] = useState({
    Name: "",
    Description: "",
    Status: "Active", // Active / Inactive / Banned
  });
  // // thông báo
  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon, // success | error | warning | info
      title: message,
      showConfirmButton: false,
      timer: 3000,
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
    });
  };

  // // Gọi API lấy danh sách Genre
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await GenreApi.getAll();
        setGenres(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi khi load thể loại phim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // // Toggle trạng thái Genre
  const toggleStatus = (genreId) => {
    setGenres((prev) =>
      prev.map((genre) =>
        genre.GenreId === genreId
          ? {
              ...genre,
              Status: genre.Status === "Active" ? "Inactive" : "Active",
            }
          : genre
      )
    );
  };

  // Xử lý submit thêm Genre
  const handleAddGenre = async (e) => {
    e.preventDefault();

    try {
      const res = await GenreApi.create(newGenre); // gọi API thêm thể loại
      const createdGenre = res.data.data || res.data; // tùy API trả về

      setGenres([...genres, createdGenre]); // cập nhật danh sách

      // Reset form
      setNewGenre({
        Name: "",
        Description: "",
        Status: "Active",
      });

      setShowForm(false); // đóng form
      showToast("success", "🎉 Thêm thể loại phim thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi thêm thể loại:",
        error.response?.data || error.message
      );
      showToast("error", "❌ Thêm thể loại thất bại!");
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
                  <i className="fas fa-users me-2"></i> Quản lý thể loại phim
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

              {/* Form thêm thể loại phim */}
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
                        <i className="fas fa-film me-2"></i> Thêm thể loại phim
                      </h4>

                      <form onSubmit={handleAddGenre}>
                        <div className="row g-4">
                          {/* Tên thể loại */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-tag me-2 text-primary"></i>
                              Tên thể loại
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Hành động, Kinh dị, Tình cảm..."
                              value={newGenre.Name}
                              onChange={(e) =>
                                setNewGenre({
                                  ...newGenre,
                                  Name: e.target.value,
                                })
                              }
                              minLength={3}
                              maxLength={50}
                              required
                            />
                            {newGenre.Name && (
                              <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Độ dài:{" "}
                                <strong>{newGenre.Name.length}/50 ký tự</strong>
                              </small>
                            )}
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newGenre.Status}
                              onChange={(e) =>
                                setNewGenre({
                                  ...newGenre,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">⏸️ Tạm khóa</option>
                              <option value="Banned">🚫 Cấm sử dụng</option>
                            </select>
                          </div>

                          {/* Mô tả thể loại */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-align-left me-2 text-info"></i>
                              Mô tả thể loại
                            </label>
                            <textarea
                              className="form-control custom-input"
                              placeholder="Mô tả chi tiết về thể loại phim này..."
                              value={newGenre.Description}
                              onChange={(e) =>
                                setNewGenre({
                                  ...newGenre,
                                  Description: e.target.value,
                                })
                              }
                              rows={4}
                              required
                              style={{ minHeight: "100px" }}
                            />
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
                          <th>Tên thể loại</th>
                          <th>Mô tả</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && genres.length > 0 ? (
                          genres.map((genre, index) => (
                            <tr key={genre.GenreId} className="table-row-hover">
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td className="fw-semibold">{genre.Name}</td>
                              <td className="text-muted">
                                {genre.Description}
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={genre.Status === "Active"}
                                    onChange={() => toggleStatus(genre.GenreId)}
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    genre.Status === "Active"
                                      ? "text-success"
                                      : genre.Status === "Inactive"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {genre.Status === "Active"
                                    ? "Hoạt động"
                                    : genre.Status === "Inactive"
                                    ? "Khóa"
                                    : "Cấm"}
                                </span>
                              </td>

                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/Genre/show/${genre.GenreId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/Genre/edit/${genre.GenreId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deleteGenre(genre.GenreId, setGenres)
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
                              {loading
                                ? "Đang tải dữ liệu..."
                                : "Không có thể loại phim nào."}
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
