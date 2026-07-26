// src/views/admin/quanlyve/components/TicketDetail.jsx
import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Divider,
  useToast,
} from "@chakra-ui/react";
import {
  MdArrowBack,
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdEventSeat,
  MdDelete,
  MdCancel,
  MdLocalOffer,
  MdStickyNote2,
  MdContentCopy,
  MdLocalMovies,
} from "react-icons/md";

const STATUS_CFG = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Paid": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã check-in": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Pending": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Đã hủy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Cancelled": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hết hạn": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

const StatusBadge = ({ status, light }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Hết hạn"];
  if (light) {
    // Phiên bản dùng trên nền tối của sidebar vé
    return (
      <HStack spacing="6px" bg="rgba(255,255,255,0.12)" px="10px" py="4px" borderRadius="full" w="fit-content">
        <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
        <Text fontSize="11px" fontWeight="700" color="white">
          {status}
        </Text>
      </HStack>
    );
  }
  return (
    <Flex align="center" gap="6px" px="10px" py="5px" borderRadius="8px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color} whiteSpace="nowrap">
        {status}
      </Text>
    </Flex>
  );
};

// Một mục trong danh sách chi tiết: icon vuông bo góc + nhãn + giá trị
const DetailItem = ({ icon, label, value, isDark, children }) => (
  <HStack spacing="12px" align="flex-start" w="100%">
    <Flex
      w="36px"
      h="36px"
      minW="36px"
      borderRadius="10px"
      bg={isDark ? "rgba(249,115,22,0.12)" : "#fff1e6"}
      align="center"
      justify="center"
    >
      <Icon as={icon} boxSize="16px" color="#f97316" />
    </Flex>
    <Box minW="0" flex={1}>
      <Text fontSize="10px" fontWeight="700" color={isDark ? "#7787ac" : "#94a3b8"} letterSpacing=".6px" textTransform="uppercase" mb="3px">
        {label}
      </Text>
      {children || (
        <Text fontSize="14px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} noOfLines={2}>
          {value}
        </Text>
      )}
    </Box>
  </HStack>
);

// Tiêu đề nhỏ chia section, chỉ để tạo cấu trúc rõ ràng — không trang trí thừa
const SectionLabel = ({ children, isDark }) => (
  <Text
    fontSize="11px"
    fontWeight="800"
    letterSpacing="1px"
    textTransform="uppercase"
    color={isDark ? "#5b6b93" : "#b6bece"}
    mb="14px"
  >
    {children}
  </Text>
);

