// src/views/admin/quanlyve/components/TicketEdit.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Input,
  Select,
  Textarea,
  Grid,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import {
  MdArrowBack,
  MdClose,
  MdCheckCircle,
  MdTheaters,
  MdVerified,
} from 'react-icons/md';
import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: '#0a1628',
  cardBg: '#0f1f3a',
  border: '#1a3a5c',
  text: '#e8f4f8',
  textSecondary: '#88b4d8',
  labelColor: '#5a8ab5',
  inputBg: '#0a1f35',
  inputBorder: '#1a3a5c',
  shadow: '0 4px 16px rgba(26, 58, 92, 0.3)',
  hoverBg: '#142d4f',
  accent: '#4a9eff',
  accentLight: '#6ab0ff',
  accentShadow: 'rgba(74, 158, 255, 0.25)',
  seatAvailable: '#0d2847',
  seatAvailableBorder: '#2d6b9e',
  seatTaken: '#1a3a5c',
  seatTakenColor: '#5a8ab5',
  screenBg: 'rgba(74, 158, 255, 0.06)',
  cardBorder: 'rgba(74, 158, 255, 0.08)',
};

const labelStyle = {
  fontSize: '10.5px',
  fontWeight: '800',
  letterSpacing: '0.9px',
  textTransform: 'uppercase',
  mb: '7px',
};

