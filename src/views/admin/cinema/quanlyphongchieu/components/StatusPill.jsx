

import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { STATUS_CFG } from "../constants";
import { pulse } from "./shared/animations";

const StatusPill = ({ status, animated = false }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const cfg = STATUS_CFG[status] || STATUS_CFG["Active"];
  const isActive = status === "Active";

  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={isDark ? "#2d3748" : cfg.bg} border={`1px solid ${isDark ? "#374151" : cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={isDark ? "#10b981" : cfg.dot}
        sx={(animated && isActive) ? { animation: `${pulse} 2s ease infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="700" color={isDark ? "#f1f5f9" : cfg.color}>{cfg.label}</Text>
    </Flex>
  );
};

export default StatusPill;