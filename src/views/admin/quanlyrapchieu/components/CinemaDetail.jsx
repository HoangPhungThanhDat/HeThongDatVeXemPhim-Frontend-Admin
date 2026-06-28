

import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Icon, Grid, SimpleGrid,
  Input, Select, useColorMode,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdEdit, MdAdd, MdLocationOn, MdPhone,
  MdAccessTime, MdStar, MdMeetingRoom, MdBuild, MdChair,
  MdSearch, MdClose, MdCheckCircle,
} from "react-icons/md";
import { FaUser, FaCalendar, FaTicketAlt } from "react-icons/fa";
import StatusDot from "./StatusDot";
import RoomRow from "./RoomRow";
import StatCard from "./shared/StatCard";
import SectionTitle from "./shared/SectionTitle";
import { AMENITY_ICONS, AMENITY_LABELS, DARK } from "../constants";
import { fadeUp, fadeIn, shimmer } from "./shared/animations";

const CinemaDetail = ({ 
  cinema, 
  onBack, 
  onEdit, 
  rooms, 
  onToggleMaintenance, 
  onDeleteRoom, 
  onAddRoom, 
  onToggleStatus,
  isDark 
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const filtered = rooms.filter((r) => {
    const matchS = r.Name?.toLowerCase().includes(search.toLowerCase()) || 
                   r.Type?.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === "Tất cả" || (filter === "Hoạt động" ? r.Status === "Active" : r.Status === "Inactive");
    return matchS && matchF;
  });

  const activeCount = rooms.filter((r) => r.Status === "Active").length;
  const maintenanceCount = rooms.filter((r) => r.Status === "Inactive").length;
  const totalSeats = rooms.reduce((s, r) => s + (r.Seats || 0), 0);

  const bg = isDark ? "#1e293b" : "white";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "#2d3748" : "#f8fafc";
  const inputBorder = isDark ? "#374151" : "#e8edf3";

  const statusLabel = cinema.Status === "Active" ? "Hoạt động" : "Tạm đóng";

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={subColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`} 
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} 
          onClick={onBack}>
          Quay lại
        </Button>
        <Flex gap="8px">
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={isDark ? "#2d3748" : "#f8fafc"} color={textColor}
            border={`1px solid ${isDark ? "#374151" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#374151" : "#f1f5f9" }}
            leftIcon={<Icon as={MdAdd} />} onClick={onAddRoom}>
            Thêm phòng
          </Button>
          <Button h="38px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.3)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
            transition="all 0.2s" leftIcon={<Icon as={MdEdit} />} onClick={onEdit}>
            Cập nhật thông tin
          </Button>
        </Flex>
      </Flex>

      {/* Hero */}
      <Box bg={bg} borderRadius="20px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)"} overflow="hidden" mb="16px">
        <Box h="3px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />
        <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }}>
          <Box h={{ base: "180px", md: "auto" }} overflow="hidden" bg="#0f172a">
            <img src={cinema.ImageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80"} 
              alt={cinema.Name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9 }} />
          </Box>
          <Box p={{ base: "18px", md: "28px" }}>
            <Flex align="flex-start" justify="space-between" mb="12px" gap="10px">
              <Box flex="1">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color={textColor}
                  letterSpacing="-0.5px" mb="6px">{cinema.Name}</Text>
                <StatusDot status={statusLabel} />
              </Box>
              <Flex align="center" gap="4px" flexShrink="0">
                <Icon as={MdStar} boxSize="16px" color="#f59e0b" />
                <Text fontSize="18px" fontWeight="800" color={textColor}>{cinema.Rating || 4.5}</Text>
              </Flex>
            </Flex>

            <Box h="1px" bg={border} mb="14px" />

            <Flex direction="column" gap="8px" mb="16px">
              {[
                { icon: MdLocationOn, val: cinema.Address },
                { icon: MdPhone, val: cinema.Phone },
                { icon: MdAccessTime, val: `Giờ mở cửa: ${cinema.OpenTime || "08:00 – 23:00"}` },
                { icon: FaUser, val: `Quản lý: ${cinema.Manager || "Chưa có"}` },
                { icon: FaCalendar, val: `Ngày tạo: ${cinema.CreatedAt?.split('T')[0] || "N/A"}` },
              ].map(({ icon: Ic, val }) => (
                <Flex key={val} align="flex-start" gap="8px">
                  <Icon as={Ic} boxSize="14px" color="#f97316" mt="2px" flexShrink="0" />
                  <Text fontSize="13px" color={subColor} fontWeight="500">{val}</Text>
                </Flex>
              ))}
            </Flex>

            <Box p="12px 14px" borderRadius="12px" bg={isDark ? "#2d3748" : "#fffbf7"} border={`1px solid ${isDark ? "#374151" : "#fed7aa"}`}>
              <Text fontSize="12.5px" color={isDark ? "#94a3b8" : "#78350f"} lineHeight="1.65">
                {cinema.Description || "Chưa có mô tả"}
              </Text>
            </Box>
          </Box>
        </Grid>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
        <StatCard label="Phòng hoạt động" value={activeCount} sub={`/ ${rooms.length} phòng`} icon={MdMeetingRoom} accent="#f97316" delay={0} />
        <StatCard label="Phòng bảo trì"   value={maintenanceCount} icon={MdBuild}  accent="#f59e0b" delay={0.05} />
        <StatCard label="Tổng ghế"        value={totalSeats.toLocaleString()} icon={MdChair} accent="#0284c7" delay={0.1} />
        <StatCard label="Doanh thu tháng" value={cinema.MonthRevenue || "0"} icon={FaTicketAlt} accent="#059669" delay={0.15} />
      </SimpleGrid>

      {/* Rooms section */}
      <Box bg={bg} borderRadius="16px" border={`1px solid ${border}`}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}>
        <Box p="18px 20px 14px" borderBottom={`1px solid ${isDark ? "#2d3748" : "#f8fafc"}`}>
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color={textColor}>Danh sách phòng chiếu</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} phòng</Text>
              </Box>
            </Flex>
          </Flex>
          <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
            <Box position="relative" flex="1">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color={isDark ? "#64748b" : "#94a3b8"} zIndex="1" />
              <Input pl="30px" h="36px" fontSize="12.5px" fontWeight="500"
                placeholder="Tìm phòng chiếu, loại phòng..."
                bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px" color={textColor}
                _placeholder={{ color: isDark ? "#64748b" : "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: isDark ? "#1e293b" : "#fff" }}
                _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
            <Select h="36px" fontSize="12.5px" fontWeight="600" color={textColor}
              bg={inputBg} border={`1px solid ${inputBorder}`} borderRadius="9px"
              w={{ base: "100%", sm: "150px" }}
              _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bảo trì">Bảo trì</option>
            </Select>
          </Flex>
        </Box>

        <Flex px="16px" py="9px" bg={isDark ? "#2d3748" : "#fafbfc"} borderBottom={`1px solid ${isDark ? "#374151" : "#f1f5f9"}`}
          display={{ base: "none", md: "flex" }}>
          {["Phòng chiếu / Loại", "Trạng thái", "Đang chiếu / Suất tiếp", "Thao tác"].map((h, i) => (
            <Box key={h}
              flex={i === 0 ? "2.5" : i === 1 ? "1" : i === 2 ? "2" : "0 0 auto"}
              pr={i < 3 ? "12px" : "0"}>
              <Text fontSize="10px" fontWeight="800" color={isDark ? "#64748b" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">{h}</Text>
            </Box>
          ))}
        </Flex>

        <Box p="10px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" py="32px" color={isDark ? "#475569" : "#cbd5e1"}>
              <Icon as={MdMeetingRoom} boxSize="28px" mb="6px" />
              <Text fontSize="13px" color={isDark ? "#64748b" : "#94a3b8"}>Không tìm thấy phòng chiếu</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((r, i) => (
                <RoomRow key={r.RoomId || r.id || i} room={r} index={i}
                  onToggleMaintenance={onToggleMaintenance}
                  onDeleteRoom={onDeleteRoom} />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CinemaDetail;