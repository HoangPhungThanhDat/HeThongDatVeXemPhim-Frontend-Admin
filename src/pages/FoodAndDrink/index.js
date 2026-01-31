import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";
import UserApi from "../../api/UserApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteFoodItem} from "./delete";

export default function FoodAndDrinks() {
  const [foodItems, setFoodItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const currentUser = {
    UserId: localStorage.getItem("UserId"),
    FullName: localStorage.getItem("fullname"),
  };

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newFoodItem, setNewFoodItem] = useState({
    Name: "",
    Description: "",
    Price: "",
    ImageUrl: "",
    IsAvailable: true,
    Status: "",
  });

  useEffect(() => {
    // Lấy tất cả food and drinks
    FoodAndDrinkApi.getAll()
      .then((res) => {
        setFoodItems(res.data.data);
      })
      .catch((err) => console.error("Lỗi load food items:", err))
      .finally(() => setLoading(false));

    // Lấy danh sách user
    UserApi.getAll()
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => console.error("Lỗi load users:", err));
  }, []);

  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("Name", newFoodItem.Name);
      formData.append("Description", newFoodItem.Description);
      formData.append("Price", newFoodItem.Price);
      formData.append("IsAvailable", newFoodItem.IsAvailable ? 1 : 0);
      formData.append("Status", newFoodItem.Status);

      if (selectedImage) {
        formData.append("ImageUrl", selectedImage);
      }

      const res = await FoodAndDrinkApi.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdItem = res.data.data || res.data;
      setFoodItems([...foodItems, createdItem]);

      // reset form
      setNewFoodItem({
        Name: "",
        Description: "",
        Price: "",
        ImageUrl: "",
        IsAvailable: true,
        Status: "",
      });
      setSelectedImage(null);
      setShowForm(false);

      showToast("success", "🎉 Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      showToast("error", "❌ Thêm thất bại!");
    } finally {
      setFormLoading(false);
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
const toggleAvailability = async (ItemId, currentAvailable) => {
  const newAvailable = !currentAvailable;

  try {
    const item = foodItems.find((f) => f.ItemId === ItemId);

    // ✅ Gửi tất cả trường NGOẠI TRỪ ImageUrl (giống Banner)
    await FoodAndDrinkApi.update(ItemId, {
      Name: item.Name,
      Description: item.Description,
      Price: item.Price,
      IsAvailable: newAvailable ? 1 : 0,  // Chuyển boolean thành 1/0
      Status: item.Status,
      // ❌ KHÔNG gửi ImageUrl
    });

    setFoodItems((prev) =>
      prev.map((f) =>
        f.ItemId === ItemId ? { ...f, IsAvailable: newAvailable } : f
      )
    );

    showToast("success", "✅ Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);
    console.error("Chi tiết lỗi:", error.response?.data);
    showToast("error", "❌ Không thể cập nhật!");
  }
};



  const getStatusBadge = (status) => {
    const badges = {
      Active: { class: "text-success", text: "Hoạt động" },
      Inactive: { class: "text-secondary", text: "Tạm ngưng" },
      OutOfStock: { class: "text-danger", text: "Hết hàng" },
    };
    const badge = badges[status] || { class: "text-secondary", text: status };
    return <span className={`fw-semibold ${badge.class}`}>{badge.text}</span>;
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
                  <i className="fas fa-utensils me-2"></i> Quản lý đồ ăn & thức
                  uống
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
                          <i className="fas fa-utensils"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm sản phẩm mới</h4>
                          <p className="cinema-form-subtitle">
                            Điền thông tin chi tiết về đồ ăn & thức uống
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddFoodItem}>
                        <div className="cinema-form-grid">
                          {/* Tên sản phẩm */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-tag"></i>
                              Tên sản phẩm
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-input-wrapper">
                              <input
                                type="text"
                                className="cinema-input"
                                placeholder="VD: Combo bắp nước"
                                value={newFoodItem.Name}
                                onChange={(e) =>
                                  setNewFoodItem({
                                    ...newFoodItem,
                                    Name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Giá */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-dollar-sign"></i>
                              Giá (VNĐ)
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="Nhập giá sản phẩm"
                              min="0"
                              value={newFoodItem.Price}
                              onChange={(e) =>
                                setNewFoodItem({
                                  ...newFoodItem,
                                  Price: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Mô tả - Full width */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-align-left"></i>
                              Mô tả sản phẩm
                            </label>
                            <textarea
                              className="cinema-textarea"
                              placeholder="Nhập mô tả chi tiết về sản phẩm..."
                              value={newFoodItem.Description}
                              onChange={(e) =>
                                setNewFoodItem({
                                  ...newFoodItem,
                                  Description: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Hình ảnh Upload */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-image"></i>
                              Hình ảnh sản phẩm
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-file-upload">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setSelectedImage(file);
                                    setNewFoodItem({
                                      ...newFoodItem,
                                      ImageUrl: URL.createObjectURL(file),
                                    });
                                  }
                                }}
                                required
                              />
                              <div
                                className="cinema-file-upload-content"
                                style={{ color: "#fff" }}
                              >
                                <div className="cinema-file-upload-icon">
                                  <i
                                    className="fas fa-cloud-upload-alt"
                                    style={{ color: "#fff" }}
                                  ></i>
                                </div>
                                <div
                                  className="cinema-file-upload-text"
                                  style={{ color: "#fff" }}
                                >
                                  Click để tải hình ảnh lên
                                </div>
                                <div
                                  className="cinema-file-upload-hint"
                                  style={{ color: "#fff" }}
                                >
                                  PNG, JPG, WEBP (Tối đa 2MB)
                                </div>
                              </div>
                            </div>
                            {newFoodItem.ImageUrl && (
                              <div className="cinema-image-preview">
                                <img
                                  src={newFoodItem.ImageUrl}
                                  alt="preview"
                                  className="cinema-preview-image"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    width: "auto",
                                    height: "auto",
                                    objectFit: "contain",
                                  }}
                                />
                                <div
                                  className="cinema-preview-label"
                                  style={{ color: "#fff" }}
                                >
                                  <i
                                    className="fas fa-check-circle"
                                    style={{ color: "#fff" }}
                                  ></i>
                                  Ảnh đã được tải lên
                                </div>
                              </div>
                            )}
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
                              value={newFoodItem.Status}
                              onChange={(e) =>
                                setNewFoodItem({
                                  ...newFoodItem,
                                  Status: e.target.value,
                                })
                              }
                              style={{ color: "#fff" }}
                              required
                            >
                              <option value="" style={{ color: "#000" }}>
                                -- Chọn trạng thái --
                              </option>
                              <option value="Active" style={{ color: "#000" }}>
                                Hoạt động
                              </option>
                              <option
                                value="Inactive"
                                style={{ color: "#000" }}
                              >
                                Tạm ngưng
                              </option>
                              <option
                                value="OutOfStock"
                                style={{ color: "#000" }}
                              >
                                Hết hàng
                              </option>
                            </select>
                          </div>

                          <div className="cinema-form-group">
                            <label
                              className="cinema-form-label"
                              style={{ color: "white" }}
                            >
                              <i className="fas fa-check-circle"></i>
                              Tình trạng
                            </label>

                            <div className="cinema-checkbox-group">
                              <div
                                className="cinema-checkbox-item"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  id="isAvailable"
                                  checked={newFoodItem.IsAvailable}
                                  onChange={(e) =>
                                    setNewFoodItem({
                                      ...newFoodItem,
                                      IsAvailable: e.target.checked,
                                    })
                                  }
                                />

                                <label
                                  htmlFor="isAvailable"
                                  style={{
                                    color: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Sản phẩm có sẵn
                                </label>
                              </div>
                            </div>
                          </div>
                          {/* Action Buttons */}
                          <div className="cinema-form-actions">
                            <button
                              type="submit"
                              className="cinema-btn cinema-btn-primary"
                            >
                              <i className="fas fa-save"></i>
                              Lưu sản phẩm
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
                          <th className="px-4">STT</th>
                          <th>Tên sản phẩm</th>
                          <th>Hình ảnh</th>
                          <th>Mô tả</th>
                          <th>Giá</th>
                          <th>Có sẵn</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && foodItems.length > 0
                          ? foodItems.map((item, index) => (
                              <tr key={item.ItemId} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">{item.Name}</td>
                                <td>
                                  <img
                                    src={item.ImageUrl}
                                    alt={item.Name}
                                    style={{
                                      width: 60,
                                      height: 60,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                  />
                                </td>
                                <td>
                                  {item.Description ? (
                                    item.Description.substring(0, 50) + "..."
                                  ) : (
                                    <span className="text-muted">
                                      Không có mô tả
                                    </span>
                                  )}
                                </td>
                                <td className="fw-bold text-success">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.Price)}
                                </td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={item.IsAvailable}
                                      onChange={() =>
                                        toggleAvailability(
                                          item.ItemId,
                                          item.IsAvailable
                                        )
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      item.IsAvailable
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {item.IsAvailable ? "Có" : "Không"}
                                  </span>
                                </td>
                                <td>{getStatusBadge(item.Status)}</td>
                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(
                                        `/foodanddrink/show/${item.ItemId}`
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
                                        `/foodanddrink/edit/${item.ItemId}`
                                      )
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => deleteFoodItem(item.ItemId, setFoodItems)}
                                    className="action-btn text-danger"
                                    title="Xóa"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>

                                   
                                </td>
                              </tr>
                            ))
                          : !loading && (
                              <tr>
                                <td colSpan="8" className="text-center py-4">
                                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                  <p className="text-muted">
                                    Chưa có sản phẩm nào
                                  </p>
                                </td>
                              </tr>
                            )}

                        {loading &&
                          [...Array(3)].map((_, i) => (
                            <tr key={i}>
                              <td colSpan="8" className="py-3">
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
