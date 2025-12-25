import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/User.css";
import RoomApi from "../../api/RoomApi";
import CinemasApi from "../../api/CinemasApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";
import { deleteRoom } from "./delete";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    CinemaId: "",
    Name: "",
    SeatCount: "",
    RoomType: "",
    Status: "",
  });

  useEffect(() => {
    RoomApi.getAll()
      .then((res) => {
        setRooms(res.data.data);
      })
      .catch((err) => console.error("Lỗi load phòng:", err))
      .finally(() => setLoading(false));

    CinemasApi.getAll()
      .then((res) => setCinemas(res.data.data))
      .catch((err) => console.error("Lỗi load rạp:", err));
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await RoomApi.create(newRoom);
      const createdRoom = res.data.data || res.data;

      setRooms([...rooms, createdRoom]);
      setNewRoom({
        CinemaId: "",
        Name: "",
        SeatCount: "",
        RoomType: "",
        Status: "",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm phòng chiếu thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
      showToast("error", "❌ Thêm thất bại!");
    }
  };

  const showToast = (icon, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: { popup: "animate__animated animate__slideInRight" },
      hideClass: { popup: "animate__animated animate__slideOutRight" },
    });
  };

  const toggleStatus = async (RoomId, currentStatus) => {
    const newStatus =
      currentStatus === "Active"
        ? "Inactive"
        : currentStatus === "Inactive"
        ? "Maintenance"
        : "Active";

    try {
      const room = rooms.find((r) => r.RoomId === RoomId);

      await RoomApi.update(RoomId, {
        ...room,
        Status: newStatus,
      });

      setRooms((prev) =>
        prev.map((r) => (r.RoomId === RoomId ? { ...r, Status: newStatus } : r))
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main>
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <i className="fas fa-heart me-2"></i> Quản lý phòng chiếu
                </h3>
                <div>
                  <button
                    className="btn btn-light me-2 shadow-sm rounded-pill px-3 fw-semibold"
                    onClick={() => setShowForm(!showForm)}
                  >
                    <i className="fas fa-plus me-1 text-success"></i> Thêm
                  </button>
                  <button className="btn btn-outline-light shadow-sm rounded-pill px-3 fw-semibold">
                    <i className="fas fa-trash me-1 text-danger"></i> Thùng rác
                  </button>
                </div>
              </div>

              {/* Form thêm */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="cinema-add-form"
                  >
                    {/* Form Header */}
                    <div className="cinema-form-header">
                      <div className="cinema-form-title">
                        <div className="cinema-form-icon">
                          <i className="fas fa-door-open"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm phòng chiếu mới</h4>
                          <p className="cinema-form-subtitle">
                            Tạo phòng chiếu phim mới cho rạp
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Body */}
                    <div className="cinema-form-body">
                      <form onSubmit={handleAddRoom}>
                        <div className="cinema-form-grid">
                          {/* Chọn rạp */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-building"></i>
                              Chọn rạp
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newRoom.CinemaId}
                              onChange={(e) =>
                                setNewRoom({
                                  ...newRoom,
                                  CinemaId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn rạp chiếu --</option>
                              {cinemas.map((c) => (
                                <option key={c.CinemaId} value={c.CinemaId}>
                                  🎬 {c.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Tên phòng */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-door-closed"></i>
                              Tên phòng chiếu
                              <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              className="cinema-input"
                              placeholder="VD: Phòng 1, Phòng VIP"
                              value={newRoom.Name}
                              onChange={(e) =>
                                setNewRoom({ ...newRoom, Name: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Tổng số ghế */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-chair"></i>
                              Tổng số ghế
                              <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              className="cinema-input"
                              placeholder="VD: 120"
                              min="0"
                              value={newRoom.SeatCount}
                              onChange={(e) =>
                                setNewRoom({
                                  ...newRoom,
                                  SeatCount: e.target.value,
                                })
                              }
                              required
                            />
                            {newRoom.SeatCount && (
                              <div className="cinema-helper-text">
                                <i className="fas fa-info-circle"></i>
                                Sức chứa:{" "}
                                <strong>{newRoom.SeatCount} ghế</strong>
                              </div>
                            )}
                          </div>

                          {/* Loại phòng */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-film"></i>
                              Loại phòng
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newRoom.RoomType}
                              onChange={(e) =>
                                setNewRoom({
                                  ...newRoom,
                                  RoomType: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn loại phòng --</option>
                              <option value="2D">📽️ 2D Standard</option>
                              <option value="3D">🕶️ 3D</option>
                              <option value="4DX">🎢 4DX</option>
                              <option value="IMAX">🎭 IMAX</option>
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="cinema-form-group">
                            <label className="cinema-form-label">
                              <i className="fas fa-toggle-on"></i>
                              Trạng thái
                              <span className="required">*</span>
                            </label>
                            <select
                              className="cinema-select"
                              value={newRoom.Status}
                              onChange={(e) =>
                                setNewRoom({
                                  ...newRoom,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn trạng thái --</option>
                              <option value="Active">✅ Hoạt động</option>
                              <option value="Inactive">
                                ❌ Không hoạt động
                              </option>
                              <option value="Maintenance">🔧 Bảo trì</option>
                            </select>
                          </div>

                          {/* Summary Box - Hiển thị khi có đủ thông tin */}
                          {newRoom.CinemaId &&
                            newRoom.Name &&
                            newRoom.SeatCount &&
                            newRoom.RoomType && (
                              <div className="cinema-form-group cinema-form-grid-full">
                                <div
                                  style={{
                                    padding: "20px",
                                    background: "rgba(247, 147, 30, 0.08)",
                                    border: "2px solid rgba(247, 147, 30, 0.3)",
                                    borderRadius: "12px",
                                    marginTop: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <i
                                      className="fas fa-info-circle"
                                      style={{
                                        color: "#f7931e",
                                        fontSize: "24px",
                                      }}
                                    ></i>
                                    <h5
                                      style={{
                                        margin: 0,
                                        color: "white",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Thông tin phòng chiếu
                                    </h5>
                                  </div>
                                  <div
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "14px",
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-building"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Rạp:{" "}
                                      <strong style={{ color: "white" }}>
                                        {
                                          cinemas.find(
                                            (c) =>
                                              c.CinemaId === newRoom.CinemaId
                                          )?.Name
                                        }
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-door-closed"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Tên phòng:{" "}
                                      <strong style={{ color: "white" }}>
                                        {newRoom.Name}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-chair"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Số ghế:{" "}
                                      <strong style={{ color: "#22c55e" }}>
                                        {newRoom.SeatCount} ghế
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-film"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Loại phòng:{" "}
                                      <strong style={{ color: "#3b82f6" }}>
                                        {newRoom.RoomType === "2D"
                                          ? "📽️ 2D Standard"
                                          : newRoom.RoomType === "3D"
                                          ? "🕶️ 3D"
                                          : newRoom.RoomType === "4DX"
                                          ? "🎢 4DX"
                                          : "🎭 IMAX"}
                                      </strong>
                                    </p>
                                    <p style={{ margin: "8px 0" }}>
                                      <i
                                        className="fas fa-tag"
                                        style={{
                                          color: "#f7931e",
                                          marginRight: "8px",
                                        }}
                                      ></i>
                                      Trạng thái:{" "}
                                      <strong
                                        style={{
                                          color:
                                            newRoom.Status === "Active"
                                              ? "#22c55e"
                                              : newRoom.Status === "Inactive"
                                              ? "#ef4444"
                                              : "#fbbf24",
                                        }}
                                      >
                                        {newRoom.Status === "Active"
                                          ? "✅ Hoạt động"
                                          : newRoom.Status === "Inactive"
                                          ? "❌ Không hoạt động"
                                          : "🔧 Bảo trì"}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="cinema-form-actions">
                          <button
                            type="submit"
                            className="cinema-btn cinema-btn-primary"
                          >
                            <i className="fas fa-save"></i>
                            Lưu phòng chiếu
                          </button>
                          <button
                            type="button"
                            className="cinema-btn cinema-btn-secondary"
                            onClick={() => setShowForm(false)}
                          >
                            <i className="fas fa-times"></i>
                            Hủy bỏ
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card chứa bảng */}
              <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover table-striped">
                      <thead className="bg-light text-dark border-bottom">
                        <tr>
                          <th className="px-4">id</th>
                          <th>Tên rạp</th>
                          <th>Tên phòng</th>
                          <th>Số ghế</th>
                          <th>Loại phòng</th>
                          <th>Trạng thái</th>
                          <th className="text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && rooms.length > 0
                          ? rooms.map((room, index) => (
                              <tr key={room.RoomId} className="table-row-hover">
                                <td className="fw-bold px-4">{index + 1}</td>
                                <td className="fw-semibold">
                                  {cinemas.find(
                                    (c) => c.CinemaId === room.CinemaId
                                  )?.Name || room.CinemaId}
                                </td>
                                <td>{room.Name}</td>
                                <td>{room.SeatCount}</td>
                                <td>{room.RoomType}</td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={room.Status === "Active"}
                                      onChange={() =>
                                        toggleStatus(room.RoomId, room.Status)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                  <span
                                    className={`ms-2 fw-semibold ${
                                      room.Status === "Active"
                                        ? "text-success"
                                        : room.Status === "Maintenance"
                                        ? "text-warning"
                                        : "text-danger"
                                    }`}
                                  >
                                    {room.Status === "Active"
                                      ? "Hoạt động"
                                      : room.Status === "Maintenance"
                                      ? "Bảo trì"
                                      : "Không hoạt động"}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button
                                    className="action-btn text-info"
                                    title="Chi tiết"
                                    onClick={() =>
                                      navigate(`/rooms/show/${room.RoomId}`)
                                    }
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() =>
                                      navigate(`/rooms/edit/${room.RoomId}`)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteRoom(room.RoomId, setRooms)
                                    }
                                    className="action-btn text-danger"
                                    title="Xóa"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          : [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td colSpan="7" className="py-3">
                                  <div className="skeleton w-100 h-20"></div>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}
