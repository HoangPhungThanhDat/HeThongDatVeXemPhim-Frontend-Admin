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
// 📌 ĐỊNH NGHĨA LOẠI GHẾ
// ============================================================
const SEAT_TYPES = {
  Normal: {
    label: "Ghế thường",
    icon: FaChair,
    color: "#3b82f6",
    gradient: "linear-gradient(145deg,#60a5fa,#3b82f6)",
    bg: "rgba(59, 130, 246, 0.14)",
    border: "#3b82f6",
    shortLabel: "Thường",
  },
  VIP: {
    label: "Ghế VIP",
    icon: FaCrown,
    color: "#f59e0b",
    gradient: "linear-gradient(145deg,#fbbf24,#f59e0b)",
    bg: "rgba(245, 158, 11, 0.16)",
    border: "#f59e0b",
    shortLabel: "VIP",
  },
  Couple: {
    label: "Ghế đôi",
    icon: FaHeart,
    color: "#ec4899",
    gradient: "linear-gradient(145deg,#f472b6,#ec4899)",
    bg: "rgba(236, 72, 153, 0.16)",
    border: "#ec4899",
    shortLabel: "Đôi",
  },
  Sweetbox: {
    label: "Sweetbox",
    icon: FaUsers,
    color: "#8b5cf6",
    gradient: "linear-gradient(145deg,#a78bfa,#8b5cf6)",
    bg: "rgba(139, 92, 246, 0.16)",
    border: "#8b5cf6",
    shortLabel: "Sweetbox",
  },
  Accessible: {
    label: "Tiếp cận",
    icon: FaUserFriends,
    color: "#06b6d4",
    gradient: "linear-gradient(145deg,#22d3ee,#06b6d4)",
    bg: "rgba(6, 182, 212, 0.16)",
    border: "#06b6d4",
    shortLabel: "Tiếp cận",
  },
};

// ============================================================
// 📌 ĐỊNH NGHĨA TRẠNG THÁI GHẾ
// ============================================================
const SEAT_STATUS = {
  Available: { color: "#10b981", label: "Trống", dot: "#10b981" },
  Booked: { color: "#ef4444", label: "Đã đặt", dot: "#ef4444" },
  Reserved: { color: "#f59e0b", label: "Đã giữ", dot: "#f59e0b" },
  Broken: { color: "#6b7280", label: "Hỏng", dot: "#6b7280" },
  Inactive: { color: "#9ca3af", label: "Không dùng", dot: "#9ca3af" },
};

