// components/RoomListRow.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Badge, Button, Icon, useColorMode,
  Tooltip
} from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdBuild,
  MdMovie
} from "react-icons/md";
import { fadeUp } from "./shared/animations";
import SeatApi from "../../../../api/SeatApi";
// Import getSeatColors từ StatCard
import { getSeatColors } from "./shared/StatCard";

export default function RoomListRow({ room, index, onView, onToggle, onEdit, onDelete }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  
  const [seatCount, setSeatCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [loadingSeats, setLoadingSeats] = useState(true);

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

  const statusColors = {
    Active: { bg: isDark ? "#064e3b" : "#ecfdf5", color: isDark ? "#34d399" : "#059669", dot: "#10b981" },
    Inactive: { bg: isDark ? "#451a03" : "#fffbeb", color: isDark ? "#fbbf24" : "#b45309", dot: "#f59e0b" },
    Maintenance: { bg: isDark ? "#7f1d1d" : "#fef2f2", color: isDark ? "#f87171" : "#dc2626", dot: "#ef4444" },
  };

  const statusStyle = statusColors[room.Status] || statusColors.Inactive;

  const totalSeats = room.Capacity || seatCount || 0;
  const bookedSeats = bookedCount || 0;
  const availableSeats = totalSeats - bookedSeats;

  return (
    <Box
      bg={colors.bgCard}
      borderRadius="12px"
      border={`1px solid ${colors.borderCard}`}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.05}s both` }}
      _hover={{ border: "1px solid #f97316", boxShadow: "0 4px 16px rgba(249,115,22,0.08)" }}
      transition="all 0.2s"
      p="12px 16px"
    >
      <Flex align="center" gap="12px">
        {/* Icon */}
        <Box flexShrink="0">
          <Box
            w="32px"
            h="32px"
            borderRadius="8px"
            bg={isActive ? "rgba(16,185,129,0.15)" : isMaintenance ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={isActive ? MdCheckCircle : isMaintenance ? MdBuild : MdCheckCircle}
              boxSize="14px" color={statusStyle.color} />
          </Box>
        </Box>

        {/* Thông tin phòng */}
        <Box flex="1.8" minW="0">
          <Flex align="center" gap="8px" flexWrap="wrap">
            <Text fontSize="14px" fontWeight="800" color={colors.textColor} noOfLines={1}>
              {room.Name}
            </Text>
            <Badge
              px="8px"
              py="2px"
              borderRadius="6px"
              bg={isDark ? "#2d3748" : "#f1f5f9"}
              color={isDark ? "#94a3b8" : "#475569"}
              fontSize="8px"
              fontWeight="700"
              textTransform="none"
            >
              {room.RoomType || "Standard"}
            </Badge>
            <Badge
              px="8px"
              py="2px"
              borderRadius="6px"
              bg={statusStyle.bg}
              color={statusStyle.color}
              fontSize="8px"
              fontWeight="700"
              textTransform="none"
            >
              <Flex align="center" gap="4px">
                <Box w="5px" h="5px" borderRadius="full" bg={statusStyle.dot} />
                {room.Status === "Active" ? "Hoạt động" :
                 room.Status === "Maintenance" ? "Bảo trì" : "Không hoạt động"}
              </Flex>
            </Badge>
          </Flex>
        </Box>

        {/* Số ghế */}
        <Box flex="0.7" textAlign="center">
          <Text fontSize="16px" fontWeight="800" color={colors.textColor}>
            {loadingSeats ? "..." : totalSeats}
          </Text>
          <Text fontSize="9px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
            ghế
          </Text>
        </Box>

        {/* Số ghế đã đặt / trống */}
        <Box flex="0.7" textAlign="center">
          <Text fontSize="14px" fontWeight="700" color={colors.textColor}>
            {loadingSeats ? "..." : `${bookedSeats}/${availableSeats}`}
          </Text>
          <Text fontSize="9px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
            đã đặt / trống
          </Text>
        </Box>

        {/* Phim đang chiếu */}
        <Box flex="1.8" minW="0">
          <Flex align="center" gap="6px">
            <Icon as={MdMovie} boxSize="12px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="12px" fontWeight="500" color={isDark ? "#94a3b8" : "#64748b"} noOfLines={1}>
              {room.CurrentMovie || "Chưa có phim"}
            </Text>
          </Flex>
        </Box>

        {/* Progress bar */}
        <Box flex="1.2">
          {seatCount > 0 ? (
            <>
              <Flex justify="space-between" mb="2px">
                <Text fontSize="9px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
                  Lấp đầy
                </Text>
                <Text fontSize="9px" fontWeight="700" color={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? "#f97316" : "#059669"}>
                  {filledPercent}%
                </Text>
              </Flex>
              <Box h="4px" borderRadius="full" bg={isDark ? "#2d3748" : "#f1f5f9"} overflow="hidden">
                <Box
                  h="100%"
                  borderRadius="full"
                  w={`${filledPercent}%`}
                  bg={filledPercent > 80 ? "#dc2626" : filledPercent > 50 ? "#f97316" : "#10b981"}
                  transition="width 0.6s ease"
                />
              </Box>
            </>
          ) : (
            <Text fontSize="10px" color={isDark ? "#64748b" : "#94a3b8"}>Chưa có ghế</Text>
          )}
        </Box>

        {/* Actions */}
        <Box flexShrink="0" w="160px" textAlign="right">
          <Flex gap="4px" justify="flex-end">
            <Button
              size="xs"
              h="28px"
              px="10px"
              borderRadius="7px"
              fontSize="11px"
              fontWeight="700"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white"
              _hover={{ boxShadow: "0 3px 10px rgba(249,115,22,0.3)" }}
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              onClick={() => onView(room)}
            >
              Xem
            </Button>
            <Button
              size="xs"
              h="28px"
              w="28px"
              p="0"
              borderRadius="7px"
              bg={isDark ? "#2d3748" : "#f8fafc"}
              color={isDark ? "#94a3b8" : "#475569"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
              _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
              onClick={() => onToggle(room.RoomId)}
            >
              <Tooltip label={isActive ? "Bảo trì" : "Kích hoạt"} placement="top" hasArrow>
                <Icon as={isActive ? MdBuild : MdCheckCircle} boxSize="12px" color={isActive ? "#f59e0b" : "#10b981"} />
              </Tooltip>
            </Button>
            <Button
              size="xs"
              h="28px"
              w="28px"
              p="0"
              borderRadius="7px"
              bg={isDark ? "#2d3748" : "#f8fafc"}
              color={isDark ? "#94a3b8" : "#475569"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
              _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
              onClick={() => onEdit(room)}
            >
              <Icon as={MdEdit} boxSize="12px" />
            </Button>
            <Button
              size="xs"
              h="28px"
              w="28px"
              p="0"
              borderRadius="7px"
              bg={isDark ? "#2d3748" : "#f8fafc"}
              color={isDark ? "#94a3b8" : "#475569"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
              _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
              onClick={() => onDelete(room)}
            >
              <Icon as={MdDelete} boxSize="12px" />
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}