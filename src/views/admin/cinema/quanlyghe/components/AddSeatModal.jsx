// src/views/admin/quanlyghe/components/AddSeatModal.jsx

import React, { useState, useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  FormControl, FormLabel, Box, Flex, Text, Button, Icon,
  Select, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, useToast,
  SimpleGrid, Badge, Divider, Tooltip, VStack, Grid,
} from "@chakra-ui/react";
import {
  MdAdd, MdWarning, MdCheckCircle, MdGridView,
  MdViewColumn, MdViewStream, MdInfo, MdClose,
} from "react-icons/md";
import { FaChair } from "react-icons/fa";
import { getSeatColors } from "./shared/StatCard";

export default function AddSeatModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  roomName, 
  currentRows = 0, 
  currentCols = 0,
  maxRows = 26,
  maxCols = 20,
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const toast = useToast();

  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [position, setPosition] = useState("end");
  const [isLoading, setIsLoading] = useState(false);

  const remainingRows = Math.max(0, maxRows - currentRows);
  const remainingCols = Math.max(0, maxCols - currentCols);

  const previewData = useMemo(() => {
    const previewRows = Math.min(Math.max(0, rowCount), remainingRows);
    const previewCols = Math.min(Math.max(0, colCount), remainingCols);
    
    const displayRows = previewRows > 0 ? previewRows : (currentRows > 0 ? Math.min(currentRows, 3) : 0);
    const displayCols = previewCols > 0 ? previewCols : (currentCols > 0 ? Math.min(currentCols, 10) : 0);
    
    return { rows: displayRows, cols: displayCols, previewRows, previewCols };
  }, [rowCount, colCount, remainingRows, remainingCols, currentRows, currentCols]);

  const isAddRowOnly = rowCount > 0 && colCount === 0;
  const isAddColOnly = rowCount === 0 && colCount > 0;
  const isAddBoth = rowCount > 0 && colCount > 0;
  const totalSeats = rowCount * colCount;

  const canSubmit = (rowCount > 0 || colCount > 0) && !isLoading;
  const hasError = (rowCount > remainingRows) || (colCount > remainingCols);

  const handleAdd = async () => {
    if (rowCount === 0 && colCount === 0) {
      toast({ title: "Vui lòng chọn số hàng hoặc số cột", status: "warning", duration: 3000, isClosable: true, position: "top-right" });
      return;
    }

    if (rowCount > remainingRows || colCount > remainingCols) {
      toast({ title: "Số lượng vượt quá giới hạn", status: "error", duration: 3000, isClosable: true, position: "top-right" });
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(rowCount, colCount, position);
      toast({
        title: "✅ Thêm ghế thành công",
        description: isAddBoth ? `Đã thêm ${rowCount} hàng × ${colCount} cột` : isAddRowOnly ? `Đã thêm ${rowCount} hàng` : `Đã thêm ${colCount} cột`,
        status: "success", duration: 3000, isClosable: true, position: "top-right",
      });
      onClose();
      setRowCount(0); setColCount(0); setPosition("end");
    } catch (error) {
      console.error("❌ Lỗi thêm ghế:", error);
      toast({
        title: "❌ Lỗi thêm ghế",
        description: error.response?.data?.message || "Vui lòng thử lại",
        status: "error", duration: 5000, isClosable: true, position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRowCount(0); setColCount(0); setPosition("end"); onClose();
    }
  };

  const QuickButton = ({ value, onClick, isActive, isDisabled }) => (
    <Button
      size="sm"
      h="32px"
      px="10px"
      borderRadius="8px"
      fontSize="11px"
      fontWeight="700"
      bg={isActive ? "linear-gradient(135deg, #f97316, #fb923c)" : (isDark ? "#1a2744" : "#f8fafc")}
      color={isActive ? "white" : (isDark ? "#88b4d8" : "#64748b")}
      border={isActive ? "none" : `1px solid ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
      _hover={!isActive && !isDisabled ? { bg: isDark ? "#142d4f" : "#fff7ed", color: "#f97316", borderColor: "#fed7aa" } : {}}
      onClick={onClick}
      isDisabled={isDisabled}
      transition="all 0.2s"
    >
      {value}
    </Button>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="5xl" closeOnOverlayClick={!isLoading} isCentered>
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.6)" />
      <ModalContent 
        bg={colors.bgCard} 
        borderRadius="24px" 
        border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 25px 80px rgba(0,0,0,0.6)" : "0 25px 80px rgba(0,0,0,0.2)"}
        overflow="hidden"
      >
        {/* Header */}
        <Box 
          px="24px" 
          py="16px" 
          bg={isDark ? "linear-gradient(135deg, #0f1f3a, #1a3a5c)" : "linear-gradient(135deg, #fff7ed, #ffedd5)"}
          borderBottom={`1px solid ${colors.borderCard}`}
          position="relative"
        >
          <Box 
            position="absolute" 
            top="-50%" 
            right="-10%" 
            w="200px" 
            h="200px" 
            borderRadius="full"
            bg={isDark ? "rgba(74, 158, 255, 0.08)" : "rgba(249, 115, 22, 0.08)"}
            filter="blur(40px)"
          />
          <Flex align="center" justify="space-between" position="relative">
            <Flex align="center" gap="14px">
              <Box 
                w="44px" 
                h="44px" 
                borderRadius="12px" 
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="0 8px 24px rgba(249, 115, 22, 0.35)"
              >
                <Icon as={MdAdd} boxSize="22px" color="white" />
              </Box>
              <Box>
                <Text fontSize="18px" fontWeight="800" color={colors.textColor} letterSpacing="-0.3px">
                  Thêm ghế mới
                </Text>
                <Text fontSize="12px" color={colors.subColor} mt="2px">
                  Tùy chỉnh số hàng và cột cho phòng chiếu
                </Text>
              </Box>
            </Flex>
            <Flex align="center" gap="8px">
              <Badge px="10px" py="4px" borderRadius="8px" fontSize="10px" fontWeight="700"
                bg={isDark ? "rgba(74, 158, 255, 0.15)" : "rgba(249, 115, 22, 0.15)"}
                color={isDark ? "#6ab0ff" : "#f97316"}>
                {roomName || "Phòng chiếu"}
              </Badge>
              <ModalCloseButton position="static" color={colors.subColor} isDisabled={isLoading} borderRadius="8px" />
            </Flex>
          </Flex>
        </Box>

        <ModalBody p="20px">
          {/* Info bar */}
          <Flex 
            p="10px 14px" 
            borderRadius="12px" 
            bg={isDark ? "rgba(74, 158, 255, 0.08)" : "rgba(249, 115, 22, 0.06)"}
            border={`1px solid ${isDark ? "rgba(74, 158, 255, 0.2)" : "rgba(249, 115, 22, 0.2)"}`}
            mb="16px"
            gap="20px"
            flexWrap="wrap"
          >
            <Flex align="center" gap="8px">
              <Box w="8px" h="8px" borderRadius="full" bg="#10b981" />
              <Text fontSize="12px" color={colors.subColor}>
                Hiện tại: <strong style={{ color: colors.textColor }}>{currentRows} hàng × {currentCols} cột</strong>
              </Text>
            </Flex>
            <Flex align="center" gap="8px">
              <Box w="8px" h="8px" borderRadius="full" bg="#f97316" />
              <Text fontSize="12px" color={colors.subColor}>
                Còn trống: <strong style={{ color: colors.textColor }}>{remainingRows} hàng · {remainingCols} cột</strong>
              </Text>
            </Flex>
          </Flex>

          {/* ✅ Layout ngang: Trái (Nhập liệu) - Phải (Preview) */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 340px" }} gap="20px">
            {/* Cột trái */}
            <VStack spacing="16px" align="stretch">
              <Grid templateColumns="1fr 1fr" gap="16px">
                {/* Số hàng */}
                <FormControl>
                  <Flex align="center" justify="space-between" mb="8px">
                    <FormLabel fontSize="12px" fontWeight="700" color={colors.textColor} mb="0">
                      <Icon as={MdViewStream} boxSize="14px" mr="6px" color="#f97316" />
                      Số hàng
                    </FormLabel>
                    <Text fontSize="10px" color={colors.subColor} fontWeight="600">
                      Tối đa {remainingRows}
                    </Text>
                  </Flex>
                  <NumberInput 
                    min={0} 
                    max={Math.min(10, remainingRows)} 
                    value={rowCount} 
                    onChange={(_, val) => setRowCount(val || 0)} 
                    isDisabled={isLoading || remainingRows === 0}
                  >
                    <NumberInputField 
                      bg={colors.bgInput} 
                      border={`1.5px solid ${colors.borderInput}`} 
                      borderRadius="10px" 
                      color={colors.textColor}
                      h="40px"
                      fontSize="14px"
                      fontWeight="700"
                      textAlign="center"
                      _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)" }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Flex gap="4px" mt="8px" flexWrap="wrap">
                    {[1, 2, 3, 5, 8, 10].map((v) => (
                      <QuickButton
                        key={v}
                        value={`+${v}`}
                        onClick={() => setRowCount(Math.min(v, remainingRows))}
                        isActive={rowCount === v}
                        isDisabled={isLoading || remainingRows === 0 || v > remainingRows}
                      />
                    ))}
                  </Flex>
                </FormControl>

                {/* Số cột */}
                <FormControl>
                  <Flex align="center" justify="space-between" mb="8px">
                    <FormLabel fontSize="12px" fontWeight="700" color={colors.textColor} mb="0">
                      <Icon as={MdViewColumn} boxSize="14px" mr="6px" color="#7c3aed" />
                      Số cột
                    </FormLabel>
                    <Text fontSize="10px" color={colors.subColor} fontWeight="600">
                      Tối đa {remainingCols}
                    </Text>
                  </Flex>
                  <NumberInput 
                    min={0} 
                    max={Math.min(20, remainingCols)} 
                    value={colCount} 
                    onChange={(_, val) => setColCount(val || 0)} 
                    isDisabled={isLoading || remainingCols === 0}
                  >
                    <NumberInputField 
                      bg={colors.bgInput} 
                      border={`1.5px solid ${colors.borderInput}`} 
                      borderRadius="10px" 
                      color={colors.textColor}
                      h="40px"
                      fontSize="14px"
                      fontWeight="700"
                      textAlign="center"
                      _focus={{ border: "1.5px solid #7c3aed", boxShadow: "0 0 0 3px rgba(124,58,237,0.1)" }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Flex gap="4px" mt="8px" flexWrap="wrap">
                    {[1, 2, 3, 5, 8, 10].map((v) => (
                      <QuickButton
                        key={v}
                        value={`+${v}`}
                        onClick={() => setColCount(Math.min(v, remainingCols))}
                        isActive={colCount === v}
                        isDisabled={isLoading || remainingCols === 0 || v > remainingCols}
                      />
                    ))}
                  </Flex>
                </FormControl>
              </Grid>

              {/* Vị trí thêm */}
              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={colors.textColor} mb="8px">
                  <Icon as={MdInfo} boxSize="14px" mr="6px" color="#3b82f6" />
                  Vị trí thêm
                </FormLabel>
                <Select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  isDisabled={isLoading}
                  bg={colors.bgInput}
                  border={`1.5px solid ${colors.borderInput}`}
                  borderRadius="10px"
                  color={colors.textColor}
                  h="40px"
                  fontSize="13px"
                  fontWeight="600"
                  _focus={{ border: "1.5px solid #3b82f6", boxShadow: "0 0 0 3px rgba(59,130,246,0.1)" }}
                >
                  <option value="end">📍 Thêm vào cuối (sau cùng)</option>
                  <option value="start">📍 Thêm vào đầu (trước tiên)</option>
                </Select>
              </FormControl>
            </VStack>

            {/* Cột phải: Preview */}
            <Box
              p="16px"
              borderRadius="16px"
              bg={isDark ? "rgba(15, 31, 58, 0.6)" : "rgba(248, 250, 252, 0.8)"}
              border={`1.5px dashed ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
              display="flex"
              flexDirection="column"
            >
              <Flex align="center" gap="8px" mb="12px">
                <Icon as={MdGridView} boxSize="16px" color="#f97316" />
                <Text fontSize="12px" fontWeight="800" color={colors.textColor}>
                  Xem trước sơ đồ
                </Text>
              </Flex>

              {previewData.rows > 0 && previewData.cols > 0 ? (
                <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <Box w="50%" h="3px" borderRadius="full" bg="linear-gradient(90deg, transparent, #f97316, transparent)" mb="12px" opacity="0.5" />
                  
                  <Box overflowX="auto" maxW="100%" pb="8px" display="flex" flexDirection="column" alignItems="center">
                    {Array.from({ length: previewData.rows }).map((_, r) => (
                      <Flex key={r} gap="3px" mb="3px">
                        <Box w="16px" textAlign="center" display="flex" alignItems="center" justifyContent="center">
                          <Text fontSize="8px" fontWeight="700" color={colors.subColor} fontFamily="monospace">
                            {String.fromCharCode(65 + r)}
                          </Text>
                        </Box>
                        {Array.from({ length: previewData.cols }).map((_, c) => {
                          const isNewRow = previewData.previewRows > 0 && r < previewData.previewRows;
                          const isNewCol = previewData.previewCols > 0 && c < previewData.previewCols;
                          const isNew = isNewRow || isNewCol;
                          
                          return (
                            <Tooltip key={c} label={`${String.fromCharCode(65 + r)}${c + 1}`} fontSize="10px" hasArrow>
                              <Box
                                w="18px" h="14px" borderRadius="3px"
                                bg={isNew ? "linear-gradient(135deg, #f97316, #fb923c)" : (isDark ? "#1a2744" : "#fff7ed")}
                                border={`1px solid ${isNew ? "#ea580c" : (isDark ? "#2d4a6b" : "#fed7aa")}`}
                                boxShadow={isNew ? "0 2px 6px rgba(249, 115, 22, 0.3)" : "none"}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                          );
                        })}
                      </Flex>
                    ))}
                  </Box>

                  <Divider my="10px" borderColor={isDark ? "#1a3a5c" : "#e2e8f0"} />

                  <Flex gap="12px" flexWrap="wrap" justify="center">
                    <Flex align="center" gap="6px">
                      <Box w="10px" h="8px" borderRadius="2px" bg="linear-gradient(135deg, #f97316, #fb923c)" />
                      <Text fontSize="10px" color={colors.subColor} fontWeight="600">Ghế mới</Text>
                    </Flex>
                    <Flex align="center" gap="6px">
                      <Box w="10px" h="8px" borderRadius="2px" bg={isDark ? "#1a2744" : "#fff7ed"} border={`1px solid ${isDark ? "#2d4a6b" : "#fed7aa"}`} />
                      <Text fontSize="10px" color={colors.subColor} fontWeight="600">Ghế cũ</Text>
                    </Flex>
                  </Flex>
                </Box>
              ) : (
                <Flex flex="1" direction="column" align="center" justify="center" py="30px" color={colors.subColor}>
                  <Icon as={FaChair} boxSize="28px" mb="8px" opacity="0.4" />
                  <Text fontSize="11px" fontWeight="600" textAlign="center">
                    Nhập số hàng hoặc cột<br />để xem trước sơ đồ
                  </Text>
                </Flex>
              )}
            </Box>
          </Grid>

          {/* Thông báo kết quả */}
          {totalSeats > 0 && (
            <Box mt="16px" p="12px 14px" borderRadius="12px"
              bg={isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)"}
              border={`1.5px solid ${isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.25)"}`}
              sx={{ animation: "fadeIn 0.3s ease both" }}
            >
              <Flex align="center" gap="10px">
                <Icon as={MdCheckCircle} boxSize="18px" color="#10b981" />
                <Box flex="1">
                  <Text fontSize="12px" fontWeight="700" color={isDark ? "#6ee7b7" : "#059669"}>
                    Sẽ tạo thêm {totalSeats} ghế mới
                  </Text>
                  <Text fontSize="11px" color={colors.subColor} mt="2px">
                    {isAddBoth && `Thêm ${rowCount} hàng × ${colCount} cột ở vị trí ${position === 'start' ? 'đầu' : 'cuối'}`}
                    {isAddRowOnly && `Thêm ${rowCount} hàng mới, mỗi hàng ${currentCols || colCount || '?'} cột`}
                    {isAddColOnly && `Thêm ${colCount} cột cho ${currentRows || '?'} hàng hiện có`}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Cảnh báo lỗi */}
          {hasError && (
            <Box mt="12px" p="12px 14px" borderRadius="10px" bg="#fef2f2" border="1px solid #fca5a5">
              <Flex align="center" gap="8px">
                <Icon as={MdWarning} boxSize="16px" color="#dc2626" />
                <Text fontSize="12px" color="#dc2626" fontWeight="600">
                  Số lượng vượt quá giới hạn cho phép!
                </Text>
              </Flex>
            </Box>
          )}
        </ModalBody>

        {/* Footer */}
        <Flex px="24px" py="16px" borderTop={`1px solid ${colors.borderCard}`}
          bg={isDark ? "rgba(10, 22, 40, 0.5)" : "rgba(248, 250, 252, 0.5)"}
          gap="10px" justify="flex-end"
        >
          <Button h="42px" px="24px" variant="ghost" color={colors.subColor} borderRadius="12px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${colors.borderCard}`}
            _hover={{ bg: isDark ? "#1a2744" : "#f8fafc" }} onClick={handleClose} isDisabled={isLoading}
            leftIcon={<Icon as={MdClose} />}>
            Hủy bỏ
          </Button>
          <Button h="42px" px="32px" borderRadius="12px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} />} onClick={handleAdd} isLoading={isLoading}
            loadingText="Đang thêm..." isDisabled={!canSubmit || hasError}>
            {isAddBoth ? `Thêm ${rowCount} hàng × ${colCount} cột` : isAddRowOnly ? `Thêm ${rowCount} hàng` : isAddColOnly ? `Thêm ${colCount} cột` : "Thêm ghế"}
          </Button>
        </Flex>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </ModalContent>
    </Modal>
  );
}