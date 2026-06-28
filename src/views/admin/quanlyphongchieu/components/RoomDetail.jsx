// src/views/admin/quanlyphongchieu/components/RoomDetail.jsx

import React from "react";
import {
  Box, Flex, Text, Button, Icon, SimpleGrid, Grid,
  useColorMode,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdEdit, MdCheckCircle, MdBuild, MdGridView,
  MdScreenShare, MdLocalMovies, MdTimer, MdWarning, MdVolumeUp,
  MdClose, MdMeetingRoom, MdInfo, MdPerson, MdCalendarToday,
  MdAccessTime, MdTag, // ✅ Thay MdHash bằng MdTag
} from "react-icons/md";
import { FaChair, FaTicketAlt, FaBuilding } from "react-icons/fa";
import TypeBadge from "./TypeBadge";
import StatusPill from "./StatusPill";
import SeatMapPreview from "./SeatMapPreview";
import SectionTitle from "./shared/SectionTitle";
import { TYPE_CFG } from "../constants";
import { slideIn, fadeUp, fadeIn, pulse } from "./shared/animations";

const RoomDetail = ({ room, cinemaName, onBack, onToggle, onEdit, isDark }) => {
  const typeCfg = TYPE_CFG[room.RoomType || room.type] || TYPE_CFG.Standard;
  const isMaintenance = room.Status === "Maintenance" || room.status === "Maintenance";
  const isActive = room.Status === "Active" || room.status === "Active";
  const pct = room.capacity > 0 ? Math.round((room.bookedSeats / room.capacity) * 100) : 0;
  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";

  const getStatusText = (status) => {
    if (status === "Active") return "Hoạt động";
    if (status === "Inactive") return "Không hoạt động";
    if (status === "Maintenance") return "Bảo trì";
    return status;
  };

  const getStatusIcon = (status) => {
    if (status === "Active") return MdCheckCircle;
    if (status === "Inactive") return MdClose;
    if (status === "Maintenance") return MdBuild;
    return MdInfo;
  };

  const StatusIcon = getStatusIcon(room.Status || room.status);
  const statusText = getStatusText(room.Status || room.status);

  return (
    <Box sx={{ animation: `${slideIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`} _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} onClick={onBack}>
          Quay lại danh sách
        </Button>
        <Flex gap="8px">
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={isDark ? "#2d3748" : "#f8fafc"} color={textColor}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
            leftIcon={<Icon as={MdEdit} />} onClick={() => onEdit(room)}>
            Chỉnh sửa
          </Button>
          <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg={isMaintenance ? "linear-gradient(135deg,#059669,#34d399)" : "linear-gradient(135deg,#f59e0b,#fbbf24)"}
            color="white"
            boxShadow={isMaintenance ? "0 4px 14px rgba(5,150,105,0.3)" : "0 4px 14px rgba(245,158,11,0.3)"}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s"
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} />}
            onClick={() => onToggle(room.RoomId || room.id)}>
            {isMaintenance ? "Kích hoạt phòng" : "Đánh dấu bảo trì"}
          </Button>
        </Flex>
      </Flex>

      {/* Main Content - Giống trang show */}
      <Box bg={bg} borderRadius="20px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)"} overflow="hidden" mb="16px">
        <Box h="5px" bg={typeCfg.grad} />
        
        {/* Left Column - Summary */}
        <Box p={{ base: "20px", md: "28px" }}>
          <Flex direction={{ base: "column", md: "row" }} gap="24px">
            <Box flex="1">
              {/* Icon & Name */}
              <Flex align="flex-start" gap="16px" mb="16px">
                <Box w="72px" h="72px" borderRadius="18px" flexShrink="0"
                  bg={isActive ? "linear-gradient(135deg,#f97316,#fb923c)" : "linear-gradient(135deg,#64748b,#94a3b8)"}
                  display="flex" alignItems="center" justifyContent="center"
                  boxShadow={isActive ? "0 4px 14px rgba(249,115,22,0.35)" : "0 4px 14px rgba(100,116,139,0.3)"}
                >
                  <Icon as={MdMeetingRoom} boxSize="32px" color="white" />
                </Box>
                <Box>
                  <Text fontSize="11px" fontWeight="700" color={subColor} letterSpacing="1px"
                    textTransform="uppercase" mb="2px">{cinemaName}</Text>
                  <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="900" color={textColor}
                    letterSpacing="-0.6px" lineHeight="1">{room.Name}</Text>
                  <Flex gap="8px" mt="10px" flexWrap="wrap">
                    <TypeBadge type={room.RoomType || room.type || "Standard"} />
                    <Flex align="center" gap="6px" px="10px" py="4px" borderRadius="8px"
                      bg={isActive ? "#ecfdf5" : isMaintenance ? "#fffbeb" : "#f3f4f6"}
                      border={`1px solid ${isActive ? "#6ee7b7" : isMaintenance ? "#fcd34d" : "#d1d5db"}`}
                    >
                      <Icon as={StatusIcon} boxSize="14px" color={isActive ? "#059669" : isMaintenance ? "#d97706" : "#6b7280"} />
                      <Text fontSize="13px" fontWeight="700" color={isActive ? "#059669" : isMaintenance ? "#d97706" : "#6b7280"}>
                        {statusText}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>

              <Box h="1px" bg={border} mb="16px" />

              {/* Room Type & Seat Count - Giống description box */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mb="16px">
                <Box p="14px 16px" borderRadius="12px" bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                  <Flex align="center" gap="8px" mb="6px">
                    <Icon as={MdTag} boxSize="16px" color="#f97316" /> {/* ✅ Đã sửa thành MdTag */}
                    <Text fontSize="11px" fontWeight="700" color={subColor}>Loại phòng</Text>
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>
                    {room.RoomType || room.type || "Không có thông tin"}
                  </Text>
                </Box>
                <Box p="14px 16px" borderRadius="12px" bg={isDark ? "#2d3748" : "#f8fafc"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                  <Flex align="center" gap="8px" mb="6px">
                    <Icon as={FaChair} boxSize="16px" color="#f97316" />
                    <Text fontSize="11px" fontWeight="700" color={subColor}>Tổng số ghế</Text>
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color={textColor}>
                    {room.TotalSeats || room.capacity || room.SeatCount || 0} ghế
                  </Text>
                </Box>
              </Grid>

              {/* Room ID - Giống role-id-box */}
              <Box p="12px 16px" borderRadius="12px" bg={isDark ? "#2d3748" : "#f3f4f6"} border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="6px">
                    <Icon as={MdInfo} boxSize="14px" color={subColor} />
                    <Text fontSize="11px" fontWeight="700" color={subColor}>ID Phòng Chiếu</Text>
                  </Flex>
                  <Text fontSize="13px" fontWeight="800" color={textColor} fontFamily="mono">
                    {room.RoomId || room.id}
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* Right Column - Details */}
            <Box flex="1">
              {/* Cinema Info */}
              <Box bg={isDark ? "#2d3748" : "#f8fafc"} borderRadius="14px" border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} p="16px" mb="14px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg="linear-gradient(135deg,#3b82f6,#60a5fa)"
                    display="flex" alignItems="center" justifyContent="center">
                    <Icon as={FaBuilding} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>Thông Tin Rạp Chiếu</Text>
                    <Text fontSize="11px" color={subColor}>Chi tiết về rạp phim</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={isDark ? "#1e293b" : "white"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                  <Icon as={FaBuilding} boxSize="18px" color="#f97316" />
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={subColor}>Tên rạp</Text>
                    <Text fontSize="13px" fontWeight="600" color={textColor}>{cinemaName}</Text>
                  </Box>
                </Flex>
              </Box>

              {/* Created Info */}
              <Box bg={isDark ? "#2d3748" : "#f8fafc"} borderRadius="14px" border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} p="16px" mb="14px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg="linear-gradient(135deg,#8b5cf6,#a78bfa)"
                    display="flex" alignItems="center" justifyContent="center">
                    <Icon as={MdCalendarToday} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>Thông Tin Tạo</Text>
                    <Text fontSize="11px" color={subColor}>Chi tiết về người tạo phòng chiếu</Text>
                  </Box>
                </Flex>
                <Flex direction="column" gap="8px">
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={isDark ? "#1e293b" : "white"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                    <Icon as={MdPerson} boxSize="18px" color="#8b5cf6" />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>Người tạo</Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>{room.CreatedBy || "N/A"}</Text>
                    </Box>
                  </Flex>
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={isDark ? "#1e293b" : "white"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                    <Icon as={MdCalendarToday} boxSize="18px" color="#8b5cf6" />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>Ngày tạo</Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>{room.CreatedAt || "N/A"}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>

              {/* Updated Info */}
              <Box bg={isDark ? "#2d3748" : "#f8fafc"} borderRadius="14px" border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`} p="16px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg="linear-gradient(135deg,#059669,#34d399)"
                    display="flex" alignItems="center" justifyContent="center">
                    <Icon as={MdAccessTime} boxSize="14px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="13px" fontWeight="800" color={textColor}>Cập Nhật Gần Nhất</Text>
                    <Text fontSize="11px" color={subColor}>Lịch sử thay đổi phòng chiếu</Text>
                  </Box>
                </Flex>
                <Flex direction="column" gap="8px">
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={isDark ? "#1e293b" : "white"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                    <Icon as={MdPerson} boxSize="18px" color="#059669" />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>Người cập nhật</Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>{room.UpdatedBy || "N/A"}</Text>
                    </Box>
                  </Flex>
                  <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px" bg={isDark ? "#1e293b" : "white"} border={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}>
                    <Icon as={MdAccessTime} boxSize="18px" color="#059669" />
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color={subColor}>Ngày cập nhật</Text>
                      <Text fontSize="13px" fontWeight="600" color={textColor}>{room.UpdatedAt || "N/A"}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Seat Map Preview */}
      <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        p="20px" mb="16px" sx={{ animation: `${fadeUp} 0.4s ease both` }}>
        <SectionTitle text="Sơ đồ ghế (xem)" />
        <SeatMapPreview room={room} />
      </Box>

      {/* Tech & Permissions */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px">
        <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
          boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px 20px"
          sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <SectionTitle text="Công nghệ & Thiết bị" />
          <Flex gap="8px" flexWrap="wrap">
            {(room.Tech || ["Dolby Digital"]).map((t) => (
              <Flex key={t} align="center" gap="6px" px="12px" py="7px"
                borderRadius="9px" bg={isDark ? "#2d3748" : "#fff7ed"} border={`1px solid ${isDark ? "#374151" : "#fed7aa"}`}>
                <Icon as={MdVolumeUp} boxSize="12px" color="#f97316" />
                <Text fontSize="12px" fontWeight="700" color={isDark ? "#f1f5f9" : "#b45309"}>{t}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
          boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"} p="18px 20px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}>
          <SectionTitle text="Thông tin phân quyền" />
          <Flex direction="column" gap="8px">
            {[
              { ok: true, txt: "Xem danh sách và chi tiết phòng chiếu" },
              { ok: true, txt: "Đánh dấu phòng đang bảo trì / hoạt động" },
              { ok: false, txt: "Chỉnh sửa layout, sơ đồ ghế (Admin)" },
              { ok: false, txt: "Thêm hoặc xóa phòng chiếu (Admin)" },
            ].map(({ ok, txt }) => (
              <Flex key={txt} align="flex-start" gap="8px">
                <Box w="17px" h="17px" borderRadius="full" flexShrink="0" mt="1px"
                  bg={ok ? "#ecfdf5" : "#fef2f2"} border={`1px solid ${ok ? "#6ee7b7" : "#fca5a5"}`}
                  display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="9px" fontWeight="900" color={ok ? "#059669" : "#dc2626"}>{ok ? "✓" : "✕"}</Text>
                </Box>
                <Text fontSize="12px" color={ok ? textColor : subColor} fontWeight={ok ? "600" : "500"}>{txt}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Grid>

      {/* Maintenance Alert */}
      {isMaintenance && (
        <Box mt="14px" p="16px 18px" borderRadius="14px" bg={isDark ? "#2d3748" : "#fffbeb"} border={`1.5px solid ${isDark ? "#374151" : "#fcd34d"}`}
          sx={{ animation: `${fadeIn} 0.3s ease both` }}>
          <Flex align="center" gap="10px">
            <Box w="36px" h="36px" borderRadius="10px" bg={isDark ? "#2d3748" : "#fef3c7"}
              display="flex" alignItems="center" justifyContent="center" flexShrink="0">
              <Icon as={MdWarning} boxSize="18px" color="#f59e0b" />
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="800" color={isDark ? "#f1f5f9" : "#92400e"} mb="2px">Phòng đang bảo trì</Text>
              <Text fontSize="12px" color={isDark ? "#94a3b8" : "#b45309"}>
                Phòng này không nhận suất chiếu mới. Nhấn "Kích hoạt phòng" để đưa vào hoạt động trở lại.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default RoomDetail;