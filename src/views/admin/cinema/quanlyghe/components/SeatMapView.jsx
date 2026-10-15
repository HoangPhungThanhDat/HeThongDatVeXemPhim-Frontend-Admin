// src/views/admin/quanlyghe/components/SeatMapView.jsx

import React from "react";
import {
  Box, Flex, Text, Button, Icon, useColorMode,
  Select, SimpleGrid, Spinner
} from "@chakra-ui/react";
import {
  MdArrowBack, MdLocationOn, MdZoomIn, MdZoomOut,
  MdLayers, MdAdd, MdRestore, MdMeetingRoom, MdEdit,
  MdEditOff
} from "react-icons/md";
import { getSeatColors } from "./shared/StatCard";
import StatCard from "./shared/StatCard";
import { fadeIn, fadeUp, shimmer } from "./shared/animations";
import RoomTypeBadge from "./RoomTypeBadge";
import StatusDot from "./StatusDot";
import Seat from "./Seat";
import EditSeatModal from "./EditSeatModal";
import AddRowModal from "./AddRowModal";
import AddColumnModal from "./AddColumnModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { ROW_LABELS, SEAT_TYPES } from "../constants";

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
};

// ✅ Hàm lấy màu chính xác cho từng loại ghế
const getSeatTypeColor = (type) => {
  const colors = {
    regular: { bg: "#fff7ed", border: "#fb923c" },
    vip: { bg: "#f5f3ff", border: "#a78bfa" },
    couple: { bg: "#fef3c7", border: "#fcd34d" },
    sweetbox: { bg: "#fdf2f8", border: "#f9a8d4" },
    accessible: { bg: "#f0f9ff", border: "#7dd3fc" },
  };
  return colors[type] || colors.regular;
};

