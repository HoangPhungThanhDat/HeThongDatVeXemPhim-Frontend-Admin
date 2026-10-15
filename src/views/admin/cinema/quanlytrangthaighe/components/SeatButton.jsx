// src/views/admin/quanlytrangthaighe/components/SeatButton.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Tooltip,
  Icon,
  Portal,
} from "@chakra-ui/react";
import { MdCheckCircle, MdError, MdBuild } from "react-icons/md";
import { FaTicketAlt, FaUserClock } from "react-icons/fa";
import { SEAT_STATUS, SEAT_STATUS_DEFAULT, SEAT_TYPE_COLORS, ORANGE } from "../constants";
import { pulseDot, pulseWarn } from "./shared/animations";

const SeatButton = ({ seat, isSelected, onClick, onStatusChange, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // ✅ Lấy status an toàn
  const statusKey = seat?.status || 'trong';
  const cfg = SEAT_STATUS[statusKey] || SEAT_STATUS_DEFAULT;

  // ✅ Lấy loại ghế và màu sắc tương ứng
  const seatType = seat?.seat_type?.toLowerCase() || 'normal';
  const typeColors = SEAT_TYPE_COLORS[seatType] || SEAT_TYPE_COLORS.normal;

  if (!seat) return null;

  // ✅ Xác định màu sắc dựa trên trạng thái và loại ghế
  const getBgColor = () => {
    if (isSelected) return ORANGE.ORGRAD;
    
    // Nếu ghế đã đặt -> màu đỏ
    if (statusKey === 'dat') return '#dc2626';
    // Nếu ghế đang giữ -> màu vàng
    if (statusKey === 'giu') return '#f59e0b';
    // Nếu ghế lỗi -> màu tím
    if (statusKey === 'loi') return '#7c3aed';
    // Nếu ghế bảo trì -> màu xám
    if (statusKey === 'baoTri') return '#9ca3af';
    
    // Mặc định: dùng màu theo loại ghế
    return typeColors.bg;
  };

  const getBorderColor = () => {
    if (isSelected) return ORANGE.OR;
    if (statusKey === 'dat') return '#dc2626';
    if (statusKey === 'giu') return '#f59e0b';
    if (statusKey === 'loi') return '#7c3aed';
    if (statusKey === 'baoTri') return '#9ca3af';
    return typeColors.border;
  };

  const getTextColor = () => {
    if (isSelected) return "white";
    if (statusKey === 'dat' || statusKey === 'giu' || statusKey === 'loi' || statusKey === 'baoTri') return "white";
    return typeColors.color;
  };

  // Các trạng thái có thể chọn
  const statusOptions = [
    { key: 'trong', label: 'Trống', icon: MdCheckCircle, color: '#059669' },
    { key: 'dat', label: 'Đã đặt', icon: FaTicketAlt, color: '#dc2626' },
    { key: 'giu', label: 'Đang giữ', icon: FaUserClock, color: '#f59e0b' },
    { key: 'loi', label: 'Lỗi / Kẹt', icon: MdError, color: '#7c3aed' },
    { key: 'baoTri', label: 'Bảo trì', icon: MdBuild, color: '#9ca3af' },
  ];

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(seat.id, newStatus);
    }
    setIsHovered(false);
  };

  // Cập nhật vị trí menu khi hover
  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isTopRow = seat.row === 'A' || seat.row === 'B';
      
      let top = isTopRow ? rect.bottom + 8 : rect.top - 8;
      let transform = 'translateX(-50%)';
      
      if (isTopRow && top + 40 > window.innerHeight) {
        top = rect.top - 8;
        transform = 'translateX(-50%) translateY(-100%)';
      } else if (!isTopRow && top < 0) {
        top = rect.bottom + 8;
        transform = 'translateX(-50%)';
      }
      
      setMenuPosition({
        top: top,
        left: rect.left + rect.width / 2,
        transform: transform,
      });
    }
  }, [isHovered, seat.row]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const seatLabel = seat.row && seat.num ? `${seat.row}${seat.num}` : '?';

  // ✅ Kiểm tra có icon đặc biệt cho loại ghế không
  const hasTypeIcon = typeColors.icon && statusKey !== 'dat' && statusKey !== 'loi' && statusKey !== 'baoTri';

  return (
    <Box
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonRef}
    >
      <Tooltip
        label={
          <Box p="4px">
            <Text fontWeight="700">{seatLabel}</Text>
            <Text fontSize="11px" color="gray.300">{cfg.label}</Text>
            <Text fontSize="10px" color="gray.400">Loại: {typeColors.label}</Text>
            {seat.customer_name && <Text fontSize="10px" color="gray.400">{seat.customer_name}</Text>}
            {seat.ticket_code && <Text fontSize="10px" color="gray.400">Mã: {seat.ticket_code}</Text>}
            <Text fontSize="10px" color="gray.400" mt="4px">Hover để đổi trạng thái</Text>
          </Box>
        }
        hasArrow
        placement="top"
        bg={theme.isDark ? "#2d3748" : "gray.700"}
        color="white"
        openDelay={300}
        closeDelay={0}
      >
        <Button
          h={{ base: "36px", md: "42px" }}
          w={{ base: "36px", md: "42px" }}
          minW={{ base: "36px", md: "42px" }}
          p="0"
          borderRadius="10px"
          fontSize={{ base: "10px", md: "11px" }}
          fontWeight="700"
          position="relative"
          bg={getBgColor()}
          color={getTextColor()}
          border={`2px solid ${getBorderColor()}`}
          boxShadow={isSelected ? `0 4px 16px ${ORANGE.ORSW}` : "none"}
          sx={
            statusKey === "loi"
              ? { animation: `${pulseWarn} 1.8s infinite` }
              : statusKey === "giu"
                ? { animation: `${pulseDot} 2s infinite` }
                : undefined
          }
          _hover={{
            transform: "scale(1.1)",
            boxShadow: `0 4px 16px ${ORANGE.ORSW}`,
            zIndex: 2,
            borderColor: ORANGE.OR,
          }}
          _active={{ transform: "scale(0.92)" }}
          transition="all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          onClick={() => onClick && onClick(seat.id)}
        >
          {seat.num || '?'}
          
          {/* ✅ Hiển thị icon đặc biệt cho loại ghế */}
          {hasTypeIcon && (
            <Box
              position="absolute"
              top="-6px"
              right="-6px"
              fontSize="10px"
              zIndex="2"
              lineHeight="1"
            >
              {typeColors.icon}
            </Box>
          )}
          
          {/* Badge trạng thái */}
          {statusKey === "giu" && (
            <Box
              position="absolute"
              top="-4px"
              right="-4px"
              w="14px"
              h="14px"
              borderRadius="full"
              bg="#f59e0b"
              border="2px solid white"
              boxShadow="0 2px 8px rgba(245,158,11,0.4)"
            />
          )}
          {statusKey === "dat" && (
            <Box
              position="absolute"
              top="-4px"
              right="-4px"
              w="14px"
              h="14px"
              borderRadius="full"
              bg="#dc2626"
              border="2px solid white"
              boxShadow="0 2px 8px rgba(220,38,38,0.4)"
            />
          )}
          {statusKey === "loi" && (
            <Box
              position="absolute"
              top="-4px"
              right="-4px"
              w="14px"
              h="14px"
              borderRadius="full"
              bg="#7c3aed"
              border="2px solid white"
              boxShadow="0 2px 8px rgba(124,58,237,0.4)"
            />
          )}
        </Button>
      </Tooltip>

      {/* Menu đổi trạng thái */}
      {isHovered && (
        <Portal>
          <Box
            ref={menuRef}
            position="fixed"
            zIndex="9999"
            bg={theme.bgCard}
            borderRadius="8px"
            boxShadow="0 4px 20px rgba(0,0,0,0.25)"
            border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"}
            p="4px"
            display="flex"
            gap="2px"
            whiteSpace="nowrap"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              transform: menuPosition.transform || 'translateX(-50%)',
              pointerEvents: 'auto',
            }}
          >
            {statusOptions.map((opt) => (
              <Box
                key={opt.key}
                as="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(opt.key);
                }}
                p="4px 8px"
                borderRadius="4px"
                fontSize="10px"
                fontWeight="600"
                color={opt.color}
                bg={statusKey === opt.key ? `${opt.color}20` : "transparent"}
                _hover={{
                  bg: `${opt.color}20`,
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
                display="flex"
                alignItems="center"
                gap="4px"
                cursor="pointer"
                minH="24px"
              >
                <Icon as={opt.icon} boxSize="10px" />
                {opt.label}
              </Box>
            ))}
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default SeatButton;