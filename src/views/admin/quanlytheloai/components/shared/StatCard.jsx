

import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const labelColor = useColorModeValue("#94a3b8", "#6b7fa3");
  const valueColor = useColorModeValue("#0f172a", "#e2e8f0");
  
  return (
    <Box 
      p={{ base: "14px 16px", md: "20px" }}
      borderRadius="16px" 
      bg={cardBg} 
      border={`1px solid ${cardBorder}`}
      boxShadow="0 2px 10px rgba(0,0,0,0.04)"
      sx={{ animation: `${fadeUp} 0.45s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ 
        boxShadow: `0 6px 20px ${accent}22`, 
        transform: "translateY(-3px)", 
        border: `1px solid ${accent}44` 
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text 
            fontSize="10.5px" 
            fontWeight="800" 
            color={labelColor}
            letterSpacing="0.8px" 
            textTransform="uppercase" 
            mb="6px"
          >
            {label}
          </Text>
          <Text 
            fontSize={{ base: "26px", md: "32px" }} 
            fontWeight="900" 
            color={valueColor} 
            lineHeight="1"
            mb="2px"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="10px" color={labelColor} mt="2px">{sub}</Text>
          )}
        </Box>
        <Box 
          w={{ base: "40px", md: "48px" }} 
          h={{ base: "40px", md: "48px" }}
          borderRadius="14px" 
          bg={`${accent}18`}
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          boxShadow={`0 4px 14px ${accent}25`}
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}