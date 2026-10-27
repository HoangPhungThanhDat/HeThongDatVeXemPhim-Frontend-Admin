// src/views/admin/quanlydatve/components/QRModal.jsx

import React from "react";
import { Box, Text, Button, Icon, VStack, HStack, Divider, Flex } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import QRCode from "react-qr-code"; // Thư viện tạo mã QR thật
import { fadeIn, scaleIn } from "./shared/animations";

export const QRModal = ({ ticketData, onClose, G }) => {
  // ✅ Fallback cho G (Giữ nguyên logic cũ của bạn)
  const isDark = G?.ink === "#f7fafc" ? false : true;
  
  // Màu sắc cho Modal (Dark/Light mode)
  const bgModal = G?.bgCard || (isDark ? "#16213e" : "white");
  const ink = G?.ink || (isDark ? "#f7fafc" : "#0f172a");
  
  // Màu sắc riêng cho Vé (Luôn là nền trắng, chữ đen để giống vé thật)
  const ticketBg = "#ffffff";
  const ticketInk = "#000000";
  const ticketInkMuted = "#4a5568";
  const ticketBorder = "#000000";

  // Dữ liệu mẫu (Fallback nếu không truyền ticketData)
  const data = ticketData || {
    movieName: "CÚ NHẦY KỲ DIỆU",
    date: "30-10-2026",
    time: "08:00",
    room: "Phòng Chiếu 02 - LA",
    seat: "G10",
    combo: "Combo bắp nước 03 x1",
    total: "291.600",
    ticketId: "119",
    status: "ĐÃ THANH TOÁN"
  };

  // Nội dung mã QR (Có thể là JSON hoặc URL xác thực vé)
  const qrValue = JSON.stringify({ id: data.ticketId, movie: data.movieName });

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(15,23,42,0.75)"
      backdropFilter="blur(8px)"
      sx={{ animation: `${fadeIn} 0.2s ease both` }}
      onClick={onClose}
    >
      <Box
        position="relative"
        bg={bgModal}
        borderRadius="16px"
        p={4}
        maxW="360px"
        w="100%"
        boxShadow="0 20px 60px rgba(0,0,0,0.3)"
        sx={{ animation: `${scaleIn} 0.25s ease both` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <Icon
          as={MdClose}
          position="absolute"
          top="12px"
          right="12px"
          boxSize="24px"
          color={ink}
          cursor="pointer"
          onClick={onClose}
          _hover={{ opacity: 0.7 }}
        />

        {/* === VÉ XEM PHIM === */}
        <Box
          bg={ticketBg}
          color={ticketInk}
          borderRadius="12px"
          overflow="hidden"
          border={`1.5px solid ${ticketBorder}`}
          fontFamily="'Inter', sans-serif"
        >
          {/* Header: Logo */}
          <Box textAlign="center" pt={5} pb={3}>
            <Text fontSize="20px" fontWeight="900" letterSpacing="2px" lineHeight="1">
              GẤU PHIM
            </Text>
            <Text fontSize="9px" fontWeight="600" letterSpacing="1.5px" color={ticketInkMuted} mt={1}>
              VÉ XEM PHIM
            </Text>
          </Box>

          {/* Dải đen: Rạp & Admit One */}
          <Flex bg="#1a202c" color="white" px={4} py={2} justify="space-between" align="center">
            <Text fontSize="9px" fontWeight="800" letterSpacing="1px">GẤU PHIM CINEMA</Text>
            <Text fontSize="9px" fontWeight="800" letterSpacing="1px">ADMIT ONE</Text>
          </Flex>

          {/* Nội dung vé */}
          <VStack align="stretch" px={5} py={4} spacing={3}>
            
            {/* Tên phim */}
            <Box>
              <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">
                Tên Phim
              </Text>
              <Text fontSize="16px" fontWeight="900" textTransform="uppercase" lineHeight="1.2" mt={1}>
                {data.movieName}
              </Text>
            </Box>

            {/* Ngày & Giờ */}
            <HStack justify="space-between">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Ngày Chiếu</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{data.date}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Giờ Chiếu</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{data.time}</Text>
              </Box>
            </HStack>

            {/* Phòng & Ghế */}
            <HStack justify="space-between">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Phòng</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{data.room}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Ghế</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{data.seat}</Text>
              </Box>
            </HStack>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" />

            {/* Combo */}
            <Box>
              <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Combo</Text>
              <Text fontSize="12px" fontWeight="700" mt={0.5}>{data.combo}</Text>
            </Box>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" />

            {/* Tổng tiền & Trạng thái */}
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Tổng Thanh Toán</Text>
                <Text fontSize="18px" fontWeight="900" mt={0.5}>{data.total} <span style={{ fontSize: '12px' }}>đ</span></Text>
              </Box>
              <Box border="1.5px solid #1a202c" px={2} py={1} borderRadius="4px">
                <Text fontSize="9px" fontWeight="900" letterSpacing="0.5px">{data.status}</Text>
              </Box>
            </HStack>

            {/* Mã QR */}
            <Box display="flex" justifyContent="center" mt={2} mb={1}>
              <Box p={2} bg="white" borderRadius="8px">
                <QRCode
                  value={qrValue}
                  size={128}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </Box>
            </Box>

            {/* Mã vé & Lời nhắn */}
            <Box textAlign="center" mt={1}>
              <Text fontSize="12px" fontWeight="800" letterSpacing="1px">
                MÃ VÉ: {data.ticketId}
              </Text>
              <Text fontSize="10px" fontWeight="500" color={ticketInkMuted} mt={1}>
                Vui lòng xuất trình mã QR khi soát vé.
              </Text>
            </Box>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" mt={2} />

            {/* Footer */}
            <Box textAlign="center" pb={2}>
              <Text fontSize="7px" fontWeight="500" color={ticketInkMuted} fontStyle="italic">
                Vé chỉ có giá trị trong suốt thời gian xem phim.
              </Text>
              <Text fontSize="7px" fontWeight="500" color={ticketInkMuted} fontStyle="italic" mt={0.5}>
                Chúc quý khách xem phim vui vẻ!
              </Text>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};