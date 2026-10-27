
import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { pulseRing } from "../../constants";

export default function StatusBadge({ status }) {
  const isAbnormal = status === "Bất thường";
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content" bg={isAbnormal ? "rgba(220,38,38,0.1)" : "rgba(72,187,120,0.12)"} border={`1px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : "rgba(72,187,120,0.3)"}`}>
      <Box w="6px" h="6px" borderRadius="full" bg={isAbnormal ? "#dc2626" : "#48BB78"} sx={isAbnormal ? { animation: `${pulseRing} 1.6s ease-out infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="700" color={isAbnormal ? "#dc2626" : "#38A169"} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}