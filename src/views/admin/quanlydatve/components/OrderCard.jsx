// src/views/admin/quanlydatve/components/OrderCard.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdVisibility } from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { fadeUp } from "./shared/animations";

export const OrderCard = ({ order, index, onView, G }) => {
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
      display={{ base: "block", md: "none" }}
      p="14px"
      borderRadius="14px"
      bg={bg}
      border={order.isNew ? "1.5px solid #fed7aa" : `1.5px solid ${ink6}`}
      transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      onClick={() => onView(order)}
      cursor="pointer"
    >
      <Flex justify="space-between" mb="8px" align="flex-start">
        <Box flex="1" pr="8px">
          <Flex align="center" gap="6px" mb="4px">
            <Text fontSize="12px" fontWeight="800" color="#f97316">{order.id}</Text>
            {order.isNew && (
              <Box px="5px" py="2px" borderRadius="4px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="9.5px" fontWeight="800" color="#f97316">MỚI</Text>
              </Box>
            )}
          </Flex>
          <Text fontSize="13px" fontWeight="700" color={ink} noOfLines={1}>{order.customer}</Text>
          <Text fontSize="11px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"} mt="2px" noOfLines={1}>
            {order.movie || "Đang cập nhật"} · {order.cinema || "Đang cập nhật"}
          </Text>
        </Box>
        <Text fontSize="14px" fontWeight="800" color={ink}>
          {order.total?.toLocaleString("vi-VN") || "0"}đ
        </Text>
      </Flex>
      
      {/* Hiển thị ghế */}
      <Flex gap="4px" flexWrap="wrap" mb="6px">
        {seatLabels.slice(0, 4).map((s) => (
          <Box key={s} px="6px" py="2px" borderRadius="4px" bg="#fff7ed" border="1px solid #fcd34d">
            <Text fontSize="10.5px" fontWeight="800" color="#f97316">{s}</Text>
          </Box>
        ))}
        {seatLabels.length > 4 && (
          <Text fontSize="10px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"}>+{seatLabels.length - 4}</Text>
        )}
      </Flex>
      
      {/* Hiển thị thời gian và suất chiếu */}
      <Flex gap="6px" flexWrap="wrap" mb="6px">
        <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"}>
          🕐 {formatTime(order.createdAt)}
        </Text>
        {order.showtime && (
          <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"}>
            📅 {order.showtime}
          </Text>
        )}
      </Flex>
      
      <Flex gap="6px" flexWrap="wrap" mb="10px">
        <StatusBadge status={order.status} type="order" G={G} />
        <StatusBadge status={order.payStatus} type="pay" G={G} />
      </Flex>
      
      <Flex align="center" justify="space-between">
        <Text fontSize="10.5px" color={isDark ? (G?.ink4 || "#718096") : "#94a3b8"}>
          {order.room || "Đang cập nhật"} · {order.format || "2D"}
        </Text>
        <Button
          size="xs"
          h="28px"
          px="10px"
          borderRadius="7px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white"
          fontSize="11px"
          fontWeight="700"
          leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 6px rgba(249,115,22,0.3)"
          onClick={(e) => { e.stopPropagation(); onView(order); }}
        >
          Xem
        </Button>
      </Flex>
    </Box>
  );
};

export default OrderCard;