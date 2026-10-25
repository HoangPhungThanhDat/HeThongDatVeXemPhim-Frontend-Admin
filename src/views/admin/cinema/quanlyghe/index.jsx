// src/views/admin/quanlyghe/index.jsx

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Box,
  Flex,
  Text,
  Grid,
  SimpleGrid,
  Button,
  Select,
  Icon,
  useColorMode,
  useDisclosure,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import {
  MdChair,
  MdMeetingRoom,
  MdTheaters,
  MdInfo,
  MdLayers,
  MdAdd,
  MdRefresh,
  MdRestore,
  MdSearch,
} from 'react-icons/md';
import { FaCouch, FaFilm } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import StatCard, { getSeatColors } from './components/shared/StatCard';
import { fadeUp, fadeIn, pulse } from './components/shared/animations';
import RoomCard from './components/RoomCard';
import SeatMapView from './components/SeatMapView';
import { ROW_LABELS } from './constants';
import { useSeatManagement } from './hooks/useSeatManagement';
import RoomSeatApi from 'api/cinema/RoomSeatApi';
// ✅ Import Modal mới
import AddSeatModal from './components/AddSeatModal';

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: '#0a1628',
  cardBg: '#0f1f3a',
  border: '#1a3a5c',
  text: '#e8f4f8',
  textSecondary: '#88b4d8',
  labelColor: '#5a8ab5',
  inputBg: '#0a1f35',
  hoverBg: '#142d4f',
  accent: '#4a9eff',
  accentLight: '#6ab0ff',
  accentShadow: 'rgba(74, 158, 255, 0.25)',
  gradientFrom: '#4a9eff',
  gradientTo: '#6ab0ff',
};

