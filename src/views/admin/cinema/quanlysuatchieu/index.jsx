// src/views/admin/quanlysuatchieu/index.jsx

import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, Icon, SimpleGrid,
  Input, Select, useColorMode, useColorModeValue,
  IconButton, HStack, Tooltip, Badge,
} from "@chakra-ui/react";
import {
  MdAdd, MdSearch, MdPlayCircle, MdTimer, MdDone,
  MdKeyboardArrowLeft, MdChevronRight, MdDarkMode, MdLightMode,
  MdContentCopy, MdAttachMoney, MdClose, MdRefresh,
  MdClear,
} from "react-icons/md";
import { FaTicketAlt, FaCalendarAlt, FaClock, FaFilm } from "react-icons/fa";
import { BsCameraReelsFill, BsGridFill, BsListUl, BsFillGrid3X3GapFill } from "react-icons/bs";

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
import Loader from "layouts/Loader";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State cho form thêm mới
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    endTime: "",
    price: "",
    status: "Scheduled",
  });

  // Dark theme colors
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const accentShadow = isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.35)";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)";
  const gradientButton = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316 0%, #fb923c 100%)";
  const viewModeActiveBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316, #fb923c)";

  const bgColor = isDark ? DARK_THEME.cardBg : "white";
  const pageBg = isDark ? DARK_THEME.bg : "#f1f5f9";
  const textColor = isDark ? DARK_THEME.text : "#111827";
  const subColor = isDark ? DARK_THEME.textSecondary : "#6b7280";
  const borderColor = isDark ? DARK_THEME.border : "#e2e8f0";
  const inputBg = isDark ? DARK_THEME.inputBg : "white";
  const inputBorder = isDark ? DARK_THEME.border : borderColor;

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

  const onRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const hasFilter = searchInput || filterStatus;

  // Loading state
  if (loading && showtimes.length === 0) {
    return <Loader />;
  }

  return (
    <Box
      pt={{ base: "100px", md: "80px" }}
      pb="40px"
      px={{ base: "12px", md: "24px" }}
      bg={pageBg}
      minH="100vh"
      transition="background 0.3s"
    >
      {/* ─── Page Header ──────────────────────────────────── */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb="24px"
        gap="14px"
      >
        <Box sx={{ animation: `${fadeUp} 0.38s ease both` }}>
          <Flex align="center" gap="14px">
            <Box
              w="48px"
              h="48px"
              borderRadius="14px"
              bg={gradientBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={`0 8px 24px ${accentShadow}`}
              sx={{ animation: `${glow} 3s ease infinite` }}
            >
              <Icon as={BsCameraReelsFill} boxSize="22px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="900" color={textColor} letterSpacing="-0.5px">
                Quản lý suất chiếu
              </Text>
              <Flex align="center" gap="6px" mt="2px">
                <Badge 
                  colorScheme={isDark ? "blue" : "orange"} 
                  fontSize="10px" px="8px" py="2px" borderRadius="full"
                  bg={isDark ? DARK_THEME.accent : "#f97316"}
                  color="white"
                >
                  {total} suất chiếu
                </Badge>
                <Text fontSize="12px" color={subColor}>
                  • Quản lý lịch chiếu phim
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <HStack spacing="8px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }} flexWrap="wrap">
          <Tooltip label={isDark ? "Chế độ sáng" : "Chế độ tối"}>
            <IconButton
              aria-label="Toggle theme"
              icon={<Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="18px" />}
              onClick={toggleColorMode}
              size="sm"
              borderRadius="10px"
              bg={isDark ? DARK_THEME.inputBg : "white"}
              border={`1px solid ${borderColor}`}
              _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }}
              h="38px"
              w="38px"
              color={textColor}
            />
          </Tooltip>

          <Tooltip label="Làm mới dữ liệu">
            <IconButton
              aria-label="Refresh"
              icon={<Icon as={MdRefresh} boxSize="18px" />}
              onClick={onRefresh}
              size="sm"
              borderRadius="10px"
              bg={isDark ? DARK_THEME.inputBg : "white"}
              border={`1px solid ${borderColor}`}
              _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f1f5f9" }}
              h="38px"
              w="38px"
              color={textColor}
            />
          </Tooltip>

          {/* View mode toggle */}
          <Flex
            borderRadius="10px"
            border={`1px solid ${borderColor}`}
            overflow="hidden"
            bg={isDark ? DARK_THEME.inputBg : "white"}
          >
            {[
              { v: "list", ic: BsListUl, label: "Danh sách" },
              { v: "grid", ic: BsFillGrid3X3GapFill, label: "Lưới" },
            ].map(({ v, ic, label }) => (
              <Tooltip key={v} label={label}>
                <Box
                  w="36px"
                  h="36px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  bg={viewMode === v ? viewModeActiveBg : "transparent"}
                  transition="all 0.2s"
                  _hover={{ 
                    bg: viewMode === v ? viewModeActiveBg : (isDark ? DARK_THEME.hoverBg : "#f1f5f9") 
                  }}
                  onClick={() => setViewMode(v)}
                >
                  <Icon
                    as={ic}
                    boxSize="15px"
                    color={viewMode === v ? "white" : (isDark ? DARK_THEME.textSecondary : "#6b7280")}
                  />
                </Box>
              </Tooltip>
            ))}
          </Flex>

          <Tooltip label="Nhân bản lịch tuần">
            <Button
              leftIcon={<Icon as={MdContentCopy} />}
              h="38px"
              px="14px"
              bg={isDark ? DARK_THEME.inputBg : "white"}
              color={isDark ? DARK_THEME.text : "#374151"}
              borderRadius="10px"
              fontWeight="600"
              fontSize="12px"
              border={`1px solid ${borderColor}`}
              _hover={{ 
                bg: isDark ? DARK_THEME.hoverBg : "#f8fafc", 
                borderColor: accentColor 
              }}
              transition="all 0.2s"
              onClick={() => setCloneModalOpen(true)}
            >
              <Box display={{ base: "none", md: "block" }}>Nhân bản tuần</Box>
              <Box display={{ base: "block", md: "none" }}>Nhân bản</Box>
            </Button>
          </Tooltip>

          <Tooltip label="Chỉnh sửa giá hàng loạt">
            <Button
              leftIcon={<Icon as={MdAttachMoney} />}
              h="38px"
              px="14px"
              bg={isDark ? DARK_THEME.inputBg : "white"}
              color={isDark ? DARK_THEME.text : "#374151"}
              borderRadius="10px"
              fontWeight="600"
              fontSize="12px"
              border={`1px solid ${borderColor}`}
              _hover={{ 
                bg: isDark ? DARK_THEME.hoverBg : "#f8fafc", 
                borderColor: accentColor 
              }}
              transition="all 0.2s"
              onClick={() => setBulkPriceModalOpen(true)}
            >
              <Box display={{ base: "none", md: "block" }}>Chỉnh sửa giá</Box>
              <Box display={{ base: "block", md: "none" }}>Giá vé</Box>
            </Button>
          </Tooltip>

          <Button
            leftIcon={<Icon as={MdAdd} />}
            h="38px"
            px="20px"
            bg={gradientButton}
            color="white"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            boxShadow={`0 4px 14px ${accentShadow}`}
            _hover={{
              boxShadow: `0 6px 24px ${accentShadow}`,
              transform: "translateY(-2px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={openAdd}
          >
            <Box display={{ base: "none", md: "block" }}>Thêm suất chiếu</Box>
            <Box display={{ base: "block", md: "none" }}>Thêm</Box>
          </Button>
        </HStack>
      </Flex>

      {/* ─── Stats row ────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "10px", md: "16px" }} mb="24px">
        <StatCard label="Tổng suất" value={total} icon={FaTicketAlt} accent={isDark ? DARK_THEME.accent : "#f97316"} sub="tất cả lịch" delay={0} isDark={isDark} />
        <StatCard label="Đã lên lịch" value={counts.scheduled} icon={FaCalendarAlt} accent="#10b981" sub="đang hoạt động" delay={0.05} isDark={isDark} />
        <StatCard label="Đã hủy" value={counts.cancelled} icon={FaClock} accent="#f59e0b" sub="đã hủy" delay={0.10} isDark={isDark} />
        <StatCard label="Đã kết thúc" value={counts.finished} icon={FaFilm} accent="#6b7280" sub="hoàn thành" delay={0.15} isDark={isDark} />
      </SimpleGrid>

      {/* ─── Search & Filter ──────────────────────────────── */}
      <Box mb="16px">
        <Flex gap="10px" wrap="wrap" align="center">
          <Box position="relative" flex={{ base: "1 1 100%", md: "1 1 280px" }} minW="200px">
            <Icon
              as={MdSearch}
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              boxSize="16px"
              color={isDark ? DARK_THEME.labelColor : "#9ca3af"}
            />
            <Input
              pl="36px"
              h="40px"
              fontSize="14px"
              placeholder="Tìm kiếm theo tên phim, phòng chiếu..."
              bg={inputBg}
              border={`1px solid ${inputBorder}`}
              borderRadius="10px"
              color={textColor}
              _placeholder={{ color: subColor }}
              _focus={{
                border: `1.5px solid ${accentColor}`,
                boxShadow: `0 0 0 3px ${isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.12)"}`,
              }}
              transition="all 0.2s"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </Box>
          
          <Select
            h="40px"
            w={{ base: "100%", sm: "160px" }}
            fontSize="13px"
            fontWeight="500"
            bg={inputBg}
            border={`1px solid ${inputBorder}`}
            borderRadius="10px"
            color={textColor}
            _focus={{
              border: `1.5px solid ${accentColor}`,
              boxShadow: `0 0 0 3px ${isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.12)"}`,
            }}
            _hover={{ borderColor: accentColor }}
            transition="all 0.2s"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Scheduled">📅 Đã lên lịch</option>
            <option value="Cancelled">❌ Đã hủy</option>
            <option value="Finished">✅ Đã kết thúc</option>
          </Select>

          {hasFilter && (
            <Button
              size="sm"
              h="34px"
              px="12px"
              borderRadius="8px"
              variant="ghost"
              color="#ef4444"
              leftIcon={<Icon as={MdClear} />}
              onClick={() => {
                setSearchInput("");
                setFilterStatus("");
              }}
              _hover={{ bg: "#fef2f2" }}
            >
              Xóa lọc
            </Button>
          )}

          <Text fontSize="13px" color={subColor} ml="auto" fontWeight="500">
            <Text as="span" fontWeight="700" color={textColor}>{showtimes.length}</Text> / {total} suất chiếu
          </Text>
        </Flex>
      </Box>

      {/* ─── Main layout ─────────────────────────────────── */}
      <Grid
        templateColumns={{ base: "1fr", xl: showDetail ? "1fr 340px" : "1fr" }}
        gap={{ base: "16px", xl: "20px" }}
      >
        {/* ── Left: list / grid ── */}
        <Box>
          <Box
            bg={bgColor}
            borderRadius="18px"
            border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f1f5f9"}
            boxShadow={isDark ? `0 1px 6px ${DARK_THEME.accentShadow}` : "0 1px 6px rgba(0,0,0,0.04)"}
            sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}
            overflow="hidden"
          >
            {/* ✅ THÊM HEADER CỘT CHO BẢNG */}
            {viewMode === "list" && showtimes.length > 0 && (
              <Flex 
                px="18px" 
                py="10px" 
                bg={isDark ? DARK_THEME.inputBg : "#fafbfc"}
                borderBottom={`1px solid ${borderColor}`}
                align="center"
                display={{ base: "none", md: "flex" }}
              >
                <Box w="32px" flexShrink="0">
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">#</Text>
                </Box>
                <Box w="36px" mr="8px" flexShrink="0" />
                <Box flex="2" pr="10px">
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">Phim</Text>
                </Box>
                <Box flex="1.8" pr="10px" display={{ base: "none", md: "block" }}>
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">Thời gian</Text>
                </Box>
                <Box flex="1.2" pr="10px" display={{ base: "none", lg: "block" }}>
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">Giá vé</Text>
                </Box>
                <Box flex="1" pr="10px" display={{ base: "none", sm: "block" }}>
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
                </Box>
                <Box w="130px" flexShrink="0" textAlign="right">
                  <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.labelColor : subColor} letterSpacing="1px" textTransform="uppercase">Hành động</Text>
                </Box>
              </Flex>
            )}

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
                borderTop={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f9fafb"}
                bg={isDark ? DARK_THEME.inputBg : "#fafbfc"}
              >
                <Text fontSize="11.5px" color={isDark ? DARK_THEME.textSecondary : "#9ca3af"} fontWeight="500">
                  Hiển thị <Text as="span" fontWeight="700" color={textColor}>{showtimes.length}</Text> / {total} suất chiếu
                </Text>
                <Flex gap="6px" align="center">
                  <Text fontSize="11px" color={isDark ? DARK_THEME.labelColor : "#d1d5db"}>
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
                      color={isDark ? DARK_THEME.textSecondary : "#9ca3af"}
                      border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #e5e7eb"}
                      bg={isDark ? DARK_THEME.inputBg : "#f9fafb"}
                      opacity={page > 1 ? 1 : 0.4}
                      _hover={{ bg: page > 1 ? (isDark ? DARK_THEME.hoverBg : "#f1f5f9") : undefined }}
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
                      color={isDark ? DARK_THEME.textSecondary : "#9ca3af"}
                      border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #e5e7eb"}
                      bg={isDark ? DARK_THEME.inputBg : "#f9fafb"}
                      opacity={page < totalPages ? 1 : 0.4}
                      _hover={{ bg: page < totalPages ? (isDark ? DARK_THEME.hoverBg : "#f1f5f9") : undefined }}
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
            border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f1f5f9"}
            boxShadow={isDark ? `0 1px 6px ${DARK_THEME.accentShadow}` : "0 1px 6px rgba(0,0,0,0.04)"}
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
              borderBottom={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #f9fafb"}
              bg={isDark 
                ? `linear-gradient(135deg, ${DARK_THEME.inputBg} 0%, ${DARK_THEME.cardBg} 60%)`
                : "linear-gradient(135deg, #fff7ed 0%, #fff 60%)"
              }
            >
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize="13.5px" color={textColor}>Chi tiết</Text>
                {selected && (
                  <Box px="7px" py="2px" borderRadius="6px" 
                    bg={isDark ? DARK_THEME.inputBg : "#fff7ed"} 
                    border={isDark ? `1px solid ${DARK_THEME.border}` : "1px solid #fed7aa"}>
                    <Text fontSize="10px" fontWeight="800" color={isDark ? DARK_THEME.accent : "#f97316"}>Showtime</Text>
                  </Box>
                )}
              </Flex>
              <Box
                w="26px"
                h="26px"
                borderRadius="7px"
                cursor="pointer"
                bg={isDark ? DARK_THEME.inputBg : "#f3f4f6"}
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
                <Icon as={MdClose} boxSize="13px" color={isDark ? DARK_THEME.textSecondary : "#6b7280"} />
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