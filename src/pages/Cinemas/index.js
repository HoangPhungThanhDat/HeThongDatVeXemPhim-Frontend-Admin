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
                          <i className="fas fa-film"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm rạp mới</h4>
                          <p className="cinema-form-subtitle">
                            Tạo rạp chiếu phim mới trong hệ thống
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddCinema}>
                        <div className="cinema-form-grid">
                          {/* Tên rạp */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-building"></i>
                              Tên rạp
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-map-marker-alt"></i>
                              Địa chỉ
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-city"></i>
                              Thành phố
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-phone"></i>
                              Số điện thoại
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-envelope"></i>
                              Email liên hệ
                            </label>
                            <input
                              type="email"
                              className="cinema-input"
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
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-toggle-on"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
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

                          {/* Hình ảnh - Full width */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-image"></i>
                              Hình ảnh rạp
                              <span className="required">*</span>
                            </label>
                            <input
                              type="file"
                              className="cinema-input"
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
                              <div
                                style={{
                                  marginTop: "16px",
                                  textAlign: "center",
                                  padding: "20px",
                                  background: "rgba(247, 147, 30, 0.08)",
                                  border: "2px solid rgba(247, 147, 30, 0.3)",
                                  borderRadius: "12px",
                                }}
                              >
                                <img
                                  src={newCinema.ImageUrl}
                                  alt="preview"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    border: "3px solid rgba(247, 147, 30, 0.5)",
                                  }}
                                />
                                <p
                                  style={{
                                    color: "#94a3b8",
                                    marginTop: "12px",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <i
                                    className="fas fa-check-circle"
                                    style={{ color: "#22c55e" }}
                                  ></i>
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
                              <div className="cinema-form-group cinema-form-grid-full">
                                <div
                                  style={{
                                    padding: "20px",
                                    background: "rgba(247, 147, 30, 0.08)",
                                    border: "2px solid rgba(247, 147, 30, 0.3)",
                                    borderRadius: "12px",
                                    marginTop: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <i
                                      className="fas fa-info-circle"
                                      style={{
                                        color: "#f7931e",
                                        fontSize: "24px",
                                      }}
                                    ></i>
                                    <h5
                                      style={{
                                        margin: 0,
                                        color: "white",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Thông tin rạp chiếu
                                    </h5>
                                  </div>
                                  <div
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "14px",
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-building"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Tên rạp:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newCinema.Name}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-map-marker-alt"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Địa chỉ:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newCinema.Address}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-city"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Thành phố:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newCinema.City}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-phone"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Hotline:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newCinema.Phone}
                                      </strong>
                                    </p>
                                    {newCinema.Email && (
                                      <p style={{ margin: "8px 0" }}>
                                        <i
                                          className="fas fa-envelope"
                                          style={{
                                            color: "#f7931e",
                                            marginRight: "8px",
                                          }}
                                        ></i>
                                        Email:{" "}
                                        <strong style={{ color: "#22c55e" }}>
                                          {newCinema.Email}
                                        </strong>
                                      </p>
                                    )}
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-tag"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Trạng thái:{" "}
                                      <strong
                                        style={{
                                          color:
                                            newCinema.Status === "Active"
                                              ? "#22c55e"
                                              : "#ef4444",
                                        }}
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

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button
                            type="submit"
                            className="cinema-btn cinema-btn-primary"
                          >
                            <i className="fas fa-save"></i>
                            Lưu rạp chiếu
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
