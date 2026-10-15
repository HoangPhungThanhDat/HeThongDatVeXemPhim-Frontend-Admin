

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { CATEGORY_CONFIG } from "../../constants";

export function CategoryBadge({ category }) {
  const isDark = useColorModeValue(false, true);
  const cfg = CATEGORY_CONFIG[category] || {
    color: isDark ? "#cbd5e1" : "#64748b",
    bg: isDark ? "rgba(148,163,184,0.14)" : "#f1f5f9",
    border: isDark ? "rgba(148,163,184,0.3)" : "#e2e8f0",
    darkBg: "rgba(148,163,184,0.14)",
    darkBorder: "rgba(148,163,184,0.3)",
    darkColor: "#cbd5e1"
  };
  
  return (
    <Box 
      px="8px" 
      py="3px" 
      borderRadius="6px" 
      bg={isDark ? cfg.darkBg || cfg.bg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}`}
      display="inline-block"
    >
      <Text fontSize="11px" fontWeight="700" color={isDark ? cfg.darkColor || cfg.color : cfg.color}>
        {category}
      </Text>
    </Box>
  );
}