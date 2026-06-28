// src/views/admin/quanlysuatchieu/components/shared/StatCard.jsx

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export const StatCard = ({ label, value, icon, accent, sub, delay = 0, isDark }) => {
  return (
    <Box
      p={{ base: "16px", md: "18px 20px" }}
      borderRadius="16px"
      bg={isDark ? "#2d3748" : "white"}
      border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
      boxShadow="0 1px 6px rgba(0,0,0,0.04)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{
        boxShadow: isDark ? "0 6px 20px rgba(0,0,0,0.3)" : "0 6px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        right="-14px"
        bottom="-14px"
        w="70px"
        h="70px"
        borderRadius="full"
        bg={`${accent}0d`}
      />

      <Flex align="flex-start" justify="space-between">
        <Box>
          <Text
            fontSize="10.5px"
            fontWeight="800"
            color={isDark ? "#718096" : "#9ca3af"}
            letterSpacing="1px"
            textTransform="uppercase"
            mb="6px"
          >
            {label}
          </Text>
          <Text
            fontSize={{ base: "26px", md: "30px" }}
            fontWeight="900"
            color={isDark ? "#f7fafc" : "#111827"}
            lineHeight="1"
            mb="4px"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="11px" color={isDark ? "#718096" : "#9ca3af"} fontWeight="500">
              {sub}
            </Text>
          )}
        </Box>
        <Box
          w={{ base: "36px", md: "42px" }}
          h={{ base: "36px", md: "42px" }}
          borderRadius="12px"
          bg={`${accent}18`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
        >
          <Icon as={icon} boxSize={{ base: "15px", md: "18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
};