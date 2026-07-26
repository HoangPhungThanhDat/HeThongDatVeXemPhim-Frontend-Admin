import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628", // nền xanh đậm
  cardBg: "#0f1f3a", // nền card xanh đậm hơn
  border: "#1a3a5c", // viền xanh dương
  text: "#e8f4f8", // text sáng
  textSecondary: "#88b4d8", // text phụ
  labelColor: "#5a8ab5", // màu label
  shadow: "0 1px 8px rgba(26, 58, 92, 0.3)",
  shadowHover: "0 4px 20px rgba(26, 58, 92, 0.5)",
};

export const StatCard = ({ label, value, icon, accent, delay = 0, isDark }) => {
  // Điều chỉnh accent color cho chế độ tối
  const getAccentColor = () => {
    if (!isDark) return accent;
    
    // Nếu accent là màu cam, đổi sang xanh dương
    if (accent === "#ea580c" || accent === "#f97316") {
      return "#4a9eff";
    }
    // Nếu accent là màu xanh lá, giữ nguyên nhưng sáng hơn
    if (accent === "#059669" || accent === "#10b981") {
      return "#4ade80";
    }
    // Nếu accent là màu đỏ, giữ nguyên
    if (accent === "#dc2626" || accent === "#ef4444") {
      return "#f87171";
    }
    // Mặc định trả về màu xanh dương
    return "#4a9eff";
  };

  const finalAccent = getAccentColor();

  return (
    <Box
      p={{ base: "14px 16px", md: "18px 20px" }}
      borderRadius="14px"
      bg={isDark ? DARK_THEME.cardBg : "white"}
      border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f1f5f9"}
      boxShadow={isDark ? DARK_THEME.shadow : "0 1px 4px rgba(0,0,0,.05)"}
      sx={{ animation: `fadeUp .4s ease ${delay}s both` }}
      transition="all .2s"
      _hover={{
        boxShadow: isDark ? DARK_THEME.shadowHover : "0 4px 16px rgba(0,0,0,.08)",
        transform: "translateY(-2px)",
        border: isDark ? `1px solid ${finalAccent}40` : "1px solid #f1f5f9",
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize={{ base: "9px", md: "11px" }}
            fontWeight="700"
            color={isDark ? DARK_THEME.labelColor : "#94a3b8"}
            letterSpacing=".8px"
            textTransform="uppercase"
            mb="4px"
          >
            {label}
          </Text>
          <Text
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight="800"
            color={isDark ? DARK_THEME.text : "#0f172a"}
            lineHeight="1"
          >
            {value}
          </Text>
        </Box>
        <Box
          w={{ base: "36px", md: "42px" }}
          h={{ base: "36px", md: "42px" }}
          borderRadius="12px"
          bg={isDark ? `${finalAccent}20` : `${accent}18`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all .2s"
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