

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon,
  useBreakpointValue, useToast, useDisclosure,
  Spinner, Alert, AlertIcon, AlertTitle, AlertDescription,
  Portal, Fade,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  Select, FormControl, FormLabel, VStack
} from "@chakra-ui/react";
import {
  MdEventSeat, MdRefresh, MdDarkMode, MdLightMode,
  MdFullscreen, MdFullscreenExit, MdOutlineRefresh,
  MdAdd, MdSearch
} from "react-icons/md";
import { ORANGE, SEAT_STATUS } from "./constants";
import { useSeatTheme } from "./hooks/useSeatTheme";
import { useSeatData } from "./hooks/useSeatData";
import { StatCard } from "./components/shared/StatCard";
import { LiveBadge } from "./components/shared/StatusBadge";
import { SeatMapView } from "./components/SeatMapView";
import { SeatInfoPanel } from "./components/SeatInfoPanel";
import { ResetSeatModal } from "./components/ResetSeatModal";
import { SeatDetailDrawer } from "./components/SeatDetailDrawer";
import { fadeUp } from "./components/shared/animations";
import Loader from "../../../layouts/Loader"; // Import Loader component

export default function QuanLyTrangThaiGhe() {
  const theme = useSeatTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  // Sử dụng hook dữ liệu
  const {
    seatMapData,
    seatStats,
    showtimes,
    cinemas,
    rooms,
    selectedShowtimeId,
    loading,
    isGenerating,
    isInitialLoad,
    loadSeatsForShowtime,
    handleGenerateSeats,
    handleResetSeat,
    handleUpdateSeatStatus,
    getShowtimesForRoom,
    getRoomsByCinema
  } = useSeatData();

  // State cho filter
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedShowtimeIdState, setSelectedShowtimeIdState] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // State cho loading overlay
  const [isChangingData, setIsChangingData] = useState(false);
  const { isOpen: showOverlay, onOpen: onOpenOverlay, onClose: onCloseOverlay } = useDisclosure();

  // State cho form tạo ghế
  const [formCinemaId, setFormCinemaId] = useState("");
  const [formRoomId, setFormRoomId] = useState("");
  const [formShowtimeId, setFormShowtimeId] = useState("");
  const [formShowtimes, setFormShowtimes] = useState([]);
  const [formRooms, setFormRooms] = useState([]);

  // State để kiểm soát việc load dữ liệu
  const [shouldLoadData, setShouldLoadData] = useState(false);

  // State để override dữ liệu ghế khi cập nhật trạng thái
  const [seatOverrides, setSeatOverrides] = useState({});

  // Khởi tạo dữ liệu khi có cinemas - CHỌN RẠP ĐẦU TIÊN
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinemaId && !isInitialLoad) {
      const firstCinema = cinemas[0];
      setSelectedCinemaId(firstCinema.CinemaId || firstCinema.id);
    }
  }, [cinemas, selectedCinemaId, isInitialLoad]);

  // Cập nhật rooms khi chọn cinema
  useEffect(() => {
    if (selectedCinemaId && !isInitialLoad) {
      const cinemaRooms = getRoomsByCinema(selectedCinemaId);
      if (cinemaRooms.length > 0) {
        const firstRoom = cinemaRooms[0];
        setSelectedRoomId(firstRoom.RoomId || firstRoom.id);
      } else {
        setSelectedRoomId(null);
      }
      setShouldLoadData(false);
    }
  }, [selectedCinemaId, getRoomsByCinema, isInitialLoad]);

  // Cập nhật showtimes khi chọn room
  useEffect(() => {
    if (selectedCinemaId && selectedRoomId && !isInitialLoad) {
      const showtimesForRoom = getShowtimesForRoom(selectedCinemaId, selectedRoomId);
      if (showtimesForRoom.length > 0) {
        const firstShowtime = showtimesForRoom[0];
        setSelectedShowtimeIdState(firstShowtime.ShowtimeId || firstShowtime.id);
      } else {
        setSelectedShowtimeIdState(null);
      }
      setShouldLoadData(false);
    }
  }, [selectedCinemaId, selectedRoomId, getShowtimesForRoom, isInitialLoad]);

  // LOAD GHẾ CHỈ KHI BẤM NÚT "XEM GHẾ"
  useEffect(() => {
    if (shouldLoadData && selectedCinemaId && selectedRoomId && selectedShowtimeIdState && !isInitialLoad) {
      setIsChangingData(true);
      onOpenOverlay();
      
      // Reset seat overrides khi load dữ liệu mới
      setSeatOverrides({});
      
      loadSeatsForShowtime(selectedShowtimeIdState).finally(() => {
        setTimeout(() => {
          setIsChangingData(false);
          onCloseOverlay();
          setShouldLoadData(false);
        }, 300);
      });
    }
  }, [shouldLoadData, selectedCinemaId, selectedRoomId, selectedShowtimeIdState, loadSeatsForShowtime, onOpenOverlay, onCloseOverlay, isInitialLoad]);

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
      const showtimesForRoom = getShowtimesForRoom(formCinemaId, formRoomId);
      setFormShowtimes(showtimesForRoom);
      setFormShowtimeId("");
    } else {
      setFormShowtimes([]);
      setFormShowtimeId("");
    }
  }, [formCinemaId, formRoomId, getShowtimesForRoom]);

  // Lấy danh sách rooms theo cinema đã chọn
  const currentRooms = useMemo(() => {
    if (selectedCinemaId) {
      return getRoomsByCinema(selectedCinemaId);
    }
    return [];
  }, [selectedCinemaId, getRoomsByCinema]);

  // Lấy danh sách showtimes theo cinema và room đã chọn
  const currentShowtimes = useMemo(() => {
    if (selectedCinemaId && selectedRoomId) {
      return getShowtimesForRoom(selectedCinemaId, selectedRoomId);
    }
    return [];
  }, [selectedCinemaId, selectedRoomId, getShowtimesForRoom]);

  // Lấy dữ liệu ghế đã override
  const displaySeats = useMemo(() => {
    const overrides = seatOverrides[selectedShowtimeIdState] || {};
    return seatMapData.map(seat => overrides[seat.id] || seat);
  }, [seatMapData, seatOverrides, selectedShowtimeIdState]);

  // Xử lý thay đổi cinema
  const handleCinemaChange = useCallback((cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedRoomId(null);
    setSelectedShowtimeIdState(null);
    setSelectedSeatId(null);
    setShouldLoadData(false);
    setSeatOverrides({});
  }, []);

  // Xử lý thay đổi room
  const handleRoomChange = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setSelectedShowtimeIdState(null);
    setSelectedSeatId(null);
    setShouldLoadData(false);
    setSeatOverrides({});
  }, []);

  // Xử lý thay đổi showtime
  const handleShowtimeChange = useCallback((showtimeId) => {
    setSelectedShowtimeIdState(showtimeId);
    setSelectedSeatId(null);
    setShouldLoadData(false);
    setSeatOverrides({});
  }, []);

  // Xử lý bấm nút "Xem ghế"
  const handleViewSeats = useCallback(() => {
    if (!selectedCinemaId) {
      toast({
        title: "Vui lòng chọn rạp chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (!selectedRoomId) {
      toast({
        title: "Vui lòng chọn phòng chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (!selectedShowtimeIdState) {
      toast({
        title: "Vui lòng chọn suất chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setShouldLoadData(true);
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeIdState, toast]);

  // Xử lý cập nhật trạng thái ghế khi click
  const handleStatusChange = useCallback(async (seatId, newStatus) => {
    // Tìm ghế trong seatMapData
    const seat = seatMapData.find(s => s.id === seatId);
    if (!seat) {
      toast({
        title: "Không tìm thấy ghế",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Kiểm tra nếu ghế đang ở trạng thái mới
    if (seat.status === newStatus) {
      toast({
        title: "Ghế đã ở trạng thái này",
        description: `Ghế ${seatId} đã là ${SEAT_STATUS[newStatus].label}`,
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Map status từ local sang API
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
        position: "top-right",
      });
      return;
    }

    // Lấy thông tin cần thiết từ dữ liệu gốc
    const showtimeSeatId = seat.showtimeSeatId;
    const showtimeId = seat.showtimeId || seat.originalData?.ShowtimeId;
    const seatOriginalId = seat.originalData?.SeatId || seat.id;

    if (!showtimeSeatId || !showtimeId) {
      toast({
        title: "Thiếu thông tin ghế",
        description: "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Tạo dữ liệu update
    const updateData = {
      ShowtimeId: showtimeId,
      SeatId: seatOriginalId,
      Status: apiStatus,
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: "admin"
    };

    console.log("🔄 Updating seat:", { seatId, showtimeSeatId, updateData });

    try {
      await handleUpdateSeatStatus(showtimeSeatId, updateData);

      // Cập nhật local state
      setSeatOverrides(prev => {
        const showtimeIdState = selectedShowtimeIdState;
        const forShow = { ...(prev[showtimeIdState] || {}) };
        forShow[seatId] = {
          ...seat,
          status: newStatus,
          note: `Changed to ${newStatus} by admin`
        };
        return { ...prev, [showtimeIdState]: forShow };
      });

      toast({
        title: "Cập nhật thành công",
        description: `Ghế ${seatId} đã chuyển sang trạng thái ${SEAT_STATUS[newStatus].label}`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      
      let errorMsg = "Không thể cập nhật trạng thái ghế";
      if (error.message) {
        errorMsg = error.message;
      }
      
      toast({
        title: "Lỗi cập nhật",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [seatMapData, selectedShowtimeIdState, handleUpdateSeatStatus, toast]);

  // Xử lý click ghế
  const handleSeatClick = useCallback((seatId) => {
    setSelectedSeatId(seatId);
    if (isMobile) {
      onDrawerOpen();
    }
  }, [isMobile, onDrawerOpen]);

  // Xử lý reset ghế
  const handleResetConfirm = useCallback(async (seatId, note) => {
    const seat = seatMapData.find(s => s.id === seatId);
    if (seat && seat.showtimeSeatId) {
      try {
        await handleResetSeat(seat.showtimeSeatId, note);
        setSeatOverrides(prev => {
          const showtimeId = selectedShowtimeIdState;
          const forShow = { ...(prev[showtimeId] || {}) };
          forShow[seatId] = {
            ...seat,
            status: 'trong',
            note: note || 'Reset by admin'
          };
          return { ...prev, [showtimeId]: forShow };
        });
        setResetTarget(null);
      } catch (error) {
        console.error("Lỗi reset ghế:", error);
        toast({
          title: "Lỗi reset ghế",
          description: error.message || "Không thể reset ghế",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  }, [seatMapData, handleResetSeat, selectedShowtimeIdState, toast]);

  // Xử lý refresh
  const handleRefresh = useCallback(async () => {
    if (selectedCinemaId && selectedRoomId && selectedShowtimeIdState) {
      setIsRefreshing(true);
      onOpenOverlay();
      try {
        setSeatOverrides({});
        await loadSeatsForShowtime(selectedShowtimeIdState);
        toast({
          title: "Đã làm mới dữ liệu",
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        console.error("Refresh error:", error);
        toast({
          title: "Lỗi làm mới",
          description: "Không thể làm mới dữ liệu",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          onCloseOverlay();
        }, 300);
      }
    } else {
      toast({
        title: "Vui lòng chọn đầy đủ thông tin",
        description: "Cần chọn rạp, phòng và suất chiếu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeIdState, loadSeatsForShowtime, toast, onOpenOverlay, onCloseOverlay]);

  // Xử lý mở modal tạo ghế
  const handleOpenGenerateModal = useCallback(() => {
    setFormCinemaId("");
    setFormRoomId("");
    setFormShowtimeId("");
    setFormRooms([]);
    setFormShowtimes([]);
    onModalOpen();
  }, [onModalOpen]);

  // Xử lý tạo ghế tự động từ modal
  const handleGenerateSeatsFromModal = useCallback(async () => {
    if (!formShowtimeId) {
      toast({
        title: "Vui lòng chọn suất chiếu",
        description: "Cần chọn suất chiếu để tạo ghế",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const existingSeats = seatMapData.filter(s => 
      String(s.showtimeId || s.originalData?.ShowtimeId) === String(formShowtimeId)
    );
    
    if (existingSeats.length > 0) {
      const confirmed = window.confirm(
        `Suất chiếu này đã có ${existingSeats.length} ghế. Bạn có muốn tạo lại không?`
      );
      if (!confirmed) {
        onModalClose();
        return;
      }
    }

    onModalClose();
    onOpenOverlay();
    try {
      await handleGenerateSeats(formShowtimeId);
      setSelectedShowtimeIdState(formShowtimeId);
      setSeatOverrides({});
      
      const selectedShowtime = showtimes.find(st => String(st.ShowtimeId || st.id) === String(formShowtimeId));
      if (selectedShowtime) {
        const room = selectedShowtime.Room || selectedShowtime.RoomId;
        if (room) {
          const cinemaId = room.CinemaId || room.Cinema?.CinemaId;
          if (cinemaId) {
            setSelectedCinemaId(cinemaId);
            setSelectedRoomId(room.RoomId || room.id);
          }
        }
      }
      setShouldLoadData(true);
      toast({
        title: "Tạo ghế thành công",
        description: "Đã tạo ghế tự động cho suất chiếu",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Lỗi tạo ghế:", error);
      let errorMsg = "Không thể tạo ghế tự động. Vui lòng kiểm tra lại";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast({
        title: "Lỗi tạo ghế",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setTimeout(() => {
        onCloseOverlay();
      }, 500);
    }
  }, [formShowtimeId, handleGenerateSeats, onModalClose, onOpenOverlay, onCloseOverlay, showtimes, seatMapData, toast]);

  // Tính tỷ lệ lấp đầy
  const totalSeats = displaySeats.length;
  const occupied = displaySeats.filter(s => s.status === 'dat' || s.status === 'giu').length;
  const occupancyRate = totalSeats > 0 ? Math.round((occupied / totalSeats) * 100) : 0;

  // Lấy thông tin showtime đang chọn
  const activeShowtime = useMemo(() => {
    return currentShowtimes.find(
      st => String(st.ShowtimeId || st.id) === String(selectedShowtimeIdState)
    );
  }, [currentShowtimes, selectedShowtimeIdState]);

  // Lấy thông tin phòng đang chọn
  const activeRoom = useMemo(() => {
    return currentRooms.find(
      r => String(r.RoomId || r.id) === String(selectedRoomId)
    );
  }, [currentRooms, selectedRoomId]);

  // Kiểm tra đã chọn đủ thông tin chưa
  const hasFullSelection = selectedCinemaId && selectedRoomId && selectedShowtimeIdState;

  // ============================================================
  // HIỂN THỊ LOADER KHI ĐANG TẢI DỮ LIỆU BAN ĐẦU
  // ============================================================
  if (isInitialLoad || (loading && !displaySeats.length)) {
    return <Loader />;
  }

  // Overlay Loading component
  const LoadingOverlay = () => (
    <Portal>
      <Fade in={showOverlay || isChangingData || isRefreshing}>
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
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={ORANGE.OR}
            size="xl"
          />
          <Text color="white" fontWeight="600" fontSize="16px">
            Đang tải dữ liệu...
          </Text>
          <Text color="white" opacity="0.7" fontSize="13px">
            Vui lòng chờ trong giây lát
          </Text>
        </Box>
      </Fade>
    </Portal>
  );

  // Format datetime cho form
  const formatDateTimeForm = (dateString) => {
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
    } catch {
      return 'Invalid Date';
    }
  };

  // Lấy tên phim từ showtime
  const getMovieTitleForm = (showtime) => {
    if (!showtime) return 'Unknown Movie';
    if (showtime.Movie?.Title) return showtime.Movie.Title;
    if (showtime.movie) return showtime.movie;
    if (showtime.MovieId?.Title) return showtime.MovieId.Title;
    return 'Unknown Movie';
  };

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
      <LoadingOverlay />

      {/* Modal tạo ghế tự động */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
        <ModalContent
          borderRadius="20px"
          bg={theme.bgCard}
          border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"}
          boxShadow="0 32px 80px rgba(0,0,0,.25)"
        >
          <ModalHeader>
            <Flex align="center" gap="10px">
              <Box
                w="36px"
                h="36px"
                borderRadius="10px"
                bg={ORANGE.ORGRAD}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow={`0 4px 12px ${ORANGE.ORSW}`}
              >
                <Icon as={MdEventSeat} boxSize="16px" color="white" />
              </Box>
              <Box>
                <Text fontSize="17px" fontWeight="800" color={theme.text}>
                  Tạo ghế tự động
                </Text>
                <Text fontSize="12px" color={theme.textMuted}>
                  Chọn suất chiếu để tạo ghế hàng loạt
                </Text>
              </Box>
            </Flex>
            <ModalCloseButton color={theme.textMuted} />
          </ModalHeader>

          <ModalBody py="4">
            <VStack spacing="4" align="stretch">
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>
                  Rạp chiếu
                </FormLabel>
                <Select
                  value={formCinemaId}
                  onChange={(e) => setFormCinemaId(e.target.value)}
                  bg={theme.inputBg}
                  border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                  _focus={{
                    border: `1.5px solid ${ORANGE.OR}`,
                    boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
                  }}
                  _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
                >
                  <option value="">-- Chọn rạp --</option>
                  {cinemas.map((c) => (
                    <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>
                      {c.Name || c.name || c.CinemaName || 'Unknown Cinema'}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>
                  Phòng chiếu
                </FormLabel>
                <Select
                  value={formRoomId}
                  onChange={(e) => setFormRoomId(e.target.value)}
                  bg={theme.inputBg}
                  border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                  isDisabled={!formCinemaId || formRooms.length === 0}
                  _focus={{
                    border: `1.5px solid ${ORANGE.OR}`,
                    boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
                  }}
                  _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
                >
                  <option value="">-- Chọn phòng --</option>
                  {formRooms.map((r) => (
                    <option key={r.id || r.RoomId} value={r.id || r.RoomId}>
                      {r.Name || r.name || r.RoomName || 'Unknown Room'} ({r.SeatCount || r.seatCount || r.capacity || 0} ghế)
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>
                  Suất chiếu
                </FormLabel>
                <Select
                  value={formShowtimeId}
                  onChange={(e) => setFormShowtimeId(e.target.value)}
                  bg={theme.inputBg}
                  border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"}
                  borderRadius="12px"
                  color={theme.text}
                  fontSize="13px"
                  h="44px"
                  isDisabled={!formRoomId || formShowtimes.length === 0}
                  _focus={{
                    border: `1.5px solid ${ORANGE.OR}`,
                    boxShadow: `0 0 0 4px ${ORANGE.ORSW}`,
                  }}
                  _hover={{ border: `1.5px solid ${ORANGE.OR}` }}
                >
                  <option value="">-- Chọn suất chiếu --</option>
                  {formShowtimes.map((s) => (
                    <option key={s.id || s.ShowtimeId} value={s.id || s.ShowtimeId}>
                      {formatDateTimeForm(s.StartTime || s.startTime || s.time)} · {getMovieTitleForm(s)}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {formShowtimeId && (
                <Box
                  p="12px 16px"
                  borderRadius="12px"
                  bg={ORANGE.ORPL}
                  border={`1.5px solid ${ORANGE.ORBD}`}
                >
                  <Flex align="center" gap="8px">
                    <Icon as={MdEventSeat} boxSize="16px" color={ORANGE.OR} />
                    <Text fontSize="13px" color={theme.text}>
                      Hệ thống sẽ tự động tạo toàn bộ ghế cho suất chiếu này
                    </Text>
                  </Flex>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter gap="10px" borderTop={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Button
              h="42px"
              px="20px"
              variant="ghost"
              color={theme.textMuted}
              borderRadius="10px"
              fontWeight="600"
              fontSize="13px"
              border={theme.isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
              _hover={{ bg: theme.bgMuted }}
              onClick={onModalClose}
            >
              Hủy bỏ
            </Button>
            <Button
              h="42px"
              px="24px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg={ORANGE.ORGRAD}
              color="white"
              boxShadow={`0 4px 16px ${ORANGE.ORSW}`}
              _hover={{
                boxShadow: `0 8px 24px rgba(234,88,12,.4)`,
                transform: "translateY(-1px)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all .2s"
              leftIcon={<Icon as={MdAdd} />}
              onClick={handleGenerateSeatsFromModal}
              isDisabled={!formShowtimeId}
              isLoading={isGenerating}
              loadingText="Đang tạo..."
            >
              Tạo ghế tự động
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modals & Drawers */}
      <ResetSeatModal
        seat={resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetConfirm}
        theme={theme}
      />

      <SeatDetailDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        seat={displaySeats.find(s => s.id === selectedSeatId) || null}
        onReset={(seat) => {
          setResetTarget(seat);
          onDrawerClose();
        }}
        theme={theme}
      />

      {/* Container */}
      <Box maxW="1440px" mx="auto">
        {/* Header */}
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: "12px", md: "0" }}
          mb="20px"
          sx={{ animation: `${fadeUp} .4s ease both` }}
        >
          <Flex align="center" gap="12px">
            <Box
              w={{ base: "44px", md: "52px" }}
              h={{ base: "44px", md: "52px" }}
              borderRadius="14px"
              bg={ORANGE.ORGRAD}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 4px 20px ${ORANGE.ORSW}`}
            >
              <Icon as={MdEventSeat} boxSize={{ base: "20px", md: "24px" }} color="white" />
            </Box>
            <Box>
              <Flex align="center" gap="12px" wrap="wrap">
                <Text
                  fontSize={{ base: "20px", md: "28px" }}
                  fontWeight="800"
                  color={theme.text}
                  letterSpacing="-0.5px"
                >
                  Quản lý ghế
                </Text>
                <LiveBadge theme={theme} />
                {activeShowtime && displaySeats.length > 0 && (
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={theme.textMuted}
                    bg={theme.bgMuted}
                    px="12px"
                    py="4px"
                    borderRadius="full"
                  >
                    {activeShowtime.Movie?.Title || activeShowtime.movie || 'Unknown Movie'}
                  </Text>
                )}
                {activeRoom && displaySeats.length > 0 && (
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={theme.textMuted}
                    bg={theme.bgMuted}
                    px="12px"
                    py="4px"
                    borderRadius="full"
                  >
                    {activeRoom.Name || activeRoom.name || 'Unknown Room'} ({activeRoom.SeatCount || activeRoom.seatCount || activeRoom.capacity || 0} ghế)
                  </Text>
                )}
                {!displaySeats.length && hasFullSelection && (
                  <Text
                    fontSize="13px"
                    fontWeight="600"
                    color={ORANGE.OR}
                    bg={ORANGE.ORPL}
                    px="12px"
                    py="4px"
                    borderRadius="full"
                  >
                    Bấm "Xem ghế" để tải dữ liệu
                  </Text>
                )}
              </Flex>
              <Text
                color={theme.textMuted}
                fontSize={{ base: "11px", md: "14px" }}
                display={{ base: "none", sm: "block" }}
                mt="2px"
              >
                Theo dõi trạng thái ghế realtime theo suất chiếu
              </Text>
            </Box>
          </Flex>

          <Flex gap="8px" align="center" w={{ base: "100%", md: "auto" }} flexWrap="wrap">
            <Button
              h="40px"
              px="16px"
              borderRadius="12px"
              fontWeight="700"
              fontSize="13px"
              bg={theme.bgMuted}
              color={theme.textSub}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0"}
              leftIcon={<Icon as={theme.isDark ? MdLightMode : MdDarkMode} boxSize="16px" />}
              _hover={{ borderColor: ORANGE.OR, color: ORANGE.OR }}
              onClick={theme.toggleColorMode}
              flex={{ base: "1", md: "auto" }}
            >
              {isMobile ? "" : theme.isDark ? "Sáng" : "Tối"}
            </Button>

            <Button
              h="40px"
              px="16px"
              borderRadius="12px"
              fontWeight="700"
              fontSize="13px"
              bg={ORANGE.ORGRAD}
              color="white"
              boxShadow={`0 4px 12px ${ORANGE.ORSW}`}
              _hover={{ boxShadow: `0 8px 24px rgba(234,88,12,0.4)` }}
              onClick={handleViewSeats}
              isDisabled={!hasFullSelection || loading}
              flex={{ base: "1", md: "auto" }}
              leftIcon={<Icon as={MdSearch} boxSize="16px" />}
            >
              {loading ? "Đang tải..." : "Xem ghế"}
            </Button>

            <Button
              h="40px"
              px="16px"
              borderRadius="12px"
              fontWeight="700"
              fontSize="13px"
              bg={theme.bgMuted}
              color={theme.textSub}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0"}
              leftIcon={<Icon as={isRefreshing ? MdRefresh : MdOutlineRefresh} boxSize="16px" className={isRefreshing ? "spin" : ""} />}
              _hover={{ borderColor: ORANGE.OR, color: ORANGE.OR }}
              onClick={handleRefresh}
              isLoading={isRefreshing}
              loadingText=""
              flex={{ base: "1", md: "auto" }}
              isDisabled={!displaySeats.length || isRefreshing}
            >
              {isMobile ? "" : "Làm mới"}
            </Button>

            <Button
              h="40px"
              px="16px"
              borderRadius="12px"
              fontWeight="700"
              fontSize="13px"
              bg={theme.bgMuted}
              color={theme.textSub}
              border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0"}
              leftIcon={<Icon as={MdAdd} boxSize="16px" />}
              _hover={{ borderColor: ORANGE.OR, color: ORANGE.OR }}
              onClick={handleOpenGenerateModal}
              flex={{ base: "1", md: "auto" }}
            >
              {isMobile ? "Tạo ghế" : "Tạo ghế tự động"}
            </Button>

            {!isMobile && (
              <Button
                h="40px"
                w="40px"
                borderRadius="12px"
                bg={theme.bgMuted}
                color={theme.textSub}
                border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0"}
                _hover={{ borderColor: ORANGE.OR, color: ORANGE.OR }}
                onClick={() => setShowFullscreen(!showFullscreen)}
              >
                <Icon as={showFullscreen ? MdFullscreenExit : MdFullscreen} boxSize="16px" />
              </Button>
            )}
          </Flex>
        </Flex>

        {/* Stats Grid - Chỉ hiển thị khi đã có dữ liệu */}
        {displaySeats.length > 0 && (
          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 5 }}
            spacing={{ base: "8px", md: "14px" }}
            mb="20px"
            sx={{ animation: `${fadeUp} .4s ease .04s both` }}
          >
            <StatCard
              label="Trống"
              value={displaySeats.filter(s => s.status === 'trong').length}
              icon={SEAT_STATUS.trong.icon}
              accent={SEAT_STATUS.trong.dot}
              delay={0}
              theme={theme}
            />
            <StatCard
              label="Đã đặt"
              value={displaySeats.filter(s => s.status === 'dat').length}
              icon={SEAT_STATUS.dat.icon}
              accent={SEAT_STATUS.dat.dot}
              delay={0.04}
              theme={theme}
            />
            <StatCard
              label="Đang giữ"
              value={displaySeats.filter(s => s.status === 'giu').length}
              icon={SEAT_STATUS.giu.icon}
              accent={ORANGE.OR}
              delay={0.08}
              theme={theme}
            />
            <StatCard
              label="Lỗi / Kẹt"
              value={displaySeats.filter(s => s.status === 'loi').length}
              icon={SEAT_STATUS.loi.icon}
              accent={SEAT_STATUS.loi.dot}
              delay={0.12}
              theme={theme}
            />
            <StatCard
              label="Bảo trì"
              value={displaySeats.filter(s => s.status === 'baoTri').length}
              icon={SEAT_STATUS.baoTri.icon}
              accent={SEAT_STATUS.baoTri.dot}
              delay={0.16}
              theme={theme}
            />
          </SimpleGrid>
        )}

        {/* Main Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }}
          gap="20px"
          sx={{ animation: `${fadeUp} .4s ease .08s both` }}
        >
          <SeatMapView
            cinemaId={selectedCinemaId}
            roomId={selectedRoomId}
            showtimeId={selectedShowtimeIdState}
            showtimesForRoom={currentShowtimes}
            activeShowtime={activeShowtime}
            seats={displaySeats}
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
            loading={loading || isChangingData || isRefreshing}
            isChangingData={isChangingData || isRefreshing}
            hasFullSelection={hasFullSelection}
          />

          {!isMobile && (
            <Box
              bg={theme.bgCard}
              borderRadius="20px"
              border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}
              boxShadow={theme.shadow}
              p="24px"
              transition="all .3s"
              _hover={{ boxShadow: theme.shadowHover }}
              position="sticky"
              top="90px"
              alignSelf="flex-start"
              minH="400px"
            >
              <SeatInfoPanel
                selectedSeat={displaySeats.find(s => s.id === selectedSeatId) || null}
                onReset={(seat) => {
                  setResetTarget(seat);
                }}
                theme={theme}
              />
            </Box>
          )}
        </Grid>
      </Box>

      <style jsx>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}