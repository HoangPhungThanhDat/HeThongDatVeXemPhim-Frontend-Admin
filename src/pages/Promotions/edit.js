import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import PromotionApi from "../../api/PromotionApi";
import Swal from "sweetalert2";
import "../../styles/Role/Edit.css";

export default function PromotionEdit() {
  const { PromotionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho form Promotion
  const [promotion, setPromotion] = useState({
    Title: "",
    Code: "",
    Description: "",
    ImageUrl: null,
    DiscountType: "Percentage",
    DiscountValue: "",
    StartDate: "",
    EndDate: "",
    IsActive: 1,
    Status: "Active",
  });

  // Lấy dữ liệu Promotion theo ID
  useEffect(() => {
    if (PromotionId) {
      PromotionApi.getById(PromotionId)
        .then((res) => {
          setPromotion(res.data.data || res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lấy dữ liệu Promotion:", err);
          setError("Không thể tải dữ liệu khuyến mãi!");
          setLoading(false);
        });
    }
  }, [PromotionId]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setPromotion((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setPromotion((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", promotion.Title);
    formData.append("Code", promotion.Code);
    formData.append("Description", promotion.Description);
    if (promotion.ImageUrl instanceof File) {
      formData.append("ImageUrl", promotion.ImageUrl);
    }
    formData.append("DiscountType", promotion.DiscountType);
    formData.append("DiscountValue", promotion.DiscountValue);
    formData.append("StartDate", promotion.StartDate);
    formData.append("EndDate", promotion.EndDate);
    formData.append("IsActive", promotion.IsActive ? 1 : 0);
    formData.append("Status", promotion.Status);

    PromotionApi.update(PromotionId, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🎉 Cập nhật khuyến mãi thành công!",
          showConfirmButton: false,
          timer: 2000,
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
        }).then(() => {
          navigate("/promotion");
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật khuyến mãi:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Cập nhật khuyến mãi thất bại!",
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
      });
  };

  // ⏳ Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              ></div>
              <h5 className="text-primary">Đang tải dữ liệu khuyến mãi...</h5>
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
      </MainLayout>
    );
  }

  // ❌ Nếu lỗi
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-danger">
              <i className="fa fa-exclamation-circle fa-3x mb-3"></i>
              <h5>{error}</h5>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="fa fa-sync-alt me-2"></i> Thử lại
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 📌 Không có dữ liệu
  if (!promotion) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="text-center p-5 text-muted">
              <i className="fa fa-gift fa-2x mb-2"></i>
              <p>Không có dữ liệu khuyến mãi.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <span className="breadcrumb-item" onClick={() => navigate("/promotion")}>
              Khuyến mãi
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Chỉnh sửa</span>
          </div>

          {/* Main Content */}
          <div className="content-wrapper">
            {/* Left Column - Form */}
            <div className="form-section">
              <div className="section-header">
                <div className="header-icon">
                  <i className="fas fa-gift"></i>
                </div>
                <div className="header-text">
                  <h2 className="section-title">Chỉnh Sửa Khuyến Mãi</h2>
                  <p className="section-subtitle">Cập nhật thông tin chương trình khuyến mãi</p>
                </div>
              </div>

              <div className="form-card">
                {/* Tên khuyến mãi */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-tag label-icon"></i>
                    Tên khuyến mãi
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Title"
                    value={promotion.Title || ""}
                    onChange={handleChange}
                    placeholder="VD: Giảm giá Black Friday"
                    required
                  />
                </div>

                {/* Mã khuyến mãi */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-code label-icon"></i>
                    Mã khuyến mãi
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    name="Code"
                    value={promotion.Code || ""}
                    onChange={handleChange}
                    placeholder="VD: SALE2024"
                  />
                </div>

                {/* Mô tả */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-align-left label-icon"></i>
                    Mô tả chi tiết
                  </label>
                  <textarea
                    className="modern-input modern-textarea"
                    name="Description"
                    value={promotion.Description || ""}
                    onChange={handleChange}
                    placeholder="VD: Giảm 20% cho tất cả sản phẩm từ ngày 20-25/10"
                    rows="4"
                  ></textarea>
                </div>

                {/* Hình ảnh */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-image label-icon"></i>
                    Ảnh khuyến mãi
                  </label>
                  <input
                    type="file"
                    className="modern-input"
                    name="ImageUrl"
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        ImageUrl: e.target.files[0],
                      })
                    }
                  />
                  {/* Preview ảnh */}
                  {promotion.ImageUrl && (
                    <div style={{ marginTop: "12px" }}>
                      <img
                        src={
                          promotion.ImageUrl instanceof File
                            ? URL.createObjectURL(promotion.ImageUrl)
                            : promotion.ImageUrl
                        }
                        alt="Preview"
                        style={{
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid rgba(247, 147, 30, 0.3)",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Loại giảm giá */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-percentage label-icon"></i>
                    Loại giảm giá
                  </label>
                  <select
                    className="modern-input"
                    name="DiscountType"
                    value={promotion.DiscountType || "Percentage"}
                    onChange={handleChange}
                  >
                    <option value="Percentage">Giảm theo %</option>
                    <option value="FixedAmount">Giảm số tiền cố định</option>
                  </select>
                </div>

                {/* Giá trị giảm */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-dollar-sign label-icon"></i>
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    className="modern-input"
                    name="DiscountValue"
                    value={promotion.DiscountValue || ""}
                    onChange={handleChange}
                    placeholder="VD: 20 (nghĩa là 20% hoặc 20.000đ)"
                    required
                  />
                </div>

                {/* Ngày bắt đầu */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-calendar-alt label-icon"></i>
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="modern-input"
                    name="StartDate"
                    value={promotion.StartDate || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Ngày kết thúc */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-calendar-times label-icon"></i>
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="modern-input"
                    name="EndDate"
                    value={promotion.EndDate || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Có hiệu lực */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-check-circle label-icon"></i>
                    Có hiệu lực
                  </label>
                  <select
                    className="modern-input"
                    name="IsActive"
                    value={promotion.IsActive ? 1 : 0}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        IsActive: e.target.value === "1",
                      })
                    }
                  >
                    <option value={1}>Có</option>
                    <option value={0}>Không</option>
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="form-group">
                  <label className="field-label">
                    <i className="fas fa-power-off label-icon"></i>
                    Trạng thái
                  </label>
                  <div className="status-selector">
                    <div
                      className={`status-option ${promotion.Status === 'Active' ? 'active' : ''}`}
                      onClick={() => setPromotion({...promotion, Status: 'Active'})}
                    >
                      <div className="status-radio">
                        {promotion.Status === 'Active' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge active-badge">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <span className="status-label">Hoạt động</span>
                      </div>
                    </div>
                    <div
                      className={`status-option ${promotion.Status === 'Inactive' ? 'active' : ''}`}
                      onClick={() => setPromotion({...promotion, Status: 'Inactive'})}
                    >
                      <div className="status-radio">
                        {promotion.Status === 'Inactive' && <div className="status-dot"></div>}
                      </div>
                      <div className="status-content">
                        <div className="status-badge inactive-badge">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <span className="status-label">Không hoạt động</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cinema btn-cancel"
                    onClick={() => navigate("/promotion")}
                  >
                    <i className="fas fa-times"></i>
                    Hủy bỏ
                  </button>
                  <button 
                    type="button" 
                    className="btn-cinema btn-save"
                    onClick={handleSubmit}
                  >
                    <i className="fas fa-check"></i>
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="info-section">
              <div className="info-card highlight-card">
                <div className="info-icon-wrapper">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h4 className="info-title">Lưu ý quan trọng</h4>
                <p className="info-text">
                  Khuyến mãi sẽ được áp dụng tự động trong khoảng thời gian đã đặt. 
                  Kiểm tra kỹ ngày bắt đầu và kết thúc trước khi lưu.
                </p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Thông tin khuyến mãi</span>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-key">Tên chương trình:</span>
                    <span className="info-value">{promotion.Title || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Mã khuyến mãi:</span>
                    <span className="info-value">{promotion.Code || "Chưa có"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Giá trị giảm:</span>
                    <span className="info-value">
                      {promotion.DiscountValue || "0"}{" "}
                      {promotion.DiscountType === "Percentage" ? "%" : "VNĐ"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Trạng thái:</span>
                    <span className={`status-pill ${promotion.Status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                      {promotion.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card tips-card">
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Tên khuyến mãi nên ngắn gọn và hấp dẫn</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Mã khuyến mãi nên dễ nhớ và không trùng lặp</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Upload ảnh đẹp để thu hút khách hàng</p>
                </div>
                <div className="tip-item">
                  <i className="fas fa-check-circle tip-icon"></i>
                  <p>Kiểm tra kỹ thời gian áp dụng khuyến mãi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}