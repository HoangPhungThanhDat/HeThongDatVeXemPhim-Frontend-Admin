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
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const seatCache = useRef({});

  useEffect(() => {
    if (roomId && roomId !== selectedRoomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId]);

  const loadCinemas = useCallback(async () => {
    try {
      const response = await RoomSeatApi.getCinemas();
      const data = response?.data?.data || response?.data || [];
      setCinemas(data);
      if (data.length > 0 && !selectedCinemaId) setSelectedCinemaId(data[0].id);
      return data;
    } catch (err) {
      toast({ title: 'Lỗi tải rạp', status: 'error', duration: 3000, isClosable: true });
      return [];
    }
  }, [toast, selectedCinemaId]);

  const loadRooms = useCallback(async (cinemaId) => {
    if (!cinemaId) return [];
    try {
      const response = await RoomSeatApi.getRooms(cinemaId);
      const data = response?.data?.data || response?.data || [];
      setRooms(data);
      if (data.length > 0 && !selectedRoomId) setSelectedRoomId(data[0].id);
      return data;
    } catch (err) {
      toast({ title: 'Lỗi tải phòng', status: 'error', duration: 3000, isClosable: true });
      return [];
    }
  }, [toast, selectedRoomId]);

  const buildGrid = useCallback((seats) => {
    if (!seats || seats.length === 0) return [];
    const rows = [...new Set(seats.map((s) => s.row))].sort();
    const cols = [...new Set(seats.map((s) => s.number))].sort();
    if (rows.length === 0 || cols.length === 0) return [];

    return rows.map((row) => cols.map((col) => {
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
    }));
  }, []);

  const loadSeats = useCallback(async (roomIdToLoad, forceRefresh = false) => {
    if (!roomIdToLoad) { setSeatsData([]); setRoomSeats([]); setLoading(false); return; }

    try {
      setLoading(true);
      if (!forceRefresh && seatCache.current[roomIdToLoad]) {
        const cached = seatCache.current[roomIdToLoad];
        setRoomSeats(cached.seats || []);
        setSeatsData(cached.grid || []);
        if (cached.room) setRoom(cached.room);
        setIsInitialized(true);
        setLoading(false);
        return;
      }

      const response = await RoomSeatApi.getSeats(roomIdToLoad);
      const result = response?.data?.data || response?.data || {};

      let roomInfo = null;
      if (result.room) {
        roomInfo = { id: result.room.id, name: result.room.name, room_type: result.room.room_type, seat_count: result.room.seat_count, status: result.room.status };
        setRoom(roomInfo);
      }

      const formattedSeats = result.seats || [];
      setRoomSeats(formattedSeats);
      setSeatsData(buildGrid(formattedSeats));

      seatCache.current[roomIdToLoad] = { seats: formattedSeats, grid: buildGrid(formattedSeats), room: roomInfo };
      setIsInitialized(true);
    } catch (err) {
      console.error(`❌ Lỗi load ghế phòng ${roomIdToLoad}:`, err);
      toast({ title: 'Lỗi khi tải ghế', description: err.response?.data?.message || 'Vui lòng thử lại', status: 'error', duration: 3000, isClosable: true });
      setSeatsData([]); setRoomSeats([]);
    } finally {
      setLoading(false);
    }
  }, [toast, buildGrid]);

  const handleApiError = (err, actionName) => {
    console.error(`🔥🔥🔥 [useSeatManagement] Lỗi ${actionName}:`);
    console.error("👉 Response từ Backend:", JSON.stringify(err.response?.data, null, 2));
    console.error("👉 Status Code:", err.response?.status);
    console.error("👉 URL:", err.config?.url);
    console.error("👉 Payload đã gửi:", err.config?.data);

    const errorMsg = err.response?.data?.message 
      || err.response?.data?.errors?.row_count?.[0] 
      || err.response?.data?.errors?.col_count?.[0]
      || err.message
      || 'Lỗi không xác định';
      
    toast({ title: `❌ Lỗi ${actionName}`, description: errorMsg, status: 'error', duration: 5000, isClosable: true });
  };

  // ✅ THÊM HÀNG & CỘT CÙNG LÚC - Dùng API gộp
  const handleAddSeats = useCallback(async (rowCount, colCount, position = 'end') => {
    const currentRoomId = roomId || selectedRoomId;
    try {
      console.log(`🚀 [handleAddSeats] Thêm ${rowCount} hàng, ${colCount} cột cho phòng: ${currentRoomId}`);
      
      if (!currentRoomId) {
        toast({ title: '❌ Lỗi', description: 'Chưa chọn phòng chiếu', status: 'error', duration: 3000 });
        throw new Error('Chưa chọn phòng');
      }

      // ✅ Gọi 1 API duy nhất
      const response = await RoomSeatApi.addSeats(currentRoomId, rowCount, colCount, position);

      delete seatCache.current[currentRoomId];
      
      toast({ title: '✅ Thêm ghế thành công', description: response?.data?.message || `Đã thêm ${rowCount} hàng và ${colCount} cột`, status: 'success', duration: 3000, isClosable: true });
      
      await loadSeats(currentRoomId, true);
      return true;
    } catch (err) {
      handleApiError(err, 'thêm ghế');
      throw err;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const handleAddRows = useCallback(async (count, position = 'end') => {
    return handleAddSeats(count, 0, position);
  }, [handleAddSeats]);

  const handleAddCols = useCallback(async (count, position = 'end') => {
    return handleAddSeats(0, count, position);
  }, [handleAddSeats]);

  const handleDeleteRow = useCallback(async (row) => {
    const currentRoomId = roomId || selectedRoomId;
    try {
      const response = await RoomSeatApi.deleteRow(currentRoomId, row);
      delete seatCache.current[currentRoomId];
      toast({ title: '✅ Xóa hàng thành công', description: response?.data?.message || `Đã xóa hàng ${row}`, status: 'success', duration: 3000, isClosable: true });
      await loadSeats(currentRoomId, true);
      return response;
    } catch (err) {
      handleApiError(err, 'xóa hàng');
      throw err;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const handleDeleteCol = useCallback(async (col) => {
    const currentRoomId = roomId || selectedRoomId;
    try {
      const response = await RoomSeatApi.deleteCol(currentRoomId, col);
      delete seatCache.current[currentRoomId];
      toast({ title: '✅ Xóa cột thành công', description: response?.data?.message || `Đã xóa cột ${col}`, status: 'success', duration: 3000, isClosable: true });
      await loadSeats(currentRoomId, true);
      return response;
    } catch (err) {
      handleApiError(err, 'xóa cột');
      throw err;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const handleSaveSeat = useCallback(async (updatedSeat) => {
    try {
      const seatId = updatedSeat.SeatId || updatedSeat.id;
      const payload = {
        seat_type: updatedSeat.seat_type || updatedSeat.SeatType || 'Normal',
        status: updatedSeat.Status || updatedSeat.status || 'Available',
      };
      await RoomSeatApi.updateSeat(seatId, payload);
      const currentRoomId = roomId || selectedRoomId;
      if (currentRoomId) delete seatCache.current[currentRoomId];
      toast({ title: '✅ Cập nhật ghế thành công', status: 'success', duration: 3000, isClosable: true });
      await loadSeats(currentRoomId, true);
    } catch (err) {
      handleApiError(err, 'cập nhật ghế');
      throw err;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const handleDeleteSeat = useCallback(async (seatId) => {
    try {
      await RoomSeatApi.deleteSeat(seatId);
      const currentRoomId = roomId || selectedRoomId;
      if (currentRoomId) delete seatCache.current[currentRoomId];
      toast({ title: '✅ Xóa ghế thành công', status: 'success', duration: 3000, isClosable: true });
      await loadSeats(currentRoomId, true);
      return true;
    } catch (err) {
      handleApiError(err, 'xóa ghế');
      return false;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const handleResetSeats = useCallback(async () => {
    const currentRoomId = roomId || selectedRoomId;
    try {
      await RoomSeatApi.resetSeats(currentRoomId);
      delete seatCache.current[currentRoomId];
      toast({ title: '✅ Reset ghế thành công', status: 'success', duration: 3000, isClosable: true });
      await loadSeats(currentRoomId, true);
    } catch (err) {
      handleApiError(err, 'reset ghế');
      throw err;
    }
  }, [roomId, selectedRoomId, loadSeats, toast]);

  const clearCache = useCallback(() => { seatCache.current = {}; }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const cinemasData = await loadCinemas();
      if (cinemasData.length > 0) {
        const firstCinema = cinemasData[0];
        setSelectedCinemaId(firstCinema.id);
        const roomsData = await loadRooms(firstCinema.id);
        
        if (roomsData.length > 0 && !roomId) {
          const firstRoom = roomsData[0];
          setSelectedRoomId(firstRoom.id);
          await loadSeats(firstRoom.id, true);
        } else if (roomId) {
          await loadSeats(roomId, true);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleCinemaChange = useCallback(async (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedRoomId(null); setSeatsData([]); setRoomSeats([]);
    const roomsData = await loadRooms(cinemaId);
    if (roomsData.length > 0) {
      const firstRoom = roomsData[0];
      setSelectedRoomId(firstRoom.id);
      await loadSeats(firstRoom.id, true);
    }
  }, [loadRooms, loadSeats]);

  const handleRoomChange = useCallback(async (newRoomId) => {
    setSelectedRoomId(newRoomId); setSeatsData([]); setRoomSeats([]);
    await loadSeats(newRoomId, true);
  }, [loadSeats]);

  const flat = seatsData.flat();
  const stats = {
    total: flat.length, booked: flat.filter((s) => s.booked).length, empty: flat.filter((s) => !s.booked).length,
    regular: flat.filter((s) => s.type === 'regular').length, vip: flat.filter((s) => s.type === 'vip').length,
    sweet: flat.filter((s) => s.type === 'sweetbox' || s.type === 'couple').length, access: flat.filter((s) => s.type === 'accessible').length,
  };

  const handleSeatEdit = (seat) => { setSelectedSeat(seat); return seat; };
  const zoomIn = useCallback(() => setScale((s) => Math.min(1.5, s + 0.1)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(0.6, s - 0.1)), []);

  return {
    seatsData, setSeatsData, room, roomSeats, cinemas, rooms, selectedCinemaId, selectedRoomId,
    loading, isGenerating, scale, filter, setFilter, selectedSeat, setSelectedSeat, stats, isInitialized,
    seatCache: seatCache.current, loadCinemas, loadRooms, loadSeats, handleCinemaChange, handleRoomChange,
    handleSeatEdit, handleSaveSeat, 
    handleAddSeats, handleAddRows, handleAddCols,
    handleDeleteRow, handleDeleteCol,
    handleDeleteSeat, handleResetSeats, clearCache, zoomIn, zoomOut,
  };
}