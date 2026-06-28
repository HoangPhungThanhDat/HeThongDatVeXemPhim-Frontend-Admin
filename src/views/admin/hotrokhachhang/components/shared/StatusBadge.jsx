// components/shared/StatusBadge.jsx
import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { getStatusBadge } from "../../constants";
import { pulse } from "./animations";

export default function StatusBadge({ status }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const config = getStatusBadge(status);
  const isActive = status === "Đang xử lý" || status === "Chưa xử lý";

  return (
    <Flex
      align="center"
      gap="5px"
      px="10px"
      py="5px"
      borderRadius="8px"
      bg={isDark ? "#2d3748" : config.bg}
      border={`1px solid ${isDark ? "#374151" : config.border}`}
      display="inline-flex"
      w="fit-content"
    >
      <Box
        w="6px"
        h="6px"
        borderRadius="full"
        bg={isDark ? config.dot : config.dot}
        sx={isActive ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="600" color={isDark ? "#f1f5f9" : config.color}>
        {config.label}
      </Text>
    </Flex>
  );
}