export default function SeatMapView({ 
  room, 
  cinemaName, 
  onBack, 
  onEditMode, 
  isEditMode = false,
  seatsData = [],
  scale = 1,
  filter = "all",
  stats = { total: 0, booked: 0, empty: 0 },
  selectedSeat = null,
  editSeatModal,
  addRowModal,
  addColModal,
  deleteDialog,
  deleteDialogConfig,
  loading = false,
  handleSeatEdit,
  handleSaveSeat,
  handleAddRows,
  handleAddCols,
  handleDeleteSeat,
  handleResetSeats,
  zoomIn,
  zoomOut,
  setFilter,
  setDeleteTarget,
  roomId
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);

  // Dark mode colors
  const accentColor = isDark ? DARK_THEME.accent : "#f97316";
  const accentShadow = isDark ? DARK_THEME.accentShadow : "rgba(249,115,22,0.3)";
  const gradientBg = isDark 
    ? `linear-gradient(135deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight})`
    : "linear-gradient(135deg, #f97316, #fb923c)";
  const gradientScreen = isDark 
    ? `linear-gradient(90deg, transparent 5%, ${DARK_THEME.accent} 30%, ${DARK_THEME.accentLight} 50%, ${DARK_THEME.accent} 70%, transparent 95%)`
    : "linear-gradient(90deg, transparent 5%, #f97316 30%, #fbbf24 50%, #f97316 70%, transparent 95%)";
  const borderCard = isDark ? DARK_THEME.border : "#f1f5f9";
  const textColor = isDark ? DARK_THEME.text : "#0f172a";
  const subColor = isDark ? DARK_THEME.textSecondary : "#64748b";
  const labelColor = isDark ? DARK_THEME.labelColor : "#94a3b8";
  const bgCard = isDark ? DARK_THEME.cardBg : "white";
  const inputBg = isDark ? DARK_THEME.inputBg : "#f8fafc";
  const inputBorder = isDark ? DARK_THEME.border : "#e2e8f0";
  const btnBg = isDark ? DARK_THEME.inputBg : "#f8fafc";
  const btnBorder = isDark ? DARK_THEME.border : "#e2e8f0";
  const btnColor = isDark ? DARK_THEME.textSecondary : "#475569";
  const btnHoverBg = isDark ? DARK_THEME.hoverBg : "#f1f5f9";

  // Kiểm tra dữ liệu hợp lệ
  const isValidData = React.useMemo(() => {
    if (!seatsData || seatsData.length === 0) return false;
    return seatsData.some(row => row && row.length > 0);
  }, [seatsData]);

  // Hàm xử lý click chỉnh sửa ghế
  const handleSeatEditClick = (seat) => {
    console.log("🔑 Seat clicked for edit:", seat);
    
    if (isEditMode && handleSeatEdit) {
      handleSeatEdit(seat);
      if (editSeatModal && editSeatModal.onOpen) {
        console.log("🔑 Opening edit modal...");
        editSeatModal.onOpen();
      } else {
        console.error("❌ editSeatModal.onOpen is not available");
      }
    }
  };

  // Hàm xử lý xóa ghế
  const handleSeatDeleteClick = (seat) => {
    console.log("🗑️ Seat clicked for delete:", seat);
    if (setDeleteTarget) {
      const target = { 
        ...seat, 
        type: "seat",
        SeatId: seat.SeatId || seat.id,
        Row: seat.Row || seat.row,
        Number: seat.Number || seat.num,
        row: seat.row,
        col: seat.col,
      };
      setDeleteTarget(target);
    }
  };

  // ✅ Kiểm tra seatsData có hợp lệ không
  const safeSeatsData = React.useMemo(() => {
    if (!seatsData || !Array.isArray(seatsData) || seatsData.length === 0) {
      return [];
    }
    return seatsData.filter(row => row && row.length > 0);
  }, [seatsData]);

  // ✅ Lấy số cột tối đa
  const maxCols = safeSeatsData.length > 0 ? safeSeatsData[0]?.length || 0 : 0;

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "start", md: "center" }} justify="space-between"
        direction={{ base: "column", md: "row" }} gap="12px" mb="20px"
      >
        <Flex align="center" gap="12px" flexWrap="wrap">
          <Button 
            leftIcon={<Icon as={MdArrowBack} />} 
            variant="ghost"
            color={subColor} 
            borderRadius="10px" 
            h="38px" 
            fontSize="13px" 
            fontWeight="600"
            border={`1.5px solid ${borderCard}`} 
            _hover={{ bg: isDark ? DARK_THEME.hoverBg : "#f8fafc" }}
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Box>
            <Flex align="center" gap="8px" mb="2px" flexWrap="wrap">
              <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="900" color={textColor} letterSpacing="-0.4px">
                {room?.name || "Phòng chiếu"}
              </Text>
              <RoomTypeBadge type={room?.type || "standard"} isDark={isDark} />
              {isEditMode && (
                <Box px="8px" py="3px" borderRadius="6px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize="10px" fontWeight="800" color="#dc2626">Chế độ chỉnh sửa</Text>
                </Box>
              )}
            </Flex>
            <Flex align="center" gap="5px">
              <Icon as={MdLocationOn} boxSize="11px" color={subColor} />
              <Text fontSize="12px" color={subColor}>{cinemaName || "Đang tải..."}</Text>
            </Flex>
          </Box>
        </Flex>
        
        <Flex gap="8px" align="center" flexWrap="wrap">
          <StatusDot status={room?.status || "active"} isDark={isDark} />
          <Box w="1px" h="24px" bg={isDark ? DARK_THEME.border : "#e2e8f0"} />
          
          {!isEditMode ? (
            <Button
              leftIcon={<Icon as={MdEdit} />}
              size="sm"
              borderRadius="10px"
              h="34px"
              fontSize="12px"
              fontWeight="700"
              bg={gradientBg}
              color="white"
              boxShadow={`0 2px 8px ${accentShadow}`}
              _hover={{ 
                boxShadow: `0 4px 16px ${accentShadow}`,
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
              onClick={() => {
                if (onEditMode && room) {
                  onEditMode(room);
                }
              }}
            >
              Chỉnh sửa ghế
            </Button>
          ) : (
            <Button
              leftIcon={<Icon as={MdEditOff} />}
              size="sm"
              borderRadius="10px"
              h="34px"
              fontSize="12px"
              fontWeight="700"
              bg={btnBg}
              border={`1.5px solid ${borderCard}`}
              color={subColor}
              _hover={{ bg: btnHoverBg }}
              onClick={onBack}
            >
              Thoát chỉnh sửa
            </Button>
          )}
          
          <Flex bg={btnBg} border={`1px solid ${inputBorder}`} borderRadius="10px" overflow="hidden">
            {[
              { icon: MdZoomOut, action: zoomOut },
              { icon: MdZoomIn, action: zoomIn },
            ].map(({ icon: Ic, action }, i) => (
              <Button key={i} variant="ghost" h="34px" w="34px" p="0" borderRadius="0"
                _hover={{ bg: btnHoverBg, color: accentColor }} onClick={action}
              >
                <Icon as={Ic} boxSize="14px" />
              </Button>
            ))}
          </Flex>
          <Box px="10px" py="4px" borderRadius="8px" 
            bg={isDark ? DARK_THEME.inputBg : "#fff7ed"} 
            border={`1px solid ${isDark ? DARK_THEME.border : "#fed7aa"}`}>
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK_THEME.accent : "#f97316"}>
              {Math.round(scale * 100)}%
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Stats row */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
        <StatCard 
          label="Tổng ghế" 
          value={stats.total || 0} 
          accent={isDark ? DARK_THEME.accent : "#f97316"} 
          icon={MdLayers} 
          isDark={isDark}
        />
        <StatCard 
          label="Đã đặt" 
          value={stats.booked || 0} 
          accent="#dc2626" 
          icon={MdLayers} 
          isDark={isDark}
        />
        <StatCard 
          label="Còn trống" 
          value={stats.empty || 0} 
          accent="#059669" 
          icon={MdLayers} 
          isDark={isDark}
        />
        <StatCard 
          label="Tỉ lệ đặt" 
          value={stats.total > 0 ? `${Math.round((stats.booked/stats.total)*100)}%` : "0%"}
          accent="#7c3aed" 
          icon={MdLayers} 
          sub={`${stats.total || 0} ghế tổng cộng`}
          isDark={isDark}
        />
      </SimpleGrid>

      {/* Seat map card */}
      <Box bg={bgCard} borderRadius="18px" border={`1px solid ${borderCard}`}
        boxShadow={isDark ? `0 2px 12px ${DARK_THEME.accentShadow}` : "0 2px 12px rgba(0,0,0,0.06)"} overflow="hidden" mb="14px"
      >
        <Box h="3px" bg={isDark 
          ? `linear-gradient(90deg, ${DARK_THEME.accent}, ${DARK_THEME.accentLight}, ${DARK_THEME.accent})`
          : "linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
        }
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        <Flex align="center" justify="space-between" px="18px" py="14px"
          borderBottom={`1px solid ${isDark ? DARK_THEME.border : "#f8fafc"}`} flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px" flexWrap="wrap">
            <Icon as={MdLayers} boxSize="14px" color={accentColor} />
            <Text fontSize="13px" fontWeight="800" color={textColor}>Sơ đồ ghế ngồi</Text>
            {safeSeatsData.length > 0 && (
              <Box px="8px" py="2px" borderRadius="5px" 
                bg={isDark ? DARK_THEME.inputBg : "#fff7ed"} 
                border={`1px solid ${isDark ? DARK_THEME.border : "#fed7aa"}`}>
                <Text fontSize="10.5px" fontWeight="700" color={isDark ? DARK_THEME.accent : "#f97316"}>
                  {safeSeatsData.length} hàng × {maxCols} cột
                </Text>
              </Box>
            )}
            {isEditMode && (
              <>
                <Box px="8px" py="2px" borderRadius="5px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize="10px" fontWeight="700" color="#dc2626">
                    Click ghế để sửa · Click X để xóa
                  </Text>
                </Box>
                <Button size="xs" h="28px" px="8px" borderRadius="6px" fontSize="11px" fontWeight="700"
                  bg="#ecfdf5" color="#059669" border="1px solid #6ee7b7"
                  _hover={{ bg: "#d1fae5" }}
                  leftIcon={<Icon as={MdAdd} boxSize="12px" />}
                  onClick={addRowModal?.onOpen || (() => {})}
                >
                  Thêm hàng
                </Button>
                <Button size="xs" h="28px" px="8px" borderRadius="6px" fontSize="11px" fontWeight="700"
                  bg="#ecfdf5" color="#059669" border="1px solid #6ee7b7"
                  _hover={{ bg: "#d1fae5" }}
                  leftIcon={<Icon as={MdAdd} boxSize="12px" />}
                  onClick={addColModal?.onOpen || (() => {})}
                >
                  Thêm cột
                </Button>
                <Button size="xs" h="28px" px="8px" borderRadius="6px" fontSize="11px" fontWeight="700"
                  bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                  _hover={{ bg: "#fecaca" }}
                  leftIcon={<Icon as={MdRestore} boxSize="12px" />}
                  onClick={handleResetSeats}
                >
                  Đặt lại
                </Button>
              </>
            )}
          </Flex>
          <Select h="32px" fontSize="12px" fontWeight="600" color={textColor}
            bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="8px" w="140px"
            _focus={{ border: `1.5px solid ${accentColor}` }} 
            _hover={{ border: `1px solid ${accentColor}` }}
            value={filter} onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả ghế</option>
            <option value="booked">Đã đặt</option>
            <option value="empty">Còn trống</option>
          </Select>
        </Flex>

        {loading ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Spinner size="xl" color={accentColor} thickness="4px" />
            <Text fontSize="14px" color={subColor}>Đang tải sơ đồ ghế...</Text>
          </Flex>
        ) : room?.status === "maintenance" && !isEditMode ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Box w="56px" h="56px" borderRadius="16px" bg={isDark ? DARK_THEME.inputBg : "#fffbeb"} 
              border={`2px solid ${isDark ? DARK_THEME.border : "#fcd34d"}`}
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdMeetingRoom} boxSize="24px" color={isDark ? DARK_THEME.accent : "#f59e0b"} />
            </Box>
            <Text fontSize="16px" fontWeight="800" color={textColor}>Phòng đang bảo trì</Text>
            <Text fontSize="13px" color={subColor} textAlign="center" maxW="320px">
              Phòng chiếu này hiện không hoạt động. Vui lòng kiểm tra lại sau khi hoàn tất bảo trì.
            </Text>
            <Button
              mt="8px"
              size="sm"
              borderRadius="10px"
              bg={gradientBg}
              color="white"
              _hover={{ boxShadow: `0 4px 16px ${accentShadow}` }}
              onClick={() => onEditMode(room)}
            >
              <Icon as={MdEdit} boxSize="14px" mr="6px" />
              Chỉnh sửa phòng
            </Button>
          </Flex>
        ) : safeSeatsData.length === 0 ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Box w="56px" h="56px" borderRadius="16px" bg={isDark ? DARK_THEME.inputBg : "#f0f9ff"} 
              border={`2px solid ${isDark ? DARK_THEME.border : "#7dd3fc"}`}
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdLayers} boxSize="24px" color={isDark ? DARK_THEME.accent : "#0284c7"} />
            </Box>
            <Text fontSize="16px" fontWeight="700" color={textColor}>Chưa có ghế</Text>
            <Text fontSize="13px" color={subColor} textAlign="center" maxW="320px">
              {loading ? "Đang tải dữ liệu..." : "Phòng này chưa có ghế nào."}
              {isEditMode && !loading ? " Hãy sử dụng nút Thêm hàng hoặc Thêm cột để tạo ghế mới." : ""}
            </Text>
            {!isEditMode && !loading && (
              <Button
                mt="8px"
                size="sm"
                borderRadius="10px"
                bg={gradientBg}
                color="white"
                _hover={{ boxShadow: `0 4px 16px ${accentShadow}` }}
                onClick={() => onEditMode(room)}
              >
                <Icon as={MdEdit} boxSize="14px" mr="6px" />
                Chỉnh sửa phòng
              </Button>
            )}
          </Flex>
        ) : (
          <Box p="24px 20px" overflowX="auto">
            {/* Màn hình chiếu */}
            <Flex direction="column" align="center" mb="32px">
              <Box
                w={{ base: "60%", md: "45%" }}
                h="4px"
                borderRadius="full"
                bg={gradientScreen}
                mb="4px"
                opacity="0.6"
              />
              <Box
                w={{ base: "70%", md: "55%" }}
                h="2px"
                borderRadius="full"
                bg={isDark 
                  ? `linear-gradient(90deg, transparent, ${DARK_THEME.accent}15, transparent)`
                  : "linear-gradient(90deg, transparent, rgba(249,115,22,0.12), transparent)"
                }
              />
              <Text 
                fontSize="10px" 
                fontWeight="700" 
                color={labelColor}
                letterSpacing="8px" 
                textTransform="uppercase"
                mt="8px"
                opacity="0.5"
              >
                MÀN HÌNH
              </Text>
            </Flex>

            {/* Sơ đồ ghế */}
            <Flex direction="column" align="center" gap={`${10 * scale}px`}>
              {safeSeatsData.map((row, ri) => {
                if (!row || row.length === 0) {
                  return null;
                }
                
                return (
                  <Flex key={ri} align="center" gap={`${12 * scale}px`}>
                    <Box 
                      w={`${28 * scale}px`} 
                      textAlign="center" 
                      flexShrink="0"
                      py={`${4 * scale}px`}
                    >
                      <Text 
                        fontSize={`${11 * scale}px`} 
                        fontWeight="800" 
                        color={isDark ? DARK_THEME.border : "#94a3b8"}
                        fontFamily="monospace"
                        letterSpacing="1px"
                      >
                        {ROW_LABELS[ri] || ri}
                      </Text>
                    </Box>

                    <Flex gap={`${6 * scale}px`}>
                      {row.map((seat, ci) => {
                        if (!seat) return null;
                        
                        let shouldHide = false;
                        if (filter === "booked") shouldHide = !seat.booked;
                        if (filter === "empty") shouldHide = seat.booked;
                        
                        if (shouldHide) {
                          return (
                            <Box 
                              key={seat?.id || `seat-${ri}-${ci}`} 
                              w={`${32 * scale}px`} 
                              h={`${24 * scale}px`}
                              opacity={0.15} 
                              transition="opacity 0.2s"
                              borderRadius={`${4 * scale}px`}
                              bg={isDark ? DARK_THEME.inputBg : "#f1f5f9"}
                              border={`1px dashed ${isDark ? DARK_THEME.border : "#e2e8f0"}`}
                            />
                          );
                        }
                        
                        return (
                          <Box 
                            key={seat?.id || `seat-${ri}-${ci}`}
                            transition="all 0.2s"
                          >
                            <Seat 
                              seat={seat} 
                              scale={scale} 
                              isEditable={isEditMode}
                              onEdit={handleSeatEditClick}
                              onDelete={handleSeatDeleteClick}
                            />
                          </Box>
                        );
                      })}
                    </Flex>

                    <Box 
                      w={`${28 * scale}px`} 
                      textAlign="center" 
                      flexShrink="0"
                      py={`${4 * scale}px`}
                    >
                      <Text 
                        fontSize={`${11 * scale}px`} 
                        fontWeight="800" 
                        color={isDark ? DARK_THEME.border : "#94a3b8"}
                        fontFamily="monospace"
                        letterSpacing="1px"
                      >
                        {ROW_LABELS[ri] || ri}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
              
              {/* Số cột bên dưới */}
              {maxCols > 0 && (
                <Flex gap={`${6 * scale}px`} mt={`${8 * scale}px`}>
                  <Box w={`${28 * scale}px`} />
                  {Array.from({ length: maxCols }, (_, i) => {
                    const hasSeatInCol = safeSeatsData.some(row => row && row[i]);
                    if (!hasSeatInCol) return null;
                    
                    return (
                      <Box 
                        key={i} 
                        w={`${32 * scale}px`} 
                        textAlign="center"
                      >
                        <Text 
                          fontSize={`${9 * scale}px`} 
                          fontWeight="600" 
                          color={isDark ? DARK_THEME.border : "#cbd5e1"}
                          fontFamily="monospace"
                          opacity="0.4"
                        >
                          {i + 1}
                        </Text>
                      </Box>
                    );
                  })}
                </Flex>
              )}
            </Flex>
          </Box>
        )}
      </Box>

      {/* ✅ Legend */}
      {safeSeatsData.length > 0 && (
        <Box 
          bg={bgCard} 
          borderRadius="14px" 
          border={`1px solid ${borderCard}`}
          boxShadow={isDark ? `0 1px 4px ${DARK_THEME.accentShadow}` : "0 1px 4px rgba(0,0,0,0.04)"} 
          p="16px 20px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          <Text 
            fontSize="10px" 
            fontWeight="700" 
            color={labelColor} 
            letterSpacing="1.5px"
            textTransform="uppercase" 
            mb="12px"
          >
            Chú thích
          </Text>
          <Flex flexWrap="wrap" gap="12px 20px">
            {[
              { bg: isDark ? DARK_THEME.inputBg : "#fff7ed", border: isDark ? DARK_THEME.accent : "#fb923c", label: "Trống" },
              { bg: "#dc2626", border: "#dc2626", label: "Đã đặt" },
            ].map(({ bg, border, label }) => (
              <Flex key={label} align="center" gap="8px">
                <Box 
                  w="18px" 
                  h="16px" 
                  borderRadius="4px" 
                  bg={bg}
                  border={`2px solid ${border}`} 
                />
                <Text fontSize="12px" fontWeight="500" color={textColor}>
                  {label}
                </Text>
              </Flex>
            ))}
            
            <Box w="1px" h="20px" bg={isDark ? DARK_THEME.border : "#e2e8f0"} alignSelf="center" />
            
            {Object.entries(SEAT_TYPES).map(([key, cfg]) => {
              const typeColor = getSeatTypeColor(key);
              let bgColor = typeColor.bg;
              let borderColor = typeColor.border;
              
              if (key === "couple") { bgColor = "#fef3c7"; borderColor = "#fcd34d"; }
              if (key === "vip") { bgColor = "#f5f3ff"; borderColor = "#a78bfa"; }
              if (key === "sweetbox") { bgColor = "#fdf2f8"; borderColor = "#f9a8d4"; }
              if (key === "accessible") { bgColor = "#f0f9ff"; borderColor = "#7dd3fc"; }
              
              return (
                <Flex key={key} align="center" gap="8px">
                  <Box 
                    w="18px" 
                    h="16px" 
                    borderRadius="4px" 
                    bg={bgColor}
                    border={`2px solid ${borderColor}`}
                  />
                  <Text fontSize="12px" fontWeight="500" color={textColor}>
                    {cfg.label}
                  </Text>
                </Flex>
              );
            })}
            
            {isEditMode && (
              <Flex align="center" gap="8px" px="10px" py="4px" borderRadius="6px" bg="#fef2f2" border="1px solid #fca5a5">
                <Icon as={MdEdit} boxSize="12px" color="#dc2626" />
                <Text fontSize="11px" fontWeight="600" color="#dc2626">Click để chỉnh sửa</Text>
              </Flex>
            )}
          </Flex>
        </Box>
      )}

      {/* Modals */}
      <EditSeatModal
        isOpen={editSeatModal?.isOpen || false}
        onClose={editSeatModal?.onClose || (() => {})}
        seat={selectedSeat}
        onSave={handleSaveSeat}
        roomName={room?.name || ""}
        isDark={isDark}
      />

      <AddRowModal
        isOpen={addRowModal?.isOpen || false}
        onClose={addRowModal?.onClose || (() => {})}
        onAdd={handleAddRows}
        roomName={room?.name || ""}
        currentRows={seatsData?.length || 0}
        isDark={isDark}
      />

      <AddColumnModal
        isOpen={addColModal?.isOpen || false}
        onClose={addColModal?.onClose || (() => {})}
        onAdd={handleAddCols}
        roomName={room?.name || ""}
        currentCols={maxCols}
        isDark={isDark}
      />

      {/* ✅ DeleteConfirmDialog - sử dụng deleteDialog và deleteDialogConfig */}
      <DeleteConfirmDialog
        isOpen={deleteDialog?.isOpen || false}
        onClose={deleteDialog?.onClose || (() => {})}
        onConfirm={deleteDialogConfig?.onConfirm || (() => {})}
        title={deleteDialogConfig?.title || "Xác nhận xóa"}
        message={deleteDialogConfig?.message || "Bạn có chắc chắn muốn xóa?"}
        isDark={isDark}
      />
    </Box>
  );
}