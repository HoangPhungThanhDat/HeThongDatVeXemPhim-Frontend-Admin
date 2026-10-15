// src/views/admin/quanlydonhang/components/OrderDetail.jsx

import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import {
  MdArrowBack,
  MdDelete,
  MdReplay,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdCalendarToday,
  MdAccessTime,
  MdEventSeat,
  MdOutlineFastfood,
  MdSave,
  MdNoteAlt,
  MdTheaters,
  MdMovie,
  MdConfirmationNumber,
} from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { SectionTitle } from "./shared/SectionTitle";
import { fmtVND, OR, ORL, ORSW } from "../constants";
import { fadeUp, fadeIn, shimmer } from "./shared/animations";
import { useFieldStyles } from "./shared/useFieldStyles";

export const OrderDetail = ({
  order,
  onBack,
  onDelete,
  onOpenRefund,
  onSaveNote,
  isAdmin,
  isDark,
}) => {
  const [noteDraft, setNoteDraft] = useState(order.note || "");
  const [noteEditing, setNoteEditing] = useState(false);
  const styles = useFieldStyles(isDark);

  // Lấy dữ liệu từ rawDetail
  const detailData = order.rawDetail || {};
  const rawTickets = detailData.tickets || [];
  const foodAndDrinks = detailData.food_and_drinks || [];
  const customer = detailData.customer || {};
  const promotion = detailData.promotion || null;
  const summary = detailData.summary || {};

  // ✅ Lọc vé trùng lặp dựa trên TicketId hoặc SeatId
  const tickets = useMemo(() => {
    const seen = new Set();
    return rawTickets.filter(ticket => {
      const ticketId = ticket.TicketId || ticket.ticketId;
      const seatId = ticket.seat?.SeatId || ticket.seat?.seatId;
      const key = ticketId || seatId || Math.random().toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawTickets]);

  // ✅ Lấy danh sách ghế duy nhất
  const uniqueSeats = useMemo(() => {
    const seatSet = new Set();
    tickets.forEach(ticket => {
      const seat = ticket.seat || {};
      const row = seat.Row || seat.row || "";
      const number = seat.Number || seat.number || "";
      const seatLabel = row + number;
      if (seatLabel) seatSet.add(seatLabel);
    });
    return Array.from(seatSet);
  }, [tickets]);

  // ✅ TÍNH TOÁN TỔNG TIỀN CHÍNH XÁC
  const ticketTotal = useMemo(() => {
    return tickets.reduce((sum, ticket) => {
      return sum + (ticket.Price || ticket.price || 0);
    }, 0);
  }, [tickets]);

  const comboTotal = useMemo(() => {
    return foodAndDrinks.reduce((sum, item) => {
      return sum + (item.TotalPrice || item.totalPrice || (item.Price || item.price || 0) * (item.Quantity || item.quantity || 1));
    }, 0);
  }, [foodAndDrinks]);

  // Tổng thực tế = Tiền vé + Combo - Giảm giá
  const discountAmount = summary.discount_amount || 0;
  const finalTotal = ticketTotal + comboTotal - discountAmount;
  const displayTotal = order.total || finalTotal;

  const InfoTile = ({ icon, label, val }) => (
    <Box
      p={{ base: "10px 12px", md: "10px 14px" }}
      borderRadius="10px"
      bg={isDark ? "#1B254B" : "#f8fafc"}
      border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
    >
      <Flex align="center" gap="6px" mb="4px">
        <Icon as={icon} boxSize="11px" color="#ea580c" />
        <Text
          fontSize="9.5px"
          fontWeight="700"
          color={isDark ? "#718096" : "#94a3b8"}
          letterSpacing=".8px"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} noOfLines={2}>
        {val || "Đang cập nhật"}
      </Text>
    </Box>
  );

  // Ticket Card
  const TicketCard = ({ ticket, index }) => {
    const showtime = ticket.showtime || {};
    const movie = ticket.movie || {};
    const seat = ticket.seat || {};
    const room = ticket.room || {};
    const cinema = ticket.cinema || {};

    return (
      <Box
        p="12px"
        borderRadius="10px"
        bg={isDark ? "#1B254B" : "#f8fafc"}
        border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
        mb="8px"
      >
        <Flex align="center" justify="space-between" mb="6px">
          <Flex align="center" gap="6px">
            <Icon as={MdConfirmationNumber} boxSize="14px" color={OR} />
            <Text fontSize="12px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"}>
              Vé #{index + 1}
            </Text>
          </Flex>
          <Badge colorScheme="orange" fontSize="10px">
            {ticket.Status || ticket.status || "Đã đặt"}
          </Badge>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing="6px" fontSize="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdMovie} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
            <Text color={isDark ? "#e2e8f0" : "#334155"}>{movie.Title || movie.title || "Đang cập nhật"}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdEventSeat} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
            <Text color={isDark ? "#e2e8f0" : "#334155"} fontWeight="600">
              {seat.Row || seat.row || ""}{seat.Number || seat.number || ""}
            </Text>
            {seat.SeatType && (
              <Badge size="sm" colorScheme="purple" fontSize="9px">
                {seat.SeatType}
              </Badge>
            )}
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdTheaters} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
            <Text color={isDark ? "#e2e8f0" : "#334155"}>{room.Name || room.name || "Phòng"}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdLocationOn} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
            <Text color={isDark ? "#e2e8f0" : "#334155"}>{cinema.Name || cinema.name || "Rạp"}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
            <Text color={isDark ? "#e2e8f0" : "#334155"}>
              {showtime.StartTime ? new Date(showtime.StartTime).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              }) : "Đang cập nhật"}
            </Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Text fontWeight="600" color={OR}>{fmtVND(ticket.Price || ticket.price || 0)}</Text>
          </Flex>
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <Box sx={{ animation: `${fadeIn} .3s ease both` }}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb="20px" flexWrap="wrap" gap="10px">
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          color={isDark ? "#a0aec0" : "#64748b"}
          borderRadius="10px"
          h={{ base: "40px", md: "38px" }}
          fontSize="13px"
          fontWeight="600"
          border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? "#1B254B" : "#f8fafc" }}
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Flex gap="8px">
          {order.refundStatus === "Đang chờ duyệt" && isAdmin && (
            <Button
              h={{ base: "40px", md: "40px" }}
              px="18px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              color="white"
              boxShadow={`0 4px 16px ${ORSW}`}
              _hover={{ boxShadow: `0 8px 24px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
              transition="all .2s"
              leftIcon={<Icon as={MdReplay} />}
              onClick={() => onOpenRefund(order)}
            >
              Xử lý hoàn tiền
            </Button>
          )}
          {isAdmin && (
            <Button
              h={{ base: "40px", md: "40px" }}
              px="18px"
              borderRadius="10px"
              fontWeight="700"
              fontSize="13px"
              bg="#fef2f2"
              color="#dc2626"
              border="1px solid #fecaca"
              _hover={{ bg: "#fee2e2" }}
              transition="all .2s"
              leftIcon={<Icon as={MdDelete} />}
              onClick={() => onDelete(order)}
            >
              Xóa vĩnh viễn
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Main Card */}
      <Box
        bg={isDark ? "#0b1437" : "white"}
        borderRadius="18px"
        border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(0,0,0,.06)"}
        overflow="hidden"
        mb="18px"
      >
        <Box
          h="4px"
          bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Box p={{ base: "18px", md: "26px" }}>
          {/* Header Info */}
          <Flex justify="space-between" align="flex-start" mb="14px" direction={{ base: "column", md: "row" }} gap={{ base: "10px", md: "0" }}>
            <Box>
              <Flex align="center" gap="10px" mb="8px" flexWrap="wrap">
                <Box px="9px" py="4px" borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="800" color={OR} letterSpacing=".5px">{order.code}</Text>
                </Box>
                {order.refundStatus && <StatusBadge status={order.refundStatus} type="refund" />}
              </Flex>
              <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} letterSpacing="-.3px">
                {order.movieTitle}
              </Text>
            </Box>
            <StatusBadge status={order.orderStatus} type="order" />
          </Flex>

          <Box h="1px" bg={isDark ? "#2D3A6B" : "#f1f5f9"} mb="16px" />

          {/* Customer Info */}
          <SectionTitle label="Thông tin khách hàng" isDark={isDark} />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="10px" mb="18px">
            <InfoTile icon={MdPerson} label="Khách hàng" val={customer.FullName || customer.fullName || order.customerName} />
            <InfoTile icon={MdPhone} label="Số điện thoại" val={customer.PhoneNumber || customer.phone || order.customerPhone} />
            <InfoTile icon={MdEmail} label="Email" val={customer.Email || customer.email || order.customerEmail} />
          </SimpleGrid>

          {/* Showtime Info */}
          <SectionTitle label="Thông tin suất chiếu" isDark={isDark} />
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="18px">
            <InfoTile icon={MdLocationOn} label="Rạp" val={order.cinema} />
            <InfoTile icon={MdTheaters} label="Phòng chiếu" val={order.room} />
            <InfoTile icon={MdCalendarToday} label="Ngày chiếu" val={order.showtime?.split(" ").slice(1).join(" ") || "Đang cập nhật"} />
            <InfoTile icon={MdAccessTime} label="Giờ chiếu" val={order.showtime?.split(" ")[0] || "Đang cập nhật"} />
          </SimpleGrid>

          {/* Tickets */}
          <SectionTitle label={`Chi tiết vé (${tickets.length} vé)`} isDark={isDark} />
          {tickets.length > 0 ? (
            <Box mb="18px">
              {tickets.map((ticket, idx) => (
                <TicketCard key={idx} ticket={ticket} index={idx} />
              ))}
            </Box>
          ) : (
            <Text fontSize="13px" color={isDark ? "#718096" : "#94a3b8"} mb="16px">
              Chưa có thông tin vé
            </Text>
          )}

          {/* Seats */}
          {uniqueSeats.length > 0 && (
            <>
              <SectionTitle label={`Ghế đã đặt (${uniqueSeats.length} ghế)`} isDark={isDark} />
              <Flex gap="8px" flexWrap="wrap" mb="18px">
                {uniqueSeats.map((s) => (
                  <Flex key={s} align="center" gap="5px" px="10px" py="6px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
                    <Icon as={MdEventSeat} boxSize="12px" color={OR} />
                    <Text fontSize="12px" fontWeight="800" color={OR}>{s}</Text>
                  </Flex>
                ))}
              </Flex>
            </>
          )}

          {/* Food & Drinks */}
          <SectionTitle label="Combo & Đồ uống" isDark={isDark} />
          {foodAndDrinks.length > 0 ? (
            <Box mb="18px">
              {foodAndDrinks.map((item, idx) => (
                <Flex
                  key={idx}
                  align="center"
                  justify="space-between"
                  px="12px"
                  py="8px"
                  borderRadius="8px"
                  bg={isDark ? "#1B254B" : "#f8fafc"}
                  border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
                  mb="6px"
                >
                  <Flex align="center" gap="8px">
                    <Icon as={MdOutlineFastfood} boxSize="13px" color={isDark ? "#a0aec0" : "#64748b"} />
                    <Text fontSize="12.5px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
                      {item.Name || item.name || "Sản phẩm"}
                    </Text>
                    <Badge colorScheme="blue" fontSize="10px">
                      x{item.Quantity || item.quantity || 1}
                    </Badge>
                  </Flex>
                  <Text fontSize="12px" fontWeight="700" color={OR}>
                    {fmtVND(item.TotalPrice || item.totalPrice || item.Price || item.price || 0)}
                  </Text>
                </Flex>
              ))}
            </Box>
          ) : (
            <Text fontSize="13px" color={isDark ? "#718096" : "#94a3b8"} mb="16px">
              Không có combo đi kèm
            </Text>
          )}

          {/* Promotion */}
          {promotion && (
            <>
              <SectionTitle label="Khuyến mãi" isDark={isDark} />
              <Box
                px="12px"
                py="8px"
                borderRadius="8px"
                bg="#f0fdf4"
                border="1px solid #86efac"
                mb="18px"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="8px">
                    <Badge colorScheme="green" fontSize="11px">Mã: {promotion.Code || promotion.code}</Badge>
                    <Text fontSize="12px" fontWeight="600" color="#166534">
                      {promotion.Title || promotion.title}
                    </Text>
                  </Flex>
                  <Text fontSize="13px" fontWeight="700" color="#16a34a">
                    -{promotion.DiscountValue || 0}%
                  </Text>
                </Flex>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* ✅ TỔNG HÓA ĐƠN - ĐÃ SỬA */}
      <Box
        bg={isDark ? "#0b1437" : "white"}
        borderRadius="16px"
        border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
        p={{ base: "16px", md: "20px" }}
        mb="18px"
        sx={{ animation: `${fadeUp} .4s ease .05s both` }}
      >
        <SectionTitle label="Tổng hóa đơn" isDark={isDark} />

        {/* 1. Tiền vé */}
        <Flex justify="space-between" py="6px">
          <Text fontSize="12.5px" color={isDark ? "#a0aec0" : "#64748b"}>
            Tiền vé ({tickets.length} vé × {tickets.length > 0 ? fmtVND(Math.round(ticketTotal / tickets.length)) : '0đ'})
          </Text>
          <Text fontSize="12.5px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
            {fmtVND(ticketTotal)}
          </Text>
        </Flex>

        {/* 2. Combo */}
        {comboTotal > 0 && (
          <Flex justify="space-between" py="6px">
            <Text fontSize="12.5px" color={isDark ? "#a0aec0" : "#64748b"}>
              Combo ({foodAndDrinks.map(f => f.Name || f.name).join(', ') || 'bắp nước'})
            </Text>
            <Text fontSize="12.5px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
              {fmtVND(comboTotal)}
            </Text>
          </Flex>
        )}

        {/* 3. Giảm giá */}
        {discountAmount > 0 && (
          <Flex justify="space-between" py="6px">
            <Text fontSize="12.5px" color="#16a34a">Giảm giá</Text>
            <Text fontSize="12.5px" fontWeight="600" color="#16a34a">
              -{fmtVND(discountAmount)}
            </Text>
          </Flex>
        )}

        <Box h="1px" bg={isDark ? "#2D3A6B" : "#f1f5f9"} my="10px" />

        {/* 4. Tổng cộng */}
        <Flex justify="space-between" align="center">
          <Text fontSize="14px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>
            Tổng cộng
          </Text>
          <Text fontSize="22px" fontWeight="800" color={OR}>
            {fmtVND(displayTotal)}
          </Text>
        </Flex>

        {/* ✅ HIỂN THỊ CÔNG THỨC TÍNH */}
        <Flex justify="center" mt="6px">
          <Text fontSize="10px" color={isDark ? "#718096" : "#94a3b8"}>
            {fmtVND(ticketTotal)} 
            {comboTotal > 0 ? ` + ${fmtVND(comboTotal)}` : ''}
            {discountAmount > 0 ? ` - ${fmtVND(discountAmount)}` : ''} 
            = {fmtVND(displayTotal)}
          </Text>
        </Flex>

        <Flex align="center" justify="space-between" mt="14px">
          <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>
            Thời gian đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "Đang cập nhật"}
          </Text>
          <StatusBadge status={order.paymentStatus} type="payment" />
        </Flex>
      </Box>

      {/* Refund info */}
      {order.refundStatus && (
        <Box
          bg={isDark ? "#0b1437" : "white"}
          borderRadius="16px"
          border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
          boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
          p={{ base: "16px", md: "20px" }}
          mb="18px"
          sx={{ animation: `${fadeUp} .4s ease .08s both` }}
        >
          <SectionTitle label="Yêu cầu hoàn tiền" isDark={isDark} />
          <Flex align="center" gap="10px" mb="10px">
            <StatusBadge status={order.refundStatus} type="refund" />
          </Flex>
          <Text fontSize="13px" color={isDark ? "#e2e8f0" : "#334155"} lineHeight="1.6">
            {order.refundReason || "Không có lý do."}
          </Text>
        </Box>
      )}

      {/* Internal note */}
      <Box
        bg={isDark ? "#0b1437" : "white"}
        borderRadius="16px"
        border={isDark ? "1px solid #2D3A6B" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
        p={{ base: "16px", md: "20px" }}
        sx={{ animation: `${fadeUp} .4s ease .1s both` }}
      >
        <SectionTitle label="Ghi chú nội bộ" isDark={isDark} />
        {noteEditing ? (
          <>
            <Textarea
              {...styles}
              rows={3}
              placeholder="Thêm ghi chú nội bộ cho đơn hàng này..."
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              mb="10px"
            />
            <Flex gap="8px">
              <Button
                h="36px"
                px="16px"
                borderRadius="9px"
                fontSize="12.5px"
                fontWeight="700"
                bg={`linear-gradient(135deg,${OR},${ORL})`}
                color="white"
                leftIcon={<Icon as={MdSave} boxSize="13px" />}
                onClick={() => { onSaveNote(order, noteDraft); setNoteEditing(false); }}
              >
                Lưu ghi chú
              </Button>
              <Button
                h="36px"
                px="16px"
                borderRadius="9px"
                fontSize="12.5px"
                fontWeight="600"
                variant="ghost"
                color={isDark ? "#a0aec0" : "#64748b"}
                border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #e2e8f0"}
                onClick={() => { setNoteDraft(order.note || ""); setNoteEditing(false); }}
              >
                Hủy
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Text fontSize="13px" color={order.note ? (isDark ? "#e2e8f0" : "#334155") : (isDark ? "#718096" : "#94a3b8")} lineHeight="1.6" mb="10px">
              {order.note || "Chưa có ghi chú nào cho đơn hàng này."}
            </Text>
            <Button
              h="34px"
              px="14px"
              borderRadius="9px"
              fontSize="12px"
              fontWeight="600"
              bg={isDark ? "#1B254B" : "#f8fafc"}
              color={isDark ? "#e2e8f0" : "#475569"}
              border={isDark ? "1px solid #2D3A6B" : "1px solid #e2e8f0"}
              leftIcon={<Icon as={MdNoteAlt} boxSize="13px" />}
              onClick={() => setNoteEditing(true)}
            >
              {order.note ? "Sửa ghi chú" : "Thêm ghi chú"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};