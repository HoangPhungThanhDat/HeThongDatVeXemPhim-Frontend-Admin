// src/views/admin/quanlytrangthaighe/components/shared/SectionTitle.jsx

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { ORANGE } from "../../constants";

export function SectionTitle({ label, icon, theme, rightElement }) {
  return (
    <Flex align="center" justify="space-between" mb="16px">
      <Flex align="center" gap="10px">
        {icon && (
          <Box
            w="28px" h="28px"
            borderRadius="8px"
            bg={ORANGE.ORGRAD}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 2px 8px ${ORANGE.ORSW}`}
          >
            <Icon as={icon} boxSize="14px" color="white" />
          </Box>
        )}
        <Box>
          <Text
            fontSize={{ base: "12px", md: "14px" }}
            fontWeight="800"
            color={theme.isDark ? "#e2e8f0" : "#1e293b"}
            letterSpacing="0.5px"
            textTransform="uppercase"
          >
            {label}
          </Text>
          <Box h="2px" w="40px" bg={ORANGE.ORGRAD} borderRadius="full" />
        </Box>
      </Flex>
      {rightElement && <Box>{rightElement}</Box>}
    </Flex>
  );
}