// src/views/admin/quanlytrangthaighe/index.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon,
  useBreakpointValue, useToast, useDisclosure,
  Spinner, Portal, Fade,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  Select, FormControl, FormLabel, VStack
} from "@chakra-ui/react";
import {
  MdEventSeat, MdRefresh, MdDarkMode, MdLightMode,
  MdFullscreen, MdFullscreenExit, MdOutlineRefresh,
  MdAdd, MdSearch, MdVisibility
} from "react-icons/md";
import { ORANGE, SEAT_STATUS } from "./constants";
import { useSeatTheme } from "./hooks/useSeatTheme";
import { useSeatData } from "./hooks/useSeatData";
import { StatCard } from "./components/shared/StatCard";
import { SeatMapView } from "./components/SeatMapView";
import { SeatInfoPanel } from "./components/SeatInfoPanel";
import { ResetSeatModal } from "./components/ResetSeatModal";
import { SeatDetailDrawer } from "./components/SeatDetailDrawer";
import { fadeUp } from "./components/shared/animations";
import Loader from "layouts/Loader";

// Helper: Format date an toàn
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

// Helper: Lấy tên phim
const getMovieTitle = (showtime) => {
  if (!showtime) return 'Unknown';
  if (showtime.movie_title) return showtime.movie_title;
  if (showtime.Movie?.Title) return showtime.Movie.Title;
  if (showtime.movie?.title) return showtime.movie.title;
  if (showtime.MovieId?.Title) return showtime.MovieId.Title;
  if (showtime.movie) return showtime.movie;
  return 'Unknown';
};

