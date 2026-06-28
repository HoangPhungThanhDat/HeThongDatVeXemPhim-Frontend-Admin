
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { STATUS_CONFIG, STATUS_MAP } from "../../constants";
import { pulse } from "./animations";

export function StatusBadge({ status }) {
  const isDark = useColorModeValue(false, true);
  const displayStatus = STATUS_MAP[status] || status;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Ended"];
  
  return (
    <Flex 
      align="center" 
      gap="5px" 
      px="10px" 
      py="5px" 
      borderRadius="8px"
      bg={isDark ? cfg.darkBg || cfg.bg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}`}
      display="inline-flex" 
      w="fit-content"
    >
      <Box 
        w="6px" 
        h="6px" 
        borderRadius="full" 
        bg={cfg.dot}
        sx={status === "NowShowing" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text 
        fontSize="12px" 
        fontWeight="600"
        color={isDark ? cfg.darkColor || cfg.color : cfg.color}
      >
        {displayStatus}
      </Text>
    </Flex>
  );
}