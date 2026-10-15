// src/views/admin/quanlysuatchieu/components/BulkEditPriceModal.jsx

import React, { useState } from "react";
import {
  Box, Text, Button, Flex, Icon, Modal, ModalOverlay,
  ModalContent, ModalBody, Input, FormLabel, Grid,
} from "@chakra-ui/react";
import {
  MdAttachMoney, MdInfoOutline, MdClose, MdAdd,
} from "react-icons/md";
import { scaleIn, shimmer } from "./shared/animations";
import { SectionTitle } from "./shared/SectionTitle";
import { inputStyle } from "./FormField";
import { TIME_SLOTS_DEFAULT } from "../constants";

export const BulkEditPriceModal = ({ isOpen, onClose, onApply, isDark }) => {
  const [timeSlots, setTimeSlots] = useState(TIME_SLOTS_DEFAULT);
  const [movieFilter, setMovieFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const styles = inputStyle(isDark);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { id: Date.now(), from: "", to: "", price: "" }]);
  };

  const removeTimeSlot = (id) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    }
  };

  const updateTimeSlot = (id, field, value) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered motionPreset="none">
      <ModalOverlay
        bg={isDark ? "rgba(0,0,0,0.8)" : "rgba(15,23,42,0.6)"}
        backdropFilter="blur(10px)"
      />
      <ModalContent
        borderRadius="20px"
        border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
        bg={isDark ? "#1a202c" : "#ffffff"}
        boxShadow="0 32px 80px rgba(0,0,0,0.2)"
        sx={{ animation: `${scaleIn} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both` }}
        maxW="700px"
      >
        <Box
          h="3px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <ModalBody p="30px" maxH="80vh" overflowY="auto">
          <Flex align="center" gap="12px" mb="20px">
            <Box
              w="40px"
              h="40px"
              borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            >
              <Icon as={MdAttachMoney} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize="17px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>
                Chỉnh sửa giá vé theo khung giờ
              </Text>
              <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>
                Điều chỉnh giá vé hàng loạt theo khung giờ chiếu
              </Text>
            </Box>
          </Flex>

          <SectionTitle label="Bộ lọc áp dụng" isDark={isDark} />
          <Grid templateColumns="1fr 1fr" gap="12px" mb="20px">
            <Box>
              <FormLabel
                fontSize="10.5px"
                fontWeight="800"
                letterSpacing="0.9px"
                textTransform="uppercase"
                color={isDark ? "#a0aec0" : "#64748b"}
                mb="7px"
              >
                Phim
              </FormLabel>
              <Input
                {...styles}
                placeholder="Tất cả phim"
                value={movieFilter}
                onChange={e => setMovieFilter(e.target.value)}
              />
            </Box>
            <Box>
              <FormLabel
                fontSize="10.5px"
                fontWeight="800"
                letterSpacing="0.9px"
                textTransform="uppercase"
                color={isDark ? "#a0aec0" : "#64748b"}
                mb="7px"
              >
                Phòng chiếu
              </FormLabel>
              <Input
                {...styles}
                placeholder="Tất cả phòng"
                value={roomFilter}
                onChange={e => setRoomFilter(e.target.value)}
              />
            </Box>
          </Grid>

          <SectionTitle label="Khung giờ & Giá vé" isDark={isDark} />
          <Box mb="16px">
            {timeSlots.map((slot) => (
              <Flex key={slot.id} gap="8px" mb="8px" align="center">
                <Input
                  {...styles}
                  type="time"
                  w="100px"
                  value={slot.from}
                  onChange={e => updateTimeSlot(slot.id, "from", e.target.value)}
                  placeholder="Từ"
                />
                <Text fontSize="14px" color={isDark ? "#a0aec0" : "#64748b"} fontWeight="600">
                  →
                </Text>
                <Input
                  {...styles}
                  type="time"
                  w="100px"
                  value={slot.to}
                  onChange={e => updateTimeSlot(slot.id, "to", e.target.value)}
                  placeholder="Đến"
                />
                <Input
                  {...styles}
                  type="number"
                  flex="1"
                  value={slot.price}
                  onChange={e => updateTimeSlot(slot.id, "price", e.target.value)}
                  placeholder="Giá vé (VNĐ)"
                />
                {timeSlots.length > 1 && (
                  <Icon
                    as={MdClose}
                    boxSize="18px"
                    color="#ef4444"
                    cursor="pointer"
                    onClick={() => removeTimeSlot(slot.id)}
                  />
                )}
              </Flex>
            ))}
          </Box>
          <Button
            size="sm"
            variant="ghost"
            color="#f97316"
            fontWeight="600"
            leftIcon={<Icon as={MdAdd} />}
            onClick={addTimeSlot}
          >
            Thêm khung giờ
          </Button>

          <Box
            mt="20px"
            p="12px 16px"
            borderRadius="10px"
            bg={isDark ? "#2d3748" : "#fffbeb"}
            border={isDark ? "1px solid #4a5568" : "1px solid #fed7aa"}
          >
            <Flex gap="8px" align="flex-start">
              <Icon as={MdInfoOutline} boxSize="16px" color="#f97316" mt="1px" />
              <Text fontSize="12px" color={isDark ? "#a0aec0" : "#92400e"}>
                Áp dụng giá vé mới cho tất cả suất chiếu trong khung giờ đã chọn.
                Suất chiếu nào đã có vé sẽ được cảnh báo trước khi áp dụng.
              </Text>
            </Flex>
          </Box>

          <Flex gap="10px" mt="20px">
            <Button
              flex="1"
              h="44px"
              variant="ghost"
              color={isDark ? "#a0aec0" : "#64748b"}
              border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
              borderRadius="10px"
              fontWeight="600"
              fontSize="13px"
              _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              flex="1"
              h="44px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white"
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              _hover={{
                boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
                transform: "translateY(-1px)"
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdAttachMoney} />}
              onClick={() => {
                onApply(timeSlots, movieFilter, roomFilter);
                onClose();
              }}
            >
              Áp dụng thay đổi
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};