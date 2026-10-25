// src/views/admin/quanlyve/components/QRModal.jsx

import React, { useRef } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { MdClose, MdDownload, MdPrint, MdShare } from 'react-icons/md';
import { FaTicketAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas'; // ✅ Thêm thư viện chụp ảnh

const STATUS_CFG = {
  'Đã thanh toán': {
    color: '#059669',
    bg: '#ecfdf5',
    border: '#6ee7b7',
    dot: '#10b981',
    label: 'Đã thanh toán',
  },
  Paid: {
    color: '#059669',
    bg: '#ecfdf5',
    border: '#6ee7b7',
    dot: '#10b981',
    label: 'Đã thanh toán',
  },
  'Đã check-in': {
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    dot: '#fb923c',
    label: 'Đã check-in',
  },
  'Chờ xử lý': {
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fcd34d',
    dot: '#f59e0b',
    label: 'Chờ xử lý',
  },
  Pending: {
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fcd34d',
    dot: '#f59e0b',
    label: 'Chờ xử lý',
  },
  'Đã hủy': {
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fca5a5',
    dot: '#ef4444',
    label: 'Đã hủy',
  },
  Cancelled: {
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fca5a5',
    dot: '#ef4444',
    label: 'Đã hủy',
  },
  'Hết hạn': {
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
    dot: '#9ca3af',
    label: 'Hết hạn',
  },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG['Hết hạn'];
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
      <Box
        w="6px"
        h="6px"
        borderRadius="full"
        bg={cfg.dot}
        sx={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
      />
      <Text as="span">{cfg.label}</Text>
    </HStack>
  );
};

const Notch = ({ side, bgColor }) => (
  <Box
    position="absolute"
    top="50%"
    {...(side === 'left' ? { left: '-11px' } : { right: '-11px' })}
    transform="translateY(-50%)"
    w="22px"
    h="22px"
    borderRadius="full"
    bg={bgColor}
    zIndex={2}
  />
);

export const QRModal = ({ ticket, onClose, isDark }) => {
  const OR = '#f97316';
  const ORL = '#fb923c';
  const ORSW = 'rgba(249,115,22,0.28)';
  const qrRef = useRef(null);
  const toast = useToast();

  const stubBg = useColorModeValue('#fffaf5', '#0f1f3a');
  const pageBehind = useColorModeValue('#eef1f8', '#0a1628');
  const qrPaperBg = useColorModeValue('#ffffff', '#ffffff');
  const textPrimary = useColorModeValue('#0f172a', '#f8fafc');
  const textSecondary = useColorModeValue('#64748b', '#a8b2d1');
  const textMuted = useColorModeValue('#94a3b8', '#6b7896');
  const borderColor = useColorModeValue('#f1e4d6', 'rgba(26, 58, 92, 0.8)');
  const dashColor = useColorModeValue('#e7d9c9', 'rgba(255,255,255,0.15)');
  const tileBg = useColorModeValue('#fdf6ee', 'rgba(26, 58, 92, 0.3)');
  const modalShadow = useColorModeValue(
    '0 32px 80px rgba(15,23,42,0.22), 0 4px 16px rgba(15,23,42,0.1)',
    '0 32px 80px rgba(0,0,0,0.55)',
  );

  const qrData = ticket.code || String(ticket.id);

  // ✅ HÀM IN VÉ (Chụp ảnh toàn bộ tấm vé)
  const printQR = async () => {
    if (!qrRef.current) return;

    // Hiện toast báo đang xử lý
    toast({
      title: 'Đang chuẩn bị bản in...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    try {
      // Chụp lại nguyên vẹn tấm vé (tỉ lệ 2x để in cho nét)
      const canvas = await html2canvas(qrRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: stubBg,
      });

      const imgData = canvas.toDataURL('image/png');

      // Mở cửa sổ in
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>In vé - ${ticket.code}</title>
            <style>
              body {
                margin: 0; padding: 20px;
                display: flex; justify-content: center; align-items: flex-start;
                background: #fff;
              }
              img {
                width: 380px; /* Kích thước chuẩn khi in */
                height: auto;
                object-fit: contain;
              }
              @media print {
                body { padding: 0; }
                img { width: 100%; max-width: 400px; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
            <script>
              window.onload = function() { 
                window.print(); 
                window.close(); 
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Lỗi khi in vé:', error);
      toast({
        title: 'Có lỗi khi tạo bản in',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR_${ticket.code}_${ticket.customer}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="9999"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 6 }}
    >
      {/* Overlay */}
      <Box
        position="absolute"
        inset="0"
        bg="rgba(9,12,24,0.72)"
        backdropFilter="blur(14px)"
        onClick={onClose}
      />

      {/* Wrapper (Không dính ref ở đây để tránh chụp phải nút X) */}
      <Box
        position="relative"
        w={{ base: '100%', md: '400px' }}
        maxW="400px"
        boxShadow={modalShadow}
        borderRadius="20px"
      >
        {/* Nút Đóng (Nằm ngoài vùng chụp) */}
        <Button
          position="absolute"
          top="-14px"
          right="-14px"
          size="sm"
          minW="32px"
          h="32px"
          p={0}
          borderRadius="full"
          bg={useColorModeValue('white', '#1b2559')}
          color={textSecondary}
          boxShadow="0 4px 12px rgba(0,0,0,0.25)"
          _hover={{ bg: OR, color: 'white' }}
          onClick={onClose}
          zIndex={10}
        >
          <Icon as={MdClose} boxSize="16px" />
        </Button>

        {/* ✅ VÙNG CHỤP ẢNH: Bọc toàn bộ nội dung tấm vé vào đây */}
        <Box ref={qrRef} borderRadius="20px" overflow="hidden">
          {/* ===== Phần trên ===== */}
          <Box bg={stubBg} pt={5} pb={7} px={6} position="relative">
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bg={`linear-gradient(90deg, ${OR}, ${ORL}, #fbbf24, ${ORL}, ${OR})`}
            />

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

            <Flex justify="center" mb={5}>
              <Box
                position="relative"
                p="16px"
                borderRadius="18px"
                bg={qrPaperBg}
                border={`1px solid ${borderColor}`}
              >
                <QRCodeCanvas
                  value={qrData}
                  size={200}
                  level="H"
                  bgColor={qrPaperBg}
                  fgColor="#0f172a"
                />
              </Box>
            </Flex>

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

          {/* ===== Phần dưới: cuống vé ===== */}
          <Box bg={stubBg} px={6} pt={7} pb={5}>
            <VStack spacing={3} align="stretch">
              <Text
                fontSize="13.5px"
                fontWeight="800"
                color={textPrimary}
                textAlign="center"
                lineHeight="1.4"
                px={2}
                
              >
                {ticket.movie || 'Phim'}
              </Text>

              <Box
                bg={tileBg}
                borderRadius="12px"
                border={`1px solid ${borderColor}`}
                p={3}
              >
                <SimpleGrid columns={3} spacing={2}>
                  <VStack spacing="2px" align="center">
                    <Text
                      fontSize="9px"
                      color={textMuted}
                      fontWeight="700"
                      textTransform="uppercase"
                    >
                      Ghế
                    </Text>
                    <Text fontSize="14px" fontWeight="800" color={OR}>
                      {ticket.seat || 'A1'}
                    </Text>
                  </VStack>
                  <VStack
                    spacing="2px"
                    align="center"
                    borderLeft={`1px solid ${borderColor}`}
                    borderRight={`1px solid ${borderColor}`}
                  >
                    <Text
                      fontSize="9px"
                      color={textMuted}
                      fontWeight="700"
                      textTransform="uppercase"
                    >
                      Suất chiếu
                    </Text>
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      color={textSecondary}
                      textAlign="center"
                      noOfLines={2}
                    >
                      {ticket.showtime || 'Chưa có'}
                    </Text>
                  </VStack>
                  <VStack spacing="2px" align="center">
                    <Text
                      fontSize="9px"
                      color={textMuted}
                      fontWeight="700"
                      textTransform="uppercase"
                    >
                      Giá vé
                    </Text>
                    <Text fontSize="13px" fontWeight="800" color={textPrimary}>
                      {ticket.price || '0đ'}
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

            {/* Các nút hành động (Sẽ bị ẩn đi khi chụp ảnh nhờ class data-html2canvas-ignore) */}
            <Flex gap={2} mb={3} data-html2canvas-ignore="true">
              <Button
                flex={1}
                h="40px"
                variant="outline"
                borderRadius="10px"
                fontSize="12.5px"
                fontWeight="700"
                color={textSecondary}
                borderColor={borderColor}
                leftIcon={<Icon as={MdDownload} />}
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
                leftIcon={<Icon as={MdPrint} />}
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
                leftIcon={<Icon as={MdShare} />}
              >
                Chia sẻ
              </Button>
            </Flex>

            <VStack spacing="6px" mt={4}>
              <Text fontSize="9.5px" color={textMuted} textAlign="center">
                Quét mã QR để check-in tại rạp •{' '}
                {new Date().toLocaleString('vi-VN')}
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
