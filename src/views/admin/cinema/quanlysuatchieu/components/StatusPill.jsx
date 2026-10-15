// src/views/admin/quanlysuatchieu/components/StatusPill.jsx

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { STATUS } from "../constants";
import { pulse } from "./shared/animations";

export const StatusPill = ({ status, size = "md" }) => {
  const cfg = STATUS[status] || STATUS["Đã kết thúc"];
  const isLive = status === "Đang chiếu";
  const sm = size === "sm";

  return (
    <Flex
      align="center"
      gap={sm ? "4px" : "6px"}
      px={sm ? "8px" : "11px"}
      py={sm ? "3px" : "5px"}
      borderRadius="999px"
      bg={cfg.bg}
      border={`1.5px solid ${cfg.border}`}
      display="inline-flex"
    >
      <Box
        w={sm ? "5px" : "7px"}
        h={sm ? "5px" : "7px"}
        borderRadius="full"
        bg={cfg.dot}
        sx={isLive ? { animation: `${pulse} 1.6s ease infinite` } : {}}
      />
      <Text
        fontSize={sm ? "11px" : "12px"}
        fontWeight="700"
        color={cfg.color}
        letterSpacing="0.2px"
      >
        {status}
      </Text>
    </Flex>
  );
};