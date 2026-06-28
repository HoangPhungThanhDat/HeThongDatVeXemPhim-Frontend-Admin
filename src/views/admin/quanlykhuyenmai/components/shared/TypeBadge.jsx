// views/admin/quanlykhuyenmai/components/shared/TypeBadge.jsx

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { TYPE_CONFIG, TYPE_MAP } from "../../constants";

export function TypeBadge({ type }) {
  const displayType = TYPE_MAP[type] || type;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG["Percentage"];
  
  return (
    <Box 
      px="8px" 
      py="3px" 
      borderRadius="6px" 
      bg={cfg.bg}
      border={`1px solid ${cfg.border}`} 
      display="inline-block"
    >
      <Text fontSize="11px" fontWeight="800" color={cfg.color}>
        {displayType}
      </Text>
    </Box>
  );
}