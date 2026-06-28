// views/admin/quanlybanner/components/BannerDetail.jsx

import {
  Box, Text, Button, Flex, SimpleGrid, Icon, useColorModeValue
} from "@chakra-ui/react";
import { 
  MdArrowBack, MdEdit, MdLayers, MdLink, MdSchedule, 
  MdCalendarToday, MdPinDrop, MdPerson, MdAccessTime
} from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { LinkBadge } from "./shared/LinkBadge";
import { fadeIn, shimmer } from "./shared/animations";
import { STATUS_MAP, POSITION_MAP } from "../constants";

export function BannerDetail({ banner, onBack, onEdit }) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
  const subColor = useColorModeValue("#94a3b8", "#4a6080");
  const metaBg = useColorModeValue("#f8fafc", "#091530");
  const metaBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const labelColor = useColorModeValue("#94a3b8", "#4a6080");
  const valColor = useColorModeValue("#0f172a", "#e2e8f0");
  const schedBg = useColorModeValue("#fffbf7", "#1a0f00");
  const schedBorder = useColorModeValue("#fed7aa", "#92400e");
  const schedHead = useColorModeValue("#92400e", "#d97706");
  const noteBg = useColorModeValue("#f8fafc", "#091530");
  const noteText = useColorModeValue("#475569", "#8899b4");
  const btnBg = useColorModeValue("#f8fafc", "#132040");
  const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
  const btnColor = useColorModeValue("#64748b", "#6b7fa3");
  const infoBg = useColorModeValue("#f8fafc", "#091530");
  const infoBorder = useColorModeValue("#f1f5f9", "#1a2744");

  // Lấy dữ liệu từ banner
  const id = banner.BannerId || banner.id;
  const title = banner.Title || banner.title || "";
  const image = banner.ImageUrl || banner.image || "";
  const status = banner.Status || banner.status || "Inactive";
  const linkType = banner.LinkType || banner.linkType || "None";
  const linkTarget = banner.LinkTarget || banner.linkTarget || "";
  const scheduleStart = banner.ScheduleStart || banner.scheduleStart || "";
  const scheduleEnd = banner.ScheduleEnd || banner.scheduleEnd || "";
  const scheduledOn = banner.ScheduledOn !== undefined ? banner.ScheduledOn : (banner.scheduledOn || false);
  const order = banner.order || banner.Order || 0;
  const note = banner.Note || banner.note || "";
  const position = banner.Position || banner.position || "";
  const userId = banner.UserId || banner.userId || "";
  const userName = banner.UserName || banner.userName || "N/A";
  const createdAt = banner.CreatedAt || banner.createdAt || "";
  const updatedAt = banner.UpdatedAt || banner.updatedAt || "";
  const updatedBy = banner.UpdatedBy || banner.updatedBy || "N/A";
  
  const displayStatus = STATUS_MAP[status] || status;
  const displayPosition = POSITION_MAP[position] || position;
  const isActive = status === "Active";

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header - Back + Actions */}
      <Flex align="center" justify="space-between" mb="20px"
        direction={{ base: "column", sm: "row" }} gap="10px"
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={btnColor} borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border={`1.5px solid ${btnBorder}`} _hover={{ bg: useColorModeValue("#f8fafc", "#1a2744") }}
          w={{ base: "100%", sm: "auto" }} onClick={onBack}
        >
          Quay lại danh sách
        </Button>
        <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdEdit} />} w={{ base: "100%", sm: "auto" }} onClick={onEdit}
        >
          Chỉnh sửa banner
        </Button>
      </Flex>

      {/* Main Card - Hero */}
      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 12px rgba(0,0,0,0.1)" overflow="hidden" mb="18px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} 
        />
        
        {/* Banner Image */}
        <Box position="relative" maxH={{ base: "250px", md: "350px" }} overflow="hidden">
          <img 
            src={image} 
            alt={title}
            style={{ width: "100%", objectFit: "cover", display: "block", maxHeight: "350px" }} 
          />
          <Box position="absolute" bottom="0" left="0" right="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.75), transparent)"
            p={{ base: "16px 18px 14px", md: "24px 28px 20px" }}
          >
            <Text fontSize={{ base: "18px", md: "24px" }} fontWeight="800" color="white"
              letterSpacing="-0.3px" mb="10px"
            >
              {title}
            </Text>
            <Flex gap="8px" flexWrap="wrap">
              <StatusBadge status={status} />
              <LinkBadge type={linkType} />
            </Flex>
          </Box>
        </Box>

        {/* Info Grid */}
        <Box p={{ base: "18px", md: "24px" }}>
          {/* Quick Stats - 4 columns */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
            {[
              { icon: MdLayers, label: "Thứ tự", val: `#${order}` },
              { icon: MdLink, label: "Liên kết tới", val: linkTarget || "Không có" },
              { icon: MdSchedule, label: "Hẹn giờ", val: scheduledOn ? "Đang bật" : "Tắt" },
              { icon: MdPinDrop, label: "Vị trí", val: displayPosition || "Chưa xác định" },
            ].map(({ icon: Ic, label, val }) => (
              <Box key={label} p="10px 12px" borderRadius="10px" bg={metaBg} border={`1px solid ${metaBorder}`}>
                <Flex align="center" gap="6px" mb="3px">
                  <Icon as={Ic} boxSize="11px" color="#f97316" />
                  <Text fontSize="9.5px" fontWeight="700" color={labelColor} letterSpacing="0.8px" textTransform="uppercase">
                    {label}
                  </Text>
                </Flex>
                <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color={valColor} noOfLines={2}>
                  {val}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Schedule Info */}
          {scheduleStart && (
            <Box mt="14px" p="12px 16px" borderRadius="12px" bg={schedBg} border={`1px solid ${schedBorder}`}>
              <Text fontSize="10px" fontWeight="800" color={schedHead} letterSpacing="1px" textTransform="uppercase" mb="6px">
                Khung thời gian hiển thị
              </Text>
              <Flex align="center" gap="8px" flexWrap="wrap">
                <Box px="10px" py="4px" borderRadius="7px" bg="#fff7ed" border="1px solid #fcd34d">
                  <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="700" color="#b45309">
                    Bắt đầu: {scheduleStart.replace("T", " ").slice(0, 16)}
                  </Text>
                </Box>
                <Text color={subColor} fontWeight="700">→</Text>
                <Box px="10px" py="4px" borderRadius="7px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="700" color="#dc2626">
                    Kết thúc: {scheduleEnd.replace("T", " ").slice(0, 16)}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Note */}
          {note && (
            <Box mt="14px" p="12px 16px" borderRadius="12px" bg={noteBg} border={`1px solid ${metaBorder}`}>
              <Text fontSize="10px" fontWeight="800" color={labelColor} letterSpacing="1px" textTransform="uppercase" mb="4px">
                Ghi chú nội bộ
              </Text>
              <Text fontSize="13px" color={noteText} lineHeight="1.6">{note}</Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Additional Info - 2 columns */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px">
        {/* Left - Creator Info */}
        <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeIn} 0.3s ease both` }}
        >
          <Flex align="center" gap="8px" mb="12px">
            <Box w="28px" h="28px" borderRadius="8px" bg={metaBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdPerson} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="800" color={labelColor} letterSpacing="0.8px" textTransform="uppercase">
              Thông tin tạo
            </Text>
          </Flex>
          
          <Flex direction="column" gap="10px">
            <Box p="10px 12px" borderRadius="8px" bg={infoBg} border={`1px solid ${infoBorder}`}>
              <Text fontSize="9px" fontWeight="700" color={labelColor} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                Người tạo
              </Text>
              <Text fontSize="13px" fontWeight="600" color={valColor}>{userName}</Text>
            </Box>
            <Box p="10px 12px" borderRadius="8px" bg={infoBg} border={`1px solid ${infoBorder}`}>
              <Text fontSize="9px" fontWeight="700" color={labelColor} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                Ngày tạo
              </Text>
              <Text fontSize="13px" fontWeight="600" color={valColor}>
                {createdAt ? new Date(createdAt).toLocaleString('vi-VN') : "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Right - Updated Info */}
        <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeIn} 0.35s ease both` }}
        >
          <Flex align="center" gap="8px" mb="12px">
            <Box w="28px" h="28px" borderRadius="8px" bg={metaBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdAccessTime} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="800" color={labelColor} letterSpacing="0.8px" textTransform="uppercase">
              Cập nhật gần nhất
            </Text>
          </Flex>
          
          <Flex direction="column" gap="10px">
            <Box p="10px 12px" borderRadius="8px" bg={infoBg} border={`1px solid ${infoBorder}`}>
              <Text fontSize="9px" fontWeight="700" color={labelColor} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                Người cập nhật
              </Text>
              <Text fontSize="13px" fontWeight="600" color={valColor}>{updatedBy}</Text>
            </Box>
            <Box p="10px 12px" borderRadius="8px" bg={infoBg} border={`1px solid ${infoBorder}`}>
              <Text fontSize="9px" fontWeight="700" color={labelColor} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                Ngày cập nhật
              </Text>
              <Text fontSize="13px" fontWeight="600" color={valColor}>
                {updatedAt ? new Date(updatedAt).toLocaleString('vi-VN') : "N/A"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>

      {/* ID Banner - Bottom */}
      <Box mt="14px" bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
        sx={{ animation: `${fadeIn} 0.4s ease both` }}
      >
        <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
          <Flex align="center" gap="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={metaBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdLayers} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="800" color={labelColor} letterSpacing="0.8px" textTransform="uppercase">
              ID Banner
            </Text>
          </Flex>
          <Text fontSize="14px" fontWeight="700" color={valColor} fontFamily="monospace">
            #{id}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}