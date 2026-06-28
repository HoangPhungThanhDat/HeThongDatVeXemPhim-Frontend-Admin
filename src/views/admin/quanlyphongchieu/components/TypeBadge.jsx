

import React from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import { TYPE_CFG } from "../constants";

const TypeBadge = ({ type }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const cfg = TYPE_CFG[type] || TYPE_CFG.Standard;
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={isDark ? "#2d3748" : cfg.bg} border={`1px solid ${isDark ? "#374151" : cfg.border}`} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#f1f5f9" : cfg.color}>{type}</Text>
    </Box>
  );
};

export default TypeBadge;