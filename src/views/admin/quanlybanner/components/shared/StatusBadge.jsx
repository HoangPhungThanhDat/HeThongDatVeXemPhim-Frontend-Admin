// views/admin/quanlybanner/components/shared/StatusBadge.jsx

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { STATUS_CONFIG, STATUS_MAP } from "../../constants";
import { pulse } from "./animations";

export function StatusBadge({ status }) {
  const isDark = useColorModeValue(false, true);
  const displayStatus = STATUS_MAP[status] || status;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Inactive"];
  
  return (
    <Flex 
      align="center" 
      gap="5px" 
      px="8px" 
      py="4px" 
      borderRadius="8px"
      bg={isDark ? cfg.darkBg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder : cfg.border}`}
      display="inline-flex" 
      w="fit-content"
    >
      <Box 
        w="6px" 
        h="6px" 
        borderRadius="full" 
        bg={cfg.dot}
        sx={status === "Active" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text 
        fontSize={{ base: "11px", md: "12px" }} 
        fontWeight="600"
        color={isDark ? cfg.darkColor : cfg.color}
      >
        {displayStatus}
      </Text>
    </Flex>
  );
}