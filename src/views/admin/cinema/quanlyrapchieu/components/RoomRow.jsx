

import React from "react";
import { Box, Flex, Text, Button, Icon, useColorMode, Tooltip } from "@chakra-ui/react";
import { MdChair, MdCheckCircle, MdBuild, MdDelete, MdMeetingRoom } from "react-icons/md";
import StatusDot from "./StatusDot";
import RoomTypeBadge from "./RoomTypeBadge";
import { pulseDot } from "./shared/animations";
import { fadeUp } from "./shared/animations";

const RoomRow = ({ room, index, onToggleMaintenance, onDeleteRoom }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  
  // ✅ Xác định trạng thái phòng
  const isMaintenance = room.Status === "Inactive" || room.Status === "Maintenance" || room.status === "Bảo trì";
  const isActive = room.Status === "Active";
  
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";

  const roomStatus = isActive ? "Hoạt động" : "Bảo trì";

  // ✅ Lấy số ghế từ nhiều nguồn khác nhau
  const getSeatCount = () => {
    // Ưu tiên: ActualSeats (từ backend)
    if (room.ActualSeats !== undefined && room.ActualSeats !== null) {
      return room.ActualSeats;
    }
    // Thứ 2: SeatCount
    if (room.SeatCount !== undefined && room.SeatCount !== null) {
      return room.SeatCount;
    }
    // Thứ 3: seats (mảng)
    if (room.seats && Array.isArray(room.seats)) {
      return room.seats.length;
    }
    // Thứ 4: Seats (mảng)
    if (room.Seats && Array.isArray(room.Seats)) {
      return room.Seats.length;
    }
    // Thứ 5: seats (số)
    if (room.seats !== undefined && room.seats !== null) {
      return room.seats;
    }
    // Thứ 6: Seats (số)
    if (room.Seats !== undefined && room.Seats !== null) {
      return room.Seats;
    }
    // Mặc định
    return 0;
  };

  const seatCount = getSeatCount();

  // ✅ Lấy giá vé
  const getPrice = () => {
    if (room.Price) return room.Price;
    if (room.price) return room.price;
    return 75000;
  };

  const price = getPrice();

  // ✅ Lấy tên phòng
  const roomName = room.Name || room.name || "Phòng chiếu";
  const roomType = room.Type || room.type || room.RoomType || "Standard";
  const roomId = room.RoomId || room.id;

  // ✅ Lấy thông tin phim đang chiếu
  const currentMovie = room.CurrentMovie || room.currentMovie || null;
  const nextShow = room.NextShow || room.nextShow || null;

  return (
    <Box 
      p="14px 16px" 
      borderRadius="12px" 
      bg={bg} 
      border={`1.5px solid ${border}`}
      transition="all 0.2s"
      _hover={{ 
        border: "1.5px solid #f97316", 
        boxShadow: "0 2px 12px rgba(249,115,22,0.09)" 
      }}
      sx={{ animation: `${fadeUp} 0.3s ease ${Math.min(index * 0.04, 0.4)}s both` }}
    >
      <Flex align="center" gap="0" flexWrap={{ base: "wrap", md: "nowrap" }}>
        {/* Thông tin phòng */}
        <Box flex="2.5" minW="0" pr="12px" mb={{ base: "8px", md: "0" }}>
          <Flex align="center" gap="8px" mb="4px" flexWrap="wrap">
            <Text fontSize="13.5px" fontWeight="700" color={textColor} noOfLines={1}>
              {roomName}
            </Text>
            <RoomTypeBadge type={roomType} />
          </Flex>
          <Flex align="center" gap="4px" flexWrap="wrap">
            <Icon as={MdChair} boxSize="11px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="11.5px" color={subColor} fontWeight="600">
              {seatCount} ghế
            </Text>
            <Text fontSize="11.5px" color={subColor} fontWeight="600" ml="8px">
              {price.toLocaleString('vi-VN')}đ
            </Text>
          </Flex>
        </Box>

        {/* Trạng thái */}
        <Box flex="1" minW="0" pr="12px" mb={{ base: "8px", md: "0" }}>
          <StatusDot status={roomStatus} />
        </Box>

       

        {/* Actions */}
        <Flex flexShrink="0" gap="6px" w={{ base: "100%", md: "auto" }} mt={{ base: "8px", md: "0" }}>
          <Tooltip label={isMaintenance ? "Kích hoạt phòng" : "Chuyển sang bảo trì"} placement="top" hasArrow>
            <Button 
              size="xs" 
              h="30px" 
              px="12px" 
              borderRadius="8px"
              fontSize="11px" 
              fontWeight="700"
              flex={{ base: "1", md: "auto" }}
              bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
              color={isMaintenance ? "#059669" : "#d97706"}
              border={isMaintenance ? "1px solid #6ee7b7" : "1px solid #fcd34d"}
              leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="11px" />}
              _hover={{ opacity: 0.85, transform: "translateY(-1px)" }} 
              transition="all 0.15s"
              onClick={() => onToggleMaintenance(roomId)}
            >
              {isMaintenance ? "Kích hoạt" : "Bảo trì"}
            </Button>
          </Tooltip>

          <Tooltip label="Xóa phòng" placement="top" hasArrow>
            <Button 
              size="xs" 
              h="30px" 
              w="30px" 
              minW="30px"
              borderRadius="8px"
              bg="transparent" 
              color={isDark ? "#64748b" : "#94a3b8"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
              _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
              onClick={() => onDeleteRoom(roomId)}
            >
              <Icon as={MdDelete} boxSize="12px" />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RoomRow;