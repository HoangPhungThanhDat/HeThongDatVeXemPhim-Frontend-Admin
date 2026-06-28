// index.jsx
import React, { useState, useEffect } from "react";
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

export default function QuanLyGhe() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);
  const navigate = useNavigate();
  
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

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
      
      // Chọn rạp đầu tiên mặc định
      if (cinemasData.length > 0) {
        setSelectedCinema(cinemasData[0]);
        loadRoomsByCinema(cinemasData[0].CinemaId);
      }
    } catch (err) {
      console.error("Lỗi load rạp chiếu:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsByCinema = async (cinemaId) => {
    try {
      setLoading(true);
      // Lấy tất cả phòng và lọc theo rạp
      const res = await RoomApi.getAll();
      const roomsData = res.data.data || res.data || [];
      
      // Format rooms data và lọc theo cinemaId
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
      setLoading(false);
    }
  };

  // Use seat management hook when a room is selected
  const seatManagement = useSeatManagement(
    selectedRoom?.id || null,
    selectedRoom || null
  );

  const handleCinemaChange = (cinema) => {
    setSelectedCinema(cinema);
    loadRoomsByCinema(cinema.CinemaId);
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setIsEditMode(false);
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

  // Lọc phòng theo từ khóa tìm kiếm
  const filteredRooms = rooms.filter(room => {
    const matchKeyword = room.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchType = filterType === "all" || 
      (filterType === "maintenance" ? room.status === "maintenance" : room.type === filterType);
    return matchKeyword && matchType;
  });

  // Debug state
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

  if (selectedRoom) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={isDark ? "#0f172a" : "#f8fafc"} minH="100vh" px="6px">
        <SeatMapView
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
          // Truyền modal dưới dạng object với đầy đủ props
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
          // Hàm xử lý - ĐẢM BẢO MỞ MODAL
          handleSeatEdit={(seat) => {
            console.log("📝 handleSeatEdit called in index:", seat);
            // Gọi hàm từ hook để set selectedSeat
            seatManagement.handleSeatEdit(seat);
            // Mở modal - QUAN TRỌNG: phải gọi onOpen
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
    <Box pt={{ base: "100px", md: "80px" }} bg={isDark ? "#0f172a" : "#f8fafc"} minH="100vh" px="6px">
      {/* Page header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)"
            >
              <Icon as={MdChair} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color={colors.textColor}
                letterSpacing="-0.5px">
                Ghế ngồi
              </Text>
              <Text fontSize="12px" color={colors.subColor}>
                Xem và quản lý cấu hình ghế các phòng chiếu
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap="10px" flexWrap="wrap">
          <InputGroup maxW="200px" size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color={colors.subColor} boxSize="14px" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              bg={isDark ? "#2d3748" : "#f8fafc"}
              border={`1px solid ${colors.borderCard}`}
              borderRadius="10px"
              color={colors.textColor}
              _focus={{ border: "1.5px solid #f97316" }}
            />
          </InputGroup>
          
          <Button
            leftIcon={<Icon as={MdRefresh} />}
            size="sm"
            borderRadius="10px"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            border={`1px solid ${colors.borderCard}`}
            color={colors.textColor}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
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
          
          <Button
            leftIcon={<Icon as={MdAdd} />}
            size="sm"
            borderRadius="10px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            _hover={{ boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}
            onClick={() => navigate("/seats/create")}
          >
            Tạo phòng mới
          </Button>
          
          <Box px="8px" py="4px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="11px" fontWeight="700" color="#f97316">
              {rooms.length} phòng
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Cinema selector */}
      <Box bg={colors.bgCard} borderRadius="16px" border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="16px 18px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#64748b" : "#64748b"} letterSpacing="1px"
          textTransform="uppercase" mb="10px">Chọn rạp chiếu</Text>
        
        {loading && cinemas.length === 0 ? (
          <Flex justify="center" py="20px">
            <Spinner size="md" color="#f97316" thickness="3px" />
          </Flex>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="10px">
            {cinemas.map((cinema) => (
              <Box key={cinema.CinemaId}
                p="12px 14px" borderRadius="12px" cursor="pointer"
                border={selectedCinema?.CinemaId === cinema.CinemaId ? "2px solid #f97316" : `1.5px solid ${colors.borderCard}`}
                bg={selectedCinema?.CinemaId === cinema.CinemaId ? (isDark ? "#2d3748" : "#fff7ed") : (isDark ? "#1e293b" : "#fafbfc")}
                boxShadow={selectedCinema?.CinemaId === cinema.CinemaId ? "0 2px 12px rgba(249,115,22,0.18)" : "none"}
                _hover={{ border: "1.5px solid #f97316", bg: isDark ? "#2d3748" : "#fff7ed" }}
                transition="all 0.2s"
                onClick={() => handleCinemaChange(cinema)}
              >
                <Flex align="center" gap="10px">
                  <Box w="32px" h="32px" borderRadius="9px" flexShrink="0"
                    bg={selectedCinema?.CinemaId === cinema.CinemaId ? "linear-gradient(135deg, #f97316, #fb923c)" : (isDark ? "#2d3748" : "#f1f5f9")}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={MdTheaters} boxSize="14px"
                      color={selectedCinema?.CinemaId === cinema.CinemaId ? "white" : (isDark ? "#64748b" : "#94a3b8")} />
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="12.5px" fontWeight="800" color={colors.textColor} noOfLines={1}>
                      {cinema.Name}
                    </Text>
                    <Text fontSize="10.5px" color={isDark ? "#64748b" : "#94a3b8"} noOfLines={1}>
                      {cinema.Address || "Đang cập nhật địa chỉ"}
                    </Text>
                  </Box>
                  {selectedCinema?.CinemaId === cinema.CinemaId && (
                    <Box w="8px" h="8px" borderRadius="full" bg="#f97316" flexShrink="0"
                      sx={{ animation: `${pulse} 1.8s ease infinite` }} />
                  )}
                </Flex>
              </Box>
            ))}
          </Grid>
        )}
        
        {cinemas.length === 0 && !loading && (
          <Flex direction="column" align="center" py="20px" color={isDark ? "#64748b" : "#94a3b8"}>
            <Icon as={MdTheaters} boxSize="24px" mb="8px" />
            <Text fontSize="13px">Chưa có rạp chiếu nào</Text>
            <Button
              mt="8px"
              size="sm"
              borderRadius="10px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
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
          icon={MdMeetingRoom} accent="#f97316" delay={0} />
        <StatCard label="Hoạt động" value={activeRooms}
          icon={FaFilm} accent="#10b981" delay={0.05} />
        <StatCard label="Tổng ghế" value={totalSeats}
          icon={MdChair} accent="#7c3aed" delay={0.1} />
        <StatCard label="Tỉ lệ lấp đầy" value="0%"
          icon={FaCouch} accent="#dc2626" delay={0.15}
          sub="Chưa có dữ liệu" />
      </SimpleGrid>

      {/* Rooms grid */}
      <Box bg={colors.bgCard} borderRadius="16px" border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Flex align="center" justify="space-between" p="16px 18px 12px"
          borderBottom={`1px solid ${isDark ? "#2d3748" : "#f8fafc"}`} flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full"
              bg="linear-gradient(180deg, #f97316, #fbbf24)" />
            <Text fontWeight="800" fontSize="14px" color={colors.textColor}>Danh sách phòng chiếu</Text>
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="10.5px" fontWeight="700" color="#f97316">
                {filteredRooms.length} phòng
              </Text>
            </Box>
          </Flex>
          <Select h="34px" fontSize="12.5px" fontWeight="600" color={colors.textColor}
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${colors.borderInput}`} borderRadius="9px" w="150px"
            _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
            _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
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
          {loading ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? "#475569" : "#cbd5e1"}>
              <Spinner size="xl" color="#f97316" thickness="4px" />
              <Text fontSize="13px" fontWeight="600" mt="12px" color={isDark ? "#64748b" : "#94a3b8"}>
                Đang tải danh sách phòng...
              </Text>
            </Flex>
          ) : filteredRooms.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color={isDark ? "#475569" : "#cbd5e1"}>
              <Icon as={MdMeetingRoom} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>
                {searchKeyword ? "Không tìm thấy phòng phù hợp" : "Không có phòng nào trong rạp này"}
              </Text>
              {!searchKeyword && (
                <Button
                  mt="12px"
                  size="sm"
                  borderRadius="10px"
                  bg="linear-gradient(135deg, #f97316, #fb923c)"
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
                />
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}