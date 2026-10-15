

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const SectionTitle = ({ label }) => {
  return (
    <Flex align="center" gap="8px" mb="14px">
      <Box w="3px" h="16px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
      <Text fontSize="11px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
        {label}
      </Text>
    </Flex>
  );
};

export default SectionTitle;