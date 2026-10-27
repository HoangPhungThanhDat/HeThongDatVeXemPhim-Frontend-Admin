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
  useToast,
} from '@chakra-ui/react';
import { MdClose, MdDownload, MdPrint, MdShare } from 'react-icons/md';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

export const QRModal = ({ ticket, onClose }) => {
  const qrRef = useRef(null);
  const toast = useToast();

  const overlayBg = 'rgba(15,23,42,0.75)';
  const ticketBg = '#ffffff';
  const ticketInk = '#000000';
  const ticketInkMuted = '#4a5568';
  const ticketBorder = '#000000';

  // ⭐ SỬ DỤNG DỮ LIỆU ĐÃ ĐƯỢC TÁCH CHUẨN XÁC TỪ HOOK
  const ticketData = {
    movieName: ticket.movie || 'CÚ NHẦY KỲ DIỆU',
    date: ticket.date || '30-10-2026',
    time: ticket.time || '08:00',
    room: ticket.room || 'Phòng Chiếu 02',
    seat: ticket.seat || 'G10',
    combo: ticket.combo || 'Không có',
    total: ticket.total || '0',
    ticketCode: ticket.code || ticket.id || '119',
    status: ticket.status || 'ĐÃ THANH TOÁN',
  };

  const qrData = ticket.code || String(ticket.id) || '119';

  const printQR = async () => {
    if (!qrRef.current) return;
    toast({ title: 'Đang chuẩn bị bản in...', status: 'info', duration: 2000, isClosable: true });
    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>In vé - ${ticketData.ticketCode}</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; background: #fff; }
              img { width: 350px; height: auto; object-fit: contain; }
              @media print { body { padding: 0; } img { width: 100%; max-width: 380px; } }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Lỗi khi in vé:', error);
      toast({ title: 'Có lỗi khi tạo bản in', status: 'error', duration: 3000 });
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR_${ticketData.ticketCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Box position="fixed" inset="0" zIndex="9999" display="flex" alignItems="center" justifyContent="center" p={{ base: 4, md: 6 }}>
      <Box position="absolute" inset="0" bg={overlayBg} backdropFilter="blur(8px)" onClick={onClose} />

      <Box position="relative" w={{ base: '100%', md: '340px' }} maxW="340px">
        <Button position="absolute" top="-16px" right="-16px" size="sm" minW="32px" h="32px" p={0} borderRadius="full" bg="#ffffff" color="#000000" boxShadow="0 4px 12px rgba(0,0,0,0.25)" _hover={{ bg: '#f1f5f9' }} onClick={onClose} zIndex={10}>
          <Icon as={MdClose} boxSize="18px" />
        </Button>

        <Box ref={qrRef} bg={ticketBg} color={ticketInk} borderRadius="12px" overflow="hidden" border={`1.5px solid ${ticketBorder}`} fontFamily="'Inter', sans-serif">
          <Box textAlign="center" pt={5} pb={3}>
            <Text fontSize="22px" fontWeight="900" letterSpacing="3px" lineHeight="1">GẤU PHIM</Text>
            <Text fontSize="9px" fontWeight="600" letterSpacing="2px" color={ticketInkMuted} mt={1}>VÉ XEM PHIM</Text>
          </Box>

          <Flex bg="#1a202c" color="white" px={4} py={2} justify="space-between" align="center">
            <Text fontSize="9px" fontWeight="800" letterSpacing="1px">GẤU PHIM CINEMA</Text>
            <Text fontSize="9px" fontWeight="800" letterSpacing="1px">ADMIT ONE</Text>
          </Flex>

          <VStack align="stretch" px={5} py={4} spacing={3}>
            <Box>
              <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Tên Phim</Text>
              <Text fontSize="16px" fontWeight="900" textTransform="uppercase" lineHeight="1.2" mt={1}>{ticketData.movieName}</Text>
            </Box>

            <HStack justify="space-between">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Ngày Chiếu</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{ticketData.date}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Giờ Chiếu</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{ticketData.time}</Text>
              </Box>
            </HStack>

            <HStack justify="space-between">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Phòng</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{ticketData.room}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Ghế</Text>
                <Text fontSize="12px" fontWeight="800" mt={0.5}>{ticketData.seat}</Text>
              </Box>
            </HStack>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" />

            <Box>
              <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Combo</Text>
              <Text fontSize="12px" fontWeight="700" mt={0.5}>{ticketData.combo}</Text>
            </Box>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" />

            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="8px" fontWeight="700" color={ticketInkMuted} textTransform="uppercase" letterSpacing="0.5px">Tổng Thanh Toán</Text>
                <Text fontSize="18px" fontWeight="900" mt={0.5}>{ticketData.total} <span style={{ fontSize: '12px' }}>đ</span></Text>
              </Box>
              <Box border="1.5px solid #1a202c" px={2} py={1} borderRadius="4px">
                <Text fontSize="9px" fontWeight="900" letterSpacing="0.5px">{ticketData.status}</Text>
              </Box>
            </HStack>

            <Box display="flex" justifyContent="center" mt={2} mb={1}>
              <Box p={2} bg="white" borderRadius="8px">
                <QRCodeCanvas value={qrData} size={130} level="H" fgColor="#000000" bgColor="#ffffff" />
              </Box>
            </Box>

            <Box textAlign="center" mt={1}>
              <Text fontSize="12px" fontWeight="800" letterSpacing="1px">MÃ VÉ: {ticketData.ticketCode}</Text>
              <Text fontSize="10px" fontWeight="500" color={ticketInkMuted} mt={1}>Vui lòng xuất trình mã QR khi soát vé.</Text>
            </Box>

            <Divider borderColor="#e2e8f0" borderStyle="dashed" mt={2} />

            <Box textAlign="center" pb={2}>
              <Text fontSize="7.5px" fontWeight="500" color={ticketInkMuted} fontStyle="italic">Vé chỉ có giá trị trong suốt thời gian xem phim.</Text>
              <Text fontSize="7.5px" fontWeight="500" color={ticketInkMuted} fontStyle="italic" mt={0.5}>Chúc quý khách xem phim vui vẻ!</Text>
            </Box>
          </VStack>

          <Box px={5} pb={5} data-html2canvas-ignore="true">
            <Divider borderColor="#e2e8f0" mb={4} />
            <Flex gap={2}>
              <Button flex={1} h="38px" variant="outline" borderRadius="8px" fontSize="12px" fontWeight="700" color="#4a5568" borderColor="#cbd5e1" leftIcon={<Icon as={MdDownload} />} onClick={downloadQR}>Tải</Button>
              <Button flex={1} h="38px" variant="outline" borderRadius="8px" fontSize="12px" fontWeight="700" color="#4a5568" borderColor="#cbd5e1" leftIcon={<Icon as={MdPrint} />} onClick={printQR}>In vé</Button>
              <Button flex={1.2} h="38px" bg="#1a202c" color="white" borderRadius="8px" fontSize="12px" fontWeight="700" leftIcon={<Icon as={MdShare} />} _hover={{ bg: '#2d3748' }}>Chia sẻ</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};