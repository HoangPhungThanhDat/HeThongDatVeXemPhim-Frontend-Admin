// src/views/admin/quanlytrangthaighe/hooks/useSeatData.js

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { 
  fetchShowtimeSeats, 
  fetchShowtimes, 
  fetchCinemas, 
  fetchRooms,
  generateSeatsForShowtime,
  updateSeatStatus,
  deleteShowtimeSeat
} from "../services/showtimeSeatService";
import { STATUS_MAP, STATUS_MAP_REVERSE } from "../constants";

// Map status từ API sang local format
const mapStatusToLocal = (apiStatus) => {
  return STATUS_MAP[apiStatus] || 'trong';
};

// Map status từ local sang API format
const mapStatusToApi = (localStatus) => {
  return STATUS_MAP_REVERSE[localStatus] || 'Available';
};

export function useSeatData() {
  const toast = useToast();
  
  // Data states
  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Cache for seats data
  const [seatCache, setSeatCache] = useState({});

  // Load dữ liệu ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [showtimesData, cinemasData, roomsData] = await Promise.all([
          fetchShowtimes(),
          fetchCinemas(),
          fetchRooms()
        ]);
        
        setShowtimes(showtimesData);
        setCinemas(cinemasData);
        setRooms(roomsData);
        
        if (showtimesData.length > 0) {
          const firstShowtime = showtimesData[0];
          const showtimeId = firstShowtime.ShowtimeId || firstShowtime.id;
          setSelectedShowtimeId(showtimeId);
          
          try {
            const seats = await fetchShowtimeSeats(showtimeId);
            setShowtimeSeats(seats);
            setSeatCache(prev => ({ ...prev, [showtimeId]: seats }));
          } catch (error) {
            console.error("❌ Lỗi load ghế ban đầu:", error);
            setShowtimeSeats([]);
          }
        }
        
        setIsInitialLoad(false);
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu ban đầu:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu ban đầu. Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Load ghế theo showtime - CÓ CACHE
  const loadSeatsForShowtime = useCallback(async (showtimeId) => {
    if (!showtimeId) {
      setShowtimeSeats([]);
      return;
    }
    
    // Kiểm tra cache
    if (seatCache[showtimeId]) {
      console.log(`✅ Using cached seats for showtime ${showtimeId}`);
      setShowtimeSeats(seatCache[showtimeId]);
      setSelectedShowtimeId(showtimeId);
      return;
    }
    
    setLoading(true);
    try {
      const seats = await fetchShowtimeSeats(showtimeId);
      console.log(`✅ Loaded ${seats.length} seats for showtime ${showtimeId}`);
      setSeatCache(prev => ({ ...prev, [showtimeId]: seats }));
      setShowtimeSeats(seats);
      setSelectedShowtimeId(showtimeId);
    } catch (error) {
      console.error("❌ Lỗi tải ghế:", error);
      toast({
        title: "Lỗi tải ghế",
        description: "Không thể tải danh sách ghế cho suất chiếu này",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setShowtimeSeats([]);
    } finally {
      setLoading(false);
    }
  }, [toast, seatCache]);

  // Tạo ghế tự động
  const handleGenerateSeats = useCallback(async (showtimeId) => {
    if (!showtimeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn suất chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      // Xóa cache cũ
      setSeatCache(prev => {
        const newCache = { ...prev };
        delete newCache[showtimeId];
        return newCache;
      });
      setShowtimeSeats([]);
      
      await generateSeatsForShowtime(showtimeId);
      
      toast({
        title: "Thành công",
        description: `Đã tạo ghế tự động cho suất chiếu`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadSeatsForShowtime(showtimeId);
    } catch (error) {
      console.error("❌ Lỗi tạo ghế:", error);
      
      let errorMessage = "Không thể tạo ghế tự động. Vui lòng kiểm tra lại";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Lỗi tạo ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [loadSeatsForShowtime, toast]);

  // Cập nhật trạng thái ghế - ĐÚNG CẤU TRÚC BẢNG
  const handleUpdateSeatStatus = useCallback(async (showtimeSeatId, data) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!showtimeSeatId) {
        throw new Error("Missing showtimeSeatId");
      }
      
      if (!data || !data.Status) {
        throw new Error("Missing status");
      }

      // Đảm bảo dữ liệu có đầy đủ các trường
      const updateData = {
        ShowtimeId: data.ShowtimeId || selectedShowtimeId,
        SeatId: data.SeatId,
        Status: data.Status,
        UpdatedAt: data.UpdatedAt || new Date().toISOString(),
        UpdatedBy: data.UpdatedBy || "admin"
      };

      console.log("📤 Updating seat status:", updateData);
      
      const response = await updateSeatStatus(showtimeSeatId, updateData);
      console.log("✅ Update response:", response);
      
      // Cập nhật local state
      setShowtimeSeats(prev => 
        prev.map(seat => 
          String(seat.ShowtimeSeatId) === String(showtimeSeatId)
            ? { ...seat, Status: data.Status }
            : seat
        )
      );
      
      // Cập nhật cache
      setSeatCache(prev => {
        const showtimeId = selectedShowtimeId;
        if (showtimeId && prev[showtimeId]) {
          const updatedSeats = prev[showtimeId].map(seat =>
            String(seat.ShowtimeSeatId) === String(showtimeSeatId)
              ? { ...seat, Status: data.Status }
              : seat
          );
          return { ...prev, [showtimeId]: updatedSeats };
        }
        return prev;
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      
      let errorMessage = "Không thể cập nhật trạng thái ghế";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }, [selectedShowtimeId]);

  // Reset ghế về trạng thái trống
  const handleResetSeat = useCallback(async (showtimeSeatId, note) => {
    try {
      // Tìm ghế để lấy ShowtimeId và SeatId
      const seat = showtimeSeats.find(s => String(s.ShowtimeSeatId) === String(showtimeSeatId));
      if (!seat) {
        throw new Error("Không tìm thấy ghế");
      }
      
      const data = {
        ShowtimeId: seat.ShowtimeId,
        SeatId: seat.SeatId,
        Status: 'Available',
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: "admin"
      };
      
      await handleUpdateSeatStatus(showtimeSeatId, data);
      
      toast({
        title: "Đặt lại thành công",
        description: "Ghế đã được chuyển về trạng thái Trống",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("❌ Lỗi đặt lại:", error);
      toast({
        title: "Lỗi đặt lại",
        description: error.message || "Không thể đặt lại trạng thái ghế",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [showtimeSeats, handleUpdateSeatStatus, toast]);

  // Xóa trạng thái ghế
  const handleDeleteSeat = useCallback(async (showtimeSeatId) => {
    try {
      await deleteShowtimeSeat(showtimeSeatId);
      
      setShowtimeSeats(prev => 
        prev.filter(seat => String(seat.ShowtimeSeatId) !== String(showtimeSeatId))
      );
      
      setSeatCache(prev => {
        const showtimeId = selectedShowtimeId;
        if (showtimeId && prev[showtimeId]) {
          const updatedSeats = prev[showtimeId].filter(
            seat => String(seat.ShowtimeSeatId) !== String(showtimeSeatId)
          );
          return { ...prev, [showtimeId]: updatedSeats };
        }
        return prev;
      });
      
      toast({
        title: "Xóa thành công",
        description: "Đã xóa trạng thái ghế",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("❌ Lỗi xóa:", error);
      toast({
        title: "Lỗi xóa",
        description: "Không thể xóa trạng thái ghế",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, selectedShowtimeId]);

  // Chuyển đổi dữ liệu sang format cho SeatMap
  const seatMapData = useMemo(() => {
    if (!showtimeSeats || showtimeSeats.length === 0) {
      return [];
    }
    
    const seatMap = {};
    const rows = [];
    
    showtimeSeats.forEach((seat, index) => {
      let seatDetail = seat.Seat || {};
      let row = 'A';
      let number = index + 1;
      let seatId = seat.SeatId;
      
      if (seat.SeatId && typeof seat.SeatId === 'object' && seat.SeatId !== null) {
        seatDetail = seat.SeatId;
        row = seatDetail.Row || 'A';
        number = seatDetail.Number || (index + 1);
        seatId = seatDetail.SeatId || `${row}${number}`;
      } else if (seat.Seat && typeof seat.Seat === 'object') {
        seatDetail = seat.Seat;
        row = seatDetail.Row || 'A';
        number = seatDetail.Number || (index + 1);
        seatId = seatDetail.SeatId || `${row}${number}`;
      } else if (seat.SeatId && typeof seat.SeatId === 'string') {
        seatId = seat.SeatId;
        const match = String(seatId).match(/^([A-Z])(\d+)$/);
        if (match) {
          row = match[1];
          number = parseInt(match[2]);
        } else {
          const rowIndex = Math.floor(index / 10);
          const colIndex = index % 10;
          const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
          row = rowLetters[rowIndex % rowLetters.length] || 'A';
          number = colIndex + 1;
        }
      } else {
        const rowIndex = Math.floor(index / 10);
        const colIndex = index % 10;
        const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
        row = rowLetters[rowIndex % rowLetters.length] || 'A';
        number = colIndex + 1;
        seatId = `${row}${number}`;
      }
      
      const seatKey = `${row}${number}`;
      
      if (!seatMap[row]) {
        seatMap[row] = [];
        if (!rows.includes(row)) {
          rows.push(row);
        }
      }
      
      seatMap[row].push({
        id: seatKey,
        row: row,
        num: number,
        status: mapStatusToLocal(seat.Status),
        ticketCode: seat.TicketCode || null,
        customer: seat.CustomerName || null,
        heldSince: seat.HeldSince || null,
        note: seat.Note || "",
        showtimeSeatId: seat.ShowtimeSeatId || seat.id || index,
        showtimeId: seat.ShowtimeId,
        originalData: seat
      });
    });
    
    rows.sort();
    
    const result = [];
    rows.forEach(row => {
      if (seatMap[row]) {
        seatMap[row].sort((a, b) => a.num - b.num);
        result.push(...seatMap[row]);
      }
    });
    
    return result;
  }, [showtimeSeats]);

  // Lấy danh sách showtimes theo room và cinema
  const getShowtimesForRoom = useCallback((cinemaId, roomId) => {
    if (!cinemaId || !roomId) {
      return [];
    }
    
    const filtered = showtimes.filter(st => {
      const room = st.Room || st.RoomId;
      if (!room) return false;
      
      let roomCinemaId = null;
      if (room.CinemaId) roomCinemaId = room.CinemaId;
      else if (room.Cinema?.CinemaId) roomCinemaId = room.Cinema.CinemaId;
      
      let roomIdMatch = false;
      if (room.RoomId) roomIdMatch = String(room.RoomId) === String(roomId);
      else if (room.id) roomIdMatch = String(room.id) === String(roomId);
      
      const cinemaIdMatch = String(roomCinemaId) === String(cinemaId);
      return cinemaIdMatch && roomIdMatch;
    });
    
    return filtered.map(st => {
      const movie = st.Movie || st.MovieId || {};
      const room = st.Room || st.RoomId || {};
      
      return {
        id: st.ShowtimeId || st.id,
        ShowtimeId: st.ShowtimeId || st.id,
        movie: movie.Title || movie.title || 'Unknown Movie',
        time: st.StartTime || st.startTime || st.time,
        date: st.Date || st.date,
        price: st.Price || st.price || st.TicketPrice || 0,
        roomName: room.Name || room.name || 'Unknown Room',
        StartTime: st.StartTime || st.startTime,
        Movie: movie,
        Room: room,
        originalData: st
      };
    });
  }, [showtimes]);

  // Lấy danh sách rooms theo cinema
  const getRoomsByCinema = useCallback((cinemaId) => {
    if (!cinemaId) {
      return [];
    }
    
    const filtered = rooms.filter(room => {
      let roomCinemaId = null;
      if (room.CinemaId) roomCinemaId = room.CinemaId;
      else if (room.Cinema?.CinemaId) roomCinemaId = room.Cinema.CinemaId;
      return String(roomCinemaId) === String(cinemaId);
    });
    
    return filtered.map(room => {
      const roomId = room.RoomId || room.id;
      const seatCount = room.SeatCount || room.seatCount || room.capacity || room.Capacity || 0;
      
      return {
        id: roomId,
        RoomId: roomId,
        Name: room.Name || room.name || 'Unknown Room',
        name: room.Name || room.name || 'Unknown Room',
        SeatCount: seatCount,
        seatCount: seatCount,
        capacity: seatCount,
        RoomType: room.RoomType || room.roomType || 'Standard',
        Status: room.Status || room.status || 'Active',
        originalData: room
      };
    });
  }, [rooms]);

  // Thống kê số lượng ghế theo trạng thái
  const seatStats = useMemo(() => {
    const stats = {
      trong: 0,
      dat: 0,
      giu: 0,
      loi: 0,
      baoTri: 0
    };
    
    seatMapData.forEach(seat => {
      if (stats[seat.status] !== undefined) {
        stats[seat.status]++;
      }
    });
    
    return stats;
  }, [seatMapData]);

  // Clear cache
  const clearCache = useCallback(() => {
    setSeatCache({});
    setShowtimeSeats([]);
  }, []);

  return {
    // Data
    showtimeSeats,
    showtimes,
    cinemas,
    rooms,
    selectedShowtimeId,
    seatMapData,
    seatStats,
    
    // Loading states
    loading,
    isGenerating,
    isInitialLoad,
    
    // Actions
    loadSeatsForShowtime,
    handleGenerateSeats,
    handleUpdateSeatStatus,
    handleResetSeat,
    handleDeleteSeat,
    getShowtimesForRoom,
    getRoomsByCinema,
    clearCache,
    
    // Utilities
    mapStatusToLocal,
    mapStatusToApi,
    
    // Setters
    setSelectedShowtimeId,
    setShowtimeSeats
  };
}