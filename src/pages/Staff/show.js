import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import StaffApi from "../../api/StaffApi";
import CinemaApi from "../../api/CinemasApi";
import UserApi from "../../api/UserApi";
import {
  UserCog,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function StaffShow() {
  const { StaffId } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <div className="loading-container">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h5 className="loading-title">Đang tải dữ liệu nhân viên...</h5>
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
  if (!staff) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <UserCog size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu nhân viên.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = staff.Status === "Active";

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
                  <button onClick={() => navigate("/staffs")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Nhân Viên</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý nhân viên
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/staffs/edit/${StaffId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Staff Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <UserCog size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Staff Name */}
                  <h2 className="role-name">{staff.FullName}</h2>

                  {/* Position */}
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '15px',
                    fontWeight: '500'
                  }}>
                    {staff.Position}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Đang hoạt động" : staff.Status === "Inactive" ? "Tạm ngưng" : "Hết hạn"}
                  </div>

                  {/* Cinema */}
                  <div className="description-box">
                    <div className="description-header">
                      <Building2 size={18} color="#6b7280" />
                      <span className="description-label">Rạp chiếu</span>
                    </div>
                    <p className="description-text">
                      {getCinemaName(staff.CinemaId)}
                    </p>
                  </div>

                  {/* Staff ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">Mã Nhân Viên</div>
                    <div className="role-id-value">{staff.StaffId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Contact Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <User size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Liên Hệ</h3>
                        <p className="info-subtitle">Chi tiết thông tin cá nhân</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Mail size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Email</div>
                          <div className="info-item-value">
                            <a 
                              href={`mailto:${staff.Email}`} 
                              style={{ color: '#3b82f6', textDecoration: 'none' }}
                            >
                              {staff.Email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Phone size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Số điện thoại</div>
                          <div className="info-item-value">
                            <a 
                              href={`tel:${staff.Phone}`} 
                              style={{ color: '#3b82f6', textDecoration: 'none' }}
                            >
                              {staff.Phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Building2 size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Rạp làm việc</div>
                          <div className="info-item-value">
                            {getCinemaName(staff.CinemaId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Briefcase size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Công Việc</h3>
                        <p className="info-subtitle">Chi tiết vị trí và quyền hạn</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Briefcase size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Chức vụ</div>
                          <div className="info-item-value">{staff.Position}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Tạo</h3>
                        <p className="info-subtitle">Chi tiết về người tạo nhân viên</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{staff.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{staff.CreatedAt || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Activity size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Cập Nhật Gần Nhất</h3>
                        <p className="info-subtitle">Lịch sử thay đổi nhân viên</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{staff.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày cập nhật</div>
                          <div className="info-item-value">{staff.UpdatedAt || "N/A"}</div>
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