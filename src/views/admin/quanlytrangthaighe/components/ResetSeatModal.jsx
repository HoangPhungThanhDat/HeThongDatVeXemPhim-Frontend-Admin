// src/views/admin/quanlytrangthaighe/components/ResetSeatModal.jsx

import React, { useState } from "react";
import {
  Box, Button, Flex, Icon, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Text,
  Textarea
} from "@chakra-ui/react";
import { MdReplay, MdCheckCircle } from "react-icons/md";
import { SEAT_STATUS, ORANGE } from "../constants";
import { scaleIn, shimmer } from "./shared/animations";

export function ResetSeatModal({ seat, onClose, onConfirm, theme }) {
  const [note, setNote] = useState("");
  if (!seat) return null;
  const cfg = SEAT_STATUS[seat.status];
  const isDark = theme.isDark;

  return (
    <Modal isOpen={!!seat} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent
        borderRadius="20px"
        border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
        bg={theme.bgCard}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}
      >
        <Box
          h="4px"
          bg={`linear-gradient(90deg,${ORANGE.OR},${ORANGE.ORL},#fbbf24,${ORANGE.ORL},${ORANGE.OR})`}
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
          borderRadius="20px 20px 0 0"
        />
        <ModalHeader>
          <Flex align="center" gap="10px">
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg={ORANGE.ORGRAD}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 12px ${ORANGE.ORSW}`}
            >
              <Icon as={MdReplay} boxSize="16px" color="white" />
            </Box>
            <Box>
              <Text fontSize="17px" fontWeight="800" color={theme.text}>
                Đặt lại trạng thái ghế
              </Text>
              <Text fontSize="12px" color={theme.textMuted}>
                Quyền Admin — Reset ghế về trạng thái Trống
              </Text>
            </Box>
          </Flex>
          <ModalCloseButton color={theme.textMuted} />
        </ModalHeader>

        <ModalBody py="10px">
          <Flex
            align="center"
            gap="12px"
            p="14px"
            borderRadius="12px"
            bg={cfg.bg}
            border={`1px solid ${cfg.border}`}
            mb="14px"
          >
            <Box
              w="44px"
              h="44px"
              borderRadius="10px"
              bg="white"
              border={`1.5px solid ${cfg.border}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
            >
              <Text fontSize="14px" fontWeight="800" color={cfg.color}>
                {seat.id}
              </Text>
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="700" color={theme.text}>
                Ghế {seat.id} — {cfg.label}
              </Text>
              {seat.heldSince && (
                <Text fontSize="11.5px" color={theme.textMuted}>
                  Đang giữ từ {seat.heldSince}
                </Text>
              )}
              {seat.note && (
                <Text fontSize="11.5px" color={theme.textMuted}>
                  {seat.note}
                </Text>
              )}
            </Box>
          </Flex>

          <Text fontSize="13px" color={theme.textSub} mb="12px" lineHeight="1.6">
            Thao tác này sẽ giải phóng ghế <b>{seat.id}</b> về trạng thái <b>Trống</b>, hủy mọi phiên giữ ghế
            hoặc đánh dấu lỗi liên quan. Hành động được ghi log hệ thống.
          </Text>

          <Box>
            <Text
              fontSize="10.5px"
              fontWeight="800"
              letterSpacing=".9px"
              textTransform="uppercase"
              color={theme.textMuted}
              mb="7px"
            >
              Ghi chú nội bộ (tuỳ chọn)
            </Text>
            <Textarea
              bg={theme.inputBg}
              border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3"}
              borderRadius="10px"
              color={theme.text}
              fontSize="13.5px"
              rows={2}
              placeholder="VD: Reset do lỗi timeout thanh toán..."
              _focus={{ border: `1.5px solid ${ORANGE.OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)` }}
              _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>
        </ModalBody>

        <ModalFooter gap="10px" borderTop={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
          <Button
            h="42px"
            px="20px"
            variant="ghost"
            color={theme.textMuted}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            _hover={{ bg: theme.bgMuted }}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            h="42px"
            px="24px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={ORANGE.ORGRAD}
            color="white"
            boxShadow={`0 4px 16px ${ORANGE.ORSW}`}
            _hover={{
              boxShadow: `0 8px 24px rgba(234,88,12,.4)`,
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all .2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onConfirm(seat.id, note)}
          >
            Xác nhận đặt lại
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}