// src/views/admin/quanlydonhang/index.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Input,
  Select,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdFilterAlt,
  MdDarkMode,
  MdLightMode,
  MdReceiptLong,
  MdPayment,
  MdReplay,
  MdShield,
} from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";

import { useOrders } from "./hooks/useOrders";
import { StatCard } from "./components/shared/StatCard";
import { OrderRow } from "./components/OrderRow";
import { OrderCard } from "./components/OrderCard";
import { OrderDetail } from "./components/OrderDetail";
import { DeleteModal } from "./components/DeleteModal";
import { RefundModal } from "./components/RefundModal";
import { FilterDrawer } from "./components/FilterDrawer";
import { exportOrdersToCSV } from "./utils/exportExcel";
import { fadeUp, popIn } from "./components/shared/animations";
import { 
  fmtVND, 
  OR, 
  ORL, 
  ORBD, 
  ORSW, 
  ORDER_STATUS_OPTIONS, 
  PAYMENT_STATUS_OPTIONS 
} from "./constants";

// ─── Dark Mode Colors ──────────────────────────────────────────────────────
const DARK = {
  bg: "#111c44",
  cardBg: "#0b1437",
  border: "#2D3A6B",
  text: "#f7fafc",
  textSecondary: "#718096",
  labelColor: "#a0aec0",
};

const LIGHT = {
  bg: "#f8fafc",
  cardBg: "#ffffff",
  border: "#f1f5f9",
  text: "#0f172a",
  textSecondary: "#94a3b8",
  labelColor: "#64748b",
};

