

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { DARK } from "../../constants";
import { fadeUp } from "./animations";

export const StatCard = ({ label, value, icon, accent, sub, delay = 0, isDark }) => {
  return (
    <Box
      p={{ base: "14px 16px", md: "16px 20px" }}
      borderRadius="14px"
      bg={isDark ? DARK.bgCard : "white"}
      border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{
        boxShadow: isDark ? "0 4px 18px rgba(0,0,0,.4)" : "0 4px 18px rgba(0,0,0,0.09)",
        transform: "translateY(-2px)"
      }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text
            fontSize="10.5px"
            fontWeight="800"
            color={isDark ? DARK.ink4 : "#94a3b8"}
            letterSpacing="0.9px"
            textTransform="uppercase"
            mb="4px"
          >
            {label}
          </Text>
          <Text
            fontSize={{ base: "22px", md: "26px" }}
            fontWeight="800"
            color={isDark ? DARK.ink : "#0f172a"}
            lineHeight="1"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="3px">
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