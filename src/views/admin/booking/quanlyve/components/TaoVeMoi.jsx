import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  Textarea,
  Button,
  Icon,
  SimpleGrid,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  FormControl,
  FormErrorMessage,
  HStack,
  VStack,
  Badge,
  Divider,
  Card,
  CardBody,
  useColorMode,
  Spinner,
  Stack,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdSave,
  MdClose,
  MdPerson,
  MdMovie,
  MdEventSeat,
  MdTheaters,
  MdReceiptLong,
  MdLocalActivity,
  MdFastfood,
  MdVerified,
  MdSearch,
  MdClear,
  MdExpandMore,
} from 'react-icons/md';
import { useCreateTicketForm } from '../hooks/useCreateTicketForm';
import TicketApi from 'api/booking/TicketApi';
import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';
import OrderApi from 'api/booking/OrderApi';
import OrderDetailApi from 'api/booking/OrderDetailApi';

// Debounce helperapi/booking/OrderDetailApi
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Helper lấy tên phòng an toàn (đặt ở đây, bên ngoài component)
const getSafeRoomName = (showtime) => {
  if (!showtime) return 'Chưa có tên';

  //  TRƯỜNG HỢP 1: RoomId là object chứa thông tin phòng (từ log của bạn)
  if (showtime.RoomId && typeof showtime.RoomId === 'object') {
    return showtime.RoomId.Name || showtime.RoomId.name || 'Phòng chiếu';
  }

  // TRƯỜNG HỢP 2: Room là object
  if (showtime.Room && typeof showtime.Room === 'object') {
    return showtime.Room.Name || showtime.Room.name || 'Phòng chiếu';
  }

  // TRƯỜNG HỢP 3: room là object
  if (showtime.room && typeof showtime.room === 'object') {
    return showtime.room.Name || showtime.room.name || 'Phòng chiếu';
  }

  // TRƯỜNG HỢP 4: RoomId là string hoặc number
  if (showtime.RoomId && typeof showtime.RoomId !== 'object') {
    return `Phòng ${showtime.RoomId}`;
  }

  // TRƯỜNG HỢP 5: Các trường tên phòng khác
  if (showtime.RoomName) return showtime.RoomName;
  if (showtime.roomName) return showtime.roomName;

  return 'Chưa có tên';
};

// ✅ Helper format thời gian
const formatShowtimeTime = (showtime) => {
  if (!showtime) return 'Không có thời gian';

  try {
    const timeValue =
      showtime.StartTime ||
      showtime.startTime ||
      showtime.time ||
      showtime.datetime;

    if (!timeValue) return 'Không có thời gian';

    const dateObj = new Date(timeValue);
    if (isNaN(dateObj.getTime())) {
      return String(timeValue);
    }

    return dateObj.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('❌ Lỗi format thời gian:', error);
    return 'Lỗi định dạng';
  }
};

