// hooks/useSeatManagement.js
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import SeatApi from "../../../../api/SeatApi";
import RoomApi from "../../../../api/RoomApi";
import { ROOM_SEAT_CONFIG, ROW_LABELS } from "../constants";

// Deterministic seat type generator
export function getSeatType(row, col, totalRows, totalCols, config) {
  const hash = (row * 31 + col * 17) % 100;
  const lastRow = row === totalRows - 1;
  const lastTwoRows = row >= totalRows - 2;

  if (lastRow && col % 3 === 0 && config.accessibleCount > 0) return "accessible";
  if (config.sweetboxRatio > 0 && lastTwoRows && col % 2 === 0) return "sweetbox";
  if (config.coupleRatio > 0 && lastTwoRows) return "couple";
  if (config.vipRatio > 0 && row >= totalRows - 3 && hash < config.vipRatio * 100) return "vip";
  return "regular";
}

// Deterministic "booked" status
export function isBooked(row, col, roomId) {
  const seed = (row * 97 + col * 43 + roomId * 13) % 100;
  return seed < 35;
}

export function generateSeats(room, customBooked = null) {
  if (!room || !room.rows || !room.cols) return [];
  
  const config = ROOM_SEAT_CONFIG[room.type] || ROOM_SEAT_CONFIG.standard;
  const grid = [];
  for (let r = 0; r < room.rows; r++) {
    const row = [];
    for (let c = 0; c < room.cols; c++) {
      const type = getSeatType(r, c, room.rows, room.cols, config);
      const booked = room.status === "maintenance" ? false : 
                     customBooked !== null ? customBooked(r, c) : isBooked(r, c, room.id);
      row.push({ id: `${ROW_LABELS[r]}${c + 1}`, row: r, col: c, type, booked });
    }
    grid.push(row);
  }
  return grid;
}

