// index.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Flex, Text, Grid, SimpleGrid, Button, Select,
  Icon, useColorMode, useDisclosure, Spinner,
  Input, InputGroup, InputLeftElement
} from "@chakra-ui/react";
import {
  MdChair, MdMeetingRoom, MdTheaters, MdInfo, MdLayers,
  MdAdd, MdRefresh, MdRestore, MdSearch
} from "react-icons/md";
import { FaCouch, FaFilm } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import StatCard, { getSeatColors } from "./components/shared/StatCard";
import { fadeUp, fadeIn, pulse } from "./components/shared/animations";
import RoomCard from "./components/RoomCard";
import SeatMapView from "./components/SeatMapView";
import { ROW_LABELS } from "./constants";
import { useSeatManagement } from "./hooks/useSeatManagement";
import RoomApi from "../../../api/RoomApi";
import CinemasApi from "../../../api/CinemasApi";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
  gradientFrom: "#4a9eff",
  gradientTo: "#6ab0ff",
};

export default function QuanLyGhe() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const navigate = useNavigate();
  
  // Dark mode colors
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const accentShadow = isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.38)";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316, #fb923c)";
  const gradientSmall = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316, #fb923c)";
  
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Modal controls
  const editSeatModal = useDisclosure();
  const addRowModal = useDisclosure();
  const addColModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [deleteDialogConfig, setDeleteDialogConfig] = useState({
    onConfirm: () => {},
    title: "",
    message: ""
  });

  // Load cinemas from API
  useEffect(() => {
    loadCinemas();
  }, []);

  const loadCinemas = async () => {
    try {
      setLoading(true);
      const res = await CinemasApi.getAll();
      const cinemasData = res.data.data || res.data || [];
      setCinemas(cinemasData);
      
      if (cinemasData.length > 0) {
        setSelectedCinema(cinemasData[0]);
        await loadRoomsByCinema(cinemasData[0].CinemaId);
      }
    } catch (err) {
      console.error("Lỗi load rạp chiếu:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsByCinema = async (cinemaId) => {
    try {
      setIsLoadingRooms(true);
      const res = await RoomApi.getAll();
      const roomsData = res.data.data || res.data || [];
      
      const formattedRooms = roomsData
        .filter(room => room.CinemaId === cinemaId)
        .map(room => ({
          id: room.RoomId,
          name: room.Name,
          type: room.RoomType?.toLowerCase() || "standard",
          rows: room.Rows || 8,
          cols: room.Columns || 12,
          status: room.Status?.toLowerCase() === "active" ? "active" : "maintenance",
          capacity: room.Capacity || 0,
          cinemaId: room.CinemaId,
        }));
      setRooms(formattedRooms);
    } catch (err) {
      console.error("Lỗi load phòng:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const seatManagement = useSeatManagement(
    selectedRoom?.id || null,
    selectedRoom || null
  );

  const handleCinemaChange = async (cinema) => {
    setSelectedCinema(cinema);
    await loadRoomsByCinema(cinema.CinemaId);
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setIsEditMode(false);
    setEditingRoom(null);
  };

  const handleEditMode = (room) => {
    setEditingRoom(room);
    setIsEditMode(true);
    setSelectedRoom(room);
  };

  const handleDeleteDialog = (onConfirm, title, message) => {
    setDeleteDialogConfig({ onConfirm, title, message });
    deleteDialog.onOpen();
  };

  const handleBack = () => {
    setSelectedRoom(null);
    setIsEditMode(false);
    setEditingRoom(null);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchKeyword = room.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchType = filterType === "all" || 
        (filterType === "maintenance" ? room.status === "maintenance" : room.type === filterType);
      return matchKeyword && matchType;
    });
  }, [rooms, searchKeyword, filterType]);

  useEffect(() => {
    console.log("📊 editSeatModal state:", {
      isOpen: editSeatModal.isOpen,
      onOpen: editSeatModal.onOpen,
      onClose: editSeatModal.onClose
    });
  }, [editSeatModal.isOpen]);

  useEffect(() => {
    console.log("📊 selectedSeat changed:", seatManagement.selectedSeat);
  }, [seatManagement.selectedSeat]);

  useEffect(() => {
    console.log("📊 seatsData in index:", {
      length: seatManagement.seatsData?.length,
      firstRowLength: seatManagement.seatsData?.[0]?.length,
      totalSeats: seatManagement.seatsData?.flat()?.length,
      loading: seatManagement.loading,
      isInitialized: seatManagement.isInitialized
    });
  }, [seatManagement.seatsData, seatManagement.loading, seatManagement.isInitialized]);

  const seatMapKey = useMemo(() => {
    return `${selectedRoom?.id || ''}-${seatManagement.seatsData?.length || 0}-${seatManagement.isInitialized ? 'ready' : 'loading'}-${Date.now()}`;
  }, [selectedRoom?.id, seatManagement.seatsData?.length, seatManagement.isInitialized]);

  if (selectedRoom) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={isDark ? DARK_THEME.bg : "#f8fafc"} minH="100vh" px="6px">
        <SeatMapView
          key={seatMapKey}
          room={selectedRoom}
          cinemaName={selectedCinema?.Name || ""}
          onBack={handleBack}
          onEditMode={handleEditMode}
          isEditMode={isEditMode}
          seatsData={seatManagement.seatsData}
          scale={seatManagement.scale}
          filter={seatManagement.filter}
          stats={seatManagement.stats}
          selectedSeat={seatManagement.selectedSeat}
          loading={seatManagement.loading}
          editSeatModal={{
            isOpen: editSeatModal.isOpen,
            onOpen: editSeatModal.onOpen,
            onClose: editSeatModal.onClose
          }}
          addRowModal={{
            isOpen: addRowModal.isOpen,
            onOpen: addRowModal.onOpen,
            onClose: addRowModal.onClose
          }}
          addColModal={{
            isOpen: addColModal.isOpen,
            onOpen: addColModal.onOpen,
            onClose: addColModal.onClose
          }}
          deleteDialog={{
            isOpen: deleteDialog.isOpen,
            onClose: deleteDialog.onClose,
            onConfirm: deleteDialogConfig.onConfirm,
            title: deleteDialogConfig.title,
            message: deleteDialogConfig.message
          }}
          handleSeatEdit={(seat) => {
            console.log("📝 handleSeatEdit called in index:", seat);
            seatManagement.handleSeatEdit(seat);
            console.log("📝 Opening edit modal...");
            editSeatModal.onOpen();
          }}
          handleSaveSeat={async (updatedSeat) => {
            console.log("💾 Saving seat:", updatedSeat);
            await seatManagement.handleSaveSeat(updatedSeat);
          }}
          handleAddRows={seatManagement.handleAddRows}
          handleAddCols={seatManagement.handleAddCols}
          handleDeleteSeat={seatManagement.handleDeleteSeat}
          handleResetSeats={seatManagement.handleResetSeats}
          zoomIn={seatManagement.zoomIn}
          zoomOut={seatManagement.zoomOut}
          setFilter={seatManagement.setFilter}
          setDeleteTarget={(target) => {
            console.log("🗑️ Delete target:", target);
            if (target.type === "seat") {
              handleDeleteDialog(
                () => seatManagement.handleDeleteSeat(target),
                "Xóa ghế",
                `Bạn có chắc chắn muốn xóa ghế ${target.id || target.SeatId}?`
              );
            } else if (target.type === "row") {
              handleDeleteDialog(
                () => seatManagement.handleDeleteRow(target.row),
                "Xóa hàng",
                `Bạn có chắc chắn muốn xóa hàng ${ROW_LABELS[target.row]}?`
              );
            } else if (target.type === "col") {
              handleDeleteDialog(
                () => seatManagement.handleDeleteCol(target.col),
                "Xóa cột",
                `Bạn có chắc chắn muốn xóa cột ${(target.col || 0) + 1}?`
              );
            }
          }}
        />
      </Box>
    );
  }

  const totalSeats = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
  const activeRooms = rooms.filter((r) => r.status === "active").length;

  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={isDark ? DARK_THEME.bg : "#f8fafc"} minH="100vh" px="6px">
      {/* Page header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg={gradientBg}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 14px ${accentShadow}`}
            >
              <Icon as={MdChair} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color={isDark ? DARK_THEME.text : "#0f172a"}
                letterSpacing="-0.5px">
                Ghế ngồi
              </Text>
              <Text fontSize="12px" color={isDark ? DARK_THEME.textSecondary : "#64748b"}>
                Xem và quản lý cấu hình ghế các phòng chiếu
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap="10px" flexWrap="wrap">
          <InputGroup maxW="200px" size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color={isDark ? DARK_THEME.labelColor : "#94a3b8"} boxSize="14px" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
              border={`1px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
              borderRadius="10px"
              color={isDark ? DARK_THEME.text : "#0f172a"}
              _focus={{ 
                border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`,
                boxShadow: isDark 
                  ? `0 0 0 3px ${DARK_THEME.accentShadow}`
                  : "0 0 0 3px rgba(249,115,22,0.12)"
              }}
            />
          </InputGroup>
          
          <Button
            leftIcon={<Icon as={MdRefresh} />}
            size="sm"
            borderRadius="10px"
            bg={isDark ? DARK_THEME.inputBg : "#f8fafc"}
            border={`1px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
            color={isDark ? DARK_THEME.text : "#0f172a"}
            _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }}
            onClick={() => {
              loadCinemas();
              if (selectedCinema) {
                loadRoomsByCinema(selectedCinema.CinemaId);
              }
            }}
            isLoading={loading}
          >
            Làm mới
          </Button>
          
          <Box px="8px" py="4px" borderRadius="8px" 
            bg={isDark ? DARK_THEME.inputBg : "#fff7ed"} 
            border={`1px solid ${isDark ? DARK_THEME.border : "#fed7aa"}`}>
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK_THEME.accent : "#f97316"}>
              {rooms.length} phòng
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Cinema selector */}
      <Box bg={isDark ? DARK_THEME.cardBg : "white"} borderRadius="16px" border={`1px solid ${isDark ? DARK_THEME.border : "#f1f5f9"}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"} p="16px 18px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : "#64748b"} letterSpacing="1px"
          textTransform="uppercase" mb="10px">Chọn rạp chiếu</Text>
        
        {loading && cinemas.length === 0 ? (
          <Flex justify="center" py="20px">
            <Spinner size="md" color={isDark ? DARK_THEME.accent : "#f97316"} thickness="3px" />
          </Flex>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="10px">
            {cinemas.map((cinema) => (
              <Box key={cinema.CinemaId}
                p="12px 14px" borderRadius="12px" cursor="pointer"
                border={selectedCinema?.CinemaId === cinema.CinemaId 
                  ? `2px solid ${isDark ? DARK_THEME.accent : "#f97316"}` 
                  : `1.5px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
                bg={selectedCinema?.CinemaId === cinema.CinemaId 
                  ? (isDark ? DARK_THEME.hoverBg : "#fff7ed") 
                  : (isDark ? DARK_THEME.inputBg : "#fafbfc")}
                boxShadow={selectedCinema?.CinemaId === cinema.CinemaId 
                  ? `0 2px 12px ${isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.18)"}` 
                  : "none"}
                _hover={{ 
                  border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
                  bg: isDark ? DARK_THEME.hoverBg : "#fff7ed" 
                }}
                transition="all 0.2s"
                onClick={() => handleCinemaChange(cinema)}
              >
                <Flex align="center" gap="10px">
                  <Box w="32px" h="32px" borderRadius="9px" flexShrink="0"
                    bg={selectedCinema?.CinemaId === cinema.CinemaId 
                      ? gradientBg 
                      : (isDark ? DARK_THEME.inputBg : "#f1f5f9")}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={MdTheaters} boxSize="14px"
                      color={selectedCinema?.CinemaId === cinema.CinemaId 
                        ? "white" 
                        : (isDark ? DARK_THEME.labelColor : "#94a3b8")} />
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="12.5px" fontWeight="800" color={isDark ? DARK_THEME.text : "#0f172a"} noOfLines={1}>
                      {cinema.Name}
                    </Text>
                    <Text fontSize="10.5px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"} noOfLines={1}>
                      {cinema.Address || "Đang cập nhật địa chỉ"}
                    </Text>
                  </Box>
                  {selectedCinema?.CinemaId === cinema.CinemaId && (
                    <Box w="8px" h="8px" borderRadius="full" bg={isDark ? DARK_THEME.accent : "#f97316"} flexShrink="0"
                      sx={{ animation: `${pulse} 1.8s ease infinite` }} />
                  )}
                </Flex>
              </Box>
            ))}
          </Grid>
        )}
        
        {cinemas.length === 0 && !loading && (
          <Flex direction="column" align="center" py="20px" color={isDark ? DARK_THEME.labelColor : "#94a3b8"}>
            <Icon as={MdTheaters} boxSize="24px" mb="8px" />
            <Text fontSize="13px">Chưa có rạp chiếu nào</Text>
            <Button
              mt="8px"
              size="sm"
              borderRadius="10px"
              bg={gradientBg}
              color="white"
              onClick={() => navigate("/cinemas/create")}
            >
              Tạo rạp mới
            </Button>
          </Flex>
        )}
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
        <StatCard label="Tổng phòng" value={rooms.length}
          icon={MdMeetingRoom} accent={isDark ? DARK_THEME.accent : "#f97316"} delay={0} isDark={isDark} />
        <StatCard label="Hoạt động" value={activeRooms}
          icon={FaFilm} accent="#10b981" delay={0.05} isDark={isDark} />
        <StatCard label="Tổng ghế" value={totalSeats}
          icon={MdChair} accent="#7c3aed" delay={0.1} isDark={isDark} />
        <StatCard label="Tỉ lệ lấp đầy" value="0%"
          icon={FaCouch} accent="#dc2626" delay={0.15} isDark={isDark}
          sub="Chưa có dữ liệu" />
      </SimpleGrid>

      {/* Rooms grid */}
      <Box bg={isDark ? DARK_THEME.cardBg : "white"} borderRadius="16px" border={`1px solid ${isDark ? DARK_THEME.border : "#f1f5f9"}`}
        boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Flex align="center" justify="space-between" p="16px 18px 12px"
          borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`} flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full"
              bg={isDark 
                ? `linear-gradient(180deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
                : "linear-gradient(180deg, #f97316, #fbbf24)"
              } />
            <Text fontWeight="800" fontSize="14px" color={isDark ? DARK_THEME.text : "#0f172a"}>Danh sách phòng chiếu</Text>
            <Box px="8px" py="2px" borderRadius="6px" 
              bg={isDark ? DARK_THEME.inputBg : "#fff7ed"} 
              border={`1px solid ${isDark ? DARK_THEME.border : "#fed7aa"}`}>
              <Text fontSize="10.5px" fontWeight="700" color={isDark ? DARK_THEME.accent : "#f97316"}>
                {filteredRooms.length} phòng
              </Text>
            </Box>
          </Flex>
          <Select h="34px" fontSize="12.5px" fontWeight="600" color={isDark ? DARK_THEME.text : "#0f172a"}
            bg={isDark ? DARK_THEME.inputBg : "#f8fafc"} 
            border={`1px solid ${isDark ? DARK_THEME.border : "#e2e8f0"}`} borderRadius="9px" w="150px"
            _focus={{ 
              border: `1.5px solid ${isDark ? DARK_THEME.accent : "#f97316"}`, 
              boxShadow: isDark 
                ? `0 0 0 3px ${DARK_THEME.accentShadow}`
                : "0 0 0 3px rgba(249,115,22,0.08)" 
            }}
            _hover={{ border: `1px solid ${isDark ? DARK_THEME.accent : "#f97316"}` }} 
            transition="all 0.2s"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
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
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK_THEME.border : "#cbd5e1"}>
              <Spinner size="xl" color={isDark ? DARK_THEME.accent : "#f97316"} thickness="4px" />
              <Text fontSize="13px" fontWeight="600" mt="12px" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>
                Đang tải danh sách phòng...
              </Text>
            </Flex>
          ) : filteredRooms.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? DARK_THEME.border : "#cbd5e1"}>
              <Icon as={MdMeetingRoom} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? DARK_THEME.textSecondary : "#94a3b8"}>
                {searchKeyword ? "Không tìm thấy phòng phù hợp" : "Không có phòng nào trong rạp này"}
              </Text>
              {!searchKeyword && (
                <Button
                  mt="12px"
                  size="sm"
                  borderRadius="10px"
                  bg={gradientBg}
                  color="white"
                  onClick={() => navigate("/seats/create")}
                >
                  Tạo phòng mới
                </Button>
              )}
            </Flex>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap="12px">
              {filteredRooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i}
                  onView={handleViewRoom}
                  onEditMode={handleEditMode}
                  isDark={isDark}
                />
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}