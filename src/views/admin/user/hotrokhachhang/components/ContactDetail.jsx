// components/ContactDetail.jsx
import React from "react";
import {
  Box, Flex, Text, Button, Icon, useColorMode,
  SimpleGrid, useToast
} from "@chakra-ui/react";
import {
  MdArrowBack, MdPerson, MdEmail, MdPhone, MdSubject,
  MdMessage, MdCalendarToday, MdReply
} from "react-icons/md";
import { fadeIn } from "./shared/animations";
import StatusBadge from "./shared/StatusBadge";
import SectionTitle from "./shared/SectionTitle";
import { DARK } from "../constants";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
};

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function ContactDetail({
  contact,
  onBack,
  onUpdate,
  onProcess,
  isProcessing = false,
  isDark
}) {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : (colorMode === "dark");
  const colors = DARK[darkMode ? "dark" : "light"];
  const toast = useToast();

  // Dark mode colors
  const accentColor = darkMode ? DARK_THEME.accent : ORANGE;
  const accentShadow = darkMode ? DARK_THEME.accentShadow : ORANGE_SHADOW;
  const gradientBg = darkMode 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`;
  const borderCard = darkMode ? DARK_THEME.border : "#e2e8f0";
  const textPrimary = darkMode ? DARK_THEME.text : "#0f172a";
  const textMuted = darkMode ? DARK_THEME.textSecondary : "#64748b";
  const textBody = darkMode ? DARK_THEME.text : "#334155";
  const bgCard = darkMode ? DARK_THEME.cardBg : "white";
  const detailBg = darkMode ? DARK_THEME.inputBg : "#f8fafc";
  const detailBorder = darkMode ? DARK_THEME.border : "#f1f5f9";
  const replyBg = darkMode ? DARK_THEME.inputBg : "#ecfdf5";
  const replyBorder = darkMode ? DARK_THEME.border : "#6ee7b7";
  const replyColor = darkMode ? DARK_THEME.accent : "#059669";
  const replyTextColor = darkMode ? DARK_THEME.text : "#334155";
  const btnBg = darkMode ? DARK_THEME.inputBg : "#f8fafc";
  const btnBorder = darkMode ? DARK_THEME.border : "#e2e8f0";
  const btnHoverBg = darkMode ? DARK_THEME.hoverBg : "#f8fafc";

  const id = contact.ContactId ?? contact.id;
  const name = contact.FullName || contact.fullname || contact.Name || contact.name || "—";
  const email = contact.Email || contact.email || "—";
  const phone = contact.Phone || contact.phone || "—";
  const subject = contact.Subject || contact.subject || "—";
  const message = contact.Message || contact.message || "—";
  const status = contact.Status || contact.status || "Chưa xử lý";
  const reply = contact.Reply || contact.reply || "";
  const date = contact.CreatedAt || contact.created_at || contact.createdAt || "—";

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "—") return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const handleProcess = () => {
    if (status === "Đã xử lý") {
      toast({
        title: "Liên hệ này đã được xử lý",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onProcess(contact);
  };

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="16px" gap="8px">
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={textMuted}
          borderRadius="10px"
          h={{ base: "36px", md: "38px" }}
          fontSize={{ base: "12px", md: "13px" }}
          fontWeight="600"
          border={`1.5px solid ${darkMode ? DARK_THEME.border : "#e2e8f0"}`}
          _hover={{ bg: darkMode ? DARK_THEME.hoverBg : "#f8fafc" }}
          onClick={onBack}
        >
          Quay lại
        </Button>
        {status !== "Đã xử lý" && (
          <Button
            h={{ base: "36px", md: "40px" }}
            px={{ base: "14px", md: "20px" }}
            borderRadius="10px"
            fontWeight="700"
            fontSize={{ base: "12px", md: "13px" }}
            bg={gradientBg}
            color="white"
            boxShadow={`0 4px 14px ${accentShadow}`}
            _hover={{ boxShadow: `0 6px 20px ${accentShadow}`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdReply} />}
            onClick={handleProcess}
            isDisabled={isProcessing}
          >
            Xử lý yêu cầu
          </Button>
        )}
      </Flex>

      <Box
        bg={bgCard}
        borderRadius="18px"
        border={`1px solid ${borderCard}`}
        boxShadow={darkMode ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"}
        overflow="hidden"
        mb="16px"
      >
        <Box
          h="4px"
          bg={gradientBg}
        />

        <Box p={{ base: "16px", md: "26px" }}>
          <Flex justify="space-between" align="flex-start" mb="14px" gap="8px">
            <Box flex="1" minW="0">
              <Flex align="center" gap="8px" mb="8px" flexWrap="wrap">
                <Text fontSize={{ base: "15px", md: "20px" }} fontWeight="800" color={textPrimary}>
                  #{id}
                </Text>
                <StatusBadge status={status} isDark={darkMode} />
              </Flex>
            </Box>
            <Text fontSize="11px" color={textMuted} fontWeight="600" flexShrink="0" mt="4px">
              {formatDate(date)}
            </Text>
          </Flex>

          {/* Thông tin chi tiết */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px" mb="14px">
            {[
              { icon: MdPerson, label: "Họ tên", val: name },
              { icon: MdEmail, label: "Email", val: email },
              { icon: MdPhone, label: "Số điện thoại", val: phone },
              { icon: MdSubject, label: "Chủ đề", val: subject },
              { icon: MdMessage, label: "Nội dung", val: message, full: true },
            ].map(({ icon: Ic, label, val, full }) => (
              <Box
                key={label}
                p="10px 14px"
                borderRadius="10px"
                bg={detailBg}
                border={`1px solid ${detailBorder}`}
                gridColumn={full ? { base: "span 1", sm: "span 2" } : "span 1"}
              >
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={accentColor} />
                  <Text fontSize="9.5px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.8px">
                    {label}
                  </Text>
                </Flex>
                <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={full ? 4 : 1}>
                  {val}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Phản hồi (nếu có) */}
          {reply && (
            <Box
              p="14px 16px"
              borderRadius="12px"
              bg={replyBg}
              border={`1px solid ${replyBorder}`}
              mt="4px"
            >
              <Text fontSize="10px" fontWeight="800" color={replyColor} letterSpacing="1px" textTransform="uppercase" mb="6px">
                📩 Phản hồi từ Admin
              </Text>
              <Text fontSize="13px" color={replyTextColor} lineHeight="1.7">
                {reply}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}