export const TicketDetail = ({ ticket, onBack, onEdit, onDelete, onCancel, isDark }) => {
  const OR = "#f97316";
  const ORL = "#fb923c";
  const ORSW = "rgba(249,115,22,0.35)";
  const toast = useToast();

  const cardBg = isDark ? "#0b1437" : "white";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "#eef0f6";
  const textPrimary = isDark ? "#f7fafc" : "#0f172a";
  const textMuted = isDark ? "#7787ac" : "#94a3b8";
  const dashColor = "rgba(255,255,255,0.28)";
  const posterUrl = ticket.poster || ticket.image || ticket.thumbnail || null;

  const seats = String(ticket.seat || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [datePart, ...timeRest] = String(ticket.showtime || "").split(" ");
  const timePart = timeRest.join(" ");

  const canCancel = ticket.status !== "Đã check-in" && ticket.status !== "Cancelled";

  const handleCancel = () => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy vé ${ticket.code}?`)) {
      if (onCancel) onCancel(ticket.id, ticket.showtimeSeatId);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vé ${ticket.code}?`)) {
      if (onDelete) onDelete(ticket.id, ticket.showtimeSeatId);
    }
  };

  const copyQr = () => {
    if (ticket.qr) {
      navigator.clipboard.writeText(ticket.qr);
      toast({ title: "Đã sao chép mã QR", status: "success", duration: 1800, isClosable: true, position: "top-right" });
    }
  };

  return (
    <Box sx={{ animation: `fadeIn .3s ease both` }}>
      {/* Thanh hành động */}
      <Flex align="center" justify="space-between" mb="20px" flexWrap="wrap" gap="8px">
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={isDark ? "#a0aec0" : "#64748b"}
          borderRadius="10px"
          h="38px"
          fontSize="13px"
          fontWeight="600"
          border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Flex gap="8px" flexWrap="wrap">
          {canCancel && onCancel && (
            <Button
              h="40px"
              px="20px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              variant="outline"
              borderColor={OR}
              color={OR}
              _hover={{ bg: isDark ? "rgba(249,115,22,0.1)" : "#fff1e6" }}
              leftIcon={<Icon as={MdCancel} />}
              onClick={handleCancel}
            >
              Hủy vé
            </Button>
          )}
          <Button
            h="40px"
            px="20px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={`linear-gradient(135deg,${OR},${ORL})`}
            color="white"
            boxShadow={`0 4px 14px ${ORSW}`}
            _hover={{ boxShadow: `0 6px 20px rgba(249,115,22,.4)`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            leftIcon={<Icon as={MdEdit} />}
            onClick={() => onEdit(ticket)}
          >
            Chỉnh sửa
          </Button>
          <Button
            h="40px"
            px="20px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            leftIcon={<Icon as={MdDelete} />}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Flex>
      </Flex>

      {/* Bố cục 2 cột: chi tiết bên trái, thẻ vé bên phải */}
      <Flex gap={{ base: "16px", lg: "20px" }} align="flex-start" direction={{ base: "column", lg: "row" }}>
        {/* ===== Cột trái: chi tiết đặt vé ===== */}
        <Box
          flex="1"
          w="100%"
          bg={cardBg}
          borderRadius="18px"
          border={`1px solid ${cardBorder}`}
          boxShadow={isDark ? "0 4px 20px rgba(0,0,0,.35)" : "0 2px 16px rgba(15,23,42,.05)"}
          p={{ base: "20px", md: "28px" }}
        >
          <HStack spacing="10px" mb="6px" flexWrap="wrap">
            <Box px="9px" py="4px" borderRadius="7px" bg={isDark ? "rgba(249,115,22,0.12)" : "#fff1e6"}>
              <Text fontFamily="mono" fontSize="11.5px" fontWeight="800" color={OR} letterSpacing=".5px">
                #{ticket.code}
              </Text>
            </Box>
            <StatusBadge status={ticket.status} />
          </HStack>
          <Text fontSize={{ base: "19px", md: "23px" }} fontWeight="800" color={textPrimary} letterSpacing="-.3px" lineHeight="1.25" mb="24px">
            {ticket.movie}
          </Text>

          <SectionLabel isDark={isDark}>Suất chiếu</SectionLabel>
          <VStack spacing="18px" align="stretch" mb="26px">
            <HStack spacing="18px" align="flex-start">
              <Box flex={1}>
                <DetailItem icon={MdCalendarToday} label="Ngày chiếu" value={datePart || "—"} isDark={isDark} />
              </Box>
              <Box flex={1}>
                <DetailItem icon={MdAccessTime} label="Giờ chiếu" value={timePart || ticket.showtime || "—"} isDark={isDark} />
              </Box>
            </HStack>
            <DetailItem icon={MdLocationOn} label="Rạp & phòng chiếu" value={ticket.cinema || ticket.room || "Gấu Phim Cinema"} isDark={isDark} />
            <DetailItem icon={MdEventSeat} label="Ghế ngồi" isDark={isDark}>
              <Wrap spacing="6px">
                {(seats.length ? seats : ["—"]).map((s) => (
                  <WrapItem key={s}>
                    <Box px="9px" py="3px" borderRadius="6px" bg={`linear-gradient(135deg,${OR},${ORL})`} color="white" fontSize="12px" fontWeight="800">
                      {s}
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </DetailItem>
          </VStack>

          <Divider borderColor={cardBorder} mb="22px" />

          <SectionLabel isDark={isDark}>Khách hàng</SectionLabel>
          <VStack spacing="18px" align="stretch" mb="26px">
            <HStack spacing="18px" align="flex-start">
              <Box flex={1}>
                <DetailItem icon={MdPerson} label="Họ tên" value={ticket.customer} isDark={isDark} />
              </Box>
              <Box flex={1}>
                <DetailItem icon={MdPhone} label="Số điện thoại" value={ticket.phone || "---"} isDark={isDark} />
              </Box>
            </HStack>
            <DetailItem icon={MdEmail} label="Email" value={ticket.email} isDark={isDark} />
          </VStack>

          <Divider borderColor={cardBorder} mb="22px" />

          <SectionLabel isDark={isDark}>Khác</SectionLabel>
          <HStack spacing="18px" align="flex-start">
            <Box flex={1}>
              <DetailItem icon={MdLocalOffer} label="Combo" value={ticket.combo || "Không có"} isDark={isDark} />
            </Box>
            <Box flex={1}>
              <DetailItem icon={MdStickyNote2} label="Ghi chú" value={ticket.note || "Không có"} isDark={isDark} />
            </Box>
          </HStack>
        </Box>

        {/* ===== Cột phải: thẻ vé (boarding-pass) ===== */}
        <Box
          w={{ base: "100%", lg: "300px" }}
          minW={{ lg: "300px" }}
          borderRadius="18px"
          overflow="hidden"
          boxShadow="0 20px 50px rgba(15,23,42,0.25)"
          position={{ lg: "sticky" }}
          top={{ lg: "20px" }}
        >
          {/* Phần hero cinematic */}
          <Box position="relative" h="120px">
            {posterUrl ? (
              <Box position="absolute" inset="0" bgImage={`url(${posterUrl})`} bgSize="cover" bgPosition="center" />
            ) : (
              <Box position="absolute" inset="0" bg={`linear-gradient(135deg, #1a1033 0%, #2b1650 55%, ${OR}66 100%)`} />
            )}
            <Box position="absolute" inset="0" bg="linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(11,20,55,0.9) 100%)" />
            <Flex position="absolute" inset="0" direction="column" justify="flex-end" p="16px">
              <HStack spacing="5px" mb="4px">
                <Icon as={MdLocalMovies} boxSize="11px" color={OR} />
                <Text fontSize="9px" fontWeight="800" letterSpacing="1.5px" color={OR} textTransform="uppercase">
                  Gấu Phim Cinema
                </Text>
              </HStack>
              <StatusBadge status={ticket.status} light />
            </Flex>
          </Box>

          {/* Thân thẻ vé — nền navy đậm xuyên suốt bất kể light/dark mode, vì đây là "vật thể vé" chứ không phải panel giao diện */}
          <Box bg="#0b1437" px="20px" pt="20px" pb="18px">
            <Text fontSize="10px" fontWeight="700" color="#7787ac" letterSpacing=".8px" textTransform="uppercase" mb="4px" textAlign="center">
              Giá vé
            </Text>
            <Text fontSize="26px" fontWeight="800" color="white" textAlign="center" mb="18px">
              {ticket.price}
            </Text>

            <Flex justify="center" mb="14px">
              <Box p="10px" borderRadius="12px" bg="white">
                <Flex w="132px" h="132px" align="center" justify="center" fontSize="11px" color="#94a3b8" textAlign="center" px="8px">
                  {/* Placeholder hiển thị mã — thay bằng <QRCodeCanvas value={...} size={132} /> nếu cần render QR thật tại đây */}
                  QR: {ticket.qr}
                </Flex>
              </Box>
            </Flex>

            <Text fontFamily="mono" fontSize="13px" fontWeight="800" color="white" letterSpacing="2px" textAlign="center" mb="2px">
              {ticket.qr}
            </Text>
            <Text fontSize="10.5px" color="#7787ac" textAlign="center" mb="16px">
              Quét mã QR để check-in tại rạp
            </Text>

            <Button
              w="100%"
              h="38px"
              borderRadius="9px"
              fontSize="12.5px"
              fontWeight="700"
              bg="rgba(255,255,255,0.08)"
              color="white"
              leftIcon={<Icon as={MdContentCopy} boxSize="13px" />}
              _hover={{ bg: "rgba(255,255,255,0.14)" }}
              onClick={copyQr}
            >
              Sao chép mã
            </Button>
          </Box>

          {/* Đường xé vé + mã vạch */}
          <Box bg="#0b1437" position="relative">
            <Box position="absolute" top="0" left="-1px" right="-1px" borderTop={`2px dashed ${dashColor}`} />
          </Box>
          <Box bg="#0b1437" px="20px" pt="16px" pb="18px">
            <HStack spacing="2px" h="18px" w="100%" justify="center" overflow="hidden" mb="8px">
              {Array.from({ length: 34 }).map((_, i) => (
                <Box key={i} w={i % 5 === 0 ? "2.5px" : "1px"} h={i % 3 === 0 ? "18px" : "10px"} bg="rgba(255,255,255,0.18)" />
              ))}
            </HStack>
            <Text fontSize="9.5px" color="#5b6b93" textAlign="center" fontFamily="mono">
              #{ticket.code}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};