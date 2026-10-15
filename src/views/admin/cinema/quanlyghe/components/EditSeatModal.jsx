// src/views/admin/quanlyghe/components/EditSeatModal.jsx

import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  FormControl, FormLabel, Select, VStack, Box, Flex, Text, Button, Icon,
  useToast
} from "@chakra-ui/react";
import { MdEdit, MdWarning, MdEventSeat } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";
import { ROW_LABELS } from "../constants";

// ✅ Hàm lấy màu cho từng loại ghế
const getSeatColor = (type) => {
  const colors = {
    'Normal': '#d1fae5',
    'VIP': '#f5f3ff',
    'Couple': '#fef3c7',  // ✅ Vàng cho ghế đôi
    'Sweetbox': '#fdf2f8',
    'Accessible': '#f0f9ff',
  };
  return colors[type] || '#d1fae5';
};

const getSeatBorder = (type) => {
  const borders = {
    'Normal': '#6ee7b7',
    'VIP': '#a78bfa',
    'Couple': '#fcd34d',  // ✅ Viền vàng cho ghế đôi
    'Sweetbox': '#f9a8d4',
    'Accessible': '#7dd3fc',
  };
  return borders[type] || '#6ee7b7';
};

const getSeatTextColor = (type) => {
  const colors = {
    'Normal': '#065f46',
    'VIP': '#5b21b6',
    'Couple': '#92400e',  // ✅ Màu chữ vàng đậm
    'Sweetbox': '#9d174d',
    'Accessible': '#1e40af',
  };
  return colors[type] || '#374151';
};

// ✅ Hàm lấy icon cho từng loại ghế
const getSeatIcon = (type) => {
  const icons = {
    'Normal': 'A',
    'VIP': '⭐',
    'Couple': '💑',
    'Sweetbox': '💝',
    'Accessible': '♿',
  };
  return icons[type] || 'A';
};

