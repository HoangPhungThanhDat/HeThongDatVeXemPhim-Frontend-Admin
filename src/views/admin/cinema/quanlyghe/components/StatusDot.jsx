// src/views/admin/quanlyghe/components/StatusDot.jsx

import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

// ✅ Export default
const StatusDot = ({ status, isDark }) => {
  const statusMap = {
    active: { color: "#10b981", label: "Hoạt động" },
    maintenance: { color: "#f59e0b", label: "Bảo trì" },
    inactive: { color: "#ef4444", label: "Không hoạt động" },
  };

  const current = statusMap[status] || statusMap.active;
  const textColor = isDark ? "#e8f4f8" : "#0f172a";

  return (
    <Flex align="center" gap="6px">
      <Box w="8px" h="8px" borderRadius="full" bg={current.color} />
      <Text fontSize="12px" fontWeight="600" color={textColor}>
        {current.label}
      </Text>
    </Flex>
  );
};

export default StatusDot;