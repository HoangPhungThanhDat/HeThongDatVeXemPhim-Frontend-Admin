import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/SeatManagement.css";
import SeatApi from "../../api/SeatApi";
import RoomApi from "../../api/RoomApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";

export default function Seat() {
  const [seats, setSeats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedSeatType, setSelectedSeatType] = useState("Normal");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomId: "",
    startRow: "A",
    endRow: "F",
    seatsPerRow: 10,
    defaultSeatType: "Normal",
  });

  useEffect(() => {
    loadSeats();
    loadRooms();
  }, []);

  const loadSeats = async () => {
    try {
      const res = await SeatApi.getAll();
      setSeats(res.data.data || res.data);
    } catch (err) {
      console.error("Lỗi load ghế:", err);
      showToast("error", "❌ Lỗi khi tải danh sách ghế!");
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const res = await RoomApi.getAll();
      setRooms(res.data.data || res.data);
    } catch (err) {
      console.error("Lỗi load phòng:", err);
      showToast("error", "❌ Lỗi khi tải danh sách phòng!");
    }
  };

  const handleViewRoomSeats = (roomId) => {
    navigate(`/seats/show/${roomId}`);
  };

  const generatePreview = () => {
    const seats = [];
    const startCharCode = formData.startRow.charCodeAt(0);
    const endCharCode = formData.endRow.charCodeAt(0);

    for (let i = startCharCode; i <= endCharCode; i++) {
      const row = String.fromCharCode(i);
      for (let number = 1; number <= formData.seatsPerRow; number++) {
        seats.push({
          row,
          number,
          seatType: formData.defaultSeatType,
          seatName: `${row}${String(number).padStart(2, "0")}`,
        });
      }
    }
    setPreview(seats);
    showToast("info", `🎫 Đã tạo preview ${seats.length} ghế!`);
  };

  const handleSeatTypeChange = (seatName, row, number) => {
    if (selectedSeatType === "Couple") {
      const nextNumber = number + 1;
      const nextSeatName = `${row}${String(nextNumber).padStart(2, "0")}`;

      setPreview((prevSeats) =>
        prevSeats.map((seat) =>
          seat.seatName === seatName || seat.seatName === nextSeatName
            ? { ...seat, seatType: selectedSeatType }
            : seat
        )
      );
    } else {
      setPreview((prevSeats) =>
        prevSeats.map((seat) =>
          seat.seatName === seatName
            ? { ...seat, seatType: selectedSeatType }
            : seat
        )
      );
    }
  };

  const handleRowTypeChange = (row) => {
    setPreview((prevSeats) =>
      prevSeats.map((seat) =>
        seat.row === row ? { ...seat, seatType: selectedSeatType } : seat
      )
    );
    showToast("success", `✅ Đã đổi hàng ${row} thành ${selectedSeatType}`);
  };

  const resetAllSeats = () => {
    setPreview((prevSeats) =>
      prevSeats.map((seat) => ({
        ...seat,
        seatType: formData.defaultSeatType,
      }))
    );
    showToast("info", "🔄 Đã reset tất cả ghế");
  };

  const handleCreateSeats = async () => {
    if (!formData.roomId) {
      showToast("error", "❌ Vui lòng chọn phòng!");
      return;
    }

    if (preview.length === 0) {
      showToast("error", "❌ Vui lòng tạo preview trước!");
      return;
    }

    setFormLoading(true);
    setProgress({ current: 0, total: preview.length });

    try {
      const seatsData = preview.map((seat) => ({
        RoomId: formData.roomId,
        Row: seat.row,
        Number: seat.number,
        SeatType: seat.seatType,
        Status: "Available",
      }));

      const res = await SeatApi.createBulk({ seats: seatsData });
      const createdSeats = res.data.data || res.data;

      setSeats([...seats, ...createdSeats]);
      await loadRooms();

      setFormData({
        roomId: "",
        startRow: "A",
        endRow: "F",
        seatsPerRow: 10,
        defaultSeatType: "Normal",
      });
      setPreview([]);
      setShowForm(false);

      showToast("success", `🎉 Tạo thành công ${preview.length} ghế!`);
    } catch (error) {
      console.error("Lỗi khi tạo ghế:", error);
      showToast("error", "❌ Tạo ghế thất bại!");
    } finally {
      setFormLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteAllSeatsInRoom = async (roomId) => {
    const result = await Swal.fire({
      title: "XÓA TOÀN BỘ GHẾ?",
      html: `
        <b style="color:red">⚠ Hành động này không thể hoàn tác!</b><br/>
        Toàn bộ ghế trong phòng sẽ bị xóa.
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa tất cả",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await SeatApi.deleteByRoom(roomId);

      setSeats((prev) => prev.filter((s) => s.RoomId !== roomId));
      await loadRooms();

      showToast("success", "🗑️ Đã xóa toàn bộ ghế trong phòng!");
    } catch (error) {
      console.error("Lỗi khi xóa ghế:", error);
      showToast("error", "❌ Xóa ghế thất bại!");
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

  if (loading) return <Loader />;

  return (
    <div>
      <MainLayout>
        <main className="seat-management-page">
          <div className="main-container">
            <div className="pd-ltr-20">
              
              {/* Cinematic Particles Background */}
              <div className="cinema-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>

              {/* Hero Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="seat-hero-header"
              >
                <div className="seat-hero-backdrop"></div>
                <div className="seat-hero-content">
                  <div className="seat-hero-text">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                      className="seat-hero-icon-wrapper"
                    >
                      <i className="fas fa-crown"></i>
                      <div className="icon-glow"></div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <h1 className="seat-hero-title">
                        <span className="title-line">LUXURY</span>
                        <span className="title-line gold-text">SEAT MANAGEMENT</span>
                      </h1>
                      <p className="seat-hero-subtitle">
                        <span className="subtitle-icon">✦</span>
                        Thiết kế sơ đồ ghế đẳng cấp cho rạp chiếu phim
                        <span className="subtitle-icon">✦</span>
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="seat-hero-actions"
                  >
                    <button
                      className="seat-hero-btn seat-hero-btn-primary"
                      onClick={() => setShowForm(!showForm)}
                    >
                      <span className="btn-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span className="btn-text">Tạo sơ đồ mới</span>
                      <span className="btn-shine"></span>
                    </button>
                    <button className="seat-hero-btn seat-hero-btn-secondary">
                      <span className="btn-icon">
                        <i className="fas fa-archive"></i>
                      </span>
                      <span className="btn-text">Lưu trữ</span>
                    </button>
                  </motion.div>
                </div>
                <div className="seat-hero-light-beam"></div>
              </motion.div>

              {/* Form Section */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                    className="seat-form-card"
                  >
                    <div className="seat-form-header">
                      <div className="form-header-glow"></div>
                      <div className="seat-form-header-content">
                        <div className="seat-form-icon">
                          <i className="fas fa-film"></i>
                          <div className="icon-pulse"></div>
                        </div>
                        <div>
                          <h2 className="seat-form-title">THIẾT KẾ SƠ ĐỒ GHẾ</h2>
                          <p className="seat-form-description">
                            Tạo và tùy chỉnh sơ đồ ghế đẳng cấp
                          </p>
                        </div>
                      </div>
                      <button
                        className="seat-form-close"
                        onClick={() => {
                          setShowForm(false);
                          setPreview([]);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleCreateSeats(); }}>
                      <div className="seat-form-body">
                        {/* Configuration Grid */}
                        <div className="seat-config-grid">
                          {/* Room Selection */}
                          <div className="seat-form-group">
                            <label className="seat-form-label">
                              <i className="fas fa-door-open"></i>
                              <span>Phòng chiếu</span>
                            </label>
                            <div className="seat-form-input-wrapper">
                              <select
                                className="seat-form-select"
                                value={formData.roomId}
                                onChange={(e) =>
                                  setFormData({ ...formData, roomId: e.target.value })
                                }
                                required
                              >
                                <option value="">Chọn phòng chiếu</option>
                                {rooms.map((room) => (
                                  <option key={room.RoomId} value={room.RoomId}>
                                    {room.Name} • {room.SeatCount || 0} ghế
                                  </option>
                                ))}
                              </select>
                              <i className="fas fa-chevron-down seat-form-select-icon"></i>
                            </div>
                          </div>

                          {/* Start Row */}
                          <div className="seat-form-group">
                            <label className="seat-form-label">
                              <i className="fas fa-arrow-down"></i>
                              <span>Hàng đầu</span>
                            </label>
                            <input
                              type="text"
                              className="seat-form-input"
                              placeholder="A"
                              maxLength="1"
                              value={formData.startRow}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  startRow: e.target.value.toUpperCase(),
                                })
                              }
                              required
                            />
                          </div>

                          {/* End Row */}
                          <div className="seat-form-group">
                            <label className="seat-form-label">
                              <i className="fas fa-arrow-up"></i>
                              <span>Hàng cuối</span>
                            </label>
                            <input
                              type="text"
                              className="seat-form-input"
                              placeholder="F"
                              maxLength="1"
                              value={formData.endRow}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  endRow: e.target.value.toUpperCase(),
                                })
                              }
                              required
                            />
                          </div>

                          {/* Seats Per Row */}
                          <div className="seat-form-group">
                            <label className="seat-form-label">
                              <i className="fas fa-grip-horizontal"></i>
                              <span>Ghế mỗi hàng</span>
                            </label>
                            <input
                              type="number"
                              className="seat-form-input"
                              placeholder="10"
                              min="1"
                              max="20"
                              value={formData.seatsPerRow}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  seatsPerRow: parseInt(e.target.value),
                                })
                              }
                              required
                            />
                          </div>

                          {/* Default Seat Type */}
                          <div className="seat-form-group seat-form-group-full">
                            <label className="seat-form-label">
                              <i className="fas fa-couch"></i>
                              <span>Loại ghế mặc định</span>
                            </label>
                            <div className="seat-form-input-wrapper">
                              <select
                                className="seat-form-select"
                                value={formData.defaultSeatType}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    defaultSeatType: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="Normal">Ghế thường</option>
                                <option value="VIP">Ghế VIP</option>
                                <option value="Couple">Ghế đôi</option>
                              </select>
                              <i className="fas fa-chevron-down seat-form-select-icon"></i>
                            </div>
                          </div>
                        </div>

                        {/* Info Alert */}
                        <div className="seat-form-info-box">
                          <i className="fas fa-lightbulb seat-form-info-icon"></i>
                          <div className="seat-form-info-text">
                            <span className="seat-form-info-title">✦ Hướng dẫn sử dụng</span>
                            Click vào ghế để thay đổi loại hoặc click vào nhãn hàng để đổi cả hàng
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="seat-form-actions">
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={generatePreview}
                            className="seat-btn-preview"
                          >
                            <i className="fas fa-eye"></i>
                            <span>Xem trước</span>
                            <div className="btn-glow"></div>
                          </motion.button>

                          {preview.length > 0 && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={resetAllSeats}
                                className="seat-btn-reset"
                              >
                                <i className="fas fa-redo"></i>
                                <span>Đặt lại</span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={formLoading}
                                className="seat-btn-create"
                              >
                                <i className="fas fa-check-circle"></i>
                                <span>
                                  {formLoading
                                    ? `Đang tạo... ${progress.current}/${progress.total}`
                                    : `Tạo ${preview.length} ghế`}
                                </span>
                                <div className="btn-glow"></div>
                              </motion.button>
                            </>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            className="seat-btn-cancel"
                            onClick={() => {
                              setShowForm(false);
                              setPreview([]);
                            }}
                          >
                            <i className="fas fa-times-circle"></i>
                            <span>Hủy bỏ</span>
                          </motion.button>
                        </div>

                        {/* Progress Bar */}
                        {formLoading && progress.total > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="seat-progress-container"
                          >
                            <div className="seat-progress-bar">
                              <motion.div
                                className="seat-progress-fill"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(progress.current / progress.total) * 100}%`,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="progress-shine"></div>
                              </motion.div>
                            </div>
                            <div className="seat-progress-text">
                              {progress.current} / {progress.total} ghế đã tạo
                            </div>
                          </motion.div>
                        )}

                        {/* Preview Section */}
                        {preview.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="seat-preview-section"
                          >
                            <div className="seat-preview-header">
                              <h3 className="seat-preview-title">
                                <i className="fas fa-eye"></i>
                                <span>XEM TRƯỚC SƠ ĐỒ</span>
                              </h3>
                              <div className="seat-preview-count">
                                <span className="count-number">{preview.length}</span>
                                <span className="count-label">ghế</span>
                              </div>
                            </div>

                            {/* Seat Type Selector */}
                            <div className="seat-type-selector">
                              <div className="seat-type-selector-title">
                                <i className="fas fa-palette"></i>
                                <span>Chọn loại ghế để tô màu</span>
                              </div>
                              <div className="seat-type-buttons">
                                <button
                                  type="button"
                                  className={`seat-type-btn seat-type-btn-normal ${
                                    selectedSeatType === "Normal" ? "active" : ""
                                  }`}
                                  onClick={() => setSelectedSeatType("Normal")}
                                >
                                  <i className="fas fa-chair"></i>
                                  <span>Thường</span>
                                </button>
                                <button
                                  type="button"
                                  className={`seat-type-btn seat-type-btn-vip ${
                                    selectedSeatType === "VIP" ? "active" : ""
                                  }`}
                                  onClick={() => setSelectedSeatType("VIP")}
                                >
                                  <i className="fas fa-crown"></i>
                                  <span>VIP</span>
                                </button>
                                <button
                                  type="button"
                                  className={`seat-type-btn seat-type-btn-couple ${
                                    selectedSeatType === "Couple" ? "active" : ""
                                  }`}
                                  onClick={() => setSelectedSeatType("Couple")}
                                >
                                  <i className="fas fa-heart"></i>
                                  <span>Couple</span>
                                </button>
                              </div>
                              <small className="seat-type-hint">
                                Đang chọn: <strong className="gold-text">{selectedSeatType}</strong>
                              </small>
                            </div>

                            {/* Cinema Screen */}
                            <div className="cinema-screen">
                              <div className="screen-glow"></div>
                              <div className="cinema-screen-inner">
                                <div className="cinema-screen-label">
                                  <span className="screen-icon">◆</span>
                                  MÀN HÌNH
                                  <span className="screen-icon">◆</span>
                                </div>
                              </div>
                            </div>

                            {/* Seats Grid */}
                            <div className="seat-preview-container">
                              {Array.from(new Set(preview.map((s) => s.row))).map((row, rowIndex) => (
                                <motion.div
                                  key={row}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: rowIndex * 0.05 }}
                                  className="seat-row-container"
                                >
                                  <div
                                    className="seat-row-label"
                                    onClick={() => handleRowTypeChange(row)}
                                    title={`Click để đổi cả hàng ${row}`}
                                  >
                                    <span className="row-letter">{row}</span>
                                    <div className="row-label-glow"></div>
                                  </div>
                                  <div className="seat-grid">
                                    {preview
                                      .filter((s) => s.row === row)
                                      .map((seat, seatIndex) => (
                                        <motion.div
                                          key={seat.seatName}
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: rowIndex * 0.05 + seatIndex * 0.01 }}
                                          className="seat-item"
                                          onClick={() =>
                                            handleSeatTypeChange(
                                              seat.seatName,
                                              seat.row,
                                              seat.number
                                            )
                                          }
                                          title={`${seat.seatName} - ${seat.seatType}`}
                                        >
                                          <div
                                            className={`seat-back seat-back-${seat.seatType.toLowerCase()}`}
                                          >
                                            <div className="seat-shine"></div>
                                          </div>
                                          <div
                                            className={`seat-armrest seat-armrest-left seat-armrest-${seat.seatType.toLowerCase()}`}
                                          ></div>
                                          <div
                                            className={`seat-armrest seat-armrest-right seat-armrest-${seat.seatType.toLowerCase()}`}
                                          ></div>
                                          <div
                                            className={`seat-cushion seat-cushion-${seat.seatType.toLowerCase()}`}
                                          >
                                            <span className="seat-number">{seat.number}</span>
                                            <div className="cushion-shine"></div>
                                          </div>
                                        </motion.div>
                                      ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Legend */}
                            <div className="seat-legend">
                              <div className="seat-legend-item">
                                <div className="seat-legend-color seat-legend-color-normal">
                                  <div className="legend-shine"></div>
                                </div>
                                <span className="seat-legend-text">Ghế thường</span>
                              </div>
                              <div className="seat-legend-item">
                                <div className="seat-legend-color seat-legend-color-vip">
                                  <div className="legend-shine"></div>
                                </div>
                                <span className="seat-legend-text">Ghế VIP</span>
                              </div>
                              <div className="seat-legend-item">
                                <div className="seat-legend-color seat-legend-color-couple">
                                  <div className="legend-shine"></div>
                                </div>
                                <span className="seat-legend-text">Ghế đôi</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rooms Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="rooms-grid-section"
              >
                <div className="rooms-grid-header">
                  <h2 className="rooms-grid-title">
                    <i className="fas fa-theater-masks"></i>
                    <span>DANH SÁCH PHÒNG CHIẾU</span>
                  </h2>
                  <div className="rooms-grid-count">
                    <span className="count-number">{rooms.length}</span>
                    <span className="count-label">phòng</span>
                  </div>
                </div>

                <div className="rooms-grid">
                  {rooms.map((room, index) => {
                    const roomSeatCount = seats.filter((s) => s.RoomId === room.RoomId).length;
                    const vipCount = seats.filter(
                      (s) => s.RoomId === room.RoomId && s.SeatType === "VIP"
                    ).length;
                    const coupleCount = seats.filter(
                      (s) => s.RoomId === room.RoomId && s.SeatType === "Couple"
                    ).length;
                    const normalCount = seats.filter(
                      (s) => s.RoomId === room.RoomId && s.SeatType === "Normal"
                    ).length;

                    return (
                      <motion.div
                        key={room.RoomId}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="room-card"
                      >
                        <div className="room-card-glow"></div>
                        <div className="room-card-header">
                          <div className="room-card-title-section">
                            <h3 className="room-card-title">{room.Name}</h3>
                            <span className="room-type-badge">
                              <i className="fas fa-star"></i>
                              {room.RoomType}
                            </span>
                          </div>
                          <span
                            className={`room-status-badge room-status-badge-${
                              room.Status === "Active" ? "active" : "inactive"
                            }`}
                          >
                            <span className="status-dot"></span>
                            {room.Status === "Active" ? "HOẠT ĐỘNG" : "TẠM DỪNG"}
                          </span>
                        </div>

                        <div className="room-card-body">
                          <div className="room-total-seats">
                            <div className="total-seats-icon">
                              <i className="fas fa-ticket-alt"></i>
                            </div>
                            <div className="total-seats-info">
                              <div className="room-total-seats-number">{roomSeatCount}</div>
                              <div className="room-total-seats-text">Tổng số ghế</div>
                            </div>
                            <div className="total-seats-decoration"></div>
                          </div>

                          <div className="room-stats-grid">
                            <div className="room-stat-box room-stat-normal">
                              <i className="fas fa-chair room-stat-icon"></i>
                              <div className="room-stat-count">{normalCount}</div>
                              <div className="room-stat-label">Thường</div>
                              <div className="stat-glow"></div>
                            </div>
                            <div className="room-stat-box room-stat-vip">
                              <i className="fas fa-gem room-stat-icon"></i>
                              <div className="room-stat-count">{vipCount}</div>
                              <div className="room-stat-label">VIP</div>
                              <div className="stat-glow"></div>
                            </div>
                            <div className="room-stat-box room-stat-couple">
                              <i className="fas fa-heart room-stat-icon"></i>
                              <div className="room-stat-count">{coupleCount}</div>
                              <div className="room-stat-label">Đôi</div>
                              <div className="stat-glow"></div>
                            </div>
                          </div>
                        </div>

                        <div className="room-card-footer">
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="room-btn room-btn-view"
                            onClick={() => handleViewRoomSeats(room.RoomId)}
                          >
                            <i className="fas fa-eye"></i>
                            <span>Chi tiết</span>
                            <div className="btn-ripple"></div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="room-btn room-btn-edit"
                            onClick={() => navigate(`/seats/edit/${room.RoomId}`)}
                          >
                            <i className="fas fa-edit"></i>
                            <span>Chỉnh sửa</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="room-btn room-btn-delete"
                            onClick={() => handleDeleteAllSeatsInRoom(room.RoomId)}
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span>Xóa</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}