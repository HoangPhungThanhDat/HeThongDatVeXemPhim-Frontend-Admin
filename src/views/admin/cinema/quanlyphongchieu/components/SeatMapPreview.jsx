

import React from "react";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { shimmer, pulse } from "./shared/animations";

const SeatMapPreview = ({ room }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const rows = Math.min(room.Rows || room.rows || 10, 10);
  const cols = Math.min(room.SeatsPerRow || room.seatsPerRow || 14, 14);
  const occupancyPct = room.capacity > 0 ? room.bookedSeats / room.capacity : 0;
  const totalSeats = rows * cols;
  const bookedCount = Math.round(totalSeats * occupancyPct);

  return (
    <Box>
      <Box mb="14px" textAlign="center">
        <Box h="6px" borderRadius="3px 3px 8px 8px"
          bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 4s linear infinite` }}
          mx="auto" maxW="80%" mb="6px" />
        <Text fontSize="9px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1.2px" textTransform="uppercase">
          Màn hình — {room.ScreenSize || room.screenSize || "16m × 8m"}
        </Text>
      </Box>
      <Flex direction="column" gap="3px" align="center" mb="10px">
        {Array.from({ length: rows }).map((_, r) => (
          <Flex key={r} gap="3px">
            {Array.from({ length: cols }).map((_, c) => {
              const seatIdx = r * cols + c;
              const isBooked = seatIdx < bookedCount;
              return (
                <Box key={c} w="9px" h="7px" borderRadius="2px 2px 0 0"
                  bg={isBooked ? "#f97316" : (isDark ? "#334155" : "#e2e8f0")}
                  transition="background 0.2s"
                />
              );
            })}
          </Flex>
        ))}
      </Flex>
      <Flex justify="center" gap="16px">
        {[
          { color: "#f97316", label: "Đã đặt" },
          { color: isDark ? "#334155" : "#e2e8f0", label: "Còn trống" },
        ].map(({ color, label }) => (
          <Flex key={label} align="center" gap="5px">
            <Box w="10px" h="8px" borderRadius="2px" bg={color} />
            <Text fontSize="10px" fontWeight="600" color={isDark ? "#94a3b8" : "#64748b"}>{label}</Text>
          </Flex>
        ))}
      </Flex>
      <Box mt="8px" p="6px 10px" borderRadius="8px" bg={isDark ? "#2d3748" : "#fef3c7"} border={`1px solid ${isDark ? "#374151" : "#fde68a"}`} textAlign="center">
        <Text fontSize="10px" fontWeight="600" color={isDark ? "#f1f5f9" : "#92400e"}>
          Sơ đồ chi tiết chỉ Admin có thể chỉnh sửa
        </Text>
      </Box>
    </Box>
  );
};

export default SeatMapPreview;