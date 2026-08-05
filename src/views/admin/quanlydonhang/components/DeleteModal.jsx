// src/views/admin/quanlydonhang/components/DeleteModal.jsx

import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { MdWarning, MdDelete } from "react-icons/md";
import { scaleIn } from "./shared/animations";
import { useFieldStyles } from "./shared/useFieldStyles";

export const DeleteModal = ({ order, onClose, onConfirm, isDark }) => {
  const [confirmCode, setConfirmCode] = useState("");
  const styles = useFieldStyles(isDark);
  const matches = confirmCode.trim() === order?.code;

  return (
    <Modal isOpen={!!order} onClose={() => { setConfirmCode(""); onClose(); }} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent
        borderRadius="18px"
        bg={isDark ? "#0b1437" : "white"}
        border={isDark ? "1px solid #2D3A6B" : "none"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .25s cubic-bezier(.22,1,.36,1) both` }}
      >
        <ModalBody pt="28px" pb="8px" textAlign="center">
          <Box
            w="52px"
            h="52px"
            borderRadius="14px"
            bg="#fef2f2"
            mx="auto"
            mb="14px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={MdWarning} boxSize="24px" color="#dc2626" />
          </Box>
          <Text fontSize="15px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} mb="6px">
            Xóa vĩnh viễn đơn hàng?
          </Text>
          <Text fontSize="13px" color={isDark ? "#a0aec0" : "#64748b"} mb="4px">
            Bạn sắp xóa đơn <b>{order?.code}</b> của khách <b>{order?.customerName}</b>.
          </Text>
          <Text fontSize="12.5px" color={isDark ? "#718096" : "#94a3b8"} mb="14px">
            Hành động này không thể hoàn tác. Chỉ dùng để xóa đơn test/rác.
          </Text>
          <Box textAlign="left">
            <Text
              fontSize="10.5px"
              fontWeight="800"
              letterSpacing="0.9px"
              textTransform="uppercase"
              color={isDark ? "#a0aec0" : "#64748b"}
              mb="7px"
            >
              Nhập <b>{order?.code}</b> để xác nhận
            </Text>
            <Input
              {...styles}
              h="40px"
              placeholder={order?.code}
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
            />
          </Box>
        </ModalBody>
        <ModalFooter gap="10px" pb="20px" pt="16px">
          <Button
            flex="1"
            h="42px"
            variant="ghost"
            color={isDark ? "#a0aec0" : "#64748b"}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#1B254B" : "#f8fafc" }}
            onClick={() => { setConfirmCode(""); onClose(); }}
          >
            Hủy bỏ
          </Button>
          <Button
            flex="1"
            h="42px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="linear-gradient(135deg,#dc2626,#ef4444)"
            color="white"
            boxShadow="0 4px 16px rgba(220,38,38,.3)"
            isDisabled={!matches}
            opacity={matches ? 1 : 0.5}
            _hover={matches ? { boxShadow: "0 8px 24px rgba(220,38,38,.4)", transform: "translateY(-1px)" } : {}}
            _active={{ transform: "translateY(0)" }}
            transition="all .2s"
            leftIcon={<Icon as={MdDelete} />}
            onClick={() => { if (matches) { onConfirm(order); setConfirmCode(""); } }}
          >
            Xóa vĩnh viễn
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};