// src/views/admin/quanlytrangthaighe/components/SeatMapView.jsx

import React from "react";
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  VStack,
  Badge,
  Icon,
  Select,
  useBreakpointValue,
  Spinner
} from "@chakra-ui/react";
import {
  MdMovie,
  MdAccessTime,
  MdEventSeat,
  MdInfoOutline,
  MdMeetingRoom,
  MdSearch
} from "react-icons/md";
import { ORANGE, ROWS, SEAT_TYPE_COLORS } from "../constants";
import SeatButton from "./SeatButton";
import { SeatLegend } from "./SeatLegend";
import { shimmer } from "./shared/animations";

export function SeatMapView({
  cinemaId,
  roomId,
  showtimeId,
  showtimesForRoom = [],
  activeShowtime,
  seats = [],
  selectedSeatId,
  onCinemaChange,
  onRoomChange,
  onShowtimeChange,
  onSeatClick,
  onStatusChange,
  theme,
  isMobile,
  occupancyRate = 0,
  cinemas = [],
  rooms = [],
  loading = false,
  isChangingData = false,
  hasFullSelection = false
}) {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // ✅ Nhóm ghế theo hàng - Lọc bỏ ghế không hợp lệ
  const grouped = React.useMemo(() => {
    const validSeats = seats.filter(s => s && s.row && s.num !== undefined && s.num !== null);
    return ROWS.map((row) => validSeats.filter((s) => s.row === row));
  }, [seats]);

  // ✅ Format date an toàn
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có lịch';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parsed = Date.parse(dateString);
        if (isNaN(parsed)) return dateString;
        return new Date(parsed).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // ✅ Lấy tên phim từ showtime
  const getMovieTitle = (showtime) => {
    if (!showtime) return 'Unknown';
    if (showtime.movie_title) return showtime.movie_title;
    if (showtime.Movie?.Title) return showtime.Movie.Title;
    if (showtime.movie?.title) return showtime.movie.title;
    if (showtime.MovieId?.Title) return showtime.MovieId.Title;
    if (showtime.movie) return showtime.movie;
    return 'Unknown';
  };

  // Lấy tên phòng từ showtime
  const getRoomName = (showtime) => {
    if (!showtime) return '';
    if (showtime.room_name) return showtime.room_name;
    if (showtime.Room?.Name) return showtime.Room.Name;
    if (showtime.roomName) return showtime.roomName;
    if (showtime.RoomId?.Name) return showtime.RoomId.Name;
    return '';
  };

  // Lấy giá vé từ showtime
  const getPrice = (showtime) => {
    if (!showtime) return 0;
    if (showtime.Price) return showtime.Price;
    if (showtime.price) return showtime.price;
    return 0;
  };

  // Lấy thời gian từ showtime
  const getStartTime = (showtime) => {
    if (!showtime) return null;
    if (showtime.start_time) return showtime.start_time;
    if (showtime.StartTime) return showtime.StartTime;
    return null;
  };

  // Lấy số ghế từ room
  const getSeatCount = (room) => {
    if (!room) return 0;
    if (room.SeatCount) return room.SeatCount;
    if (room.seatCount) return room.seatCount;
    if (room.capacity) return room.capacity;
    if (seats.length > 0) return seats.length;
    return 0;
  };

  const isLoading = loading || isChangingData;
  const hasSeats = seats.length > 0;

  // ✅ Hàm lấy màu cho từng loại ghế trong Legend
  const getLegendColor = (type) => {
    const colors = {
      normal: { bg: "#ecfdf5", border: "#6ee7b7", label: "Thường" },
      vip: { bg: "#ede9fe", border: "#8b5cf6", label: "VIP" },
      couple: { bg: "#fef3c7", border: "#f59e0b", label: "Đôi" },
      sweetbox: { bg: "#fce7f3", border: "#ec4899", label: "Sweetbox" },
      accessible: { bg: "#dbeafe", border: "#3b82f6", label: "Ưu tiên" },
    };
    return colors[type] || colors.normal;
  };

  return (
    <Box
      bg={theme.bgCard}
      borderRadius="20px"
      border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
      boxShadow={theme.shadow}
      p={{ base: "14px", md: "24px" }}
      transition="all .3s"
      _hover={{ boxShadow: theme.shadowHover }}
    >
      {/* Selectors */}
      <VStack spacing="12px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px" w="100%">
          {/* Cinema Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdMeetingRoom} boxSize="14px" color={theme.textMuted} />
              <Text fontSize="10px" fontWeight="700" color={theme.textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Rạp chiếu
              </Text>
            </Flex>
            <Select
              value={cinemaId || ""}
              onChange={(e) => onCinemaChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="12px"
              color={theme.text}
              fontSize="13px"
              fontWeight="600"
              h="44px"
              _focus={{
                border: `1.5px solid ${ORANGE.OR}`,
                boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
              }}
              _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
              transition="all .25s"
              isDisabled={cinemas.length === 0}
            >
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((c) => (
                <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>
                  {c.name || c.Name || c.CinemaName || 'Unknown Cinema'}
                </option>
              ))}
            </Select>
          </Box>

          {/* Room Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdEventSeat} boxSize="14px" color={theme.textMuted} />
              <Text fontSize="10px" fontWeight="700" color={theme.textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Phòng chiếu
              </Text>
            </Flex>
            <Select
              value={roomId || ""}
              onChange={(e) => onRoomChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="12px"
              color={theme.text}
              fontSize="13px"
              fontWeight="600"
              h="44px"
              _focus={{
                border: `1.5px solid ${ORANGE.OR}`,
                boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
              }}
              _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
              transition="all .25s"
              isDisabled={rooms.length === 0}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => {
                const seatCount = getSeatCount(r);
                return (
                  <option key={r.id || r.RoomId} value={r.id || r.RoomId}>
                    {r.name || r.Name || r.RoomName || 'Unknown Room'} ({seatCount} ghế)
                  </option>
                );
              })}
            </Select>
          </Box>

          {/* Showtime Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdAccessTime} boxSize="14px" color={theme.textMuted} />
              <Text fontSize="10px" fontWeight="700" color={theme.textMuted} letterSpacing="0.8px" textTransform="uppercase">
                Suất chiếu
              </Text>
            </Flex>
            <Select
              value={showtimeId || ""}
              onChange={(e) => onShowtimeChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="12px"
              color={theme.text}
              fontSize="13px"
              fontWeight="600"
              h="44px"
              _focus={{
                border: `1.5px solid ${ORANGE.OR}`,
                boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
              }}
              _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
              transition="all .25s"
              isDisabled={showtimesForRoom.length === 0}
            >
              <option value="">-- Chọn suất chiếu --</option>
              {showtimesForRoom.map((st) => {
                const id = st.id || st.ShowtimeId;
                const movieTitle = getMovieTitle(st);
                const timeStr = getStartTime(st);
                const formattedTime = formatDateTime(timeStr);
                
                return (
                  <option key={id} value={id}>
                    {movieTitle} - {formattedTime}
                  </option>
                );
              })}
            </Select>
            {showtimesForRoom.length === 0 && roomId && (
              <Text fontSize="11px" color="#f59e0b" mt="2px">⚠️ Không có suất chiếu</Text>
            )}
          </Box>
        </SimpleGrid>

        {/* Active Showtime Info */}
        {activeShowtime && (
          <Flex
            align="center"
            gap="12px"
            p="10px 16px"
            borderRadius="12px"
            bg={ORANGE.ORPL}
            border={`1.5px solid ${ORANGE.ORBD}`}
            w="100%"
            flexWrap="wrap"
            opacity={isLoading && hasSeats ? "0.6" : "1"}
            transition="all .3s"
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
            <Badge
              colorScheme="orange"
              fontSize="11px"
              borderRadius="full"
              px="10px"
              py="4px"
            >
              {getPrice(activeShowtime).toLocaleString('vi-VN')}đ
            </Badge>
            {hasSeats && (
              <Badge
                colorScheme="blue"
                fontSize="11px"
                borderRadius="full"
                px="10px"
                py="4px"
              >
                {seats.length} ghế
              </Badge>
            )}
          </Flex>
        )}
      </VStack>

      {/* Screen */}
      <Box
        bg={ORANGE.ORGRAD}
        color="white"
        textAlign="center"
        py="10px"
        borderRadius="12px"
        mb="20px"
        fontSize="11px"
        fontWeight="800"
        letterSpacing="4px"
        boxShadow={`0 4px 20px ${ORANGE.ORSW}`}
        position="relative"
        overflow="hidden"
        opacity={isLoading && hasSeats ? "0.5" : "1"}
        transition="all .3s"
        sx={{
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: `${shimmer} 3s linear infinite`,
            bgSize: "200% 100%",
          },
        }}
      >
        ▬▬▬▬ MÀN HÌNH ▬▬▬▬
      </Box>

      {/* Seat Grid */}
      <Box overflowX="auto" pb="4px" opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s">
        {!hasFullSelection ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Icon as={MdEventSeat} boxSize="48px" color={theme.textMuted} opacity="0.2" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Vui lòng chọn đầy đủ thông tin
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Rạp chiếu, Phòng chiếu và Suất chiếu
            </Text>
          </Flex>
        ) : !hasSeats && !isLoading ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Icon as={MdSearch} boxSize="48px" color={ORANGE.OR} opacity="0.3" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Chưa có ghế nào cho suất chiếu này
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Vui lòng tạo ghế tự động
            </Text>
          </Flex>
        ) : isLoading && !hasSeats ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="16px">
            <Spinner size="xl" color={ORANGE.OR} thickness="4px" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Đang tải dữ liệu ghế...
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" gap={{ base: "6px", md: "8px" }} minW={isSmallScreen ? "400px" : "auto"}>
            {grouped.map((rowSeats, ri) => {
              const row = ROWS[ri];
              if (!rowSeats || rowSeats.length === 0) return null;
              
              return (
                <Flex key={row} align="center" gap={{ base: "6px", md: "10px" }}>
                  <Box w="24px" flexShrink="0">
                    <Text fontSize="12px" fontWeight="800" color={theme.textMuted} textAlign="center">
                      {row}
                    </Text>
                  </Box>
                  <Flex gap={{ base: "6px", md: "10px" }} flex="1" justify="center">
                    {rowSeats.map((seat) => {
                      if (!seat || !seat.id) return null;
                      
                      return (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          isSelected={seat.id === selectedSeatId}
                          onClick={onSeatClick}
                          onStatusChange={onStatusChange}
                          theme={theme}
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

      {/* ✅ Legend & Info - SỬA PHẦN NÀY */}
      <Box mt="20px" opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s">
        <Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }} justify="space-between" gap="10px">
          
          {/* ✅ Legend đầy đủ */}
          <Flex flexWrap="wrap" gap="8px 16px">
            <Text fontSize="10px" fontWeight="700" color={theme.textMuted} letterSpacing="1px" textTransform="uppercase" mr="4px">
              Chú thích:
            </Text>
            
            {/* Trạng thái ghế */}
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
            <Flex align="center" gap="5px">
              <Box w="16px" h="13px" borderRadius="3px" bg="#f3f4f6" border="1.5px solid #9ca3af" />
              <Text fontSize="11px" color={theme.text} fontWeight="500">Bảo trì</Text>
            </Flex>
            
            <Box w="1px" h="18px" bg={theme.textMuted} opacity="0.3" mx="4px" />
            
            {/* ✅ Loại ghế - Thêm đầy đủ */}
            {Object.entries(SEAT_TYPE_COLORS).map(([key, cfg]) => {
              const colors = getLegendColor(key);
              return (
                <Flex key={key} align="center" gap="5px">
                  <Box w="16px" h="13px" borderRadius="3px" bg={colors.bg} border={`1.5px solid ${colors.border}`} />
                  <Text fontSize="11px" color={theme.text} fontWeight="500">
                    {cfg.icon && <span style={{ marginRight: '2px' }}>{cfg.icon}</span>}
                    {cfg.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
          
          {/* Tỷ lệ lấp đầy */}
          {hasSeats && (
            <Flex align="center" gap="6px" flexShrink="0">
              <Icon as={MdInfoOutline} boxSize="14px" color={theme.textMuted} />
              <Text fontSize="11px" color={theme.textMuted}>
                Tỷ lệ lấp đầy:{" "}
                <Text as="span" fontWeight="700" color={ORANGE.OR}>
                  {occupancyRate}%
                </Text>
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Info hover */}
        <Flex
          align="center"
          gap="6px"
          mt="10px"
          p="8px 12px"
          borderRadius="8px"
          bg={theme.bgMuted}
          border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
        >
          <Icon as={MdInfoOutline} boxSize="13px" color={theme.textMuted} />
          <Text fontSize="11px" color={theme.textMuted}>
            <b>Hover</b> vào ghế để đổi trạng thái nhanh
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}