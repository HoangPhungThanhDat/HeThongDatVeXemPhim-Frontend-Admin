import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import PromotionApi from "../../api/PromotionApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import { deletePromotion } from "./delete";

export default function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // State cho form thêm Promotion
  const [newPromotion, setNewPromotion] = useState({
    Title: "",
    Code: "",
    Description: "",
    ImageUrl: null,
    DiscountType: "Percentage", // mặc định
    DiscountValue: "",
    StartDate: "",
    EndDate: "",
    IsActive: true, // mặc định có hiệu lực
    Status: "Active",
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

  // Gọi API lấy danh sách promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await PromotionApi.getAll();
        setPromotions(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi khi load promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Toggle trạng thái Promotion
  const toggleStatus = (PromotionId) => {
    setPromotions((prev) =>
      prev.map((promotion) =>
        promotion.PromotionId === PromotionId
          ? {
              ...promotion,
              Status: promotion.Status === "Active" ? "Inactive" : "Active",
            }
          : promotion
      )
    );
  };

  // Xử lý submit thêm promotion
  const handleAddPromotion = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("Title", newPromotion.Title);
      formData.append("Code", newPromotion.Code);
      formData.append("Description", newPromotion.Description);
      if (newPromotion.ImageUrl) {
        formData.append("ImageUrl", newPromotion.ImageUrl); // File object
      }
      formData.append("DiscountType", newPromotion.DiscountType);
      formData.append("DiscountValue", newPromotion.DiscountValue);
      formData.append("StartDate", newPromotion.StartDate);
      formData.append("EndDate", newPromotion.EndDate);
      formData.append("IsActive", newPromotion.IsActive ? 1 : 0);
      formData.append("Status", newPromotion.Status);

      // log thử để kiểm tra
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const res = await PromotionApi.create(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdPromotion = res.data.data || res.data;
      setPromotions([...promotions, createdPromotion]);

      // reset form
      setNewPromotion({
        Title: "",
        Code: "",
        Description: "",
        ImageUrl: null,
        DiscountType: "Percentage",
        DiscountValue: "",
        StartDate: "",
        EndDate: "",
        IsActive: true,
        Status: "Active",
      });

      setShowForm(false);
      showToast("success", "🎉 Thêm khuyến mãi thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi thêm khuyến mãi:",
        error.response?.data || error.message
      );
      showToast("error", "❌ Thêm khuyến mãi thất bại!");
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
                  <i className="fas fa-users me-2"></i> Quản lý khuyến mãi
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

              {/* Form thêm Promotion */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-promotion"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-gift me-2"></i> Thêm khuyến mãi
                      </h4>

                      <form onSubmit={handleAddPromotion}>
                        <div className="row g-4">
                          {/* Tên chương trình */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-tag me-1 text-primary"></i>{" "}
                              Tên khuyến mãi
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-tag"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control custom-input"
                                placeholder="VD: Khuyến mãi 20/10, Black Friday..."
                                value={newPromotion.Title}
                                onChange={(e) =>
                                  setNewPromotion({
                                    ...newPromotion,
                                    Title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Mã khuyến mãi */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-code me-1 text-success"></i>{" "}
                              Mã khuyến mãi
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-code"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control custom-input"
                                placeholder="VD: SALE2024, FREESHIP..."
                                value={newPromotion.Code}
                                onChange={(e) =>
                                  setNewPromotion({
                                    ...newPromotion,
                                    Code: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Mô tả */}
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              <i className="fas fa-align-left me-1 text-info"></i>{" "}
                              Mô tả chi tiết
                            </label>
                            <textarea
                              className="form-control custom-input"
                              rows="3"
                              placeholder="VD: Áp dụng cho tất cả sản phẩm giày, chỉ từ ngày 20-25/10..."
                              value={newPromotion.Description}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  Description: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>

                          {/* Ảnh khuyến mãi */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-image me-1 text-warning"></i>{" "}
                              Ảnh khuyến mãi
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="fas fa-image"></i>
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control custom-input"
                                onChange={(e) =>
                                  setNewPromotion({
                                    ...newPromotion,
                                    ImageUrl: e.target.files[0],
                                  })
                                }
                                required
                              />
                            </div>

                            {/* Preview ảnh */}
                            {newPromotion.ImageUrl && (
                              <div className="mt-2 text-center">
                                <img
                                  src={URL.createObjectURL(
                                    newPromotion.ImageUrl
                                  )}
                                  alt="preview"
                                  className="img-thumbnail"
                                  style={{
                                    maxHeight: "150px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Loại giảm giá */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-percentage me-1 text-danger"></i>{" "}
                              Loại giảm giá
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newPromotion.DiscountType}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  DiscountType: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Percentage">Giảm theo %</option>
                              <option value="FixedAmount">
                                Giảm số tiền cố định
                              </option>
                            </select>
                          </div>

                          {/* Giá trị giảm */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-dollar-sign me-1 text-success"></i>{" "}
                              Giá trị giảm
                            </label>
                            <input
                              type="number"
                              className="form-control custom-input"
                              placeholder="VD: 20 (nghĩa là giảm 20% hoặc 20.000đ)"
                              value={newPromotion.DiscountValue}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  DiscountValue: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Ngày bắt đầu */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-alt me-1 text-primary"></i>{" "}
                              Ngày bắt đầu
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newPromotion.StartDate}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  StartDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Ngày kết thúc */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-calendar-times me-1 text-danger"></i>{" "}
                              Ngày kết thúc
                            </label>
                            <input
                              type="date"
                              className="form-control custom-input"
                              value={newPromotion.EndDate}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  EndDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Trạng thái hiệu lực */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-1 text-success"></i>{" "}
                              Trạng thái hiệu lực
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newPromotion.IsActive}
                              onChange={(e) =>
                                setNewPromotion({
                                  ...newPromotion,
                                  IsActive: e.target.value === "true",
                                })
                              }
                            >
                              <option value="true">Có hiệu lực</option>
                              <option value="false">Không hiệu lực</option>
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
                          <th>Tên chương trình</th>
                          <th>Mã khuyến mãi</th>
                          <th>Mô tả</th>
                          <th>Hình ảnh</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && promotions.length > 0 ? (
                          promotions.map((promotion, index) => (
                            <tr
                              key={promotion.PromotionId}
                              className="table-row-hover"
                            >
                              <td className="fw-bold px-4">{index + 1}</td>
                              <td className="fw-semibold">{promotion.Title}</td>
                              <td className="text-muted">{promotion.Code}</td>
                              <td className="text-muted">
                                {promotion.Description}
                              </td>
                              <td>
                                {promotion.ImageUrl && (
                                  <img
                                    src={promotion.ImageUrl}
                                    alt={promotion.Title}
                                    className="img-thumbnail"
                                    style={{
                                      width: "120px",
                                      height: "70px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                )}
                              </td>

                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={promotion.Status === "Active"}
                                    onChange={() =>
                                      toggleStatus(promotion.PromotionId)
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                                <span
                                  className={`ms-2 fw-semibold ${
                                    promotion.Status === "Active"
                                      ? "text-success"
                                      : promotion.Status === "Inactive"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {promotion.Status === "Active"
                                    ? "Hoạt động"
                                    : promotion.Status === "Inactive"
                                    ? "Khóa"
                                    : "Cấm"}
                                </span>
                              </td>

                              <td className="text-center">
                                <button
                                  className="action-btn text-info"
                                  title="Chi tiết"
                                  onClick={() =>
                                    navigate(
                                      `/Promotion/show/${promotion.PromotionId}`
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
                                      `/Promotion/edit/${promotion.PromotionId}`
                                    )
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="action-btn text-danger"
                                  title="Xóa"
                                  onClick={() =>
                                    deletePromotion(
                                      promotion.PromotionId,
                                      setPromotions
                                    )
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
                                : "Không có khuyến mãi nào."}
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
