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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu khuyến mãi...
              </h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>

              {/* Skeleton */}
              <div className="card shadow-sm border-0 wishlist-show-skeleton-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="wishlist-show-skeleton-avatar"></div>
                      <div className="wishlist-show-skeleton-text"></div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "60%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "100%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "90%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "80%" }}
                      ></div>
                      <div
                        className="wishlist-show-skeleton-line"
                        style={{ width: "70%" }}
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

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-error-container">
              <div className="wishlist-show-error-content">
                <div className="wishlist-show-error-card">
                  <div className="wishlist-show-error-icon-wrapper">
                    <XCircle size={40} color="#ef4444" />
                  </div>
                  <h3 className="wishlist-show-error-title">{error}</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="wishlist-show-error-button"
                  >
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
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Gift size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu khuyến mãi.
                </p>
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
          <div className="wishlist-show-main-container">
            {/* Background Effects */}
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/promotion")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">
                    Chi Tiết Khuyến Mãi
                  </h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý khuyến mãi
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/promotion/edit/${PromotionId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Promotion Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    <Gift size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h2 className="wishlist-show-user-name">
                    {promotion.Title}
                  </h2>

                  {/* Code */}
                  <p className="wishlist-show-movie-title">
                    Mã: {promotion.Code}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Promotion ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Khuyến Mãi
                    </div>
                    <div className="wishlist-show-id-value">
                      {promotion.PromotionId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Promotion Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Tag size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Khuyến Mãi
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về chương trình
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Tag size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên chương trình
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.Title}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Info size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Mô tả
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.Description || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Percent size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Giảm Giá
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về mức giảm
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Percent size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Loại giảm giá
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.DiscountType}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Tag size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giá trị giảm
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.DiscountValue}
                          </div>
                        </div>
                      </div>

                      {promotion.ImageUrl && (
                        <div className="wishlist-show-info-item">
                          <ImageIcon size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              Hình ảnh
                            </div>
                            <div className="wishlist-show-info-item-value">
                              <img
                                src={promotion.ImageUrl}
                                alt={promotion.Title}
                                style={{
                                  maxWidth: "200px",
                                  borderRadius: "8px",
                                  marginTop: "8px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Thời Gian
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Lịch sử hoạt động
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày bắt đầu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.StartDate || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày kết thúc
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.EndDate || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.CreatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Cập nhật lần cuối
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {promotion.UpdatedAt || "N/A"}
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
      </div>
    </MainLayout>
  );
}