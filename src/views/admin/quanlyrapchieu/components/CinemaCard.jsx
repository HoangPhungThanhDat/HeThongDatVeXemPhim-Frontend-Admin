

import React from "react";
import { Box, Flex, Text, Button, Icon, Grid, useColorMode, Tooltip } from "@chakra-ui/react";
import { MdLocationOn, MdPhone, MdAccessTime, MdVisibility, MdEdit, MdDelete, MdMeetingRoom, MdChair } from "react-icons/md";
import StatusDot from "./StatusDot";
import { AMENITY_ICONS, AMENITY_LABELS } from "../constants";
import { fadeUp } from "./shared/animations";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  statBg: "#0a1f35",
  statBorder: "#1a3a5c",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  gradientFrom: "#4a9eff",
  gradientTo: "#6ab0ff",
};

const CinemaCard = ({ cinema, index, onView, onEdit, onDelete }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  
  const bg = isDark ? DARK_THEME.cardBg : "white";
  const border = isDark ? DARK_THEME.border : "#f1f5f9";
  const textColor = isDark ? DARK_THEME.text : "#0f172a";
  const textSecondary = isDark ? DARK_THEME.textSecondary : "#64748b";
  const statBg = isDark ? DARK_THEME.statBg : "#fafbfc";
  const statBorder = isDark ? DARK_THEME.statBorder : "#f1f5f9";
  const hoverBorder = isDark ? DARK_THEME.accent : "#f97316";
  const hoverShadow = isDark 
    ? `0 8px 32px ${DARK_THEME.accentShadow}` 
    : "0 8px 32px rgba(249,115,22,0.12)";
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.gradientFrom}, ${DARK_THEME.gradientTo})`
    : "linear-gradient(135deg,#f97316,#fb923c)";
  const shadowColor = isDark 
    ? `0 2px 10px ${DARK_THEME.accentShadow}`
    : "0 2px 10px rgba(249,115,22,0.3)";
  const iconColor = isDark ? DARK_THEME.accent : "#f97316";
  const deleteBg = isDark ? DARK_THEME.statBg : "#fef2f2";
  const deleteBorder = isDark ? DARK_THEME.border : "#fca5a5";
  const deleteHoverBg = isDark ? DARK_THEME.hoverBg : "#fecaca";

  return (
    <Box
      borderRadius="18px" bg={bg} border={`1.5px solid ${border}`} overflow="hidden"
      transition="all 0.22s" cursor="pointer"
      _hover={{ border: `1.5px solid ${hoverBorder}`, boxShadow: hoverShadow, transform: "translateY(-3px)" }}
      sx={{ animation: `${fadeUp} 0.38s ease ${index * 0.08}s both` }}
      onClick={() => onView(cinema)}
    >
      <Box h="140px" overflow="hidden" position="relative">
        <img src={cinema.ImageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80"} 
          alt={cinema.Name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Box position="absolute" inset="0"
          bg="linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.75))" />
        <Box position="absolute" bottom="10px" left="14px" right="14px">
          <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.25" noOfLines={1}>
            {cinema.Name}
          </Text>
        </Box>
        <Box position="absolute" top="10px" right="10px">
          <StatusDot status={cinema.Status === "Active" ? "Hoạt động" : "Tạm đóng"} />
        </Box>
      </Box>

      <Box p="16px">
        <Flex align="flex-start" gap="5px" mb="8px">
          <Icon as={MdLocationOn} boxSize="13px" color={iconColor} mt="2px" flexShrink="0" />
          <Text fontSize="12px" color={isDark ? DARK_THEME.textSecondary : "#64748b"} lineHeight="1.5" noOfLines={2}>
            {cinema.Address}
          </Text>
        </Flex>
        <Flex gap="14px" mb="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdPhone} boxSize="11px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} />
            <Text fontSize="11.5px" color={isDark ? DARK_THEME.textSecondary : "#475569"} fontWeight="600">{cinema.Phone}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="11px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} />
            <Text fontSize="11.5px" color={isDark ? DARK_THEME.textSecondary : "#475569"} fontWeight="600">{cinema.OpenTime || "08:00 – 23:00"}</Text>
          </Flex>
        </Flex>

        {/* ✅ Stats: Số phòng và ghế */}
        <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="12px">
          <Tooltip label="Tổng số phòng chiếu" placement="top" hasArrow>
            <Box p="8px 10px" borderRadius="10px" bg={statBg} border={`1px solid ${statBorder}`} textAlign="center">
              <Flex align="center" justify="center" gap="4px">
                <Icon as={MdMeetingRoom} boxSize="12px" color={isDark ? DARK_THEME.accent : "#3b82f6"} />
                <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.TotalRooms || 0}</Text>
              </Flex>
              <Text fontSize="9.5px" fontWeight="700" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Phòng</Text>
            </Box>
          </Tooltip>
          
          <Tooltip label="Tổng số ghế" placement="top" hasArrow>
            <Box p="8px 10px" borderRadius="10px" bg={statBg} border={`1px solid ${statBorder}`} textAlign="center">
              <Flex align="center" justify="center" gap="4px">
                <Icon as={MdChair} boxSize="12px" color={isDark ? "#6ab0ff" : "#8b5cf6"} />
                <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.TotalSeats || 0}</Text>
              </Flex>
              <Text fontSize="9.5px" fontWeight="700" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Ghế</Text>
            </Box>
          </Tooltip>
          
          <Tooltip label="Số phòng đang hoạt động" placement="top" hasArrow>
            <Box p="8px 10px" borderRadius="10px" bg={statBg} border={`1px solid ${statBorder}`} textAlign="center">
              <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.ActiveRooms || 0}</Text>
              <Text fontSize="9.5px" fontWeight="700" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Đang hoạt động</Text>
            </Box>
          </Tooltip>
        </Grid>

        <Flex gap="8px">
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg={isDark ? DARK_THEME.statBg : "#f8fafc"} 
            color={isDark ? DARK_THEME.textSecondary : "#475569"} 
            border={`1px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ 
              bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9", 
              color: isDark ? DARK_THEME.text : "#0f172a" 
            }} 
            transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onView(cinema); }}>
            Chi tiết
          </Button>
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg={gradientBg}
            color="white"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            boxShadow={shadowColor}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} 
            transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onEdit(cinema); }}>
            Chỉnh sửa
          </Button>
          <Button h="36px" w="36px" borderRadius="9px"
            bg={deleteBg} 
            color="#dc2626"
            border={`1px solid ${deleteBorder}`}
            _hover={{ bg: deleteHoverBg }} 
            transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onDelete(cinema); }}>
            <Icon as={MdDelete} boxSize="16px" />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CinemaCard;