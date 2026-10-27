// src/views/admin/report/nhatkyhethong/components/AuditLogTable.jsx
import React from "react";
import { Box, Flex, Text, Button, Icon, Spinner, useColorModeValue } from "@chakra-ui/react";
import { MdHistory, MdVisibility } from "react-icons/md";
import { OR, COL, fadeUp } from "../constants";
import ActionBadge from "./ActionBadge";
import StatusBadge from "./shared/StatusBadge";

export function CH({ children, w, flex, pr }) {
  const c = useColorModeValue("gray.400", "whiteAlpha.400");
  return (
    <Box w={w} flex={flex} flexShrink={w ? "0" : undefined} pr={pr || "0"}>
      <Text fontSize="10px" fontWeight="800" color={c} letterSpacing="1px" textTransform="uppercase">{children}</Text>
    </Box>
  );
}

export default function AuditLogTable({ logs, loading, onViewLog, isMobile, isDark }) {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
        <Spinner size="xl" color={OR} thickness="4px" mb="10px" />
        <Text fontSize="13px" fontWeight="600">Đang tải nhật ký...</Text>
      </Flex>
    );
  }

  if (logs.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py="40px" color={mutedTextColor}>
        <Icon as={MdHistory} boxSize="32px" mb="8px" />
        <Text fontSize="13px" fontWeight="600">Không tìm thấy bản ghi nào</Text>
      </Flex>
    );
  }

  return (
    <Box>
      {!isMobile && (
        <Flex align="center" px="20px" py="10px" bg={useColorModeValue("#fafbfc", "rgba(255,255,255,0.02)")} borderBottom="1px solid" borderColor={cardBorder}>
          <CH w={COL.time}>Thời gian</CH>
          <CH w={COL.user} pr="10px">Người dùng</CH>
          <CH w={COL.action} pr="10px">Thao tác</CH>
          <CH flex="1" pr="10px">Mô tả</CH>
          <CH w={COL.ip} pr="10px">IP</CH>
          <CH w={COL.status} pr="10px">Trạng thái</CH>
          <CH w={COL.actions}>Xem</CH>
        </Flex>
      )}
      <Flex direction="column" gap="6px" pt={isMobile ? 0 : "10px"}>
        {logs.map((l, i) => {
          const isAbnormal = l.status === "Bất thường";
          return (
            <Flex key={l.id} align="center" px="16px" py="12px" borderRadius="10px" bg={isAbnormal ? "rgba(220,38,38,0.04)" : (isDark ? "rgba(255,255,255,0.015)" : "white")} border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.25)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9")}`} transition="all .2s" cursor="pointer" _hover={{ border: `1.5px solid ${isAbnormal ? "rgba(220,38,38,0.45)" : "rgba(234,88,12,0.35)"}`, transform: "translateY(-1px)" }} sx={{ animation: `${fadeUp} .3s ease ${i*.03}s both` }} onClick={() => onViewLog(l)}>
              <Box w={COL.time} flexShrink="0"><Text fontSize="11.5px" fontWeight="700" color={textColor}>{l.time}</Text></Box>
              <Box w={COL.user} flexShrink="0" pr="10px"><Text fontSize="12px" fontWeight="700" color={textColor} noOfLines={1}>{l.user}</Text><Text fontSize="10.5px" color={mutedTextColor} noOfLines={1}>{l.role}</Text></Box>
              <Box w={COL.action} flexShrink="0" pr="10px"><ActionBadge action={l.action} /></Box>
              <Box flex="1" minW="0" pr="10px"><Text fontSize="12px" fontWeight="500" color={useColorModeValue("#334155", "#e2e8f0")} noOfLines={1}>{l.target}</Text></Box>
              <Box w={COL.ip} flexShrink="0" pr="10px"><Text fontSize="11.5px" fontWeight="600" color={mutedTextColor}>{l.ip === '::1' ? '127.0.0.1' : l.ip}</Text></Box>
              <Box w={COL.status} flexShrink="0" pr="10px"><StatusBadge status={l.status} /></Box>
              <Box w={COL.actions} flexShrink="0"><Button size="xs" h="28px" w="28px" minW="28px" px="0" borderRadius="7px" bg={isDark ? "rgba(255,255,255,0.05)" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"} border={isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0"} _hover={{ bg: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }} onClick={(e) => { e.stopPropagation(); onViewLog(l); }}><Icon as={MdVisibility} boxSize="13px" /></Button></Box>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}