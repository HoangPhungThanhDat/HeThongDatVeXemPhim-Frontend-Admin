// src/views/admin/quanlytrangthaighe/components/SeatLegend.jsx

import { Box, Flex, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { SEAT_STATUS } from "../constants";

export function SeatLegend({ theme }) {
  return (
    <Wrap spacing="8px" align="center">
      {Object.entries(SEAT_STATUS).map(([key, cfg]) => (
        <WrapItem key={key}>
          <Flex
            align="center"
            gap="6px"
            px="10px"
            py="4px"
            borderRadius="8px"
            bg={theme.bgMuted}
            border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
          >
            <Box w="12px" h="12px" borderRadius="4px" bg={cfg.bg} border={`1.5px solid ${cfg.border}`} />
            <Text fontSize="11px" fontWeight="600" color={theme.textSub}>{cfg.label}</Text>
          </Flex>
        </WrapItem>
      ))}
    </Wrap>
  );
}