// Component SelectWithSearch
const SelectWithSearch = ({
  items = [],
  value,
  onChange,
  placeholder = 'Chọn...',
  labelKey = 'name',
  valueKey = 'id',
  searchPlaceholder = 'Tìm kiếm...',
  isLoading = false,
  renderItem,
  isDisabled = false,
  error,
  leftIcon,
  ...props
}) => {
  const [search, setSearch] = useState('');
  const { isOpen: isMenuOpen, onOpen, onClose } = useDisclosure();
  const debouncedSearch = useDebounce(search, 200);

  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) return items;
    const keyword = debouncedSearch.toLowerCase().trim();
    return items.filter((item) => {
      const label = (item[labelKey] || '').toLowerCase();
      return label.includes(keyword);
    });
  }, [items, debouncedSearch, labelKey]);

  const selectedItem = items.find(
    (item) => String(item[valueKey]) === String(value),
  );

  const handleSelect = (item) => {
    onChange(item[valueKey]);
    setSearch('');
    onClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  const bgColor = useColorModeValue('#fafafa', '#0B1437');
  const borderColor = useColorModeValue('#e8edf3', 'rgba(255,255,255,0.12)');
  const textColor = useColorModeValue('#1a202c', '#ffffff');
  const placeholderColor = useColorModeValue('#b0bac8', '#8b9bc4');
  const menuBg = useColorModeValue('white', '#1a202c');
  const menuBorder = useColorModeValue('#e8edf3', 'rgba(255,255,255,0.12)');
  const hoverBg = 'rgba(249,115,22,0.08)';

  return (
    <Box position="relative" w="100%" {...props}>
      <Menu
        isOpen={isMenuOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom-start"
        matchWidth
        closeOnSelect={false}
      >
        <MenuButton
          as={Box}
          w="100%"
          bg={bgColor}
          border="1.5px solid"
          borderColor={error ? 'red.400' : borderColor}
          borderRadius="10px"
          color={textColor}
          fontSize="14px"
          fontWeight="500"
          px="14px"
          h={{ base: '48px', md: '44px' }}
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
          opacity={isDisabled ? 0.5 : 1}
          _hover={{ borderColor: '#f97316' }}
          _focus={{
            border: '1.5px solid #f97316',
            boxShadow: '0 0 0 3px rgba(249,115,22,0.10)',
          }}
          _expanded={{
            border: '1.5px solid #f97316',
            boxShadow: '0 0 0 3px rgba(249,115,22,0.10)',
          }}
          transition="all 0.2s ease"
          onClick={!isDisabled ? onOpen : undefined}
        >
          <Flex align="center" justify="space-between" h="100%">
            <Flex align="center" gap="8px" minW="0" flex="1">
              {leftIcon && (
                <Icon
                  as={leftIcon}
                  color="gray.400"
                  boxSize="18px"
                  flexShrink="0"
                />
              )}
              <Text
                isTruncated
                color={selectedItem ? 'inherit' : placeholderColor}
                fontSize="14px"
              >
                {selectedItem ? selectedItem[labelKey] : placeholder}
              </Text>
            </Flex>
            <Flex align="center" gap="4px" flexShrink="0">
              {selectedItem && (
                <IconButton
                  aria-label="Clear"
                  icon={<Icon as={MdClear} />}
                  size="xs"
                  variant="ghost"
                  onClick={handleClear}
                  _hover={{ color: '#f97316' }}
                />
              )}
              <Icon as={MdExpandMore} color="gray.400" boxSize="20px" />
            </Flex>
          </Flex>
        </MenuButton>

        <Portal>
          <MenuList
            zIndex={9999}
            bg={menuBg}
            borderColor={menuBorder}
            boxShadow="0 8px 30px rgba(0,0,0,0.15)"
            maxH="320px"
            overflow="hidden"
            p="8px"
            minW={{ base: '280px', md: '350px' }}
          >
            <Box p="0 0 8px 0">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={MdSearch} color="gray.400" boxSize="16px" />
                </InputLeftElement>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  color={useColorModeValue('#1a202c', '#ffffff')}
                  bg={useColorModeValue('white', '#2d3748')}
                  border="1px solid"
                  borderColor={useColorModeValue(
                    '#e2e8f0',
                    'rgba(255,255,255,0.15)',
                  )}
                  borderRadius="8px"
                  fontSize="13px"
                  fontWeight="500"
                  _placeholder={{
                    color: useColorModeValue('#a0aec0', '#718096'),
                    fontWeight: '400',
                  }}
                  _hover={{
                    borderColor: '#f97316',
                  }}
                  _focus={{
                    borderColor: '#f97316',
                    boxShadow: '0 0 0 2px rgba(249,115,22,0.15)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {search && (
                  <InputRightElement>
                    <IconButton
                      aria-label="Clear search"
                      icon={<Icon as={MdClear} />}
                      size="xs"
                      variant="ghost"
                      color={useColorModeValue('#4a5568', '#a0aec0')}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearch('');
                      }}
                      _hover={{ color: '#f97316' }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>

            <Box
              maxH="200px"
              overflowY="auto"
              sx={{
                '::-webkit-scrollbar': {
                  width: '4px',
                },
                '::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('#cbd5e1', '#4a5568'),
                  borderRadius: 'full',
                },
              }}
            >
              {isLoading ? (
                <Flex justify="center" p="16px">
                  <Spinner size="sm" color="#f97316" />
                </Flex>
              ) : filteredItems.length === 0 ? (
                <Text
                  p="12px"
                  color={useColorModeValue('#4a5568', '#a0aec0')}
                  fontSize="13px"
                  textAlign="center"
                >
                  {search ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                </Text>
              ) : (
                filteredItems.map((item) => (
                  <MenuItem
                    key={item[valueKey]}
                    onClick={() => handleSelect(item)}
                    bg={
                      String(item[valueKey]) === String(value)
                        ? hoverBg
                        : 'transparent'
                    }
                    _hover={{ bg: hoverBg }}
                    _focus={{ bg: hoverBg }}
                    borderRadius="6px"
                    p="8px 12px"
                  >
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <Text
                        fontWeight="500"
                        fontSize="14px"
                        color={useColorModeValue('#1a202c', '#ffffff')}
                      >
                        {item[labelKey]}
                      </Text>
                    )}
                  </MenuItem>
                ))
              )}
            </Box>

            {filteredItems.length > 0 && (
              <Box
                p="6px 12px"
                borderTop="1px solid"
                borderColor={useColorModeValue(
                  '#e2e8f0',
                  'rgba(255,255,255,0.08)',
                )}
                mt="8px"
                pt="8px"
              >
                <Text
                  fontSize="11px"
                  color={useColorModeValue('#718096', '#a0aec0')}
                  textAlign="center"
                >
                  {filteredItems.length} kết quả
                </Text>
              </Box>
            )}
          </MenuList>
        </Portal>
      </Menu>

      {error && (
        <Text fontSize="12px" color="red.400" mt="1" fontWeight="600">
          {error}
        </Text>
      )}
    </Box>
  );
};

