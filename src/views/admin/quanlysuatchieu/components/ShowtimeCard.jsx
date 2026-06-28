

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import {
  MdMeetingRoom, MdCalendarToday, MdAccessTime, MdVisibility, MdEdit,
  MdDelete, MdAttachMoney,
} from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { StatusPill } from "./StatusPill";
import { fadeUp } from "./shared/animations";
import { STATUS_LABELS } from "../constants";

export const ShowtimeCard = ({ 
  s, 
  index, 
  isSelected, 
  onView, 
  onEdit, 
  onDelete,
  onToggle,
  isDark,
  getMovieTitle,
  getRoomName,
}) => {
  const movieTitle = getMovieTitle(s.MovieId);
  const roomName = getRoomName(s.RoomId);

  return (
    <Box
      borderRadius="14px"
      overflow="hidden"
      bg={isSelected ? (isDark ? "#2d3748" : "#fff7ed") : (isDark ? "#2d3748" : "white")}
      border={isSelected ? "2px solid #f97316" : (isDark ? "1.5px solid #4a5568" : "1.5px solid #f1f5f9")}
      boxShadow={isSelected ? "0 4px 20px rgba(249,115,22,0.15)" : "0 1px 4px rgba(0,0,0,0.04)"}
      transition="all 0.2s"
      _hover={{
        border: "1.5px solid #fdba74",
        boxShadow: isDark ? "0 6px 22px rgba(0,0,0,0.3)" : "0 6px 22px rgba(249,115,22,0.12)",
        transform: "translateY(-2px)"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
      cursor="pointer"
      onClick={() => onView(s)}
    >
      <Box h="3px" bg={`linear-gradient(90deg, #f97316, #fbbf24)`} />

      <Box p="14px 16px">
        <Flex justify="space-between" align="flex-start" mb="10px">
          <StatusPill status={s.Status} size="sm" />
          <Box
            w="28px"
            h="28px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #fff7ed, #ffe4c8)"
            border="1px solid #fed7aa"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={BsCameraReelsFill} boxSize="11px" color="#f97316" />
          </Box>
        </Flex>

        <Text
          fontSize="13.5px"
          fontWeight="800"
          color={isDark ? "#f7fafc" : "#111827"}
          noOfLines={2}
          lineHeight="1.4"
          mb="8px"
        >
          {movieTitle}
        </Text>

        <Flex gap="6px" mb="12px" wrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdMeetingRoom} boxSize="10px" color="#f97316" />
            <Text fontSize="11px" fontWeight="600" color={isDark ? "#a0aec0" : "#6b7280"}>
              {roomName}
            </Text>
          </Flex>
          <Box w="1px" h="13px" bg={isDark ? "#4a5568" : "#e5e7eb"} mt="1px" />
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="600" color={isDark ? "#a0aec0" : "#6b7280"}>
              {s.StartTime?.replace('T', ' ') || "N/A"}
            </Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAttachMoney} boxSize="10px" color="#10b981" />
            <Text fontSize="11px" fontWeight="600" color={isDark ? "#a0aec0" : "#6b7280"}>
              {s.Price ? `${s.Price.toLocaleString('vi-VN')}đ` : "N/A"}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="7px" onClick={e => e.stopPropagation()}>
          <Button
            flex="1"
            size="xs"
            h="30px"
            borderRadius="8px"
            bg={isDark ? "#4a5568" : "#f8fafc"}
            color={isDark ? "#e2e8f0" : "#374151"}
            border={isDark ? "1px solid #4a5568" : "1px solid #e5e7eb"}
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg: isDark ? "#4a5568" : "#f1f5f9" }}
            transition="all 0.15s"
            onClick={() => onView(s)}
          >
            Xem
          </Button>
          <Button
            flex="1"
            size="xs"
            h="30px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            fontSize="11px"
            fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s"
            onClick={() => onEdit(s)}
          >
            Sửa
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};