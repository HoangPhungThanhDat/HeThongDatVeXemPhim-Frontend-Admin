// src/views/admin/quanlynguoidung/components/NotificationModal.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Input, Textarea,
} from "@chakra-ui/react";
import {
  MdClose, MdSend, MdCheckCircle, MdPhoneAndroid, MdEmail,
} from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { DARK } from "../constants";
import { scaleIn, shimmer } from "./shared/animations";

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

const NotificationModal = ({ isOpen, onClose, user, isDark }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("app");
  const [sent, setSent] = useState(false);
  
  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";

  const handleSend = () => {
    if (!title.trim() || !content.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); setTitle(""); setContent(""); }, 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="rgba(0,0,0,0.45)" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="18px" border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #fed7aa"} overflow="hidden" mx="16px" bg={bg}>
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <ModalHeader pt="20px" pb="6px" fontSize="16px" fontWeight="800" color={ink}>
          <Flex align="center" gap="10px">
            <Box w="38px" h="38px" borderRadius="10px"
              bg="linear-gradient(135deg,#fff7ed,#ffedd5)"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={FaBell} boxSize="15px" color="#f97316" />
            </Box>
            Gửi thông báo
          </Flex>
        </ModalHeader>
        <ModalCloseButton top="16px" right="16px" color={isDark ? DARK.ink4 : "#94a3b8"} />
        <ModalBody pb="4px">
          {user && (
            <Flex align="center" gap="10px" p="10px 12px" borderRadius="10px"
              bg={isDark ? DARK.ink6 : "#f8fafc"} border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"} mb="16px"
            >
              <Box flex="1" minW="0">
                <Text fontSize="13px" fontWeight="700" color={ink}>{user.FullName}</Text>
                <Text fontSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"}>{user.Email}</Text>
              </Box>
            </Flex>
          )}
          <Flex direction="column" gap="12px">
            <Box>
              <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                letterSpacing="0.9px" textTransform="uppercase" mb="7px">Tiêu đề *</Text>
              <Input {...inputSx(isDark)} placeholder="VD: Khuyến mãi đặc biệt cho bạn!"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </Box>
            <Box>
              <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                letterSpacing="0.9px" textTransform="uppercase" mb="7px">Nội dung *</Text>
              <Textarea
                bg={isDark ? DARK.ink6 : "#fafafa"}
                border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e8edf3"}
                borderRadius="10px"
                color={isDark ? DARK.ink : "#1a202c"}
                fontSize="13px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: isDark ? DARK.ink4 : "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? DARK.bgCard : "#fff" }}
                _hover={{ border: "1.5px solid #f97316", bg: isDark ? DARK.bgCard : "#fff" }}
                rows={3} placeholder="Nội dung thông báo gửi đến người dùng..."
                value={content} onChange={(e) => setContent(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK.ink3 : "#64748b"}
                letterSpacing="0.9px" textTransform="uppercase" mb="7px">Kênh gửi</Text>
              <Flex gap="8px">
                {[
                  { key: "app",   label: "Trong app",  icon: MdPhoneAndroid },
                  { key: "email", label: "Email",      icon: MdEmail },
                  { key: "both",  label: "Cả hai",     icon: MdSend },
                ].map(({ key, label, icon: Ic }) => (
                  <Box key={key} flex="1" p="10px 8px" borderRadius="10px" cursor="pointer"
                    bg={channel === key ? "#fff7ed" : (isDark ? DARK.ink6 : "#f8fafc")}
                    border={`1.5px solid ${channel === key ? "#f97316" : (isDark ? DARK.ink5 : "#e2e8f0")}`}
                    onClick={() => setChannel(key)}
                    transition="all 0.15s"
                    _hover={{ border: "1.5px solid #f97316" }}
                    textAlign="center"
                  >
                    <Icon as={Ic} boxSize="14px" color={channel === key ? "#f97316" : (isDark ? DARK.ink4 : "#94a3b8")} mb="3px" />
                    <Text fontSize="11px" fontWeight="700"
                      color={channel === key ? "#f97316" : (isDark ? DARK.ink4 : "#64748b")}>{label}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter gap="10px" pt="14px" pb="20px">
          <Button flex="1" h="42px" borderRadius="10px" fontWeight="600" fontSize="13px"
            variant="ghost" color={isDark ? DARK.ink3 : "#64748b"} 
            border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
            onClick={onClose}
          >Hủy</Button>
          <Button flex="1" h="42px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={sent
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#f97316,#fb923c)"}
            color="white"
            boxShadow={sent ? "0 4px 14px rgba(16,185,129,0.35)" : "0 4px 14px rgba(249,115,22,0.35)"}
            leftIcon={<Icon as={sent ? MdCheckCircle : MdSend} />}
            _hover={{ opacity: 0.88 }} transition="all 0.3s"
            onClick={handleSend}
          >{sent ? "Đã gửi!" : "Gửi thông báo"}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal;