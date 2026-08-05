// src/views/admin/quanlydatve/components/QRModal.jsx

import React from "react";
import { Box, Text, Button, Icon } from "@chakra-ui/react";
import { MdQrCode2 } from "react-icons/md";
import { fadeIn, scaleIn } from "./shared/animations";

export const QRModal = ({ ticketId, onClose, G }) => {
  // ✅ Fallback cho G
  const isDark = G?.ink === "#f7fafc" ? false : true;
  
  const bg = G?.bgCard || (isDark ? "#16213e" : "white");
  const ink = G?.ink || (isDark ? "#f7fafc" : "#0f172a");
  const ink2 = G?.ink2 || (isDark ? "#e2e8f0" : "#374151");
  const ink4 = G?.ink4 || (isDark ? "#718096" : "#94a3b8");
  const ink5 = G?.ink5 || (isDark ? "#4a5568" : "#e2e8f0");
  const ink6 = G?.ink6 || (isDark ? "#2d3748" : "#f1f5f9");

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(15,23,42,0.55)"
      backdropFilter="blur(4px)"
      sx={{ animation: `${fadeIn} 0.2s ease both` }}
      onClick={onClose}
    >
      <Box
        bg={bg}
        borderRadius="20px"
        p="28px"
        maxW="280px"
        w="100%"
        boxShadow="0 20px 60px rgba(0,0,0,0.25)"
        border={isDark ? `1px solid ${ink5}` : "none"}
        sx={{ animation: `${scaleIn} 0.25s ease both` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Text fontWeight="800" fontSize="15px" color={ink} mb="6px" textAlign="center">
          Mã QR Vé
        </Text>
        <Text fontSize="12px" color={isDark ? ink4 : "#94a3b8"} textAlign="center" mb="16px">
          {ticketId}
        </Text>
        <Box
          w="180px"
          h="180px"
          mx="auto"
          mb="16px"
          borderRadius="12px"
          border={isDark ? `1px solid ${ink5}` : "2px solid #f1f5f9"}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={isDark ? ink6 : "#f8fafc"}
        >
          <Icon as={MdQrCode2} boxSize="120px" color={isDark ? ink4 : "#cbd5e1"} />
        </Box>
        <Button
          w="100%"
          h="40px"
          borderRadius="10px"
          fontSize="13px"
          fontWeight="700"
          bg={isDark ? ink6 : "#f8fafc"}
          color={isDark ? ink2 : "#64748b"}
          border={isDark ? `1px solid ${ink5}` : "1px solid #e2e8f0"}
          _hover={{ bg: isDark ? ink6 : "#f1f5f9" }}
          onClick={onClose}
        >
          Đóng
        </Button>
      </Box>
    </Box>
  );
};