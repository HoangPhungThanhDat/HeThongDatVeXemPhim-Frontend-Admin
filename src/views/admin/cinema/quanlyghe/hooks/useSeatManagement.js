// src/views/admin/quanlyghe/hooks/useSeatManagement.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import RoomSeatApi from 'api/cinema/RoomSeatApi';
import { ROW_LABELS } from '../constants';

export function useSeatManagement(roomId, roomData) {
  const toast = useToast();
  const [seatsData, setSeatsData] = useState([]);
  const [room, setRoom] = useState(roomData || null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const loadTimeoutRef = useRef(null);

  // ✅ Cache để lưu dữ liệu ghế theo phòng
  const seatCache = useRef({});

  // Lấy danh sách rạp
  const loadCinemas = useCallback(async () => {
    try {
      const response = await RoomSeatApi.getCinemas();
      const data = response?.data?.data || response?.data || [];
      setCinemas(data);

      if (data.length > 0 && !selectedCinemaId) {
        setSelectedCinemaId(data[0].id);
      }
      return data;
    } catch (err) {
      console.error('❌ Lỗi load rạp:', err);
      toast({
        title: 'Lỗi tải rạp',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [];
    }
  }, [toast, selectedCinemaId]);

  // Lấy danh sách phòng theo rạp
  const loadRooms = useCallback(
    async (cinemaId) => {
      if (!cinemaId) return [];

      try {
        const response = await RoomSeatApi.getRooms(cinemaId);
        const data = response?.data?.data || response?.data || [];
        setRooms(data);

        if (data.length > 0 && !selectedRoomId) {
          setSelectedRoomId(data[0].id);
        }
        return data;
      } catch (err) {
        console.error('❌ Lỗi load phòng:', err);
        toast({
          title: 'Lỗi tải phòng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return [];
      }
    },
    [toast, selectedRoomId],
  );

  // ✅ Build grid từ dữ liệu ghế
  const buildGrid = useCallback((seats) => {
    if (!seats || seats.length === 0) {
      return [];
    }

    const rows = [...new Set(seats.map((s) => s.row))].sort();
    const cols = [...new Set(seats.map((s) => s.number))].sort();

    if (rows.length === 0 || cols.length === 0) {
      return [];
    }

    const grid = rows.map((row) => {
      return cols.map((col) => {
        const existing = seats.find((s) => s.row === row && s.number === col);
        return {
          id: existing ? existing.id : `${row}${col}`,
          row: ROW_LABELS.indexOf(row),
          col: col - 1,
          type: existing?.seat_type?.toLowerCase() || 'regular',
          booked: existing?.status !== 'Available',
          SeatId: existing?.id,
          Status: existing?.status || 'Available',
          Row: row,
          Number: col,
          seat_type: existing?.seat_type || 'Normal',
          num: col,
          SeatType: existing?.seat_type || 'Normal',
        };
      });
    });

    return grid;
  }, []);

  // ✅ Load ghế từ API - CÓ CACHE THEO PHÒNG
  const loadSeats = useCallback(
    async (roomId, forceRefresh = false) => {
      if (!roomId) {
        setSeatsData([]);
        setRoomSeats([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          '🔄 Đang tải ghế cho phòng:',
          roomId,
          'forceRefresh:',
          forceRefresh,
        );

        if (!forceRefresh && seatCache.current[roomId]) {
          console.log(`✅ Dùng cache cho phòng ${roomId}`);
          const cached = seatCache.current[roomId];
          setRoomSeats(cached.seats || []);
          setSeatsData(cached.grid || []);
          if (cached.room) setRoom(cached.room);
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        const response = await RoomSeatApi.getSeats(roomId);
        const result = response?.data?.data || response?.data || {};

        console.log(`✅ Dữ liệu ghế phòng ${roomId}:`, result);

        let roomInfo = null;
        if (result.room) {
          roomInfo = {
            id: result.room.id,
            name: result.room.name,
            room_type: result.room.room_type,
            seat_count: result.room.seat_count,
            status: result.room.status,
          };
          setRoom(roomInfo);
        }

        const formattedSeats = result.seats || [];
        setRoomSeats(formattedSeats);

        const grid = buildGrid(formattedSeats);
        setSeatsData(grid);

        seatCache.current[roomId] = {
          seats: formattedSeats,
          grid: grid,
          room: roomInfo,
        };

        setIsInitialized(true);
        console.log(
          `✅ Đã load ${formattedSeats.length} ghế cho phòng ${roomId}`,
        );
      } catch (err) {
        console.error(`❌ Lỗi load ghế phòng ${roomId}:`, err);
        toast({
          title: 'Lỗi khi tải ghế',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setSeatsData([]);
        setRoomSeats([]);
      } finally {
        setLoading(false);
      }
    },
    [toast, buildGrid],
  );

  // ✅ Cập nhật ghế
  const handleSaveSeat = useCallback(
    async (updatedSeat) => {
      try {
        const seatId = updatedSeat.SeatId || updatedSeat.id;
        if (!seatId) {
          toast({
            title: 'Không tìm thấy ghế',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const payload = {
          seat_type: updatedSeat.seat_type || updatedSeat.SeatType || 'Normal',
          status: updatedSeat.Status || updatedSeat.status || 'Available',
        };

        console.log('📤 Cập nhật ghế:', {
          seatId,
          payload,
          roomId: selectedRoomId,
        });

        await RoomSeatApi.updateSeat(seatId, payload);

        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Cập nhật ghế thành công',
          description: `Ghế ${updatedSeat.Row || updatedSeat.row}${updatedSeat.Number || updatedSeat.num} đã được cập nhật`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await loadSeats(selectedRoomId, true);
      } catch (err) {
        console.error('❌ Lỗi cập nhật ghế:', err);
        toast({
          title: '❌ Lỗi cập nhật ghế',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw err;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Xóa ghế - QUAN TRỌNG: Xóa cache và reload
  const handleDeleteSeat = useCallback(
    async (seatId) => {
      try {
        if (!seatId) {
          toast({
            title: 'Không tìm thấy ghế để xóa',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }

        console.log(
          `🗑️ Đang xóa ghế ID: ${seatId} trong phòng: ${selectedRoomId}`,
        );

        await RoomSeatApi.deleteSeat(seatId);

        // ✅ Xóa cache của phòng hiện tại
        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Xóa ghế thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // ✅ Load lại dữ liệu cho phòng hiện tại
        await loadSeats(selectedRoomId, true);

        return true;
      } catch (err) {
        console.error('❌ Lỗi xóa ghế:', err);
        toast({
          title: '❌ Lỗi xóa ghế',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Thêm hàng
  const handleAddRows = useCallback(
    async (count, position = 'end') => {
      try {
        const response = await RoomSeatApi.addRows(
          selectedRoomId,
          count,
          position,
        );

        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Thêm hàng thành công',
          description: response?.data?.message || `Đã thêm ${count} hàng`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await loadSeats(selectedRoomId, true);
        return response;
      } catch (err) {
        console.error('❌ Lỗi thêm hàng:', err);
        toast({
          title: '❌ Lỗi thêm hàng',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw err;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Thêm cột
  const handleAddCols = useCallback(
    async (count, position = 'end') => {
      try {
        const response = await RoomSeatApi.addCols(
          selectedRoomId,
          count,
          position,
        );

        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Thêm cột thành công',
          description: response?.data?.message || `Đã thêm ${count} cột`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await loadSeats(selectedRoomId, true);
        return response;
      } catch (err) {
        console.error('❌ Lỗi thêm cột:', err);
        toast({
          title: '❌ Lỗi thêm cột',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw err;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Xóa hàng
  const handleDeleteRow = useCallback(
    async (row) => {
      try {
        const response = await RoomSeatApi.deleteRow(selectedRoomId, row);

        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Xóa hàng thành công',
          description: response?.data?.message || `Đã xóa hàng ${row}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await loadSeats(selectedRoomId, true);
        return response;
      } catch (err) {
        console.error('❌ Lỗi xóa hàng:', err);
        toast({
          title: '❌ Lỗi xóa hàng',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw err;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Xóa cột
  const handleDeleteCol = useCallback(
    async (col) => {
      try {
        const response = await RoomSeatApi.deleteCol(selectedRoomId, col);

        if (selectedRoomId) {
          delete seatCache.current[selectedRoomId];
        }

        toast({
          title: '✅ Xóa cột thành công',
          description: response?.data?.message || `Đã xóa cột ${col}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await loadSeats(selectedRoomId, true);
        return response;
      } catch (err) {
        console.error('❌ Lỗi xóa cột:', err);
        toast({
          title: '❌ Lỗi xóa cột',
          description: err.response?.data?.message || 'Vui lòng thử lại',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw err;
      }
    },
    [selectedRoomId, loadSeats, toast],
  );

  // ✅ Reset ghế
  const handleResetSeats = useCallback(async () => {
    try {
      await RoomSeatApi.resetSeats(selectedRoomId);

      if (selectedRoomId) {
        delete seatCache.current[selectedRoomId];
      }

      toast({
        title: '✅ Reset ghế thành công',
        description: 'Đã reset tất cả ghế về trạng thái trống',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await loadSeats(selectedRoomId, true);
    } catch (err) {
      console.error('❌ Lỗi reset ghế:', err);
      toast({
        title: '❌ Lỗi reset ghế',
        description: err.response?.data?.message || 'Vui lòng thử lại',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw err;
    }
  }, [selectedRoomId, loadSeats, toast]);

  // ✅ Clear cache
  const clearCache = useCallback(() => {
    seatCache.current = {};
  }, []);

  // ✅ Khởi tạo dữ liệu
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const cinemasData = await loadCinemas();
      if (cinemasData.length > 0) {
        const firstCinema = cinemasData[0];
        setSelectedCinemaId(firstCinema.id);
        const roomsData = await loadRooms(firstCinema.id);
        if (roomsData.length > 0) {
          const firstRoom = roomsData[0];
          setSelectedRoomId(firstRoom.id);
          await loadSeats(firstRoom.id, true);
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  // ✅ Xử lý chọn rạp
  const handleCinemaChange = useCallback(
    async (cinemaId) => {
      setSelectedCinemaId(cinemaId);
      setSelectedRoomId(null);
      setSeatsData([]);
      setRoomSeats([]);

      const roomsData = await loadRooms(cinemaId);
      if (roomsData.length > 0) {
        const firstRoom = roomsData[0];
        setSelectedRoomId(firstRoom.id);
        await loadSeats(firstRoom.id, true);
      }
    },
    [loadRooms, loadSeats],
  );

  // ✅ Xử lý chọn phòng
  const handleRoomChange = useCallback(
    async (roomId) => {
      setSelectedRoomId(roomId);
      setSeatsData([]);
      setRoomSeats([]);
      await loadSeats(roomId, true);
    },
    [loadSeats],
  );

  const flat = seatsData.flat();
  const stats = {
    total: flat.length,
    booked: flat.filter((s) => s.booked).length,
    empty: flat.filter((s) => !s.booked).length,
    regular: flat.filter((s) => s.type === 'regular').length,
    vip: flat.filter((s) => s.type === 'vip').length,
    sweet: flat.filter((s) => s.type === 'sweetbox' || s.type === 'couple')
      .length,
    access: flat.filter((s) => s.type === 'accessible').length,
  };

  const handleSeatEdit = (seat) => {
    setSelectedSeat(seat);
    return seat;
  };

  const zoomIn = useCallback(() => setScale((s) => Math.min(1.5, s + 0.1)), []);
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(0.6, s - 0.1)),
    [],
  );

  return {
    // Data
    seatsData,
    setSeatsData,
    room,
    roomSeats,
    cinemas,
    rooms,
    selectedCinemaId,
    selectedRoomId,
    loading,
    isGenerating,
    scale,
    filter,
    setFilter,
    selectedSeat,
    setSelectedSeat,
    stats,
    isInitialized,
    seatCache: seatCache.current,

    // Actions
    loadCinemas,
    loadRooms,
    loadSeats,
    handleCinemaChange,
    handleRoomChange,
    handleSeatEdit,
    handleSaveSeat,
    handleAddRows,
    handleAddCols,
    handleDeleteRow,
    handleDeleteCol,
    handleDeleteSeat,
    handleResetSeats,
    clearCache,
    zoomIn,
    zoomOut,
  };
}