export default function EditSeatModal({ 
  isOpen, 
  onClose, 
  seat, 
  onSave, 
  roomName,
  isLoading: parentLoading = false 
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const toast = useToast();
  
  const [type, setType] = useState("Normal");
  const [status, setStatus] = useState("Available");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state khi modal mở
  useEffect(() => {
    if (seat && isOpen) {
      console.log("📝 EditSeatModal - seat data:", seat);
      
      // Map SeatType
      let mappedType = "Normal";
      if (seat.SeatType) {
        mappedType = seat.SeatType;
      } else if (seat.type) {
        const typeLower = seat.type.toLowerCase();
        if (typeLower === 'vip') mappedType = "VIP";
        else if (typeLower === 'couple') mappedType = "Couple";
        else if (typeLower === 'sweetbox') mappedType = "Sweetbox";
        else if (typeLower === 'accessible') mappedType = "Accessible";
        else mappedType = "Normal";
      }
      setType(mappedType);
      
      // Map Status - CHỈ CHO PHÉP "Available" HOẶC "Booked"
      let currentStatus = "Available";
      if (seat.Status) {
        const statusLower = seat.Status.toLowerCase();
        if (statusLower === 'booked') {
          currentStatus = "Booked";
        } else {
          currentStatus = "Available";
        }
      } else if (seat.booked === true) {
        currentStatus = "Booked";
      } else {
        currentStatus = "Available";
      }
      setStatus(currentStatus);
    }
  }, [seat, isOpen]);

  // Reset loading khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!seat) {
      toast({
        title: "Không có ghế để sửa",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (typeof onSave !== 'function') {
      console.error("❌ onSave is not a function");
      toast({
        title: "Lỗi hệ thống",
        description: "Không thể lưu thay đổi",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
      const finalStatus = status === "Booked" ? "Booked" : "Available";
      
      const updatedSeat = {
        ...seat,
        SeatType: type,
        Status: finalStatus,
        seat_type: type,
        status: finalStatus,
        type: type.toLowerCase(),
        booked: finalStatus === "Booked"
      };
      
      console.log("📤 Saving seat - Payload:", {
        SeatId: seat.SeatId || seat.id,
        SeatType: type,
        Status: finalStatus,
        full: updatedSeat
      });
      
      const result = await onSave(updatedSeat);
      console.log("✅ Save result:", result);
      
      toast({
        title: "✅ Cập nhật ghế thành công!",
        description: `Loại: ${type} | Trạng thái: ${finalStatus === "Booked" ? "Đã đặt" : "Còn trống"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi lưu ghế:", error);
      
      let errorMessage = "Vui lòng thử lại";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorValues = Object.values(errors).flat();
        errorMessage = errorValues.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Lỗi cập nhật ghế",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!seat) {
    return null;
  }

  const seatId = seat.SeatId || seat.id || "N/A";
  const rowLabel = seat.row !== undefined ? ROW_LABELS[seat.row] : (seat.Row || "N/A");
  const seatNumber = seat.col !== undefined ? seat.col + 1 : (seat.Number || "N/A");

  const seatTypes = [
    { value: "Normal", label: "Ghế thường (Normal)", color: "#10b981" },
    { value: "VIP", label: "Ghế VIP", color: "#8b5cf6" },
    { value: "Couple", label: "Ghế đôi (Couple)", color: "#f59e0b" },
    { value: "Sweetbox", label: "Sweetbox", color: "#ec4899" },
    { value: "Accessible", label: "Ghế ưu tiên", color: "#3b82f6" },
  ];

  const isLoadingState = isLoading || parentLoading;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md" 
      closeOnOverlayClick={!isLoadingState}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent 
        bg={colors.bgCard} 
        borderRadius="20px" 
        border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.15)"}
      >
        <ModalHeader color={colors.textColor} fontWeight="800" fontSize="18px" borderBottom={`1px solid ${colors.borderCard}`}>
          <Flex align="center" gap="10px">
            <Box 
              w="32px" 
              h="32px" 
              borderRadius="10px" 
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <Icon as={MdEdit} boxSize="16px" color="white" />
            </Box>
            <Text>Chỉnh sửa ghế</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton 
          color={colors.subColor} 
          isDisabled={isLoadingState} 
          mt="8px"
          mr="8px"
        />
        <ModalBody pb="24px" pt="20px">
          <VStack spacing="16px" align="stretch">
            {/* Thông tin ghế */}
            <Box 
              p="14px 16px" 
              borderRadius="12px" 
              bg={isDark ? "#2d3748" : "#f8fafc"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            >
              <Flex direction="column" gap="6px">
                <Flex justify="space-between">
                  <Text fontSize="12px" color={colors.subColor}>Phòng:</Text>
                  <Text fontSize="12px" fontWeight="700" color={colors.textColor}>{roomName || "N/A"}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="12px" color={colors.subColor}>Ghế:</Text>
                  <Text fontSize="12px" fontWeight="700" color={colors.textColor}>{seatId}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="12px" color={colors.subColor}>Vị trí:</Text>
                  <Text fontSize="12px" fontWeight="700" color={colors.textColor}>Hàng {rowLabel} - Số {seatNumber}</Text>
                </Flex>
              </Flex>
            </Box>

            {/* Loại ghế */}
            <FormControl>
              <FormLabel fontSize="13px" fontWeight="700" color={colors.subColor} display="flex" alignItems="center" gap="8px">
                <Icon as={MdEdit} boxSize="14px" color="#f97316" />
                Loại ghế
              </FormLabel>
              <Select
                bg={colors.bgInput}
                border={`1.5px solid ${colors.borderInput}`}
                borderRadius="10px"
                color={colors.textColor}
                value={type}
                onChange={(e) => setType(e.target.value)}
                isDisabled={isLoadingState}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s"
                size="lg"
              >
                {seatTypes.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Trạng thái */}
            <FormControl>
              <FormLabel fontSize="13px" fontWeight="700" color={colors.subColor} display="flex" alignItems="center" gap="8px">
                <Icon as={MdEdit} boxSize="14px" color="#f97316" />
                Trạng thái
              </FormLabel>
              <Select
                bg={colors.bgInput}
                border={`1.5px solid ${colors.borderInput}`}
                borderRadius="10px"
                color={colors.textColor}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                isDisabled={isLoadingState}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s"
                size="lg"
              >
                <option value="Available">🟢 Còn trống</option>
                <option value="Booked">🔴 Đã đặt</option>
              </Select>
            </FormControl>

            {/* ✅ Preview - SỬA MÀU CHO COUPLE */}
            <Box 
              p="12px 14px" 
              borderRadius="10px" 
              bg={isDark ? "#1a2744" : "#f0fdf4"}
              border={`1px solid ${isDark ? "#1a3a5c" : "#86efac"}`}
            >
              <Flex align="center" gap="12px">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="8px"
                  bg={getSeatColor(type)}
                  border={`2px solid ${getSeatBorder(type)}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="16px"
                  fontWeight="700"
                  color={getSeatTextColor(type)}
                >
                  {getSeatIcon(type)}
                </Box>
                <Box>
                  <Text fontSize="14px" fontWeight="700" color={colors.textColor}>
                    {seatTypes.find(t => t.value === type)?.label || "Ghế thường"}
                  </Text>
                  <Text fontSize="12px" color={status === "Booked" ? "#dc2626" : "#059669"}>
                    {status === "Booked" ? "🔴 Đã đặt" : "🟢 Còn trống"}
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Cảnh báo */}
            <Box 
              p="12px 14px" 
              borderRadius="10px" 
              bg="#fef2f2" 
              border="1px solid #fca5a5"
            >
              <Flex align="center" gap="8px">
                <Icon as={MdWarning} boxSize="16px" color="#dc2626" />
                <Text fontSize="11px" color="#dc2626" fontWeight="500">
                  Thay đổi này sẽ ảnh hưởng đến sơ đồ ghế của phòng
                </Text>
              </Flex>
            </Box>
          </VStack>

          {/* Buttons */}
          <Flex gap="10px" mt="24px" justify="flex-end">
            <Button
              h="44px"
              px="24px"
              variant="ghost"
              color={colors.subColor}
              borderRadius="10px"
              fontWeight="600"
              fontSize="14px"
              border={`1.5px solid ${colors.borderCard}`}
              _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
              onClick={onClose}
              isDisabled={isLoadingState}
            >
              Hủy bỏ
            </Button>
            <Button
              h="44px"
              px="32px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="14px"
              bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
              color="white"
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              _hover={{ 
                boxShadow: "0 8px 24px rgba(249,115,22,0.45)", 
                transform: "translateY(-2px)",
                bg: "linear-gradient(135deg, #ea580c 0%, #f97316 60%, #fb923c 100%)"
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              onClick={handleSave}
              isLoading={isLoadingState}
              loadingText="Đang lưu..."
              isDisabled={!seat}
            >
              💾 Lưu thay đổi
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}