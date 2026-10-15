// src/views/admin/quanlyghe/components/shared/StatCard.jsx

import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

// ✅ Đảm bảo export default đúng cách
const StatCard = ({ label, value, icon, accent, delay = 0, isDark, sub }) => {
  // Fallback nếu isDark undefined
  const darkMode = isDark === true;
  
  const bg = darkMode ? "#0f1f3a" : "white";
  const borderColor = darkMode ? "#1a3a5c" : "#f1f5f9";
  const textColor = darkMode ? "#e8f4f8" : "#0f172a";
  const textMuted = darkMode ? "#88b4d8" : "#94a3b8";

  return (
    <Box
      p="12px 16px"
      borderRadius="12px"
      bg={bg}
      border={`1px solid ${borderColor}`}
      transition="all 0.2s"
      _hover={{ 
        borderColor: accent,
        boxShadow: `0 2px 12px ${accent}20`,
      }}
    >
      <Flex align="center" gap="10px">
        <Flex
          w="36px"
          h="36px"
          borderRadius="10px"
          bg={`${accent}15`}
          align="center"
          justify="center"
        >
          <Icon as={icon} boxSize="18px" color={accent} />
        </Flex>
        <Box>
          <Text fontSize="11px" fontWeight="600" color={textMuted}>
            {label}
          </Text>
          <Text fontSize="18px" fontWeight="800" color={textColor}>
            {value !== undefined ? value : 0}
          </Text>
          {sub && (
            <Text fontSize="10px" fontWeight="500" color={textMuted}>
              {sub}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default StatCard;