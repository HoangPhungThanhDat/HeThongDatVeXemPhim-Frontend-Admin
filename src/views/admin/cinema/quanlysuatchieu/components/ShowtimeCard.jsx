

import React from "react";
import { Box, Flex, Text, Button, Icon, useColorModeValue, Tooltip, Badge } from "@chakra-ui/react";
import {
  MdMeetingRoom, MdAccessTime, MdVisibility, MdEdit,
  MdDelete, MdAttachMoney, MdCalendarToday, MdMovie
} from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { StatusPill } from "./StatusPill";
import { fadeUp } from "./shared/animations";

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
  
  const bgColor = useColorModeValue("white", "#1a202c");
  const borderColor = useColorModeValue("#e2e8f0", "#2d3748");
  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const subColor = useColorModeValue("#64748b", "#a0aec0");

  // Format date time
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Box
      borderRadius="14px"
      overflow="hidden"
      bg={isSelected ? (isDark ? "#2d3748" : "#fff7ed") : bgColor}
      border={isSelected 
        ? "2px solid #f97316" 
        : `1px solid ${borderColor}`}
      boxShadow={isSelected 
        ? "0 4px 20px rgba(249,115,22,0.15)" 
        : "0 1px 4px rgba(0,0,0,0.04)"}
      transition="all 0.25s"
      _hover={{
        borderColor: "#f97316",
        boxShadow: "0 8px 30px rgba(249,115,22,0.12)",
        transform: "translateY(-4px)"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${Math.min(index * 0.05, 0.5)}s both` }}
      cursor="pointer"
      onClick={() => onView(s)}
    >
      {/* Gradient Top Bar */}
      <Box h="3px" bg="linear-gradient(90deg, #f97316, #fb923c, #fbbf24)" />

      <Box p="16px">
        {/* Header: Status + Icon */}
        <Flex justify="space-between" align="flex-start" mb="10px">
          <StatusPill status={s.Status} size="sm" />
          <Box
            w="32px"
            h="32px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
            border="1px solid #fed7aa"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={BsCameraReelsFill} boxSize="13px" color="#f97316" />
          </Box>
        </Flex>

        {/* Movie Title */}
        <Text
          fontSize="14px"
          fontWeight="800"
          color={textColor}
          noOfLines={2}
          lineHeight="1.4"
          mb="8px"
        >
          {movieTitle || "Chưa có phim"}
        </Text>

        {/* Room & Time */}
        <Flex gap="6px" mb="12px" flexWrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdMeetingRoom} boxSize="11px" color="#f97316" />
            <Text fontSize="11px" fontWeight="600" color={subColor} noOfLines={1}>
              {roomName || "Chưa có phòng"}
            </Text>
          </Flex>
          
          <Box w="1px" h="12px" bg={borderColor} />
          
          <Flex align="center" gap="4px">
            <Icon as={MdCalendarToday} boxSize="11px" color={subColor} />
            <Text fontSize="11px" fontWeight="600" color={subColor}>
              {formatDateTime(s.StartTime).split(' ')[0] || "N/A"}
            </Text>
          </Flex>
          
          <Box w="1px" h="12px" bg={borderColor} />
          
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="11px" color={subColor} />
            <Text fontSize="11px" fontWeight="600" color={subColor}>
              {formatDateTime(s.StartTime).split(' ')[1] || "N/A"}
            </Text>
          </Flex>
        </Flex>

        {/* Price */}
        <Flex align="center" gap="4px" mb="14px">
          <Icon as={MdAttachMoney} boxSize="12px" color="#10b981" />
          <Text fontSize="14px" fontWeight="700" color="#10b981">
            {s.Price ? `${s.Price.toLocaleString('vi-VN')}đ` : "N/A"}
          </Text>
        </Flex>

        {/* Actions */}
        <Flex gap="7px" onClick={e => e.stopPropagation()}>
          <Button
            flex="1"
            size="xs"
            h="30px"
            borderRadius="8px"
            bg={useColorModeValue("#f8fafc", "#2d3748")}
            color={useColorModeValue("#64748b", "#a0aec0")}
            border={`1px solid ${borderColor}`}
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f97316", color: "white", borderColor: "#f97316" }}
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
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.25)"
            transition="all 0.15s"
            onClick={() => onEdit(s)}
          >
            Sửa
          </Button>
          <Tooltip label="Xóa" placement="top" hasArrow>
            <Button
              size="xs"
              h="30px"
              w="30px"
              minW="30px"
              borderRadius="8px"
              bg={useColorModeValue("#fef2f2", "#2d3748")}
              color={useColorModeValue("#dc2626", "#f87171")}
              border={useColorModeValue("1px solid #fca5a5", "1px solid #4a5568")}
              _hover={{ bg: "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(s.ShowtimeId)}
            >
              <Icon as={MdDelete} boxSize="14px" />
            </Button>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
};