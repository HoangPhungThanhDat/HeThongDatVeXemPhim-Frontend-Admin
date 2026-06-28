
import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid, Grid,
  Input, Select, useColorMode, useDisclosure,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdTheaters, MdCheckCircle, MdBuild,
  MdMeetingRoom, MdInfo, MdLocalMovies, MdGridView, MdViewList,
  MdClose, MdDarkMode, MdLightMode,
} from "react-icons/md";
import { FaChair, FaTicketAlt } from "react-icons/fa";

import { useRoom } from "./hooks/useRoom";
import { DARK, STATUS_OPTIONS, ROOM_TYPES } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import StatCard from "./components/shared/StatCard";
import SeatApi from "../../../api/SeatApi";
// ✅ Import default từ các file component
import RoomCard from "./components/RoomCard";
import RoomListRow from "./components/RoomListRow";
import RoomDetail from "./components/RoomDetail";
import AddRoomModal from "./components/AddRoomModal";
import EditRoomModal from "./components/EditRoomModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import Loader from "../../../layouts/Loader";

export default function QuanLyPhongChieu() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    rooms,
    cinemas,
    loading,
    isSubmitting,
    selectedCinemaId,
    setSelectedCinemaId,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleToggleRoomStatus,
    getCinemaRooms,
    getStats,
  } = useRoom();

  const [view, setView] = useState("list");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType] = useState("Tất cả");
  const [displayMode, setDisplayMode] = useState("grid");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addRoomModal = useDisclosure();
  const editRoomModal = useDisclosure();
  const deleteDialog = useDisclosure();

  const bg = isDark ? "#0f172a" : "#f8fafc";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";

  const currentCinema = cinemas.find((c) => c.CinemaId === selectedCinemaId);
  const allRooms = getCinemaRooms(selectedCinemaId);
  const stats = getStats(selectedCinemaId);

  const filtered = allRooms.filter((r) => {
    const matchS = r.Name?.toLowerCase().includes(search.toLowerCase()) ||
                   r.RoomType?.toLowerCase().includes(search.toLowerCase());
    const matchSt = filterStatus === "Tất cả" || r.Status === filterStatus;
    const matchT = filterType === "Tất cả" || r.RoomType === filterType;
    return matchS && matchSt && matchT;
  });

  const handleView = (room) => {
    setSelectedRoom(room);
    setView("detail");
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    editRoomModal.onOpen();
  };

  const handleDelete = (room) => {
    setDeleteTarget(room);
    deleteDialog.onOpen();
  };

  const onDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const success = await handleDeleteRoom(deleteTarget.RoomId);
    if (success) {
      deleteDialog.onClose();
      setDeleteTarget(null);
      if (selectedRoom?.RoomId === deleteTarget.RoomId) {
        setView("list");
        setSelectedRoom(null);
      }
    }
  };

  const onAddRoom = async (roomData) => {
    const success = await handleAddRoom(roomData);
    if (success) addRoomModal.onClose();
  };

  const onEditRoom = async (roomData) => {
    const success = await handleUpdateRoom(selectedRoom.RoomId, roomData);
    if (success) {
      editRoomModal.onClose();
      if (view === "detail") {
        setSelectedRoom(roomData);
      }
    }
  };

  const onToggleRoom = (roomId) => {
    const room = allRooms.find((r) => r.RoomId === roomId);
    if (room) handleToggleRoomStatus(roomId, room.Status);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("Tất cả");
    setFilterType("Tất cả");
  };

  const hasFilter = search || filterStatus !== "Tất cả" || filterType !== "Tất cả";

  // ── LOADING ──
  if (loading && Object.keys(rooms).length === 0) {
    return <Loader />;
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedRoom) {
    const liveRoom = allRooms.find((r) => r.RoomId === selectedRoom.RoomId) || selectedRoom;
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px="6px">
        <RoomDetail
          room={liveRoom}
          cinemaName={currentCinema?.Name || ""}
          onBack={() => setView("list")}
          onToggle={onToggleRoom}
          onEdit={handleEdit}
          isDark={isDark}
        />
        <EditRoomModal
          isOpen={editRoomModal.isOpen}
          onClose={editRoomModal.onClose}
          onSave={onEditRoom}
          room={selectedRoom}
        />
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onConfirm={onDeleteConfirm}
          roomName={deleteTarget?.Name || ""}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px="6px">
      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={onDeleteConfirm}
        roomName={deleteTarget?.Name || ""}
      />

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={addRoomModal.isOpen}
        onClose={addRoomModal.onClose}
        onAdd={onAddRoom}
        cinemas={cinemas} 
      />

      {/* Edit Room Modal */}
      <EditRoomModal
        isOpen={editRoomModal.isOpen}
        onClose={editRoomModal.onClose}
        onSave={onEditRoom}
        room={selectedRoom}
      />

      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)">
              <Icon as={MdMeetingRoom} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="900" color={textColor}
                letterSpacing="-0.5px" lineHeight="1">Quản lý phòng chiếu</Text>
              <Text color={subColor} fontSize="12.5px" mt="2px">
                Xem và cập nhật trạng thái phòng chiếu các rạp
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex align="center" gap="10px" flexWrap="wrap">
          <Button
            h="40px"
            w="40px"
            p="0"
            borderRadius="10px"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#94a3b8" : "#475569"}
            border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`}
            onClick={toggleColorMode}
            flexShrink="0"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />
          </Button>
          <Flex align="center" gap="7px" px="14px" py="8px" borderRadius="10px"
            bg={isDark ? "#2d3748" : "#fff7ed"} border={`1px solid ${isDark ? "#374151" : "#fed7aa"}`}
            sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}>
            <Icon as={MdInfo} boxSize="14px" color="#f97316" />
            <Text fontSize="12px" fontWeight="600" color={isDark ? "#f1f5f9" : "#b45309"}>
              Thêm/xóa phòng · sửa layout thuộc quyền Admin
            </Text>
          </Flex>
          <Button
            h="40px"
            px="18px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)"
            color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} />}
            onClick={addRoomModal.onOpen}
          >
            Thêm phòng
          </Button>
        </Flex>
      </Flex>

      {/* Cinema selector tabs */}
      <Box bg={isDark ? "#1e293b" : "white"} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="12px 14px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}>
        <Text fontSize="10px" fontWeight="800" color={subColor}
          textTransform="uppercase" letterSpacing="1px" mb="10px">Chọn rạp chiếu</Text>
        <Flex gap="8px" flexWrap="wrap">
          {cinemas.map((c) => {
            const isActive = c.CinemaId === selectedCinemaId;
            const roomsList = getCinemaRooms(c.CinemaId);
            const maintenanceCount = roomsList.filter((r) => r.Status === "Maintenance").length;
            return (
              <Button key={c.CinemaId}
                h="auto" py="8px" px="14px" borderRadius="10px"
                bg={isActive ? "linear-gradient(135deg,#f97316,#fb923c)" : (isDark ? "#2d3748" : "#f8fafc")}
                color={isActive ? "white" : (isDark ? "#94a3b8" : "#475569")}
                border={isActive ? "none" : `1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
                boxShadow={isActive ? "0 3px 12px rgba(249,115,22,0.35)" : "none"}
                fontWeight="700" fontSize="13px"
                _hover={isActive ? {} : { bg: isDark ? "#374151" : "#f1f5f9", color: isDark ? "#f1f5f9" : "#0f172a" }}
                transition="all 0.2s"
                onClick={() => { setSelectedCinemaId(c.CinemaId); setSearch(""); setFilterStatus("Tất cả"); setFilterType("Tất cả"); }}>
                <Flex direction="column" align="flex-start" gap="1px">
                  <Text fontSize="13px" fontWeight="700">{c.Name}</Text>
                  <Flex align="center" gap="6px">
                    <Text fontSize="10px" fontWeight="600" opacity={isActive ? 0.85 : 0.65}>
                      {roomsList.length} phòng
                    </Text>
                    {maintenanceCount > 0 && (
                      <Box px="5px" py="1px" borderRadius="4px"
                        bg={isActive ? "rgba(255,255,255,0.25)" : (isDark ? "#2d3748" : "#fef3c7")}
                        border={isActive ? "none" : `1px solid ${isDark ? "#374151" : "#fde68a"}`}>
                        <Text fontSize="9px" fontWeight="800"
                          color={isActive ? "white" : (isDark ? "#f59e0b" : "#d97706")}>{maintenanceCount} bảo trì</Text>
                      </Box>
                    )}
                  </Flex>
                </Flex>
              </Button>
            );
          })}
        </Flex>
        <Text fontSize="11px" color={subColor} mt="10px" pl="2px">{currentCinema?.Address || ""}</Text>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing="10px" mb="16px">
        <StatCard label="Tổng phòng" value={stats.total} icon={MdMeetingRoom} accent="#f97316" delay={0} />
        <StatCard label="Hoạt động" value={stats.active} icon={MdCheckCircle} accent="#059669" delay={0.05} />
        <StatCard label="Bảo trì" value={stats.maintenance} icon={MdBuild} accent="#f59e0b" delay={0.1} />
        <StatCard label="Tổng ghế" value={stats.totalSeats.toLocaleString()} icon={FaChair} accent="#0284c7" delay={0.15} />
        <StatCard label="Ghế đang đặt"
          value={stats.totalBooked.toLocaleString()}
          sub={`${stats.totalSeats > 0 ? Math.round((stats.totalBooked / stats.totalSeats) * 100) : 0}% lấp đầy`}
          icon={FaTicketAlt} accent="#7c3aed" delay={0.2} />
      </SimpleGrid>

      {/* Filter bar */}
      <Box bg={isDark ? "#1e293b" : "white"} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="14px 18px" mb="14px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}>
        <Flex gap="10px" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
          <Box position="relative" flex="1">
            <Icon as={MdSearch} position="absolute" left="10px" top="50%"
              transform="translateY(-50%)" boxSize="14px" color={isDark ? "#64748b" : "#94a3b8"} zIndex="1" />
            <Input pl="30px" h="38px" fontSize="12.5px" fontWeight="500"
              placeholder="Tìm phòng chiếu, loại phòng..."
              bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`} borderRadius="9px" color={textColor}
              _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
              _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: isDark ? "#1e293b" : "#fff" }}
              _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>
          <Select h="38px" fontSize="12.5px" fontWeight="600" color={textColor}
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`} borderRadius="9px"
            w={{ base: "100%", sm: "150px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
            <option value="Maintenance">Bảo trì</option>
          </Select>
          <Select h="38px" fontSize="12.5px" fontWeight="600" color={textColor}
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`} borderRadius="9px"
            w={{ base: "100%", sm: "140px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="Tất cả">Tất cả loại</option>
            {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Flex gap="4px" bg={isDark ? "#2d3748" : "#f8fafc"} borderRadius="9px" border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`} p="3px" flexShrink="0">
            {[
              { mode: "grid", icon: MdGridView },
              { mode: "list", icon: MdViewList },
            ].map(({ mode, icon: Ic }) => (
              <Button key={mode} size="xs" w="32px" h="32px" p="0" borderRadius="7px"
                bg={displayMode === mode ? (isDark ? "#1e293b" : "white") : "transparent"}
                color={displayMode === mode ? "#f97316" : (isDark ? "#64748b" : "#94a3b8")}
                boxShadow={displayMode === mode ? (isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.1)") : "none"}
                _hover={{ bg: displayMode === mode ? (isDark ? "#1e293b" : "white") : (isDark ? "#374151" : "#f1f5f9") }}
                transition="all 0.15s"
                onClick={() => setDisplayMode(mode)}>
                <Icon as={Ic} boxSize="14px" />
              </Button>
            ))}
          </Flex>
          <Flex align="center" gap="6px" px="12px" py="6px" borderRadius="8px"
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} flexShrink="0">
            <Icon as={MdMeetingRoom} boxSize="12px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="12px" fontWeight="700" color={subColor}>{filtered.length} phòng</Text>
          </Flex>
          {hasFilter && (
            <Button size="xs" h="30px" px="8px" borderRadius="6px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              fontSize="10px" fontWeight="700"
              leftIcon={<Icon as={MdClose} boxSize="10px" />}
              onClick={resetFilters}>
              Xóa lọc
            </Button>
          )}
        </Flex>
      </Box>

      {/* Rooms */}
      {filtered.length === 0 ? (
        <Flex direction="column" align="center" justify="center" py="60px" color={isDark ? "#475569" : "#cbd5e1"}>
          <Icon as={MdMeetingRoom} boxSize="36px" mb="10px" />
          <Text fontSize="14px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>Không tìm thấy phòng chiếu nào</Text>
        </Flex>
      ) : displayMode === "grid" ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap="14px">
          {filtered.map((r, i) => (
            <RoomCard key={r.RoomId} room={r} index={i}
              onView={handleView}
              onToggle={onToggleRoom}
              onEdit={handleEdit}
              onDelete={handleDelete} />
          ))}
        </Grid>
      ) : (
        <>
          <Flex px="18px" py="10px" bg={isDark ? "#1e293b" : "white"} borderRadius="12px"
            border={`1px solid ${border}`} mb="8px" display={{ base: "none", md: "flex" }}>
            <Box w="28px" flexShrink="0" />
            <Box flex="1.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Phòng / Loại</Text>
            </Box>
            <Box flex="0.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Trạng thái</Text>
            </Box>
            <Box flex="0.7" pr="14px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Ghế</Text>
            </Box>
            <Box flex="1.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Đang chiếu</Text>
            </Box>
            <Box flex="1.2" pr="14px">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Lấp đầy</Text>
            </Box>
            <Box w="180px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} textTransform="uppercase" letterSpacing="1px">Hành động</Text>
            </Box>
          </Flex>
          <Flex direction="column" gap="8px">
            {filtered.map((r, i) => (
              <RoomListRow key={r.RoomId} room={r} index={i}
                onView={handleView}
                onToggle={onToggleRoom}
                onEdit={handleEdit}
                onDelete={handleDelete} />
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
}