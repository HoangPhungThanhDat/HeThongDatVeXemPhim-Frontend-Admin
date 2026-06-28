

import React from "react";
import { Box, Flex, Text, Button, Icon, Tag, Divider } from "@chakra-ui/react";
import {
  MdMeetingRoom, MdCalendarToday, MdAccessTime, MdEventSeat,
  MdEdit, MdClose, MdAttachMoney, MdPerson, MdSchedule,
} from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { HiOutlineTicket } from "react-icons/hi";
import { FaPlay, FaStop, FaDollarSign, FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
import { StatusPill } from "./StatusPill";
import { fadeIn } from "./shared/animations";

export const DetailPanel = ({ 
  selected, 
  onEdit, 
  onClose, 
  isDark,
  getMovieTitle,
  getRoomName,
}) => {
  if (!selected) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" py="60px" px="24px">
        <Box
          w="72px"
          h="72px"
          borderRadius="20px"
          bg="linear-gradient(135deg, #fff7ed, #ffe4c8)"
          border="2px dashed #fdba74"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb="16px"
        >
          <Icon as={MdEventSeat} boxSize="28px" color="#fdba74" />
        </Box>
        <Text fontSize="14px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} textAlign="center">
          Chọn suất chiếu
        </Text>
        <Text fontSize="12px" color={isDark ? "#4a5568" : "#d1d5db"} textAlign="center" mt="4px">
          để xem thông tin chi tiết
        </Text>
      </Flex>
    );
  }

  const movieTitle = getMovieTitle(selected.MovieId);
  const roomName = getRoomName(selected.RoomId);
  const isScheduled = selected.Status === "Scheduled";

  const getStatusLabel = (status) => {
    if (status === "Scheduled") return "Đã lên lịch";
    if (status === "Cancelled") return "Đã hủy";
    if (status === "Finished") return "Đã kết thúc";
    return status;
  };

  return (
    <Box p="20px" sx={{ animation: `${fadeIn} 0.22s ease both` }}>
      {/* Nút đóng - chỉ hiển thị trên mobile */}
      <Flex justify="flex-end" mb="12px" display={{ base: "flex", xl: "none" }}>
        <Box
          w="28px"
          h="28px"
          borderRadius="8px"
          cursor="pointer"
          bg={isDark ? "#4a5568" : "#f3f4f6"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: isDark ? "#4a5568" : "#e5e7eb" }}
          onClick={onClose}
        >
          <Icon as={MdClose} boxSize="14px" color={isDark ? "#a0aec0" : "#6b7280"} />
        </Box>
      </Flex>

      {/* Hero Card - Summary */}
      <Box
        borderRadius="14px"
        overflow="hidden"
        mb="16px"
        bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        p="20px 18px"
        position="relative"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-20px"
          right="-20px"
          w="100px"
          h="100px"
          borderRadius="full"
          bg="rgba(249,115,22,0.08)"
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-20px"
          w="80px"
          h="80px"
          borderRadius="full"
          bg="rgba(99,102,241,0.07)"
        />

        {/* Icon & Title */}
        <Flex align="center" gap="8px" mb="12px">
          <Box
            w="30px"
            h="30px"
            borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 4px 12px rgba(249,115,22,0.4)"
          >
            <Icon as={BsCameraReelsFill} boxSize="13px" color="white" />
          </Box>
          <Text
            fontSize="9.5px"
            fontWeight="800"
            color="rgba(249,115,22,0.9)"
            letterSpacing="2px"
            textTransform="uppercase"
          >
            Suất chiếu
          </Text>
        </Flex>

        {/* Movie Title */}
        <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.4" noOfLines={3}>
          {movieTitle}
        </Text>

        {/* Room Name */}
        <Text fontSize="12px" color="rgba(255,255,255,0.5)" mt="4px" mb="12px">
          🎭 {roomName}
        </Text>

        {/* Status Badge */}
        <Box mt="8px">
          <StatusPill status={selected.Status} size="sm" />
        </Box>
      </Box>

      {/* Thông tin chi tiết - giống trang show */}
      <Box
        borderRadius="12px"
        overflow="hidden"
        border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
        mb="12px"
      >
        {/* Time & Price Info */}
        <Box
          p="14px 16px"
          bg={isDark ? "rgba(45, 55, 72, 0.5)" : "rgba(249, 250, 251, 0.5)"}
          borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
        >
          <Flex align="center" gap="8px" mb="10px">
            <Box
              w="24px"
              h="24px"
              borderRadius="6px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaClock} boxSize="11px" color="white" />
            </Box>
            <Text
              fontSize="11px"
              fontWeight="800"
              color={isDark ? "#a0aec0" : "#64748b"}
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Thông Tin Thời Gian & Giá
            </Text>
          </Flex>

          {/* Giờ bắt đầu */}
          <Flex align="center" gap="12px" p="8px 0" borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaPlay} boxSize="11px" color="#f97316" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Giờ bắt đầu
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.StartTime ? selected.StartTime.replace('T', ' ') : "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Giờ kết thúc */}
          <Flex align="center" gap="12px" p="8px 0" borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaStop} boxSize="11px" color="#f97316" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Giờ kết thúc
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.EndTime ? selected.EndTime.replace('T', ' ') : "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Giá vé */}
          <Flex align="center" gap="12px" p="8px 0">
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaDollarSign} boxSize="11px" color="#f97316" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Giá vé cơ bản
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.Price ? `${Number(selected.Price).toLocaleString('vi-VN')} đ` : "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Created Info */}
        <Box
          p="14px 16px"
          bg={isDark ? "rgba(45, 55, 72, 0.3)" : "rgba(249, 250, 251, 0.3)"}
          borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
        >
          <Flex align="center" gap="8px" mb="10px">
            <Box
              w="24px"
              h="24px"
              borderRadius="6px"
              bg="linear-gradient(135deg, #7c3aed, #8b5cf6)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaUser} boxSize="11px" color="white" />
            </Box>
            <Text
              fontSize="11px"
              fontWeight="800"
              color={isDark ? "#a0aec0" : "#64748b"}
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Thông Tin Tạo
            </Text>
          </Flex>

          {/* Người tạo */}
          <Flex align="center" gap="12px" p="8px 0" borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaUser} boxSize="11px" color="#7c3aed" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Người tạo
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.CreatedBy || "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Ngày tạo */}
          <Flex align="center" gap="12px" p="8px 0">
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaCalendarAlt} boxSize="11px" color="#7c3aed" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Ngày tạo
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.CreatedAt || "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Updated Info */}
        <Box
          p="14px 16px"
          bg={isDark ? "rgba(45, 55, 72, 0.3)" : "rgba(249, 250, 251, 0.3)"}
        >
          <Flex align="center" gap="8px" mb="10px">
            <Box
              w="24px"
              h="24px"
              borderRadius="6px"
              bg="linear-gradient(135deg, #059669, #10b981)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaClock} boxSize="11px" color="white" />
            </Box>
            <Text
              fontSize="11px"
              fontWeight="800"
              color={isDark ? "#a0aec0" : "#64748b"}
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Cập Nhật Gần Nhất
            </Text>
          </Flex>

          {/* Người cập nhật */}
          <Flex align="center" gap="12px" p="8px 0" borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaUser} boxSize="11px" color="#059669" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Người cập nhật
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.UpdatedBy || "N/A"}
              </Text>
            </Box>
          </Flex>

          {/* Ngày cập nhật */}
          <Flex align="center" gap="12px" p="8px 0">
            <Box w="28px" h="28px" borderRadius="6px" bg={isDark ? "#2d3748" : "#f9fafb"} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaClock} boxSize="11px" color="#059669" />
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
                Ngày cập nhật
              </Text>
              <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#111827"}>
                {selected.UpdatedAt || "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Trạng thái */}
      <Box
        mt="12px"
        p="12px 16px"
        borderRadius="10px"
        bg={isDark ? "#2d3748" : "linear-gradient(135deg, #fffbeb, #fff7ed)"}
        border={isDark ? "1.5px solid #4a5568" : "1.5px solid #fed7aa"}
      >
        <Flex align="center" justify="space-between">
          <Text
            fontSize="10.5px"
            color={isDark ? "#fbd38d" : "#92400e"}
            fontWeight="700"
            letterSpacing="0.5px"
          >
            TRẠNG THÁI HIỆN TẠI
          </Text>
          <StatusPill status={selected.Status} size="sm" />
        </Flex>
      </Box>

      {/* ID Suất Chiếu */}
      <Box
        mt="8px"
        p="10px 14px"
        borderRadius="8px"
        bg={isDark ? "#2d3748" : "#f3f4f6"}
        border={isDark ? "1px solid #4a5568" : "1px solid #e5e7eb"}
      >
        <Flex align="center" justify="space-between">
          <Text fontSize="10px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"} letterSpacing="0.5px" textTransform="uppercase">
            ID Suất Chiếu
          </Text>
          <Text fontSize="12px" fontWeight="800" color={isDark ? "#f7fafc" : "#111827"}>
            #{selected.ShowtimeId}
          </Text>
        </Flex>
      </Box>

      {/* Thông tin thêm */}
      <Box
        mt="12px"
        p="12px 14px"
        borderRadius="10px"
        bg={isDark ? "#2d3748" : "#f9fafb"}
        border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
      >
        <Text
          fontSize="9.5px"
          fontWeight="800"
          color={isDark ? "#a0aec0" : "#64748b"}
          letterSpacing="1px"
          textTransform="uppercase"
          mb="8px"
        >
          Thông tin thêm
        </Text>
        <Flex gap="8px" wrap="wrap">
          <Tag size="sm" bg="#fed7aa" color="#92400e" fontWeight="700" borderRadius="6px">
            <Icon as={MdEventSeat} mr="4px" boxSize="10px" /> Xem sơ đồ ghế
          </Tag>
          <Tag size="sm" bg="#d1fae5" color="#065f46" fontWeight="700" borderRadius="6px">
            <Icon as={HiOutlineTicket} mr="4px" boxSize="10px" /> Kiểm tra vé
          </Tag>
          <Tag size="sm" bg={isDark ? "#4a5568" : "#e5e7eb"} color={isDark ? "#a0aec0" : "#6b7280"} fontWeight="700" borderRadius="6px">
            <Icon as={MdSchedule} mr="4px" boxSize="10px" /> {getStatusLabel(selected.Status)}
          </Tag>
        </Flex>
      </Box>

      {/* Nút chỉnh sửa */}
      <Button
        w="100%"
        h="42px"
        mt="14px"
        borderRadius="11px"
        fontSize="13px"
        fontWeight="700"
        bg="linear-gradient(135deg, #f97316, #fb923c)"
        color="white"
        boxShadow="0 4px 16px rgba(249,115,22,0.32)"
        _hover={{
          boxShadow: "0 6px 22px rgba(249,115,22,0.42)",
          transform: "translateY(-1px)"
        }}
        _active={{ transform: "translateY(0)" }}
        transition="all 0.2s"
        leftIcon={<Icon as={MdEdit} />}
        onClick={() => onEdit(selected)}
      >
        Chỉnh sửa suất chiếu
      </Button>
    </Box>
  );
};