// Component chính
const TaoVeMoi = ({ onCreate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    users,
    movies,
    showtimes,
    seats,
    combos,
    loading,
    filterShowtimesByMovie,
    fetchSeatsByShowtime,
  } = useCreateTicketForm();

  const [formData, setFormData] = useState({
    userId: '',
    customer: '',
    email: '',
    phone: '',
    movieId: '',
    movie: '',
    showtimeId: '',
    showtime: '',
    roomId: '',
    selectedSeats: [],
    price: '',
    status: 'Đã thanh toán',
    note: '',
    comboId: '',
    combo: '',
  });

  const [errors, setErrors] = useState({});
  const [localShowtimes, setLocalShowtimes] = useState([]);
  const [selectedSeatLabels, setSelectedSeatLabels] = useState([]);

  useEffect(() => {
    setLocalShowtimes(showtimes);
  }, [showtimes]);

  // Khi chọn user
  const handleUserChange = (userId) => {
    if (!userId) {
      setFormData({
        ...formData,
        userId: '',
        customer: '',
        email: '',
        phone: '',
      });
      return;
    }
    const selectedUser = users.find(
      (u) => String(u.UserId || u.id) === String(userId),
    );
    if (selectedUser) {
      setFormData({
        ...formData,
        userId: userId,
        customer:
          selectedUser.FullName ||
          selectedUser.fullName ||
          selectedUser.name ||
          '',
        email: selectedUser.Email || selectedUser.email || '',
        phone: selectedUser.PhoneNumber || selectedUser.phone || '',
      });
      setErrors({ ...errors, userId: '', customer: '', email: '' });
    }
  };

  // Khi chọn phim
  const handleMovieChange = (movieId) => {
    if (!movieId) {
      setFormData({
        ...formData,
        movieId: '',
        movie: '',
        showtimeId: '',
        showtime: '',
        roomId: '',
        selectedSeats: [],
        price: '',
      });
      setSelectedSeatLabels([]);
      setLocalShowtimes([]);
      return;
    }
    const selectedMovie = movies.find(
      (m) => String(m.MovieId || m.id) === String(movieId),
    );
    setFormData({
      ...formData,
      movieId: movieId,
      movie: selectedMovie?.Title || selectedMovie?.title || '',
      showtimeId: '',
      showtime: '',
      roomId: '',
      selectedSeats: [],
      price: '',
    });
    setSelectedSeatLabels([]);
    setErrors({ ...errors, movieId: '', movie: '' });
    filterShowtimesByMovie(movieId);
  };

  // Khi chọn suất chiếu
  const handleShowtimeChange = (e) => {
    const showtimeId = e.target.value;
    if (!showtimeId) {
      setFormData({
        ...formData,
        showtimeId: '',
        showtime: '',
        roomId: '',
        selectedSeats: [],
        price: '',
      });
      setSelectedSeatLabels([]);
      return;
    }

    const selectedShowtime = localShowtimes.find(
      (s) => String(s.ShowtimeId || s.id) === String(showtimeId),
    );

    if (selectedShowtime) {
      console.log('🔍 Selected showtime:', selectedShowtime);

      const movieTitle =
        selectedShowtime.MovieId?.Title ||
        selectedShowtime.movieId?.Title ||
        selectedShowtime.Movie?.Title ||
        selectedShowtime.movie?.title ||
        formData.movie;

      // ✅ Sử dụng helper để lấy tên phòng
      const roomName = getSafeRoomName(selectedShowtime);

      // ✅ Sử dụng helper để format thời gian
      const formattedTime = formatShowtimeTime(selectedShowtime);

      const price = selectedShowtime.Price || selectedShowtime.price || 0;
      const roomId = selectedShowtime.RoomId || selectedShowtime.roomId || '';

      console.log('✅ Room name:', roomName);
      console.log('✅ Formatted time:', formattedTime);

      setFormData({
        ...formData,
        showtimeId: showtimeId,
        showtime: `${formattedTime} - Phòng ${roomName}`,
        roomId: roomId,
        selectedSeats: [],
        price: price ? Number(price).toLocaleString() : '',
        movie: movieTitle || formData.movie,
      });
      setSelectedSeatLabels([]);
      setErrors({ ...errors, showtimeId: '', showtime: '', price: '' });

      if (showtimeId) {
        fetchSeatsByShowtime(showtimeId);
      }
    }
  };

  // Khi chọn/bỏ chọn ghế
  const handleSeatToggle = (seatId, seatLabel) => {
    const selectedSeat = seats.find(
      (item) => String(item.ShowtimeSeatId || item.id) === String(seatId),
    );

    if (!selectedSeat) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy ghế này',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const status = selectedSeat.Status || selectedSeat.status || 'Available';
    if (status !== 'Available' && status !== 'available') {
      toast({
        title: 'Ghế đã được đặt',
        description: `Ghế ${seatLabel} đã được đặt, vui lòng chọn ghế khác`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const isSelected = formData.selectedSeats.some(
      (s) => String(s.id) === String(seatId),
    );

    let newSelectedSeats;
    let newSelectedLabels;

    if (isSelected) {
      newSelectedSeats = formData.selectedSeats.filter(
        (s) => String(s.id) !== String(seatId),
      );
      newSelectedLabels = selectedSeatLabels.filter(
        (label) => label !== seatLabel,
      );
    } else {
      const seatData = selectedSeat.Seat || selectedSeat.seat || {};
      newSelectedSeats = [
        ...formData.selectedSeats,
        {
          id: seatId,
          seatId:
            seatData.SeatId ||
            seatData.id ||
            selectedSeat.SeatId ||
            selectedSeat.id,
          showtimeSeatId: seatId,
          label: seatLabel,
        },
      ];
      newSelectedLabels = [...selectedSeatLabels, seatLabel];
    }

    setFormData({
      ...formData,
      selectedSeats: newSelectedSeats,
    });
    setSelectedSeatLabels(newSelectedLabels);
    setErrors({ ...errors, seat: '' });
  };

  const handleComboChange = (e) => {
    const comboId = e.target.value;
    if (!comboId) {
      setFormData({ ...formData, comboId: '', combo: '' });
      return;
    }
    const selectedCombo = combos.find(
      (c) => String(c.ItemId || c.id) === String(comboId),
    );
    if (selectedCombo) {
      setFormData({
        ...formData,
        comboId: comboId,
        combo: selectedCombo.Name || selectedCombo.name || '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'Vui lòng chọn khách hàng';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    if (!formData.movieId) newErrors.movieId = 'Vui lòng chọn phim';
    if (!formData.showtimeId) newErrors.showtimeId = 'Vui lòng chọn suất chiếu';
    if (!formData.price) newErrors.price = 'Vui lòng chọn suất chiếu';
    if (formData.selectedSeats.length === 0)
      newErrors.seat = 'Vui lòng chọn ít nhất 1 ghế';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const statusMap = {
        'Đã thanh toán': 'Paid',
        'Đã check-in': 'Paid',
        'Chờ xử lý': 'Pending',
        'Đã hủy': 'Cancelled',
        'Hết hạn': 'Cancelled',
      };

      const ticketPrice = formData.price
        ? Number(String(formData.price).replace(/[^\d]/g, ''))
        : 0;
      const selectedCombo = combos.find(
        (c) => String(c.ItemId || c.id) === String(formData.comboId),
      );
      const comboPrice = selectedCombo?.Price || selectedCombo?.price || 0;

      const totalAmount =
        ticketPrice * formData.selectedSeats.length + comboPrice;
      const orderData = {
        UserId: formData.userId,
        TotalAmount: totalAmount,
        Status: statusMap[formData.status] || 'Paid',
        OrderDate: new Date().toISOString(),
        Note: formData.note || '',
      };

      const orderResponse = await OrderApi.create(orderData);
      const orderResponseData =
        orderResponse?.data?.data || orderResponse?.data || orderResponse || {};
      const orderId = orderResponseData.OrderId || orderResponseData.id;

      if (!orderId) {
        throw new Error('Không thể tạo đơn hàng');
      }

      const createdTickets = [];
      for (const seat of formData.selectedSeats) {
        const ticketData = {
          ShowtimeId: formData.showtimeId,
          SeatId: seat.seatId,
          UserId: formData.userId,
          Status: statusMap[formData.status] || 'Paid',
        };

        const ticketResponse = await TicketApi.create(ticketData);
        const ticketResponseData =
          ticketResponse?.data?.data ||
          ticketResponse?.data ||
          ticketResponse ||
          {};
        const ticketId = ticketResponseData.TicketId || ticketResponseData.id;

        if (!ticketId) {
          throw new Error(`Không thể tạo vé cho ghế ${seat.label}`);
        }

        const updateData = {
          ShowtimeId: formData.showtimeId,
          SeatId: seat.seatId,
          Status: 'Reserved',
        };

        try {
          await ShowtimeSeatApi.update(seat.showtimeSeatId, updateData);
        } catch (seatErr) {
          console.error(
            `❌ Lỗi cập nhật trạng thái ghế ${seat.label}:`,
            seatErr,
          );
        }

        await OrderDetailApi.create({
          OrderId: orderId,
          TicketId: ticketId,
          ItemId: null,
          Quantity: 1,
          Price: ticketPrice,
          Status: 'Active',
        });

        createdTickets.push({
          id: ticketId,
          code: ticketResponseData.code || `VE${String(ticketId).slice(-4)}`,
          seat: seat.label,
          seatId: seat.seatId,
          showtimeSeatId: seat.showtimeSeatId,
        });
      }

      if (formData.comboId) {
        const firstTicketId = createdTickets[0]?.id;
        await OrderDetailApi.create({
          OrderId: orderId,
          TicketId: firstTicketId,
          ItemId: formData.comboId,
          Quantity: 1,
          Price: comboPrice,
          Status: 'Active',
        });
      }

      if (formData.showtimeId) {
        await fetchSeatsByShowtime(formData.showtimeId);
      }

      const firstTicket = createdTickets[0] || {};
      const newTicket = {
        id: firstTicket.id || Date.now(),
        code: firstTicket.code || `VE${String(Date.now()).slice(-4)}`,
        userId: formData.userId,
        customer: formData.customer || 'Khách hàng',
        email: formData.email || '',
        phone: formData.phone || '',
        movie: formData.movie || 'Phim',
        showtime: formData.showtime || '',
        seat: createdTickets.map((t) => t.seat).join(', '),
        price: ticketPrice
          ? `${(ticketPrice * createdTickets.length).toLocaleString()}đ`
          : '0đ',
        status: formData.status || 'Đã thanh toán',
        note: formData.note || '',
        combo: formData.combo || '',
        comboId: formData.comboId || null,
        qr: `QR-${String(firstTicket.id || Date.now()).slice(-4)}`,
        showtimeId: formData.showtimeId,
        seatId: firstTicket.seatId || null,
        showtimeSeatId: firstTicket.showtimeSeatId || null,
        orderId: orderId,
        totalTickets: createdTickets.length,
        allSeats: createdTickets.map((t) => t.seat).join(', '),
      };

      if (onCreate) {
        await onCreate(newTicket);
      }

      toast({
        title: 'Thành công 🎉',
        description: `${createdTickets.length} vé đã được tạo cho ${
          newTicket.customer
        }${formData.combo ? ` kèm combo ${formData.combo}` : ''}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      navigate('/admin/ve-don-hang/ve');
    } catch (err) {
      console.error('❌ Lỗi tạo vé:', err);
      toast({
        title: 'Lỗi tạo vé',
        description:
          err.response?.data?.message || err.message || 'Không thể tạo vé',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render sơ đồ ghế
  const renderSeatMap = () => {
    if (!formData.showtimeId || seats.length === 0) {
      return (
        <Box
          p="28px 20px"
          textAlign="center"
          borderRadius="12px"
          bg={softTileBg}
          border={`1.5px dashed ${dashedBorder}`}
        >
          <Flex
            align="center"
            justify="center"
            w="44px"
            h="44px"
            borderRadius="12px"
            bg={isDark ? 'rgba(255,255,255,0.05)' : 'white'}
            mx="auto"
            mb="10px"
            border={`1px solid ${cardBorder}`}
          >
            <Icon as={MdTheaters} boxSize="20px" color={textMuted} />
          </Flex>
          <Text fontSize="13px" color={textMuted} fontWeight="500">
            {formData.showtimeId
              ? 'Không có ghế nào'
              : 'Chọn suất chiếu để xem sơ đồ ghế'}
          </Text>
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
      const isSelected = formData.selectedSeats.some(
        (s) => String(s.id) === String(seatId),
      );

      if (!seatsByRow[row]) {
        seatsByRow[row] = [];
      }
      seatsByRow[row].push({
        row,
        number,
        seatId,
        isAvailable,
        isSelected,
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

    return (
      <Box
        borderRadius="16px"
        p={{ base: '18px 12px', md: '26px 22px' }}
        bg={
          isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.06), transparent 60%), #0d1a4a'
            : 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.05), transparent 60%), #fbfcfe'
        }
        border={`1px solid ${cardBorder}`}
        boxShadow={
          isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.6)'
        }
      >
        {/* Màn hình */}
        <Flex justify="center" mb={{ base: '26px', md: '34px' }}>
          <Box position="relative" w={{ base: '94%', md: '78%' }}>
            <Box
              h={{ base: '8px', md: '10px' }}
              borderRadius="50%"
              bg={`linear-gradient(90deg, transparent, ${OR}, ${ORL}, ${OR}, transparent)`}
              opacity={isDark ? 0.85 : 0.7}
              boxShadow={`0 8px 24px ${
                isDark ? 'rgba(249,115,22,0.35)' : 'rgba(249,115,22,0.25)'
              }`}
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

        {/* Sơ đồ ghế */}
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
                  bg={isDark ? 'rgba(255,255,255,0.06)' : '#eef2f7'}
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

                        let bgColor, textColor, borderColor, cursor, opacity;

                        if (isSelected) {
                          bgColor = GRADIENT;
                          textColor = 'white';
                          borderColor = '#c2410c';
                          cursor = 'pointer';
                          opacity = 1;
                        } else if (isAvailable) {
                          bgColor = seatAvailBg;
                          textColor = seatAvailColor;
                          borderColor = seatAvailBorder;
                          cursor = 'pointer';
                          opacity = 1;
                        } else {
                          bgColor = seatTakenBg;
                          textColor = seatTakenColor;
                          borderColor = seatTakenColor;
                          cursor = 'not-allowed';
                          opacity = 0.6;
                        }

                        return (
                          <Tooltip
                            key={seat.seatId}
                            label={
                              isAvailable
                                ? `Ghế ${row}${seat.number}`
                                : `Ghế ${row}${seat.number} - Đã đặt`
                            }
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
                              className={
                                isSelected ? 'tvm-seat-pop' : undefined
                              }
                              bg={bgColor}
                              color={textColor}
                              border="none"
                              borderBottom={`3px solid ${borderColor}`}
                              boxShadow={
                                isSelected
                                  ? '0 0 0 3px rgba(249,115,22,0.22), 0 4px 10px rgba(249,115,22,0.3)'
                                  : isDark
                                    ? '0 1px 2px rgba(0,0,0,0.3)'
                                    : '0 1px 2px rgba(15,23,42,0.06)'
                              }
                              cursor={cursor}
                              opacity={opacity}
                              _hover={
                                isAvailable && !isSelected
                                  ? {
                                      transform: 'translateY(-3px)',
                                      boxShadow: seatHoverBox,
                                    }
                                  : {}
                              }
                              _active={
                                isAvailable
                                  ? {
                                      transform: 'translateY(-1px) scale(0.95)',
                                    }
                                  : {}
                              }
                              transition="all 0.15s ease"
                              onClick={() => {
                                if (isAvailable) {
                                  const seatDataFull = seats.find(
                                    (s) =>
                                      String(s.ShowtimeSeatId || s.id) ===
                                      String(seat.seatId),
                                  );
                                  const seatInfo =
                                    seatDataFull?.Seat ||
                                    seatDataFull?.seat ||
                                    {};
                                  const label = `${seatInfo.Row || row}${
                                    seatInfo.Number || seat.number
                                  }`;
                                  handleSeatToggle(seat.seatId, label);
                                }
                              }}
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

        {/* Chú thích */}
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
              bg={GRADIENT}
              borderBottom="3px solid #c2410c"
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

        {/* Danh sách ghế đã chọn */}
        {selectedSeatLabels.length > 0 && (
          <Flex
            mt="14px"
            p="10px 14px"
            borderRadius="10px"
            bg="rgba(249,115,22,0.10)"
            border="1px solid rgba(249,115,22,0.22)"
            align="center"
            justify="center"
            gap="8px"
            flexWrap="wrap"
            className="tvm-fade-up"
          >
            <Icon as={MdVerified} color={OR} boxSize="15px" />
            <Text fontSize="12.5px" color={OR} fontWeight="700">
              Đã chọn {selectedSeatLabels.length} ghế:{' '}
              {selectedSeatLabels.join(', ')}
            </Text>
          </Flex>
        )}
      </Box>
    );
  };

  // Design tokens
  const inputBg = useColorModeValue('#fafafa', '#0B1437');
  const inputBorder = useColorModeValue('#e8edf3', 'rgba(255,255,255,0.12)');
  const inputColor = useColorModeValue('#1a202c', '#ffffff');
  const placeholderColor = useColorModeValue('#b0bac8', '#8b9bc4');
  const cardBg = useColorModeValue('white', '#111C44');
  const cardBorder = useColorModeValue('#eef1f6', 'rgba(255,255,255,0.08)');
  const textPrimary = useColorModeValue('#0f172a', '#ffffff');
  const textMuted = useColorModeValue('#94a3b8', '#8b9bc4');
  const focusBg = useColorModeValue('#ffffff', '#111C44');
  const softTileBg = useColorModeValue('#f8fafc', 'rgba(255,255,255,0.03)');
  const dashedBorder = useColorModeValue('#e2e8f0', 'rgba(255,255,255,0.1)');
  const labelColor = useColorModeValue('#64748b', '#8b9bc4');
  const screenBgFrom = useColorModeValue('#f1f5f9', 'rgba(255,255,255,0.06)');
  const seatAvailBg = useColorModeValue('white', '#1b2559');
  const seatAvailBorder = useColorModeValue('#e2e8f0', '#2d3a68');
  const seatAvailColor = useColorModeValue('#1a202c', '#e2e8f0');
  const seatTakenBg = useColorModeValue('#e2e8f0', '#33406e');
  const seatTakenColor = useColorModeValue('#94a3b8', '#5b6a99');
  const seatHoverBox = useColorModeValue(
    '0 4px 10px rgba(249,115,22,0.18)',
    '0 4px 14px rgba(249,115,22,0.28)',
  );

  const OR = '#ea580c';
  const ORL = '#fb923c';
  const GRADIENT =
    'linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)';

  const inputStyle = {
    bg: inputBg,
    border: `1.5px solid ${inputBorder}`,
    borderRadius: '10px',
    color: inputColor,
    fontSize: '14px',
    fontWeight: '500',
    px: '14px',
    h: { base: '48px', md: '44px' },
    _placeholder: { color: placeholderColor, fontWeight: '400' },
    _focus: {
      border: '1.5px solid #f97316',
      boxShadow: '0 0 0 3px rgba(249,115,22,0.10)',
      bg: focusBg,
    },
    _hover: { border: '1.5px solid #f97316', bg: focusBg },
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    fontSize: '10.5px',
    fontWeight: '800',
    letterSpacing: '0.9px',
    textTransform: 'uppercase',
    color: labelColor,
    mb: '7px',
  };

  const SectionTitle = ({ label, icon: IconComponent, hint }) => (
    <Flex
      align="center"
      justify="space-between"
      mb="14px"
      wrap="wrap"
      rowGap="4px"
    >
      <Flex align="center" gap="10px">
        <Flex
          align="center"
          justify="center"
          w="26px"
          h="26px"
          borderRadius="8px"
          bg={isDark ? 'rgba(249,115,22,0.14)' : 'rgba(249,115,22,0.10)'}
          flexShrink="0"
        >
          {IconComponent && (
            <Icon as={IconComponent} boxSize="14px" color={OR} />
          )}
        </Flex>
        <Text
          fontSize="12px"
          fontWeight="800"
          color={isDark ? '#e2e8f0' : '#1e293b'}
          letterSpacing="0.6px"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      {hint && (
        <Text fontSize="11px" color={textMuted} fontWeight="500">
          {hint}
        </Text>
      )}
    </Flex>
  );

  const SummaryRow = ({ label, value, icon: IconComponent, highlight }) => (
    <Flex
      align="center"
      gap="10px"
      p="10px 12px"
      borderRadius="10px"
      bg={softTileBg}
      border={`1px solid ${
        highlight ? 'rgba(249,115,22,0.25)' : 'transparent'
      }`}
    >
      {IconComponent && (
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          borderRadius="8px"
          bg={isDark ? 'rgba(255,255,255,0.06)' : 'white'}
          border={`1px solid ${cardBorder}`}
          flexShrink="0"
        >
          <Icon
            as={IconComponent}
            boxSize="13px"
            color={highlight ? OR : textMuted}
          />
        </Flex>
      )}
      <Box minW="0" flex="1">
        <Text
          fontSize="9px"
          color={textMuted}
          fontWeight="700"
          letterSpacing="0.7px"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Text
          fontWeight="700"
          fontSize="13px"
          color={highlight ? OR : textPrimary}
          isTruncated
        >
          {value || 'Chưa chọn'}
        </Text>
      </Box>
    </Flex>
  );

  const steps = [
    { key: 'customer', label: 'Khách hàng', done: !!formData.userId },
    { key: 'movie', label: 'Suất chiếu', done: !!formData.showtimeId },
    { key: 'seat', label: 'Ghế', done: formData.selectedSeats.length > 0 },
  ];

  const comboPriceValue = (() => {
    const combo = combos.find(
      (c) => String(c.ItemId || c.id) === String(formData.comboId),
    );
    return combo ? Number(combo.Price || combo.price || 0) : 0;
  })();
  const ticketPriceValue = formData.price
    ? Number(String(formData.price).replace(/[^\d]/g, ''))
    : 0;
  const totalValue =
    ticketPriceValue * formData.selectedSeats.length + comboPriceValue;

  return (
    <Box
      px={{ base: 4, md: 5 }}
      pb={{ base: 4, md: 6 }}
      pt={{ base: '110px', md: '100px' }}
      w="100%"
    >
      <style>{`
        @keyframes tvmFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tvmPop {
          0% { transform: scale(0.85); }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .tvm-fade-up { animation: tvmFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .tvm-seat-pop { animation: tvmPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      {/* Header */}
      <Flex
        align={{ base: 'flex-start', md: 'center' }}
        gap="14px"
        mb="20px"
        direction={{ base: 'column', sm: 'row' }}
        className="tvm-fade-up"
      >
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={useColorModeValue('#475569', '#cbd5e1')}
          bg={cardBg}
          borderRadius="10px"
          h="38px"
          fontSize="13px"
          fontWeight="600"
          border={`1.5px solid ${cardBorder}`}
          _hover={{ bg: softTileBg, borderColor: '#f97316', color: OR }}
          flexShrink="0"
          onClick={() => navigate('/admin/ve-don-hang/ve')}
        >
          Quay lại
        </Button>
        <Flex align="center" gap="12px" flex="1" minW="0">
          <Flex
            align="center"
            justify="center"
            w="42px"
            h="42px"
            borderRadius="12px"
            bg={GRADIENT}
            boxShadow="0 6px 16px rgba(249,115,22,0.35)"
            flexShrink="0"
            display={{ base: 'none', sm: 'flex' }}
          >
            <Icon as={MdLocalActivity} boxSize="20px" color="white" />
          </Flex>
          <Box minW="0">
            <Text
              fontSize={{ base: '17px', md: '21px' }}
              fontWeight="800"
              color={textPrimary}
              letterSpacing="-0.4px"
            >
              Tạo vé thủ công
            </Text>
            <Text fontSize="12px" color={textMuted} mt="1px">
              Quyền Admin — Tạo vé cho khách hàng đặc biệt
            </Text>
          </Box>
        </Flex>
        <Badge
          colorScheme="red"
          fontSize="11px"
          fontWeight="700"
          px="10px"
          py="5px"
          borderRadius="full"
          letterSpacing="0.4px"
        >
          ADMIN
        </Badge>
      </Flex>

      {/* Progress dots */}
      <Flex
        gap={{ base: '10px', md: '18px' }}
        mb="18px"
        px="2px"
        wrap="wrap"
        className="tvm-fade-up"
      >
        {steps.map((step, idx) => (
          <Flex key={step.key} align="center" gap="8px">
            <Flex
              align="center"
              justify="center"
              w="20px"
              h="20px"
              borderRadius="full"
              bg={step.done ? GRADIENT : 'transparent'}
              border={`2px solid ${step.done ? '#f97316' : dashedBorder}`}
              transition="all 0.2s"
            >
              {step.done && (
                <Icon as={MdVerified} boxSize="11px" color="white" />
              )}
            </Flex>
            <Text
              fontSize="12px"
              fontWeight={step.done ? '700' : '500'}
              color={step.done ? OR : textMuted}
            >
              {step.label}
            </Text>
            {idx < steps.length - 1 && (
              <Box
                w={{ base: '14px', md: '26px' }}
                h="1.5px"
                bg={dashedBorder}
                ml="2px"
              />
            )}
          </Flex>
        ))}
      </Flex>

      {/* Main Form */}
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 350px' }}
        gap="16px"
        alignItems="start"
      >
        <GridItem>
          <Card
            borderRadius="18px"
            border={`1px solid ${cardBorder}`}
            bg={cardBg}
            boxShadow={
              isDark
                ? '0 4px 20px rgba(0,0,0,0.25)'
                : '0 4px 20px rgba(15,23,42,0.05)'
            }
            className="tvm-fade-up"
          >
            <CardBody p={{ base: '18px', md: '24px' }}>
              <VStack spacing={7} align="stretch">
                {/* Thông tin khách hàng */}
                <Box>
                  <SectionTitle label="Thông tin khách hàng" icon={MdPerson} />
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.userId}>
                      <Text sx={labelStyle}>Khách hàng *</Text>
                      <SelectWithSearch
                        items={users}
                        value={formData.userId}
                        onChange={handleUserChange}
                        placeholder="Chọn khách hàng..."
                        labelKey="FullName"
                        valueKey="UserId"
                        searchPlaceholder="Tìm kiếm theo tên, email, SĐT..."
                        isLoading={loading.users}
                        error={errors.userId}
                        leftIcon={MdPerson}
                        renderItem={(user) => (
                          <VStack align="start" spacing="1px" w="100%">
                            <Text
                              fontWeight="600"
                              fontSize="14px"
                              color={useColorModeValue('#1a202c', '#ffffff')}
                            >
                              {user.FullName ||
                                user.fullName ||
                                user.name ||
                                'Không tên'}
                            </Text>
                            <Text
                              fontSize="12px"
                              color={useColorModeValue('#718096', '#a0aec0')}
                            >
                              {user.Email || user.email || ''} •{' '}
                              {user.PhoneNumber || user.phone || 'Chưa có SĐT'}
                            </Text>
                          </VStack>
                        )}
                      />
                      {formData.userId && (
                        <Flex mt="2" align="center" gap="2">
                          <Tag
                            size="md"
                            colorScheme="orange"
                            borderRadius="full"
                          >
                            <TagLabel>Đã chọn: {formData.customer}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleUserChange(null)}
                            />
                          </Tag>
                        </Flex>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
                      <Text sx={labelStyle}>Email *</Text>
                      <Input
                        {...inputStyle}
                        value={formData.email}
                        placeholder="Email sẽ tự động điền"
                        readOnly
                        opacity={0.7}
                        cursor="not-allowed"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <Text sx={labelStyle}>Số điện thoại</Text>
                      <Input
                        {...inputStyle}
                        value={formData.phone}
                        placeholder="SĐT sẽ tự động điền"
                        readOnly
                        opacity={0.7}
                        cursor="not-allowed"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider borderColor={cardBorder} />

                {/* Thông tin phim */}
                <Box>
                  <SectionTitle
                    label="Thông tin phim & suất chiếu"
                    icon={MdMovie}
                  />
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.movieId}>
                      <Text sx={labelStyle}>Phim *</Text>
                      <SelectWithSearch
                        items={movies}
                        value={formData.movieId}
                        onChange={handleMovieChange}
                        placeholder="Chọn phim..."
                        labelKey="Title"
                        valueKey="MovieId"
                        searchPlaceholder="Tìm kiếm theo tên phim..."
                        isLoading={loading.movies}
                        error={errors.movieId}
                        leftIcon={MdMovie}
                        renderItem={(movie) => (
                          <VStack align="start" spacing="1px" w="100%">
                            <Text
                              fontWeight="600"
                              fontSize="14px"
                              color={useColorModeValue('#1a202c', '#ffffff')}
                            >
                              {movie.Title || movie.title || 'Không tên'}
                            </Text>
                            <HStack spacing="8px">
                              <Badge
                                size="sm"
                                colorScheme={
                                  movie.Status === 'NowShowing'
                                    ? 'green'
                                    : movie.Status === 'ComingSoon'
                                      ? 'blue'
                                      : 'gray'
                                }
                              >
                                {movie.Status || movie.status || 'N/A'}
                              </Badge>
                              {movie.ReleaseDate && (
                                <Text
                                  fontSize="11px"
                                  color={useColorModeValue(
                                    '#718096',
                                    '#a0aec0',
                                  )}
                                >
                                  {new Date(movie.ReleaseDate).getFullYear()}
                                </Text>
                              )}
                              {movie.Duration && (
                                <Text
                                  fontSize="11px"
                                  color={useColorModeValue(
                                    '#718096',
                                    '#a0aec0',
                                  )}
                                >
                                  {movie.Duration} phút
                                </Text>
                              )}
                            </HStack>
                          </VStack>
                        )}
                      />
                      {formData.movieId && (
                        <Flex mt="2" align="center" gap="2">
                          <Tag
                            size="md"
                            colorScheme="orange"
                            borderRadius="full"
                          >
                            <TagLabel>Đã chọn: {formData.movie}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleMovieChange(null)}
                            />
                          </Tag>
                        </Flex>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.showtimeId}>
                      <Text sx={labelStyle}>Suất chiếu *</Text>
                      <Select
                        {...inputStyle}
                        value={formData.showtimeId}
                        onChange={handleShowtimeChange}
                        placeholder={
                          formData.movieId
                            ? 'Chọn suất chiếu'
                            : 'Chọn phim trước'
                        }
                        isDisabled={!formData.movieId}
                      >
                        {localShowtimes.map((showtime) => {
                          const timeStr = formatShowtimeTime(showtime);
                          const roomName = getSafeRoomName(showtime);
                          const price = showtime.Price || showtime.price || 0;

                          return (
                            <option
                              key={showtime.ShowtimeId || showtime.id}
                              value={showtime.ShowtimeId || showtime.id}
                            >
                              {timeStr} - Phòng {roomName} -{' '}
                              {Number(price).toLocaleString()}đ
                            </option>
                          );
                        })}
                      </Select>
                      {loading.showtimes && (
                        <Spinner size="xs" mt={2} color={OR} />
                      )}
                      {localShowtimes.length === 0 &&
                        formData.movieId &&
                        !loading.showtimes && (
                          <Text
                            fontSize="xs"
                            color="red.400"
                            mt={1}
                            fontWeight="600"
                          >
                            ⚠️ Không có suất chiếu cho phim này
                          </Text>
                        )}
                      <FormErrorMessage>{errors.showtimeId}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <Text sx={labelStyle}>Giá vé (VNĐ) *</Text>
                      <Input
                        {...inputStyle}
                        value={formData.price}
                        placeholder="Giá sẽ tự động điền"
                        readOnly
                        opacity={0.7}
                        cursor="not-allowed"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider borderColor={cardBorder} />

                {/* Sơ đồ ghế */}
                <Box>
                  <SectionTitle
                    label="Chọn ghế"
                    icon={MdEventSeat}
                    hint={
                      selectedSeatLabels.length > 0
                        ? `Đã chọn ${selectedSeatLabels.length} ghế`
                        : undefined
                    }
                  />
                  <FormControl isInvalid={!!errors.seat}>
                    {renderSeatMap()}
                    {errors.seat && (
                      <Text
                        fontSize="xs"
                        color="red.400"
                        mt="2"
                        fontWeight="600"
                      >
                        {errors.seat}
                      </Text>
                    )}
                  </FormControl>
                </Box>

                <Divider borderColor={cardBorder} />

                {/* Thông tin bổ sung */}
                <Box>
                  <SectionTitle
                    label="Thông tin bổ sung"
                    icon={MdReceiptLong}
                  />
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <Text sx={labelStyle}>Trạng thái</Text>
                      <Select
                        {...inputStyle}
                        value={formData.status}
                        onChange={handleInputChange}
                        name="status"
                      >
                        <option value="Đã thanh toán">
                          Đã thanh toán (Paid)
                        </option>
                        <option value="Đã check-in">Đã check-in (Paid)</option>
                        <option value="Chờ xử lý">Chờ xử lý (Pending)</option>
                        <option value="Đã hủy">Đã hủy (Cancelled)</option>
                        <option value="Hết hạn">Hết hạn (Cancelled)</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <Text sx={labelStyle}>Combo</Text>
                      <Select
                        {...inputStyle}
                        value={formData.comboId}
                        onChange={handleComboChange}
                        placeholder="Chọn combo (nếu có)"
                      >
                        {combos.map((combo) => (
                          <option
                            key={combo.ItemId || combo.id}
                            value={combo.ItemId || combo.id}
                          >
                            {combo.Name || combo.name} -{' '}
                            {Number(
                              combo.Price || combo.price || 0,
                            ).toLocaleString()}
                            đ
                          </option>
                        ))}
                      </Select>
                      {loading.combos && (
                        <Spinner size="xs" mt={2} color={OR} />
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <FormControl mt={4}>
                    <Text sx={labelStyle}>Ghi chú nội bộ</Text>
                    <Textarea
                      {...inputStyle}
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Nhập ghi chú nội bộ..."
                      rows={3}
                      h="auto"
                      py="10px"
                    />
                  </FormControl>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Right Column - Preview & Actions */}
        <GridItem position={{ lg: 'sticky' }} top={{ lg: '20px' }}>
          <Card
            borderRadius="18px"
            border={`1px solid ${cardBorder}`}
            bg={cardBg}
            boxShadow={
              isDark
                ? '0 4px 20px rgba(0,0,0,0.25)'
                : '0 4px 20px rgba(15,23,42,0.05)'
            }
            mb="14px"
            className="tvm-fade-up"
          >
            <CardBody p={{ base: '16px', md: '20px' }}>
              <SectionTitle label="Thông tin tóm tắt" icon={MdReceiptLong} />
              <VStack spacing={2.5} align="stretch">
                <SummaryRow
                  label="Khách hàng"
                  value={formData.customer || 'Chưa chọn'}
                  icon={MdPerson}
                />
                <SummaryRow
                  label="Phim"
                  value={formData.movie || 'Chưa chọn'}
                  icon={MdMovie}
                />
                <SummaryRow
                  label="Suất chiếu"
                  value={formData.showtime || 'Chưa chọn'}
                  icon={MdTheaters}
                />
                <SummaryRow
                  label="Ghế"
                  value={
                    selectedSeatLabels.length > 0
                      ? selectedSeatLabels.join(', ')
                      : 'Chưa chọn'
                  }
                  icon={MdEventSeat}
                  highlight={selectedSeatLabels.length > 0}
                />
                <SummaryRow
                  label="Số lượng vé"
                  value={
                    selectedSeatLabels.length > 0
                      ? `${selectedSeatLabels.length} vé`
                      : 'Chưa chọn'
                  }
                  icon={MdEventSeat}
                />
                <SummaryRow
                  label="Combo"
                  value={formData.combo || 'Không có'}
                  icon={MdFastfood}
                />
              </VStack>

              <Divider my="14px" borderColor={cardBorder} />

              <Flex justify="space-between" align="center" px="2px">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color={textMuted}
                  letterSpacing="0.6px"
                  textTransform="uppercase"
                >
                  Tổng cộng
                </Text>
                <Text
                  fontSize="19px"
                  fontWeight="800"
                  color={OR}
                  letterSpacing="-0.3px"
                >
                  {totalValue ? `${totalValue.toLocaleString()}đ` : '—'}
                </Text>
              </Flex>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <Stack spacing={3} className="tvm-fade-up">
            <Button
              w="100%"
              h="50px"
              bg={GRADIENT}
              color="white"
              fontSize="md"
              fontWeight="700"
              borderRadius="12px"
              leftIcon={<Icon as={MdSave} />}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Đang tạo..."
              _hover={{
                boxShadow: '0 8px 24px rgba(249,115,22,0.45)',
                transform: 'translateY(-2px)',
              }}
              _active={{ transform: 'translateY(0)' }}
              boxShadow="0 4px 16px rgba(249,115,22,0.35)"
              transition="all 0.2s"
            >
              Tạo vé thủ công
            </Button>
            <Button
              w="100%"
              h="50px"
              variant="outline"
              borderRadius="12px"
              color={useColorModeValue('#475569', '#cbd5e1')}
              borderColor={cardBorder}
              leftIcon={<Icon as={MdClose} />}
              onClick={() => navigate('/admin/ve-don-hang/ve')}
              _hover={{ bg: softTileBg, borderColor: '#f97316', color: OR }}
              transition="all 0.2s"
            >
              Hủy bỏ
            </Button>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default TaoVeMoi;
