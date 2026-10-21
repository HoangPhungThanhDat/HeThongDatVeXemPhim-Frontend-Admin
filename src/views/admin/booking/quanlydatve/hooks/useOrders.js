
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import OrderApi from 'api/booking/OrderApi';
import OrderDetailApi from 'api/booking/OrderDetailApi';

// ✅ Đưa các hàm map ra ngoài component để không bị tạo lại mỗi lần render
const mapStatus = (status) => {
  const statusMap = {
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Cancelled: 'Đã hủy',
    Completed: 'Đã check-in',
    Refunded: 'Hoàn tiền',
    Expired: 'Hết hạn',
  };
  return statusMap[status] || status || 'Chờ thanh toán';
};

const mapPayStatus = (status) => {
  const map = {
    Pending: 'Chờ thanh toán',
    Success: 'Đã thanh toán',
    Failed: 'Thất bại',
    Refunded: 'Đã hoàn',
  };
  return map[status] || status || 'Chờ thanh toán';
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    cancelled: 0,
    refund: 0,
    revenue: 0,
  });

  const toast = useToast();
  const detailCache = useRef({});

  // Lấy chi tiết đơn hàng từ API (Chỉ gọi khi cần xem chi tiết)
  const fetchOrderDetail = useCallback(async (orderId) => {
    if (detailCache.current[orderId]) {
      return detailCache.current[orderId];
    }

    try {
      const response = await OrderApi.getDetails(orderId);
      const data = response?.data?.data || response?.data || response;

      if (!data) {
        return getDefaultDetail();
      }

      const tickets = data.tickets || [];
      const foodAndDrinks = data.food_and_drinks || [];
      const customer = data.customer || {};
      const promotion = data.promotion || null;
      const summary = data.summary || {};

      const seats = [];
      tickets.forEach((ticket) => {
        if (ticket.seat) {
          const row = ticket.seat.Row || ticket.seat.row || '';
          const number = ticket.seat.Number || ticket.seat.number || '';
          const seatLabel = row + number;
          if (seatLabel && !seats.includes(seatLabel)) {
            seats.push(seatLabel);
          }
        }
      });

      const firstTicket = tickets[0] || {};
      const showtime = firstTicket.showtime || {};
      const movie = firstTicket.movie || {};
      const room = firstTicket.room || {};
      const cinema = firstTicket.cinema || {};

      const combos = foodAndDrinks
        .map((item) => item.Name || item.name || '')
        .filter(Boolean)
        .join(', ');

      let ticketTotal = 0;
      tickets.forEach((t) => {
        ticketTotal += t.Price || t.price || 0;
      });

      let comboTotal = 0;
      foodAndDrinks.forEach((item) => {
        comboTotal += item.TotalPrice || item.totalPrice || 0;
      });

      let showtimeStr = 'Đang cập nhật';
      if (showtime.StartTime) {
        const date = new Date(showtime.StartTime);
        if (!isNaN(date)) {
          showtimeStr = date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
      }

      const result = {
        seats: seats.length > 0 ? seats : ['Chưa có ghế'],
        combos: combos || 'Không có combo',
        movie: movie.Title || movie.title || 'Đang cập nhật',
        cinema: cinema.Name || cinema.name || 'Đang cập nhật',
        room: room.Name || room.name || 'Đang cập nhật',
        showtime: showtimeStr,
        format: room.RoomType || room.roomType || '2D',
        ticketTotal: ticketTotal,
        comboTotal: comboTotal,
        customerName: customer.FullName || customer.fullName || 'Khách hàng',
        customerEmail: customer.Email || customer.email || '',
        customerPhone: customer.PhoneNumber || customer.phone || '',
        rawData: data,
        promotion: promotion,
        summary: summary,
        ticketsList: tickets,
        foodList: foodAndDrinks,
      };

      detailCache.current[orderId] = result;
      return result;
    } catch (err) {
      console.error(`❌ [${orderId}] Error fetching detail:`, err);
      return getDefaultDetail();
    }
  }, []);

  const getDefaultDetail = () => ({
    seats: ['Chưa có ghế'],
    combos: 'Không có combo',
    movie: 'Đang cập nhật',
    cinema: 'Đang cập nhật',
    room: 'Đang cập nhật',
    showtime: 'Đang cập nhật',
    format: '2D',
    ticketTotal: 0,
    comboTotal: 0,
    customerName: 'Khách hàng',
    customerEmail: '',
    customerPhone: '',
    rawData: null,
    promotion: null,
    summary: {},
    ticketsList: [],
    foodList: [],
  });

  // ✅ fetchOrders: Không gọi API Detail trong vòng lặp, map trực tiếp từ API getAll
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      if (data.length === 0) {
        setOrders([]);
        setTotalOrders(0);
        setStats({ total: 0, pending: 0, paid: 0, cancelled: 0, refund: 0, revenue: 0 });
        setLoading(false);
        return [];
      }

      const formatted = data.map((order, index) => {
        const orderId = order.OrderId || order.id;
        const createdAt = order.OrderDate || order.orderDate || order.createdAt || new Date().toISOString();
        
        // ✅ Lấy thông tin khách hàng
        const customerName = order.User?.FullName || order.User?.fullName || order.customer?.FullName || 'Khách hàng';
        const customerEmail = order.User?.Email || order.User?.email || '';
        const customerPhone = order.User?.PhoneNumber || order.User?.phone || 'Chưa có SĐT';
        
        // ✅ Lấy thông tin phim/rạp/ghế (Nếu Backend đã trả về)
        const movieTitle = order.Movie?.Title || 'Bấm để xem';
        const cinemaName = order.Cinema?.Name || 'Bấm để xem';
        const roomName = order.Room?.Name || 'Bấm để xem';
        const seats = order.Seats || ['Chưa có ghế'];
        
        return {
          id: orderId,
          customer: customerName,
          email: customerEmail,
          phone: customerPhone,
          total: order.TotalAmount || order.totalAmount || 0,
          status: mapStatus(order.Status || order.status),
          payStatus: mapPayStatus(order.PaymentStatus || order.paymentStatus),
          createdAt: createdAt,
          promotionId: order.PromotionId || order.promotionId,
          
          // Map dữ liệu từ Backend
          movie: movieTitle,
          cinema: cinemaName,
          room: roomName,
          showtime: 'Đang cập nhật',
          format: '2D',
          seats: seats,
          combo: '',
          ticketTotal: 0,
          comboTotal: 0,
          payMethod: order.PaymentMethod || 'Chuyển khoản',
          refundStatus: order.refundStatus || null,
          refundNote: order.refundNote || '',
          note: order.note || order.Note || '',
          isNew: index < 3,
          rawDetail: null,
          ticketsList: [],
          foodList: [],
          promotion: null,
          summary: null,
          _sortTime: new Date(createdAt).getTime(),
        };
      });

      // Sắp xếp mới nhất lên đầu
      const sortedOrders = formatted.sort((a, b) => b._sortTime - a._sortTime);

      setOrders(sortedOrders);
      setTotalOrders(sortedOrders.length);

      // Tính stats
      const statsData = {
        total: sortedOrders.length,
        pending: sortedOrders.filter((o) => o.status === 'Chờ thanh toán' || o.status === 'Đã đặt').length,
        paid: sortedOrders.filter((o) => o.status === 'Đã thanh toán' || o.status === 'Đã check-in').length,
        cancelled: sortedOrders.filter((o) => o.status === 'Đã hủy').length,
        refund: sortedOrders.filter((o) => o.refundStatus === 'Đang chờ duyệt').length,
        revenue: sortedOrders.filter((o) => o.payStatus === 'Đã thanh toán').reduce((sum, o) => sum + (o.total || 0), 0),
      };
      setStats(statsData);

      return sortedOrders;
    } catch (err) {
      console.error('❌ Lỗi tải đơn hàng:', err);
      toast({
        title: 'Lỗi tải đơn hàng',
        description: err.response?.data?.message || 'Không thể tải danh sách đơn hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCache = useCallback(() => {
    detailCache.current = {};
  }, []);

  const refreshOrders = useCallback(async () => {
    clearCache();
    return fetchOrders();
  }, [clearCache, fetchOrders]);

  const updateNote = useCallback(
    async (orderId, note) => {
      try {
        await OrderApi.update(orderId, { Note: note });

        setOrders((prev) => {
          const updatedOrders = prev.map((o) =>
            o.id === orderId ? { ...o, note, _sortTime: Date.now() } : o,
          );
          return updatedOrders.sort((a, b) => b._sortTime - a._sortTime);
        });

        toast({
          title: 'Thành công',
          description: 'Đã cập nhật ghi chú',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        console.error('❌ Lỗi cập nhật ghi chú:', err);
        toast({
          title: 'Lỗi',
          description: err.response?.data?.message || 'Không thể cập nhật ghi chú',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast],
  );

  const processRefund = useCallback(
    async (orderId, action, reason = '') => {
      try {
        const status = action === 'approve' ? 'Refunded' : 'Cancelled';
        const refundStatus = action === 'approve' ? 'Đã duyệt' : 'Từ chối';

        await OrderApi.update(orderId, {
          Status: status,
          RefundStatus: refundStatus,
          RefundNote: reason,
        });

        setOrders((prev) => {
          const updatedOrders = prev.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                status: action === 'approve' ? 'Hoàn tiền' : 'Đã hủy',
                payStatus: action === 'approve' ? 'Đã hoàn' : o.payStatus,
                refundStatus,
                refundNote: reason || o.refundNote,
                _sortTime: Date.now(),
              };
            }
            return o;
          });
          return updatedOrders.sort((a, b) => b._sortTime - a._sortTime);
        });

        toast({
          title: 'Thành công',
          description: action === 'approve' ? 'Đã duyệt hoàn tiền' : 'Đã từ chối hoàn tiền',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        console.error('❌ Lỗi xử lý hoàn tiền:', err);
        toast({
          title: 'Lỗi',
          description: err.response?.data?.message || 'Không thể xử lý hoàn tiền',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast],
  );

  const createOrder = useCallback(
    async (orderData) => {
      try {
        const orderResponse = await OrderApi.create({
          UserId: orderData.userId,
          TotalAmount: orderData.total,
          Status: orderData.status === 'Đã thanh toán' ? 'Paid' : 'Pending',
          OrderDate: new Date().toISOString(),
          Note: orderData.note || '',
          PaymentMethod: orderData.payMethod || 'Chuyển khoản',
        });

        let orderId =
          orderResponse?.data?.OrderId ||
          orderResponse?.data?.id ||
          orderResponse?.OrderId ||
          orderResponse?.id;

        if (!orderId) {
          throw new Error('Không thể lấy ID đơn hàng từ response');
        }

        const detail = await fetchOrderDetail(orderId);
        const now = new Date().toISOString();

        const newOrder = {
          id: orderId,
          customer: orderData.customerName || detail.customerName || 'Khách hàng',
          email: orderData.email || detail.customerEmail || '',
          phone: orderData.phone || detail.customerPhone || 'Chưa có SĐT',
          total: orderData.total || 0,
          status: orderData.status || 'Đã thanh toán',
          payStatus: 'Đã thanh toán',
          createdAt: now,
          movie: orderData.movie || detail.movie || 'Đang cập nhật',
          cinema: orderData.cinema || detail.cinema || 'Đang cập nhật',
          room: orderData.room || detail.room || 'Đang cập nhật',
          showtime: orderData.showtime || detail.showtime || 'Đang cập nhật',
          format: orderData.format || detail.format || '2D',
          seats: orderData.seats || detail.seats || ['Chưa có ghế'],
          combo: orderData.combo || detail.combos || 'Không có combo',
          ticketTotal: orderData.ticketTotal || detail.ticketTotal || 0,
          comboTotal: orderData.comboTotal || detail.comboTotal || 0,
          payMethod: orderData.payMethod || 'Chuyển khoản',
          note: orderData.note || '',
          isNew: true,
          rawDetail: detail.rawData,
          ticketsList: detail.ticketsList || [],
          foodList: detail.foodList || [],
          promotion: detail.promotion,
          summary: detail.summary,
          _sortTime: Date.now(),
        };

        setOrders((prev) => [newOrder, ...prev]);
        setTotalOrders((prev) => prev + 1);

        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          revenue: prev.revenue + (orderData.total || 0),
        }));

        toast({
          title: 'Thành công 🎉',
          description: `Đã tạo đơn hàng mới: #${orderId}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        return orderId;
      } catch (err) {
        console.error('❌ Lỗi tạo đơn hàng:', err);
        toast({
          title: 'Lỗi tạo đơn',
          description: err.response?.data?.message || err.message || 'Không thể tạo đơn hàng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return null;
      }
    },
    [toast, fetchOrderDetail],
  );

  return {
    orders,
    loading,
    totalOrders,
    stats,
    fetchOrders,
    fetchOrderDetail,
    updateNote,
    processRefund,
    createOrder,
    refreshOrders,
    clearCache,
  };
};