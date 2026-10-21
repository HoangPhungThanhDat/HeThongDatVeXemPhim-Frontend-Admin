import {
  Box, Flex, Text, Button, Icon, useColorModeValue, Image, Spinner,
} from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete, MdVisibilityOff,
  MdCalendarToday, MdLocalOffer, MdImage,
} from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { StatusBadge } from "./shared/StatusBadge";
import { TypeBadge } from "./shared/TypeBadge";
import { fadeUp } from "./shared/animations";
import { TYPE_CONFIG } from "../constants";

export function KhuyenMaiRow({
  promo, index, onView, onEdit, onToggle, onDelete,
  isUpdating = false,
}) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const textPrimary = useColorModeValue("#0f172a", "#e2e8f0");
  const textSecondary = useColorModeValue("#94a3b8", "#6b7fa3");
  const textMuted = useColorModeValue("#64748b", "#7c8db5");
  const thumbBg = useColorModeValue("#f8fafc", "#0f172a");
  const thumbBorder = useColorModeValue("#e2e8f0", "#2d3a6b");
  const fallbackIcon = useColorModeValue("#cbd5e1", "#4a5568");
  const btnBg = useColorModeValue("#f8fafc", "#0f172a");
  const btnBorder = useColorModeValue("1px solid #e2e8f0", "1px solid #2d3a6b");
  const viewColor = useColorModeValue("#475569", "#94a3b8");
  const viewHoverBg = useColorModeValue("#f1f5f9", "#1b2559");
  const toggleColor = useColorModeValue("#64748b", "#94a3b8");
  const usageTrackBg = useColorModeValue("#f1f5f9", "#0f172a");
  const rowHoverBg = useColorModeValue("#fffbf7", "#1e2d6b");

  // ✅ Cách 2: coi Inactive/Paused/Expired là "đang tắt"
  const status = promo.status || promo.Status || "Inactive";
  const isOff =
    status === "Inactive" ||
    status === "Paused" ||
    status === "Expired";

  const type = promo.discountType || promo.DiscountType || "Percentage";
  const typeCfg = TYPE_CONFIG[type] || TYPE_CONFIG["Percentage"];

  const getImageUrl = () => {
    if (promo.imageUrl) return promo.imageUrl;
    if (promo.ImageUrl) return promo.ImageUrl;
    if (promo.Image) return promo.Image;
    if (promo.image) return promo.image;
    return null;
  };
  const imageUrl = getImageUrl();

  const formatValue = () => {
    const val = promo.discountValue ?? promo.DiscountValue ?? 0;
    if (type === "Percentage") return `Giảm ${val}%`;
    if (type === "FixedAmount") return `Giảm ${Number(val).toLocaleString()}đ`;
    return "Mua 1 Tặng 1";
  };

  const usageCount = promo.usageCount ?? promo.UsageCount ?? 0;
  const usageLimit = promo.usageLimit ?? promo.UsageLimit ?? 0;
  const pct =
    usageLimit > 0
      ? Math.min(100, Math.round((usageCount / usageLimit) * 100))
      : null;
  const pid = promo.id || promo.PromotionId;

  return (
    <Box
      p="14px 18px"
      borderRadius="12px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      transition="all 0.2s"
      opacity={isUpdating ? 0.9 : 1}
      _hover={{
        border: "1.5px solid #f97316",
        boxShadow: "0 2px 12px rgba(249,115,22,0.1)",
        bg: rowHoverBg,
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center" gap="0">
        <Box w="32px" flexShrink="0">
          <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#cbd5e1", "#4a5568")}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>

        <Box
          w="48px" h="48px" borderRadius="10px" flexShrink="0" mr="14px"
          bg={thumbBg} border={`1px solid ${thumbBorder}`}
          overflow="hidden" display="flex" alignItems="center" justifyContent="center"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={promo.title || promo.Title || "Khuyến mãi"}
              w="100%" h="100%" objectFit="cover"
              fallback={<Icon as={MdImage} boxSize="20px" color={fallbackIcon} />}
            />
          ) : (
            <Box
              w="36px" h="36px" borderRadius="10px"
              bg={useColorModeValue(typeCfg.bg, "#0f172a")}
              border={`1px solid ${useColorModeValue(typeCfg.border, "#2d3a6b")}`}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={typeCfg.icon || FaTag} boxSize="15px" color={typeCfg.color} />
            </Box>
          )}
        </Box>

        <Box flex="2.2" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>
            {promo.title || promo.Title}
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
              {promo.applyFor || promo.ApplyFor || "Tất cả"}
            </Text>
          </Flex>
          {promo.applyTarget && (
            <Text fontSize="10px" color={textSecondary} noOfLines={1}>
              {promo.applyTarget}
            </Text>
          )}
        </Box>

        <Box flex="1.4" minW="0" pr="12px">
          <Flex align="center" gap="4px" mb="2px">
            <Icon as={MdCalendarToday} boxSize="10px" color={textSecondary} />
            <Text fontSize="11px" color={textMuted} fontWeight="600">
              {promo.startDate || promo.StartDate || "N/A"}
            </Text>
          </Flex>
          <Text fontSize="10px" color={textSecondary}>
            → {promo.endDate || promo.EndDate || "N/A"}
          </Text>
        </Box>

        <Box flex="1" minW="0" pr="12px">
          <Text fontSize="11px" fontWeight="700" color={textPrimary}>
            {usageCount.toLocaleString()}
            {usageLimit > 0 ? ` / ${usageLimit.toLocaleString()}` : " lượt"}
          </Text>
          {pct !== null && (
            <Box mt="4px" h="4px" borderRadius="full" bg={usageTrackBg} overflow="hidden">
              <Box h="100%" borderRadius="full" w={`${pct}%`}
                bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                transition="width 0.3s ease"
              />
            </Box>
          )}
        </Box>

        <Box flex="1" minW="0" pr="12px">
          <StatusBadge status={status} />
        </Box>

        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={btnBg} color={viewColor} border={btnBorder}
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: viewHoverBg, color: textPrimary }}
            transition="all 0.15s"
            onClick={() => onView(promo)}
            isDisabled={isUpdating}
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
            isDisabled={isUpdating}
          >
            Sửa
          </Button>

          {/* ✅ Nút Bật/Dừng có Spinner */}
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={btnBg}
            color={isOff ? "#059669" : toggleColor}
            border={btnBorder}
            fontSize="11.5px" fontWeight="600"
            leftIcon={
              isUpdating
                ? <Spinner size="xs" color="#f97316" thickness="2px" />
                : <Icon as={isOff ? MdVisibility : MdVisibilityOff} boxSize="12px" />
            }
            _hover={isOff
              ? { bg: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }
              : { bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            transition="all 0.15s"
            onClick={() => onToggle(pid)}
            isDisabled={isUpdating}
            opacity={isUpdating ? 0.75 : 1}
            cursor={isUpdating ? "wait" : "pointer"}
          >
            {isUpdating ? "Đang lưu..." : isOff ? "Bật" : "Dừng"}
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
            isDisabled={isUpdating}
          >
            Xóa
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}