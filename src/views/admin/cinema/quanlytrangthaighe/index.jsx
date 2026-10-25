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
  MdAdd, MdVisibility
} from "react-icons/md";
import { ORANGE } from "./constants";
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
      return new Date(parsed).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (error) { return dateString; }
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

  // Lấy dữ liệu từ hook
  const {
    cinemas, rooms, showtimes, seatMapData, seatStats,
    loading, isGenerating, isInitialLoad, isLoadingSeats,
    loadSeats, handleGenerateSeats, handleUpdateSeatStatus,
    handleResetSeat, handleDeleteSeat, getRoomsByCinema, getShowtimesByRoom,
  } = useSeatData();

  // State cho filter
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChangingData, setIsChangingData] = useState(false);
  const [isViewingSeats, setIsViewingSeats] = useState(false);
  const { isOpen: showOverlay, onOpen: onOpenOverlay, onClose: onCloseOverlay } = useDisclosure();

  const isUserSelectedShowtime = useRef(false);

  // State cho form tạo ghế
  const [formCinemaId, setFormCinemaId] = useState("");
  const [formRoomId, setFormRoomId] = useState("");
  const [formShowtimeId, setFormShowtimeId] = useState("");
  const [formRooms, setFormRooms] = useState([]);
  const [formShowtimes, setFormShowtimes] = useState([]);

  // Lấy danh sách rooms/showtimes dựa trên lựa chọn
  const currentRooms = useMemo(() => selectedCinemaId ? getRoomsByCinema(selectedCinemaId) : [], [selectedCinemaId, getRoomsByCinema]);
  const currentShowtimes = useMemo(() => selectedRoomId ? getShowtimesByRoom(selectedRoomId) : [], [selectedRoomId, getShowtimesByRoom]);

  // Auto chọn Rạp đầu tiên
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(cinemas[0].id || cinemas[0].CinemaId);
      isUserSelectedShowtime.current = false;
    }
  }, [cinemas, selectedCinemaId]);

  // Auto chọn Phòng đầu tiên
  useEffect(() => {
    if (selectedCinemaId && currentRooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(currentRooms[0].id || currentRooms[0].RoomId);
      isUserSelectedShowtime.current = false;
    }
  }, [selectedCinemaId, currentRooms, selectedRoomId]);

  // Auto chọn Suất chiếu đầu tiên
  useEffect(() => {
    if (selectedRoomId && currentShowtimes.length > 0 && !isUserSelectedShowtime.current && !selectedShowtimeId) {
      setSelectedShowtimeId(currentShowtimes[0].id || currentShowtimes[0].ShowtimeId);
    }
  }, [selectedRoomId, currentShowtimes, selectedShowtimeId]);

  // Xử lý Form Tạo ghế
  useEffect(() => {
    if (formCinemaId) {
      setFormRooms(getRoomsByCinema(formCinemaId));
      setFormRoomId(""); setFormShowtimeId(""); setFormShowtimes([]);
    }
  }, [formCinemaId, getRoomsByCinema]);

  useEffect(() => {
    if (formCinemaId && formRoomId) {
      setFormShowtimes(getShowtimesByRoom(formRoomId));
      setFormShowtimeId("");
    }
  }, [formCinemaId, formRoomId, getShowtimesByRoom]);

  // Xử lý sự kiện thay đổi bộ lọc
  const handleCinemaChange = useCallback((cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedRoomId(null); setSelectedShowtimeId(null); setSelectedSeatId(null);
    isUserSelectedShowtime.current = false;
    loadSeats(null);
  }, [loadSeats]);

  const handleRoomChange = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setSelectedShowtimeId(null); setSelectedSeatId(null);
    isUserSelectedShowtime.current = false;
    loadSeats(null);
  }, [loadSeats]);

  const handleShowtimeChange = useCallback((showtimeId) => {
    if (!showtimeId) return;
    isUserSelectedShowtime.current = true;
    setSelectedShowtimeId(showtimeId);
    setSelectedSeatId(null);
  }, []);

  // Xử lý click Xem ghế
  const handleViewSeats = useCallback(async () => {
    if (!selectedCinemaId || !selectedRoomId || !selectedShowtimeId) {
      toast({ title: "Vui lòng chọn đầy đủ Rạp, Phòng và Suất chiếu", status: "warning", duration: 3000 });
      return;
    }
    setIsViewingSeats(true); onOpenOverlay();
    try {
      const result = await loadSeats(selectedShowtimeId);
      if (result && result.seats && result.seats.length === 0) {
        toast({ title: "Chưa có ghế", description: "Vui lòng tạo ghế tự động cho suất chiếu này", status: "info", duration: 3000 });
      }
    } catch (error) { console.error(error); } 
    finally {
      setTimeout(() => { setIsViewingSeats(false); onCloseOverlay(); }, 300);
    }
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeId, loadSeats, toast, onOpenOverlay, onCloseOverlay]);

  // Xử lý click vào ghế
  const handleSeatClick = useCallback((seatId) => {
    setSelectedSeatId(seatId);
    if (isMobile) onDrawerOpen();
  }, [isMobile, onDrawerOpen]);

  // Xử lý Refresh
  const handleRefresh = useCallback(async () => {
    if (selectedShowtimeId) {
      setIsRefreshing(true); onOpenOverlay();
      try { await loadSeats(selectedShowtimeId); } catch (error) { console.error(error); } 
      finally { setTimeout(() => { setIsRefreshing(false); onCloseOverlay(); }, 300); }
    } else {
      toast({ title: "Chưa có dữ liệu", description: "Vui lòng chọn suất chiếu", status: "warning", duration: 3000 });
    }
  }, [selectedShowtimeId, loadSeats, toast, onOpenOverlay, onCloseOverlay]);

  // Mở Modal Tạo ghế
  const handleOpenGenerateModal = useCallback(() => {
    setFormCinemaId(selectedCinemaId || "");
    setFormRoomId(selectedRoomId || "");
    setFormShowtimeId(selectedShowtimeId || "");
    if (selectedCinemaId) setFormRooms(getRoomsByCinema(selectedCinemaId));
    if (selectedCinemaId && selectedRoomId) setFormShowtimes(getShowtimesByRoom(selectedRoomId));
    onModalOpen();
  }, [selectedCinemaId, selectedRoomId, selectedShowtimeId, getRoomsByCinema, getShowtimesByRoom, onModalOpen]);

  // Tạo ghế từ Modal
  const handleGenerateSeatsFromModal = useCallback(async () => {
    if (!formShowtimeId) {
      toast({ title: "Vui lòng chọn suất chiếu", status: "warning", duration: 3000 });
      return;
    }
    onModalClose(); onOpenOverlay();
    try {
      await handleGenerateSeats(formShowtimeId);
      setSelectedShowtimeId(formShowtimeId);
      setSelectedRoomId(formRoomId);
      setSelectedCinemaId(formCinemaId);
      isUserSelectedShowtime.current = true;
      toast({ title: "Tạo ghế thành công", status: "success", duration: 3000 });
    } catch (error) { console.error(error); } 
    finally { setTimeout(() => { onCloseOverlay(); }, 500); }
  }, [formShowtimeId, formCinemaId, formRoomId, handleGenerateSeats, onModalClose, onOpenOverlay, onCloseOverlay, toast]);

  // Đổi trạng thái ghế
  const handleStatusChange = useCallback(async (seatId, newStatus) => {
    const seat = seatMapData.find(s => s.id === seatId);
    if (!seat) return;

    const statusMap = { 'trong': 'Available', 'dat': 'Reserved', 'giu': 'Held', 'loi': 'Broken', 'baoTri': 'Inactive' };
    const apiStatus = statusMap[newStatus];
    if (!apiStatus) return;

    const success = await handleUpdateSeatStatus(seatId, apiStatus);
    if (success) toast({ title: "Đã cập nhật trạng thái ghế", status: "success", duration: 2000 });
  }, [seatMapData, handleUpdateSeatStatus, toast]);

  // Reset ghế
  const handleResetConfirm = useCallback(async (seatId) => {
    const success = await handleResetSeat(seatId);
    if (success) setResetTarget(null);
  }, [handleResetSeat]);

  // Xóa ghế
  const onDeleteSeat = useCallback(async (seatId) => {
    const success = await handleDeleteSeat(seatId);
    if (success) {
      setSelectedSeatId(null);
      if (isMobile) onDrawerClose();
    }
  }, [handleDeleteSeat, isMobile, onDrawerClose]);

  // Tính toán thống kê
  const totalSeats = seatMapData.length;
  const occupied = seatMapData.filter(s => s.status === 'dat' || s.status === 'giu').length;
  const occupancyRate = totalSeats > 0 ? Math.round((occupied / totalSeats) * 100) : 0;
  const hasFullSelection = selectedCinemaId && selectedRoomId && selectedShowtimeId;
  const hasSeats = seatMapData.length > 0;
  
  const activeShowtime = useMemo(() => {
    return currentShowtimes.find(st => String(st.id || st.ShowtimeId) === String(selectedShowtimeId));
  }, [currentShowtimes, selectedShowtimeId]);

  // Hiển thị Loading toàn trang khi mới load
  if (isInitialLoad) return <Loader />;

  return (
    <Box
      pt={{ base: "70px", md: "80px" }}
      px={{ base: "8px", md: "16px", lg: "24px" }}
      pb="40px" bg={theme.bg} minH="100vh"
      transition="all .3s" position="relative"
    >
      {/* Overlay Loading */}
      <Portal>
        <Fade in={showOverlay || isChangingData || isRefreshing || isViewingSeats || isLoadingSeats}>
          <Box position="fixed" inset="0" zIndex="9999" bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(4px)" display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="4" pointerEvents="none">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={ORANGE.OR} size="xl" />
            <Text color="white" fontWeight="600" fontSize="16px">{isViewingSeats ? "Đang tải ghế..." : "Đang xử lý..."}</Text>
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
                <Select value={formCinemaId} onChange={(e) => setFormCinemaId(e.target.value)} bg={theme.inputBg} borderRadius="12px" color={theme.text} fontSize="13px" h="44px">
                  <option value="">-- Chọn rạp --</option>
                  {cinemas.map((c) => <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>{c.name || c.Name || 'Unknown Cinema'}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>Phòng chiếu</FormLabel>
                <Select value={formRoomId} onChange={(e) => setFormRoomId(e.target.value)} bg={theme.inputBg} borderRadius="12px" color={theme.text} fontSize="13px" h="44px" isDisabled={!formCinemaId || formRooms.length === 0}>
                  <option value="">-- Chọn phòng --</option>
                  {formRooms.map((r) => <option key={r.id || r.RoomId} value={r.id || r.RoomId}>{r.name || r.Name || 'Unknown Room'} ({r.SeatCount || 0} ghế)</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color={theme.textSub}>Suất chiếu</FormLabel>
                <Select value={formShowtimeId} onChange={(e) => setFormShowtimeId(e.target.value)} bg={theme.inputBg} borderRadius="12px" color={theme.text} fontSize="13px" h="44px" isDisabled={!formRoomId || formShowtimes.length === 0}>
                  <option value="">-- Chọn suất chiếu --</option>
                  {formShowtimes.map((s) => <option key={s.id || s.ShowtimeId} value={s.id || s.ShowtimeId}>{getMovieTitle(s)} - {formatDateTime(s.start_time || s.StartTime)}</option>)}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap="10px" borderTop={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9"}>
            <Button variant="ghost" onClick={onModalClose}>Hủy bỏ</Button>
            <Button bg={ORANGE.ORGRAD} color="white" onClick={handleGenerateSeatsFromModal} isDisabled={!formShowtimeId} isLoading={isGenerating} loadingText="Đang tạo..." leftIcon={<Icon as={MdAdd} />}>Tạo ghế tự động</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Header Page */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap="12px" mb="20px">
        <Flex align="center" gap="12px" sx={{ animation: `${fadeUp} .4s ease both` }}>
          <Box w="44px" h="44px" borderRadius="14px" bg={ORANGE.ORGRAD} display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdEventSeat} boxSize="20px" color="white" />
          </Box>
          <Box>
            <Text fontSize="20px" fontWeight="800" color={theme.text}>Quản lý trạng thái ghế</Text>
            <Text fontSize="13px" color={theme.textMuted}>
              Theo dõi trạng thái ghế realtime theo suất chiếu
              {hasSeats && seatStats?.room_total > 0 && <Text as="span" ml="8px" fontWeight="700" color={ORANGE.OR}>({seatMapData.length}/{seatStats.room_total} ghế)</Text>}
            </Text>
          </Box>
        </Flex>

        <Flex gap="8px" flexWrap="wrap" sx={{ animation: `${fadeUp} .4s ease .08s both` }}>
          <Button size="sm" onClick={theme.toggleColorMode} leftIcon={<Icon as={theme.isDark ? MdLightMode : MdDarkMode} />}>{theme.isDark ? "Sáng" : "Tối"}</Button>
          <Button size="sm" bg={ORANGE.ORGRAD} color="white" onClick={handleViewSeats} isLoading={isViewingSeats || isLoadingSeats} loadingText="Đang tải..." leftIcon={<Icon as={MdVisibility} />} isDisabled={!hasFullSelection} _hover={{ opacity: 0.9 }}>Xem ghế</Button>
          <Button size="sm" onClick={handleRefresh} isLoading={isRefreshing} leftIcon={<Icon as={MdRefresh} />} isDisabled={!hasSeats}>Làm mới</Button>
          <Button size="sm" bg={ORANGE.ORGRAD} color="white" onClick={handleOpenGenerateModal} leftIcon={<Icon as={MdAdd} />}>Tạo ghế</Button>
        </Flex>
      </Flex>

      {/* Bộ lọc */}
      <Box bg={theme.bgCard} borderRadius="16px" border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"} p="16px" mb="20px" sx={{ animation: `${fadeUp} .4s ease .04s both` }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px">
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Rạp chiếu</Text>
            <Select value={selectedCinemaId || ""} onChange={(e) => handleCinemaChange(e.target.value)} bg={theme.inputBg} border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"} borderRadius="10px" color={theme.text} fontSize="13px" h="42px">
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((c) => <option key={c.id || c.CinemaId} value={c.id || c.CinemaId}>{c.name || c.Name || 'Unknown Cinema'}</option>)}
            </Select>
          </Box>
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Phòng chiếu</Text>
            <Select value={selectedRoomId || ""} onChange={(e) => handleRoomChange(e.target.value)} bg={theme.inputBg} border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"} borderRadius="10px" color={theme.text} fontSize="13px" h="42px" isDisabled={!selectedCinemaId || currentRooms.length === 0}>
              <option value="">-- Chọn phòng --</option>
              {currentRooms.map((r) => <option key={r.id || r.RoomId} value={r.id || r.RoomId}>{r.name || r.Name || 'Unknown Room'} ({r.SeatCount || 0} ghế)</option>)}
            </Select>
          </Box>
          <Box>
            <Text fontSize="12px" fontWeight="600" color={theme.textMuted} mb="6px">Suất chiếu</Text>
            <Select value={selectedShowtimeId || ""} onChange={(e) => handleShowtimeChange(e.target.value)} bg={theme.inputBg} border={theme.isDark ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e8edf3"} borderRadius="10px" color={theme.text} fontSize="13px" h="42px" isDisabled={!selectedRoomId || currentShowtimes.length === 0}>
              <option value="">-- Chọn suất chiếu --</option>
              {currentShowtimes.map((st) => <option key={st.id || st.ShowtimeId} value={st.id || st.ShowtimeId}>{getMovieTitle(st)} - {formatDateTime(st.start_time || st.StartTime)}</option>)}
            </Select>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Thống kê */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing="12px" mb="20px" sx={{ animation: `${fadeUp} .4s ease .08s both` }}>
        <StatCard label="Tổng ghế" value={seatMapData.length || 0} icon={MdEventSeat} accent={ORANGE.OR} theme={theme} trendLabel={seatStats?.room_total > 0 ? `/ ${seatStats.room_total} ghế phòng` : undefined} />
        <StatCard label="Trống" value={seatStats.trong || 0} icon={MdEventSeat} accent="#10b981" theme={theme} />
        <StatCard label="Đã đặt" value={seatStats.dat || 0} icon={MdEventSeat} accent="#f97316" theme={theme} />
        <StatCard label="Đang giữ" value={seatStats.giu || 0} icon={MdEventSeat} accent="#f59e0b" theme={theme} />
        <StatCard label="Lỗi" value={seatStats.loi || 0} icon={MdEventSeat} accent="#ef4444" theme={theme} />
      </SimpleGrid>

      {/* SƠ ĐỒ & CHI TIẾT (Đã sửa Layout) */}
      <Grid templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }} gap="20px" sx={{ animation: `${fadeUp} .4s ease .12s both` }}>
        
        {/* Cột Trái: Sơ đồ ghế */}
        <Box w="100%" overflow="hidden">
          <SeatMapView
            showtimeId={selectedShowtimeId}
            activeShowtime={activeShowtime}
            seats={seatMapData}
            selectedSeatId={selectedSeatId}
            onSeatClick={handleSeatClick}
            onStatusChange={handleStatusChange}
            theme={theme}
            isMobile={isMobile}
            occupancyRate={occupancyRate}
            loading={loading || isViewingSeats || isLoadingSeats}
            hasFullSelection={hasFullSelection}
            hasSeats={hasSeats}
          />
        </Box>

        {/* Cột Phải: Chi tiết ghế (Sticky) */}
        {!isMobile && (
          <Box position="sticky" top="90px" h="fit-content">
            <Box bg={theme.bgCard} borderRadius="16px" border={theme.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"} p="20px" boxShadow={theme.shadow}>
              <SeatInfoPanel
                selectedSeat={seatMapData.find(s => s.id === selectedSeatId) || null}
                onReset={(seat) => setResetTarget(seat)}
                onDelete={onDeleteSeat}
                theme={theme}
              />
            </Box>
          </Box>
        )}
      </Grid>

      {/* Modals */}
      <ResetSeatModal seat={resetTarget} onClose={() => setResetTarget(null)} onConfirm={handleResetConfirm} theme={theme} />
      <SeatDetailDrawer
        isOpen={isDrawerOpen} onClose={onDrawerClose}
        seat={seatMapData.find(s => s.id === selectedSeatId) || null}
        onReset={(seat) => { setResetTarget(seat); onDrawerClose(); }}
        onDelete={onDeleteSeat} theme={theme}
      />
    </Box>
  );
}