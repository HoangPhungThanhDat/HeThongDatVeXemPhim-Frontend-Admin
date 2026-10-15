// src/views/admin/quanlydatve/index.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Input,
  Select,
  Grid,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdFilterList,
  MdDarkMode,
  MdLightMode,
  MdDownload,
  MdRefresh,
} from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";

import { useOrders } from "./hooks/useOrders";
import { StatCard } from "./components/shared/StatCard";
import OrderRow from "./components/OrderRow";
import OrderCard from "./components/OrderCard";
import { OrderDetail } from "./components/OrderDetail";
import { QRModal } from "./components/QRModal";
// ❌ Xóa import CreateOrderModal
// import { CreateOrderModal } from "./components/CreateOrderModal";
import { fadeUp, fadeIn, slideIn } from "./components/shared/animations";

import {
  ORDER_STATUS_OPTIONS,
  PAY_STATUS_OPTIONS,
} from "./constants";

// ─── Dark Mode Colors ──────────────────────────────────────────────────────
const DARK = {
  bg: "#0a0a18",
  bgCard: "#16213e",
  bgDark: "#0f0f1a",
  bgDeep: "#05050a",
  ink: "#f7fafc",
  ink2: "#e2e8f0",
  ink3: "#a0aec0",
  ink4: "#718096",
  ink5: "#4a5568",
  ink6: "#2d3748",
};

const LIGHT = {
  bg: "#f5f5f2",
  bgCard: "#ffffff",
  bgDark: "#fafafa",
  bgDeep: "#f5f5f5",
  ink: "#0f172a",
  ink2: "#374151",
  ink3: "#64748b",
  ink4: "#94a3b8",
  ink5: "#e2e8f0",
  ink6: "#f1f5f9",
};

