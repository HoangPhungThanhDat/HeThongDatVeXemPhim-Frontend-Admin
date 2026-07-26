// hooks/useOrders.js
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import OrderApi from "../../../../api/OrderApi";
import OrderDetailApi from "../../../../api/OrderDetailApi";
import UserApi from "../../../../api/UserApi";
import PromotionApi from "../../../../api/PromotionApi";
import TicketApi from "../../../../api/TicketApi";
import FoodAndDrinkApi from "../../../../api/FoodAndDrinkApi";

export function useOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [orderRes, userRes, promotionRes, detailRes, ticketRes, foodRes] = await Promise.all([
        OrderApi.getAll(),
        UserApi.getAll(),
        PromotionApi.getAll(),
        OrderDetailApi.getAll(),
        TicketApi.getAll(),
        FoodAndDrinkApi.getAll(),
      ]);

      const ordersData = orderRes.data?.data || orderRes.data || [];
      const usersData = userRes.data?.data || userRes.data || [];
      const promotionsData = promotionRes.data?.data || promotionRes.data || [];
      const detailsData = detailRes.data?.data || detailRes.data || [];
      const ticketsData = ticketRes.data?.data || ticketRes.data || [];
      const foodsData = foodRes.data?.data || foodRes.data || [];

      setOrders(ordersData);
      setUsers(usersData);
      setPromotions(promotionsData);
      setOrderDetails(detailsData);
      setTickets(ticketsData);
      setFoods(foodsData);

      // Count new orders (isNew flag from API or recently created)
      const newOrders = ordersData.filter(o => o.isNew || o.Status === "Pending");
      setNewCount(newOrders.length);

    } catch (err) {
      console.error("Lỗi load dữ liệu:", err);
      toast({
        title: "Lỗi tải dữ liệu",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load on mount
  useEffect(() => {
    loadData();
    // Simulate realtime new order (optional)
    const interval = setInterval(() => {
      // Check for new orders (in real app, this would be WebSocket)
      // For demo, we'll just check if any order has isNew flag
      const newOrders = orders.filter(o => o.isNew).length;
      setNewCount(newOrders);
    }, 30000);

    return () => clearInterval(interval);
  }, [orders]);

  // Toast helper
  const toastFn = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Add order
  const handleAddOrder = useCallback(async (orderData) => {
    try {
      const payload = {
        UserId: orderData.UserId,
        PromotionId: orderData.PromotionId || null,
        TotalAmount: parseFloat(orderData.TotalAmount),
        OrderDate: orderData.OrderDate,
        Status: orderData.Status || "Pending",
      };

      const res = await OrderApi.create(payload);
      const newOrder = res.data?.data || res.data;

      setOrders(prev => [newOrder, ...prev]);
      toastFn("✅ Thêm đơn hàng thành công!");
      return newOrder;
    } catch (err) {
      console.error("Lỗi thêm đơn hàng:", err);
      toast({
        title: "Lỗi thêm đơn hàng",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  }, [toast]);

  // Update order
  const handleUpdateOrder = useCallback(async (id, data) => {
    try {
      await OrderApi.update(id, data);
      
      setOrders(prev => 
        prev.map(o => o.OrderId === id ? { ...o, ...data } : o)
      );
      
      toastFn("✅ Cập nhật đơn hàng thành công!");
      return true;
    } catch (err) {
      console.error("Lỗi cập nhật đơn hàng:", err);
      toast({
        title: "Lỗi cập nhật",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Delete order
  const handleDeleteOrder = useCallback(async (id) => {
    try {
      await OrderApi.delete(id);
      setOrders(prev => prev.filter(o => o.OrderId !== id));
      toastFn("🗑️ Đã xóa đơn hàng!");
      return true;
    } catch (err) {
      console.error("Lỗi xóa đơn hàng:", err);
      toast({
        title: "Lỗi xóa",
        description: err.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Add note to order
  const handleAddNote = useCallback((id, text) => {
    const note = {
      author: "Nhân viên BO",
      time: new Date().toLocaleString("vi-VN"),
      text
    };
    setOrders(prev => 
      prev.map(o => 
        o.OrderId === id 
          ? { ...o, notes: [...(o.notes || []), note] } 
          : o
      )
    );
  }, []);

  // Handle refund
  const handleRefund = useCallback((id, decision, reason) => {
    const status = decision === "approve" ? "Hoàn tiền" : "Đã hủy";
    const noteText = decision === "approve" 
      ? `Đề xuất duyệt hoàn tiền lên Admin. Ghi chú: ${reason || "—"}`
      : `Từ chối hoàn tiền. Lý do: ${reason || "—"}`;
    
    setOrders(prev => 
      prev.map(o => {
        if (o.OrderId !== id) return o;
        return {
          ...o,
          Status: status,
          notes: [...(o.notes || []), {
            author: "Nhân viên BO",
            time: new Date().toLocaleString("vi-VN"),
            text: noteText
          }]
        };
      })
    );
  }, []);

  // Mark all as seen
  const handleMarkSeen = useCallback(() => {
    setOrders(prev => prev.map(o => ({ ...o, isNew: false })));
    setNewCount(0);
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    const total = orders.length;
    const paid = orders.filter(o => o.Status === "Đã thanh toán" || o.Status === "Đã check-in").length;
    const refund = orders.filter(o => o.Status === "Hoàn tiền").length;
    const revenue = orders
      .filter(o => o.Status === "Đã thanh toán" || o.Status === "Đã check-in")
      .reduce((sum, o) => sum + (parseFloat(o.TotalAmount) || 0), 0);
    
    return { total, paid, refund, revenue };
  }, [orders]);

  // Get user name by id
  const getUserName = useCallback((userId) => {
    const user = users.find(u => u.UserId === userId);
    return user?.FullName || user?.Name || "N/A";
  }, [users]);

  // Get promotion title by id
  const getPromotionTitle = useCallback((promotionId) => {
    if (!promotionId) return "Không có";
    const promo = promotions.find(p => p.PromotionId === promotionId);
    return promo?.Title || promo?.Name || "Không có";
  }, [promotions]);

  // Get order details for a specific order
  const getOrderDetails = useCallback((orderId) => {
    return orderDetails.filter(d => d.OrderId === orderId);
  }, [orderDetails]);

  // Get ticket by id
  const getTicket = useCallback((ticketId) => {
    return tickets.find(t => t.TicketId === ticketId);
  }, [tickets]);

  // Get food by id
  const getFood = useCallback((itemId) => {
    return foods.find(f => f.ItemId === itemId);
  }, [foods]);

  return {
    orders,
    orderDetails,
    users,
    promotions,
    tickets,
    foods,
    loading,
    newCount,
    realtimePulse,
    toastMsg,
    toastFn,
    loadData,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleAddNote,
    handleRefund,
    handleMarkSeen,
    getStats,
    getUserName,
    getPromotionTitle,
    getOrderDetails,
    getTicket,
    getFood,
  };
}