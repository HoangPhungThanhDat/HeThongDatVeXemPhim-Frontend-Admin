// src/views/admin/quanlysuatchieu/index.jsx

import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, Icon, SimpleGrid,
  Input, Select, useColorMode, useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdPlayCircle, MdTimer, MdDone,
  MdKeyboardArrowLeft, MdChevronRight, MdDarkMode, MdLightMode,
  MdContentCopy, MdAttachMoney, MdClose,
} from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";
import { BsCameraReelsFill, BsGridFill, BsListUl } from "react-icons/bs";

import { useShowtime } from "./hooks/useShowtime";
import { slideLeft } from "./components/shared/animations";
import { fadeUp, fadeIn, glow } from "./components/shared/animations";
import { StatCard } from "./components/shared/StatCard";
import { AddModal } from "./components/AddModal";
import { EditModal } from "./components/EditModal";
import { CloneWeekModal } from "./components/CloneWeekModal";
import { BulkEditPriceModal } from "./components/BulkEditPriceModal";
import { ShowtimeCard } from "./components/ShowtimeCard";
import { ShowtimeRow } from "./components/ShowtimeRow";
import { DetailPanel } from "./components/DetailPanel";
import { EmptyState } from "./components/EmptyState";
import Loader from "../../../layouts/Loader";

