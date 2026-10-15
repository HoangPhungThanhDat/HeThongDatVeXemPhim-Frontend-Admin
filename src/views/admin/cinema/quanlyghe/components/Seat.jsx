// src/views/admin/quanlyghe/components/Seat.jsx

import React from "react";
import { Box, Flex, Icon, Tooltip, Text } from "@chakra-ui/react";
import { MdAccessible, MdStar, MdEdit, MdClose } from "react-icons/md";
import { SEAT_TYPES, ROW_LABELS } from "../constants";
import { popIn } from "./shared/animations";

const Seat = ({ seat, scale = 1, onEdit, isEditable = false, onDelete }) => {
  if (!seat) return null;
  
  const seatType = seat.type || seat.SeatType?.toLowerCase() || "regular";
  const cfg = SEAT_TYPES[seatType] || SEAT_TYPES.regular;
  const isCouple = seatType === "couple";
  const isSweetbox = seatType === "sweetbox";
  const isSpecial = isCouple || isSweetbox;

  const baseSize = isSpecial ? 36 : 32;
  const w = `${baseSize * scale}px`;
  const h = `${(baseSize * 0.75) * scale}px`;
  
  // ✅ Lấy tên ghế đúng định dạng: A1, B2, C3...
  const rowLabel = seat.Row || ROW_LABELS[seat.row] || '';
  const seatNumber = seat.Number || (seat.col !== undefined ? seat.col + 1 : 1);
  const seatName = `${rowLabel}${seatNumber}`;
  
  const isBooked = seat.booked || seat.Status === "Booked";

  const handleClick = (e) => {
    e.stopPropagation();
    if (isEditable && onEdit) {
      const seatData = {
        ...seat,
        SeatId: seat.SeatId,
        Row: rowLabel,
        Number: seatNumber,
        type: seatType,
        SeatType: seat.SeatType || seatType.charAt(0).toUpperCase() + seatType.slice(1),
        booked: isBooked,
        Status: isBooked ? "Booked" : "Available",
        row: seat.row !== undefined ? seat.row : ROW_LABELS.indexOf(rowLabel),
        col: seat.col !== undefined ? seat.col : seatNumber - 1,
      };
      onEdit(seatData);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(seat);
    }
  };

  const getBgColor = () => {
    if (isBooked) return cfg.bookedBg || "#dc2626";
    return cfg.bg || "#f3f4f6";
  };

  const getBorderColor = () => {
    if (isBooked) return cfg.bookedBg || "#dc2626";
    return cfg.border || "#d1d5db";
  };

  const getTextColor = () => {
    if (isBooked) return cfg.bookedColor || "white";
    return cfg.color || "#374151";
  };

  return (
    <Tooltip 
      label={
        <Box p="4px">
          <Text fontWeight="700" fontSize="13px">Ghế {seatName}</Text>
          <Text fontSize="11px" color="gray.300">{cfg.label}</Text>
          <Text fontSize="10px" color={isBooked ? "#fca5a5" : "#86efac"}>
            {isBooked ? "🔴 Đã đặt" : "🟢 Còn trống"}
          </Text>
          {isEditable && (
            <Text fontSize="10px" color="#fbbf24" mt="4px">Click để chỉnh sửa</Text>
          )}
        </Box>
      }
      placement="top" 
      hasArrow 
      bg="gray.800"
      color="white"
      borderRadius="8px"
      p="6px 10px"
    >
      <Box position="relative" display="inline-block">
        <Box
          w={w} 
          h={h} 
          borderRadius={`${6 * scale}px`}
          cursor={isEditable ? "pointer" : "default"}
          border={`${2 * scale}px solid`}
          borderColor={getBorderColor()}
          bg={getBgColor()}
          position="relative" 
          flexShrink="0"
          transition="all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          boxShadow={isBooked 
            ? `0 2px 8px ${getBorderColor()}40` 
            : `0 2px 4px rgba(0,0,0,0.06)`}
          _hover={isEditable ? { 
            transform: "scale(1.15)", 
            zIndex: 10, 
            boxShadow: `0 4px 16px ${cfg.color}66`,
            border: `2px solid #f97316`
          } : { 
            transform: "scale(1.05)", 
            zIndex: 10, 
            boxShadow: `0 4px 12px rgba(0,0,0,0.15)`
          }}
          sx={{ animation: `${popIn} 0.25s ease both` }}
          onClick={handleClick}
        >
          {/* Phần tựa ghế */}
          <Box
            position="absolute" 
            top={`${-4 * scale}px`} 
            left="50%" 
            transform="translateX(-50%)"
            w={`${(baseSize * 0.4) * scale}px`} 
            h={`${(baseSize * 0.15) * scale}px`} 
            borderRadius={`${3 * scale}px`}
            bg={isBooked ? cfg.bookedBg : cfg.border}
            opacity="0.8"
          />
          
          {/* ✅ Hiển thị tên ghế: A1, B2, C3... */}
          {!isBooked && (
            <Text 
              fontSize={`${(baseSize * 0.35) * scale}px`} 
              fontWeight="700" 
              color={getTextColor()}
              as="span"
              lineHeight="1"
              letterSpacing="-0.5px"
              opacity="0.9"
            >
              {seatName}
            </Text>
          )}
          
          {/* Icon đặc biệt */}
          {seatType === "vip" && !isBooked && (
            <Flex position="absolute" top="-8px" right="-6px">
              <Text fontSize={`${10 * scale}px`}>⭐</Text>
            </Flex>
          )}
          {seatType === "couple" && !isBooked && (
            <Flex position="absolute" top="-8px" right="-6px">
              <Text fontSize={`${10 * scale}px`}>💑</Text>
            </Flex>
          )}
          {seatType === "accessible" && !isBooked && (
            <Flex position="absolute" top="-8px" right="-6px">
              <Text fontSize={`${10 * scale}px`}>♿</Text>
            </Flex>
          )}
          {seatType === "sweetbox" && !isBooked && (
            <Flex position="absolute" top="-8px" right="-6px">
              <Text fontSize={`${10 * scale}px`}>💝</Text>
            </Flex>
          )}
          
          {/* Badge chỉnh sửa */}
          {isEditable && (
            <Box position="absolute" top="-6px" right="-6px" zIndex="5">
              <Box 
                w="16px" 
                h="16px" 
                borderRadius="full" 
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="0 2px 8px rgba(249,115,22,0.5)"
                border="2px solid white"
              >
                <Icon as={MdEdit} boxSize="8px" color="white" />
              </Box>
            </Box>
          )}
          
          {/* Nút xóa */}
          {isEditable && onDelete && (
            <Box
              position="absolute" 
              top="-8px" 
              left="-8px" 
              zIndex="5"
              w="18px" 
              h="18px" 
              borderRadius="full" 
              bg="#dc2626"
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              boxShadow="0 2px 8px rgba(220,38,38,0.5)"
              border="2px solid white"
              cursor="pointer"
              onClick={handleDelete}
              _hover={{ transform: "scale(1.2)", bg: "#b91c1c" }}
              transition="all 0.15s"
            >
              <Icon as={MdClose} boxSize="10px" color="white" />
            </Box>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default Seat;