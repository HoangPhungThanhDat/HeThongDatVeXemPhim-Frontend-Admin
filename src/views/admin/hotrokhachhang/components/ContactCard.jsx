// components/ContactCard.jsx
import React from "react";
import { Box, Flex, Text, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdVisibility, MdReply, MdDelete, MdEmail, MdPhone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { fadeUp } from "./shared/animations";
import StatusBadge from "./shared/StatusBadge";
import { DARK } from "../constants";

const ORANGE = "#ea580c";

export default function ContactCard({ contact, index, onView, onReply, onDelete }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];

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
    <Box
      p="14px"
      borderRadius="12px"
      bg={colors.bgCard}
      border={`1.5px solid ${colors.borderCard}`}
      transition="all 0.2s"
      _active={{ border: `1.5px solid ${ORANGE}`, bg: colors.bgCardHover }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      display={{ base: "block", md: "none" }}
    >
      {/* Header: Avatar + Tên + Ngày */}
      <Flex justify="space-between" align="center" mb="8px">
        <Flex align="center" gap="8px">
          <Box
            w="28px"
            h="28px"
            borderRadius="full"
            bg={isDark ? "#2d3748" : "#f1f5f9"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaUserCircle} boxSize="16px" color={isDark ? "#94a3b8" : "#64748b"} />
          </Box>
          <Box>
            <Text fontSize="13px" fontWeight="700" color={colors.textPrimary} noOfLines={1}>
              {name}
            </Text>
            <Text fontSize="11px" color={colors.textMuted} noOfLines={1}>
              {email}
            </Text>
          </Box>
        </Flex>
        <Text fontSize="10px" color={colors.textMuted} flexShrink="0">
          {formatDate(date)}
        </Text>
      </Flex>

      {/* Chủ đề */}
      <Text fontSize="13px" fontWeight="600" color={colors.textPrimary} noOfLines={2} mb="8px">
        {subject}
      </Text>

      {/* Số điện thoại + Trạng thái */}
      <Flex justify="space-between" align="center" mb="10px">
        <Flex align="center" gap="4px">
          <Icon as={MdPhone} boxSize="12px" color={colors.textMuted} />
          <Text fontSize="12px" color={colors.textMuted}>
            {phone}
          </Text>
        </Flex>
        <StatusBadge status={status} />
      </Flex>

      {/* Actions */}
      <Flex gap="6px">
        <Button
          flex="1"
          size="sm"
          h="34px"
          borderRadius="8px"
          bg={isDark ? "#2d3748" : "#f8fafc"}
          color={isDark ? "#94a3b8" : "#475569"}
          border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
          fontSize="12px"
          fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
          _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
          onClick={() => onView(contact)}
        >
          Chi tiết
        </Button>
        <Button
          flex="1"
          size="sm"
          h="34px"
          borderRadius="8px"
          bg="linear-gradient(135deg, #ea580c, #fb923c)"
          color="white"
          fontSize="12px"
          fontWeight="600"
          leftIcon={<Icon as={MdReply} boxSize="13px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 8px rgba(234,88,12,0.25)"
          onClick={() => onReply(contact)}
        >
          Phản hồi
        </Button>
        <Button
          size="sm"
          h="34px"
          w="34px"
          p="0"
          borderRadius="8px"
          bg={isDark ? "#2d3748" : "#f8fafc"}
          color={isDark ? "#94a3b8" : "#475569"}
          border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
          _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
          onClick={() => onDelete(id)}
        >
          <Icon as={MdDelete} boxSize="14px" />
        </Button>
      </Flex>
    </Box>
  );
}