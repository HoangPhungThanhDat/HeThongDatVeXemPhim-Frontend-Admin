import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import DistributorApi from "../../api/DistributorApi";
import MovieApi from "../../api/MovieApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteDistributor } from "./delete";

export default function Distributor() {
  const [distributors, setDistributors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newDistributor, setNewDistributor] = useState({
    MovieId: "",
    Name: "",
    Country: "",
    Email: "",
    Phone: "",
    Website: "",
    Status: "",
  });

  useEffect(() => {
    // Lấy tất cả distributor
    DistributorApi.getAll()
      .then((res) => setDistributors(res.data.data))
      .catch((err) => console.error("Lỗi load distributor:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách movie
    MovieApi.getAll()
      .then((res) => setMovies(res.data.data))
      .catch((err) => console.error("Lỗi load movies:", err));
  }, []);

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

  const handleAddDistributor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newDistributor,
        MovieId: newDistributor.MovieId ? Number(newDistributor.MovieId) : null,
      };
      const res = await DistributorApi.create(payload);
      const createdDistributor = res.data.data || res.data;
      setDistributors([...distributors, createdDistributor]);
      setNewDistributor({
        MovieId: "",
        Name: "",
        Country: "",
        Email: "",
        Phone: "",
        Website: "",
        Status: "",
      });
      setShowForm(false);
      showToast("success", "🎉 Thêm nhà phát hành thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm distributor:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  };

  const toggleStatus = async (DistributorId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const distributorItem = distributors.find(
        (r) => r.DistributorId === DistributorId
      );
      if (!distributorItem) return;

      await DistributorApi.update(DistributorId, {
        ...distributorItem,
        Status: newStatus,
        MovieId: distributorItem.MovieId
          ? Number(distributorItem.MovieId)
          : null,
      });

      setDistributors((prev) =>
        prev.map((r) =>
          r.DistributorId === DistributorId ? { ...r, Status: newStatus } : r
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
                  <i className="fas fa-heart me-2"></i> Quản lý nhà phát hành
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

              {/* Form thêm nhà phát hành - CINEMA STYLE */}
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
                          <i className="fas fa-building"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm nhà phát hành</h4>
                          <p className="cinema-form-subtitle">
                            Thêm thông tin công ty phát hành phim
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddDistributor}>
                        <div className="cinema-form-grid">
                          {/* Tên nhà phát hành */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-briefcase"></i>
                              Tên nhà phát hành
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-input-wrapper">
                              <input
                                type="text"
                                className="cinema-input"
                                placeholder="VD: Warner Bros, Universal Pictures..."
                                value={newDistributor.Name}
                                onChange={(e) =>
                                  setNewDistributor({
                                    ...newDistributor,
                                    Name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Quốc gia */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-globe"></i>
                              Quốc gia
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
                              placeholder="VD: United States, Vietnam..."
                              value={newDistributor.Country}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
                                  Country: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-envelope"></i>
                              Email
                              <span className="required">*</span>
                            </label>
                            <input
                              type="email"
                              className="cinema-input"
                              placeholder="VD: contact@company.com"
                              value={newDistributor.Email}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
                                  Email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Phone */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-phone"></i>
                              Số điện thoại
                              <span className="required">*</span>
                            </label>
                            <input
                              type="tel"
                              className="cinema-input"
                              placeholder="VD: +84 123 456 789"
                              value={newDistributor.Phone}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
                                  Phone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Website */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-link"></i>
                              Website
                            </label>
                            <input
                              type="url"
                              className="cinema-input"
                              placeholder="VD: https://company.com"
                              value={newDistributor.Website}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
                                  Website: e.target.value,
                                })
                              }
                            />
                            {newDistributor.Website && (
                              <div className="cinema-helper-text">
                                <i className="fas fa-check-circle"></i>
                                Website hợp lệ
                              </div>
                            )}
                          </div>

                          {/* Chọn phim */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-film"></i>
                              Phim phát hành
                            </label>
                            <select
                              className="cinema-select"
                              value={newDistributor.MovieId || ""}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
                                  MovieId: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                })
                              }
                            >
                              <option value="">
                                -- Chọn phim (tùy chọn) --
                              </option>
                              {movies.map((m) => (
                                <option key={m.MovieId} value={m.MovieId}>
                                  {m.Title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-toggle-on"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newDistributor.Status}
                              onChange={(e) =>
                                setNewDistributor({
                                  ...newDistributor,
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
                            Lưu nhà phát hành
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

              {/* Bảng danh sách */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">Id</th>
                          <th>Tên nhà phát hành</th>
                          <th>Quốc gia</th>
                          <th>Email</th>
                          <th>Điện thoại</th>
                          <th>Website</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distributors.length > 0 ? (
                          distributors.map((distributor, index) => (
                            <tr key={distributor.DistributorId}>
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td>{distributor.Name}</td>
                              <td>{distributor.Country}</td>
                              <td>{distributor.Email}</td>
                              <td>{distributor.Phone}</td>
                              <td>{distributor.Website}</td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={distributor.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(
                                        distributor.DistributorId,
                                        distributor.Status
                                      )
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    distributor.Status === "Active"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {distributor.Status === "Active"
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
                                      `/distributor/show/${distributor.DistributorId}`
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
                                      `/distributor/edit/${distributor.DistributorId}`
                                    )
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteDistributor(
                                      distributor.DistributorId,
                                      setDistributors
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
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-3">
                              Chưa có dữ liệu
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
