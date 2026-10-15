

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Input,
} from "@chakra-ui/react";
import { MdWarning, MdDelete, MdClose } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { DARK } from "../constants";
import { scaleIn, shimmer, shake } from "./shared/animations";

const inputSx = (isDark) => ({
  bg: isDark ? DARK.ink6 : "#fafafa",
  border: isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: isDark ? DARK.ink : "#1a202c",
  fontSize: "13px",
  fontWeight: "500",
  h: { base: "42px", md: "36px" },
  _placeholder: { color: isDark ? DARK.ink4 : "#b0bac8" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? DARK.bgCard : "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: isDark ? DARK.bgCard : "#fff" },
  transition: "all 0.2s",
});

const DeleteModal = ({ isOpen, onClose, role, onConfirm, isDark }) => {
  const [inputVal, setInputVal] = useState("");
  const [shaking, setShaking] = useState(false);
  
  if (!role) return null;
  
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  
  const handle = () => {
    if (inputVal !== role.RoleName) { 
      setShaking(true); 
      setTimeout(() => setShaking(false), 500); 
      return; 
    }
    onConfirm(role.RoleId);
    onClose();
    setInputVal("");
  };
  
  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setInputVal(""); }} isCentered size="md">
      <ModalOverlay bg="rgba(0,0,0,0.45)" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="18px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #fca5a5"} overflow="hidden" mx="16px" bg={bg}>
        <Box h="4px" bg="linear-gradient(90deg,#ef4444,#dc2626)" />
        <ModalHeader pt="20px" pb="6px" fontSize="16px" fontWeight="800" color={ink}>
          <Flex align="center" gap="10px">
            <Box w="38px" h="38px" borderRadius="10px" bg="#fef2f2"
              display="flex" alignItems="center" justifyContent="center"
            ><Icon as={FaTrash} boxSize="15px" color="#dc2626" /></Box>
            Xóa vai trò
          </Flex>
        </ModalHeader>
        <ModalCloseButton top="16px" right="16px" color={isDark ? DARK.ink4 : "#94a3b8"} />
        <ModalBody pb="4px">
          <Box p="14px" borderRadius="12px" bg="#fef2f2" border="1px solid #fca5a5" mb="16px">
            <Text fontSize="12.5px" color="#7f1d1d" fontWeight="500" lineHeight="1.7">
              ⚠️ Xóa vai trò <strong>{role.RoleName}</strong> sẽ ảnh hưởng đến người dùng đang sử dụng vai trò này.
            </Text>
          </Box>
          <Box mb="6px" p="12px" borderRadius="10px" bg={isDark ? DARK.ink6 : "#f8fafc"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}
          >
            <Text fontSize="12px" color={isDark ? DARK.ink4 : "#64748b"} mb="2px">Vai trò sẽ bị xóa:</Text>
            <Text fontSize="14px" fontWeight="700" color={ink}>{role.RoleName}</Text>
            <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"}>{role.Description || "Không có mô tả"}</Text>
          </Box>
          <Text fontSize="11.5px" color={isDark ? DARK.ink4 : "#64748b"} mb="8px" mt="14px">
            Nhập <strong style={{ color: "#dc2626" }}>{role.RoleName}</strong> để xác nhận:
          </Text>
          <Input {...inputSx(isDark)}
            placeholder={role.RoleName}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            sx={shaking ? { animation: `${shake} 0.4s ease` } : {}}
            borderColor={inputVal && inputVal !== role.RoleName ? "#fca5a5" : undefined}
          />
        </ModalBody>
        <ModalFooter gap="10px" pt="14px" pb="20px">
          <Button flex="1" h="42px" borderRadius="10px" fontWeight="600" fontSize="13px"
            variant="ghost" color={isDark ? DARK.ink3 : "#64748b"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
            onClick={() => { onClose(); setInputVal(""); }}
          >Hủy</Button>
          <Button flex="1" h="42px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={inputVal === role.RoleName ? "linear-gradient(135deg,#ef4444,#dc2626)" : (isDark ? DARK.ink6 : "#f1f5f9")}
            color={inputVal === role.RoleName ? "white" : (isDark ? DARK.ink4 : "#94a3b8")}
            boxShadow={inputVal === role.RoleName ? "0 4px 14px rgba(239,68,68,0.35)" : "none"}
            leftIcon={<Icon as={FaTrash} />}
            _hover={{ opacity: 0.88 }} transition="all 0.2s"
            onClick={handle}
          >Xóa vĩnh viễn</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;