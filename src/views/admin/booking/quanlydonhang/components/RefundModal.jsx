// src/views/admin/quanlydonhang/components/RefundModal.jsx

import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Icon,
  Textarea,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdReplay, MdCancel, MdVerifiedUser } from "react-icons/md";
import { scaleIn, shimmer, fadeUp } from "./shared/animations";
import { useFieldStyles } from "./shared/useFieldStyles";
import { fmtVND, OR, ORL, ORSW } from "../constants";

export const RefundModal = ({ order, onClose, onApprove, onReject, isDark }) => {
  const styles = useFieldStyles(isDark);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const close = () => { setRejectReason(""); setShowRejectForm(false); onClose(); };

  return (
    <Modal isOpen={!!order} onClose={close} isCentered size="md">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent
        borderRadius="20px"
        bg={isDark ? "#0b1437" : "white"}
        border={isDark ? "1px solid #2D3A6B" : "none"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .25s cubic-bezier(.22,1,.36,1) both` }}
      >
        <Box
          h="4px"
          bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
          borderRadius="20px 20px 0 0"
        />
        <ModalHeader>
          <Flex align="center" gap="10px">
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 12px ${ORSW}`}
            >
              <Icon as={MdReplay} boxSize="16px" color="white" />
            </Box>
            <Box>
              <Text fontSize="16px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>Xử lý yêu cầu hoàn tiền</Text>
              <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>Đơn {order?.code} · {order?.customerName}</Text>
            </Box>
          </Flex>
          <ModalCloseButton color={isDark ? "#718096" : "#94a3b8"} />
        </ModalHeader>
        <ModalBody>
          <Box
            p="14px"
            borderRadius="12px"
            bg={isDark ? "#1B254B" : "#f8fafc"}
            border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
            mb="16px"
          >
            <Text
              fontSize="10.5px"
              fontWeight="800"
              letterSpacing="0.9px"
              textTransform="uppercase"
              color={isDark ? "#a0aec0" : "#64748b"}
              mb="6px"
            >
              Lý do khách yêu cầu
            </Text>
            <Text fontSize="13.5px" color={isDark ? "#e2e8f0" : "#334155"} lineHeight="1.6">
              {order?.refundReason || "Không có ghi chú."}
            </Text>
          </Box>

          <Flex
            align="center"
            justify="space-between"
            p="12px 14px"
            borderRadius="10px"
            bg={isDark ? "#1B254B" : "#fff7ed"}
            border={`1px solid ${isDark ? "#2D3A6B" : "#fed7aa"}`}
            mb="16px"
          >
            <Text fontSize="12.5px" fontWeight="700" color={isDark ? "#e2e8f0" : "#374151"}>Số tiền hoàn</Text>
            <Text fontSize="17px" fontWeight="800" color={OR}>{order ? fmtVND(order.total) : ""}</Text>
          </Flex>

          {showRejectForm && (
            <Box mb="6px" sx={{ animation: `${fadeUp} .2s ease both` }}>
              <Text
                fontSize="10.5px"
                fontWeight="800"
                letterSpacing="0.9px"
                textTransform="uppercase"
                color={isDark ? "#a0aec0" : "#64748b"}
                mb="6px"
              >
                Lý do từ chối *
              </Text>
              <Textarea
                {...styles}
                rows={3}
                placeholder="VD: Yêu cầu gửi sau thời hạn cho phép hoàn tiền..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Box>
          )}
        </ModalBody>
        <ModalFooter gap="10px" borderTop={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}>
          {!showRejectForm ? (
            <>
              <Button
                h="42px"
                px="18px"
                variant="ghost"
                color="#dc2626"
                borderRadius="10px"
                fontWeight="700"
                fontSize="13px"
                border="1.5px solid #fecaca"
                bg="#fef2f2"
                _hover={{ bg: "#fee2e2" }}
                transition="all .2s"
                leftIcon={<Icon as={MdCancel} boxSize="14px" />}
                onClick={() => setShowRejectForm(true)}
              >
                Từ chối
              </Button>
              <Button
                h="42px"
                px="24px"
                borderRadius="10px"
                fontWeight="700"
                fontSize="13px"
                bg="linear-gradient(135deg,#059669,#10b981)"
                color="white"
                boxShadow="0 4px 16px rgba(16,185,129,.3)"
                _hover={{ boxShadow: "0 8px 24px rgba(16,185,129,.4)", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all .2s"
                leftIcon={<Icon as={MdVerifiedUser} boxSize="14px" />}
                onClick={() => { onApprove(order); close(); }}
              >
                Duyệt hoàn tiền (Admin)
              </Button>
            </>
          ) : (
            <>
              <Button
                h="42px"
                px="18px"
                variant="ghost"
                color={isDark ? "#a0aec0" : "#64748b"}
                borderRadius="10px"
                fontWeight="600"
                fontSize="13px"
                border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e2e8f0"}
                onClick={() => setShowRejectForm(false)}
              >
                Quay lại
              </Button>
              <Button
                h="42px"
                px="24px"
                borderRadius="10px"
                fontWeight="700"
                fontSize="13px"
                bg="linear-gradient(135deg,#dc2626,#ef4444)"
                color="white"
                boxShadow="0 4px 16px rgba(220,38,38,.3)"
                isDisabled={!rejectReason.trim()}
                opacity={rejectReason.trim() ? 1 : 0.5}
                leftIcon={<Icon as={MdCancel} boxSize="14px" />}
                onClick={() => { onReject(order, rejectReason); close(); }}
              >
                Xác nhận từ chối
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};