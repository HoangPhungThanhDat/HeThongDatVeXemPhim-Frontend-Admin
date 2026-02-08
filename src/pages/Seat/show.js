import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/SeatManagement.css"; // Import CSS chung
import SeatApi from "../../api/SeatApi";
import RoomApi from "../../api/RoomApi";
import Loader from "../../layouts/Loader";
import { handleDeleteSeat, showToast } from "./delete";

export default function SeatShow() {
  const { SeatId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);

  useEffect(() => {
    loadRoomData();
  }, [SeatId]);

  const loadRoomData = async () => {
    try {
      const roomRes = await RoomApi.getById(SeatId);
      const seatsRes = await SeatApi.getAll();
      
      const room = roomRes.data.data || roomRes.data;
      const allSeats = seatsRes.data.data || seatsRes.data;
      const seatsInRoom = allSeats.filter(s => s.RoomId === room.RoomId);
      
      setViewingRoom(room);
      setRoomSeats(seatsInRoom);
    } catch (err) {
      console.error("Lỗi load dữ liệu phòng:", err);
      showToast("error", "❌ Lỗi khi tải dữ liệu phòng!");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSuccess = (deletedSeatId) => {
    setRoomSeats(roomSeats.filter((s) => s.SeatId !== deletedSeatId));
    loadRoomData();
  };

  if (loading) return <Loader />;

  if (!viewingRoom) {
    return (
      <MainLayout>
        <div className="text-center py-5">
          <p>Không tìm thấy phòng</p>
          <button className="btn btn-primary" onClick={() => navigate('/seats')}>
            Quay lại
          </button>
        </div>
      </MainLayout>
    );
  }

  // Nhóm ghế theo hàng
  const seatsByRow = {};
  roomSeats.forEach(seat => {
    if (!seatsByRow[seat.Row]) {
      seatsByRow[seat.Row] = [];
    }
    seatsByRow[seat.Row].push(seat);
  });

  // Sắp xếp ghế theo số
  Object.keys(seatsByRow).forEach(row => {
    seatsByRow[row].sort((a, b) => a.Number - b.Number);
  });

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div>
      <MainLayout>
      <main className="seat-management-page">
          <div className="main-container">
            <div className="pd-ltr-20">
              {/* Header với nút quay lại */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-gradient rounded-4 header-box seat-header-box">
                <h3 className="m-0 text-white fw-bold d-flex align-items-center">
                  <button
                    className="btn seat-back-btn"
                    onClick={() => navigate('/seats')}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <i className="fas fa-door-open me-2"></i> 
                  {viewingRoom.Name} 
                </h3>
              </div>

              {/* Layout ghế */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {roomSeats.length > 0 ? (
                    <div className="seat-show-container">
                      {/* Tiêu đề */}
                      <h5 className="seat-show-title">
                        <i className="fas fa-ticket-alt me-2"></i>
                        Phòng chiếu ({roomSeats.length} ghế):
                      </h5>
                      
                      {/* Grid ghế */}
                      <div className="seat-preview-container">
                        {rows.map(row => (
                          <div key={row} className="seat-row-container">
                            {/* Tên hàng */}
                            <span
                              className="seat-row-label"
                              title={`Hàng ${row}`}
                            >
                              {row}
                            </span>

                            {/* Các ghế trong hàng */}
                            <div className="seat-grid">
                              {seatsByRow[row].map(seat => {
                                const seatTypeClass = seat.SeatType.toLowerCase();
                                const isUnavailable = seat.Status !== "Available";
                                
                                return (
                                  <div
                                    key={seat.SeatId}
                                    className="seat-item"
                                    style={{ opacity: isUnavailable ? 0.5 : 1 }}
                                    title={`${seat.Row}${String(seat.Number).padStart(2, '0')} - ${seat.SeatType} - ${seat.Status}`}
                                    onClick={() => handleDeleteSeat(seat.SeatId, onDeleteSuccess)}
                                  >
                                    {/* Lưng ghế */}
                                    <div className={`seat-back seat-back-${seatTypeClass}`} />

                                    {/* Tay vịn trái */}
                                    <div className={`seat-armrest seat-armrest-left seat-armrest-${seatTypeClass}`} />
                                    
                                    {/* Tay vịn phải */}
                                    <div className={`seat-armrest seat-armrest-right seat-armrest-${seatTypeClass}`} />

                                    {/* Mặt ghế */}
                                    <div className={`seat-cushion seat-cushion-${seatTypeClass}`}>
                                      {seat.Row}{String(seat.Number).padStart(2, '0')}
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
                    </div>
                  ) : (
                    <div className="seat-show-empty">
                      <i className="fas fa-inbox seat-show-empty-icon"></i>
                      <p>Phòng này chưa có ghế nào</p>
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