// src/views/admin/quanlytrangthaighe/components/SeatInfoPanel.jsx

import React from "react";
import {
  Box, Button, Flex, Icon, Text, VStack
} from "@chakra-ui/react";
import { MdReplay, MdLock, MdPerson, MdWarning, MdCheckCircle, MdInfoOutline } from "react-icons/md";
import { FaTicketAlt, FaUserClock } from "react-icons/fa";
import { SEAT_STATUS, SEAT_STATUS_DEFAULT, ORANGE } from "../constants";
import { SectionTitle } from "./shared/SectionTitle";
import { pulseDot } from "./shared/animations";

export function SeatInfoPanel({ selectedSeat, onReset, onDelete, theme }) {
  // ✅ Fallback cho theme
  const safeTheme = theme || {
    isDark: false,
    bgCard: "white",
    bgMuted: "#f8fafc",
    text: "#0f172a",
    textMuted: "#94a3b8",
    textSub: "#64748b",
  };

  if (!selectedSeat) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        minH="300px"
        gap="12px"
      >
        <Icon
          as={MdInfoOutline}
          boxSize="48px"
          color={safeTheme.isDark ? "#4a5568" : "#cbd5e1"}
        />
        <Text fontSize="14px" fontWeight="600" color={safeTheme.textMuted} textAlign="center">
          Chọn một ghế trên sơ đồ<br />để xem chi tiết
        </Text>
      </Flex>
    );
  }

  // ✅ Lấy status an toàn
  const statusKey = selectedSeat.status || 'trong';
  const cfg = SEAT_STATUS[statusKey] || SEAT_STATUS_DEFAULT;

  // Kiểm tra xem có thể reset không
  const canReset = statusKey === "giu" || statusKey === "loi";

  return (
    <>
      <SectionTitle label="Chi tiết ghế" icon={MdInfoOutline} theme={safeTheme} />

      <Flex align="center" gap="14px" mb="18px">
        <Box
          w="56px"
          h="56px"
          borderRadius="14px"
          bg={cfg.bg}
          border={`2px solid ${cfg.border}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="18px" fontWeight="800" color={cfg.color}>
            {selectedSeat.row || ''}{selectedSeat.num || ''}
          </Text>
        </Box>
        <Box>
          <Text fontSize="16px" fontWeight="800" color={safeTheme.text}>
            Ghế {selectedSeat.row || ''}{selectedSeat.num || ''}
          </Text>
          <Flex align="center" gap="6px">
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={cfg.dot}
              sx={statusKey === "giu" ? { animation: `${pulseDot} 2s infinite` } : undefined}
            />
            <Text
              fontSize="14px"
              fontWeight="700"
              color={cfg.color}
            >
              {cfg.label}
            </Text>
          </Flex>
        </Box>
      </Flex>

      <VStack spacing="10px" align="stretch" mb="18px">
        {selectedSeat.ticket_code && (
          <Box p="10px 12px" borderRadius="10px" bg={safeTheme.bgMuted} border={safeTheme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Flex align="center" gap="6px" mb="2px">
              <Icon as={FaTicketAlt} boxSize="12px" color={ORANGE.OR} />
              <Text fontSize="9px" fontWeight="700" color={safeTheme.textMuted} letterSpacing="0.8px" textTransform="uppercase">Mã vé</Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={safeTheme.text}>{selectedSeat.ticket_code}</Text>
          </Box>
        )}

        {selectedSeat.customer_name && (
          <Box p="10px 12px" borderRadius="10px" bg={safeTheme.bgMuted} border={safeTheme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Flex align="center" gap="6px" mb="2px">
              <Icon as={MdPerson} boxSize="12px" color={ORANGE.OR} />
              <Text fontSize="9px" fontWeight="700" color={safeTheme.textMuted} letterSpacing="0.8px" textTransform="uppercase">Khách hàng</Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={safeTheme.text}>{selectedSeat.customer_name}</Text>
          </Box>
        )}

        {selectedSeat.heldSince && (
          <Box p="10px 12px" borderRadius="10px" bg={ORANGE.ORPL} border={`1.5px solid ${ORANGE.ORBD}`}>
            <Flex align="center" gap="6px" mb="2px">
              <Icon as={FaUserClock} boxSize="12px" color={ORANGE.OR} />
              <Text fontSize="9px" fontWeight="700" color={ORANGE.OR} letterSpacing="0.8px" textTransform="uppercase">Thời gian giữ</Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={safeTheme.text}>{selectedSeat.heldSince}</Text>
          </Box>
        )}

        {selectedSeat.note && (
          <Box p="10px 12px" borderRadius="10px" bg="#f5f3ff" border="1.5px solid #c4b5fd">
            <Flex align="center" gap="6px" mb="2px">
              <Icon as={MdWarning} boxSize="12px" color="#7c3aed" />
              <Text fontSize="9px" fontWeight="700" color="#7c3aed" letterSpacing="0.8px" textTransform="uppercase">Ghi chú</Text>
            </Flex>
            <Text fontSize="12.5px" fontWeight="600" color="#5b21b6">{selectedSeat.note}</Text>
          </Box>
        )}

        {!selectedSeat.ticket_code && !selectedSeat.heldSince && !selectedSeat.note && (
          <Flex align="center" gap="8px" p="12px" borderRadius="10px" bg={safeTheme.bgMuted} border={safeTheme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Icon as={MdCheckCircle} boxSize="18px" color="#10b981" />
            <Text fontSize="13px" fontWeight="600" color={safeTheme.textMuted}>Ghế đang trống, sẵn sàng đặt</Text>
          </Flex>
        )}
      </VStack>

      {canReset ? (
        <Button
          w="100%"
          h="48px"
          borderRadius="12px"
          fontWeight="700"
          fontSize="14px"
          bg={ORANGE.ORGRAD}
          color="white"
          boxShadow={`0 4px 20px ${ORANGE.ORSW}`}
          _hover={{
            boxShadow: `0 8px 32px rgba(234,88,12,0.4)`,
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all .25s"
          leftIcon={<Icon as={MdReplay} boxSize="18px" />}
          onClick={() => onReset && onReset(selectedSeat)}
        >
          Đặt lại trạng thái ghế
        </Button>
      ) : (
        <Flex
          align="center"
          justify="center"
          gap="8px"
          p="14px"
          borderRadius="12px"
          bg={safeTheme.bgMuted}
          border={safeTheme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
        >
          <Icon as={MdLock} boxSize="18px" color={safeTheme.textMuted} />
          <Text fontSize="13px" fontWeight="600" color={safeTheme.textMuted}>
            {statusKey === "dat" ? "Ghế đã có vé hợp lệ" : statusKey === "baoTri" ? "Ghế đang bảo trì" : "Không thể reset"}
          </Text>
        </Flex>
      )}
    </>
  );
}