export default function QuanLyDonHang() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const G = isDark ? DARK : LIGHT;

  // ─── State ──────────────────────────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(true);
  const [view, setView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCinema, setFilterCinema] = useState("Tất cả");
  const [filterMovie, setFilterMovie] = useState("Tất cả");
  const [filterPayment, setFilterPayment] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showSearch, setShowSearch] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const { isOpen: isFilterOpen, onOpen: openFilter, onClose: closeFilter } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // ─── Hooks ──────────────────────────────────────────────────────────────
  const { orders, loading, stats, fetchOrders, updateNote, deleteOrder, processRefund } = useOrders();

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
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        o.code?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.movieTitle?.toLowerCase().includes(q);
      const matchCinema = filterCinema === "Tất cả" || o.cinema === filterCinema;
      const matchMovie = filterMovie === "Tất cả" || o.movieTitle === filterMovie;
      const matchPayment = filterPayment === "Tất cả" || o.paymentStatus === filterPayment;
      const matchStatus = filterStatus === "Tất cả" || o.orderStatus === filterStatus;
      return matchSearch && matchCinema && matchMovie && matchPayment && matchStatus;
    });
  }, [orders, search, filterCinema, filterMovie, filterPayment, filterStatus]);

  // ─── Stats ─────────────────────────────────────────────────────────────
  const newCount = orders.filter((o) => o.isNew).length;
  const pendingRefundCount = orders.filter((o) => o.refundStatus === "Đang chờ duyệt").length;
  const activeFilterCount = [filterCinema, filterMovie, filterPayment, filterStatus].filter((f) => f !== "Tất cả").length;

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleView = (order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
    setSelectedOrder(null);
  };

  const handleDeleteConfirm = async (target) => {
    await deleteOrder(target.id);
    setDeleteTarget(null);
    if (view === "detail") setView("list");
    await fetchOrders();
  };

  const handleApproveRefund = async (target) => {
    await processRefund(target.id, "approve");
    setRefundTarget(null);
    await fetchOrders();
  };

  const handleRejectRefund = async (target, reason) => {
    await processRefund(target.id, "reject", reason);
    setRefundTarget(null);
    await fetchOrders();
  };

  const handleSaveNote = async (target, note) => {
    await updateNote(target.id, note);
    if (selectedOrder?.id === target.id) {
      setSelectedOrder((prev) => ({ ...prev, note }));
    }
  };

  const handleExport = () => {
    exportOrdersToCSV(filtered);
  };

  // ─── Colors ────────────────────────────────────────────────────────────
  const bg = useColorModeValue("#f8fafc", "#111c44");
  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const textSecondary = useColorModeValue("#94a3b8", "#718096");

  // ─── Detail View ──────────────────────────────────────────────────────
  if (view === "detail" && selectedOrder) {
    const live = orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
    return (
      <Box pt={{ base: "100px", md: "80px" }} px={{ base: "12px", md: "0" }} bg={bg} minH="100vh">
        <DeleteModal
          order={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isDark={isDark}
        />
        <RefundModal
          order={refundTarget}
          onClose={() => setRefundTarget(null)}
          onApprove={handleApproveRefund}
          onReject={handleRejectRefund}
          isDark={isDark}
        />
        <OrderDetail
          order={live}
          onBack={handleBack}
          onDelete={(tk) => setDeleteTarget(tk)}
          onOpenRefund={(tk) => setRefundTarget(tk)}
          onSaveNote={handleSaveNote}
          isAdmin={isAdmin}
          isDark={isDark}
        />
      </Box>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────
  return (
    <Box pt={{ base: "100px", md: "80px" }} px={{ base: "0", md: "0" }} bg={bg} minH="100vh">
      {/* Modals */}
      <DeleteModal
        order={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDark={isDark}
      />
      <RefundModal
        order={refundTarget}
        onClose={() => setRefundTarget(null)}
        onApprove={handleApproveRefund}
        onReject={handleRejectRefund}
        isDark={isDark}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={closeFilter}
        filterCinema={filterCinema}
        setFilterCinema={setFilterCinema}
        filterPayment={filterPayment}
        setFilterPayment={setFilterPayment}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isDark={isDark}
      />

      {/* ─── Header ────────────────────────────────────────────────────── */}
      <Box px={{ base: "16px", md: "0" }}>
        <Flex justify="space-between" align="center" mb="16px" sx={{ animation: `${fadeUp} .4s ease both` }}>
          <Flex align="center" gap="10px">
            <Box
              position="relative"
              w={{ base: "36px", md: "38px" }}
              h={{ base: "36px", md: "38px" }}
              borderRadius="11px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 12px ${ORSW}`}
            >
              <Icon as={MdReceiptLong} boxSize={{ base: "16px", md: "18px" }} color="white" />
              {newCount > 0 && (
                <Flex
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  w="18px"
                  h="18px"
                  borderRadius="full"
                  bg="#dc2626"
                  border="2px solid white"
                  align="center"
                  justify="center"
                  sx={{ animation: `${popIn} .4s ease both` }}
                >
                  <Text fontSize="9px" fontWeight="800" color="white">{newCount}</Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={textColor} letterSpacing="-.5px">
                Quản lý đơn hàng
              </Text>
              <Text color={textSecondary} fontSize={{ base: "11px", md: "13px" }} display={{ base: "none", md: "block" }}>
                Theo dõi, lọc và xử lý toàn bộ đơn đặt vé theo thời gian thực
              </Text>
            </Box>
          </Flex>

          <Flex gap="8px" align="center">
            <Tooltip label="Chuyển vai trò xem trước (demo)" fontSize="11px">
              <Button
                h="38px"
                px="12px"
                borderRadius="10px"
                fontSize="11.5px"
                fontWeight="700"
                display={{ base: "none", lg: "flex" }}
                bg={isAdmin ? "#fff7ed" : (isDark ? "#1B254B" : "#f8fafc")}
                color={isAdmin ? OR : (isDark ? "#e2e8f0" : "#475569")}
                border={`1.5px solid ${isAdmin ? ORBD : (isDark ? "#2D3A6B" : "#e2e8f0")}`}
                leftIcon={<Icon as={MdShield} boxSize="13px" />}
                onClick={() => setIsAdmin((v) => !v)}
              >
                {isAdmin ? "Admin" : "Back-office"}
              </Button>
            </Tooltip>

            <Button
              h="38px"
              w="38px"
              minW="38px"
              p="0"
              borderRadius="10px"
              bg={isDark ? "#1B254B" : "#f8fafc"}
              color={isDark ? "#e2e8f0" : "#475569"}
              border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e2e8f0"}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
            >
              <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
            </Button>

            <Button
              h="38px"
              px="14px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="12px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              color="white"
              boxShadow={`0 3px 12px ${ORSW}`}
              _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all .2s"
              leftIcon={<Icon as={FaFileExcel} boxSize="13px" />}
              onClick={handleExport}
              display={isAdmin ? { base: "none", md: "flex" } : "none"}
            >
              <Text>Export Excel</Text>
            </Button>
          </Flex>
        </Flex>

        {/* ─── Mobile Toolbar ──────────────────────────────────────────── */}
        <Flex gap="8px" mb="12px" display={{ base: "flex", md: "none" }}>
          {isAdmin && (
            <Button
              flex="1"
              h="40px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="12.5px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              color="white"
              boxShadow={`0 3px 12px ${ORSW}`}
              leftIcon={<Icon as={FaFileExcel} boxSize="13px" />}
              onClick={handleExport}
            >
              Export Excel
            </Button>
          )}
          <Button
            h="40px"
            w="40px"
            minW="40px"
            p="0"
            borderRadius="10px"
            bg={showSearch ? "#fff7ed" : (isDark ? "#1B254B" : "#f8fafc")}
            color={showSearch ? OR : (isDark ? "#e2e8f0" : "#475569")}
            border={isDark ? `1.5px solid ${showSearch ? ORBD : "#2D3A6B"}` : `1.5px solid ${showSearch ? ORBD : "#e2e8f0"}`}
            onClick={() => setShowSearch((v) => !v)}
          >
            <Icon as={MdSearch} boxSize="16px" />
          </Button>
          <Button
            h="40px"
            w="40px"
            minW="40px"
            p="0"
            borderRadius="10px"
            position="relative"
            bg={activeFilterCount > 0 ? "#fff7ed" : (isDark ? "#1B254B" : "#f8fafc")}
            color={activeFilterCount > 0 ? OR : (isDark ? "#e2e8f0" : "#475569")}
            border={isDark ? `1.5px solid ${activeFilterCount > 0 ? ORBD : "#2D3A6B"}` : `1.5px solid ${activeFilterCount > 0 ? ORBD : "#e2e8f0"}`}
            onClick={openFilter}
          >
            <Icon as={MdFilterAlt} boxSize="16px" />
            {activeFilterCount > 0 && (
              <Flex
                position="absolute"
                top="-4px"
                right="-4px"
                w="16px"
                h="16px"
                borderRadius="full"
                bg={OR}
                align="center"
                justify="center"
              >
                <Text fontSize="9px" fontWeight="800" color="white">{activeFilterCount}</Text>
              </Flex>
            )}
          </Button>
        </Flex>

        {/* ─── Mobile Search ───────────────────────────────────────────── */}
        {showSearch && (
          <Box mb="12px" display={{ base: "block", md: "none" }} sx={{ animation: `${fadeUp} .2s ease both` }}>
            <Box position="relative">
              <Icon 
                as={MdSearch} 
                position="absolute" 
                left="12px" 
                top="50%" 
                transform="translateY(-50%)" 
                boxSize="16px" 
                color={textSecondary} 
                zIndex="1" 
              />
              <Input
                pl="36px"
                h="42px"
                fontSize="13px"
                fontWeight="500"
                placeholder="Tìm mã đơn, tên khách, SĐT, phim..."
                bg={isDark ? "#0b1437" : "white"}
                border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e8edf3"}
                borderRadius="12px"
                color={isDark ? "#e2e8f0" : "#374151"}
                _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
                _focus={{ 
                  border: `1.5px solid ${OR}`, 
                  boxShadow: `0 0 0 3px rgba(234,88,12,.08)`, 
                  bg: isDark ? "#0b1437" : "#fff" 
                }}
                transition="all .2s"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* ─── Stats ──────────────────────────────────────────────────────── */}
      <Box px={{ base: "16px", md: "0" }} mb="16px">
        <SimpleGrid columns={{ base: 2, sm: 4, md: 4 }} spacing={{ base: "8px", md: "14px" }}>
          <StatCard 
            label="Tổng đơn hàng" 
            value={stats.total || 0} 
            icon={MdReceiptLong} 
            accent={OR} 
            delay={0} 
            isDark={isDark} 
            sub={`${newCount} đơn mới`} 
          />
          <StatCard 
            label="Doanh thu hôm nay" 
            value={fmtVND(stats.revenue || 0)} 
            icon={MdPayment} 
            accent="#10b981" 
            delay={0.04} 
            isDark={isDark} 
          />
          <StatCard 
            label="Chờ hoàn tiền" 
            value={pendingRefundCount} 
            icon={MdReplay} 
            accent="#7c3aed" 
            delay={0.08} 
            isDark={isDark} 
          />
          <StatCard 
            label="Đã thanh toán" 
            value={stats.paid || 0} 
            icon={MdReceiptLong} 
            accent={OR} 
            delay={0.12} 
            isDark={isDark} 
          />
        </SimpleGrid>
      </Box>

      {/* ─── Table ──────────────────────────────────────────────────────── */}
      <Box
        bg={isDark ? "#0b1437" : "white"}
        borderRadius={{ base: "16px 16px 0 0", md: "16px" }}
        border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
        sx={{ animation: `${fadeUp} .4s ease .1s both` }}
      >
        {/* ─── Desktop Toolbar ─────────────────────────────────────────── */}
        <Box display={{ base: "none", md: "block" }}>
          <Flex
            align="center"
            justify="space-between"
            p="18px 20px 14px"
            borderBottom={isDark ? "1px solid #2D3A6B" : "1px solid #f8fafc"}
            flexWrap="wrap"
            gap="10px"
          >
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color={textColor}>
                Danh sách đơn hàng
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length} đơn</Text>
              </Box>
              <Flex align="center" gap="5px" px="8px" py="3px" borderRadius="6px" bg="#ecfdf5" border="1px solid #6ee7b7">
                <Box w="6px" h="6px" borderRadius="full" bg="#10b981" sx={{ animation: "pulse 2s ease infinite" }} />
                <Text fontSize="10px" fontWeight="700" color="#059669">Realtime</Text>
              </Flex>
            </Flex>
            <Flex gap="8px" align="center" flexWrap="wrap">
              <Box position="relative">
                <Icon 
                  as={MdSearch} 
                  position="absolute" 
                  left="10px" 
                  top="50%" 
                  transform="translateY(-50%)" 
                  boxSize="14px" 
                  color={textSecondary} 
                  zIndex="1" 
                />
                <Input
                  pl="30px"
                  h="34px"
                  w="220px"
                  fontSize="12.5px"
                  fontWeight="500"
                  placeholder="Tìm mã đơn, khách, SĐT, phim..."
                  bg={isDark ? "#1B254B" : "#f8fafc"}
                  border={isDark ? "1px solid #2D3A6B" : "1px solid #e8edf3"}
                  borderRadius="9px"
                  color={isDark ? "#e2e8f0" : "#374151"}
                  _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
                  _focus={{ 
                    border: `1.5px solid ${OR}`, 
                    boxShadow: `0 0 0 3px rgba(234,88,12,.08)`, 
                    bg: isDark ? "#1B254B" : "#fff" 
                  }}
                  _hover={{ border: `1px solid ${OR}` }}
                  transition="all .2s"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select
                h="34px"
                fontSize="12px"
                fontWeight="600"
                color={isDark ? "#e2e8f0" : "#374151"}
                bg={isDark ? "#1B254B" : "#f8fafc"}
                border={isDark ? "1px solid #2D3A6B" : "1px solid #e8edf3"}
                borderRadius="9px"
                w="140px"
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)` }}
                _hover={{ border: `1px solid ${OR}` }}
                transition="all .2s"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                {ORDER_STATUS_OPTIONS.slice(1).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
              <Select
                h="34px"
                fontSize="12px"
                fontWeight="600"
                color={isDark ? "#e2e8f0" : "#374151"}
                bg={isDark ? "#1B254B" : "#f8fafc"}
                border={isDark ? "1px solid #2D3A6B" : "1px solid #e8edf3"}
                borderRadius="9px"
                w="140px"
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)` }}
                _hover={{ border: `1px solid ${OR}` }}
                transition="all .2s"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
              >
                <option value="Tất cả">Tất cả thanh toán</option>
                {PAYMENT_STATUS_OPTIONS.slice(1).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Box>

        {/* ─── Mobile Toolbar ──────────────────────────────────────────── */}
        <Box display={{ base: "block", md: "none" }}>
          <Flex
            align="center"
            justify="space-between"
            px="16px"
            py="12px"
            borderBottom={isDark ? "1px solid #2D3A6B" : "1px solid #f8fafc"}
          >
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="14px" color={textColor}>Danh sách đơn hàng</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length}</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* ─── Column Headers (Desktop) ────────────────────────────────── */}
        <Box display={{ base: "none", md: "block" }}>
          <Flex
            align="center"
            px="16px"
            py="10px"
            bg={isDark ? "#1B254B" : "#fafbfc"}
            borderBottom={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
          >
            <Box w="36px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                #
              </Text>
            </Box>
            <Box flex="1" pr="12px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Khách hàng / Phim
              </Text>
            </Box>
            <Box w="150px" flexShrink="0" pr="10px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Rạp / Phòng
              </Text>
            </Box>
            <Box w="138px" flexShrink="0" pr="10px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Suất chiếu
              </Text>
            </Box>
            <Box w="116px" flexShrink="0" pr="10px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Tổng tiền
              </Text>
            </Box>
            <Box w="132px" flexShrink="0" pr="10px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Thanh toán
              </Text>
            </Box>
            <Box w="128px" flexShrink="0" pr="10px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Trạng thái
              </Text>
            </Box>
            <Box w="140px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* ─── Rows ────────────────────────────────────────────────────── */}
        <Box p={{ base: "12px", md: "10px" }}>
          {loading && filtered.length === 0 ? (
            <Flex align="center" justify="center" py="40px">
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
            <Flex direction="column" align="center" justify="center" py="40px" color={isDark ? "#2D3A6B" : "#cbd5e1"}>
              <Icon as={MdReceiptLong} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={textSecondary}>Không tìm thấy đơn hàng nào</Text>
              <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"} mt="4px">Thử thay đổi bộ lọc</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap={{ base: "8px", md: "6px" }}>
              {filtered.map((o, i) =>
                isMobile ? (
                  <OrderCard
                    key={o.id}
                    order={o}
                    index={i}
                    onView={handleView}
                    onDelete={(tk) => setDeleteTarget(tk)}
                    isAdmin={isAdmin}
                    isDark={isDark}
                  />
                ) : (
                  <OrderRow
                    key={o.id}
                    order={o}
                    index={i}
                    onView={handleView}
                    onDelete={(tk) => setDeleteTarget(tk)}
                    isAdmin={isAdmin}
                    isDark={isDark}
                  />
                )
              )}
            </Flex>
          )}
        </Box>

        {/* ─── Footer ──────────────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <Box
            px={{ base: "14px", md: "20px" }}
            py="12px"
            borderTop={isDark ? "1px solid #2D3A6B" : "1px solid #f8fafc"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>
              Hiển thị <strong>{filtered.length}</strong> / {orders.length} đơn hàng
            </Text>
            <Flex gap="6px" align="center">
              <Box w="6px" h="6px" borderRadius="full" bg="#10b981" sx={{ animation: "pulse 2s ease infinite" }} />
              <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>Tự động cập nhật mỗi 30s</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}