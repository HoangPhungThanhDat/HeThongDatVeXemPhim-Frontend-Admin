// src/views/admin/quanlyve/components/MobileTicketList.jsx
import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdVisibility, MdEdit } from "react-icons/md";
import { FaQrcode } from "react-icons/fa";

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

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Hết hạn"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">
        {status}
      </Text>
    </Flex>
  );
};

export const MobileTicketList = ({ tickets, onView, onEdit, onQR, isDark, loading }) => {
  const OR = "#ea580c";
  const ORBD = "#fed7aa";
  const ORPL = "#fff7ed";
  const ORSW = "rgba(234,88,12,0.25)";

  if (loading) {
    return (
      <Box p="40px" textAlign="center">
        <Text color={isDark ? "#718096" : "#94a3b8"}>Đang tải dữ liệu...</Text>
      </Box>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box p="40px" textAlign="center">
        <Text color={isDark ? "#718096" : "#94a3b8"}>Không tìm thấy vé nào</Text>
      </Box>
    );
  }

  return (
    <Box p="12px">
      {tickets.map((ticket, index) => (
        <Box
          key={ticket.id || index}
          p="14px"
          borderRadius="12px"
          bg={isDark ? "#2d3748" : "white"}
          border={isDark ? "1.5px solid #4a5568" : "1.5px solid #f1f5f9"}
          transition="all .2s"
          _active={{ bg: isDark ? "#2d3748" : "#fffaf7", border: `1.5px solid ${ORBD}` }}
          boxShadow="0 1px 4px rgba(0,0,0,.04)"
          sx={{ animation: `fadeUp .35s ease ${index * 0.04}s both` }}
          mb="8px"
        >
          <Flex justify="space-between" align="flex-start" mb="10px">
            <Flex align="center" gap="8px">
              <Box px="7px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="10.5px" fontWeight="800" color={OR}>
                  {ticket.code || "N/A"}
                </Text>
              </Box>
              <Box px="8px" py="3px" borderRadius="6px" bg={isDark ? "#4a5568" : "#f1f5f9"} border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}>
                <Text fontSize="11.5px" fontWeight="800" color={isDark ? "#a0aec0" : "#475569"}>
                  Ghế {ticket.seat || "A1"}
                </Text>
              </Box>
            </Flex>
            <StatusBadge status={ticket.status || "Đã thanh toán"} />
          </Flex>

          <Text fontSize="14px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="2px" noOfLines={1}>
            {ticket.movie || "Phim"}
          </Text>
          <Text fontSize="11.5px" color={isDark ? "#718096" : "#94a3b8"} mb="10px" noOfLines={1}>
            {ticket.showtime || ""}
          </Text>

          <Flex align="center" justify="space-between" mb="12px">
            <Box>
              <Text fontSize="12.5px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
                {ticket.customer || "Khách hàng"}
              </Text>
              <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>
                {ticket.email || ""}
              </Text>
            </Box>
            <Text fontSize="14px" fontWeight="800" color={OR}>
              {ticket.price || "0đ"}
            </Text>
          </Flex>

          {/* ✅ Thêm dòng hiển thị Combo */}
          <Flex justify="space-between" mb="12px" px="4px">
            <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>
              Combo:
            </Text>
            <Text fontSize="11px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
              {ticket.combo || "Không có"}
            </Text>
          </Flex>

          <Flex gap="8px">
            <Button
              flex="1"
              h="36px"
              borderRadius="8px"
              fontSize="12px"
              fontWeight="600"
              bg={isDark ? "#4a5568" : "#f8fafc"}
              color={isDark ? "#e2e8f0" : "#475569"}
              border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
              leftIcon={<Icon as={FaQrcode} boxSize="12px" />}
              _hover={{ bg: isDark ? "#4a5568" : "#f1f5f9" }}
              _active={{ transform: "scale(.97)" }}
              transition="all .15s"
              onClick={() => onQR(ticket)}
            >
              QR
            </Button>
            <Button
              flex="1"
              h="36px"
              borderRadius="8px"
              fontSize="12px"
              fontWeight="600"
              bg={isDark ? "#4a5568" : "#f8fafc"}
              color={isDark ? "#e2e8f0" : "#475569"}
              border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: isDark ? "#4a5568" : "#f1f5f9" }}
              _active={{ transform: "scale(.97)" }}
              transition="all .15s"
              onClick={() => onView(ticket)}
            >
              Xem
            </Button>
            <Button
              flex="1"
              h="36px"
              borderRadius="8px"
              fontSize="12px"
              fontWeight="700"
              bg={`linear-gradient(135deg,${OR},${OR})`}
              color="white"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.9 }}
              _active={{ transform: "scale(.97)" }}
              boxShadow={`0 2px 8px ${ORSW}`}
              transition="all .15s"
              onClick={() => onEdit(ticket)}
            >
              Sửa
            </Button>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};