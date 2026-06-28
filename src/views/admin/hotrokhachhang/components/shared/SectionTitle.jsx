// components/shared/SectionTitle.jsx
import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { DARK } from "../../constants";

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";

export default function SectionTitle({ label }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box
          w="3px"
          h="14px"
          borderRadius="full"
          bg={`linear-gradient(180deg, ${ORANGE}, ${ORANGE_LIGHT})`}
        />
        <Text
          fontSize="10.5px"
          fontWeight="800"
          color={colors.textSecondary}
          letterSpacing="1.2px"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Box
        mt="7px"
        h="1px"
        bg={isDark ? "linear-gradient(90deg, #334155, transparent)" : "linear-gradient(90deg, #f1f5f9, transparent)"}
      />
    </Box>
  );
}