export default function QuanLyGhe() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = getSeatColors(isDark);
  const navigate = useNavigate();
  const toast = useToast();

  const accentColor = isDark ? DARK_THEME.accent : '#f97316';
  const accentShadow = isDark ? DARK_THEME.accentShadow : 'rgba(249,115,22,0.38)';
  const gradientBg = isDark ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})` : 'linear-gradient(135deg, #f97316, #fb923c)';
  const gradientSmall = isDark ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})` : 'linear-gradient(135deg, #f97316, #fb923c)';

  const [selectedCinema, setSelectedCinema] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // Modal controls
  const editSeatModal = useDisclosure();
  const addSeatModal = useDisclosure(); // ✅ Thay 2 modal cũ bằng 1 modal mới
  const deleteDialog = useDisclosure();
  const [deleteDialogConfig, setDeleteDialogConfig] = useState({
    onConfirm: () => {},
    title: '',
    message: '',
  });

  const loadCinemas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RoomSeatApi.getCinemas();
      const cinemasData = res?.data?.data || res?.data || [];
      setCinemas(cinemasData);

      if (cinemasData.length > 0) {
        setSelectedCinema(cinemasData[0]);
        await loadRoomsByCinema(cinemasData[0].id);
      }
    } catch (err) {
      console.error('❌ Lỗi load rạp chiếu:', err);
      toast({
        title: 'Lỗi tải rạp',
        description: 'Không thể tải danh sách rạp chiếu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadRoomsByCinema = useCallback(
    async (cinemaId) => {
      if (!cinemaId) {
        setRooms([]);
        return;
      }

      try {
        setIsLoadingRooms(true);
        const res = await RoomSeatApi.getRooms(cinemaId);
        const roomsData = res?.data?.data || res?.data || [];

        console.log('✅ Danh sách phòng:', roomsData);

        const formattedRooms = roomsData.map((room) => ({
          id: room.id,
          name: room.name,
          type: room.room_type?.toLowerCase() || 'standard',
          rows: 8,
          cols: 12,
          status: room.status?.toLowerCase() === 'active' ? 'active' : 'maintenance',
          capacity: room.seat_count || 0,
          cinemaId: room.cinema_id,
          stats: room.stats || { total: 0, available: 0, booked: 0 },
        }));

        setRooms(formattedRooms);
      } catch (err) {
        console.error('❌ Lỗi load phòng:', err);
        toast({
          title: 'Lỗi tải phòng',
          description: 'Không thể tải danh sách phòng chiếu',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setRooms([]);
      } finally {
        setIsLoadingRooms(false);
      }
    },
    [toast],
  );

  const seatManagement = useSeatManagement(selectedRoom?.id || null, selectedRoom || null);

  useEffect(() => {
    loadCinemas();
  }, [loadCinemas]);

  const handleCinemaChange = useCallback(
    async (cinema) => {
      setSelectedCinema(cinema);
      setSelectedRoom(null);
      setIsEditMode(false);
      setEditingRoom(null);
      await loadRoomsByCinema(cinema.id);
    },
    [loadRoomsByCinema],
  );

  const handleViewRoom = useCallback(
    (room) => {
      setSelectedRoom(room);
      setIsEditMode(false);
      setEditingRoom(null);
      seatManagement.loadSeats(room.id, true);
    },
    [seatManagement],
  );

  const handleEditMode = useCallback(
    (room) => {
      setEditingRoom(room);
      setIsEditMode(true);
      setSelectedRoom(room);
      seatManagement.loadSeats(room.id, true);
    },
    [seatManagement],
  );

  const handleBack = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    isRefreshingRef.current = false;

    setSelectedRoom(null);
    setIsEditMode(false);
    setEditingRoom(null);
    if (selectedCinema) {
      loadRoomsByCinema(selectedCinema.id);
    }
  }, [selectedCinema, loadRoomsByCinema]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchKeyword = room.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchType =
        filterType === 'all' ||
        (filterType === 'maintenance' ? room.status === 'maintenance' : room.type === filterType);
      return matchKeyword && matchType;
    });
  }, [rooms, searchKeyword, filterType]);

  const refreshSeats = useCallback(() => {
    if (isRefreshingRef.current || refreshTimeoutRef.current) {
      console.log('⏳ Đang refresh, bỏ qua...');
      return;
    }

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    console.log('🔄 Refresh seats cho phòng:', selectedRoom?.id);

    seatManagement.loadSeats(selectedRoom?.id, true).finally(() => {
      refreshTimeoutRef.current = setTimeout(() => {
        isRefreshingRef.current = false;
        setIsRefreshing(false);
        refreshTimeoutRef.current = null;
        console.log('✅ Refresh hoàn tất');
      }, 500);
    });
  }, [selectedRoom, seatManagement]);

  const handleSetDeleteTarget = useCallback(
    (target) => {
      console.log('🗑️ Delete target:', target);

      if (target.type === 'seat') {
        deleteDialog.onOpen();
        setDeleteDialogConfig({
          title: 'Xóa ghế',
          message: `Bạn có chắc chắn muốn xóa ghế ${target.Row || target.row}${target.Number || target.number}?`,
          onConfirm: async () => {
            setIsLoadingSeats(true);
            try {
              const result = await seatManagement.handleDeleteSeat(target.SeatId || target.id);
              if (result) {
                setTimeout(() => { refreshSeats(); }, 500);
              }
              deleteDialog.onClose();
            } catch (error) {
              console.error('❌ Lỗi xóa ghế:', error);
              toast({ title: '❌ Lỗi xóa ghế', description: error.message || 'Vui lòng thử lại', status: 'error', duration: 3000, isClosable: true });
            } finally {
              setIsLoadingSeats(false);
            }
          },
        });
      } else if (target.type === 'row') {
        deleteDialog.onOpen();
        setDeleteDialogConfig({
          title: 'Xóa hàng',
          message: `Bạn có chắc chắn muốn xóa hàng ${ROW_LABELS[target.row]}?`,
          onConfirm: async () => {
            setIsLoadingSeats(true);
            try {
              await seatManagement.handleDeleteRow(ROW_LABELS[target.row]);
              setTimeout(() => { refreshSeats(); }, 500);
              deleteDialog.onClose();
            } catch (error) {
              console.error('❌ Lỗi xóa hàng:', error);
            } finally {
              setIsLoadingSeats(false);
            }
          },
        });
      } else if (target.type === 'col') {
        deleteDialog.onOpen();
        setDeleteDialogConfig({
          title: 'Xóa cột',
          message: `Bạn có chắc chắn muốn xóa cột ${(target.col || 0) + 1}?`,
          onConfirm: async () => {
            setIsLoadingSeats(true);
            try {
              await seatManagement.handleDeleteCol((target.col || 0) + 1);
              setTimeout(() => { refreshSeats(); }, 500);
              deleteDialog.onClose();
            } catch (error) {
              console.error('❌ Lỗi xóa cột:', error);
            } finally {
              setIsLoadingSeats(false);
            }
          },
        });
      }
    },
    [seatManagement, refreshSeats, toast, deleteDialog],
  );

  if (selectedRoom) {
    const showLoading = isLoadingSeats || isRefreshing || seatManagement.loading;

    return (
      <Box pt={{ base: '100px', md: '80px' }} bg={isDark ? DARK_THEME.bg : '#f8fafc'} minH="100vh" px="6px">
        {showLoading && seatManagement.seatsData.length === 0 ? (
          <Flex align="center" justify="center" h="400px">
            <Spinner size="xl" color={accentColor} thickness="4px" />
            <Text ml="16px" fontSize="16px" color={isDark ? DARK_THEME.textSecondary : '#64748b'}>
              Đang tải dữ liệu ghế...
            </Text>
          </Flex>
        ) : (
          <SeatMapView
            key={`seatmap-${selectedRoom.id}`}
            room={selectedRoom}
            cinemaName={selectedCinema?.name || ''}
            onBack={handleBack}
            onEditMode={handleEditMode}
            isEditMode={isEditMode}
            seatsData={seatManagement.seatsData}
            scale={seatManagement.scale}
            filter={seatManagement.filter}
            stats={seatManagement.stats}
            selectedSeat={seatManagement.selectedSeat}
            loading={showLoading}
            editSeatModal={{
              isOpen: editSeatModal.isOpen,
              onOpen: editSeatModal.onOpen,
              onClose: editSeatModal.onClose,
            }}
            addSeatModal={{
              isOpen: addSeatModal.isOpen,
              onOpen: addSeatModal.onOpen,
              onClose: addSeatModal.onClose,
            }}
            deleteDialog={deleteDialog}
            deleteDialogConfig={deleteDialogConfig}
            handleSeatEdit={(seat) => {
              console.log('📝 handleSeatEdit called in index:', seat);
              seatManagement.handleSeatEdit(seat);
              editSeatModal.onOpen();
            }}
            handleSaveSeat={async (updatedSeat) => {
              console.log('💾 Saving seat:', updatedSeat);
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleSaveSeat(updatedSeat);
                setTimeout(() => { refreshSeats(); }, 300);
              } catch (error) {
                console.error('❌ Lỗi save seat:', error);
              } finally {
                setIsLoadingSeats(false);
                editSeatModal.onClose();
              }
            }}
            handleAddSeats={async (rowCount, colCount, position) => {
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleAddSeats(rowCount, colCount, position);
                setTimeout(() => { refreshSeats(); }, 300);
              } finally {
                setIsLoadingSeats(false);
                addSeatModal.onClose();
              }
            }}
            handleDeleteSeat={async (seatId) => {
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleDeleteSeat(seatId);
                setTimeout(() => { refreshSeats(); }, 300);
              } finally {
                setIsLoadingSeats(false);
              }
            }}
            handleResetSeats={async () => {
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleResetSeats();
                setTimeout(() => { refreshSeats(); }, 300);
              } finally {
                setIsLoadingSeats(false);
              }
            }}
            handleDeleteRow={async (row) => {
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleDeleteRow(row);
                setTimeout(() => { refreshSeats(); }, 300);
              } finally {
                setIsLoadingSeats(false);
              }
            }}
            handleDeleteCol={async (col) => {
              setIsLoadingSeats(true);
              try {
                await seatManagement.handleDeleteCol(col);
                setTimeout(() => { refreshSeats(); }, 300);
              } finally {
                setIsLoadingSeats(false);
              }
            }}
            zoomIn={seatManagement.zoomIn}
            zoomOut={seatManagement.zoomOut}
            setFilter={seatManagement.setFilter}
            setDeleteTarget={handleSetDeleteTarget}
          />
        )}
      </Box>
    );
  }

  const totalSeats = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
  const activeRooms = rooms.filter((r) => r.status === 'active').length;

  return (
    <Box pt={{ base: '100px', md: '80px' }} bg={isDark ? DARK_THEME.bg : '#f8fafc'} minH="100vh" px="6px">
      {/* Page header */}
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} mb="20px" gap="12px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px" bg={gradientBg} display="flex" alignItems="center" justifyContent="center" boxShadow={`0 4px 14px ${accentShadow}`}>
              <Icon as={MdChair} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: '22px', md: '26px' }} fontWeight="900" color={isDark ? DARK_THEME.text : '#0f172a'} letterSpacing="-0.5px">
                Ghế ngồi
              </Text>
              <Text fontSize="12px" color={isDark ? DARK_THEME.textSecondary : '#64748b'}>
                Xem và quản lý cấu hình ghế các phòng chiếu
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap="10px" flexWrap="wrap">
          <InputGroup maxW="200px" size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color={isDark ? DARK_THEME.labelColor : '#94a3b8'} boxSize="14px" />
            </InputLeftElement>
            <Input
              placeholder="Tìm phòng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              bg={isDark ? DARK_THEME.inputBg : '#f8fafc'}
              border={`1px solid ${isDark ? DARK_THEME.border : '#e2e8f0'}`}
              borderRadius="10px"
              color={isDark ? DARK_THEME.text : '#0f172a'}
              _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : '#f97316'}`, boxShadow: isDark ? `0 0 0 3px ${DARK_THEME.accentShadow}` : '0 0 0 3px rgba(249,115,22,0.12)' }}
            />
          </InputGroup>

          <Button
            leftIcon={<Icon as={MdRefresh} />}
            size="sm"
            borderRadius="10px"
            bg={isDark ? DARK_THEME.inputBg : '#f8fafc'}
            border={`1px solid ${isDark ? DARK_THEME.border : '#e2e8f0'}`}
            color={isDark ? DARK_THEME.text : '#0f172a'}
            _hover={{ bg: isDark ? DARK_THEME.hoverBg : '#f1f5f9' }}
            onClick={loadCinemas}
            isLoading={loading}
          >
            Làm mới
          </Button>

          <Box px="8px" py="4px" borderRadius="8px" bg={isDark ? DARK_THEME.inputBg : '#fff7ed'} border={`1px solid ${isDark ? DARK_THEME.border : '#fed7aa'}`}>
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK_THEME.accent : '#f97316'}>
              {rooms.length} phòng
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Cinema selector */}
      <Box
        bg={isDark ? DARK_THEME.cardBg : 'white'}
        borderRadius="16px"
        border={`1px solid ${isDark ? DARK_THEME.border : '#f1f5f9'}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : '0 1px 4px rgba(0,0,0,0.04)'}
        p="16px 18px"
        mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : '#64748b'} letterSpacing="1px" textTransform="uppercase" mb="10px">
          Chọn rạp chiếu
        </Text>

        {loading && cinemas.length === 0 ? (
          <Flex justify="center" py="20px">
            <Spinner size="md" color={isDark ? DARK_THEME.accent : '#f97316'} thickness="3px" />
          </Flex>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="10px">
            {cinemas.map((cinema) => (
              <Box
                key={cinema.id}
                p="12px 14px"
                borderRadius="12px"
                cursor="pointer"
                border={selectedCinema?.id === cinema.id ? `2px solid ${isDark ? DARK_THEME.accent : '#f97316'}` : `1.5px solid ${isDark ? DARK_THEME.border : '#e2e8f0'}`}
                bg={selectedCinema?.id === cinema.id ? (isDark ? DARK_THEME.hoverBg : '#fff7ed') : (isDark ? DARK_THEME.inputBg : '#fafbfc')}
                boxShadow={selectedCinema?.id === cinema.id ? `0 2px 12px ${isDark ? DARK_THEME.accentShadow : 'rgba(249,115,22,0.18)'}` : 'none'}
                _hover={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : '#f97316'}`, bg: isDark ? DARK_THEME.hoverBg : '#fff7ed' }}
                transition="all 0.2s"
                onClick={() => handleCinemaChange(cinema)}
              >
                <Flex align="center" gap="10px">
                  <Box w="32px" h="32px" borderRadius="9px" flexShrink="0" bg={selectedCinema?.id === cinema.id ? gradientBg : (isDark ? DARK_THEME.inputBg : '#f1f5f9')} display="flex" alignItems="center" justifyContent="center">
                    <Icon as={MdTheaters} boxSize="14px" color={selectedCinema?.id === cinema.id ? 'white' : (isDark ? DARK_THEME.labelColor : '#94a3b8')} />
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="12.5px" fontWeight="800" color={isDark ? DARK_THEME.text : '#0f172a'} noOfLines={1}>
                      {cinema.name}
                    </Text>
                    <Text fontSize="10.5px" color={isDark ? DARK_THEME.labelColor : '#94a3b8'} noOfLines={1}>
                      {cinema.city || 'Đang cập nhật'}
                    </Text>
                  </Box>
                  {selectedCinema?.id === cinema.id && (
                    <Box w="8px" h="8px" borderRadius="full" bg={isDark ? DARK_THEME.accent : '#f97316'} flexShrink="0" sx={{ animation: `${pulse} 1.8s ease infinite` }} />
                  )}
                </Flex>
              </Box>
            ))}
          </Grid>
        )}

        {cinemas.length === 0 && !loading && (
          <Flex direction="column" align="center" py="20px" color={isDark ? DARK_THEME.labelColor : '#94a3b8'}>
            <Icon as={MdTheaters} boxSize="24px" mb="8px" />
            <Text fontSize="13px">Chưa có rạp chiếu nào</Text>
            <Button mt="8px" size="sm" borderRadius="10px" bg={gradientBg} color="white" onClick={() => navigate('/cinemas/create')}>
              Tạo rạp mới
            </Button>
          </Flex>
        )}
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
        <StatCard label="Tổng phòng" value={rooms.length} icon={MdMeetingRoom} accent={isDark ? DARK_THEME.accent : '#f97316'} delay={0} isDark={isDark} />
        <StatCard label="Hoạt động" value={activeRooms} icon={FaFilm} accent="#10b981" delay={0.05} isDark={isDark} />
        <StatCard label="Tổng ghế" value={totalSeats} icon={MdChair} accent="#7c3aed" delay={0.1} isDark={isDark} />
        <StatCard label="Tỉ lệ lấp đầy" value="0%" icon={FaCouch} accent="#dc2626" delay={0.15} isDark={isDark} sub="Chưa có dữ liệu" />
      </SimpleGrid>

      {/* Rooms grid */}
      <Box
        bg={isDark ? DARK_THEME.cardBg : 'white'}
        borderRadius="16px"
        border={`1px solid ${isDark ? DARK_THEME.border : '#f1f5f9'}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : '0 1px 4px rgba(0,0,0,0.04)'}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Flex align="center" justify="space-between" p="16px 18px 12px" borderBottom={`1px solid ${isDark ? DARK_THEME.border : '#f8fafc'}`} flexWrap="wrap" gap="10px">
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full" bg={isDark ? `linear-gradient(180deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})` : 'linear-gradient(180deg, #f97316, #fbbf24)'} />
            <Text fontWeight="800" fontSize="14px" color={isDark ? DARK_THEME.text : '#0f172a'}>
              Danh sách phòng chiếu
            </Text>
            <Box px="8px" py="2px" borderRadius="6px" bg={isDark ? DARK_THEME.inputBg : '#fff7ed'} border={`1px solid ${isDark ? DARK_THEME.border : '#fed7aa'}`}>
              <Text fontSize="10.5px" fontWeight="700" color={isDark ? DARK_THEME.accent : '#f97316'}>
                {filteredRooms.length} phòng
              </Text>
            </Box>
          </Flex>
          <Select
            h="34px"
            fontSize="12.5px"
            fontWeight="600"
            color={isDark ? DARK_THEME.text : '#0f172a'}
            bg={isDark ? DARK_THEME.inputBg : '#f8fafc'}
            border={`1px solid ${isDark ? DARK_THEME.border : '#e2e8f0'}`}
            borderRadius="9px"
            w="150px"
            _focus={{ border: `1.5px solid ${isDark ? DARK_THEME.accent : '#f97316'}`, boxShadow: isDark ? `0 0 0 3px ${DARK_THEME.accentShadow}` : '0 0 0 3px rgba(249,115,22,0.08)' }}
            _hover={{ border: `1px solid ${isDark ? DARK_THEME.accent : '#f97316'}` }}
            transition="all 0.2s"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="imax">IMAX</option>
            <option value="sweetbox">Sweetbox</option>
            <option value="vip">VIP</option>
            <option value="4dx">4DX</option>
            <option value="maintenance">Bảo trì</option>
          </Select>
        </Flex>

        <Box p="14px">
          {isLoadingRooms ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK_THEME.border : '#cbd5e1'}>
              <Spinner size="xl" color={isDark ? DARK_THEME.accent : '#f97316'} thickness="4px" />
              <Text fontSize="13px" fontWeight="600" mt="12px" color={isDark ? DARK_THEME.textSecondary : '#94a3b8'}>
                Đang tải danh sách phòng...
              </Text>
            </Flex>
          ) : filteredRooms.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK_THEME.border : '#cbd5e1'}>
              <Icon as={MdMeetingRoom} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK_THEME.textSecondary : '#94a3b8'}>
                {searchKeyword ? 'Không tìm thấy phòng phù hợp' : 'Không có phòng nào trong rạp này'}
              </Text>
              {!searchKeyword && (
                <Button mt="12px" size="sm" borderRadius="10px" bg={gradientBg} color="white" onClick={() => navigate('/seats/create')}>
                  Tạo phòng mới
                </Button>
              )}
            </Flex>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }} gap="12px">
              {filteredRooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} onView={handleViewRoom} onEditMode={handleEditMode} isDark={isDark} />
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}