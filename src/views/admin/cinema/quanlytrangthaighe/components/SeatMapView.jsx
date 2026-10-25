// src/views/admin/quanlytrangthaighe/components/SeatMapView.jsx

import React from "react";
import {
  Box, Flex, Text, Badge, Icon, Spinner, useBreakpointValue
} from "@chakra-ui/react";
import {
  MdMovie, MdAccessTime, MdEventSeat, MdInfoOutline, MdSearch
} from "react-icons/md";
import { ORANGE, ROWS, SEAT_TYPE_COLORS } from "../constants";
import SeatButton from "./SeatButton";
import { shimmer } from "./shared/animations";

export function SeatMapView({
  showtimeId,
  activeShowtime,
  seats = [],
  selectedSeatId,
  onSeatClick,
  onStatusChange,
  theme,
  occupancyRate = 0,
  loading = false,
  isChangingData = false,
  hasFullSelection = false
}) {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Nhóm ghế theo hàng
  const grouped = React.useMemo(() => {
    const validSeats = seats.filter(s => s && s.row && s.num !== undefined && s.num !== null);
    return ROWS.map((row) => validSeats.filter((s) => s.row === row));
  }, [seats]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có lịch';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parsed = Date.parse(dateString);
        if (isNaN(parsed)) return dateString;
        return new Date(parsed).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateString; }
  };

  const getMovieTitle = (st) => st?.movie_title || st?.Movie?.Title || st?.movie?.title || st?.MovieId?.Title || 'Unknown';
  const getRoomName = (st) => st?.room_name || st?.Room?.Name || st?.roomName || st?.RoomId?.Name || '';
  const getPrice = (st) => st?.Price || st?.price || 0;
  const getStartTime = (st) => st?.start_time || st?.StartTime || null;

  const isLoading = loading || isChangingData;
  const hasSeats = seats.length > 0;

  return (
    <Box
      bg={theme.bgCard}
      borderRadius="20px"
      border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
      boxShadow={theme.shadow}
      p={{ base: "14px", md: "24px" }}
      transition="all .3s"
      _hover={{ boxShadow: theme.shadowHover }}
      overflow="hidden" // ✅ Chặn không cho tràn ra ngoài
    >
      {/* Hiển thị thông tin Suất chiếu đang chọn */}
      {activeShowtime && (
        <Flex
          align="center" gap="12px" p="12px 16px" borderRadius="12px"
          bg={ORANGE.ORPL} border={`1.5px solid ${ORANGE.ORBD}`}
          w="100%" flexWrap="wrap" mb="20px"
          opacity={isLoading && hasSeats ? "0.6" : "1"} transition="all .3s"
        >
          <Icon as={MdMovie} boxSize="18px" color={ORANGE.OR} />
          <Text fontSize="14px" fontWeight="700" color={ORANGE.OR}>
            {getMovieTitle(activeShowtime)}
          </Text>
          <Box w="1px" h="20px" bg={ORANGE.ORBD} />
          <Text fontSize="13px" color={theme.isDark ? "#a0aec0" : "#9a3412"}>
            {formatDateTime(getStartTime(activeShowtime))}
          </Text>
          <Box w="1px" h="20px" bg={ORANGE.ORBD} />
          <Text fontSize="13px" fontWeight="600" color={theme.isDark ? "#a0aec0" : "#9a3412"}>
            {getRoomName(activeShowtime)}
          </Text>
          <Badge colorScheme="orange" fontSize="11px" borderRadius="full" px="10px" py="4px">
            {getPrice(activeShowtime).toLocaleString('vi-VN')}đ
          </Badge>
          {hasSeats && (
            <Badge colorScheme="blue" fontSize="11px" borderRadius="full" px="10px" py="4px">
              {seats.length} ghế
            </Badge>
          )}
        </Flex>
      )}

      {/* Màn hình */}
      <Box
        bg={ORANGE.ORGRAD} color="white" textAlign="center" py="10px"
        borderRadius="12px" mb="20px" fontSize="11px" fontWeight="800" letterSpacing="4px"
        boxShadow={`0 4px 20px ${ORANGE.ORSW}`} position="relative" overflow="hidden"
        opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s"
      >
        ▬▬▬▬ MÀN HÌNH ▬▬▬▬
        <Box position="absolute" inset="0" bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" sx={{ animation: `${shimmer} 3s linear infinite`, bgSize: "200% 100%" }} />
      </Box>

      {/* Sơ đồ ghế (Có thanh cuộn ngang) */}
      <Box overflowX="auto" pb="10px" opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s">
        {!hasFullSelection ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Icon as={MdEventSeat} boxSize="48px" color={theme.textMuted} opacity="0.2" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>Vui lòng chọn đầy đủ thông tin</Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">Rạp chiếu, Phòng chiếu và Suất chiếu</Text>
          </Flex>
        ) : !hasSeats && !isLoading ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Icon as={MdSearch} boxSize="48px" color={ORANGE.OR} opacity="0.3" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>Chưa có ghế nào cho suất chiếu này</Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">Vui lòng bấm "Tạo ghế" để khởi tạo</Text>
          </Flex>
        ) : isLoading && !hasSeats ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Spinner size="xl" color={ORANGE.OR} thickness="4px" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>Đang tải dữ liệu ghế...</Text>
          </Flex>
        ) : (
          // ✅ Khung chứa ghế có minW để không bị bóp méo
          <Flex direction="column" gap={{ base: "6px", md: "8px" }} minW={isSmallScreen ? "500px" : "auto"} justify="center">
            {grouped.map((rowSeats, ri) => {
              const row = ROWS[ri];
              if (!rowSeats || rowSeats.length === 0) return null;
              return (
                <Flex key={row} align="center" gap={{ base: "6px", md: "10px" }}>
                  <Box w="24px" flexShrink="0">
                    <Text fontSize="12px" fontWeight="800" color={theme.textMuted} textAlign="center">{row}</Text>
                  </Box>
                  <Flex gap={{ base: "6px", md: "10px" }} flex="1" justify="center">
                    {rowSeats.map((seat) => {
                      if (!seat || !seat.id) return null;
                      return (
                        <SeatButton
                          key={seat.id} seat={seat}
                          isSelected={seat.id === selectedSeatId}
                          onClick={onSeatClick} onStatusChange={onStatusChange} theme={theme}
                        />
                      );
                    })}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        )}
      </Box>

      {/* Legend & Info */}
      <Box mt="20px" opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s">
        <Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }} justify="space-between" gap="10px">
          
          <Flex flexWrap="wrap" gap="8px 16px">
            <Text fontSize="10px" fontWeight="700" color={theme.textMuted} letterSpacing="1px" textTransform="uppercase" mr="4px">Chú thích:</Text>
            
            <Flex align="center" gap="5px">
              <Box w="16px" h="13px" borderRadius="3px" bg="#ecfdf5" border="1.5px solid #6ee7b7" />
              <Text fontSize="11px" color={theme.text} fontWeight="500">Trống</Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Box w="16px" h="13px" borderRadius="3px" bg="#dc2626" border="1.5px solid #dc2626" />
              <Text fontSize="11px" color={theme.text} fontWeight="500">Đã đặt</Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Box w="16px" h="13px" borderRadius="3px" bg="#fef3c7" border="1.5px solid #f59e0b" />
              <Text fontSize="11px" color={theme.text} fontWeight="500">Đang giữ</Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Box w="16px" h="13px" borderRadius="3px" bg="#ede9fe" border="1.5px solid #8b5cf6" />
              <Text fontSize="11px" color={theme.text} fontWeight="500">Lỗi</Text>
            </Flex>
            
            <Box w="1px" h="18px" bg={theme.textMuted} opacity="0.3" mx="4px" />
            
            {Object.entries(SEAT_TYPE_COLORS).map(([key, cfg]) => (
              <Flex key={key} align="center" gap="5px">
                <Box w="16px" h="13px" borderRadius="3px" bg="#f8fafc" border={`1.5px solid ${theme.textMuted}`} />
                <Text fontSize="11px" color={theme.text} fontWeight="500">{cfg.icon} {cfg.label}</Text>
              </Flex>
            ))}
          </Flex>
          
          {hasSeats && (
            <Flex align="center" gap="6px" flexShrink="0">
              <Icon as={MdInfoOutline} boxSize="14px" color={theme.textMuted} />
              <Text fontSize="11px" color={theme.textMuted}>
                Lấp đầy: <Text as="span" fontWeight="700" color={ORANGE.OR}>{occupancyRate}%</Text>
              </Text>
            </Flex>
          )}
        </Flex>

        <Flex align="center" gap="6px" mt="10px" p="8px 12px" borderRadius="8px" bg={theme.bgMuted} border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
          <Icon as={MdInfoOutline} boxSize="13px" color={theme.textMuted} />
          <Text fontSize="11px" color={theme.textMuted}><b>Click</b> vào ghế để xem chi tiết hoặc đổi trạng thái.</Text>
        </Flex>
      </Box>
    </Box>
  );
}