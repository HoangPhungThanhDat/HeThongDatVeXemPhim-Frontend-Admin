

import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";

const SectionTitle = ({ text }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Flex align="center" gap="8px" mb="14px">
      <Box w="3px" h="15px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
      <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#94a3b8" : "#374151"} letterSpacing="1.2px" textTransform="uppercase">
        {text}
      </Text>
    </Flex>
  );
};

export default SectionTitle;