

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { REGION_CONFIG, REGION_MAP } from "../../constants";

export function RegionBadge({ type }) {
  const isDark = useColorModeValue(false, true);
  const displayType = REGION_MAP[type] || type;
  const cfg = REGION_CONFIG[type] || REGION_CONFIG["Domestic"];
  
  return (
    <Box 
      px="8px" 
      py="3px" 
      borderRadius="6px"
      bg={isDark ? cfg.darkBg || cfg.bg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}`}
      display="inline-block"
    >
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? cfg.darkColor || cfg.color : cfg.color}>
        {type === "International" ? "🌐" : "🇻🇳"} {displayType}
      </Text>
    </Box>
  );
}