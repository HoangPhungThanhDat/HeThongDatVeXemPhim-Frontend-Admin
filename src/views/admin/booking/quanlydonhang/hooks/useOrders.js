// src/views/admin/quanlydonhang/hooks/useOrders.js

import { useState, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import OrderApi from 'api/booking/OrderApi';
import OrderDetailApi from 'api/booking/OrderDetailApi';

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

  // Map status
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

  // Format date
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

  // Lấy chi tiết đơn hàng từ API
  const fetchOrderDetail = useCallback(
    async (orderId) => {
      if (detailCache.current[orderId]) {
        console.log(`✅ [${orderId}] Cache hit`);
        return detailCache.current[orderId];
      }

      try {
        console.log(`📦 [${orderId}] Fetching detail from API...`);

        const response = await OrderApi.getDetails(orderId);
        const data = response?.data?.data || response?.data || response;

        console.log(`📦 [${orderId}] API response:`, data);

        if (!data) {
          return getDefaultDetail();
        }

        const tickets = data.tickets || [];
        const foodAndDrinks = data.food_and_drinks || [];
        const customer = data.customer || {};

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

        const result = {
          seats: seats.length > 0 ? seats : ['Chưa có ghế'],
          combos: combos || 'Không có combo',
          movie: movie.Title || movie.title || 'Đang cập nhật',
          cinema: cinema.Name || cinema.name || 'Đang cập nhật',
          room: room.Name || room.name || 'Đang cập nhật',
          showtime: showtime.StartTime
            ? formatDate(showtime.StartTime)
            : 'Đang cập nhật',
          ticketTotal: ticketTotal,
          comboTotal: comboTotal,
          customerName: customer.FullName || customer.fullName || 'Khách hàng',
          customerEmail: customer.Email || customer.email || '',
          customerPhone: customer.PhoneNumber || customer.phone || '',
          rawData: data,
        };

        detailCache.current[orderId] = result;

        console.log(`✅ [${orderId}] Detail parsed:`, result);
        return result;
      } catch (err) {
        console.error(`❌ [${orderId}] Error fetching detail:`, err);
        return getDefaultDetail();
      }
    },
    [formatDate],
  );

  const getDefaultDetail = () => ({
    seats: ['Chưa có ghế'],
    combos: 'Không có combo',
    movie: 'Đang cập nhật',
    cinema: 'Đang cập nhật',
    room: 'Đang cập nhật',
    showtime: 'Đang cập nhật',
    ticketTotal: 0,
    comboTotal: 0,
    customerName: 'Khách hàng',
    customerEmail: '',
    customerPhone: '',
    rawData: null,
  });

  // ✅ SỬA: fetchOrders - Sắp xếp mới nhất lên đầu
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderApi.getAll();
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      console.log(`📦 Orders count: ${data.length}`);

      if (data.length === 0) {
        setOrders([]);
        setTotalOrders(0);
        setStats({
          total: 0,
          pending: 0,
          paid: 0,
          cancelled: 0,
          refund: 0,
          revenue: 0,
        });
        setLoading(false);
        return [];
      }

      // Lấy chi tiết cho từng đơn hàng
      const formatted = await Promise.all(
        data.map(async (order) => {
          const orderId = order.OrderId || order.id;
          const detail = await fetchOrderDetail(orderId);

          // Lấy thời gian tạo để sắp xếp
          const createdAt =
            order.OrderDate || order.createdAt || new Date().toISOString();

          return {
            id: orderId,
            code: `DH${String(orderId).padStart(5, '0')}`,
            customerName: detail.customerName,
            customerEmail: detail.customerEmail,
            customerPhone: detail.customerPhone,
            movieTitle: detail.movie,
            cinema: detail.cinema,
            room: detail.room,
            showtime: detail.showtime,
            seats: detail.seats,
            combo: detail.combos,
            ticketTotal: detail.ticketTotal,
            comboTotal: detail.comboTotal,
            total: order.TotalAmount || order.totalAmount || 0,
            paymentMethod: order.PaymentMethod || 'Chuyển khoản',
            paymentStatus: mapStatus(
              order.PaymentStatus || order.paymentStatus,
            ),
            orderStatus: mapStatus(order.Status || order.status),
            refundStatus: order.refundStatus || null,
            refundReason: order.refundReason || '',
            createdAt: createdAt,
            note: order.note || '',
            isNew: false,
            rawOrder: order,
            rawDetail: detail.rawData,
            // ✅ Thêm field để sắp xếp
            _sortTime: new Date(createdAt).getTime(),
          };
        }),
      );

      // ✅ SẮP XẾP: Mới nhất lên đầu (theo _sortTime giảm dần)
      const sortedOrders = formatted.sort((a, b) => {
        const timeA = a._sortTime || 0;
        const timeB = b._sortTime || 0;
        return timeB - timeA;
      });

      // Đánh dấu 3 đơn mới nhất
      const markedOrders = sortedOrders.map((order, index) => ({
        ...order,
        isNew: index < 3,
      }));

      console.log(
        '✅ Formatted orders (newest first):',
        markedOrders.slice(0, 5).map((o) => ({
          id: o.id,
          customer: o.customerName,
          movie: o.movieTitle,
          createdAt: o.createdAt,
        })),
      );

      setOrders(markedOrders);
      setTotalOrders(markedOrders.length);

      const statsData = {
        total: markedOrders.length,
        pending: markedOrders.filter(
          (o) =>
            o.orderStatus === 'Chờ thanh toán' || o.orderStatus === 'Đã đặt',
        ).length,
        paid: markedOrders.filter(
          (o) =>
            o.orderStatus === 'Đã thanh toán' ||
            o.orderStatus === 'Đã check-in',
        ).length,
        cancelled: markedOrders.filter((o) => o.orderStatus === 'Đã hủy')
          .length,
        refund: markedOrders.filter((o) => o.refundStatus === 'Đang chờ duyệt')
          .length,
        revenue: markedOrders
          .filter((o) => o.paymentStatus === 'Đã thanh toán')
          .reduce((sum, o) => sum + (o.total || 0), 0),
      };
      setStats(statsData);

      return markedOrders;
    } catch (err) {
      console.error('❌ Lỗi tải đơn hàng:', err);
      toast({
        title: 'Lỗi tải đơn hàng',
        description:
          err.response?.data?.message || 'Không thể tải danh sách đơn hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, fetchOrderDetail]);

  // ✅ SỬA: Cập nhật ghi chú và đưa lên đầu
  const updateNote = useCallback(
    async (orderId, note) => {
      try {
        await OrderApi.update(orderId, { Note: note });

        setOrders((prev) => {
          const updatedOrders = prev.map((o) =>
            o.id === orderId ? { ...o, note, _sortTime: Date.now() } : o,
          );
          // Sắp xếp lại theo _sortTime
          return updatedOrders.sort((a, b) => {
            const timeA = a._sortTime || 0;
            const timeB = b._sortTime || 0;
            return timeB - timeA;
          });
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
          description:
            err.response?.data?.message || 'Không thể cập nhật ghi chú',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast],
  );

  // ✅ SỬA: Xóa đơn hàng
  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        await OrderApi.delete(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        delete detailCache.current[orderId];
        toast({
          title: 'Thành công',
          description: 'Đã xóa đơn hàng',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        console.error('❌ Lỗi xóa đơn hàng:', err);
        toast({
          title: 'Lỗi',
          description: err.response?.data?.message || 'Không thể xóa đơn hàng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast],
  );

  // ✅ SỬA: Xử lý hoàn tiền và đưa lên đầu
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
                orderStatus: action === 'approve' ? 'Đã hoàn tiền' : 'Đã hủy',
                paymentStatus:
                  action === 'approve' ? 'Đã hoàn tiền' : o.paymentStatus,
                refundStatus,
                refundReason: reason || o.refundReason,
                _sortTime: Date.now(),
              };
            }
            return o;
          });
          // Sắp xếp lại theo _sortTime
          return updatedOrders.sort((a, b) => {
            const timeA = a._sortTime || 0;
            const timeB = b._sortTime || 0;
            return timeB - timeA;
          });
        });

        toast({
          title: 'Thành công',
          description:
            action === 'approve'
              ? 'Đã duyệt hoàn tiền'
              : 'Đã từ chối hoàn tiền',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        console.error('❌ Lỗi xử lý hoàn tiền:', err);
        toast({
          title: 'Lỗi',
          description:
            err.response?.data?.message || 'Không thể xử lý hoàn tiền',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast],
  );

  // ✅ THÊM: Tạo đơn hàng mới và thêm vào đầu danh sách
  const createOrder = useCallback(
    async (orderData) => {
      try {
        console.log('📤 Creating order with data:', orderData);

        const orderResponse = await OrderApi.create({
          UserId: orderData.userId,
          TotalAmount:
            orderData.total || orderData.ticketTotal + orderData.comboTotal,
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

        if (!orderId) {
          throw new Error('Không thể lấy ID đơn hàng từ response');
        }

        console.log(`✅ Order created with ID: ${orderId}`);

        // Lấy chi tiết đơn hàng vừa tạo
        const detail = await fetchOrderDetail(orderId);
        const now = new Date().toISOString();

        // Tạo order object mới
        const newOrder = {
          id: orderId,
          code: `DH${String(orderId).padStart(5, '0')}`,
          customerName:
            orderData.customerName || detail.customerName || 'Khách hàng',
          customerEmail: orderData.customerEmail || detail.customerEmail || '',
          customerPhone:
            orderData.customerPhone || detail.customerPhone || 'Chưa có SĐT',
          movieTitle: orderData.movieTitle || detail.movie || 'Đang cập nhật',
          cinema: orderData.cinema || detail.cinema || 'Đang cập nhật',
          room: orderData.room || detail.room || 'Đang cập nhật',
          showtime: orderData.showtime || detail.showtime || 'Đang cập nhật',
          seats: orderData.seats || detail.seats || ['Chưa có ghế'],
          combo: orderData.combo || detail.combos || 'Không có combo',
          ticketTotal: orderData.ticketTotal || detail.ticketTotal || 0,
          comboTotal: orderData.comboTotal || detail.comboTotal || 0,
          total:
            orderData.total ||
            orderData.ticketTotal + orderData.comboTotal ||
            0,
          paymentMethod: orderData.paymentMethod || 'Chuyển khoản',
          paymentStatus:
            orderData.status === 'Đã thanh toán'
              ? 'Đã thanh toán'
              : 'Chờ thanh toán',
          orderStatus: orderData.status || 'Đã đặt',
          refundStatus: null,
          refundReason: '',
          createdAt: now,
          note: orderData.note || '',
          isNew: true,
          rawOrder: null,
          rawDetail: detail.rawData,
          _sortTime: Date.now(),
        };

        console.log('✅ New order object:', newOrder);

        // ✅ THÊM VÀO ĐẦU DANH SÁCH
        setOrders((prev) => [newOrder, ...prev]);
        setTotalOrders((prev) => prev + 1);

        // Cập nhật stats
        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          revenue: prev.revenue + (newOrder.total || 0),
        }));

        toast({
          title: 'Thành công 🎉',
          description: `Đã tạo đơn hàng mới: ${newOrder.code}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        return orderId;
      } catch (err) {
        console.error('❌ Lỗi tạo đơn hàng:', err);
        toast({
          title: 'Lỗi tạo đơn',
          description:
            err.response?.data?.message ||
            err.message ||
            'Không thể tạo đơn hàng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return null;
      }
    },
    [toast, fetchOrderDetail],
  );

  // ✅ THÊM: Clear cache
  const clearCache = useCallback(() => {
    detailCache.current = {};
    console.log('🗑️ Cache cleared');
  }, []);

  // ✅ THÊM: Refresh orders
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
    updateNote,
    deleteOrder,
    processRefund,
    createOrder,
    refreshOrders,
    clearCache,
  };
};
