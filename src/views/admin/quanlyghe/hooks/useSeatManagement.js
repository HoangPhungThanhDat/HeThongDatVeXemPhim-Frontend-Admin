// hooks/useSeatManagement.js
import { useState, useCallback, useEffect, useRef } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);
  const loadTimeoutRef = useRef(null);

  // Load seats from API
  const loadSeats = useCallback(async () => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("🔄 Đang tải ghế cho phòng:", roomId);
      
      const seatsRes = await SeatApi.getAll();
      const allSeats = seatsRes.data.data || seatsRes.data || [];
      
      // Filter seats by room
      const seatsInRoom = allSeats.filter(s => s.RoomId === parseInt(roomId));
      console.log(`✅ Tìm thấy ${seatsInRoom.length} ghế trong phòng ${roomId}`);
      setRoomSeats(seatsInRoom);
      
      // Convert to grid format for display
      if (room) {
        const grid = generateSeats(room);
        
        // Merge with actual seat data from API
        const mergedGrid = grid.map(row => 
          row.map(seat => {
            const rowLabel = ROW_LABELS[seat.row];
            const seatNumber = seat.col + 1;
            
            // Tìm ghế trong dữ liệu từ API
            const existingSeat = seatsInRoom.find(
              s => s.Row === rowLabel && s.Number === seatNumber
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
            // Nếu ghế không có trong API, đánh dấu là trống nhưng vẫn giữ lại
            return {
              ...seat,
              booked: false,
              Status: "Available",
            };
          })
        );
        
        // ✅ Lọc bỏ các hàng trống (không có ghế nào)
        const filteredGrid = mergedGrid.filter(row => row.length > 0);
        
        // ✅ Lọc bỏ các ghế không tồn tại trong API (đã bị xóa)
        // Chỉ giữ lại ghế có SeatId (đã tồn tại trong DB)
        const cleanedGrid = filteredGrid.map(row => 
          row.filter(seat => seat.SeatId !== undefined)
        );
        
        // Nếu sau khi lọc mà hàng nào trống thì bỏ hàng đó
        const finalGrid = cleanedGrid.filter(row => row.length > 0);
        
        console.log("📊 Dữ liệu ghế sau khi load:", {
          totalRows: finalGrid.length,
          totalCols: finalGrid[0]?.length || 0,
          totalSeats: finalGrid.flat().length,
          seatsInRoom: seatsInRoom.length
        });
        
        setSeatsData(finalGrid);
        setIsInitialized(true);
      }
    } catch (err) {
      console.error("❌ Lỗi load ghế:", err);
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
      console.error("❌ Lỗi load phòng:", err);
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
    let isMounted = true;
    
    const init = async () => {
      setLoading(true);
      const loadedRoom = await loadRoom();
      if (loadedRoom && isMounted) {
        await loadSeats();
      }
      if (isMounted) {
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [roomId]);

  // Load lại khi roomId thay đổi
  useEffect(() => {
    if (roomId) {
      setLoading(true);
      setIsInitialized(false);
      loadRoom().then(() => {
        loadSeats();
      });
    }
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

  // Hàm handleSaveSeat - ĐẢM BẢO STATUS ĐÚNG
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

  // ============================================================
  // SỬA LẠI HÀM handleAddRows - CHO PHÉP THÊM HÀNG KHI CHƯA CÓ CỘT
  // ============================================================
  const handleAddRows = useCallback(async (count, position) => {
    try {
      const currentCols = seatsData[0]?.length || 0;
      
      // ✅ Nếu chưa có cột, tự động tạo 1 cột mặc định cùng với hàng mới
      if (currentCols === 0) {
        toast({
          title: "ℹ️ Chưa có cột ghế",
          description: "Hệ thống sẽ tự động tạo 1 cột mặc định cùng với hàng mới",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        
        // Lấy danh sách hàng đã tồn tại
        const existingRows = [...new Set(roomSeats.map(s => s.Row))];
        
        // Xác định hàng mới sẽ thêm
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
            title: "⚠️ Không có hàng mới để thêm",
            description: "Đã đạt giới hạn số hàng (A-Z)",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Tạo ghế với 1 cột cho mỗi hàng mới
        const seatsToCreate = [];
        for (const rowLabel of newRowLabels) {
          seatsToCreate.push({
            RoomId: parseInt(roomId),
            Row: rowLabel,
            Number: 1, // Cột mặc định số 1
            SeatType: "Normal",
            Status: "Available"
          });
        }

        console.log("📤 Tạo hàng mới (kèm cột mặc định):", { seats: seatsToCreate });

        await SeatApi.createBulk({ seats: seatsToCreate });
        
        toast({
          title: `✅ Đã thêm ${seatsToCreate.length} ghế (${newRowLabels.length} hàng × 1 cột)`,
          description: `💡 Bạn có thể thêm cột sau khi đã có hàng`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        await loadSeats();
        return;
      }
      
      // ============================================================
      // Logic thêm hàng khi đã có cột (giữ nguyên)
      // ============================================================
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
          title: "⚠️ Không có hàng mới để thêm",
          description: "Đã đạt giới hạn số hàng (A-Z)",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Tạo ghế cho các hàng mới với tất cả cột hiện có
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
          title: "⚠️ Không có ghế mới để thêm",
          description: "Tất cả ghế trong các hàng này đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("📤 Thêm hàng mới:", { seats: seatsToCreate });

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

  // ============================================================
  // SỬA LẠI HÀM handleAddCols - CHO PHÉP THÊM CỘT KHI CHƯA CÓ HÀNG
  // ============================================================
  const handleAddCols = useCallback(async (count, position) => {
    try {
      const currentRows = seatsData.length;
      
      // ✅ Nếu chưa có hàng, tự động tạo 1 hàng mặc định cùng với cột mới
      if (currentRows === 0) {
        toast({
          title: "ℹ️ Chưa có hàng ghế",
          description: "Hệ thống sẽ tự động tạo 1 hàng mặc định cùng với cột mới",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        
        // Lấy danh sách hàng đã tồn tại
        const existingRows = [...new Set(roomSeats.map(s => s.Row))];
        let rowLabel = "A"; // Hàng mặc định
        
        // Tìm hàng trống đầu tiên
        for (let i = 0; i < ROW_LABELS.length; i++) {
          if (!existingRows.includes(ROW_LABELS[i])) {
            rowLabel = ROW_LABELS[i];
            break;
          }
        }
        
        // Lấy danh sách cột đã tồn tại
        const existingCols = [...new Set(roomSeats.map(s => s.Number))];
        const maxCol = existingCols.length > 0 ? Math.max(...existingCols) : 0;
        
        // Xác định cột mới sẽ thêm
        let startCol = position === "start" ? 1 : maxCol + 1;
        const newCols = [];
        for (let i = 0; i < count; i++) {
          const colNum = startCol + i;
          // Nếu thêm ở đầu, kiểm tra không trùng
          if (position === "start") {
            if (!existingCols.includes(colNum)) {
              newCols.push(colNum);
            }
          } else {
            newCols.push(colNum);
          }
        }

        if (newCols.length === 0) {
          toast({
            title: "⚠️ Không có cột mới để thêm",
            description: "Các cột đã tồn tại",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Tạo ghế cho 1 hàng với các cột mới
        const seatsToCreate = [];
        for (const colNum of newCols) {
          seatsToCreate.push({
            RoomId: parseInt(roomId),
            Row: rowLabel,
            Number: colNum,
            SeatType: "Normal",
            Status: "Available"
          });
        }

        console.log("📤 Tạo cột mới (kèm hàng mặc định):", { seats: seatsToCreate });

        await SeatApi.createBulk({ seats: seatsToCreate });
        
        toast({
          title: `✅ Đã thêm ${seatsToCreate.length} ghế (1 hàng × ${newCols.length} cột)`,
          description: `💡 Hàng "${rowLabel}" đã được tạo tự động. Bạn có thể thêm hàng sau khi đã có cột.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        await loadSeats();
        return;
      }
      
      // ============================================================
      // Logic thêm cột khi đã có hàng (giữ nguyên)
      // ============================================================
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
          title: "⚠️ Không có cột mới để thêm",
          description: "Các cột đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const existingRows = [...new Set(roomSeats.map(s => s.Row))];
      
      // Tạo ghế cho tất cả hàng với các cột mới
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
          title: "⚠️ Không có ghế mới để thêm",
          description: "Tất cả ghế trong các cột này đã tồn tại",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log("📤 Thêm cột mới:", { seats: seatsToCreate });

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

  // ============================================================
  // SỬA LẠI HÀM handleDeleteRow - XÓA HÀNG VÀ CẬP NHẬT STATE
  // ============================================================
  const handleDeleteRow = useCallback(async (rowIndex) => {
    try {
      const rowLabel = ROW_LABELS[rowIndex];
      
      // Tìm tất cả ghế trong hàng cần xóa
      const seatsToDelete = roomSeats.filter(s => s.Row === rowLabel);
      
      if (seatsToDelete.length === 0) {
        toast({
          title: "⚠️ Hàng này không có ghế",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log(`🗑️ Đang xóa hàng ${rowLabel} với ${seatsToDelete.length} ghế...`);

      // Xóa từng ghế trong hàng
      for (const seat of seatsToDelete) {
        console.log(`🗑️ Xóa ghế ${seat.Row}${seat.Number} (ID: ${seat.SeatId})`);
        await SeatApi.delete(seat.SeatId);
      }

      // ✅ Cập nhật lại roomSeats - loại bỏ các ghế đã xóa
      const updatedRoomSeats = roomSeats.filter(s => s.Row !== rowLabel);
      setRoomSeats(updatedRoomSeats);

      // ✅ Cập nhật lại seatsData - loại bỏ hàng đã xóa
      const updatedSeatsData = seatsData.filter((row, index) => index !== rowIndex);
      setSeatsData(updatedSeatsData);

      toast({
        title: `✅ Đã xóa hàng ${rowLabel}`,
        description: `Đã xóa ${seatsToDelete.length} ghế trong hàng ${rowLabel}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // ✅ Reload để đồng bộ với database (kiểm tra lần cuối)
      await loadSeats();
      
    } catch (err) {
      console.error("❌ Lỗi xóa hàng:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng thử lại";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi xóa hàng ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [roomSeats, seatsData, loadSeats, toast]);

  // ============================================================
  // SỬA LẠI HÀM handleDeleteCol - XÓA CỘT VÀ CẬP NHẬT STATE
  // ============================================================
  const handleDeleteCol = useCallback(async (colIndex) => {
    try {
      const colNumber = colIndex + 1;
      
      // Tìm tất cả ghế trong cột cần xóa
      const seatsToDelete = roomSeats.filter(s => s.Number === colNumber);
      
      if (seatsToDelete.length === 0) {
        toast({
          title: "⚠️ Cột này không có ghế",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log(`🗑️ Đang xóa cột ${colNumber} với ${seatsToDelete.length} ghế...`);

      // Xóa từng ghế trong cột
      for (const seat of seatsToDelete) {
        console.log(`🗑️ Xóa ghế ${seat.Row}${seat.Number} (ID: ${seat.SeatId})`);
        await SeatApi.delete(seat.SeatId);
      }

      // ✅ Cập nhật lại roomSeats - loại bỏ các ghế đã xóa
      const updatedRoomSeats = roomSeats.filter(s => s.Number !== colNumber);
      setRoomSeats(updatedRoomSeats);

      // ✅ Cập nhật lại seatsData - loại bỏ cột đã xóa
      const updatedSeatsData = seatsData.map(row => 
        row.filter(seat => seat.col !== colIndex)
      ).filter(row => row.length > 0); // Xóa hàng nào trống
      
      setSeatsData(updatedSeatsData);

      toast({
        title: `✅ Đã xóa cột ${colNumber}`,
        description: `Đã xóa ${seatsToDelete.length} ghế trong cột ${colNumber}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // ✅ Reload để đồng bộ với database (kiểm tra lần cuối)
      await loadSeats();
      
    } catch (err) {
      console.error("❌ Lỗi xóa cột:", err);
      console.error("❌ Chi tiết lỗi:", err.response?.data);
      
      let errorMessage = "Vui lòng thử lại";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "❌ Lỗi xóa cột ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [roomSeats, seatsData, loadSeats, toast]);

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
      
      // Cập nhật roomSeats
      const updatedRoomSeats = roomSeats.filter(s => s.SeatId !== seatToDelete.SeatId);
      setRoomSeats(updatedRoomSeats);
      
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
    isInitialized,
  };
}