

import React from "react";
import { Box, Flex, Text, Button, Icon, Grid, useColorMode } from "@chakra-ui/react";
import { MdLocationOn, MdPhone, MdAccessTime, MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import StatusDot from "./StatusDot";
import { AMENITY_ICONS, AMENITY_LABELS } from "../constants";
import { fadeUp } from "./shared/animations";

const CinemaCard = ({ cinema, index, onView, onEdit, onDelete }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";

  return (
    <Box
      borderRadius="18px" bg={bg} border={`1.5px solid ${border}`} overflow="hidden"
      transition="all 0.22s" cursor="pointer"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 8px 32px rgba(249,115,22,0.12)", transform: "translateY(-3px)" }}
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
          <Icon as={MdLocationOn} boxSize="13px" color="#f97316" mt="2px" flexShrink="0" />
          <Text fontSize="12px" color={isDark ? "#94a3b8" : "#64748b"} lineHeight="1.5" noOfLines={2}>
            {cinema.Address}
          </Text>
        </Flex>
        <Flex gap="14px" mb="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdPhone} boxSize="11px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="11.5px" color={isDark ? "#94a3b8" : "#475569"} fontWeight="600">{cinema.Phone}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="11px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="11.5px" color={isDark ? "#94a3b8" : "#475569"} fontWeight="600">{cinema.OpenTime || "08:00 – 23:00"}</Text>
          </Flex>
        </Flex>

        <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="12px">
          <Box p="8px 10px" borderRadius="10px" bg={isDark ? "#2d3748" : "#fafbfc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.TotalRooms || 0}</Text>
            <Text fontSize="9.5px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Phòng</Text>
          </Box>
          <Box p="8px 10px" borderRadius="10px" bg={isDark ? "#2d3748" : "#fafbfc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.TotalSeats || 0}</Text>
            <Text fontSize="9.5px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Ghế</Text>
          </Box>
          <Box p="8px 10px" borderRadius="10px" bg={isDark ? "#2d3748" : "#fafbfc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.ActiveRooms || 0}</Text>
            <Text fontSize="9.5px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">Đang hoạt động</Text>
          </Box>
        </Grid>

        <Flex gap="8px">
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg={isDark ? "#2d3748" : "#f8fafc"} color={isDark ? "#94a3b8" : "#475569"} border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9", color: isDark ? "#f1f5f9" : "#0f172a" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onView(cinema); }}>
            Chi tiết
          </Button>
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            boxShadow="0 2px 10px rgba(249,115,22,0.3)"
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onEdit(cinema); }}>
            Chỉnh sửa
          </Button>
          <Button h="36px" w="36px" borderRadius="9px"
            bg={isDark ? "#2d3748" : "#fef2f2"} color="#dc2626"
            border={`1px solid ${isDark ? "#374151" : "#fca5a5"}`}
            _hover={{ bg: "#fecaca" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onDelete(cinema); }}>
            <Icon as={MdDelete} boxSize="16px" />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CinemaCard;