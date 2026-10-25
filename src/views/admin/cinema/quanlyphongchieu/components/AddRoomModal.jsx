import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel,
  VStack, useToast, useColorMode,
} from "@chakra-ui/react";
import { MdAdd, MdClose, MdInfo, MdCheckCircle } from "react-icons/md";
import { FaBuilding, FaDoorClosed, FaFilm, FaToggleOn, FaChair } from "react-icons/fa";

const DARK_THEME = {
  bg: "#0a1628",
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

const AddRoomModal = ({ isOpen, onClose, onAdd, cinemas = [], isDark }) => {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : (colorMode === "dark");
  const toast = useToast();
  
  const accentColor = darkMode ? DARK_THEME.accent : "#f97316";
  const accentShadow = darkMode ? DARK_THEME.accentShadow : "rgba(249,115,22,0.35)";
  const gradientBg = darkMode 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)";
  const gradientSmall = darkMode 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg,#f97316,#fb923c)";
  
  const bg = darkMode ? DARK_THEME.cardBg : "white";
  const border = darkMode ? DARK_THEME.border : "#e2e8f0";
  const textColor = darkMode ? DARK_THEME.text : "#1a202c";
  const subColor = darkMode ? DARK_THEME.textSecondary : "#64748b";
  const inputStyle = getInputStyle(darkMode);
  
  // ✅ Thêm trường SeatCount (Số ghế) vào form
  const [form, setForm] = useState({
    CinemaId: "",
    Name: "",
    RoomType: "",
    SeatCount: "",
    Status: "Active",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCinema = cinemas.find(c => c.CinemaId === Number(form.CinemaId));

  const handleSubmit = async () => {
    if (!form.CinemaId || !form.Name || !form.RoomType || !form.SeatCount) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin",
        description: "Các trường có dấu * là bắt buộc",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (Number(form.SeatCount) <= 0) {
      toast({
        title: "Số ghế không hợp lệ",
        description: "Số ghế phải lớn hơn 0",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    const newRoom = {
      CinemaId: Number(form.CinemaId),
      Name: form.Name.trim(),
      RoomType: form.RoomType,
      Capacity: Number(form.SeatCount), // ✅ Gửi Capacity để khớp với hook xử lý
      Status: form.Status,
    };

    try {
      // ✅ Chờ API lưu thành công mới đóng form và báo thành công
      const success = await onAdd(newRoom);
      
      if (success) {
        setForm({ CinemaId: "", Name: "", RoomType: "", SeatCount: "", Status: "Active" });
        onClose();
        // Lưu ý: Toast thành công đã được hiển thị bên trong hook useRoom
      }
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoomTypeLabel = (type) => {
    const labels = {
      "2D": "2D Standard",
      "3D": "3D",
      "4DX": "4DX",
      "IMAX": "IMAX",
    };
    return labels[type] || type;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="20px" border={`1px solid ${border}`} maxH="90vh" overflow="hidden">
        <Box h="4px" bg={gradientBg} bgSize="200% 100%" sx={{ animation: "shimmer 3s linear infinite" }} />
        
        <ModalHeader color={textColor} fontWeight="800" fontSize="18px" pt="20px" pb="4px">
          <Flex align="center" gap="10px">
            <Box w="40px" h="40px" borderRadius="11px" bg={gradientSmall}
              display="flex" alignItems="center" justifyContent="center" boxShadow={`0 4px 12px ${accentShadow}`}>
              <Icon as={FaDoorClosed} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize="18px" fontWeight="800" color={textColor}>Thêm phòng chiếu mới</Text>
              <Text fontSize="12px" color={subColor}>Tạo phòng chiếu mới cho rạp</Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton top="18px" right="16px" color={subColor} isDisabled={isSubmitting} />

        <ModalBody pb="4px" overflowY="auto">
          <VStack spacing="16px" align="stretch">
            
            {/* Chọn rạp */}
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                <Icon as={FaBuilding} boxSize="12px" color={accentColor} /> Chọn rạp
              </FormLabel>
              <Select
                {...inputStyle}
                placeholder="-- Chọn rạp chiếu --"
                value={form.CinemaId}
                isDisabled={isSubmitting}
                onChange={(e) => setForm({ ...form, CinemaId: e.target.value })}
              >
                {cinemas.map((c) => (
                  <option key={c.CinemaId} value={c.CinemaId}>{c.Name}</option>
                ))}
              </Select>
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap="14px">
              {/* Tên phòng */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaDoorClosed} boxSize="12px" color={accentColor} /> Tên phòng chiếu
                </FormLabel>
                <Input
                  {...inputStyle}
                  placeholder="VD: Phòng 1, Phòng VIP"
                  value={form.Name}
                  isDisabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, Name: e.target.value })}
                />
              </FormControl>

              {/* Loại phòng */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaFilm} boxSize="12px" color={accentColor} /> Loại phòng
                </FormLabel>
                <Select
                  {...inputStyle}
                  placeholder="-- Chọn loại phòng --"
                  value={form.RoomType}
                  isDisabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, RoomType: e.target.value })}
                >
                  <option value="2D">2D Standard</option>
                  <option value="3D">3D</option>
                  <option value="4DX">4DX</option>
                  <option value="IMAX">IMAX</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap="14px">
              {/* ✅ THÊM MỚI: Số ghế */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaChair} boxSize="12px" color={accentColor} /> Số ghế dự kiến
                </FormLabel>
                <Input
                  {...inputStyle}
                  type="number"
                  placeholder="VD: 100"
                  min="1"
                  value={form.SeatCount}
                  isDisabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, SeatCount: e.target.value })}
                />
              </FormControl>

              {/* Trạng thái */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaToggleOn} boxSize="12px" color={accentColor} /> Trạng thái
                </FormLabel>
                <Select
                  {...inputStyle}
                  value={form.Status}
                  isDisabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, Status: e.target.value })}
                >
                  <option value="Active">✅ Hoạt động</option>
                  <option value="Inactive">⛔ Không hoạt động</option>
                  <option value="Maintenance">🔧 Bảo trì</option>
                </Select>
              </FormControl>
            </Grid>

            {/* Thông báo */}
            <Box p="14px 16px" borderRadius="12px"
              bg={darkMode ? `${DARK_THEME.accent}15` : "rgba(59, 130, 246, 0.08)"}
              border={`1.5px solid ${darkMode ? DARK_THEME.border : "rgba(59, 130, 246, 0.25)"}`}
            >
              <Flex align="flex-start" gap="10px">
                <Icon as={MdInfo} boxSize="18px" color={darkMode ? DARK_THEME.accent : "#3b82f6"} mt="2px" flexShrink="0" />
                <Box fontSize="13px" color={darkMode ? DARK_THEME.textSecondary : "#475569"}>
                  <Text fontWeight="700" color={darkMode ? DARK_THEME.text : "#1e293b"} mb="4px">💡 Lưu ý</Text>
                  <Text fontSize="12px">
                    Số ghế bạn nhập là <strong>số ghế dự kiến</strong>. Hãy vào phần 
                    <strong style={{ color: darkMode ? DARK_THEME.accent : "#3b82f6" }}> "Quản lý ghế"</strong> để xếp sơ đồ ghế chi tiết.
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Summary Box */}
            {form.CinemaId && form.Name && form.RoomType && form.SeatCount && (
              <Box p="16px 18px" borderRadius="12px"
                bg={darkMode ? `${DARK_THEME.accent}12` : "rgba(247, 147, 30, 0.08)"}
                border={`1.5px solid ${darkMode ? DARK_THEME.border : "rgba(247, 147, 30, 0.3)"}`}
                sx={{ animation: "fadeIn 0.3s ease both" }}
              >
                <Flex align="center" gap="10px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={gradientSmall}
                    display="flex" alignItems="center" justifyContent="center">
                    <Icon as={MdCheckCircle} boxSize="14px" color="white" />
                  </Box>
                  <Text fontSize="14px" fontWeight="700" color={textColor}>Thông tin phòng chiếu</Text>
                </Flex>

                <Grid templateColumns="1fr 1fr" gap="8px" fontSize="13px" color={subColor}>
                  <Flex align="center" gap="8px">
                    <Icon as={FaBuilding} boxSize="12px" color={accentColor} />
                    <Text>Rạp: <strong style={{ color: textColor }}>{selectedCinema?.Name}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaDoorClosed} boxSize="12px" color={accentColor} />
                    <Text>Tên: <strong style={{ color: textColor }}>{form.Name}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaFilm} boxSize="12px" color={accentColor} />
                    <Text>Loại: <strong style={{ color: darkMode ? DARK_THEME.accentLight : "#3b82f6" }}>{getRoomTypeLabel(form.RoomType)}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaChair} boxSize="12px" color={accentColor} />
                    <Text>Số ghế: <strong style={{ color: darkMode ? DARK_THEME.accentLight : "#fbbf24" }}>{form.SeatCount} ghế</strong></Text>
                  </Flex>
                </Grid>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter gap="10px" pt="14px" pb="20px" borderTop={`1px solid ${border}`}>
          <Button flex="1" h="42px" px="22px" variant="ghost" color={subColor} borderRadius="10px"
            fontWeight="600" fontSize="13px" border={`1.5px solid ${border}`}
            _hover={{ bg: darkMode ? DARK_THEME.hoverBg : "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />}
            onClick={onClose}
            isDisabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button flex="2" h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={gradientBg} color="white" boxShadow={`0 4px 16px ${accentShadow}`}
            _hover={!isSubmitting ? { boxShadow: `0 8px 24px ${accentShadow}`, transform: "translateY(-1px)" } : {}}
            transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Đang thêm..."
          >
            Thêm phòng
          </Button>
        </ModalFooter>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </ModalContent>
    </Modal>
  );
};

export default AddRoomModal;