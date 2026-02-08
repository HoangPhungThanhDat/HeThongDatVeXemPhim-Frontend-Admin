import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import SeatApi from "../../api/SeatApi";
import RoomApi from "../../api/RoomApi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import Loader from "../../layouts/Loader";

export default function SeatEdit() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState("Normal");
  const [showAddForm, setShowAddForm] = useState(false);
  const [preview, setPreview] = useState([]);

  const [addFormData, setAddFormData] = useState({
    startRow: "",
    endRow: "",
    seatsPerRow: 1,
    defaultSeatType: "Normal",
  });

  useEffect(() => {
    loadRoomData();
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      const roomRes = await RoomApi.getById(roomId);
      const seatsRes = await SeatApi.getAll();

      const roomData = roomRes.data.data || roomRes.data;
      const allSeats = seatsRes.data.data || seatsRes.data;
      const seatsInRoom = allSeats.filter((s) => s.RoomId === parseInt(roomId));

      setRoom(roomData);
      setRoomSeats(seatsInRoom);
    } catch (err) {
      console.error("Lỗi load dữ liệu:", err);
      showToast("error", "❌ Lỗi khi tải dữ liệu phòng!");
    } finally {
      setLoading(false);
    }
  };

const handleChangeSeatType = async (seat) => {
  // ===== CASE 1: KHÔNG PHẢI COUPLE =====
  if (selectedSeatType !== "Couple") {
    if (seat.SeatType === selectedSeatType) return;

    const payload = {
      RoomId: seat.RoomId,
      Row: seat.Row,
      Number: seat.Number,
      SeatType: selectedSeatType,
      Status: seat.Status || "Available",
    };

    try {
      await SeatApi.update(seat.SeatId, payload);

      setRoomSeats((prev) =>
        prev.map((s) =>
          s.SeatId === seat.SeatId
            ? { ...s, SeatType: selectedSeatType }
            : s
        )
      );

     
    } catch (err) {
      showToast("error", "❌ Cập nhật ghế thất bại!");
    }

    return;
  }

  // ===== CASE 2: COUPLE (PHẢI 2 GHẾ) =====
  const nextSeat = roomSeats.find(
    (s) =>
      s.Row === seat.Row &&
      s.Number === seat.Number + 1
  );

  if (!nextSeat) {
    showToast("error", "❌ Ghế đôi phải gồm 2 ghế liền kề!");
    return;
  }

  // Không cho nếu ghế kế bên đã có trạng thái đặc biệt
  if (nextSeat.Status !== "Available") {
    showToast("error", "❌ Ghế bên cạnh không khả dụng!");
    return;
  }

  try {
    const payload1 = {
      RoomId: seat.RoomId,
      Row: seat.Row,
      Number: seat.Number,
      SeatType: "Couple",
      Status: seat.Status || "Available",
    };

    const payload2 = {
      RoomId: nextSeat.RoomId,
      Row: nextSeat.Row,
      Number: nextSeat.Number,
      SeatType: "Couple",
      Status: nextSeat.Status || "Available",
    };

    await Promise.all([
      SeatApi.update(seat.SeatId, payload1),
      SeatApi.update(nextSeat.SeatId, payload2),
    ]);

    setRoomSeats((prev) =>
      prev.map((s) =>
        s.SeatId === seat.SeatId || s.SeatId === nextSeat.SeatId
          ? { ...s, SeatType: "Couple" }
          : s
      )
    );

  
  } catch (error) {
    console.error(error);
    showToast("error", "❌ Tạo ghế đôi thất bại!");
  }
};



  // Tạo preview cho ghế mới
  const generatePreview = () => {
    const seats = [];
    const startCharCode = addFormData.startRow.charCodeAt(0);
    const endCharCode = addFormData.endRow.charCodeAt(0);

    for (let i = startCharCode; i <= endCharCode; i++) {
      const row = String.fromCharCode(i);
      for (let number = 1; number <= addFormData.seatsPerRow; number++) {
        // Kiểm tra xem ghế đã tồn tại chưa
        const existingSeat = roomSeats.find(
          (s) => s.Row === row && s.Number === number
        );
        
        if (!existingSeat) {
          seats.push({
            row,
            number,
            seatType: addFormData.defaultSeatType,
            seatName: `${row}${String(number).padStart(2, "0")}`,
          });
        }
      }
    }
    
    if (seats.length === 0) {
      showToast("warning", "⚠️ Tất cả ghế trong khoảng này đã tồn tại!");
      return;
    }
    
    setPreview(seats);
    showToast("info", `🎫 Đã tạo preview ${seats.length} ghế mới!`);
  };

  // Thay đổi loại ghế trong preview
  const handlePreviewSeatTypeChange = (seatName, row, number) => {
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

  // Thay đổi loại ghế cho cả hàng trong preview
  const handlePreviewRowTypeChange = (row) => {
    setPreview((prevSeats) =>
      prevSeats.map((seat) =>
        seat.row === row ? { ...seat, seatType: selectedSeatType } : seat
      )
    );
    showToast("success", `✅ Đã đổi hàng ${row} thành ${selectedSeatType}`);
  };

  // Reset preview
  const resetPreview = () => {
    setPreview((prevSeats) =>
      prevSeats.map((seat) => ({
        ...seat,
        seatType: addFormData.defaultSeatType,
      }))
    );
    showToast("info", "🔄 Đã reset preview");
  };

  // Thêm ghế mới
  const handleAddSeats = async () => {
    if (preview.length === 0) {
      showToast("error", "❌ Vui lòng tạo preview trước!");
      return;
    }

    setFormLoading(true);

    try {
      const seatsData = preview.map((seat) => ({
        RoomId: parseInt(roomId),
        Row: seat.row,
        Number: seat.number,
        SeatType: seat.seatType,
        Status: "Available",
      }));

      const res = await SeatApi.createBulk({ seats: seatsData });
      const createdSeats = res.data.data || res.data;

      setRoomSeats([...roomSeats, ...createdSeats]);
      setPreview([]);
      setShowAddForm(false);
      setAddFormData({
        startRow: "",
        endRow: "",
        seatsPerRow: 1,
        defaultSeatType: "Normal",
      });

      showToast("success", `🎉 Đã thêm ${preview.length} ghế mới!`);
    } catch (error) {
      console.error("Lỗi khi thêm ghế:", error);
      showToast("error", "❌ Thêm ghế thất bại!");
    } finally {
      setFormLoading(false);
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

  if (!room) {
    return (
      <MainLayout>
        <div className="text-center py-5">
          <p>Không tìm thấy phòng</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/seats")}
          >
            Quay lại
          </button>
        </div>
      </MainLayout>
    );
  }

  // Nhóm ghế theo hàng
  const seatsByRow = {};
  roomSeats.forEach((seat) => {
    if (!seatsByRow[seat.Row]) {
      seatsByRow[seat.Row] = [];
    }
    seatsByRow[seat.Row].push(seat);
  });

  Object.keys(seatsByRow).forEach((row) => {
    seatsByRow[row].sort((a, b) => a.Number - b.Number);
  });

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div>
      <MainLayout>
      <main className="seat-management-page">
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <button
                    className="btn btn-light me-3"
                    onClick={() => navigate("/seats")}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <i className="fas fa-edit me-2"></i>
                  Chỉnh sửa ghế - {room.Name}
                </h3>
                <button
                  className="btn btn-light shadow-sm rounded-pill px-3 fw-semibold"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <i className="fas fa-plus me-1 text-success"></i>
                  {showAddForm ? "Đóng" : "Thêm ghế mới"}
                </button>
              </div>

              {/* Form thêm ghế */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="cinema-add-form mb-4"
                  >
                    <div className="cinema-form-header">
                      <div className="cinema-form-title">
                        <div className="cinema-form-icon">
                          <i className="fas fa-chair"></i>
                        </div>
                        <div className="cinema-form-title-text">
                          <h4>Thêm ghế mới</h4>
                          <p className="cinema-form-subtitle">
                            Tạo thêm ghế cho phòng {room.Name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="cinema-form-body">
                      <div className="cinema-form-grid">
                        <div className="cinema-form-group">
                          <label className="cinema-form-label">
                            <i className="fas fa-align-left"></i>
                            Hàng bắt đầu
                          </label>
                          <input
                            type="text"
                            className="cinema-input"
                            placeholder="A"
                            maxLength="1"
                            value={addFormData.startRow}
                            onChange={(e) =>
                              setAddFormData({
                                ...addFormData,
                                startRow: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </div>

                        <div className="cinema-form-group">
                          <label className="cinema-form-label">
                            <i className="fas fa-align-right"></i>
                            Hàng kết thúc
                          </label>
                          <input
                            type="text"
                            className="cinema-input"
                            placeholder="F"
                            maxLength="1"
                            value={addFormData.endRow}
                            onChange={(e) =>
                              setAddFormData({
                                ...addFormData,
                                endRow: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </div>

                        <div className="cinema-form-group">
                          <label className="cinema-form-label">
                            <i className="fas fa-hashtag"></i>
                            Số ghế mỗi hàng
                          </label>
                          <input
                            type="number"
                            className="cinema-input"
                            placeholder="10"
                            min="1"
                            max="20"
                            value={addFormData.seatsPerRow}
                            onChange={(e) =>
                              setAddFormData({
                                ...addFormData,
                                seatsPerRow: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div className="cinema-form-group">
                          <label className="cinema-form-label">
                            <i className="fas fa-couch"></i>
                            Loại ghế mặc định
                          </label>
                          <select
                            className="cinema-select"
                            value={addFormData.defaultSeatType}
                            onChange={(e) =>
                              setAddFormData({
                                ...addFormData,
                                defaultSeatType: e.target.value,
                              })
                            }
                          >
                            <option value="Normal">Normal</option>
                            <option value="VIP">VIP</option>
                            <option value="Couple">Couple</option>
                          </select>
                        </div>
                      </div>

                  {/* Action buttons */}
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                          type="button"
                          onClick={generatePreview}
                          disabled={formLoading}
                          className="seat-btn-preview"
                        >
                          <i className="fas fa-eye me-2"></i> Tạo Preview
                        </button>

                        {preview.length > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={resetPreview}
                              disabled={formLoading}
                              className="seat-btn-reset"
                            >
                              <i className="fas fa-undo me-2"></i> Reset
                            </button>

                            <button
                              type="button"
                              onClick={handleAddSeats}
                              disabled={formLoading}
                              className="seat-btn-create"
                            >
                              <i className="fas fa-save me-2"></i>
                              {formLoading ? "Đang thêm..." : `Thêm ${preview.length} ghế`}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Preview ghế mới */}
                      {preview.length > 0 && (
                        <div className="border rounded p-4 mt-4 bg-light">
                          {/* Toolbar */}
                          <div className="seat-type-selector">
                            <h6 className="seat-type-selector-title">
                              <i className="fas fa-paint-brush"></i>
                              Chọn loại ghế để tô màu:
                            </h6>
                            <div className="seat-type-buttons">
                              <button
                                className={`seat-type-btn seat-type-btn-normal ${selectedSeatType === "Normal" ? "active" : ""}`}
                                onClick={() => setSelectedSeatType("Normal")}
                              >
                                <i className="fas fa-chair me-1"></i> Normal
                              </button>
                              <button
                                className={`seat-type-btn seat-type-btn-vip ${selectedSeatType === "VIP" ? "active" : ""}`}
                                onClick={() => setSelectedSeatType("VIP")}
                              >
                                <i className="fas fa-crown me-1"></i> VIP
                              </button>
                              <button
                                className={`seat-type-btn seat-type-btn-couple ${selectedSeatType === "Couple" ? "active" : ""}`}
                                onClick={() => setSelectedSeatType("Couple")}
                              >
                                <i className="fas fa-heart me-1"></i> Couple
                              </button>
                            </div>
                          </div>

                          {/* Grid ghế preview */}
                          <h5 className="fw-bold mb-3">
                            <i className="fas fa-ticket-alt me-2"></i>
                            Preview ghế mới ({preview.length} ghế):
                          </h5>
                          <div className="seat-preview-container">
                            {Array.from(new Set(preview.map((s) => s.row))).map((row) => (
                              <div key={row} className="seat-row-container">
                                <span
                                  className="seat-row-label"
                                  onClick={() => handlePreviewRowTypeChange(row)}
                                  title={`Click để đổi cả hàng ${row}`}
                                >
                                  {row}
                                </span>
                                <div className="seat-grid">
                                  {preview.filter((s) => s.row === row).map((seat) => {
                                    const seatTypeClass = seat.seatType.toLowerCase();
                                    return (
                                      <div
                                        key={seat.seatName}
                                        className="seat-item"
                                        onClick={() =>
                                          handlePreviewSeatTypeChange(
                                            seat.seatName,
                                            seat.row,
                                            seat.number
                                          )
                                        }
                                        title={seat.seatName}
                                      >
                                        <div className={`seat-back seat-back-${seatTypeClass}`} />
                                        <div className={`seat-armrest seat-armrest-left seat-armrest-${seatTypeClass}`} />
                                        <div className={`seat-armrest seat-armrest-right seat-armrest-${seatTypeClass}`} />
                                        <div className={`seat-cushion seat-cushion-${seatTypeClass}`}>
                                          {seat.seatName}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Layout ghế hiện tại */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {roomSeats.length > 0 ? (
                    <div className="seat-current-section">
                      {/* Toolbar chọn loại ghế */}
                      <div className="seat-type-selector">
                        <h6 className="seat-type-selector-title">
                          <i className="fas fa-paint-brush"></i>
                          Chọn loại ghế để tô màu:
                        </h6>
                        <div className="seat-type-buttons">
                          <button
                            className={`seat-type-btn seat-type-btn-normal ${selectedSeatType === "Normal" ? "active" : ""}`}
                            onClick={() => setSelectedSeatType("Normal")}
                          >
                            <i className="fas fa-chair me-1"></i> Normal
                          </button>
                          <button
                            className={`seat-type-btn seat-type-btn-vip ${selectedSeatType === "VIP" ? "active" : ""}`}
                            onClick={() => setSelectedSeatType("VIP")}
                          >
                            <i className="fas fa-crown me-1"></i> VIP
                          </button>
                          <button
                            className={`seat-type-btn seat-type-btn-couple ${selectedSeatType === "Couple" ? "active" : ""}`}
                            onClick={() => setSelectedSeatType("Couple")}
                          >
                            <i className="fas fa-heart me-1"></i> Couple
                          </button>
                        </div>
                        <small className="seat-type-hint">
                          <i className="fas fa-mouse-pointer me-1"></i>
                          Click vào ghế để thay đổi loại. Click phải để xóa ghế.
                        </small>
                      </div>

                      {/* Tiêu đề */}
                      <h5 className="seat-current-title mt-3">
                        <i className="fas fa-ticket-alt me-2"></i>
                        Ghế hiện tại ({roomSeats.length} ghế):
                      </h5>

                      {/* Grid ghế */}
                      <div className="seat-preview-container">
                        {rows.map((row) => (
                          <div key={row} className="seat-row-container">
                            <span className="seat-row-label">{row}</span>

                            <div className="seat-grid">
                              {seatsByRow[row].map((seat) => {
                                const seatTypeClass = seat.SeatType.toLowerCase();
                                const isUnavailable = seat.Status !== "Available";
                                return (
                                  <div
                                    key={seat.SeatId}
                                    className="seat-item seat-item-editable"
                                    style={{ opacity: isUnavailable ? 0.5 : 1 }}
                                    title={`${seat.Row}${String(seat.Number).padStart(2, "0")} - ${seat.SeatType}`}
                                    onClick={() => handleChangeSeatType(seat)}
                                  >
                                    <div className={`seat-back seat-back-${seatTypeClass}`} />
                                    <div className={`seat-armrest seat-armrest-left seat-armrest-${seatTypeClass}`} />
                                    <div className={`seat-armrest seat-armrest-right seat-armrest-${seatTypeClass}`} />
                                    <div className={`seat-cushion seat-cushion-${seatTypeClass}`}>
                                      {seat.Row}
                                      {String(seat.Number).padStart(2, "0")}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chú thích */}
                      <div className="seat-legend">
                        <div className="seat-legend-item">
                          <div className="seat-legend-color seat-legend-color-normal" />
                          <span className="seat-legend-text">Normal</span>
                        </div>
                        <div className="seat-legend-item">
                          <div className="seat-legend-color seat-legend-color-vip" />
                          <span className="seat-legend-text">VIP</span>
                        </div>
                        <div className="seat-legend-item">
                          <div className="seat-legend-color seat-legend-color-couple" />
                          <span className="seat-legend-text">Couple</span>
                        </div>
                      </div>

                      {/* Hướng dẫn */}
                      <div className="seat-instructions">
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <i className="fas fa-info-circle seat-instructions-icon"></i>
                          <div className="seat-instructions-text">
                            <strong className="seat-instructions-title">
                              💡 Hướng dẫn
                            </strong>
                            Click vào ghế để thay đổi loại ghế. Click chuột phải để xóa ghế.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="seat-show-empty">
                      <i className="fas fa-inbox seat-show-empty-icon"></i>
                      <p>Phòng này chưa có ghế nào. Hãy thêm ghế mới!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}