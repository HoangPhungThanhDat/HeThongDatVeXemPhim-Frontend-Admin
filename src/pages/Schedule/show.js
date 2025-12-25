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
} from "lucide-react";
import "../../styles/wishlist/Show.css";

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
            <div className="wishlist-show-loading-container">
              <div
                className="spinner-border text-primary wishlist-show-spinner"
                role="status"
              ></div>
              <h5 className="text-primary">
                Đang tải dữ liệu lịch chiếu định kỳ...
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
  if (!schedule) {
    return (
      <MainLayout>
        <div className="main-container">
          <div className="pd-ltr-20">
            <div className="wishlist-show-no-data-container">
              <div className="wishlist-show-no-data-content">
                <CalendarDays size={64} className="wishlist-show-no-data-icon" />
                <p className="wishlist-show-no-data-text">
                  Không có dữ liệu lịch chiếu định kỳ.
                </p>
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
          <div className="wishlist-show-main-container">
            {/* Background Effects */}
            <div className="wishlist-show-bg-effect"></div>

            <div className="wishlist-show-content-wrapper">
              {/* Header */}
              <div className="wishlist-show-header">
                <div>
                  <button
                    onClick={() => navigate("/schedules")}
                    className="wishlist-show-back-button"
                  >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                  </button>
                  <h1 className="wishlist-show-title">
                    Chi Tiết Lịch Chiếu Định Kỳ
                  </h1>
                  <p className="wishlist-show-subtitle">
                    Xem thông tin chi tiết và quản lý lịch chiếu
                  </p>
                </div>

                <div className="wishlist-show-actions">
                  <button
                    onClick={() => navigate(`/schedules/edit/${ScheduleId}`)}
                    className="wishlist-show-edit-button"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="wishlist-show-grid">
                {/* Left Column - Schedule Summary */}
                <div className="wishlist-show-summary-card">
                  {/* Icon */}
                  <div
                    className={`wishlist-show-icon-wrapper ${
                      isActive ? "active" : "inactive"
                    }`}
                  >
                    <CalendarDays size={56} color="white" strokeWidth={2} />
                  </div>

                  {/* Movie Title */}
                  <h2 className="wishlist-show-user-name">
                    {getMovieTitle(schedule.MovieId)}
                  </h2>

                  {/* Room Name */}
                  <p className="wishlist-show-movie-title">
                    {getRoomName(schedule.RoomId)}
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

                  {/* Schedule ID */}
                  <div className="wishlist-show-id-box">
                    <div className="wishlist-show-id-label">
                      ID Lịch Chiếu
                    </div>
                    <div className="wishlist-show-id-value">
                      {schedule.ScheduleId}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="wishlist-show-details-column">
                  {/* Movie & Room Info */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon user">
                        <Film size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Phim & Phòng
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về phim và phòng chiếu
                        </p>
                      </div>
                    </div>

                    <div className="wishlist-show-info-list">
                      <div className="wishlist-show-info-item">
                        <Film size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Tên phim
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getMovieTitle(schedule.MovieId)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <DoorOpen size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Phòng chiếu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getRoomName(schedule.RoomId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="wishlist-show-info-card">
                    <div className="wishlist-show-info-header">
                      <div className="wishlist-show-info-icon movie">
                        <CalendarDays size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="wishlist-show-info-title">
                          Thông Tin Lịch Chiếu
                        </h3>
                        <p className="wishlist-show-info-subtitle">
                          Chi tiết về thời gian và giá vé
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
                            {schedule.StartDate || "N/A"}
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
                            {schedule.EndDate || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <CalendarDays size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Các ngày trong tuần
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {getDaysInVietnamese(schedule.DaysOfWeek)}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <Play size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giờ chiếu
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {schedule.StartTime || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <StopCircle size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giờ kết thúc
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {schedule.EndTime || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <DollarSign size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Giá vé
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {schedule.Price ? `${schedule.Price} đ` : "N/A"}
                          </div>
                        </div>
                      </div>
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
                          Lịch sử hoạt động
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
                            {schedule.CreatedAt || "N/A"}
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
                            {schedule.UpdatedAt || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người tạo
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {schedule.CreatedBy || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="wishlist-show-info-item">
                        <User size={20} color="#94a3b8" />
                        <div className="wishlist-show-info-item-content">
                          <div className="wishlist-show-info-item-label">
                            Người cập nhật
                          </div>
                          <div className="wishlist-show-info-item-value">
                            {schedule.UpdatedBy || "N/A"}
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