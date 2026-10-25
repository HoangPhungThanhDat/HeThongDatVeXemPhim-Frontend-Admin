import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useColorMode,
  Box, Flex, Text, Button, Icon, Grid,
  useToast, Badge, Divider,
} from "@chakra-ui/react";
import { MdEdit, MdWarning, MdEventSeat } from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";
import { ROW_LABELS } from "../constants";

// ✅ Cấu hình loại ghế
const SEAT_TYPES_CONFIG = {
  Normal: { label: "Thường", bg: "#d1fae5", border: "#6ee7b7", text: "#065f46", icon: "A", desc: "Ghế tiêu chuẩn" },
  VIP: { label: "VIP", bg: "#f5f3ff", border: "#a78bfa", text: "#5b21b6", icon: "⭐", desc: "Ghế cao cấp" },
  Couple: { label: "Couple", bg: "#fef3c7", border: "#fcd34d", text: "#92400e", icon: "💑", desc: "Ghế đôi" },
  Sweetbox: { label: "Sweetbox", bg: "#fdf2f8", border: "#f9a8d4", text: "#9d174d", icon: "💝", desc: "Ghế tình nhân" },
  Accessible: { label: "Ưu tiên", bg: "#f0f9ff", border: "#7dd3fc", text: "#1e40af", icon: "♿", desc: "Ghế khuyết tật" },
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

  useEffect(() => {
    if (seat && isOpen) {
      let mappedType = "Normal";
      if (seat.SeatType) mappedType = seat.SeatType;
      else if (seat.type) {
        const typeLower = seat.type.toLowerCase();
        if (typeLower === 'vip') mappedType = "VIP";
        else if (typeLower === 'couple') mappedType = "Couple";
        else if (typeLower === 'sweetbox') mappedType = "Sweetbox";
        else if (typeLower === 'accessible') mappedType = "Accessible";
      }
      setType(mappedType);

      let currentStatus = "Available";
      if (seat.Status) {
        currentStatus = seat.Status.toLowerCase() === 'booked' ? "Booked" : "Available";
      } else if (seat.booked === true) {
        currentStatus = "Booked";
      }
      setStatus(currentStatus);
    }
  }, [seat, isOpen]);

  useEffect(() => {
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  const handleSave = async () => {
    if (!seat || typeof onSave !== 'function') {
      toast({ title: "Lỗi hệ thống", description: "Không thể lưu thay đổi", status: "error", duration: 3000, isClosable: true });
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
      
      await onSave(updatedSeat);
      
      toast({
        title: "✅ Cập nhật ghế thành công!",
        description: `Đã đổi sang ${SEAT_TYPES_CONFIG[type].label} - ${finalStatus === "Booked" ? "Đã đặt" : "Còn trống"}`,
        status: "success", duration: 3000, isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi lưu ghế:", error);
      let errorMessage = "Vui lòng thử lại";
      if (error.response?.data?.errors) errorMessage = Object.values(error.response.data.errors).flat().join(", ");
      else if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;

      toast({ title: "❌ Lỗi cập nhật ghế", description: errorMessage, status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  if (!seat) return null;

  const seatId = seat.SeatId || seat.id || "N/A";
  const rowLabel = seat.row !== undefined ? ROW_LABELS[seat.row] : (seat.Row || "N/A");
  const seatNumber = seat.col !== undefined ? seat.col + 1 : (seat.Number || "N/A");
  const isLoadingState = isLoading || parentLoading;

  const currentConfig = SEAT_TYPES_CONFIG[type] || SEAT_TYPES_CONFIG.Normal;
  const isBooked = status === "Booked";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" closeOnOverlayClick={!isLoadingState} isCentered>
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
          px="24px" py="18px" 
          bg={isDark ? "linear-gradient(135deg, #0f1f3a, #1a3a5c)" : "linear-gradient(135deg, #fff7ed, #ffedd5)"}
          borderBottom={`1px solid ${colors.borderCard}`} position="relative"
        >
          <Box position="absolute" top="-50%" right="-10%" w="200px" h="200px" borderRadius="full"
            bg={isDark ? "rgba(74, 158, 255, 0.08)" : "rgba(249, 115, 22, 0.08)"} filter="blur(40px)" />
          <Flex align="center" justify="space-between" position="relative">
            <Flex align="center" gap="14px">
              <Box w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" alignItems="center" justifyContent="center" boxShadow="0 8px 24px rgba(249, 115, 22, 0.35)">
                <Icon as={MdEdit} boxSize="22px" color="white" />
              </Box>
              <Box>
                <Text fontSize="18px" fontWeight="800" color={colors.textColor} letterSpacing="-0.3px">
                  Chỉnh sửa ghế
                </Text>
                <Flex align="center" gap="6px" mt="2px">
                  <Badge px="6px" py="1px" borderRadius="4px" fontSize="10px" fontWeight="700"
                    bg={isDark ? "rgba(74, 158, 255, 0.15)" : "rgba(249, 115, 22, 0.15)"}
                    color={isDark ? "#6ab0ff" : "#f97316"}>
                    {roomName || "Phòng chiếu"}
                  </Badge>
                  <Text fontSize="12px" color={colors.subColor}>•</Text>
                  <Text fontSize="12px" color={colors.subColor} fontWeight="600">
                    Hàng {rowLabel} - Ghế {seatNumber}
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <ModalCloseButton position="static" color={colors.subColor} isDisabled={isLoadingState} borderRadius="8px" />
          </Flex>
        </Box>

        <ModalBody p="24px">
          <Grid templateColumns={{ base: "1fr", md: "1fr 300px" }} gap="24px">
            
            {/* Cột trái: Chọn Loại ghế và Trạng thái */}
            <Box>
              <Text fontSize="12px" fontWeight="800" color={colors.labelColor} textTransform="uppercase" letterSpacing="1px" mb="12px">
                Loại ghế
              </Text>
              <Grid templateColumns="1fr 1fr" gap="10px" mb="20px">
                {Object.entries(SEAT_TYPES_CONFIG).map(([key, cfg]) => {
                  const isActive = type === key;
                  return (
                    <Box
                      key={key}
                      p="12px"
                      borderRadius="12px"
                      cursor={isLoadingState ? "not-allowed" : "pointer"}
                      bg={isActive ? (isDark ? "rgba(249, 115, 22, 0.15)" : "#fff7ed") : (isDark ? "#1a2744" : "#f8fafc")}
                      border={isActive ? `2px solid #f97316` : `1.5px solid ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
                      boxShadow={isActive ? "0 4px 12px rgba(249, 115, 22, 0.15)" : "none"}
                      onClick={() => !isLoadingState && setType(key)}
                      opacity={isLoadingState ? 0.6 : 1}
                      transition="all 0.2s"
                      _hover={!isActive && !isLoadingState ? { border: `1.5px solid #f97316`, bg: isDark ? "#142d4f" : "#fff7ed" } : {}}
                    >
                      <Flex align="center" gap="10px">
                        <Box w="28px" h="28px" borderRadius="8px" bg={cfg.bg} border={`1.5px solid ${cfg.border}`}
                          display="flex" alignItems="center" justifyContent="center" fontSize="12px" fontWeight="800" color={cfg.text}>
                          {cfg.icon}
                        </Box>
                        <Box flex="1">
                          <Text fontSize="13px" fontWeight="800" color={isActive ? "#f97316" : colors.textColor}>
                            {cfg.label}
                          </Text>
                          <Text fontSize="10px" color={colors.subColor}>{cfg.desc}</Text>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Grid>

              <Text fontSize="12px" fontWeight="800" color={colors.labelColor} textTransform="uppercase" letterSpacing="1px" mb="12px">
                Trạng thái ghế
              </Text>
              <Flex gap="12px">
                <Box
                  flex="1"
                  p="14px"
                  borderRadius="12px"
                  cursor={isLoadingState ? "not-allowed" : "pointer"}
                  bg={!isBooked ? (isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5") : (isDark ? "#1a2744" : "#f8fafc")}
                  border={!isBooked ? `2px solid #10b981` : `1.5px solid ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
                  boxShadow={!isBooked ? "0 4px 12px rgba(16, 185, 129, 0.15)" : "none"}
                  onClick={() => !isLoadingState && setStatus("Available")}
                  opacity={isLoadingState ? 0.6 : 1}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap="10px">
                    <Box w="10px" h="10px" borderRadius="full" bg="#10b981" boxShadow="0 0 0 3px rgba(16,185,129,0.2)" />
                    <Box>
                      <Text fontSize="13px" fontWeight="800" color={!isBooked ? (isDark ? "#6ee7b7" : "#059669") : colors.textColor}>
                        Còn trống
                      </Text>
                      <Text fontSize="10px" color={colors.subColor}>Sẵn sàng đặt vé</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  flex="1"
                  p="14px"
                  borderRadius="12px"
                  cursor={isLoadingState ? "not-allowed" : "pointer"}
                  bg={isBooked ? (isDark ? "rgba(220, 38, 38, 0.15)" : "#fef2f2") : (isDark ? "#1a2744" : "#f8fafc")}
                  border={isBooked ? `2px solid #dc2626` : `1.5px solid ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
                  boxShadow={isBooked ? "0 4px 12px rgba(220, 38, 38, 0.15)" : "none"}
                  onClick={() => !isLoadingState && setStatus("Booked")}
                  opacity={isLoadingState ? 0.6 : 1}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap="10px">
                    <Box w="10px" h="10px" borderRadius="full" bg="#dc2626" boxShadow="0 0 0 3px rgba(220,38,38,0.2)" />
                    <Box>
                      <Text fontSize="13px" fontWeight="800" color={isBooked ? (isDark ? "#fca5a5" : "#dc2626") : colors.textColor}>
                        Đã đặt
                      </Text>
                      <Text fontSize="10px" color={colors.subColor}>Không thể chọn</Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              <Box mt="20px" p="12px 14px" borderRadius="10px" bg={isDark ? "rgba(249, 115, 22, 0.08)" : "#fff7ed"} border={`1px solid ${isDark ? "rgba(249,115,22,0.2)" : "#fed7aa"}`}>
                <Flex align="center" gap="8px">
                  <Icon as={MdWarning} boxSize="16px" color="#f97316" />
                  <Text fontSize="11px" color={isDark ? "#fdba74" : "#b45309"} fontWeight="600">
                    Thay đổi này sẽ cập nhật trực tiếp vào sơ đồ ghế phòng chiếu.
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* Cột phải: Preview */}
            <Box
              p="20px"
              borderRadius="16px"
              bg={isDark ? "rgba(15, 31, 58, 0.6)" : "rgba(248, 250, 252, 0.8)"}
              border={`1.5px dashed ${isDark ? "#1a3a5c" : "#e2e8f0"}`}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="11px" fontWeight="700" color={colors.labelColor} textTransform="uppercase" letterSpacing="1px" mb="16px">
                Xem trước
              </Text>
              
              <Box
                w="100px"
                h="100px"
                borderRadius="20px"
                bg={currentConfig.bg}
                border={`3px solid ${currentConfig.border}`}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                boxShadow={`0 12px 32px ${currentConfig.border}66`}
                position="relative"
                mb="16px"
                transition="all 0.3s"
              >
                <Text fontSize="32px" mb="2px">{currentConfig.icon}</Text>
                <Text fontSize="12px" fontWeight="800" color={currentConfig.text}>
                  {currentConfig.label}
                </Text>
                {/* Badge trạng thái */}
                <Box position="absolute" top="-8px" right="-8px" px="6px" py="2px" borderRadius="full"
                  bg={isBooked ? "#dc2626" : "#10b981"} color="white" fontSize="9px" fontWeight="800" boxShadow="md">
                  {isBooked ? "ĐÃ ĐẶT" : "TRỐNG"}
                </Box>
              </Box>

              <Box textAlign="center" mb="16px">
                <Text fontSize="18px" fontWeight="900" color={colors.textColor} mb="2px">
                  {rowLabel}{seatNumber}
                </Text>
                <Text fontSize="12px" color={colors.subColor}>
                  Hàng {rowLabel} - Vị trí {seatNumber}
                </Text>
              </Box>

              <Divider mb="16px" borderColor={isDark ? "#1a3a5c" : "#e2e8f0"} />

              <Box w="100%" p="12px" borderRadius="10px" bg={isDark ? "#1a2744" : "#ffffff"} border={`1px solid ${isDark ? "#2d4a6b" : "#e2e8f0"}`}>
                <Flex justify="space-between" mb="6px">
                  <Text fontSize="11px" color={colors.subColor}>Mã ghế:</Text>
                  <Text fontSize="11px" fontWeight="700" color={colors.textColor}>#{seatId}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="11px" color={colors.subColor}>Giá vé dự kiến:</Text>
                  <Text fontSize="11px" fontWeight="700" color="#f97316">
                    {type === "VIP" ? "150.000đ" : type === "Couple" ? "200.000đ" : type === "Sweetbox" ? "250.000đ" : "80.000đ"}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Grid>
        </ModalBody>

        {/* Footer */}
        <Flex px="24px" py="18px" borderTop={`1px solid ${colors.borderCard}`}
          bg={isDark ? "rgba(10, 22, 40, 0.5)" : "rgba(248, 250, 252, 0.5)"} gap="10px" justify="flex-end">
          <Button h="44px" px="24px" variant="ghost" color={colors.subColor} borderRadius="12px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${colors.borderCard}`}
            _hover={{ bg: isDark ? "#1a2744" : "#f8fafc" }} onClick={onClose} isDisabled={isLoadingState}>
            Hủy bỏ
          </Button>
          <Button h="44px" px="32px" borderRadius="12px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)" color="white"
            boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            onClick={handleSave} isLoading={isLoadingState} loadingText="Đang lưu...">
            💾 Lưu thay đổi
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}