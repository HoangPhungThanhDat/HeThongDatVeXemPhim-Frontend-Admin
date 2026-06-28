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

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

export default function ContactDetail({
  contact,
  onBack,
  onUpdate,
  onProcess,
  isProcessing = false
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = DARK[isDark ? "dark" : "light"];
  const toast = useToast();

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
          color={colors.textMuted}
          borderRadius="10px"
          h={{ base: "36px", md: "38px" }}
          fontSize={{ base: "12px", md: "13px" }}
          fontWeight="600"
          border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`}
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
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
            bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
            color="white"
            boxShadow={`0 4px 14px ${ORANGE_SHADOW}`}
            _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" }}
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
        bg={colors.bgCard}
        borderRadius="18px"
        border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        overflow="hidden"
        mb="16px"
      >
        <Box
          h="4px"
          bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT})`}
        />

        <Box p={{ base: "16px", md: "26px" }}>
          <Flex justify="space-between" align="flex-start" mb="14px" gap="8px">
            <Box flex="1" minW="0">
              <Flex align="center" gap="8px" mb="8px" flexWrap="wrap">
                <Text fontSize={{ base: "15px", md: "20px" }} fontWeight="800" color={colors.textPrimary}>
                  #{id}
                </Text>
                <StatusBadge status={status} />
              </Flex>
            </Box>
            <Text fontSize="11px" color={colors.textMuted} fontWeight="600" flexShrink="0" mt="4px">
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
                bg={isDark ? "#2d3748" : "#f8fafc"}
                border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}
                gridColumn={full ? { base: "span 1", sm: "span 2" } : "span 1"}
              >
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={ORANGE} />
                  <Text fontSize="9.5px" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.8px">
                    {label}
                  </Text>
                </Flex>
                <Text fontSize="13px" fontWeight="700" color={colors.textPrimary} noOfLines={full ? 4 : 1}>
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
              bg={isDark ? "#2d3748" : "#ecfdf5"}
              border={`1px solid ${isDark ? "#374151" : "#6ee7b7"}`}
              mt="4px"
            >
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#34d399" : "#059669"} letterSpacing="1px" textTransform="uppercase" mb="6px">
                📩 Phản hồi từ Admin
              </Text>
              <Text fontSize="13px" color={isDark ? "#cbd5e1" : "#334155"} lineHeight="1.7">
                {reply}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}