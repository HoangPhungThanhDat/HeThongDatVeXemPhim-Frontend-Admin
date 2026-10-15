// src/views/admin/quanlytrangthaighe/components/EnhancedSelect.jsx

import { Box, Flex, Icon, Select, Text } from "@chakra-ui/react";
import { useSeatTheme } from "hooks/useSeatTheme";
import { ORANGE } from "../constants";

export function EnhancedSelect({ label, icon, ...props }) {
  const theme = useSeatTheme();

  return (
    <Box>
      <Flex align="center" gap="6px" mb="6px">
        {icon && <Icon as={icon} boxSize="14px" color={theme.textMuted} />}
        <Text
          fontSize="10px"
          fontWeight="700"
          color={theme.textMuted}
          letterSpacing="0.8px"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Select
        {...props}
        bg={theme.inputBg}
        border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
        borderRadius="12px"
        color={theme.text}
        fontSize="13px"
        fontWeight="600"
        h="44px"
        _focus={{
          border: `1.5px solid ${ORANGE.OR}`,
          boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
        }}
        _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
        transition="all .25s"
        sx={{
          "& option": {
            bg: theme.bgCard,
            color: theme.text,
          },
        }}
      >
        {props.children}
      </Select>
    </Box>
  );
}