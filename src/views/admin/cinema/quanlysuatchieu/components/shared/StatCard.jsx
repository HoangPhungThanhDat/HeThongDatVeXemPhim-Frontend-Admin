import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { fadeUp } from "./animations";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  shadow: "0 6px 20px rgba(26, 58, 92, 0.3)",
  shadowHover: "0 6px 20px rgba(26, 58, 92, 0.5)",
};

export const StatCard = ({ label, value, icon, accent, sub, delay = 0, isDark }) => {
  // Điều chỉnh accent color cho chế độ tối
  const getAccentColor = () => {
    if (!isDark) return accent;
    
    // Nếu accent là màu cam, đổi sang xanh dương
    if (accent === "#ea580c" || accent === "#f97316" || accent === "#fb923c") {
      return DARK_THEME.accent;
    }
    // Nếu accent là màu xanh lá, giữ nguyên nhưng sáng hơn
    if (accent === "#059669" || accent === "#10b981") {
      return "#4ade80";
    }
    // Nếu accent là màu đỏ, giữ nguyên
    if (accent === "#dc2626" || accent === "#ef4444") {
      return "#f87171";
    }
    // Nếu accent là màu tím, đổi sang xanh dương sáng
    if (accent === "#7c3aed" || accent === "#8b5cf6") {
      return "#6ab0ff";
    }
    // Mặc định trả về màu xanh dương
    return DARK_THEME.accent;
  };

  const finalAccent = getAccentColor();

  return (
    <Box
      p={{ base: "16px", md: "18px 20px" }}
      borderRadius="16px"
      bg={isDark ? DARK_THEME.cardBg : "white"}
      border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f1f5f9"}
      boxShadow={isDark ? `0 1px 6px ${DARK_THEME.accentShadow}` : "0 1px 6px rgba(0,0,0,0.04)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{
        boxShadow: isDark 
          ? `0 6px 20px ${DARK_THEME.accentShadow}` 
          : "0 6px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)",
        border: isDark ? `1px solid ${finalAccent}40` : "1px solid #f1f5f9",
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background circle */}
      <Box
        position="absolute"
        right="-14px"
        bottom="-14px"
        w="70px"
        h="70px"
        borderRadius="full"
        bg={isDark ? `${finalAccent}15` : `${accent}0d`}
      />

      <Flex align="flex-start" justify="space-between">
        <Box>
          <Text
            fontSize="10.5px"
            fontWeight="800"
            color={isDark ? DARK_THEME.labelColor : "#9ca3af"}
            letterSpacing="1px"
            textTransform="uppercase"
            mb="6px"
          >
            {label}
          </Text>
          <Text
            fontSize={{ base: "26px", md: "30px" }}
            fontWeight="900"
            color={isDark ? DARK_THEME.text : "#111827"}
            lineHeight="1"
            mb="4px"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="11px" color={isDark ? DARK_THEME.textSecondary : "#9ca3af"} fontWeight="500">
              {sub}
            </Text>
          )}
        </Box>
        <Box
          w={{ base: "36px", md: "42px" }}
          h={{ base: "36px", md: "42px" }}
          borderRadius="12px"
          bg={isDark ? `${finalAccent}20` : `${accent}18`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          transition="all 0.2s"
          _hover={{
            bg: isDark ? `${finalAccent}35` : `${accent}25`,
            transform: "scale(1.05)",
          }}
        >
          <Icon 
            as={icon} 
            boxSize={{ base: "15px", md: "18px" }} 
            color={isDark ? finalAccent : accent} 
          />
        </Box>
      </Flex>
    </Box>
  );
};