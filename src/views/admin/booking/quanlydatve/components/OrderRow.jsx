// src/views/admin/quanlydatve/components/OrderRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdVisibility } from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { fadeUp } from "./shared/animations";

export const OrderRow = ({ order, index, onView, G }) => {
  const isDark = G && G.ink === "#f7fafc" ? false : true;
  
  const bg = G?.bgCard || (isDark ? "#16213e" : "white");
  const ink = G?.ink || (isDark ? "#f7fafc" : "#0f172a");
  const ink4 = G?.ink4 || (isDark ? "#718096" : "#94a3b8");
  const ink6 = G?.ink6 || (isDark ? "#2d3748" : "#f1f5f9");

  // ✅ Lấy danh sách ghế
  let seatLabels = [];
  
  if (Array.isArray(order.seats)) {
    seatLabels = order.seats.filter(s => s && s !== "Không có ghế" && s !== "Chưa có ghế");
  } else if (typeof order.seats === 'string') {
    seatLabels = order.seats.split(',').map(s => s.trim()).filter(s => s && s !== "Không có ghế" && s !== "Chưa có ghế");
  } else if (order.seat) {
    seatLabels = [order.seat];
  }
  
  if (seatLabels.length === 0) {
    seatLabels = ["Chưa có ghế"];
  }

  // Format thời gian
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <Box
      display={{ base: "none", md: "block" }}
      p="12px 18px"
      borderRadius="12px"
      bg={bg}
      border={order.isNew ? "1.5px solid #fed7aa" : `1.5px solid ${ink6}`}
      transition="all 0.18s"
      _hover={{
        border: "1.5px solid #f97316",
        boxShadow: "0 2px 12px rgba(249,115,22,0.1)",
        bg: isDark ? (G?.ink6 || "#2d3748") : "#fffbf7",
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      cursor="pointer"
      onClick={() => onView(order)}
    >
      <Flex align="center" gap="0">
        <Box w="30px" flexShrink="0">
          <Text fontSize="11px" fontWeight="700" color={isDark ? (G?.ink4 || "#718096") : "#cbd5e1"}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>
        
        {/* Mã đơn / Giờ đặt */}
        <Box flex="1.2" minW="0" pr="10px">
          <Flex align="center" gap="6px">
            <Text fontSize="12.5px" fontWeight="800" color="#f97316">{order.id}</Text>
            {order.isNew && (
              <Box px="5px" py="1px" borderRadius="4px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="9px" fontWeight="800" color="#f97316">MỚI</Text>
              </Box>
            )}
          </Flex>
          <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"} mt="1px">
            {formatTime(order.createdAt)}
          </Text>
        </Box>
        
        {/* Khách hàng */}
        <Box flex="1.2" minW="0" pr="10px">
          <Text fontSize="12.5px" fontWeight="700" color={ink} noOfLines={1}>{order.customer}</Text>
          <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"} mt="1px" noOfLines={1}>
            {order.phone}
          </Text>
        </Box>
        
        {/* Phim / Rạp */}
        <Box flex="1.4" minW="0" pr="10px">
          <Text fontSize="12px" fontWeight="600" color={ink} noOfLines={1}>{order.movie || "Đang cập nhật"}</Text>
          <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"} mt="1px" noOfLines={1}>
            {order.cinema || "Đang cập nhật"}
          </Text>
        </Box>
        
        {/* Ghế */}
        <Box flex="0.8" minW="0" pr="10px">
          <Flex gap="4px" flexWrap="wrap">
            {seatLabels.slice(0, 3).map((s) => (
              <Box key={s} px="5px" py="2px" borderRadius="4px" bg="#fff7ed" border="1px solid #fcd34d">
                <Text fontSize="10.5px" fontWeight="800" color="#f97316">{s}</Text>
              </Box>
            ))}
            {seatLabels.length > 3 && (
              <Text fontSize="10px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"}>+{seatLabels.length - 3}</Text>
            )}
          </Flex>
        </Box>
        
        {/* Tổng tiền */}
        <Box flex="0.9" minW="0" pr="10px">
          <Text fontSize="13px" fontWeight="800" color={ink}>
            {order.total?.toLocaleString("vi-VN") || "0"}đ
          </Text>
          <Text fontSize="10px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"} mt="1px">{order.payMethod}</Text>
        </Box>
        
        {/* Trạng thái đơn */}
        <Box flex="0.85" minW="0" pr="8px">
          <StatusBadge status={order.status} type="order" G={G} />
        </Box>
        
        {/* Trạng thái thanh toán */}
        <Box flex="0.9" minW="0" pr="8px">
          <StatusBadge status={order.payStatus} type="pay" G={G} />
        </Box>
        
        {/* Action */}
        <Box flexShrink="0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="xs"
            h="30px"
            px="10px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            fontSize="11.5px"
            fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)"
            transition="all 0.15s"
            onClick={() => onView(order)}
          >
            Chi tiết
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default OrderRow;