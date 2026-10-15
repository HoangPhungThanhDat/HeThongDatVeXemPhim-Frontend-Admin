// views/admin/quanlybanner/components/shared/LinkBadge.jsx

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { LINK_TYPE_CONFIG, LINK_TYPE_MAP } from "../../constants";

export function LinkBadge({ type }) {
  const isDark = useColorModeValue(false, true);
  const displayType = LINK_TYPE_MAP[type] || type;
  const cfg = LINK_TYPE_CONFIG[type] || LINK_TYPE_CONFIG["None"];
  
  return (
    <Box 
      px="7px" 
      py="3px" 
      borderRadius="6px"
      bg={isDark ? cfg.darkBg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder : cfg.border}`}
      display="inline-block"
    >
      <Text fontSize="11px" fontWeight="700" color={isDark ? cfg.darkColor : cfg.color}>
        {displayType}
      </Text>
    </Box>
  );
}