import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import BannerApi from "../../api/BannerApi";
import UserApi from "../../api/UserApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteBanner } from "./delete";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const currentUser = {
    UserId: localStorage.getItem("UserId"),
    FullName: localStorage.getItem("fullname"),
  };

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    UserId: currentUser?.UserId || "",
    Title: "",
    ImageUrl: "",
    LinkUrl: "",
    Position: "",
    Status: "",
  });
  useEffect(() => {
    // Lấy tất cả banner
    BannerApi.getAll()
      .then((res) => {
        setBanners(res.data.data);
      })
      .catch((err) => console.error("Lỗi load banner:", err))
      .finally(() => setLoading(false));
    // Lấy danh sách user
    UserApi.getAll()
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => console.error("Lỗi load users:", err));
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("UserId", currentUser?.UserId);
      formData.append("Title", newBanner.Title);
      formData.append("LinkUrl", newBanner.LinkUrl);
      formData.append("Position", newBanner.Position);
      formData.append("Status", newBanner.Status);
      if (selectedImage) {
        formData.append("ImageUrl", selectedImage);
      }
      const res = await BannerApi.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdBanner = res.data.data || res.data;
      setBanners([...banners, createdBanner]);

      // reset form
      setNewBanner({
        UserId: "",
        Title: "",
        ImageUrl: "",
        LinkUrl: "",
        Position: "",
        Status: "",
      });
      setSelectedImage(null);
      setShowForm(false);

      showToast("success", "🎉 Thêm banner thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm banner:", error);
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

  const toggleStatus = async (BannerId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const banner = banners.find((r) => r.BannerId === BannerId);

      // Gửi tất cả trường NGOẠI TRỪ ImageUrl
      await BannerApi.update(BannerId, {
        UserId: banner.UserId,
        Title: banner.Title,
        LinkUrl: banner.LinkUrl,
        Position: banner.Position,
        Status: newStatus,
      });

      setBanners((prev) =>
        prev.map((r) =>
          r.BannerId === BannerId ? { ...r, Status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
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
                  <i className="fas fa-heart me-2"></i> Quản lý banner
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
                        <i className="fas fa-plus-circle me-2"></i> Thêm danh
                        sách yêu thích
                      </h4>

                      <form onSubmit={handleAddBanner}>
                        <div className="row g-4">
                          {/* Người tạo */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-user me-2 text-primary"></i>{" "}
                              Người tạo
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={currentUser?.FullName || "Chưa đăng nhập"}
                              disabled
                            />
                          </div>

                          {/* Tiêu đề */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-heading me-2 text-info"></i>{" "}
                              Tiêu đề
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập tiêu đề banner"
                              value={newBanner.Title}
                              onChange={(e) =>
                                setNewBanner({
                                  ...newBanner,
                                  Title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Hình ảnh */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-image me-2 text-success"></i>{" "}
                              Hình ảnh
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setSelectedImage(file);
                                  setNewBanner({
                                    ...newBanner,
                                    ImageUrl: URL.createObjectURL(file),
                                  });
                                }
                              }}
                              required
                            />
                            {newBanner.ImageUrl && (
                              <div className="mt-2 text-center">
                                <img
                                  src={newBanner.ImageUrl}
                                  alt="preview"
                                  style={{
                                    width: "120px",
                                    borderRadius: "8px",
                                  }}
                                />
                                <p className="small text-muted mt-1">
                                  Ảnh xem trước
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Liên kết */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-link me-2 text-warning"></i>{" "}
                              Liên kết (nếu có)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập link điều hướng"
                              value={newBanner.LinkUrl}
                              onChange={(e) =>
                                setNewBanner({
                                  ...newBanner,
                                  LinkUrl: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Vị trí */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-map-marker-alt me-2 text-danger"></i>{" "}
                              Vị trí hiển thị
                            </label>
                            <select
                              className="form-select"
                              value={newBanner.Position}
                              onChange={(e) =>
                                setNewBanner({
                                  ...newBanner,
                                  Position: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn vị trí --</option>
                              <option value="Home">Trang chủ</option>
                              <option value="MoviePage">Trang phim</option>
                              <option value="PromotionPage">
                                Trang khuyến mãi
                              </option>
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-success"></i>{" "}
                              Trạng thái
                            </label>
                            <select
                              className="form-select"
                              value={newBanner.Status}
                              onChange={(e) =>
                                setNewBanner({
                                  ...newBanner,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">Hoạt động</option>
                              <option value="Inactive">Khóa</option>
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

              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">id</th>
                          <th>Người tạo</th>
                          <th>Tiêu đề</th>
                          <th>Hình ảnh</th>
                          <th>Liên kết</th>
                          <th>Vị trí</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && banners.length > 0
                          ? banners.map((banner, index) => (
                              <tr
                                key={banner.BannerId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {users.find(
                                    (u) =>
                                      String(u.UserId) === String(banner.UserId)
                                  )?.FullName || "Không xác định"}
                                </td>
                                <td>{banner.Title}</td>
                                <td>
                                  <img
                                    src={banner.ImageUrl}
                                    alt="banner"
                                    style={{ width: 80, borderRadius: 8 }}
                                  />
                                </td>
                                <td>
                                  {banner.LinkUrl ? (
                                    <a
                                      href={banner.LinkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {banner.LinkUrl}
                                    </a>
                                  ) : (
                                    <span className="text-muted">Không có</span>
                                  )}
                                </td>
                                <td>
                                  {banner.Position === "Home"
                                    ? "Trang chủ"
                                    : banner.Position === "MoviePage"
                                    ? "Trang phim"
                                    : "Trang khuyến mãi"}
                                </td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={banner.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(
                                          banner.BannerId,
                                          banner.Status
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      banner.Status === "Active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {banner.Status === "Active"
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
                                        `/banner/show/${banner.BannerId}`
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
                                        `/banner/edit/${banner.BannerId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteBanner(banner.BannerId, setBanners)
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
