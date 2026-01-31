import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/wishlist/Show.css";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";
import {
  Utensils,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Info,
} from "lucide-react";

export default function FoodAndDrinkShow() {
  const { ItemId } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await FoodAndDrinkApi.getById(ItemId);
        setFoodItem(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin sản phẩm."
        );
      } finally {
        setLoading(false);
      }
    };
    if (ItemId) fetchData();
  }, [ItemId]);

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
              <h5 className="text-primary">Đang tải dữ liệu sản phẩm...</h5>
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
                    <XCircle size={40} />
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
  if (!foodItem) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Utensils size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isAvailable = foodItem.IsAvailable;
  const statusText = {
    Active: "Hoạt động",
    Inactive: "Tạm ngưng",
    OutOfStock: "Hết hàng",
  }[foodItem.Status] || foodItem.Status;

  const statusClass = {
    Active: "active",
    Inactive: "inactive",
    OutOfStock: "inactive",
  }[foodItem.Status] || "inactive";

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
                    onClick={() => navigate("/foodanddrink")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Sản Phẩm</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý sản phẩm
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/foodanddrink/edit/${foodItem.ItemId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Product Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Image or Icon */}
                  {foodItem.ImageUrl ? (
                    <img
                      src={foodItem.ImageUrl}
                      alt={foodItem.Name}
                      style={{
                        width: "100%",
                        borderRadius: "16px",
                        marginBottom: "24px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  ) : (
                    <div
                      className={`wishlist-show-icon-wrapper ${
                        isAvailable ? "active" : "inactive"
                      }`}
                    >
                      <Utensils size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* Product Name */}
                  <h2 className="wishlist-show-user-name">{foodItem.Name}</h2>

                  {/* Price */}
                  <p className="wishlist-show-movie-title">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(foodItem.Price)}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${statusClass}`}
                  >
                    {foodItem.Status === "Active" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {statusText}
                  </div>

                  {/* Availability Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      isAvailable ? "active" : "inactive"
                    }`}
                    style={{ marginTop: "8px" }}
                  >
                    {isAvailable ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {isAvailable ? "Có sẵn" : "Không có sẵn"}
                  </div>

                  {/* Item ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">Mã Sản Phẩm</div>
                    <div className="wishlist-show-id-value">
                      {foodItem.ItemId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Basic Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Utensils size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Cơ Bản
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về sản phẩm
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Utensils size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên sản phẩm
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {foodItem.Name}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <DollarSign size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giá
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(foodItem.Price)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Info size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Trạng thái
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {statusText}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <CheckCircle size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tình trạng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {isAvailable ? "Có sẵn" : "Không có sẵn"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Media */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <Info size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Mô Tả & Hình Ảnh
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Nội dung và liên kết
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Info size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Mô tả
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {foodItem.Description || "Không có mô tả"}
                          </div>
                        </div>
                      </div>

                      {foodItem.ImageUrl && (
                        <div className="wishlist-show-info-item">
                          <ImageIcon size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              Hình ảnh
                            </div>
                            <div className="wishlist-show-info-item-value">
                              <a
                                href={foodItem.ImageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#f7931e" }}
                              >
                                Xem hình ảnh
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <Clock size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Hệ Thống
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Lịch sử tạo và cập nhật
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Clock size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {foodItem.CreatedAt || "N/A"}
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
                            {foodItem.UpdatedAt || "N/A"}
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