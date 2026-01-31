import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Edit.css";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";
import Swal from "sweetalert2";

export default function FoodAndDrinkEdit() {
  const { ItemId } = useParams();
  const navigate = useNavigate();

  const [foodItem, setFoodItem] = useState({
    ItemId: "",
    Name: "",
    Description: "",
    Price: "",
    ImageUrl: "",
    IsAvailable: true,
    Status: "",
    ImageFile: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!ItemId) {
          setError("Thiếu ItemId trong URL");
          return;
        }
        setLoading(true);

        const res = await FoodAndDrinkApi.getById(ItemId);
        const item = res.data.data || res.data;
        setFoodItem((prev) => ({
          ...prev,
          ...item,
          ImageFile: null,
        }));
      } catch (err) {
        console.error("❌ Lỗi load sản phẩm:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ItemId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodItem((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodItem((prev) => ({
        ...prev,
        ImageFile: file,
        ImageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
    
      formData.append("_method", "PUT");
      formData.append("Name", foodItem.Name);
      formData.append("Description", foodItem.Description || "");
      formData.append("Price", foodItem.Price);
      formData.append("IsAvailable", foodItem.IsAvailable ? 1 : 0);
      formData.append("Status", foodItem.Status);

      // Chỉ gửi ImageUrl nếu có file mới
      if (foodItem.ImageFile) {
        formData.append("ImageUrl", foodItem.ImageFile);
      }

      const res = await FoodAndDrinkApi.update(ItemId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Cập nhật sản phẩm thành công!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/foodanddrink"));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", err.response?.data || err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Cập nhật sản phẩm thất bại!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  // Helper function to get status display info
  const getStatusInfo = (status) => {
    switch(status) {
      case "Active":
        return { label: "Hoạt động", class: "pill-active", icon: "fa-check-circle" };
      case "Inactive":
        return { label: "Tạm ngưng", class: "pill-warning", icon: "fa-pause-circle" };
      case "OutOfStock":
        return { label: "Hết hàng", class: "pill-inactive", icon: "fa-times-circle" };
      default:
        return { label: "Không xác định", class: "pill-inactive", icon: "fa-question-circle" };
    }
  };

   // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
          <div className="container role-show-container">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                membership="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu sản phẩm ...
              </h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="card shadow-sm border-0 mt-4 w-75">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div
                        className="bg-light rounded-circle mx-auto"
                        style={{ width: "120px", height: "120px" }}
                      ></div>
                      <div
                        className="bg-light mt-3 rounded"
                        style={{
                          width: "80%",
                          height: "20px",
                          margin: "0 auto",
                        }}
                      ></div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="bg-light rounded mb-3"
                        style={{ width: "60%", height: "20px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "100%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "90%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "80%", height: "15px" }}
                      ></div>
                      <div
                        className="bg-light rounded mb-2"
                        style={{ width: "70%", height: "15px" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </MainLayout>
    );
  }

  // Error
  if (error) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h5 className="error-title">{error}</h5>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt me-2"></i> Thử lại
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No data
  if (!foodItem) {
    return (
      <MainLayout>
        <div className="modern-cinema-page">
          <div className="error-container">
            <i className="fas fa-utensils empty-icon"></i>
            <p className="empty-text">Không có dữ liệu sản phẩm.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(foodItem.Status);

  return (
    <MainLayout>
      <div className="modern-cinema-page">
        <div className="cinema-container">
          {/* Breadcrumb */}
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i> Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={() => navigate("/foodanddrink")}>
              Quản lý đồ ăn & thức uống
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Cập nhật sản phẩm</span>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-utensils"></i>
                </div>
                <div className="header-text">
                  <h1 className="section-title">Cập nhật sản phẩm</h1>
                  <p className="section-subtitle">Chỉnh sửa thông tin chi tiết sản phẩm</p>
                </div>
              </div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {/* Tên sản phẩm */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-tag label-icon"></i>
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      className="modern-input"
                      name="Name"
                      value={foodItem.Name}
                      onChange={handleChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>

                  {/* Mô tả */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-align-left label-icon"></i>
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      className="modern-input modern-textarea"
                      name="Description"
                      value={foodItem.Description || ""}
                      onChange={handleChange}
                      placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      rows="4"
                    />
                  </div>

                  {/* Giá */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-dollar-sign label-icon"></i>
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      className="modern-input"
                      name="Price"
                      value={foodItem.Price}
                      onChange={handleChange}
                      placeholder="Nhập giá sản phẩm"
                      min="0"
                      required
                    />
                  </div>

                  {/* Hình ảnh */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-image label-icon"></i>
                      Hình ảnh sản phẩm
                    </label>
                    <input
                      type="file"
                      className="modern-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {foodItem.ImageUrl && (
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img
                          src={foodItem.ImageUrl}
                          alt="preview"
                          style={{ 
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status - 3 options */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-toggle-on label-icon"></i>
                      Trạng thái sản phẩm
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                      {/* Hoạt động */}
                      <div 
                        className={`status-option ${foodItem.Status === 'Active' ? 'active' : ''}`}
                        onClick={() => setFoodItem(prev => ({ ...prev, Status: 'Active' }))}
                      >
                        <div className="status-radio">
                          {foodItem.Status === 'Active' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge active-badge">
                            <i className="fas fa-check-circle"></i>
                          </div>
                          <span className="status-label">Hoạt động</span>
                        </div>
                      </div>

                      {/* Tạm ngưng */}
                      <div 
                        className={`status-option ${foodItem.Status === 'Inactive' ? 'active' : ''}`}
                        onClick={() => setFoodItem(prev => ({ ...prev, Status: 'Inactive' }))}
                      >
                        <div className="status-radio">
                          {foodItem.Status === 'Inactive' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                            <i className="fas fa-pause-circle"></i>
                          </div>
                          <span className="status-label">Tạm ngưng</span>
                        </div>
                      </div>

                      {/* Hết hàng */}
                      <div 
                        className={`status-option ${foodItem.Status === 'OutOfStock' ? 'active' : ''}`}
                        onClick={() => setFoodItem(prev => ({ ...prev, Status: 'OutOfStock' }))}
                      >
                        <div className="status-radio">
                          {foodItem.Status === 'OutOfStock' && <div className="status-dot"></div>}
                        </div>
                        <div className="status-content">
                          <div className="status-badge inactive-badge">
                            <i className="fas fa-times-circle"></i>
                          </div>
                          <span className="status-label">Hết hàng</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tình trạng có sẵn */}
                  <div className="form-group">
                    <label className="field-label">
                      <i className="fas fa-check-circle label-icon"></i>
                      Tình trạng
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer',
                        color: '#e2e8f0'
                      }}>
                        <input
                          type="checkbox"
                          name="IsAvailable"
                          checked={foodItem.IsAvailable}
                          onChange={handleChange}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span>Sản phẩm có sẵn</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-cinema btn-save">
                      <i className="fas fa-save"></i>
                      <span>Lưu thay đổi</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => navigate("/foodanddrink")} 
                      className="btn-cinema btn-cancel"
                    >
                      <i className="fas fa-times"></i>
                      <span>Hủy bỏ</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              {/* Highlight Card */}
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="info-title">Lưu ý quan trọng</h3>
                <p className="info-text">
                  Đảm bảo tất cả thông tin được điền chính xác và đầy đủ để sản phẩm hiển thị tốt nhất trên hệ thống.
                </p>
              </div>

              {/* Tips Card */}
              <div className="info-card tips-card">
                <div className="info-header">
                  <i className="fas fa-check-circle"></i>
                  Gợi ý hữu ích
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Hình ảnh nên có kích thước tối thiểu 300x300px để hiển thị rõ nét</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Giá cả nên được cập nhật thường xuyên theo thị trường</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check tip-icon"></i>
                  <p>Trạng thái "Hết hàng" dành cho sản phẩm tạm thời không có</p>
                </div>
              </div>

              {/* Info Details */}
              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  Thông tin sản phẩm
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Mã sản phẩm:</span>
                    <span className="info-value">#{foodItem.ItemId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${statusInfo.class}`}>
                      <i className={`fas ${statusInfo.icon} me-1`}></i>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Tình trạng:</span>
                    <span className="info-value">
                      {foodItem.IsAvailable ? (
                        <span style={{ color: '#10b981' }}>
                          <i className="fas fa-check-circle me-1"></i>
                          Có sẵn
                        </span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>
                          <i className="fas fa-times-circle me-1"></i>
                          Không có sẵn
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Giá hiện tại:</span>
                    <span className="info-value" style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(foodItem.Price)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Cập nhật lần cuối:</span>
                    <span className="info-value">
                      {foodItem.UpdatedAt ? new Date(foodItem.UpdatedAt).toLocaleString('vi-VN') : 'Chưa có'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}