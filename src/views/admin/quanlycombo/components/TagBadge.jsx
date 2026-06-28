// src/views/admin/quanlycombo/components/TagBadge.jsx

import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { MdLocalOffer, MdTrendingUp, MdStar, MdEmojiEvents } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { TAG_CONFIG } from "../constants";

const ICON_MAP = {
  FaFire: FaFire,
  MdLocalOffer: MdLocalOffer,
  MdTrendingUp: MdTrendingUp,
  MdStar: MdStar,
  MdEmojiEvents: MdEmojiEvents,
};

export const TagBadge = ({ tag, isDark }) => {
  const cfg = TAG_CONFIG[tag] || TAG_CONFIG["Mới"];
  const IconComp = ICON_MAP[cfg.icon] || MdLocalOffer;

  return (
    <Flex
      align="center"
      gap="4px"
      px="8px"
      py="3px"
      borderRadius="6px"
      bg={cfg.bg}
      border={`1px solid ${cfg.border}`}
      display="inline-flex"
    >
      <Icon as={IconComp} boxSize="10px" color={cfg.color} />
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>
        {tag}
      </Text>
    </Flex>
  );
};