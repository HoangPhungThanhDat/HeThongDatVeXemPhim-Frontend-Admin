

import React from "react";
import {
  Box, Text, Grid, Input, Select, Button, Flex, Icon,
  FormLabel, FormControl,
} from "@chakra-ui/react";
import {
  MdLocalMovies, MdMeetingRoom, MdStar, MdSchedule,
  MdClose,
} from "react-icons/md";
import { FaTicketAlt, FaClock, FaFilm, FaDoorOpen, FaSave, FaTimes } from "react-icons/fa";
import { ModalShell } from "./ModalShell";
import { ModalLeftPanel } from "./ModalLeftPanel";
import { SectionTitle } from "./shared/SectionTitle";
import { FormField, inputStyle } from "./FormField";
import { StatusPill } from "./StatusPill";
import { fadeUp, fadeIn } from "./shared/animations";

export const AddModal = ({ 
  isOpen, 
  onClose, 
  value, 
  onChange, 
  onAdd, 
  isDark,
  movies = [],
  rooms = [],
}) => {
  const canAdd = value.movieId && value.roomId && value.startTime && value.endTime && value.price;
  const styles = inputStyle(isDark);

  const preview = [
    { icon: MdLocalMovies, label: "Tên phim", val: movies.find(m => m.MovieId === Number(value.movieId))?.Title || "Chưa chọn" },
    { icon: MdMeetingRoom, label: "Phòng", val: rooms.find(r => r.RoomId === Number(value.roomId))?.Name || "Chưa chọn" },
    { icon: FaClock, label: "Bắt đầu", val: value.startTime?.replace('T', ' ') || "Chưa chọn" },
    { icon: MdSchedule, label: "Kết thúc", val: value.endTime?.replace('T', ' ') || "Chưa chọn" },
    { icon: FaTicketAlt, label: "Giá vé", val: value.price ? `${Number(value.price).toLocaleString('vi-VN')}đ` : "Chưa nhập" },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      isDark={isDark}
      leftPanel={
        <ModalLeftPanel
          title="Thêm suất chiếu mới"
          subtitle="Điền đầy đủ thông tin để tạo suất chiếu phim mới"
          previewData={preview}
        />
      }
      footer={
        <Flex gap="10px">
          <Button
            h="44px"
            px="22px"
            variant="ghost"
            color={isDark ? "#a0aec0" : "#64748b"}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc", borderColor: isDark ? "#718096" : "#cbd5e1" }}
            transition="all 0.2s"
            onClick={onClose}
            leftIcon={<Icon as={FaTimes} />}
          >
            Hủy bỏ
          </Button>
          <Button
            flex="1"
            h="44px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg={canAdd
              ? "linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
              : isDark ? "#4a5568" : "#e2e8f0"
            }
            color={canAdd ? "#ffffff" : isDark ? "#718096" : "#94a3b8"}
            boxShadow={canAdd ? "0 4px 16px rgba(249,115,22,0.35)" : "none"}
            _hover={canAdd ? {
              boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
              transform: "translateY(-1px)"
            } : {}}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            isDisabled={!canAdd}
            leftIcon={<Icon as={FaSave} />}
            onClick={onAdd}
          >
            Lưu suất chiếu
          </Button>
        </Flex>
      }
    >
      <Box mb="22px" sx={{ animation: `${fadeUp} 0.35s ease both` }}>
        <Text fontSize="18px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} letterSpacing="-0.3px">
          Thông tin suất chiếu
        </Text>
        <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"} mt="3px">
          Các trường có dấu <Text as="span" color="#f97316">*</Text> là bắt buộc
        </Text>
      </Box>

      {/* Phim */}
      <SectionTitle label="Thông tin phim & Phòng" isDark={isDark} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px" mb="18px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.06s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={FaFilm} boxSize="12px" color="#f97316" />
            Phim được chiếu <Text as="span" color="#f97316">*</Text>
          </FormLabel>
          <Select
            {...styles}
            placeholder="-- Chọn phim --"
            value={value.movieId}
            onChange={e => onChange({ ...value, movieId: e.target.value })}
          >
            <option value="">-- Chọn phim --</option>
            {movies.map(m => (
              <option key={m.MovieId} value={m.MovieId}>{m.Title}</option>
            ))}
          </Select>
        </Box>

        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.08s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={FaDoorOpen} boxSize="12px" color="#f97316" />
            Phòng chiếu <Text as="span" color="#f97316">*</Text>
          </FormLabel>
          <Select
            {...styles}
            placeholder="-- Chọn phòng --"
            value={value.roomId}
            onChange={e => onChange({ ...value, roomId: e.target.value })}
          >
            <option value="">-- Chọn phòng --</option>
            {rooms.map(r => (
              <option key={r.RoomId} value={r.RoomId}>{r.Name}</option>
            ))}
          </Select>
        </Box>
      </Grid>

      {/* Thời gian */}
      <SectionTitle label="Thời gian chiếu" isDark={isDark} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px" mb="18px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={FaClock} boxSize="12px" color="#f97316" />
            Giờ bắt đầu <Text as="span" color="#f97316">*</Text>
          </FormLabel>
          <Input
            {...styles}
            type="datetime-local"
            value={value.startTime}
            onChange={e => onChange({ ...value, startTime: e.target.value })}
          />
        </Box>

        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={MdSchedule} boxSize="12px" color="#f97316" />
            Giờ kết thúc <Text as="span" color="#f97316">*</Text>
          </FormLabel>
          <Input
            {...styles}
            type="datetime-local"
            value={value.endTime}
            onChange={e => onChange({ ...value, endTime: e.target.value })}
          />
        </Box>
      </Grid>

      {/* Giá vé & Trạng thái */}
      <SectionTitle label="Giá vé & Trạng thái" isDark={isDark} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.14s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={FaTicketAlt} boxSize="12px" color="#f97316" />
            Giá vé cơ bản <Text as="span" color="#f97316">*</Text>
          </FormLabel>
          <Input
            {...styles}
            type="number"
            placeholder="Nhập giá vé"
            value={value.price}
            onChange={e => onChange({ ...value, price: e.target.value })}
          />
          {value.price && (
            <Text fontSize="11px" color={isDark ? "#718096" : "#9ca3af"} mt="1">
              <Icon as={FaTicketAlt} boxSize="10px" mr="1" />
              {Number(value.price).toLocaleString('vi-VN')} VNĐ
            </Text>
          )}
        </Box>

        <Box sx={{ animation: `${fadeUp} 0.4s ease 0.16s both` }}>
          <FormLabel
            fontSize="12px"
            fontWeight="700"
            color={isDark ? "#a0aec0" : "#374151"}
            mb="6px"
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <Icon as={MdStar} boxSize="12px" color="#f97316" />
            Trạng thái suất chiếu
          </FormLabel>
          <Select
            {...styles}
            value={value.status || "Scheduled"}
            onChange={e => onChange({ ...value, status: e.target.value })}
          >
            <option value="Scheduled">✅ Đã lên lịch</option>
            <option value="Cancelled">⛔ Đã hủy</option>
            <option value="Finished">✅ Đã kết thúc</option>
          </Select>
        </Box>
      </Grid>

      {/* Preview trạng thái */}
      {value.status && (
        <Box
          mt="18px"
          p="14px 18px"
          borderRadius="10px"
          bg={isDark ? "#2d3748" : "linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)"}
          border={isDark ? "1.5px solid #4a5568" : "1.5px solid #fed7aa"}
          sx={{ animation: `${fadeIn} 0.3s ease both` }}
        >
          <Flex align="center" justify="space-between">
            <Text
              fontSize="10.5px"
              color={isDark ? "#fbd38d" : "#92400e"}
              fontWeight="700"
              letterSpacing="0.5px"
            >
              TRẠNG THÁI HIỆN TẠI
            </Text>
            <StatusPill status={value.status} size="sm" />
          </Flex>
        </Box>
      )}
    </ModalShell>
  );
};