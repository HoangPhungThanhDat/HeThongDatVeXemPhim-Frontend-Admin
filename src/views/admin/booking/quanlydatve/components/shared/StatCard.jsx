// src/views/admin/quanlydatve/components/shared/StatCard.jsx

import React, { useState } from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export const StatCard = ({ label, value, icon, accent, sub, delay = 0, G }) => {
  const [hover, setHover] = useState(false);
  
  // ✅ Fallback cho G
  const isDark = G?.ink === "#f7fafc" ? false : true;
  
  const bg = G?.bgCard || (isDark ? "#16213e" : "white");
  const border = G?.ink6 || (isDark ? "#2d3748" : "#f1f5f9");
  const ink = G?.ink || (isDark ? "#f7fafc" : "#0f172a");
  const ink4 = G?.ink4 || (isDark ? "#718096" : "#94a3b8");

  return (
    <Box
      p={{ base: "14px 16px", md: "16px 20px" }}
      borderRadius="14px"
      bg={bg}
      border={`1px solid ${border}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      _hover={{
        boxShadow: isDark ? "0 4px 18px rgba(0,0,0,.4)" : "0 4px 18px rgba(0,0,0,0.09)",
        transform: "translateY(-2px)",
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize="10.5px"
            fontWeight="800"
            color={ink4}
            letterSpacing="0.9px"
            textTransform="uppercase"
            mb="4px"
          >
            {label}
          </Text>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={ink} lineHeight="1">
            {value}
          </Text>
          {sub && (
            <Text fontSize="10.5px" color={ink4} mt="3px">
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
          <Icon as={icon} boxSize="18px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
};