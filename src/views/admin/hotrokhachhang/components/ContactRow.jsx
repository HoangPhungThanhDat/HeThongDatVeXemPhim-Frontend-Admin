// components/ContactRow.jsx
import React from "react";
import { Box, Flex, Text, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdVisibility, MdReply, MdDelete } from "react-icons/md";
import { fadeUp } from "./shared/animations";
import StatusBadge from "./shared/StatusBadge";
import { DARK } from "../constants";

const ORANGE = "#ea580c";

export default function ContactRow({ contact, index, onView, onReply, onDelete }) {
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
    <Flex
      align="center"
      px="16px"
      py="12px"
      borderRadius="10px"
      bg={colors.bgCard}
      border={`1.5px solid ${colors.borderCard}`}
      transition="all 0.2s"
      _hover={{
        border: `1.5px solid ${ORANGE}`,
        boxShadow: `0 2px 12px rgba(234,88,12,0.08)`,
        bg: colors.bgCardHover,
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      display={{ base: "none", md: "flex" }}
    >
      {/* STT */}
      <Box w="45px" flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color={isDark ? "#475569" : "#cbd5e1"}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>

      {/* Họ tên */}
      <Box w="150px" flexShrink="0" pr="12px">
        <Text fontSize="13px" fontWeight="700" color={colors.textPrimary} noOfLines={1}>
          {name}
        </Text>
        <Text fontSize="11px" color={colors.textMuted} noOfLines={1}>
          {email}
        </Text>
      </Box>

      {/* Số điện thoại */}
      <Box w="120px" flexShrink="0" pr="12px">
        <Text fontSize="12px" fontWeight="600" color={colors.textBody}>
          {phone}
        </Text>
      </Box>

      {/* Chủ đề */}
      <Box flex="1" minW="0" pr="12px">
        <Text fontSize="13px" fontWeight="600" color={colors.textPrimary} noOfLines={1}>
          {subject}
        </Text>
      </Box>

      {/* Ngày gửi */}
      <Box w="110px" flexShrink="0" pr="12px">
        <Text fontSize="11.5px" fontWeight="600" color={colors.textMuted}>
          {formatDate(date)}
        </Text>
      </Box>

      {/* Trạng thái */}
      <Box w="130px" flexShrink="0" pr="12px">
        <StatusBadge status={status} />
      </Box>

      {/* Hành động */}
      <Box w="180px" flexShrink="0">
        <Flex gap="6px" justify="flex-end">
          <Button
            size="xs"
            h="30px"
            px="10px"
            borderRadius="8px"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
            onClick={() => onView(contact)}
          >
            Chi tiết
          </Button>
          <Button
            size="xs"
            h="30px"
            px="10px"
            borderRadius="8px"
            bg="linear-gradient(135deg, #ea580c, #fb923c)"
            color="white"
            fontSize="11px"
            fontWeight="600"
            leftIcon={<Icon as={MdReply} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(234,88,12,0.25)"
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
    </Flex>
  );
}