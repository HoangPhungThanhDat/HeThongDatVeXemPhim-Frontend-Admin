// components/AddColumnModal.jsx
import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  FormControl, FormLabel, VStack, Box, Flex, Text, Button, Icon,
  Select, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";

export default function AddColumnModal({ isOpen, onClose, onAdd, roomName, currentCols }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const [colCount, setColCount] = useState(1);
  const [position, setPosition] = useState("end");

  const handleAdd = () => {
    if (colCount < 1) return;
    onAdd(colCount, position);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={colors.bgCard} borderRadius="20px" border={`1px solid ${colors.borderCard}`}>
        <ModalHeader color={colors.textColor} fontWeight="800" fontSize="18px">
          <Flex align="center" gap="10px">
            <Icon as={MdAdd} boxSize="22px" color="#f97316" />
            Thêm cột ghế mới
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={colors.subColor} />
        <ModalBody pb="24px">
          <VStack spacing="16px" align="stretch">
            <Box p="12px 14px" borderRadius="10px" bg={isDark ? "#2d3748" : "#f8fafc"}>
              <Text fontSize="12px" color={colors.subColor}>
                Phòng: <strong color={colors.textColor}>{roomName}</strong>
              </Text>
              <Text fontSize="12px" color={colors.subColor} mt="4px">
                Hiện tại: <strong color={colors.textColor}>{currentCols} cột</strong>
              </Text>
            </Box>

            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color={colors.subColor}>
                Số cột cần thêm
              </FormLabel>
              <NumberInput
                min={1}
                max={10}
                value={colCount}
                onChange={(_, val) => setColCount(val || 1)}
              >
                <NumberInputField 
                  bg={colors.bgInput}
                  border={`1px solid ${colors.borderInput}`}
                  borderRadius="10px"
                  color={colors.textColor}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

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
              >
                <option value="end">Bên phải (sau cột cuối)</option>
                <option value="start">Bên trái (trước cột đầu)</option>
              </Select>
            </FormControl>
          </VStack>

          <Flex gap="10px" mt="20px" justify="flex-end">
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
              onClick={onClose}
            >
              Hủy bỏ
            </Button>
            <Button
              h="42px"
              px="28px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
              color="white"
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              onClick={handleAdd}
            >
              Thêm cột
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}