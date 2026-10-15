// src/views/admin/quanlyghe/components/RoomTypeBadge.jsx

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { ROOM_TYPE_BADGES } from "../constants";

// ✅ Export default
const RoomTypeBadge = ({ type, isDark }) => {
  const config = ROOM_TYPE_BADGES[type] || ROOM_TYPE_BADGES.standard;
  
  return (
    <Box
      px="8px"
      py="2px"
      borderRadius="full"
      bg={config.bg}
      color={config.color}
      fontSize="10px"
      fontWeight="700"
      display="inline-block"
    >
      {config.label}
    </Box>
  );
};

export default RoomTypeBadge;