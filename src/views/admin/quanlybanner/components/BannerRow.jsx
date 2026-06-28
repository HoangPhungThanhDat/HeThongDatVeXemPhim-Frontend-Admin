// views/admin/quanlybanner/components/BannerRow.jsx

import { 
    Box, Flex, Text, Button, Icon, Switch, useColorModeValue 
  } from "@chakra-ui/react";
  import { 
    MdDragIndicator, MdVisibility, MdEdit, MdVisibilityOff, 
    MdDeleteForever, MdArrowUpward, MdArrowDownward,
  } from "react-icons/md";
  import { FaRegClock } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { LinkBadge } from "./shared/LinkBadge";
  import { fadeUp } from "./shared/animations";
  import { BannerCard } from "./BannerCard";
  import { STATUS_MAP } from "../constants";
  
  export function BannerRow({
    banner, index, onView, onEdit, onHide, onDelete, 
    onMoveUp, onMoveDown, isFirst, isLast,
    onDragStart, onDragOver, onDrop, onDragEnd,
  }) {
    // Lấy các field từ API (có thể là BannerId hoặc id, Title hoặc title, ImageUrl hoặc image...)
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
  
    const rowBg = useColorModeValue("white", "#0b1437");
    const rowBorder = useColorModeValue("#f1f5f9", "#1a2744");
    const rowHoverBg = useColorModeValue("#fffbf7", "#0d1f4a");
    const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
    const subColor = useColorModeValue("#94a3b8", "#4a6080");
    const schedColor = useColorModeValue("#475569", "#8899b4");
    const btnBg = useColorModeValue("#f8fafc", "#132040");
    const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
    const btnColor = useColorModeValue("#94a3b8", "#4a6080");
    const orderBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
    const orderBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");
    const thumbBorder = useColorModeValue("#f1f5f9", "#1a2744");
  
    // Hiển thị trạng thái cho người dùng
    const displayStatus = STATUS_MAP[status] || status;
  
    return (
      <>
        <Box display={{ base: "none", lg: "block" }}>
          <Box 
            p="12px 16px" 
            borderRadius="12px" 
            bg={rowBg}
            border={`1.5px solid ${rowBorder}`} 
            transition="all 0.2s"
            _hover={{ 
              border: "1.5px solid #f97316", 
              boxShadow: "0 2px 12px rgba(249,115,22,0.12)", 
              bg: rowHoverBg 
            }}
            sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
            draggable
            onDragStart={() => onDragStart(id)}
            onDragOver={(e) => onDragOver(e, id)}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          >
            <Flex align="center" gap="0">
              <Box w="24px" flexShrink="0" cursor="grab" color={btnColor}
                _hover={{ color: "#f97316" }} transition="color 0.15s"
              >
                <Icon as={MdDragIndicator} boxSize="16px" />
              </Box>
  
              <Box w="32px" flexShrink="0" mr="4px">
                <Box 
                  w="22px" h="22px" borderRadius="6px" bg={orderBg} border={`1px solid ${orderBorder}`}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="11px" fontWeight="800" color="#f97316">{order}</Text>
                </Box>
              </Box>
  
              <Box w="80px" h="46px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px"
                border={`1px solid ${thumbBorder}`}
              >
                <img 
                  src={image} 
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </Box>
  
              <Box flex="2.5" minW="0" pr="12px">
                <Text fontSize="13.5px" fontWeight="700" color={titleColor} noOfLines={1}>
                  {title}
                </Text>
                <Flex align="center" gap="6px" mt="3px">
                  <LinkBadge type={linkType} />
                  {linkTarget && (
                    <Text fontSize="11px" color={subColor} noOfLines={1}>
                      {linkTarget}
                    </Text>
                  )}
                </Flex>
              </Box>
  
              <Box flex="1.5" minW="0" pr="12px">
                {scheduleStart ? (
                  <>
                    <Flex align="center" gap="4px" mb="2px">
                      <Icon as={FaRegClock} boxSize="10px" color="#f97316" />
                      <Text fontSize="11px" fontWeight="600" color={schedColor}>
                        {scheduleStart.replace("T", " ").slice(0, 16)}
                      </Text>
                    </Flex>
                    <Text fontSize="10px" color={subColor}>
                      → {scheduleEnd.replace("T", " ").slice(0, 16)}
                    </Text>
                  </>
                ) : (
                  <Text fontSize="11px" color={subColor}>Không hẹn giờ</Text>
                )}
              </Box>
  
              <Box flex="0.7" minW="0" pr="12px">
                <Flex align="center" gap="5px">
                  <Switch isChecked={scheduledOn} size="sm" colorScheme="orange" isReadOnly />
                  <Text 
                    fontSize="11px" 
                    color={scheduledOn ? "#f97316" : subColor} 
                    fontWeight="600"
                  >
                    {scheduledOn ? "Bật" : "Tắt"}
                  </Text>
                </Flex>
              </Box>
  
              <Box flex="0.9" minW="0" pr="12px">
                <StatusBadge status={status} />
              </Box>
  
              <Flex gap="3px" mr="8px" flexShrink="0">
                {[MdArrowUpward, MdArrowDownward].map((Ic, i) => (
                  <Button 
                    key={i} 
                    size="xs" h="26px" w="26px" p="0" borderRadius="6px"
                    bg={btnBg} border={`1px solid ${btnBorder}`} color={btnColor}
                    _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
                    isDisabled={i === 0 ? isFirst : isLast} 
                    transition="all 0.15s"
                    onClick={() => i === 0 ? onMoveUp() : onMoveDown()}
                  >
                    <Icon as={Ic} boxSize="12px" />
                  </Button>
                ))}
              </Flex>
  
              <Flex gap="6px" flexShrink="0">
                <ActionButtons 
                  banner={banner} 
                  onView={onView} 
                  onEdit={onEdit} 
                  onHide={onHide} 
                  onDelete={onDelete}
                />
              </Flex>
            </Flex>
          </Box>
        </Box>
        <Box display={{ base: "block", lg: "none" }}>
          <BannerCard 
            banner={banner} 
            index={index}
            onView={onView} 
            onEdit={onEdit} 
            onHide={onHide} 
            onDelete={onDelete}
            onMoveUp={onMoveUp} 
            onMoveDown={onMoveDown}
            isFirst={isFirst} 
            isLast={isLast}
          />
        </Box>
      </>
    );
  }
  
  // Action Buttons component
  function ActionButtons({ banner, onView, onEdit, onHide, onDelete }) {
    const btnBg = useColorModeValue("#f8fafc", "#132040");
    const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
    const id = banner.BannerId || banner.id;
  
    return (
      <>
        <Button 
          size="xs" h="30px" px="10px" borderRadius="8px"
          bg={btnBg} color={useColorModeValue("#475569", "#8899b4")} 
          border={`1px solid ${btnBorder}`}
          fontSize="11.5px" fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ 
            bg: useColorModeValue("#f1f5f9", "#1a2744"), 
            color: useColorModeValue("#0f172a", "#e2e8f0") 
          }}
          transition="all 0.15s" 
          onClick={onView}
        >
          Xem
        </Button>
        <Button 
          size="xs" h="30px" px="10px" borderRadius="8px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" fontSize="11.5px" fontWeight="600"
          leftIcon={<Icon as={MdEdit} boxSize="12px" />}
          _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
          boxShadow="0 2px 8px rgba(249,115,22,0.3)" 
          transition="all 0.15s"
          onClick={onEdit}
        >
          Sửa
        </Button>
        <Button 
          size="xs" h="30px" px="10px" borderRadius="8px"
          bg={btnBg} color={useColorModeValue("#64748b", "#6b7fa3")} 
          border={`1px solid ${btnBorder}`}
          fontSize="11.5px" fontWeight="600"
          leftIcon={<Icon as={MdVisibilityOff} boxSize="12px" />}
          _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
          transition="all 0.15s" 
          onClick={onHide}
        >
          Ẩn
        </Button>
        <Button 
          size="xs" h="30px" px="10px" borderRadius="8px"
          bg={btnBg} color="#dc2626" border="1px solid #fecaca"
          fontSize="11.5px" fontWeight="600"
          leftIcon={<Icon as={MdDeleteForever} boxSize="12px" />}
          _hover={{ bg: "#fef2f2", color: "#b91c1c", border: "1px solid #f87171" }}
          transition="all 0.15s" 
          onClick={onDelete}
        >
          Xóa
        </Button>
      </>
    );
  }