// components/shared/StatCard.jsx
import React from "react";
import { Box, Flex, Text, Icon, useColorMode } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export function getSeatColors(isDark) {
  return {
    seatBg: isDark ? "#1e293b" : "white",
    seatBorder: isDark ? "#334155" : "#f1f5f9",
    textColor: isDark ? "#f1f5f9" : "#0f172a",
    subColor: isDark ? "#94a3b8" : "#64748b",
    bgCard: isDark ? "#1e293b" : "white",
    borderCard: isDark ? "#334155" : "#f1f5f9",
    bgInput: isDark ? "#2d3748" : "#f8fafc",
    borderInput: isDark ? "#374151" : "#e8edf3",
  };
}

export default function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);

  return (
    <Box 
      p="16px 18px" 
      borderRadius="14px" 
      bg={colors.bgCard}
      border={`1px solid ${colors.borderCard}`} 
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      _hover={{ 
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.09)", 
        transform: "translateY(-2px)" 
      }}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text 
            fontSize="10px" 
            fontWeight="800" 
            color={isDark ? "#64748b" : "#94a3b8"} 
            letterSpacing="1px"
            textTransform="uppercase" 
            mb="4px"
          >
            {label}
          </Text>
          <Text fontSize="26px" fontWeight="900" color={colors.textColor} lineHeight="1">
            {value}
          </Text>
          {sub && (
            <Text fontSize="11px" color={isDark ? "#64748b" : "#94a3b8"} mt="3px">
              {sub}
            </Text>
          )}
        </Box>
        <Box 
          w="40px" 
          h="40px" 
          borderRadius="12px" 
          bg={`${accent}18`}
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Icon as={icon} boxSize="17px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}