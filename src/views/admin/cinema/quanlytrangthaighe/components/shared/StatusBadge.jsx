// src/views/admin/quanlytrangthaighe/components/shared/StatusBadge.jsx

import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { pulseDot } from "./animations";

export function LiveBadge({ theme }) {
  return (
    <Flex
      align="center"
      gap="8px"
      px="12px"
      py="6px"
      borderRadius="full"
      bg={theme.isDark ? "rgba(16,185,129,0.12)" : "#ecfdf5"}
      border="1.5px solid #6ee7b7"
      boxShadow="0 0 20px rgba(16,185,129,0.15)"
    >
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#10b981"
        sx={{ animation: `${pulseDot} 1.8s infinite` }}
      />
      <Text fontSize="11px" fontWeight="700" color="#059669" letterSpacing="0.3px">
        Realtime
      </Text>
      <Box w="1px" h="16px" bg="#6ee7b7" opacity="0.3" />
      <Text fontSize="10px" color="#059669" fontWeight="500" opacity="0.8">
        WebSocket
      </Text>
    </Flex>
  );
}