export default function QuanLyDatVe() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // ✅ Luôn có G, không bao giờ null
  const G = isDark ? DARK : LIGHT;

  // Colors cho Chakra UI
  const bg = useColorModeValue("#f5f5f2", DARK.bg);
  const bgCard = useColorModeValue("white", DARK.bgCard);
  const ink = useColorModeValue("#0f172a", DARK.ink);
  const ink3 = useColorModeValue("#64748b", DARK.ink3);
  const ink4 = useColorModeValue("#94a3b8", DARK.ink4);
  const ink5 = useColorModeValue("#e2e8f0", DARK.ink5);
  const ink6 = useColorModeValue("#f1f5f9", DARK.ink6);

  // ─── States ──────────────────────────────────────────────────────────────
  const [view, setView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterPayStatus, setFilterPayStatus] = useState("Tất cả");
  const [filterDate, setFilterDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  // ❌ Xóa state showCreateModal
  // const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrTicketId, setQrTicketId] = useState("");
  
  const toastTimer = useRef(null);

  // ─── Hooks ──────────────────────────────────────────────────────────────
  const {
    orders,
    loading,
    stats,
    fetchOrders,
    fetchOrderDetail,
    updateNote,
    processRefund,
    // ❌ Xóa createOrder khỏi useOrders nếu không dùng
    // createOrder,
  } = useOrders();

  // ─── Load data ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Auto refresh ─────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ─── Filters ──────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    
    if (!q) {
      const matchStatus = filterStatus === "Tất cả" || o.status === filterStatus;
      const matchPayStatus = filterPayStatus === "Tất cả" || o.payStatus === filterPayStatus;
      const matchDate = !filterDate || (o.createdAt && o.createdAt.startsWith(filterDate));
      return matchStatus && matchPayStatus && matchDate;
    }
    
    const searchFields = [
      String(o.id || o.OrderId || ""),
      String(o.customer || o.customerName || ""),
      String(o.email || ""),
      String(o.phone || ""),
      String(o.movie || ""),
      String(o.cinema || ""),
      String(o.room || ""),
    ];
    
    const matchSearch = searchFields.some(field => 
      field.toLowerCase().includes(q)
    );
    
    const matchStatus = filterStatus === "Tất cả" || o.status === filterStatus;
    const matchPayStatus = filterPayStatus === "Tất cả" || o.payStatus === filterPayStatus;
    const matchDate = !filterDate || (o.createdAt && o.createdAt.startsWith(filterDate));
    
    return matchSearch && matchStatus && matchPayStatus && matchDate;
  });

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleView = async (order) => {
    try {
      setNewOrderCount((c) => Math.max(0, c - (order.isNew ? 1 : 0)));
      
      const detail = await fetchOrderDetail(order.id);
      
      setSelectedOrder({
        ...order,
        ...detail,
        isNew: false,
      });
      setView("detail");
    } catch (err) {
      console.error("❌ Lỗi xem chi tiết đơn hàng:", err);
      showToast("❌ Không thể tải chi tiết đơn hàng");
    }
  };

  const handleBack = () => {
    setView("list");
    setSelectedOrder(null);
  };

  const handleUpdateNote = async (id, note) => {
    try {
      await updateNote(id, note);
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => ({ ...prev, note }));
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật ghi chú:", err);
      showToast("❌ Không thể cập nhật ghi chú");
    }
  };

  const handleApproveRefund = async (id) => {
    try {
      await processRefund(id, "approve");
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: "Hoàn tiền",
          payStatus: "Đã hoàn",
          refundStatus: "Đã duyệt",
        }));
      }
      await fetchOrders();
      showToast("✅ Đã duyệt hoàn tiền thành công");
    } catch (err) {
      console.error("❌ Lỗi duyệt hoàn tiền:", err);
      showToast("❌ Không thể duyệt hoàn tiền");
    }
  };

  const handleRejectRefund = async (id, reason) => {
    try {
      await processRefund(id, "reject", reason);
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          refundStatus: "Từ chối",
        }));
      }
      await fetchOrders();
      showToast("✅ Đã từ chối hoàn tiền");
    } catch (err) {
      console.error("❌ Lỗi từ chối hoàn tiền:", err);
      showToast("❌ Không thể từ chối hoàn tiền");
    }
  };

  // ❌ Xóa hàm handleCreateOrder
  // const handleCreateOrder = async (data) => { ... };

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 4000);
  };

  const handleExport = () => {
    try {
      showToast("📥 Đang xuất danh sách đơn hàng...");
    } catch (err) {
      console.error("❌ Lỗi xuất file:", err);
      showToast("❌ Không thể xuất file");
    }
  };

  // ─── Detail View ──────────────────────────────────────────────────────
  if (view === "detail" && selectedOrder) {
    const live = orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px={{ base: "12px", md: "0" }}>
        {showQR && (
          <QRModal ticketId={qrTicketId} onClose={() => setShowQR(false)} G={G} />
        )}
        <OrderDetail
          order={live}
          onBack={handleBack}
          onUpdateNote={handleUpdateNote}
          onApproveRefund={handleApproveRefund}
          onRejectRefund={handleRejectRefund}
          G={G}
        />
      </Box>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────
  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" position="relative" px={{ base: "12px", md: "0" }}>
      {/* ❌ Xóa CreateOrderModal */}
      {/* {showQR && <QRModal ... />} */}
      
      {showQR && (
        <QRModal ticketId={qrTicketId} onClose={() => setShowQR(false)} G={G} />
      )}

      {/* Toast */}
      {toastMsg && (
        <Box
          position="fixed"
          bottom="24px"
          right="24px"
          zIndex="300"
          bg={bgCard}
          borderRadius="12px"
          border={`1px solid ${ink6}`}
          boxShadow="0 8px 32px rgba(0,0,0,0.14)"
          px="16px"
          py="12px"
          maxW="320px"
          sx={{ animation: `${slideIn} 0.3s ease both` }}
        >
          <Text fontSize="13px" fontWeight="600" color={ink}>
            {toastMsg}
          </Text>
        </Box>
      )}

      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb="18px"
        gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box
              w="38px"
              h="38px"
              borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaTicketAlt} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "21px", md: "26px" }} fontWeight="800" color={ink} letterSpacing="-0.5px">
              Quản lý Đặt Vé
            </Text>
          </Flex>
          <Text color={isDark ? G.ink4 : "#94a3b8"} fontSize="13px" pl="48px">
            Tra cứu, lọc và xử lý toàn bộ đơn đặt vé · Realtime
          </Text>
        </Box>

        <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }} flexWrap="wrap">
          <Button
            h="40px"
            w="40px"
            p="0"
            borderRadius="10px"
            bg={isDark ? G.ink6 : "#f8fafc"}
            color={isDark ? G.ink2 : "#475569"}
            border={isDark ? `1.5px solid ${G.ink5}` : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />
          </Button>

          {/* ❌ XÓA NÚT TẠO ĐƠN THỦ CÔNG */}
          {/* <Button
            h="40px"
            px="14px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="12px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            boxShadow="0 3px 12px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} boxSize="14px" />}
            onClick={() => setShowCreateModal(true)}
          >
            Tạo đơn thủ công
          </Button> */}

          <Button
            h="40px"
            px="16px"
            borderRadius="10px"
            fontSize="13px"
            fontWeight="700"
            bg={isDark ? G.ink6 : "#f8fafc"}
            color={isDark ? G.ink2 : "#475569"}
            border={isDark ? `1px solid ${G.ink5}` : "1px solid #e2e8f0"}
            leftIcon={<Icon as={MdDownload} />}
            _hover={{ bg: isDark ? G.ink6 : "#f1f5f9" }}
            onClick={handleExport}
          >
            Export
          </Button>

          <Button
            h="40px"
            px="12px"
            borderRadius="10px"
            fontSize="12px"
            fontWeight="600"
            bg={isDark ? G.ink6 : "#f8fafc"}
            color={isDark ? G.ink2 : "#475569"}
            border={isDark ? `1px solid ${G.ink5}` : "1px solid #e2e8f0"}
            leftIcon={<Icon as={MdRefresh} />}
            _hover={{ bg: isDark ? G.ink6 : "#f1f5f9" }}
            onClick={() => fetchOrders()}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} spacing="12px" mb="18px">
        <StatCard label="Tổng đơn" value={stats.total || 0} icon={FaTicketAlt} accent="#f97316" delay={0} G={G} />
        <StatCard label="Chờ xử lý" value={stats.pending || 0} icon={FaTicketAlt} accent="#3b82f6" delay={0.04} G={G} />
        <StatCard label="Đã check-in" value={stats.paid || 0} icon={FaTicketAlt} accent="#10b981" delay={0.08} G={G} />
        <StatCard label="Chờ hoàn tiền" value={stats.refund || 0} icon={FaTicketAlt} accent="#d97706" delay={0.12} G={G} />
        <StatCard 
          label="Doanh thu" 
          value={`${((stats.revenue || 0) / 1000000).toFixed(1)}M`} 
          icon={FaTicketAlt} 
          accent="#f97316" 
          delay={0.16} 
          G={G} 
          sub="đã thanh toán" 
        />
      </SimpleGrid>

      {/* Table Card */}
      <Box
        bg={bgCard}
        borderRadius="16px"
        border={`1px solid ${isDark ? G.ink5 : "#f1f5f9"}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Header */}
        <Box p={{ base: "14px 16px", md: "16px 20px 14px" }} borderBottom={`1px solid ${isDark ? G.ink5 : "#f8fafc"}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "13px", md: "14.5px" }} color={ink}>
                Danh sách đặt vé
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} đơn</Text>
              </Box>
              <Flex align="center" gap="5px" px="8px" py="3px" borderRadius="6px" bg="#ecfdf5" border="1px solid #6ee7b7">
                <Box w="6px" h="6px" borderRadius="full" bg="#10b981" sx={{ animation: "pulse 2s ease infinite" }} />
                <Text fontSize="10px" fontWeight="700" color="#059669">Realtime</Text>
              </Flex>
            </Flex>
            <Button
              display={{ base: "flex", md: "none" }}
              size="sm"
              h="34px"
              px="12px"
              borderRadius="9px"
              bg={isDark ? G.ink6 : "#f8fafc"}
              color={isDark ? G.ink3 : "#64748b"}
              border={isDark ? `1px solid ${G.ink5}` : "1px solid #e2e8f0"}
              fontSize="12px"
              fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: isDark ? G.ink6 : "#f1f5f9" }}
              onClick={() => setShowFilter((v) => !v)}
            >
              Lọc
            </Button>
          </Flex>

          {/* Filters */}
          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr" }} gap="8px">
              <Box position="relative">
                <Icon
                  as={MdSearch}
                  position="absolute"
                  left="10px"
                  top="50%"
                  transform="translateY(-50%)"
                  boxSize="13px"
                  color={isDark ? G.ink4 : "#94a3b8"}
                  zIndex="1"
                />
                <Input
                  pl="30px"
                  h={{ base: "40px", md: "34px" }}
                  w="100%"
                  fontSize="12.5px"
                  fontWeight="500"
                  placeholder="Mã đơn, tên, SĐT, email..."
                  bg={isDark ? G.ink6 : "#f8fafc"}
                  border={isDark ? `1px solid ${G.ink5}` : "1px solid #e8edf3"}
                  borderRadius="9px"
                  color={isDark ? G.ink : "#374151"}
                  _placeholder={{ color: isDark ? G.ink4 : "#b0bac8" }}
                  _focus={{
                    border: "1.5px solid #f97316",
                    boxShadow: "0 0 0 3px rgba(249,115,22,0.08)",
                    bg: isDark ? G.bgCard : "#fff",
                  }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select
                h={{ base: "40px", md: "34px" }}
                fontSize="12.5px"
                fontWeight="600"
                color={isDark ? G.ink : "#374151"}
                bg={isDark ? G.ink6 : "#f8fafc"}
                border={isDark ? `1px solid ${G.ink5}` : "1px solid #e8edf3"}
                borderRadius="9px"
                _focus={{
                  border: "1.5px solid #f97316",
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.08)",
                }}
                _hover={{ border: "1px solid #f97316" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {ORDER_STATUS_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
              <Select
                h={{ base: "40px", md: "34px" }}
                fontSize="12.5px"
                fontWeight="600"
                color={isDark ? G.ink : "#374151"}
                bg={isDark ? G.ink6 : "#f8fafc"}
                border={isDark ? `1px solid ${G.ink5}` : "1px solid #e8edf3"}
                borderRadius="9px"
                _focus={{
                  border: "1.5px solid #f97316",
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.08)",
                }}
                _hover={{ border: "1px solid #f97316" }}
                value={filterPayStatus}
                onChange={(e) => setFilterPayStatus(e.target.value)}
              >
                {PAY_STATUS_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
              <Input
                type="date"
                h={{ base: "40px", md: "34px" }}
                fontSize="12px"
                fontWeight="500"
                color={isDark ? G.ink : "#374151"}
                bg={isDark ? G.ink6 : "#f8fafc"}
                border={isDark ? `1px solid ${G.ink5}` : "1px solid #e8edf3"}
                borderRadius="9px"
                _focus={{
                  border: "1.5px solid #f97316",
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.08)",
                }}
                _hover={{ border: "1px solid #f97316" }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </Grid>
          </Box>
        </Box>

        {/* Column Headers (Desktop) */}
        <Flex
          px="18px"
          py="9px"
          bg={isDark ? G.ink6 : "#fafbfc"}
          borderBottom={`1px solid ${isDark ? G.ink5 : "#f1f5f9"}`}
          display={{ base: "none", md: "flex" }}
        >
          <Box w="30px" flexShrink="0" />
          {[
            { label: "Mã đơn / Giờ đặt", flex: "1.2" },
            { label: "Khách hàng", flex: "1.2" },
            { label: "Phim / Rạp", flex: "1.4" },
            { label: "Ghế", flex: "0.8" },
            { label: "Tổng tiền", flex: "0.9" },
            { label: "Trạng thái", flex: "0.85" },
            { label: "Thanh toán", flex: "0.9" },
          ].map(({ label, flex }) => (
            <Box key={label} flex={flex} minW="0" pr="8px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                {label}
              </Text>
            </Box>
          ))}
          <Box w="80px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
              Thao tác
            </Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {loading && filtered.length === 0 ? (
            <Flex align="center" justify="center" py="48px">
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                border="3px solid #f97316"
                borderTopColor="transparent"
                animation="spin 1s linear infinite"
              />
            </Flex>
          ) : filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px" color={isDark ? G.ink4 : "#cbd5e1"}>
              <Icon as={FaTicketAlt} boxSize="30px" mb="10px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? G.ink3 : "#94a3b8"}>Không tìm thấy đơn nào</Text>
              <Text fontSize="12px" color={isDark ? G.ink4 : "#cbd5e1"} mt="4px">Thử thay đổi bộ lọc</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((o, i) => (
                <React.Fragment key={o.id}>
                  <OrderRow order={o} index={i} onView={handleView} G={G} />
                  <OrderCard order={o} index={i} onView={handleView} G={G} />
                </React.Fragment>
              ))}
            </Flex>
          )}
        </Box>

        {/* Footer */}
        {filtered.length > 0 && (
          <Box
            px={{ base: "14px", md: "20px" }}
            py="12px"
            borderTop={`1px solid ${isDark ? G.ink5 : "#f8fafc"}`}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="12px" color={isDark ? G.ink4 : "#94a3b8"}>
              Hiển thị <strong>{filtered.length}</strong> / {orders.length} đơn hàng
            </Text>
            <Flex gap="6px" align="center">
              <Icon as={MdRefresh} boxSize="12px" color={isDark ? G.ink4 : "#94a3b8"} />
              <Text fontSize="11px" color={isDark ? G.ink4 : "#94a3b8"}>Tự động cập nhật mỗi 30s</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}