// src/views/admin/quanlyphongchieu/components/RoomDetail.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Grid,
  useColorMode,
  Spinner,
  Tooltip,
  Badge,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdArrowBack,
  MdEdit,
  MdCheckCircle,
  MdBuild,
  MdMeetingRoom,
  MdInfo,
  MdPerson,
  MdCalendarToday,
  MdAccessTime,
  MdTag,
  MdRefresh,
  MdZoomIn,
  MdZoomOut,
  MdChair,
  MdClose,
  MdFilterList,
  MdLocalMovies,
  MdStar,
} from "react-icons/md";
import {
  FaChair,
  FaBuilding,
  FaCrown,
  FaHeart,
  FaUsers,
  FaUserFriends,
} from "react-icons/fa";
import TypeBadge from "./TypeBadge";
import StatusPill from "./StatusPill";
import SectionTitle from "./shared/SectionTitle";
import { slideIn, fadeUp } from "./shared/animations";
import { useRoom } from "../hooks/useRoom";

// ============================================================
// 📌 ĐỊNH NGHĨA LOẠI GHẾ (PHONG CÁCH MÀU CAM NHẠT)
// ============================================================
const SEAT_TYPES = {
  Normal: {
    label: "Ghế thường",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fdba74",
    icon: null,
    textColor: "#c2410c",
    shortLabel: "Thường",
  },
  VIP: {
    label: "Ghế VIP",
    color: "#eab308",
    bg: "#fefce8",
    border: "#fde047",
    icon: MdStar,
    textColor: "#a16207",
    shortLabel: "VIP",
  },
  Couple: {
    label: "Ghế đôi",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    icon: FaHeart,
    textColor: "#be185d",
    shortLabel: "Đôi",
  },
  Sweetbox: {
    label: "Sweetbox",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    icon: FaHeart,
    textColor: "#6d28d9",
    shortLabel: "Sweetbox",
  },
  Accessible: {
    label: "Tiếp cận",
    color: "#06b6d4",
    bg: "#ecfeff",
    border: "#67e8f9",
    icon: FaUserFriends,
    textColor: "#0e7490",
    shortLabel: "Tiếp cận",
  },
};

// ============================================================
// 📌 ĐỊNH NGHĨA TRẠNG THÁI GHẾ
// ============================================================
const SEAT_STATUS = {
  Available: { color: "#10b981", label: "Trống" },
  Booked: { color: "#ef4444", label: "Đã đặt" },
  Reserved: { color: "#f59e0b", label: "Đã giữ" },
  Broken: { color: "#6b7280", label: "Hỏng" },
  Inactive: { color: "#9ca3af", label: "Không dùng" },
};

