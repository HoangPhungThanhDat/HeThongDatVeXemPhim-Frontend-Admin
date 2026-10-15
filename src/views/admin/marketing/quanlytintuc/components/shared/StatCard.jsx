

import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const labelColor = useColorModeValue("#94a3b8", "#6b7fa3");
  const valueColor = useColorModeValue("#0f172a", "#e2e8f0");
  
  return (
    <Box 
      p={{ base: "14px 16px", md: "18px 20px" }}
      borderRadius="16px" 
      bg={cardBg} 
      border={`1px solid ${cardBorder}`}
      boxShadow="0 1px 6px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.45s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ 
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)", 
        transform: "translateY(-2px)" 
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text 
            fontSize={{ base: "10px", md: "11px" }} 
            fontWeight="700" 
            color={labelColor}
            letterSpacing="0.8px" 
            textTransform="uppercase" 
            mb="4px"
          >
            {label}
          </Text>
          <Text 
            fontSize={{ base: "24px", md: "28px" }} 
            fontWeight="800" 
            color={valueColor} 
            lineHeight="1"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="11px" color={labelColor} mt="3px">{sub}</Text>
          )}
        </Box>
        <Box 
          w={{ base: "38px", md: "44px" }} 
          h={{ base: "38px", md: "44px" }}
          borderRadius="14px" 
          bg={`${accent}18`}
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}