export function useSeatManagement(roomId, roomData) {
  const toast = useToast();
  const [seatsData, setSeatsData] = useState([]);
  const [room, setRoom] = useState(roomData || null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);

  // Load seats from API
  const loadSeats = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      const seatsRes = await SeatApi.getAll();
      const allSeats = seatsRes.data.data || seatsRes.data || [];
      
      // Filter seats by room
      const seatsInRoom = allSeats.filter(s => s.RoomId === parseInt(roomId));
      setRoomSeats(seatsInRoom);
      
      // Convert to grid format for display
      if (room) {
        const grid = generateSeats(room);
        // Merge with actual seat data
        const mergedGrid = grid.map(row => 
          row.map(seat => {
            const existingSeat = seatsInRoom.find(
              s => s.Row === ROW_LABELS[seat.row] && s.Number === seat.col + 1
            );
            if (existingSeat) {
              return {
                ...seat,
                SeatId: existingSeat.SeatId,
                booked: existingSeat.Status !== "Available",
                SeatType: existingSeat.SeatType || seat.type,
                type: existingSeat.SeatType?.toLowerCase() || seat.type,
                Status: existingSeat.Status || "Available",
                Row: existingSeat.Row,
                Number: existingSeat.Number,
              };
            }
            // Nếu ghế chưa có trong DB, đánh dấu là trống
            return {
              ...seat,
              booked: false,
              Status: "Available",
            };
          })
        );
        setSeatsData(mergedGrid);
      }
    } catch (err) {
      console.error("Lỗi load ghế:", err);
      toast({
        title: "Lỗi khi tải ghế",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [roomId, room, toast]);

  // Load room data
  const loadRoom = useCallback(async () => {
    if (!roomId) return null;
    
    try {
      const roomRes = await RoomApi.getById(roomId);
      const roomData = roomRes.data.data || roomRes.data;
      
      // Convert to format expected by generateSeats
      const formattedRoom = {
        id: roomData.RoomId,
        name: roomData.Name,
        type: roomData.RoomType?.toLowerCase() || "standard",
        rows: roomData.Rows || 8,
        cols: roomData.Columns || 12,
        status: roomData.Status?.toLowerCase() === "active" ? "active" : "maintenance",
        capacity: roomData.Capacity || 0,
      };
      setRoom(formattedRoom);
      return formattedRoom;
    } catch (err) {
      console.error("Lỗi load phòng:", err);
      toast({
        title: "Lỗi khi tải phòng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  }, [roomId, toast]);

  // Initialize data
  useEffect(() => {
    const init = async () => {
      const loadedRoom = await loadRoom();
      if (loadedRoom) {
        await loadSeats();
      }
    };
    init();
  }, [roomId]);

  const flat = seatsData.flat();
  const stats = {
    total: flat.length,
    booked: flat.filter((s) => s.booked).length,
    empty: flat.filter((s) => !s.booked).length,
    regular: flat.filter((s) => s.type === "regular").length,
    vip: flat.filter((s) => s.type === "vip").length,
    sweet: flat.filter((s) => s.type === "sweetbox" || s.type === "couple").length,
    access: flat.filter((s) => s.type === "accessible").length,
  };

  const handleSeatEdit = (seat) => {
    setSelectedSeat(seat);
    return seat;
  };

  // Hàm chuyển đổi SeatType sang đúng format API
  const formatSeatType = (type) => {
    if (!type) return "Normal";
    
    const typeLower = type.toLowerCase();
    if (typeLower === 'vip') return "VIP";
    if (typeLower === 'couple') return "Couple";
    if (typeLower === 'normal' || typeLower === 'regular') return "Normal";
    if (typeLower === 'accessible') return "Accessible";
    if (typeLower === 'sweetbox') return "Sweetbox";
    // Mặc định viết hoa chữ cái đầu
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // === QUAN TRỌNG: Hàm chỉ cho phép 2 giá trị Status ===
  const getValidStatus = (status) => {
    if (!status) return "Available";
    const statusLower = status.toLowerCase();
    if (statusLower === 'booked') return "Booked";
    // Tất cả các giá trị khác đều trả về "Available"
    return "Available";
  };

  // SỬA LẠI HÀM handleSaveSeat - ĐẢM BẢO STATUS ĐÚNG
  const handleSaveSeat = useCallback(async (updatedSeat) => {
    try {
      console.log("📝 Bắt đầu cập nhật ghế với dữ liệu:", updatedSeat);
      
      // Tìm ghế trong roomSeats dựa trên Row và Number
      const rowLabel = updatedSeat.row !== undefined ? ROW_LABELS[updatedSeat.row] : updatedSeat.Row;
      const seatNumber = updatedSeat.col !== undefined ? updatedSeat.col + 1 : updatedSeat.Number;
      
      // Tìm ghế hiện tại
      let existingSeat = roomSeats.find(
        s => s.Row === rowLabel && s.Number === seatNumber
      );
      
      // Nếu không tìm thấy, thử tìm theo SeatId
      if (!existingSeat && updatedSeat.SeatId) {
        existingSeat = roomSeats.find(s => s.SeatId === updatedSeat.SeatId);
      }
      
      if (!existingSeat) {
        toast({
          title: "Không tìm thấy ghế để cập nhật",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("✅ Tìm thấy ghế:", existingSeat);

      // Lấy SeatType
      let seatTypeValue = "Normal";
      if (updatedSeat.SeatType) {
        seatTypeValue = updatedSeat.SeatType;
      } else if (updatedSeat.type) {
        seatTypeValue = formatSeatType(updatedSeat.type);
      } else if (existingSeat.SeatType) {
        seatTypeValue = existingSeat.SeatType;
      }
      
      // === QUAN TRỌNG: CHỈ CHO PHÉP 2 GIÁ TRỊ STATUS ===
      let statusValue = "Available";
      
      // Ưu tiên lấy Status từ updatedSeat
      if (updatedSeat.Status) {
        statusValue = getValidStatus(updatedSeat.Status);
      } 
      // Nếu có booked trong updatedSeat
      else if (updatedSeat.booked !== undefined) {
        statusValue = updatedSeat.booked ? "Booked" : "Available";
      }
      // Nếu có Status trong existingSeat
      else if (existingSeat.Status) {
        statusValue = getValidStatus(existingSeat.Status);
      }
      
      // === ĐẢM BẢO STATUS CHỈ LÀ "Available" HOẶC "Booked" ===
      // Nếu vẫn còn giá trị khác, ép về "Available"
      if (statusValue !== "Available" && statusValue !== "Booked") {
        console.warn(`⚠️ Status không hợp lệ: "${statusValue}", ép về "Available"`);
        statusValue = "Available";
      }
      
      const payload = {
        RoomId: parseInt(roomId),
        Row: rowLabel,
        Number: seatNumber,
        SeatType: seatTypeValue,
        Status: statusValue
      };

      console.log("📤 Payload gửi lên API (sửa ghế):", payload);
      console.log("📤 SeatType:", seatTypeValue);
      console.log("📤 Status:", statusValue);

      // Gọi API update
      const response = await SeatApi.update(existingSeat.SeatId, payload);
      console.log("✅ Response từ API:", response);
      
      toast({
        title: `✅ Đã cập nhật ghế ${rowLabel}${seatNumber}`,
        description: `Loại: ${seatTypeValue} | Trạng thái: ${statusValue === "Booked" ? "Đã đặt" : "Còn trống"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      
      // Reload seats to sync
      await loadSeats();
      
      return true;
    } catch (err) {
      console.error("❌ Lỗi cập nhật ghế:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng thử lại";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorValues = Object.values(errors).flat();
        errorMessage = errorValues.join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi cập nhật ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      throw err;
    }
  }, [roomId, roomSeats, loadSeats, toast]);

  // SỬA LẠI HÀM handleAddRows
  const handleAddRows = useCallback(async (count, position) => {
    try {
      const currentCols = seatsData[0]?.length || 0;
      
      if (currentCols === 0) {
        toast({
          title: "Chưa có cột ghế",
          description: "Vui lòng tạo cột ghế trước",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const existingRows = [...new Set(roomSeats.map(s => s.Row))];
      
      let newRowLabels = [];
      if (position === "start") {
        let index = 0;
        while (newRowLabels.length < count && index < ROW_LABELS.length) {
          const rowLabel = ROW_LABELS[index];
          if (!existingRows.includes(rowLabel)) {
            newRowLabels.push(rowLabel);
          }
          index++;
        }
      } else {
        const maxRowIndex = Math.max(-1, ...existingRows.map(r => ROW_LABELS.indexOf(r)));
        let index = maxRowIndex + 1;
        while (newRowLabels.length < count && index < ROW_LABELS.length) {
          const rowLabel = ROW_LABELS[index];
          if (!existingRows.includes(rowLabel)) {
            newRowLabels.push(rowLabel);
          }
          index++;
        }
      }

      if (newRowLabels.length === 0) {
        toast({
          title: "Không có hàng mới để thêm",
          description: "Đã đạt giới hạn số hàng (A-Z)",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const seatsToCreate = [];
      for (const rowLabel of newRowLabels) {
        for (let col = 1; col <= currentCols; col++) {
          const exists = roomSeats.some(s => s.Row === rowLabel && s.Number === col);
          if (!exists) {
            seatsToCreate.push({
              RoomId: parseInt(roomId),
              Row: rowLabel,
              Number: col,
              SeatType: "Normal",
              Status: "Available"
            });
          }
        }
      }

      if (seatsToCreate.length === 0) {
        toast({
          title: "Không có ghế mới để thêm",
          description: "Tất cả ghế trong các hàng này đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("📤 Dữ liệu gửi lên API (thêm hàng):", { seats: seatsToCreate });

      await SeatApi.createBulk({ seats: seatsToCreate });
      
      toast({
        title: `✅ Đã thêm ${seatsToCreate.length} ghế (${newRowLabels.length} hàng)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi thêm hàng:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng kiểm tra lại dữ liệu";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi thêm hàng ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [roomId, seatsData, roomSeats, loadSeats, toast]);

  // SỬA LẠI HÀM handleAddCols
  const handleAddCols = useCallback(async (count, position) => {
    try {
      const currentRows = seatsData.length;
      
      if (currentRows === 0) {
        toast({
          title: "Chưa có hàng ghế",
          description: "Vui lòng tạo hàng ghế trước",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const existingCols = [...new Set(roomSeats.map(s => s.Number))];
      const maxCol = existingCols.length > 0 ? Math.max(...existingCols) : 0;
      
      let startCol = position === "start" ? 1 : maxCol + 1;
      const newCols = [];
      for (let i = 0; i < count; i++) {
        const colNum = startCol + i;
        if (!existingCols.includes(colNum)) {
          newCols.push(colNum);
        }
      }

      if (newCols.length === 0) {
        toast({
          title: "Không có cột mới để thêm",
          description: "Các cột đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const existingRows = [...new Set(roomSeats.map(s => s.Row))];
      
      const seatsToCreate = [];
      for (const rowLabel of existingRows) {
        for (const colNum of newCols) {
          const exists = roomSeats.some(s => s.Row === rowLabel && s.Number === colNum);
          if (!exists) {
            seatsToCreate.push({
              RoomId: parseInt(roomId),
              Row: rowLabel,
              Number: colNum,
              SeatType: "Normal",
              Status: "Available"
            });
          }
        }
      }

      if (seatsToCreate.length === 0) {
        toast({
          title: "Không có ghế mới để thêm",
          description: "Tất cả ghế trong các cột này đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("📤 Dữ liệu gửi lên API (thêm cột):", { seats: seatsToCreate });

      await SeatApi.createBulk({ seats: seatsToCreate });
      
      toast({
        title: `✅ Đã thêm ${seatsToCreate.length} ghế (${newCols.length} cột)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi thêm cột:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng kiểm tra lại dữ liệu";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi thêm cột ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [roomId, seatsData, roomSeats, loadSeats, toast]);

  // Hàm xóa hàng
  const handleDeleteRow = useCallback(async (rowIndex) => {
    try {
      const rowLabel = ROW_LABELS[rowIndex];
      const seatsToDelete = roomSeats.filter(s => s.Row === rowLabel);
      
      if (seatsToDelete.length === 0) {
        toast({
          title: "Hàng này không có ghế",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      for (const seat of seatsToDelete) {
        await SeatApi.delete(seat.SeatId);
      }

      toast({
        title: `✅ Đã xóa hàng ${rowLabel} (${seatsToDelete.length} ghế)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi xóa hàng:", err);
      toast({
        title: "❌ Lỗi xóa hàng ghế",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [roomSeats, loadSeats, toast]);

  // Hàm xóa cột
  const handleDeleteCol = useCallback(async (colIndex) => {
    try {
      const colNumber = colIndex + 1;
      const seatsToDelete = roomSeats.filter(s => s.Number === colNumber);
      
      if (seatsToDelete.length === 0) {
        toast({
          title: "Cột này không có ghế",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      for (const seat of seatsToDelete) {
        await SeatApi.delete(seat.SeatId);
      }

      toast({
        title: `✅ Đã xóa cột ${colNumber} (${seatsToDelete.length} ghế)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi xóa cột:", err);
      toast({
        title: "❌ Lỗi xóa cột ghế",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [roomSeats, loadSeats, toast]);

  // Hàm xóa ghế
  const handleDeleteSeat = useCallback(async (seat) => {
    try {
      const rowLabel = seat.row !== undefined ? ROW_LABELS[seat.row] : seat.Row;
      const seatNumber = seat.col !== undefined ? seat.col + 1 : seat.Number;
      
      const seatToDelete = roomSeats.find(
        s => s.Row === rowLabel && s.Number === seatNumber
      );
      
      if (!seatToDelete) {
        toast({
          title: "Ghế không tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await SeatApi.delete(seatToDelete.SeatId);
      
      toast({
        title: `✅ Đã xóa ghế ${rowLabel}${seatNumber}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi xóa ghế:", err);
      toast({
        title: "❌ Lỗi xóa ghế",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [roomSeats, loadSeats, toast]);

  // Hàm reset ghế
  const handleResetSeats = useCallback(async () => {
    try {
      const bookedSeats = roomSeats.filter(s => s.Status !== "Available");
      
      if (bookedSeats.length === 0) {
        toast({
          title: "Không có ghế nào được đặt để reset",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log(`🔄 Đang reset ${bookedSeats.length} ghế...`);

      for (const seat of bookedSeats) {
        const payload = {
          RoomId: seat.RoomId,
          Row: seat.Row,
          Number: seat.Number,
          SeatType: seat.SeatType || "Normal",
          Status: "Available"
        };
        console.log(`🔄 Reset ghế ${seat.Row}${seat.Number}:`, payload);
        await SeatApi.update(seat.SeatId, payload);
      }

      toast({
        title: `✅ Đã reset ${bookedSeats.length} ghế về trạng thái trống`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeats();
    } catch (err) {
      console.error("❌ Lỗi reset ghế:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng thử lại";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi reset ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [roomSeats, loadSeats, toast]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(1.5, s + 0.1)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(0.6, s - 0.1)), []);

  return {
    seatsData,
    setSeatsData,
    room,
    loading,
    scale,
    filter,
    setFilter,
    selectedSeat,
    setSelectedSeat,
    stats,
    roomSeats,
    handleSeatEdit,
    handleSaveSeat,
    handleAddRows,
    handleAddCols,
    handleDeleteRow,
    handleDeleteCol,
    handleDeleteSeat,
    handleResetSeats,
    zoomIn,
    zoomOut,
    loadSeats,
    loadRoom,
  };
}