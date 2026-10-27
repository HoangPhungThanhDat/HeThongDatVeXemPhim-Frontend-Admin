
import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

export default function ChartCard({ accentColor, children }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  
  return (
    <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="24px" position="relative" overflow="hidden" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")} _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${accentColor}, transparent)` }}>
      {children}
    </Box>
  );
}