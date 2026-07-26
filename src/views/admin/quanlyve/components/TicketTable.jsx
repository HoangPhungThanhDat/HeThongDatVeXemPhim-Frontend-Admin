// src/views/admin/quanlyve/components/TicketTable.jsx
import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdVisibility, MdEdit } from "react-icons/md";
import { FaQrcode } from "react-icons/fa";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  shadow: "0 2px 12px rgba(26, 58, 92, 0.3)",
  hoverBg: "#142d4f",
  buttonBg: "#0a1f35",
  buttonBorder: "#1a3a5c",
  inputBg: "#0d2847",
};

const STATUS_CFG = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã check-in": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

// Dark mode status config
const DARK_STATUS_CFG = {
  "Đã thanh toán": { color: "#4ade80", bg: "rgba(74, 222, 128, 0.12)", border: "rgba(74, 222, 128, 0.3)", dot: "#4ade80" },
  "Paid": { color: "#4ade80", bg: "rgba(74, 222, 128, 0.12)", border: "rgba(74, 222, 128, 0.3)", dot: "#4ade80" },
  "Đã check-in": { color: "#fb923c", bg: "rgba(251, 146, 60, 0.12)", border: "rgba(251, 146, 60, 0.3)", dot: "#fb923c" },
  "Chờ xử lý": { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.12)", border: "rgba(251, 191, 36, 0.3)", dot: "#fbbf24" },
  "Pending": { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.12)", border: "rgba(251, 191, 36, 0.3)", dot: "#fbbf24" },
  "Đã hủy": { color: "#f87171", bg: "rgba(248, 113, 113, 0.12)", border: "rgba(248, 113, 113, 0.3)", dot: "#f87171" },
  "Cancelled": { color: "#f87171", bg: "rgba(248, 113, 113, 0.12)", border: "rgba(248, 113, 113, 0.3)", dot: "#f87171" },
  "Hết hạn": { color: "#88b4d8", bg: "rgba(136, 180, 216, 0.08)", border: "rgba(136, 180, 216, 0.15)", dot: "#88b4d8" },
};

const StatusBadge = ({ status, isDark }) => {
  const cfg = isDark 
    ? (DARK_STATUS_CFG[status] || DARK_STATUS_CFG["Hết hạn"])
    : (STATUS_CFG[status] || STATUS_CFG["Hết hạn"]);
  
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">
        {status}
      </Text>
    </Flex>
  );
};

// ✅ Thêm cột Combo
const COL = {
  idx: "36px",
  code: "76px",
  customer: "150px",
  movie: "1",
  seat: "56px",
  price: "90px",
  combo: "120px", // ✅ Thêm cột Combo
  status: "138px",
  actions: "158px",
};

