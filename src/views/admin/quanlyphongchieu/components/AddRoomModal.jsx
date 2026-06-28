// src/views/admin/quanlyphongchieu/components/AddRoomModal.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter,
  ModalCloseButton, FormControl, FormLabel,
  VStack, useToast, useColorMode, Divider,
} from "@chakra-ui/react";
import { MdAdd, MdClose, MdInfo, MdCheckCircle } from "react-icons/md";
import { FaBuilding, FaDoorClosed, FaFilm, FaToggleOn } from "react-icons/fa";

const getInputStyle = (isDark) => ({
  bg: isDark ? "#1e293b" : "#fafafa",
  border: isDark ? "1.5px solid #334155" : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? "#f1f5f9" : "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: isDark ? "#64748b" : "#b0bac8", fontWeight: "400" },
  _focus: {
    border: "1.5px solid #f97316",
    boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
    bg: isDark ? "#1e293b" : "#fff"
  },
  _hover: { border: "1.5px solid #f97316", bg: isDark ? "#1e293b" : "#fff" },
  transition: "all 0.2s",
});

const AddRoomModal = ({ isOpen, onClose, onAdd, cinemas = [] }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#f1f5f9" : "#1a202c";
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const inputStyle = getInputStyle(isDark);
  
  const [form, setForm] = useState({
    CinemaId: "",
    Name: "",
    RoomType: "",
    Status: "Active",
  });

  const selectedCinema = cinemas.find(c => c.CinemaId === Number(form.CinemaId));

  const handleSubmit = () => {
    if (!form.CinemaId || !form.Name || !form.RoomType) {
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

    const newRoom = {
      ...form,
      TotalSeats: 0,
    };

    onAdd(newRoom);
    setForm({
      CinemaId: "",
      Name: "",
      RoomType: "",
      Status: "Active",
    });
    onClose();
    toast({
      title: "🎉 Thêm phòng chiếu thành công!",
      description: "Hãy tạo ghế cho phòng này trong phần Quản lý ghế.",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="20px" border={`1px solid ${border}`} maxH="90vh" overflow="hidden">
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: "shimmer 3s linear infinite" }} />
        
        <ModalHeader color={textColor} fontWeight="800" fontSize="18px" pt="20px" pb="4px">
          <Flex align="center" gap="10px">
            <Box w="40px" h="40px" borderRadius="11px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaDoorClosed} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize="18px" fontWeight="800" color={textColor}>
                Thêm phòng chiếu mới
              </Text>
              <Text fontSize="12px" color={subColor}>
                Tạo phòng chiếu mới cho rạp
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton top="18px" right="16px" color={subColor} />

        <ModalBody pb="4px" overflowY="auto">
          <VStack spacing="16px" align="stretch">
            {/* Chọn rạp */}
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                <Icon as={FaBuilding} boxSize="12px" color="#f97316" />
                Chọn rạp
              </FormLabel>
              <Select
                {...inputStyle}
                placeholder="-- Chọn rạp chiếu --"
                value={form.CinemaId}
                onChange={(e) => setForm({ ...form, CinemaId: e.target.value })}
              >
                {cinemas.map((c) => (
                  <option key={c.CinemaId} value={c.CinemaId}>
                    {c.Name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap="14px">
              {/* Tên phòng */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaDoorClosed} boxSize="12px" color="#f97316" />
                  Tên phòng chiếu
                </FormLabel>
                <Input
                  {...inputStyle}
                  placeholder="VD: Phòng 1, Phòng VIP"
                  value={form.Name}
                  onChange={(e) => setForm({ ...form, Name: e.target.value })}
                />
              </FormControl>

              {/* Loại phòng */}
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                  <Icon as={FaFilm} boxSize="12px" color="#f97316" />
                  Loại phòng
                </FormLabel>
                <Select
                  {...inputStyle}
                  placeholder="-- Chọn loại phòng --"
                  value={form.RoomType}
                  onChange={(e) => setForm({ ...form, RoomType: e.target.value })}
                >
                  <option value="2D">2D Standard</option>
                  <option value="3D">3D</option>
                  <option value="4DX">4DX</option>
                  <option value="IMAX">IMAX</option>
                </Select>
              </FormControl>
            </Grid>

            {/* Trạng thái */}
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color={subColor} display="flex" alignItems="center" gap="6px">
                <Icon as={FaToggleOn} boxSize="12px" color="#f97316" />
                Trạng thái
              </FormLabel>
              <Select
                {...inputStyle}
                value={form.Status}
                onChange={(e) => setForm({ ...form, Status: e.target.value })}
              >
                <option value="Active">✅ Hoạt động</option>
                <option value="Inactive">⛔ Không hoạt động</option>
                <option value="Maintenance">🔧 Bảo trì</option>
              </Select>
            </FormControl>

            {/* Thông báo */}
            <Box
              p="14px 16px"
              borderRadius="12px"
              bg={isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)"}
              border={`1.5px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)"}`}
            >
              <Flex align="flex-start" gap="10px">
                <Icon as={MdInfo} boxSize="18px" color="#3b82f6" mt="2px" flexShrink="0" />
                <Box fontSize="13px" color={isDark ? "#94a3b8" : "#475569"}>
                  <Text fontWeight="700" color={isDark ? "#f1f5f9" : "#1e293b"} mb="4px">
                    💡 Lưu ý về số ghế
                  </Text>
                  <Text fontSize="12px">
                    Số ghế sẽ được tính tự động sau khi bạn tạo ghế cho phòng này.
                    Sau khi tạo phòng, hãy vào phần <strong>"Quản lý ghế"</strong> để tạo ghế hàng loạt.
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Summary Box */}
            {form.CinemaId && form.Name && form.RoomType && (
              <Box
                p="16px 18px"
                borderRadius="12px"
                bg={isDark ? "rgba(247, 147, 30, 0.12)" : "rgba(247, 147, 30, 0.08)"}
                border={`1.5px solid ${isDark ? "rgba(247, 147, 30, 0.25)" : "rgba(247, 147, 30, 0.3)"}`}
                sx={{ animation: "fadeIn 0.3s ease both" }}
              >
                <Flex align="center" gap="10px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px"
                    bg="linear-gradient(135deg,#f97316,#fb923c)"
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={MdCheckCircle} boxSize="14px" color="white" />
                  </Box>
                  <Text fontSize="14px" fontWeight="700" color={textColor}>
                    Thông tin phòng chiếu
                  </Text>
                </Flex>

                <Grid templateColumns="1fr 1fr" gap="8px" fontSize="13px" color={subColor}>
                  <Flex align="center" gap="8px">
                    <Icon as={FaBuilding} boxSize="12px" color="#f97316" />
                    <Text>Rạp: <strong style={{ color: textColor }}>{selectedCinema?.Name}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaDoorClosed} boxSize="12px" color="#f97316" />
                    <Text>Tên phòng: <strong style={{ color: textColor }}>{form.Name}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaFilm} boxSize="12px" color="#f97316" />
                    <Text>Loại phòng: <strong style={{ color: "#3b82f6" }}>{getRoomTypeLabel(form.RoomType)}</strong></Text>
                  </Flex>
                  <Flex align="center" gap="8px">
                    <Icon as={FaToggleOn} boxSize="12px" color="#f97316" />
                    <Text>Trạng thái: <strong style={{ color: form.Status === "Active" ? "#10b981" : "#6b7280" }}>
                      {form.Status === "Active" ? "✅ Hoạt động" : form.Status === "Inactive" ? "⛔ Không hoạt động" : "🔧 Bảo trì"}
                    </strong></Text>
                  </Flex>
                </Grid>

                <Box mt="10px" pt="10px" borderTop={`1px solid ${isDark ? "#334155" : "#e8edf3"}`}>
                  <Flex align="center" gap="8px">
                    <Icon as={FaDoorClosed} boxSize="12px" color="#fbbf24" />
                    <Text fontSize="12px" color={isDark ? "#94a3b8" : "#64748b"}>
                      Số ghế: <strong style={{ color: "#fbbf24" }}>Chưa có (sẽ tính tự động)</strong>
                    </Text>
                  </Flex>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter gap="10px" pt="14px" pb="20px" borderTop={`1px solid ${border}`}>
          <Button
            flex="1"
            h="42px"
            px="22px"
            variant="ghost"
            color={subColor}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={`1.5px solid ${border}`}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            flex="2"
            h="42px"
            px="28px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
            color="white"
            boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{
              boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
              transform: "translateY(-1px)"
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} />}
            onClick={handleSubmit}
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