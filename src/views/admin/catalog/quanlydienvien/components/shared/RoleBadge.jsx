

import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { ROLE_CONFIG, ROLE_MAP } from "../../constants";
import { FaMask, FaVideo, FaTheaterMasks } from "react-icons/fa";

const roleIcons = {
  "Actor": FaMask,
  "Director": FaVideo,
  "Producer": FaTheaterMasks,
  "Writer": FaTheaterMasks,
};

export function RoleBadge({ role }) {
  const isDark = useColorModeValue(false, true);
  const displayRole = ROLE_MAP[role] || role;
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG["Actor"];
  const Icon = roleIcons[role] || FaMask;
  
  return (
    <Flex 
      align="center" 
      gap="5px" 
      px="9px" 
      py="4px" 
      borderRadius="8px"
      bg={isDark ? cfg.darkBg || cfg.bg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder || cfg.border : cfg.border}`}
      display="inline-flex" 
      w="fit-content"
    >
      <Icon as={Icon} boxSize="10px" color={isDark ? cfg.darkColor || cfg.color : cfg.color} />
      <Text 
        fontSize="11.5px" 
        fontWeight="700"
        color={isDark ? cfg.darkColor || cfg.color : cfg.color}
      >
        {displayRole}
      </Text>
    </Flex>
  );
}