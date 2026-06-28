// components/SeatMapView.jsx
import React from "react";
import {
  Box, Flex, Text, Button, Icon, useColorMode,
  Select, SimpleGrid, Spinner
} from "@chakra-ui/react";
import {
  MdArrowBack, MdLocationOn, MdZoomIn, MdZoomOut,
  MdLayers, MdAdd, MdRestore, MdMeetingRoom, MdEdit
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
  setDeleteTarget
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = getSeatColors(isDark);

  // Kiểm tra dữ liệu hợp lệ
  const isValidData = seatsData && seatsData.length > 0 && seatsData[0]?.length > 0;

  // Hàm xử lý click chỉnh sửa ghế
  const handleSeatEditClick = (seat) => {
    console.log("🔑 Seat clicked for edit:", seat);
    console.log("🔑 isEditMode:", isEditMode);
    console.log("🔑 handleSeatEdit:", handleSeatEdit);
    console.log("🔑 editSeatModal:", editSeatModal);
    
    if (isEditMode && handleSeatEdit) {
      // Gọi hàm handleSeatEdit để set selectedSeat
      handleSeatEdit(seat);
      // Mở modal chỉnh sửa
      if (editSeatModal && editSeatModal.onOpen) {
        console.log("🔑 Opening edit modal...");
        editSeatModal.onOpen();
      } else {
        console.error("❌ editSeatModal.onOpen is not available");
      }
    } else {
      console.warn("⚠️ Cannot edit: isEditMode=", isEditMode, "handleSeatEdit=", !!handleSeatEdit);
    }
  };

  // Hàm xử lý xóa ghế
  const handleSeatDeleteClick = (seat) => {
    console.log("🗑️ Seat clicked for delete:", seat);
    if (setDeleteTarget) {
      setDeleteTarget({ ...seat, type: "seat" });
    }
  };

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
            color={colors.subColor} 
            borderRadius="10px" 
            h="38px" 
            fontSize="13px" 
            fontWeight="600"
            border={`1.5px solid ${colors.borderCard}`} 
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Box>
            <Flex align="center" gap="8px" mb="2px" flexWrap="wrap">
              <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="900" color={colors.textColor} letterSpacing="-0.4px">
                {room?.name || "Phòng chiếu"}
              </Text>
              <RoomTypeBadge type={room?.type || "standard"} />
              {isEditMode && (
                <Box px="8px" py="3px" borderRadius="6px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize="10px" fontWeight="800" color="#dc2626">Chế độ chỉnh sửa</Text>
                </Box>
              )}
            </Flex>
            <Flex align="center" gap="5px">
              <Icon as={MdLocationOn} boxSize="11px" color={colors.subColor} />
              <Text fontSize="12px" color={colors.subColor}>{cinemaName || "Đang tải..."}</Text>
            </Flex>
          </Box>
        </Flex>
        <Flex gap="8px" align="center" flexWrap="wrap">
          <StatusDot status={room?.status || "active"} />
          <Box w="1px" h="24px" bg={isDark ? "#334155" : "#e2e8f0"} />
          <Flex bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${colors.borderCard}`} borderRadius="10px" overflow="hidden">
            {[
              { icon: MdZoomOut, action: zoomOut },
              { icon: MdZoomIn, action: zoomIn },
            ].map(({ icon: Ic, action }, i) => (
              <Button key={i} variant="ghost" h="34px" w="34px" p="0" borderRadius="0"
                _hover={{ bg: isDark ? "#374151" : "#f1f5f9", color: "#f97316" }} onClick={action}
              >
                <Icon as={Ic} boxSize="14px" />
              </Button>
            ))}
          </Flex>
          <Box px="10px" py="4px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="11px" fontWeight="700" color="#f97316">
              {Math.round(scale * 100)}%
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Stats row */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
        {[
          { label: "Tổng ghế", value: stats.total || 0, accent: "#f97316", icon: MdLayers },
          { label: "Đã đặt", value: stats.booked || 0, accent: "#dc2626", icon: MdLayers },
          { label: "Còn trống", value: stats.empty || 0, accent: "#059669", icon: MdLayers },
          { label: "Tỉ lệ đặt", value: stats.total > 0 ? `${Math.round((stats.booked/stats.total)*100)}%` : "0%",
            accent: "#7c3aed", icon: MdLayers, sub: `${stats.total || 0} ghế tổng cộng` },
        ].map((p, i) => (
          <StatCard key={p.label} {...p} delay={i * 0.04} />
        ))}
      </SimpleGrid>

      {/* Seat map card */}
      <Box bg={colors.bgCard} borderRadius="18px" border={`1px solid ${colors.borderCard}`}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)"} overflow="hidden" mb="14px"
      >
        <Box h="3px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        <Flex align="center" justify="space-between" px="18px" py="14px"
          borderBottom={`1px solid ${isDark ? "#2d3748" : "#f8fafc"}`} flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px" flexWrap="wrap">
            <Icon as={MdLayers} boxSize="14px" color="#f97316" />
            <Text fontSize="13px" fontWeight="800" color={colors.textColor}>Sơ đồ ghế ngồi</Text>
            {isValidData && (
              <Box px="8px" py="2px" borderRadius="5px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="10.5px" fontWeight="700" color="#f97316">
                  {seatsData.length} hàng × {seatsData[0]?.length || 0} cột
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
          <Select h="32px" fontSize="12px" fontWeight="600" color={colors.textColor}
            bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${colors.borderInput}`} borderRadius="8px" w="140px"
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            value={filter} onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả ghế</option>
            <option value="booked">Đã đặt</option>
            <option value="empty">Còn trống</option>
          </Select>
        </Flex>

        {loading ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Spinner size="xl" color="#f97316" thickness="4px" />
            <Text fontSize="14px" color={colors.subColor}>Đang tải sơ đồ ghế...</Text>
          </Flex>
        ) : room?.status === "maintenance" && !isEditMode ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Box w="56px" h="56px" borderRadius="16px" bg="#fffbeb" border="2px solid #fcd34d"
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdMeetingRoom} boxSize="24px" color="#f59e0b" />
            </Box>
            <Text fontSize="16px" fontWeight="800" color={colors.textColor}>Phòng đang bảo trì</Text>
            <Text fontSize="13px" color={colors.subColor} textAlign="center" maxW="320px">
              Phòng chiếu này hiện không hoạt động. Vui lòng kiểm tra lại sau khi hoàn tất bảo trì.
            </Text>
          </Flex>
        ) : !isValidData ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Box w="56px" h="56px" borderRadius="16px" bg="#f0f9ff" border="2px solid #7dd3fc"
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdLayers} boxSize="24px" color="#0284c7" />
            </Box>
            <Text fontSize="16px" fontWeight="700" color={colors.textColor}>Chưa có ghế</Text>
            <Text fontSize="13px" color={colors.subColor} textAlign="center" maxW="320px">
              Phòng này chưa có ghế nào. 
              {isEditMode ? " Hãy sử dụng nút Thêm hàng hoặc Thêm cột để tạo ghế mới." : ""}
            </Text>
            {!isEditMode && (
              <Button
                mt="8px"
                size="sm"
                borderRadius="10px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                color="white"
                _hover={{ boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}
                onClick={() => onEditMode(room)}
              >
                <Icon as={MdEdit} boxSize="14px" mr="6px" />
                Chỉnh sửa phòng
              </Button>
            )}
          </Flex>
        ) : (
          <Box p="20px" overflowX="auto">
            <Flex direction="column" align="center" mb="24px">
              <Box
                w={{ base: "70%", md: "55%" }} h="8px" borderRadius="4px"
                bg="linear-gradient(90deg, transparent 5%, #f97316 30%, #fbbf24 50%, #f97316 70%, transparent 95%)"
                mb="6px" opacity="0.9"
              />
              <Box
                w={{ base: "80%", md: "65%" }} h="3px" borderRadius="full"
                bg="linear-gradient(90deg, transparent, rgba(249,115,22,0.25), transparent)"
                mb="4px"
              />
              <Text fontSize="10px" fontWeight="700" color={isDark ? "#64748b" : "#94a3b8"}
                letterSpacing="3px" textTransform="uppercase">
                Màn hình chiếu
              </Text>
            </Flex>

            <Flex direction="column" align="center" gap={`${6 * scale}px`}>
              {seatsData.map((row, ri) => {
                const filtered = row.map((s) => ({
                  ...s,
                  hidden: filter === "booked" ? !s.booked : filter === "empty" ? s.booked : false,
                }));
                return (
                  <Flex key={ri} align="center" gap={`${6 * scale}px`}>
                    <Box w={`${22 * scale}px`} textAlign="center" flexShrink="0">
                      <Text fontSize={`${11 * scale}px`} fontWeight="800" color={isDark ? "#475569" : "#cbd5e1"}>
                        {ROW_LABELS[ri] || ri}
                      </Text>
                    </Box>
                    {filtered.map((seat) => (
                      <Box key={seat.id || `seat-${ri}-${seat.col}`} opacity={seat.hidden ? 0.15 : 1} transition="opacity 0.2s">
                        <Seat 
                          seat={seat} 
                          scale={scale} 
                          isEditable={isEditMode}
                          onEdit={handleSeatEditClick}
                          onDelete={handleSeatDeleteClick}
                        />
                      </Box>
                    ))}
                    <Box w={`${22 * scale}px`} textAlign="center" flexShrink="0">
                      <Text fontSize={`${11 * scale}px`} fontWeight="800" color={isDark ? "#475569" : "#cbd5e1"}>
                        {ROW_LABELS[ri] || ri}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
              <Flex gap={`${6 * scale}px`} mt="4px">
                <Box w={`${22 * scale}px`} />
                {Array.from({ length: seatsData[0]?.length || 0 }, (_, i) => (
                  <Box key={i} w={`${20 * scale}px`} textAlign="center">
                    <Text fontSize={`${9 * scale}px`} color={isDark ? "#475569" : "#e2e8f0"} fontWeight="600">{i + 1}</Text>
                  </Box>
                ))}
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Legend - chỉ hiển thị khi có dữ liệu */}
      {isValidData && (
        <Box bg={colors.bgCard} borderRadius="14px" border={`1px solid ${colors.borderCard}`}
          boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="14px 18px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#64748b" : "#64748b"} letterSpacing="1px"
            textTransform="uppercase" mb="10px">Chú thích</Text>
          <Flex flexWrap="wrap" gap="10px 18px">
            {[
              { bg: "#fff7ed", border: "#fb923c", label: "Ghế trống" },
              { bg: "#dc2626", border: "#dc2626", label: "Đã đặt", textColor: "white" },
            ].map(({ bg, border, label, textColor }) => (
              <Flex key={label} align="center" gap="7px">
                <Box w="18px" h="14px" borderRadius="3px" bg={bg}
                  border={`1.5px solid ${border}`} position="relative">
                  <Box position="absolute" top="-3px" left="50%" transform="translateX(-50%)"
                    w="6px" h="3px" borderRadius="2px" bg={border} />
                </Box>
                <Text fontSize="11.5px" fontWeight="600" color={colors.textColor}>{label}</Text>
              </Flex>
            ))}
            <Box w="1px" h="20px" bg={isDark ? "#334155" : "#e2e8f0"} alignSelf="center" />
            {Object.entries(SEAT_TYPES).map(([key, cfg]) => (
              <Flex key={key} align="center" gap="7px">
                <Box w="18px" h="14px" borderRadius="3px" bg={isDark ? "#2d3748" : cfg.bg}
                  border={`1.5px solid ${isDark ? "#374151" : cfg.border}`} />
                <Text fontSize="11.5px" fontWeight="600" color={colors.textColor}>{cfg.label}</Text>
              </Flex>
            ))}
            {isEditMode && (
              <Flex align="center" gap="7px" px="8px" py="3px" borderRadius="6px" bg="#fef2f2" border="1px solid #fca5a5">
                <Icon as={MdEdit} boxSize="11px" color="#dc2626" />
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
      />

      <AddRowModal
        isOpen={addRowModal?.isOpen || false}
        onClose={addRowModal?.onClose || (() => {})}
        onAdd={handleAddRows}
        roomName={room?.name || ""}
        currentRows={seatsData?.length || 0}
      />

      <AddColumnModal
        isOpen={addColModal?.isOpen || false}
        onClose={addColModal?.onClose || (() => {})}
        onAdd={handleAddCols}
        roomName={room?.name || ""}
        currentCols={seatsData[0]?.length || 0}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog?.isOpen || false}
        onClose={deleteDialog?.onClose || (() => {})}
        onConfirm={deleteDialog?.onConfirm || (() => {})}
        title={deleteDialog?.title || "Xác nhận xóa"}
        message={deleteDialog?.message || "Bạn có chắc chắn muốn xóa?"}
      />
    </Box>
  );
}