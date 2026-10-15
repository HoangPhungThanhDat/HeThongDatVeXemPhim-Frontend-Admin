

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { pulse } from "./shared/animations";

const StatusPill = ({ status, isDark }) => {
  const isActive = status === "Active";
  const cfg = {
    color: isActive ? "#059669" : "#dc2626",
    bg: isActive ? "#ecfdf5" : "#fef2f2",
    border: isActive ? "#6ee7b7" : "#fca5a5",
    dot: isActive ? "#10b981" : "#ef4444",
  };

  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={isActive ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>
        {isActive ? "Hoạt động" : "Khóa"}
      </Text>
    </Flex>
  );
};

export default StatusPill;