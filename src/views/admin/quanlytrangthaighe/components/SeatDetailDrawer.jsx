// src/views/admin/quanlytrangthaighe/components/SeatDetailDrawer.jsx

import React from "react";
import {
  Box, Button, Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader,
  DrawerOverlay, Flex, Icon, Text, VStack
} from "@chakra-ui/react";
import { MdReplay, MdLock, MdPerson, MdWarning, MdCheckCircle } from "react-icons/md";
import { FaTicketAlt, FaUserClock } from "react-icons/fa";
import { SEAT_STATUS, SEAT_STATUS_DEFAULT, ORANGE } from "../constants";
import { scaleIn } from "./shared/animations";

export function SeatDetailDrawer({ isOpen, onClose, seat, onReset, onDelete, theme }) {
  // ✅ Fallback cho theme
  const safeTheme = theme || {
    isDark: false,
    bgCard: "white",
    bgMuted: "#f8fafc",
    text: "#0f172a",
    textMuted: "#94a3b8",
    textSub: "#64748b",
  };

  if (!seat) return null;

  // ✅ Lấy status an toàn
  const statusKey = seat.status || 'trong';
  const cfg = SEAT_STATUS[statusKey] || SEAT_STATUS_DEFAULT;
  const canReset = statusKey === "giu" || statusKey === "loi";
  const isDark = safeTheme.isDark;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
      <DrawerOverlay bg="rgba(0,0,0,0.5)" backdropFilter="blur(8px)" />
      <DrawerContent
        borderTopRadius="24px"
        bg={safeTheme.bgCard}
        maxH="85vh"
        sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}
      >
        <DrawerCloseButton color={safeTheme.textMuted} />
        <DrawerHeader borderBottom={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
          <Flex align="center" gap="12px">
            <Box
              w="44px" h="44px"
              borderRadius="12px"
              bg={cfg.bg}
              border={`2px solid ${cfg.border}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="18px" fontWeight="800" color={cfg.color}>
                {seat.row || ''}{seat.num || ''}
              </Text>
            </Box>
            <Box>
              <Text fontSize="18px" fontWeight="800" color={safeTheme.text}>
                Ghế {seat.row || ''}{seat.num || ''}
              </Text>
              <Flex align="center" gap="6px">
                <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
                <Text fontSize="13px" fontWeight="700" color={cfg.color}>{cfg.label}</Text>
              </Flex>
            </Box>
          </Flex>
        </DrawerHeader>

        <DrawerBody py="20px">
          <VStack spacing="14px" align="stretch">
            {seat.ticket_code && (
              <Box p="12px 14px" borderRadius="12px" bg={safeTheme.bgMuted} border={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
                <Flex align="center" gap="8px" mb="4px">
                  <Icon as={FaTicketAlt} boxSize="14px" color={ORANGE.OR} />
                  <Text fontSize="10px" fontWeight="700" color={safeTheme.textMuted} letterSpacing="0.8px" textTransform="uppercase">Mã vé</Text>
                </Flex>
                <Text fontSize="15px" fontWeight="700" color={safeTheme.text}>{seat.ticket_code}</Text>
              </Box>
            )}

            {seat.customer_name && (
              <Box p="12px 14px" borderRadius="12px" bg={safeTheme.bgMuted} border={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
                <Flex align="center" gap="8px" mb="4px">
                  <Icon as={MdPerson} boxSize="14px" color={ORANGE.OR} />
                  <Text fontSize="10px" fontWeight="700" color={safeTheme.textMuted} letterSpacing="0.8px" textTransform="uppercase">Khách hàng</Text>
                </Flex>
                <Text fontSize="15px" fontWeight="700" color={safeTheme.text}>{seat.customer_name}</Text>
              </Box>
            )}

            {seat.heldSince && (
              <Box p="12px 14px" borderRadius="12px" bg={ORANGE.ORPL} border={`1.5px solid ${ORANGE.ORBD}`}>
                <Flex align="center" gap="8px" mb="4px">
                  <Icon as={FaUserClock} boxSize="14px" color={ORANGE.OR} />
                  <Text fontSize="10px" fontWeight="700" color={ORANGE.OR} letterSpacing="0.8px" textTransform="uppercase">Thời gian giữ</Text>
                </Flex>
                <Text fontSize="15px" fontWeight="700" color={safeTheme.text}>{seat.heldSince}</Text>
              </Box>
            )}

            {seat.note && (
              <Box p="12px 14px" borderRadius="12px" bg="#f5f3ff" border="1.5px solid #c4b5fd">
                <Flex align="center" gap="8px" mb="4px">
                  <Icon as={MdWarning} boxSize="14px" color="#7c3aed" />
                  <Text fontSize="10px" fontWeight="700" color="#7c3aed" letterSpacing="0.8px" textTransform="uppercase">Ghi chú</Text>
                </Flex>
                <Text fontSize="14px" fontWeight="600" color="#5b21b6">{seat.note}</Text>
              </Box>
            )}

            {!seat.ticket_code && !seat.heldSince && !seat.note && (
              <Flex
                align="center"
                justify="center"
                gap="8px"
                p="20px"
                borderRadius="12px"
                bg={safeTheme.bgMuted}
                border={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
              >
                <Icon as={MdCheckCircle} boxSize="20px" color="#10b981" />
                <Text fontSize="14px" fontWeight="600" color={safeTheme.textMuted}>Ghế đang trống, sẵn sàng đặt</Text>
              </Flex>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter
          borderTop={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
          gap="10px"
        >
          {canReset ? (
            <Button
              w="100%"
              h="50px"
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
              onClick={() => {
                onReset && onReset(seat);
                onClose();
              }}
            >
              Đặt lại trạng thái ghế
            </Button>
          ) : (
            <Flex
              align="center"
              justify="center"
              gap="8px"
              w="100%"
              p="14px"
              borderRadius="12px"
              bg={safeTheme.bgMuted}
              border={isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
            >
              <Icon as={MdLock} boxSize="18px" color={safeTheme.textMuted} />
              <Text fontSize="13px" fontWeight="600" color={safeTheme.textMuted}>
                {statusKey === "dat" ? "Ghế đã có vé hợp lệ" : statusKey === "baoTri" ? "Ghế đang bảo trì" : "Không thể reset"}
              </Text>
            </Flex>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}