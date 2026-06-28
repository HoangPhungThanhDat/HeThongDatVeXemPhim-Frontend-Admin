// components/Seat.jsx
import React from "react";
import { Box, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { MdAccessible, MdStar, MdEdit, MdClose } from "react-icons/md";
import { SEAT_TYPES, ROW_LABELS } from "../constants";
import { popIn } from "./shared/animations";

export default function Seat({ seat, scale = 1, onEdit, isEditable = false, onDelete }) {
  if (!seat) return null;
  
  // Xác định loại ghế
  const seatType = seat.type || seat.SeatType?.toLowerCase() || "regular";
  const cfg = SEAT_TYPES[seatType] || SEAT_TYPES.regular;
  const isCouple = seatType === "couple";
  const isSweetbox = seatType === "sweetbox";
  const isSpecial = isCouple || isSweetbox;

  const w = isSpecial ? `${26 * scale}px` : `${20 * scale}px`;
  const h = `${18 * scale}px`;
  
  // Lấy tên ghế
  const seatId = seat.id || seat.SeatId || `${seat.row || seat.Row}${(seat.col !== undefined ? seat.col + 1 : seat.Number)}`;
  const isBooked = seat.booked || seat.Status === "Booked";

  const handleClick = (e) => {
    e.stopPropagation();
    if (isEditable && onEdit) {
      // Truyền đầy đủ thông tin ghế
      const seatData = {
        ...seat,
        SeatId: seat.SeatId,
        Row: seat.Row || ROW_LABELS[seat.row],
        Number: seat.Number || (seat.col !== undefined ? seat.col + 1 : 1),
        type: seatType,
        SeatType: seat.SeatType || seatType.charAt(0).toUpperCase() + seatType.slice(1),
        booked: isBooked,
        Status: isBooked ? "Booked" : "Available",
        row: seat.row !== undefined ? seat.row : ROW_LABELS.indexOf(seat.Row || 'A'),
        col: seat.col !== undefined ? seat.col : (seat.Number || 1) - 1,
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

  return (
    <Tooltip 
      label={`${seatId} · ${cfg.label}${isBooked ? " · Đã đặt" : " · Trống"}${isEditable ? " · Click để chỉnh sửa" : ""}`}
      placement="top" 
      hasArrow 
      fontSize="11px"
    >
      <Box position="relative" display="inline-block">
        <Box
          w={w} 
          h={h} 
          borderRadius={`${4 * scale}px`}
          cursor={isEditable ? "pointer" : "default"}
          border={`${scale}px solid`}
          borderColor={isBooked ? cfg.bookedBg : cfg.border}
          bg={isBooked ? cfg.bookedBg : cfg.bg}
          position="relative" 
          flexShrink="0"
          transition="all 0.15s"
          _hover={isEditable ? { 
            transform: "scale(1.15)", 
            zIndex: 10, 
            boxShadow: `0 3px 12px ${cfg.color}88`,
            border: `2px solid #f97316`
          } : { transform: "scale(1.15)", zIndex: 10, boxShadow: `0 3px 8px ${cfg.color}55` }}
          sx={{ animation: `${popIn} 0.2s ease both` }}
          onClick={handleClick}
        >
          {/* Phần đầu ghế */}
          <Box
            position="absolute" 
            top={`${-3 * scale}px`} 
            left="50%" 
            transform="translateX(-50%)"
            w={`${6 * scale}px`} 
            h={`${3 * scale}px`} 
            borderRadius={`${2 * scale}px`}
            bg={isBooked ? cfg.bookedBg : cfg.border}
          />
          
          {/* Icon đặc biệt */}
          {seatType === "accessible" && (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Icon as={MdAccessible} boxSize={`${9 * scale}px`} color={isBooked ? cfg.bookedColor : cfg.color} />
            </Flex>
          )}
          {seatType === "vip" && !isBooked && (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Icon as={MdStar} boxSize={`${8 * scale}px`} color={cfg.color} />
            </Flex>
          )}
          
          {/* Badge chỉnh sửa */}
          {isEditable && (
            <Box position="absolute" top="-4px" right="-4px" zIndex="5">
              <Box 
                w="12px" 
                h="12px" 
                borderRadius="full" 
                bg="#f97316" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="0 2px 6px rgba(249,115,22,0.4)"
              >
                <Icon as={MdEdit} boxSize="6px" color="white" />
              </Box>
            </Box>
          )}
        </Box>
        
        {/* Nút xóa */}
        {isEditable && onDelete && (
          <Box
            position="absolute" 
            top="-6px" 
            left="-6px" 
            zIndex="5"
            w="14px" 
            h="14px" 
            borderRadius="full" 
            bg="#dc2626"
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            boxShadow="0 2px 6px rgba(220,38,38,0.4)"
            cursor="pointer"
            onClick={handleDelete}
            _hover={{ transform: "scale(1.2)", bg: "#991b1b" }}
            transition="all 0.15s"
          >
            <Icon as={MdClose} boxSize="8px" color="white" />
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}