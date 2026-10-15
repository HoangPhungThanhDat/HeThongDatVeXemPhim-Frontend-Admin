// src/views/admin/quanlyve/hooks/useTicket.js

import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import TicketApi from 'api/booking/TicketApi';
import UserApi from 'api/user/UserApi';
import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';
import OrderDetailApi from 'api/booking/OrderDetailApi';

export const useTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [users, setUsers] = useState({});

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split(' ');
      const dateParts = parts[0]?.split('-') || [];
      const timeParts = parts[1]?.split(':') || ['00', '00', '00'];

      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const year = parseInt(dateParts[2]);
        const hour = parseInt(timeParts[0]) || 0;
        const minute = parseInt(timeParts[1]) || 0;
        const second = parseInt(timeParts[2]) || 0;
        const date = new Date(year, month, day, hour, minute, second);
        if (!isNaN(date)) {
          return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
      }

      const date = new Date(dateStr);
      if (!isNaN(date)) {
        return date.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await UserApi.getAll();
      console.log('📦 Users API response:', response);

      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) {
        data = data.data;
      }
      if (!Array.isArray(data)) {
        data = [];
      }

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

      console.log('✅ User map:', userMap);
      setUsers(userMap);
      return userMap;
    } catch (err) {
      console.error('❌ Lỗi tải users:', err);
      return {};
    }
  }, []);

  const fetchCombosForTickets = useCallback(async (ticketIds) => {
    try {
      const response = await OrderDetailApi.getAll();
      console.log('📦 OrderDetails response:', response);

      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      console.log('📦 OrderDetails count:', data.length);

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
            if (comboName) {
              console.log(
                `🍿 Found combo for ticket ${ticketId}: "${comboName}"`,
              );
            }
          } else if (
            typeof itemData === 'number' ||
            typeof itemData === 'string'
          ) {
            console.log(`⚠️ ItemId is ID for ticket ${ticketId}: ${itemData}`);
            comboName = 'Combo';
          }

          if (!comboMap[ticketId] && comboName) {
            comboMap[ticketId] = comboName;
          }
        }
      });

      console.log('✅ Final Combo map:', comboMap);
      return comboMap;
    } catch (err) {
      console.error('❌ Lỗi lấy combo:', err);
      return {};
    }
  }, []);

  // ✅ SỬA: fetchTickets - Sắp xếp theo ID giảm dần (mới nhất lên đầu)
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const userMap = await fetchUsers();

      const response = await TicketApi.getAll();
      console.log('📦 Tickets API response:', response);

      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) {
        data = data.data;
      }
      if (!Array.isArray(data)) {
        data = [];
      }

      console.log('📦 Raw data length:', data.length);

      const ticketIds = data
        .map((item) => {
          let id = item.TicketId || item.id;
          if (typeof id === 'object' && id !== null) {
            id = id.TicketId || id.id || null;
          }
          return id;
        })
        .filter((id) => id);

      console.log('📦 Ticket IDs for combo:', ticketIds);

      const comboMap = await fetchCombosForTickets(ticketIds);
      console.log('📦 Combo map result:', comboMap);

      // Map dữ liệu
      const mappedData = data.map((item) => {
        const showtime = item.ShowtimeId || {};
        const movie = showtime.MovieId || {};
        const room = showtime.RoomId || {};
        const seat = item.SeatId || {};

        const userId = item.UserId || item.userId || '';
        const userInfo = userMap[userId] || {};

        const startTime = showtime.StartTime || '';
        const formattedTime = formatDate(startTime);
        let roomName = '';

        if (room && typeof room === 'object') {
          roomName = room.Name || room.name || '';
        } else if (room) {
          roomName = String(room);
        }

        const seatRow = seat.Row || '';
        const seatNumber = seat.Number || '';
        const seatLabel = seatRow + seatNumber || 'A1';
        const price = showtime.Price || 0;

        let ticketId = item.TicketId || item.id;
        if (typeof ticketId === 'object' && ticketId !== null) {
          ticketId = ticketId.TicketId || ticketId.id || null;
        }

        let comboName = comboMap[ticketId] || '';
        if (!comboName) {
          comboName = item.Combo || item.combo || '';
        }

        const showtimeId = showtime.ShowtimeId || item.ShowtimeId || null;
        const seatId = seat.SeatId || item.SeatId || null;
        const showtimeSeatId = item.ShowtimeSeatId || null;

        const createdAt =
          item.CreatedAt || item.createdAt || new Date().toISOString();
        const id = ticketId || Date.now();

        return {
          id: id,
          code: `VE${String(id).slice(-4)}`,
          userId: userId,
          customer:
            userInfo.fullName ||
            userInfo.name ||
            `Khách hàng #${userId}` ||
            'Khách hàng',
          email: userInfo.email || '',
          phone: userInfo.phone || '',
          movie: movie.Title || movie.title || 'Phim',
          showtime: formattedTime ? `${formattedTime} - Phòng ${roomName}` : '',
          seat: seatLabel,
          price: price ? `${Number(price).toLocaleString()}đ` : '0đ',
          status: item.Status || item.status || 'Đã thanh toán',
          note: item.Note || item.note || '',
          combo: comboName || 'Không có',
          qr: item.QRCode || item.qr || `QR-${item.TicketId || item.id}`,
          bookingTime: item.BookingTime || item.bookingTime || '',
          createdAt: createdAt,
          updatedAt: item.UpdatedAt || item.updatedAt || '',
          showtimeId: showtimeId,
          seatId: seatId,
          showtimeSeatId: showtimeSeatId,
        };
      });

      // ✅ SẮP XẾP: Dùng ID giảm dần (mới nhất = ID lớn nhất)
      const sortedData = mappedData.sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : parseInt(a.id) || 0;
        const idB = typeof b.id === 'number' ? b.id : parseInt(b.id) || 0;
        return idB - idA;
      });

      console.log(`✅ Loaded ${sortedData.length} tickets (sorted by ID desc)`);
      console.log(
        '📊 Top 3 newest tickets:',
        sortedData.slice(0, 3).map((t) => ({
          id: t.id,
          code: t.code,
          customer: t.customer,
        })),
      );

      setTickets(sortedData);
    } catch (err) {
      setError(err);
      console.error('❌ Lỗi tải vé:', err);
      toast({
        title: 'Lỗi tải dữ liệu',
        description:
          err.response?.data?.message || 'Không thể tải danh sách vé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchUsers, formatDate, fetchCombosForTickets]);

  // ✅ createTicket - thêm vào đầu danh sách với ID lớn nhất
  const createTicket = useCallback(
    async (data) => {
      try {
        console.log('📤 Creating ticket with data:', data);

        const apiData = {
          ShowtimeId: data.showtimeId,
          SeatId: data.seatId,
          UserId: data.userId,
          Status: data.status || 'Pending',
        };

        console.log('📤 API Data:', apiData);

        const response = await TicketApi.create(apiData);
        console.log('✅ API Response:', response);

        const responseData =
          response?.data?.data || response?.data || response || {};

        // ✅ Lấy ID từ response
        const newId = responseData.TicketId || data.id || Date.now();
        const now = new Date().toISOString();

        const newTicket = {
          id: newId,
          code:
            responseData.code || data.code || `VE${String(newId).slice(-4)}`,
          userId: data.userId,
          customer: data.customer || 'Khách hàng',
          email: data.email || '',
          phone: data.phone || '',
          movie: data.movie || 'Phim',
          showtime: data.showtime || '',
          seat: data.seat || 'A1',
          price: data.price || '0đ',
          status: data.status || 'Đã thanh toán',
          note: data.note || '',
          combo: data.combo || 'Không có',
          qr: responseData.QRCode || data.qr || `QR-${String(newId).slice(-4)}`,
          bookingTime: responseData.BookingTime || now,
          showtimeId: data.showtimeId || null,
          seatId: data.seatId || null,
          showtimeSeatId: data.showtimeSeatId || null,
          createdAt: now,
          updatedAt: now,
        };

        console.log('✅ New ticket object:', newTicket);

        // ✅ THÊM VÀO ĐẦU DANH SÁCH (vì ID mới sẽ là lớn nhất)
        setTickets((prev) => {
          // Kiểm tra trùng lặp
          const exists = prev.some((t) => t.id === newTicket.id);
          if (exists) {
            console.log('⚠️ Ticket already exists, updating instead');
            return prev.map((t) => (t.id === newTicket.id ? newTicket : t));
          }
          // Thêm mới vào đầu
          console.log('✅ Adding new ticket to top of list');
          return [newTicket, ...prev];
        });

        toast({
          title: 'Thành công 🎉',
          description: `Tạo vé ${newTicket.code} thành công`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        return newTicket;
      } catch (err) {
        console.error(
          '❌ Lỗi tạo vé trong useTicket:',
          err.response?.data || err,
        );
        toast({
          title: 'Lỗi tạo vé',
          description: err.response?.data?.message || 'Không thể tạo vé',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast],
  );

  // ✅ updateTicket - cập nhật và đưa lên đầu
  const updateTicket = useCallback(
    async (id, data) => {
      try {
        console.log('📤 Updating ticket:', { id, data });

        if (
          data.oldShowtimeSeatId &&
          data.newShowtimeSeatId &&
          data.oldShowtimeSeatId !== data.newShowtimeSeatId
        ) {
          console.log('🔄 Seat changed, updating seat statuses');

          try {
            await ShowtimeSeatApi.update(data.oldShowtimeSeatId, {
              Status: 'Available',
            });
            console.log('✅ Old seat restored to Available');
          } catch (err) {
            console.error('❌ Lỗi trả ghế cũ:', err);
          }

          try {
            await ShowtimeSeatApi.update(data.newShowtimeSeatId, {
              Status: 'Reserved',
            });
            console.log('✅ New seat set to Reserved');
          } catch (err) {
            console.error('❌ Lỗi đặt ghế mới:', err);
          }
        }

        const apiData = {
          ShowtimeId: data.showtimeId,
          SeatId: data.seatId,
          UserId: data.userId,
          Status: data.status || 'Paid',
          Note: data.note || '',
        };

        console.log('📤 API Data:', apiData);

        const response = await TicketApi.update(id, apiData);
        console.log('✅ Update response:', response);

        // ✅ Cập nhật state: cập nhật ticket và đưa lên đầu
        setTickets((prev) => {
          const oldTicket = prev.find((t) => t.id === id);
          if (!oldTicket) return prev;

          const updatedTicket = {
            ...oldTicket,
            seat: data.seat || oldTicket.seat,
            status: data.status || oldTicket.status,
            note: data.note || oldTicket.note,
            combo: data.combo || oldTicket.combo || 'Không có',
            seatId: data.seatId || oldTicket.seatId,
            showtimeSeatId: data.newShowtimeSeatId || oldTicket.showtimeSeatId,
            updatedAt: new Date().toISOString(),
          };

          // Lọc bỏ ticket cũ và thêm ticket mới vào đầu
          const filtered = prev.filter((t) => t.id !== id);
          return [updatedTicket, ...filtered];
        });

        toast({
          title: 'Thành công',
          description: 'Cập nhật vé thành công',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return response.data;
      } catch (err) {
        console.error('❌ Lỗi cập nhật:', err);
        console.error('❌ Error response:', err.response?.data);
        toast({
          title: 'Lỗi cập nhật',
          description: err.response?.data?.message || 'Không thể cập nhật vé',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast],
  );

  const deleteTicket = useCallback(
    async (id) => {
      try {
        await TicketApi.delete(id);
        setTickets((prev) => prev.filter((t) => t.id !== id));
        toast({
          title: 'Thành công',
          description: 'Xóa vé thành công',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        console.error('❌ Lỗi xóa:', err);
        toast({
          title: 'Lỗi xóa vé',
          description: err.response?.data?.message || 'Không thể xóa vé',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast],
  );

  const cancelTicket = useCallback(
    async (id, showtimeSeatId) => {
      try {
        await TicketApi.delete(id);

        if (showtimeSeatId) {
          try {
            await ShowtimeSeatApi.update(showtimeSeatId, {
              Status: 'Available',
            });
            console.log('✅ Seat status restored to Available');
          } catch (seatErr) {
            console.error('❌ Lỗi cập nhật trạng thái ghế:', seatErr);
          }
        }

        setTickets((prev) => prev.filter((t) => t.id !== id));

        toast({
          title: 'Thành công',
          description: 'Hủy vé thành công',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        console.error('❌ Lỗi hủy vé:', err);
        toast({
          title: 'Lỗi hủy vé',
          description: err.response?.data?.message || 'Không thể hủy vé',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast],
  );

  return {
    tickets,
    loading,
    error,
    users,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    cancelTicket,
  };
};
