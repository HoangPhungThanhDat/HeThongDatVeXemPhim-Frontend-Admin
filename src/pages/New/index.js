import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import NewsApi from "../../api/NewApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteNews } from "./delete";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    Title: "",
    Content: "",
    ImageUrl: "",
    Status: "Draft",
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
    // Lấy tất cả tin tức
    NewsApi.getAll()
      .then((res) => {
        setNews(res.data.data || res.data);
      })
      .catch((err) => console.error("Lỗi load tin tức:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddNews = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Lấy UserId từ localStorage
      const userId = localStorage.getItem("UserId");
      
      if (!userId) {
        showToast("error", "❌ Vui lòng đăng nhập lại!");
        return;
      }

      const formData = new FormData();
      const slug = generateSlug(newArticle.Title);

      formData.append("UserId", userId);
      formData.append("Title", newArticle.Title);
      formData.append("Slug", slug);
      formData.append("Content", newArticle.Content);
      formData.append("Status", newArticle.Status);

      if (selectedImage) {
        formData.append("ImageUrl", selectedImage);
      }

      const res = await NewsApi.create(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdNews = res.data.data || res.data;
      setNews([...news, createdNews]);

      // Reset form
      setNewArticle({
        Title: "",
        Content: "",
        ImageUrl: "",
        Status: "Draft",
      });
      setSelectedImage(null);
      setShowForm(false);

      showToast("success", "🎉 Thêm tin tức thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
      showToast("error", "❌ Thêm tin tức thất bại!");
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

  const getStatusBadge = (status) => {
    const badges = {
      Draft: { color: "secondary", text: "Nháp", icon: "fa-edit" },
      Published: { color: "success", text: "Đã xuất bản", icon: "fa-check-circle" },
      Hidden: { color: "warning", text: "Đã ẩn", icon: "fa-eye-slash" },
    };
    const badge = badges[status] || badges.Draft;
    return (
      <span className={`badge bg-${badge.color} d-inline-flex align-items-center gap-1`}>
        <i className={`fas ${badge.icon}`}></i>
        {badge.text}
      </span>
    );
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
                  <i className="fas fa-newspaper me-2"></i> Quản lý tin tức
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm tin
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form thêm tin tức */}
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
                          <i className="fas fa-newspaper"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm tin tức mới</h4>
                          <p className="cinema-form-subtitle">
                            Điền thông tin chi tiết về bài viết
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddNews}>
                        <div className="cinema-form-grid">
                          
                          {/* Tiêu đề */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-heading"></i>
                              Tiêu đề
                              <span className="required">*</span>
                            </label>
                            <div className="cinema-input-wrapper">
                              <input
                                type="text"
                                className="cinema-input"
                                placeholder="Nhập tiêu đề bài viết..."
                                value={newArticle.Title}
                                onChange={(e) =>
                                  setNewArticle({
                                    ...newArticle,
                                    Title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            {newArticle.Title && (
                              <div className="cinema-slug-preview">
                                <i className="fas fa-link"></i>
                                URL: {generateSlug(newArticle.Title)}
                              </div>
                            )}
                          </div>

                          {/* Nội dung - Full width */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-align-left"></i>
                              Nội dung
                              <span className="required">*</span>
                            </label>
                            <textarea
                              className="cinema-textarea"
                              placeholder="Nhập nội dung chi tiết bài viết..."
                              rows="8"
                              value={newArticle.Content}
                              onChange={(e) =>
                                setNewArticle({
                                  ...newArticle,
                                  Content: e.target.value,
                                })
                              }
                              required
                              style={{ minHeight: "200px" }}
                            />
                          </div>

                          {/* Hình ảnh Upload */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-image"></i>
                              Hình ảnh
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
                                    setNewArticle({
                                      ...newArticle,
                                      ImageUrl: URL.createObjectURL(file),
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
                                  Click để tải hình ảnh lên
                                </div>
                                <div className="cinema-file-upload-hint">
                                  PNG, JPG, WEBP (Tối đa 5MB)
                                </div>
                              </div>
                            </div>
                            {newArticle.ImageUrl && (
                              <div className="cinema-image-preview">
                                <img
                                  src={newArticle.ImageUrl}
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

                          {/* Trạng thái */}
                          <div className="cinema-form-group cinema-form-grid-full">
                            <label className="cinema-form-label">
                              <i className="fas fa-flag"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newArticle.Status}
                              onChange={(e) =>
                                setNewArticle({
                                  ...newArticle,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Draft">Nháp</option>
                              <option value="Published">Xuất bản</option>
                              <option value="Hidden">Ẩn</option>
                            </select>
                          </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button type="submit" className="cinema-btn cinema-btn-primary" disabled={formLoading}>
                            <i className="fas fa-save"></i>
                            {formLoading ? "Đang lưu..." : "Lưu tin tức"}
                          </button>
                          <button
                            type="button"
                            className="cinema-btn cinema-btn-secondary"
                            onClick={() => setShowForm(false)}
                            disabled={formLoading}
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
                          <th>Tiêu đề</th>
                          <th>Hình ảnh</th>
                          <th>Trạng thái</th>
                          <th>Ngày tạo</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && news.length > 0
                          ? news.map((article, index) => (
                              <tr
                                key={article.NewsId}
                                className="table-row-hover"
                              >
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td>
                                  <div className="fw-semibold">{article.Title}</div>
                                  <small className="text-muted">
                                    
                                  
                                  </small>
                                </td>
                                <td>
                                  <img
                                    src={article.ImageUrl}
                                    alt="thumbnail"
                                    style={{ 
                                      width: 80, 
                                      height: 60,
                                      objectFit: "cover",
                                      borderRadius: 8 
                                    }}
                                  />
                                </td>
                                <td>
                                  {getStatusBadge(article.Status)}
                                </td>
                                <td>
                                  <div className="text-muted">
                                    <i className="fas fa-calendar me-1"></i>
                                    {new Date(article.CreatedAt).toLocaleDateString("vi-VN")}
                                  </div>
                                  <small className="text-muted">
                                    {new Date(article.CreatedAt).toLocaleTimeString("vi-VN")}
                                  </small>
                                </td>

                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(`/news/show/${article.NewsId}`)
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(`/news/edit/${article.NewsId}`)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteNews(article.NewsId, setNews)
                                    }
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
                                <td colSpan="6" className="text-center py-5 text-muted">
                                  <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                                  <p className="mb-0">Chưa có tin tức nào</p>
                                </td>
                              </tr>
                            )}
                        
                        {loading && [...Array(3)].map((_, i) => (
                          <tr key={i}>
                            <td colSpan="6" className="py-3">
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