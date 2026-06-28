// components/shared/SectionTitle.jsx
import React from "react";
import { Flex, Text, Box, useColorMode } from "@chakra-ui/react";
import { getSeatColors } from "./StatCard";

export default function SectionTitle({ 
  icon, 
  title, 
  subtitle, 
  badge, 
  children 
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);

  return (
    <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
      <Flex align="center" gap="12px">
        {icon && (
          <Box
            w="40px"
            h="40px"
            borderRadius="12px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 4px 14px rgba(249,115,22,0.38)"
          >
            <Icon as={icon} boxSize="18px" color="white" />
          </Box>
        )}
        <Box>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color={colors.textColor} letterSpacing="-0.5px">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="12px" color={colors.subColor}>
              {subtitle}
            </Text>
          )}
        </Box>
        {badge && (
          <Box px="8px" py="4px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="11px" fontWeight="700" color="#f97316">
              {badge}
            </Text>
          </Box>
        )}
      </Flex>
      {children}
    </Flex>
  );
}