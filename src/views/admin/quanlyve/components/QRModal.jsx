// src/views/admin/quanlyve/components/QRModal.jsx
import React, { useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdClose, MdDownload, MdPrint, MdShare } from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Sửa cách import

const STATUS_CFG = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", label: "Đã thanh toán" },
  "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", label: "Đã thanh toán" },
  "Đã check-in": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c", label: "Đã check-in" },
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", label: "Chờ xử lý" },
  "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", label: "Chờ xử lý" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", label: "Đã hủy" },
  "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", label: "Đã hủy" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af", label: "Hết hạn" },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Hết hạn"];
  return (
    <HStack
      spacing="6px"
      bg={cfg.bg}
      color={cfg.color}
      border={`1px solid ${cfg.border}`}
      borderRadius="full"
      px="12px"
      py="5px"
      fontSize="11px"
      fontWeight="800"
      letterSpacing="0.3px"
      textTransform="uppercase"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} sx={{ animation: "pulseDot 1.8s ease-in-out infinite" }} />
      <Text as="span">{cfg.label}</Text>
    </HStack>
  );
};

// Khấc tròn bo ở hai mép, mô phỏng vé giấy bị bấm lỗ tại đường xé
const Notch = ({ side, bgColor }) => (
  <Box
    position="absolute"
    top="50%"
    {...(side === "left" ? { left: "-11px" } : { right: "-11px" })}
    transform="translateY(-50%)"
    w="22px"
    h="22px"
    borderRadius="full"
    bg={bgColor}
    zIndex={2}
  />
);

