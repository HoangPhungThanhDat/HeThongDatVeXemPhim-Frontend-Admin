// src/pages/Membership/MembershipShow.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import MembershipApi from "../../api/MembershipApi";
import {
  Crown,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Star,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function MembershipShow() {
  const { MembershipId } = useParams();
  const navigate = useNavigate();

  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        setLoading(true);
        const res = await MembershipApi.getById(MembershipId);
        console.log("📌 Kết quả API Membership:", res.data);
        setMembership(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy membership:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin membership."
        );
      } finally {
        setLoading(false);
      }
    };

    if (MembershipId) fetchMembership();
  }, [MembershipId]);

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
              <h5 className="loading-title">Đang tải dữ liệu hội viên...</h5>
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
  if (!membership) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <Crown size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu hội viên.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = membership.Status === "Active";
  const statusText = membership.Status === "Active" 
    ? "Hoạt động" 
    : membership.Status === "Inactive"
    ? "Tạm ngưng"
    : "Hết hạn";

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
                  <button onClick={() => navigate("/membership")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Hội Viên</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý hội viên
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/membership/edit/${MembershipId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Membership Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <Crown size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* User Name */}
                  <h2 className="role-name">{membership.User?.FullName || "Người dùng"}</h2>

                  {/* Level */}
                  <p className="role-name" style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    Cấp độ: {membership.Level}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {statusText}
                  </div>

                  {/* Points Info */}
                  <div className="description-box">
                    <div className="description-header">
                      <Star size={18} color="#6b7280" />
                      <span className="description-label">Điểm tích lũy</span>
                    </div>
                    <p className="description-text">
                      {membership.Points} điểm
                    </p>
                  </div>

                  {/* Membership ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Hội Viên</div>
                    <div className="role-id-value">{membership.MembershipId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* User Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Người Dùng</h3>
                        <p className="info-subtitle">Chi tiết về chủ sở hữu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Họ và tên</div>
                          <div className="info-item-value">
                            {membership.User?.FullName || membership.UserId}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Star size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cấp độ</div>
                          <div className="info-item-value">{membership.Level}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Membership Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Membership</h3>
                        <p className="info-subtitle">Thời hạn và quyền lợi</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày bắt đầu</div>
                          <div className="info-item-value">{membership.StartDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày kết thúc</div>
                          <div className="info-item-value">{membership.EndDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Star size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Quyền lợi</div>
                          <div className="info-item-value">{membership.Benefits || "Chưa có"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Hệ Thống</h3>
                        <p className="info-subtitle">Lịch sử tạo và cập nhật</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{membership.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{membership.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{membership.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{membership.UpdatedAt || "N/A"}</div>
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