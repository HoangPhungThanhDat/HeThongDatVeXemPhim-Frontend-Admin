// src/views/admin/quanlyrapchieu/index.jsx

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid, Grid,
  Input, Select, useColorMode, useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdFilterList, MdDarkMode, MdLightMode,
  MdClose, MdTheaters, MdCheckCircle, MdBuild, MdMeetingRoom,
  MdInfo, MdLocalMovies,
} from "react-icons/md";
import { FaUsers, FaUserShield, FaUserTie, FaUserCog } from "react-icons/fa";

import { useCinema } from "./hooks/useCinema";
import { DARK, STATUS_OPTIONS } from "./constants";
import { fadeUp, fadeIn } from "./components/shared/animations";
import StatCard from "./components/shared/StatCard";
import CinemaCard from "./components/CinemaCard";
import CinemaDetail from "./components/CinemaDetail";
import CinemaForm from "./components/CinemaForm";
import AddCinemaPage from "./components/AddCinemaPage";
import AddRoomModal from "./components/AddRoomModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import Loader from "../../../layouts/Loader";

export default function QuanLyRap() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    cinemas,
    setCinemas,
    rooms,
    loading,
    isSubmitting, // ✅ Lấy isSubmitting từ hook
    // setIsSubmitting, // ✅ KHÔNG lấy setIsSubmitting
    handleAddCinema,
    handleUpdateCinema,
    handleDeleteCinema,
    handleToggleStatus,
    handleAddRoom,
    handleToggleRoomStatus,
    handleDeleteRoom,
    getCinemaStats,
  } = useCinema();

  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addRoomModal = useDisclosure();
  const deleteDialog = useDisclosure();

  const bg = useColorModeValue("#f8fafc", "#0f172a");
  const border = useColorModeValue("#f1f5f9", "#334155");
  const textColor = useColorModeValue("#0f172a", "#f1f5f9");
  const subColor = useColorModeValue("#64748b", "#94a3b8");

  const stats = getCinemaStats();

  const filtered = cinemas.filter((c) => {
    const matchS = c.Name?.toLowerCase().includes(search.toLowerCase()) ||
                   c.Address?.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === "Tất cả" || c.Status === filterStatus;
    return matchS && matchF;
  });

  const handleView = (cinema) => {
    setSelected(cinema);
    setView("detail");
  };

  const handleEdit = (cinema) => {
    setSelected(cinema);
    setView("edit");
  };

  const handleDelete = (cinema) => {
    setDeleteTarget(cinema);
    deleteDialog.onOpen();
  };

  const onDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const success = await handleDeleteCinema(deleteTarget.CinemaId);
    if (success) {
      deleteDialog.onClose();
      setDeleteTarget(null);
      if (selected?.CinemaId === deleteTarget.CinemaId) {
        setView("list");
        setSelected(null);
      }
    }
  };

  // ✅ Sửa onSaveCinema - KHÔNG gọi setIsSubmitting
  const onSaveCinema = async (formData) => {
    let success;
    if (view === "add") {
      success = await handleAddCinema(formData);
    } else if (selected) {
      success = await handleUpdateCinema(selected.CinemaId, formData);
    }
    if (success) {
      if (view === "add") {
        setView("list");
        setSelected(null);
      } else if (selected) {
        setView("detail");
        setSelected({ ...selected, ...formData });
      }
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("Tất cả");
  };

  const hasFilter = search || filterStatus !== "Tất cả";

  // ── LOADING ──
  if (loading && cinemas.length === 0) {
    return <Loader />;
  }

  // ── ADD VIEW ──
  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px="6px">
        <AddCinemaPage
          onCancel={() => { setView("list"); setSelected(null); }}
          onSave={onSaveCinema}
          isSubmitting={isSubmitting}
          isDark={isDark}
        />
      </Box>
    );
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selected) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px="6px">
        <CinemaDetail
          cinema={cinemas.find((c) => c.CinemaId === selected.CinemaId) || selected}
          onBack={() => { setView("list"); setSelected(null); }}
          onEdit={() => setView("edit")}
          rooms={rooms[selected.CinemaId] || []}
          onToggleMaintenance={(roomId) => handleToggleRoomStatus(selected.CinemaId, roomId)}
          onDeleteRoom={(roomId) => handleDeleteRoom(selected.CinemaId, roomId)}
          onAddRoom={addRoomModal.onOpen}
          onToggleStatus={handleToggleStatus}
          isDark={isDark}
        />
        <AddRoomModal
          isOpen={addRoomModal.isOpen}
          onClose={addRoomModal.onClose}
          onAdd={handleAddRoom}
          cinemaId={selected.CinemaId}
        />
      </Box>
    );
  }

  // ── EDIT VIEW ──
  if (view === "edit" && selected) {
    return (
      <Box pt={{ base: "100px", md: "80px" }} bg={bg} minH="100vh" px="6px">
        <CinemaForm
          cinema={cinemas.find((c) => c.CinemaId === selected.CinemaId) || selected}
          onCancel={() => setView("detail")}
          onSave={onSaveCinema}
          isSubmitting={isSubmitting}
          isDark={isDark}
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
        cinemaName={deleteTarget?.Name || ""}
      />

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={addRoomModal.isOpen}
        onClose={addRoomModal.onClose}
        onAdd={handleAddRoom}
        cinemaId={selected?.CinemaId}
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
              <Icon as={MdTheaters} boxSize="18px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color={textColor} letterSpacing="-0.5px">
              Quản lý rạp chiếu
            </Text>
          </Flex>
          <Text color={subColor} fontSize="13px" pl="50px">
            Xem và cập nhật thông tin các rạp chiếu phim
          </Text>
        </Box>
        <Flex align="center" gap="10px">
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
            bg="#fff7ed" border="1px solid #fed7aa"
            sx={{ animation: `${fadeIn} 0.4s ease 0.1s both}` }}>
            <Icon as={MdInfo} boxSize="14px" color="#f97316" />
            <Text fontSize="12px" fontWeight="600" color="#b45309">
              Thêm/xóa rạp thuộc quyền Admin
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
            onClick={() => { setView("add"); setSelected(null); }}
          >
            Thêm rạp
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng rạp" value={stats.total} icon={MdTheaters} accent="#f97316" delay={0} />
        <StatCard label="Đang hoạt động" value={stats.active} icon={MdCheckCircle} accent="#059669" delay={0.05} />
        <StatCard label="Đã khóa" value={stats.inactive} icon={MdBuild} accent="#dc2626" delay={0.1} />
        <StatCard label="Tổng phòng" value={stats.totalRooms} icon={MdMeetingRoom} accent="#0284c7" delay={0.15} />
      </SimpleGrid>

      {/* Filter bar */}
      <Box bg={isDark ? "#1e293b" : "white"} borderRadius="14px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="14px 18px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both}` }}>
        <Flex gap="10px" direction={{ base: "column", sm: "row" }} align="center">
          <Box position="relative" flex="1">
            <Icon as={MdSearch} position="absolute" left="10px" top="50%"
              transform="translateY(-50%)" boxSize="14px" color={isDark ? "#64748b" : "#94a3b8"} zIndex="1" />
            <Input pl="30px" h="38px" fontSize="12.5px" fontWeight="500"
              placeholder="Tìm theo tên rạp, địa chỉ..."
              bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`} borderRadius="9px" color={textColor}
              _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
              _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: isDark ? "#1e293b" : "#fff" }}
              _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>
          <Select h="38px" fontSize="12.5px" fontWeight="600" color={textColor}
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#e8edf3"}`} borderRadius="9px"
            w={{ base: "100%", sm: "160px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Đã khóa</option>
          </Select>
          <Flex align="center" gap="6px" px="12px" py="6px" borderRadius="8px"
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} flexShrink="0">
            <Icon as={MdLocalMovies} boxSize="12px" color={isDark ? "#64748b" : "#94a3b8"} />
            <Text fontSize="12px" fontWeight="700" color={isDark ? "#94a3b8" : "#64748b"}>{filtered.length} rạp</Text>
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

      {/* Cinema cards grid */}
      {filtered.length === 0 ? (
        <Flex direction="column" align="center" py="60px" color={isDark ? "#475569" : "#cbd5e1"}>
          <Icon as={MdTheaters} boxSize="36px" mb="10px" />
          <Text fontSize="14px" fontWeight="600" color={isDark ? "#64748b" : "#94a3b8"}>Không tìm thấy rạp nào</Text>
          <Button mt="12px" size="sm" variant="ghost" color="#f97316" fontWeight="700" onClick={resetFilters}>
            Xóa bộ lọc
          </Button>
        </Flex>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap="16px">
          {filtered.map((c, i) => (
            <CinemaCard key={c.CinemaId} cinema={c} index={i}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete} />
          ))}
        </Grid>
      )}
    </Box>
  );
}