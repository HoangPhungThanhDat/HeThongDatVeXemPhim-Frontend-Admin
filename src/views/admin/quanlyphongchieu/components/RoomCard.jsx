// components/RoomCard.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Badge, Button, Icon, useColorMode,
  Tooltip
} from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdBuild,
  MdMeetingRoom, MdChair, MdMovie
} from "react-icons/md";
import { fadeUp } from "./shared/animations";
import SeatApi from "../../../../api/SeatApi";
// Import default và function từ StatCard
import StatCard, { getSeatColors } from "./shared/StatCard";

export default function RoomCard({ room, index, onView, onToggle, onEdit, onDelete }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  
  const [seatCount, setSeatCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [loadingSeats, setLoadingSeats] = useState(true);

  // Load số ghế của phòng
  useEffect(() => {
    loadSeatCount();
  }, [room.RoomId]);

  const loadSeatCount = async () => {
    try {
      const res = await SeatApi.getAll();
      const allSeats = res.data.data || res.data || [];
      const roomSeats = allSeats.filter(s => s.RoomId === room.RoomId);
      const total = roomSeats.length;
      const booked = roomSeats.filter(s => s.Status !== "Available").length;
      setSeatCount(total);
      setBookedCount(booked);
    } catch (err) {
      console.error("Lỗi load ghế:", err);
    } finally {
      setLoadingSeats(false);
    }
  };

  const isActive = room.Status === "Active";
  const isMaintenance = room.Status === "Maintenance";
  const filledPercent = seatCount > 0 ? Math.round((bookedCount / seatCount) * 100) : 0;

  // Xác định màu sắc theo trạng thái
  const statusColors = {
    Active: { bg: isDark ? "#064e3b" : "#ecfdf5", color: isDark ? "#34d399" : "#059669", dot: "#10b981" },
    Inactive: { bg: isDark ? "#451a03" : "#fffbeb", color: isDark ? "#fbbf24" : "#b45309", dot: "#f59e0b" },
    Maintenance: { bg: isDark ? "#7f1d1d" : "#fef2f2", color: isDark ? "#f87171" : "#dc2626", dot: "#ef4444" },
  };

  const statusStyle = statusColors[room.Status] || statusColors.Inactive;

  // Tính tổng số ghế
  const totalSeats = room.Capacity || seatCount || 0;
  const bookedSeats = bookedCount || 0;
  const availableSeats = totalSeats - bookedSeats;

  return (
    <Box
      bg={colors.bgCard}
      borderRadius="16px"
      border={`1.5px solid ${colors.borderCard}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.07}s both` }}
      overflow="hidden"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 4px 20px rgba(249,115,22,0.12)" }}
      transition="all 0.2s"
    >
      {/* Header với màu sắc theo trạng thái */}
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
              <Text fontSize="15px" fontWeight="800" color={colors.textColor} noOfLines={1}>
                {room.Name}
              </Text>
              <Badge
                px="8px"
                py="2px"
                borderRadius="6px"
                bg={isDark ? "#2d3748" : "#f1f5f9"}
                color={isDark ? "#94a3b8" : "#475569"}
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
            <Text fontSize="20px" fontWeight="900" color={colors.textColor}>
              {loadingSeats ? "..." : seatCount}
            </Text>
            <Text fontSize="10px" color={isDark ? "#64748b" : "#94a3b8"} fontWeight="600">
              ghế
            </Text>
          </Box>
        </Flex>

        {/* Thống kê ghế */}
        <Flex gap="8px" mb="12px">
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"}>
              Tổng ghế
            </Text>
            <Text fontSize="16px" fontWeight="800" color={colors.textColor}>
              {loadingSeats ? "..." : totalSeats}
            </Text>
          </Box>
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color="#059669">Trống</Text>
            <Text fontSize="16px" fontWeight="800" color="#059669">
              {loadingSeats ? "..." : availableSeats}
            </Text>
          </Box>
          <Box flex="1" p="8px 10px" borderRadius="8px" bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color="#dc2626">Đã đặt</Text>
            <Text fontSize="16px" fontWeight="800" color="#dc2626">
              {loadingSeats ? "..." : bookedSeats}
            </Text>
          </Box>
        </Flex>

        {/* Progress bar */}
        {seatCount > 0 && (
          <Box mb="14px">
            <Flex justify="space-between" mb="4px">
              <Text fontSize="10px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
                Lấp đầy
              </Text>
              <Text fontSize="10px" fontWeight="700" color={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? "#f97316" : "#059669"}>
                {filledPercent}%
              </Text>
            </Flex>
            <Box h="5px" borderRadius="full" bg={isDark ? "#2d3748" : "#f1f5f9"} overflow="hidden">
              <Box
                h="100%"
                borderRadius="full"
                w={`${filledPercent}%`}
                bg={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? "#f97316" : "#10b981"}
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
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            boxShadow="0 3px 10px rgba(249,115,22,0.25)"
            _hover={{ boxShadow: "0 5px 16px rgba(249,115,22,0.35)", transform: "translateY(-1px)" }}
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
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
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
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
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
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
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