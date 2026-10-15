// src/views/admin/quanlyghe/components/AddRowModal.jsx

import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  FormControl, FormLabel, VStack, Box, Flex, Text, Button, Icon,
  Select, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, useToast
} from "@chakra-ui/react";
import { MdAdd, MdWarning } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";

export default function AddRowModal({ isOpen, onClose, onAdd, roomName, currentRows, maxRows = 26 }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const toast = useToast();
  
  const [rowCount, setRowCount] = useState(1);
  const [position, setPosition] = useState("end");
  const [isLoading, setIsLoading] = useState(false);

  const remainingRows = Math.max(0, maxRows - currentRows);

  const handleAdd = async () => {
    if (rowCount < 1) {
      toast({
        title: "Số hàng không hợp lệ",
        description: "Vui lòng chọn ít nhất 1 hàng",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (rowCount > remainingRows) {
      toast({
        title: "Không đủ hàng để thêm",
        description: `Chỉ còn ${remainingRows} hàng trống (tối đa ${maxRows} hàng)`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(rowCount, position);
      toast({
        title: "✅ Thêm hàng thành công",
        description: `Đã thêm ${rowCount} hàng ${position === 'start' ? 'đầu' : 'cuối'}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      console.error("❌ Lỗi thêm hàng:", error);
      toast({
        title: "❌ Lỗi thêm hàng",
        description: error.response?.data?.message || "Vui lòng thử lại",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state khi modal đóng
  const handleClose = () => {
    if (!isLoading) {
      setRowCount(1);
      setPosition("end");
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="md" 
      closeOnOverlayClick={!isLoading}
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
              <Icon as={MdAdd} boxSize="16px" color="white" />
            </Box>
            <Text>Thêm hàng ghế mới</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton 
          color={colors.subColor} 
          isDisabled={isLoading}
          mt="8px"
          mr="8px"
        />
        <ModalBody pb="24px" pt="20px">
          <VStack spacing="16px" align="stretch">
            {/* Thông tin phòng */}
            <Box 
              p="12px 14px" 
              borderRadius="10px" 
              bg={isDark ? "#2d3748" : "#f8fafc"}
              border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            >
              <Flex justify="space-between">
                <Text fontSize="12px" color={colors.subColor}>Phòng:</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textColor}>{roomName || "N/A"}</Text>
              </Flex>
              <Flex justify="space-between" mt="4px">
                <Text fontSize="12px" color={colors.subColor}>Hiện tại:</Text>
                <Text fontSize="12px" fontWeight="700" color={colors.textColor}>{currentRows || 0} hàng</Text>
              </Flex>
              <Flex justify="space-between" mt="4px">
                <Text fontSize="12px" color={colors.subColor}>Còn trống:</Text>
                <Text fontSize="12px" fontWeight="700" color={remainingRows > 0 ? "#10b981" : "#ef4444"}>
                  {remainingRows} hàng
                </Text>
              </Flex>
            </Box>

            {/* Số hàng cần thêm */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color={colors.subColor}>
                Số hàng cần thêm
              </FormLabel>
              <NumberInput
                min={1}
                max={Math.min(10, remainingRows)}
                value={rowCount}
                onChange={(_, val) => setRowCount(val || 1)}
                isDisabled={isLoading || remainingRows === 0}
              >
                <NumberInputField 
                  bg={colors.bgInput}
                  border={`1px solid ${colors.borderInput}`}
                  borderRadius="10px"
                  color={colors.textColor}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* Vị trí thêm */}
            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color={colors.subColor}>
                Vị trí thêm
              </FormLabel>
              <Select
                bg={colors.bgInput}
                border={`1px solid ${colors.borderInput}`}
                borderRadius="10px"
                color={colors.textColor}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                isDisabled={isLoading || remainingRows === 0}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                _hover={{ border: "1.5px solid #f97316" }}
              >
                <option value="end">Cuối danh sách (sau hàng cuối)</option>
                <option value="start">Đầu danh sách (trước hàng đầu)</option>
              </Select>
            </FormControl>

            {/* Cảnh báo */}
            {remainingRows === 0 && (
              <Box 
                p="12px 14px" 
                borderRadius="10px" 
                bg="#fef2f2" 
                border="1px solid #fca5a5"
              >
                <Flex align="center" gap="8px">
                  <Icon as={MdWarning} boxSize="16px" color="#dc2626" />
                  <Text fontSize="11px" color="#dc2626" fontWeight="500">
                    Đã đạt giới hạn {maxRows} hàng (A-Z)
                  </Text>
                </Flex>
              </Box>
            )}
          </VStack>

          {/* Buttons */}
          <Flex gap="10px" mt="24px" justify="flex-end">
            <Button
              h="42px"
              px="22px"
              variant="ghost"
              color={colors.subColor}
              borderRadius="10px"
              fontWeight="600"
              fontSize="13px"
              border={`1.5px solid ${colors.borderCard}`}
              _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
              onClick={handleClose}
              isDisabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              h="42px"
              px="28px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
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
              onClick={handleAdd}
              isLoading={isLoading}
              loadingText="Đang thêm..."
              isDisabled={rowCount < 1 || remainingRows === 0 || isLoading}
            >
              Thêm hàng
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}