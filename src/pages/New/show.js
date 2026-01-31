import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/wishlist/Show.css";
import NewsApi from "../../api/NewApi";
import {
  Newspaper,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

export default function NewsShow() {
  const { NewsId } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const newsRes = await NewsApi.getById(NewsId);
        setNews(newsRes.data.data || newsRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin tin tức."
        );
      } finally {
        setLoading(false);
      }
    };
    if (NewsId) fetchData();
  }, [NewsId]);

  const getStatusInfo = (status) => {
    const statusMap = {
      Draft: { 
        text: "Nháp", 
        color: "secondary",
        icon: <FileText size={16} />,
        active: false
      },
      Published: { 
        text: "Đã xuất bản", 
        color: "success",
        icon: <CheckCircle size={16} />,
        active: true
      },
      Hidden: { 
        text: "Đã ẩn", 
        color: "warning",
        icon: <EyeOff size={16} />,
        active: false
      },
    };
    return statusMap[status] || statusMap.Draft;
  };

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
              <h5 className="text-primary">Đang tải dữ liệu tin tức...</h5>
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
  if (!news) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <Newspaper size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu tin tức.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(news.Status);

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
                    onClick={() => navigate("/news")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Tin Tức</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý tin tức
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/news/edit/${news.NewsId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - News Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Image or Icon */}
                  {news.ImageUrl ? (
                    <img
                      src={news.ImageUrl}
                      alt={news.Title}
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
                        statusInfo.active ? "active" : "inactive"
                      }`}
                    >
                      <Newspaper size={56} color="white" strokeWidth={2} />
                    </div>
                  )}

                  {/* News Title */}
                  <h2 className="wishlist-show-user-name">{news.Title}</h2>

                  {/* Slug */}
                  <p className="wishlist-show-movie-title">
                    <LinkIcon size={14} style={{ marginRight: "4px" }} />
                    {news.Slug}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`wishlist-show-status-badge ${
                      statusInfo.active ? "active" : "inactive"
                    }`}
                  >
                    {statusInfo.icon}
                    {statusInfo.text}
                  </div>

                  {/* News ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">Mã Tin Tức</div>
                    <div className="wishlist-show-id-value">
                      {news.NewsId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Content */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <FileText size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Nội Dung Bài Viết
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết tin tức
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <FileText size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Nội dung
                          </div>
                          <div 
                            className="wishlist-show-info-item-value"
                            style={{ 
                              whiteSpace: "pre-wrap",
                              lineHeight: "1.6"
                            }}
                          >
                            {news.Content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Info */}
                  {news.ImageUrl && (
                    <div className="wishlist-show-info-card">
                      <div className="wishlist-show-info-header">
                        <div className="wishlist-show-info-icon movie">
                          <ImageIcon size={24} color="white" />
                        </div>
                        <div>
                          <h3 className="wishlist-show-info-title">
                            Hình Ảnh
                          </h3>
                          <p className="wishlist-show-info-subtitle">
                            Media đính kèm
                          </p>
                        </div>
                      </div>

                      <div className="wishlist-show-info-list">
                        <div className="wishlist-show-info-item">
                          <ImageIcon size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              URL hình ảnh
                            </div>
                            <div className="wishlist-show-info-item-value">
                              <a
                                href={news.ImageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#f7931e" }}
                              >
                                Xem ảnh gốc
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Author Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Tác Giả
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Người đăng và quản lý
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người đăng
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {news.UserId || "N/A"}
                          </div>
                        </div>
                      </div>

                      {news.CreatedBy && (
                        <div className="wishlist-show-info-item">
                          <User size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              Người tạo
                            </div>
                            <div className="wishlist-show-info-item-value">
                              {news.CreatedBy}
                            </div>
                          </div>
                        </div>
                      )}

                      {news.UpdatedBy && (
                        <div className="wishlist-show-info-item">
                          <User size={20} color="#94a3b8" />
                          <div className="wishlist-show-info-item-content">
                            <div className="wishlist-show-info-item-label">
                              Người cập nhật
                            </div>
                            <div className="wishlist-show-info-item-value">
                              {news.UpdatedBy}
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
                        <Calendar size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Ngày tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {news.CreatedAt 
                              ? new Date(news.CreatedAt).toLocaleString("vi-VN")
                              : "N/A"}
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
                            {news.UpdatedAt 
                              ? new Date(news.UpdatedAt).toLocaleString("vi-VN")
                              : "N/A"}
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