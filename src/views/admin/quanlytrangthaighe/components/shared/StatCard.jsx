// src/views/admin/quanlytrangthaighe/components/shared/StatCard.jsx

import React from "react";
import { Box, Flex, Icon, Text, Badge } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export function StatCard({ label, value, icon, accent, delay = 0, theme, trend, trendLabel }) {
  return (
    <Box
      p={{ base: "12px 14px", md: "16px 20px" }}
      borderRadius="14px"
      bg={theme.bgCard}
      border={`1.5px solid ${accent}40`}
      boxShadow={theme.shadow}
      sx={{ animation: `${fadeUp} .4s ease ${delay}s both` }}
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: theme.shadowHover,
        borderColor: accent,
      }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        w="60px"
        h="60px"
        bg={accent}
        opacity="0.05"
        borderRadius="full"
        transform="translate(30px, -30px)"
      />
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize={{ base: "9px", md: "10px" }}
            fontWeight="700"
            color={theme.textMuted}
            letterSpacing="0.8px"
            textTransform="uppercase"
            mb="6px"
          >
            {label}
          </Text>
          <Flex align="baseline" gap="6px">
            <Text fontSize={{ base: "24px", md: "30px" }} fontWeight="800" color={theme.text} lineHeight="1">
              {value}
            </Text>
            {trend !== undefined && (
              <Badge
                colorScheme={trend > 0 ? "green" : "red"}
                fontSize="10px"
                borderRadius="full"
                px="6px"
                py="1px"
              >
                {trend > 0 ? "+" : ""}{trend}
              </Badge>
            )}
          </Flex>
          {trendLabel && (
            <Text fontSize="10px" color={theme.textMuted} mt="2px">
              {trendLabel}
            </Text>
          )}
        </Box>
        <Box
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="12px"
          bg={`${accent}15`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border={`1.5px solid ${accent}40`}
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}