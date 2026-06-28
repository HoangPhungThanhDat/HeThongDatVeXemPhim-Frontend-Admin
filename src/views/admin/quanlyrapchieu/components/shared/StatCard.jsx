

import React from "react";
import { Box, Flex, Icon, Text, useColorMode } from "@chakra-ui/react";
import { fadeUp } from "./animations";

const StatCard = ({ label, value, sub, icon, accent, delay = 0 }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#64748b" : "#94a3b8";

  return (
    <Box p="18px 20px" borderRadius="14px" bg={bg} border={`1px solid ${border}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="11px" fontWeight="700" color={subColor} letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize="28px" fontWeight="800" color={textColor} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color={subColor} mt="3px">{sub}</Text>}
        </Box>
        <Box w="44px" h="44px" borderRadius="13px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
};

export default StatCard;