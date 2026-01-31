import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import CinemasApi from "../../api/CinemasApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteCinema } from "./delete";

export default function Cinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newCinema, setNewCinema] = useState({
    Name: "",
    Address: "",
    City: "",
    Phone: "",
    Email: "",
    ImageUrl: "",
    Status: "",
  });
  useEffect(() => {
    CinemasApi.getAll()
      .then((res) => {
        console.log("📡 Dữ liệu rạp:", res.data.data);
        setCinemas(res.data.data);
      })
      .catch((err) => console.error("Lỗi load danh sách rạp:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddCinema = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("Name", newCinema.Name);
      formData.append("Address", newCinema.Address);
      formData.append("City", newCinema.City);
      formData.append("Phone", newCinema.Phone);
      formData.append("Email", newCinema.Email);
      formData.append("Status", newCinema.Status);
      if (selectedImage) {
        formData.append("ImageUrl", selectedImage);
      }

      const res = await CinemasApi.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdCinema = res.data.data || res.data;
      setCinemas([...cinemas, createdCinema]);

      // reset form
      setNewCinema({
        Name: "",
        Address: "",
        City: "",
        Phone: "",
        Email: "",
        ImageUrl: "",
        Status: "",
      });
      setSelectedImage(null);
      setShowForm(false);

      showToast("success", "🎉 Thêm rạp thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm rạp:", error);
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

  const toggleStatus = async (CinemaId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const cinema = cinemas.find((r) => r.CinemaId === CinemaId);

      await CinemasApi.update(CinemaId, {
        Name: cinema.Name,
        Address: cinema.Address,
        City: cinema.City,
        Phone: cinema.Phone,
        Email: cinema.Email,
        Status: newStatus,
      });

      setCinemas((prev) =>
        prev.map((r) =>
          r.CinemaId === CinemaId ? { ...r, Status: newStatus } : r
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
                  <i className="fas fa-heart me-2"></i> Quản lý rạp chiếu
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
                        <i className="fas fa-film me-2"></i> Thêm rạp mới
                      </h4>

                      <form onSubmit={handleAddCinema}>
                        <div className="row g-4">
                          {/* Tên rạp */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-building me-2 text-primary"></i>
                              Tên rạp
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: CGV Vincom Center"
                              value={newCinema.Name}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  Name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Địa chỉ */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                              Địa chỉ
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: 72 Lê Thánh Tôn, Quận 1"
                              value={newCinema.Address}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  Address: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Thành phố */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-city me-2 text-success"></i>
                              Thành phố
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Hồ Chí Minh"
                              value={newCinema.City}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  City: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Số điện thoại */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-phone me-2 text-info"></i>
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: 0901234567"
                              value={newCinema.Phone}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  Phone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-envelope me-2 text-warning"></i>
                              Email liên hệ
                            </label>
                            <input
                              type="email"
                              className="form-control custom-input"
                              placeholder="VD: contact@cinema.vn"
                              value={newCinema.Email}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  Email: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newCinema.Status}
                              onChange={(e) =>
                                setNewCinema({
                                  ...newCinema,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">❌ Khóa</option>
                            </select>
                          </div>

                          {/* Hình ảnh */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-image me-2 text-primary"></i>
                              Hình ảnh rạp
                            </label>
                            <input
                              type="file"
                              className="form-control custom-input"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setSelectedImage(file);
                                  setNewCinema({
                                    ...newCinema,
                                    ImageUrl: URL.createObjectURL(file),
                                  });
                                }
                              }}
                              required
                            />
                            {newCinema.ImageUrl && (
                              <div className="mt-3 text-center">
                                <img
                                  src={newCinema.ImageUrl}
                                  alt="preview"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                  }}
                                />
                                <p className="text-muted mt-2">
                                  <i className="fas fa-check-circle me-1 text-success"></i>
                                  Ảnh xem trước
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Summary Box - Hiển thị khi có đủ thông tin */}
                          {newCinema.Name &&
                            newCinema.Address &&
                            newCinema.City &&
                            newCinema.Phone && (
                              <div className="col-12">
                                <div
                                  className="alert alert-warning"
                                  role="alert"
                                >
                                  <div className="d-flex align-items-center mb-3">
                                    <i className="fas fa-info-circle me-2 fs-4"></i>
                                    <h5 className="mb-0 fw-bold">
                                      Thông tin rạp chiếu
                                    </h5>
                                  </div>
                                  <div className="ms-4">
                                    <p className="mb-2">
                                      <i className="fas fa-building me-2 text-primary"></i>
                                      Tên rạp: <strong>{newCinema.Name}</strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                                      Địa chỉ:{" "}
                                      <strong>{newCinema.Address}</strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-city me-2 text-success"></i>
                                      Thành phố:{" "}
                                      <strong>{newCinema.City}</strong>
                                    </p>
                                    <p className="mb-2">
                                      <i className="fas fa-phone me-2 text-info"></i>
                                      Hotline:{" "}
                                      <strong>{newCinema.Phone}</strong>
                                    </p>
                                    {newCinema.Email && (
                                      <p className="mb-2">
                                        <i className="fas fa-envelope me-2 text-warning"></i>
                                        Email:{" "}
                                        <strong className="text-success">
                                          {newCinema.Email}
                                        </strong>
                                      </p>
                                    )}
                                    <p className="mb-0">
                                      <i className="fas fa-tag me-2 text-info"></i>
                                      Trạng thái:{" "}
                                      <strong
                                        className={
                                          newCinema.Status === "Active"
                                            ? "text-success"
                                            : "text-danger"
                                        }
                                      >
                                        {newCinema.Status === "Active"
                                          ? "✅ Hoạt động"
                                          : "❌ Khóa"}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
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
                          <th className="px-4">id</th>
                          <th>Tên rạp</th>
                          <th>Địa chỉ</th>
                          <th>Thành phố</th>

                          <th>Hình ảnh</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cinemas.length > 0 ? (
                          cinemas.map((cinema, index) => (
                            <tr key={cinema.CinemaId}>
                              <td>{index + 1}</td>
                              <td>{cinema.Name}</td>
                              <td>{cinema.Address}</td>
                              <td>{cinema.City}</td>

                              <td>
                                <img
                                  src={cinema.ImageUrl}
                                  alt={cinema.Name}
                                  style={{ width: 80, borderRadius: 8 }}
                                />
                              </td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={cinema.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(
                                        cinema.CinemaId,
                                        cinema.Status
                                      )
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    cinema.Status === "Active"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {cinema.Status === "Active"
                                    ? "Hoạt động"
                                    : "Khóa"}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(`/cinemas/show/${cinema.CinemaId}`)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn text-primary"
                                  title="Sửa"
                                  onClick={() =>
                                    navigate(`/cinemas/edit/${cinema.CinemaId}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteCinema(cinema.CinemaId, setCinemas)
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
                            <td colSpan="9" className="text-center py-3">
                              Không có dữ liệu
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
