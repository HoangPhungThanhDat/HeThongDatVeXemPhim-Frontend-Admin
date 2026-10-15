// src/views/admin/quanlyphongchieu/components/EditRoomModal.jsx

import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, FormControl, FormLabel,
  VStack, useToast, useColorMode,
} from "@chakra-ui/react";
import { MdEdit, MdClose } from "react-icons/md";
import { ROOM_TYPES } from "../constants";

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

const EditRoomModal = ({ isOpen, onClose, onSave, room }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#f1f5f9" : "#1a202c";
  const inputStyle = getInputStyle(isDark);
  
  const [form, setForm] = useState({
    Name: "",
    RoomType: "Standard",
    TotalSeats: 100,
    Rows: 10,
    SeatsPerRow: 10,
    Status: "Active",
    Tech: ["Dolby Digital"],
    ScreenSize: "16m × 8m",
    Price: 75000,
  });

  useEffect(() => {
    if (room) {
      setForm({
        Name: room.Name || "",
        RoomType: room.RoomType || room.type || "Standard",
        TotalSeats: room.TotalSeats || room.capacity || 100,
        Rows: room.Rows || room.rows || 10,
        SeatsPerRow: room.SeatsPerRow || room.seatsPerRow || 10,
        Status: room.Status || room.status || "Active",
        Tech: room.Tech || ["Dolby Digital"],
        ScreenSize: room.ScreenSize || room.screenSize || "16m × 8m",
        Price: room.Price || room.price || 75000,
      });
    }
  }, [room]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.Name || form.TotalSeats < 1) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const updatedRoom = {
      ...form,
      TotalSeats: parseInt(form.TotalSeats) || 0,
      Rows: parseInt(form.Rows) || 10,
      SeatsPerRow: parseInt(form.SeatsPerRow) || 10,
      Price: parseInt(form.Price) || 0,
    };

    onSave(updatedRoom);
    onClose();
    toast({
      title: "Đã cập nhật phòng chiếu",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="20px" border={`1px solid ${border}`}>
        <ModalHeader color={textColor} fontWeight="800" fontSize="18px">
          <Flex align="center" gap="10px">
            <Icon as={MdEdit} boxSize="22px" color="#f97316" />
            Chỉnh sửa phòng chiếu
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={isDark ? "#94a3b8" : "#64748b"} />
        <ModalBody pb="24px">
          <VStack spacing="16px" align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                Tên phòng
              </FormLabel>
              <Input
                {...inputStyle}
                placeholder="VD: Phòng 1 – IMAX"
                value={form.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
              />
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap="14px">
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Loại phòng
                </FormLabel>
                <Select
                  {...inputStyle}
                  value={form.RoomType}
                  onChange={(e) => handleChange("RoomType", e.target.value)}
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Trạng thái
                </FormLabel>
                <Select
                  {...inputStyle}
                  value={form.Status}
                  onChange={(e) => handleChange("Status", e.target.value)}
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                  <option value="Maintenance">Bảo trì</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr 1fr" gap="14px">
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Số ghế
                </FormLabel>
                <Input
                  {...inputStyle}
                  type="number"
                  min="1"
                  placeholder="100"
                  value={form.TotalSeats}
                  onChange={(e) => handleChange("TotalSeats", parseInt(e.target.value) || 0)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Hàng ghế
                </FormLabel>
                <Input
                  {...inputStyle}
                  type="number"
                  min="1"
                  placeholder="10"
                  value={form.Rows}
                  onChange={(e) => handleChange("Rows", parseInt(e.target.value) || 0)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Ghế/hàng
                </FormLabel>
                <Input
                  {...inputStyle}
                  type="number"
                  min="1"
                  placeholder="10"
                  value={form.SeatsPerRow}
                  onChange={(e) => handleChange("SeatsPerRow", parseInt(e.target.value) || 0)}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap="14px">
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Giá vé (VNĐ)
                </FormLabel>
                <Input
                  {...inputStyle}
                  type="number"
                  min="0"
                  placeholder="75000"
                  value={form.Price}
                  onChange={(e) => handleChange("Price", parseInt(e.target.value) || 0)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Kích thước màn hình
                </FormLabel>
                <Input
                  {...inputStyle}
                  placeholder="16m × 8m"
                  value={form.ScreenSize}
                  onChange={(e) => handleChange("ScreenSize", e.target.value)}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                Công nghệ (cách nhau bởi dấu phẩy)
              </FormLabel>
              <Input
                {...inputStyle}
                placeholder="Dolby Digital, 4K"
                value={Array.isArray(form.Tech) ? form.Tech.join(", ") : form.Tech}
                onChange={(e) => handleChange("Tech", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
              />
            </FormControl>
          </VStack>

          <Flex gap="10px" mt="20px" justify="flex-end">
            <Button
              h="42px"
              px="22px"
              variant="ghost"
              color={isDark ? "#94a3b8" : "#64748b"}
              borderRadius="10px"
              fontWeight="600"
              fontSize="13px"
              border={`1.5px solid ${border}`}
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
              onClick={handleSubmit}
            >
              Lưu thay đổi
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditRoomModal;