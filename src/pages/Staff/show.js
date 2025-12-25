import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Show.css";
import StaffApi from "../../api/StaffApi";
import CinemaApi from "../../api/CinemasApi";
import UserApi from "../../api/UserApi";

export default function StaffShow() {
  const { StaffId } = useParams();
  const [staff, setStaff] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [staffRes, cinemaRes, userRes] = await Promise.all([
          StaffApi.getById(StaffId),
          CinemaApi.getAll(),
          UserApi.getAll(),
        ]);
        setStaff(staffRes.data.data || staffRes.data);
        setCinemas(cinemaRes.data.data || []);
        setUsers(userRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError(
          err.response?.data?.message || "Không tìm thấy thông tin nhân viên."
        );
      } finally {
        setLoading(false);
      }
    };
    if (StaffId) fetchData();
  }, [StaffId]);

  const getCinemaName = (cinemaData) => {
    if (cinemaData && typeof cinemaData === 'object') {
      return cinemaData.Name || cinemaData.CinemaName || 'N/A';
    }
    const cinema = cinemas.find((c) => c.CinemaId === cinemaData);
    return cinema?.Name || cinema?.CinemaName || cinemaData || 'N/A';
  };

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-loading-container">
              <div className="spinner-border text-primary wishlist-show-spinner" role="status"></div>
              <h5 className="text-primary">Đang tải dữ liệu nhân viên...</h5>
              <p className="text-muted mt-2">Vui lòng chờ trong giây lát</p>
              
              <div className="card shadow-sm border-0 wishlist-show-skeleton-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="wishlist-show-skeleton-avatar"></div>
                      <div className="wishlist-show-skeleton-text"></div>
                    </div>
                    <div className="col-md-8">
                      <div className="wishlist-show-skeleton-line" style={{ width: "60%" }}></div>
                      <div className="wishlist-show-skeleton-line" style={{ width: "100%" }}></div>
                      <div className="wishlist-show-skeleton-line" style={{ width: "90%" }}></div>
                      <div className="wishlist-show-skeleton-line" style={{ width: "80%" }}></div>
                      <div className="wishlist-show-skeleton-line" style={{ width: "70%" }}></div>
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
                    <i className="fa fa-exclamation-circle fa-3x text-white"></i>
                  </div>
                  <h3 className="wishlist-show-error-title">{error}</h3>
                  <button
                    className="wishlist-show-error-button"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fa fa-sync-alt me-2"></i> Thử lại
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
  if (!staff) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <i className="fa fa-id-card-slash fa-5x wishlist-show-no-data-icon"></i>
                <p className="wishlist-show-no-data-text">Không có dữ liệu nhân viên.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = staff.Status === "Active";
  const statusText = staff.Status === "Active" ? "Đang hoạt động" : staff.Status === "Inactive" ? "Tạm ngưng" : "Hết hạn";

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
                    className="wishlist-show-back-button"
                    onClick={() => navigate("/staffs")}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">Chi Tiết Nhân Viên</h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý nhân viên
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    className="wishlist-show-edit-button"
                    onClick={() => navigate(`/staffs/edit/${staff.StaffId}`)}
                  >
                    <i className="fa fa-edit"></i>
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Staff Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div className={`wishlist-show-icon-wrapper ${isActive ? "active" : "inactive"}`}>
                    <i className="fa fa-user-tie fa-3x text-white"></i>
                  </div>

                  {/* Staff Name */}
                  <h2 className="wishlist-show-user-name">{staff.FullName}</h2>

                  {/* Position */}
                  <p className="wishlist-show-movie-title">{staff.Position}</p>

                  {/* Status Badge */}
                  <div className={`wishlist-show-status-badge ${isActive ? "active" : "inactive"}`}>
                    <i className={`fa ${isActive ? "fa-check-circle" : "fa-times-circle"}`}></i>
                    {statusText}
                  </div>

                  {/* Staff ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">Mã Nhân Viên</div>
                    <div className="wishlist-show-id-value">{staff.StaffId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Contact Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <i className="fa fa-address-card fa-lg text-white"></i>
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">Thông Tin Liên Hệ</h3>
                        <p className="wishlist-show-info-subtitle">Chi tiết thông tin cá nhân</p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <i className="fa fa-envelope" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Email</div>
                          <div className="wishlist-show-info-item-value">
                            <a href={`mailto:${staff.Email}`} style={{ color: '#f7931e', textDecoration: 'none' }}>
                              {staff.Email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <i className="fa fa-phone" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Số điện thoại</div>
                          <div className="wishlist-show-info-item-value">
                            <a href={`tel:${staff.Phone}`} style={{ color: '#f7931e', textDecoration: 'none' }}>
                              {staff.Phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <i className="fa fa-building" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Rạp chiếu</div>
                          <div className="wishlist-show-info-item-value">
                            {getCinemaName(staff.CinemaId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <i className="fa fa-briefcase fa-lg text-white"></i>
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">Thông Tin Công Việc</h3>
                        <p className="wishlist-show-info-subtitle">Chi tiết vị trí và quyền hạn</p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <i className="fa fa-user-tag" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Chức vụ</div>
                          <div className="wishlist-show-info-item-value">{staff.Position}</div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <i className="fa fa-user-plus" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Người tạo</div>
                          <div className="wishlist-show-info-item-value">{staff.CreatedBy || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <i className="fa fa-user-edit" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Người cập nhật</div>
                          <div className="wishlist-show-info-item-value">{staff.UpdatedBy || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon time">
                        <i className="fa fa-clock fa-lg text-white"></i>
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">Thông Tin Thời Gian</h3>
                        <p className="wishlist-show-info-subtitle">Lịch sử tạo và cập nhật</p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <i className="fa fa-calendar-plus" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Ngày tạo</div>
                          <div className="wishlist-show-info-item-value">{staff.CreatedAt || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <i className="fa fa-calendar-check" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">Cập nhật lần cuối</div>
                          <div className="wishlist-show-info-item-value">{staff.UpdatedAt || 'N/A'}</div>
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