// ============================================================
// 📌 COMPONENT SEAT MAP (Tích hợp sẵn) — bản thiết kế lại
// ============================================================
const SeatMap = ({ seatsByRow = {}, seatStats = {}, roomName = "" }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [filterType, setFilterType] = useState("all");
  const [scale, setScale] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Màu sắc Dark Mode
  const DARK_THEME_LOCAL = {
    bg: "#0a1628",
    cardBg: "#0f1f3a",
    stageWell: "#081120",
    border: "#1a3a5c",
    text: "#e8f4f8",
    textSecondary: "#88b4d8",
    inputBg: "#0a1f35",
    hoverBg: "#142d4f",
    accent: "#4a9eff",
    accentShadow: "rgba(74, 158, 255, 0.25)",
  };

  const accentColor = isDark ? DARK_THEME_LOCAL.accent : "#f97316";
  const bg = isDark ? DARK_THEME_LOCAL.cardBg : "white";
  const border = isDark ? DARK_THEME_LOCAL.border : "#eef1f6";
  const textColor = isDark ? DARK_THEME_LOCAL.text : "#0f172a";
  const subColor = isDark ? DARK_THEME_LOCAL.textSecondary : "#64748b";
  const inputBg = isDark ? DARK_THEME_LOCAL.inputBg : "#f8fafc";
  const stageWell = isDark ? DARK_THEME_LOCAL.stageWell : "#f4f6fa";

  // Lọc ghế theo loại
  const filteredSeats = useMemo(() => {
    if (filterType === "all") return seatsByRow;

    const filtered = {};
    Object.entries(seatsByRow).forEach(([row, seats]) => {
      const filteredSeats = seats.filter((s) => {
        const type = s.SeatType || s.seat_type || "Normal";
        return type.toLowerCase() === filterType.toLowerCase();
      });
      if (filteredSeats.length > 0) {
        filtered[row] = filteredSeats;
      }
    });
    return filtered;
  }, [seatsByRow, filterType]);

  // Đếm số lượng theo loại ghế
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

  // Render một ghế — hình dáng ghế rạp thực tế (lưng ghế bo góc + tựa)
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
      selectedSeat &&
      (selectedSeat.SeatId || selectedSeat.id) === (seat.SeatId || seat.id);

    let fill = typeConfig.gradient;
    if (isInactive) {
      fill = isDark ? "#1c2942" : "#e2e8f0";
    } else if (isBroken) {
      fill = "linear-gradient(145deg,#7a8494,#6b7280)";
    } else if (isBooked) {
      fill =
        seatStatus === "Reserved"
          ? "linear-gradient(145deg,#fbbf24,#f59e0b)"
          : "linear-gradient(145deg,#f87171,#ef4444)";
    }

    const isCouple = seatType === "Couple";
    const width = isCouple ? "46px" : "27px";
    const height = isCouple ? "26px" : "24px";

    return (
      <Tooltip
        key={seat.SeatId || seat.id}
        label={
          <Box p="2" minW="130px">
            <Text fontWeight="700" fontSize="13px" color={isDark ? "white" : "black"}>
              {typeConfig.label} · {statusConfig.label}
            </Text>
            <Text fontSize="11px" color={isDark ? "#94a3b8" : "#64748b"}>
              Hàng {seat.Row || seat.row} · Ghế {seat.Number || seat.number}
            </Text>
            {seat.SeatId && (
              <Text fontSize="10px" color={isDark ? "#64748b" : "#94a3b8"}>
                ID: {seat.SeatId}
              </Text>
            )}
          </Box>
        }
        placement="top"
        hasArrow
        bg={isDark ? DARK_THEME_LOCAL.cardBg : "white"}
        color={isDark ? DARK_THEME_LOCAL.text : "#0f172a"}
        border={`1px solid ${border}`}
        borderRadius="8px"
        boxShadow="lg"
      >
        <Box
          as="button"
          type="button"
          position="relative"
          w={width}
          h={height}
          cursor="pointer"
          onClick={() => setSelectedSeat(seat)}
          transition="transform 0.15s ease, filter 0.15s ease"
          _hover={{ transform: "translateY(-2px) scale(1.08)" }}
          _focusVisible={{ outline: `2px solid ${accentColor}`, outlineOffset: "2px" }}
        >
          {/* Tựa lưng ghế */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="70%"
            borderRadius={isCouple ? "7px 7px 3px 3px" : "5px 5px 2px 2px"}
            bgGradient={fill}
            opacity={isDisabled && !isBooked ? 0.55 : 1}
            boxShadow={
              isSelected
                ? `0 0 0 2px white, 0 0 0 4px ${accentColor}`
                : isDark
                ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 4px rgba(0,0,0,0.35)"
                : "inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.12)"
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!isDisabled && (
              <Icon as={typeConfig.icon} boxSize={isCouple ? "11px" : "9px"} color="white" opacity={0.92} />
            )}
            {isBooked && (
              <Icon as={MdClose} boxSize="12px" color="white" />
            )}
            {isBroken && (
              <Text fontSize="9px" fontWeight="800" color="white">!</Text>
            )}
          </Box>
          {/* Đế / chân ghế */}
          <Box
            position="absolute"
            bottom="0"
            left="12%"
            right="12%"
            h="4px"
            borderRadius="0 0 2px 2px"
            bg={isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.14)"}
          />
          {/* Số ghế */}
          <Text
            position="absolute"
            top="2px"
            left="0"
            right="0"
            textAlign="center"
            fontSize="7px"
            fontWeight="800"
            color="white"
            opacity={isDisabled ? 0.85 : 0.75}
            pointerEvents="none"
          >
            {isCouple
              ? `${seat.Number || seat.number}-${(seat.Number || seat.number) + 1}`
              : seat.Number || seat.number}
          </Text>
        </Box>
      </Tooltip>
    );
  };

  // Lấy danh sách các hàng ghế
  const rows = Object.keys(filteredSeats).sort();

  // Tính số cột
  const colCount = useMemo(() => {
    if (rows.length === 0) return 0;
    return filteredSeats[rows[0]]?.length || 0;
  }, [filteredSeats, rows]);

  return (
    <Box>
      {/* Toolbar */}
      <Flex
        justify="space-between"
        align="center"
        mb="16px"
        flexWrap="wrap"
        gap="10px"
        p="10px 14px"
        borderRadius="12px"
        bg={inputBg}
        border={`1px solid ${border}`}
      >
        <Flex align="center" gap="10px">
          <Flex
            align="center"
            justify="center"
            w="34px"
            h="34px"
            borderRadius="9px"
            bg={isDark ? "rgba(74,158,255,0.15)" : "rgba(249,115,22,0.12)"}
          >
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
          {/* Filter theo loại ghế */}
          <Select
            size="sm"
            w="150px"
            borderRadius="8px"
            bg={isDark ? DARK_THEME_LOCAL.cardBg : "white"}
            border={`1px solid ${border}`}
            color={textColor}
            fontSize="11px"
            fontWeight="700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            _focus={{ border: `1px solid ${accentColor}`, boxShadow: `0 0 0 1px ${accentColor}` }}
            icon={<Icon as={MdFilterList} />}
          >
            <option value="all">Tất cả ghế</option>
            <option value="normal">Ghế thường</option>
            <option value="vip">Ghế VIP</option>
            <option value="couple">Ghế đôi</option>
            <option value="sweetbox">Sweetbox</option>
            <option value="accessible">Tiếp cận</option>
          </Select>

          {/* Zoom controls */}
          <Flex
            gap="1"
            bg={isDark ? DARK_THEME_LOCAL.cardBg : "white"}
            borderRadius="8px"
            border={`1px solid ${border}`}
            p="2px"
            align="center"
          >
            <Button
              size="xs"
              w="26px"
              h="26px"
              minW="26px"
              p="0"
              borderRadius="6px"
              bg="transparent"
              color={subColor}
              _hover={{ bg: isDark ? DARK_THEME_LOCAL.hoverBg : "#f1f5f9", color: accentColor }}
              onClick={() => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
              aria-label="Phóng to"
            >
              <Icon as={MdZoomIn} boxSize="14px" />
            </Button>
            <Text fontSize="10px" fontWeight="800" color={textColor} minW="34px" textAlign="center">
              {Math.round(scale * 100)}%
            </Text>
            <Button
              size="xs"
              w="26px"
              h="26px"
              minW="26px"
              p="0"
              borderRadius="6px"
              bg="transparent"
              color={subColor}
              _hover={{ bg: isDark ? DARK_THEME_LOCAL.hoverBg : "#f1f5f9", color: accentColor }}
              onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
              aria-label="Thu nhỏ"
            >
              <Icon as={MdZoomOut} boxSize="14px" />
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Seat Grid */}
      {rows.length > 0 ? (
        <Box
          position="relative"
          overflowX="auto"
          overflowY="hidden"
          py="8"
          px="4"
          bg={
            isDark
              ? "radial-gradient(ellipse at top, rgba(74,158,255,0.06), transparent 60%), #08101f"
              : `radial-gradient(ellipse at top, ${stageWell}, #fbfcfe 65%)`
          }
          borderRadius="16px"
          border={`1px solid ${border}`}
        >
          <Flex
            direction="column"
            gap="7px"
            align="center"
            transform={`scale(${scale})`}
            transformOrigin="top center"
            transition="transform 0.2s ease"
          >
            {/* Màn hình chiếu — cong, phát sáng */}
            <Box mb="8" textAlign="center" w="100%" maxW="480px" position="relative">
              <Box
                h="14px"
                mx="auto"
                maxW="86%"
                borderRadius="50% 50% 0 0 / 100% 100% 0 0"
                bg={
                  isDark
                    ? "linear-gradient(180deg, rgba(74,158,255,0.55), rgba(74,158,255,0))"
                    : "linear-gradient(180deg, rgba(249,115,22,0.55), rgba(249,115,22,0))"
                }
                filter="blur(0px)"
              />
              <Box
                h="3px"
                mx="auto"
                maxW="86%"
                borderRadius="full"
                bg={isDark ? "linear-gradient(90deg,#1e3a5f,#4a9eff,#1e3a5f)" : "linear-gradient(90deg,#fed7aa,#f97316,#fed7aa)"}
                boxShadow={isDark ? "0 0 16px rgba(74,158,255,0.55)" : "0 0 16px rgba(249,115,22,0.4)"}
                mb="2"
              />
              <Text
                fontSize="9px"
                fontWeight="800"
                color={subColor}
                letterSpacing="4px"
                textTransform="uppercase"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="1"
              >
                <Icon as={MdLocalMovies} boxSize="11px" /> Màn hình
              </Text>
            </Box>

            {/* Các hàng ghế */}
            {rows.map((row) => (
              <Flex key={row} gap="6px" align="center" wrap="nowrap">
                <Text
                  fontSize="10px"
                  fontWeight="800"
                  color={isDark ? DARK_THEME_LOCAL.textSecondary : "#94a3b8"}
                  w="18px"
                  textAlign="center"
                  fontFamily="mono"
                >
                  {row}
                </Text>
                <Flex gap="4px" flexWrap="nowrap">
                  {filteredSeats[row].map((seat) => renderSeat(seat))}
                </Flex>
                <Text
                  fontSize="10px"
                  fontWeight="800"
                  color={isDark ? DARK_THEME_LOCAL.textSecondary : "#94a3b8"}
                  w="18px"
                  textAlign="center"
                  fontFamily="mono"
                >
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
            {filterType !== "all"
              ? `Không có ghế loại "${filterType}" trong phòng này`
              : "Chưa có ghế nào được tạo cho phòng này"}
          </Text>
          {filterType !== "all" && (
            <Button size="sm" mt="3" variant="ghost" color={accentColor} onClick={() => setFilterType("all")}>
              Xem tất cả ghế
            </Button>
          )}
        </Box>
      )}

      {/* Legend */}
      <Flex
        justify="center"
        gap={{ base: "10px", md: "18px" }}
        mt="5"
        flexWrap="wrap"
        borderTop={`1px solid ${border}`}
        pt="14px"
        align="center"
      >
        <Flex align="center" gap="6px" flexWrap="wrap">
          <Text fontSize="10px" fontWeight="700" color={subColor} letterSpacing="0.5px">
            TRẠNG THÁI
          </Text>
          {Object.entries(SEAT_STATUS).map(([key, status]) => (
            <Flex
              key={key}
              align="center"
              gap="5px"
              px="8px"
              py="4px"
              borderRadius="full"
              bg={isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"}
            >
              <Box w="7px" h="7px" borderRadius="full" bg={status.color} />
              <Text fontSize="10px" fontWeight="600" color={subColor}>
                {status.label}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Box w="1px" h="18px" bg={border} display={{ base: "none", md: "block" }} />

        <Flex align="center" gap="6px" flexWrap="wrap">
          <Text fontSize="10px" fontWeight="700" color={subColor} letterSpacing="0.5px">
            LOẠI GHẾ
          </Text>
          {Object.entries(SEAT_TYPES).map(([key, type]) => (
            <Flex
              key={key}
              align="center"
              gap="5px"
              px="8px"
              py="4px"
              borderRadius="full"
              bg={type.bg}
            >
              <Icon as={type.icon} boxSize="10px" color={type.color} />
              <Text fontSize="10px" fontWeight="600" color={subColor}>
                {type.shortLabel}
              </Text>
              {typeCounts[key] > 0 && (
                <Badge fontSize="8px" bg="transparent" color={type.color} px="0" fontWeight="800">
                  {typeCounts[key]}
                </Badge>
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Thông tin ghế được chọn */}
      {selectedSeat && (
        <Box
          mt="4"
          p="4"
          borderRadius="12px"
          bg={inputBg}
          border={`1px solid ${border}`}
          sx={{ animation: `${fadeUp} 0.2s ease both` }}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="3">
              <Box
                w="36px"
                h="36px"
                borderRadius="10px"
                bgGradient={
                  SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]
                    ?.gradient || SEAT_TYPES.Normal.gradient
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 3px 8px rgba(0,0,0,0.18)"
              >
                <Icon
                  as={
                    SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]
                      ?.icon || FaChair
                  }
                  boxSize="15px"
                  color="white"
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="800" color={textColor}>
                  Ghế {selectedSeat.Row || selectedSeat.row}
                  {selectedSeat.Number || selectedSeat.number}
                </Text>
                <Flex gap="2" mt="1">
                  <Badge
                    px="2"
                    py="1"
                    borderRadius="4px"
                    fontSize="9px"
                    fontWeight="700"
                    bg={
                      SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]
                        ?.bg || SEAT_TYPES.Normal.bg
                    }
                    color={
                      SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]
                        ?.color || "#3b82f6"
                    }
                  >
                    {SEAT_TYPES[selectedSeat.SeatType || selectedSeat.seat_type || "Normal"]
                      ?.label || "Ghế thường"}
                  </Badge>
                  <Badge
                    px="2"
                    py="1"
                    borderRadius="4px"
                    fontSize="9px"
                    fontWeight="700"
                    bg={
                      SEAT_STATUS[selectedSeat.Status || selectedSeat.status || "Available"]
                        ?.color || "#10b981"
                    }
                    color="white"
                  >
                    {SEAT_STATUS[selectedSeat.Status || selectedSeat.status || "Available"]
                      ?.label || "Trống"}
                  </Badge>
                </Flex>
              </Box>
            </Flex>
            <Button
              size="xs"
              variant="ghost"
              color={subColor}
              borderRadius="full"
              onClick={() => setSelectedSeat(null)}
              aria-label="Đóng"
            >
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

  // Màu sắc Dark Mode
  const DARK_THEME_MAIN = {
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
  };

  // Load chi tiết phòng khi component mount
  useEffect(() => {
    if (room?.RoomId) {
      loadRoomDetail(room.RoomId).then((data) => {
        if (data) {
          setLocalRoom(data);
        }
      });
    }
  }, [room?.RoomId, loadRoomDetail]);

  // Nếu đang loading
  if (loadingDetail) {
    return (
      <Flex justify="center" align="center" minH="400px" direction="column" gap="4">
        <Spinner
          size="xl"
          color={darkMode ? DARK_THEME_MAIN.accent : "#f97316"}
          thickness="3px"
        />
        <Text
          color={darkMode ? DARK_THEME_MAIN.textSecondary : "#64748b"}
          fontSize="14px"
          fontWeight="500"
        >
          Đang tải chi tiết phòng...
        </Text>
      </Flex>
    );
  }

  const roomData = roomDetail || localRoom;

  const isMaintenance = roomData.Status === "Maintenance";
  const isActive = roomData.Status === "Active";

  const totalSeats = roomData.TotalSeats || roomData.SeatCount || 0;

  // Màu sắc
  const accentColor = darkMode ? DARK_THEME_MAIN.accent : "#f97316";
  const accentShadow = darkMode
    ? DARK_THEME_MAIN.accentShadow
    : "rgba(249,115,22,0.35)";
  const gradientBg = darkMode
    ? `linear-gradient(135deg, ${DARK_THEME_MAIN.accent}, ${DARK_THEME_MAIN.accentLight})`
    : "linear-gradient(135deg,#f97316,#fb923c)";
  const bg = darkMode ? DARK_THEME_MAIN.cardBg : "white";
  const border = darkMode ? DARK_THEME_MAIN.border : "#f1f5f9";
  const textColor = darkMode ? DARK_THEME_MAIN.text : "#0f172a";
  const subColor = darkMode ? DARK_THEME_MAIN.textSecondary : "#64748b";
  const detailBg = darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc";

  // Lấy danh sách ghế từ roomData
  const seatsByRow = roomData.SeatsByRow || {};
  const seatStats = roomData.SeatStats || {
    total: 0,
    available: 0,
    booked: 0,
    broken: 0,
    inactive: 0,
    reserved: 0,
  };

  return (
    <Box sx={{ animation: `${slideIn} 0.3s ease both` }}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <Flex
        align="center"
        justify="space-between"
        mb="18px"
        gap="10px"
        flexWrap="wrap"
      >
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={subColor}
          borderRadius="10px"
          h="38px"
          fontSize="13px"
          fontWeight="600"
          border={`1.5px solid ${border}`}
          _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f8fafc" }}
          onClick={onBack}
        >
          Quay lại danh sách
        </Button>
        <Flex gap="8px" flexWrap="wrap">
          <Button
            h="38px"
            px="12px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc"}
            color={textColor}
            border={`1px solid ${darkMode ? DARK_THEME_MAIN.border : "#e2e8f0"}`}
            _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f1f5f9" }}
            leftIcon={<Icon as={MdRefresh} />}
            onClick={() => loadRoomDetail(roomData.RoomId)}
          >
            Làm mới
          </Button>
          <Button
            h="38px"
            px="12px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={darkMode ? DARK_THEME_MAIN.inputBg : "#f8fafc"}
            color={textColor}
            border={`1px solid ${darkMode ? DARK_THEME_MAIN.border : "#e2e8f0"}`}
            _hover={{ bg: darkMode ? DARK_THEME_MAIN.hoverBg : "#f1f5f9" }}
            leftIcon={<Icon as={MdEdit} />}
            onClick={() => onEdit(room)}
          >
            Chỉnh sửa
          </Button>
          <Button
            h="38px"
            px={{ base: "14px", md: "20px" }}
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={
              isMaintenance
                ? "linear-gradient(135deg,#059669,#34d399)"
                : "linear-gradient(135deg,#f59e0b,#fbbf24)"
            }
            color="white"
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} />}
            onClick={() => onToggle(roomData.RoomId)}
          >
            {isMaintenance ? "Kích hoạt phòng" : "Đánh dấu bảo trì"}
          </Button>
        </Flex>
      </Flex>

      {/* ============================================ */}
      {/* MAIN CONTENT - THÔNG TIN PHÒNG */}
      {/* ============================================ */}
      <Box
        bg={bg}
        borderRadius="20px"
        border={`1px solid ${border}`}
        boxShadow={
          darkMode
            ? `0 2px 16px ${DARK_THEME_MAIN.accentShadow}`
            : "0 2px 16px rgba(0,0,0,0.06)"
        }
        overflow="hidden"
        mb="16px"
      >
        <Box h="5px" bg={gradientBg} />

        <Box p={{ base: "20px", md: "28px" }}>
          <Flex direction={{ base: "column", md: "row" }} gap="24px">
            {/* LEFT COLUMN - Thông tin cơ bản */}
            <Box flex="1">
              <Flex align="flex-start" gap="16px" mb="16px">
                <Box
                  w="72px"
                  h="72px"
                  borderRadius="18px"
                  flexShrink="0"
                  bg={
                    isActive
                      ? gradientBg
                      : darkMode
                      ? DARK_THEME_MAIN.inputBg
                      : "linear-gradient(135deg,#64748b,#94a3b8)"
                  }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow={
                    isActive
                      ? `0 4px 14px ${accentShadow}`
                      : darkMode
                      ? `0 4px 14px ${DARK_THEME_MAIN.accentShadow}`
                      : "0 4px 14px rgba(100,116,139,0.3)"
                  }
                >
                  <Icon as={MdMeetingRoom} boxSize="32px" color="white" />
                </Box>
                <Box>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color={subColor}
                    letterSpacing="1px"
                    textTransform="uppercase"
                    mb="2px"
                  >
                    {cinemaName}
                  </Text>
                  <Text
                    fontSize={{ base: "22px", md: "28px" }}
                    fontWeight="900"
                    color={textColor}
                    letterSpacing="-0.6px"
                    lineHeight="1"
                  >
                    {roomData.Name}
                  </Text>
                  <Flex gap="8px" mt="10px" flexWrap="wrap">
                    <TypeBadge
                      type={roomData.RoomType || "Standard"}
                      isDark={darkMode}
                    />
                    <StatusPill status={roomData.Status} isDark={darkMode} />
                  </Flex>
                </Box>
              </Flex>

              <Box h="1px" bg={border} mb="16px" />

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mb="16px">
                <Box
                  p="14px 16px"
                  borderRadius="12px"
                  bg={detailBg}
                  border={`1px solid ${border}`}
                >
                  <Flex align="center" gap="8px" mb="6px">
                    <Icon as={MdTag} boxSize="16px" color={accentColor} />
                    <Text fontSize="11px" fontWeight="700" color={subColor}>
                      Loại phòng
                    </Text>
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>
                    {roomData.RoomType || "Standard"}
                  </Text>
                </Box>
                <Box
                  p="14px 16px"
                  borderRadius="12px"
                  bg={detailBg}
                  border={`1px solid ${border}`}
                >
                  <Flex align="center" gap="8px" mb="6px">
                    <Icon as={FaChair} boxSize="16px" color={accentColor} />
                    <Text fontSize="11px" fontWeight="700" color={subColor}>
                      Tổng số ghế
                    </Text>
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>
                    {totalSeats} ghế
                  </Text>
                </Box>
              </Grid>

              <Box
                p="12px 16px"
                borderRadius="12px"
                bg={detailBg}
                border={`1px solid ${border}`}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="6px">
                    <Icon as={MdInfo} boxSize="14px" color={subColor} />
                    <Text fontSize="11px" fontWeight="700" color={subColor}>
                      ID Phòng Chiếu
                    </Text>
                  </Flex>
                  <Text
                    fontSize="13px"
                    fontWeight="800"
                    color={textColor}
                    fontFamily="mono"
                  >
                    {roomData.RoomId}
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* RIGHT COLUMN - Thông tin chi tiết */}
            <Box flex="1">
              {/* Cinema Info */}
              <Box
                bg={detailBg}
                borderRadius="14px"
                border={`1px solid ${border}`}
                p="16px"
                mb="14px"
              >
                <Flex align="center" gap="8px" mb="12px">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="8px"
                    bg={
                      darkMode
                        ? DARK_THEME_MAIN.accent
                        : "linear-gradient(135deg,#3b82f6,#60a5fa)"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaBuilding} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>
                      Thông Tin Rạp Chiếu
                    </Text>
                    <Text fontSize="11px" color={subColor}>
                      Chi tiết về rạp phim
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  align="center"
                  gap="12px"
                  p="10px 12px"
                  borderRadius="10px"
                  bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"}
                  border={`1px solid ${border}`}
                >
                  <Icon as={FaBuilding} boxSize="18px" color={accentColor} />
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={subColor}>
                      Tên rạp
                    </Text>
                    <Text fontSize="13px" fontWeight="600" color={textColor}>
                      {cinemaName}
                    </Text>
                  </Box>
                </Flex>
              </Box>

              {/* Created Info */}
              <Box
                bg={detailBg}
                borderRadius="14px"
                border={`1px solid ${border}`}
                p="16px"
                mb="14px"
              >
                <Flex align="center" gap="8px" mb="12px">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="8px"
                    bg={
                      darkMode
                        ? "#6ab0ff"
                        : "linear-gradient(135deg,#8b5cf6,#a78bfa)"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={MdCalendarToday} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>
                      Thông Tin Tạo
                    </Text>
                    <Text fontSize="11px" color={subColor}>
                      Chi tiết về người tạo phòng chiếu
                    </Text>
                  </Box>
                </Flex>
                <Flex direction="column" gap="8px">
                  <Flex
                    align="center"
                    gap="12px"
                    p="10px 12px"
                    borderRadius="10px"
                    bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"}
                    border={`1px solid ${border}`}
                  >
                    <Icon
                      as={MdPerson}
                      boxSize="18px"
                      color={darkMode ? "#6ab0ff" : "#8b5cf6"}
                    />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>
                        Người tạo
                      </Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>
                        {roomData.CreatedBy || "N/A"}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    align="center"
                    gap="12px"
                    p="10px 12px"
                    borderRadius="10px"
                    bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"}
                    border={`1px solid ${border}`}
                  >
                    <Icon
                      as={MdCalendarToday}
                      boxSize="18px"
                      color={darkMode ? "#6ab0ff" : "#8b5cf6"}
                    />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>
                        Ngày tạo
                      </Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>
                        {roomData.CreatedAt
                          ? new Date(roomData.CreatedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>

              {/* Updated Info */}
              <Box
                bg={detailBg}
                borderRadius="14px"
                border={`1px solid ${border}`}
                p="16px"
              >
                <Flex align="center" gap="8px" mb="12px">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="8px"
                    bg={
                      darkMode
                        ? "#4ade80"
                        : "linear-gradient(135deg,#059669,#34d399)"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={MdAccessTime} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>
                      Cập Nhật Gần Nhất
                    </Text>
                    <Text fontSize="11px" color={subColor}>
                      Lịch sử thay đổi phòng chiếu
                    </Text>
                  </Box>
                </Flex>
                <Flex direction="column" gap="8px">
                  <Flex
                    align="center"
                    gap="12px"
                    p="10px 12px"
                    borderRadius="10px"
                    bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"}
                    border={`1px solid ${border}`}
                  >
                    <Icon
                      as={MdPerson}
                      boxSize="18px"
                      color={darkMode ? "#4ade80" : "#059669"}
                    />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>
                        Người cập nhật
                      </Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>
                        {roomData.UpdatedBy || "N/A"}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    align="center"
                    gap="12px"
                    p="10px 12px"
                    borderRadius="10px"
                    bg={darkMode ? DARK_THEME_MAIN.cardBg : "white"}
                    border={`1px solid ${border}`}
                  >
                    <Icon
                      as={MdAccessTime}
                      boxSize="18px"
                      color={darkMode ? "#4ade80" : "#059669"}
                    />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>
                        Ngày cập nhật
                      </Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>
                        {roomData.UpdatedAt
                          ? new Date(roomData.UpdatedAt).toLocaleString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* ============================================ */}
      {/* SEAT MAP */}
      {/* ============================================ */}
      <Box
        bg={bg}
        borderRadius="16px"
        border={`1px solid ${border}`}
        boxShadow={
          darkMode
            ? `0 1px 4px ${DARK_THEME_MAIN.accentShadow}`
            : "0 1px 4px rgba(0,0,0,0.04)"
        }
        p="20px"
        mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Flex align="center" gap="8px" mb="16px">
          <Icon as={MdChair} boxSize="18px" color={accentColor} />
          <Text fontSize="15px" fontWeight="800" color={textColor}>
            Sơ đồ ghế ngồi
          </Text>
        </Flex>
        <SeatMap
          seatsByRow={seatsByRow}
          seatStats={seatStats}
          roomName={roomData.Name}
        />
      </Box>

      {/* ============================================ */}
      {/* MAINTENANCE ALERT */}
      {/* ============================================ */}
      {isMaintenance && (
        <Box
          mt="4"
          p="4"
          borderRadius="12px"
          bg={darkMode ? "#7f1d1d" : "#fef2f2"}
          border={`1px solid ${darkMode ? "#991b1b" : "#fca5a5"}`}
        >
          <Flex align="center" gap="3">
            <Icon as={MdBuild} boxSize="20px" color={darkMode ? "#f87171" : "#dc2626"} />
            <Box>
              <Text
                fontSize="14px"
                fontWeight="700"
                color={darkMode ? "#f87171" : "#dc2626"}
              >
                Phòng đang bảo trì
              </Text>
              <Text fontSize="12px" color={darkMode ? "#fca5a5" : "#991b1b"}>
                Phòng này không nhận suất chiếu mới. Nhấn "Kích hoạt phòng" để đưa
                vào hoạt động trở lại.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default RoomDetail;