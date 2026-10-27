
import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { MdHistory } from "react-icons/md";
import { ACTION_CFG } from "../constants";

export default function ActionBadge({ action }) {
  const cfg = ACTION_CFG[action] || { icon: MdHistory, color: "#94a3b8" };
  return (
    <Flex align="center" gap="5px" px="9px" py="5px" borderRadius="8px" display="inline-flex" w="fit-content" bg={`${cfg.color}14`} border={`1px solid ${cfg.color}35`}>
      <Icon as={cfg.icon} boxSize="11px" color={cfg.color} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color} whiteSpace="nowrap">{action}</Text>
    </Flex>
  );
}