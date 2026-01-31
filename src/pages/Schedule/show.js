import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ScheduleApi from "../../api/ScheduleApi";
import MovieApi from "../../api/MovieApi";
import RoomApi from "../../api/RoomApi";
import {
  CalendarDays,
  Edit3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Film,
  DoorOpen,
  Calendar,
  Clock,
  DollarSign,
  Play,
  StopCircle,
  User,
  Sparkles,
  Activity,
} from "lucide-react";
import "../../styles/Role/Show.css";

export default function ScheduleShow() {
  const { ScheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scheduleRes, movieRes, roomRes] = await Promise.all([
          ScheduleApi.getById(ScheduleId),
          MovieApi.getAll(),
          RoomApi.getAll(),
        ]);
        setSchedule(scheduleRes.data.data || scheduleRes.data);
        setMovies(movieRes.data.data || []);
        setRooms(roomRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu lịch chiếu định kỳ!");
      } finally {
        setLoading(false);
      }
    };
    if (ScheduleId) fetchData();
  }, [ScheduleId]);

  const getMovieTitle = (id) =>
    movies.find((m) => m.MovieId === id)?.Title || id || "N/A";
  const getRoomName = (id) =>
    rooms.find((r) => r.RoomId === id)?.Name || id || "N/A";

  const daysMap = {
    Mon: "Thứ 2",
    Tue: "Thứ 3",
    Wed: "Thứ 4",
    Thu: "Thứ 5",
    Fri: "Thứ 6",
    Sat: "Thứ 7",
    Sun: "Chủ nhật",
  };

  const getDaysInVietnamese = (days) => {
    if (!days) return "N/A";

    if (typeof days === "string") {
      try {
        days = JSON.parse(days);
      } catch {
        days = days.split(",");
      }
    }

    return days.map((d) => daysMap[d.trim()] || d).join(", ");
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
              <h5 className="loading-title">Đang tải dữ liệu lịch chiếu...</h5>
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
  if (!schedule) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="no-data-container">
              <div className="no-data-content">
                <CalendarDays size={64} className="no-data-icon" />
                <p className="no-data-text">Không có dữ liệu lịch chiếu định kỳ.</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isActive = schedule.Status === "Active";

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
                  <button onClick={() => navigate("/schedules")} className="back-button">
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="page-title">Chi Tiết Lịch Chiếu Định Kỳ</h1>
                  <p className="page-subtitle">
                    Xem thông tin chi tiết và quản lý lịch chiếu định kỳ
                  </p>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => navigate(`/schedules/edit/${ScheduleId}`)}
                    className="edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-grid">
                {/* Left Column - Schedule Summary */}
                <div className="role-summary-card">
                  {/* Icon */}
                  <div className={`role-icon ${isActive ? 'active' : 'inactive'}`}>
                    <CalendarDays size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Movie Title */}
                  <h2 className="role-name">{getMovieTitle(schedule.MovieId)}</h2>

                  {/* Room Name */}
                  <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
                    {getRoomName(schedule.RoomId)}
                  </p>

                  {/* Status Badge */}
                  <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </div>

                  {/* Days of Week */}
                  <div className="description-box">
                    <div className="description-header">
                      <CalendarDays size={18} color="#6b7280" />
                      <span className="description-label">Các ngày trong tuần</span>
                    </div>
                    <p className="description-text">
                      {getDaysInVietnamese(schedule.DaysOfWeek)}
                    </p>
                  </div>

                  {/* Schedule ID */}
                  <div className="role-id-box">
                    <div className="role-id-label">ID Lịch Chiếu</div>
                    <div className="role-id-value">{schedule.ScheduleId}</div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="details-column">
                  {/* Movie & Room Info */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Phim & Phòng</h3>
                        <p className="info-subtitle">Chi tiết về phim và phòng chiếu</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Film size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Tên phim</div>
                          <div className="info-item-value">{getMovieTitle(schedule.MovieId)}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <DoorOpen size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Phòng chiếu</div>
                          <div className="info-item-value">{getRoomName(schedule.RoomId)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="info-card">
                    <div className="info-header">
                      <div className="info-icon">
                        <Sparkles size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="info-title">Thông Tin Lịch Chiếu</h3>
                        <p className="info-subtitle">Chi tiết về thời gian và giá vé</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày bắt đầu</div>
                          <div className="info-item-value">{schedule.StartDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày kết thúc</div>
                          <div className="info-item-value">{schedule.EndDate || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Play size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giờ chiếu</div>
                          <div className="info-item-value">{schedule.StartTime || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <StopCircle size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giờ kết thúc</div>
                          <div className="info-item-value">{schedule.EndTime || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <DollarSign size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Giá vé</div>
                          <div className="info-item-value">
                            {schedule.Price ? `${schedule.Price.toLocaleString('vi-VN')} đ` : "N/A"}
                          </div>
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
                        <p className="info-subtitle">Lịch sử hoạt động</p>
                      </div>
                    </div>

                    <div className="info-items">
                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người tạo</div>
                          <div className="info-item-value">{schedule.CreatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Ngày tạo</div>
                          <div className="info-item-value">{schedule.CreatedAt || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <User size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Người cập nhật</div>
                          <div className="info-item-value">{schedule.UpdatedBy || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <Clock size={20} color="#6b7280" />
                        <div className="info-item-content">
                          <div className="info-item-label">Cập nhật lần cuối</div>
                          <div className="info-item-value">{schedule.UpdatedAt || "N/A"}</div>
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