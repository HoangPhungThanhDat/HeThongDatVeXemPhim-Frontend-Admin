// components/ContactRow.jsx
import React from "react";
import { Box, Flex, Text, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdVisibility, MdReply, MdDelete } from "react-icons/md";
import { fadeUp } from "./shared/animations";
import StatusBadge from "./shared/StatusBadge";
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

export default function ContactRow({ contact, index, onView, onReply, onDelete, isDark }) {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : (colorMode === "dark");
  const colors = DARK[darkMode ? "dark" : "light"];

  // Dark mode colors
  const accentColor = darkMode ? DARK_THEME.accent : ORANGE;
  const accentShadow = darkMode ? DARK_THEME.accentShadow : "rgba(234,88,12,0.25)";
  const gradientBg = darkMode 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #ea580c, #fb923c)";
  const borderCard = darkMode ? DARK_THEME.border : "#f1f5f9";
  const textPrimary = darkMode ? DARK_THEME.text : "#0f172a";
  const textBody = darkMode ? DARK_THEME.textSecondary : "#334155";
  const textMuted = darkMode ? DARK_THEME.textSecondary : "#64748b";
  const bgCard = darkMode ? DARK_THEME.cardBg : "white";
  const bgCardHover = darkMode ? DARK_THEME.hoverBg : "#fffbf7";
  const btnBg = darkMode ? DARK_THEME.inputBg : "#f8fafc";
  const btnColor = darkMode ? DARK_THEME.textSecondary : "#475569";
  const btnBorder = darkMode ? DARK_THEME.border : "#e2e8f0";
  const btnHoverBg = darkMode ? DARK_THEME.hoverBg : "#f1f5f9";
  const sttColor = darkMode ? DARK_THEME.border : "#cbd5e1";

  const id = contact.ContactId ?? contact.id;
  const name = contact.FullName || contact.fullname || contact.Name || contact.name || "—";
  const email = contact.Email || contact.email || "—";
  const phone = contact.Phone || contact.phone || "—";
  const subject = contact.Subject || contact.subject || "—";
  const status = contact.Status || contact.status || "Chưa xử lý";
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
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Flex
      align="center"
      px="16px"
      py="12px"
      borderRadius="10px"
      bg={bgCard}
      border={`1.5px solid ${borderCard}`}
      transition="all 0.2s"
      _hover={{
        border: `1.5px solid ${accentColor}`,
        boxShadow: `0 2px 12px ${accentShadow}`,
        bg: bgCardHover,
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      display={{ base: "none", md: "flex" }}
    >
      {/* STT */}
      <Box w="45px" flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color={sttColor}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>

      {/* Họ tên */}
      <Box w="150px" flexShrink="0" pr="12px">
        <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={1}>
          {name}
        </Text>
        <Text fontSize="11px" color={textMuted} noOfLines={1}>
          {email}
        </Text>
      </Box>

      {/* Số điện thoại */}
      <Box w="120px" flexShrink="0" pr="12px">
        <Text fontSize="12px" fontWeight="600" color={textBody}>
          {phone}
        </Text>
      </Box>

      {/* Chủ đề */}
      <Box flex="1" minW="0" pr="12px">
        <Text fontSize="13px" fontWeight="600" color={textPrimary} noOfLines={1}>
          {subject}
        </Text>
      </Box>

      {/* Ngày gửi */}
      <Box w="110px" flexShrink="0" pr="12px">
        <Text fontSize="11.5px" fontWeight="600" color={textMuted}>
          {formatDate(date)}
        </Text>
      </Box>

      {/* Trạng thái */}
      <Box w="130px" flexShrink="0" pr="12px">
        <StatusBadge status={status} isDark={darkMode} />
      </Box>

      {/* Hành động */}
      <Box w="180px" flexShrink="0">
        <Flex gap="6px" justify="flex-end">
          <Button
            size="xs"
            h="30px"
            px="10px"
            borderRadius="8px"
            bg={btnBg}
            color={btnColor}
            border={`1px solid ${btnBorder}`}
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: btnHoverBg }}
            onClick={() => onView(contact)}
          >
            Chi tiết
          </Button>
          <Button
            size="xs"
            h="30px"
            px="10px"
            borderRadius="8px"
            bg={gradientBg}
            color="white"
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdReply} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow={`0 2px 8px ${accentShadow}`}
            onClick={() => onReply(contact)}
          >
            Phản hồi
          </Button>
          <Button
            size="xs"
            h="30px"
            w="30px"
            p="0"
            borderRadius="8px"
            bg={btnBg}
            color={btnColor}
            border={`1px solid ${btnBorder}`}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            onClick={() => onDelete(id)}
          >
            <Icon as={MdDelete} boxSize="14px" />
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}