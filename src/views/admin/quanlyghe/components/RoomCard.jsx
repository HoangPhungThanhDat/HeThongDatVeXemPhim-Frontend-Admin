// components/RoomCard.jsx
import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Grid, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdLayers, MdEdit } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";
import { fadeUp, shimmer } from "./shared/animations";
import { generateSeats } from "../hooks/useSeatManagement";
import RoomTypeBadge from "./RoomTypeBadge";
import StatusDot from "./StatusDot";
import { SEAT_TYPES } from "../constants";
import SeatApi from "../../../../api/SeatApi";

export default function RoomCard({ room, index, onView, onEditMode }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const [seatCount, setSeatCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeatCount();
  }, [room.id]);

  const loadSeatCount = async () => {
    try {
      const res = await SeatApi.getAll();
      const seats = res.data.data || res.data || [];
      const roomSeats = seats.filter(s => s.RoomId === room.id);
      const total = roomSeats.length;
      const booked = roomSeats.filter(s => s.Status !== "Available").length;
      setSeatCount(total);
      setBookedCount(booked);
    } catch (err) {
      console.error("Lỗi load ghế:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = seatCount;
  const booked = bookedCount;
  const empty = total - booked;
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0;

  // Generate preview seats
  const previewSeats = generateSeats(room);

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
      <Box 
        h="3px" 
        bg={room.status === "maintenance"
          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
          : "linear-gradient(90deg, #f97316, #fbbf24, #f97316)"}
        bgSize="200% 100%"
        sx={room.status === "active" ? { animation: `${shimmer} 3s linear infinite` } : {}}
      />

      <Box p="16px 18px">
        <Flex justify="space-between" align="flex-start" mb="12px">
          <Box flex="1" minW="0">
            <Flex align="center" gap="8px" mb="5px" flexWrap="wrap">
              <Text fontSize="14px" fontWeight="800" color={colors.textColor} noOfLines={1}>
                {room.name}
              </Text>
              <RoomTypeBadge type={room.type} />
            </Flex>
            <StatusDot status={room.status} />
          </Box>
          <Box textAlign="right" flexShrink="0" ml="8px">
            <Text fontSize="20px" fontWeight="900" color={colors.textColor}>
              {loading ? "..." : total}
            </Text>
            <Text fontSize="10px" color={isDark ? "#64748b" : "#94a3b8"} fontWeight="600">
              ghế
            </Text>
          </Box>
        </Flex>

        {/* Preview seats */}
        <Box bg={isDark ? "#2d3748" : "#fafbfc"} borderRadius="10px" p="10px" mb="12px" overflow="hidden">
          <Flex direction="column" gap="4px" align="center">
            <Box 
              w="80%" 
              h="4px" 
              borderRadius="2px"
              bg="linear-gradient(90deg, transparent, #f97316, transparent)" 
              mb="4px" 
            />
            {previewSeats.slice(0, 4).map((row, ri) => (
              <Flex key={ri} gap="3px" justify="center">
                {row.slice(0, 8).map((seat) => (
                  <Box 
                    key={seat.id}
                    w="9px" 
                    h="7px" 
                    borderRadius="2px"
                    bg={seat.booked
                      ? SEAT_TYPES[seat.type]?.bookedBg || "#dc2626"
                      : SEAT_TYPES[seat.type]?.border || "#fb923c"}
                  />
                ))}
                {row.length > 8 && (
                  <Text fontSize="7px" color={isDark ? "#64748b" : "#94a3b8"}>...</Text>
                )}
              </Flex>
            ))}
            {previewSeats.length > 4 && (
              <Text fontSize="9px" color={isDark ? "#64748b" : "#94a3b8"} mt="2px">
                +{previewSeats.length - 4} hàng nữa
              </Text>
            )}
          </Flex>
        </Box>

        <Grid templateColumns="1fr 1fr 1fr" gap="8px" mb="12px">
          {[
            { label: "Đã đặt", value: loading ? "..." : booked, color: "#dc2626" },
            { label: "Còn trống", value: loading ? "..." : empty, color: "#059669" },
            { label: "Lấp đầy", value: loading ? "..." : `${pct}%`, color: "#f97316" },
          ].map(({ label, value, color }) => (
            <Box 
              key={label} 
              p="8px" 
              borderRadius="8px" 
              bg={isDark ? "#2d3748" : "#f8fafc"}
              border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} 
              textAlign="center"
            >
              <Text fontSize="14px" fontWeight="800" color={color}>{value}</Text>
              <Text fontSize="9px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="0.5px">
                {label}
              </Text>
            </Box>
          ))}
        </Grid>

        <Box mb="14px">
          <Box h="5px" borderRadius="full" bg={isDark ? "#2d3748" : "#f1f5f9"} overflow="hidden">
            <Box 
              h="100%" 
              borderRadius="full" 
              w={`${pct}%`}
              bg={pct > 80 ? "#dc2626" : pct > 50 ? "#f97316" : "#10b981"}
              transition="width 0.6s ease" 
            />
          </Box>
        </Box>

        <Flex gap="8px">
          <Button 
            flex="1" 
            h="36px" 
            borderRadius="9px" 
            fontSize="12.5px" 
            fontWeight="700"
            bg="linear-gradient(135deg, #f97316, #fb923c)" 
            color="white"
            boxShadow="0 3px 10px rgba(249,115,22,0.3)"
            _hover={{ boxShadow: "0 5px 18px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} 
            transition="all 0.2s"
            leftIcon={<Icon as={MdLayers} boxSize="13px" />}
            onClick={() => onView(room)}
          >
            Xem sơ đồ ghế
          </Button>
          <Button 
            h="36px" 
            w="36px" 
            borderRadius="9px"
            bg={isDark ? "#2d3748" : "#f8fafc"} 
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }} 
            transition="all 0.15s"
            onClick={() => onEditMode(room)}
          >
            <Icon as={MdEdit} boxSize="14px" />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}