// components/StatusDot.jsx
import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { pulse } from "./shared/animations";

export default function StatusDot({ status }) {
  const isActive = status === "active";
  
  return (
    <Flex align="center" gap="5px">
      <Box 
        w="7px" 
        h="7px" 
        borderRadius="full"
        bg={isActive ? "#10b981" : "#f59e0b"}
        sx={isActive ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11px" fontWeight="600" color={isActive ? "#059669" : "#b45309"}>
        {isActive ? "Hoạt động" : "Bảo trì"}
      </Text>
    </Flex>
  );
}