export const TicketEdit = ({ ticket, onBack, onSave, isDark }) => {
  const OR = '#ea580c';
  const ORL = '#fb923c';
  const ORSW = 'rgba(234,88,12,0.25)';

  // Dark mode accent
  const DARK_ACCENT = DARK_THEME.accent;
  const DARK_ACCENT_LIGHT = DARK_THEME.accentLight;
  const DARK_ACCENT_SW = DARK_THEME.accentShadow;

  const toast = useToast();

  console.log('🔍 TicketEdit received ticket:', ticket);

  const [selectedSeat, setSelectedSeat] = useState(ticket?.seat || 'A1');
  const [status, setStatus] = useState(ticket?.status || 'Đã thanh toán');
  const [note, setNote] = useState(ticket?.note || '');
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);

  useEffect(() => {
    console.log('🔍 TicketEdit mounted');

    const id =
      ticket?.showtimeId ||
      ticket?.ShowtimeId ||
      ticket?.showtime?.ShowtimeId ||
      ticket?.Showtime?.ShowtimeId;

    console.log('🔍 Extracted showtimeId:', id);

    if (id) {
      setShowtimeId(id);
      fetchAllSeats(id);
    } else {
      console.warn('⚠️ No showtimeId found in ticket');
    }
  }, [ticket]);

  const fetchAllSeats = async (id) => {
    if (!id) {
      console.warn('⚠️ Không có showtimeId để lấy ghế');
      return;
    }

    console.log('🔍 Fetching all seats for showtime:', id);
    setLoading(true);

    try {
      const response = await ShowtimeSeatApi.getPaged({
        showtimeId: id,
        limit: 200,
      });

      console.log('📦 API Response:', response);

      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];

      console.log(`✅ Found ${data.length} seats`);
      setSeats(data);
    } catch (err) {
      console.error('❌ Lỗi tải ghế:', err);
      toast({
        title: 'Lỗi tải ghế',
        description:
          err.response?.data?.message || 'Không thể tải danh sách ghế',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hàm lưu thay đổi - Truyền cả ghế cũ và ghế mới
  const handleSave = () => {
    // Tìm SeatId từ selectedSeat
    const foundSeat = seats.find((item) => {
      const seatData = item.Seat || item.seat || {};
      const seatLabel = `${seatData.Row || ''}${seatData.Number || ''}`;
      return seatLabel === selectedSeat;
    });

    let seatId = null;
    let newShowtimeSeatId = null;

    if (foundSeat) {
      const seatData = foundSeat.Seat || foundSeat.seat || {};
      seatId =
        seatData.SeatId || seatData.id || foundSeat.SeatId || foundSeat.id;
      newShowtimeSeatId = foundSeat.ShowtimeSeatId || foundSeat.id;
    }

    // Tìm ghế cũ từ danh sách seats
    const oldFoundSeat = seats.find((item) => {
      const seatData = item.Seat || item.seat || {};
      const seatLabel = `${seatData.Row || ''}${seatData.Number || ''}`;
      return seatLabel === ticket?.seat;
    });

    let oldShowtimeSeatId = null;
    let oldSeatId = null;

    if (oldFoundSeat) {
      const seatData = oldFoundSeat.Seat || oldFoundSeat.seat || {};
      oldSeatId =
        seatData.SeatId ||
        seatData.id ||
        oldFoundSeat.SeatId ||
        oldFoundSeat.id;
      oldShowtimeSeatId = oldFoundSeat.ShowtimeSeatId || oldFoundSeat.id;
    }

    // Tạo object update với đầy đủ thông tin
    const updatedTicket = {
      id: ticket.id,
      userId: ticket.userId,
      showtimeId: ticket.showtimeId || showtimeId,
      seatId: seatId,
      status: status,
      note: note,
      seat: selectedSeat,
      // ✅ Thông tin ghế cũ và mới
      oldSeatId: oldSeatId,
      oldShowtimeSeatId: oldShowtimeSeatId,
      newShowtimeSeatId: newShowtimeSeatId,
      // Giữ nguyên các trường khác
      code: ticket.code,
      customer: ticket.customer,
      email: ticket.email,
      phone: ticket.phone,
      movie: ticket.movie,
      showtime: ticket.showtime,
      price: ticket.price,
      combo: ticket.combo,
      qr: ticket.qr,
      showtimeSeatId: ticket.showtimeSeatId,
    };

    console.log('✅ Saving updated ticket:', updatedTicket);
    onSave(updatedTicket);
  };

  // Render sơ đồ ghế
  const renderSeatMap = () => {
    if (loading) {
      return (
        <Flex
          justify="center"
          align="center"
          h="200px"
          direction="column"
          gap="16px"
        >
          <Spinner
            size="xl"
            color={isDark ? DARK_ACCENT : OR}
            thickness="3px"
          />
          <Text
            color={useColorModeValue('#94a3b8', DARK_THEME.textSecondary)}
            fontSize="13px"
          >
            Đang tải sơ đồ ghế...
          </Text>
        </Flex>
      );
    }

    if (!seats || seats.length === 0) {
      return (
        <Box
          p="28px 20px"
          textAlign="center"
          borderRadius="12px"
          bg={useColorModeValue('#f8fafc', DARK_THEME.inputBg)}
          border={`1.5px dashed ${useColorModeValue('#e2e8f0', DARK_THEME.border)}`}
        >
          <Icon
            as={MdTheaters}
            boxSize="36px"
            color={useColorModeValue('#94a3b8', DARK_THEME.textSecondary)}
            mb="12px"
            opacity={0.5}
          />
          <Text
            fontSize="13px"
            color={useColorModeValue('#94a3b8', DARK_THEME.textSecondary)}
            fontWeight="500"
          >
            Không có dữ liệu ghế
          </Text>
          <Text
            fontSize="11px"
            color={useColorModeValue('#b0bac8', DARK_THEME.labelColor)}
            mt="4px"
          >
            {showtimeId ? `Showtime ID: ${showtimeId}` : 'Chưa có suất chiếu'}
          </Text>
          <Button
            size="sm"
            mt="12px"
            colorScheme={isDark ? 'blue' : 'orange'}
            onClick={() => {
              if (showtimeId) {
                fetchAllSeats(showtimeId);
              }
            }}
          >
            Thử lại
          </Button>
        </Box>
      );
    }

    const seatsByRow = {};
    seats.forEach((item) => {
      const seatData = item.Seat || item.seat || {};
      const row = seatData.Row || seatData.row || 'A';
      const number = seatData.Number || seatData.number || 0;
      const seatId = item.ShowtimeSeatId || item.id;
      const status = item.Status || item.status || 'Available';
      const isAvailable = status === 'Available' || status === 'available';
      const isSelected = `${row}${number}` === selectedSeat;
      const isOriginal = `${row}${number}` === ticket?.seat;

      if (!seatsByRow[row]) {
        seatsByRow[row] = [];
      }
      seatsByRow[row].push({
        row,
        number,
        seatId,
        isAvailable,
        isSelected,
        isOriginal,
        status,
      });
    });

    const sortedRows = Object.keys(seatsByRow).sort();
    const totalAvailable = seats.filter((s) => {
      const status = s.Status || s.status || 'Available';
      return status === 'Available' || status === 'available';
    }).length;
    const totalReserved = seats.filter((s) => {
      const status = s.Status || s.status || 'Available';
      return status !== 'Available' && status !== 'available';
    }).length;
    const AISLE_EVERY = 4;

    const chunkSeats = (rowSeats) => {
      const chunks = [];
      for (let i = 0; i < rowSeats.length; i += AISLE_EVERY) {
        chunks.push(rowSeats.slice(i, i + AISLE_EVERY));
      }
      return chunks;
    };

    const seatAvailBg = useColorModeValue('white', DARK_THEME.seatAvailable);
    const seatAvailBorder = useColorModeValue(
      '#e2e8f0',
      DARK_THEME.seatAvailableBorder,
    );
    const seatAvailColor = useColorModeValue('#1a202c', DARK_THEME.text);
    const seatTakenBg = useColorModeValue('#e2e8f0', DARK_THEME.seatTaken);
    const seatTakenColor = useColorModeValue(
      '#94a3b8',
      DARK_THEME.seatTakenColor,
    );
    const seatHoverBox = useColorModeValue(
      '0 4px 10px rgba(249,115,22,0.18)',
      `0 4px 14px ${DARK_ACCENT_SW}`,
    );
    const textMuted = useColorModeValue('#94a3b8', DARK_THEME.textSecondary);
    const screenBgFrom = useColorModeValue('#f1f5f9', DARK_THEME.screenBg);
    const cardBorder = useColorModeValue('#eef1f6', DARK_THEME.cardBorder);

    return (
      <Box
        borderRadius="16px"
        p={{ base: '18px 12px', md: '26px 22px' }}
        bg={
          isDark
            ? `radial-gradient(ellipse at 50% 0%, ${DARK_ACCENT_SW}, transparent 60%), ${DARK_THEME.bg}`
            : 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.05), transparent 60%), #fbfcfe'
        }
        border={`1px solid ${cardBorder}`}
        boxShadow={
          isDark
            ? 'inset 0 1px 0 rgba(74,158,255,0.08)'
            : 'inset 0 1px 0 rgba(255,255,255,0.6)'
        }
      >
        <Flex justify="center" mb={{ base: '26px', md: '34px' }}>
          <Box position="relative" w={{ base: '94%', md: '78%' }}>
            <Box
              h={{ base: '8px', md: '10px' }}
              borderRadius="50%"
              bg={
                isDark
                  ? `linear-gradient(90deg, transparent, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT}, ${DARK_ACCENT}, transparent)`
                  : `linear-gradient(90deg, transparent, ${OR}, ${ORL}, ${OR}, transparent)`
              }
              opacity={isDark ? 0.85 : 0.7}
              boxShadow={
                isDark
                  ? `0 8px 24px ${DARK_ACCENT_SW}`
                  : '0 8px 24px rgba(249,115,22,0.25)'
              }
              style={{ transform: 'perspective(60px) rotateX(-8deg)' }}
            />
            <Box
              mt="2px"
              h={{ base: '22px', md: '30px' }}
              mx="auto"
              w="96%"
              bg={`linear-gradient(180deg, ${screenBgFrom}, transparent)`}
              borderRadius="0 0 50% 50% / 0 0 100% 100%"
              opacity={0.8}
            />
            <Text
              position="absolute"
              top={{ base: '10px', md: '13px' }}
              left="50%"
              transform="translateX(-50%)"
              fontSize="9.5px"
              fontWeight="800"
              color={textMuted}
              letterSpacing="4px"
              whiteSpace="nowrap"
            >
              MÀN HÌNH
            </Text>
          </Box>
        </Flex>

        <VStack spacing={{ base: '6px', md: '9px' }} align="center">
          {sortedRows.map((row) => {
            const chunks = chunkSeats(
              seatsByRow[row].sort((a, b) => a.number - b.number),
            );
            return (
              <Flex key={row} align="center" gap={{ base: '8px', md: '12px' }}>
                <Flex
                  align="center"
                  justify="center"
                  w="20px"
                  h="20px"
                  borderRadius="6px"
                  bg={isDark ? 'rgba(74,158,255,0.06)' : '#eef2f7'}
                  fontSize="10.5px"
                  fontWeight="800"
                  color={textMuted}
                  flexShrink="0"
                >
                  {row}
                </Flex>
                <Flex gap={{ base: '10px', md: '14px' }}>
                  {chunks.map((chunk, chunkIdx) => (
                    <Flex key={chunkIdx} gap={{ base: '5px', md: '7px' }}>
                      {chunk.map((seat) => {
                        const isSelected = seat.isSelected;
                        const isAvailable = seat.isAvailable;
                        const isOriginal = seat.isOriginal;
                        const isHovered = hoveredSeat === seat.seatId;

                        let bgColor,
                          textColor,
                          borderColor,
                          cursor,
                          opacity,
                          tooltipText;

                        if (isSelected) {
                          bgColor = isDark
                            ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                            : `linear-gradient(135deg, ${OR}, ${ORL})`;
                          textColor = 'white';
                          borderColor = isDark ? '#1a5a9e' : '#c2410c';
                          cursor = 'pointer';
                          opacity = 1;
                          tooltipText = `Ghế ${row}${seat.number} - Đang chọn`;
                        } else if (isOriginal) {
                          bgColor = isDark ? DARK_THEME.hoverBg : '#fff7ed';
                          textColor = isDark ? DARK_ACCENT : OR;
                          borderColor = isDark ? DARK_ACCENT : '#fed7aa';
                          cursor = 'pointer';
                          opacity = 1;
                          tooltipText = `Ghế ${row}${seat.number} - Ghế gốc`;
                        } else if (isAvailable) {
                          bgColor = isHovered
                            ? isDark
                              ? DARK_THEME.hoverBg
                              : '#fef3c7'
                            : seatAvailBg;
                          textColor = seatAvailColor;
                          borderColor = isHovered
                            ? isDark
                              ? DARK_ACCENT
                              : '#f97316'
                            : seatAvailBorder;
                          cursor = 'pointer';
                          opacity = 1;
                          tooltipText = `Ghế ${row}${seat.number} - Trống`;
                        } else {
                          bgColor = seatTakenBg;
                          textColor = seatTakenColor;
                          borderColor = seatTakenColor;
                          cursor = 'not-allowed';
                          opacity = 0.6;
                          tooltipText = `Ghế ${row}${seat.number} - Đã đặt`;
                        }

                        return (
                          <Tooltip
                            key={seat.seatId}
                            label={tooltipText}
                            hasArrow
                            openDelay={300}
                          >
                            <Button
                              size="xs"
                              w={{ base: '30px', md: '34px' }}
                              h={{ base: '30px', md: '34px' }}
                              minW={{ base: '30px', md: '34px' }}
                              p="0"
                              borderRadius="9px 9px 11px 11px"
                              fontSize="11px"
                              fontWeight="700"
                              bg={bgColor}
                              color={textColor}
                              border="none"
                              borderBottom={`3px solid ${borderColor}`}
                              boxShadow={
                                isSelected
                                  ? isDark
                                    ? `0 0 0 3px ${DARK_ACCENT_SW}, 0 4px 10px ${DARK_ACCENT_SW}`
                                    : '0 0 0 3px rgba(249,115,22,0.22), 0 4px 10px rgba(249,115,22,0.3)'
                                  : isOriginal
                                    ? isDark
                                      ? `0 0 0 2px ${DARK_ACCENT_SW}`
                                      : `0 0 0 2px rgba(234,88,12,0.2)`
                                    : isDark
                                      ? '0 1px 2px rgba(0,0,0,0.3)'
                                      : '0 1px 2px rgba(15,23,42,0.06)'
                              }
                              cursor={cursor}
                              opacity={opacity}
                              transform={
                                isHovered && isAvailable
                                  ? 'scale(1.08)'
                                  : 'scale(1)'
                              }
                              _hover={
                                isAvailable && !isSelected
                                  ? {
                                      transform: 'scale(1.1)',
                                      boxShadow: seatHoverBox,
                                    }
                                  : isOriginal && !isSelected
                                    ? { transform: 'scale(1.05)' }
                                    : {}
                              }
                              _active={
                                isAvailable ? { transform: 'scale(0.95)' } : {}
                              }
                              transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                              onClick={() => {
                                if (isAvailable) {
                                  const label = `${row}${seat.number}`;
                                  setSelectedSeat(label);
                                }
                              }}
                              onMouseEnter={() => setHoveredSeat(seat.seatId)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              disabled={!isAvailable}
                            >
                              {seat.number}
                            </Button>
                          </Tooltip>
                        );
                      })}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        <Flex
          gap="18px"
          mt="20px"
          pt="16px"
          borderTop={`1px solid ${cardBorder}`}
          flexWrap="wrap"
          align="center"
          justify="center"
        >
          <Flex align="center" gap="6px">
            <Box
              w="14px"
              h="14px"
              borderRadius="4px"
              bg={seatAvailBg}
              borderBottom={`3px solid ${seatAvailBorder}`}
            />
            <Text fontSize="11px" color={textMuted} fontWeight="500">
              Trống
            </Text>
          </Flex>
          <Flex align="center" gap="6px">
            <Box
              w="14px"
              h="14px"
              borderRadius="4px"
              bg={
                isDark
                  ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                  : `linear-gradient(135deg, ${OR}, ${ORL})`
              }
              borderBottom={`3px solid ${isDark ? '#1a5a9e' : '#c2410c'}`}
            />
            <Text fontSize="11px" color={textMuted} fontWeight="500">
              Đang chọn
            </Text>
          </Flex>
          <Flex align="center" gap="6px">
            <Box
              w="14px"
              h="14px"
              borderRadius="4px"
              bg={isDark ? DARK_THEME.hoverBg : '#fff7ed'}
              borderBottom={`3px solid ${isDark ? DARK_ACCENT : '#fed7aa'}`}
              border={`1px solid ${isDark ? DARK_ACCENT : '#fed7aa'}`}
            />
            <Text fontSize="11px" color={textMuted} fontWeight="500">
              Ghế gốc
            </Text>
          </Flex>
          <Flex align="center" gap="6px">
            <Box
              w="14px"
              h="14px"
              borderRadius="4px"
              bg={seatTakenBg}
              opacity={0.6}
            />
            <Text fontSize="11px" color={textMuted} fontWeight="500">
              Đã đặt
            </Text>
          </Flex>
          <Text fontSize="11px" color={textMuted} fontWeight="600">
            · {totalAvailable} ghế trống / {totalReserved} ghế đã đặt
          </Text>
        </Flex>

        <Flex
          mt="14px"
          p="10px 14px"
          borderRadius="10px"
          bg={isDark ? `${DARK_ACCENT_SW}` : 'rgba(249,115,22,0.10)'}
          border={`1px solid ${isDark ? DARK_ACCENT : 'rgba(249,115,22,0.22)'}`}
          align="center"
          justify="center"
          gap="8px"
        >
          <Icon
            as={MdVerified}
            color={isDark ? DARK_ACCENT : OR}
            boxSize="15px"
          />
          <Text
            fontSize="12.5px"
            color={isDark ? DARK_ACCENT : OR}
            fontWeight="700"
          >
            Ghế đang chọn: {selectedSeat}{' '}
            {selectedSeat === ticket?.seat ? '(Ghế gốc)' : ''}
          </Text>
        </Flex>
      </Box>
    );
  };

  const bg = useColorModeValue('white', DARK_THEME.cardBg);
  const borderColor = useColorModeValue('gray.200', DARK_THEME.border);
  const labelColor = useColorModeValue('gray.600', DARK_THEME.labelColor);

  const styles = {
    bg: isDark ? DARK_THEME.inputBg : '#fafafa',
    border: isDark ? `1.5px solid ${DARK_THEME.border}` : '1.5px solid #e8edf3',
    borderRadius: '10px',
    color: isDark ? DARK_THEME.text : '#1a202c',
    fontSize: '14px',
    fontWeight: '500',
    px: '14px',
    h: '44px',
    _placeholder: {
      color: isDark ? DARK_THEME.labelColor : '#b0bac8',
      fontWeight: '400',
    },
    _focus: {
      border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`,
      boxShadow: `0 0 0 3px ${isDark ? DARK_ACCENT_SW : 'rgba(234,88,12,.1)'}`,
      bg: isDark ? DARK_THEME.inputBg : '#fff',
    },
    _hover: {
      border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`,
      bg: isDark ? DARK_THEME.inputBg : '#fff',
    },
    transition: 'all .2s',
  };

  const selectStyles = {
    ...styles,
    cursor: 'pointer',
    _hover: { border: `1.5px solid ${isDark ? DARK_ACCENT : OR}` },
  };

  return (
    <Box sx={{ animation: `fadeIn .3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px">
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={isDark ? DARK_THEME.textSecondary : '#64748b'}
          borderRadius="10px"
          h="40px"
          fontSize="13px"
          fontWeight="600"
          border={
            isDark ? `1.5px solid ${DARK_THEME.border}` : '1.5px solid #e2e8f0'
          }
          _hover={{ bg: isDark ? DARK_THEME.hoverBg : '#f8fafc' }}
          onClick={onBack}
        >
          Chi tiết vé
        </Button>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '1.4fr 1fr' }} gap="18px">
        <Box>
          <Card border="1px solid" borderColor={borderColor} bg={bg}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text sx={labelStyle} color={labelColor}>
                    Thông tin vé
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap="12px">
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Mã vé
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.code || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Khách hàng
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.customer || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Email
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.email || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Số điện thoại
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.phone || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Phim
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.movie || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Suất chiếu
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_THEME.text : 'gray.800'}
                      >
                        {ticket?.showtime || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Giá vé
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_ACCENT : OR}
                      >
                        {ticket?.price || '---'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={labelColor} fontWeight="600">
                        Ghế đã chọn
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="700"
                        color={isDark ? DARK_ACCENT : OR}
                      >
                        {selectedSeat}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider borderColor={borderColor} />

                <Box>
                  <Text sx={labelStyle} color={labelColor}>
                    Trạng thái
                  </Text>
                  <Select
                    {...selectStyles}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Đã check-in">Đã check-in</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đã hủy">Đã hủy</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </Select>
                </Box>

                <Box>
                  <Text sx={labelStyle} color={labelColor}>
                    Ghi chú nội bộ
                  </Text>
                  <Textarea
                    bg={isDark ? DARK_THEME.inputBg : '#fafafa'}
                    border={
                      isDark
                        ? `1.5px solid ${DARK_THEME.border}`
                        : '1.5px solid #e8edf3'
                    }
                    borderRadius="10px"
                    color={isDark ? DARK_THEME.text : '#1a202c'}
                    fontSize="14px"
                    fontWeight="500"
                    px="14px"
                    py="10px"
                    _placeholder={{
                      color: isDark ? DARK_THEME.labelColor : '#b0bac8',
                    }}
                    _focus={{
                      border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`,
                      boxShadow: `0 0 0 3px ${isDark ? DARK_ACCENT_SW : 'rgba(234,88,12,.1)'}`,
                      bg: isDark ? DARK_THEME.inputBg : '#fff',
                    }}
                    _hover={{
                      border: `1.5px solid ${isDark ? DARK_ACCENT : OR}`,
                    }}
                    transition="all .2s"
                    rows={3}
                    placeholder="Nhập ghi chú nội bộ cho vé này..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Box>

                <Flex gap="10px" mt="4px">
                  <Button
                    flex="1"
                    h="42px"
                    variant="ghost"
                    color={isDark ? DARK_THEME.textSecondary : '#64748b'}
                    borderRadius="10px"
                    fontWeight="600"
                    fontSize="13px"
                    border={
                      isDark
                        ? `1.5px solid ${DARK_THEME.border}`
                        : '1.5px solid #e2e8f0'
                    }
                    _hover={{ bg: isDark ? DARK_THEME.hoverBg : '#f8fafc' }}
                    transition="all .2s"
                    leftIcon={<Icon as={MdClose} />}
                    onClick={onBack}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    flex="2"
                    h="42px"
                    px="24px"
                    borderRadius="10px"
                    fontWeight="700"
                    fontSize="13px"
                    bg={
                      isDark
                        ? `linear-gradient(135deg, ${DARK_ACCENT}, ${DARK_ACCENT_LIGHT})`
                        : `linear-gradient(135deg,${OR},${ORL})`
                    }
                    color="white"
                    boxShadow={
                      isDark
                        ? `0 4px 16px ${DARK_ACCENT_SW}`
                        : `0 4px 16px ${ORSW}`
                    }
                    _hover={{
                      boxShadow: isDark
                        ? `0 8px 24px ${DARK_ACCENT_SW}`
                        : '0 8px 24px rgba(234,88,12,.4)',
                      transform: 'translateY(-1px)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all .2s"
                    leftIcon={<Icon as={MdCheckCircle} />}
                    onClick={handleSave}
                  >
                    Lưu thay đổi
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        <Box>
          <Card border="1px solid" borderColor={borderColor} bg={bg} h="100%">
            <CardBody>
              <Text sx={labelStyle} color={labelColor} mb="16px">
                Sơ đồ ghế
              </Text>
              {renderSeatMap()}
            </CardBody>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};
