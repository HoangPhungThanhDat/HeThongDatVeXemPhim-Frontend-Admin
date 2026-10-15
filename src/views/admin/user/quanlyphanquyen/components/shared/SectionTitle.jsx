

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DARK } from "../../constants";

const SectionTitle = ({ label, isDark }) => {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink2 : "#374151"} letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg={isDark ? "linear-gradient(90deg, #4a5568, transparent)" : "linear-gradient(90deg, #f1f5f9, transparent)"} />
    </Box>
  );
};

export default SectionTitle;