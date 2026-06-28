

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { STATUS_CINEMA } from "../constants";
import { pulseDot } from "./shared/animations";

const StatusDot = ({ status }) => {
  const cfg = STATUS_CINEMA[status] || STATUS_CINEMA["Hoạt động"];
  const isActive = status === "Hoạt động";

  return (
    <Flex align="center" gap="6px" px="10px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={isActive ? { animation: `${pulseDot} 2s ease infinite` } : {}} />
      <Text fontSize="12px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
};

export default StatusDot;