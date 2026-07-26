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
import { ORANGE, ROWS } from "../constants";
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

  // Nhóm ghế theo hàng
  const grouped = React.useMemo(() => {
    return ROWS.map((row) => seats.filter((s) => s.row === row));
  }, [seats]);

  // Format date an toàn
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Lấy tên phim từ showtime
  const getMovieTitle = (showtime) => {
    if (!showtime) return 'Unknown Movie';
    if (showtime.Movie?.Title) return showtime.Movie.Title;
    if (showtime.movie) return showtime.movie;
    if (showtime.MovieId?.Title) return showtime.MovieId.Title;
    return 'Unknown Movie';
  };

  // Lấy tên phòng từ showtime
  const getRoomName = (showtime) => {
    if (!showtime) return '';
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
    if (showtime.TicketPrice) return showtime.TicketPrice;
    return 0;
  };

  // Lấy thời gian từ showtime
  const getStartTime = (showtime) => {
    if (!showtime) return null;
    if (showtime.StartTime) return showtime.StartTime;
    if (showtime.startTime) return showtime.startTime;
    if (showtime.time) return showtime.time;
    return null;
  };

  // Lấy số ghế từ room
  const getSeatCount = (room) => {
    if (!room) return 0;
    if (room.SeatCount) return room.SeatCount;
    if (room.seatCount) return room.seatCount;
    if (room.capacity) return room.capacity;
    if (room.Capacity) return room.Capacity;
    if (seats.length > 0) return seats.length;
    return 0;
  };

  // Kiểm tra có đang loading không
  const isLoading = loading || isChangingData;

  // Kiểm tra đã có dữ liệu ghế chưa
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
    >
      {/* Selectors */}
      <VStack spacing="12px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px" w="100%">
          {/* Cinema Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdMeetingRoom} boxSize="14px" color={theme.textMuted} />
              <Text
                fontSize="10px"
                fontWeight="700"
                color={theme.textMuted}
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
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
                  {c.Name || c.name || c.CinemaName || 'Unknown Cinema'}
                </option>
              ))}
            </Select>
          </Box>

          {/* Room Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdEventSeat} boxSize="14px" color={theme.textMuted} />
              <Text
                fontSize="10px"
                fontWeight="700"
                color={theme.textMuted}
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
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
                    {r.Name || r.name || r.RoomName || 'Unknown Room'} ({seatCount} ghế)
                  </option>
                );
              })}
            </Select>
          </Box>

          {/* Showtime Select */}
          <Box>
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={MdAccessTime} boxSize="14px" color={theme.textMuted} />
              <Text
                fontSize="10px"
                fontWeight="700"
                color={theme.textMuted}
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
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
              {showtimesForRoom.map((s) => (
                <option key={s.id || s.ShowtimeId} value={s.id || s.ShowtimeId}>
                  {formatDateTime(getStartTime(s))} · {getMovieTitle(s)}
                </option>
              ))}
            </Select>
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
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="60px"
            gap="16px"
          >
            <Icon as={MdEventSeat} boxSize="48px" color={theme.textMuted} opacity="0.2" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Vui lòng chọn đầy đủ thông tin
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Rạp chiếu, Phòng chiếu và Suất chiếu
            </Text>
          </Flex>
        ) : !hasSeats && !isLoading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="60px"
            gap="16px"
          >
            <Icon as={MdSearch} boxSize="48px" color={ORANGE.OR} opacity="0.3" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Bấm "Xem ghế" để tải dữ liệu
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Sau khi chọn đủ thông tin, bấm nút Xem ghế
            </Text>
          </Flex>
        ) : isLoading && !hasSeats ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="60px"
            gap="16px"
          >
            <Spinner size="xl" color={ORANGE.OR} thickness="4px" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Đang tải dữ liệu ghế...
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Vui lòng chờ trong giây lát
            </Text>
          </Flex>
        ) : !hasSeats ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="60px"
            gap="16px"
          >
            <Icon as={MdEventSeat} boxSize="48px" color={theme.textMuted} opacity="0.3" />
            <Text fontSize="16px" fontWeight="600" color={theme.textMuted}>
              Chưa có ghế nào cho suất chiếu này
            </Text>
            <Text fontSize="13px" color={theme.textMuted} opacity="0.7">
              Vui lòng tạo ghế tự động
            </Text>
          </Flex>
        ) : (
          <Flex
            direction="column"
            gap={{ base: "6px", md: "8px" }}
            minW={isSmallScreen ? "400px" : "auto"}
          >
            {grouped.map((rowSeats, ri) => (
              <Flex
                key={ROWS[ri]}
                align="center"
                gap={{ base: "6px", md: "10px" }}
              >
                <Box w="24px" flexShrink="0">
                  <Text
                    fontSize="12px"
                    fontWeight="800"
                    color={theme.textMuted}
                    textAlign="center"
                  >
                    {ROWS[ri]}
                  </Text>
                </Box>
                <Flex
                  gap={{ base: "6px", md: "10px" }}
                  flex="1"
                  justify="center"
                >
                  {rowSeats.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={seat.id === selectedSeatId}
                      onClick={onSeatClick}
                      onStatusChange={onStatusChange}
                      theme={theme}
                    />
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>

      {/* Legend & Info */}
      <Box mt="20px" opacity={isLoading && hasSeats ? "0.5" : "1"} transition="all .3s">
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          gap="10px"
        >
          <SeatLegend theme={theme} />
          {hasSeats && (
            <Flex align="center" gap="6px">
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