// src/views/admin/quanlydatve/components/shared/StatusBadge.jsx

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

// Định nghĩa màu sắc trực tiếp trong file
const STATUS_MAP = {
  // Order status
  "Đã đặt": { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", dot: "#3b82f6" },
  "Đã check-in": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hoàn tiền": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Đã duyệt": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Từ chối": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  
  // English status (from API)
  "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Completed": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Refunded": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", dot: "#7c3aed" },
  "Expired": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  
  // Payment status
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Chờ thanh toán": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Đã hoàn": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", dot: "#7c3aed" },
  "Thất bại": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Success": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Failed": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  
  // Refund status
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
};

export const StatusBadge = ({ status, type = "order" }) => {
  // ✅ Lấy config cho status, nếu không có thì dùng default
  const cfg = STATUS_MAP[status] || STATUS_MAP["Đã đặt"];
  
  // ✅ Kiểm tra nếu là trạng thái cần pulse animation
  const isPulsing = status === "Đã đặt" || 
                    status === "Hoàn tiền" || 
                    status === "Chờ xử lý" ||
                    status === "Pending";

  return (
    <Flex
      align="center"
      gap="5px"
      px="9px"
      py="4px"
      borderRadius="7px"
      bg={cfg.bg}
      border={`1px solid ${cfg.border}`}
      display="inline-flex"
      w="fit-content"
    >
      <Box
        w="6px"
        h="6px"
        borderRadius="full"
        bg={cfg.dot || cfg.color}
        sx={
          isPulsing 
            ? { 
                animation: "pulse 2s ease infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.45 }
                }
              } 
            : {}
        }
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>
        {status}
      </Text>
    </Flex>
  );
};

export default StatusBadge;