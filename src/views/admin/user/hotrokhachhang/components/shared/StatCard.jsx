// components/shared/StatCard.jsx
import React from "react";
import { Box, Flex, Text, Icon, useColorMode } from "@chakra-ui/react";
import { fadeUp } from "./animations";
import { DARK } from "../../constants";

export default function StatCard({ label, value, icon, accent, delay = 0 }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  return (
    <Box
      p="16px 18px"
      borderRadius="14px"
      bg={colors.bgCard}
      border={`1px solid ${colors.borderCard}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize="10px"
            fontWeight="700"
            color={isDark ? "#64748b" : "#94a3b8"}
            letterSpacing="0.8px"
            textTransform="uppercase"
            mb="4px"
          >
            {label}
          </Text>
          <Text fontSize="26px" fontWeight="800" color={colors.textPrimary} lineHeight="1">
            {value}
          </Text>
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