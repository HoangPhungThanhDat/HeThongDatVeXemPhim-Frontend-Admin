// components/ContactProcess.jsx
import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, useColorMode,
  Grid, Textarea, Select, FormControl, FormLabel
} from "@chakra-ui/react";
import {
  MdArrowBack, MdPerson, MdEmail, MdPhone, MdSubject,
  MdMessage, MdCalendarToday, MdSend, MdCheckCircle,
  MdClose, MdOpenInNew
} from "react-icons/md";
import { fadeIn, fadeUp } from "./shared/animations";
import StatusBadge from "./shared/StatusBadge";
import SectionTitle from "./shared/SectionTitle";
import { DARK, STATUS_OPTIONS } from "../constants";

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function ContactProcess({
  contact,
  onBack,
  onUpdate,
  onComplete,
  onClose,
  isProcessing = false
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

  const [status, setStatus] = useState(contact.Status || contact.status || "Chưa xử lý");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const id = contact.ContactId ?? contact.id;
  const name = contact.FullName || contact.fullname || contact.Name || contact.name || "—";
  const email = contact.Email || contact.email || "—";
  const phone = contact.Phone || contact.phone || "—";
  const subject = contact.Subject || contact.subject || "—";
  const message = contact.Message || contact.message || "—";
  const date = contact.CreatedAt || contact.created_at || contact.createdAt || "—";

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    setSubmitting(true);
    try {
      await onUpdate(id, {
        Status: status,
        Reply: reply,
        Name: name,
        Email: email,
        Phone: phone,
        Subject: subject,
        Message: message,
      });
      setReply("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" mb="16px">
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={colors.textMuted}
          borderRadius="10px"
          h={{ base: "36px", md: "38px" }}
          fontSize={{ base: "12px", md: "13px" }}
          fontWeight="600"
          border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`}
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
          onClick={onBack}
        >
          Chi tiết yêu cầu
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }} gap="16px">
        <Box>
          <Box
            bg={colors.bgCard}
            borderRadius="16px"
            border={`1px solid ${colors.borderCard}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
            mb="14px"
            sx={{ animation: `${fadeUp} 0.35s ease both` }}
          >
            <SectionTitle label="Thông tin liên hệ" />
            <Flex direction="column" gap="8px">
              {[
                { label: "Mã liên hệ", val: `#${id}` },
                { label: "Khách hàng", val: name },
                { label: "Email", val: email },
                { label: "Số điện thoại", val: phone },
                { label: "Chủ đề", val: subject },
                { label: "Ngày gửi", val: date },
              ].map(({ label, val }) => (
                <Flex
                  key={label}
                  justify="space-between"
                  align="flex-start"
                  p="8px 12px"
                  borderRadius="8px"
                  bg={isDark ? "#2d3748" : "#f8fafc"}
                  gap="8px"
                >
                  <Text fontSize="11px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.8px" flexShrink="0">
                    {label}
                  </Text>
                  <Text fontSize="12.5px" fontWeight="600" color={colors.textPrimary} textAlign="right" noOfLines={2}>
                    {val}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          <Box
            bg={colors.bgCard}
            borderRadius="16px"
            border={`1px solid ${colors.borderCard}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.35s ease 0.05s both` }}
          >
            <SectionTitle label="Nội dung khách hàng" />
            <Box
              p="14px 16px"
              borderRadius="10px"
              bg={isDark ? "#2d3748" : "#fef2f2"}
              border={`1px solid ${isDark ? "#374151" : "#fca5a5"}`}
            >
              <Text fontSize={{ base: "13px", md: "13.5px" }} color={isDark ? "#cbd5e1" : "#334155"} lineHeight="1.75">
                {message}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box>
          <Box
            bg={colors.bgCard}
            borderRadius="16px"
            border={`1px solid ${colors.borderCard}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
            mb="14px"
            sx={{ animation: `${fadeUp} 0.35s ease 0.1s both` }}
          >
            <SectionTitle label="Phản hồi khách hàng" />

            <FormControl mb="12px">
              <FormLabel fontSize="12px" fontWeight="700" color={colors.textSecondary}>
                Trạng thái
              </FormLabel>
              <Select
                bg={isDark ? "#2d3748" : "#fafafa"}
                border={`1.5px solid ${isDark ? "#374151" : "#e8edf3"}`}
                borderRadius="10px"
                color={colors.textPrimary}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                _focus={{ border: `1.5px solid ${ORANGE}` }}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color={colors.textSecondary}>
                Nội dung phản hồi
              </FormLabel>
              <Textarea
                bg={isDark ? "#2d3748" : "#fafafa"}
                border={`1.5px solid ${isDark ? "#374151" : "#e8edf3"}`}
                borderRadius="10px"
                color={isDark ? "#f1f5f9" : "#1a202c"}
                fontSize="14px"
                fontWeight="500"
                px="14px"
                py="10px"
                _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
                _focus={{ border: `1.5px solid ${ORANGE}` }}
                _hover={{ border: `1.5px solid ${ORANGE}` }}
                transition="all 0.2s"
                rows={4}
                placeholder="Nhập nội dung phản hồi đến khách hàng..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>

            <Button
              w="100%"
              h="42px"
              mt="12px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg={reply ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : (isDark ? "#2d3748" : "#e2e8f0")}
              color={reply ? "white" : (isDark ? "#64748b" : "#94a3b8")}
              boxShadow={reply ? `0 4px 14px ${ORANGE_SHADOW}` : "none"}
              _hover={reply ? { boxShadow: `0 6px 20px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" } : {}}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              isDisabled={!reply || submitting}
              leftIcon={<Icon as={MdSend} />}
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Đang gửi..."
            >
              Gửi phản hồi (Email)
            </Button>
          </Box>

          <Box
            bg={colors.bgCard}
            borderRadius="16px"
            border={`1px solid ${colors.borderCard}`}
            boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
            p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.35s ease 0.15s both` }}
          >
            <SectionTitle label="Hành động" />
            <Flex direction="column" gap="10px">
              <Button
                h="44px"
                borderRadius="10px"
                fontWeight="700"
                fontSize="13px"
                bg="linear-gradient(135deg, #059669, #10b981)"
                color="white"
                boxShadow="0 4px 14px rgba(5,150,105,0.3)"
                _hover={{ boxShadow: "0 6px 20px rgba(5,150,105,0.4)", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                leftIcon={<Icon as={MdCheckCircle} />}
                onClick={() => onComplete(id)}
              >
                Đánh dấu đã xử lý
              </Button>
              <Button
                h="44px"
                borderRadius="10px"
                fontWeight="700"
                fontSize="13px"
                bg={isDark ? "#2d3748" : "#fef2f2"}
                color="#dc2626"
                border={`1.5px solid ${isDark ? "#374151" : "#fca5a5"}`}
                _hover={{ bg: isDark ? "#374151" : "#fee2e2", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                leftIcon={<Icon as={MdClose} />}
                onClick={() => onClose(id)}
              >
                Đóng liên hệ
              </Button>
            </Flex>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}