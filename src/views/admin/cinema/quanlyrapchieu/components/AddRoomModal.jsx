

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, FormControl, FormLabel,
  VStack, useToast, useColorMode,
} from "@chakra-ui/react";
import { MdAdd, MdClose } from "react-icons/md";
import { ROOM_TYPE_CFG } from "../constants";

const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px", h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: "#fff" },
  transition: "all 0.2s",
};

const darkInputStyle = {
  bg: "#1e293b", border: "1.5px solid #334155", borderRadius: "10px",
  color: "#f1f5f9", fontSize: "14px", fontWeight: "500", px: "14px", h: "44px",
  _placeholder: { color: "#64748b", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.15)", bg: "#1e293b" },
  _hover: { border: "1.5px solid #f97316", bg: "#1e293b" },
  transition: "all 0.2s",
};

const AddRoomModal = ({ isOpen, onClose, onAdd, cinemaId }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const isDark = colorMode === "dark";
  const [form, setForm] = useState({
    Name: "",
    Type: "Standard",
    Seats: 100,
    Status: "Active",
    Price: 75000,
  });

  const handleSubmit = () => {
    if (!form.Name || form.Seats < 1) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    onAdd(cinemaId, form);
    setForm({ Name: "", Type: "Standard", Seats: 100, Status: "Active", Price: 75000 });
    onClose();
  };

  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#f1f5f9" : "#1a202c";
  const styles = isDark ? darkInputStyle : inputStyle;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="20px" border={`1px solid ${border}`}>
        <ModalHeader color={textColor} fontWeight="800" fontSize="18px">
          <Flex align="center" gap="10px">
            <Icon as={MdAdd} boxSize="22px" color="#f97316" />
            Thêm phòng chiếu mới
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={isDark ? "#94a3b8" : "#64748b"} />
        <ModalBody pb="24px">
          <VStack spacing="14px" align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                Tên phòng
              </FormLabel>
              <Input {...styles} placeholder="VD: Phòng 1 – IMAX"
                value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value })} />
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap="14px">
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Loại phòng
                </FormLabel>
                <Select {...styles} value={form.Type} onChange={(e) => setForm({ ...form, Type: e.target.value })}>
                  {Object.keys(ROOM_TYPE_CFG).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Số ghế
                </FormLabel>
                <Input {...styles} type="number" min="1" placeholder="100"
                  value={form.Seats} onChange={(e) => setForm({ ...form, Seats: parseInt(e.target.value) || 0 })} />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap="14px">
              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Trạng thái
                </FormLabel>
                <Select {...styles} value={form.Status} onChange={(e) => setForm({ ...form, Status: e.target.value })}>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Bảo trì</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>
                  Giá vé (VNĐ)
                </FormLabel>
                <Input {...styles} type="number" min="0" placeholder="75000"
                  value={form.Price} onChange={(e) => setForm({ ...form, Price: parseInt(e.target.value) || 0 })} />
              </FormControl>
            </Grid>
          </VStack>

          <Flex gap="10px" mt="20px" justify="flex-end">
            <Button h="42px" px="22px" variant="ghost"
              color={isDark ? "#94a3b8" : "#64748b"} borderRadius="10px" fontWeight="600" fontSize="13px"
              border={`1.5px solid ${border}`} _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
              onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
              color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
              transition="all 0.2s" onClick={handleSubmit}>
              Thêm phòng
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddRoomModal;