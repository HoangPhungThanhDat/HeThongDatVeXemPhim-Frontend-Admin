// src/views/admin/quanlysuatchieu/components/CloneWeekModal.jsx

import React, { useState } from "react";
import {
  Box, Text, Button, Flex, Icon, Modal, ModalOverlay,
  ModalContent, ModalBody, Input, FormLabel,
} from "@chakra-ui/react";
import {
  MdContentCopy, MdCalendarToday, MdInfoOutline, MdClose,
} from "react-icons/md";
import { scaleIn, shimmer } from "./shared/animations";
import { inputStyle } from "./FormField";

export const CloneWeekModal = ({ isOpen, onClose, onClone, isDark }) => {
  const [targetWeek, setTargetWeek] = useState("");
  const styles = inputStyle(isDark);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="none">
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
        maxW="500px"
      >
        <Box
          h="3px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <ModalBody p="30px">
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
              <Icon as={MdContentCopy} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize="17px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>
                Nhân bản lịch tuần
              </Text>
              <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>
                Sao chép lịch tuần hiện tại sang tuần mới
              </Text>
            </Box>
          </Flex>

          <Box mb="24px">
            <FormLabel
              fontSize="10.5px"
              fontWeight="800"
              letterSpacing="0.9px"
              textTransform="uppercase"
              color={isDark ? "#a0aec0" : "#64748b"}
              mb="7px"
              display="flex"
              alignItems="center"
              gap="6px"
            >
              <Icon as={MdCalendarToday} boxSize="10px" color="#f97316" />
              Tuần đích (tuần bắt đầu)
            </FormLabel>
            <Input
              {...styles}
              type="date"
              value={targetWeek}
              onChange={e => setTargetWeek(e.target.value)}
              placeholder="Chọn ngày bắt đầu tuần"
            />
          </Box>

          <Box
            p="12px 16px"
            borderRadius="10px"
            bg={isDark ? "#2d3748" : "#fffbeb"}
            border={isDark ? "1px solid #4a5568" : "1px solid #fed7aa"}
            mb="24px"
          >
            <Flex gap="8px" align="flex-start">
              <Icon as={MdInfoOutline} boxSize="16px" color="#f97316" mt="1px" />
              <Text fontSize="12px" color={isDark ? "#a0aec0" : "#92400e"}>
                Sẽ sao chép tất cả suất chiếu từ tuần hiện tại sang tuần mới.
                Giữ nguyên phim, phòng, giờ chiếu và cập nhật ngày chiếu mới.
              </Text>
            </Flex>
          </Box>

          <Flex gap="10px">
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
              leftIcon={<Icon as={MdContentCopy} />}
              isDisabled={!targetWeek}
              onClick={() => {
                onClone(targetWeek);
                setTargetWeek("");
                onClose();
              }}
            >
              Nhân bản
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};