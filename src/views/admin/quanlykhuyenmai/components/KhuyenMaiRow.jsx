// views/admin/quanlykhuyenmai/components/KhuyenMaiRow.jsx

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDelete, MdVisibilityOff, MdCalendarToday, MdLocalOffer } from "react-icons/md";
  import { FaTag } from "react-icons/fa";  // <-- Thêm dòng này
  import { StatusBadge } from "./shared/StatusBadge";
  import { TypeBadge } from "./shared/TypeBadge";
  import { fadeUp } from "./shared/animations";
  import { TYPE_CONFIG, TYPE_MAP } from "../constants";
  
  export function KhuyenMaiRow({ 
    promo, index, onView, onEdit, onToggle, onDelete, isDark 
  }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
    const textPrimary = useColorModeValue("#0f172a", "#e2e8f0");
    const textSecondary = useColorModeValue("#94a3b8", "#6b7fa3");
    const textMuted = useColorModeValue("#64748b", "#7c8db5");
  
    const type = promo.DiscountType || promo.discountType || "Percentage";
    const typeCfg = TYPE_CONFIG[type] || TYPE_CONFIG["Percentage"];
    const typeLabel = TYPE_MAP[type] || type;
  
    const formatValue = () => {
      const val = promo.DiscountValue || promo.discountValue || 0;
      if (type === "Percentage") return `Giảm ${val}%`;
      if (type === "FixedAmount") return `Giảm ${Number(val).toLocaleString()}đ`;
      return "Mua 1 Tặng 1";
    };
  
    const usageCount = promo.UsageCount || promo.usageCount || 0;
    const usageLimit = promo.UsageLimit || promo.usageLimit || 0;
    const pct = usageLimit > 0 ? Math.min(100, Math.round((usageCount / usageLimit) * 100)) : null;
  
    return (
      <Box 
        p="14px 18px" 
        borderRadius="12px"
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: "0 2px 12px rgba(249,115,22,0.1)", 
          bg: useColorModeValue("#fffbf7", "#1e2d6b")
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center" gap="0">
          <Box w="32px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#cbd5e1", "#4a5568")}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
          
          <Box w="36px" h="36px" borderRadius="10px" flexShrink="0" mr="14px"
            bg={useColorModeValue(typeCfg.bg, "#0f172a")}
            border={`1px solid ${useColorModeValue(typeCfg.border, "#2d3a6b")}`}
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={typeCfg.icon || FaTag} boxSize="15px" color={typeCfg.color} />
          </Box>
          
          <Box flex="2.2" minW="0" pr="12px">
            <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>
              {promo.Title || promo.title}
            </Text>
            <Flex gap="6px" mt="3px" align="center">
              <TypeBadge type={type} />
              <Text fontSize="11.5px" fontWeight="700" color="#f97316">
                {formatValue()}
              </Text>
            </Flex>
          </Box>
          
          <Box flex="1.2" minW="0" pr="12px">
            <Flex align="center" gap="4px" mb="2px">
              <Icon as={MdLocalOffer} boxSize="11px" color={textSecondary} />
              <Text fontSize="11px" fontWeight="600" color={textMuted}>
                {promo.ApplyFor || promo.applyFor || "Tất cả"}
              </Text>
            </Flex>
            {promo.ApplyTarget && (
              <Text fontSize="10px" color={textSecondary} noOfLines={1}>
                {promo.ApplyTarget}
              </Text>
            )}
          </Box>
          
          <Box flex="1.4" minW="0" pr="12px">
            <Flex align="center" gap="4px" mb="2px">
              <Icon as={MdCalendarToday} boxSize="10px" color={textSecondary} />
              <Text fontSize="11px" color={textMuted} fontWeight="600">
                {promo.StartDate || promo.startDate || "N/A"}
              </Text>
            </Flex>
            <Text fontSize="10px" color={textSecondary}>
              → {promo.EndDate || promo.endDate || "N/A"}
            </Text>
          </Box>
          
          <Box flex="1" minW="0" pr="12px">
            <Text fontSize="11px" fontWeight="700" color={textPrimary}>
              {usageCount.toLocaleString()}
              {usageLimit > 0 ? ` / ${usageLimit.toLocaleString()}` : " lượt"}
            </Text>
            {pct !== null && (
              <Box mt="4px" h="4px" borderRadius="full" bg={useColorModeValue("#f1f5f9", "#0f172a")} overflow="hidden">
                <Box h="100%" borderRadius="full" w={`${pct}%`}
                  bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                  transition="width 0.3s ease"
                />
              </Box>
            )}
          </Box>
          
          <Box flex="1" minW="0" pr="12px">
            <StatusBadge status={promo.Status || promo.status || "Inactive"} />
          </Box>
          
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={useColorModeValue("#f8fafc", "#0f172a")}
              color={useColorModeValue("#475569", "#94a3b8")}
              border={useColorModeValue("1px solid #e2e8f0", "1px solid #2d3a6b")}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: useColorModeValue("#f1f5f9", "#1b2559"), color: textPrimary }} 
              transition="all 0.15s"
              onClick={() => onView(promo)}
            >
              Xem
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" 
              transition="all 0.15s"
              onClick={() => onEdit(promo)}
            >
              Sửa
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={useColorModeValue("#f8fafc", "#0f172a")}
              color={useColorModeValue("#64748b", "#94a3b8")}
              border={useColorModeValue("1px solid #e2e8f0", "1px solid #2d3a6b")}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={promo.Status === "Paused" ? MdVisibility : MdVisibilityOff} boxSize="12px" />}
              _hover={promo.Status === "Paused"
                ? { bg: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }
                : { bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
              transition="all 0.15s"
              onClick={() => onToggle(promo.PromotionId || promo.id)}
            >
              {promo.Status === "Paused" ? "Bật" : "Dừng"}
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={useColorModeValue("#fff5f5", "#2d0a0a")}
              color="#ef4444"
              border="1px solid #fca5a5"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdDelete} boxSize="12px" />}
              _hover={{ bg: "#fef2f2", border: "1px solid #ef4444", boxShadow: "0 2px 8px rgba(239,68,68,0.2)", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(promo)}
            >
              Xóa
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  }