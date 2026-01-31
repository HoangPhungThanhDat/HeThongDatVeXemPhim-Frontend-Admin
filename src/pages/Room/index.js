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
    RoomType: "",
    Status: "Active",
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
      const roomData = {
        ...newRoom,
        TotalSeats: 0,
      };

      const res = await RoomApi.create(roomData);
      const createdRoom = res.data.data || res.data;

      setRooms([...rooms, createdRoom]);
      setNewRoom({
        CinemaId: "",
        Name: "",
        RoomType: "",
        Status: "Active",
      });
      setShowForm(false);

      showToast("success", "🎉 Thêm phòng chiếu thành công! Hãy tạo ghế cho phòng này.");
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
                  <i className="fas fa-door-open me-2"></i> Quản lý phòng chiếu
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
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card border-0 shadow-lg rounded-4 mb-4 form-add-user"
                  >
                    <div className="card-body p-4">
                      <h4 className="fw-bold mb-4 text-primary d-flex align-items-center">
                        <i className="fas fa-door-open me-2"></i> Thêm phòng chiếu mới
                      </h4>

                      <form onSubmit={handleAddRoom}>
                        <div className="row g-4">
                          {/* Chọn rạp */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-building me-2 text-primary"></i>
                              Chọn rạp
                            </label>
                            <select
                              className="form-select custom-input"
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
                                  {c.Name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Tên phòng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-door-closed me-2 text-success"></i>
                              Tên phòng chiếu
                            </label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              placeholder="VD: Phòng 1, Phòng VIP"
                              value={newRoom.Name}
                              onChange={(e) =>
                                setNewRoom({ ...newRoom, Name: e.target.value })
                              }
                              required
                            />
                          </div>

                          {/* Loại phòng */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-film me-2 text-danger"></i>
                              Loại phòng
                            </label>
                            <select
                              className="form-select custom-input"
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
                              <option value="2D">2D Standard</option>
                              <option value="3D">3D</option>
                              <option value="4DX">4DX</option>
                              <option value="IMAX">IMAX</option>
                            </select>
                          </div>

                          {/* Trạng thái */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="fas fa-toggle-on me-2 text-warning"></i>
                              Trạng thái
                            </label>
                            <select
                              className="form-select custom-input"
                              value={newRoom.Status}
                              onChange={(e) =>
                                setNewRoom({
                                  ...newRoom,
                                  Status: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="Active">Hoạt động</option>
                              <option value="Inactive">Không hoạt động</option>
                              <option value="Maintenance">Bảo trì</option>
                            </select>
                          </div>

                          {/* Thông báo */}
                          <div className="col-12">
                            <div
                              style={{
                                padding: "16px",
                                background: "rgba(59, 130, 246, 0.1)",
                                border: "2px solid rgba(59, 130, 246, 0.3)",
                                borderRadius: "12px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                <i
                                  className="fas fa-info-circle"
                                  style={{ color: "#3b82f6", fontSize: "20px", marginTop: "2px" }}
                                ></i>
                                <div style={{ fontSize: "14px", color: "#64748b" }}>
                                  <strong style={{ color: "#1e293b", display: "block", marginBottom: "4px" }}>
                                    💡 Lưu ý về số ghế
                                  </strong>
                                  Số ghế sẽ được tính tự động sau khi bạn tạo ghế cho phòng này. 
                                  Sau khi tạo phòng, hãy vào phần "Quản lý ghế" để tạo ghế hàng loạt.
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Summary Box */}
                          {newRoom.CinemaId && newRoom.Name && newRoom.RoomType && (
                            <div className="col-12">
                              <div
                                style={{
                                  padding: "20px",
                                  background: "rgba(247, 147, 30, 0.08)",
                                  border: "2px solid rgba(247, 147, 30, 0.3)",
                                  borderRadius: "12px",
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
                                    className="fas fa-clipboard-check"
                                    style={{ color: "#f7931e", fontSize: "20px" }}
                                  ></i>
                                  <h5 style={{ margin: 0, color: "#1e293b", fontWeight: 700, fontSize: "16px" }}>
                                    Thông tin phòng chiếu
                                  </h5>
                                </div>
                                <div style={{ fontSize: "14px", lineHeight: 1.8, color: "#64748b" }}>
                                  <p style={{ margin: "8px 0" }}>
                                    <i className="fas fa-building" style={{ color: "#f7931e", marginRight: "8px", width: "20px" }}></i>
                                    Rạp:{" "}
                                    <strong style={{ color: "#1e293b" }}>
                                      {cinemas.find((c) => c.CinemaId === newRoom.CinemaId)?.Name}
                                    </strong>
                                  </p>
                                  <p style={{ margin: "8px 0" }}>
                                    <i className="fas fa-door-closed" style={{ color: "#f7931e", marginRight: "8px", width: "20px" }}></i>
                                    Tên phòng:{" "}
                                    <strong style={{ color: "#1e293b" }}>{newRoom.Name}</strong>
                                  </p>
                                  <p style={{ margin: "8px 0" }}>
                                    <i className="fas fa-film" style={{ color: "#f7931e", marginRight: "8px", width: "20px" }}></i>
                                    Loại phòng:{" "}
                                    <strong style={{ color: "#3b82f6" }}>
                                      {newRoom.RoomType === "2D"
                                        ? "2D Standard"
                                        : newRoom.RoomType === "3D"
                                        ? "3D"
                                        : newRoom.RoomType === "4DX"
                                        ? "4DX"
                                        : "IMAX"}
                                    </strong>
                                  </p>
                                  <p style={{ margin: "8px 0" }}>
                                    <i className="fas fa-chair" style={{ color: "#f7931e", marginRight: "8px", width: "20px" }}></i>
                                    Số ghế:{" "}
                                    <strong style={{ color: "#fbbf24" }}>
                                      Chưa có (sẽ tính tự động)
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Nút hành động */}
                        <div className="col-12 text-end mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn btn-gradient-success me-2 rounded-pill px-4"
                          >
                            <i className="fas fa-save me-1"></i> Lưu
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="btn btn-gradient-secondary rounded-pill px-4"
                            onClick={() => setShowForm(false)}
                          >
                            <i className="fas fa-times me-1"></i> Hủy
                          </motion.button>
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
                          <th className="px-4">ID</th>
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
                                  {cinemas.find((c) => c.CinemaId === room.CinemaId)?.Name ||
                                    room.CinemaId}
                                </td>
                                <td>{room.Name}</td>
                                <td>
                                  <span className={`badge ${room.TotalSeats > 0 ? 'bg-success' : 'bg-warning'}`}>
                                    {room.TotalSeats || 0} ghế
                                  </span>
                                </td>
                                <td>{room.RoomType}</td>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={room.Status === "Active"}
                                      onChange={() => toggleStatus(room.RoomId, room.Status)}
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
                                    onClick={() => navigate(`/rooms/show/${room.RoomId}`)}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="action-btn text-primary"
                                    title="Sửa"
                                    onClick={() => navigate(`/rooms/edit/${room.RoomId}`)}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => deleteRoom(room.RoomId, setRooms)}
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