export const TicketTable = ({ tickets, onView, onEdit, onQR, isDark, loading }) => {
  const OR = "#ea580c";
  const ORBD = "#fed7aa";
  const ORPL = "#fff7ed";
  const ORSW = "rgba(234,88,12,0.25)";
  
  // Dark mode colors
  const DARK_ACCENT = "#4a9eff";
  const DARK_ACCENT_BD = "rgba(74, 158, 255, 0.3)";
  const DARK_ACCENT_PL = "rgba(74, 158, 255, 0.08)";
  const DARK_ACCENT_SW = "rgba(74, 158, 255, 0.25)";

  if (loading) {
    return (
      <Box p="40px" textAlign="center">
        <Text color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>Đang tải dữ liệu...</Text>
      </Box>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box p="40px" textAlign="center">
        <Text color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>Không tìm thấy vé nào</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Flex align="center" px="16px" py="10px" bg={isDark ? DARK_THEME.cardBg : "#fafbfc"} borderBottom={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f1f5f9"}>
        <Box w={COL.idx} flexShrink="0">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">#</Text>
        </Box>
        <Box w={COL.code} flexShrink="0">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Mã vé</Text>
        </Box>
        <Box w={COL.customer} flexShrink="0" pr="12px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Khách hàng</Text>
        </Box>
        <Box flex="1" pr="12px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Phim / Suất chiếu</Text>
        </Box>
        <Box w={COL.seat} flexShrink="0" pr="10px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Ghế</Text>
        </Box>
        <Box w={COL.price} flexShrink="0" pr="10px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Giá vé</Text>
        </Box>
        <Box w={COL.combo} flexShrink="0" pr="10px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Combo</Text>
        </Box>
        <Box w={COL.status} flexShrink="0" pr="10px">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
        </Box>
        <Box w={COL.actions} flexShrink="0">
          <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
        </Box>
      </Flex>

      {/* Rows */}
      {tickets.map((ticket, index) => {
        // Check if status should use dark mode colors
        const isStatusPaid = ticket.status === "Đã thanh toán" || ticket.status === "Paid";
        
        return (
          <Flex
            key={ticket.id || index}
            align="center"
            px="16px"
            py="12px"
            borderRadius="10px"
            bg={isDark ? DARK_THEME.bg : "white"}
            border={isDark ? `1.5px solid ${DARK_THEME.border}` : "1.5px solid #f1f5f9"}
            transition="all .2s"
            _hover={{
              border: isDark ? `1.5px solid ${DARK_ACCENT_BD}` : `1.5px solid ${ORBD}`,
              boxShadow: isDark ? DARK_THEME.shadow : `0 2px 12px rgba(234,88,12,.08)`,
              bg: isDark ? DARK_THEME.hoverBg : "#fffaf7",
            }}
            sx={{ animation: `fadeUp .35s ease ${index * 0.04}s both` }}
          >
            <Box w={COL.idx} flexShrink="0">
              <Text fontSize="12px" fontWeight="700" color={isDark ? DARK_THEME.border : "#cbd5e1"}>
                {String(index + 1).padStart(2, "0")}
              </Text>
            </Box>
            <Box w={COL.code} flexShrink="0">
              <Box 
                px="7px" 
                py="3px" 
                borderRadius="6px" 
                bg={isDark ? DARK_ACCENT_PL : ORPL} 
                border={isDark ? `1px solid ${DARK_ACCENT_BD}` : `1px solid ${ORBD}`} 
                display="inline-block"
              >
                <Text 
                  fontSize="10.5px" 
                  fontWeight="800" 
                  color={isDark ? DARK_ACCENT : OR} 
                  letterSpacing=".5px"
                >
                  {ticket.code || "N/A"}
                </Text>
              </Box>
            </Box>
            <Box w={COL.customer} flexShrink="0" pr="12px">
              <Text fontSize="12.5px" fontWeight="700" color={isDark ? DARK_THEME.text : "#0f172a"} noOfLines={1}>
                {ticket.customer || "Khách hàng"}
              </Text>
              <Text fontSize="11px" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"} noOfLines={1}>
                {ticket.email || ""}
              </Text>
            </Box>
            <Box flex="1" minW="0" pr="12px">
              <Text fontSize="12.5px" fontWeight="600" color={isDark ? DARK_THEME.text : "#334155"} noOfLines={1}>
                {ticket.movie || "Phim"}
              </Text>
              <Text fontSize="11px" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"} noOfLines={1}>
                {ticket.showtime || ""}
              </Text>
            </Box>
            <Box w={COL.seat} flexShrink="0" pr="10px">
              <Box 
                px="8px" 
                py="3px" 
                borderRadius="6px" 
                bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"} 
                border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #e2e8f0"} 
                display="inline-block"
              >
                <Text fontSize="11.5px" fontWeight="800" color={isDark ? DARK_THEME.textSecondary : "#475569"}>
                  {ticket.seat || "A1"}
                </Text>
              </Box>
            </Box>
            <Box w={COL.price} flexShrink="0" pr="10px">
              <Text fontSize="12.5px" fontWeight="700" color={isDark ? DARK_THEME.text : "#0f172a"}>
                {ticket.price || "0đ"}
              </Text>
            </Box>
            <Box w={COL.combo} flexShrink="0" pr="10px">
              <Text fontSize="12px" fontWeight="600" color={isDark ? DARK_THEME.text : "#334155"}>
                {ticket.combo || "Không có"}
              </Text>
            </Box>
            <Box w={COL.status} flexShrink="0" pr="10px">
              <StatusBadge status={ticket.status || "Đã thanh toán"} isDark={isDark} />
            </Box>
            <Box w={COL.actions} flexShrink="0">
              <Flex gap="5px" align="center">
                <Button
                  size="xs"
                  h="28px"
                  w="28px"
                  minW="28px"
                  px="0"
                  borderRadius="7px"
                  bg={isDark ? DARK_THEME.buttonBg : "#f8fafc"}
                  color={isDark ? DARK_THEME.text : "#475569"}
                  border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #e2e8f0"}
                  _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }}
                  transition="all .15s"
                  onClick={() => onQR(ticket)}
                >
                  <Icon as={FaQrcode} boxSize="12px" />
                </Button>
                <Button
                  size="xs"
                  h="28px"
                  px="10px"
                  borderRadius="7px"
                  bg={isDark ? DARK_THEME.buttonBg : "#f8fafc"}
                  color={isDark ? DARK_THEME.text : "#475569"}
                  border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #e2e8f0"}
                  fontSize="11.5px"
                  fontWeight="600"
                  leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
                  _hover={{ 
                    bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9", 
                    color: isDark ? DARK_THEME.text : "#0f172a" 
                  }}
                  transition="all .15s"
                  onClick={() => onView(ticket)}
                >
                  Xem
                </Button>
                <Button
                  size="xs"
                  h="28px"
                  px="10px"
                  borderRadius="7px"
                  bg={isDark ? DARK_ACCENT : `linear-gradient(135deg,${OR},${OR})`}
                  color="white"
                  fontSize="11.5px"
                  fontWeight="600"
                  leftIcon={<Icon as={MdEdit} boxSize="12px" />}
                  _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
                  boxShadow={isDark ? `0 2px 8px ${DARK_ACCENT_SW}` : `0 2px 8px ${ORSW}`}
                  transition="all .15s"
                  onClick={() => onEdit(ticket)}
                >
                  Sửa
                </Button>
              </Flex>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};