// components/RoomTypeBadge.jsx
import React from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import { ROOM_TYPE_BADGES } from "../constants";

export default function RoomTypeBadge({ type }) {
  const cfg = ROOM_TYPE_BADGES[type] || ROOM_TYPE_BADGES.standard;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={isDark ? "#2d3748" : cfg.bg} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#f1f5f9" : cfg.color}>
        {cfg.label}
      </Text>
    </Box>
  );
}