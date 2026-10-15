

import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaMedal, FaCrown } from "react-icons/fa";
import { MdDiamond } from "react-icons/md";
import { RANK_CONFIG } from "../constants";

const ICON_MAP = {
  FaMedal: FaMedal,
  FaCrown: FaCrown,
  MdDiamond: MdDiamond,
};

export const RankBadge = ({ rank, isDark }) => {
  const cfg = RANK_CONFIG[rank] || RANK_CONFIG["Đồng"];
  const IconComp = ICON_MAP[cfg.icon] || FaMedal;
  
  return (
    <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="7px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Icon as={IconComp} boxSize="10px" color={cfg.color} />
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{rank}</Text>
    </Flex>
  );
};