export default function Quanlysuatchieu() {
  const { toggleColorMode } = useColorMode();
  const isDark = useColorModeValue(false, true);

  // Lấy dữ liệu từ hook
  const {
    showtimes,
    movies,
    rooms,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    searchInput,
    setSearchInput,
    filterStatus,
    setFilterStatus,
    selected,
    setSelected,
    editing,
    setEditing,
    viewMode,
    setViewMode,
    showDetail,
    setShowDetail,
    counts,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
    handleView,
    getMovieTitle,
    getRoomName,
  } = useShowtime();

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  
  // State cho form thêm mới
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    endTime: "",
    price: "",
    status: "Scheduled",
  });

  // Hàm mở modal thêm mới
  const openAdd = () => {
    setNewShowtime({
      movieId: "",
      roomId: "",
      startTime: "",
      endTime: "",
      price: "",
      status: "Scheduled",
    });
    setAddModalOpen(true);
  };

  // Hàm mở modal chỉnh sửa
  const openEdit = (s) => {
    setEditing({
      showtimeId: s.ShowtimeId,
      movieId: s.MovieId,
      roomId: s.RoomId,
      startTime: s.StartTime,
      endTime: s.EndTime,
      price: s.Price,
      status: s.Status,
    });
    setEditModalOpen(true);
  };

  // Hàm xử lý thêm mới
  const onAdd = () => {
    handleAdd(newShowtime, () => setAddModalOpen(false));
  };

  // Hàm xử lý cập nhật
  const onUpdate = () => {
    handleUpdate(editing, () => setEditModalOpen(false));
  };

  // Hàm xử lý xóa
  const onDelete = (id) => {
    handleDelete(id);
  };

  // Hàm xử lý toggle trạng thái
  const onToggle = (id) => {
    handleToggleStatus(id);
  };

  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#111827", "#f7fafc");

  // Loading state
  if (loading && showtimes.length === 0) {
    return <Loader />;
  }

  return (
    <Box
      pt={{ base: "100px", md: "80px" }}
      pb="40px"
      px={{ base: "12px", md: "0" }}
      bg={useColorModeValue("#f8fafc", "#1a202c")}
      minH="100vh"
    >
      {/* ─── Page header ──────────────────────────────────── */}
      <Flex
        justify="space-between"
        align={{ base: "start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb="24px"
        gap="14px"
      >
        <Box sx={{ animation: `${fadeUp} 0.38s ease both` }}>
          <Flex align="center" gap="12px" mb="3px">
            <Box
              w="40px"
              h="40px"
              borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.38)"
              sx={{ animation: `${glow} 3s ease infinite` }}
            >
              <Icon as={BsCameraReelsFill} boxSize="17px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color={textColor} letterSpacing="-0.5px">
                Quản lý suất chiếu
              </Text>
              <Text fontSize="12px" color={useColorModeValue("#9ca3af", "#718096")} fontWeight="500">
                Hệ thống Gấu Phim — Back-office Staff
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }} wrap="wrap">
          <IconButton
            aria-label="Toggle dark mode"
            icon={<Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />}
            onClick={toggleColorMode}
            size="sm"
            borderRadius="10px"
            bg={useColorModeValue("#f9fafb", "#2d3748")}
            border={useColorModeValue("1.5px solid #e5e7eb", "1.5px solid #4a5568")}
            _hover={{ bg: useColorModeValue("#f1f5f9", "#2d3748") }}
            h="38px"
          />

          <Flex
            borderRadius="10px"
            border={useColorModeValue("1.5px solid #e5e7eb", "1.5px solid #4a5568")}
            overflow="hidden"
            bg={useColorModeValue("#f9fafb", "#2d3748")}
          >
            {[
              { v: "list", ic: BsListUl },
              { v: "grid", ic: BsGridFill },
            ].map(({ v, ic }) => (
              <Box
                key={v}
                w="36px"
                h="36px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                bg={viewMode === v ? "linear-gradient(135deg, #f97316, #fb923c)" : "transparent"}
                transition="all 0.15s"
                onClick={() => setViewMode(v)}
              >
                <Icon
                  as={ic}
                  boxSize="14px"
                  color={viewMode === v ? "white" : useColorModeValue("#9ca3af", "#718096")}
                />
              </Box>
            ))}
          </Flex>

          <Button
            leftIcon={<Icon as={MdContentCopy} />}
            h="38px"
            px="14px"
            bg={useColorModeValue("white", "#2d3748")}
            color={useColorModeValue("#374151", "#e2e8f0")}
            borderRadius="10px"
            fontWeight="600"
            fontSize="12px"
            border={useColorModeValue("1.5px solid #e5e7eb", "1.5px solid #4a5568")}
            _hover={{ bg: useColorModeValue("#f8fafc", "#2d3748"), borderColor: "#f97316" }}
            transition="all 0.18s"
            onClick={() => setCloneModalOpen(true)}
          >
            <Box display={{ base: "none", sm: "block" }}>Nhân bản lịch tuần</Box>
            <Box display={{ base: "block", sm: "none" }}>Nhân bản</Box>
          </Button>

          <Button
            leftIcon={<Icon as={MdAttachMoney} />}
            h="38px"
            px="14px"
            bg={useColorModeValue("white", "#2d3748")}
            color={useColorModeValue("#374151", "#e2e8f0")}
            borderRadius="10px"
            fontWeight="600"
            fontSize="12px"
            border={useColorModeValue("1.5px solid #e5e7eb", "1.5px solid #4a5568")}
            _hover={{ bg: useColorModeValue("#f8fafc", "#2d3748"), borderColor: "#f97316" }}
            transition="all 0.18s"
            onClick={() => setBulkPriceModalOpen(true)}
          >
            <Box display={{ base: "none", sm: "block" }}>Chỉnh sửa giá</Box>
            <Box display={{ base: "block", sm: "none" }}>Giá vé</Box>
          </Button>

          <Button
            leftIcon={<Icon as={MdAdd} />}
            h="38px"
            px="18px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{
              boxShadow: "0 6px 22px rgba(249,115,22,0.45)",
              transform: "translateY(-1px)"
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.18s"
            onClick={openAdd}
          >
            <Box display={{ base: "none", sm: "block" }}>Thêm suất chiếu</Box>
            <Box display={{ base: "block", sm: "none" }}>Thêm</Box>
          </Button>
        </Flex>
      </Flex>

      {/* ─── Stats row ────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "10px", md: "14px" }} mb="22px">
        <StatCard label="Tổng suất" value={total} icon={FaTicketAlt} accent="#f97316" sub="tất cả lịch" delay={0} isDark={isDark} />
        <StatCard label="Đã lên lịch" value={counts.scheduled} icon={MdPlayCircle} accent="#10b981" sub="đang hoạt động" delay={0.05} isDark={isDark} />
        <StatCard label="Đã hủy" value={counts.cancelled} icon={MdTimer} accent="#f59e0b" sub="đã hủy" delay={0.10} isDark={isDark} />
        <StatCard label="Đã kết thúc" value={counts.finished} icon={MdDone} accent="#6b7280" sub="hoàn thành" delay={0.15} isDark={isDark} />
      </SimpleGrid>

      {/* ─── Search & Filter ──────────────────────────────────── */}
      <Box mb="16px">
        <Flex gap="10px" wrap="wrap" align="center">
          <Box position="relative" flex="1" minW="200px">
            <Icon
              as={MdSearch}
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              boxSize="16px"
              color="#9ca3af"
            />
            <Input
              pl="36px"
              h="40px"
              fontSize="14px"
              placeholder="Tìm kiếm theo tên phim..."
              bg={useColorModeValue("#f9fafb", "#2d3748")}
              border={useColorModeValue("1px solid #e5e7eb", "1px solid #4a5568")}
              borderRadius="10px"
              color={useColorModeValue("#374151", "#e2e8f0")}
              _focus={{
                border: "1.5px solid #f97316",
                boxShadow: "0 0 0 3px rgba(249,115,22,0.1)",
              }}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </Box>
          <Select
            h="40px"
            w={{ base: "100%", sm: "180px" }}
            fontSize="13px"
            fontWeight="500"
            bg={useColorModeValue("#f9fafb", "#2d3748")}
            border={useColorModeValue("1px solid #e5e7eb", "1px solid #4a5568")}
            borderRadius="10px"
            color={useColorModeValue("#374151", "#e2e8f0")}
            _focus={{
              border: "1.5px solid #f97316",
              boxShadow: "0 0 0 3px rgba(249,115,22,0.1)",
            }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Scheduled">Đã lên lịch</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Finished">Đã kết thúc</option>
          </Select>
          <Text fontSize="13px" color={useColorModeValue("#9ca3af", "#718096")}>
            {total} suất chiếu
          </Text>
        </Flex>
      </Box>

      {/* ─── Main layout ─────────────────────────────────── */}
      <Grid
        templateColumns={{ base: "1fr", xl: showDetail ? "1fr 320px" : "1fr" }}
        gap={{ base: "16px", xl: "20px" }}
      >
        {/* ── Left: list / grid ── */}
        <Box>
          <Box
            bg={bgColor}
            borderRadius="18px"
            border={useColorModeValue("1px solid #f1f5f9", "1px solid #4a5568")}
            boxShadow="0 1px 6px rgba(0,0,0,0.04)"
            sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}
            overflow="hidden"
          >
            {/* content */}
            <Box p={{ base: "10px", md: "12px" }}>
              {showtimes.length === 0 ? (
                <EmptyState isDark={isDark} />
              ) : viewMode === "list" ? (
                <Flex direction="column" gap="6px">
                  {showtimes.map((s, i) => (
                    <ShowtimeRow
                      key={s.ShowtimeId}
                      s={s}
                      index={i}
                      isSelected={selected?.ShowtimeId === s.ShowtimeId}
                      onView={handleView}
                      onEdit={openEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      isDark={isDark}
                      getMovieTitle={getMovieTitle}
                      getRoomName={getRoomName}
                    />
                  ))}
                </Flex>
              ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing="10px">
                  {showtimes.map((s, i) => (
                    <ShowtimeCard
                      key={s.ShowtimeId}
                      s={s}
                      index={i}
                      isSelected={selected?.ShowtimeId === s.ShowtimeId}
                      onView={handleView}
                      onEdit={openEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      isDark={isDark}
                      getMovieTitle={getMovieTitle}
                      getRoomName={getRoomName}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Flex
                align="center"
                justify="space-between"
                px={{ base: "14px", md: "20px" }}
                py="12px"
                borderTop={useColorModeValue("1px solid #f9fafb", "1px solid #2d3748")}
                bg={useColorModeValue("#fafbfc", "#2d3748")}
              >
                <Text fontSize="11.5px" color={useColorModeValue("#9ca3af", "#718096")} fontWeight="500">
                  Hiển thị <Text as="span" fontWeight="700" color={textColor}>{showtimes.length}</Text> / {total} suất chiếu
                </Text>
                <Flex gap="6px" align="center">
                  <Text fontSize="11px" color={useColorModeValue("#d1d5db", "#4a5568")}>
                    Trang {page} / {totalPages}
                  </Text>
                  <Flex>
                    <Box
                      w="26px"
                      h="26px"
                      borderRadius="7px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor={page > 1 ? "pointer" : "default"}
                      color={useColorModeValue("#9ca3af", "#718096")}
                      border={useColorModeValue("1px solid #e5e7eb", "1px solid #4a5568")}
                      bg={useColorModeValue("#f9fafb", "#2d3748")}
                      opacity={page > 1 ? 1 : 0.4}
                      _hover={{ bg: page > 1 ? useColorModeValue("#f1f5f9", "#2d3748") : undefined }}
                      mx="2px"
                      onClick={() => page > 1 && goToPage(page - 1)}
                    >
                      <Icon as={MdKeyboardArrowLeft} boxSize="14px" />
                    </Box>
                    <Box
                      w="26px"
                      h="26px"
                      borderRadius="7px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor={page < totalPages ? "pointer" : "default"}
                      color={useColorModeValue("#9ca3af", "#718096")}
                      border={useColorModeValue("1px solid #e5e7eb", "1px solid #4a5568")}
                      bg={useColorModeValue("#f9fafb", "#2d3748")}
                      opacity={page < totalPages ? 1 : 0.4}
                      _hover={{ bg: page < totalPages ? useColorModeValue("#f1f5f9", "#2d3748") : undefined }}
                      mx="2px"
                      onClick={() => page < totalPages && goToPage(page + 1)}
                    >
                      <Icon as={MdChevronRight} boxSize="14px" />
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Box>
        </Box>

        {/* ── Right: detail panel ── */}
        {showDetail && (
          <Box
            bg={bgColor}
            borderRadius="18px"
            border={useColorModeValue("1px solid #f1f5f9", "1px solid #4a5568")}
            boxShadow="0 1px 6px rgba(0,0,0,0.04)"
            overflow="hidden"
            sx={{ animation: `${slideLeft} 0.3s ease both` }}
            h="fit-content"
            position="sticky"
            top="80px"
          >
            <Flex
              align="center"
              justify="space-between"
              px="18px"
              py="14px"
              borderBottom={useColorModeValue("1px solid #f9fafb", "1px solid #2d3748")}
              bg={useColorModeValue(
                "linear-gradient(135deg, #fff7ed 0%, #fff 60%)",
                "linear-gradient(135deg, #2d3748 0%, #1a202c 60%)"
              )}
            >
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize="13.5px" color={textColor}>Chi tiết</Text>
                {selected && (
                  <Box px="7px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                    <Text fontSize="10px" fontWeight="800" color="#f97316">Showtime</Text>
                  </Box>
                )}
              </Flex>
              <Box
                w="26px"
                h="26px"
                borderRadius="7px"
                cursor="pointer"
                bg={useColorModeValue("#f3f4f6", "#2d3748")}
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: "#fee2e2", color: "#ef4444" }}
                transition="all 0.15s"
                onClick={() => {
                  setShowDetail(false);
                  setSelected(null);
                }}
              >
                <Icon as={MdClose} boxSize="13px" color={useColorModeValue("#6b7280", "#a0aec0")} />
              </Box>
            </Flex>
            <DetailPanel
              selected={selected}
              onEdit={openEdit}
              isDark={isDark}
              onClose={() => {
                setShowDetail(false);
                setSelected(null);
              }}
              getMovieTitle={getMovieTitle}
              getRoomName={getRoomName}
            />
          </Box>
        )}
      </Grid>

      {/* ─── Modals ───────────────────────────────────────── */}
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        value={newShowtime}
        onChange={setNewShowtime}
        onAdd={onAdd}
        isDark={isDark}
        movies={movies}
        rooms={rooms}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        value={editing}
        onChange={setEditing}
        onSave={onUpdate}
        isDark={isDark}
        movies={movies}
        rooms={rooms}
      />

      <CloneWeekModal
        isOpen={cloneModalOpen}
        onClose={() => setCloneModalOpen(false)}
        onClone={() => {}}
        isDark={isDark}
      />

      <BulkEditPriceModal
        isOpen={bulkPriceModalOpen}
        onClose={() => setBulkPriceModalOpen(false)}
        onApply={() => {}}
        isDark={isDark}
      />
    </Box>
  );
}