// src/views/admin/quanlyve/components/TicketDetail.jsx

import React from "react";
import {
  Box, Flex, Text, Button, Icon, HStack,
  Wrap, WrapItem, useToast
} from "@chakra-ui/react";
import {
  MdArrowBack, MdEdit, MdPerson, MdPhone,
  MdCalendarToday, MdAccessTime, MdLocationOn, MdOutlineTheaters,
  MdDelete, MdCancel, MdContentCopy, MdMovie
} from "react-icons/md";
import { QRCodeCanvas } from "qrcode.react";

// Cấu hình màu trạng thái
const getStatusStyle = (status) => {
  const s = String(status).toLowerCase();
  if (s.includes("thanh toán") || s.includes("paid")) return { bg: "rgba(16,185,129,0.15)", border: "#10b981", color: "#10b981", icon: "✓" };
  if (s.includes("check-in")) return { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", color: "#f59e0b", icon: "🎟" };
  if (s.includes("hủy") || s.includes("cancel")) return { bg: "rgba(239,68,68,0.15)", border: "#ef4444", color: "#ef4444", icon: "✕" };
  return { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", color: "#f59e0b", icon: "⏳" };
};

// Component con: Thẻ thông tin
const InfoBox = ({ icon, label, value, highlight, isDark }) => (
  <Flex direction="column" gap={1}>
    <HStack spacing={2} color={isDark ? "rgba(255,255,255,0.6)" : "#64748b"}>
      <Icon as={icon} boxSize="14px" />
      <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="1px">{label}</Text>
    </HStack>
    <Text 
      fontSize="16px" 
      fontWeight="800" 
      color={highlight ? (isDark ? "#fb923c" : "#ea580c") : (isDark ? "white" : "#0f172a")} 
      letterSpacing="0.5px"
    >
      {value || "—"}
    </Text>
  </Flex>
);

export const TicketDetail = ({ ticket, onBack, onEdit, onDelete, onCancel, isDark }) => {
  const toast = useToast();
  const statusStyle = getStatusStyle(ticket.status);

  const seats = String(ticket.seat || "").split(",").map((s) => s.trim()).filter(Boolean);
  
  // ✅ SỬA LỖI TÁCH NGÀY / GIỜ / PHÒNG
  // Vì ticket.showtime đang có dạng: "08:00 27/10/2026 - Phòng Vip 01"
  // Ta cần tách lấy ngày, giờ và tên phòng một cách chính xác
  const showtimeParts = String(ticket.showtime || "").split(" - ");
  const timeAndDate = showtimeParts[0] || ""; 
  const roomName = showtimeParts[1]?.replace("Phòng", "").trim() || ticket.room || "—";
  
  // Tách ngày và giờ từ chuỗi "08:00 27/10/2026"
  const [timePart, datePart] = timeAndDate.split(" ");

  const qrData = JSON.stringify({ code: ticket.code, id: ticket.id });

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.code);
    toast({ title: "Đã sao chép mã vé!", status: "success", duration: 2000, position: "top-right" });
  };

  const bgPoster = ticket.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop";

  // 🎨 Bộ màu thay đổi theo Sáng/Tối (Đã chuyển Tối sang màu xanh giống Sidebar)
  const bgPage = isDark ? "#0a1628" : "#f1f5f9"; // Xanh đen
  const cardBg = isDark ? "rgba(15, 31, 58, 0.7)" : "rgba(255, 255, 255, 0.85)"; // Xanh đậm mờ
  const cardBorder = isDark ? "rgba(26, 58, 92, 0.8)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "white" : "#0f172a";
  const textMuted = isDark ? "#88b4d8" : "#64748b"; // Xanh nhạt
  const boxBg = isDark ? "rgba(26, 58, 92, 0.3)" : "rgba(0,0,0,0.02)";
  const boxBorder = isDark ? "rgba(26, 58, 92, 0.6)" : "rgba(0,0,0,0.05)";
  const dashColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const notchBg = isDark ? "#0a1628" : "#f1f5f9"; 
  const btnGhostBg = isDark ? "rgba(26, 58, 92, 0.5)" : "white";
  const btnGhostColor = isDark ? "#e8f4f8" : "#475569";
  const btnGhostBorder = isDark ? "rgba(26, 58, 92, 0.8)" : "rgba(0,0,0,0.1)";

  return (
    <Box 
      minH="100vh" 
      position="relative" 
      overflow="hidden" 
      bg={bgPage} 
      fontFamily="'Plus Jakarta Sans', sans-serif"
      transition="background 0.3s"
    >
      {/* 🌟 BACKGROUND LAYER */}
      <Box 
        position="absolute" 
        inset={0} 
        bgImage={`url(${bgPoster})`} 
        bgSize="cover" 
        bgPosition="center"
        opacity={isDark ? 0.15 : 0.1} // Giảm độ mờ để không bị đen
        filter="blur(30px)"
        transform="scale(1.1)"
      />
      <Box 
        position="absolute" 
        inset={0} 
        bgGradient={isDark 
          ? "linear(to-b, rgba(10,22,40,0.8) 0%, #0a1628 100%)" // Gradient xanh đen
          : "linear(to-b, rgba(241,245,249,0.6) 0%, #f1f5f9 100%)"
        } 
      />

      {/* 🌟 MAIN CONTENT */}
      <Box position="relative" zIndex={2} maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
        
        {/* HEADER ACTIONS */}
        <Flex justify="space-between" align="center" mb={10}>
          <Button
            leftIcon={<Icon as={MdArrowBack} />}
            variant="unstyled" color={textMuted} fontSize="14px" fontWeight="600"
            _hover={{ color: isDark ? "white" : "#0f172a", transform: "translateX(-4px)" }} transition="all 0.2s"
            onClick={onBack}
          >
            Trở về danh sách
          </Button>
          <HStack spacing={4}>
            {onCancel && (
              <Button
                h="42px" px={6} borderRadius="full" fontSize="13px" fontWeight="700"
                bg={btnGhostBg} color={btnGhostColor} border={`1px solid ${btnGhostBorder}`}
                backdropFilter="blur(10px)" _hover={{ bg: isDark ? "rgba(26, 58, 92, 0.8)" : "gray.100" }}
                leftIcon={<Icon as={MdCancel} />} onClick={() => onCancel(ticket.id, ticket.showtimeSeatId)}
              >
                Hủy vé
              </Button>
            )}
            <Button
              h="42px" px={6} borderRadius="full" fontSize="13px" fontWeight="700"
              bg="#f97316" color="white" boxShadow="0 0 20px rgba(249,115,22,0.4)"
              _hover={{ bg: "#ea580c", boxShadow: "0 0 30px rgba(249,115,22,0.6)" }}
              leftIcon={<Icon as={MdEdit} />} onClick={() => onEdit(ticket)}
            >
              Chỉnh sửa
            </Button>
          </HStack>
        </Flex>

        {/* 🌟 TẤM VÉ GLASSMORPHISM */}
        <Flex 
          direction={{ base: "column", lg: "row" }} 
          bg={cardBg} 
          backdropFilter="blur(30px)"
          borderRadius="32px" 
          border={`1px solid ${cardBorder}`}
          boxShadow={isDark ? "0 30px 80px rgba(0,0,0,0.5)" : "0 30px 80px rgba(15,23,42,0.1)"}
          overflow="hidden"
          transition="all 0.3s"
        >
          {/* CỘT TRÁI: THÔNG TIN PHIM */}
          <Box flex={1} p={{ base: 6, md: 10 }} position="relative">
            
            <HStack spacing={4} mb={8}>
              <Flex align="center" gap={2} px={4} py={2} borderRadius="full" bg={statusStyle.bg} border={`1px solid ${statusStyle.border}`}>
                <Text color={statusStyle.color} fontSize="13px" fontWeight="800">{statusStyle.icon} {ticket.status}</Text>
              </Flex>
              <Text color={textMuted} fontFamily="mono" fontSize="14px" fontWeight="700" letterSpacing="2px">
                #{ticket.code}
              </Text>
            </HStack>

            <Text 
              fontSize={{ base: "36px", md: "52px" }} 
              fontWeight="900" 
              color={textPrimary} 
              lineHeight="1.1" 
              letterSpacing="-1.5px"
              textShadow={isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "none"}
              mb={10}
            >
              {ticket.movie}
            </Text>

            {/* ✅ ĐÃ SỬA LẠI GRID 4 CỘT: NGÀY - GIỜ - RẠP - PHÒNG */}
            <Wrap spacing={10} mb={10}>
              <WrapItem><InfoBox icon={MdCalendarToday} label="Ngày chiếu" value={datePart} highlight isDark={isDark} /></WrapItem>
              <WrapItem><InfoBox icon={MdAccessTime} label="Giờ chiếu" value={timePart} highlight isDark={isDark} /></WrapItem>
              <WrapItem><InfoBox icon={MdLocationOn} label="Rạp" value={ticket.cinema || "Gấu Phim"} isDark={isDark} /></WrapItem>
              <WrapItem><InfoBox icon={MdOutlineTheaters} label="Phòng" value={roomName} isDark={isDark} /></WrapItem>
            </Wrap>

            <Box mb={10}>
              <Text color={textMuted} fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="1px" mb={4}>
                Vị trí ghế ngồi
              </Text>
              <Wrap spacing={3}>
                {seats.map(s => (
                  <WrapItem key={s}>
                    <Flex 
                      w="50px" h="50px" borderRadius="12px" 
                      bg={isDark ? "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))" : "#fff7ed"}
                      border={`1px solid ${isDark ? "rgba(249,115,22,0.5)" : "#fed7aa"}`}
                      boxShadow={isDark ? "0 0 15px rgba(249,115,22,0.3)" : "0 4px 10px rgba(249,115,22,0.1)"}
                      align="center" justify="center"
                    >
                      <Text fontSize="18px" fontWeight="900" color={isDark ? "#fb923c" : "#ea580c"}>{s}</Text>
                    </Flex>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            <Box p={5} borderRadius="16px" bg={boxBg} border={`1px solid ${boxBorder}`}>
               <HStack spacing={8} flexWrap="wrap">
                 <InfoBox icon={MdPerson} label="Khách hàng" value={ticket.customer} isDark={isDark} />
                 <InfoBox icon={MdPhone} label="SĐT" value={ticket.phone} isDark={isDark} />
               </HStack>
            </Box>

          </Box>

          {/* ĐƯỜNG XÉ VÉ (Vertical Divider) */}
          <Box 
            display={{ base: "none", lg: "block" }} 
            w="2px" 
            bgImage={`linear-gradient(to bottom, ${dashColor} 50%, transparent 50%)`}
            bgSize="2px 20px"
            position="relative"
          >
            <Box position="absolute" top="-20px" left="-19px" w="40px" h="40px" borderRadius="full" bg={notchBg} boxShadow={isDark ? "inset 0 5px 10px rgba(0,0,0,0.5)" : "inset 0 5px 10px rgba(0,0,0,0.05)"} />
            <Box position="absolute" bottom="-20px" left="-19px" w="40px" h="40px" borderRadius="full" bg={notchBg} boxShadow={isDark ? "inset 0 -5px 10px rgba(0,0,0,0.5)" : "inset 0 -5px 10px rgba(0,0,0,0.05)"} />
          </Box>

          {/* CỘT PHẢI: QR & THANH TOÁN */}
          <Box w={{ base: "100%", lg: "380px" }} p={{ base: 6, md: 10 }} display="flex" flexDirection="column" justify="space-between">
            
            <Box textAlign="center" mb={8}>
              <Box 
                display="inline-block" p={4} borderRadius="24px" 
                bg="white" 
                boxShadow={isDark ? "0 0 40px rgba(74, 158, 255, 0.2), 0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.1)"}
                mb={6}
              >
                <QRCodeCanvas value={qrData} size={200} level="H" />
              </Box>
              <Text color={textMuted} fontSize="13px" fontWeight="500">
                Đưa mã này cho nhân viên soát vé
              </Text>
            </Box>

            <Box>
              <Box h="1px" bg={dashColor} mb={6} />
              <Flex justify="space-between" align="flex-end" mb={6}>
                <Box>
                  <Text color={textMuted} fontSize="12px" fontWeight="600" textTransform="uppercase" mb={1}>Tổng thanh toán</Text>
                  <Text color="#10b981" fontSize="32px" fontWeight="900" letterSpacing="-1px">{ticket.price}</Text>
                </Box>
              </Flex>
              
              <Button
                w="100%" h="50px" borderRadius="12px" fontSize="14px" fontWeight="800"
                bg={btnGhostBg} color={btnGhostColor} border={`1px solid ${btnGhostBorder}`}
                backdropFilter="blur(10px)" _hover={{ bg: isDark ? "rgba(26, 58, 92, 0.8)" : "gray.100" }}
                leftIcon={<Icon as={MdContentCopy} />} onClick={handleCopy}
              >
                Sao chép mã vé
              </Button>
            </Box>
          </Box>
        </Flex>

        {/* Nút Xóa (Ẩn dưới cùng, tinh tế) */}
        <Flex justify="center" mt={10}>
          <Button 
            variant="unstyled" color={isDark ? "rgba(239,68,68,0.6)" : "rgba(239,68,68,0.8)"} fontSize="13px" fontWeight="600"
            _hover={{ color: "#ef4444", textDecoration: "underline" }}
            leftIcon={<Icon as={MdDelete} />} onClick={() => onDelete(ticket.id, ticket.showtimeSeatId)}
          >
            Xóa vĩnh viễn vé này
          </Button>
        </Flex>

      </Box>
    </Box>
  );
};