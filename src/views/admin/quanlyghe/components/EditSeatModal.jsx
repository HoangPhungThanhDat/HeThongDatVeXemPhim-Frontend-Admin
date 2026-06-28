// components/EditSeatModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  FormControl, FormLabel, Select, VStack, Box, Flex, Text, Button, Icon,
  useToast
} from "@chakra-ui/react";
import { MdEdit, MdWarning } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";
import { SEAT_TYPES, ROW_LABELS } from "../constants";

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
  const [status, setStatus] = useState("Available"); // Chỉ có "Available" hoặc "Booked"
  const [isLoading, setIsLoading] = useState(false);

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
      });
      return;
    }

    setIsLoading(true);
    try {
      // CHỈ CHO PHÉP 2 GIÁ TRỊ: "Available" HOẶC "Booked"
      const seatTypeValue = type; // "Normal", "VIP", "Couple"
      const statusValue = status; // "Available" hoặc "Booked"
      
      // ĐẢM BẢO STATUS CHỈ LÀ "Available" HOẶC "Booked"
      let finalStatus = "Available";
      if (statusValue === "Booked") {
        finalStatus = "Booked";
      } else {
        finalStatus = "Available";
      }

      const updatedSeat = {
        ...seat,
        SeatType: seatTypeValue,
        Status: finalStatus,
        type: type.toLowerCase(),
        booked: finalStatus === "Booked"
      };
      
      console.log("📤 Saving seat - SeatType:", seatTypeValue);
      console.log("📤 Saving seat - Status:", finalStatus);
      console.log("📤 Full payload:", updatedSeat);
      
      await onSave(updatedSeat);
      
      toast({
        title: "✅ Cập nhật ghế thành công!",
        description: `Loại: ${seatTypeValue} | Trạng thái: ${finalStatus === "Booked" ? "Đã đặt" : "Còn trống"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi lưu ghế:", error);
      console.error("❌ Chi tiết lỗi:", error.response?.data);
      
      let errorMessage = "Vui lòng thử lại";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  if (!seat) return null;

  const seatId = seat.id || seat.SeatId || "N/A";
  const rowLabel = seat.row !== undefined ? ROW_LABELS[seat.row] : (seat.Row || "N/A");
  const seatNumber = seat.col !== undefined ? seat.col + 1 : (seat.Number || "N/A");

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md" 
      closeOnOverlayClick={!isLoading && !parentLoading}
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
          isDisabled={isLoading || parentLoading} 
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
                isDisabled={isLoading || parentLoading}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s"
                size="lg"
              >
                <option value="Normal">Ghế thường (Normal)</option>
                <option value="VIP">Ghế VIP</option>
                <option value="Couple">Ghế đôi (Couple)</option>
              </Select>
            </FormControl>

            {/* Trạng thái - CHỈ 2 LỰA CHỌN */}
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
                isDisabled={isLoading || parentLoading}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s"
                size="lg"
              >
                <option value="Available">🟢 Còn trống</option>
                <option value="Booked">🔴 Đã đặt</option>
              </Select>
            </FormControl>

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
              isDisabled={isLoading || parentLoading}
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
              isLoading={isLoading || parentLoading}
              loadingText="Đang lưu..."
            >
              💾 Lưu thay đổi
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}