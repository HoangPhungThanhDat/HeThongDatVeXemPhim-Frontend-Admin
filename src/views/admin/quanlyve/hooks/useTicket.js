// src/views/admin/quanlyve/hooks/useTicket.js
import { useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import TicketApi from "../../../../api/TicketApi";
import UserApi from "../../../../api/UserApi";
import ShowtimeSeatApi from "../../../../api/ShowtimeSeatApi";

export const useTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [users, setUsers] = useState({});

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
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
      console.log("📦 Users API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) {
        data = data.data;
      }
      if (!Array.isArray(data)) {
        data = [];
      }
      
      const userMap = {};
      data.forEach(user => {
        const userId = user.UserId || user.id;
        if (userId) {
          userMap[userId] = {
            fullName: user.FullName || user.fullName || user.name || "",
            email: user.Email || user.email || "",
            phone: user.PhoneNumber || user.phone || "",
          };
        }
      });
      
      console.log("✅ User map:", userMap);
      setUsers(userMap);
      return userMap;
    } catch (err) {
      console.error("❌ Lỗi tải users:", err);
      return {};
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const userMap = await fetchUsers();
      
      const response = await TicketApi.getAll();
      console.log("📦 Tickets API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (data && !Array.isArray(data) && data.data) {
        data = data.data;
      }
      if (!Array.isArray(data)) {
        data = [];
      }
      
      console.log("📦 Raw data length:", data.length);
      
      const mappedData = data.map((item) => {
        const showtime = item.ShowtimeId || {};
        const movie = showtime.MovieId || {};
        const room = showtime.RoomId || {};
        const seat = item.SeatId || {};
        
        const userId = item.UserId || item.userId || "";
        const userInfo = userMap[userId] || {};
        
        const startTime = showtime.StartTime || '';
        const formattedTime = formatDate(startTime);
        const roomName = room.Name || '';
        
        const seatRow = seat.Row || '';
        const seatNumber = seat.Number || '';
        const seatLabel = (seatRow + seatNumber) || 'A1';
        const price = showtime.Price || 0;
        const combo = item.Combo || item.combo || "";
        
        const showtimeId = showtime.ShowtimeId || item.ShowtimeId || null;
        const seatId = seat.SeatId || item.SeatId || null;
        const showtimeSeatId = item.ShowtimeSeatId || null;
        
        return {
          id: item.TicketId || item.id || Date.now(),
          code: `VE${String(item.TicketId || item.id || Date.now()).slice(-4)}`,
          userId: userId,
          customer: userInfo.fullName || userInfo.name || `Khách hàng #${userId}` || "Khách hàng",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
          movie: movie.Title || movie.title || "Phim",
          showtime: formattedTime ? `${formattedTime} - Phòng ${roomName}` : "",
          seat: seatLabel,
          price: price ? `${Number(price).toLocaleString()}đ` : "0đ",
          status: item.Status || item.status || "Đã thanh toán",
          note: item.Note || item.note || "",
          combo: combo,
          qr: item.QRCode || item.qr || `QR-${item.TicketId || item.id}`,
          bookingTime: item.BookingTime || item.bookingTime || "",
          createdAt: item.CreatedAt || item.createdAt || "",
          updatedAt: item.UpdatedAt || item.updatedAt || "",
          showtimeId: showtimeId,
          seatId: seatId,
          showtimeSeatId: showtimeSeatId,
        };
      });
      
      console.log("✅ Mapped tickets:", mappedData);
      setTickets(mappedData);
      
    } catch (err) {
      setError(err);
      console.error("❌ Lỗi tải vé:", err);
      toast({
        title: "Lỗi tải dữ liệu",
        description: err.response?.data?.message || "Không thể tải danh sách vé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchUsers, formatDate]);

  const createTicket = useCallback(
    async (data) => {
      try {
        console.log("📤 Creating ticket with data:", data);
        
        const apiData = {
          ShowtimeId: data.showtimeId,
          SeatId: data.seatId,
          UserId: data.userId,
          Status: data.status || "Pending",
        };
        
        console.log("📤 API Data:", apiData);
        
        const response = await TicketApi.create(apiData);
        console.log("✅ API Response:", response);
        
        const responseData = response?.data?.data || response?.data || response || {};
        
        const newTicket = {
          id: responseData.TicketId || data.id || Date.now(),
          code: responseData.code || data.code || `VE${String(responseData.TicketId || Date.now()).slice(-4)}`,
          userId: data.userId,
          customer: data.customer || "Khách hàng",
          email: data.email || "",
          phone: data.phone || "",
          movie: data.movie || "Phim",
          showtime: data.showtime || "",
          seat: data.seat || "A1",
          price: data.price || "0đ",
          status: data.status || "Đã thanh toán",
          note: data.note || "",
          combo: data.combo || "",
          qr: responseData.QRCode || data.qr || `QR-${String(responseData.TicketId || Date.now()).slice(-4)}`,
          bookingTime: responseData.BookingTime || new Date().toISOString(),
          showtimeId: data.showtimeId || null,
          seatId: data.seatId || null,
          showtimeSeatId: data.showtimeSeatId || null,
        };
        
        console.log("✅ New ticket object:", newTicket);
        
        setTickets((prev) => {
          const exists = prev.some(t => t.id === newTicket.id);
          if (exists) {
            return prev;
          }
          return [newTicket, ...prev];
        });
        
        return newTicket;
      } catch (err) {
        console.error("❌ Lỗi tạo vé trong useTicket:", err.response?.data || err);
        throw err;
      }
    },
    []
  );

  // ✅ Cập nhật vé - Xử lý cả thay đổi ghế
  const updateTicket = useCallback(
    async (id, data) => {
      try {
        console.log("📤 Updating ticket:", { id, data });
        
        // ✅ Nếu có thay đổi ghế, cập nhật trạng thái ghế
        if (data.oldShowtimeSeatId && data.newShowtimeSeatId && 
            data.oldShowtimeSeatId !== data.newShowtimeSeatId) {
          console.log("🔄 Seat changed, updating seat statuses");
          
          // 1️⃣ Trả ghế cũ về Available
          try {
            await ShowtimeSeatApi.update(data.oldShowtimeSeatId, {
              Status: "Available"
            });
            console.log("✅ Old seat restored to Available");
          } catch (err) {
            console.error("❌ Lỗi trả ghế cũ:", err);
          }
          
          // 2️⃣ Đặt ghế mới thành Reserved
          try {
            await ShowtimeSeatApi.update(data.newShowtimeSeatId, {
              Status: "Reserved"
            });
            console.log("✅ New seat set to Reserved");
          } catch (err) {
            console.error("❌ Lỗi đặt ghế mới:", err);
          }
        }
        
        // 3️⃣ Cập nhật vé trong database
        const apiData = {
          ShowtimeId: data.showtimeId,
          SeatId: data.seatId,
          UserId: data.userId,
          Status: data.status || "Paid",
          Note: data.note || "",
        };
        
        console.log("📤 API Data:", apiData);
        
        const response = await TicketApi.update(id, apiData);
        console.log("✅ Update response:", response);
        
        // 4️⃣ Cập nhật state
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  seat: data.seat || t.seat,
                  status: data.status || t.status,
                  note: data.note || t.note,
                  seatId: data.seatId || t.seatId,
                  showtimeSeatId: data.newShowtimeSeatId || t.showtimeSeatId,
                }
              : t
          )
        );
        
        toast({
          title: "Thành công",
          description: "Cập nhật vé thành công",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return response.data;
      } catch (err) {
        console.error("❌ Lỗi cập nhật:", err);
        console.error("❌ Error response:", err.response?.data);
        toast({
          title: "Lỗi cập nhật",
          description: err.response?.data?.message || "Không thể cập nhật vé",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast]
  );

  const deleteTicket = useCallback(
    async (id) => {
      try {
        await TicketApi.delete(id);
        setTickets((prev) => prev.filter((t) => t.id !== id));
        toast({
          title: "Thành công",
          description: "Xóa vé thành công",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        console.error("❌ Lỗi xóa:", err);
        toast({
          title: "Lỗi xóa vé",
          description: err.response?.data?.message || "Không thể xóa vé",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast]
  );

  const cancelTicket = useCallback(
    async (id, showtimeSeatId) => {
      try {
        await TicketApi.delete(id);
        
        if (showtimeSeatId) {
          try {
            await ShowtimeSeatApi.update(showtimeSeatId, {
              Status: "Available"
            });
            console.log("✅ Seat status restored to Available");
          } catch (seatErr) {
            console.error("❌ Lỗi cập nhật trạng thái ghế:", seatErr);
          }
        }
        
        setTickets((prev) => prev.filter((t) => t.id !== id));
        
        toast({
          title: "Thành công",
          description: "Hủy vé thành công",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        console.error("❌ Lỗi hủy vé:", err);
        toast({
          title: "Lỗi hủy vé",
          description: err.response?.data?.message || "Không thể hủy vé",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw err;
      }
    },
    [toast]
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