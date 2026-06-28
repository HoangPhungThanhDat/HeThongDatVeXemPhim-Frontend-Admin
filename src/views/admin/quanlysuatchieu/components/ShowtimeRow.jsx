

import React from "react";
import { Box, Flex, Text, Button, Icon, Switch } from "@chakra-ui/react";
import {
  MdMeetingRoom, MdAccessTime, MdVisibility, MdEdit,
  MdDelete, MdAttachMoney,
} from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { StatusPill } from "./StatusPill";
import { fadeUp } from "./shared/animations";

export const ShowtimeRow = ({ 
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
    <Flex
      align="center"
      p="13px 16px"
      borderRadius="12px"
      bg={isSelected ? (isDark ? "#2d3748" : "#fff7ed") : (isDark ? "#1a202c" : "white")}
      border={isSelected ? "1.5px solid #f97316" : (isDark ? "1.5px solid #4a5568" : "1.5px solid #f1f5f9")}
      transition="all 0.18s"
      _hover={{
        border: "1.5px solid #fdba74",
        boxShadow: isDark ? "0 3px 14px rgba(0,0,0,0.2)" : "0 3px 14px rgba(249,115,22,0.1)",
        bg: isDark ? "#2d3748" : "#fffbf7"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.045}s both` }}
      cursor="pointer"
      onClick={() => onView(s)}
      gap="0"
    >
      <Box w="36px" flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color={isDark ? "#4a5568" : "#d1d5db"}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>

      <Box
        w="36px"
        h="36px"
        borderRadius="10px"
        bg="linear-gradient(135deg, #fff7ed, #ffe4c8)"
        border="1px solid #fed7aa"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
        mr="12px"
      >
        <Icon as={BsCameraReelsFill} boxSize="13px" color="#f97316" />
      </Box>

      <Box flex="2.5" minW="0" pr="12px">
        <Text fontSize="13.5px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"} noOfLines={1}>
          {movieTitle}
        </Text>
        <Flex align="center" gap="4px" mt="1px">
          <Icon as={MdMeetingRoom} boxSize="10px" color="#f97316" />
          <Text fontSize="11px" color={isDark ? "#718096" : "#9ca3af"} fontWeight="500">
            {roomName}
          </Text>
        </Flex>
      </Box>

      <Box flex="1.5" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
        <Flex align="center" gap="5px" mb="2px">
          <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
          <Text fontSize="12px" fontWeight="600" color={isDark ? "#a0aec0" : "#4b5563"}>
            {s.StartTime?.replace('T', ' ') || "N/A"}
          </Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Icon as={MdAttachMoney} boxSize="10px" color="#10b981" />
          <Text fontSize="12px" fontWeight="600" color={isDark ? "#a0aec0" : "#4b5563"}>
            {s.Price ? `${s.Price.toLocaleString('vi-VN')}đ` : "N/A"}
          </Text>
        </Flex>
      </Box>

      <Box flex="1" minW="0" pr="12px" display={{ base: "none", sm: "block" }}>
        <StatusPill status={s.Status} size="sm" />
      </Box>

      <Flex gap="6px" flexShrink="0" onClick={e => e.stopPropagation()}>
        <Button
          size="xs"
          h="30px"
          px="9px"
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
          display={{ base: "none", md: "flex" }}
        >
          Xem
        </Button>
        <Button
          size="xs"
          h="30px"
          px="9px"
          borderRadius="8px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white"
          fontSize="11px"
          fontWeight="700"
          leftIcon={<Icon as={MdEdit} boxSize="11px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 8px rgba(249,115,22,0.28)"
          transition="all 0.15s"
          onClick={() => onEdit(s)}
        >
          Sửa
        </Button>
        <Button
          size="xs"
          h="30px"
          px="9px"
          borderRadius="8px"
          bg={isDark ? "#4a5568" : "#fee2e2"}
          color={isDark ? "#e2e8f0" : "#dc2626"}
          border={isDark ? "1px solid #4a5568" : "1px solid #fecaca"}
          fontSize="11px"
          fontWeight="600"
          leftIcon={<Icon as={MdDelete} boxSize="11px" />}
          _hover={{ bg: isDark ? "#4a5568" : "#fecaca" }}
          transition="all 0.15s"
          onClick={() => onDelete(s.ShowtimeId)}
          display={{ base: "none", md: "flex" }}
        >
          Xóa
        </Button>
      </Flex>
    </Flex>
  );
};