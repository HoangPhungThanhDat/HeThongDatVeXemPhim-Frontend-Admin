// src/views/admin/quanlyphongchieu/components/EditRoomModal.jsx

import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, FormControl, FormLabel,
  VStack, useToast, useColorMode, Divider,
} from "@chakra-ui/react";
import { 
  MdEdit, MdClose, MdInfo, MdMeetingRoom, 
  MdChair, MdAttachMoney, MdLocalMovies 
} from "react-icons/md";
import { FaDoorClosed, FaCouch } from "react-icons/fa";

// Màu sắc cho chế độ tối
const DARK_THEME = {
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
};

const getInputStyle = (isDark) => ({
  bg: isDark ? DARK_THEME.inputBg : "#fafafa",
  border: isDark ? `1.5px solid ${DARK_THEME.border}` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? DARK_THEME.text : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? DARK_THEME.labelColor : "#b0bac8", fontWeight: "400" },
  _focus: {
    border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`,
    boxShadow: isDark 
      ? `0 0 0 3px ${DARK_THEME.accentShadow}`
      : "0 0 0 3px rgba(249,115,22,0.10)",
    bg: isDark ? DARK_THEME.inputBg : "#fff"
  },
  _hover: { 
    border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
    bg: isDark ? DARK_THEME.inputBg : "#fff" 
  },
  transition: "all 0.2s",
});

const EditRoomModal = ({ isOpen, onClose, onSave, room }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();
  
  // Màu sắc
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const accentShadow = isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.35)";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)";
  
  const bg = isDark ? DARK_THEME.cardBg : "white";
  const border = isDark ? DARK_THEME.border : "#e2e8f0";
  const textColor = isDark ? DARK_THEME.text : "#1a202c";
  const subColor = isDark ? DARK_THEME.textSecondary : "#64748b";
  const inputStyle = getInputStyle(isDark);

  // Form state
  const [form, setForm] = useState({
    Name: "",
    RoomType: "2D",
    TotalSeats: 100,
    Rows: 10,
    SeatsPerRow: 10,
    Status: "Active",
    Price: 75000,
  });

  useEffect(() => {
    if (room && isOpen) {
      setForm({
        Name: room.Name || "",
        RoomType: room.RoomType || "2D",
        TotalSeats: room.SeatCount || room.TotalSeats || 100,
        Rows: room.Rows || 10,
        SeatsPerRow: room.SeatsPerRow || 10,
        Status: room.Status || "Active",
        Price: room.Price || 75000,
      });
    }
  }, [room, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.Name || form.TotalSeats < 1) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên phòng và số ghế hợp lệ.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const roomId = room?.RoomId || room?.id;
    if (!roomId) return;

    const updatedRoom = {
      Name: form.Name,
      RoomType: form.RoomType,
      SeatCount: parseInt(form.TotalSeats) || 0,
      Status: form.Status,
    };

    onSave(roomId, updatedRoom);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" bg="blackAlpha.600" />
      
      <ModalContent 
        bg={bg} 
        borderRadius="24px" 
        border={`1px solid ${border}`} 
        overflow="hidden"
        boxShadow={isDark ? `0 24px 48px ${DARK_THEME.accentShadow}` : "0 24px 48px rgba(0,0,0,0.15)"}
      >
        {/* Thanh màu Gradient trên cùng */}
        <Box h="6px" w="100%" bg={gradientBg} />

        {/* Header */}
        <ModalHeader pt="24px" pb="16px" px="28px">
          <Flex align="center" gap="14px">
            <Box 
              w="44px" h="44px" borderRadius="12px"
              bg={gradientBg}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${accentShadow}`}
            >
              <Icon as={MdEdit} boxSize="22px" color="white" />
            </Box>
            <Box>
              <Text fontSize="20px" fontWeight="800" color={textColor} lineHeight="1.2">
                Chỉnh sửa phòng chiếu
              </Text>
              <Text fontSize="13px" color={subColor} mt="2px">
                Cập nhật thông tin cấu hình cho phòng
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        
        <ModalCloseButton 
          top="24px" right="20px" 
          color={subColor} 
          _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }} 
          borderRadius="full"
        />

        {/* Body */}
        <ModalBody px="28px" pb="24px" overflowY="auto" maxH="60vh">
          <VStack spacing="20px" align="stretch">
            
            {/* Thông tin cơ bản */}
            <Box>
              <Flex align="center" gap="8px" mb="12px">
                <Icon as={FaDoorClosed} color={accentColor} boxSize="16px" />
                <Text fontSize="13px" fontWeight="800" color={textColor} textTransform="uppercase" letterSpacing="0.5px">
                  Thông tin cơ bản
                </Text>
              </Flex>
              
              <Grid templateColumns="1fr 1fr" gap="16px">
                <FormControl isRequired>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Tên phòng chiếu</FormLabel>
                  <Input
                    {...inputStyle}
                    placeholder="VD: Phòng 1, IMAX..."
                    value={form.Name}
                    onChange={(e) => handleChange("Name", e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Trạng thái</FormLabel>
                  <Select
                    {...inputStyle}
                    value={form.Status}
                    onChange={(e) => handleChange("Status", e.target.value)}
                  >
                    <option value="Active">✅ Đang hoạt động</option>
                    <option value="Inactive">⛔ Không hoạt động</option>
                    <option value="Maintenance">🔧 Bảo trì</option>
                  </Select>
                </FormControl>
              </Grid>
            </Box>

            <Divider borderColor={border} />

            {/* Cấu hình phòng */}
            <Box>
              <Flex align="center" gap="8px" mb="12px">
                <Icon as={MdMeetingRoom} color={accentColor} boxSize="16px" />
                <Text fontSize="13px" fontWeight="800" color={textColor} textTransform="uppercase" letterSpacing="0.5px">
                  Cấu hình phòng
                </Text>
              </Flex>
              
              <Grid templateColumns="1fr 1fr" gap="16px">
                <FormControl isRequired>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Định dạng màn hình</FormLabel>
                  <Select
                    {...inputStyle}
                    value={form.RoomType}
                    onChange={(e) => handleChange("RoomType", e.target.value)}
                  >
                    <option value="2D">2D Standard</option>
                    <option value="3D">3D</option>
                    <option value="4DX">4DX</option>
                    <option value="IMAX">IMAX</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Giá vé cơ bản (VNĐ)</FormLabel>
                  <Input
                    {...inputStyle}
                    type="number"
                    min="0"
                    step="5000"
                    value={form.Price}
                    onChange={(e) => handleChange("Price", parseInt(e.target.value) || 0)}
                  />
                </FormControl>
              </Grid>
            </Box>

            <Divider borderColor={border} />

            {/* Sơ đồ ghế */}
            <Box>
              <Flex align="center" gap="8px" mb="12px">
                <Icon as={FaCouch} color={accentColor} boxSize="16px" />
                <Text fontSize="13px" fontWeight="800" color={textColor} textTransform="uppercase" letterSpacing="0.5px">
                  Số lượng ghế
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr 1fr" gap="16px">
                <FormControl isRequired>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Tổng số ghế</FormLabel>
                  <Input
                    {...inputStyle}
                    type="number"
                    min="1"
                    value={form.TotalSeats}
                    onChange={(e) => handleChange("TotalSeats", parseInt(e.target.value) || 0)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Số hàng ghế</FormLabel>
                  <Input
                    {...inputStyle}
                    type="number"
                    min="1"
                    value={form.Rows}
                    onChange={(e) => handleChange("Rows", parseInt(e.target.value) || 0)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="12px" fontWeight="700" color={subColor}>Ghế / hàng</FormLabel>
                  <Input
                    {...inputStyle}
                    type="number"
                    min="1"
                    value={form.SeatsPerRow}
                    onChange={(e) => handleChange("SeatsPerRow", parseInt(e.target.value) || 0)}
                  />
                </FormControl>
              </Grid>

              <Flex 
                mt="12px" p="12px 16px" borderRadius="10px" 
                bg={isDark ? "rgba(74,158,255,0.1)" : "#fff7ed"} 
                border={`1px dashed ${isDark ? DARK_THEME.accent : "#fdba74"}`}
              >
                <Icon as={MdInfo} boxSize="16px" color={accentColor} mr="10px" mt="2px" />
                <Text fontSize="12px" color={subColor} lineHeight="1.5">
                  Lưu ý: Thay đổi số lượng ghế ở đây <strong>chỉ cập nhật thông số tổng quát</strong>. Để thay đổi sơ đồ ghế chi tiết (VIP, Couple,...), vui lòng truy cập trang <strong>Quản lý ghế</strong>.
                </Text>
              </Flex>
            </Box>

          </VStack>
        </ModalBody>

        {/* Footer */}
        <Flex 
          px="28px" py="20px" 
          bg={isDark ? "rgba(0,0,0,0.2)" : "#f8fafc"} 
          borderTop={`1px solid ${border}`}
          justify="flex-end" gap="12px"
        >
          <Button
            h="42px" px="24px"
            variant="ghost"
            color={subColor}
            borderRadius="10px"
            fontWeight="600" fontSize="14px"
            border={`1.5px solid ${border}`}
            _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#e2e8f0" }}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            h="42px" px="28px"
            borderRadius="10px"
            fontWeight="700" fontSize="14px"
            bg={gradientBg}
            color="white"
            boxShadow={`0 4px 14px ${accentShadow}`}
            _hover={{ boxShadow: `0 6px 20px ${accentShadow}`, transform: "translateY(-1px)" }}
            transition="all 0.2s"
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </Flex>

      </ModalContent>
    </Modal>
  );
};

export default EditRoomModal;