// src/views/admin/quanlysuatchieu/components/ShowtimeRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon, useColorModeValue, Tooltip } from "@chakra-ui/react";
import {
  MdMeetingRoom, MdAccessTime, MdVisibility, MdEdit,
  MdDelete, MdAttachMoney, MdMovie, MdCalendarToday
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
  
  const borderColor = useColorModeValue("#e2e8f0", "#2d3748");
  const bgSelected = useColorModeValue("#fff7ed", "#2d3748");
  const bgHover = useColorModeValue("#f8fafc", "#2d3748");
  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const subColor = useColorModeValue("#64748b", "#a0aec0");
  
  // ✅ Hàm parse ngày giờ "siêu bền" - Xử lý mọi định dạng
  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "N/A", time: "N/A" };
    try {
      let date;
      
      // Xử lý chuỗi từ Backend (VD: "2026-10-23 14:30:00" hoặc "23-10-2026 14:30:00")
      if (typeof dateStr === 'string') {
        const parts = dateStr.split(' ');
        if (parts.length === 2) {
          const datePart = parts[0];
          const timePart = parts[1];
          
          // Nếu ngày ở dạng DD-MM-YYYY
          if (datePart.includes('-')) {
            const dateParts = datePart.split('-');
            if (dateParts[0].length === 2 && dateParts[2].length === 4) {
              // Chuyển thành YYYY-MM-DD
              date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}`);
            } else {
              date = new Date(dateStr.replace(' ', 'T'));
            }
          } else {
            date = new Date(dateStr.replace(' ', 'T'));
          }
        } else {
           date = new Date(dateStr);
        }
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) return { date: "N/A", time: "N/A" };

      return {
        date: date.toLocaleDateString('vi-VN'),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: "N/A", time: "N/A" };
    }
  };

  const { date, time } = formatDateTime(s.StartTime);

  return (
    <Flex
      align="center"
      p="12px 16px"
      borderRadius="10px"
      bg={isSelected ? bgSelected : "transparent"}
      border={isSelected 
        ? "2px solid #f97316" 
        : `1px solid ${borderColor}`}
      transition="all 0.2s"
      _hover={{
        borderColor: isSelected ? "#f97316" : "#f97316",
        boxShadow: "0 2px 12px rgba(249,115,22,0.08)",
        bg: isSelected ? bgSelected : bgHover,
        transform: "translateX(4px)"
      }}
      sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
      cursor="pointer"
      onClick={() => onView(s)}
      gap="8px"
    >
      {/* STT */}
      <Box w="32px" flexShrink="0">
        <Text fontSize="11px" fontWeight="700" color={useColorModeValue("#cbd5e1", "#4a5568")}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>

      {/* Icon */}
      <Box
        w="36px" h="36px" borderRadius="10px"
        bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
        border="1px solid #fed7aa"
        display="flex" alignItems="center" justifyContent="center"
        flexShrink="0" mr="8px"
      >
        <Icon as={BsCameraReelsFill} boxSize="14px" color="#f97316" />
      </Box>

      {/* Movie Title */}
      <Box flex="2" minW="0" pr="10px">
        <Text fontSize="14px" fontWeight="700" color={textColor} noOfLines={1}>
          {movieTitle || "Chưa có phim"}
        </Text>
        <Flex align="center" gap="4px" mt="1px">
          <Icon as={MdMeetingRoom} boxSize="11px" color="#f97316" />
          <Text fontSize="11px" color={subColor} fontWeight="500" noOfLines={1}>
            {roomName || "Chưa có phòng"}
          </Text>
        </Flex>
      </Box>

      {/* Room & Date Time */}
      <Box flex="1.8" minW="0" pr="10px" display={{ base: "none", md: "block" }}>
        <Flex align="center" gap="5px" mb="1px">
          <Icon as={MdCalendarToday} boxSize="11px" color={subColor} />
          <Text fontSize="12px" fontWeight="600" color={subColor}>
            {date}
          </Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Icon as={MdAccessTime} boxSize="11px" color={subColor} />
          <Text fontSize="12px" fontWeight="600" color={subColor}>
            {time}
          </Text>
        </Flex>
      </Box>

      {/* Price */}
      <Box flex="1.2" minW="0" pr="10px" display={{ base: "none", lg: "block" }}>
        <Flex align="center" gap="5px">
          <Icon as={MdAttachMoney} boxSize="12px" color="#10b981" />
          <Text fontSize="13px" fontWeight="700" color="#10b981">
            {s.Price ? `${s.Price.toLocaleString('vi-VN')}đ` : "N/A"}
          </Text>
        </Flex>
      </Box>

      {/* Status */}
      <Box flex="1" minW="0" pr="10px" display={{ base: "none", sm: "block" }}>
        <StatusPill status={s.Status} size="sm" />
      </Box>

      {/* Actions */}
      <Flex gap="5px" flexShrink="0" onClick={e => e.stopPropagation()}>
        <Tooltip label="Xem chi tiết" placement="top" hasArrow>
          <Button
            size="xs" h="30px" w="30px" minW="30px" borderRadius="8px"
            bg={useColorModeValue("#f8fafc", "#2d3748")}
            color={useColorModeValue("#64748b", "#a0aec0")}
            border={`1px solid ${borderColor}`}
            _hover={{ bg: "#f97316", color: "white", borderColor: "#f97316" }}
            transition="all 0.15s"
            onClick={() => onView(s)}
          >
            <Icon as={MdVisibility} boxSize="14px" />
          </Button>
        </Tooltip>

        <Tooltip label="Chỉnh sửa" placement="top" hasArrow>
          <Button
            size="xs" h="30px" w="30px" minW="30px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.25)"
            transition="all 0.15s"
            onClick={() => onEdit(s)}
          >
            <Icon as={MdEdit} boxSize="14px" />
          </Button>
        </Tooltip>

        <Tooltip label="Xóa" placement="top" hasArrow>
          <Button
            size="xs" h="30px" w="30px" minW="30px" borderRadius="8px"
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
    </Flex>
  );
};