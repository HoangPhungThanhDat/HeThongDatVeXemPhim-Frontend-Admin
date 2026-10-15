// src/views/admin/quanlydonhang/components/shared/StatusBadge.jsx

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ORDER_STATUS_CFG, PAYMENT_STATUS_CFG, REFUND_STATUS_CFG } from "../../constants";
import { ring } from "./animations";

const STATUS_MAPS = {
  order: ORDER_STATUS_CFG,
  payment: PAYMENT_STATUS_CFG,
  refund: REFUND_STATUS_CFG,
};

export const StatusBadge = ({ status, type = "order" }) => {
  const map = STATUS_MAPS[type] || STATUS_MAPS.order;
  
  // ✅ Fallback nếu status không có trong map
  const cfg = map[status] || {
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    dot: "#9ca3af",
  };
  
  const isPulsing = status === "Đã đặt" || status === "Đang chờ duyệt" || status === "Pending";

  return (
    <Flex
      align="center"
      gap="5px"
      px="10px"
      py="5px"
      borderRadius="8px"
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
        sx={isPulsing ? { animation: `${ring} 1.6s ease-out infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">
        {status}
      </Text>
    </Flex>
  );
};

export default StatusBadge;