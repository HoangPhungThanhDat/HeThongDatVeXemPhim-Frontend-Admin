

import React from "react";
import { Box, Flex, Text, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdChair, MdCheckCircle, MdBuild, MdDelete } from "react-icons/md";
import StatusDot from "./StatusDot";
import RoomTypeBadge from "./RoomTypeBadge";
import { pulseDot } from "./shared/animations";
import { fadeUp } from "./shared/animations";

const RoomRow = ({ room, index, onToggleMaintenance, onDeleteRoom }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMaintenance = room.Status === "Inactive" || room.status === "Bảo trì";
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";

  const roomStatus = room.Status === "Active" ? "Hoạt động" : "Bảo trì";

  return (
    <Box p="14px 16px" borderRadius="12px" bg={bg} border={`1.5px solid ${border}`}
      transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.09)" }}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.04}s both` }}>
      <Flex align="center" gap="0">
        <Box flex="2.5" minW="0" pr="12px">
          <Flex align="center" gap="8px" mb="4px">
            <Text fontSize="13.5px" fontWeight="700" color={textColor} noOfLines={1}>{room.Name}</Text>
            <RoomTypeBadge type={room.Type || room.type || "Standard"} />
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdChair} boxSize="11px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="11.5px" color={isDark ? "#94a3b8" : "#64748b"} fontWeight="600">{room.Seats || room.seats || 0} ghế</Text>
            <Text fontSize="11.5px" color={isDark ? "#64748b" : "#64748b"} fontWeight="600" ml="8px">
              {room.Price?.toLocaleString() || room.price?.toLocaleString() || "75,000"}đ
            </Text>
          </Flex>
        </Box>

        <Box flex="1" minW="0" pr="12px">
          <StatusDot status={roomStatus} />
        </Box>

        <Box flex="2" minW="0" pr="12px">
          {room.CurrentMovie ? (
            <Flex align="center" gap="6px">
              <Box w="6px" h="6px" borderRadius="full" bg="#f97316"
                sx={{ animation: `${pulseDot} 1.8s ease infinite` }} />
              <Box>
                <Text fontSize="12px" fontWeight="700" color={textColor} noOfLines={1}>{room.CurrentMovie}</Text>
                <Text fontSize="10.5px" color={isDark ? "#64748b" : "#94a3b8"}>Suất tiếp: {room.NextShow}</Text>
              </Box>
            </Flex>
          ) : room.NextShow ? (
            <Box>
              <Text fontSize="11px" color={isDark ? "#64748b" : "#94a3b8"}>Suất tiếp theo</Text>
              <Text fontSize="12.5px" fontWeight="700" color={isDark ? "#94a3b8" : "#475569"}>{room.NextShow}</Text>
            </Box>
          ) : (
            <Text fontSize="12px" color={isDark ? "#475569" : "#cbd5e1"} fontStyle="italic">Không có suất chiếu</Text>
          )}
        </Box>

        <Flex flexShrink="0" gap="6px">
          <Button size="xs" h="30px" px="12px" borderRadius="8px"
            fontSize="11px" fontWeight="700"
            bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
            color={isMaintenance ? "#059669" : "#d97706"}
            border={isMaintenance ? "1px solid #6ee7b7" : "1px solid #fcd34d"}
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="11px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggleMaintenance(room.id || room.RoomId)}>
            {isMaintenance ? "Kích hoạt" : "Bảo trì"}
          </Button>
          <Button size="xs" h="30px" w="30px" borderRadius="8px"
            bg="transparent" color={isDark ? "#64748b" : "#94a3b8"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            onClick={() => onDeleteRoom(room.id || room.RoomId)}>
            <Icon as={MdDelete} boxSize="12px" />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RoomRow;