

import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { slideRight } from "./animations";

export function SectionTitle({ label, icon: IconComp }) {
  const isDark = useColorModeValue(false, true);
  const textColor = useColorModeValue("#0f172a", "#e2e8f0");
  const bgColor = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
  
  return (
    <Box mb="16px">
      <Flex align="center" gap="8px">
        <Box 
          w="3px" 
          h="16px" 
          borderRadius="full" 
          bg="linear-gradient(180deg, #f97316, #fbbf24)"
          sx={{ animation: `${slideRight} 0.3s ease both`, transformOrigin: "left" }}
        />
        {IconComp && (
          <Box 
            w="24px" h="24px" borderRadius="7px"
            bg={bgColor}
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={IconComp} boxSize="12px" color="#f97316" />
          </Box>
        )}
        <Text 
          fontSize="11px" 
          fontWeight="800" 
          color={textColor} 
          letterSpacing="1.1px" 
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Box 
        mt="10px" 
        h="1px" 
        bg={isDark
          ? "linear-gradient(90deg, rgba(249,115,22,0.3) 0%, transparent 100%)"
          : "linear-gradient(90deg, #fed7aa 0%, #f1f5f9 60%, transparent 100%)"
        } 
      />
    </Box>
  );
}