export const QRModal = ({ ticket, onClose, isDark }) => {
  const OR = "#f97316";
  const ORL = "#fb923c";
  const ORSW = "rgba(249,115,22,0.28)";

  // Nền "giấy vé" — ấm hơn ở light mode, navy đậm chuẩn theme ở dark mode
  const stubBg = useColorModeValue("#fffaf5", "#0b1437");
  const pageBehind = useColorModeValue("#eef1f8", "#111c44"); // màu để "đục lỗ" khấc xé vé
  const qrPaperBg = useColorModeValue("#ffffff", "#111c44");
  const textPrimary = useColorModeValue("#0f172a", "#f8fafc");
  const textSecondary = useColorModeValue("#64748b", "#a8b2d1");
  const textMuted = useColorModeValue("#94a3b8", "#6b7896");
  const borderColor = useColorModeValue("#f1e4d6", "rgba(255,255,255,0.08)");
  const dashColor = useColorModeValue("#e7d9c9", "rgba(255,255,255,0.15)");
  const tileBg = useColorModeValue("#fdf6ee", "rgba(255,255,255,0.03)");
  const modalShadow = useColorModeValue(
    "0 32px 80px rgba(15,23,42,0.22), 0 4px 16px rgba(15,23,42,0.1)",
    "0 32px 80px rgba(0,0,0,0.55)"
  );

  // Tạo dữ liệu cho QR Code
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    code: ticket.code,
    customer: ticket.customer,
    movie: ticket.movie,
    showtime: ticket.showtime,
    seat: ticket.seat,
    status: ticket.status,
    timestamp: new Date().toISOString(),
  });

  // Hàm tải xuống QR Code
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `QR_${ticket.code}_${ticket.customer}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // Hàm in QR Code
  const printQR = () => {
    const content = document.getElementById("qr-print-content");
    if (content) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head><title>QR Code - ${ticket.code}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: Arial, sans-serif; }
            .qr-container { text-align: center; padding: 40px; }
            .qr-container img { max-width: 300px; }
          </style>
          </head>
          <body>
            <div class="qr-container">
              ${content.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Keyframes style
  const styleTag = (
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes ticketIn {
        from { opacity: 0; transform: scale(0.92) translateY(24px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes scanLine {
        0% { top: 6%; opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { top: 94%; opacity: 0; }
      }
      @keyframes pulseDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
    `}</style>
  );

  return (
    <>
      {styleTag}
      <Box
        position="fixed"
        inset="0"
        zIndex="9999"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 4, md: 6 }}
        sx={{ animation: `fadeIn .2s ease both` }}
      >
        {/* Overlay */}
        <Box
          position="absolute"
          inset="0"
          bg="rgba(9,12,24,0.72)"
          backdropFilter="blur(14px)"
          onClick={onClose}
        />

        {/* Ticket wrapper */}
        <Box
          id="qr-print-content"
          position="relative"
          w={{ base: "100%", md: "400px" }}
          maxW="400px"
          sx={{ animation: `ticketIn .35s cubic-bezier(0.34, 1.56, 0.64, 1) both` }}
          boxShadow={modalShadow}
          borderRadius="20px"
        >
          {/* Close Button */}
          <Button
            position="absolute"
            top="-14px"
            right="-14px"
            size="sm"
            minW="32px"
            h="32px"
            p={0}
            borderRadius="full"
            bg={useColorModeValue("white", "#1b2559")}
            color={textSecondary}
            boxShadow="0 4px 12px rgba(0,0,0,0.25)"
            _hover={{ bg: OR, color: "white" }}
            onClick={onClose}
            zIndex={10}
          >
            <Icon as={MdClose} boxSize="16px" />
          </Button>

          {/* ===== Phần trên: thương hiệu + QR ===== */}
          <Box
            bg={stubBg}
            borderRadius="20px 20px 0 0"
            pt={5}
            pb={7}
            px={6}
            position="relative"
            overflow="hidden"
          >
            {/* dải gradient viền trên cùng */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bg={`linear-gradient(90deg, ${OR}, ${ORL}, #fbbf24, ${ORL}, ${OR})`}
              bgSize="200% 100%"
              sx={{ animation: `shimmer 3s linear infinite` }}
            />

            {/* Thương hiệu */}
            <HStack spacing="8px" mb={5} justify="center">
              <Icon as={FaTicketAlt} boxSize="14px" color={OR} />
              <Text
                fontSize="11px"
                fontWeight="800"
                letterSpacing="2px"
                textTransform="uppercase"
                color={textMuted}
              >
                Gấu Phim Cinema
              </Text>
            </HStack>

            {/* Khung ngắm QR kiểu boarding-pass */}
            <Flex justify="center" mb={5}>
              <Box
                position="relative"
                p="18px"
                borderRadius="18px"
                bg={qrPaperBg}
                border={`1px solid ${borderColor}`}
                overflow="hidden"
              >
                {/* 4 góc khung ngắm */}
                {[
                  { top: "6px", left: "6px", bT: true, bL: true },
                  { top: "6px", right: "6px", bT: true, bR: true },
                  { bottom: "6px", left: "6px", bB: true, bL: true },
                  { bottom: "6px", right: "6px", bB: true, bR: true },
                ].map((c, i) => (
                  <Box
                    key={i}
                    position="absolute"
                    top={c.top}
                    bottom={c.bottom}
                    left={c.left}
                    right={c.right}
                    w="18px"
                    h="18px"
                    borderTop={c.bT ? `2.5px solid ${OR}` : "none"}
                    borderBottom={c.bB ? `2.5px solid ${OR}` : "none"}
                    borderLeft={c.bL ? `2.5px solid ${OR}` : "none"}
                    borderRight={c.bR ? `2.5px solid ${OR}` : "none"}
                    borderRadius={
                      c.bT && c.bL ? "8px 0 0 0" : c.bT && c.bR ? "0 8px 0 0" : c.bB && c.bL ? "0 0 0 8px" : "0 0 8px 0"
                    }
                  />
                ))}

                {/* vệt scan chạy dọc */}
                <Box
                  position="absolute"
                  left="14px"
                  right="14px"
                  h="2px"
                  bg={`linear-gradient(90deg, transparent, ${OR}, transparent)`}
                  boxShadow={`0 0 8px ${ORSW}`}
                  sx={{ animation: "scanLine 2.6s ease-in-out infinite" }}
                />

                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={qrData}
                  size={188}
                  level="H"
                  bgColor={qrPaperBg}
                  fgColor={useColorModeValue("#0f172a", "#f8fafc")}
                  imageSettings={{
                    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f97316'%3E%3Cpath d='M3 3h5v5H3V3zM16 3h5v5h-5V3zM3 16h5v5H3v-5zM16 16h5v5h-5v-5zM9 3h3v3H9V3zM9 9h3v3H9V9zM9 15h3v3H9v-3zM15 9h3v3h-3V9z'/%3E%3C/svg%3E",
                    width: 36,
                    height: 36,
                    excavate: true,
                  }}
                />
              </Box>
            </Flex>

            {/* Mã vé + trạng thái */}
            <VStack spacing="10px">
              <Text
                fontFamily="mono"
                fontSize="20px"
                fontWeight="800"
                letterSpacing="3px"
                color={textPrimary}
              >
                {ticket.code}
              </Text>
              <StatusPill status={ticket.status} />
            </VStack>
          </Box>

          {/* ===== Đường xé vé ===== */}
          <Box position="relative" h="0">
            <Notch side="left" bgColor={pageBehind} />
            <Notch side="right" bgColor={pageBehind} />
            <Box
              borderTop={`2px dashed ${dashColor}`}
              position="absolute"
              left="14px"
              right="14px"
              top="0"
            />
          </Box>

          {/* ===== Phần dưới: cuống vé / thông tin ===== */}
          <Box bg={stubBg} borderRadius="0 0 20px 20px" px={6} pt={7} pb={5}>
            <VStack spacing={3} align="stretch">
              <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={1} textAlign="center">
                {ticket.movie || "Phim"}
              </Text>

              <Box bg={tileBg} borderRadius="12px" border={`1px solid ${borderColor}`} p={3}>
                <SimpleGrid columns={3} spacing={2}>
                  <VStack spacing="2px" align="center">
                    <Text fontSize="9px" color={textMuted} fontWeight="700" letterSpacing="0.5px" textTransform="uppercase">
                      Ghế
                    </Text>
                    <Text fontSize="14px" fontWeight="800" color={OR}>
                      {ticket.seat || "A1"}
                    </Text>
                  </VStack>
                  <VStack spacing="2px" align="center" borderLeft={`1px solid ${borderColor}`} borderRight={`1px solid ${borderColor}`}>
                    <Text fontSize="9px" color={textMuted} fontWeight="700" letterSpacing="0.5px" textTransform="uppercase">
                      Suất chiếu
                    </Text>
                    <Text fontSize="11px" fontWeight="700" color={textSecondary} textAlign="center" noOfLines={2}>
                      {ticket.showtime || "Chưa có"}
                    </Text>
                  </VStack>
                  <VStack spacing="2px" align="center">
                    <Text fontSize="9px" color={textMuted} fontWeight="700" letterSpacing="0.5px" textTransform="uppercase">
                      Giá vé
                    </Text>
                    <Text fontSize="13px" fontWeight="800" color={textPrimary}>
                      {ticket.price || "0đ"}
                    </Text>
                  </VStack>
                </SimpleGrid>
              </Box>

              <HStack justify="space-between" px="2px">
                <Text fontSize="11px" color={textMuted}>
                  Khách hàng
                </Text>
                <Text fontSize="12px" fontWeight="700" color={textSecondary}>
                  {ticket.customer}
                </Text>
              </HStack>
            </VStack>

            <Divider borderColor={borderColor} my={4} />

            {/* Actions */}
            <Flex gap={2} mb={3}>
              <Button
                flex={1}
                h="40px"
                variant="outline"
                borderRadius="10px"
                fontSize="12.5px"
                fontWeight="700"
                color={textSecondary}
                borderColor={borderColor}
                leftIcon={<Icon as={MdDownload} boxSize="15px" />}
                _hover={{ bg: tileBg, borderColor: OR, color: OR }}
                transition="all 0.2s"
                onClick={downloadQR}
              >
                Tải
              </Button>
              <Button
                flex={1}
                h="40px"
                variant="outline"
                borderRadius="10px"
                fontSize="12.5px"
                fontWeight="700"
                color={textSecondary}
                borderColor={borderColor}
                leftIcon={<Icon as={MdPrint} boxSize="15px" />}
                _hover={{ bg: tileBg, borderColor: OR, color: OR }}
                transition="all 0.2s"
                onClick={printQR}
              >
                In vé
              </Button>
              <Button
                flex={1.4}
                h="40px"
                bg={`linear-gradient(135deg, ${OR}, ${ORL})`}
                color="white"
                borderRadius="10px"
                fontSize="12.5px"
                fontWeight="700"
                leftIcon={<Icon as={MdShare} boxSize="15px" />}
                _hover={{ boxShadow: `0 8px 20px ${ORSW}`, transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                onClick={() => {
                  const canvas = document.getElementById("qr-code-canvas");
                  if (canvas) {
                    canvas.toBlob((blob) => {
                      if (navigator.share) {
                        navigator.share({
                          title: `QR Code - ${ticket.code}`,
                          files: [new File([blob], `QR_${ticket.code}.png`, { type: "image/png" })],
                        });
                      }
                    });
                  }
                }}
              >
                Chia sẻ
              </Button>
            </Flex>

            {/* Barcode footer */}
            <VStack spacing="6px">
              <HStack spacing="2px" h="20px" w="100%" justify="center" overflow="hidden">
                {Array.from({ length: 46 }).map((_, i) => (
                  <Box
                    key={i}
                    w={i % 5 === 0 ? "2.5px" : "1px"}
                    h={i % 3 === 0 ? "20px" : "12px"}
                    bg={useColorModeValue("#d6c6b4", "rgba(255,255,255,0.18)")}
                  />
                ))}
              </HStack>
              <Text fontSize="9.5px" color={textMuted} textAlign="center">
                Quét mã QR để check-in tại rạp • {new Date().toLocaleString("vi-VN")}
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </>
  );
};