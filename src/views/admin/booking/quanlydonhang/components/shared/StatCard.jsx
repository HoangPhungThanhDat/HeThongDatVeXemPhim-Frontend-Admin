// src/views/admin/quanlydonhang/components/shared/StatCard.jsx

import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { fadeUp } from "./animations";

export const StatCard = ({ label, value, icon, accent, sub, delay = 0, isDark }) => {
  return (
    <Box
      p={{ base: "14px 16px", md: "18px 20px" }}
      borderRadius="14px"
      bg={isDark ? "#1B254B" : "white"}
      border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.05)"}
      sx={{ animation: `${fadeUp} .4s ease ${delay}s both` }}
      transition="all .2s"
      _hover={{
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,.4)" : "0 4px 16px rgba(0,0,0,.08)",
        transform: "translateY(-2px)",
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize={{ base: "9px", md: "11px" }}
            fontWeight="700"
            color={isDark ? "#718096" : "#94a3b8"}
            letterSpacing=".8px"
            textTransform="uppercase"
            mb="4px"
          >
            {label}
          </Text>
          <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} lineHeight="1">
            {value}
          </Text>
          {sub && <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"} mt="3px">{sub}</Text>}
        </Box>
        <Box
          w={{ base: "36px", md: "42px" }}
          h={{ base: "36px", md: "42px" }}
          borderRadius="12px"
          bg={`${accent}18`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "15px", md: "18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
};