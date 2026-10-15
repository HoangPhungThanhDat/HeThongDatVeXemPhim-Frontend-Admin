

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { AGE_CONFIG, AGE_MAP } from "../../constants";

export function AgeBadge({ age }) {
  const isDark = useColorModeValue(false, true);
  const cfg = AGE_CONFIG[age] || AGE_CONFIG["P"];
  const displayLabel = cfg?.label || age;
  
  return (
    <Box 
      px="8px" 
      py="3px" 
      borderRadius="6px" 
      bg={isDark ? cfg.darkBg || cfg.bg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}`}
      display="inline-block"
    >
      <Text fontSize="11px" fontWeight="800" color={isDark ? cfg.darkColor || cfg.color : cfg.color}>
        {displayLabel}
      </Text>
    </Box>
  );
}