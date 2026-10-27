import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import TicketApi from 'api/booking/TicketApi';
import UserApi from 'api/user/UserApi';
import MovieApi from 'api/catalog/MovieApi'; 
import RoomApi from 'api/cinema/RoomApi';
import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';
import OrderDetailApi from 'api/booking/OrderDetailApi';

export const useTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [users, setUsers] = useState({});

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return { datePart: '', timePart: '' };
    try {
      let date;
      if (typeof dateStr === 'string' && dateStr.includes(' ')) {
        date = new Date(dateStr.replace(' ', 'T'));
      } else {
        date = new Date(dateStr);
      }
      if (isNaN(date.getTime())) return { datePart: 'Invalid Date', timePart: '' };
      
      const timePart = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const datePart = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      return { datePart, timePart };
    } catch {
      return { datePart: dateStr, timePart: '' };
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await UserApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) data = data.data;
      if (!Array.isArray(data)) data = [];

      const userMap = {};
      data.forEach((user) => {
        const userId = user.UserId || user.id;
        if (userId) {
          userMap[userId] = {
            fullName: user.FullName || user.fullName || user.name || '',
            email: user.Email || user.email || '',
            phone: user.PhoneNumber || user.phone || '',
          };
        }
      });
      setUsers(userMap);
      return userMap;
    } catch (err) {
      console.error('❌ Lỗi tải users:', err);
      return {};
    }
  }, []);

  const fetchMoviesMap = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      const movieMap = {};
      data.forEach((movie) => {
        const movieId = movie.MovieId || movie.id;
        if (movieId) movieMap[movieId] = movie.Title || movie.title || 'Phim không tên';
      });
      return movieMap;
    } catch (err) {
      console.error('❌ Lỗi tải danh sách phim:', err);
      return {};
    }
  }, []);

  const fetchRoomsMap = useCallback(async () => {
    try {
      const response = await RoomApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      const roomMap = {};
      data.forEach((room) => {
        const roomId = room.RoomId || room.id;
        if (roomId) roomMap[roomId] = room.Name || room.name || 'Phòng không tên';
      });
      return roomMap;
    } catch (err) {
      console.error('❌ Lỗi tải danh sách phòng:', err);
      return {};
    }
  }, []);

  const fetchCombosForTickets = useCallback(async (ticketIds) => {
    try {
      const response = await OrderDetailApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      const comboMap = {};
      data.forEach((detail) => {
        let ticketId = detail.TicketId || detail.ticketId;
        if (typeof ticketId === 'object' && ticketId !== null) {
          ticketId = ticketId.TicketId || ticketId.id || null;
        }
        if (ticketId && detail.ItemId) {
          let comboName = '';
          const itemData = detail.ItemId || detail.itemId;
          if (typeof itemData === 'object' && itemData !== null) {
            comboName = itemData.Name || itemData.name || '';
          } else if (typeof itemData === 'number' || typeof itemData === 'string') {
            comboName = 'Combo';
          }
          if (!comboMap[ticketId] && comboName) {
            comboMap[ticketId] = comboName;
          }
        }
      });
      return comboMap;
    } catch (err) {
      console.error('❌ Lỗi lấy combo:', err);
      return {};
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const [userMap, movieMap, roomMap] = await Promise.all([
        fetchUsers(),
        fetchMoviesMap(),
        fetchRoomsMap(),
      ]);

      const response = await TicketApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) data = data.data;
      if (!Array.isArray(data)) data = [];

      const ticketIds = data.map((item) => item.TicketId || item.id).filter((id) => id);
      const comboMap = await fetchCombosForTickets(ticketIds);

      const mappedData = data.map((item) => {
        const showtime = item.showtime || {}; 
        const seat = item.seat || {};

        const userId = item.UserId || item.userId || '';
        const userInfo = userMap[userId] || {};

        let movieId = showtime.movie?.MovieId || '';
        const movieTitle = movieMap[movieId] || showtime.movie?.Title || 'Phim chưa xác định';

        let roomId = showtime.room?.RoomId || '';
        const roomName = roomMap[roomId] || showtime.room?.Name || 'Chưa xác định';

        const startTime = showtime.StartTime || '';
        const { datePart, timePart } = formatDate(startTime);

        const seatRow = seat.Row || '';
        const seatNumber = seat.Number || '';
        const seatLabel = seatRow + seatNumber || 'A1';
        
        let price = Number(showtime.Price) || 0; 
        if (price === 0 && item.Price) price = Number(item.Price);

        let ticketId = item.TicketId || item.id;
        if (typeof ticketId === 'object' && ticketId !== null) {
          ticketId = ticketId.TicketId || ticketId.id || null;
        }

        let comboName = comboMap[ticketId] || item.Combo || item.combo || 'Không có';

        let status = item.Status || item.status || 'Paid';
        if (status === 'Paid') status = 'Đã thanh toán';
        if (status === 'Pending') status = 'Chờ xử lý';
        if (status === 'Cancelled') status = 'Đã hủy';

        return {
          id: ticketId || Date.now(),
          code: `VE${String(ticketId).slice(-4)}`,
          userId: userId,
          customer: item.user?.FullName || userInfo.fullName || `Khách hàng #${userId}`,
          email: item.user?.Email || userInfo.email || '',
          phone: item.user?.PhoneNumber || userInfo.phone || '',
          movie: movieTitle,
          showtime: `${timePart} ${datePart} - ${roomName}`, // Vẫn giữ để tương thích cũ
          seat: seatLabel,
          price: price ? `${Number(price).toLocaleString('vi-VN')}đ` : '0đ',
          status: status,
          note: item.Note || item.note || '',
          combo: comboName,
          qr: item.QRCode || item.qr || `QR-${ticketId}`,
          bookingTime: item.BookingTime || '',
          createdAt: item.CreatedAt || '',
          showtimeId: showtime.ShowtimeId || item.ShowtimeId || null,
          seatId: seat.SeatId || item.SeatId || null,
          showtimeSeatId: item.ShowtimeSeatId || null,
          
          // ⭐ THÊM CÁC TRƯỜNG TÁCH BIỆT CHO QR MODAL
          room: roomName,
          date: datePart,
          time: timePart,
          total: price ? `${Number(price).toLocaleString('vi-VN')}` : '0',
        };
      });

      const sortedData = mappedData.sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : parseInt(a.id) || 0;
        const idB = typeof b.id === 'number' ? b.id : parseInt(b.id) || 0;
        return idB - idA;
      });

      setTickets(sortedData);
    } catch (err) {
      setError(err);
      console.error('❌ Lỗi tải vé:', err);
      toast({
        title: 'Lỗi tải dữ liệu',
        description: err.response?.data?.message || 'Không thể tải danh sách vé',
        status: 'error', duration: 3000, isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchUsers, fetchMoviesMap, fetchRoomsMap, formatDate, fetchCombosForTickets]);
  
  const createTicket = useCallback(async (data) => {
    try {
      const apiData = {
        ShowtimeId: data.showtimeId,
        SeatId: data.seatId,
        UserId: data.userId,
        Status: data.status === 'Đã thanh toán' ? 'Paid' : (data.status || 'Pending'),
      };
      const response = await TicketApi.create(apiData);
      const responseData = response?.data?.data || response?.data || response || {};
      const newId = responseData.TicketId || data.id || Date.now();
      const newTicket = { ...data, id: newId, code: `VE${String(newId).slice(-4)}` };
      setTickets((prev) => [newTicket, ...prev]);
      toast({ title: 'Thành công 🎉', description: `Tạo vé ${newTicket.code} thành công`, status: 'success', duration: 2000 });
      return newTicket;
    } catch (err) {
      toast({ title: 'Lỗi tạo vé', description: err.response?.data?.message || 'Không thể tạo vé', status: 'error' });
      throw err;
    }
  }, [toast]);

  const updateTicket = useCallback(async (id, data) => {
    try {
      if (data.oldShowtimeSeatId && data.newShowtimeSeatId && data.oldShowtimeSeatId !== data.newShowtimeSeatId) {
        try { await ShowtimeSeatApi.update(data.oldShowtimeSeatId, { Status: 'Available' }); } catch (err) {}
        try { await ShowtimeSeatApi.update(data.newShowtimeSeatId, { Status: 'Reserved' }); } catch (err) {}
      }
      const apiData = {
        ShowtimeId: data.showtimeId,
        SeatId: data.seatId,
        UserId: data.userId,
        Status: data.status === 'Đã thanh toán' ? 'Paid' : (data.status || 'Paid'),
        Note: data.note || '',
      };
      await TicketApi.update(id, apiData);
      setTickets((prev) => {
        const oldTicket = prev.find((t) => t.id === id);
        if (!oldTicket) return prev;
        const updated = { ...oldTicket, seat: data.seat || oldTicket.seat, status: data.status || oldTicket.status, note: data.note || oldTicket.note, combo: data.combo || oldTicket.combo };
        return [updated, ...prev.filter((t) => t.id !== id)];
      });
      toast({ title: 'Thành công', description: 'Cập nhật vé thành công', status: 'success' });
      return true;
    } catch (err) {
      toast({ title: 'Lỗi cập nhật', description: err.response?.data?.message || 'Không thể cập nhật vé', status: 'error' });
      throw err;
    }
  }, [toast]);

  const deleteTicket = useCallback(async (id) => {
    try {
      await TicketApi.delete(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Thành công', description: 'Xóa vé thành công', status: 'success' });
    } catch (err) {
      toast({ title: 'Lỗi xóa vé', description: err.response?.data?.message || 'Không thể xóa vé', status: 'error' });
      throw err;
    }
  }, [toast]);

  const cancelTicket = useCallback(async (id, showtimeSeatId) => {
    try {
      await TicketApi.delete(id);
      if (showtimeSeatId) {
        try { await ShowtimeSeatApi.update(showtimeSeatId, { Status: 'Available' }); } catch (seatErr) {}
      }
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Thành công', description: 'Hủy vé thành công', status: 'success' });
    } catch (err) {
      toast({ title: 'Lỗi hủy vé', description: err.response?.data?.message || 'Không thể hủy vé', status: 'error' });
      throw err;
    }
  }, [toast]);

  return {
    tickets, loading, error, users,
    fetchTickets, createTicket, updateTicket, deleteTicket, cancelTicket,
  };
};