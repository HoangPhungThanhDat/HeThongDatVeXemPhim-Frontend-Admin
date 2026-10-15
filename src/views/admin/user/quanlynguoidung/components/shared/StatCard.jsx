// src/views/admin/quanlynguoidung/components/shared/StatCard.jsx

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { DARK } from "../../constants";
import { fadeUp } from "./animations";

const StatCard = ({ label, value, sub, icon, accent, delay = 0, isDark }) => {
  const bg = isDark ? DARK.bgCard : "white";
  const border = isDark ? DARK.ink5 : "#f1f5f9";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  
  return (
    <Box p={{ base: "14px 16px", md: "18px 20px" }} borderRadius="14px" bg={bg}
      border={`1px solid ${border}`} boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: isDark ? "0 6px 20px rgba(0,0,0,.4)" : "0 6px 20px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color={isDark ? DARK.ink4 : "#94a3b8"}
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={ink} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color={isDark ? DARK.ink3 : "#64748b"} mt="3px" fontWeight="500">{sub}</Text>}
        </Box>
        <Box w={{ base: "38px", md: "44px" }} h={{ base: "38px", md: "44px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center" flexShrink="0"
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "19px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
};

export default StatCard;