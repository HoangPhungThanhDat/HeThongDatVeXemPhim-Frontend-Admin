// src/views/admin/quanlyve/views/TaoVeMoi.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  Textarea,
  Button,
  Icon,
  SimpleGrid,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  FormControl,
  FormErrorMessage,
  HStack,
  VStack,
  Badge,
  Divider,
  Card,
  CardBody,
  useColorMode,
  Spinner,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSave,
  MdClose,
  MdPerson,
  MdMovie,
  MdEventSeat,
  MdTheaters,
  MdReceiptLong,
  MdLocalActivity,
  MdFastfood,
  MdVerified,
} from "react-icons/md";
import { useCreateTicketForm } from "../hooks/useCreateTicketForm";
import TicketApi from "../../../../api/TicketApi";
import ShowtimeSeatApi from "../../../../api/ShowtimeSeatApi";

/* ------------------------------------------------------------------ */
/*  Keyframe animations                                                */
/* ------------------------------------------------------------------ */
const styleTag = (
  <style>{`
    @keyframes tvmFadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes tvmPop {
      0% { transform: scale(0.85); }
      60% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    .tvm-fade-up { animation: tvmFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .tvm-seat-pop { animation: tvmPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
  `}</style>
);

const TaoVeMoi = ({ onCreate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    users,
    movies,
    showtimes,
    seats,
    combos,
    loading,
    filterShowtimesByMovie,
    fetchSeatsByShowtime,
  } = useCreateTicketForm();

  const [formData, setFormData] = useState({
    userId: "",
    customer: "",
    email: "",
    phone: "",
    movieId: "",
    movie: "",
    showtimeId: "",
    showtime: "",
    roomId: "",
    seat: "",
    price: "",
    status: "Đã thanh toán",
    note: "",
    comboId: "",
    combo: "",
  });

  const [errors, setErrors] = useState({});
  const [localShowtimes, setLocalShowtimes] = useState([]);
  const [selectedSeatLabel, setSelectedSeatLabel] = useState("");

  useEffect(() => {
    setLocalShowtimes(showtimes);
  }, [showtimes]);

  // Debug: Kiểm tra dữ liệu combo
  useEffect(() => {
    console.log("📦 Combos available:", combos);
    console.log("📦 Selected comboId:", formData.comboId);
    console.log("📦 Selected combo name:", formData.combo);
  }, [combos, formData.comboId, formData.combo]);

  // Khi chọn user
  const handleUserChange = (e) => {
    const userId = e.target.value;
    if (!userId) {
      setFormData({ ...formData, userId: "", customer: "", email: "", phone: "" });
      return;
    }
    const selectedUser = users.find(
      (u) => String(u.UserId || u.id) === String(userId)
    );
    if (selectedUser) {
      setFormData({
        ...formData,
        userId: userId,
        customer: selectedUser.FullName || selectedUser.fullName || selectedUser.name || "",
        email: selectedUser.Email || selectedUser.email || "",
        phone: selectedUser.PhoneNumber || selectedUser.phone || "",
      });
      setErrors({ ...errors, userId: "", customer: "", email: "" });
    }
  };

  // Khi chọn phim
  const handleMovieChange = (e) => {
    const movieId = e.target.value;
    if (!movieId) {
      setFormData({
        ...formData,
        movieId: "",
        movie: "",
        showtimeId: "",
        showtime: "",
        roomId: "",
        seat: "",
        price: "",
      });
      setLocalShowtimes([]);
      return;
    }
    const selectedMovie = movies.find(
      (m) => String(m.MovieId || m.id) === String(movieId)
    );
    setFormData({
      ...formData,
      movieId: movieId,
      movie: selectedMovie?.Title || selectedMovie?.title || "",
      showtimeId: "",
      showtime: "",
      roomId: "",
      seat: "",
      price: "",
    });
    setErrors({ ...errors, movieId: "", movie: "" });
    filterShowtimesByMovie(movieId);
  };

  // Khi chọn suất chiếu
  const handleShowtimeChange = (e) => {
    const showtimeId = e.target.value;
    if (!showtimeId) {
      setFormData({
        ...formData,
        showtimeId: "",
        showtime: "",
        roomId: "",
        seat: "",
        price: "",
      });
      return;
    }

    const selectedShowtime = localShowtimes.find(
      (s) => String(s.ShowtimeId || s.id) === String(showtimeId)
    );

    if (selectedShowtime) {
      const movieTitle = selectedShowtime.MovieId?.Title ||
                        selectedShowtime.movieId?.Title ||
                        selectedShowtime.Movie?.Title ||
                        selectedShowtime.movie?.title ||
                        formData.movie;

      const startTime = new Date(selectedShowtime.StartTime || selectedShowtime.startTime);
      const formattedTime = startTime.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const roomName = selectedShowtime.Room?.Name ||
                       selectedShowtime.room?.name ||
                       "";

      const price = selectedShowtime.Price || selectedShowtime.price || 0;
      const roomId = selectedShowtime.RoomId || selectedShowtime.roomId || "";

      setFormData({
        ...formData,
        showtimeId: showtimeId,
        showtime: `${formattedTime} - Phòng ${roomName}`,
        roomId: roomId,
        seat: "",
        price: price ? Number(price).toLocaleString() : "",
        movie: movieTitle || formData.movie,
      });
      setErrors({ ...errors, showtimeId: "", showtime: "", price: "" });
      setSelectedSeatLabel("");

      if (showtimeId) {
        fetchSeatsByShowtime(showtimeId);
      }
    }
  };

  // ✅ Khi chọn ghế từ sơ đồ - Kiểm tra trạng thái ghế
  const handleSeatSelect = (seatId, seatLabel) => {
    console.log("🪑 Selected seat:", { seatId, seatLabel });
    
    // Kiểm tra ghế có tồn tại và Available không
    const selectedSeat = seats.find(
      (item) => String(item.ShowtimeSeatId || item.id) === String(seatId)
    );
    
    if (!selectedSeat) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ghế này",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    const status = selectedSeat.Status || selectedSeat.status || "Available";
    if (status !== "Available" && status !== "available") {
      toast({
        title: "Ghế đã được đặt",
        description: `Ghế ${seatLabel} đã được đặt, vui lòng chọn ghế khác`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    setFormData({
      ...formData,
      seat: seatId,
    });
    setSelectedSeatLabel(seatLabel);
    setErrors({ ...errors, seat: "" });
  };

  const handleComboChange = (e) => {
    const comboId = e.target.value;
    console.log("🍿 Selected comboId:", comboId);
    
    if (!comboId) {
      setFormData({ ...formData, comboId: "", combo: "" });
      return;
    }
    
    const selectedCombo = combos.find(
      (c) => String(c.ItemId || c.id) === String(comboId)
    );
    console.log("🍿 Selected combo:", selectedCombo);
    
    if (selectedCombo) {
      const comboName = selectedCombo.Name || selectedCombo.name || "";
      setFormData({
        ...formData,
        comboId: comboId,
        combo: comboName,
      });
    } else {
      setFormData({
        ...formData,
        comboId: comboId,
        combo: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "Vui lòng chọn khách hàng";
    if (!formData.email) newErrors.email = "Email không được để trống";
    if (!formData.movieId) newErrors.movieId = "Vui lòng chọn phim";
    if (!formData.showtimeId) newErrors.showtimeId = "Vui lòng chọn suất chiếu";
    if (!formData.price) newErrors.price = "Vui lòng chọn suất chiếu";
    if (!formData.seat) newErrors.seat = "Vui lòng chọn ghế";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Sửa handleSubmit - Gửi đầy đủ dữ liệu để update ghế
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1️⃣ Lấy thông tin ghế đã chọn
      const selectedSeat = seats.find(
        (item) => String(item.ShowtimeSeatId || item.id) === String(formData.seat)
      );

      console.log("🔍 Selected seat full object:", selectedSeat);

      let seatId = null;
      let showtimeSeatId = null;
      let seatLabel = selectedSeatLabel;
      let roomId = null;

      if (selectedSeat) {
        // Lấy SeatId từ Seat object
        const seatData = selectedSeat.Seat || selectedSeat.seat || {};
        seatId = seatData.SeatId || seatData.id || selectedSeat.SeatId || selectedSeat.id;
        
        // Lấy ShowtimeSeatId
        showtimeSeatId = selectedSeat.ShowtimeSeatId || selectedSeat.id;
        
        // Lấy RoomId
        roomId = seatData.RoomId || seatData.roomId || selectedSeat.RoomId || selectedSeat.roomId;
        
        // Lấy tên ghế
        if (seatData.Row !== undefined && seatData.Number !== undefined) {
          seatLabel = `${seatData.Row || ''}${seatData.Number || ''}`;
        }
      }

      console.log("✅ SeatId:", seatId);
      console.log("✅ ShowtimeSeatId:", showtimeSeatId);
      console.log("✅ RoomId:", roomId);

      if (!seatId || !showtimeSeatId) {
        toast({
          title: "Lỗi dữ liệu",
          description: "Không thể lấy thông tin ghế, vui lòng chọn lại",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      const statusMap = {
        "Đã thanh toán": "Paid",
        "Đã check-in": "Paid",
        "Chờ xử lý": "Pending",
        "Đã hủy": "Cancelled",
        "Hết hạn": "Cancelled",
      };

      // 2️⃣ Tạo vé trong bảng Tickets
      const ticketData = {
        ShowtimeId: formData.showtimeId,
        SeatId: seatId,
        UserId: formData.userId,
        Status: statusMap[formData.status] || "Paid",
      };

      console.log("📤 Creating ticket:", ticketData);
      const response = await TicketApi.create(ticketData);
      console.log("✅ Ticket created:", response.data);

      // 3️⃣ Cập nhật trạng thái ghế trong ShowtimeSeats
      const seatData = selectedSeat.Seat || selectedSeat.seat || {};
      
      const updateData = {
        ShowtimeId: formData.showtimeId,
        SeatId: seatId,
        Status: "Reserved"
      };
      
      console.log("📤 Updating seat status:", { showtimeSeatId, updateData });
      
      try {
        const updateResult = await ShowtimeSeatApi.update(showtimeSeatId, updateData);
        console.log("✅ Seat status updated:", updateResult.data);
      } catch (seatErr) {
        console.error("❌ Lỗi cập nhật trạng thái ghế:", seatErr);
        console.error("❌ Response data:", seatErr.response?.data);
      }

      // 4️⃣ Refresh danh sách ghế để cập nhật UI
      if (formData.showtimeId) {
        await fetchSeatsByShowtime(formData.showtimeId);
      }

      const responseData = response?.data?.data || response?.data || response || {};

      // 5️⃣ Tạo object vé
      const newTicket = {
        id: responseData.TicketId || Date.now(),
        code: responseData.code || `VE${String(responseData.TicketId || Date.now()).slice(-4)}`,
        userId: formData.userId,
        customer: formData.customer || "Khách hàng",
        email: formData.email || "",
        phone: formData.phone || "",
        movie: formData.movie || "Phim",
        showtime: formData.showtime || "",
        seat: seatLabel || "A1",
        price: formData.price ? `${Number(formData.price).toLocaleString()}đ` : "0đ",
        status: formData.status || "Đã thanh toán",
        note: formData.note || "",
        combo: formData.combo || "",
        qr: responseData.QRCode || `QR-${String(responseData.TicketId || Date.now()).slice(-4)}`,
        showtimeId: formData.showtimeId,
        seatId: seatId,
        showtimeSeatId: showtimeSeatId,
      };

      console.log("✅ New ticket object:", newTicket);

      // 6️⃣ Gọi onCreate để cập nhật state tickets
      if (onCreate) {
        await onCreate(newTicket);
      }

      toast({
        title: "Thành công 🎉",
        description: `Vé ${newTicket.code} đã được tạo cho ${newTicket.customer}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/admin/ve-don-hang/ve");
    } catch (err) {
      console.error("❌ Lỗi tạo vé:", err);
      toast({
        title: "Lỗi tạo vé",
        description: err.response?.data?.message || "Không thể tạo vé",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render seat map - Hiển thị ghế trống và đã đặt                   */
  /* ------------------------------------------------------------------ */
  const renderSeatMap = () => {
    if (!formData.showtimeId || seats.length === 0) {
      return (
        <Box
          p="28px 20px"
          textAlign="center"
          borderRadius="12px"
          bg={softTileBg}
          border={`1.5px dashed ${dashedBorder}`}
        >
          <Flex
            align="center"
            justify="center"
            w="44px"
            h="44px"
            borderRadius="12px"
            bg={isDark ? "rgba(255,255,255,0.05)" : "white"}
            mx="auto"
            mb="10px"
            border={`1px solid ${cardBorder}`}
          >
            <Icon as={MdTheaters} boxSize="20px" color={textMuted} />
          </Flex>
          <Text fontSize="13px" color={textMuted} fontWeight="500">
            {formData.showtimeId ? "Không có ghế nào" : "Chọn suất chiếu để xem sơ đồ ghế"}
          </Text>
        </Box>
      );
    }

    // Nhóm ghế theo hàng
    const seatsByRow = {};
    seats.forEach((item) => {
      const seatData = item.Seat || item.seat || {};
      const row = seatData.Row || seatData.row || "A";
      const number = seatData.Number || seatData.number || 0;
      const seatId = item.ShowtimeSeatId || item.id;
      const status = item.Status || item.status || "Available";
      const isAvailable = status === "Available" || status === "available";
      const isSelected = String(seatId) === String(formData.seat);

      if (!seatsByRow[row]) {
        seatsByRow[row] = [];
      }
      seatsByRow[row].push({ row, number, seatId, isAvailable, isSelected, status });
    });

    const sortedRows = Object.keys(seatsByRow).sort();
    const totalAvailable = seats.filter((s) => {
      const status = s.Status || s.status || "Available";
      return status === "Available" || status === "available";
    }).length;
    const totalReserved = seats.filter((s) => {
      const status = s.Status || s.status || "Available";
      return status !== "Available" && status !== "available";
    }).length;
    const AISLE_EVERY = 4;

    const chunkSeats = (rowSeats) => {
      const chunks = [];
      for (let i = 0; i < rowSeats.length; i += AISLE_EVERY) {
        chunks.push(rowSeats.slice(i, i + AISLE_EVERY));
      }
      return chunks;
    };

    return (
      <Box
        borderRadius="16px"
        p={{ base: "18px 12px", md: "26px 22px" }}
        bg={isDark
          ? "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.06), transparent 60%), #0d1a4a"
          : "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.05), transparent 60%), #fbfcfe"
        }
        border={`1px solid ${cardBorder}`}
        boxShadow={isDark ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.6)"}
      >
        {/* Màn hình */}
        <Flex justify="center" mb={{ base: "26px", md: "34px" }}>
          <Box position="relative" w={{ base: "94%", md: "78%" }}>
            <Box
              h={{ base: "8px", md: "10px" }}
              borderRadius="50%"
              bg={`linear-gradient(90deg, transparent, ${OR}, ${ORL}, ${OR}, transparent)`}
              opacity={isDark ? 0.85 : 0.7}
              boxShadow={`0 8px 24px ${isDark ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.25)"}`}
              style={{ transform: "perspective(60px) rotateX(-8deg)" }}
            />
            <Box
              mt="2px"
              h={{ base: "22px", md: "30px" }}
              mx="auto"
              w="96%"
              bg={`linear-gradient(180deg, ${screenBgFrom}, transparent)`}
              borderRadius="0 0 50% 50% / 0 0 100% 100%"
              opacity={0.8}
            />
            <Text
              position="absolute"
              top={{ base: "10px", md: "13px" }}
              left="50%"
              transform="translateX(-50%)"
              fontSize="9.5px"
              fontWeight="800"
              color={textMuted}
              letterSpacing="4px"
              whiteSpace="nowrap"
            >
              MÀN HÌNH
            </Text>
          </Box>
        </Flex>

        {/* Sơ đồ ghế */}
        <VStack spacing={{ base: "6px", md: "9px" }} align="center">
          {sortedRows.map((row) => {
            const chunks = chunkSeats(
              seatsByRow[row].sort((a, b) => a.number - b.number)
            );
            return (
              <Flex key={row} align="center" gap={{ base: "8px", md: "12px" }}>
                <Flex
                  align="center"
                  justify="center"
                  w="20px"
                  h="20px"
                  borderRadius="6px"
                  bg={isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}
                  fontSize="10.5px"
                  fontWeight="800"
                  color={textMuted}
                  flexShrink="0"
                >
                  {row}
                </Flex>
                <Flex gap={{ base: "10px", md: "14px" }}>
                  {chunks.map((chunk, chunkIdx) => (
                    <Flex key={chunkIdx} gap={{ base: "5px", md: "7px" }}>
                      {chunk.map((seat) => {
                        const isSelected = seat.isSelected;
                        const isAvailable = seat.isAvailable;

                        // Xác định màu sắc
                        let bgColor, textColor, borderColor, cursor, opacity;
                        
                        if (isSelected) {
                          bgColor = GRADIENT;
                          textColor = "white";
                          borderColor = "#c2410c";
                          cursor = "pointer";
                          opacity = 1;
                        } else if (isAvailable) {
                          bgColor = seatAvailBg;
                          textColor = seatAvailColor;
                          borderColor = seatAvailBorder;
                          cursor = "pointer";
                          opacity = 1;
                        } else {
                          bgColor = seatTakenBg;
                          textColor = seatTakenColor;
                          borderColor = seatTakenColor;
                          cursor = "not-allowed";
                          opacity = 0.6;
                        }

                        return (
                          <Tooltip
                            key={seat.seatId}
                            label={isAvailable ? `Ghế ${row}${seat.number}` : `Ghế ${row}${seat.number} - Đã đặt`}
                            hasArrow
                            openDelay={300}
                          >
                            <Button
                              size="xs"
                              w={{ base: "30px", md: "34px" }}
                              h={{ base: "30px", md: "34px" }}
                              minW={{ base: "30px", md: "34px" }}
                              p="0"
                              borderRadius="9px 9px 11px 11px"
                              fontSize="11px"
                              fontWeight="700"
                              className={isSelected ? "tvm-seat-pop" : undefined}
                              bg={bgColor}
                              color={textColor}
                              border="none"
                              borderBottom={`3px solid ${borderColor}`}
                              boxShadow={
                                isSelected
                                  ? "0 0 0 3px rgba(249,115,22,0.22), 0 4px 10px rgba(249,115,22,0.3)"
                                  : isDark
                                  ? "0 1px 2px rgba(0,0,0,0.3)"
                                  : "0 1px 2px rgba(15,23,42,0.06)"
                              }
                              cursor={cursor}
                              opacity={opacity}
                              _hover={
                                isAvailable && !isSelected
                                  ? { transform: "translateY(-3px)", boxShadow: seatHoverBox }
                                  : {}
                              }
                              _active={isAvailable ? { transform: "translateY(-1px) scale(0.95)" } : {}}
                              transition="all 0.15s ease"
                              onClick={() => {
                                if (isAvailable) {
                                  const seatDataFull = seats.find(s => String(s.ShowtimeSeatId || s.id) === String(seat.seatId));
                                  const seatInfo = seatDataFull?.Seat || seatDataFull?.seat || {};
                                  const label = `${seatInfo.Row || row}${seatInfo.Number || seat.number}`;
                                  handleSeatSelect(seat.seatId, label);
                                }
                              }}
                              disabled={!isAvailable}
                            >
                              {seat.number}
                            </Button>
                          </Tooltip>
                        );
                      })}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        {/* Chú thích */}
        <Flex
          gap="18px"
          mt="20px"
          pt="16px"
          borderTop={`1px solid ${cardBorder}`}
          flexWrap="wrap"
          align="center"
          justify="center"
        >
          <Flex align="center" gap="6px">
            <Box w="14px" h="14px" borderRadius="4px" bg={seatAvailBg} borderBottom={`3px solid ${seatAvailBorder}`} />
            <Text fontSize="11px" color={textMuted} fontWeight="500">Trống</Text>
          </Flex>
          <Flex align="center" gap="6px">
            <Box w="14px" h="14px" borderRadius="4px" bg={GRADIENT} borderBottom="3px solid #c2410c" />
            <Text fontSize="11px" color={textMuted} fontWeight="500">Đang chọn</Text>
          </Flex>
          <Flex align="center" gap="6px">
            <Box w="14px" h="14px" borderRadius="4px" bg={seatTakenBg} opacity={0.6} />
            <Text fontSize="11px" color={textMuted} fontWeight="500">Đã đặt</Text>
          </Flex>
          <Text fontSize="11px" color={textMuted} fontWeight="600">
            · {totalAvailable} ghế trống / {totalReserved} ghế đã đặt
          </Text>
        </Flex>

        {/* Hiển thị ghế đã chọn */}
        {selectedSeatLabel && (
          <Flex
            mt="14px"
            p="10px 14px"
            borderRadius="10px"
            bg="rgba(249,115,22,0.10)"
            border="1px solid rgba(249,115,22,0.22)"
            align="center"
            justify="center"
            gap="8px"
            className="tvm-fade-up"
          >
            <Icon as={MdVerified} color={OR} boxSize="15px" />
            <Text fontSize="12.5px" color={OR} fontWeight="700">
              Đã chọn ghế {selectedSeatLabel}
            </Text>
          </Flex>
        )}
      </Box>
    );
  };

  /* ------------------------------------------------------------------ */
  /*  Design tokens                                                     */
  /* ------------------------------------------------------------------ */
  const inputBg = useColorModeValue("#fafafa", "#0B1437");
  const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
  const inputColor = useColorModeValue("#1a202c", "#ffffff");
  const placeholderColor = useColorModeValue("#b0bac8", "#8b9bc4");
  const cardBg = useColorModeValue("white", "#111C44");
  const cardBorder = useColorModeValue("#eef1f6", "rgba(255,255,255,0.08)");
  const textPrimary = useColorModeValue("#0f172a", "#ffffff");
  const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
  const focusBg = useColorModeValue("#ffffff", "#111C44");
  const softTileBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.03)");
  const dashedBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.1)");
  const labelColor = useColorModeValue("#64748b", "#8b9bc4");
  const screenBgFrom = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.06)");
  const seatAvailBg = useColorModeValue("white", "#1b2559");
  const seatAvailBorder = useColorModeValue("#e2e8f0", "#2d3a68");
  const seatAvailColor = useColorModeValue("#1a202c", "#e2e8f0");
  const seatTakenBg = useColorModeValue("#e2e8f0", "#33406e");
  const seatTakenColor = useColorModeValue("#94a3b8", "#5b6a99");
  const seatHoverBox = useColorModeValue("0 4px 10px rgba(249,115,22,0.18)", "0 4px 14px rgba(249,115,22,0.28)");

  const OR = "#ea580c";
  const ORL = "#fb923c";
  const GRADIENT = "linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)";

  const inputStyle = {
    bg: inputBg,
    border: `1.5px solid ${inputBorder}`,
    borderRadius: "10px",
    color: inputColor,
    fontSize: "14px",
    fontWeight: "500",
    px: "14px",
    h: { base: "48px", md: "44px" },
    _placeholder: { color: placeholderColor, fontWeight: "400" },
    _focus: {
      border: "1.5px solid #f97316",
      boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
      bg: focusBg,
    },
    _hover: { border: "1.5px solid #f97316", bg: focusBg },
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "10.5px",
    fontWeight: "800",
    letterSpacing: "0.9px",
    textTransform: "uppercase",
    color: labelColor,
    mb: "7px",
  };

  const SectionTitle = ({ label, icon: IconComponent, hint }) => (
    <Flex align="center" justify="space-between" mb="14px" wrap="wrap" rowGap="4px">
      <Flex align="center" gap="10px">
        <Flex
          align="center"
          justify="center"
          w="26px"
          h="26px"
          borderRadius="8px"
          bg={isDark ? "rgba(249,115,22,0.14)" : "rgba(249,115,22,0.10)"}
          flexShrink="0"
        >
          {IconComponent && <Icon as={IconComponent} boxSize="14px" color={OR} />}
        </Flex>
        <Text fontSize="12px" fontWeight="800" color={isDark ? "#e2e8f0" : "#1e293b"} letterSpacing="0.6px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      {hint && (
        <Text fontSize="11px" color={textMuted} fontWeight="500">
          {hint}
        </Text>
      )}
    </Flex>
  );

  const SummaryRow = ({ label, value, icon: IconComponent, highlight }) => (
    <Flex
      align="center"
      gap="10px"
      p="10px 12px"
      borderRadius="10px"
      bg={softTileBg}
      border={`1px solid ${highlight ? "rgba(249,115,22,0.25)" : "transparent"}`}
    >
      {IconComponent && (
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          borderRadius="8px"
          bg={isDark ? "rgba(255,255,255,0.06)" : "white"}
          border={`1px solid ${cardBorder}`}
          flexShrink="0"
        >
          <Icon as={IconComponent} boxSize="13px" color={highlight ? OR : textMuted} />
        </Flex>
      )}
      <Box minW="0" flex="1">
        <Text fontSize="9px" color={textMuted} fontWeight="700" letterSpacing="0.7px" textTransform="uppercase">
          {label}
        </Text>
        <Text
          fontWeight="700"
          fontSize="13px"
          color={highlight ? OR : textPrimary}
          isTruncated
        >
          {value || "Chưa chọn"}
        </Text>
      </Box>
    </Flex>
  );

  const steps = [
    { key: "customer", label: "Khách hàng", done: !!formData.userId },
    { key: "movie", label: "Suất chiếu", done: !!formData.showtimeId },
    { key: "seat", label: "Ghế", done: !!formData.seat },
  ];

  const comboPriceValue = (() => {
    const combo = combos.find((c) => String(c.ItemId || c.id) === String(formData.comboId));
    return combo ? Number(combo.Price || combo.price || 0) : 0;
  })();
  const ticketPriceValue = formData.price ? Number(String(formData.price).replace(/[^\d]/g, "")) : 0;
  const totalValue = ticketPriceValue + comboPriceValue;

  return (
    <Box px={{ base: 4, md: 5 }} pb={{ base: 4, md: 6 }} pt={{ base: "110px", md: "100px" }} w="100%">
      {styleTag}
      <>
        {/* Header */}
        <Flex
          align={{ base: "flex-start", md: "center" }}
          gap="14px"
          mb="20px"
          direction={{ base: "column", sm: "row" }}
          className="tvm-fade-up"
        >
          <Button
            leftIcon={<Icon as={MdArrowBack} />}
            variant="ghost"
            color={useColorModeValue("#475569", "#cbd5e1")}
            bg={cardBg}
            borderRadius="10px"
            h="38px"
            fontSize="13px"
            fontWeight="600"
            border={`1.5px solid ${cardBorder}`}
            _hover={{ bg: softTileBg, borderColor: "#f97316", color: OR }}
            flexShrink="0"
            onClick={() => navigate("/admin/ve-don-hang/ve")}
          >
            Quay lại
          </Button>
          <Flex align="center" gap="12px" flex="1" minW="0">
            <Flex
              align="center"
              justify="center"
              w="42px"
              h="42px"
              borderRadius="12px"
              bg={GRADIENT}
              boxShadow="0 6px 16px rgba(249,115,22,0.35)"
              flexShrink="0"
              display={{ base: "none", sm: "flex" }}
            >
              <Icon as={MdLocalActivity} boxSize="20px" color="white" />
            </Flex>
            <Box minW="0">
              <Text fontSize={{ base: "17px", md: "21px" }} fontWeight="800" color={textPrimary} letterSpacing="-0.4px">
                Tạo vé thủ công
              </Text>
              <Text fontSize="12px" color={textMuted} mt="1px">
                Quyền Admin — Tạo vé cho khách hàng đặc biệt
              </Text>
            </Box>
          </Flex>
          <Badge
            colorScheme="red"
            fontSize="11px"
            fontWeight="700"
            px="10px"
            py="5px"
            borderRadius="full"
            letterSpacing="0.4px"
          >
            ADMIN
          </Badge>
        </Flex>

        {/* Progress dots */}
        <Flex
          gap={{ base: "10px", md: "18px" }}
          mb="18px"
          px="2px"
          wrap="wrap"
          className="tvm-fade-up"
        >
          {steps.map((step, idx) => (
            <Flex key={step.key} align="center" gap="8px">
              <Flex
                align="center"
                justify="center"
                w="20px"
                h="20px"
                borderRadius="full"
                bg={step.done ? GRADIENT : "transparent"}
                border={`2px solid ${step.done ? "#f97316" : dashedBorder}`}
                transition="all 0.2s"
              >
                {step.done && <Icon as={MdVerified} boxSize="11px" color="white" />}
              </Flex>
              <Text fontSize="12px" fontWeight={step.done ? "700" : "500"} color={step.done ? OR : textMuted}>
                {step.label}
              </Text>
              {idx < steps.length - 1 && (
                <Box w={{ base: "14px", md: "26px" }} h="1.5px" bg={dashedBorder} ml="2px" />
              )}
            </Flex>
          ))}
        </Flex>

        {/* Main Form */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 350px" }} gap="16px" alignItems="start">
          <GridItem>
            <Card
              borderRadius="18px"
              border={`1px solid ${cardBorder}`}
              bg={cardBg}
              boxShadow={isDark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(15,23,42,0.05)"}
              className="tvm-fade-up"
            >
              <CardBody p={{ base: "18px", md: "24px" }}>
                <VStack spacing={7} align="stretch">
                  {/* Thông tin khách hàng */}
                  <Box>
                    <SectionTitle label="Thông tin khách hàng" icon={MdPerson} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isInvalid={!!errors.userId}>
                        <Text sx={labelStyle}>Tên khách hàng *</Text>
                        <Select
                          {...inputStyle}
                          value={formData.userId}
                          onChange={handleUserChange}
                          placeholder="Chọn khách hàng"
                        >
                          {users.map((user) => (
                            <option key={user.UserId || user.id} value={user.UserId || user.id}>
                              {user.FullName || user.fullName || user.name || user.email}
                            </option>
                          ))}
                        </Select>
                        {loading.users && <Spinner size="xs" mt={2} color={OR} />}
                        <FormErrorMessage>{errors.userId}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.email}>
                        <Text sx={labelStyle}>Email *</Text>
                        <Input
                          {...inputStyle}
                          value={formData.email}
                          placeholder="Email sẽ tự động điền"
                          readOnly
                          opacity={0.7}
                          cursor="not-allowed"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <Text sx={labelStyle}>Số điện thoại</Text>
                        <Input
                          {...inputStyle}
                          value={formData.phone}
                          placeholder="SĐT sẽ tự động điền"
                          readOnly
                          opacity={0.7}
                          cursor="not-allowed"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider borderColor={cardBorder} />

                  {/* Thông tin phim & suất chiếu */}
                  <Box>
                    <SectionTitle label="Thông tin phim & suất chiếu" icon={MdMovie} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isInvalid={!!errors.movieId}>
                        <Text sx={labelStyle}>Tên phim *</Text>
                        <Select
                          {...inputStyle}
                          value={formData.movieId}
                          onChange={handleMovieChange}
                          placeholder="Chọn phim"
                        >
                          {movies.map((movie) => (
                            <option key={movie.MovieId || movie.id} value={movie.MovieId || movie.id}>
                              {movie.Title || movie.title}
                            </option>
                          ))}
                        </Select>
                        {loading.movies && <Spinner size="xs" mt={2} color={OR} />}
                        <FormErrorMessage>{errors.movieId}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.showtimeId}>
                        <Text sx={labelStyle}>Suất chiếu *</Text>
                        <Select
                          {...inputStyle}
                          value={formData.showtimeId}
                          onChange={handleShowtimeChange}
                          placeholder={formData.movieId ? "Chọn suất chiếu" : "Chọn phim trước"}
                          isDisabled={!formData.movieId}
                        >
                          {localShowtimes.map((showtime) => {
                            const startTime = new Date(showtime.StartTime || showtime.startTime);
                            const timeStr = startTime.toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            });
                            const roomName = showtime.Room?.Name || showtime.room?.name || "";
                            const price = showtime.Price || showtime.price || 0;
                            return (
                              <option key={showtime.ShowtimeId || showtime.id} value={showtime.ShowtimeId || showtime.id}>
                                {timeStr} - Phòng {roomName} - {Number(price).toLocaleString()}đ
                              </option>
                            );
                          })}
                        </Select>
                        {loading.showtimes && <Spinner size="xs" mt={2} color={OR} />}
                        {localShowtimes.length === 0 && formData.movieId && !loading.showtimes && (
                          <Text fontSize="xs" color="red.400" mt={1} fontWeight="600">
                            ⚠️ Không có suất chiếu cho phim này
                          </Text>
                        )}
                        <FormErrorMessage>{errors.showtimeId}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <Text sx={labelStyle}>Giá vé (VNĐ) *</Text>
                        <Input
                          {...inputStyle}
                          value={formData.price}
                          placeholder="Giá sẽ tự động điền"
                          readOnly
                          opacity={0.7}
                          cursor="not-allowed"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider borderColor={cardBorder} />

                  {/* Sơ đồ ghế */}
                  <Box>
                    <SectionTitle label="Chọn ghế" icon={MdEventSeat} hint={selectedSeatLabel ? `Ghế ${selectedSeatLabel}` : undefined} />
                    <FormControl isInvalid={!!errors.seat}>
                      {renderSeatMap()}
                      {errors.seat && (
                        <Text fontSize="xs" color="red.400" mt="2" fontWeight="600">{errors.seat}</Text>
                      )}
                    </FormControl>
                  </Box>

                  <Divider borderColor={cardBorder} />

                  {/* Thông tin bổ sung */}
                  <Box>
                    <SectionTitle label="Thông tin bổ sung" icon={MdReceiptLong} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <Text sx={labelStyle}>Trạng thái</Text>
                        <Select
                          {...inputStyle}
                          value={formData.status}
                          onChange={handleInputChange}
                          name="status"
                        >
                          <option value="Đã thanh toán">Đã thanh toán (Paid)</option>
                          <option value="Đã check-in">Đã check-in (Paid)</option>
                          <option value="Chờ xử lý">Chờ xử lý (Pending)</option>
                          <option value="Đã hủy">Đã hủy (Cancelled)</option>
                          <option value="Hết hạn">Hết hạn (Cancelled)</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <Text sx={labelStyle}>Combo</Text>
                        <Select
                          {...inputStyle}
                          value={formData.comboId}
                          onChange={handleComboChange}
                          placeholder="Chọn combo (nếu có)"
                        >
                          {combos.map((combo) => (
                            <option key={combo.ItemId || combo.id} value={combo.ItemId || combo.id}>
                              {combo.Name || combo.name} - {Number(combo.Price || combo.price || 0).toLocaleString()}đ
                            </option>
                          ))}
                        </Select>
                        {loading.combos && <Spinner size="xs" mt={2} color={OR} />}
                      </FormControl>
                    </SimpleGrid>

                    <FormControl mt={4}>
                      <Text sx={labelStyle}>Ghi chú nội bộ</Text>
                      <Textarea
                        {...inputStyle}
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Nhập ghi chú nội bộ..."
                        rows={3}
                        h="auto"
                        py="10px"
                      />
                    </FormControl>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Column - Preview & Actions */}
          <GridItem position={{ lg: "sticky" }} top={{ lg: "20px" }}>
            <Card
              borderRadius="18px"
              border={`1px solid ${cardBorder}`}
              bg={cardBg}
              boxShadow={isDark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(15,23,42,0.05)"}
              mb="14px"
              className="tvm-fade-up"
            >
              <CardBody p={{ base: "16px", md: "20px" }}>
                <SectionTitle label="Thông tin tóm tắt" icon={MdReceiptLong} />
                <VStack spacing={2.5} align="stretch">
                  <SummaryRow label="Khách hàng" value={formData.customer || "Chưa chọn"} icon={MdPerson} />
                  <SummaryRow label="Phim" value={formData.movie || "Chưa chọn"} icon={MdMovie} />
                  <SummaryRow label="Suất chiếu" value={formData.showtime || "Chưa chọn"} icon={MdTheaters} />
                  <SummaryRow label="Ghế" value={selectedSeatLabel || "Chưa chọn"} icon={MdEventSeat} highlight={!!selectedSeatLabel} />
                  <SummaryRow label="Combo" value={formData.combo || "Không có"} icon={MdFastfood} />
                </VStack>

                <Divider my="14px" borderColor={cardBorder} />

                <Flex justify="space-between" align="center" px="2px">
                  <Text fontSize="11px" fontWeight="700" color={textMuted} letterSpacing="0.6px" textTransform="uppercase">
                    Tổng cộng
                  </Text>
                  <Text fontSize="19px" fontWeight="800" color={OR} letterSpacing="-0.3px">
                    {totalValue ? `${totalValue.toLocaleString()}đ` : "—"}
                  </Text>
                </Flex>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <Stack spacing={3} className="tvm-fade-up">
              <Button
                w="100%"
                h="50px"
                bg={GRADIENT}
                color="white"
                fontSize="md"
                fontWeight="700"
                borderRadius="12px"
                leftIcon={<Icon as={MdSave} />}
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Đang tạo..."
                _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                boxShadow="0 4px 16px rgba(249,115,22,0.35)"
                transition="all 0.2s"
              >
                Tạo vé thủ công
              </Button>
              <Button
                w="100%"
                h="50px"
                variant="outline"
                borderRadius="12px"
                color={useColorModeValue("#475569", "#cbd5e1")}
                borderColor={cardBorder}
                leftIcon={<Icon as={MdClose} />}
                onClick={() => navigate("/admin/ve-don-hang/ve")}
                _hover={{ bg: softTileBg, borderColor: "#f97316", color: OR }}
                transition="all 0.2s"
              >
                Hủy bỏ
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </>
    </Box>
  );
};

export default TaoVeMoi;