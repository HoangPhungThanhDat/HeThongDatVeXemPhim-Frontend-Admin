
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import OrderApi from 'api/booking/OrderApi';

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

  const mapStatus = (status) => {
    const map = {
      Pending: 'Chờ thanh toán',
      Paid: 'Đã thanh toán',
      Cancelled: 'Đã hủy',
      Completed: 'Đã check-in',
      Refunded: 'Đã hoàn tiền',
      Expired: 'Hết hạn',
    };
    return map[status] || status || 'Đã đặt';
  };

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return 'Đang cập nhật';
    try {
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
      return 'Đang cập nhật';
    } catch {
      return 'Đang cập nhật';
    }
  }, []);

  // ✅ Lấy chi tiết đơn hàng (dùng cho Modal Chi tiết)
  const fetchOrderDetail = useCallback(
    async (orderId) => {
      if (detailCache.current[orderId]) {
        return detailCache.current[orderId];
      }

      try {
        const response = await OrderApi.getDetails(orderId);
        const data = response?.data?.data || response?.data || response;
        if (!data) return null;
        detailCache.current[orderId] = data;
        return data;
      } catch (err) {
        console.error(`❌ [${orderId}] Error fetching detail:`, err);
        return null;
      }
    },
    [],
  );

  // ✅ Hàm lấy danh sách đơn hàng
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

      const formatted = await Promise.all(
        data.map(async (order, index) => {
          const orderId = order.OrderId || order.id;
          const createdAt = order.OrderDate || order.createdAt || new Date().toISOString();
          
          // Lấy dữ liệu từ API getDetails để có thông tin vé và combo
          const detailData = await fetchOrderDetail(orderId);

          // Trích xuất dữ liệu từ detailData (nếu có)
          const tickets = detailData?.tickets || [];
          const foods = detailData?.food_and_drinks || [];
          
          // Lấy thông tin hiển thị nhanh cho danh sách ngoài
          const customerName = detailData?.customer?.FullName || order.User?.FullName || 'Khách hàng';
          const customerEmail = detailData?.customer?.Email || order.User?.Email || '';
          const customerPhone = detailData?.customer?.PhoneNumber || order.User?.PhoneNumber || 'Chưa có SĐT';
          
          // Lấy thông tin phim/rạp/phòng từ vé đầu tiên (nếu có)
          const firstTicket = tickets[0] || {};
          const movieTitle = firstTicket.movie?.Title || order.Movie?.Title || 'Đang cập nhật';
          const cinema = firstTicket.cinema?.Name || order.Cinema?.Name || 'Đang cập nhật';
          const room = firstTicket.room?.Name || order.Room?.Name || 'Đang cập nhật';
          const showtime = firstTicket.showtime?.StartTime ? formatDate(firstTicket.showtime.StartTime) : 'Đang cập nhật';
          
          // Danh sách ghế
          const seatArray = tickets.map(t => `${t.seat?.Row || ''}${t.seat?.Number || ''}`).filter(Boolean);
          const seats = seatArray.length > 0 ? seatArray : (order.Seats || ['Chưa có ghế']);
          
          // Danh sách combo
          const combo = foods.map(f => f.Name).join(', ') || 'Không có combo';

          return {
            id: orderId,
            code: `DH${String(orderId).padStart(5, '0')}`,
            customerName,
            customerEmail,
            customerPhone,
            movieTitle,
            cinema,
            room,
            showtime,
            seats,
            combo,
            ticketTotal: detailData?.summary?.sub_total || 0, 
            comboTotal: detailData?.summary?.combo_total || 0,
            total: order.TotalAmount || 0,
            paymentMethod: order.PaymentMethod || 'Chuyển khoản',
            paymentStatus: mapStatus(order.PaymentStatus || 'Pending'),
            orderStatus: mapStatus(order.Status || order.orderStatus),
            refundStatus: order.refundStatus || null,
            refundReason: order.refundReason || '',
            createdAt: createdAt,
            note: order.note || '',
            isNew: index < 3,
            rawOrder: order,
            rawDetail: detailData, // ✅ Gán chi tiết vào đây để hiển thị
            _sortTime: new Date(createdAt).getTime(),
          };
        })
      );

      const sortedOrders = formatted.sort((a, b) => b._sortTime - a._sortTime);

      setOrders(sortedOrders);
      setTotalOrders(sortedOrders.length);

      const statsData = {
        total: sortedOrders.length,
        pending: sortedOrders.filter((o) => o.orderStatus === 'Chờ thanh toán' || o.orderStatus === 'Đã đặt').length,
        paid: sortedOrders.filter((o) => o.orderStatus === 'Đã thanh toán' || o.orderStatus === 'Đã check-in').length,
        cancelled: sortedOrders.filter((o) => o.orderStatus === 'Đã hủy').length,
        refund: sortedOrders.filter((o) => o.refundStatus === 'Đang chờ duyệt').length,
        revenue: sortedOrders.filter((o) => o.paymentStatus === 'Đã thanh toán').reduce((sum, o) => sum + (o.total || 0), 0),
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
  }, [toast, formatDate, fetchOrderDetail]);

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

        toast({ title: 'Thành công', description: 'Đã cập nhật ghi chú', status: 'success', duration: 2000, isClosable: true });
        return true;
      } catch (err) {
        console.error('❌ Lỗi cập nhật ghi chú:', err);
        toast({ title: 'Lỗi', description: err.response?.data?.message || 'Không thể cập nhật ghi chú', status: 'error', duration: 3000, isClosable: true });
        return false;
      }
    },
    [toast],
  );

  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        await OrderApi.delete(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        delete detailCache.current[orderId];
        toast({ title: 'Thành công', description: 'Đã xóa đơn hàng', status: 'success', duration: 2000, isClosable: true });
        return true;
      } catch (err) {
        console.error('❌ Lỗi xóa đơn hàng:', err);
        toast({ title: 'Lỗi', description: err.response?.data?.message || 'Không thể xóa đơn hàng', status: 'error', duration: 3000, isClosable: true });
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

        await OrderApi.update(orderId, { Status: status, RefundStatus: refundStatus, RefundNote: reason });

        setOrders((prev) => {
          const updatedOrders = prev.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                orderStatus: action === 'approve' ? 'Đã hoàn tiền' : 'Đã hủy',
                paymentStatus: action === 'approve' ? 'Đã hoàn tiền' : o.paymentStatus,
                refundStatus,
                refundReason: reason || o.refundReason,
                _sortTime: Date.now(),
              };
            }
            return o;
          });
          return updatedOrders.sort((a, b) => b._sortTime - a._sortTime);
        });

        toast({ title: 'Thành công', description: action === 'approve' ? 'Đã duyệt hoàn tiền' : 'Đã từ chối hoàn tiền', status: 'success', duration: 2000, isClosable: true });
        return true;
      } catch (err) {
        console.error('❌ Lỗi xử lý hoàn tiền:', err);
        toast({ title: 'Lỗi', description: err.response?.data?.message || 'Không thể xử lý hoàn tiền', status: 'error', duration: 3000, isClosable: true });
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
          TotalAmount: orderData.total || orderData.ticketTotal + orderData.comboTotal,
          Status: orderData.status === 'Đã thanh toán' ? 'Paid' : 'Pending',
          OrderDate: new Date().toISOString(),
          Note: orderData.note || '',
          PaymentMethod: orderData.paymentMethod || 'Chuyển khoản',
        });

        let orderId =
          orderResponse?.data?.OrderId ||
          orderResponse?.data?.id ||
          orderResponse?.OrderId ||
          orderResponse?.id;

        if (!orderId) throw new Error('Không thể lấy ID đơn hàng từ response');

        const detail = await fetchOrderDetail(orderId);
        const now = new Date().toISOString();

        const newOrder = {
          id: orderId,
          code: `DH${String(orderId).padStart(5, '0')}`,
          customerName: orderData.customerName || detail?.customerName || 'Khách hàng',
          customerEmail: orderData.customerEmail || detail?.customerEmail || '',
          customerPhone: orderData.customerPhone || detail?.customerPhone || 'Chưa có SĐT',
          movieTitle: orderData.movieTitle || detail?.movie || 'Đang cập nhật',
          cinema: orderData.cinema || detail?.cinema || 'Đang cập nhật',
          room: orderData.room || detail?.room || 'Đang cập nhật',
          showtime: orderData.showtime || detail?.showtime || 'Đang cập nhật',
          seats: orderData.seats || detail?.seats || ['Chưa có ghế'],
          combo: orderData.combo || detail?.combos || 'Không có combo',
          ticketTotal: orderData.ticketTotal || detail?.ticketTotal || 0,
          comboTotal: orderData.comboTotal || detail?.comboTotal || 0,
          total: orderData.total || orderData.ticketTotal + orderData.comboTotal || 0,
          paymentMethod: orderData.paymentMethod || 'Chuyển khoản',
          paymentStatus: orderData.status === 'Đã thanh toán' ? 'Đã thanh toán' : 'Chờ thanh toán',
          orderStatus: orderData.status || 'Đã đặt',
          refundStatus: null,
          refundReason: '',
          createdAt: now,
          note: orderData.note || '',
          isNew: true,
          rawOrder: null,
          rawDetail: detail || null,
          _sortTime: Date.now(),
        };

        setOrders((prev) => [newOrder, ...prev]);
        setTotalOrders((prev) => prev + 1);

        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          revenue: prev.revenue + (newOrder.total || 0),
        }));

        toast({ title: 'Thành công 🎉', description: `Đã tạo đơn hàng mới: ${newOrder.code}`, status: 'success', duration: 3000, isClosable: true });
        return orderId;
      } catch (err) {
        console.error('❌ Lỗi tạo đơn hàng:', err);
        toast({ title: 'Lỗi tạo đơn', description: err.response?.data?.message || err.message || 'Không thể tạo đơn hàng', status: 'error', duration: 3000, isClosable: true });
        return null;
      }
    },
    [toast, fetchOrderDetail],
  );

  const clearCache = useCallback(() => {
    detailCache.current = {};
  }, []);

  const refreshOrders = useCallback(async () => {
    clearCache();
    return fetchOrders();
  }, [clearCache, fetchOrders]);

  return {
    orders,
    loading,
    totalOrders,
    stats,
    fetchOrders,
    fetchOrderDetail,
    updateNote,
    deleteOrder,
    processRefund,
    createOrder,
    refreshOrders,
    clearCache,
  };
};