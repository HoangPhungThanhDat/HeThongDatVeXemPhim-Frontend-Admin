import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PromotionApi from "../../api/PromotionApi";
import {
  Tag,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Gift,
  Calendar,
  Clock,
  Percent,
  Image as ImageIcon,
  Info,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function PromotionShow() {
  const { PromotionId } = useParams();
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await PromotionApi.getById(PromotionId);
        setPromotion(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu khuyến mãi!");
      } finally {
        setLoading(false);
      }
    };
    if (PromotionId) fetchData();
  }, [PromotionId]);

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu khuyến mãi...</h5>
              <p className="loading-subtitle">Vui lòng chờ trong giây lát</p>

              {/* Skeleton giả lập khi đang tải */}
              <div className="skeleton-card">
                <div className="skeleton-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-text-short"></div>
                    </div>
                    <div className="col-md-8">
                      <div className="skeleton-text-60"></div>
                      <div className="skeleton-text-100"></div>
                      <div className="skeleton-text-90"></div>
                      <div className="skeleton-text-80"></div>
                      <div className="skeleton-text-70"></div>
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

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="error-container">
              <div className="error-content">
                <div className="error-card">
                  <div className="error-icon">
                    <XCircle size={40} color="#ef4444" />
                  </div>
                  <h3 className="error-title">{error}</h3>
                  <button onClick={() => window.location.reload()} className="error-button">
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // No Data State
  if (!promotion) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Gift size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu khuyến mãi.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = promotion.Status === "Active";

  return (
    <MainLayout>
      <div className="main-container">
        <div className="pd-ltr-20">
          <div className="role-show-container">
            {/* Background Effects */}
            <div className="background-effect"></div>

            <div className="role-show-content">
              {/* Header */}
              <div className="header-section">
                <div>
                  <button onClick={() => navigate("/promotion")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Khuyến Mãi</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý khuyến mãi
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/promotion/edit/${PromotionId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Promotion Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Gift size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h2 className="role-name">{promotion.Title}</h2>

                  {/* Code */}
                  <p style={{ 
                    fontSize: "16px", 
                    color: "#94a3b8", 
                    margin: "8px 0 16px",
                    fontWeight: 500 
                  }}>
                    Mã: {promotion.Code}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Description */}
                  {promotion.Description && (
                    <div className="description-box">
                      <div className="description-header">
                        <Info size={18} color="#6b7280" />
                        <span className="description-label">Mô tả</span>
                      </div>
                      <p className="description-text">{promotion.Description}</p>
                    </div>
                  )}

                  {/* Image */}
                  {promotion.ImageUrl && (
                    <div className="description-box">
                      <div className="description-header">
                        <ImageIcon size={18} color="#6b7280" />
                        <span className="description-label">Hình ảnh</span>
                      </div>
                      <img
                        src={promotion.ImageUrl}
                        alt={promotion.Title}
                        style={{
                          maxWidth: "100%",
                          borderRadius: "12px",
                          marginTop: "12px",
                        }}
                      />
                    </div>
                  )}

                  {/* Promotion ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Khuyến Mãi</div>
                    <div className="role-id-value">{promotion.PromotionId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Discount Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Percent size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Giảm Giá</h3>
                        <p className="info-subtitle">Chi tiết về mức giảm</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Percent size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Loại giảm giá</div>
                          <div className="info-item-value">{promotion.DiscountType}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Tag size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giá trị giảm</div>
                          <div className="info-item-value">{promotion.DiscountValue}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thời Gian Hiệu Lực</h3>
                        <p className="info-subtitle">Thời gian áp dụng khuyến mãi</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày bắt đầu</div>
                          <div className="info-item-value">{promotion.StartDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày kết thúc</div>
                          <div className="info-item-value">{promotion.EndDate || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Lịch Sử Hoạt Động</h3>
                        <p className="info-subtitle">Thông tin tạo và cập nhật</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{promotion.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{promotion.UpdatedAt || "N/A"}</div>
                        </div>
                      </div>
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