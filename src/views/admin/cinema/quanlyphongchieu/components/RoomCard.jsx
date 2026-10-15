// src/views/admin/quanlyphongchieu/components/RoomCard.jsx

import React from "react";
import {
  Box, Flex, Text, Badge, Button, Icon, useColorMode,
  Tooltip
} from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdBuild,
  MdMeetingRoom
} from "react-icons/md";
import { fadeUp } from "./shared/animations";

// Màu sắc cho chế độ tối
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
};

export default function RoomCard({ room, index, onView, onToggle, onEdit, onDelete, isDark }) {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : (colorMode === "dark");
  
  // ✅ SỬ DỤNG DỮ LIỆU CÓ SẴN - KHÔNG GỌI API
  const totalSeats = room.TotalSeats || room.SeatCount || 0;
  const bookedSeats = room.BookedSeats || 0;
  const availableSeats = room.AvailableSeats || 0;
  const filledPercent = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const isActive = room.Status === "Active";
  const isMaintenance = room.Status === "Maintenance";

  // Màu sắc
  const accentColor = darkMode ? DARK_THEME.accent : "#f97316";
  const accentShadow = darkMode ? DARK_THEME.accentShadow : "rgba(249,115,22,0.25)";
  const gradientBg = darkMode 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316, #fb923c)";
  const bgCard = darkMode ? DARK_THEME.cardBg : "white";
  const borderCard = darkMode ? DARK_THEME.border : "#f1f5f9";
  const textColor = darkMode ? DARK_THEME.text : "#0f172a";
  const subColor = darkMode ? DARK_THEME.textSecondary : "#94a3b8";
  const statBg = darkMode ? DARK_THEME.inputBg : "#f8fafc";
  const statBorder = darkMode ? DARK_THEME.border : "#f1f5f9";

  // Trạng thái màu sắc
  const statusColors = {
    Active: { bg: darkMode ? "#064e3b" : "#ecfdf5", color: darkMode ? "#34d399" : "#059669", dot: "#10b981" },
    Inactive: { bg: darkMode ? "#451a03" : "#fffbeb", color: darkMode ? "#fbbf24" : "#b45309", dot: "#f59e0b" },
    Maintenance: { bg: darkMode ? "#7f1d1d" : "#fef2f2", color: darkMode ? "#f87171" : "#dc2626", dot: "#ef4444" },
  };
  const statusStyle = statusColors[room.Status] || statusColors.Inactive;

  return (
    <Box
      bg={bgCard}
      borderRadius="16px"
      border={`1.5px solid ${borderCard}`}
      boxShadow={darkMode ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.07}s both` }}
      overflow="hidden"
      _hover={{ 
        border: `1.5px solid ${darkMode ? DARK_THEME.accent : "#f97316"}`, 
        boxShadow: darkMode 
          ? `0 4px 20px ${DARK_THEME.accentShadow}`
          : "0 4px 20px rgba(249,115,22,0.12)" 
      }}
      transition="all 0.2s"
    >
      {/* Header color bar */}
      <Box
        h="4px"
        bg={isActive ? "linear-gradient(90deg, #10b981, #34d399)" :
            isMaintenance ? "linear-gradient(90deg, #ef4444, #f87171)" :
            "linear-gradient(90deg, #f59e0b, #fbbf24)"}
      />

      <Box p="16px 18px">
        <Flex justify="space-between" align="flex-start" mb="12px">
          <Box flex="1" minW="0">
            <Flex align="center" gap="8px" mb="4px" flexWrap="wrap">
              <Text fontSize="15px" fontWeight="800" color={textColor} noOfLines={1}>
                {room.Name}
              </Text>
              <Badge
                px="8px"
                py="2px"
                borderRadius="6px"
                bg={darkMode ? DARK_THEME.inputBg : "#f1f5f9"}
                color={darkMode ? DARK_THEME.textSecondary : "#475569"}
                fontSize="9px"
                fontWeight="700"
                textTransform="none"
              >
                {room.RoomType || "Standard"}
              </Badge>
            </Flex>
            <Flex align="center" gap="8px">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={statusStyle.dot}
                sx={isActive ? { animation: "pulse 2s ease infinite" } : {}}
              />
              <Text fontSize="12px" fontWeight="600" color={statusStyle.color}>
                {room.Status === "Active" ? "Hoạt động" :
                 room.Status === "Maintenance" ? "Bảo trì" : "Không hoạt động"}
              </Text>
            </Flex>
          </Box>
          <Box textAlign="right" flexShrink="0" ml="8px">
            <Text fontSize="20px" fontWeight="900" color={textColor}>
              {totalSeats}
            </Text>
            <Text fontSize="10px" color={subColor} fontWeight="600">
              ghế
            </Text>
          </Box>
        </Flex>

        {/* Thống kê ghế */}
        <Flex gap="8px" mb="12px">
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={statBg}
            border={`1px solid ${statBorder}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color={subColor}>
              Tổng ghế
            </Text>
            <Text fontSize="16px" fontWeight="800" color={textColor}>
              {totalSeats}
            </Text>
          </Box>
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={statBg}
            border={`1px solid ${statBorder}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color="#059669">Trống</Text>
            <Text fontSize="16px" fontWeight="800" color="#059669">
              {availableSeats}
            </Text>
          </Box>
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={statBg}
            border={`1px solid ${statBorder}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color="#dc2626">Đã đặt</Text>
            <Text fontSize="16px" fontWeight="800" color="#dc2626">
              {bookedSeats}
            </Text>
          </Box>
        </Flex>

        {/* Progress bar */}
        {totalSeats > 0 && (
          <Box mb="14px">
            <Flex justify="space-between" mb="4px">
              <Text fontSize="10px" fontWeight="600" color={subColor}>
                Lấp đầy
              </Text>
              <Text fontSize="10px" fontWeight="700" color={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? accentColor : "#059669"}>
                {filledPercent}%
              </Text>
            </Flex>
            <Box h="5px" borderRadius="full" bg={darkMode ? DARK_THEME.inputBg : "#f1f5f9"} overflow="hidden">
              <Box
                h="100%"
                borderRadius="full"
                w={`${filledPercent}%`}
                bg={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? accentColor : "#10b981"}
                transition="width 0.6s ease"
              />
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Flex gap="6px">
          <Button
            flex="1"
            h="34px"
            borderRadius="9px"
            fontSize="11.5px"
            fontWeight="700"
            bg={gradientBg}
            color="white"
            boxShadow={`0 3px 10px ${accentShadow}`}
            _hover={{ boxShadow: `0 5px 16px ${accentShadow}`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            onClick={() => onView(room)}
          >
            Chi tiết
          </Button>
          <Button
            h="34px"
            w="34px"
            p="0"
            borderRadius="9px"
            bg={darkMode ? DARK_THEME.inputBg : "#f8fafc"}
            color={darkMode ? DARK_THEME.textSecondary : "#475569"}
            border={`1px solid ${darkMode ? DARK_THEME.border : "#e2e8f0"}`}
            _hover={{ bg: darkMode ? DARK_THEME.hoverBg : "#f1f5f9" }}
            transition="all 0.15s"
            onClick={() => onToggle(room.RoomId)}
          >
            <Tooltip label={isActive ? "Đặt bảo trì" : "Kích hoạt"} placement="top" hasArrow>
              <Icon as={isActive ? MdBuild : MdCheckCircle} boxSize="14px" color={isActive ? "#f59e0b" : "#10b981"} />
            </Tooltip>
          </Button>
          <Button
            h="34px"
            w="34px"
            p="0"
            borderRadius="9px"
            bg={darkMode ? DARK_THEME.inputBg : "#f8fafc"}
            color={darkMode ? DARK_THEME.textSecondary : "#475569"}
            border={`1px solid ${darkMode ? DARK_THEME.border : "#e2e8f0"}`}
            _hover={{ bg: darkMode ? DARK_THEME.hoverBg : "#f1f5f9" }}
            transition="all 0.15s"
            onClick={() => onEdit(room)}
          >
            <Icon as={MdEdit} boxSize="14px" />
          </Button>
          <Button
            h="34px"
            w="34px"
            p="0"
            borderRadius="9px"
            bg={darkMode ? DARK_THEME.inputBg : "#f8fafc"}
            color={darkMode ? DARK_THEME.textSecondary : "#475569"}
            border={`1px solid ${darkMode ? DARK_THEME.border : "#e2e8f0"}`}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            transition="all 0.15s"
            onClick={() => onDelete(room)}
          >
            <Icon as={MdDelete} boxSize="14px" />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}