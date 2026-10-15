// src/views/admin/quanlydatve/components/OrderDetail.jsx

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Grid,
  Textarea,
} from "@chakra-ui/react";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdMovie,
  MdLocationOn,
  MdAccessTime,
  MdEventSeat,
  MdAttachMoney,
  MdEdit,
  MdCheckCircle,
  MdBlock,
  MdWarning,
  MdQrCode2,
  MdNewReleases,
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { StatusBadge } from "./shared/StatusBadge";
import { shimmer } from "./shared/animations";
import { QRModal } from "./QRModal";

export const OrderDetail = ({
  order,
  onBack,
  onUpdateNote,
  onApproveRefund,
  onRejectRefund,
  G,
}) => {
  const [note, setNote] = useState(order.note || "");
  const [editNote, setEditNote] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundReject, setShowRefundReject] = useState(false);

  // ✅ Xác định dark mode từ G
  const isDark = G?.ink === "#f7fafc";
  
  // ✅ Sử dụng màu từ G hoặc fallback
  const bg = G?.bgCard || (isDark ? "#16213e" : "white");
  const bgCard = G?.bgCard || (isDark ? "#16213e" : "white");
  const bgHover = isDark ? "#1a2744" : "#f8fafc";
  const bgInput = isDark ? "#1a2744" : "#fafafa";
  const ink = G?.ink || (isDark ? "#f7fafc" : "#0f172a");
  const ink2 = G?.ink2 || (isDark ? "#e2e8f0" : "#475569");
  const ink3 = G?.ink3 || (isDark ? "#a0aec0" : "#64748b");
  const ink4 = G?.ink4 || (isDark ? "#718096" : "#94a3b8");
  const ink5 = G?.ink5 || (isDark ? "#4a5568" : "#e2e8f0");
  const ink6 = G?.ink6 || (isDark ? "#2d3748" : "#f1f5f9");
  const borderColor = isDark ? "#2D3A6B" : "#f1f5f9";
  const borderLight = isDark ? "#2D3A6B" : "#e2e8f0";

  return (
    <Box sx={{ animation: "fadeIn 0.28s ease both" }}>
      {showQR && <QRModal ticketId={order.id} onClose={() => setShowQR(false)} G={G} />}

      {/* Header */}
      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        mb="18px"
        gap="10px"
      >
        <Flex align="center" gap="10px">
          <Button
            leftIcon={<Icon as={MdArrowBack} />}
            variant="ghost"
            color={isDark ? G.ink3 : "#64748b"}
            borderRadius="10px"
            h="38px"
            fontSize="13px"
            fontWeight="600"
            border={isDark ? `1.5px solid ${G.ink5}` : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? G.ink6 : "#f8fafc" }}
            onClick={onBack}
          >
            <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
            <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
          </Button>
          <Box>
            <Text fontSize={{ base: "16px", md: "19px" }} fontWeight="800" color={ink} letterSpacing="-0.3px">
              Chi tiết đơn hàng
            </Text>
            <Text fontSize="12px" color={isDark ? G.ink4 : "#94a3b8"}>{order.id}</Text>
          </Box>
        </Flex>
        <Button
          h="38px"
          px="16px"
          borderRadius="10px"
          fontSize="12.5px"
          fontWeight="700"
          bg={isDark ? G.ink6 : "#f8fafc"}
          color={isDark ? G.ink2 : "#475569"}
          border={isDark ? `1px solid ${G.ink5}` : "1px solid #e2e8f0"}
          leftIcon={<Icon as={MdQrCode2} />}
          _hover={{ bg: isDark ? G.ink6 : "#f1f5f9" }}
          onClick={() => setShowQR(true)}
        >
          Xem QR vé
        </Button>
      </Flex>

      {/* Hero Card */}
      <Box
        bg={bg}
        borderRadius="18px"
        border={`1px solid ${borderColor}`}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(0,0,0,0.06)"}
        mb="14px"
        overflow="hidden"
      >
        <Box
          h="4px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Box p={{ base: "18px", md: "24px" }}>
          <Flex gap="8px" mb="16px" flexWrap="wrap">
            <StatusBadge status={order.status} type="order" G={G} />
            <StatusBadge status={order.payStatus} type="pay" G={G} />
            {order.refundStatus && (
              <StatusBadge status={order.refundStatus} type="refund" G={G} />
            )}
            {order.isNew && (
              <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa">
                <Icon as={MdNewReleases} boxSize="11px" color="#f97316" />
                <Text fontSize="11.5px" fontWeight="700" color="#f97316">Mới</Text>
              </Flex>
            )}
          </Flex>

          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap="12px">
            {/* Khách hàng */}
            <Box 
              p="14px" 
              borderRadius="12px" 
              bg={isDark ? "#1a2744" : "#f8fafc"} 
              border={`1px solid ${borderColor}`}
            >
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdPerson} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                  Khách hàng
                </Text>
              </Flex>
              <Text fontSize="14px" fontWeight="700" color={ink} mb="4px">{order.customer}</Text>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdEmail} boxSize="10px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="11.5px" color={ink2}>{order.email}</Text>
              </Flex>
              <Flex align="center" gap="5px">
                <Icon as={MdPhone} boxSize="10px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="11.5px" color={ink2}>{order.phone}</Text>
              </Flex>
            </Box>

            {/* Phim & Suất chiếu */}
            <Box 
              p="14px" 
              borderRadius="12px" 
              bg={isDark ? "#1a2744" : "#f8fafc"} 
              border={`1px solid ${borderColor}`}
            >
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdMovie} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                  Phim & Suất chiếu
                </Text>
              </Flex>
              <Text fontSize="13.5px" fontWeight="700" color={ink} mb="4px" noOfLines={1}>{order.movie}</Text>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdLocationOn} boxSize="10px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="11.5px" color={ink2}>{order.cinema}</Text>
              </Flex>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdAccessTime} boxSize="10px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="11.5px" color={ink2}>{order.showtime}</Text>
              </Flex>
              <Flex align="center" gap="5px">
                <Icon as={MdEventSeat} boxSize="10px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="11.5px" color={ink2}>{order.room}</Text>
              </Flex>
            </Box>

            {/* Thanh toán */}
            <Box 
              p="14px" 
              borderRadius="12px" 
              bg={isDark ? "#1a2744" : "#f8fafc"} 
              border={`1px solid ${borderColor}`}
            >
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdAttachMoney} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                  Thanh toán
                </Text>
              </Flex>
              <Text fontSize="18px" fontWeight="800" color="#f97316" mb="4px">
                {order.total.toLocaleString("vi-VN")}đ
              </Text>
              <Text fontSize="11.5px" color={ink2} mb="3px">{order.payMethod}</Text>
              <Text fontSize="11px" color={isDark ? G.ink4 : "#94a3b8"}>Đặt lúc {order.createdAt}</Text>
            </Box>
          </Grid>

          {/* Ghế & Combo */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mt="12px">
            <Box p="14px" borderRadius="12px" bg="#fff7ed" border="1px solid #fed7aa">
              <Flex align="center" gap="7px" mb="10px">
                <Icon as={MdEventSeat} boxSize="13px" color="#f97316" />
                <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px" textTransform="uppercase">
                  Ghế đã đặt ({order.seats?.length || 0} ghế)
                </Text>
              </Flex>
              <Flex gap="6px" flexWrap="wrap">
                {order.seats && order.seats.map((s) => (
                  <Box key={s} px="10px" py="5px" borderRadius="7px" bg="white" border="1px solid #fed7aa">
                    <Text fontSize="12px" fontWeight="800" color="#f97316">{s}</Text>
                  </Box>
                ))}
                {order.format && (
                  <Box px="10px" py="5px" borderRadius="7px" bg="white" border="1px solid #fed7aa">
                    <Text fontSize="12px" fontWeight="600" color="#92400e">{order.format}</Text>
                  </Box>
                )}
              </Flex>
            </Box>
            <Box 
              p="14px" 
              borderRadius="12px" 
              bg={isDark ? "#1a2744" : "#f8fafc"} 
              border={`1px solid ${borderColor}`}
            >
              <Flex align="center" gap="7px" mb="10px">
                <Icon as={FaBoxOpen} boxSize="12px" color={isDark ? G.ink4 : "#94a3b8"} />
                <Text fontSize="10px" fontWeight="800" color={isDark ? G.ink4 : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
                  Combo bắp nước
                </Text>
              </Flex>
              <Text fontSize="12.5px" color={order.combo ? (isDark ? G.ink : "#0f172a") : (isDark ? G.ink4 : "#cbd5e1")} fontWeight={order.combo ? "600" : "400"}>
                {order.combo || "Không có combo"}
              </Text>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* Ghi chú & Hoàn tiền */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="14px" mb="14px">
        {/* Ghi chú nội bộ */}
        <Box 
          bg={bg} 
          borderRadius="16px" 
          border={`1px solid ${borderColor}`} 
          p={{ base: "16px", md: "20px" }}
        >
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
              <Text fontSize="13px" fontWeight="800" color={ink}>Ghi chú nội bộ</Text>
            </Flex>
            {!editNote && (
              <Button
                size="xs"
                h="28px"
                px="10px"
                borderRadius="7px"
                bg={isDark ? G.ink6 : "#f8fafc"}
                color={isDark ? G.ink3 : "#64748b"}
                border={isDark ? `1px solid ${G.ink5}` : "1px solid #e2e8f0"}
                fontSize="11px"
                fontWeight="600"
                leftIcon={<Icon as={MdEdit} boxSize="11px" />}
                _hover={{ bg: isDark ? G.ink6 : "#f1f5f9" }}
                onClick={() => setEditNote(true)}
              >
                Sửa
              </Button>
            )}
          </Flex>
          {editNote ? (
            <>
              <Textarea
                bg={isDark ? "#1a2744" : "#fafafa"}
                border={isDark ? `1.5px solid ${G.ink5}` : "1.5px solid #e8edf3"}
                borderRadius="10px"
                fontSize="13px"
                color={isDark ? G.ink : "#1a202c"}
                px="12px"
                py="10px"
                _focus={{
                  border: "1.5px solid #f97316",
                  boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
                  bg: isDark ? G.bgCard : "#fff",
                }}
                _hover={{ border: "1.5px solid #f97316", bg: isDark ? G.bgCard : "#fff" }}
                rows={4}
                placeholder="Nhập ghi chú nội bộ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Flex gap="8px" mt="10px">
                <Button
                  flex="1"
                  h="36px"
                  borderRadius="9px"
                  fontSize="12px"
                  fontWeight="700"
                  bg="linear-gradient(135deg, #f97316, #fb923c)"
                  color="white"
                  boxShadow="0 2px 8px rgba(249,115,22,0.3)"
                  _hover={{ opacity: 0.88 }}
                  onClick={() => { onUpdateNote(order.id, note); setEditNote(false); }}
                >
                  Lưu ghi chú
                </Button>
                <Button
                  flex="1"
                  h="36px"
                  borderRadius="9px"
                  fontSize="12px"
                  fontWeight="600"
                  variant="ghost"
                  color={isDark ? G.ink3 : "#64748b"}
                  border={isDark ? `1.5px solid ${G.ink5}` : "1.5px solid #e2e8f0"}
                  _hover={{ bg: isDark ? G.ink6 : "#f8fafc" }}
                  onClick={() => { setNote(order.note); setEditNote(false); }}
                >
                  Hủy
                </Button>
              </Flex>
            </>
          ) : (
            <Box
              p="12px 14px"
              borderRadius="10px"
              bg={isDark ? "#1a2744" : "#f8fafc"}
              border={`1px solid ${borderColor}`}
              minH="70px"
            >
              <Text fontSize="12.5px" color={note ? (isDark ? G.ink2 : "#475569") : (isDark ? G.ink4 : "#cbd5e1")} lineHeight="1.7">
                {note || "Chưa có ghi chú."}
              </Text>
            </Box>
          )}
        </Box>

        {/* Xử lý hoàn tiền */}
        {(order.status === "Hoàn tiền" || order.status === "Đã hủy") && (
          <Box 
            bg={bg} 
            borderRadius="16px" 
            border={`1px solid ${borderColor}`} 
            p={{ base: "16px", md: "20px" }}
          >
            <Flex align="center" gap="8px" mb="12px">
              <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
              <Text fontSize="13px" fontWeight="800" color={ink}>Xử lý hoàn tiền</Text>
            </Flex>
            {order.refundStatus === "Chờ xử lý" && (
              <Box p="12px 14px" borderRadius="10px" bg="#fffbeb" border="1px solid #fcd34d" mb="12px">
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={MdWarning} boxSize="12px" color="#d97706" />
                  <Text fontSize="11px" fontWeight="800" color="#92400e" textTransform="uppercase" letterSpacing="0.8px">
                    Lý do yêu cầu
                  </Text>
                </Flex>
                <Text fontSize="12.5px" color={isDark ? G.ink2 : "#475569"}>{order.refundNote || "Không có lý do."}</Text>
              </Box>
            )}
            {order.refundStatus === "Chờ xử lý" && (
              <>
                {showRefundReject && (
                  <Box mb="10px">
                    <Text fontSize="10.5px" fontWeight="700" color={isDark ? G.ink3 : "#64748b"} textTransform="uppercase" letterSpacing="0.7px" mb="6px">
                      Lý do từ chối *
                    </Text>
                    <Textarea
                      bg={isDark ? "#1a2744" : "#fafafa"}
                      border={isDark ? `1.5px solid ${G.ink5}` : "1.5px solid #e8edf3"}
                      borderRadius="10px"
                      fontSize="13px"
                      px="12px"
                      py="8px"
                      _focus={{
                        border: "1.5px solid #f97316",
                        boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
                        bg: isDark ? G.bgCard : "#fff",
                      }}
                      rows={3}
                      placeholder="Nhập lý do từ chối..."
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                    />
                  </Box>
                )}
                <Flex gap="8px">
                  <Button
                    flex="1"
                    h="38px"
                    borderRadius="10px"
                    fontSize="12px"
                    fontWeight="700"
                    bg="#ecfdf5"
                    color="#059669"
                    border="1px solid #6ee7b7"
                    leftIcon={<Icon as={MdCheckCircle} boxSize="12px" />}
                    _hover={{ bg: "#d1fae5" }}
                    onClick={() => onApproveRefund(order.id)}
                  >
                    Duyệt hoàn tiền
                  </Button>
                  {!showRefundReject ? (
                    <Button
                      flex="1"
                      h="38px"
                      borderRadius="10px"
                      fontSize="12px"
                      fontWeight="700"
                      bg="#fef2f2"
                      color="#dc2626"
                      border="1px solid #fca5a5"
                      leftIcon={<Icon as={MdBlock} boxSize="12px" />}
                      _hover={{ bg: "#fee2e2" }}
                      onClick={() => setShowRefundReject(true)}
                    >
                      Từ chối
                    </Button>
                  ) : (
                    <Button
                      flex="1"
                      h="38px"
                      borderRadius="10px"
                      fontSize="12px"
                      fontWeight="700"
                      bg="#fef2f2"
                      color="#dc2626"
                      border="1px solid #fca5a5"
                      _hover={{ bg: "#fee2e2" }}
                      onClick={() => { onRejectRefund(order.id, refundReason); setShowRefundReject(false); }}
                    >
                      Xác nhận từ chối
                    </Button>
                  )}
                </Flex>
              </>
            )}
            {(order.refundStatus === "Đã duyệt" || order.refundStatus === "Từ chối") && (
              <StatusBadge status={order.refundStatus} type="refund" G={G} />
            )}
            {!order.refundStatus && (
              <Text fontSize="12.5px" color={isDark ? G.ink4 : "#94a3b8"}>Không có yêu cầu hoàn tiền.</Text>
            )}
          </Box>
        )}
      </Grid>

      {/* Lịch sử */}
      <Box 
        bg={bg} 
        borderRadius="16px" 
        border={`1px solid ${borderColor}`} 
        p={{ base: "16px", md: "20px" }}
      >
        <Flex align="center" gap="8px" mb="14px">
          <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
          <Text fontSize="13px" fontWeight="800" color={ink}>Lịch sử đơn hàng</Text>
        </Flex>
        <Box h="1px" bg={isDark ? G.ink5 : "#f1f5f9"} mb="14px" />
        <Flex direction="column" gap="0">
          {order.history && order.history.map((h, i) => (
            <Flex key={i} gap="12px" align="flex-start">
              <Flex direction="column" align="center" flexShrink="0">
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={i === 0 ? "#f97316" : (isDark ? G.ink5 : "#e2e8f0")}
                  border="2px solid white"
                  boxShadow={i === 0 ? "0 0 0 2px #f97316" : (isDark ? `0 0 0 2px ${G.ink5}` : "0 0 0 2px #e2e8f0")}
                  mt="3px"
                />
                {i < order.history.length - 1 && (
                  <Box w="1.5px" flex="1" minH="24px" bg={isDark ? G.ink5 : "#f1f5f9"} mt="2px" mb="2px" />
                )}
              </Flex>
              <Box pb={i < order.history.length - 1 ? "10px" : "0"}>
                <Text fontSize="12.5px" fontWeight="600" color={ink}>{h.action}</Text>
                <Flex gap="10px" mt="2px">
                  <Text fontSize="10.5px" color={isDark ? G.ink4 : "#94a3b8"}>{h.time}</Text>
                  <Text fontSize="10.5px" color="#f97316" fontWeight="600">— {h.by}</Text>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};