export default function QuanLyTrangThaiGhe() {
  const theme = useSeatTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  // Sử dụng hook dữ liệu
  const {
    cinemas,
    rooms,
    showtimes,
    seatMapData,
    seatStats,
    loading,
    isGenerating,
    isInitialLoad,
    isLoadingSeats,
    loadDataWithFilters,
    loadSeats,
    handleGenerateSeats,
    handleUpdateSeatStatus,
    handleResetSeat,
    handleDeleteSeat,
    getRoomsByCinema,
    getShowtimesByRoom,
  } = useSeatData();

  // State cho filter
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isChangingData, setIsChangingData] = useState(false);
  const [isViewingSeats, setIsViewingSeats] = useState(false);
  const { isOpen: showOverlay, onOpen: onOpenOverlay, onClose: onCloseOverlay } = useDisclosure();

  // ✅ Ref để theo dõi user đã chọn suất chiếu chưa
  const isUserSelectedShowtime = useRef(false);

  // State cho form tạo ghế
  const [formCinemaId, setFormCinemaId] = useState("");
  const [formRoomId, setFormRoomId] = useState("");
  const [formShowtimeId, setFormShowtimeId] = useState("");
  const [formRooms, setFormRooms] = useState([]);
  const [formShowtimes, setFormShowtimes] = useState([]);

  // Lấy danh sách rooms theo cinema đã chọn
  const currentRooms = useMemo(() => {
    if (selectedCinemaId) {
      return getRoomsByCinema(selectedCinemaId);
    }
    return [];
  }, [selectedCinemaId, getRoomsByCinema]);

  // Lấy danh sách showtimes theo room đã chọn
  const currentShowtimes = useMemo(() => {
    if (selectedRoomId) {
      return getShowtimesByRoom(selectedRoomId);
    }
    return [];
  }, [selectedRoomId, getShowtimesByRoom]);

  // ✅ Chọn rạp đầu tiên khi có dữ liệu
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinemaId) {
      const firstCinema = cinemas[0];
      const cinemaId = firstCinema.id || firstCinema.CinemaId;
      setSelectedCinemaId(cinemaId);
      isUserSelectedShowtime.current = false;
    }
  }, [cinemas, selectedCinemaId]);

  // ✅ Khi chọn rạp, tự động chọn phòng đầu tiên
  useEffect(() => {
    if (selectedCinemaId && currentRooms.length > 0 && !selectedRoomId) {
      const firstRoom = currentRooms[0];
      const roomId = firstRoom.id || firstRoom.RoomId;
      setSelectedRoomId(roomId);
      isUserSelectedShowtime.current = false;
    }
  }, [selectedCinemaId, currentRooms, selectedRoomId]);

  // ✅ Khi chọn phòng, tự động chọn suất chiếu đầu tiên (CHỈ KHI USER CHƯA CHỌN)
  useEffect(() => {
    if (selectedRoomId && currentShowtimes.length > 0) {
      if (!isUserSelectedShowtime.current && !selectedShowtimeId) {
        const firstShowtime = currentShowtimes[0];
        const showtimeId = firstShowtime.id || firstShowtime.ShowtimeId;
        setSelectedShowtimeId(showtimeId);
        console.log("🎫 Auto select first showtime:", showtimeId);
      }
    }
  }, [selectedRoomId, currentShowtimes, selectedShowtimeId]);

  // ✅ Khi currentShowtimes thay đổi, kiểm tra xem selectedShowtimeId có còn hợp lệ không
  useEffect(() => {
    if (currentShowtimes.length > 0 && selectedShowtimeId) {
      const stillExists = currentShowtimes.some(
        st => String(st.id || st.ShowtimeId) === String(selectedShowtimeId)
      );
      if (!stillExists && !isUserSelectedShowtime.current) {
        const firstShowtime = currentShowtimes[0];
        const showtimeId = firstShowtime.id || firstShowtime.ShowtimeId;
        setSelectedShowtimeId(showtimeId);
        console.log("🎫 Auto select new first showtime:", showtimeId);
      }
    }
  }, [currentShowtimes, selectedShowtimeId]);

  // Cập nhật rooms cho form khi chọn cinema trong modal
  useEffect(() => {
    if (formCinemaId) {
      const cinemaRooms = getRoomsByCinema(formCinemaId);
      setFormRooms(cinemaRooms);
      setFormRoomId("");
      setFormShowtimeId("");
      setFormShowtimes([]);
    } else {
      setFormRooms([]);
      setFormRoomId("");
      setFormShowtimeId("");
      setFormShowtimes([]);
    }
  }, [formCinemaId, getRoomsByCinema]);

  // Cập nhật showtimes cho form khi chọn room trong modal
  useEffect(() => {
    if (formCinemaId && formRoomId) {
      const showtimesForRoom = getShowtimesByRoom(formRoomId);
      setFormShowtimes(showtimesForRoom);
      setFormShowtimeId("");
    } else {
      setFormShowtimes([]);
      setFormShowtimeId("");
    }
  }, [formCinemaId, formRoomId, getShowtimesByRoom]);

  // Xử lý thay đổi cinema
  const handleCinemaChange = useCallback((cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedRoomId(null);
    setSelectedShowtimeId(null);
    setSelectedSeatId(null);
    isUserSelectedShowtime.current = false;
    loadSeats(null);
  }, [loadSeats]);

  // Xử lý thay đổi room
  const handleRoomChange = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setSelectedShowtimeId(null);
    setSelectedSeatId(null);
    isUserSelectedShowtime.current = false;
    loadSeats(null);
  }, [loadSeats]);

  // ✅ Xử lý thay đổi showtime - USER CHỦ ĐỘNG CHỌN
  const handleShowtimeChange = useCallback((showtimeId) => {
    if (!showtimeId) return;
    
    isUserSelectedShowtime.current = true;
    setSelectedShowtimeId(showtimeId);
    setSelectedSeatId(null);
    console.log("🔄 User selected showtime:", showtimeId);
  }, []);

  // ✅ XỬ LÝ BẤM NÚT "XEM GHẾ"
  const handleViewSeats = useCallback(async () => {
    if (!selectedCinemaId) {
      toast({
        title: "Vui lòng chọn rạp chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!selectedRoomId) {
      toast({
        title: "Vui lòng chọn phòng chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!selectedShowtimeId) {
      toast({
        title: "Vui lòng chọn suất chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsViewingSeats(true);
    onOpenOverlay();
    try {
      const result = await loadSeats(selectedShowtimeId);
      if (result && result.seats && result.seats.length === 0) {
        toast({
          title: "Chưa có ghế",
          description: "Vui lòng tạo ghế tự động cho suất chiếu này",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi xem ghế:", error);
    } finally {
      setTimeout(() => {
        setIsViewingSeats(false);
        onCloseOverlay();
      }, 300);
    }
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeId, loadSeats, toast, onOpenOverlay, onCloseOverlay]);

  // Xử lý click ghế
  const handleSeatClick = useCallback((seatId) => {
    setSelectedSeatId(seatId);
    if (isMobile) {
      onDrawerOpen();
    }
  }, [isMobile, onDrawerOpen]);

  // Xử lý refresh
  const handleRefresh = useCallback(async () => {
    if (selectedShowtimeId) {
      setIsRefreshing(true);
      onOpenOverlay();
      try {
        await loadSeats(selectedShowtimeId);
        toast({
          title: "Đã làm mới dữ liệu",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Refresh error:", error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          onCloseOverlay();
        }, 300);
      }
    } else {
      toast({
        title: "Chưa có dữ liệu ghế",
        description: "Vui lòng chọn suất chiếu và bấm Xem ghế",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [selectedShowtimeId, loadSeats, toast, onOpenOverlay, onCloseOverlay]);

  // Xử lý mở modal tạo ghế
  const handleOpenGenerateModal = useCallback(() => {
    setFormCinemaId(selectedCinemaId || "");
    setFormRoomId(selectedRoomId || "");
    setFormShowtimeId(selectedShowtimeId || "");
    if (selectedCinemaId) {
      const cinemaRooms = getRoomsByCinema(selectedCinemaId);
      setFormRooms(cinemaRooms);
    }
    if (selectedCinemaId && selectedRoomId) {
      const showtimesForRoom = getShowtimesByRoom(selectedRoomId);
      setFormShowtimes(showtimesForRoom);
    }
    onModalOpen();
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeId, getRoomsByCinema, getShowtimesByRoom, onModalOpen]);

  // Xử lý tạo ghế tự động từ modal
  const handleGenerateSeatsFromModal = useCallback(async () => {
    if (!formShowtimeId) {
      toast({
        title: "Vui lòng chọn suất chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onModalClose();
    onOpenOverlay();
    try {
      await handleGenerateSeats(formShowtimeId);
      
      setSelectedShowtimeId(formShowtimeId);
      setSelectedRoomId(formRoomId);
      setSelectedCinemaId(formCinemaId);
      isUserSelectedShowtime.current = true;
      
      toast({
        title: "Tạo ghế thành công",
        description: "Đã tạo ghế tự động cho suất chiếu",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi tạo ghế:", error);
    } finally {
      setTimeout(() => {
        onCloseOverlay();
      }, 500);
    }
  }, [formShowtimeId, formCinemaId, formRoomId, handleGenerateSeats, onModalClose, onOpenOverlay, onCloseOverlay, toast]);

  // Xử lý cập nhật trạng thái ghế
  const handleStatusChange = useCallback(async (seatId, newStatus) => {
    const seat = seatMapData.find(s => s.id === seatId);
    if (!seat) {
      toast({
        title: "Không tìm thấy ghế",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const statusMap = {
      'trong': 'Available',
      'dat': 'Reserved',
      'giu': 'Held',
      'loi': 'Broken',
      'baoTri': 'Inactive'
    };

    const apiStatus = statusMap[newStatus];
    if (!apiStatus) {
      toast({
        title: "Trạng thái không hợp lệ",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const success = await handleUpdateSeatStatus(seatId, apiStatus);
    if (success) {
      toast({
        title: "Cập nhật thành công",
        description: `Ghế ${seatId} đã chuyển sang trạng thái ${newStatus}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [seatMapData, handleUpdateSeatStatus, toast]);

  // Xử lý reset ghế
  const handleResetConfirm = useCallback(async (seatId) => {
    const success = await handleResetSeat(seatId);
    if (success) {
      setResetTarget(null);
    }
  }, [handleResetSeat]);

  // Xử lý xóa ghế
  const onDeleteSeat = useCallback(async (seatId) => {
    const success = await handleDeleteSeat(seatId);
    if (success) {
      setSelectedSeatId(null);
      if (isMobile) {
        onDrawerClose();
      }
    }
  }, [handleDeleteSeat, isMobile, onDrawerClose]);

  // Tính tỷ lệ lấp đầy
  const totalSeats = seatMapData.length;
  const occupied = seatMapData.filter(s => s.status === 'dat' || s.status === 'giu').length;
  const occupancyRate = totalSeats > 0 ? Math.round((occupied / totalSeats) * 100) : 0;

  // Kiểm tra đã chọn đủ thông tin chưa
  const hasFullSelection = selectedCinemaId && selectedRoomId && selectedShowtimeId;
  const hasSeats = seatMapData.length > 0;

  // Lấy thông tin showtime đang chọn
  const activeShowtime = useMemo(() => {
    return currentShowtimes.find(st => String(st.id || st.ShowtimeId) === String(selectedShowtimeId));
  }, [currentShowtimes, selectedShowtimeId]);

  if (isInitialLoad) {
    return <Loader />;
  }

  return (
    <Box
      pt={{ base: "70px", md: "80px" }}
      px={{ base: "8px", md: "16px", lg: "24px" }}
      pb="40px"
      bg={theme.bg}
      minH="100vh"
      transition="all .3s"
      position="relative"
    >
      {/* Overlay Loading */}
      <Portal>
        <Fade in={showOverlay || isChangingData || isRefreshing || isViewingSeats || isLoadingSeats}>
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="9999"
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="4"
            pointerEvents="none"
          >
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={ORANGE.OR} size="xl" />
            <Text color="white" fontWeight="600" fontSize="16px">
              {isViewingSeats ? "Đang tải ghế..." : "Đang xử lý..."}
            </Text>
          </Box>
        </Fade>
      </Portal>

      {/* Modal tạo ghế */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
        <ModalContent borderRadius="20px" bg={theme.bgCard} border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"}>
          <ModalHeader>
            <Flex align="center" gap="10px">
              <Box w="36px" h="36px" borderRadius="10px" bg={ORANGE.ORGRAD} display="flex" alignItems="center" justifyContent="center">
                <Icon as={MdEventSeat} boxSize="16px" color="white" />
              </Box>
              <Box>
                <Text fontSize="17px" fontWeight="800" color={theme.text}>Tạo ghế tự động</Text>
                <Text fontSize="12px" color={theme.textMuted}>Chọn suất chiếu để tạo ghế hàng loạt</Text>
              </Box>
            </Flex>
            <ModalCloseButton color={theme.textMuted} />
          </ModalHeader>

          <ModalBody py="4">
            <VStack spacing="4" align="stretch">
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>Rạp chiếu</FormLabel>
                <Select
                  value={formCinemaId}
                  onChange={(e) => {
                    setFormCinemaId(e.target.value);
                    setFormRoomId("");
                    setFormShowtimeId("");
                    setFormRooms([]);
                    setFormShowtimes([]);
                  }}
                  bg={theme.inputBg}
                  border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                >
                  <option value="">-- Chọn rạp --</option>
                  {cinemas.map((c) => (
                    <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>
                      {c.name || c.Name || 'Unknown Cinema'}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>Phòng chiếu</FormLabel>
                <Select
                  value={formRoomId}
                  onChange={(e) => {
                    setFormRoomId(e.target.value);
                    setFormShowtimeId("");
                    if (formCinemaId && e.target.value) {
                      const showtimesForRoom = getShowtimesByRoom(e.target.value);
                      setFormShowtimes(showtimesForRoom);
                    }
                  }}
                  bg={theme.inputBg}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                  isDisabled={!formCinemaId || formRooms.length === 0}
                >
                  <option value="">-- Chọn phòng --</option>
                  {formRooms.map((r) => (
                    <option key={r.id || r.RoomId} value={r.id || r.RoomId}>
                      {r.name || r.Name || 'Unknown Room'} ({r.SeatCount || r.seatCount || 0} ghế)
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>Suất chiếu</FormLabel>
                <Select
                  value={formShowtimeId}
                  onChange={(e) => setFormShowtimeId(e.target.value)}
                  bg={theme.inputBg}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                  isDisabled={!formRoomId || formShowtimes.length === 0}
                >
                  <option value="">-- Chọn suất chiếu --</option>
                  {formShowtimes.map((s) => {
                    const movieTitle = getMovieTitle(s);
                    const timeStr = s.start_time || s.StartTime;
                    const formattedTime = formatDateTime(timeStr);
                    return (
                      <option key={s.id || s.ShowtimeId} value={s.id || s.ShowtimeId}>
                        {movieTitle} - {formattedTime}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap="10px" borderTop={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Button variant="ghost" onClick={onModalClose}>Hủy bỏ</Button>
            <Button
              bg={ORANGE.ORGRAD}
              color="white"
              onClick={handleGenerateSeatsFromModal}
              isDisabled={!formShowtimeId}
              isLoading={isGenerating}
              loadingText="Đang tạo..."
              leftIcon={<Icon as={MdAdd} />}
            >
              Tạo ghế tự động
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap="12px" mb="20px">
        <Flex align="center" gap="12px" sx={{ animation: `${fadeUp} .4s ease both` }}>
          <Box w="44px" h="44px" borderRadius="14px" bg={ORANGE.ORGRAD} display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdEventSeat} boxSize="20px" color="white" />
          </Box>
          <Box>
            <Text fontSize="20px" fontWeight="800" color={theme.text}>Quản lý trạng thái ghế</Text>
            <Text fontSize="13px" color={theme.textMuted}>
              Theo dõi trạng thái ghế realtime theo suất chiếu
              {hasSeats && seatStats?.room_total > 0 && (
                <Text as="span" ml="8px" fontWeight="700" color={ORANGE.OR}>
                  ({seatMapData.length}/{seatStats.room_total} ghế)
                </Text>
              )}
            </Text>
          </Box>
        </Flex>

        <Flex gap="8px" flexWrap="wrap" sx={{ animation: `${fadeUp} .4s ease .08s both` }}>
          <Button size="sm" onClick={theme.toggleColorMode} leftIcon={<Icon as={theme.isDark ? MdLightMode : MdDarkMode} />}>
            {theme.isDark ? "Sáng" : "Tối"}
          </Button>
          
          <Button
            size="sm"
            bg={ORANGE.ORGRAD}
            color="white"
            onClick={handleViewSeats}
            isLoading={isViewingSeats || isLoadingSeats}
            loadingText="Đang tải..."
            leftIcon={<Icon as={MdVisibility} />}
            isDisabled={!hasFullSelection}
            _hover={{ opacity: 0.9 }}
          >
            Xem ghế
          </Button>
          
          <Button size="sm" onClick={handleRefresh} isLoading={isRefreshing} leftIcon={<Icon as={MdRefresh} />} isDisabled={!hasSeats}>
            Làm mới
          </Button>
          
          <Button size="sm" bg={ORANGE.ORGRAD} color="white" onClick={handleOpenGenerateModal} leftIcon={<Icon as={MdAdd} />}>
            Tạo ghế
          </Button>
        </Flex>
      </Flex>

      {/* Bộ lọc: Rạp - Phòng - Suất chiếu */}
      <Box
        bg={theme.bgCard}
        borderRadius="16px"
        border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"}
        p="16px"
        mb="20px"
        sx={{ animation: `${fadeUp} .4s ease .04s both` }}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px">
          {/* Rạp chiếu */}
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Rạp chiếu</Text>
            <Select
              value={selectedCinemaId || ""}
              onChange={(e) => handleCinemaChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="10px"
              color={theme.text}
              fontSize="13px"
              h="42px"
            >
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((c) => (
                <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>
                  {c.name || c.Name || 'Unknown Cinema'}
                </option>
              ))}
            </Select>
          </Box>

          {/* Phòng chiếu */}
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Phòng chiếu</Text>
            <Select
              value={selectedRoomId || ""}
              onChange={(e) => handleRoomChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="10px"
              color={theme.text}
              fontSize="13px"
              h="42px"
              isDisabled={!selectedCinemaId || currentRooms.length === 0}
            >
              <option value="">-- Chọn phòng --</option>
              {currentRooms.map((r) => (
                <option key={r.id || r.RoomId} value={r.id || r.RoomId}>
                  {r.name || r.Name || 'Unknown Room'} ({r.SeatCount || r.seatCount || 0} ghế)
                </option>
              ))}
            </Select>
            {selectedCinemaId && currentRooms.length === 0 && (
              <Text fontSize="11px" color="#f59e0b" mt="2px">⚠️ Không có phòng chiếu cho rạp này</Text>
            )}
          </Box>

          {/* Suất chiếu */}
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Suất chiếu</Text>
            <Select
              value={selectedShowtimeId || ""}
              onChange={(e) => handleShowtimeChange(e.target.value)}
              bg={theme.inputBg}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
              borderRadius="10px"
              color={theme.text}
              fontSize="13px"
              h="42px"
              isDisabled={!selectedRoomId || currentShowtimes.length === 0}
            >
              <option value="">-- Chọn suất chiếu --</option>
              {currentShowtimes.map((st) => {
                const id = st.id || st.ShowtimeId;
                const movieTitle = getMovieTitle(st);
                const timeStr = st.start_time || st.StartTime;
                const formattedTime = formatDateTime(timeStr);
                
                return (
                  <option key={id} value={id}>
                    {movieTitle} - {formattedTime}
                  </option>
                );
              })}
            </Select>
            {selectedRoomId && currentShowtimes.length === 0 && (
              <Text fontSize="11px" color="#f59e0b" mt="2px">⚠️ Không có suất chiếu cho phòng này</Text>
            )}
          </Box>
        </SimpleGrid>
      </Box>

      {/* ✅ Stats - Thêm StatCard Tổng ghế */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing="12px" mb="20px" sx={{ animation: `${fadeUp} .4s ease .08s both` }}>
        <StatCard 
          label="Tổng ghế" 
          value={seatMapData.length || 0} 
          icon={MdEventSeat} 
          accent={ORANGE.OR} 
          theme={theme}
          trendLabel={seatStats?.room_total > 0 ? `/ ${seatStats.room_total} ghế phòng` : undefined}
        />
        <StatCard label="Trống" value={seatStats.trong || 0} icon={MdEventSeat} accent="#10b981" theme={theme} />
        <StatCard label="Đã đặt" value={seatStats.dat || 0} icon={MdEventSeat} accent="#f97316" theme={theme} />
        <StatCard label="Đang giữ" value={seatStats.giu || 0} icon={MdEventSeat} accent="#f59e0b" theme={theme} />
        <StatCard label="Lỗi" value={seatStats.loi || 0} icon={MdEventSeat} accent="#ef4444" theme={theme} />
      </SimpleGrid>

      {/* Seat Map */}
      <Grid templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }} gap="20px" sx={{ animation: `${fadeUp} .4s ease .12s both` }}>
        <SeatMapView
          cinemaId={selectedCinemaId}
          roomId={selectedRoomId}
          showtimeId={selectedShowtimeId}
          showtimesForRoom={currentShowtimes}
          activeShowtime={activeShowtime}
          seats={seatMapData}
          selectedSeatId={selectedSeatId}
          onCinemaChange={handleCinemaChange}
          onRoomChange={handleRoomChange}
          onShowtimeChange={handleShowtimeChange}
          onSeatClick={handleSeatClick}
          onStatusChange={handleStatusChange}
          theme={theme}
          isMobile={isMobile}
          occupancyRate={occupancyRate}
          cinemas={cinemas}
          rooms={currentRooms}
          loading={loading || isViewingSeats || isLoadingSeats}
          hasFullSelection={hasFullSelection}
          hasSeats={hasSeats}
        />

        {!isMobile && hasSeats && (
          <SeatInfoPanel
            selectedSeat={seatMapData.find(s => s.id === selectedSeatId) || null}
            onReset={(seat) => setResetTarget(seat)}
            onDelete={onDeleteSeat}
            theme={theme}
          />
        )}
      </Grid>

      {/* Reset Modal */}
      <ResetSeatModal
        seat={resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetConfirm}
        theme={theme}
      />

      {/* Detail Drawer (Mobile) */}
      <SeatDetailDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        seat={seatMapData.find(s => s.id === selectedSeatId) || null}
        onReset={(seat) => {
          setResetTarget(seat);
          onDrawerClose();
        }}
        onDelete={onDeleteSeat}
        theme={theme}
      />
    </Box>
  );
}