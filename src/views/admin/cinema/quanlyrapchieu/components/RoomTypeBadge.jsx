

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { ROOM_TYPE_CFG } from "../constants";

const RoomTypeBadge = ({ type }) => {
  const cfg = ROOM_TYPE_CFG[type] || ROOM_TYPE_CFG.Standard;
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{type}</Text>
    </Box>
  );
};

export default RoomTypeBadge;