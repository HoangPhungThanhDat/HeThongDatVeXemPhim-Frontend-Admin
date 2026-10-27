
import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export const CustomLineTooltip = ({ active, payload, label }) => {
  const bg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const borderColor = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");

  if (!active || !payload?.length) return null;
  return (
    <Box bg={bg} border={`1px solid ${borderColor}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
      <Text fontSize="xs" color={labelColor} mb="4px" fontWeight="600" letterSpacing="0.08em">{label}</Text>
      {payload.map((p, i) => (
        <Text key={i} fontSize="sm" fontWeight="700" color={p.color}>
          {Number(p.value).toLocaleString("vi-VN")} ₫
        </Text>
      ))}
    </Box>
  );
};

export const CustomBarTooltip = ({ active, payload, label }) => {
  const bg = useColorModeValue("white", "rgba(15,15,25,0.96)");
  const borderColor = useColorModeValue("rgba(246,173,85,0.4)", "rgba(246,173,85,0.3)");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");

  if (!active || !payload?.length) return null;
  return (
    <Box bg={bg} border={`1px solid ${borderColor}`} borderRadius="12px" px="14px" py="10px" boxShadow="0 8px 32px rgba(0,0,0,0.15)">
      <Text fontSize="xs" color={labelColor} mb="4px">{label}</Text>
      <Text fontSize="sm" fontWeight="700" color="#F6AD55">{payload[0].value} vé</Text>
    </Box>
  );
};