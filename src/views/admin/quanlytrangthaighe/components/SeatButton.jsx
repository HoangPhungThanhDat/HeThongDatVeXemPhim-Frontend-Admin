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
import { SEAT_STATUS, ORANGE } from "../constants";
import { pulseDot, pulseWarn } from "./shared/animations";

const SeatButton = ({ seat, isSelected, onClick, onStatusChange, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const cfg = SEAT_STATUS[seat.status];

  const getBgColor = () => {
    if (isSelected) return ORANGE.ORGRAD;
    return cfg.bg;
  };

  const getBorderColor = () => {
    if (isSelected) return ORANGE.OR;
    return cfg.border;
  };

  const getTextColor = () => {
    if (isSelected) return "white";
    return cfg.color;
  };

  // Các trạng thái có thể chọn
  const statusOptions = [
    { key: 'trong', label: 'Trống', icon: MdCheckCircle, color: '#059669' },
    { key: 'dat', label: 'Đã đặt', icon: FaTicketAlt, color: '#dc2626' },
    { key: 'giu', label: 'Đang giữ', icon: FaUserClock, color: ORANGE.OR },
    { key: 'loi', label: 'Lỗi / Kẹt', icon: MdError, color: '#7c3aed' },
    { key: 'baoTri', label: 'Bảo trì', icon: MdBuild, color: '#6b7280' },
  ];

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(seat.id, newStatus);
    }
    // Đóng menu sau khi chọn
    setIsHovered(false);
  };

  // Cập nhật vị trí menu khi hover
  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isTopRow = seat.row === 'A' || seat.row === 'B';
      
      // Kiểm tra xem menu có bị tràn ra ngoài màn hình không
      let top = isTopRow ? rect.bottom + 8 : rect.top - 8;
      let transform = 'translateX(-50%)';
      
      // Nếu menu ở dưới mà bị tràn xuống dưới, chuyển lên trên
      if (isTopRow && top + 40 > window.innerHeight) {
        top = rect.top - 8;
        transform = 'translateX(-50%) translateY(-100%)';
      }
      // Nếu menu ở trên mà bị tràn lên trên, chuyển xuống dưới
      else if (!isTopRow && top < 0) {
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

  // Xử lý hover vào ghế
  const handleMouseEnter = () => {
    // Clear timeout nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  // Xử lý rời khỏi ghế hoặc menu
  const handleMouseLeave = () => {
    // Delay để cho phép di chuyển từ ghế sang menu
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  // Xử lý hover vào menu
  const handleMenuEnter = () => {
    // Clear timeout khi hover vào menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

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
            <Text fontWeight="700">{seat.id}</Text>
            <Text fontSize="11px" color="gray.300">{cfg.label}</Text>
            {seat.customer && <Text fontSize="10px" color="gray.400">{seat.customer}</Text>}
            {seat.ticketCode && <Text fontSize="10px" color="gray.400">Mã: {seat.ticketCode}</Text>}
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
            seat.status === "loi"
              ? { animation: `${pulseWarn} 1.8s infinite` }
              : seat.status === "giu"
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
          onClick={() => onClick(seat.id)}
        >
          {seat.num}
          {seat.status === "giu" && (
            <Box
              position="absolute"
              top="-4px"
              right="-4px"
              w="14px"
              h="14px"
              borderRadius="full"
              bg={ORANGE.OR}
              border="2px solid white"
              boxShadow="0 2px 8px rgba(234,88,12,0.4)"
            />
          )}
          {seat.status === "dat" && (
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
        </Button>
      </Tooltip>

      {/* Menu đổi trạng thái sử dụng Portal */}
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
              pointerEvents: 'auto', // Đảm bảo menu có thể click
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
                bg={seat.status === opt.key ? `${opt.color}20` : "transparent"}
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