// ============================================================
// 📌 COMPONENT SEAT MAP (Dàn đều 2 bên)
// ============================================================
const SeatMap = ({ seatsByRow = {}, seatStats = {}, roomName = "" }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [filterType, setFilterType] = useState("all");
  const [selectedSeat, setSelectedSeat] = useState(null);

  const DARK_THEME_LOCAL = {
    cardBg: "#0f1f3a",
    border: "#1a3a5c",
    text: "#e8f4f8",
    textSecondary: "#88b4d8",
    inputBg: "#0a1f35",
    hoverBg: "#142d4f",
    accent: "#4a9eff",
    stageWell: "#081120",
  };

  const accentColor = isDark ? DARK_THEME_LOCAL.accent : "#f97316";
  const bg = isDark ? DARK_THEME_LOCAL.cardBg : "white";
  const border = isDark ? DARK_THEME_LOCAL.border : "#eef1f6";
  const textColor = isDark ? DARK_THEME_LOCAL.text : "#0f172a";
  const subColor = isDark ? DARK_THEME_LOCAL.textSecondary : "#64748b";
  const inputBg = isDark ? DARK_THEME_LOCAL.inputBg : "#f8fafc";
  const stageWell = isDark ? DARK_THEME_LOCAL.stageWell : "#f4f6fa";

  // Lọc ghế
  const filteredSeats = useMemo(() => {
    if (filterType === "all") return seatsByRow;
    const filtered = {};
    Object.entries(seatsByRow).forEach(([row, seats]) => {
      const f = seats.filter((s) => {
        const type = s.SeatType || s.seat_type || "Normal";
        return type.toLowerCase() === filterType.toLowerCase();
      });
      if (f.length > 0) filtered[row] = f;
    });
    return filtered;
  }, [seatsByRow, filterType]);

  const typeCounts = useMemo(() => {
    const counts = {};
    Object.values(seatsByRow).forEach((seats) => {
      seats.forEach((seat) => {
        const type = seat.SeatType || seat.seat_type || "Normal";
        counts[type] = (counts[type] || 0) + 1;
      });
    });
    return counts;
  }, [seatsByRow]);

  // ✅ RENDER GHẾ (Dàn đều không gian)
  const renderSeat = (seat) => {
    const seatType = seat.SeatType || seat.seat_type || "Normal";
    const seatStatus = seat.Status || seat.status || "Available";
    const typeConfig = SEAT_TYPES[seatType] || SEAT_TYPES.Normal;
    const statusConfig = SEAT_STATUS[seatStatus] || SEAT_STATUS.Available;

    const isBooked = seatStatus === "Booked" || seatStatus === "Reserved";
    const isBroken = seatStatus === "Broken";
    const isInactive = seatStatus === "Inactive";
    const isDisabled = isBooked || isBroken || isInactive;
    const isSelected =
      selectedSeat && (selectedSeat.SeatId || selectedSeat.id) === (seat.SeatId || seat.id);

    // Xử lý tên ghế an toàn
    let row = seat.Row || seat.row;
    let number = seat.Number || seat.number;
    if ((!row || !number) && seat.Name) {
      const match = seat.Name.match(/^([A-Za-z]+)(\d+)$/);
      if (match) { row = match[1]; number = parseInt(match[2]); }
    }
    row = row || "?";
    number = number || "?";

    const isCouple = seatType === "Couple";
    const displayName = isCouple ? `${row}${number}-${Number(number) + 1}` : `${row}${number}`;

    // Màu nền ghế
    let seatBg = isDark ? "rgba(255,255,255,0.05)" : typeConfig.bg;
    let seatBorder = isDark ? "transparent" : typeConfig.border;
    let seatTextColor = isDark ? "#94a3b8" : typeConfig.textColor;

    if (isBooked) {
      seatBg = isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2";
      seatBorder = isDark ? "#ef4444" : "#fca5a5";
      seatTextColor = isDark ? "#fca5a5" : "#b91c1c";
    } else if (isBroken || isInactive) {
      seatBg = isDark ? "rgba(107, 114, 128, 0.2)" : "#f3f4f6";
      seatBorder = isDark ? "#4b5563" : "#d1d5db";
      seatTextColor = isDark ? "#6b7280" : "#9ca3af";
    }

    return (
      <Tooltip
        key={seat.SeatId || seat.id || displayName}
        label={`${typeConfig.label} · ${displayName} · ${statusConfig.label}`}
        placement="top"
        hasArrow
        bg={isDark ? "#1e293b" : "white"}
        color={isDark ? "white" : "#0f172a"}
        border={`1px solid ${border}`}
        borderRadius="6px"
        boxShadow="lg"
        fontSize="11px" fontWeight="600"
      >
        <Box
          as="button"
          type="button"
          position="relative"
          // ✅ flex: 1 giúp ghế tự động giãn nở lấp đầy khoảng trống
          flex="1"
          minW={isCouple ? "56px" : "34px"} 
          maxW={isCouple ? "90px" : "50px"}
          h="38px"
          cursor="pointer"
          onClick={() => setSelectedSeat(seat)}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-3px)", zIndex: 2 }}
          _focusVisible={{ outline: `2px solid ${accentColor}`, outlineOffset: "2px" }}
        >
          <Flex
            position="absolute"
            inset="0"
            bg={seatBg}
            border={`1.5px solid ${seatBorder}`}
            borderRadius="8px 8px 4px 4px"
            align="center"
            justify="center"
            opacity={isDisabled ? 0.6 : 1}
            boxShadow={
              isSelected
                ? `0 0 0 2px ${bg}, 0 0 0 4px ${typeConfig.color}`
                : isDark
                ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)"
                : "inset 0 1px 0 rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.08)"
            }
          >
            <Text fontSize={isCouple ? "10px" : "11.5px"} fontWeight="800" color={seatTextColor}>
              {displayName}
            </Text>
          </Flex>

          {typeConfig.icon && !isDisabled && (
            <Box position="absolute" top="-6px" right="-6px" bg={isDark ? "#1e293b" : "white"} borderRadius="full" p="0.5" boxShadow="sm" zIndex={1}>
              <Icon as={typeConfig.icon} boxSize="12px" color={typeConfig.color} />
            </Box>
          )}
          {isBooked && (
            <Box position="absolute" top="-4px" right="-4px" bg="#ef4444" borderRadius="full" p="0.5" zIndex={1}>
              <Icon as={MdClose} boxSize="10px" color="white" />
            </Box>
          )}
        </Box>
      </Tooltip>
    );
  };

  const rows = Object.keys(filteredSeats).sort();
  const colCount = useMemo(() => {
    if (rows.length === 0) return 0;
    return filteredSeats[rows[0]]?.length || 0;
  }, [filteredSeats, rows]);

  return (
    <Box>
      {/* Toolbar */}
      <Flex justify="space-between" align="center" mb="16px" flexWrap="wrap" gap="10px" p="10px 14px" borderRadius="12px" bg={inputBg} border={`1px solid ${border}`}>
        <Flex align="center" gap="10px">
          <Flex align="center" justify="center" w="34px" h="34px" borderRadius="9px" bg={isDark ? "rgba(74,158,255,0.15)" : "rgba(249,115,22,0.12)"}>
            <Icon as={MdChair} boxSize="16px" color={accentColor} />
          </Flex>
          <Box>
            <Text fontSize="13px" fontWeight="800" color={textColor} lineHeight="1.2">
              {rows.length} hàng · {colCount} cột
            </Text>
            <Text fontSize="11px" color={subColor}>
              {seatStats.total || 0} ghế tổng cộng
            </Text>
          </Box>
        </Flex>

        <Flex gap="8px" align="center" flexWrap="wrap">
          <Select size="sm" w="150px" borderRadius="8px" bg={isDark ? DARK_THEME_LOCAL.cardBg : "white"} border={`1px solid ${border}`} color={textColor} fontSize="11px" fontWeight="700" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả ghế</option>
            <option value="normal">Ghế thường</option>
            <option value="vip">Ghế VIP</option>
            <option value="couple">Ghế đôi</option>
            <option value="sweetbox">Sweetbox</option>
            <option value="accessible">Tiếp cận</option>
          </Select>
        </Flex>
      </Flex>

      {/* ✅ SEAT GRID (Dàn đều ra 2 bên) */}
      {rows.length > 0 ? (
        <Box
          position="relative"
          overflowX="auto"
          py="10"
          px="6"
          bg={isDark ? "radial-gradient(ellipse at top, rgba(74,158,255,0.06), transparent 60%), #08101f" : `radial-gradient(ellipse at top, ${stageWell}, #fbfcfe 65%)`}
          borderRadius="16px"
          border={`1px solid ${border}`}
        >
          <Flex direction="column" gap="8px" align="center" w="100%">
            {/* Màn hình chiếu */}
            <Box mb="10" textAlign="center" w="100%" maxW="700px" position="relative">
              <Box h="24px" mx="auto" w="100%" borderRadius="50% 50% 0 0 / 100% 100% 0 0" bg={isDark ? "linear-gradient(180deg, rgba(74,158,255,0.4), rgba(74,158,255,0))" : "linear-gradient(180deg, rgba(249,115,22,0.3), rgba(249,115,22,0))"} filter="blur(4px)" position="absolute" top="-10px" />
              <Box h="4px" mx="auto" w="90%" borderRadius="full" bg={isDark ? "linear-gradient(90deg, transparent, #4a9eff, transparent)" : "linear-gradient(90deg, transparent, #f97316, transparent)"} boxShadow={isDark ? "0 0 20px rgba(74,158,255,0.6)" : "0 0 20px rgba(249,115,22,0.5)"} mb="2" />
              <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="6px" textTransform="uppercase" display="flex" alignItems="center" justifyContent="center" gap="2" mt="2">
                <Icon as={MdLocalMovies} boxSize="12px" /> MÀN HÌNH CHIẾU
              </Text>
            </Box>

            {/* Các hàng ghế */}
            {rows.map((row) => (
              <Flex key={row} gap="6px" align="center" w="100%">
                <Text fontSize="11px" fontWeight="800" color={isDark ? DARK_THEME_LOCAL.textSecondary : "#94a3b8"} w="24px" textAlign="center" fontFamily="mono">
                  {row}
                </Text>
                {/* ✅ w="100%" và flex="1" giúp các ghế giãn đều */}
                <Flex gap="8px" flex="1" justify="center">
                  {filteredSeats[row].map((seat) => renderSeat(seat))}
                </Flex>
                <Text fontSize="11px" fontWeight="800" color={isDark ? DARK_THEME_LOCAL.textSecondary : "#94a3b8"} w="24px" textAlign="center" fontFamily="mono">
                  {row}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      ) : (
        <Box textAlign="center" py="14" borderRadius="16px" border={`1px dashed ${border}`}>
          <Icon as={MdChair} boxSize="36px" color={isDark ? DARK_THEME_LOCAL.border : "#cbd5e1"} />
          <Text color={subColor} fontSize="14px" mt="3" fontWeight="500">
            {filterType !== "all" ? `Không có ghế loại "${filterType}" trong phòng này` : "Chưa có ghế nào được tạo cho phòng này"}
          </Text>
        </Box>
      )}

      {/* Legend */}
      <Flex justify="center" gap={{ base: "10px", md: "18px" }} mt="6" flexWrap="wrap" borderTop={`1px solid ${border}`} pt="16px" align="center">
        <Flex align="center" gap="6px" flexWrap="wrap">
          <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="0.5px">TRẠNG THÁI</Text>
          {Object.entries(SEAT_STATUS).map(([key, status]) => (
            <Flex key={key} align="center" gap="5px" px="8px" py="4px" borderRadius="full" bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"}>
              <Box w="8px" h="8px" borderRadius="full" bg={status.color} />
              <Text fontSize="10px" fontWeight="600" color={subColor}>{status.label}</Text>
            </Flex>
          ))}
        </Flex>

        <Box w="1px" h="18px" bg={border} display={{ base: "none", md: "block" }} />

        <Flex align="center" gap="6px" flexWrap="wrap">
          <Text fontSize="10px" fontWeight="800" color={subColor} letterSpacing="0.5px">LOẠI GHẾ</Text>
          {Object.entries(SEAT_TYPES).map(([key, type]) => (
            <Flex key={key} align="center" gap="5px" px="8px" py="4px" borderRadius="full" bg={type.bg}>
              {type.icon && <Icon as={type.icon} boxSize="10px" color={type.color} />}
              <Text fontSize="10px" fontWeight="600" color={subColor}>{type.shortLabel}</Text>
              {typeCounts[key] > 0 && (
                <Badge fontSize="9px" bg="transparent" color={type.color} px="0" fontWeight="900">{typeCounts[key]}</Badge>
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Thông tin ghế được chọn */}
      {selectedSeat && (
        <Box mt="4" p="4" borderRadius="12px" bg={inputBg} border={`1px solid ${border}`} sx={{ animation: `${fadeUp} 0.2s ease both` }}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="3">
              <Box w="36px" h="36px" borderRadius="10px" bg={SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.bg || SEAT_TYPES.Normal.bg} border={`1.5px solid ${SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.border}`} display="flex" alignItems="center" justifyContent="center">
                <Text fontWeight="900" color={SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.textColor}>
                  {selectedSeat.Row || selectedSeat.row}{selectedSeat.Number || selectedSeat.number}
                </Text>
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="800" color={textColor}>Ghế {selectedSeat.Row || selectedSeat.row}{selectedSeat.Number || selectedSeat.number}</Text>
                <Flex gap="2" mt="1">
                  <Badge px="2" py="1" borderRadius="4px" fontSize="9px" fontWeight="700" bg={SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.bg || SEAT_TYPES.Normal.bg} color={SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.textColor || SEAT_TYPES.Normal.textColor}>
                    {SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]?.label || "Ghế thường"}
                  </Badge>
                  <Badge px="2" py="1" borderRadius="4px" fontSize="9px" fontWeight="700" bg={SEAT_STATUS[selectedSeat.Status || selectedSeat.status || "Available"]?.color} color="white">
                    {SEAT_STATUS[selectedSeat.Status || selectedSeat.status || "Available"]?.label || "Trống"}
                  </Badge>
                </Flex>
              </Box>
            </Flex>
            <Button size="xs" variant="ghost" color={subColor} borderRadius="full" onClick={() => setSelectedSeat(null)}>
              <Icon as={MdClose} boxSize="14px" />
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

// ============================================================
// 📌 COMPONENT ROOM DETAIL CHÍNH
// ============================================================
const RoomDetail = ({ room, cinemaName, onBack, onToggle, onEdit, isDark }) => {
  const { colorMode } = useColorMode();
  const darkMode = isDark !== undefined ? isDark : colorMode === "dark";
  const { loadRoomDetail, roomDetail, loadingDetail } = useRoom();

  const [localRoom, setLocalRoom] = useState(room);

  const DARK_THEME_MAIN = {
    cardBg: "#0f1f3a", border: "#1a3a5c", text: "#e8f4f8", textSecondary: "#88b4d8",
    inputBg: "#0a1f35", hoverBg: "#142d4f", accent: "#4a9eff", accentLight: "#6ab0ff", accentShadow: "rgba(74, 158, 255, 0.25)",
  };

  useEffect(() => {
    if (room?.RoomId) {
      loadRoomDetail(room.RoomId).then((data) => {
        if (data) setLocalRoom(data);
      });
    }
  }, [room?.RoomId, loadRoomDetail]);

  if (loadingDetail) {
    return (
      <Flex justify="center" align="center" minH="400px" direction="column" gap="6" sx={{ animation: `${fadeUp} 0.3s ease both` }}>
        <Box position="relative" display="flex" alignItems="center" justifyContent="center">
          <Box position="absolute" w="60px" h="60px" borderRadius="full" bg={darkMode ? "rgba(74, 158, 255, 0.1)" : "rgba(249, 115, 22, 0.1)"} sx={{ animation: "pulse 2s infinite" }} />
          <Spinner size="xl" color={darkMode ? DARK_THEME_MAIN.accent : "#f97316"} thickness="4px" speed="0.65s" emptyColor={darkMode ? "#1a3a5c" : "#fed7aa"} />
        </Box>
        <Text color={darkMode ? DARK_THEME_MAIN.textSecondary : "#64748b"} fontSize="15px" fontWeight="600" letterSpacing="0.5px">
          Đang tải sơ đồ phòng chiếu...
        </Text>
      </Flex>
    );
  }

  const roomData = roomDetail || localRoom;
  const isMaintenance = roomData.Status === "Maintenance";
  const isActive = roomData.Status === "Active";
  const totalSeats = roomData.TotalSeats || roomData.SeatCount || 0;

  const accentColor = darkMode ? DARK_THEME_MAIN.accent : "#f97316";
  const accentShadow = darkMode ? DARK_THEME_MAIN.accentShadow : "rgba(249,115,22,0.35)";
  const gradientBg = darkMode ? `linear-gradient(135deg, ${DARK_THEME_MAIN.accent}, ${DARK_THEME_MAIN.accentLight})` : "linear-gradient(135deg,#f97316,#fb923c)";
  const bg = darkMode ? DARK_THEME_MAIN.cardBg : "white";
  const border = darkMode ? DARK_THEME_MAIN.border : "#f1f5f9";
  const textColor = darkMode ? DARK_THEME_MAIN.text : "#0f172a";
  const subColor = darkMode ? DARK_THEME_MAIN.textSecondary : "#64748b";
  const detailBg = darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc";

  const seatsByRow = roomData.SeatsByRow || {};
  const seatStats = roomData.SeatStats || { total: 0 };

  return (
    <Box sx={{ animation: `${slideIn} 0.3s ease both` }}>
      {/* HEADER */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px" flexWrap="wrap">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost" color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600" border={`1.5px solid ${border}`} _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f8fafc" }} onClick={onBack}>
          Quay lại danh sách
        </Button>
        <Flex gap="8px" flexWrap="wrap">
          <Button h="38px" px="12px" borderRadius="10px" fontWeight="700" fontSize="13px" bg={darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc"} color={textColor} border={`1px solid ${darkMode ? DARK_THEME_MAIN.border : "#e2e8f0"}`} _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f1f5f9" }} leftIcon={<Icon as={MdRefresh} />} onClick={() => loadRoomDetail(roomData.RoomId)}>
            Làm mới
          </Button>
          <Button h="38px" px="12px" borderRadius="10px" fontWeight="700" fontSize="13px" bg={darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc"} color={textColor} border={`1px solid ${darkMode ? DARK_THEME_MAIN.border : "#e2e8f0"}`} _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f1f5f9" }} leftIcon={<Icon as={MdEdit} />} onClick={() => onEdit(room)}>
            Chỉnh sửa
          </Button>
          <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px" fontWeight="700" fontSize="13px" bg={isMaintenance ? "linear-gradient(135deg,#059669,#34d399)" : "linear-gradient(135deg,#f59e0b,#fbbf24)"} color="white" _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s" leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} />} onClick={() => onToggle(roomData.RoomId)}>
            {isMaintenance ? "Kích hoạt phòng" : "Đánh dấu bảo trì"}
          </Button>
        </Flex>
      </Flex>

      {/* MAIN CONTENT - THÔNG TIN PHÒNG */}
      <Box bg={bg} borderRadius="20px" border={`1px solid ${border}`} boxShadow={darkMode ? `0 2px 16px ${DARK_THEME_MAIN.accentShadow}` : "0 2px 16px rgba(0,0,0,0.06)"} overflow="hidden" mb="16px">
        <Box h="5px" bg={gradientBg} />
        <Box p={{ base: "20px", md: "28px" }}>
          <Flex direction={{ base: "column", md: "row" }} gap="24px">
            <Box flex="1">
              <Flex align="flex-start" gap="16px" mb="16px">
                <Box w="72px" h="72px" borderRadius="18px" flexShrink="0" bg={isActive ? gradientBg : darkMode ? DARK_THEME_MAIN.inputBg : "linear-gradient(135deg,#64748b,#94a3b8)"} display="flex" alignItems="center" justifyContent="center" boxShadow={isActive ? `0 4px 14px ${accentShadow}` : "none"}>
                  <Icon as={MdMeetingRoom} boxSize="32px" color="white" />
                </Box>
                <Box>
                  <Text fontSize="11px" fontWeight="700" color={subColor} letterSpacing="1px" textTransform="uppercase" mb="2px">{cinemaName}</Text>
                  <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="900" color={textColor} letterSpacing="-0.6px" lineHeight="1">{roomData.Name}</Text>
                  <Flex gap="8px" mt="10px" flexWrap="wrap">
                    <TypeBadge type={roomData.RoomType || "Standard"} isDark={darkMode} />
                    <StatusPill status={roomData.Status} isDark={darkMode} />
                  </Flex>
                </Box>
              </Flex>
              <Box h="1px" bg={border} mb="16px" />
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mb="16px">
                <Box p="14px 16px" borderRadius="12px" bg={detailBg} border={`1px solid ${border}`}>
                  <Flex align="center" gap="8px" mb="6px"><Icon as={MdTag} boxSize="16px" color={accentColor} /><Text fontSize="11px" fontWeight="700" color={subColor}>Loại phòng</Text></Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>{roomData.RoomType || "Standard"}</Text>
                </Box>
                <Box p="14px 16px" borderRadius="12px" bg={detailBg} border={`1px solid ${border}`}>
                  <Flex align="center" gap="8px" mb="6px"><Icon as={FaChair} boxSize="16px" color={accentColor} /><Text fontSize="11px" fontWeight="700" color={subColor}>Tổng số ghế</Text></Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>{totalSeats} ghế</Text>
                </Box>
              </Grid>
              <Box p="12px 16px" borderRadius="12px" bg={detailBg} border={`1px solid ${border}`}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="6px"><Icon as={MdInfo} boxSize="14px" color={subColor} /><Text fontSize="11px" fontWeight="700" color={subColor}>ID Phòng Chiếu</Text></Flex>
                  <Text fontSize="13px" fontWeight="800" color={textColor} fontFamily="mono">{roomData.RoomId}</Text>
                </Flex>
              </Box>
            </Box>

            <Box flex="1">
              <Box bg={detailBg} borderRadius="14px" border={`1px solid ${border}`} p="16px" mb="14px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={darkMode ? DARK_THEME_MAIN.accent : "linear-gradient(135deg,#3b82f6,#60a5fa)"} display="flex" alignItems="center" justifyContent="center"><Icon as={FaBuilding} boxSize="14px" color="white" /></Box>
                  <Box><Text fontSize="13px" fontWeight="800" color={textColor}>Thông Tin Rạp Chiếu</Text><Text fontSize="11px" color={subColor}>Chi tiết về rạp phim</Text></Box>
                </Flex>
                <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"} border={`1px solid ${border}`}>
                  <Icon as={FaBuilding} boxSize="18px" color={accentColor} />
                  <Box><Text fontSize="10px" fontWeight="700" color={subColor}>Tên rạp</Text><Text fontSize="13px" fontWeight="600" color={textColor}>{cinemaName}</Text></Box>
                </Flex>
              </Box>
              <Box bg={detailBg} borderRadius="14px" border={`1px solid ${border}`} p="16px" mb="14px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={darkMode ? "#6ab0ff" : "linear-gradient(135deg,#8b5cf6,#a78bfa)"} display="flex" alignItems="center" justifyContent="center"><Icon as={MdCalendarToday} boxSize="14px" color="white" /></Box>
                  <Box><Text fontSize="13px" fontWeight="800" color={textColor}>Thông Tin Tạo</Text><Text fontSize="11px" color={subColor}>Chi tiết người tạo</Text></Box>
                </Flex>
                <Flex direction="column" gap="8px">
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"} border={`1px solid ${border}`}>
                    <Icon as={MdPerson} boxSize="18px" color={darkMode ? "#6ab0ff" : "#8b5cf6"} />
                    <Box><Text fontSize="10px" fontWeight="700" color={subColor}>Người tạo</Text><Text fontSize="13px" fontWeight="600" color={textColor}>{roomData.CreatedBy || "N/A"}</Text></Box>
                  </Flex>
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"} border={`1px solid ${border}`}>
                    <Icon as={MdCalendarToday} boxSize="18px" color={darkMode ? "#6ab0ff" : "#8b5cf6"} />
                    <Box><Text fontSize="10px" fontWeight="700" color={subColor}>Ngày tạo</Text><Text fontSize="13px" fontWeight="600" color={textColor}>{roomData.CreatedAt ? new Date(roomData.CreatedAt).toLocaleDateString("vi-VN") : "N/A"}</Text></Box>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* SEAT MAP */}
      <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`} boxShadow={darkMode ? `0 1px 4px ${DARK_THEME_MAIN.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"} p="20px" mb="16px" sx={{ animation: `${fadeUp} 0.4s ease both` }}>
        <Flex align="center" gap="8px" mb="16px"><Icon as={MdChair} boxSize="18px" color={accentColor} /><Text fontSize="15px" fontWeight="800" color={textColor}>Sơ đồ ghế ngồi</Text></Flex>
        <SeatMap seatsByRow={seatsByRow} seatStats={seatStats} roomName={roomData.Name} />
      </Box>

      {/* MAINTENANCE ALERT */}
      {isMaintenance && (
        <Box mt="4" p="4" borderRadius="12px" bg={darkMode ? "#7f1d1d" : "#fef2f2"} border={`1px solid ${darkMode ? "#991b1b" : "#fca5a5"}`}>
          <Flex align="center" gap="3">
            <Icon as={MdBuild} boxSize="20px" color={darkMode ? "#f87171" : "#dc2626"} />
            <Box>
              <Text fontSize="14px" fontWeight="700" color={darkMode ? "#f87171" : "#dc2626"}>Phòng đang bảo trì</Text>
              <Text fontSize="12px" color={darkMode ? "#fca5a5" : "#991b1b"}>Phòng này không nhận suất chiếu mới. Nhấn "Kích hoạt phòng" để đưa vào hoạt động trở lại.</Text>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default RoomDetail;