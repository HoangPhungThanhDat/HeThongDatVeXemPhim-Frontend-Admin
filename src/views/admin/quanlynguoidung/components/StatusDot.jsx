// src/views/admin/quanlynguoidung/components/StatusDot.jsx

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { STATUS_CONFIG } from "../constants";
import { pulse } from "./shared/animations";

const StatusDot = ({ status, isDark }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Active"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Active" ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{cfg.label}</Text>
    </Flex>
  );
};

export default StatusDot;