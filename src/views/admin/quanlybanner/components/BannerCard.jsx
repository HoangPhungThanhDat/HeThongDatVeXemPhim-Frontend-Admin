// views/admin/quanlybanner/components/BannerCard.jsx

import { 
    Box, Flex, Text, Button, Icon, Switch, useColorModeValue 
  } from "@chakra-ui/react";
  import { 
    MdVisibility, MdEdit, MdVisibilityOff, MdDeleteForever, 
    MdArrowUpward, MdArrowDownward 
  } from "react-icons/md";
  import { FaRegClock } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { LinkBadge } from "./shared/LinkBadge";
  import { fadeUp } from "./shared/animations";
  
  export function BannerCard({
    banner, index, onView, onEdit, onHide, onDelete,
    onMoveUp, onMoveDown, isFirst, isLast,
  }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
    const linkColor = useColorModeValue("#64748b", "#8899b4");
    const subColor = useColorModeValue("#94a3b8", "#4a6080");
    const divider = useColorModeValue("#f8fafc", "#132040");
    const btnBg = useColorModeValue("#f8fafc", "#132040");
    const btnBorder = useColorModeValue("#e2e8f0", "#1e3a5f");
    const btnColor = useColorModeValue("#94a3b8", "#4a6080");
  
    return (
      <Box 
        borderRadius="14px" 
        bg={cardBg} 
        border={`1.5px solid ${cardBorder}`}
        overflow="hidden" 
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: "0 2px 12px rgba(249,115,22,0.12)" 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Box position="relative" h="130px" overflow="hidden">
          <img 
            src={banner.image} 
            alt={banner.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
          />
          <Box 
            position="absolute" 
            inset="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)"
          />
          <Box 
            position="absolute" 
            top="8px" 
            left="10px"
            w="24px" 
            h="24px" 
            borderRadius="7px" 
            bg="rgba(249,115,22,0.9)"
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            boxShadow="0 2px 6px rgba(0,0,0,0.25)"
          >
            <Text fontSize="11px" fontWeight="800" color="white">{banner.order}</Text>
          </Box>
          <Box position="absolute" top="8px" right="10px">
            <StatusBadge status={banner.status} />
          </Box>
          <Box position="absolute" bottom="0" left="0" right="0" px="12px" pb="10px">
            <Text fontSize="13.5px" fontWeight="700" color="white" noOfLines={1}>
              {banner.title}
            </Text>
          </Box>
        </Box>
  
        <Box px="12px" pt="10px" pb="4px">
          <Flex align="center" gap="6px" flexWrap="wrap">
            <LinkBadge type={banner.linkType} />
            {banner.linkTarget && (
              <Text fontSize="11px" color={linkColor} fontWeight="500" noOfLines={1} flex="1" minW="0">
                {banner.linkTarget}
              </Text>
            )}
          </Flex>
          {banner.scheduleStart && (
            <Flex align="center" gap="5px" mt="7px">
              <Icon as={FaRegClock} boxSize="10px" color="#f97316" />
              <Text fontSize="10.5px" color={linkColor} fontWeight="500">
                {banner.scheduleStart.replace("T", " ").slice(0, 16)}
                <Text as="span" color={subColor}> → </Text>
                {banner.scheduleEnd.replace("T", " ").slice(0, 16)}
              </Text>
            </Flex>
          )}
          <Flex align="center" gap="6px" mt="7px">
            <Text fontSize="10.5px" color={subColor} fontWeight="500">Hẹn giờ:</Text>
            <Switch isChecked={banner.scheduledOn} size="sm" colorScheme="orange" isReadOnly />
            <Text 
              fontSize="10.5px" 
              color={banner.scheduledOn ? "#f97316" : subColor} 
              fontWeight="600"
            >
              {banner.scheduledOn ? "Bật" : "Tắt"}
            </Text>
          </Flex>
        </Box>
  
        <Flex px="10px" py="10px" gap="6px" borderTop={`1px solid ${divider}`} mt="6px" flexWrap="wrap">
          {[MdArrowUpward, MdArrowDownward].map((Ic, i) => (
            <Button 
              key={i} 
              size="xs" h="32px" w="32px" p="0" borderRadius="8px"
              bg={btnBg} border={`1px solid ${btnBorder}`} color={btnColor}
              _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
              isDisabled={i === 0 ? isFirst : isLast} 
              transition="all 0.15s"
              onClick={() => i === 0 ? onMoveUp(banner.id) : onMoveDown(banner.id)}
            >
              <Icon as={Ic} boxSize="13px" />
            </Button>
          ))}
          <Box flex="1" />
          {[
            { icon: MdVisibility, label: "Xem", onClick: () => onView(banner) },
            { icon: MdEdit, label: "Sửa", onClick: () => onEdit(banner), primary: true },
            { icon: MdVisibilityOff, label: "Ẩn", onClick: () => onHide(banner.id), danger: true },
            { icon: MdDeleteForever, label: "Xóa", onClick: () => onDelete(banner), danger: true },
          ].map((btn, i) => (
            <Button 
              key={i}
              size="xs" h="32px" px="10px" borderRadius="8px"
              bg={btn.primary ? "linear-gradient(135deg, #f97316, #fb923c)" : btnBg}
              color={btn.primary ? "white" : btn.danger ? "#dc2626" : useColorModeValue("#475569", "#8899b4")}
              border={!btn.primary ? `1px solid ${btnBorder}` : "none"}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={btn.icon} boxSize="12px" />}
              _hover={btn.primary ? { opacity: 0.88 } : { bg: btn.danger ? "#fef2f2" : useColorModeValue("#f1f5f9", "#1a2744") }}
              boxShadow={btn.primary ? "0 2px 8px rgba(249,115,22,0.3)" : "none"}
              transition="all 0.15s" 
              onClick={btn.onClick}
            >
              {btn.label}
            </Button>
          ))}
        </Flex>
      </Box>
    );
  }